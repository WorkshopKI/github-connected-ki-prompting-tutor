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
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Methodik</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Die ACTA-Methode
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ein strukturiertes Framework für perfekte Prompts
        </p>
      </div>

      {/* Compact 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {actaCards.map((card, i) => (
          <div
            key={i}
            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">{card.letter}</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-muted-foreground mb-4">
              {card.description}
            </p>
            <div className="border-l-2 border-primary pl-3">
              <p className="text-sm italic text-muted-foreground">
                &bdquo;{card.quote}&ldquo;
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

          <div className="bg-background/50 rounded-xl p-5 space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm font-semibold text-primary mb-1">Act (Rolle)</p>
              <p className="text-sm text-muted-foreground">
                &bdquo;Du bist ein erfahrener Social-Media-Manager mit Fokus auf LinkedIn.&ldquo;
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm font-semibold text-primary mb-1">Context (Hintergrund)</p>
              <p className="text-sm text-muted-foreground">
                &bdquo;Unser Unternehmen ist ein B2B-SaaS-Startup für Projektmanagement. Wir haben gerade ein neues Feature für die automatisierte Zeiterfassung gelauncht. Zielgruppe sind Teamleiter und Projektmanager in mittelständischen Unternehmen.&ldquo;
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm font-semibold text-primary mb-1">Task (Aufgabe)</p>
              <p className="text-sm text-muted-foreground">
                &bdquo;Erstelle einen LinkedIn-Post, der das neue Feature vorstellt und die Vorteile für Teamleiter hervorhebt.&ldquo;
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <p className="text-sm font-semibold text-primary mb-1">Ausgabe (Format)</p>
              <p className="text-sm text-muted-foreground">
                &bdquo;Der Post soll max. 150 Wörter haben, mit 3-5 Bulletpoints für die Key-Benefits und einem Call-to-Action am Ende.&ldquo;
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
