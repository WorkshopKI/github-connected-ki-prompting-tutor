import { getApiKey, getEndpoint } from "./apiKeyService";
import { DEFAULT_MODEL } from "@/lib/constants";
import type { Msg } from "@/types";

const SYSTEM_PROMPT = `Du bist ein KI-Prompting-Tutor. Der Benutzer übt, schlechte Prompts zu verbessern.
Bewerte den verbesserten Prompt auf einer Skala von 0-100:
- Kontext und Hintergrund (25%)
- Spezifität und Klarheit (25%)
- Einschränkungen und Format (25%)
- Gesamtqualität (25%)

Antworte NUR mit einem JSON-Objekt (kein Markdown, kein Preamble):
{"score": <0-100>, "feedback": "<2-3 Sätze Feedback auf Deutsch>", "strengths": ["..."], "improvements": ["..."]}`;

interface EvalResult {
  score: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

export async function evaluatePromptDirect(
  userPrompt: string,
  badPrompt: string,
  context?: string,
  model?: string,
): Promise<EvalResult> {
  const apiKey = getApiKey();
  const endpoint = getEndpoint();
  const selectedModel = model || DEFAULT_MODEL;

  const messages: Msg[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Originaler schlechter Prompt: "${badPrompt}"\n${context ? `Kontext: ${context}\n` : ""}Verbesserter Prompt: "${userPrompt}"\n\nBewerte jetzt.`,
    },
  ];

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": window.location.origin,
    },
    body: JSON.stringify({ model: selectedModel, messages, temperature: 0.3 }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || "Bewertung fehlgeschlagen");
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content || "";

  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return { score: 50, feedback: text.slice(0, 300) };
  }
}
