import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MonitorX, Presentation, Radio, StickyNote, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolieBild } from "@/components/kurs/live/FolieBild";
import { LeitstandZeit } from "@/components/kurs/live/LeitstandZeit";
import { LeitstandAnsage } from "@/components/kurs/live/LeitstandAnsage";
import { FOLIEN, FOLIEN_ANZAHL, folie, weiter } from "@/data/kurs/folien";
import { STATIONEN } from "@/data/kurs/fahrplan";
import { ROUTES } from "@/lib/constants";
import { beitreten, lokaleLeitung, sendeBefehl, useKursLive, wiederaufnehmen } from "@/lib/kursLive";

/**
 * /kurs/leitstand — für die Kursleitung auf Tablet, Handy oder im zweiten Fenster:
 * aktuelle und nächste Ansicht, Sprechernotiz, Zeit je Station, Ansagen, Fernbedienung.
 * Verbindung über den Link aus dem Präsentationsmodus (#c=CODE&t=TOKEN).
 */
export default function KursLeitstand() {
  const live = useKursLive();
  const [notizen, setNotizen] = useState<Record<string, string>>({});

  useEffect(() => {
    const h = new URLSearchParams(window.location.hash.slice(1));
    const c = h.get("c");
    const t = h.get("t");
    if (c && t) {
      beitreten(c, "leitstand", t);
      window.history.replaceState(null, "", window.location.pathname);
    } else wiederaufnehmen("leitstand");
    import("@/data/kurs/folien-notizen.json").then((m) => setNotizen(m.notizen as Record<string, string>));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        sendeBefehl({ cmd: "weiter" });
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        sendeBefehl({ cmd: "zurueck" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (live.rolle !== "leitstand" || !live.token) {
    const lokal = lokaleLeitung();
    return (
      <main className="mx-auto grid max-w-xl gap-4 px-4 py-16">
        <h1 className="page-title">Leitstand</h1>
        <p className="text-muted-foreground">
          Öffne den Leitstand über den Link im Präsentationsmodus („Leitstand für dich“). Er enthält einen geheimen Schlüssel, mit dem du die Präsentation steuerst.
        </p>
        <div className="flex flex-wrap gap-2">
          {lokal && <Button onClick={() => beitreten(lokal.code, "leitstand", lokal.token)}>Mit der Präsentation in diesem Browser verbinden</Button>}
          <Button asChild variant="outline">
            <Link to={ROUTES.KURS_PRAESENTATION}>Zum Präsentationsmodus</Link>
          </Button>
        </div>
      </main>
    );
  }

  const s = live.stand;
  const nr = s?.folie ?? 1;
  const schritt = s?.schritt ?? 0;
  const naechster = weiter(nr, schritt);
  const f = folie(nr);
  const istEnde = naechster.nr === nr && naechster.schritt === schritt;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-card px-4 py-2 text-sm">
        <span className="font-serif text-lg font-semibold">Leitstand</span>
        <span className="inline-flex items-center gap-1.5">
          <Radio className={live.verbindung === "live" ? "h-4 w-4 text-success" : "h-4 w-4 text-warning"} strokeWidth={1.75} />
          Code <span className="font-mono font-semibold">{live.code}</span>
          {live.verbindung === "live" ? ` · ${live.teilnehmende} Teilnehmende` : live.verbindung === "lokal" ? " · nur dieser Browser" : " · verbinde …"}
        </span>
        {!s && <span className="text-warning">Präsentation noch nicht gestartet</span>}
      </header>

      <main className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 content-start gap-3">
          {s?.modus === "app" && (
            <div className="flex flex-wrap items-center gap-2 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-soft-ink">
              <Presentation className="h-4 w-4" strokeWidth={1.75} />
              Am Beamer läuft gerade <span className="font-mono">{s.pfad}</span>. Weiter und Zurück schalten dort die Animation.
              <Button size="sm" variant="outline" className="ml-auto" onClick={() => sendeBefehl({ cmd: "zur-folie" })}>
                <Undo2 className="mr-1.5 h-4 w-4" /> Zur Folie
              </Button>
            </div>
          )}
          <div className="overflow-hidden rounded-lg border border-border">
            <FolieBild nr={nr} schritt={schritt} wichtig />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-16 flex-1 text-base" onClick={() => sendeBefehl({ cmd: "zurueck" })}>
              <ChevronLeft className="mr-2 h-5 w-5" /> Zurück
            </Button>
            <Button className="h-16 flex-[2] text-base" onClick={() => sendeBefehl({ cmd: "weiter" })} disabled={istEnde && s?.modus !== "app"}>
              Weiter <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" className="h-16" onClick={() => sendeBefehl({ cmd: "dunkel", an: !s?.dunkel })} aria-label="Beamer schwarz" title="Beamer schwarz">
              <MonitorX className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-[minmax(0,12rem)_minmax(0,1fr)] items-start gap-3 text-sm">
            <div className="overflow-hidden rounded-md border border-border opacity-90">
              <FolieBild nr={naechster.nr} schritt={naechster.schritt} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">Nächster Klick</div>
              <div>
                {istEnde ? "Ende des Foliensatzes" : naechster.nr === nr ? `Aufbau ${naechster.schritt + 1}/${f?.schritte} dieser Folie` : `Folie ${naechster.nr}: ${folie(naechster.nr)?.titel}`}
              </div>
              <div className="mt-1 text-muted-foreground">
                Jetzt: Folie {nr}/{FOLIEN_ANZAHL}
                {(f?.schritte ?? 1) > 1 && ` · Aufbau ${schritt + 1}/${f!.schritte}`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <section className="card-section">
            <h2 className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold">
              <StickyNote className="h-4 w-4" strokeWidth={1.75} /> Notiz zu Folie {nr}
            </h2>
            <p className="max-h-72 overflow-y-auto whitespace-pre-line text-[17px] leading-relaxed">{notizen[String(nr)] || "Keine Notiz."}</p>
          </section>
          <LeitstandZeit stand={s} />
          <LeitstandAnsage stand={s} />
          <label className="card-section grid gap-1.5 text-sm font-semibold">
            Springen zu
            <select
              className="w-full min-w-0 rounded-md border border-input bg-card px-2 py-2 font-normal"
              value={nr}
              onChange={(e) => sendeBefehl({ cmd: "gehe", folie: Number(e.target.value) })}
            >
              {STATIONEN.map((st) => (
                <optgroup key={st.id} label={st.titel}>
                  {FOLIEN.slice(st.folien[0] - 1, st.folien[1]).map((x) => (
                    <option key={x.nr} value={x.nr}>
                      {x.nr} · {x.titel}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
      </main>
    </div>
  );
}
