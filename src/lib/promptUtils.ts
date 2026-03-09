/** Extrahiert {{Platzhalter}} aus einem Prompt-Text. */
export function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(.+?)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}

/**
 * Zerlegt einen Fließtext-Prompt heuristisch in ACTA-Felder.
 * Wird als Fallback genutzt, wenn ein PromptItem keine actaFields hat.
 */
export function splitPromptToACTA(promptText: string, _title?: string): { act: string; context: string; task: string; ausgabe: string } {
  const sentences = promptText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) return { act: "", context: "", task: promptText, ausgabe: "" };

  const formatKeywords = /struktur|format|länge|wörter|sätze|spalten|tabelle|absatz|bullet|sprache|sprachniveau|ton:|max\.|maximal|min\./i;
  const contextKeywords = /zielgruppe|hintergrund|kontext|thema|gendersensib|barrierefrei|bürger|keine.*daten|regeln?:|anforderung/i;

  const taskParts: string[] = [];
  const ausgabeParts: string[] = [];
  const contextParts: string[] = [];

  sentences.forEach((s, i) => {
    if (i === 0) {
      taskParts.push(s);
    } else if (formatKeywords.test(s)) {
      ausgabeParts.push(s);
    } else if (contextKeywords.test(s)) {
      contextParts.push(s);
    } else {
      taskParts.push(s);
    }
  });

  return {
    act: "",
    context: contextParts.join(" "),
    task: taskParts.join(" "),
    ausgabe: ausgabeParts.join(" "),
  };
}
