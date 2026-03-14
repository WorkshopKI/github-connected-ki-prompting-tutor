import { useState, useMemo } from "react";
import { User, FileText, Target, Layout, ShieldBan, TestTube, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrgContext } from "@/contexts/OrgContext";
import { actaExamples } from "@/data/actaExamples";

const raketeCards = [
  {
    letter: "R",
    title: "Rolle",
    icon: User,
    description: "Als wer oder was soll die KI antworten?",
    quote: "Nimm die Rolle eines erfahrenen Marketing-Experten ein...",
  },
  {
    letter: "A",
    title: "Aufgabe",
    icon: Target,
    description: "Welche Aufgabe soll erledigt werden?",
    quote: "Erstelle einen LinkedIn-Post für unser neues Produkt...",
  },
  {
    letter: "K",
    title: "Kontext",
    icon: FileText,
    description: "Welche Hintergrundinfos sind wichtig?",
    quote: "Projektinfos, Rahmenbedingungen, Beispiele (Few-Shot)...",
  },
  {
    letter: "E",
    title: "Einschränkungen",
    icon: ShieldBan,
    description: "Was soll die KI NICHT tun?",
    quote: "Keine Fachsprache, keine Spekulationen, max. 200 Wörter...",
    isNew: true,
  },
  {
    letter: "T",
    title: "Teste",
    icon: TestTube,
    description: "Wie soll die KI ihre Antwort selbst prüfen?",
    quote: "Prüfe dein Ergebnis auf Vollständigkeit und Widersprüche...",
    isNew: true,
  },
  {
    letter: "E",
    title: "Ergebnisformat",
    icon: Layout,
    description: "Welche Formatierung ist gewünscht?",
    quote: "Max. 150 Wörter, 3-5 Bulletpoints, Call-to-Action",
  },
];

export const RAKETESection = () => {
  const [showExample, setShowExample] = useState(false);
  const { scope, isDepartment } = useOrgContext();

  const example = useMemo(() => {
    if (isDepartment && actaExamples[scope]) {
      return actaExamples[scope];
    }
    return actaExamples.default;
  }, [scope, isDepartment]);

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Die RAKETE-Methode
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          ACTA plus zwei Felder für exzellente Prompts
        </p>
      </div>

      {/* Stepper-Linie – nur auf Desktop */}
      <div className="hidden lg:flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {raketeCards.map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                  item.isNew
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                    : "bg-primary text-primary-foreground"
                }`}>
                  {item.letter}
                </div>
                <span className={`text-[10px] font-medium ${
                  item.isNew ? "text-primary" : "text-muted-foreground"
                }`}>
                  {item.title}
                </span>
              </div>
              {i < raketeCards.length - 1 && (
                <div className="w-10 xl:w-16 h-px bg-primary/25 mx-1.5 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6-column grid (3x2 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {raketeCards.map((card, i) => (
          <div
            key={i}
            className={`bg-card/80 rounded-lg p-5 ${
              card.isNew ? "ring-1 ring-primary/20" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-lg ${
                card.isNew ? "bg-primary/15" : "bg-primary/10"
              }`}>
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">{card.letter}</span>
              {card.isNew && (
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  NEU
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-muted-foreground mb-4 text-sm">
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
              Vollständiges RAKETE-Beispiel anzeigen
            </>
          )}
        </Button>
      </div>

      {/* Collapsible practice example */}
      {showExample && (
        <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-sm border border-border mt-4">
          <h3 className="text-xl font-bold mb-4 text-center">
            RAKETE in der Praxis – Vollständiges Beispiel
          </h3>

          <div className="bg-background/50 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Rolle</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.act}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Aufgabe</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.task}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Kontext</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.context}
                </p>
              </div>
            </div>

            <div className="ring-1 ring-primary/20 rounded-lg p-0.5">
              <div className="px-2.5 py-2">
                <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Einschränkungen <span className="text-[10px] font-normal">(neu)</span></p>
                <div className="bg-muted/50 rounded-md px-3 py-2">
                  <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                    Keine Vermutungen oder Spekulationen. Nur auf Basis der gegebenen Informationen antworten. Keine Rechtsberatung erteilen.
                  </p>
                </div>
              </div>
            </div>

            <div className="ring-1 ring-primary/20 rounded-lg p-0.5">
              <div className="px-2.5 py-2">
                <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wide">Teste <span className="text-[10px] font-normal">(neu)</span></p>
                <div className="bg-muted/50 rounded-md px-3 py-2">
                  <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                    Prüfe dein Ergebnis: Sind alle geforderten Punkte abgedeckt? Gibt es Widersprüche? Ist die Sprache einheitlich?
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Ergebnisformat</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.output}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
