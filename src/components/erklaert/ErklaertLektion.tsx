import type { ReactNode } from "react";
import { Clock, PlayCircle } from "lucide-react";
import { animationenNachLektion, lektionLabel, type ImKurs } from "@/data/kurs/erklaertImKurs";
import type { ErklaerEintrag } from "@/data/kurs/erklaert";

/** Karteninhalt einer Animation mit ihrer Lektion (App und Offline-Fassung). */
export function ErklaertKarteInhalt({ e, k }: { e: ErklaerEintrag; k?: ImKurs }) {
  const fertig = !!e.komponente;
  return (
    <>
      {fertig ? <PlayCircle className="mb-2 h-5 w-5 text-brand-ink" /> : <Clock className="mb-2 h-5 w-5 text-muted-foreground" />}
      <div className="font-semibold">{e.titel}</div>
      <div className="text-sm text-muted-foreground">{e.frage}</div>
      <div className="mt-2 text-xs text-ink-subtle">
        {k ? `Folie ${k.folie} · ${k.station.titel}` : e.gruppe}
        {!fertig && " · in Vorbereitung"}
      </div>
    </>
  );
}

const KARTE = "rounded-lg border border-border bg-card p-4 hover:border-input";

/**
 * Übersicht „KI erklärt“ nach Kursablauf: je Lektion (Tag · Block) die Animationen in der
 * Reihenfolge, in der sie im Kurs gezeigt werden. `verlinke` liefert den Link (Router oder #/slug).
 */
export function ErklaertNachLektion({ verlinke }: { verlinke: (e: ErklaerEintrag, inhalt: ReactNode, className: string) => ReactNode }) {
  return (
    <>
      {animationenNachLektion().map((g) => (
        <section key={g.block?.id ?? "weitere"} className="mb-8">
          <p className="eyebrow mb-0.5">{g.block ? `Tag ${g.block.tag} · Block ${g.block.nr}` : "Weitere"}</p>
          <h2 className="mb-3 text-lg font-semibold">{g.block ? g.block.titel : "Ohne feste Stelle im Kurs"}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.eintraege.map(({ e, k }) =>
              e.komponente ? (
                <div key={e.slug} className="contents">
                  {verlinke(e, <ErklaertKarteInhalt e={e} k={k} />, KARTE)}
                </div>
              ) : (
                <div key={e.slug} className="rounded-lg border border-dashed border-border p-4 opacity-70">
                  <ErklaertKarteInhalt e={e} k={k} />
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </>
  );
}

/** Eyebrow über einer Animation: ihre Lektion im Kurs. */
export function lektionEyebrow(e: ErklaerEintrag, k?: ImKurs): string {
  return k ? `KI erklärt · ${lektionLabel(k)}` : `KI erklärt · ${e.gruppe}`;
}
