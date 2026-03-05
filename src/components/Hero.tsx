import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.08) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 animate-fade-up" style={{ opacity: 0 }}>
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Interaktiver KI-Kurs
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-primary animate-fade-up"
            style={{ opacity: 0, animationDelay: '100ms' }}
          >
            Einstieg in Prompting
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto animate-fade-up"
            style={{ opacity: 0, animationDelay: '200ms' }}
          >
            Präzise Anweisungen für KI formulieren — von der einfachen Frage bis zur komplexen Spezifikation
          </p>

          <p
            className="text-sm text-muted-foreground mt-8 animate-fade-up"
            style={{ opacity: 0, animationDelay: '300ms' }}
          >
            4 Disziplinen · ACTA-Methode · Interaktives Prompt-Labor · KI-gestütztes Feedback
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      </div>
    </section>
  );
};
