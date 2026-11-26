/* ── Kurs live: Präsentation und Leitstand der Kursleitung synchron ──
 *
 * Rollen
 * - leitung:    der Präsentationsmodus am Beamer. Einzige Quelle des Stands (Folie, Schritt, Ansage).
 * - leitstand:  Tablet/Handy der Kursleitung. Liest den Stand, schickt Befehle an die Leitung.
 *
 * Teilnehmende sind seit 26.11.2026 nicht mehr verbunden: Live-Beitritt (/live) und „Folgen“
 * liefen im Workshop unzuverlässig und sind entfernt. Teilnehmende blättern die Folien selbst;
 * wo sie im Kurs stehen, zeigt die Fahrplanleiste (src/components/kurs/live/FahrplanLeiste.tsx).
 * Spec: docs/specs/2026-11-26-kurs-orientierung.md
 *
 * Transporte (beide gleichzeitig, Nachrichten werden über `ts` entdoppelt)
 * - Supabase Realtime: Kanal `kurs-live:<CODE>` (Presence: Stand der Leitung, damit ein später
 *   geöffneter Leitstand ihn sofort hat) und geheimer Steuerkanal `kurs-steuer:<CODE>:<TOKEN>`
 *   (Broadcast) für Leitstand → Leitung.
 * - BroadcastChannel: dieselben Nachrichten zwischen Fenstern desselben Browsers, auch offline
 *   (z. B. Beamer-Fenster und Leitstand-Fenster auf dem Kurs-Laptop).
 *
 * Code: fest (KURS_CODE aus fahrplan.json). Befehle an die Präsentation gehen nur über den
 * Steuerkanal mit Token, der allein im Leitstand-Link steht.
 * Es werden keine personenbezogenen Daten übertragen.
 * Spec (Ursprung): docs/specs/2026-11-22-kurs-fahrplan-live.md
 */
import { useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { LS_KEYS } from "@/lib/constants";
import { KURS_CODE, stationFuerFolie } from "@/data/kurs/fahrplan";

export type LiveRolle = "leitung" | "leitstand";
export type Verbindung = "aus" | "verbinde" | "live" | "lokal";

export interface Ansage {
  text: string;
  /** Uhrzeit „14:30“, bis wann die Ansage gilt (nur Anzeige). */
  bis?: string;
}

export interface LiveStand {
  folie: number;
  schritt: number;
  /** "app": die Leitung zeigt gerade eine Seite der App (Demo, Animation, Übung). */
  modus: "folie" | "app";
  pfad?: string;
  station: string;
  /** Zeitpunkt (ms), seit dem die Station läuft. */
  stationSeit: number;
  ansage?: Ansage | null;
  /** Beamer schwarz. */
  dunkel?: boolean;
  ts: number;
}

export type Befehl =
  | { cmd: "weiter" }
  | { cmd: "zurueck" }
  | { cmd: "gehe"; folie: number; schritt?: number }
  | { cmd: "ansage"; ansage: Ansage | null }
  | { cmd: "dunkel"; an: boolean }
  | { cmd: "zur-folie" };

export interface LiveZustand {
  code: string | null;
  rolle: LiveRolle | null;
  token: string | null;
  verbindung: Verbindung;
  stand: LiveStand | null;
}

/* ───────────── Speicher ───────────── */

interface Gespeichert {
  code: string;
  rolle: LiveRolle;
  token?: string | null;
  stand?: LiveStand | null;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const zufall = (n: number) =>
  Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => ALPHABET[x % ALPHABET.length]).join("");

export const normiereCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);

/* Je Rolle ein eigener Eintrag: Beamer-Fenster und Leitstand-Fenster im selben Browser
 * dürfen sich nicht gegenseitig überschreiben. */
const schluessel = (rolle: LiveRolle) => `${LS_KEYS.KURS_LIVE}:${rolle}`;

function lesen(rolle: LiveRolle): Gespeichert | null {
  try {
    const roh = localStorage.getItem(schluessel(rolle));
    return roh ? (JSON.parse(roh) as Gespeichert) : null;
  } catch {
    return null;
  }
}

