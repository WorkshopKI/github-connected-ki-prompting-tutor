import { useState } from "react";
import { Check, Copy, ExternalLink, Play, RotateCcw, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolieBild } from "@/components/kurs/live/FolieBild";
import { folie } from "@/data/kurs/folien";
import { leitstandLink, useKursLive } from "@/lib/kursLive";
import { KURS_APP } from "@/lib/constants";

interface Props {
  onStart: (vonVorn: boolean) => void;
}

/** Vor dem Präsentieren: Hinweis für Teilnehmende, Leitstand-Link, Einstieg ab der letzten Folie. */
export function PraesentationStart({ onStart }: Props) {
  const live = useKursLive();
  const [kopiert, setKopiert] = useState(false);
  const link = leitstandLink();
  const nr = live.stand?.folie ?? 1;
  const fortsetzen = nr > 1;

  const kopieren = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      setKopiert(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="grid content-start gap-3">
        <div className="overflow-hidden rounded-lg border border-border">
          <FolieBild nr={nr} wichtig />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" onClick={() => onStart(false)}>
            <Play className="mr-2 h-4 w-4" strokeWidth={1.75} />
            {fortsetzen ? `Weiter ab Folie ${nr}` : "Präsentieren"}
          </Button>
          {fortsetzen && (
            <Button size="lg" variant="outline" onClick={() => onStart(true)}>
              <RotateCcw className="mr-2 h-4 w-4" strokeWidth={1.75} /> Von vorn
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {fortsetzen ? `Zuletzt: ${folie(nr)?.titel}. ` : ""}Startet im Vollbild. Weiterschalten mit Presenter, Pfeiltasten oder Klick; ? zeigt alle Tasten.
        </p>
      </div>

      <div className="grid content-start gap-4">
        <section className="card-section">
          <h2 className="mb-1 text-sm font-semibold">Für Teilnehmende</h2>
          <p className="text-sm text-muted-foreground">
            Teilnehmende öffnen <span className="font-semibold text-foreground">{KURS_APP}</span> und daraus die Folien in einem zweiten Tab.
            Sie blättern selbst; die Leiste oben auf jeder Kursseite zeigt Tag, Thema und Übung, die Folien-Nummer verbindet beide Tabs.
          </p>
        </section>

        <section className="card-section">
          <h2 className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold">
            <Tablet className="h-4 w-4" strokeWidth={1.75} /> Leitstand für dich
          </h2>
          <p className="text-sm text-muted-foreground">
            Notizen, Zeitplan, Ansagen und Fernbedienung auf Tablet, Handy oder einem zweiten Fenster. Den Link nicht weitergeben: Er steuert die Präsentation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={kopieren} disabled={!link}>
              {kopiert ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />} {kopiert ? "Kopiert" : "Link kopieren"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => link && window.open(link, "kurs-leitstand", "width=1100,height=800")} disabled={!link}>
              <ExternalLink className="mr-2 h-4 w-4" /> In neuem Fenster
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
