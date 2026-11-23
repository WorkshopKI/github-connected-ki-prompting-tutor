import { Link, useLocation } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { STATIONEN, TYP_LABEL, blockLabel, naechsteStation, stationFuerPfad, stationIndex } from "@/data/kurs/fahrplan";
import { useKursLive } from "@/lib/kursLive";

/**
 * „Du bist hier“ ohne Live-Sitzung: zeigt auf Kursseiten, wo die Seite im Ablauf steht
 * und was als Nächstes kommt. Während einer Live-Sitzung übernimmt das LiveBand.
 */
export function FahrplanLeiste() {
  const { pathname } = useLocation();
  const live = useKursLive();
  const station = stationFuerPfad(pathname);
  if (!station || (live.code && live.rolle === "teilnehmer")) return null;
  const naechste = naechsteStation(station);

  return (
    <nav
      aria-label="Kursablauf"
      className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm print:hidden"
    >
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <MapPin className="h-4 w-4 text-brand-ink" strokeWidth={1.75} />
        {blockLabel(station)}
      </span>
      <span className="text-muted-foreground">
        Station {stationIndex(station) + 1} von {STATIONEN.length}: {station.titel} · {TYP_LABEL[station.typ]}
        {station.optional && " · optional"}
      </span>
      {naechste && (
        <Link
          to={naechste.pfad}
          className="ml-auto inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline"
        >
          Als Nächstes: {naechste.titel}
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      )}
    </nav>
  );
}
