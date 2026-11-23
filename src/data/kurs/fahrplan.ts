/* ── Kurs-Fahrplan ──
 * Eine Quelle für Folien und App: Tage → Blöcke → Stationen → Folien.
 * Daten in fahrplan.json (liest auch scripts/folien/folien.py für Fußzeilen und QR-Codes).
 * Spec: docs/specs/2026-11-22-kurs-fahrplan-live.md
 */
import daten from "./fahrplan.json";
import { FOLIEN } from "./folien";

export type StationTyp = "vortrag" | "demo" | "uebung" | "gruppe" | "gespraech";

export interface Block {
  id: string;
  tag: 1 | 2;
  nr: number;
  titel: string;
}

export interface Station {
  id: string;
  block: string;
  titel: string;
  typ: StationTyp;
  minuten: number;
  folien: [number, number];
  pfad: string;
  /** Bei Zeitmangel verzichtbar. */
  optional?: boolean;
}

/** Fester Code für die Live-Sitzung (Groß-/Kleinschreibung egal); steht auch auf Folie 2 und im QR-Code. */
export const KURS_CODE = daten.kursCode;

export const BLOECKE = daten.bloecke as Block[];
export const STATIONEN = daten.stationen as Station[];
const LINKS = daten.links as Record<string, string>;

export const TYP_LABEL: Record<StationTyp, string> = {
  vortrag: "Vortrag",
  demo: "Live-Demo",
  uebung: "Übung",
  gruppe: "Gruppenarbeit",
  gespraech: "Gespräch",
};

/** Bei diesen Stationen arbeiten Teilnehmende selbst in der App; „Folgen“ öffnet die Seite. */
export const ist_mitmach = (s: Station) => s.typ === "uebung" || s.typ === "gruppe";

export const blockById = (id: string) => BLOECKE.find((b) => b.id === id)!;
export const bloeckeJeTag = (tag: number) => BLOECKE.filter((b) => b.tag === tag).length;

export function stationFuerFolie(nr: number): Station {
  return STATIONEN.find((s) => nr >= s.folien[0] && nr <= s.folien[1]) ?? STATIONEN[0];
}

export const stationIndex = (s: Station) => STATIONEN.findIndex((x) => x.id === s.id);
export const naechsteStation = (s: Station): Station | undefined => STATIONEN[stationIndex(s) + 1];

/** Seite in der App, die zu einer Folie gehört: eigener Link oder der der Station. */
export function linkFuerFolie(nr: number): string {
  return LINKS[String(nr)] ?? stationFuerFolie(nr).pfad;
}

/** Station zu einer App-Seite (Pfad ohne #), für die Du-bist-hier-Leiste ohne Live-Sitzung. */
export function stationFuerPfad(pathname: string): Station | undefined {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/kurs") return undefined;
  return (
    STATIONEN.find((s) => s.pfad.split("#")[0] === p) ??
    STATIONEN.find((s) => linkFuerFolie(s.folien[0]).split("#")[0] === p) ??
    (p.startsWith("/erklaert/")
      ? STATIONEN.find((s) => {
          for (let n = s.folien[0]; n <= s.folien[1]; n++) if (LINKS[String(n)] === p) return true;
          return false;
        })
      : undefined)
  );
}

/** Erste Folie und Anzahl der Klicks einer Station (Folien × Aufbauschritte). */
export function stationsSchritte(s: Station): number {
  let n = 0;
  for (let f = s.folien[0]; f <= s.folien[1]; f++) n += FOLIEN[f - 1]?.schritte ?? 1;
  return n;
}

/** Geplante Minuten von Kursbeginn (des Tages) bis zum Start der Station. */
export function geplanterStart(s: Station): number {
  const tag = blockById(s.block).tag;
  let min = 0;
  for (const x of STATIONEN) {
    if (x.id === s.id) break;
    if (blockById(x.block).tag === tag) min += x.minuten;
  }
  return min;
}

/** „Tag 1 · Block 3/7“ */
export function blockLabel(s: Station): string {
  const b = blockById(s.block);
  return `Tag ${b.tag} · Block ${b.nr}/${bloeckeJeTag(b.tag)}`;
}
