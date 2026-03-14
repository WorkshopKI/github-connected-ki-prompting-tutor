import { useState, useMemo } from "react";
import { User, Target, FileText, Layout, Shield, Ban, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrgContext } from "@/contexts/OrgContext";
import { actaExamples } from "@/data/actaExamples";

const raketeCards = [
  {
    letter: "R",
    title: "Rolle",
    sublabel: "= Act",
    icon: User,
    description: "Als wer oder was soll die KI antworten?",
    quote: "Du bist ein erfahrener Verwaltungsjurist mit Schwerpunkt Vergaberecht...",
    isNew: false,
  },
  {
    letter: "A",
    title: "Aufgabe",
    sublabel: "= Task",
    icon: Target,
    description: "Welche Aufgabe soll erledigt werden?",
    quote: "Erstelle eine Vollständigkeitsprüfung des Bauantrags nach BauO NRW...",
    isNew: false,
  },
  {
    letter: "K",
    title: "Kontext",
    sublabel: "= Context",
    icon: FileText,
    description: "Welche Hintergrundinfos sind wichtig?",
    quote: "Bauantrag für Nutzungsänderung Büro→Wohnung, Innenbereich § 34 BauGB...",
    isNew: false,
  },
  {
    letter: "E",
    title: "Ergebnis",
    sublabel: "= Ausgabe",
    icon: Layout,
    description: "Welches Format und welche Struktur?",
    quote: "Checkliste mit Unterlage → Rechtsgrundlage → Status, max. 2 Seiten...",
    isNew: false,
  },
  {
    letter: "T",
    title: "Teste",
    sublabel: "Selbstprüfung",
    icon: Shield,
    description: "Worauf soll die KI ihre Antwort überprüfen?",
    quote: "Prüfe ob jede Unterlage eine Rechtsgrundlage hat. Prüfe die Rechtsfolgenbelehrung...",
    isNew: true,
  },
  {
    letter: "E",
    title: "Einschränkungen",
    sublabel: "Was NICHT",
    icon: Ban,
    description: "Was soll die KI explizit NICHT tun?",
    quote: "Keine materielle Prüfung. Keine Rechtsberatung. Kein informeller Ton...",
    isNew: true,
  },
];

const stepperItems = [
  { letter: "R", label: "Rolle", isNew: false },
  { letter: "A", label: "Aufgabe", isNew: false },
  { letter: "K", label: "Kontext", isNew: false },
  { letter: "E", label: "Ergebnis", isNew: false },
  { letter: "T", label: "Teste", isNew: true },
  { letter: "E", label: "Einschr.", isNew: true },
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
          ACTA erweitert — 6 Felder für exzellente Prompts
        </p>
      </div>

      {/* Stepper-Linie – nur auf Desktop */}
      <div className="hidden lg:flex items-center justify-center mb-10">
        <div className="flex items-center gap-0">
          {stepperItems.map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm ${
                  item.isNew ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""
                }`}>
                  {item.letter}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {item.label}
                </span>
              </div>
              {i < 5 && (
                <div className="w-12 xl:w-20 h-px bg-primary/25 mx-2 mt-[-12px]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {raketeCards.map((card, i) => (
          <div
            key={i}
            className="bg-card/80 rounded-lg p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-primary">{card.letter}</span>
              {card.isNew && (
                <Badge className="text-[10px] bg-primary/10 text-primary">Neu in RAKETE</Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-0.5">{card.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{card.sublabel}</p>
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
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Rolle (R)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.act}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Aufgabe (A)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.task}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Kontext (K)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.context}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">Ergebnis (E)</p>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.output}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Teste (T)</p>
                <Badge className="text-[10px] bg-primary/10 text-primary">Neu</Badge>
              </div>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.verificationNote || "—"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Einschränkungen (E)</p>
                <Badge className="text-[10px] bg-primary/10 text-primary">Neu</Badge>
              </div>
              <div className="bg-muted/50 rounded-md px-3 py-2">
                <p className="text-xs text-foreground/80 font-mono leading-relaxed">
                  {example.negatives || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
