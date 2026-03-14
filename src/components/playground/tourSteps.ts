export interface TourStep {
  /** Selektor: data-tour="..." Attribut auf dem Ziel-Element */
  target: string;
  /** Titel der Erklärung */
  title: string;
  /** Beschreibungstext */
  description: string;
  /** Tooltip-Position relativ zum Target */
  position?: "top" | "bottom" | "left" | "right";
  /** Nur in diesem Modus anzeigen? undefined = beide */
  mode?: "einsteiger" | "experte";
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: "acta-fields",
    title: "Prompt aufbauen",
    description:
      "Wähle links eine Vorlage aus der Prompt Sammlung oder fülle die Felder direkt aus. Je mehr Kontext du gibst, desto besser das Ergebnis.",
    position: "bottom",
  },
  {
    target: "acta-fields",
    title: "Die ACTA-Methode",
    description:
      "Vier Felder für den perfekten Prompt: Rolle (Act), Kontext (Context), Aufgabe (Task) und Ausgabeformat.",
    position: "bottom",
    mode: "einsteiger",
  },
  {
    target: "acta-fields",
    title: "Die RAKETE-Methode",
    description:
      "Sechs Felder: Rolle, Kontext, Aufgabe, Ergebnis, Teste (Selbstprüfung) und Einschränkungen. Teste und Einschränkungen machen deinen Prompt noch präziser.",
    position: "bottom",
    mode: "experte",
  },
  {
    target: "acta-variables",
    title: "Angaben ausfüllen",
    description:
      "Wenn eine Vorlage Platzhalter enthält (z.B. {{Thema}}), erscheinen hier Eingabefelder. Du kannst sie selbst ausfüllen oder Beispielwerte von der KI vorschlagen lassen.",
    position: "bottom",
  },
  {
    target: "acta-extensions",
    title: "Fortgeschrittene Techniken",
    description:
      "Erweitere deinen Prompt mit Beispielen (Few-Shot), Denkstrategien (Chain-of-Thought), Selbstprüfung und mehr. Klicke auf '+' um eine Technik hinzuzufügen.",
    position: "bottom",
    mode: "experte",
  },
  {
    target: "acta-ki-suggest",
    title: "KI-Assistent",
    description:
      "Beschreibe kurz was du brauchst — die KI füllt alle ACTA-Felder für dich aus. Oder klicke den Zauberstab-Button um einen bestehenden Prompt zu verbessern.",
    position: "bottom",
    mode: "einsteiger",
  },
  {
    target: "acta-ki-suggest",
    title: "KI-Assistent",
    description:
      "Beschreibe kurz was du brauchst — die KI füllt alle RAKETE-Felder für dich aus, inklusive Teste und Einschränkungen. Oder klicke den Zauberstab-Button um einen bestehenden Prompt zu verbessern.",
    position: "bottom",
    mode: "experte",
  },
  {
    target: "acta-preview",
    title: "Prompt-Vorschau",
    description:
      "Hier siehst du in Echtzeit, wie dein fertiger Prompt aussehen wird. Alle Felder und Erweiterungen werden automatisch zusammengebaut.",
    position: "top",
  },
  {
    target: "acta-send",
    title: "Prompt testen",
    description:
      "Sende deinen Prompt an die KI und sieh die Antwort im Chat. Du kannst danach iterieren und den Prompt weiter verfeinern.",
    position: "top",
  },
  {
    target: "chat-area",
    title: "Chat-Bereich",
    description:
      "Hier erscheint die KI-Antwort. Du kannst die Antwort kopieren, exportieren oder den Verlauf leeren und von vorn beginnen.",
    position: "left",
  },
];

/** Filtert Steps nach aktuellem Modus und prüft ob das Target im DOM existiert */
export function getStepsForMode(
  mode: "einsteiger" | "experte"
): TourStep[] {
  return TOUR_STEPS.filter((s) => {
    if (s.mode && s.mode !== mode) return false;
    const el = document.querySelector(`[data-tour="${s.target}"]`);
    return !!el;
  });
}
