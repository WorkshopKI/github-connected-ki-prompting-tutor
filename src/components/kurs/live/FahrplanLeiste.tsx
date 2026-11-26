import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, History, MapPin, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { TabLink } from "@/components/kurs/TabLink";
import {
  BLOECKE,
  TYP_LABEL,
  blockById,
  folienLabel,
  naechsteStation,
  stationById,
  stationFuerPfad,
  stationKurztitel,
  themaLabel,
  type Station,
} from "@/data/kurs/fahrplan";
import { stationFuerGruppenAnker } from "@/data/kurs/gruppenarbeit";
import { folienPfad, istFolienSeite, merkePosition, useZuletzt } from "@/lib/kursPosition";
import { ROUTES } from "@/lib/constants";

/** Blöcke des Tages als kleine Balken: erledigt, jetzt, noch offen. */
function TagesBalken({ s }: { s: Station }) {
  const b = blockById(s.block);
  const tag = BLOECKE.filter((x) => x.tag === b.tag);
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {tag.map((x) => (
        <span
          key={x.id}
          title={`Block ${x.nr} · ${x.titel}`}
          className={cn("h-1.5 w-3 rounded-full", x.nr < b.nr ? "bg-ink-subtle" : x.nr === b.nr ? "bg-brand-ink" : "bg-muted")}
        />
      ))}
    </span>
  );
}

/** Schmale Zeile unter der Kursnavigation, in deren mitlaufendem Kopf. */
function Streifen({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-border bg-background/60 text-sm print:hidden">
      <div className="mx-auto max-w-[70rem] px-4 py-1.5 lg:px-8">{children}</div>
    </div>
  );
}

/**
 * „Du bist hier“ im Kopf jeder Kursseite: Tag, Block und Thema wie in der Fußzeile am Beamer, dazu die Station
 * (Vortrag, Übung, Gruppenarbeit), ihre Folien und was als Nächstes kommt.
 * Seiten ohne eigene Station (Prompt-Vorlagen, Übungen, …) zeigen die zuletzt besuchte Station mit Rückweg.
 * Ersetzt für Teilnehmende das Live-Band (Spec: docs/specs/2026-11-26-kurs-orientierung.md).
 */
export function FahrplanLeiste() {
  const { pathname, hash } = useLocation();
  const zuletzt = useZuletzt();
  const station =
    (pathname === ROUTES.KURS_GRUPPEN && hash ? stationFuerGruppenAnker(hash) : undefined) ?? stationFuerPfad(pathname, hash, zuletzt?.station);

  useEffect(() => {
    if (station && !istFolienSeite(pathname)) merkePosition(station.id);
  }, [station, pathname]);

  // Der Folien-Tab zeigt seine Lage selbst; die Startseite ist die Übersicht.
  if (istFolienSeite(pathname) || pathname.replace(/\/$/, "") === ROUTES.KURS) return null;

  if (!station) {
    const z = stationById(zuletzt?.station);
    if (!z) return null;
    return (
      <Streifen>
        <nav aria-label="Zuletzt im Kurs" className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <History className="h-4 w-4 text-ink-subtle" strokeWidth={1.75} />
          <span className="text-muted-foreground">Zuletzt im Kurs:</span>
          <span className="font-semibold">{themaLabel(z)}</span>
          <span className="text-muted-foreground">· {TYP_LABEL[z.typ]}: {stationKurztitel(z)}</span>
          <Link to={z.pfad} className="ml-auto inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline">
            Zurück dorthin <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </nav>
      </Streifen>
    );
  }

  const naechste = naechsteStation(station);
  return (
    <Streifen>
      <nav aria-label="Du bist hier" className="grid gap-x-4 gap-y-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <MapPin className="h-4 w-4 shrink-0 text-brand-ink" strokeWidth={1.75} />
            {themaLabel(station)}
          </span>
          <TagesBalken s={station} />
          <span className="inline-flex min-w-0 flex-wrap items-center gap-x-1.5">
            <span className="rounded bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand-soft-ink">{TYP_LABEL[station.typ]}</span>
            <span className="font-semibold">{stationKurztitel(station)}</span>
            {station.optional && <OptionalBadge />}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <TabLink
            to={folienPfad(station.folien[0])}
            tab="folien"
            title="Im Folien-Tab öffnen"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <MonitorPlay className="h-4 w-4" strokeWidth={1.75} /> {folienLabel(station)}
          </TabLink>
          {naechste && (
            <Link to={naechste.pfad} className="inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline">
              Als Nächstes: {stationKurztitel(naechste)}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          )}
        </div>
      </nav>
    </Streifen>
  );
}
