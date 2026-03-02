import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { Lightbulb } from "lucide-react";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { useAuth } from "@/hooks/useAuth";

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
    context: "Fragen - Rezeptsuche",
    improvementHints: [
      "Füge Informationen über verfügbare Zutaten hinzu",
      "Gib an, für wie viele Personen gekocht werden soll",
      "Erwähne Ernährungspräferenzen oder Allergien",
      "Definiere die Art der Mahlzeit (Frühstück, Mittag, Abend)"
    ],
    goodExample: "Suche ein vegetarisches Abendessen-Rezept für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe. Keine Milchprodukte.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 2,
    level: 1,
    badPrompt: "Wo soll ich Urlaub machen?",
    context: "Fragen - Reiseplanung",
    improvementHints: [
      "Definiere Budget und Reisedauer",
      "Gib Interessen und Aktivitätspräferenzen an",
      "Erwähne bevorzugtes Klima oder Region",
      "Füge Reisegruppe hinzu (allein, Familie, Paar)"
    ],
    goodExample: "Empfehle ein Urlaubsziel in Europa für 7 Tage im September mit Budget von 1500€ für zwei Erwachsene. Wir mögen Kultur, gutes Essen und warmes Wetter.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 3,
    level: 2,
    badPrompt: "Schreib eine E-Mail.",
    context: "Gestalten - Geschäftskommunikation",
    improvementHints: [
      "Definiere Empfänger und Beziehung",
      "Gib den Zweck der E-Mail an",
      "Erwähne gewünschten Ton (förmlich, freundlich)",
      "Füge wichtige Details oder Kontext hinzu"
    ],
    goodExample: "Schreibe eine professionelle E-Mail an einen Kunden, der vor 2 Wochen eine Bestellung aufgegeben hat. Informiere ihn über eine leichte Verzögerung (3 Tage) und biete 10% Rabatt auf die nächste Bestellung als Entschuldigung an. Ton: höflich und kundenorientiert.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 4,
    level: 2,
    badPrompt: "Erstelle einen Report.",
    context: "Gestalten - Dokumentation",
    improvementHints: [
      "Definiere das Thema und den Zweck des Reports",
      "Gib Zielgruppe und Länge an",
      "Erwähne benötigte Abschnitte oder Struktur",
      "Füge verfügbare Daten oder Quellen hinzu"
    ],
    goodExample: "Erstelle einen 2-seitigen Quartalsreport über Social-Media-Performance für das Management. Fokus: Engagement-Rate, Follower-Wachstum und Top-3-Beiträge. Nutze die Daten aus dem angehängten Analytics-Export. Stil: prägnant mit Bullet Points.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 5,
    level: 3,
    badPrompt: "Vergleiche diese beiden Optionen.",
    context: "Steuern - Vergleichsstudie",
    improvementHints: [
      "Benenne die konkreten Optionen",
      "Definiere Vergleichskriterien",
      "Gib den Entscheidungskontext an",
      "Erwähne wichtige Rahmenbedingungen"
    ],
    goodExample: "Vergleiche CRM-Systeme Salesforce und HubSpot für ein B2B-SaaS-Startup mit 25 Mitarbeitern. Kriterien: Kosten (Budget 500€/Monat), Benutzerfreundlichkeit, Integration mit bestehenden Tools (Slack, Google Workspace), Skalierbarkeit. Erstelle eine Entscheidungsmatrix.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 6,
    level: 3,
    badPrompt: "Recherchiere das Thema.",
    context: "Steuern - Autonome Zielvorgabe",
    improvementHints: [
      "Definiere das konkrete Thema und Forschungsfrage",
      "Gib gewünschte Tiefe und Umfang an",
      "Erwähne relevante Quellen oder Perspektiven",
      "Definiere gewünschtes Output-Format"
    ],
    goodExample: "Recherchiere den Einfluss von KI-Chatbots auf Kundenzufriedenheit im E-Commerce. Fokus: aktuelle Studien (2023-2024), Conversion-Rate-Auswirkungen, ROI-Beispiele von mindestens 5 Unternehmen. Format: Executive Summary mit Quellenangaben und Key Findings in Tabellenform.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 7,
    level: 4,
    badPrompt: "Mach eine Marktanalyse.",
    context: "Spezifizieren - Agenten-Blueprint",
    improvementHints: [
      "Definiere den Arbeitsbereich (Habitat): Wo darf der Agent recherchieren?",
      "Lege Werkzeuge fest (Hands): Was darf der Agent tun?",
      "Bestimme den Autonomie-Grad (Leash): Wann soll er nachfragen?",
      "Fordere Erfolgsnachweise (Proof): Wie beweist er korrekte Arbeit?",
      "Definiere Acceptance Criteria: Woran erkennt man Fertigstellung?"
    ],
    goodExample: "BLUEPRINT: Wettbewerbsanalyse für KI-gestützte Projektmanagement-Tools.\n\nHABITAT: Öffentliche Webquellen, Preisseiten, G2/Capterra Reviews.\nHANDS: Web-Recherche und Dokumenterstellung. KEIN Zugriff auf interne Daten.\nLEASH: Arbeite autonom. Frage nach bei: unklarer Zielmarkt-Definition, mehr als 3 gleichwertigen Optionen.\nPROOF: Jede Preisangabe mit URL belegen. Confidence-Rating pro Datenpunkt.\n\nMUST: Min. 5 Wettbewerber, aktuelle Preise (2026), Feature-Matrix.\nMUST NOT: Keine Annahmen ohne Quellenangabe.\nACCEPTANCE: Vergleichstabelle + 3 datengestützte Nischen-Empfehlungen + Executive Summary (500 Wörter).",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  },
  {
    id: 8,
    level: 4,
    badPrompt: "Plane das Projekt für mich.",
    context: "Spezifizieren - Decomposition & Constraints",
    improvementHints: [
      "Zerlege das Großprojekt in Teilaufgaben unter 2 Stunden",
      "Definiere für jede Teilaufgabe: Input, Output, Abhängigkeiten",
      "Erstelle MUST/MUST-NOT Constraints",
      "Definiere Eskalations-Trigger (wann soll die KI stoppen?)",
      "Lege Abnahmekriterien fest (woran erkennt man Erfolg?)"
    ],
    goodExample: "SPEZIFIKATION: Redesign der Unternehmenswebsite (5 Seiten, responsive, SEO-optimiert).\n\nDECOMPOSITION: Zerlege in max. 2h-Teilaufgaben. Pro Aufgabe: Input, Output, Abhängigkeiten, Acceptance Criteria, Dauer.\n\nCONSTRAINTS:\nMUST: Mobile-First Design, WCAG 2.1 AA, Core Web Vitals bestehen.\nMUST NOT: Keine externen Fonts laden, keine Cookie-Banner ohne Rechtsgrundlage.\nESKALATION: Bei rechtlichen Fragen (Impressum, Datenschutz) → [PAUSE + Rückfrage].\n\nPROOF: Dependency-Graph, Gantt-Diagramm, Testplan mit 5 Szenarien.\nACCEPTANCE: Alle Seiten responsive getestet, Lighthouse Score >90, SEO-Checkliste erfüllt.",
    evaluationCriteria: { hasContext: true, isSpecific: true, hasConstraints: true }
  }
];

export const PracticeArea = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const { user } = useAuth();
  const { saveProgress, getBestScore } = useExerciseProgress();

  const filteredExercises = exercises.filter(ex => ex.level === selectedLevel);

  const handleEvaluated = async (exerciseId: number, prompt: string, score: number, feedback: string) => {
    if (user) {
      await saveProgress(exerciseId, prompt, score, feedback);
    }
  };

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
          Verbessere schlechte Prompts und erhalte KI-gestütztes Feedback mit Verbesserungsvorschlägen
        </p>
        
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { level: 1, label: "Fragen" },
            { level: 2, label: "Gestalten" },
            { level: 3, label: "Steuern" },
            { level: 4, label: "Spezifizieren" },
          ].map(({ level, label }) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedLevel === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            bestScore={user ? getBestScore(exercise.id) : undefined}
            onEvaluated={handleEvaluated}
          />
        ))}
      </div>
    </section>
  );
};
