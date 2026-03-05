import { useState } from "react";
import { User, FileText, Target, Layout, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const actaCards = [
  {
    letter: "A",
    title: "Act / Rolle",
    icon: User,
    description: "Als wer oder was soll die KI antworten?",
    quote: "Nimm die Rolle eines erfahrenen Marketing-Experten ein...",
  },
  {
    letter: "C",
    title: "Context / Hintergrund",
    icon: FileText,
    description: "Welche Hintergrundinfos sind wichtig?",
    quote: "Projektinfos, Rahmenbedingungen, Beispiele (Few-Shot)...",
  },
  {
    letter: "T",
    title: "Task / Aufgabe",
    icon: Target,
    description: "Welche Aufgabe soll erledigt werden?",
    quote: "Erstelle einen LinkedIn-Post für unser neues Produkt...",
  },
  {
    letter: "A",
    title: "Ausgabe / Format",
    icon: Layout,
    description: "Welche Formatierung ist gewünscht?",
    quote: "Max. 150 Wörter, 3-5 Bulletpoints, Call-to-Action",
  },
];

export const ACTASection = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <span className="font-mono text-lg tracking-widest block mb-3" style={{ color: 'hsl(var(--primary-deep))' }}>02</span>
        <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--primary-deep))' }} />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Die ACTA-Methode
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Ein strukturiertes Framework für perfekte Prompts
        </p>
      </div>

      {/* Stepper-Linie – nur auf Desktop */}
      <div className="hidden lg:flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {[
            { letter: "A", label: "Rolle" },
            { letter: "C", label: "Kontext" },
            { letter: "T", label: "Aufgabe" },
            { letter: "A", label: "Format" },
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
                  {item.letter}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {item.label}
                </span>
              </div>
              {i < 3 && (
                <div className="w-16 xl:w-24 h-px bg-primary/25 mx-2 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compact 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {actaCards.map((card, i) => (
          <div
            key={i}
            className="bg-card/80 rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">{card.letter}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-muted-foreground mb-4">
              {card.description}
            </p>
            <div className="bg-muted/50 rounded-md px-3 py-2">
              <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                {card.quote}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle for full example */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExample(!showExample)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {showExample ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Beispiel einklappen
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Vollständiges ACTA-Beispiel anzeigen
            </>
          )}
        </Button>
      </div>

      {/* Collapsible practice example */}
      {showExample && (
        <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mt-4">
          <h3 className="text-xl font-bold mb-4 text-center">
            ACTA in der Praxis – Vollständiges Beispiel
          </h3>

          <div className="bg-background/50 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Act (Rolle)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  Du bist ein erfahrener Social-Media-Manager mit Fokus auf LinkedIn.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Context (Hintergrund)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  Unser Unternehmen ist ein B2B-SaaS-Startup für Projektmanagement. Wir haben gerade ein neues Feature für die automatisierte Zeiterfassung gelauncht. Zielgruppe sind Teamleiter und Projektmanager in mittelständischen Unternehmen.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Task (Aufgabe)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  Erstelle einen LinkedIn-Post, der das neue Feature vorstellt und die Vorteile für Teamleiter hervorhebt.
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Ausgabe (Format)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  Der Post soll max. 150 Wörter haben, mit 3-5 Bulletpoints für die Key-Benefits und einem Call-to-Action am Ende.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
