import { useState } from "react";
import { Download, Copy, Trash2, Sparkles, Scale, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChatPlayground } from "./ChatPlayground";
import { ComparisonSplitView } from "./ComparisonSplitView";
import { PromptEvaluation } from "./PromptEvaluation";
import { JudgePanel } from "./JudgePanel";
import { cn } from "@/lib/utils";
import type { Msg } from "@/services/llmService";

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
  selectedModel?: string;
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
}: PlaygroundContentProps) => {
  const isExperte = mode === "experte";
  const [chatMode, setChatMode] = useState<"chat" | "compare">("chat");

  const lastAssistantContent =
    messages.length >= 2 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].content
      : "";
  const hasAssistantResponse = lastAssistantContent.length > 0;

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

      {/* Icon-only Toolbar + contextual Power-Buttons */}
      <div className="flex items-center px-3 py-1.5 border-b border-border gap-1">
        <span className="text-xs font-semibold text-foreground mr-1">
          {chatMode === "compare" ? "Vergleich" : "Chat"}
        </span>

        {/* Prompt-Check Popover — nur Experte + Chat-Modus + Prompt vorhanden */}
        {isExperte && lastUserPrompt && chatMode === "chat" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                <Sparkles className="w-3 h-3" /> Check
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[360px] max-h-[400px] overflow-y-auto p-4">
              <PromptEvaluation prompt={lastUserPrompt} model={selectedModel} />
            </PopoverContent>
          </Popover>
        )}

        {/* KI-Bewertung Popover — nur Experte + Chat-Modus + Antwort vorhanden */}
        {isExperte && hasAssistantResponse && chatMode === "chat" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                <Scale className="w-3 h-3" /> Bewertung
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[400px] max-h-[500px] overflow-y-auto p-4">
              <JudgePanel prompt={lastUserPrompt || ""} output={lastAssistantContent} model={selectedModel || ""} />
            </PopoverContent>
          </Popover>
        )}

        <div className="flex-1" />

        {/* Icon-only actions */}
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Exportieren">
          <Download className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" title="Kopieren">
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          title="Verlauf leeren"
          onClick={onClearChat}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* System-Prompt aufklappbar — nur Experte, nur Chat-Modus */}
      {isExperte && chatMode === "chat" && (
        <details className="border-b border-border">
          <summary className="text-[10px] text-muted-foreground px-4 py-1.5 cursor-pointer select-none hover:bg-muted/30 transition-colors">
            ⚙ System-Prompt (optional)
          </summary>
          <div className="px-4 pb-2">
            <Textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Optionaler System-Prompt..."
              className="text-[11px] min-h-[48px] resize-y"
              rows={2}
            />
          </div>
        </details>
      )}

      {/* ═══ CONTENT — Normal-Chat oder Split-Vergleich ═══ */}
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
            hideToolbar
          />
        </div>
      )}

      {/* ═══ MODUS-TOGGLE — nur Experte, unter dem Chat ═══ */}
      {isExperte && chatMode !== "compare" && (
        <div className="border-t border-border px-3 pt-1.5 pb-0.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
              <button
                onClick={() => setChatMode("chat")}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-medium transition-colors",
                  chatMode === "chat"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                💬 Chat
              </button>
              <button
                onClick={() => setChatMode("compare")}
                className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-medium transition-colors",
                  chatMode === "compare"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                ⚖ Vergleich
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
