import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, Settings } from "lucide-react";
import { ModelSelectGroups } from "./ModelSelect";
import { getModelLabel } from "@/data/models";
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
        {/* Left: Back + Title + Mode toggle */}
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

        {/* Right: Model badge (Experte only) + Settings Popover */}
        <div className="flex items-center gap-2">
          {mode === "experte" && (
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/8 text-xs font-medium text-foreground">
              {aiTier === "internal" ? "🏢" : "☁️"}
              {getModelLabel(selectedModel)}
            </span>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <h4 className="text-sm font-semibold mb-3">KI-Einstellungen</h4>

              {/* Sektion 1: Modell-Auswahl */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Modell</label>
                <Select value={selectedModel} onValueChange={onModelChange}>
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder={getModelLabel(selectedModel)} />
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

              <Separator className="my-3" />

              {/* Sektion 2: Denken-Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                    Denken
                  </label>
                  <p className="text-[10px] text-muted-foreground">Chain-of-Thought Reasoning</p>
                </div>
                <Switch
                  checked={thinkingEnabled}
                  onCheckedChange={onThinkingChange}
                />
              </div>

              <Separator className="my-3" />

              {/* Sektion 3: KI-Stufe (Intern/Extern) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">KI-Stufe</label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    onClick={() => onAiTierChange("internal")}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1",
                      aiTier === "internal"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    🏢 Intern
                  </button>
                  <button
                    onClick={() => canUseExternal && onAiTierChange("external")}
                    disabled={!canUseExternal}
                    className={cn(
                      "flex-1 px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1",
                      aiTier === "external" && canUseExternal
                        ? "bg-primary/10 text-primary"
                        : canUseExternal
                        ? "text-muted-foreground hover:bg-muted/50"
                        : "text-muted-foreground/30 cursor-not-allowed"
                    )}
                    title={!canUseExternal ? "Für vertrauliche Inhalte nicht verfügbar" : "Externe Business-API"}
                  >
                    ☁️ Extern
                  </button>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Footer */}
              <p className="text-[10px] text-muted-foreground">
                ℹ️ Einstellungen gelten für diese Session.
              </p>
            </PopoverContent>
          </Popover>
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
