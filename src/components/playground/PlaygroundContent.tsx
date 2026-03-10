import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, GitCompare, Bot, Bookmark, Sparkles, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatPlayground } from "./ChatPlayground";
import { ComparisonView } from "./ComparisonView";
import { PromptEvaluation } from "./PromptEvaluation";
import { JudgePanel } from "./JudgePanel";
import type { Msg } from "@/services/llmService";

export interface PlaygroundContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  /** Desktop version shows full agent description */
  variant?: "desktop" | "mobile";
  mode?: "einsteiger" | "experte";
  lastUserPrompt?: string;
  selectedModel?: string;
}

export const PlaygroundContent = ({
  activeTab,
  onTabChange,
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
  variant = "desktop",
  mode = "experte",
  lastUserPrompt,
  selectedModel,
}: PlaygroundContentProps) => {
  const isEinsteiger = mode === "einsteiger";

  const lastAssistantContent = messages.length >= 2 && messages[messages.length - 1].role === "assistant"
    ? messages[messages.length - 1].content
    : "";
  const hasAssistantResponse = lastAssistantContent.length > 0;

  // ⚠️ min-h-0 + min-w-0: Erlaubt Flex-Children zu schrumpfen statt zu überlaufen
  return (
    <main className="h-full flex flex-col min-h-0 min-w-0">
      {skillId && (
        <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-2 mb-3 flex items-center gap-2 text-sm">
          <Bookmark className="w-4 h-4 text-primary shrink-0" />
          <span>
            Skill testen: <strong>{skillTitle}</strong>
            {requestedModel && (
              <> · Ziel-Modell: <Badge variant="outline" className="text-[10px] ml-1">{requestedModel.split("/").pop()}</Badge></>
            )}
          </span>
        </div>
      )}

      {isEinsteiger ? (
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
      ) : (
        <Tabs data-tour="chat-area" value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center mb-3">
            <TabsList>
              <TabsTrigger value="chat" className="gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="agent" className="gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Assistent
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-1.5">
                <GitCompare className="w-3.5 h-3.5" />
                Vergleich
              </TabsTrigger>
            </TabsList>

            {/* Power-Buttons — rechts neben Tabs */}
            <div className="flex items-center gap-1 ml-auto">
              {lastUserPrompt && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground">
                      <Sparkles className="w-3 h-3" />
                      Prompt-Check
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[360px] max-h-[400px] overflow-y-auto p-4">
                    <PromptEvaluation prompt={lastUserPrompt} model={selectedModel} />
                  </PopoverContent>
                </Popover>
              )}
              {hasAssistantResponse && lastUserPrompt && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-muted-foreground">
                      <Scale className="w-3 h-3" />
                      Bewertung
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[400px] max-h-[500px] overflow-y-auto p-4">
                    <JudgePanel prompt={lastUserPrompt} output={lastAssistantContent} model={selectedModel || ""} />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <TabsContent value="chat" className="mt-0 flex-1 min-h-0 min-w-0 flex flex-col">
            {/* System-Prompt — Experte only, collapsible details */}
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
            <div className="flex-1 min-h-0">
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
          </TabsContent>

          <TabsContent value="agent" className="mt-0">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Agenten-Modus</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Konfiguriere einen autonomen KI-Assistenten mit den 4 Zuverlässigkeits-Reglern.
                {variant === "desktop" && (
                  <> Definiere Arbeitsbereich, Werkzeuge, Autonomie-Grad
                  und Erfolgsnachweise, um einen &quot;Worker&quot; zu instruieren wie einen Junior-Mitarbeiter.
                  Nutze das 🤖-Icon im Header, um den Agenten zu konfigurieren.</>
                )}
              </p>
              {variant === "desktop" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { de: "Arbeitsbereich", en: "Habitat", icon: "🏠", desc: "Wo darf der Agent arbeiten? Definiere erlaubte Datenquellen und Arbeitsbereiche." },
                    { de: "Werkzeuge", en: "Hands", icon: "🔧", desc: "Was darf der Agent tun? Wähle erlaubte Werkzeuge und Aktionen." },
                    { de: "Autonomie", en: "Leash", icon: "⚡", desc: "Wie autonom? Vom Schritt-für-Schritt bis zur vollen Selbstständigkeit." },
                    { de: "Nachweis", en: "Proof", icon: "📋", desc: "Wie beweist er Erfolg? Quellenangaben, Logs oder Checklisten." },
                  ].map((item) => (
                    <div key={item.en} className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-xs font-semibold text-primary">{item.de}</span>
                        <span className="text-[10px] text-muted-foreground">({item.en})</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compare" className="mt-0">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-3">Modell-Vergleich</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Sende denselben Prompt an zwei verschiedene Modelle und vergleiche die Antworten.
              </p>
              <ComparisonView
                systemPrompt={systemPrompt}
                onBudgetExhausted={onBudgetExhausted}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
};
