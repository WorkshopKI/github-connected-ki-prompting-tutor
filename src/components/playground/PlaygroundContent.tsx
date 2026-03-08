import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, GitCompare, Bot, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatPlayground } from "./ChatPlayground";
import { ComparisonView } from "./ComparisonView";
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
}: PlaygroundContentProps) => {
  const isEinsteiger = mode === "einsteiger";

  return (
    <main className="h-full flex flex-col min-h-0">
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
      ) : (
        <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mb-4">
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

          <TabsContent value="chat" className="mt-0 flex-1 min-h-0">
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
            />
          </TabsContent>

          <TabsContent value="agent" className="mt-0">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Agenten-Modus</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Konfiguriere einen autonomen KI-Assistenten mit den 4 Zuverlässigkeits-Reglern
                in der linken Seitenleiste.
                {variant === "desktop" && (
                  <> Definiere Arbeitsbereich, Werkzeuge, Autonomie-Grad
                  und Erfolgsnachweise, um einen &quot;Worker&quot; zu instruieren wie einen Junior-Mitarbeiter.</>
                )}
              </p>
              {variant === "desktop" && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
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
                  <p className="text-xs text-muted-foreground text-center">
                    Nutze den &quot;Agenten-Modus&quot; in der Seitenleiste, um den Assistenten zu konfigurieren und zu starten.
                  </p>
                </>
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
