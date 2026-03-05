import { useState } from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ACTAQuickChallenge = () => {
  const [userInput, setUserInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">Probier's direkt aus!</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Dieser Prompt ist vage: <span className="font-medium text-foreground">"Was soll ich kochen?"</span>
        <br />Verbessere ihn mit der ACTA-Methode:
      </p>
      <Textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Dein verbesserter Prompt..."
        className="mb-3"
        rows={3}
      />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? "Lösung verbergen" : "Beispiel-Lösung"}
        </Button>
        {userInput.trim() && (
          <Button
            size="sm"
            onClick={() => {
              window.location.href = `/playground?prompt=${encodeURIComponent(userInput)}`;
            }}
          >
            Im Prompt-Labor testen
          </Button>
        )}
      </div>
      {showSolution && (
        <div className="mt-4 bg-card rounded-lg p-4 border border-border text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Beispiel mit ACTA:</p>
          <p className="italic">"Du bist ein Ernährungsberater (A). Ich bin Vegetarier und habe Tomaten, Pasta und Zwiebeln zu Hause (C). Schlage ein Abendessen für 2 Personen vor (T). Format: Zutatenliste + Schritte, max. 30 Minuten Zubereitungszeit (A)."</p>
        </div>
      )}
    </div>
  );
};
