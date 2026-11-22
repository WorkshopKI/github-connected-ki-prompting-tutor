/* ── Stand-Seite: aktuelle Modelle und Tools ──
 * Monatlich prüfen. Quellen u. a. the-decoder.de, Herstellerseiten, openrouter.ai/models.
 * Spec: docs/specs/2026-11-22-kurs-auftritt.md
 */

export const STAND_DATUM = "22.11.2026";

export interface ModellKlasse {
  klasse: string;
  wofuer: string;
  beispiele: string[];
}

export const MODELL_KLASSEN: ModellKlasse[] = [
  { klasse: "Schnell & günstig", wofuer: "Alltagsfragen, Umformulieren, Zusammenfassen", beispiele: ["GPT-6 Luna", "Claude Haiku 5.5", "Gemini Flash"] },
  { klasse: "Ausgewogen", wofuer: "Berufliche Aufgaben, längere Texte, Analysen", beispiele: ["GPT-6.2 Sol", "Claude Sonnet 5.5", "Gemini 4 Hydrogen", "Mistral Medium 3.5"] },
  { klasse: "Stark", wofuer: "Schwierige Analysen, lange Recherchen und Agenten-Aufgaben", beispiele: ["GPT-6.2 Astra", "Claude Opus 5.5", "Claude Fable 5.2", "Gemini 4 Neon"] },
];

export interface ToolEintrag {
  name: string;
  anbieter: string;
  url: string;
  kurz: string;
}

export const TOOLS: ToolEintrag[] = [
  { name: "ChatGPT", anbieter: "OpenAI · USA", url: "https://chatgpt.com", kurz: "Allrounder mit Agent „Work“, Bildern, Sprachmodus und Apps" },
  { name: "Claude", anbieter: "Anthropic · USA", url: "https://claude.ai", kurz: "Stark bei Texten, Analysen und Programmieren" },
  { name: "Gemini", anbieter: "Google · USA", url: "https://gemini.google.com", kurz: "In Google-Dienste eingebunden, Videos mit Gemini Omni (im EWR ohne Video-Upload)" },
  { name: "Mistral Vibe", anbieter: "Mistral · Frankreich", url: "https://chat.mistral.ai", kurz: "Ehemals Le Chat, europäische Datenhaltung, Work Mode" },
  { name: "Perplexity", anbieter: "Perplexity · USA", url: "https://perplexity.ai", kurz: "Antwortmaschine mit Quellenangaben" },
  { name: "NotebookLM", anbieter: "Google · USA", url: "https://notebooklm.google", kurz: "Arbeitet nur mit deinen Quellen, erstellt Audio- und Video-Überblicke auf Deutsch" },
];

export interface Neuigkeit {
  datum: string;
  text: string;
  quelle: string;
}

/** Neueste zuerst. */
export const NEUIGKEITEN: Neuigkeit[] = [
  { datum: "18.11.2026", text: "Google bringt Gemini 4 Neon, das vierte Gemini-4-Modell in zwei Monaten.", quelle: "https://www.mind-verse.de/news/google-gemini-4-neon-modell-unternehmen-7384a9c5521b" },
  { datum: "17.11.2026", text: "OpenAI veröffentlicht GPT-6.2 Astra und Sol mit sinkenden Preisen.", quelle: "https://the-decoder.de/" },
  { datum: "09.11.2026", text: "Anthropic veröffentlicht Claude Fable 5.2; für die meisten Aufgaben empfiehlt Anthropic weiter Opus 5.5.", quelle: "https://sdtimes.com/?p=61724" },
  { datum: "22.09.2026", text: "Claude Opus 5.5 erscheint: Niveau von Fable 5.1, deutlich günstiger.", quelle: "https://anthropic.com/news/claude-opus-5-5" },
  { datum: "11.09.2026", text: "OpenAI rät bei GPT-6 zu schlankeren Prompts und Skills.", quelle: "https://developers.openai.com/de-DE/blog/rethinking-skills-and-prompts-for-gpt-6-astra" },
  { datum: "27.07.2026", text: "KI-Omnibus in Kraft: Art. 4 abgeschwächt, Kennzeichnungspflicht ab 02.12.2026.", quelle: "https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act" },
  { datum: "09.07.2026", text: "ChatGPT Work: Agent für längere Aufgaben, der fertige Dateien erstellt.", quelle: "https://openai.com/de-DE/index/chatgpt-for-your-most-ambitious-work/" },
  { datum: "28.05.2026", text: "Mistral benennt Le Chat in Vibe um und ergänzt den Work Mode.", quelle: "https://skill-sprinters.de/blog/news/mistral-medium-3-5-work-mode-eu-souveraen/" },
  { datum: "26.04.2026", text: "OpenAI stellt die Video-App Sora ein.", quelle: "https://help.openai.com/de-de/articles/20001152" },
];
