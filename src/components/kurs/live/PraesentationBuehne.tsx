import { ChevronLeft, ChevronRight, ExternalLink, HelpCircle, Maximize, Radio, Square, X } from "lucide-react";
import { FolieBild, useVorladen } from "@/components/kurs/live/FolieBild";
import { FOLIEN_ANZAHL, folie } from "@/data/kurs/folien";
import { STATIONEN, linkFuerFolie, stationFuerFolie, stationIndex } from "@/data/kurs/fahrplan";
import { ROUTES } from "@/lib/constants";
import { teilnahmeLink, useKursLive } from "@/lib/kursLive";
import type { Praesentation } from "@/hooks/usePraesentation";

const TASTEN: [string, string][] = [
  ["→  Leertaste  Bild ab  Klick", "weiter (erst Aufbau, dann nächste Folie)"],
  ["←  Bild auf", "zurück"],
  ["12 ⏎", "zu Folie 12 springen"],
  ["L", "zugehörige Seite der App öffnen (Animation, Übung); Esc führt zurück"],
  ["B  .", "Beamer schwarz"],
  ["C", "Code für Teilnehmende ein/aus"],
  ["F", "Vollbild"],
  ["?", "diese Hilfe"],
];

interface Props {
  p: Praesentation;
  onEnde: () => void;
}

/** Vollbild-Bühne am Beamer: Folienbild, Ansage, Code für Teilnehmende, dezente Bedienleiste. */
export function PraesentationBuehne({ p, onEnde }: Props) {
  const live = useKursLive();
  const { nr, schritt } = p;
  const f = folie(nr);
  const station = stationFuerFolie(nr);
  const fortschritt = ((stationIndex(station) + 1) / STATIONEN.length) * 100;
  const link = linkFuerFolie(nr);
  const codeGross = link === ROUTES.LIVE;
  useVorladen(nr, schritt, 3);

  return (
    <div className="fixed inset-0 z-50 flex select-none items-center justify-center bg-sidebar text-foreground">
      <button className="flex h-full w-full items-center justify-center" onClick={p.weiter} aria-label="Weiter">
        <FolieBild nr={nr} schritt={schritt} wichtig className="h-full w-full aspect-auto bg-transparent" />
      </button>

      {p.dunkel && <div className="absolute inset-0 bg-sidebar" aria-label="Beamer schwarz" />}

      {live.stand?.ansage?.text && !p.dunkel && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card px-8 py-4 text-3xl font-semibold">
          {live.stand.ansage.text}
          {live.stand.ansage.bis && <span className="font-normal text-muted-foreground"> · bis {live.stand.ansage.bis} Uhr</span>}
        </div>
      )}

      {(p.chip || codeGross) && live.code && !p.dunkel && (
        <div
          className={
            codeGross
              ? "absolute bottom-16 right-10 rounded-lg border border-border bg-card px-6 py-4 text-right"
              : "absolute right-3 top-3 rounded-md border border-border bg-card/95 px-3 py-1.5 text-sm"
          }
        >
          {codeGross ? (
            <>
              <div className="text-lg text-muted-foreground">{teilnahmeLink()}</div>
              <div className="font-mono text-6xl font-semibold tracking-[0.2em]">{live.code}</div>
            </>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Radio className="h-4 w-4 text-brand-ink" strokeWidth={1.75} />
              {teilnahmeLink()} · <span className="font-mono font-semibold">{live.code}</span>
              {live.verbindung === "live" && <span className="text-muted-foreground">· {live.teilnehmende} dabei</span>}
            </span>
          )}
        </div>
      )}

      {p.eingabe && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card px-8 py-4 font-mono text-5xl">
          {p.eingabe} ⏎
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-1 bg-primary transition-[width] duration-300" style={{ width: `${fortschritt}%` }} />

      <div className="group absolute inset-x-0 bottom-0 flex h-16 items-end justify-center pb-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-sm opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <IconKnopf label="Zurück" onClick={p.zurueck}><ChevronLeft className="h-4 w-4" /></IconKnopf>
          <span className="px-2 tabular-nums">
            {nr}/{FOLIEN_ANZAHL}
            {(f?.schritte ?? 1) > 1 && <span className="text-muted-foreground"> · {schritt + 1}/{f!.schritte}</span>}
          </span>
          <IconKnopf label="Weiter" onClick={p.weiter}><ChevronRight className="h-4 w-4" /></IconKnopf>
          {link !== ROUTES.LIVE && <IconKnopf label="In der App zeigen (L)" onClick={p.appOeffnen}><ExternalLink className="h-4 w-4" /></IconKnopf>}
          <IconKnopf label="Schwarz (B)" onClick={p.schwarz}><Square className="h-4 w-4" /></IconKnopf>
          <IconKnopf label="Vollbild (F)" onClick={p.vollbild}><Maximize className="h-4 w-4" /></IconKnopf>
          <IconKnopf label="Hilfe (?)" onClick={() => p.setHilfe(true)}><HelpCircle className="h-4 w-4" /></IconKnopf>
          <IconKnopf label="Präsentation beenden" onClick={onEnde}><X className="h-4 w-4" /></IconKnopf>
        </div>
      </div>

      {p.hilfe && (
        <div className="absolute inset-0 flex items-center justify-center bg-sidebar/80" onClick={() => p.setHilfe(false)}>
          <div className="max-w-xl rounded-lg border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-3 text-xl font-semibold">Tastatur und Presenter</h2>
            <dl className="grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 text-[15px]">
              {TASTEN.map(([k, t]) => (
                <div key={k} className="contents">
                  <dt className="font-mono font-semibold">{k}</dt>
                  <dd className="text-muted-foreground">{t}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function IconKnopf({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="rounded-md p-2 hover:bg-accent">
      {children}
    </button>
  );
}
