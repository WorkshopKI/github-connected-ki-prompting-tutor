import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Building2,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Users,
  ArrowRight,
  Star,
  ArrowUpDown,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/StatCard";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSyncContext } from "@/contexts/SyncContext";
import { promptLibrary } from "@/data/prompts";
import { exercises } from "@/data/exercises";
import { learningModules } from "@/data/learningPath";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { useOrgContext } from "@/contexts/OrgContext";

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
    let candidates = promptLibrary;
    if (isDepartment) {
      const deptPrompts = candidates.filter((p) => p.targetDepartment === scope);
      const officialPrompts = candidates.filter((p) => p.official && p.targetDepartment !== scope);
      candidates = [...deptPrompts, ...officialPrompts];
    }
    if (candidates.length < 5) {
      const remaining = promptLibrary.filter((p) => !candidates.includes(p));
      candidates = [...candidates, ...remaining];
    }
    return candidates.slice(0, 5);
  }, [scope, isDepartment]);

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

  // --- Analytics data (from Analytics.tsx) ---
  const verifiedPrompts = promptLibrary.filter((p) => p.official).length;

  const avgQuality = useMemo(() => {
    let totalScore = 0;
    let count = 0;
    promptLibrary.forEach((p) => {
      let score = 1;
      if (p.prompt.length > 100) score++;
      if (p.prompt.length > 200) score++;
      if (/kontext|context/i.test(p.prompt)) score++;
      if (p.constraints || /constraint|must/i.test(p.prompt)) score++;
      totalScore += score;
      count++;
    });
    return count > 0 ? (totalScore / count).toFixed(1) : "0";
  }, []);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    promptLibrary.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).sort(([, a], [, b]) => b - a);
  }, []);
  const maxCategoryCount = categoryData.length > 0 ? categoryData[0][1] : 1;

  const categoryGroups = useMemo(() => {
    const groups: { label: string; items: [string, number][]; defaultOpen: boolean }[] = [];
    const top = categoryData.filter(([, c]) => c >= 3);
    const mid = categoryData.filter(([, c]) => c === 2);
    const rest = categoryData.filter(([, c]) => c <= 1);
    if (top.length > 0) groups.push({ label: "Top-Kategorien (3+)", items: top, defaultOpen: true });
    if (mid.length > 0) groups.push({ label: "Mittlere Kategorien (2)", items: mid, defaultOpen: true });
    if (rest.length > 0) groups.push({ label: "Einzelne Kategorien (1)", items: rest, defaultOpen: false });
    return groups;
  }, [categoryData]);

  const [sortBy, setSortBy] = useState<string>("department");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const departmentData = useMemo(() => {
    const deps: Record<string, { total: number; verified: number; high: number; medium: number; low: number }> = {};
    promptLibrary.forEach((p) => {
      const dep = p.department || "Ohne Abteilung";
      if (!deps[dep]) deps[dep] = { total: 0, verified: 0, high: 0, medium: 0, low: 0 };
      deps[dep].total++;
      if (p.official) deps[dep].verified++;
      if (p.riskLevel === "hoch") deps[dep].high++;
      if (p.riskLevel === "mittel") deps[dep].medium++;
      if (p.riskLevel === "niedrig") deps[dep].low++;
    });
    const entries = Object.entries(deps).map(([name, data]) => ({ name, ...data }));
    entries.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return entries;
  }, [sortBy, sortDir]);

  const toggleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const complianceRate = stats.totalPrompts > 0 ? Math.round((verifiedPrompts / stats.totalPrompts) * 100) : 0;

  const riskCounts = useMemo(() => {
    let high = 0, medium = 0, low = 0;
    promptLibrary.forEach((p) => {
      if (p.riskLevel === "hoch") high++;
      if (p.riskLevel === "mittel") medium++;
      if (p.riskLevel === "niedrig") low++;
    });
    return { high, medium, low };
  }, []);

  const allDepartments = useMemo(() => {
    const all = new Set(["HR", "Vertrieb", "Support", "Produkt", "Legal", "Marketing", "Engineering"]);
    const covered = new Set(promptLibrary.filter((p) => p.department).map((p) => p.department!));
    return { covered: Array.from(covered), missing: Array.from(all).filter((d) => !covered.has(d)) };
  }, []);

  const maxRisk = Math.max(riskCounts.high, riskCounts.medium, riskCounts.low, 1);

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
          {isDepartment && <Badge className="bg-primary/10 text-primary text-xs mr-2">{scopeLabel}</Badge>}
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
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-sm truncate">
                        {prompt.title}
                      </p>
                      <ConfidentialityBadge level={prompt.confidentiality || "open"} compact />
                    </div>
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
                onClick={() => navigate("/library")}
              >
                <Users className="h-4 w-4" /> Use Cases
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

      {/* Analytics Section — collapsible */}
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-base">Analytics & Insights</h2>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={BookOpen} label="Verifizierte Prompts" value={verifiedPrompts} />
            <StatCard icon={Star} label="Prompt-Qualität" value={`${avgQuality}/5`} />
            <StatCard icon={CheckCircle2} label="Compliance-Rate" value={`${complianceRate}%`} />
          </div>

          {/* Category Chart */}
          <Card className="p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Prompts nach Kategorie</h3>
            <div className="space-y-3">
              {categoryGroups.map((group) => (
                <Collapsible key={group.label} defaultOpen={group.defaultOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground py-1.5 px-2 rounded-lg hover:bg-muted/50 transition-colors group">
                    <span>{group.label} ({group.items.length})</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 mt-2">
                      {group.items.map(([category, count]) => (
                        <div key={category} className="flex items-center gap-3">
                          <span className="text-sm w-44 truncate text-right text-muted-foreground">{category}</span>
                          <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>

          {/* Department Table */}
          <Card className="p-5 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-sm mb-4">Prompts nach Abteilung & Risiko</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>Abteilung <ArrowUpDown className="inline h-3 w-3" /></TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("total")}>Anzahl <ArrowUpDown className="inline h-3 w-3" /></TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("verified")}>Verifiziert <ArrowUpDown className="inline h-3 w-3" /></TableHead>
                    <TableHead>Risiko Hoch</TableHead>
                    <TableHead>Risiko Mittel</TableHead>
                    <TableHead>Risiko Niedrig</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentData.map((dep) => (
                    <TableRow key={dep.name}>
                      <TableCell className="font-medium">{dep.name}</TableCell>
                      <TableCell>{dep.total}</TableCell>
                      <TableCell>{dep.verified}</TableCell>
                      <TableCell>{dep.high > 0 ? <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">{dep.high}</Badge> : "—"}</TableCell>
                      <TableCell>{dep.medium > 0 ? <Badge className="bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-400">{dep.medium}</Badge> : "—"}</TableCell>
                      <TableCell>{dep.low > 0 ? <Badge className="bg-primary/10 text-primary">{dep.low}</Badge> : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Governance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 rounded-xl border border-border shadow-sm">
              <h4 className="font-semibold text-xs text-muted-foreground mb-1">Risiko-Verteilung</h4>
              <div className="space-y-1.5">
                {[
                  { label: "Hoch", count: riskCounts.high, color: "bg-red-500 dark:bg-red-600", textColor: "text-red-700 dark:text-red-400" },
                  { label: "Mittel", count: riskCounts.medium, color: "bg-amber-500 dark:bg-amber-600", textColor: "text-amber-800 dark:text-amber-400" },
                  { label: "Niedrig", count: riskCounts.low, color: "bg-primary", textColor: "text-primary" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className={`text-xs w-10 ${r.textColor}`}>{r.label}</span>
                    <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: `${(r.count / maxRisk) * 100}%` }} />
                    </div>
                    <span className="text-xs w-4 text-right">{r.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 rounded-xl border border-border shadow-sm">
              <h4 className="font-semibold text-xs text-muted-foreground mb-2">Abteilungs-Abdeckung</h4>
              <div className="flex flex-wrap gap-1">
                {allDepartments.covered.map((dep) => (
                  <Badge key={dep} className="bg-primary/10 text-primary text-[10px]">{dep}</Badge>
                ))}
                {allDepartments.missing.map((dep) => (
                  <Badge key={dep} variant="outline" className="text-muted-foreground text-[10px]">{dep}</Badge>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                {allDepartments.covered.length} von {allDepartments.covered.length + allDepartments.missing.length} abgedeckt
              </p>
            </Card>

            <Card className="p-4 rounded-xl border border-border shadow-sm">
              <h4 className="font-semibold text-xs text-muted-foreground mb-2">Onboarding-Fortschritt</h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {learningModules.map((mod, i) => {
                  const isComplete = completedLessons.includes(mod.id);
                  return (
                    <Tooltip key={mod.id}>
                      <TooltipTrigger asChild>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isComplete ? "bg-primary/15 border-primary text-primary" : "bg-muted text-muted-foreground"
                        } border`}>
                          {i + 1}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{mod.title}</TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Dashboard;
