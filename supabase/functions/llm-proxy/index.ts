import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function jsonRes(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/* ── AES-256-GCM decrypt ── */
async function decrypt(encrypted: string, keyHex: string): Promise<string> {
  const raw = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const data = raw.slice(12);
  const keyBuf = Uint8Array.from(keyHex.match(/.{2}/g)!, (h) => parseInt(h, 16));
  const key = await crypto.subtle.importKey("raw", keyBuf, "AES-GCM", false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plain);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    /* ── Auth ── */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return jsonRes({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return jsonRes({ error: "Unauthorized" }, 401);
    const userId = user.id;

    /* ── Request body ── */
    const { messages, model, reasoning } = await req.json();
    if (!messages || !Array.isArray(messages)) return jsonRes({ error: "messages required" }, 400);

    /* ── Load user API key config ── */
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: keyRow } = await admin
      .from("user_api_keys")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // If no key row exists, create one with defaults
    if (!keyRow) {
      await admin.from("user_api_keys").insert({ user_id: userId });
    }

    const activeSource = keyRow?.active_key_source ?? "provisioned";
    const budget = keyRow?.provisioned_key_budget ?? 5.0;

    /* ── Determine which key + endpoint to use ── */
    let apiKey: string;
    let endpoint: string;
    let isCustomKey = false;

    if (activeSource === "custom" && keyRow?.custom_key_active && keyRow?.custom_key_encrypted) {
      // Custom OpenRouter key
      const encKeyRaw = Deno.env.get("ENCRYPTION_KEY");
      const encKey = encKeyRaw?.trim();
      if (!encKey || encKey.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(encKey)) {
        return jsonRes({ error: "Server encryption key misconfigured (expected 64 hex chars)" }, 500);
      }
      try {
        apiKey = await decrypt(keyRow.custom_key_encrypted, encKey);
      } catch {
        return jsonRes({ error: "Eigener API-Key konnte nicht entschlüsselt werden." }, 400);
      }
      endpoint = "https://openrouter.ai/api/v1/chat/completions";
      isCustomKey = true;
    } else {
      // Provisioned: use Lovable AI gateway
      if (budget <= 0) {
        return jsonRes({
          error: "budget_exhausted",
          message: "Dein KI-Budget ist aufgebraucht. Hinterlege einen eigenen API-Key, um weiterzumachen.",
        }, 402);
      }
      apiKey = Deno.env.get("LOVABLE_API_KEY")!;
      if (!apiKey) return jsonRes({ error: "LOVABLE_API_KEY not configured" }, 500);
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
    }

    /* ── Call LLM ── */
    const llmModel = model || "google/gemini-3-flash-preview";
    const llmBody: Record<string, unknown> = {
      model: llmModel,
      messages,
      stream: true,
    };
    if (reasoning && typeof reasoning === "object") {
      llmBody.reasoning = reasoning;
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(llmBody),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return jsonRes({ error: "Zu viele Anfragen. Bitte warte kurz." }, 429);
      }
      if (response.status === 402) {
        return jsonRes({ error: "AI-Kontingent erschöpft." }, 402);
      }
      const text = await response.text();
      console.error("LLM error:", response.status, text);
      return jsonRes({ error: "LLM-Anfrage fehlgeschlagen" }, 500);
    }

    /* ── Deduct budget (provisioned only, rough estimate per request) ── */
    if (!isCustomKey && keyRow) {
      const cost = 0.01; // rough per-request cost
      await admin
        .from("user_api_keys")
        .update({
          provisioned_key_budget: Math.max(0, budget - cost),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    }

    /* ── Stream response back ── */
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("llm-proxy error:", e);
    return jsonRes({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
