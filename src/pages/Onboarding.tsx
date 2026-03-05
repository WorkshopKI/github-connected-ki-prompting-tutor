import { useState, useMemo } from "react";
import { BookOpen, CheckCircle2, Lock, Play, Sparkles, Brain, Search, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSyncContext } from "@/contexts/SyncContext";
import { learningModules } from "@/data/learningPath";
import { LevelCard } from "@/components/LevelCard";
import { PromptExamples } from "@/components/PromptExamples";
import { ACTASection } from "@/components/ACTASection";
import { ACTAQuickChallenge } from "@/components/ACTAQuickChallenge";
import { PracticeArea } from "@/components/PracticeArea";
import { AdvancedPromptingSection } from "@/components/AdvancedPromptingSection";
import { DecompositionAssistant } from "@/components/DecompositionAssistant";
import { ResourcesSection } from "@/components/ResourcesSection";

const LevelCardsWrapper = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <LevelCard
          level={1} icon={Sparkles} title="Fragen"
          description="Präzise Fragen für direkte Antworten mit der ACTA-Methode"
          examples={["Rezepte", "Reiseplanung", "Geschenkideen"]}
          isActive={activeLevel === 1} onClick={() => setActiveLevel(1)}
        />
        <LevelCard
          level={2} icon={Brain} title="Gestalten"
          description="Die Informationsumgebung für die KI formen"
          examples={["System-Prompts", "Konventionen", "Wissensbasis"]}
          isActive={activeLevel === 2} onClick={() => setActiveLevel(2)}
        />
        <LevelCard
          level={3} icon={Search} title="Steuern"
          description="Ziele, Werte und Entscheidungsregeln kodieren"
          examples={["Werte-Hierarchien", "Entscheidungsregeln", "Eskalation"]}
          isActive={activeLevel === 3} onClick={() => setActiveLevel(3)}
        />
        <LevelCard
          level={4} icon={Cpu} title="Spezifizieren"
          description="Wasserdichte Blueprints für autonome Aufgaben"
          examples={["Agenten-Specs", "Blueprints", "Abnahmekriterien"]}
          isActive={activeLevel === 4} onClick={() => setActiveLevel(4)}
        />
      </div>
      <PromptExamples level={activeLevel} />
    </div>
  );
};

const PromptExamplesWrapper = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[1, 2, 3, 4].map((l) => (
          <Button key={l} size="sm" variant={activeLevel === l ? "default" : "outline"} onClick={() => setActiveLevel(l)}>
            Level {l}
          </Button>
        ))}
      </div>
      <PromptExamples level={activeLevel} />
    </div>
  );
};

const componentMap: Record<string, React.ComponentType> = {
  LevelCards: LevelCardsWrapper,
  ACTASection: ACTASection,
  ACTAQuickChallenge: ACTAQuickChallenge,
  PracticeArea: PracticeArea,
  PromptExamples: PromptExamplesWrapper,
  DecompositionAssistant: DecompositionAssistant,
  AdvancedPromptingSection: AdvancedPromptingSection,
  ResourcesSection: ResourcesSection,
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
  const { completedLessons, markLessonComplete } = useSyncContext();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const moduleStatuses = useMemo(() => {
    const statuses: Record<string, "completed" | "available" | "locked"> = {};
    for (const mod of learningModules) {
      if (completedLessons.includes(mod.id)) {
        statuses[mod.id] = "completed";
      } else {
        const allPrereqsMet = mod.prerequisites.every((p) => completedLessons.includes(p));
        statuses[mod.id] = allPrereqsMet ? "available" : "locked";
      }
    }
    return statuses;
  }, [completedLessons]);

  const completedCount = learningModules.filter((m) => moduleStatuses[m.id] === "completed").length;
  const availableCount = learningModules.filter((m) => moduleStatuses[m.id] === "available").length;
  const lockedCount = learningModules.filter((m) => moduleStatuses[m.id] === "locked").length;
  const progressPercent = Math.round((completedCount / learningModules.length) * 100);

  const toggleModule = (id: string) => {
    if (moduleStatuses[id] === "locked") return;
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Onboarding</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Systematisches Prompt-Training in {learningModules.length} Modulen
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="p-5 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Gesamtfortschritt</h2>
          <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-3 mb-4" />
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            {completedCount} Abgeschlossen
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            {availableCount} In Bearbeitung
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            {lockedCount} Ausstehend
          </span>
        </div>
      </Card>

      {/* Module List */}
      <div className="space-y-3">
        {learningModules.map((mod, index) => {
          const status = moduleStatuses[mod.id];
          const isExpanded = expandedModule === mod.id;
          const Component = componentMap[mod.component];

          return (
            <div key={mod.id}>
              <Card
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  status === "completed"
                    ? "border-l-4 border-l-primary/50 border-border"
                    : status === "available"
                    ? "border-l-4 border-l-primary border-border hover:shadow-md"
                    : "opacity-50 pointer-events-none border-border"
                }`}
                onClick={() => toggleModule(mod.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 ${
                      status === "completed"
                        ? "bg-primary/15 text-primary"
                        : status === "available"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : status === "locked" ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{mod.title}</h3>
                      <Badge variant="secondary" className={`text-[10px] ${typeBadgeColors[mod.type] || ""}`}>
                        {typeLabels[mod.type]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {mod.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                  </div>

                  {/* Status */}
                  <div className="shrink-0">
                    {status === "completed" && (
                      <span className="text-xs text-primary font-medium">Abgeschlossen</span>
                    )}
                    {status === "available" && (
                      <Play className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </Card>

              {/* Expanded Content */}
              {isExpanded && Component && (
                <div className="mt-2 p-6 rounded-xl border border-border bg-muted/20">
                  <Component />
                  {status !== "completed" && (
                    <div className="mt-6 pt-4 border-t border-border flex justify-end">
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
                  {status === "completed" && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button disabled variant="outline" className="gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Bereits abgeschlossen
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Onboarding;
