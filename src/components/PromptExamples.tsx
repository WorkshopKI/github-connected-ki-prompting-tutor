import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Globe } from "lucide-react";
import { toast } from "sonner";

interface PromptExample {
  category: string;
  prompt: string;
  needsWeb?: boolean;
}

const level1Examples: PromptExample[] = [
  {
    category: "Rezepte",
    prompt: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe."
  },
  {
    category: "Urlaubsplanung",
    prompt: "Erstelle eine Reiseroute für einen 7-tägigen Urlaub in Italien mit den Schwerpunkten Kultur und Natur, maximal 2 Stunden Autofahrt pro Tag."
  },
  {
    category: "Geschenke",
    prompt: "Finde ein Geschenk für meine Mutter zum Geburtstag, das ihr gefällt und nicht mehr als 50 Euro kostet."
  },
  {
    category: "Training",
    prompt: "Erstelle einen 30-minütigen Trainingsplan für zu Hause ohne Ausrüstung, der sich auf Rücken und Körpermitte konzentriert."
  },
  {
    category: "Sprachenlernen",
    prompt: "Wie kann ich Grundkenntnisse in Spanisch in einem Monat erwerben? Erstelle einen strukturierten Lernplan."
  }
];

const level2Examples: PromptExample[] = [
  {
    category: "Brainstorming",
    prompt: "Liste mir 10 kreative und unkonventionelle Ideen für eine Social-Media-Marketing-Kampagne für ein neues Bio-Erfrischungsgetränk."
  },
  {
    category: "Feedback",
    prompt: "Hilf mir konstruktives Feedback für einen Kollegen zu formulieren. Er liefert gute Arbeit, verpasst aber oft Deadlines. Der Ton soll wertschätzend, aber klar sein."
  },
  {
    category: "Meeting-Agenda",
    prompt: "Erstelle eine effektive Agenda für ein Team-Meeting zum Thema 'Quartalsplanung Q2' mit Zeitangaben für jeden Punkt."
  },
  {
    category: "Statusbericht",
    prompt: "Erstelle mir eine Vorlage für einen wöchentlichen Projektstatusbericht mit den Abschnitten: Fortschritt, Herausforderungen, nächste Schritte."
  },
  {
    category: "Marketing-Trends",
    prompt: "Was sind die neuesten Trends in der digitalen Marketingbranche? Nutze die Websuche für aktuelle Informationen.",
    needsWeb: true
  }
];

const level3Examples: PromptExample[] = [
  {
    category: "Produktvergleich",
    prompt: "Erstelle einen detaillierten Vergleich zwischen dem VW ID.3, Tesla Model 3 und Renault Megane E-Tech. Berücksichtige: Reichweite im Winter, Gesamtkosten über 5 Jahre (Anschaffung, Versicherung, Wartung) und prognostizierten Restwert. Gib das Ergebnis als übersichtliche Tabelle aus und erstelle eine gewichtete Entscheidungsmatrix (Kosten 40%, Reichweite 30%, Restwert 30%). Begründe deine finale Empfehlung."
  },
  {
    category: "Vergleichsstudie",
    prompt: "Vergleiche Offshore- mit Onshore-Windkraft in Europa hinsichtlich Kosten/MWh, Umweltauswirkungen, Genehmigungsdauer und Akzeptanz in der Bevölkerung. Strukturiere als Tabelle, diskutiere Vor- und Nachteile in Fließtext und zitiere mindestens vier aktuelle Studien (Jahr ≥ 2022).",
    needsWeb: true
  },
  {
    category: "Strategiepapier",
    prompt: "Erstelle ein detailliertes Konzept (ca. 1.200 Wörter) für die Digitalisierung der Patientenakten in einer mittelgroßen Arztpraxis: Stakeholder-Analyse, Zeitplan, Kostenabschätzung, Change-Management-Maßnahmen, Risiken & Gegenmaßnahmen. Füge am Ende eine Prioritäten-Roadmap in Stichpunkten an."
  },
  {
    category: "Marktanalyse",
    prompt: "Analysiere den deutschen Markt für pflanzliche Fleischersatzprodukte: Marktgröße 2024, Wachstumsprognose bis 2028, wichtigste Player, Zielgruppen-Segmentierung, Preissensitivität. Stelle die Ergebnisse in einem Executive Summary (max. 500 Wörter) + detaillierte Tabelle dar.",
    needsWeb: true
  }
];

const allExamples = {
  1: level1Examples,
  2: level2Examples,
  3: level3Examples,
};

interface PromptExamplesProps {
  level: number;
}

export const PromptExamples = ({ level }: PromptExamplesProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const examples = allExamples[level as keyof typeof allExamples] || level1Examples;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Beispiel-Prompts</h3>
        <span className="text-sm text-muted-foreground">
          Klicke auf das Kopier-Icon um einen Prompt zu kopieren
        </span>
      </div>
      
      {examples.map((example, index) => (
        <Card key={index} className="p-6 hover:shadow-md transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-primary">
                  {example.category}
                </span>
                {example.needsWeb && (
                  <span className="inline-flex items-center gap-1 text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                    <Globe className="w-3 h-3" />
                    Websuche
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                "{example.prompt}"
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => copyToClipboard(example.prompt, index)}
            >
              {copiedIndex === index ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
