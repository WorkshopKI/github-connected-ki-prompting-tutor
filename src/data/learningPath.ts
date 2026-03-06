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
    id: "prompting-stufen",
    title: "Die 4 Prompting-Stufen",
    description: "Von der einfachen Frage bis zum Agenten-Blueprint",
    duration: "10 Min",
    type: "theorie",
    component: "LevelCards",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
  {
    id: "zerlegung",
    title: "Aufgaben-Zerlegung",
    description: "Komplexe Aufgaben in promptbare Teilschritte zerlegen",
    duration: "15 Min",
    type: "praxis",
    component: "DecompositionAssistant",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
  {
    id: "advanced",
    title: "Fortgeschrittene Techniken",
    description: "Chain-of-Thought, Few-Shot, Meta-Prompting und mehr",
    duration: "25 Min",
    type: "theorie",
    component: "AdvancedPromptingSection",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
  {
    id: "ressourcen",
    title: "Checklisten & Best Practices",
    description: "Referenzmaterial zum Nachschlagen",
    duration: "10 Min",
    type: "theorie",
    component: "ResourcesSection",
    prerequisites: ["erste-uebungen"],
    isBonus: true,
  },
];

// Alle Module zusammen (für Fortschrittsberechnung)
export const learningModules: LearningModule[] = [...requiredModules, ...bonusModules];
