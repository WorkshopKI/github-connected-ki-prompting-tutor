import { useState, useMemo } from "react";
import { Lightbulb, X } from "lucide-react";
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
  const [dismissed] = useState(() => {
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

  return (
    <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15 flex items-center gap-2 flex-wrap">
      <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0" />
      <span className="text-[11px] text-muted-foreground font-medium">Iterieren:</span>
      {shown.map((s, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          className="text-[11px] h-6 gap-1 px-2"
          onClick={() => {
            onSendSuggestion(s);
            setVisible(false);
          }}
        >
          {s}
        </Button>
      ))}
      <button
        onClick={() => setVisible(false)}
        className="ml-auto text-muted-foreground/50 hover:text-muted-foreground shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
