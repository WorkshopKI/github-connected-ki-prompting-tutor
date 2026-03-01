import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Brain, Search } from "lucide-react";
import { Hero } from "@/components/Hero";
import { LevelCard } from "@/components/LevelCard";
import { PromptExamples } from "@/components/PromptExamples";
import { Navigation } from "@/components/Navigation";
import { PracticeArea } from "@/components/PracticeArea";
import { PromptLibrary } from "@/components/PromptLibrary";
import { ResourcesSection } from "@/components/ResourcesSection";
import { ACTASection } from "@/components/ACTASection";
import { AdvancedPromptingSection } from "@/components/AdvancedPromptingSection";

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
        {/* Die drei Stufen des Promptings */}
        <section id="stufen" className="mb-16 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Die drei Stufen des Promptings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vom einfachen Fragen zum cleveren Auftraggeber – lerne, wie du KI effektiv nutzt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <LevelCard
              level={1}
              icon={Sparkles}
              title="Alltagshelfer"
              description="Nutze KI für alltägliche Aufgaben mit präzisem Kontext"
              examples={["Rezepte", "Reiseplanung", "Geschenkideen"]}
              isActive={activeLevel === 1}
              onClick={() => setActiveLevel(1)}
            />
            <LevelCard
              level={2}
              icon={Brain}
              title="Juniorassistent"
              description="Delegiere berufliche Aufgaben und spare Zeit"
              examples={["Brainstorming", "E-Mails", "Reports"]}
              isActive={activeLevel === 2}
              onClick={() => setActiveLevel(2)}
            />
            <LevelCard
              level={3}
              icon={Search}
              title="Forschungsassistent"
              description="Beauftragte komplexe Analysen und Recherchen"
              examples={["Vergleichsstudien", "Strategien", "Deep Research"]}
              isActive={activeLevel === 3}
              onClick={() => setActiveLevel(3)}
            />
          </div>

          <PromptExamples level={activeLevel} />
        </section>

        {/* ACTA-Methode */}
        <div id="acta" className="scroll-mt-20">
          <ACTASection />
        </div>

        {/* Prompt-Bibliothek */}
        <div id="bibliothek" className="scroll-mt-20">
          <PromptLibrary />
        </div>

        {/* Interaktiver Übungsbereich */}
        <div id="uebungen" className="scroll-mt-20">
          <PracticeArea />
        </div>

        {/* Ressourcen & Best Practices */}
        <div id="ressourcen" className="scroll-mt-20">
          <ResourcesSection />
        </div>

        {/* Advanced Prompting Methoden */}
        <div id="advanced" className="scroll-mt-20">
          <AdvancedPromptingSection />
        </div>

        {/* Kernprinzip: Kontext */}
        <section className="mb-16">
          <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Das Kernprinzip: Kontext ist der Schlüssel
                </h3>
                <p className="text-lg text-muted-foreground">
                  Der entscheidende Wandel: Gib der KI nicht nur, was du willst, sondern alle 
                  Rahmenbedingungen zur Zielerreichung.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <div className="text-sm font-semibold text-destructive mb-2">❌ Ohne Kontext</div>
                <p className="text-muted-foreground italic">
                  "Was soll ich kochen?"
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ergebnis: Generische, wenig hilfreiche Antwort
                </p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="text-sm font-semibold text-primary mb-2">✓ Mit Kontext</div>
                <p className="text-muted-foreground italic">
                  "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, 
                  Pasta und Zwiebeln, die ich zu Hause habe."
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ergebnis: Präzises, maßgeschneidertes Rezept
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
