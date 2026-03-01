import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ExerciseResult {
  exercise_id: number;
  score: number;
  feedback: string | null;
  user_prompt: string;
  completed_at: string;
}

export const useExerciseProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ExerciseResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProgress([]);
      return;
    }
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("exercise_progress")
      .select("exercise_id, score, feedback, user_prompt, completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (!error && data) {
      setProgress(data);
    }
    setLoading(false);
  };

  const saveProgress = async (exerciseId: number, userPrompt: string, score: number, feedback: string) => {
    if (!user) return;
    await supabase.from("exercise_progress").insert({
      user_id: user.id,
      exercise_id: exerciseId,
      user_prompt: userPrompt,
      score,
      feedback,
    });
    await fetchProgress();
  };

  const getBestScore = (exerciseId: number): number | null => {
    const results = progress.filter((p) => p.exercise_id === exerciseId);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.score));
  };

  return { progress, loading, saveProgress, getBestScore };
};
