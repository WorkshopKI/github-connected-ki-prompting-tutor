export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "theorie" | "praxis" | "quiz" | "pruefung";
  component: string;
  prerequisites: string[];
  isBonus?: boolean;
  challenge?: {
    question: string;
    placeholder: string;
    minLength: number;
  };
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
    challenge: {
      question: "Reflexion: Für welche deiner Arbeitsaufgaben würdest du eine der gelernten Techniken einsetzen? Beschreibe kurz, welche Technik und warum.",
      placeholder: "z.B. Für die Erstellung von Stellungnahmen würde ich die Selbstprüfung nutzen, weil...",
      minLength: 30,
    },
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
    challenge: {
      question: "Reflexion: Welche sensiblen Daten könnten in deinen typischen Arbeits-Prompts vorkommen? Wie würdest du sie anonymisieren?",
      placeholder: "z.B. In meinen Prompts zu Bürgeranfragen kommen Namen und Aktenzeichen vor. Ich würde...",
      minLength: 30,
    },
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
    challenge: {
      question: "Reflexion: Welches wiederkehrende Projekt oder welche Aufgabe aus deinem Arbeitsalltag möchtest du als erstes mit KI-Unterstützung in Teilschritte zerlegen?",
      placeholder: "z.B. Die vierteljährliche Berichterstellung, bei der ich immer zuerst Daten sammle, dann...",
      minLength: 30,
    },
  },
];

// Alle Module zusammen (für Fortschrittsberechnung)
export const learningModules: LearningModule[] = [...requiredModules, ...bonusModules];
