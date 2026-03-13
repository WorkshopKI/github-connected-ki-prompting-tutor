import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send, Square, Brain, Plus, Paperclip } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ModelSelectGroups } from "./ModelSelect";
import { getModelLabel } from "@/data/models";
import { cn } from "@/lib/utils";
import type { AIRoutingConfig } from "@/types";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isStreaming?: boolean;
  onStop?: () => void;
  initialValue?: string;
  // KI-Controls (bisher im Footer)
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  thinkingEnabled?: boolean;
  onThinkingChange?: (enabled: boolean) => void;
  aiTier?: "internal" | "external";
  onAiTierChange?: (tier: "internal" | "external") => void;
  canUseExternal?: boolean;
  aiRouting?: AIRoutingConfig;
  isExperte?: boolean;
}

export const ChatInput = ({
  onSend, disabled, isStreaming, onStop, initialValue,
  selectedModel, onModelChange, thinkingEnabled, onThinkingChange,
  aiTier, onAiTierChange, canUseExternal, aiRouting, isExperte,
}: ChatInputProps) => {
  const [input, setInput] = useState(initialValue ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialConsumed = useRef(false);
  const [plusOpen, setPlusOpen] = useState(false);

  useEffect(() => {
    if (initialValue && !initialConsumed.current) {
      setInput(initialValue);
      initialConsumed.current = true;
    }
  }, [initialValue]);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  return (
    <div className="border-[1.5px] border-border rounded-xl bg-muted/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Prompt eingeben..."
        className="w-full px-3 pt-2.5 pb-1 text-sm resize-none border-none bg-transparent focus:outline-none placeholder:text-muted-foreground/60"
        rows={1}
        disabled={disabled}
        style={{ minHeight: 36, maxHeight: 160 }}
      />

      {/* Controls bar — inside the input box */}
      <div className="flex items-center gap-1.5 px-2 pb-2">
        {/* + Menu — nur Experte */}
        {isExperte && (
          <Popover open={plusOpen} onOpenChange={setPlusOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center text-sm transition-colors",
                  plusOpen ? "bg-primary/10 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-auto p-1 mb-1">
              <button className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs rounded-md hover:bg-muted transition-colors">
                <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Datei anhängen</div>
                  <div className="text-[10px] text-muted-foreground">PDF, Bild, Dokument</div>
                </div>
              </button>
            </PopoverContent>
          </Popover>
        )}

        {/* Model selector — nur Experte */}
        {isExperte && selectedModel && onModelChange && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-card border border-border text-[11px] font-medium text-foreground hover:bg-muted/50 transition-colors">
                {aiTier === "internal" ? "🏢" : "☁️"} {getModelLabel(selectedModel)}
                <span className="text-[8px] text-muted-foreground">▾</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-64 p-3 space-y-3 mb-1">
              <h4 className="text-xs font-semibold">Modell</h4>
              <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger className="w-full text-xs h-8">
                  <span className="truncate">{getModelLabel(selectedModel)}</span>
                </SelectTrigger>
                <SelectContent>
                  {aiTier === "internal" ? (
                    <SelectGroup>
                      <SelectLabel>🏢 Interne KI</SelectLabel>
                      {aiRouting?.internalModel ? (
                        <SelectItem value={aiRouting.internalModel}>{aiRouting.internalModel}</SelectItem>
                      ) : (
                        <SelectItem value="internal-default" disabled>Nicht konfiguriert</SelectItem>
                      )}
                    </SelectGroup>
                  ) : (
                    <ModelSelectGroups />
                  )}
                </SelectContent>
              </Select>
              {onAiTierChange && (
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button onClick={() => onAiTierChange("internal")}
                    className={cn("flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                      aiTier === "internal" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50")}>
                    🏢 Intern
                  </button>
                  <button onClick={() => canUseExternal && onAiTierChange("external")}
                    disabled={!canUseExternal}
                    className={cn("flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                      aiTier === "external" && canUseExternal ? "bg-primary text-primary-foreground"
                        : canUseExternal ? "text-muted-foreground hover:bg-muted/50"
                        : "text-muted-foreground/30 cursor-not-allowed")}>
                    ☁️ Extern
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        {/* Thinking toggle — nur Experte */}
        {isExperte && onThinkingChange && (
          <button
            type="button"
            onClick={() => onThinkingChange(!thinkingEnabled)}
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full border font-medium transition-colors flex items-center gap-1",
              thinkingEnabled
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <Brain className="w-3 h-3" />
            {thinkingEnabled ? "Denken an" : "Denken"}
          </button>
        )}

        <div className="flex-1" />

        {/* Send / Stop */}
        {isStreaming ? (
          <button
            onClick={onStop}
            className="shrink-0 h-8 w-8 relative flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            title="Stoppen"
          >
            <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" strokeWidth="2" stroke="hsl(var(--primary) / 0.15)" />
              <circle cx="16" cy="16" r="13" fill="none" strokeWidth="2.5" stroke="hsl(var(--primary))" strokeDasharray="20 60" strokeLinecap="round" />
            </svg>
            <Square className="w-3 h-3 fill-primary text-primary" />
          </button>
        ) : (
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className="shrink-0 h-8 w-8 rounded-lg"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
