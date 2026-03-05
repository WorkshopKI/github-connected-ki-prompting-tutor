import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Globe, Search, ExternalLink, ChevronDown, ChevronUp, Shield, Clock, Wrench, Building2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { promptLibrary } from "@/data/prompts";
import type { PromptItem } from "@/data/prompts";
const categories = ["Alle", "Alltag", "Beruf", "Websuche", "Deep Research", "Blueprints", "Organisation"];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alltag");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("Alle");
  const [riskFilter, setRiskFilter] = useState("Alle");

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredPrompts = promptLibrary.filter((prompt) => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "Alle" ||
      (selectedCategory === "Alltag" && prompt.level === "alltag") ||
      (selectedCategory === "Beruf" && prompt.level === "beruf") ||
      (selectedCategory === "Websuche" && prompt.level === "websuche") ||
      (selectedCategory === "Deep Research" && prompt.level === "research") ||
      (selectedCategory === "Blueprints" && prompt.type === "blueprint") ||
      (selectedCategory === "Organisation" && prompt.level === "organisation");

    const matchesDepartment = departmentFilter === "Alle" || prompt.department === departmentFilter;
    const matchesRisk = riskFilter === "Alle" || prompt.riskLevel === riskFilter;

    return matchesSearch && matchesCategory && matchesDepartment && matchesRisk;
  });

  const departments = ["Alle", "Support", "Vertrieb", "Legal"];
  const riskLevels = ["Alle", "niedrig", "mittel", "hoch"];

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <span className="font-mono text-lg tracking-widest block mb-3" style={{ color: 'hsl(var(--primary-deep))' }}>03</span>
        <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--primary-deep))' }} />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Prompt-Sammlung
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kopiere Prompts als Startpunkt oder öffne sie direkt im Prompt-Labor
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Suche nach Prompts, Kategorien oder Themen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>


        {selectedCategory === "Organisation" && (
          <div className="space-y-2">
            <div className="flex flex-wrap justify-center gap-2">
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
            <div className="flex flex-wrap justify-center gap-2">
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

      {/* Results Count */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredPrompts.length} {filteredPrompts.length === 1 ? "Prompt" : "Prompts"} gefunden
        </p>
      </div>

      {/* Prompts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {(showAll ? filteredPrompts : filteredPrompts.slice(0, 6)).map((prompt, index) => (
          <Card key={index} className="p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-foreground/50">
                    {prompt.category}
                  </span>
                  {prompt.type === "blueprint" && (
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/20 text-primary font-semibold px-2 py-1 rounded">
                      <Shield className="w-3 h-3" />
                      Blueprint
                    </span>
                  )}
                  {prompt.needsWeb && (
                    <span className="inline-flex items-center gap-1 text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                      <Globe className="w-3 h-3" />
                      Websuche
                    </span>
                  )}
                  {prompt.level === "organisation" && (
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/15 text-primary px-2 py-1 rounded">
                      <Building2 className="w-3 h-3" /> Organisation
                    </span>
                  )}
                  {prompt.official && (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      <Shield className="w-3 h-3" /> Freigegeben
                    </span>
                  )}
                </div>
                <h4 className="font-semibold mb-1 text-sm">
                  {prompt.title}
                </h4>
                {prompt.department && (
                  <p className="text-[11px] text-muted-foreground mb-2">Abteilung: {prompt.department} {prompt.riskLevel ? `· Risiko: ${prompt.riskLevel}` : ""}</p>
                )}
                <p className="text-xs text-foreground/80 font-mono leading-relaxed bg-muted/40 rounded-md px-3 py-2 line-clamp-3">
                  {prompt.prompt}
                </p>
                <BlueprintDetails prompt={prompt} />
              </div>
              
              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(prompt.prompt, index)}
                  title="Prompt kopieren"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-primary animate-scale-in" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate(`/playground?prompt=${encodeURIComponent(prompt.prompt)}`)}
                  title="Im Playground öffnen"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPrompts.length > 6 && (
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
    </section>
  );
};
