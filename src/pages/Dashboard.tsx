import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Check,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import { useOrgContext } from "@/contexts/OrgContext";
import { useLernpfadProgress } from "@/hooks/useLernpfadProgress";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { lernpfadStufen, requiredModules } from "@/data/learningPath";
import { promptLibrary } from "@/data/prompts";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { PageHeader } from "@/components/PageHeader";
import { DailyChallengeCard } from "@/components/DailyChallenge";
import { ComparisonExercise } from "@/components/ComparisonExercise";
import { comparisonExercises } from "@/data/comparisonExercises";
import { loadConstraints } from "@/services/constraintService";
import { loadKIContext } from "@/services/kiContextService";
import { getActiveRuleCount } from "@/lib/contextBuilder";
import { LS_KEYS } from "@/lib/constants";
import { loadArrayFromStorage, saveToStorage } from "@/lib/storage";

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
  const { completedLessons } = useSyncContext();
  const { isCompleted: dailyCompleted, streak: dailyStreak } = useDailyChallenge();

  const displayName = profile?.display_name;

  // Lernpfad
  const stufeProgress = useLernpfadProgress();
  const currentProgress = stufeProgress.find((s) => s.isCurrent) || stufeProgress[0];
  const currentStufeDef = lernpfadStufen[currentProgress.nr - 1];

  // Constraints & KI-Kontext
  const constraints = loadConstraints();
  const constraintCount = constraints.length;
  const kiContext = loadKIContext();
  const activeRuleCount = getActiveRuleCount();

  // Popular prompts
  const popularPrompts = useMemo(() => {
    let candidates = promptLibrary;
    if (isDepartment) {
      const deptPrompts = candidates.filter((p) => p.targetDepartment === scope);
      const officialPrompts = candidates.filter(
        (p) => p.official && p.targetDepartment !== scope
      );
      candidates = [...deptPrompts, ...officialPrompts];
    }
    if (candidates.length < 6) {
      const remaining = promptLibrary.filter((p) => !candidates.includes(p));
      candidates = [...candidates, ...remaining];
    }
    return candidates.slice(0, 6);
  }, [scope, isDepartment]);

  // Next step
  const nextStep = useMemo(() => {
    if (currentProgress.nr === 1) {
      const nextModule = requiredModules.find(
        (m) => !completedLessons.includes(m.id)
      );
      if (nextModule) {
        return {
          label: `Stufe 1 · ${nextModule.type === "theorie" ? "Theorie" : "Praxis"} · ${nextModule.duration}`,
          title: nextModule.title,
          action: () => navigate("/onboarding"),
          actionLabel: "Starten",
        };
      }
    }
    if (currentProgress.nr === 2) {
      return {
        label: "Stufe 2 · Bewerten",
        title: "Nutze die Prüfen-Funktion in der Werkstatt",
        action: () => navigate("/playground"),
        actionLabel: "Werkstatt öffnen",
      };
    }
    if (currentProgress.nr === 3) {
      return {
        label: "Stufe 3 · Unterscheiden",
        title: "Trainiere dein Qualitätsurteil",
        action: () => setCompDialogOpen(true),
        actionLabel: "Übung starten",
      };
    }
    if (currentProgress.nr === 4) {
      return {
        label: "Stufe 4 · Artikulieren",
        title: "Iteriere in der Werkstatt und speichere Qualitätsregeln",
        action: () => navigate("/playground"),
        actionLabel: "Werkstatt öffnen",
      };
    }
    if (currentProgress.nr === 5) {
      const hasProfile =
        kiContext.profile.abteilung || kiContext.profile.fachgebiet;
      if (!hasProfile) {
        return {
          label: "Stufe 5 · Systematisieren",
          title: "Richte deinen persönlichen KI-Kontext ein",
          action: () => navigate("/settings"),
          actionLabel: "Einstellungen öffnen",
        };
      }
      return {
        label: "Stufe 5 · Systematisieren",
        title: "Erstelle Arbeitsregeln für dein Fachgebiet",
        action: () => navigate("/settings"),
        actionLabel: "Regeln bearbeiten",
      };
    }
    return null;
  }, [currentProgress, completedLessons, kiContext]);

  // Erkenne den Unterschied
  const [compDialogOpen, setCompDialogOpen] = useState(false);
  const comparisonHistory = useMemo<string[]>(
    () => loadArrayFromStorage<string>(LS_KEYS.COMPARISON_HISTORY),
    []
  );
  const [compLocalHistory, setCompLocalHistory] =
    useState<string[]>(comparisonHistory);

  const nextCompExercise = useMemo(() => {
    const remaining = comparisonExercises.filter(
      (e) => !compLocalHistory.includes(e.id)
    );
    return remaining.length > 0 ? remaining[0] : null;
  }, [compLocalHistory]);

  const allCompCompleted = !nextCompExercise;

  const handleComparisonComplete = useCallback(
    (correct: boolean) => {
      if (!nextCompExercise) return;
      const updated = [...compLocalHistory, nextCompExercise.id];
      setCompLocalHistory(updated);
      saveToStorage(LS_KEYS.COMPARISON_HISTORY, updated);
    },
    [nextCompExercise, compLocalHistory]
  );

  const handleResetComparison = useCallback(() => {
    setCompLocalHistory([]);
    saveToStorage(LS_KEYS.COMPARISON_HISTORY, []);
  }, []);

  // Template expand/collapse
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const visiblePrompts = showAllTemplates ? popularPrompts : popularPrompts.slice(0, 5);

  // Daily challenge dialog
  const [dailyDialogOpen, setDailyDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1. Begrüßung — als Seitentitel, nicht kleiner als andere Titel */}
      <PageHeader
        eyebrow={isDepartment ? scopeLabel : undefined}
        title={`${getGreeting()}${displayName ? `, ${displayName}` : ""}`}
        description="Hier siehst du deinen nächsten Schritt, die Übungen für heute und deinen Fortschritt."
      />

      {/* 2. Nächster Schritt — die eine Primäraktion der Startseite */}
      {nextStep && (
        <section
          aria-label="Dein nächster Schritt"
          className="flex flex-col gap-4 rounded-lg border border-border bg-brand-soft px-6 py-5 sm:flex-row sm:items-center sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-brand-soft-ink">Dein nächster Schritt · {nextStep.label}</p>
            <h2 className="mt-1 text-xl font-semibold leading-7">{nextStep.title}</h2>
            {currentProgress.progress > 0 && currentProgress.progress < 100 && (
              <div className="mt-3 flex max-w-xs items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card" role="progressbar" aria-valuenow={currentProgress.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt der Stufe">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${currentProgress.progress}%` }} />
                </div>
                <span className="text-sm font-semibold tabular-nums">{currentProgress.progress} %</span>
              </div>
            )}
          </div>
          <Button className="shrink-0 gap-1.5" onClick={nextStep.action}>
            {nextStep.actionLabel} <ArrowRight className="w-4 h-4" />
          </Button>
        </section>
      )}

      {/* 3. Zwei-Spalten Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Links (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Heute üben */}
          <section>
            <h2 className="eyebrow mb-3">Heute üben</h2>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                onClick={() => setDailyDialogOpen(true)}
                className="flex w-full items-center gap-3.5 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <CalendarCheck className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold leading-6">Tagesaufgabe</span>
                  <span className="block text-sm text-muted-foreground">
                    {dailyCompleted ? "Für heute erledigt" : "Eine kurze Aufgabe, jeden Tag neu"}
                    {dailyStreak > 0 && ` · ${dailyStreak} Tage in Folge`}
                  </span>
                </span>
                {dailyCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" strokeWidth={1.75} aria-label="Erledigt" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
                )}
              </button>
              <button
                onClick={() => !allCompCompleted ? setCompDialogOpen(true) : handleResetComparison()}
                className="flex w-full items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-accent"
              >
                <Target className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.75} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold leading-6">Erkenne den Unterschied</span>
                  <span className="block text-sm text-muted-foreground">
                    {allCompCompleted
                      ? "Alle Vergleiche gelöst · erneut starten"
                      : `${compLocalHistory.length} von ${comparisonExercises.length} Vergleichen gelöst`}
                  </span>
                </span>
                {allCompCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" strokeWidth={1.75} aria-label="Erledigt" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
                )}
              </button>
            </div>
          </section>

          {/* Häufig genutzte Vorlagen */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="eyebrow">Häufig genutzte Vorlagen</h2>
              <Button
                variant="link"
                size="sm"
                className="h-auto gap-1 p-0 text-sm text-brand-ink"
                onClick={() => navigate("/library")}
              >
                Alle Vorlagen <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {visiblePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/playground?libraryTitle=${encodeURIComponent(prompt.title)}`)}
                  className={`flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-accent${i < visiblePrompts.length - 1 ? " border-b border-border" : ""}`}
                >
                  <span className="flex-1 truncate text-[15px] font-semibold leading-6">{prompt.title}</span>
                  <span className="hidden shrink-0 text-[13px] text-muted-foreground sm:inline">{prompt.category}</span>
                  <ConfidentialityBadge level={prompt.confidentiality || "open"} compact />
                  <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
                </button>
              ))}
            </div>
            {popularPrompts.length > 5 && (
              <button
                onClick={() => setShowAllTemplates(!showAllTemplates)}
                className="mt-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {showAllTemplates ? "Weniger anzeigen" : `Alle ${popularPrompts.length} anzeigen`}
              </button>
            )}
          </section>
        </div>

        {/* Rechts (1/3) — alle Karten immer sichtbar, kein Springen */}
        <div className="flex flex-col gap-4">
          {/* Lernpfad: Farbe zeigt Zustand (erledigt / aktuell / offen / gesperrt), nicht die Stufe */}
          <Card className="card-section p-4">
            <h2 className="mb-3 text-base font-semibold">Lernpfad</h2>
            <ol className="space-y-2.5">
              {lernpfadStufen.map((stufe, i) => {
                const sp = stufeProgress[i];
                const done = sp.progress === 100;
                const locked = !sp.unlocked && !sp.isCurrent && !done;
                return (
                  <li key={stufe.nr} className="flex items-center gap-2.5" aria-current={sp.isCurrent ? "step" : undefined}>
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[11px] font-semibold ${
                        done
                          ? "border-success bg-success text-card"
                          : sp.isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : locked
                              ? "border-dashed border-input text-ink-subtle"
                              : "border-input text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : locked ? <Lock className="h-2.5 w-2.5" /> : stufe.nr}
                    </span>
                    <span className={`flex-1 text-sm ${sp.isCurrent ? "font-semibold" : locked ? "text-ink-subtle" : ""}`}>
                      {stufe.title}
                    </span>
                    {sp.isCurrent && sp.progress > 0 && sp.progress < 100 && (
                      <span className="text-[13px] font-semibold tabular-nums text-brand-ink">{sp.progress} %</span>
                    )}
                    {done && <span className="text-[13px] text-success">Erledigt</span>}
                  </li>
                );
              })}
            </ol>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full gap-1 text-sm"
              onClick={() => navigate("/onboarding")}
            >
              Zum Lernpfad <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          {/* KI-Kontext */}
          <Card className="card-section p-4">
            <h2 className="mb-1 text-base font-semibold">Mein KI-Kontext</h2>
            {kiContext.profile.abteilung ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{kiContext.profile.abteilung}</p>
                {activeRuleCount > 0 && (
                  <p className="flex items-center gap-1.5 text-[13px] text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {activeRuleCount} Regeln aktiv
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sag der KI einmal, wer du bist und wie du arbeitest – sie berücksichtigt es dann bei jeder Anfrage.
                {currentProgress.nr < 4 && <span className="mt-1 block text-[13px] text-ink-subtle">Empfohlen ab Stufe 4 · Artikulieren</span>}
              </p>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full gap-1 text-sm"
              onClick={() => navigate("/settings")}
            >
              {kiContext.profile.abteilung ? "Bearbeiten" : "KI-Kontext einrichten"}
            </Button>
          </Card>

          {/* Qualitätsregeln */}
          <Card className="card-section p-4">
            <h2 className="mb-1 text-base font-semibold">Qualitätsregeln</h2>
            {constraintCount > 0 ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{constraintCount} Regeln gespeichert</p>
                {constraints.filter((c) => c.source === "rejection").length > 0 && (
                  <p className="text-[13px] text-muted-foreground">
                    {constraints.filter((c) => c.source === "rejection").length} davon aus abgelehnten Antworten gelernt
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Regeln entstehen aus Antworten, die du ablehnst. Sie sorgen dafür, dass derselbe Fehler nicht zweimal passiert.
                {currentProgress.nr < 3 && <span className="mt-1 block text-[13px] text-ink-subtle">Empfohlen ab Stufe 3 · Unterscheiden</span>}
              </p>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full gap-1 text-sm"
              onClick={() => navigate("/library?section=constraints")}
            >
              {constraintCount > 0 ? "Regeln ansehen" : "Erste Regel erstellen"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Dialoge */}
      <Dialog open={dailyDialogOpen} onOpenChange={setDailyDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tagesaufgabe</DialogTitle>
            <DialogDescription>
              Löse die heutige Aufgabe und verbessere deine KI-Kompetenz.
            </DialogDescription>
          </DialogHeader>
          <DailyChallengeCard />
        </DialogContent>
      </Dialog>

      <Dialog open={compDialogOpen} onOpenChange={setCompDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Erkenne den Unterschied</DialogTitle>
            <DialogDescription>
              Vergleiche zwei KI-Outputs und finde den professionellen.
            </DialogDescription>
          </DialogHeader>
          {nextCompExercise && (
            <ComparisonExercise
              key={nextCompExercise.id}
              exercise={nextCompExercise}
              onComplete={handleComparisonComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
