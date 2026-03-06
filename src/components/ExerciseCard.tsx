import { useState, useMemo } from "react";
import { Check, X, ChevronDown, ChevronUp, Copy, Loader2, Sparkles, MessageSquare, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOrgContext } from "@/contexts/OrgContext";
import { streamChat, type Msg } from "@/services/llmService";

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
  departmentVariants?: {
    department: string;
    badPrompt: string;
    context: string;
    improvementHints: string[];
    goodExample: string;
  }[];
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
  const { profile } = useAuthContext();
  const { scope, isDepartment } = useOrgContext();

  const effectiveExercise = useMemo(() => {
    if (isDepartment && exercise.departmentVariants) {
      const variant = exercise.departmentVariants.find((v) => v.department === scope);
      if (variant) {
        return {
          ...exercise,
          badPrompt: variant.badPrompt,
          context: variant.context,
          improvementHints: variant.improvementHints,
          goodExample: variant.goodExample,
        };
      }
    }
    return exercise;
  }, [exercise, scope, isDepartment]);
  const [userPrompt, setUserPrompt] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [coachSuggestion, setCoachSuggestion] = useState("");
  const [isCoaching, setIsCoaching] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [teamReviewNote, setTeamReviewNote] = useState("");

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
          badPrompt: effectiveExercise.badPrompt,
          context: effectiveExercise.context,
          goodExample: effectiveExercise.goodExample,
          improvementHints: effectiveExercise.improvementHints,
          model: profile?.preferred_model ?? "google/gemini-3-flash-preview",
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

  const askCoach = async () => {
    const promptText = userPrompt.trim();
    if (!promptText) {
      toast.error("Bitte gib zuerst einen Prompt-Entwurf ein!");
      return;
    }

    setIsCoaching(true);
    setShowCoach(true);
    setCoachSuggestion("");

    const systemMsg: Msg = {
      role: "system",
      content: `Du bist ein Experte für Prompt-Engineering und ein freundlicher Coach. Der Nutzer versucht, einen schlechten Prompt zu verbessern.

Kontext der Übung: ${effectiveExercise.context}
Schlechter Original-Prompt: "${effectiveExercise.badPrompt}"
Verbesserungshinweise: ${effectiveExercise.improvementHints.join(", ")}

Deine Aufgabe:
1. Analysiere den Prompt-Entwurf des Nutzers
2. Identifiziere 2-3 konkrete Schwachstellen (Ambiguitäten, fehlender Kontext, fehlende Constraints)
3. Stelle gezielte Rückfragen, die dem Nutzer helfen, den Prompt selbst zu verbessern
4. Schlage am Ende einen optimierten Prompt vor, der alle Schwachstellen behebt

Antworte auf Deutsch, freundlich und konstruktiv. Formatiere deine Antwort klar mit Überschriften.`
    };

    const userMsg: Msg = {
      role: "user",
      content: `Hier ist mein Prompt-Entwurf: "${promptText}"\n\nBitte analysiere ihn und hilf mir, ihn zu verbessern.`
    };

    let accumulated = "";
    await streamChat({
      messages: [systemMsg, userMsg],
      model: profile?.preferred_model ?? "google/gemini-3-flash-preview",
      onDelta: (text) => {
        accumulated += text;
        setCoachSuggestion(accumulated);
      },
      onDone: () => {
        setIsCoaching(false);
      },
      onError: (error) => {
        setIsCoaching(false);
        toast.error(error);
      },
    });
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
    setCoachSuggestion("");
    setShowCoach(false);
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
          {effectiveExercise.context}
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
            <X className="w-4 h-4" />
            Schlechter Prompt
          </div>
          <p className="text-foreground italic">"{effectiveExercise.badPrompt}"</p>
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
          <Button
            variant="outline"
            onClick={askCoach}
            className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
            disabled={isCoaching || isEvaluating}
          >
            {isCoaching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isCoaching ? "Coach denkt..." : "KI-Coach fragen"}
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
            {effectiveExercise.improvementHints.map((hint, idx) => (
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
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">KI-Feedback:</div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              Score: {[evaluation.hasContext, evaluation.isSpecific, evaluation.hasConstraints].filter(Boolean).length}/3
            </div>
          </div>
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

      {evaluation && (
        <div className="mb-4 border border-border/80 rounded-lg p-4 bg-muted/20">
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Team-Review (optional)
          </div>
          <Textarea
            value={teamReviewNote}
            onChange={(e) => setTeamReviewNote(e.target.value)}
            placeholder="Notiere hier Team-Feedback oder Freigabehinweise für diesen Prompt..."
            className="min-h-[76px]"
          />
        </div>
      )}

      {showCoach && coachSuggestion && (
        <div className="mb-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              KI-Coach: Reverse Prompting
              {isCoaching && <Loader2 className="w-3 h-3 animate-spin" />}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCoach(false)}
              className="text-xs"
            >
              Ausblenden
            </Button>
          </div>
          <div className="prose prose-sm max-w-none text-foreground text-sm leading-relaxed whitespace-pre-wrap">
            {coachSuggestion}
          </div>
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
              onClick={() => copyToClipboard(effectiveExercise.goodExample)}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Kopieren
            </Button>
          </div>
          <p className="text-foreground italic">"{effectiveExercise.goodExample}"</p>
        </div>
      )}
    </div>
  );
};
