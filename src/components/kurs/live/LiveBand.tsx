import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Megaphone, MonitorPlay, Presentation, Radio, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/lib/constants";
import { ist_mitmach, stationFuerFolie, blockLabel } from "@/data/kurs/fahrplan";
import { FOLIEN_ANZAHL, folie } from "@/data/kurs/folien";
import { aufBefehl, setzeFolgen, setzeStand, useKursLive, verlassen, wiederaufnehmen, type LiveStand } from "@/lib/kursLive";
import { allgemeinerBefehl } from "@/hooks/usePraesentation";

/* Pro Tab nur einmal je Station bzw. Demo-Seite folgen, auch wenn das Band neu montiert wird. */
let zuletztGefolgt: string | null = null;

const ohneHash = (p: string) => p.split("#")[0];

/** Wohin „Folgen“ führt: Demo-Seite der Leitung, sonst die Seite einer Übungs-/Gruppenstation. */
function folgeZiel(s: LiveStand): { schluessel: string; pfad: string } | null {
  if (s.modus === "app" && s.pfad) return { schluessel: `app:${s.pfad}`, pfad: s.pfad };
  const st = stationFuerFolie(s.folie);
  return ist_mitmach(st) ? { schluessel: `st:${st.id}`, pfad: st.pfad } : null;
}

/** Leitung hat eine App-Seite geöffnet: Rückweg zur Präsentation (auch per Esc). */
function LeitungZurueck({ stand }: { stand: LiveStand | null }) {
  const navigate = useNavigate();
  // Leitstand-Befehle während einer Demo: Weiter/Zurück schalten die Animation (Pfeiltasten).
  useEffect(
    () =>
      aufBefehl((b) => {
        if (allgemeinerBefehl(b)) return;
        if (b.cmd === "weiter" || b.cmd === "zurueck") {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: b.cmd === "weiter" ? "ArrowRight" : "ArrowLeft" }));
        } else if (b.cmd === "gehe") {
          setzeStand({ folie: b.folie, schritt: b.schritt ?? 0 });
          navigate(ROUTES.KURS_PRAESENTATION);
        } else if (b.cmd === "zur-folie") {
          navigate(ROUTES.KURS_PRAESENTATION);
        }
      }),
    [navigate],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(ROUTES.KURS_PRAESENTATION);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  return (
    <Link
      to={ROUTES.KURS_PRAESENTATION}
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent print:hidden"
    >
      <Presentation className="h-4 w-4" strokeWidth={1.75} />
      Zurück zur Präsentation{stand ? ` · Folie ${stand.folie}` : ""}
      <kbd className="rounded border border-border px-1 text-xs text-muted-foreground">Esc</kbd>
    </Link>
  );
}

/**
 * Live-Band: erscheint, sobald jemand einer Live-Sitzung beigetreten ist.
 * Zeigt, wo die Kursleitung gerade ist und was als Nächstes kommt; mit „Folgen“
 * öffnen sich Übungen und Demos automatisch.
 */
export function LiveBand() {
  const live = useKursLive();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { stand, folgen, rolle } = live;

  useEffect(() => {
    wiederaufnehmen();
  }, []);

  const ziel = rolle === "teilnehmer" && stand ? folgeZiel(stand) : null;
  useEffect(() => {
    if (!folgen || !ziel || zuletztGefolgt === ziel.schluessel) return;
    zuletztGefolgt = ziel.schluessel;
    if (ohneHash(ziel.pfad) !== pathname) navigate(ziel.pfad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folgen, ziel?.schluessel]);

  if (rolle === "leitung") {
    return stand?.modus === "app" && pathname !== ROUTES.KURS_PRAESENTATION ? <LeitungZurueck stand={stand} /> : null;
  }
  if (rolle !== "teilnehmer" || !live.code) return null;

  const f = stand ? folie(stand.folie) : undefined;
  const station = stand ? stationFuerFolie(stand.folie) : undefined;
  const mitmachPfad = station && ist_mitmach(station) ? station.pfad : stand?.modus === "app" ? stand.pfad : undefined;

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-brand-soft text-brand-soft-ink print:hidden" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-[70rem] flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2 text-sm lg:px-8">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Radio className="h-4 w-4" strokeWidth={1.75} />
          Live · {live.code}
        </span>
        {stand && f && station ? (
          <span className="min-w-0 truncate-safe">
            {stand.modus === "app" ? "Live-Demo" : `Folie ${stand.folie}/${FOLIEN_ANZAHL}`} · {f.titel}
            <span className="max-md:hidden"> · {blockLabel(station)}</span>
          </span>
        ) : (
          <span>{live.verbindung === "verbinde" ? "Verbinde …" : "Wartet auf die Kursleitung"}</span>
        )}
        <span className="ml-auto inline-flex flex-wrap items-center gap-2">
          {pathname !== ROUTES.KURS_FOLIEN && (
            <Link to={ROUTES.KURS_FOLIEN} className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold hover:bg-card/60">
              <MonitorPlay className="h-4 w-4" strokeWidth={1.75} /> Folie ansehen
            </Link>
          )}
          {mitmachPfad && ohneHash(mitmachPfad) !== pathname && (
            <Link to={mitmachPfad} className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-semibold hover:bg-card/60">
              {stand?.modus === "app" ? "Demo öffnen" : "Zur Übung"} <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          )}
          <label className="inline-flex items-center gap-2 font-semibold">
            <Switch checked={folgen} onCheckedChange={setzeFolgen} aria-label="Der Kursleitung folgen" />
            Folgen
          </label>
          <button onClick={verlassen} className="rounded-md p-1 hover:bg-card/60" aria-label="Live-Sitzung verlassen" title="Live-Sitzung verlassen">
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </span>
      </div>
      {stand?.ansage?.text && (
        <div className="border-t border-border bg-card text-foreground">
          <div className="mx-auto flex max-w-[70rem] items-center gap-2 px-4 py-2 text-[15px] font-semibold lg:px-8">
            <Megaphone className="h-4 w-4 text-brand-ink" strokeWidth={1.75} />
            {stand.ansage.text}
            {stand.ansage.bis && <span className="font-normal text-muted-foreground">bis {stand.ansage.bis} Uhr</span>}
          </div>
        </div>
      )}
    </div>
  );
}
