import { ACTASection } from "@/components/ACTASection";
import { ACTAQuickChallenge } from "@/components/ACTAQuickChallenge";

export const ACTAIntroduction = () => {
  return (
    <div className="space-y-10">
      {/* Teil 1: Warum gute Prompts wichtig sind */}
      <div>
        <h3 className="text-lg font-bold mb-4">Warum gute Prompts wichtig sind</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Der Unterschied zwischen einer mittelmäßigen und einer exzellenten KI-Antwort
          liegt fast immer am Prompt — der Anweisung die du der KI gibst. Vergleiche:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5">
            <div className="text-xs font-semibold text-destructive mb-2">Vager Prompt</div>
            <p className="text-sm font-mono text-muted-foreground italic">
              "Was soll ich kochen?"
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Die KI rät herum. Generische Antwort, mehrere Rückfragen nötig.
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="text-xs font-semibold text-primary mb-2">Strukturierter Prompt</div>
            <p className="text-sm font-mono text-muted-foreground italic">
              "Vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln.
              Keine Milchprodukte. Max. 30 Minuten Zubereitung. Format: Zutatenliste + Schritt-für-Schritt."
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Perfektes Ergebnis beim ersten Versuch. Keine Rückfragen.
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Der strukturierte Prompt enthält vier Elemente: eine <strong>Rolle</strong> (implizit: Koch),
          <strong> Kontext</strong> (verfügbare Zutaten, Einschränkungen),
          eine <strong>Aufgabe</strong> (Rezept erstellen) und ein gewünschtes <strong>Ausgabeformat</strong>.
          Genau das ist die <strong>ACTA-Methode</strong> — und die lernst du jetzt.
        </p>
      </div>

      {/* Teil 2: Die ACTA-Methode */}
      <ACTASection />

      {/* Teil 3: Quick Challenge */}
      <ACTAQuickChallenge />
    </div>
  );
};
