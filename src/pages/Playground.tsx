import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, MessageSquare, GitCompare, Bot, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BudgetDialog } from "@/components/BudgetDialog";
import { ChatPlayground } from "@/components/playground/ChatPlayground";
import { ComparisonView } from "@/components/playground/ComparisonView";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { PlaygroundSidebar } from "@/components/playground/PlaygroundSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import { loadAIRouting, getAllModels } from "@/data/models";
import { promptLibrary } from "@/data/prompts";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import type { AgentConfig } from "@/components/playground/AgentKnobs";

const Playground = () => {
  const { isLoggedIn, isLoading, profile } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPrompt = searchParams.get("prompt") ?? undefined;
  const skillId = searchParams.get("skillId");
  const skillTitle = searchParams.get("skillTitle");
  const requestedModel = searchParams.get("model");

  // --- Model & routing state ---
  const [selectedModel, setSelectedModel] = useState(
    profile?.preferred_model ?? "google/gemini-3-flash-preview"
  );
  const [thinkingEnabled, setThinkingEnabled] = useState(
    () => localStorage.getItem("thinking_enabled") === "true"
  );
  const [aiTier, setAiTier] = useState<"internal" | "external">("external");
  const aiRouting = loadAIRouting();
  const [promptConfidentiality, setPromptConfidentiality] = useState<"open" | "internal" | "confidential">("open");
  const [systemPrompt, setSystemPrompt] = useState("");

  const canUseExternal = promptConfidentiality !== "confidential" &&
    !(promptConfidentiality === "internal" && aiRouting.internalRouting === "internal-only");

  // --- UI state ---
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [actaFields, setActaFields] = useState<ACTAFields>({ act: "", context: "", task: "", ausgabe: "" });
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    habitat: "", hands: ["read", "write", "web"], leash: 50, proof: "sources", task: "",
  });

  // --- Custom hooks ---
  const chat = useChat({
    systemPrompt,
    selectedModel,
    thinkingEnabled,
    onBudgetExhausted: () => setShowBudgetDialog(true),
  });

  const convos = useConversations();

  // --- AI tier routing ---
  useEffect(() => {
    if (promptConfidentiality === "confidential" || promptConfidentiality === "internal") {
      setAiTier("internal");
    } else {
      setAiTier(aiRouting.openRouting === "prefer-external" ? "external" : "internal");
    }
  }, [promptConfidentiality]);

  // --- Prefilled prompt confidentiality ---
  useEffect(() => {
    if (prefilledPrompt) {
      const match = promptLibrary.find((p) => p.prompt === prefilledPrompt);
      if (match?.confidentiality) setPromptConfidentiality(match.confidentiality);
    }
  }, [prefilledPrompt]);

  // --- Restore active conversation on mount ---
  useEffect(() => {
    if (prefilledPrompt) return;
    const restored = convos.restoreActiveConversation();
    if (restored) {
      chat.setMessages(restored.messages);
      setSystemPrompt(restored.systemPrompt);
      setSelectedModel(restored.model);
    }
  }, []);

  // --- Update model when profile loads ---
  useEffect(() => {
    if (profile?.preferred_model) setSelectedModel(profile.preferred_model);
  }, [profile?.preferred_model]);

  // --- Set requested model from skill URL param ---
  useEffect(() => {
    if (requestedModel) {
      const allModels = getAllModels();
      if (allModels.some((m) => m.value === requestedModel)) {
        setSelectedModel(requestedModel);
      }
    }
  }, [requestedModel]);

  // --- Persist conversation on message change ---
  useEffect(() => {
    convos.persistMessages(chat.messages, systemPrompt, selectedModel, chat.isStreaming);
  }, [chat.messages, chat.isStreaming]);

  // --- Handlers ---
  const handleThinkingChange = (checked: boolean) => {
    setThinkingEnabled(checked);
    localStorage.setItem("thinking_enabled", String(checked));
  };

  const handleSelectConversation = (conv: Parameters<typeof convos.selectConversation>[0]) => {
    const data = convos.selectConversation(conv);
    chat.setMessages(data.messages);
    setSystemPrompt(data.systemPrompt);
    setSelectedModel(data.model);
    chat.setStreamingContent("");
    chat.resetThinking();
  };

  const handleNewConversation = () => {
    chat.setMessages([]);
    chat.setStreamingContent("");
    chat.resetThinking();
    setSystemPrompt("");
    convos.newConversation();
  };

  const handleDeleteConversation = (id: string) => {
    const wasActive = convos.deleteConversation(id);
    if (wasActive) {
      chat.setMessages([]);
      chat.setStreamingContent("");
      chat.resetThinking();
    }
  };

  const handleClearChat = () => {
    chat.setMessages([]);
    chat.setStreamingContent("");
    chat.resetThinking();
    convos.clearActiveConversation();
  };

  const handleStartAgent = (prompt: string) => {
    setActiveTab("chat");
    chat.sendMessage(prompt);
  };

  const lastUserPrompt = [...chat.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <PlaygroundHeader
        thinkingEnabled={thinkingEnabled}
        onThinkingChange={handleThinkingChange}
        aiTier={aiTier}
        onAiTierChange={setAiTier}
        canUseExternal={canUseExternal}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        aiRouting={aiRouting}
        promptConfidentiality={promptConfidentiality}
      />

      <div className="px-4 py-4 max-w-[1380px] mx-auto">
        {!isLoggedIn ? (
          <Card className="max-w-md mx-auto mt-16 rounded-xl border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Anmeldung erforderlich
              </CardTitle>
              <CardDescription>
                Melde dich an, um das Prompt-Labor zu nutzen und KI-Modelle
                direkt auszuprobieren.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} className="w-full">
                Zur Anmeldung
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
          <ResizablePanelGroup direction="horizontal" className="hidden lg:flex">
            <ResizablePanel defaultSize={29} minSize={20} maxSize={40} className="pr-0">
              <PlaygroundSidebar
                conversations={convos.conversations}
                activeConversationId={convos.activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onDeleteConversation={handleDeleteConversation}
                onRenameConversation={convos.renameConversation}
                actaFields={actaFields}
                onActaFieldsChange={setActaFields}
                onSendFromACTA={chat.sendMessage}
                onApplyTechnique={chat.sendMessage}
                agentConfig={agentConfig}
                onAgentConfigChange={setAgentConfig}
                onStartAgent={handleStartAgent}
                lastUserPrompt={lastUserPrompt}
                selectedModel={selectedModel}
                messages={chat.messages}
              />
            </ResizablePanel>
            <ResizableHandle withHandle className="mx-2" />
            <ResizablePanel defaultSize={71}>
              <main className="min-h-[600px]">
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
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

                <TabsContent value="chat" className="mt-0">
                  <ChatPlayground
                    messages={chat.messages}
                    onSendMessage={chat.sendMessage}
                    isStreaming={chat.isStreaming}
                    streamingContent={chat.streamingContent}
                    thinkingContent={chat.thinkingContent}
                    thinkingEnabled={thinkingEnabled}
                    systemPrompt={systemPrompt}
                    onSystemPromptChange={setSystemPrompt}
                    onClearChat={handleClearChat}
                    onStop={chat.handleStop}
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
                      in der linken Seitenleiste. Definiere Arbeitsbereich, Werkzeuge, Autonomie-Grad
                      und Erfolgsnachweise, um einen &quot;Worker&quot; zu instruieren wie einen Junior-Mitarbeiter.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-primary mb-1">Habitat</div>
                        <p className="text-xs text-muted-foreground">Wo darf der Agent arbeiten? Definiere erlaubte Datenquellen und Arbeitsbereiche.</p>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-primary mb-1">Hands</div>
                        <p className="text-xs text-muted-foreground">Was darf der Agent tun? Wähle erlaubte Werkzeuge und Aktionen.</p>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-primary mb-1">Leash</div>
                        <p className="text-xs text-muted-foreground">Wie autonom? Vom Schritt-für-Schritt bis zur vollen Selbstständigkeit.</p>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <div className="text-xs font-semibold text-primary mb-1">Proof</div>
                        <p className="text-xs text-muted-foreground">Wie beweist er Erfolg? Quellenangaben, Logs oder Checklisten.</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Nutze den &quot;Agenten-Modus&quot; in der Seitenleiste, um den Assistenten zu konfigurieren und zu starten.
                    </p>
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
                      onBudgetExhausted={() => setShowBudgetDialog(true)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </main>
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Mobile layout (below lg) */}
          <div className="lg:hidden">
            <PlaygroundSidebar
              conversations={convos.conversations}
              activeConversationId={convos.activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onRenameConversation={convos.renameConversation}
              actaFields={actaFields}
              onActaFieldsChange={setActaFields}
              onSendFromACTA={chat.sendMessage}
              onApplyTechnique={chat.sendMessage}
              agentConfig={agentConfig}
              onAgentConfigChange={setAgentConfig}
              onStartAgent={handleStartAgent}
              lastUserPrompt={lastUserPrompt}
              selectedModel={selectedModel}
              messages={chat.messages}
            />
            <main className="min-h-[600px]">
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
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

                <TabsContent value="chat" className="mt-0">
                  <ChatPlayground
                    messages={chat.messages}
                    onSendMessage={chat.sendMessage}
                    isStreaming={chat.isStreaming}
                    streamingContent={chat.streamingContent}
                    thinkingContent={chat.thinkingContent}
                    thinkingEnabled={thinkingEnabled}
                    systemPrompt={systemPrompt}
                    onSystemPromptChange={setSystemPrompt}
                    onClearChat={handleClearChat}
                    onStop={chat.handleStop}
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
                    </p>
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
                      onBudgetExhausted={() => setShowBudgetDialog(true)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
          </>
        )}
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />
    </div>
  );
};

export default Playground;
