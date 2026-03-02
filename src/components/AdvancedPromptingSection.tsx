import { Shield, Target, Brain, Zap, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AdvancedPromptingSection = () => {
  const techniques = [
    {
      id: "self-correction",
      icon: Shield,
      title: "Selbstkorrektur-Systeme",
      color: "text-primary",
      methods: [
        {
          name: "Chain of Verification",
          description: "Füge Verifizierungsschleifen direkt in den Prompt ein, um die KI zu zwingen, ihre eigenen Antworten zu überprüfen.",
          example: "Analysiere diesen Vertrag und liste deine drei wichtigsten Erkenntnisse auf. Identifiziere dann drei Wege, wie deine Analyse unvollständig sein könnte. Überarbeite deine Erkenntnisse basierend auf dieser Überprüfung.",
          use: "Nutze dies für wichtige Analysen, bei denen Genauigkeit entscheidend ist."
        },
        {
          name: "Adversarial Prompting",
          description: "Fordere die KI aggressiv auf, Probleme und Schwachstellen in ihrer eigenen Ausgabe zu finden.",
          example: "Greife dein vorheriges Design an. Identifiziere fünf spezifische Wege, wie es kompromittiert werden könnte. Bewerte für jede Schwachstelle die Wahrscheinlichkeit und den Impact.",
          use: "Verwende dies bei sicherheitskritischen oder hochsensiblen Aufgaben."
        }
      ]
    },
    {
      id: "edge-case",
      icon: Target,
      title: "Strategisches Edge-Case Learning",
      color: "text-secondary",
      methods: [
        {
          name: "Few-Shot Prompting",
          description: "Zeige der KI Beispiele von häufigen Fehlerfällen und Grenzfällen, damit sie lernt, subtile Unterschiede zu erkennen.",
          example: "Beispiel 1: Offensichtliche SQL-Injection mit direkter String-Konkatenation. Beispiel 2: Parameterisierte Query, die sicher aussieht, aber eine Second-Order-Injection enthält. Analysiere nun diese Query...",
          use: "Ideal für komplexe Kategorisierungsaufgaben oder wenn viele Grenzfälle existieren."
        }
      ]
    },
    {
      id: "meta-prompting",
      icon: Brain,
      title: "Meta-Prompting",
      color: "text-accent-foreground",
      methods: [
        {
          name: "Reverse Prompting",
          description: "Lass die KI den optimalen Prompt für eine Aufgabe selbst entwerfen und dann ausführen.",
          example: "Du bist ein Experte für Prompt-Design. Entwirf den effektivsten Prompt zur Analyse von Quartalsberichten für Frühwarnsignale finanzieller Probleme. Berücksichtige wichtige Details, das beste Output-Format und essenzielle Denkschritte. Führe dann diesen Prompt auf diesen Bericht aus.",
          use: "Nutze dies für komplexe Analyseaufgaben, bei denen du unsicher bist, wie der beste Prompt aussieht."
        },
        {
          name: "Recursive Prompt Optimization",
          description: "Die KI optimiert ihren eigenen Prompt über mehrere Iterationen hinweg.",
          example: "Du bist ein rekursiver Prompt-Optimierer. Mein aktueller Prompt ist: [PROMPT]. Version 1: Füge fehlende Constraints hinzu. Version 2: Löse Mehrdeutigkeiten. Version 3: Erhöhe die Denktiefe.",
          use: "Verwende dies, wenn du einen Prompt systematisch verbessern möchtest."
        }
      ]
    },
    {
      id: "reasoning",
      icon: Zap,
      title: "Reasoning Scaffolds",
      color: "text-primary",
      methods: [
        {
          name: "Deliberate Over-Instruction",
          description: "Kämpfe gegen die Tendenz der KI zur Zusammenfassung an, indem du explizit Ausführlichkeit forderst.",
          example: "Fasse NICHT zusammen. Erweitere jeden einzelnen Punkt mit Implementierungsdetails, Edge Cases, Fehlermodi und historischem Kontext. Deine Antwort soll mindestens 1000 Wörter umfassen.",
          use: "Nutze dies für tiefgehende Analysen, wo jedes Detail zählt."
        },
        {
          name: "Competitive Reasoning",
          description: "Erstelle mehrere konkurrierende Analysen derselben Situation, um verschiedene Perspektiven zu explorieren.",
          example: "Analysiere diese Situation aus drei konkurrierenden Perspektiven: 1) Optimistisches Best-Case-Szenario, 2) Pessimistisches Worst-Case-Szenario, 3) Realistisches wahrscheinlichstes Szenario. Vergleiche dann die Annahmen jeder Perspektive.",
          use: "Ideal für strategische Entscheidungen mit hoher Unsicherheit."
        }
      ]
    },
    {
      id: "human-simulation",
      icon: Users,
      title: "Human Simulation Patterns",
      color: "text-secondary",
      methods: [
        {
          name: "Multi-Persona Debate",
          description: "Lass die KI verschiedene Rollen mit unterschiedlichen Prioritäten einnehmen und untereinander debattieren.",
          example: "Simuliere eine Debatte zwischen drei Experten: Ein CFO priorisiert Kosten, ein CTO priorisiert technische Exzellenz, ein CEO priorisiert Geschwindigkeit. Sie müssen für ihre Präferenz argumentieren und die Positionen der anderen kritisieren. Synthetisiere dann eine Empfehlung.",
          use: "Nutze dies für komplexe Entscheidungen mit mehreren konkurrierenden Zielen."
        },
        {
          name: "Temperature Simulation",
          description: "Simuliere verschiedene 'Temperaturen' durch unterschiedliche Personas - von unsicher/ausführlich bis sicher/präzise.",
          example: "Analysiere dieses Problem zuerst aus Sicht eines unsicheren Junior-Analysten, der alles übererklärt. Dann aus Sicht eines selbstbewussten Experten, der präzise und direkt ist. Synthetisiere beide Perspektiven und zeige, wo Unsicherheit gerechtfertigt ist.",
          use: "Verwende dies, um verschiedene Vertrauensstufen in der Analyse zu explorieren."
        }
      ]
    }
  ];

  return (
    <section id="advanced" className="mb-16 scroll-mt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Advanced Prompting Methoden
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Fortgeschrittene Methoden und mentale Modelle aus dem professionellen Prompt-Engineering
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {techniques.map((technique) => {
          const Icon = technique.icon;
          return (
            <Card key={technique.id} className="p-5 bg-gradient-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Icon className={`w-5 h-5 ${technique.color}`} />
                </div>
                <h3 className="text-lg font-bold">{technique.title}</h3>
              </div>

              <div className="space-y-5">
                {technique.methods.map((method, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary">
                      {method.name}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {method.description}
                    </p>

                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <div className="text-[11px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                        Beispiel
                      </div>
                      <p className="text-xs italic text-foreground leading-relaxed">
                        "{method.example}"
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">Wann verwenden?</span>{" "}
                      {method.use}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        <Card className="p-5 bg-gradient-card border-border">
          <h3 className="text-lg font-bold mb-3">
            Wichtige Prinzipien
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary font-bold">1</span>
              <span><strong>Strukturiere den Denkprozess:</strong> Frage nicht nach "Vorsicht", sondern baue Verifizierung als verpflichtenden Schritt ein.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary font-bold">2</span>
              <span><strong>Nutze Meta-Wissen der KI:</strong> Die KI wurde auf Prompt-Engineering trainiert - nutze dieses Wissen!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary font-bold">3</span>
              <span><strong>Kämpfe gegen Kompression:</strong> Modelle sind trainiert, prägnant zu sein - fordere explizit Ausführlichkeit, wenn du sie brauchst.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary font-bold">4</span>
              <span><strong>Simuliere menschliche Prozesse:</strong> Debatten, verschiedene Perspektiven und Unsicherheitsstufen führen zu besseren Ergebnissen.</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
};
