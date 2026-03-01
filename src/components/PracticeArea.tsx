import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { Lightbulb } from "lucide-react";

interface Exercise {
  id: number;
  level: number;
  badPrompt: string;
  context: string;
  improvementHints: string[];
  goodExample: string;
  evaluationCriteria: {
    hasContext: boolean;
    isSpecific: boolean;
    hasConstraints: boolean;
  };
}

const exercises: Exercise[] = [
  {
    id: 1,
    level: 1,
    badPrompt: "Was soll ich kochen?",
    context: "Alltagshelfer - Rezeptsuche",
    improvementHints: [
      "Füge Informationen über verfügbare Zutaten hinzu",
      "Gib an, für wie viele Personen gekocht werden soll",
      "Erwähne Ernährungspräferenzen oder Allergien",
      "Definiere die Art der Mahlzeit (Frühstück, Mittag, Abend)"
    ],
    goodExample: "Suche ein vegetarisches Abendessen-Rezept für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe. Keine Milchprodukte.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  },
  {
    id: 2,
    level: 1,
    badPrompt: "Wo soll ich Urlaub machen?",
    context: "Alltagshelfer - Reiseplanung",
    improvementHints: [
      "Definiere Budget und Reisedauer",
      "Gib Interessen und Aktivitätspräferenzen an",
      "Erwähne bevorzugtes Klima oder Region",
      "Füge Reisegruppe hinzu (allein, Familie, Paar)"
    ],
    goodExample: "Empfehle ein Urlaubsziel in Europa für 7 Tage im September mit Budget von 1500€ für zwei Erwachsene. Wir mögen Kultur, gutes Essen und warmes Wetter.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  },
  {
    id: 3,
    level: 2,
    badPrompt: "Schreib eine E-Mail.",
    context: "Juniorassistent - Geschäftskommunikation",
    improvementHints: [
      "Definiere Empfänger und Beziehung",
      "Gib den Zweck der E-Mail an",
      "Erwähne gewünschten Ton (förmlich, freundlich)",
      "Füge wichtige Details oder Kontext hinzu"
    ],
    goodExample: "Schreibe eine professionelle E-Mail an einen Kunden, der vor 2 Wochen eine Bestellung aufgegeben hat. Informiere ihn über eine leichte Verzögerung (3 Tage) und biete 10% Rabatt auf die nächste Bestellung als Entschuldigung an. Ton: höflich und kundenorientiert.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  },
  {
    id: 4,
    level: 2,
    badPrompt: "Erstelle einen Report.",
    context: "Juniorassistent - Dokumentation",
    improvementHints: [
      "Definiere das Thema und den Zweck des Reports",
      "Gib Zielgruppe und Länge an",
      "Erwähne benötigte Abschnitte oder Struktur",
      "Füge verfügbare Daten oder Quellen hinzu"
    ],
    goodExample: "Erstelle einen 2-seitigen Quartalsreport über Social-Media-Performance für das Management. Fokus: Engagement-Rate, Follower-Wachstum und Top-3-Beiträge. Nutze die Daten aus dem angehängten Analytics-Export. Stil: prägnant mit Bullet Points.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  },
  {
    id: 5,
    level: 3,
    badPrompt: "Vergleiche diese beiden Optionen.",
    context: "Forschungsassistent - Vergleichsstudie",
    improvementHints: [
      "Benenne die konkreten Optionen",
      "Definiere Vergleichskriterien",
      "Gib den Entscheidungskontext an",
      "Erwähne wichtige Rahmenbedingungen"
    ],
    goodExample: "Vergleiche CRM-Systeme Salesforce und HubSpot für ein B2B-SaaS-Startup mit 25 Mitarbeitern. Kriterien: Kosten (Budget 500€/Monat), Benutzerfreundlichkeit, Integration mit bestehenden Tools (Slack, Google Workspace), Skalierbarkeit. Erstelle eine Entscheidungsmatrix.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  },
  {
    id: 6,
    level: 3,
    badPrompt: "Recherchiere das Thema.",
    context: "Forschungsassistent - Deep Research",
    improvementHints: [
      "Definiere das konkrete Thema und Forschungsfrage",
      "Gib gewünschte Tiefe und Umfang an",
      "Erwähne relevante Quellen oder Perspektiven",
      "Definiere gewünschtes Output-Format"
    ],
    goodExample: "Recherchiere den Einfluss von KI-Chatbots auf Kundenzufriedenheit im E-Commerce. Fokus: aktuelle Studien (2023-2024), Conversion-Rate-Auswirkungen, ROI-Beispiele von mindestens 5 Unternehmen. Format: Executive Summary mit Quellenangaben und Key Findings in Tabellenform.",
    evaluationCriteria: {
      hasContext: true,
      isSpecific: true,
      hasConstraints: true
    }
  }
];

export const PracticeArea = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  const filteredExercises = exercises.filter(ex => ex.level === selectedLevel);

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-accent/20 p-3 rounded-xl">
            <Lightbulb className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Interaktiver Übungsbereich
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Verbessere schlechte Prompts und erhalte direktes Feedback mit Verbesserungsvorschlägen
        </p>
        
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => setSelectedLevel(1)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedLevel === 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Level 1: Alltagshelfer
          </button>
          <button
            onClick={() => setSelectedLevel(2)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedLevel === 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Level 2: Juniorassistent
          </button>
          <button
            onClick={() => setSelectedLevel(3)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedLevel === 3
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Level 3: Forschungsassistent
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </section>
  );
};
