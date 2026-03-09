import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bookmark,
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
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { AnalyticsSection } from "@/components/AnalyticsSection";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import { promptLibrary } from "@/data/prompts";
import { exercises } from "@/data/exercises";
import { requiredModules, bonusModules } from "@/data/learningPath";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { useOrgContext } from "@/contexts/OrgContext";
import { useAppMode } from "@/contexts/AppModeContext";
import { useMySkills } from "@/hooks/useMySkills";
import { DailyChallengeCard } from "@/components/DailyChallenge";


function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuthContext();
  const { scope, isDepartment, scopeLabel } = useOrgContext();
  const { completedLessons, exercises: exerciseResults } = useSyncContext();
  const { skills: mySkills } = useMySkills();
  const { isWorkshop } = useAppMode();

  const stats = useMemo(() => {
    const uniqueDepartments = new Set(
      promptLibrary.filter((p) => p.department).map((p) => p.department)
    );
    const completedExercises = exercises.filter((ex) =>
      exerciseResults.some((r) => r.exercise_id === ex.id && r.score > 0)
    );

    return {
      totalPrompts: promptLibrary.length,
      departments: uniqueDepartments.size,
      exercisesDone: completedExercises.length,
      exercisesTotal: exercises.length,
    };
  }, [exerciseResults]);

  const popularPrompts = useMemo(() => {
    let candidates = promptLibrary;
    if (isDepartment) {
      const deptPrompts = candidates.filter((p) => p.targetDepartment === scope);
      const officialPrompts = candidates.filter((p) => p.official && p.targetDepartment !== scope);
      candidates = [...deptPrompts, ...officialPrompts];
    }
    if (candidates.length < 8) {
      const remaining = promptLibrary.filter((p) => !candidates.includes(p));
      candidates = [...candidates, ...remaining];
    }
    return candidates.slice(0, 8);
  }, [scope, isDepartment]);

  const onboardingProgress = useMemo(() => {
    const requiredDone = requiredModules.filter((m) => completedLessons.includes(m.id)).length;
    const bonusDone = bonusModules.filter((m) => completedLessons.includes(m.id)).length;
    const requiredPercent = Math.round((requiredDone / requiredModules.length) * 100);
    return { requiredPercent, requiredDone, bonusDone };
  }, [completedLessons]);

  const displayName = profile?.display_name;


  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isDepartment && <Badge className="bg-primary/10 text-primary text-xs mr-2">{scopeLabel}</Badge>}
          Dein Team hat {stats.totalPrompts} Prompts in der Library.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Gesamt Prompts" value={stats.totalPrompts} />
        <StatCard icon={Bookmark} label="Meine Skills" value={mySkills.length} />
        <StatCard icon={GraduationCap} label="Onboarding" value={`${onboardingProgress.requiredPercent}%`} />
        <StatCard icon={CheckCircle2} label="Übungen" value={`${stats.exercisesDone}/${stats.exercisesTotal}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Popular Prompts + Tagesaufgabe */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 pb-10 bg-card rounded-xl border border-border shadow-sm">
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
            <div className="space-y-1">
              {popularPrompts.map((prompt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm truncate">
                        {prompt.title}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                        {prompt.category}
                      </span>
                      <ConfidentialityBadge level={prompt.confidentiality || "open"} compact />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
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
              {isWorkshop ? (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/library")}
                >
                  <Users className="h-4 w-4" /> Use Cases
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/library?tab=skills")}
                >
                  <Bookmark className="h-4 w-4" /> Meine Skills
                </Button>
              )}
            </div>
          </Card>

          {/* Progress */}
          <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
            <h2 className="font-semibold text-base mb-4">Onboarding-Fortschritt</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Kern-Onboarding</span>
                  <span className="text-muted-foreground">
                    {onboardingProgress.requiredDone}/{requiredModules.length}
                  </span>
                </div>
                <Progress value={onboardingProgress.requiredPercent} className="h-2" />
              </div>
              {onboardingProgress.bonusDone > 0 && (
                <div className="text-xs text-muted-foreground">
                  + {onboardingProgress.bonusDone} Bonus-Module abgeschlossen
                </div>
              )}
              {onboardingProgress.requiredPercent < 100 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => navigate("/onboarding")}
                >
                  Onboarding fortsetzen
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Tagesaufgabe — volle Breite */}
      <DailyChallengeCard />

      {/* Analytics Section — collapsible */}
      <AnalyticsSection completedLessons={completedLessons} />
    </div>
  );
};

export default Dashboard;
