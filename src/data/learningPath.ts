export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "theorie" | "praxis" | "quiz" | "pruefung";
  component: string;
  prerequisites: string[];
}

export const learningModules: LearningModule[] = [
  {
    id: "grundlagen",
    title: "Grundlagen: Was ist Prompting?",
    description: "Einführung in die Welt der KI-Kommunikation",
    duration: "10 Min",
    type: "theorie",
    component: "LevelCards",
    prerequisites: [],
  },
  {
    id: "acta-methode",
    title: "Die ACTA-Methode",
    description: "Act, Context, Task, Ausgabe — systematisch prompten",
    duration: "15 Min",
    type: "theorie",
    component: "ACTASection",
    prerequisites: ["grundlagen"],
  },
  {
    id: "acta-challenge",
    title: "ACTA Quick Challenge",
    description: "Teste dein Verständnis der ACTA-Methode",
    duration: "5 Min",
    type: "quiz",
    component: "ACTAQuickChallenge",
    prerequisites: ["acta-methode"],
  },
  {
    id: "erste-uebungen",
    title: "Erste Prompt-Übungen",
    description: "Verbessere schwache Prompts mit der ACTA-Methode",
    duration: "20 Min",
    type: "praxis",
    component: "PracticeArea",
    prerequisites: ["acta-challenge"],
  },
  {
    id: "prompt-beispiele",
    title: "Prompt-Beispiele erkunden",
    description: "Lerne von Beispielen auf verschiedenen Komplexitätsstufen",
    duration: "10 Min",
    type: "theorie",
    component: "PromptExamples",
    prerequisites: ["erste-uebungen"],
  },
  {
    id: "zerlegung",
    title: "Aufgaben-Zerlegung",
    description: "Komplexe Aufgaben in promptbare Teilschritte zerlegen",
    duration: "15 Min",
    type: "praxis",
    component: "DecompositionAssistant",
    prerequisites: ["prompt-beispiele"],
  },
  {
    id: "advanced",
    title: "Fortgeschrittene Techniken",
    description: "Chain-of-Thought, Few-Shot, Meta-Prompting und mehr",
    duration: "25 Min",
    type: "theorie",
    component: "AdvancedPromptingSection",
    prerequisites: ["zerlegung"],
  },
  {
    id: "ressourcen",
    title: "Ressourcen & Best Practices",
    description: "Weiterführende Materialien und Referenzen",
    duration: "10 Min",
    type: "theorie",
    component: "ResourcesSection",
    prerequisites: ["advanced"],
  },
];
