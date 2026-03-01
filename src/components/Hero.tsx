import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
export const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: "smooth"
    });
  };
  return <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Interaktiver KI-Kurs
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-primary">Einstieg in Prompting !</h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Lerne, wie du künstlicher Intelligenz präzise Anweisungen gibst und 
            vom einfachen Fragen zum cleveren Auftraggeber wirst
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-lg transition-all" onClick={scrollToContent}>
              Jetzt lernen
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
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
    </section>;
};