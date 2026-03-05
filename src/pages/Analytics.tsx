import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, CheckCircle2, Star, FileDown, ArrowUpDown } from "lucide-react";
import { promptLibrary } from "@/data/prompts";
import { learningModules } from "@/data/learningPath";
import { useSyncContext } from "@/contexts/SyncContext";

const Analytics = () => {
  const { completedLessons } = useSyncContext();
  const [sortBy, setSortBy] = useState<string>("department");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Stats
  const totalPrompts = promptLibrary.length;
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

  // Categories bar chart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    promptLibrary.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a);
  }, []);
  const maxCategoryCount = categoryData.length > 0 ? categoryData[0][1] : 1;

  // Department table
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

  // Compliance
  const complianceRate = totalPrompts > 0 ? Math.round((verifiedPrompts / totalPrompts) * 100) : 0;
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Nutzung, Qualität und Governance-Metriken
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" disabled variant="outline" className="gap-1.5">
              <FileDown className="w-4 h-4" /> Report als PDF
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kommt in v2</TooltipContent>
        </Tooltip>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg"><BookOpen className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Prompts in Library</p>
              <p className="text-2xl font-bold">{totalPrompts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Verifizierte Prompts</p>
              <p className="text-2xl font-bold">{verifiedPrompts}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg"><Star className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Prompt-Qualität</p>
              <p className="text-2xl font-bold">{avgQuality}/5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bar Chart: Prompts by Category */}
      <Card className="p-5 rounded-xl border border-border shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Prompts nach Kategorie</h2>
        <div className="space-y-2">
          {categoryData.map(([category, count]) => (
            <div key={category} className="flex items-center gap-3">
              <span className="text-sm w-44 truncate text-right text-muted-foreground">{category}</span>
              <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Table: Departments */}
      <Card className="p-5 rounded-xl border border-border shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Prompts nach Abteilung & Risiko</h2>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: "name", label: "Abteilung" },
                { key: "total", label: "Anzahl" },
                { key: "verified", label: "Verifiziert" },
                { key: "high", label: "Risiko Hoch" },
                { key: "medium", label: "Risiko Mittel" },
                { key: "low", label: "Risiko Niedrig" },
              ].map((col) => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {departmentData.map((dep) => (
              <TableRow key={dep.name}>
                <TableCell className="font-medium">{dep.name}</TableCell>
                <TableCell>{dep.total}</TableCell>
                <TableCell>{dep.verified}</TableCell>
                <TableCell>{dep.high > 0 ? <Badge className="bg-rose-100 text-rose-700">{dep.high}</Badge> : "—"}</TableCell>
                <TableCell>{dep.medium > 0 ? <Badge className="bg-amber-100 text-amber-700">{dep.medium}</Badge> : "—"}</TableCell>
                <TableCell>{dep.low > 0 ? <Badge className="bg-emerald-100 text-emerald-700">{dep.low}</Badge> : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Onboarding Progress */}
      <Card className="p-5 rounded-xl border border-border shadow-sm">
        <h2 className="font-semibold text-lg mb-4">Onboarding-Fortschritt</h2>
        <div className="flex items-center gap-1 flex-wrap">
          {learningModules.map((mod, i) => {
            const isComplete = completedLessons.includes(mod.id);
            return (
              <div key={mod.id} className="flex items-center">
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                        isComplete
                          ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                          : "bg-muted border-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{mod.title}</TooltipContent>
                </Tooltip>
                {i < learningModules.length - 1 && (
                  <div className={`w-6 h-0.5 ${isComplete ? "bg-emerald-500" : "bg-muted-foreground/20"}`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold mb-2">Compliance-Rate</h3>
          <p className="text-3xl font-bold text-primary">{complianceRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Verifizierte Prompts</p>
        </Card>

        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold mb-3">Risiko-Verteilung</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-rose-600">Hoch</span>
              <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(riskCounts.high / maxRisk) * 100}%` }} />
              </div>
              <span className="text-xs w-6 text-right">{riskCounts.high}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-amber-600">Mittel</span>
              <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(riskCounts.medium / maxRisk) * 100}%` }} />
              </div>
              <span className="text-xs w-6 text-right">{riskCounts.medium}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-12 text-emerald-600">Niedrig</span>
              <div className="flex-1 h-4 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(riskCounts.low / maxRisk) * 100}%` }} />
              </div>
              <span className="text-xs w-6 text-right">{riskCounts.low}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 rounded-xl border border-border shadow-sm">
          <h3 className="font-semibold mb-3">Abteilungs-Abdeckung</h3>
          <div className="flex flex-wrap gap-1.5">
            {allDepartments.covered.map((dep) => (
              <Badge key={dep} className="bg-emerald-100 text-emerald-700">{dep}</Badge>
            ))}
            {allDepartments.missing.map((dep) => (
              <Badge key={dep} variant="outline" className="text-muted-foreground">{dep}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {allDepartments.covered.length} von {allDepartments.covered.length + allDepartments.missing.length} Abteilungen abgedeckt
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
