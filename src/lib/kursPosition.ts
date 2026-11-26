/* ── Kurs-Position: wo stehe ich im Kurs? ──
 *
 * Ersetzt für Teilnehmende den Live-Sync (entfernt 26.11.2026). Nur dieser Browser, kein Netz:
 * - Zuletzt besuchte Station (Kursseite oder Folie) in localStorage. Das `storage`-Ereignis trägt sie
 *   in den anderen Tab: Wer im Folien-Tab blättert, sieht im App-Tab auf Vorlagen & Co. „Zuletzt im Kurs“.
 * - Zwei benannte Tabs: App und Folien. Links zwischen beiden öffnen den jeweils anderen Tab, statt den
 *   eigenen zu ersetzen oder immer neue Tabs zu öffnen (window.open mit Fensternamen).
 * Spec: docs/specs/2026-11-26-kurs-orientierung.md
 */
import { useSyncExternalStore } from "react";
import { LS_KEYS, ROUTES } from "@/lib/constants";

export interface KursPosition {
  station: string;
  /** Folie, falls im Folien-Tab geblättert wurde. */
  folie?: number;
  ts: number;
}

/* ───────────── Zuletzt besucht ───────────── */

let roh: string | null = null;
let wert: KursPosition | null = null;

function lesen(): KursPosition | null {
  let neu: string | null = null;
  try {
    neu = localStorage.getItem(LS_KEYS.KURS_POSITION);
  } catch {
    return null;
  }
  if (neu !== roh) {
    roh = neu;
    try {
      wert = neu ? (JSON.parse(neu) as KursPosition) : null;
    } catch {
      wert = null;
    }
  }
  return wert;
}

const hoerer = new Set<() => void>();

export function merkePosition(station: string, folie?: number) {
  const alt = lesen();
  if (alt?.station === station && alt.folie === folie) return;
  try {
    localStorage.setItem(LS_KEYS.KURS_POSITION, JSON.stringify({ station, folie, ts: Date.now() } satisfies KursPosition));
  } catch {
    return;
  }
  hoerer.forEach((h) => h());
}

function abonnieren(h: () => void) {
  hoerer.add(h);
  const ausAnderemTab = (e: StorageEvent) => {
    if (e.key === LS_KEYS.KURS_POSITION) h();
  };
  window.addEventListener("storage", ausAnderemTab);
  return () => {
    hoerer.delete(h);
    window.removeEventListener("storage", ausAnderemTab);
  };
}

/** Zuletzt besuchte Station, auch aus dem anderen Tab. */
export function useZuletzt(): KursPosition | null {
  return useSyncExternalStore(abonnieren, lesen, () => null);
}

/* ───────────── Zwei Tabs: App und Folien ───────────── */

const TAB = { app: "ki-werkstatt-kurs", folien: "ki-werkstatt-folien" } as const;
export type KursTab = keyof typeof TAB;

export const istFolienSeite = (pathname: string) => pathname.replace(/\/$/, "") === ROUTES.KURS_FOLIEN;

/** Gibt dem eigenen Tab seinen Namen, damit der andere Tab ihn wiederfindet. */
export function tabBenennen(pathname: string) {
  try {
    window.name = istFolienSeite(pathname) ? TAB.folien : TAB.app;
  } catch {
    /* ohne Fensternamen öffnet der andere Tab eben einen neuen */
  }
}

/**
 * Öffnet `pfad` im App- oder Folien-Tab (gibt es ihn noch nicht, entsteht er) und holt ihn nach vorn.
 * Blockt der Browser neue Tabs, öffnet sich die Seite im eigenen Tab.
 */
export function imTabOeffnen(pfad: string, tab: KursTab) {
  const w = window.open(pfad, TAB[tab]);
  if (w) w.focus();
  else window.location.assign(pfad);
}

export const folienPfad = (nr: number) => `${ROUTES.KURS_FOLIEN}?f=${nr}`;
