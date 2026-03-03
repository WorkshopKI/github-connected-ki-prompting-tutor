import { MessageSquare } from "lucide-react";

export const Hero = () => {
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
            Einstieg in Prompting
          </h1>

          <p
            className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-3xl mx-auto animate-fade-up"
            style={{ opacity: 0, animationDelay: '200ms' }}
          >
            Präzise Anweisungen für KI formulieren — von der einfachen Frage bis zur komplexen Spezifikation
          </p>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-10 animate-fade-up"
            style={{ opacity: 0, animationDelay: '300ms' }}
          >
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">4</div>
              <div className="text-sm text-muted-foreground">Stufen</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">80+</div>
              <div className="text-sm text-muted-foreground">Beispiele</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">6</div>
              <div className="text-sm text-muted-foreground">Übungen</div>
            </div>
            <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-4">
              <div className="flex justify-center mb-1">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">KI-Feedback</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
