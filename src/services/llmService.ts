import type { Msg } from "@/types";
import { hasApiKey, getApiKey, getEndpoint } from "./apiKeyService";
import { DEFAULT_MODEL } from "@/lib/constants";

export type { Msg } from "@/types";

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/llm-proxy`;

export async function streamChat({
  messages,
  model,
  reasoning,
  signal,
  onDelta,
  onThinking,
  onDone,
  onError,
}: {
  messages: Msg[];
  model?: string;
  reasoning?: { effort: string };
  signal?: AbortSignal;
  onDelta: (text: string) => void;
  onThinking?: (text: string) => void;
  onDone: () => void;
  onError: (error: string, status?: number) => void;
}) {
  let resp: Response;
  try {
    if (hasApiKey()) {
      // ═══ DIRECT MODE: Client → OpenRouter/Provider ═══
      const apiKey = getApiKey();
      const endpoint = getEndpoint();

      const body: Record<string, unknown> = {
        model: model || DEFAULT_MODEL,
        messages,
        stream: true,
      };
      if (reasoning) body.reasoning = reasoning;

      resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Prompting Studio",
        },
        body: JSON.stringify(body),
        signal,
      });
    } else {
      // ═══ PROXY MODE: Client → Edge Function → OpenRouter ═══
      let session;
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase.auth.getSession();
        session = data.session;
      } catch {
        onError("Supabase nicht verfügbar. Bitte API-Key in den Einstellungen hinterlegen.");
        return;
      }

      if (!session) {
        onError("Bitte melde dich an oder hinterlege einen API-Key in den Einstellungen.");
        return;
      }

      const body: Record<string, unknown> = { messages, model: model || DEFAULT_MODEL };
      if (reasoning) body.reasoning = reasoning;

      resp = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(body),
        signal,
      });
    }
  } catch (e) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    onError(e instanceof Error ? e.message : "Netzwerkfehler");
    return;
  }

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => ({ error: "Unbekannter Fehler" }));
    const errMsg =
      errBody.error?.message || errBody.error || errBody.message || "LLM-Fehler";
    onError(errMsg, resp.status);
    return;
  }

  if (!resp.body) {
    onError("Keine Antwort vom Server");
    return;
  }

  // ═══ SSE Parsing (identisch für beide Pfade) ═══
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buf.indexOf("\n")) !== -1) {
        let line = buf.slice(0, idx);
        buf = buf.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta;
          if (delta) {
            if (delta.content) onDelta(delta.content);
            const thinking = delta.reasoning_content || delta.reasoning;
            if (thinking && onThinking) onThinking(thinking);
          }
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
  } catch (e) {
    if (signal?.aborted) {
      onDone();
      return;
    }
    onError(e instanceof Error ? e.message : "Stream-Fehler");
    return;
  }
  onDone();
}

// ═══ Save User Key (nur Workshop-Modus) ═══
export async function saveUserKey(
  apiKey: string,
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase.functions.invoke("save-user-key", {
      body: { apiKey },
    });
    if (error) {
      return { error: error.message || "Verbindungsfehler" };
    }
    return data ?? { success: true };
  } catch {
    return { error: "Supabase nicht verfügbar" };
  }
}
