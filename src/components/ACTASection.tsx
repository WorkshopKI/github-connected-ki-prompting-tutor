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
  const [showExample, setShowExample] = useState(true);

  return (
    <section className="mb-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Die ACTA-Methode
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Ein strukturiertes Framework für perfekte Prompts
        </p>
      </div>

      {/* Compact 4-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {actaCards.map((card, i) => (
          <div
            key={i}
            className="bg-gradient-card rounded-xl p-4 shadow-sm border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <card.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-lg font-bold text-primary">{card.letter}</span>
            </div>
            <p className="font-semibold text-sm mb-1">{card.title}</p>
            <p className="text-xs text-muted-foreground mb-3">
              {card.description}
            </p>
            <div className="border-l-2 border-primary pl-2">
              <p className="text-xs italic text-muted-foreground">
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
        <div className="bg-gradient-card rounded-2xl p-6 shadow-lg border border-border mt-4">
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
