import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const Hero = () => {
  const scrollToContent = () => {
    const target = document.getElementById("stufen");
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-16 md:py-24 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.07) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 animate-fade-up" style={{ opacity: 0 }}>
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Interaktiver KI-Kurs
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-primary animate-fade-up"
            style={{ opacity: 0, animationDelay: '100ms' }}
          >
            Einstieg in Prompting !
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto animate-fade-up"
            style={{ opacity: 0, animationDelay: '200ms' }}
          >
            Lerne, wie du künstlicher Intelligenz präzise Anweisungen gibst und
            vom einfachen Fragen zum cleveren Auftraggeber wirst
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-up"
            style={{ opacity: 0, animationDelay: '300ms' }}
          >
            <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-lg transition-all" onClick={scrollToContent}>
              Jetzt lernen
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-10 animate-fade-up"
            style={{ opacity: 0, animationDelay: '400ms' }}
          >
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">4</div>
              <div className="text-sm text-muted-foreground">Disziplinen</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">80+</div>
              <div className="text-sm text-muted-foreground">Beispiele</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">∞</div>
              <div className="text-sm text-muted-foreground">Möglichkeiten</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Interaktiv</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
