/* ── Animationen im Kursablauf ──
 * Ordnet jede Erklär-Animation der Lektion zu, in der sie im Kurs gezeigt wird:
 * Folie (fahrplan.json → "animationen") → Station → Block (Tag/Block) und dazu die
 * Lernpfad-Module, die sie vertiefen. Grundlage für „KI erklärt“ (App und Offline-Fassung).
 */
import daten from "./fahrplan.json";
import { ERKLAERT, type ErklaerEintrag } from "./erklaert";
import { blockById, bloeckeJeTag, stationFuerFolie, type Block, type Station } from "./fahrplan";
import { KURS_MODULE, type KursModul } from "./lernpfad";

const FOLIE_JE_ANIMATION = daten.animationen as Record<string, number>;

export interface ImKurs {
  folie: number;
  station: Station;
  block: Block;
  /** Lernpfad-Module, die die Animation verlinken. */
  module: KursModul[];
}

export function imKurs(slug: string): ImKurs | undefined {
  const folie = FOLIE_JE_ANIMATION[slug];
  if (!folie) return undefined;
  const station = stationFuerFolie(folie);
  return {
    folie,
    station,
    block: blockById(station.block),
    module: KURS_MODULE.filter((m) => m.erklaert?.includes(slug)),
  };
}

/** „Tag 1 · Block 2/7 · Folie 11“ */
export function lektionLabel(k: ImKurs): string {
  return `Tag ${k.block.tag} · Block ${k.block.nr}/${bloeckeJeTag(k.block.tag)} · Folie ${k.folie}`;
}

export interface LektionGruppe {
  block: Block | null;
  eintraege: { e: ErklaerEintrag; k?: ImKurs }[];
}

/** Animationen nach Kursablauf: je Block in Reihenfolge der Folien; nicht zugeordnete am Ende. */
export function animationenNachLektion(): LektionGruppe[] {
  const mit = ERKLAERT.map((e) => ({ e, k: imKurs(e.slug) }));
  const gruppen: LektionGruppe[] = [];
  for (const x of mit.filter((m) => m.k).sort((a, b) => a.k!.folie - b.k!.folie)) {
    const letzte = gruppen[gruppen.length - 1];
    if (letzte?.block?.id === x.k!.block.id) letzte.eintraege.push(x);
    else gruppen.push({ block: x.k!.block, eintraege: [x] });
  }
  const ohne = mit.filter((m) => !m.k);
  if (ohne.length) gruppen.push({ block: null, eintraege: ohne });
  return gruppen;
}
