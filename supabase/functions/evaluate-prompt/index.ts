import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { userPrompt, badPrompt, context, goodExample, improvementHints } = await req.json();

    if (!userPrompt || !badPrompt) {
      return new Response(
        JSON.stringify({ error: "userPrompt and badPrompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Du bist ein KI-Prompting-Tutor. Der Benutzer übt, schlechte Prompts zu verbessern.

Originaler schlechter Prompt: "${badPrompt}"
Kontext der Übung: "${context}"
Verbesserungshinweise: ${JSON.stringify(improvementHints)}
Musterlösung: "${goodExample}"

Bewerte den verbesserten Prompt des Benutzers anhand von drei Kriterien:
1. hasContext - Hat der Prompt ausreichend Kontext (Situation, Zielgruppe, Hintergrund)?
2. isSpecific - Ist der Prompt spezifisch genug (konkrete Details, Zahlen, Anforderungen)?
3. hasConstraints - Definiert der Prompt Rahmenbedingungen (Einschränkungen, Format, Stil, Grenzen)?

Gib konstruktives Feedback auf Deutsch. Sei ermutigend aber ehrlich.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Bewerte diesen verbesserten Prompt:\n\n"${userPrompt}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "evaluate_prompt",
              description: "Return structured evaluation of the user's improved prompt",
              parameters: {
                type: "object",
                properties: {
                  hasContext: { type: "boolean", description: "Whether the prompt provides sufficient context" },
                  isSpecific: { type: "boolean", description: "Whether the prompt is specific enough" },
                  hasConstraints: { type: "boolean", description: "Whether the prompt defines constraints" },
                  feedback: { type: "string", description: "Constructive feedback in German, 2-3 sentences" },
                },
                required: ["hasContext", "isSpecific", "hasConstraints", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "evaluate_prompt" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI-Kontingent erschöpft. Bitte später erneut versuchen." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI-Bewertung fehlgeschlagen" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Unerwartete AI-Antwort" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const evaluation = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-prompt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unbekannter Fehler" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
