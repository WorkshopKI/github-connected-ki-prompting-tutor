import { supabase } from "@/integrations/supabase/client";

export type Msg = { role: "user" | "assistant" | "system"; content: string };

const PROXY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/llm-proxy`;

export async function streamChat({
  messages,
  model,
  signal,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  model?: string;
  signal?: AbortSignal;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string, status?: number) => void;
}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    onError("Bitte melde dich an, um KI-Funktionen zu nutzen.");
    return;
  }

  let resp: Response;
  try {
    resp = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ messages, model }),
      signal,
    });
  } catch (e) {
    if (signal?.aborted) { onDone(); return; }
    onError(e instanceof Error ? e.message : "Netzwerkfehler");
    return;
  }

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: "Unbekannter Fehler" }));
    onError(body.error ?? body.message ?? "LLM-Fehler", resp.status);
    return;
  }

  if (!resp.body) {
    onError("Keine Antwort vom Server");
    return;
  }

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
        if (json === "[DONE]") { onDone(); return; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buf = line + "\n" + buf;
          break;
        }
      }
    }
  } catch (e) {
    if (signal?.aborted) { onDone(); return; }
    onError(e instanceof Error ? e.message : "Stream-Fehler");
    return;
  }
  onDone();
}

export async function saveUserKey(apiKey: string): Promise<{ success?: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke("save-user-key", {
    body: { apiKey },
  });
  if (error) return { error: "Verbindungsfehler" };
  if (data?.error) return { error: data.error };
  return { success: true };
}
