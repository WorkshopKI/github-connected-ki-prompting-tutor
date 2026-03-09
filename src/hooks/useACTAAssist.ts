import { useState, useCallback } from "react";
import { toast } from "sonner";
import { complete } from "@/services/completionService";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import { EMPTY_EXTENSIONS } from "@/components/playground/ACTATemplates";

export interface UseACTAAssistReturn {
  suggest: (description: string, model?: string) => Promise<ACTAFields | null>;
  improve: (fields: ACTAFields, model?: string) => Promise<ACTAFields | null>;
  isLoading: boolean;
}

const SUGGEST_SYSTEM = `Du bist ein Prompt-Engineering-Experte. Der Benutzer beschreibt kurz, was er braucht. Du zerlegst das in die ACTA-Struktur.

Antworte NUR mit einem JSON-Objekt (kein Markdown, keine Backticks, kein Preamble):
{
  "act": "Rolle der KI (z.B. 'ein erfahrener Pressesprecher')",
  "context": "Hintergrund, relevante Informationen, Rahmenbedingungen",
  "task": "Konkrete Aufgabe, was die KI tun soll",
  "ausgabe": "Gewünschtes Format, Länge, Struktur, Sprache",
  "extensions": {
    "examples": [],
    "rules": "",
    "reasoning": "",
    "verification": false,
    "verificationNote": "",
    "reversePrompt": false,
    "negatives": ""
  }
}

Regeln:
- act: Immer eine spezifische Expertenrolle, nicht generisch
- context: Alle relevanten Rahmenbedingungen aus der Beschreibung ableiten
- task: Klare, eindeutige Handlungsanweisung
- ausgabe: Konkretes Format mit Längenangabe
- extensions.reasoning: "step-by-step" wenn die Aufgabe komplex ist, sonst ""
- extensions.verification: true wenn Genauigkeit kritisch ist
- extensions.rules: Nur wenn spezifische Regeln nötig sind (DSGVO, Barrierefreiheit etc.)
- extensions.negatives: Nur wenn typische KI-Fehler vermieden werden müssen
- Alle Texte auf Deutsch`;

const IMPROVE_SYSTEM = `Du bist ein Prompt-Engineering-Experte. Verbessere den ACTA-Prompt des Benutzers.

Du erhältst die aktuellen ACTA-Felder als JSON. Antworte NUR mit einem verbesserten JSON-Objekt (kein Markdown, keine Backticks, kein Preamble) im selben Format:
{
  "act": "...",
  "context": "...",
  "task": "...",
  "ausgabe": "...",
  "extensions": {
    "examples": [],
    "rules": "...",
    "reasoning": "...",
    "verification": false,
    "verificationNote": "...",
    "reversePrompt": false,
    "negatives": "..."
  }
}

Verbesserungsprinzipien:
- act: Rolle spezifischer machen, relevante Expertise ergänzen
- context: Fehlende Rahmenbedingungen und Zielgruppe ergänzen
- task: Mehrdeutigkeiten auflösen, Aufgabe konkreter formulieren
- ausgabe: Fehlende Format-Angaben (Länge, Struktur, Sprache) ergänzen
- extensions.examples: 1-2 Beispiele ergänzen wenn Few-Shot die Qualität verbessern würde
- extensions.reasoning: Denkstrategie empfehlen wenn die Aufgabe komplex ist
- extensions.verification: Empfehlen wenn Genauigkeit wichtig ist
- extensions.negatives: Typische KI-Fehler als Negativ-Constraints ergänzen
- NICHT den Inhalt komplett umschreiben — verbessern und ergänzen
- Alle Texte auf Deutsch`;

function parseACTAResponse(text: string): ACTAFields | null {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return {
      act: parsed.act || "",
      context: parsed.context || "",
      task: parsed.task || "",
      ausgabe: parsed.ausgabe || "",
      extensions: {
        examples: Array.isArray(parsed.extensions?.examples) ? parsed.extensions.examples : [],
        rules: parsed.extensions?.rules || "",
        reasoning: parsed.extensions?.reasoning || "",
        verification: !!parsed.extensions?.verification,
        verificationNote: parsed.extensions?.verificationNote || "",
        reversePrompt: !!parsed.extensions?.reversePrompt,
        negatives: parsed.extensions?.negatives || "",
      },
    };
  } catch {
    return null;
  }
}

function handleError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Fehler";
  if (msg === "BUDGET_EXHAUSTED") toast.error("KI-Budget aufgebraucht.");
  else if (msg === "RATE_LIMITED") toast.error("Zu viele Anfragen. Bitte warte kurz.");
  else if (msg === "NOT_AUTHENTICATED") toast.error("Bitte melde dich an.");
  else toast.error(`Fehler: ${msg}`);
}

export function useACTAAssist(): UseACTAAssistReturn {
  const [isLoading, setIsLoading] = useState(false);

  const suggest = useCallback(async (description: string, model?: string): Promise<ACTAFields | null> => {
    if (!description.trim()) return null;
    setIsLoading(true);
    try {
      const text = await complete({
        messages: [
          { role: "system", content: SUGGEST_SYSTEM },
          { role: "user", content: `Mein Ziel: ${description}` },
        ],
        model,
        temperature: 0.4,
      });
      const result = parseACTAResponse(text);
      if (!result) {
        toast.error("KI-Antwort konnte nicht verarbeitet werden.");
        return null;
      }
      toast.success("ACTA-Felder vorgeschlagen!");
      return result;
    } catch (e) {
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const improve = useCallback(async (fields: ACTAFields, model?: string): Promise<ACTAFields | null> => {
    setIsLoading(true);
    try {
      const text = await complete({
        messages: [
          { role: "system", content: IMPROVE_SYSTEM },
          { role: "user", content: `Aktueller Prompt:\n${JSON.stringify({
            act: fields.act, context: fields.context, task: fields.task, ausgabe: fields.ausgabe,
            extensions: fields.extensions ?? EMPTY_EXTENSIONS,
          }, null, 2)}\n\nVerbessere diesen Prompt.` },
        ],
        model,
        temperature: 0.4,
      });
      const result = parseACTAResponse(text);
      if (!result) {
        toast.error("KI-Antwort konnte nicht verarbeitet werden.");
        return null;
      }
      toast.success("Prompt verbessert!");
      return result;
    } catch (e) {
      handleError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggest, improve, isLoading };
}