function speichern(rolle: LiveRolle | null = z.rolle) {
  if (!rolle) return;
  try {
    if (!z.code || !z.rolle) localStorage.removeItem(schluessel(rolle));
    else
      localStorage.setItem(
        schluessel(rolle),
        JSON.stringify({ code: z.code, rolle: z.rolle, token: z.token, stand: z.rolle === "leitung" ? z.stand : null }),
      );
  } catch {
    /* privater Modus: dann eben ohne Wiederaufnahme */
  }
}

/* Alte Teilnehmer-Sitzungen (bis 26.11.2026) nicht mehr wiederaufnehmen. */
try {
  localStorage.removeItem(`${LS_KEYS.KURS_LIVE}:teilnehmer`);
} catch {
  /* ohne Speicher nichts zu tun */
}

/* ───────────── Store ───────────── */

let z: LiveZustand = { code: null, rolle: null, token: null, verbindung: "aus", stand: null };
const hoerer = new Set<() => void>();
const setze = (teil: Partial<LiveZustand>) => {
  z = { ...z, ...teil };
  hoerer.forEach((h) => h());
};

let kanal: RealtimeChannel | null = null;
let steuer: RealtimeChannel | null = null;
let bc: BroadcastChannel | null = null;
let befehlHandler: ((b: Befehl) => void) | null = null;
let letzterBefehl = 0;
const clientId = zufall(10);

function standUebernehmen(s: LiveStand | null | undefined) {
  if (!s || z.rolle === "leitung") return;
  if (z.stand && z.stand.ts >= s.ts) return;
  setze({ stand: s });
}

function befehlEmpfangen(b: Befehl & { ts?: number; token?: string }) {
  if (z.rolle !== "leitung" || b.token !== z.token) return;
  if (b.ts && b.ts <= letzterBefehl) return;
  letzterBefehl = b.ts ?? Date.now();
  befehlHandler?.(b);
}

async function verbinden() {
  trennen();
  const { code, rolle, token } = z;
  if (!code || !rolle) return;
  setze({ verbindung: "verbinde" });

  // 1) Fenster im selben Browser
  if (typeof BroadcastChannel !== "undefined") {
    bc = new BroadcastChannel(`kurs-live-${code}`);
    bc.onmessage = (e) => {
      const m = e.data;
      if (m?.art === "stand") standUebernehmen(m.stand);
      else if (m?.art === "hallo" && z.rolle === "leitung" && z.stand) bc?.postMessage({ art: "stand", stand: z.stand });
      else if (m?.art === "befehl") befehlEmpfangen(m.befehl);
    };
    if (rolle !== "leitung") bc.postMessage({ art: "hallo" });
  }

  // 2) Supabase Realtime (Leitstand auf einem anderen Gerät)
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    if (z.code !== code) return; // inzwischen gewechselt
    kanal = supabase.channel(`kurs-live:${code}`, { config: { presence: { key: clientId }, broadcast: { self: false } } });
    // Jeder Klick kommt per Broadcast (schnell); Presence trägt den Stand für einen spät geöffneten Leitstand.
    kanal.on("broadcast", { event: "stand" }, ({ payload }) => standUebernehmen(payload as LiveStand));
    kanal.on("presence", { event: "sync" }, () => {
      const alle = Object.values(kanal?.presenceState() ?? {}).flat() as unknown as { rolle?: string; stand?: LiveStand }[];
      const leitung = alle.filter((p) => p.rolle === "leitung" && p.stand).sort((a, b) => b.stand!.ts - a.stand!.ts)[0];
      standUebernehmen(leitung?.stand);
    });
    kanal.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setze({ verbindung: "live" });
        await kanal?.track(rolle === "leitung" ? { rolle, stand: z.stand } : { rolle });
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setze({ verbindung: bc ? "lokal" : "aus" });
      }
    });
    if (token) {
      steuer = supabase.channel(`kurs-steuer:${code}:${token}`, { config: { broadcast: { self: false } } });
      steuer.on("broadcast", { event: "befehl" }, ({ payload }) => befehlEmpfangen(payload as Befehl & { token: string }));
      steuer.subscribe();
    }
  } catch {
    setze({ verbindung: bc ? "lokal" : "aus" });
  }
}

