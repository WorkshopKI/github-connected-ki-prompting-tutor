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
    </section>
  );
};
