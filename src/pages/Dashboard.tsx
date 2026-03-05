import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Building2,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/StatCard";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import { promptLibrary } from "@/data/prompts";
import { exercises } from "@/data/exercises";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const { completedLessons, exercises: exerciseResults } = useSyncContext();

  const stats = useMemo(() => {
    const uniqueDepartments = new Set(
      promptLibrary.filter((p) => p.department).map((p) => p.department)
    );
    const completedExercises = exercises.filter((ex) =>
      exerciseResults.some((r) => r.exercise_id === ex.id && r.score > 0)
    );
    const totalLessons = 8;
    const onboardingPercent = Math.round(
      (completedLessons.length / totalLessons) * 100
    );

    return {
      totalPrompts: promptLibrary.length,
      departments: uniqueDepartments.size,
      onboardingPercent,
      exercisesDone: completedExercises.length,
      exercisesTotal: exercises.length,
    };
  }, [completedLessons, exerciseResults]);

  const popularPrompts = useMemo(() => {
    const official = promptLibrary.filter((p) => p.official);
    if (official.length >= 5) return official.slice(0, 5);
    const org = promptLibrary.filter((p) => p.level === "organisation");
    if (org.length >= 5) return org.slice(0, 5);
    return promptLibrary.slice(0, 5);
  }, []);

  const actaProgress = useMemo(() => {
    const actaLessons = completedLessons.filter((id) =>
      id.startsWith("acta")
    );
    const advancedLessons = completedLessons.filter((id) =>
      id.startsWith("advanced")
    );
    const completedEx = exercises.filter((ex) =>
      exerciseResults.some((r) => r.exercise_id === ex.id && r.score > 0)
    );
    return {
      acta: Math.min(actaLessons.length * 50, 100),
      exercises: Math.round(
        (completedEx.length / exercises.length) * 100
      ),
      advanced: Math.min(advancedLessons.length * 50, 100),
    };
  }, [completedLessons, exerciseResults]);

  const displayName = profile?.display_name;

  const levelBadgeColors: Record<string, string> = {
    alltag: "bg-muted text-muted-foreground",
    beruf: "bg-muted text-muted-foreground",
    organisation: "bg-primary/10 text-primary",
    blueprint: "bg-primary/10 text-primary",
    research: "bg-muted text-muted-foreground",
    websuche: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Dein Team hat {stats.totalPrompts} Prompts in der Library.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Gesamt Prompts" value={stats.totalPrompts} />
        <StatCard icon={Building2} label="Abteilungen" value={stats.departments} />
        <StatCard icon={GraduationCap} label="Onboarding" value={`${stats.onboardingPercent}%`} />
        <StatCard icon={CheckCircle2} label="Übungen" value={`${stats.exercisesDone}/${stats.exercisesTotal}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Popular Prompts */}
        <div className="lg:col-span-2">
          <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-base">Beliebte Prompts</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/library")}
                className="gap-1 text-primary"
              >
                Alle anzeigen <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {popularPrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {prompt.title}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {prompt.category}
                      </span>
                      {prompt.department && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {prompt.department}
                        </span>
                      )}
                      {prompt.level && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            levelBadgeColors[prompt.level] ||
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {prompt.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
            <h2 className="font-semibold text-base mb-4">Schnellzugriff</h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/library")}
              >
                <BookOpen className="h-4 w-4" /> Neuen Prompt erstellen
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/onboarding")}
              >
                <GraduationCap className="h-4 w-4" /> Onboarding starten
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/playground")}
              >
                <Sparkles className="h-4 w-4" /> Prompt-Labor öffnen
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate("/workspace")}
              >
                <Users className="h-4 w-4" /> Team Use Cases
              </Button>
            </div>
          </Card>

          {/* Progress */}
          <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
            <h2 className="font-semibold text-base mb-4">Lernfortschritt</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>ACTA-Methode</span>
                  <span className="text-muted-foreground">
                    {actaProgress.acta}%
                  </span>
                </div>
                <Progress value={actaProgress.acta} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Übungen</span>
                  <span className="text-muted-foreground">
                    {actaProgress.exercises}%
                  </span>
                </div>
                <Progress value={actaProgress.exercises} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Advanced Techniques</span>
                  <span className="text-muted-foreground">
                    {actaProgress.advanced}%
                  </span>
                </div>
                <Progress value={actaProgress.advanced} className="h-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
