import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Brain } from "lucide-react";
import { ModelSelectGroups } from "./ModelSelect";
import { cn } from "@/lib/utils";
import type { AIRoutingConfig } from "@/types";

interface PlaygroundHeaderProps {
  thinkingEnabled: boolean;
  onThinkingChange: (enabled: boolean) => void;
  aiTier: "internal" | "external";
  onAiTierChange: (tier: "internal" | "external") => void;
  canUseExternal: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  aiRouting: AIRoutingConfig;
  promptConfidentiality: "open" | "internal" | "confidential";
  mode: "einsteiger" | "experte";
  onModeChange: (mode: "einsteiger" | "experte") => void;
}

export function PlaygroundHeader({
  thinkingEnabled,
  onThinkingChange,
  aiTier,
  onAiTierChange,
  canUseExternal,
  selectedModel,
  onModelChange,
  aiRouting,
  promptConfidentiality,
  mode,
  onModeChange,
}: PlaygroundHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center h-14 px-4 max-w-[1380px] mx-auto">
        {/* Left: Back + Title */}
        <div className="flex items-center gap-3 mr-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Button>
          <div className="h-5 w-px bg-border" />
          <h1 className="text-base font-bold tracking-tight">Prompt-Labor</h1>
          {/* Mode toggle */}
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => onModeChange("einsteiger")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                mode === "einsteiger" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Einsteiger
            </button>
            <button
              onClick={() => onModeChange("experte")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                mode === "experte" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              Experte
            </button>
          </div>
        </div>
        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Thinking toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer" title="Denkprozess aktivieren">
            <Switch
              id="thinking-toggle"
              checked={thinkingEnabled}
              onCheckedChange={onThinkingChange}
            />
            <span className="text-xs text-muted-foreground hidden md:flex items-center gap-1">
              <Brain className="h-3.5 w-3.5" /> Denken
            </span>
          </label>
          {/* Divider */}
          <div className="h-5 w-px bg-border mx-1" />
          {/* AI Tier toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => onAiTierChange("internal")}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                aiTier === "internal"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              🏢 <span className="hidden sm:inline">Intern</span>
            </button>
            <button
              onClick={() => canUseExternal && onAiTierChange("external")}
              disabled={!canUseExternal}
              className={`px-2.5 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                aiTier === "external" && canUseExternal
                  ? "bg-primary/10 text-primary"
                  : canUseExternal
                  ? "text-muted-foreground hover:bg-muted/50"
                  : "text-muted-foreground/30 cursor-not-allowed"
              }`}
              title={!canUseExternal ? "Für vertrauliche Inhalte nicht verfügbar" : "Externe Business-API"}
            >
              ☁️ <span className="hidden sm:inline">Extern</span>
            </button>
          </div>
          {/* Model selector */}
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="w-[180px] text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiTier === "internal" ? (
                <SelectGroup>
                  <SelectLabel>🏢 Interne KI</SelectLabel>
                  {aiRouting.internalModel ? (
                    <SelectItem value={aiRouting.internalModel}>
                      {aiRouting.internalModel}
                    </SelectItem>
                  ) : (
                    <SelectItem value="internal-default" disabled>
                      Nicht konfiguriert
                    </SelectItem>
                  )}
                </SelectGroup>
              ) : (
                <ModelSelectGroups />
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Confidentiality warnings */}
      {!canUseExternal && (
        <div className="text-[11px] text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 px-4 py-1.5 text-center">
          🔒 Vertraulicher Prompt — nur interne KI zugelassen
        </div>
      )}
      {canUseExternal && aiTier === "external" && promptConfidentiality === "internal" && aiRouting.warnOnExternal && (
        <div className="text-[11px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-4 py-1.5 text-center">
          ⚠ Stelle sicher, dass keine vertraulichen Daten im Prompt enthalten sind.
        </div>
      )}
    </header>
  );
}
