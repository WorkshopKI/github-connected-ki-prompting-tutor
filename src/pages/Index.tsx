import { useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Sparkles, Brain, Search, Cpu, Building2, GraduationCap } from "lucide-react";
import { Hero } from "@/components/Hero";
import { LevelCard } from "@/components/LevelCard";
import { PromptExamples } from "@/components/PromptExamples";
import { Navigation } from "@/components/Navigation";
import { PracticeArea } from "@/components/PracticeArea";
import { PromptLibrary } from "@/components/PromptLibrary";
import { ResourcesSection } from "@/components/ResourcesSection";
import { ACTASection } from "@/components/ACTASection";
import { ACTAQuickChallenge } from "@/components/ACTAQuickChallenge";
import { AdvancedPromptingSection } from "@/components/AdvancedPromptingSection";
import { DecompositionAssistant } from "@/components/DecompositionAssistant";
import { Footer } from "@/components/Footer";
import { OrganizationUseCases } from "@/components/OrganizationUseCases";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

const ScrollReveal = ({ children, className }: { children: ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className || ""}`}
    >
      {children}
    </div>
  );
};

const SectionDivider = () => (
  <div className="max-w-[4rem] mx-auto border-t border-border/40 my-20 md:my-28" />
);

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const offset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

const Index = () => {
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [activeMode, setActiveMode] = useState<"lernen" | "organisation">("lernen");
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollToSection(id), 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div id="hero">
        <Hero />
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="sticky top-[72px] z-30 mb-10 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 p-1 shadow-sm backdrop-blur">
            <Button
              size="sm"
              variant={activeMode === "lernen" ? "default" : "ghost"}
              className="rounded-full gap-2"
              onClick={() => {
                setActiveMode("lernen");
                scrollToSection("stufen");
              }}
            >
              <GraduationCap className="w-4 h-4" /> Lernmodus
            </Button>
            <Button
              size="sm"
              variant={activeMode === "organisation" ? "default" : "ghost"}
              className="rounded-full gap-2"
              onClick={() => {
                setActiveMode("organisation");
                scrollToSection("organisation");
              }}
            >
              <Building2 className="w-4 h-4" /> Organisationsmodus
            </Button>
          </div>
        </div>

        <ScrollReveal>
          <section id="stufen" className="mb-16 md:mb-20 scroll-mt-20">
            <div className="text-center mb-12">
              <span className="font-mono text-xs tracking-widest block mb-3" style={{ color: "hsl(var(--primary-deep))" }}>01</span>
              <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: "hsl(var(--primary-deep))" }} />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Prompting in vier Stufen</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Von der gezielten Frage bis zur vollständigen Aufgabenspezifikation für KI-Agenten
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

        <SectionDivider />

        <div className="bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8 py-16 md:py-20 mb-16 md:mb-20">
          <ScrollReveal>
            <div id="acta" className="scroll-mt-20 max-w-7xl mx-auto">
              <ACTASection />
              <ACTAQuickChallenge />
            </div>
          </ScrollReveal>
        </div>

        <SectionDivider />

        <ScrollReveal>
          <div id="bibliothek" className="scroll-mt-20 mb-16 md:mb-20">
            <PromptLibrary />
          </div>
        </ScrollReveal>

        <div className="bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8 py-16 md:py-20 mb-16 md:mb-20">
          <ScrollReveal>
            <div id="uebungen" className="scroll-mt-20 max-w-7xl mx-auto">
              <PracticeArea />
            </div>
          </ScrollReveal>
        </div>

        <SectionDivider />

        <ScrollReveal>
          <OrganizationUseCases />
        </ScrollReveal>

        <div className="bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8 py-16 md:py-20 mb-16 md:mb-20">
          <div className="max-w-7xl mx-auto rounded-2xl border border-border bg-card/70 p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-2">Governance & Team-Qualität</h3>
            <p className="text-muted-foreground mb-5 max-w-3xl">
              Definiert gemeinsam, welche Templates offiziell freigegeben sind, welche Risiko-Level eine Review erfordern
              und welche Kriterien für gute Antworten in eurer Organisation gelten.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">1) Freigaben</div>
                <p className="text-muted-foreground">Teamlead/Admin markieren validierte Prompts als Standards.</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">2) Review</div>
                <p className="text-muted-foreground">Prompts mit Risiko „hoch“ erhalten verpflichtend eine zweite Prüfung.</p>
              </div>
              <div className="rounded-xl border border-border bg-background/70 p-4">
                <div className="font-semibold mb-1">3) KPI</div>
                <p className="text-muted-foreground">Messung von Nutzung, Antwortqualität und Zeitersparnis pro Team.</p>
              </div>
            </div>
          </div>
        </div>

        <SectionDivider />

        <ScrollReveal>
          <div id="ressourcen" className="scroll-mt-20 mb-16 md:mb-20">
            <ResourcesSection />
          </div>
        </ScrollReveal>

        <div className="bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8 py-16 md:py-20 mb-16 md:mb-20">
          <ScrollReveal>
            <div id="decomposition" className="scroll-mt-20 max-w-7xl mx-auto">
              <DecompositionAssistant />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div id="advanced" className="scroll-mt-20 mb-16 md:mb-20">
            <AdvancedPromptingSection />
          </div>
        </ScrollReveal>

        <div className="bg-muted/30 -mx-4 px-4 md:-mx-8 md:px-8 py-16 md:py-20">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-md ring-1 ring-primary/10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-xl">
                    <BookOpen className="w-8 h-8 text-foreground/70" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      Das Kernprinzip: Von Wort-Zauber zur Spezifikation
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Prompting 2026 ist kein "Wort-Zauber" mehr, sondern eine Kommunikationsdisziplin.
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
                    <p className="text-sm text-muted-foreground mt-2">4 Rückfragen, 5 Minuten, mittelmäßiges Ergebnis</p>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <div className="text-sm font-semibold text-primary mb-2">Vorab-Spezifikation (2026)</div>
                    <p className="text-muted-foreground italic text-sm">
                      "Vegetarisches Abendessen, 4 Personen, Zutaten: Tomaten, Pasta, Zwiebeln.
                      Keine Milchprodukte. Format: Zutatenliste + Schritt-für-Schritt, max. 30 Min."
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">0 Rückfragen, 30 Sekunden, perfektes Ergebnis</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
