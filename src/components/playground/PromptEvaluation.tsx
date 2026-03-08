import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface EvaluationResult {
  hasContext: boolean;
  isSpecific: boolean;
  hasConstraints: boolean;
  feedback: string;
}

export interface PromptEvaluationProps {
  prompt: string;
  model?: string;
}

function CriterionBar({ label, met }: { label: string; met: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className={cn(
          "text-[11px] font-semibold",
          met ? "text-primary" : "text-red-600 dark:text-red-400"
        )}>
          {met ? "✓ Gut" : "✗ Fehlt"}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            met ? "bg-primary w-full" : "bg-red-500/60 w-[15%]"
          )}
        />
      </div>
    </div>
  );
}

export const PromptEvaluation = ({ prompt, model }: PromptEvaluationProps) => {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const evaluate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Bitte melde dich an.");
        setLoading(false);
        return;
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evaluate-prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            userPrompt: prompt,
            badPrompt: "Ein unspezifischer Prompt ohne Kontext.",
            context: "Freie Prompt-Bewertung im Playground",
            goodExample: "",
            improvementHints: [
              "Kontext hinzufügen",
              "Spezifischer werden",
              "Constraints definieren",
            ],
            model: model || "google/gemini-3-flash-preview",
          }),
        }
      );

      if (!resp.ok) {
        if (resp.status === 402) {
          toast.error("KI-Budget aufgebraucht.");
        } else if (resp.status === 429) {
          toast.error("Zu viele Anfragen. Bitte warte kurz.");
        } else {
          toast.error("Bewertung fehlgeschlagen.");
        }
        setLoading(false);
        return;
      }

      const data = await resp.json();
      setResult(data);
    } catch {
      toast.error("Verbindungsfehler bei der Bewertung.");
    }
    setLoading(false);
  };

  const score = result
    ? [result.hasContext, result.isSpecific, result.hasConstraints].filter(Boolean).length
    : 0;

  return (
    <div className="space-y-2">
      <Button
        onClick={evaluate}
        disabled={loading || !prompt.trim()}
        variant="outline"
        size="sm"
        className="text-xs w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Wird geprüft...
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 mr-1" />
            Prompt prüfen
          </>
        )}
      </Button>

      {result && (
        <Card className="p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold">Prompt-Check</span>
            <span className={cn(
              "text-xs font-bold",
              score === 3 ? "text-primary" : score >= 2 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
            )}>
              {score}/3
            </span>
          </div>

          <div className="space-y-2">
            <CriterionBar label="Kontext" met={result.hasContext} />
            <CriterionBar label="Spezifik" met={result.isSpecific} />
            <CriterionBar label="Constraints" met={result.hasConstraints} />
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {result.feedback}
          </p>
        </Card>
      )}
    </div>
  );
};
