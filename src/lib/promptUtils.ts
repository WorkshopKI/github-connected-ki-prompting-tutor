/** Extrahiert {{Platzhalter}} aus einem Prompt-Text. */
export function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(.+?)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))];
}
