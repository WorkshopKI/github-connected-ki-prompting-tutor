export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "theorie" | "praxis" | "quiz" | "pruefung";
  component: string;
  prerequisites: string[];
  isBonus?: boolean;
}

// Pflicht-Module: Der Kern-Onboarding-Pfad (~30 Min)
export const requiredModules: LearningModule[] = [
  {
    id: "acta-einfuehrung",
    title: "Einführung & ACTA-Methode",
    description: "Warum Struktur wichtig ist und wie die ACTA-Methode funktioniert",
    duration: "15 Min",
    type: "theorie",
    component: "ACTAIntroduction",
    prerequisites: [],
  },
  {
    id: "erste-uebungen",
    title: "Üben: Dein erster guter Prompt",
    description: "Verbessere schwache Prompts und bekomme KI-Feedback",
    duration: "15 Min",
    type: "praxis",
    component: "PracticeAreaCompact",
    prerequisites: ["acta-einfuehrung"],
  },
];

// Bonus-Module: Vertiefung, unabhängig voneinander
export const bonusModules: LearningModule[] = [
  {
    id: "techniken-anwenden",
    title: "Fortgeschrittene Techniken anwenden",
    description: "Chain-of-Thought, Few-Shot und Verification direkt in der Werkstatt ausprobieren",
    duration: "20 Min",
    type: "praxis",
    component: "AdvancedTechniquesModule",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
  {
    id: "datenschutz",
    title: "Datenschutz & Compliance",
    description: "Sensible Daten erkennen und Vertraulichkeitsstufen verstehen",
    duration: "10 Min",
    type: "praxis",
    component: "DataPrivacyIntro",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
  {
    id: "workflows-bauen",
    title: "Eigene Workflows bauen",
    description: "Komplexe Aufgaben zerlegen und eigene Prompt-Skills erstellen",
    duration: "15 Min",
    type: "praxis",
    component: "WorkflowBuilderModule",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
];

// Alle Module zusammen (für Fortschrittsberechnung)
export const learningModules: LearningModule[] = [...requiredModules, ...bonusModules];
