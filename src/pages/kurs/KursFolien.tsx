import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, LocateFixed, Radio } from "lucide-react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { Button } from "@/components/ui/button";
import { FolieBild, useVorladen } from "@/components/kurs/live/FolieBild";
import { KursAblauf } from "@/components/kurs/live/KursAblauf";
import { ROUTES } from "@/lib/constants";
import { useKursLive } from "@/lib/kursLive";
import { FOLIEN_ANZAHL } from "@/data/kurs/folien";
import { blockLabel, linkFuerFolie, naechsteStation, stationFuerFolie } from "@/data/kurs/fahrplan";

/**
 * Folien für Teilnehmende. Live: läuft mit der Kursleitung mit (gleicher Aufbauschritt);
 * zurückblättern geht jederzeit, „Zur aktuellen Folie“ springt wieder mit.
 * Ohne Live-Sitzung: alle Folien vollständig zum Nachlesen.
 */
export default function KursFolien() {
  const live = useKursLive();
  const [params, setParams] = useSearchParams();
  const ausLink = Number(params.get("f")) || 0;
  const [eigene, setEigene] = useState<number>(ausLink || 1);
  const [mitlaufen, setMitlaufen] = useState(!ausLink);

  const istLive = live.rolle === "teilnehmer" && !!live.stand;
  const folgtLive = istLive && mitlaufen;
  const nr = folgtLive ? live.stand!.folie : eigene;
  const schritt = folgtLive ? live.stand!.schritt : undefined;
  const station = stationFuerFolie(nr);
  const naechste = naechsteStation(station);
  const link = linkFuerFolie(nr);
  useVorladen(nr, schritt ?? 0, 1);

  const gehe = (n: number) => {
    const z = Math.min(FOLIEN_ANZAHL, Math.max(1, n));
    setEigene(z);
    setMitlaufen(false);
    setParams({ f: String(z) }, { replace: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") gehe(nr + 1);
      else if (e.key === "ArrowLeft") gehe(nr - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <KursLayout>
      <div className="space-y-4">
        {/* Kompakter Kopf: eine Zeile, damit die Folie möglichst groß ist */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-serif text-2xl font-semibold">Folien</h1>
          <span className="eyebrow">{blockLabel(station)}</span>
          <span className="text-sm text-muted-foreground">
            {istLive ? (mitlaufen ? "läuft live mit der Kursleitung" : "du blätterst selbst") : "zum Nachlesen"}
          </span>
          {!live.code && (
            <Button asChild variant="outline" size="sm" className="ml-auto self-center">
              <Link to={ROUTES.LIVE}>
                <Radio className="mr-2 h-4 w-4" strokeWidth={1.75} /> Live beitreten
              </Link>
            </Button>
          )}
        </div>

        <div className="grid gap-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <FolieBild nr={nr} schritt={schritt} wichtig />
          </div>
          {/* Steuerleiste in einer Zeile: blättern · Position · Als Nächstes · Aktionen */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Button variant="outline" size="icon" onClick={() => gehe(nr - 1)} disabled={nr <= 1} aria-label="Vorherige Folie">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[3.5rem] text-center tabular-nums text-muted-foreground" aria-label={`Folie ${nr} von ${FOLIEN_ANZAHL}`}>
              {nr} / {FOLIEN_ANZAHL}
            </span>
            <Button variant="outline" size="icon" onClick={() => gehe(nr + 1)} disabled={nr >= FOLIEN_ANZAHL} aria-label="Nächste Folie">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {naechste && (
              <button
                onClick={() => gehe(naechste.folien[0])}
                className="min-w-0 flex-1 truncate-safe px-2 text-left text-muted-foreground hover:text-foreground"
                title={`Zu Folie ${naechste.folien[0]}`}
              >
                Als Nächstes: {naechste.titel} · ab Folie {naechste.folien[0]}
              </button>
            )}
            <span className="ml-auto inline-flex flex-wrap gap-2">
              {istLive && !mitlaufen && (
                <Button onClick={() => setMitlaufen(true)}>
                  <LocateFixed className="mr-2 h-4 w-4" strokeWidth={1.75} /> Zur aktuellen Folie
                </Button>
              )}
              {link !== ROUTES.LIVE && (
                <Button asChild variant={istLive && !mitlaufen ? "outline" : "default"}>
                  <Link to={link}>
                    In der App öffnen <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.75} />
                  </Link>
                </Button>
              )}
            </span>
          </div>
        </div>

        <section aria-labelledby="ablauf" className="space-y-3">
          <h2 id="ablauf" className="text-xl font-semibold">
            Ablauf
          </h2>
          <KursAblauf aktiv={station.id} live={istLive ? live.stand!.station : undefined} onWahl={(s) => gehe(s.folien[0])} />
        </section>
        <p className="text-sm text-muted-foreground">
          Für die Kursleitung:{" "}
          <Link to={ROUTES.KURS_PRAESENTATION} className="font-semibold text-brand-ink hover:underline">
            Präsentieren
          </Link>
        </p>
      </div>
    </KursLayout>
  );
}
