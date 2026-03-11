import { useState } from "react";
import { Download, Copy, Trash2, Scale, Bookmark, Settings, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { ChatPlayground } from "./ChatPlayground";
import { ComparisonSplitView } from "./ComparisonSplitView";
import { JudgePanel } from "./JudgePanel";
import { AgentKnobs, type AgentConfig } from "./AgentKnobs";
import { ModelSelectGroups } from "./ModelSelect";
import { getModelLabel } from "@/data/models";
import { cn } from "@/lib/utils";
import { exportChatAsMarkdown, exportChatAsDocx } from "@/lib/exportChat";
import type { Msg } from "@/types";
import type { AIRoutingConfig } from "@/types";

export interface PlaygroundContentProps {
  messages: Msg[];
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  thinkingContent?: string;
  thinkingEnabled?: boolean;
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  onClearChat: () => void;
  onStop: () => void;
  onBudgetExhausted: () => void;
  prefilledPrompt?: string;
  skillId?: string | null;
  skillTitle?: string | null;
  requestedModel?: string | null;
  mode?: "einsteiger" | "experte";
  lastUserPrompt?: string;
  // KI-Controls (moved from header)
  selectedModel: string;
  onModelChange: (model: string) => void;
  onThinkingChange: (enabled: boolean) => void;
  aiTier: "internal" | "external";
  onAiTierChange: (tier: "internal" | "external") => void;
  canUseExternal: boolean;
  aiRouting: AIRoutingConfig;
  // Agent
  agentConfig: AgentConfig;
  onAgentConfigChange: (config: AgentConfig) => void;
  onStartAgent: (prompt: string) => void;
}

export const PlaygroundContent = ({
  messages,
  onSendMessage,
  isStreaming,
  streamingContent,
  thinkingContent,
  thinkingEnabled,
  systemPrompt,
  onSystemPromptChange,
  onClearChat,
  onStop,
  onBudgetExhausted,
  prefilledPrompt,
  skillId,
  skillTitle,
  requestedModel,
  mode = "experte",
  lastUserPrompt,
  selectedModel,
  onModelChange,
  onThinkingChange,
  aiTier,
  onAiTierChange,
  canUseExternal,
  aiRouting,
  agentConfig,
  onAgentConfigChange,
  onStartAgent,
}: PlaygroundContentProps) => {
  const isExperte = mode === "experte";
  const [chatMode, setChatMode] = useState<"chat" | "compare">("chat");
  const [agentEnabled, setAgentEnabled] = useState(false);

  const lastAssistantContent =
    messages.length >= 2 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].content
      : "";
  const hasAssistantResponse = lastAssistantContent.length > 0;
  const hasMessages = messages.length > 0;
  const hasAssistantMessage = messages.some(m => m.role === "assistant");

  const copyLastResponse = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      toast.success("Antwort kopiert!");
    }
  };

  // ⚠️ min-h-0 + min-w-0: Erlaubt Flex-Children zu schrumpfen statt zu überlaufen
  return (
    <main className="h-full flex flex-col min-h-0 min-w-0">
      {/* Skill-Banner */}
      {skillId && (
        <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-2 mb-3 flex items-center gap-2 text-sm">
          <Bookmark className="w-4 h-4 text-primary shrink-0" />
          <span>
            Skill testen: <strong>{skillTitle}</strong>
            {requestedModel && (
              <>
                {" "}· Ziel-Modell:{" "}
                <Badge variant="outline" className="text-[10px] ml-1">
                  {requestedModel.split("/").pop()}
                </Badge>
              </>
            )}
          </span>
        </div>
      )}

      {/* ═══ TOOLBAR — Icon-only + kontextuelle Buttons ═══ */}
      <div className="flex items-center px-3 py-1.5 border-b border-border gap-1">
        <span className="text-xs font-semibold text-foreground mr-1">
          {chatMode === "compare" ? "Vergleich" : "Chat"}
        </span>

        {/* KI-Bewertung — nur Experte + Chat + Antwort vorhanden */}
        {isExperte && hasAssistantResponse && chatMode === "chat" && lastUserPrompt && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground" title="KI bewertet die Qualität und Vollständigkeit der Antwort">
                <Scale className="w-3 h-3" /> Antwort bewerten
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[400px] max-h-[500px] overflow-y-auto p-4">
              <JudgePanel prompt={lastUserPrompt} output={lastAssistantContent} model={selectedModel || ""} />
            </PopoverContent>
          </Popover>
        )}

        <div className="flex-1" />

        {/* Icon-only actions */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Exportieren" disabled={!hasMessages}>
              <Download className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1.5">
            <button
              onClick={() => { exportChatAsMarkdown(messages); toast.success("Als Markdown exportiert!"); }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Als Markdown (.md)
            </button>
            <button
              onClick={() => { exportChatAsDocx(messages); toast.success("Als Word exportiert!"); }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Als Word (.docx)
            </button>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Kopieren" disabled={!hasAssistantMessage}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1.5">
            <button
              onClick={copyLastResponse}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Letzte KI-Antwort
            </button>
            <button
              onClick={() => {
                const full = messages.map(m => `${m.role === "user" ? "Du" : "KI"}:\n${m.content}`).join("\n\n---\n\n");
                navigator.clipboard.writeText(full);
                toast.success("Ganzen Chat kopiert!");
              }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Ganzen Chat
            </button>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          title="Verlauf leeren"
          onClick={onClearChat}
          disabled={!hasMessages}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* ═══ CONTENT — Chat oder Vergleich ═══ */}
      {chatMode === "compare" ? (
        <ComparisonSplitView
          systemPrompt={systemPrompt}
          onBudgetExhausted={onBudgetExhausted}
          selectedModel={selectedModel}
          onBackToChat={() => setChatMode("chat")}
        />
      ) : (
        <div data-tour="chat-area" className="flex-1 min-h-0">
          <ChatPlayground
            messages={messages}
            onSendMessage={onSendMessage}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            thinkingContent={thinkingContent}
            thinkingEnabled={thinkingEnabled}
            systemPrompt={systemPrompt}
            onSystemPromptChange={onSystemPromptChange}
            onClearChat={onClearChat}
            onStop={onStop}
            initialPrompt={prefilledPrompt}
            hideSystemPrompt
            
          />
        </div>
      )}

      {/* ═══ KI-CONTROLS BAR — über dem Input, nur Experte ═══ */}
      {isExperte && (
        <div className="border-t border-border px-3 py-1.5 flex items-center gap-2">
          {/* Modus-Switch */}
          <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
            <button
              onClick={() => setChatMode("chat")}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                chatMode === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setChatMode("compare")}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                chatMode === "compare" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              ⚖ Vergleich
            </button>
          </div>

          <div className="flex-1" />

          {/* Model badge + dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-[10px] font-medium text-foreground transition-colors">
                {aiTier === "internal" ? "🏢" : "☁️"} {getModelLabel(selectedModel)}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-3 space-y-3">
              <h4 className="text-xs font-semibold">Modell</h4>
              <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger className="w-full text-xs h-8">
                  <span className="truncate">{getModelLabel(selectedModel)}</span>
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
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => onAiTierChange("internal")}
                  className={cn(
                    "flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                    aiTier === "internal"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  🏢 Intern
                </button>
                <button
                  onClick={() => canUseExternal && onAiTierChange("external")}
                  disabled={!canUseExternal}
                  className={cn(
                    "flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                    aiTier === "external" && canUseExternal
                      ? "bg-primary text-primary-foreground"
                      : canUseExternal
                        ? "text-muted-foreground hover:bg-muted/50"
                        : "text-muted-foreground/30 cursor-not-allowed"
                  )}
                >
                  ☁️ Extern
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Thinking toggle chip */}
          <button
            onClick={() => onThinkingChange(!thinkingEnabled)}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors flex items-center gap-1",
              thinkingEnabled
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <Brain className="w-3 h-3" />
            {thinkingEnabled ? "Denken an" : "Denken"}
          </button>

          {/* Settings Popover — Agent toggle + session settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3 space-y-3">
              <h4 className="text-xs font-semibold">Einstellungen</h4>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">System-Prompt</label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => onSystemPromptChange(e.target.value)}
                  placeholder="Optionaler System-Prompt..."
                  className="text-xs min-h-[48px] resize-y"
                  rows={2}
                />
              </div>
              <Separator />
              <label className="flex items-center justify-between">
                <span className="text-[11px]">🤖 Agenten-Modus</span>
                <Switch checked={agentEnabled} onCheckedChange={setAgentEnabled} />
              </label>
              {agentEnabled && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-[11px] h-7 gap-1">
                      🤖 Agent konfigurieren
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
                    <SheetTitle className="text-base font-bold mb-4">🤖 Agenten-Modus</SheetTitle>
                    <AgentKnobs
                      config={agentConfig}
                      onConfigChange={onAgentConfigChange}
                      onStartAgent={onStartAgent}
                      bare
                    />
                  </SheetContent>
                </Sheet>
              )}
              <Separator />
              <p className="text-[10px] text-muted-foreground">
                Einstellungen gelten für diese Session.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </main>
  );
};
