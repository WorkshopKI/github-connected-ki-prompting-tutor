import { useState, useMemo } from "react";
import { CheckCircle2, Play, PartyPopper, BookOpen, Beaker, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useSyncContext } from "@/contexts/SyncContext";
import { requiredModules, bonusModules, learningModules } from "@/data/learningPath";
import { ACTAIntroduction } from "@/components/ACTAIntroduction";
import { RAKETEIntroduction } from "@/components/RAKETEIntroduction";
import { PracticeAreaCompact } from "@/components/PracticeAreaCompact";
import { AdvancedTechniquesModule } from "@/components/AdvancedTechniquesModule";
import { DataPrivacyIntro } from "@/components/DataPrivacyIntro";
import { WorkflowBuilderModule } from "@/components/WorkflowBuilderModule";
import { RAKETEIntroduction } from "@/components/RAKETEIntroduction";

const componentMap: Record<string, React.ComponentType> = {
  ACTAIntroduction: ACTAIntroduction,
  RAKETEIntroduction: RAKETEIntroduction,
  PracticeAreaCompact: PracticeAreaCompact,
  RAKETEIntroduction: RAKETEIntroduction,
  AdvancedTechniquesModule: AdvancedTechniquesModule,
  DataPrivacyIntro: DataPrivacyIntro,
  WorkflowBuilderModule: WorkflowBuilderModule,
};

const typeBadgeColors: Record<string, string> = {
  theorie: "bg-muted text-muted-foreground",
  praxis: "bg-primary/10 text-primary",
  quiz: "bg-muted text-muted-foreground",
  pruefung: "bg-primary/10 text-primary",
};

