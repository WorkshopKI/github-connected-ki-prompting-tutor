import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Presentation } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { aufBefehl, setzeStand, useKursLive } from "@/lib/kursLive";
import { allgemeinerBefehl } from "@/hooks/usePraesentation";

/** Rückweg-Knopf mit Esc und Leitstand-Befehlen, solange die Leitung eine App-Seite zeigt. */
function Rueckweg({ folie }: { folie?: number }) {
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
      Zurück zur Präsentation{folie ? ` · Folie ${folie}` : ""}
      <kbd className="rounded border border-border px-1 text-xs text-muted-foreground">Esc</kbd>
    </Link>
  );
}

/**
 * Nur für die Kursleitung: Hat sie aus dem Präsentationsmodus eine App-Seite geöffnet (Taste L),
 * führt dieser Knopf (oder Esc) zurück zur Folie. Teilnehmende sehen nichts davon.
 */
export function LeitungZurueck() {
  const { rolle, stand } = useKursLive();
  const { pathname } = useLocation();
  if (rolle !== "leitung" || stand?.modus !== "app" || pathname === ROUTES.KURS_PRAESENTATION) return null;
  return <Rueckweg folie={stand.folie} />;
}
