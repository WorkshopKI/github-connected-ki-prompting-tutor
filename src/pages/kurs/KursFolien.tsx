import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { Button } from "@/components/ui/button";
import { FolieBild, useVorladen } from "@/components/kurs/live/FolieBild";
import { KursAblauf } from "@/components/kurs/live/KursAblauf";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { TabLink } from "@/components/kurs/TabLink";
import { ROUTES } from "@/lib/constants";
import { merkePosition, useZuletzt } from "@/lib/kursPosition";
import { FOLIEN_ANZAHL } from "@/data/kurs/folien";
import { TYP_LABEL, folienLabel, ist_mitmach, linkFuerFolie, naechsteStation, stationById, stationFuerFolie, stationKurztitel, themaLabel } from "@/data/kurs/fahrplan";

const begrenzt = (n: number) => Math.min(FOLIEN_ANZAHL, Math.max(1, n));

/**
 * Folien für Teilnehmende, meist in einem eigenen Tab neben der App. Sie blättern selbst
 * (der Live-Sync ist seit 26.11.2026 entfernt). Über der Folie steht dieselbe Lage wie in der
 * Fußzeile am Beamer; „Zur Übung“ öffnet die Übung im App-Tab, die Folien bleiben stehen.
 */
export default function KursFolien() {
  const zuletzt = useZuletzt();
  const [params, setParams] = useSearchParams();
  const ausLink = Number(params.get("f")) || 0;
  // Ohne Link dort weiter, wo man zuletzt war (Folie oder Station aus dem App-Tab).
  const [nr, setNr] = useState<number>(() => begrenzt(ausLink || zuletzt?.folie || stationById(zuletzt?.station)?.folien[0] || 1));

  // Link aus dem App-Tab (?f=44) springt zur Folie, auch wenn der Folien-Tab schon offen ist.
  useEffect(() => {
    if (ausLink) setNr(begrenzt(ausLink));
  }, [ausLink]);

  const station = stationFuerFolie(nr);
  const naechste = naechsteStation(station);
  const link = linkFuerFolie(nr);
  const mitmach = ist_mitmach(station);
  useVorladen(nr, 0, 1);

  useEffect(() => {
    merkePosition(station.id, nr);
  }, [station.id, nr]);

  const gehe = (n: number) => {
    const z = begrenzt(n);
    setNr(z);
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
        {/* Kompakter Kopf: Lage wie am Beamer, damit die Folie möglichst groß ist */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="font-serif text-2xl font-semibold">Folien</h1>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-brand-ink" strokeWidth={1.75} />
            {themaLabel(station)}
          </span>
          <span className="inline-flex flex-wrap items-center gap-1.5 text-sm">
            <span className="rounded bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand-soft-ink">{TYP_LABEL[station.typ]}</span>
            {stationKurztitel(station)}
            {station.optional && <OptionalBadge />}
          </span>
        </div>

        <div className="grid gap-3">
          <div className="overflow-hidden rounded-lg border border-border">
            <FolieBild nr={nr} wichtig />
          </div>
          {/* Steuerleiste in einer Zeile: blättern · Position · Als Nächstes · zur Übung */}
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
                Als Nächstes: {stationKurztitel(naechste)} · ab Folie {naechste.folien[0]}
              </button>
            )}
            <TabLink
              to={mitmach ? station.pfad : link}
              tab="app"
              title="Öffnet im App-Tab, die Folien bleiben hier offen"
              className={
                mitmach
                  ? "ml-auto inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary-deep"
                  : "ml-auto inline-flex h-10 items-center gap-2 rounded-md border border-input bg-card px-4 font-semibold hover:bg-accent"
              }
            >
              {mitmach ? `Zur ${station.typ === "gruppe" ? "Gruppenarbeit" : "Übung"}` : "In der App öffnen"}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </TabLink>
          </div>
          <p className="text-xs text-ink-subtle">
            {folienLabel(station)} gehören zu „{stationKurztitel(station)}“. Links öffnen den App-Tab, die Folien bleiben hier stehen. Blättern auch mit ← →.
          </p>
        </div>

        <section aria-labelledby="ablauf" className="space-y-3">
          <h2 id="ablauf" className="text-xl font-semibold">
            Ablauf
          </h2>
          <KursAblauf aktiv={station.id} onWahl={(s) => gehe(s.folien[0])} />
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
