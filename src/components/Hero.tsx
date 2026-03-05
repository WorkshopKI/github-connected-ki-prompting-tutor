import { ChevronDown, Building2, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  const offset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

export const Hero = () => {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-20 md:py-28 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.04) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 animate-fade-up" style={{ opacity: 0 }}>
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Prompting Tutor für Lernen & Organisationen
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-foreground animate-fade-up"
            style={{ opacity: 0, animationDelay: '100ms' }}
          >
            Prompting mit System
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-up"
            style={{ opacity: 0, animationDelay: '200ms' }}
          >
            Lerne die ACTA-Methode, arbeite mit wiederverwendbaren Use Cases und etabliere
            Prompt-Standards für deine Organisation.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '300ms' }}>
            <Button onClick={() => scrollTo("stufen")} className="gap-2">
              <GraduationCap className="w-4 h-4" />
              Onboarding starten
            </Button>
            <Button variant="outline" onClick={() => scrollTo("organisation")} className="gap-2">
              <Building2 className="w-4 h-4" />
              Use Cases im Unternehmen
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="bg-muted px-2.5 py-1 rounded-full">Rollen & Governance</span>
            <span className="bg-muted px-2.5 py-1 rounded-full">Prompt-Templates</span>
            <span className="bg-muted px-2.5 py-1 rounded-full">Team-KPIs</span>
          </div>
        </div>
      </div>

      {showScroll && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-500">
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </div>
      )}
    </section>
  );
};
