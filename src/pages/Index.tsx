import { useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Brain, Search, Cpu } from "lucide-react";
import { Hero } from "@/components/Hero";
import { LevelCard } from "@/components/LevelCard";
import { PromptExamples } from "@/components/PromptExamples";
import { Navigation } from "@/components/Navigation";
import { PracticeArea } from "@/components/PracticeArea";
import { PromptLibrary } from "@/components/PromptLibrary";
import { ResourcesSection } from "@/components/ResourcesSection";
import { ACTASection } from "@/components/ACTASection";
import { AdvancedPromptingSection } from "@/components/AdvancedPromptingSection";
import { DecompositionAssistant } from "@/components/DecompositionAssistant";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ScrollReveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className || ''}`}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div id="hero">
        <Hero />
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Die vier Disziplinen des Promptings 2026 */}
        <ScrollReveal>
          <section id="stufen" className="mb-16 scroll-mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Die vier Disziplinen des Promptings
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vom einfachen Fragen zum autonomen Delegieren – meistere die Kommunikation mit KI auf jedem Level
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <LevelCard
                level={1}
                icon={Sparkles}
                title="Fragen"
                description="Präzise Fragen für direkte Antworten mit der ACTA-Methode"
                examples={["Rezepte", "Reiseplanung", "Geschenkideen"]}
                isActive={activeLevel === 1}
                onClick={() => setActiveLevel(1)}
              />
              <LevelCard
                level={2}
                icon={Brain}
                title="Gestalten"
                description="Die Informationsumgebung für die KI formen, damit Prompts einfach bleiben"
                examples={["System-Prompts", "Konventionen", "Wissensbasis"]}
                isActive={activeLevel === 2}
                onClick={() => setActiveLevel(2)}
              />
              <LevelCard
                level={3}
                icon={Search}
                title="Steuern"
                description="Ziele, Werte und Entscheidungsregeln kodieren für autonomes Handeln"
                examples={["Werte-Hierarchien", "Entscheidungsregeln", "Eskalation"]}
                isActive={activeLevel === 3}
                onClick={() => setActiveLevel(3)}
              />
              <LevelCard
                level={4}
                icon={Cpu}
                title="Spezifizieren"
                description="Wasserdichte Blueprints für mehrtägige autonome Aufgaben erstellen"
                examples={["Agenten-Specs", "Blueprints", "Abnahmekriterien"]}
                isActive={activeLevel === 4}
                onClick={() => setActiveLevel(4)}
              />
            </div>

            <PromptExamples level={activeLevel} />
          </section>
        </ScrollReveal>

        {/* ACTA-Methode */}
        <ScrollReveal>
          <div id="acta" className="scroll-mt-20">
            <ACTASection />
          </div>
        </ScrollReveal>

        {/* Prompt-Bibliothek */}
        <ScrollReveal>
          <div id="bibliothek" className="scroll-mt-20">
            <PromptLibrary />
          </div>
        </ScrollReveal>

        {/* Interaktiver Übungsbereich */}
        <ScrollReveal>
          <div id="uebungen" className="scroll-mt-20">
            <PracticeArea />
          </div>
        </ScrollReveal>

        {/* Ressourcen & Best Practices */}
        <ScrollReveal>
          <div id="ressourcen" className="scroll-mt-20">
            <ResourcesSection />
          </div>
        </ScrollReveal>

        {/* Decomposition-Assistent */}
        <ScrollReveal>
          <div id="decomposition" className="scroll-mt-20">
            <DecompositionAssistant />
          </div>
        </ScrollReveal>

        {/* Advanced Prompting Methoden */}
        <ScrollReveal>
          <div id="advanced" className="scroll-mt-20">
            <AdvancedPromptingSection />
          </div>
        </ScrollReveal>

        {/* Kernprinzip: Spezifikation */}
        <ScrollReveal>
          <section className="mb-16">
            <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    Das Kernprinzip: Von Wort-Zauber zur Spezifikation
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Prompting 2026 ist kein &quot;Wort-Zauber&quot; mehr, sondern eine Kommunikationsdisziplin.
                    Der Weg führt von der schnellen Chat-Korrektur zur vollständigen Vorab-Spezifikation.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                  <div className="text-sm font-semibold text-destructive mb-2">Iteratives Chatten (alt)</div>
                  <p className="text-muted-foreground italic text-sm">
                    "Was soll ich kochen?" ... "Nein, vegetarisch" ... "Für 4 Personen" ... "Mit Pasta"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    4 Rückfragen, 5 Minuten, mittelmäßiges Ergebnis
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="text-sm font-semibold text-primary mb-2">Vorab-Spezifikation (2026)</div>
                  <p className="text-muted-foreground italic text-sm">
                    "Vegetarisches Abendessen, 4 Personen, Zutaten: Tomaten, Pasta, Zwiebeln.
                    Keine Milchprodukte. Format: Zutatenliste + Schritt-für-Schritt, max. 30 Min."
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    0 Rückfragen, 30 Sekunden, perfektes Ergebnis
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
};

export default Index;
