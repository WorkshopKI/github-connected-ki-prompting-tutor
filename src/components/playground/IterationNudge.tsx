import { useState, useMemo } from "react";
import { Lightbulb, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LS_KEYS } from "@/lib/constants";

const suggestions = [
  "Kürze die Einleitung auf maximal 2 Sätze.",
  "Füge konkrete Zahlen oder Beispiele hinzu.",
  "Ändere den Ton: formeller / informeller.",
  "Bitte um eine alternative Variante.",
  "Frage: 'Was fehlt noch in deiner Antwort?'",
  "Begrenze die Ausgabe auf 100 Wörter.",
  "Bitte um Bulletpoints statt Fließtext.",
  "Frage nach Quellen oder Begründungen.",
];

interface Props {
  turnCount: number;
  onSendSuggestion: (text: string) => void;
}

export const IterationNudge = ({ turnCount, onSendSuggestion }: Props) => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(LS_KEYS.NUDGE_DISMISSED) === "true";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(true);

  // Stabile Auswahl von 2 Vorschlägen pro Session
  const shown = useMemo(() => {
    const seed = Date.now() % suggestions.length;
    return [suggestions[seed], suggestions[(seed + 3) % suggestions.length]];
  }, []);

  // Nur nach der ersten Antwort zeigen (turnCount === 1)
  if (turnCount !== 1 || dismissed || !visible) return null;

  const handleDismissForever = () => {
    setDismissed(true);
    try {
      localStorage.setItem(LS_KEYS.NUDGE_DISMISSED, "true");
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-4 mb-3 p-3 rounded-lg bg-primary/5 border border-primary/15 text-sm">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-2">
            Die erste Antwort ist selten die beste. Versuche eine Iteration:
          </p>
          <div className="flex flex-wrap gap-2">
            {shown.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={() => {
                  onSendSuggestion(s);
                  setVisible(false);
                }}
              >
                <ChevronRight className="w-3 h-3" /> {s}
              </Button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-muted-foreground/50 hover:text-muted-foreground"
          title="Ausblenden"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={handleDismissForever}
        className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground mt-1.5 ml-6"
      >
        Nicht mehr anzeigen
      </button>
    </div>
  );
};
