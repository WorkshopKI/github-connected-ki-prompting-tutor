import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Copy, Check, Search, Sparkles, ChevronDown, ChevronUp, Shield, Clock, Wrench, Building2, AlertTriangle, Star, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { promptLibrary } from "@/data/prompts";
import type { PromptItem } from "@/data/prompts";
import { PromptDetail } from "@/components/PromptDetail";
import { ConfidentialityBadge } from "@/components/ConfidentialityBadge";
import { useOrgContext } from "@/contexts/OrgContext";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { LS_KEYS } from "@/lib/constants";
import { extractVariables } from "@/lib/promptUtils";

const BASE_CATEGORIES = ["Alle", "Alltag", "Beruf", "Websuche", "Deep Research", "Blueprints", "Organisation"];

function getStoredRating(title: string): number {
  const ratings = loadFromStorage<Record<string, number>>(LS_KEYS.PROMPT_RATINGS, {});
  return ratings[title] || 0;
}

function storeRating(title: string, rating: number) {
  const ratings = loadFromStorage<Record<string, number>>(LS_KEYS.PROMPT_RATINGS, {});
  ratings[title] = rating;
  saveToStorage(LS_KEYS.PROMPT_RATINGS, ratings);
}

const BlueprintDetails = ({ prompt }: { prompt: PromptItem }) => {
  const [expanded, setExpanded] = useState(false);

  if (prompt.type !== "blueprint" || !prompt.constraints) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {prompt.estimatedAgentTime && (
          <span className="inline-flex items-center gap-1 bg-accent/10 text-accent-foreground px-2 py-1 rounded">
            <Clock className="w-3 h-3" />
            {prompt.estimatedAgentTime}
          </span>
        )}
        {prompt.requiredTools?.map((tool, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded">
            <Wrench className="w-3 h-3" />
            {tool}
          </span>
        ))}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Details ausblenden" : "Constraints & Abnahmekriterien"}
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-border">
          {prompt.constraints.musts.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Must
              </div>
              <ul className="space-y-1">
                {prompt.constraints.musts.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">+</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.constraints.mustNots.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-destructive mb-1">Must NOT</div>
              <ul className="space-y-1">
                {prompt.constraints.mustNots.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">-</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.constraints.escalationTriggers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-accent-foreground mb-1">Eskalations-Trigger</div>
              <ul className="space-y-1">
                {prompt.constraints.escalationTriggers.map((m, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-accent-foreground mt-0.5">!</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {prompt.acceptanceCriteria && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="text-xs font-semibold text-primary mb-1">Abnahmekriterien</div>
              <p className="text-xs text-foreground leading-relaxed">{prompt.acceptanceCriteria}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PromptLibrary = () => {
  const navigate = useNavigate();
  const { scope, isDepartment, scopeLabel } = useOrgContext();

  const categories = useMemo(() => {
    if (isDepartment) return ["Meine Abteilung", ...BASE_CATEGORIES];
    if (scope === "organisation") return BASE_CATEGORIES;
    return BASE_CATEGORIES.filter((c) => c !== "Organisation");
  }, [scope, isDepartment]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(isDepartment ? "Meine Abteilung" : "Alle");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("Alle");
  const [riskFilter, setRiskFilter] = useState("Alle");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [viewMode, setViewMode] = useState<string>("grid");
  const [sortByRating, setSortByRating] = useState(false);

  const [confFilter, setConfFilter] = useState<string>("all");
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [tableSortBy, setTableSortBy] = useState<string>("title");
  const [tableSortDir, setTableSortDir] = useState<"asc" | "desc">("asc");
  const toggleTableSort = (col: string) => {
    if (tableSortBy === col) {
      setTableSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setTableSortBy(col);
      setTableSortDir("asc");
    }
  };

  useEffect(() => {
    setSelectedCategory(isDepartment ? "Meine Abteilung" : "Alle");
  }, [scope, isDepartment]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };


  const filteredPrompts = useMemo(() => {
    let filtered = promptLibrary.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Alle" ||
        selectedCategory === "Meine Abteilung" ||
        (selectedCategory === "Alltag" && prompt.level === "alltag") ||
        (selectedCategory === "Beruf" && prompt.level === "beruf") ||
        (selectedCategory === "Websuche" && prompt.level === "websuche") ||
        (selectedCategory === "Deep Research" && prompt.level === "research") ||
        (selectedCategory === "Blueprints" && prompt.type === "blueprint") ||
        (selectedCategory === "Organisation" && prompt.level === "organisation");

      const matchesDepartment = departmentFilter === "Alle" || prompt.department === departmentFilter;
      const matchesRisk = riskFilter === "Alle" || prompt.riskLevel === riskFilter;
      const matchesVerified = !onlyVerified || prompt.official;
      const matchesConf = confFilter === "all" || (prompt.confidentiality || "open") === confFilter;

      const matchesDepartmentScope =
        selectedCategory === "Meine Abteilung"
          ? prompt.targetDepartment === scope
          : scope === "organisation" ? true
          : scope === "privat" ? !prompt.targetDepartment
          : isDepartment ? (!prompt.targetDepartment || prompt.targetDepartment === scope)
          : true;

      return matchesSearch && matchesCategory && matchesDepartment && matchesRisk && matchesVerified && matchesConf && matchesDepartmentScope;
    });

    if (sortByRating) {
      filtered = [...filtered].sort((a, b) => getStoredRating(b.title) - getStoredRating(a.title));
    }

    if (isDepartment) {
      filtered.sort((a, b) => {
        const aMatch = a.targetDepartment === scope ? 0 : 1;
        const bMatch = b.targetDepartment === scope ? 0 : 1;
        return aMatch - bMatch;
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, departmentFilter, riskFilter, onlyVerified, sortByRating, confFilter, scope, isDepartment]);

  const tableSortedPrompts = useMemo(() => {
    if (viewMode !== "list") return filteredPrompts;
    return [...filteredPrompts].sort((a, b) => {
      let aVal = "";
      let bVal = "";
      switch (tableSortBy) {
        case "title": aVal = a.title; bVal = b.title; break;
        case "category": aVal = a.category; bVal = b.category; break;
        case "department": aVal = a.targetDepartment || ""; bVal = b.targetDepartment || ""; break;
        case "level": aVal = a.level || ""; bVal = b.level || ""; break;
        case "confidentiality": aVal = a.confidentiality || "open"; bVal = b.confidentiality || "open"; break;
        case "rating":
          return tableSortDir === "asc"
            ? getStoredRating(a.title) - getStoredRating(b.title)
            : getStoredRating(b.title) - getStoredRating(a.title);
        default: aVal = a.title; bVal = b.title;
      }
      const cmp = aVal.localeCompare(bVal, "de");
      return tableSortDir === "asc" ? cmp : -cmp;
    });
  }, [filteredPrompts, tableSortBy, tableSortDir, viewMode]);

  const departments = ["Alle", "Support", "Vertrieb", "Legal"];
  const riskLevels = ["Alle", "niedrig", "mittel", "hoch"];

  const handlePromptClick = (prompt: PromptItem) => {
    setSelectedPrompt(prompt);
    setDetailOpen(true);
  };

  const InlineRating = ({ title }: { title: string }) => {
    const stored = getStoredRating(title);
    const [hover, setHover] = useState(0);

    return (
      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => { e.stopPropagation(); storeRating(title, star); toast.success(`${star} Sterne`); }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0"
          >
            <Star className={`w-3.5 h-3.5 ${star <= (hover || stored) ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <section>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Suche nach Prompts, Kategorien oder Themen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
              className={category === "Meine Abteilung" ? "gap-1.5" : ""}
            >
              {category === "Meine Abteilung"
                ? `⬡ ${scopeLabel.replace("Abteilung ", "").replace("Fachabteilung ", "")}`
                : category}
            </Button>
          ))}
        </div>


        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={onlyVerified} onCheckedChange={setOnlyVerified} />
              Nur verifizierte
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={sortByRating} onCheckedChange={setSortByRating} />
              Nach Bewertung
            </label>
            <select
              value={confFilter}
              onChange={(e) => setConfFilter(e.target.value)}
              className="text-sm border rounded-md px-2 py-1.5 bg-background"
            >
              <option value="all">Alle KI-Stufen</option>
              <option value="open">🟢 Offen</option>
              <option value="internal">🟡 Intern</option>
              <option value="confidential">🔴 Vertraulich</option>
            </select>
          </div>
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v)}>
            <ToggleGroupItem value="grid" aria-label="Grid"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List"><List className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
        </div>

        {selectedCategory === "Organisation" && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <Button
                  key={department}
                  variant={departmentFilter === department ? "default" : "outline"}
                  onClick={() => setDepartmentFilter(department)}
                  size="sm"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1" /> {department}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {riskLevels.map((risk) => (
                <Button
                  key={risk}
                  variant={riskFilter === risk ? "default" : "outline"}
                  onClick={() => setRiskFilter(risk)}
                  size="sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Risiko: {risk}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredPrompts.length} {filteredPrompts.length === 1 ? "Prompt" : "Prompts"} gefunden
        </p>
      </div>

      {viewMode === "list" ? (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {[
                  { key: "title", label: "Titel", className: "" },
                  { key: "category", label: "Kategorie", className: "hidden md:table-cell" },
                  { key: "department", label: "Abteilung", className: "hidden md:table-cell" },
                  { key: "level", label: "Level", className: "hidden sm:table-cell" },
                  { key: "rating", label: "Bewertung", className: "" },
                  { key: "confidentiality", label: "KI", className: "hidden lg:table-cell" },
                ].map((col) => (
                  <th
                    key={col.key}
                    className={`text-left p-3 font-medium cursor-pointer hover:text-foreground select-none ${col.className}`}
                    onClick={() => toggleTableSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <ArrowUpDown className={`h-3 w-3 ${tableSortBy === col.key ? "text-primary" : "text-muted-foreground/40"}`} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(showAll ? tableSortedPrompts : tableSortedPrompts.slice(0, 20)).map((prompt, index) => (
                <tr
                  key={index}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handlePromptClick(prompt)}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{prompt.title}</span>
                      {prompt.official && (
                        <Badge className="bg-primary/10 text-primary text-[10px] px-1 py-0">Verifiziert</Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{prompt.category}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{prompt.department || "\u2014"}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <Badge variant="outline" className="text-[10px]">{prompt.level || "\u2014"}</Badge>
                  </td>
                  <td className="p-3"><InlineRating title={prompt.title} /></td>
                  <td className="p-3 hidden lg:table-cell">
                    <ConfidentialityBadge level={prompt.confidentiality || "open"} compact />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {(showAll ? filteredPrompts : filteredPrompts.slice(0, 6)).map((prompt, index) => (
            <Card
              key={index}
              className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              onClick={() => handlePromptClick(prompt)}
            >
              {/* Zeile 1: Titel + Status-Badge */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-sm">{prompt.title}</h4>
                <div className="flex items-center gap-1 shrink-0">
                  {prompt.official ? (
                    <Badge className="bg-primary/10 text-primary text-xs">Verifiziert</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Entwurf</Badge>
                  )}
                  <ConfidentialityBadge level={prompt.confidentiality || "open"} reason={prompt.confidentialityReason} compact />
                </div>
              </div>
              {/* Zeile 2: Kategorie + Level als Text */}
              <p className="text-[11px] text-muted-foreground mb-3">
                {prompt.category}{prompt.level ? ` \u00b7 ${prompt.level}` : ""}{prompt.type === "blueprint" ? " \u00b7 Blueprint" : ""}{prompt.needsWeb ? " \u00b7 Websuche" : ""}{prompt.department ? ` \u00b7 ${prompt.department}` : ""}
              </p>
              {/* Zeile 3: Prompt-Text */}
              <p className="text-xs text-foreground/80 font-mono leading-relaxed bg-muted/40 rounded-md px-3 py-2 line-clamp-2 mb-3">
                {prompt.prompt}
              </p>
              {/* Zeile 4: Rating + Actions */}
              <div className="flex items-center justify-between">
                <InlineRating title={prompt.title} />
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(prompt.prompt, index); }}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    title="Kopieren"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/playground?libraryTitle=${encodeURIComponent(prompt.title)}`); }}
                    className="p-1.5 rounded-md hover:bg-primary/10 transition-colors group"
                    title="Im Labor verfeinern"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredPrompts.length > (viewMode === "list" ? 20 : 6) && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Weniger anzeigen" : `Alle ${filteredPrompts.length} Prompts anzeigen`}
          </Button>
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Prompts gefunden. Versuche eine andere Suche oder Kategorie.
          </p>
        </div>
      )}

      <PromptDetail
        prompt={selectedPrompt}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </section>
  );
};