const typeLabels: Record<string, string> = {
  theorie: "Theorie",
  praxis: "Praxis",
  quiz: "Quiz",
  pruefung: "Prüfung",
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { completedLessons, markLessonComplete } = useSyncContext();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, string>>({});

  const moduleStatuses = useMemo(() => {
    // Abwärtskompatibilität: Alte Modul-IDs auf neue mappen
    const effectiveLessons = [...completedLessons];

    // Wenn alte ACTA-Module abgeschlossen waren, gilt das neue Intro-Modul als abgeschlossen
    if (
      completedLessons.includes("grundlagen") ||
      completedLessons.includes("acta-methode") ||
      completedLessons.includes("acta-challenge")
    ) {
      if (!effectiveLessons.includes("acta-einfuehrung")) {
        effectiveLessons.push("acta-einfuehrung");
      }
    }

    // "prompt-beispiele" wird zu "prompting-stufen"
    if (completedLessons.includes("prompt-beispiele")) {
      if (!effectiveLessons.includes("prompting-stufen")) {
        effectiveLessons.push("prompting-stufen");
      }
    }

    // Alte Bonus-Module auf neue mappen
    // "advanced" (alte Fortgeschrittene Techniken) → "techniken-anwenden"
    if (completedLessons.includes("advanced")) {
      if (!effectiveLessons.includes("techniken-anwenden")) {
        effectiveLessons.push("techniken-anwenden");
      }
    }
    // "zerlegung" (alte Aufgaben-Zerlegung) → "workflows-bauen"
    if (completedLessons.includes("zerlegung")) {
      if (!effectiveLessons.includes("workflows-bauen")) {
        effectiveLessons.push("workflows-bauen");
      }
    }
    // "prompting-stufen" und "ressourcen" haben keine Nachfolger —
    // sie zählen einfach nicht mehr, aber bestehende Einträge stören nicht.

    const statuses: Record<string, "completed" | "available" | "locked"> = {};
    for (const mod of learningModules) {
      if (effectiveLessons.includes(mod.id)) {
        statuses[mod.id] = "completed";
      } else {
        const allPrereqsMet = mod.prerequisites.every((p) => effectiveLessons.includes(p));
        statuses[mod.id] = allPrereqsMet ? "available" : "locked";
      }
    }
    return statuses;
  }, [completedLessons]);

  // Pflicht-Fortschritt (nur required modules zählen für die Hauptanzeige)
  const requiredCompleted = requiredModules.filter((m) => moduleStatuses[m.id] === "completed").length;
  const isOnboardingComplete = requiredCompleted === requiredModules.length;
  const requiredPercent = Math.round((requiredCompleted / requiredModules.length) * 100);

  // Bonus-Fortschritt
  const bonusCompleted = bonusModules.filter((m) => moduleStatuses[m.id] === "completed").length;

  const toggleModule = (id: string) => {
    if (moduleStatuses[id] === "locked") return;
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  const renderModule = (mod: typeof learningModules[number], showNumber: number) => {
    const status = moduleStatuses[mod.id];
    const isExpanded = expandedModule === mod.id;
    const Component = componentMap[mod.component];

    return (
      <div key={mod.id}>
        {status === "locked" ? (
          <Card className="px-4 py-3 rounded-lg border border-border opacity-40">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-bold shrink-0">
                {showNumber}
              </div>
              <span className="text-sm text-muted-foreground">{mod.title}</span>
              <Badge className={`ml-auto text-[10px] ${typeBadgeColors[mod.type] || ""}`}>
                {typeLabels[mod.type]} · {mod.duration}
              </Badge>
            </div>
          </Card>
        ) : (
          <Card
            className={`rounded-xl border transition-all ${
              status === "completed"
                ? "border-l-4 border-l-primary/50 border-border"
                : "border-l-4 border-l-primary border-border"
            }`}
          >
            {/* Header — klickbar */}
            <div
              className={`p-4 cursor-pointer transition-colors ${
                !isExpanded && status !== "completed" ? "hover:bg-primary/[0.02]" : ""
              }`}
              onClick={() => toggleModule(mod.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 ${
                  status === "completed"
                    ? "bg-primary/15 text-primary"
                    : "bg-primary text-primary-foreground"
                }`}>
                  {status === "completed" ? <CheckCircle2 className="w-5 h-5" /> : showNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{mod.title}</span>
                    <Badge className={`text-[10px] ${typeBadgeColors[mod.type] || ""}`}>
                      {typeLabels[mod.type]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{mod.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                </div>
                <div className="shrink-0">
                  {status === "completed" ? (
                    <span className="text-xs text-primary font-medium">Abgeschlossen</span>
                  ) : (
                    <Play className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>
            </div>
            {/* Expanded Content — getönter Body innerhalb derselben Card */}
            {isExpanded && Component && (
              <div className="bg-muted/30 border-t border-border">
                <div className="p-6">
                  <Component />
                  {status !== "completed" && (
                    <div className="mt-6 pt-4 border-t border-border space-y-4">
                      {mod.challenge ? (
                        <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                          <p className="text-sm font-medium">{mod.challenge.question}</p>
                          <Textarea
                            value={challengeAnswers[mod.id] || ""}
                            onChange={(e) => setChallengeAnswers(prev => ({ ...prev, [mod.id]: e.target.value }))}
                            placeholder={mod.challenge.placeholder}
                            className="text-xs min-h-[72px] resize-none"
                            rows={3}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">
                              {(challengeAnswers[mod.id] || "").length < mod.challenge.minLength
                                ? `Noch mindestens ${mod.challenge.minLength - (challengeAnswers[mod.id] || "").length} Zeichen`
                                : "✓ Ausreichend"
                              }
                            </span>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                markLessonComplete(mod.id);
                              }}
                              disabled={(challengeAnswers[mod.id] || "").length < mod.challenge.minLength}
                              className="gap-2"
                              size="sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Modul abschließen
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              markLessonComplete(mod.id);
                            }}
                            className="gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Modul abschließen
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {status === "completed" && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button disabled variant="outline" className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Bereits abgeschlossen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress — zeigt Pflicht-Fortschritt */}
      <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Onboarding-Fortschritt</h2>
          <span className="text-2xl font-bold text-primary">{requiredPercent}%</span>
        </div>
        <Progress value={requiredPercent} className="h-2.5 mb-3" />
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>
            {isOnboardingComplete
              ? "Abgeschlossen! Entdecke die Bonus-Module."
              : `${requiredCompleted} von ${requiredModules.length} Pflicht-Modulen · ${
                  requiredModules.length - requiredCompleted === 0
                    ? "Bereit für die Werkstatt!"
                    : `Noch ${requiredModules.length - requiredCompleted} ${requiredModules.length - requiredCompleted === 1 ? "Modul" : "Module"}`
                }`
            }
          </span>
          {bonusCompleted > 0 && (
            <span>· {bonusCompleted} von {bonusModules.length} Bonus-Module</span>
          )}
        </div>
      </Card>

      {/* Pflicht-Module */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Pflicht — Kern-Onboarding</h2>
          <span className="text-xs text-muted-foreground">~40 Minuten</span>
        </div>
        <div className="space-y-2">
          {requiredModules.map((mod, index) => renderModule(mod, index + 1))}
        </div>
      </div>

      {/* Erfolgs-Meldung nach Pflicht-Abschluss */}
      {isOnboardingComplete && (
        <Card className="p-6 rounded-xl border-2 border-primary/30 bg-primary/5 text-center">
          <PartyPopper className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">Onboarding abgeschlossen!</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Du kennst die ACTA- und RAKETE-Methode und hast deine ersten Prompts verbessert.
            Du bist bereit für die Prompt Sammlung und die Prompt Werkstatt.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={() => navigate("/library")} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Prompt Sammlung öffnen
            </Button>
            <Button variant="outline" onClick={() => navigate("/playground")} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Prompt Werkstatt starten
            </Button>
          </div>
        </Card>
      )}

      {/* Bonus-Module */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Beaker className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Bonus — Vertiefung</h2>
          <Badge variant="outline" className="text-[10px]">Optional</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {isOnboardingComplete
            ? "Vertiefe dein Wissen — jedes Modul ist unabhängig bearbeitbar."
            : "Wird nach Abschluss der Pflicht-Module freigeschaltet."
          }
        </p>
        <div className="space-y-2">
          {bonusModules.map((mod, index) => renderModule(mod, index + 4))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
