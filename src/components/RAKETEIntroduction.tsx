import { RAKETESection } from "@/components/RAKETESection";
import { RAKETEQuickChallenge } from "@/components/RAKETEQuickChallenge";

export const RAKETEIntroduction = () => {
  return (
    <div className="space-y-10">
      {/* Teil 1: Von ACTA zu RAKETE */}
      <div>
        <h3 className="text-lg font-bold mb-4">Von ACTA zu RAKETE</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Du kennst bereits die 4 ACTA-Felder: Act (Rolle), Context (Hintergrund), Task (Aufgabe) und Ausgabe (Format).
          Die RAKETE-Methode erweitert ACTA um zwei Felder, die deine Prompts noch präziser machen.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="text-xs font-semibold text-muted-foreground mb-3">ACTA — 4 Felder</div>
            <div className="space-y-2">
              {["Rolle", "Aufgabe", "Kontext", "Ergebnisformat"].map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  <span className="text-sm">{field}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="text-xs font-semibold text-primary mb-3">RAKETE — 6 Felder</div>
            <div className="space-y-2">
              {[
                { name: "Rolle", isNew: false },
                { name: "Aufgabe", isNew: false },
                { name: "Kontext", isNew: false },
                { name: "Einschränkungen", isNew: true },
                { name: "Teste", isNew: true },
                { name: "Ergebnisformat", isNew: false },
              ].map((field) => (
                <div key={field.name} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${field.isNew ? "bg-primary" : "bg-primary/50"}`} />
                  <span className={`text-sm ${field.isNew ? "font-semibold text-primary" : ""}`}>
                    {field.name}
                    {field.isNew && <span className="text-[10px] ml-1.5 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">neu</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🚫</span>
              <h4 className="font-semibold text-sm">Einschränkungen</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Sage der KI explizit, was sie <strong>nicht</strong> tun soll.
              Das verhindert typische Probleme wie ungewollte Fachsprache, Spekulationen oder zu lange Antworten.
            </p>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🧪</span>
              <h4 className="font-semibold text-sm">Teste</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Bitte die KI, ihre eigene Antwort zu überprüfen.
              Das verbessert die Qualität, weil die KI Fehler und Lücken selbst erkennt und korrigiert.
            </p>
          </div>
        </div>
      </div>

      {/* Teil 2: Die 6 RAKETE-Felder im Detail */}
      <RAKETESection />

      {/* Teil 3: RAKETE-Challenge */}
      <RAKETEQuickChallenge />
    </div>
  );
};