function trennen() {
  bc?.close();
  bc = null;
  const k = kanal;
  const s = steuer;
  kanal = steuer = null;
  if (k || s) {
    import("@/integrations/supabase/client")
      .then(({ supabase }) => {
        if (k) supabase.removeChannel(k);
        if (s) supabase.removeChannel(s);
      })
      .catch(() => undefined);
  }
}

/* ───────────── API ───────────── */

/** Präsentationsmodus: Sitzung mit dem festen Kurs-Code starten oder wiederaufnehmen. */
export function starteLeitung(code: string = KURS_CODE) {
  const ziel = normiereCode(code);
  const alt = lesen("leitung");
  const weiter = alt?.rolle === "leitung" && alt.code === ziel ? alt : null;
  setze({
    code: ziel,
    token: weiter?.token ?? zufall(12),
    rolle: "leitung",
    stand: weiter?.stand ?? null,
  });
  speichern();
  void verbinden();
}

/** Leitstand: mit Code und Token aus dem Leitstand-Link verbinden. */
export function leitstandVerbinden(code: string, token: string) {
  const c = normiereCode(code);
  if (!c || !token) return;
  setze({ code: c, rolle: "leitstand", token, stand: null });
  speichern();
  void verbinden();
}

/** Nach einem Neuladen den Leitstand wieder verbinden. */
export function leitstandWiederaufnehmen() {
  if (z.code) return;
  const alt = lesen("leitstand");
  if (!alt?.code || alt.rolle !== "leitstand" || !alt.token) return;
  setze({ code: alt.code, rolle: "leitstand", token: alt.token });
  void verbinden();
}

/* Presence nur gebündelt aktualisieren (Realtime begrenzt Presence-Nachrichten je Sekunde). */
let presenceTimer: number | undefined;
function presenceSpaeter() {
  window.clearTimeout(presenceTimer);
  presenceTimer = window.setTimeout(() => {
    if (kanal && z.rolle === "leitung") void kanal.track({ rolle: "leitung", stand: z.stand });
  }, 1500);
}

/** Nur Leitung: Stand ändern und an den Leitstand verteilen. */
export function setzeStand(teil: Partial<Omit<LiveStand, "ts" | "station" | "stationSeit">>) {
  if (z.rolle !== "leitung") return;
  const basis: LiveStand = z.stand ?? { folie: 1, schritt: 0, modus: "folie", station: stationFuerFolie(1).id, stationSeit: Date.now(), ts: 0 };
  const neu: LiveStand = { ...basis, ...teil, ts: Date.now() };
  const station = stationFuerFolie(neu.folie).id;
  if (station !== basis.station || !z.stand) neu.stationSeit = Date.now();
  neu.station = station;
  setze({ stand: neu });
  speichern();
  bc?.postMessage({ art: "stand", stand: neu });
  if (kanal && z.verbindung === "live") {
    void kanal.send({ type: "broadcast", event: "stand", payload: neu });
    presenceSpaeter();
  }
}

/** Leitstand → Leitung. */
export function sendeBefehl(b: Befehl) {
  if (!z.token) return;
  const msg = { ...b, token: z.token, ts: Date.now() };
  bc?.postMessage({ art: "befehl", befehl: msg });
  void steuer?.send({ type: "broadcast", event: "befehl", payload: msg });
}

/** Leitung: Befehle aus dem Leitstand verarbeiten. Gibt eine Abmeldefunktion zurück. */
export function aufBefehl(h: (b: Befehl) => void) {
  befehlHandler = h;
  return () => {
    if (befehlHandler === h) befehlHandler = null;
  };
}

export function leitstandLink(): string | null {
  if (!z.code || !z.token) return null;
  return `${window.location.origin}/kurs/leitstand#c=${z.code}&t=${z.token}`;
}

/** Läuft in diesem Browser eine Präsentation? Dann kann der Leitstand ohne Link verbinden. */
export function lokaleLeitung(): { code: string; token: string } | null {
  const l = lesen("leitung");
  return l?.code && l.token ? { code: l.code, token: l.token } : null;
}

/* ───────────── React ───────────── */

const abonnieren = (h: () => void) => {
  hoerer.add(h);
  return () => hoerer.delete(h);
};

export function useKursLive(): LiveZustand {
  return useSyncExternalStore(abonnieren, () => z, () => z);
}
