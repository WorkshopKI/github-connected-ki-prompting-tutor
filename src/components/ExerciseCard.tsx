import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Copy, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: number;
  level: number;
  badPrompt: string;
  context: string;
  improvementHints: string[];
  goodExample: string;
  evaluationCriteria: {
    hasContext: boolean;
    isSpecific: boolean;
    hasConstraints: boolean;
  };
}

interface ExerciseCardProps {
  exercise: Exercise;
  bestScore?: number | null;
  onEvaluated?: (exerciseId: number, prompt: string, score: number, feedback: string) => void;
}

interface EvaluationResult {
  hasContext: boolean;
  isSpecific: boolean;
  hasConstraints: boolean;
  feedback: string;
}

export const ExerciseCard = ({ exercise, bestScore, onEvaluated }: ExerciseCardProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluatePrompt = async () => {
    if (!userPrompt.trim()) {
      toast.error("Bitte gib einen verbesserten Prompt ein!");
      return;
    }

    setIsEvaluating(true);

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-prompt", {
        body: {
          userPrompt: userPrompt.trim(),
          badPrompt: exercise.badPrompt,
          context: exercise.context,
          goodExample: exercise.goodExample,
          improvementHints: exercise.improvementHints,
        },
      });

      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }

      const result = data as EvaluationResult;
      setEvaluation(result);

      const score = [result.hasContext, result.isSpecific, result.hasConstraints].filter(Boolean).length;

      if (score === 3) {
        toast.success("Ausgezeichnet! Dein Prompt enthält alle wichtigen Elemente.");
      } else if (score === 2) {
        toast.info("Gut! Es fehlt noch ein Element für den perfekten Prompt.");
      } else {
        toast.error("Versuche, mehr Kontext und Details hinzuzufügen.");
      }

      onEvaluated?.(exercise.id, userPrompt, score, result.feedback);
    } catch (e) {
      console.error("Evaluation error:", e);
      toast.error("Bewertung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("In Zwischenablage kopiert!");
  };

  const resetExercise = () => {
    setUserPrompt("");
    setEvaluation(null);
    setShowSolution(false);
    setShowHints(false);
  };

  return (
    <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border relative">
      {bestScore !== null && bestScore !== undefined && (
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
          bestScore === 3 ? "bg-primary/20 text-primary" :
          bestScore === 2 ? "bg-accent/20 text-accent-foreground" :
          "bg-muted text-muted-foreground"
        }`}>
          Beste: {bestScore}/3 ⭐
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          {exercise.context}
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
            <X className="w-4 h-4" />
            Schlechter Prompt
          </div>
          <p className="text-foreground italic">"{exercise.badPrompt}"</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Dein verbesserter Prompt:
        </label>
        <Textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Schreibe hier deinen verbesserten Prompt..."
          className="min-h-[100px] mb-3"
          disabled={isEvaluating}
        />
        
        <div className="flex gap-2 flex-wrap">
          <Button onClick={evaluatePrompt} className="gap-2" disabled={isEvaluating}>
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isEvaluating ? "Wird bewertet..." : "Prompt bewerten"}
          </Button>
          <Button variant="outline" onClick={() => setShowHints(!showHints)} className="gap-2">
            {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showHints ? "Hinweise ausblenden" : "Hinweise anzeigen"}
          </Button>
          <Button variant="outline" onClick={() => setShowSolution(!showSolution)} className="gap-2">
            {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showSolution ? "Lösung ausblenden" : "Musterlösung anzeigen"}
          </Button>
          {(evaluation || userPrompt) && (
            <Button variant="ghost" onClick={resetExercise}>
              Zurücksetzen
            </Button>
          )}
        </div>
      </div>

      {showHints && (
        <div className="mb-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="text-sm font-semibold text-accent-foreground mb-2">
            💡 Verbesserungshinweise:
          </div>
          <ul className="space-y-1">
            {exercise.improvementHints.map((hint, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-accent-foreground">•</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {evaluation && (
        <div className="mb-4 bg-background/50 border border-border rounded-lg p-4">
          <div className="text-sm font-semibold mb-3">KI-Feedback:</div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              {evaluation.hasContext ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <X className="w-5 h-5 text-destructive" />
              )}
              <span className="text-sm">
                Kontext: {evaluation.hasContext ? "Gut beschrieben" : "Fehlt oder zu vage"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {evaluation.isSpecific ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <X className="w-5 h-5 text-destructive" />
              )}
              <span className="text-sm">
                Spezifität: {evaluation.isSpecific ? "Ausreichend spezifisch" : "Zu allgemein"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {evaluation.hasConstraints ? (
                <Check className="w-5 h-5 text-primary" />
              ) : (
                <X className="w-5 h-5 text-destructive" />
              )}
              <span className="text-sm">
                Rahmenbedingungen: {evaluation.hasConstraints ? "Klar definiert" : "Nicht angegeben"}
              </span>
            </div>
          </div>
          {evaluation.feedback && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground">
              {evaluation.feedback}
            </div>
          )}
        </div>
      )}

      {showSolution && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-primary flex items-center gap-2">
              <Check className="w-4 h-4" />
              Musterlösung
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(exercise.goodExample)}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Kopieren
            </Button>
          </div>
          <p className="text-foreground italic">"{exercise.goodExample}"</p>
        </div>
      )}
    </div>
  );
};
