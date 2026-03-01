import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ExerciseResult {
  exercise_id: number;
  score: number;
  feedback: string | null;
  user_prompt: string;
  completed_at: string;
}

interface WerkstattProgress {
  exercises?: ExerciseResult[];
}

const LOCAL_KEY = "werkstatt_progress";

function getLocalProgress(): ExerciseResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed: WerkstattProgress = JSON.parse(raw);
    return parsed.exercises ?? [];
  } catch {
    return [];
  }
}

function saveLocalProgress(results: ExerciseResult[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ exercises: results }));
}

export const useExerciseProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ExerciseResult[]>(getLocalProgress);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_progress")
      .select("werkstatt_progress")
      .eq("user_id", user.id)
      .single();

    if (!error && data?.werkstatt_progress) {
      const wp = data.werkstatt_progress as WerkstattProgress;
      const cloudResults = wp.exercises ?? [];
      // Merge: cloud wins for same exercise_id, keep local-only entries
      const merged = [...cloudResults];
      const cloudIds = new Set(cloudResults.map(r => `${r.exercise_id}-${r.completed_at}`));
      for (const local of getLocalProgress()) {
        if (!cloudIds.has(`${local.exercise_id}-${local.completed_at}`)) {
          merged.push(local);
        }
      }
      setProgress(merged);
      saveLocalProgress(merged);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setProgress(getLocalProgress());
      return;
    }
    fetchProgress();
  }, [user, fetchProgress]);

  const saveProgress = async (exerciseId: number, userPrompt: string, score: number, feedback: string) => {
    const newResult: ExerciseResult = {
      exercise_id: exerciseId,
      score,
      feedback,
      user_prompt: userPrompt,
      completed_at: new Date().toISOString(),
    };

    const updated = [...progress, newResult];
    setProgress(updated);
    saveLocalProgress(updated);

    if (user) {
      await supabase
        .from("user_progress")
        .update({
          werkstatt_progress: JSON.parse(JSON.stringify({ exercises: updated })),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    }
  };

  const getBestScore = (exerciseId: number): number | null => {
    const results = progress.filter((p) => p.exercise_id === exerciseId);
    if (results.length === 0) return null;
    return Math.max(...results.map((r) => r.score));
  };

  return { progress, loading, saveProgress, getBestScore };
};
