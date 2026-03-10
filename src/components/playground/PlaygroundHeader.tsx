import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LS_KEYS } from "@/lib/constants";
import type { AIRoutingConfig } from "@/types";

interface PlaygroundHeaderProps {
  mode: "einsteiger" | "experte";
  onModeChange: (mode: "einsteiger" | "experte") => void;
  onStartTour?: () => void;
  canUseExternal: boolean;
  promptConfidentiality: "open" | "internal" | "confidential";
  aiTier: "internal" | "external";
  aiRouting: AIRoutingConfig;
}

export function PlaygroundHeader({
  mode,
  onModeChange,
  onStartTour,
  canUseExternal,
  promptConfidentiality,
  aiTier,
  aiRouting,
}: PlaygroundHeaderProps) {
  const navigate = useNavigate();
  const tourCompleted = localStorage.getItem(LS_KEYS.TOUR_COMPLETED) === "true";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center h-12 px-4 max-w-[1380px] mx-auto">
        <div className="flex items-center gap-3">
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
          <h1 className="text-base font-bold tracking-tight">Prompt Werkstatt</h1>
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
        <div className="ml-auto">
          {onStartTour && (
            <Button
              variant="outline"
              size="sm"
              onClick={onStartTour}
              className="text-xs h-8 gap-1.5 hidden sm:flex"
            >
              <span className="text-primary">▷</span>
              Neu hier? So geht's
              {!tourCompleted && (
                <span className="relative flex h-2 w-2 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
            </Button>
          )}
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
