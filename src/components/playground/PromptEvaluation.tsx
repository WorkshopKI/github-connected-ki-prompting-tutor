import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

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
            Bewerte Prompt...
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3 mr-1" />
            Prompt bewerten
          </>
        )}
      </Button>

      {result && (
        <Card className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">Qualität:</span>
            <Badge
              variant={score === 3 ? "default" : "secondary"}
              className="text-xs"
            >
              {score}/3
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <CriterionBadge label="Kontext" met={result.hasContext} />
            <CriterionBadge label="Spezifik" met={result.isSpecific} />
            <CriterionBadge label="Constraints" met={result.hasConstraints} />
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {result.feedback}
          </p>
        </Card>
      )}
    </div>
  );
};

function CriterionBadge({ label, met }: { label: string; met: boolean }) {
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${
        met
          ? "bg-green-500/10 text-green-700 dark:text-green-400"
          : "bg-red-500/10 text-red-700 dark:text-red-400"
      }`}
    >
      {met ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {label}
    </div>
  );
}
