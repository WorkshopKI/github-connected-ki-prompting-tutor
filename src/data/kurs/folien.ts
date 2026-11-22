/* ── Folien des Kurses ──
 * folien.json und public/folien/*.webp erzeugt scripts/folien/folien.py export aus der PPTX:
 * je Folie und Aufbauschritt ein Bild, dazu Titel. Sprechernotizen liegen getrennt in
 * folien-notizen.json und werden nur vom Leitstand geladen. Sie sind trotzdem öffentlich
 * abrufbar: keine vertraulichen Angaben in die Sprechernotizen schreiben.
 */
import daten from "./folien.json";

export interface Folie {
  nr: number;
  ueberzeile: string;
  titel: string;
  /** Anzahl Aufbauschritte; 1 = ohne schrittweisen Aufbau. */
  schritte: number;
}

export const FOLIEN = daten.folien as Folie[];
export const FOLIEN_ANZAHL = FOLIEN.length;
export const FOLIEN_VERSION = daten.version;

export const folie = (nr: number): Folie | undefined => FOLIEN[nr - 1];

/** Bild einer Folie im Aufbauschritt `schritt` (0-basiert); ohne Schritt das vollständige Bild. */
export function folienBild(nr: number, schritt?: number): string {
  const f = folie(nr);
  const s = Math.max(0, Math.min((f?.schritte ?? 1) - 1, schritt ?? (f?.schritte ?? 1) - 1));
  return `/folien/f${String(nr).padStart(2, "0")}-${s}.webp?v=${FOLIEN_VERSION}`;
}

/** Position eine Stelle weiter (nächster Aufbauschritt, sonst nächste Folie). */
export function weiter(nr: number, schritt: number): { nr: number; schritt: number } {
  const f = folie(nr);
  if (f && schritt < f.schritte - 1) return { nr, schritt: schritt + 1 };
  if (nr < FOLIEN_ANZAHL) return { nr: nr + 1, schritt: 0 };
  return { nr, schritt };
}

/** Position eine Stelle zurück; beim Zurückgehen auf eine Folie steht sie vollständig da. */
export function zurueck(nr: number, schritt: number): { nr: number; schritt: number } {
  if (schritt > 0) return { nr, schritt: schritt - 1 };
  if (nr > 1) return { nr: nr - 1, schritt: (folie(nr - 1)?.schritte ?? 1) - 1 };
  return { nr, schritt };
}
