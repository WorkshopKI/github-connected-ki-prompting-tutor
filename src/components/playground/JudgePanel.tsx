import { useState } from "react";
import { Scale, Sparkles, AlertTriangle, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JudgeResult {
  overallScore: number;
  dimensions: Record<string, { score: number; feedback: string }>;
  issues: string[];
  suggestion: string;
}

interface Props {
  prompt: string;
  output: string;
  model: string;
}

const dimensionLabels: Record<string, string> = {
  structure: "Struktur & Format",
  completeness: "Vollständigkeit",
  compliance: "Compliance & Leitplanken",
  quality: "Sprachliche Qualität",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export const JudgePanel = ({ prompt, output, model }: Props) => {
  const [isJudging, setIsJudging] = useState(false);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [additionalCriteria, setAdditionalCriteria] = useState("");

  const handleJudge = async () => {
    if (!output.trim()) return;
    setIsJudging(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-prompt", {
        body: {
          mode: "judge-output",
          prompt,
          output,
          model,
          criteria: additionalCriteria || undefined,
        },
      });
      if (error) throw error;
      setResult(data);
    } catch (err) {
      toast.error("Judge-Bewertung fehlgeschlagen");
      console.error(err);
    } finally {
      setIsJudging(false);
    }
  };

  return (
    <Card className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Judge-Bewertung</span>
        <Badge variant="outline" className="text-[10px]">Referenz-KI</Badge>
      </div>

      {!result ? (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Lass den Output von einer leistungsstarken Referenz-KI bewerten.
            Die Bewertung prüft Struktur, Vollständigkeit, Compliance und Qualität.
          </p>
          <Textarea
            value={additionalCriteria}
            onChange={(e) => setAdditionalCriteria(e.target.value)}
            placeholder="Optionale Bewertungskriterien (z.B. 'Muss barrierefrei formuliert sein', 'Max. 200 Wörter')"
            className="text-xs min-h-[60px]"
          />
          <Button
            size="sm"
            onClick={handleJudge}
            disabled={isJudging || !output.trim()}
            className="gap-1.5"
          >
            {isJudging ? (
              <><Sparkles className="w-3.5 h-3.5 animate-spin" /> Bewertung läuft...</>
            ) : (
              <><Scale className="w-3.5 h-3.5" /> Output bewerten</>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Gesamtscore */}
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-bold ${scoreColor(result.overallScore)}`}>
              {result.overallScore}%
            </div>
            <div className="flex-1">
              <Progress value={result.overallScore} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-1">
                Bewertet auf Modell: {model}
              </p>
            </div>
          </div>

          {/* Dimensionen */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(result.dimensions).map(([key, dim]) => (
              <div key={key} className="bg-muted/30 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium">{dimensionLabels[key] || key}</span>
                  <span className={`text-xs font-bold ${scoreColor(dim.score)}`}>{dim.score}%</span>
                </div>
                <Progress value={dim.score} className="h-1 mb-1" />
                <p className="text-[10px] text-muted-foreground">{dim.feedback}</p>
              </div>
            ))}
          </div>

          {/* Probleme */}
          {result.issues.length > 0 && (
            <div className="space-y-1">
              {result.issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{issue}</span>
                </div>
              ))}
            </div>
          )}

          {/* Verbesserungstipp */}
          {result.suggestion && (
            <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{result.suggestion}</p>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setResult(null)} className="text-xs">
            Neu bewerten
          </Button>
        </div>
      )}
    </Card>
  );
};
