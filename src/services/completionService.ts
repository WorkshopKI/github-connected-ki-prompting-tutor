/**
 * Non-Streaming LLM-Completion für strukturierte JSON-Antworten.
 * Unterstützt Proxy-Modus (Supabase, streamt SSE) und Direct-Modus (OpenRouter).
 */
import type { Msg } from "@/types";
import { hasApiKey, getApiKey, getEndpoint } from "./apiKeyService";
import { DEFAULT_MODEL } from "@/lib/constants";

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/llm-proxy`;

export async function complete({
  messages,
  model,
  temperature = 0.4,
}: {
  messages: Msg[];
  model?: string;
  temperature?: number;
}): Promise<string> {
  const selectedModel = model || DEFAULT_MODEL;
  let resp: Response;

  if (hasApiKey()) {
    // ═══ Direct-Modus: Non-Streaming JSON ═══
    resp = await fetch(getEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Prompting Studio",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature,
        stream: false,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 402) throw new Error("BUDGET_EXHAUSTED");
      if (resp.status === 429) throw new Error("RATE_LIMITED");
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error?.message || err.error || "LLM-Fehler");
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content || "";
  }

  // ═══ Proxy-Modus: Streamt SSE, wir sammeln alles ═══
  const { supabase } = await import("@/integrations/supabase/client");
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) throw new Error("NOT_AUTHENTICATED");

  resp = await fetch(PROXY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData.session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({
      model: selectedModel,
      messages,
      temperature,
    }),
  });

  if (!resp.ok) {
    if (resp.status === 402) throw new Error("BUDGET_EXHAUSTED");
    if (resp.status === 429) throw new Error("RATE_LIMITED");
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || err.error || "LLM-Fehler");
  }

  // Proxy always returns SSE — collect all delta chunks into a string
  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") return result;
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || "";
        if (content) result += content;
      } catch { /* skip malformed chunk */ }
    }
  }

  return result;
}
