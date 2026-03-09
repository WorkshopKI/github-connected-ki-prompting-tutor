import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { BudgetDialog } from "@/components/BudgetDialog";
import { PlaygroundContent } from "@/components/playground/PlaygroundContent";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { PlaygroundSidebar } from "@/components/playground/PlaygroundSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import { loadAIRouting, getAllModels } from "@/data/models";
import { LS_KEYS, DEFAULT_MODEL } from "@/lib/constants";
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
    profile?.preferred_model ?? DEFAULT_MODEL
  );
  const [thinkingEnabled, setThinkingEnabled] = useState(
    () => localStorage.getItem(LS_KEYS.THINKING_ENABLED) === "true"
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

  // --- Playground mode ---
  const [playgroundMode, setPlaygroundMode] = useState<"einsteiger" | "experte">(() =>
    (localStorage.getItem(LS_KEYS.PLAYGROUND_MODE) as "einsteiger" | "experte") ?? "einsteiger"
  );

  const handleModeChange = (mode: "einsteiger" | "experte") => {
    setPlaygroundMode(mode);
    localStorage.setItem(LS_KEYS.PLAYGROUND_MODE, mode);
  };

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
    localStorage.setItem(LS_KEYS.THINKING_ENABLED, String(checked));
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
    <div className="h-screen flex flex-col overflow-hidden bg-background">
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
        mode={playgroundMode}
        onModeChange={handleModeChange}
      />

      <div className="px-4 py-4 max-w-[1380px] mx-auto flex-1 overflow-hidden">
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
          <ResizablePanelGroup direction="horizontal" className="hidden lg:flex h-full">
            <ResizablePanel defaultSize={33} minSize={20} maxSize={40} className="pr-0">
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
                mode={playgroundMode}
              />
            </ResizablePanel>
            <ResizableHandle withHandle className="mx-2" />
            <ResizablePanel defaultSize={71}>
              <PlaygroundContent
                activeTab={activeTab}
                onTabChange={setActiveTab}
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
                onBudgetExhausted={() => setShowBudgetDialog(true)}
                prefilledPrompt={prefilledPrompt}
                skillId={skillId}
                skillTitle={skillTitle}
                requestedModel={requestedModel}
                variant="desktop"
                mode={playgroundMode}
              />
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Mobile layout (below lg) */}
          <div className="lg:hidden h-full flex flex-col">
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
              mode={playgroundMode}
            />
            <PlaygroundContent
              activeTab={activeTab}
              onTabChange={setActiveTab}
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
              onBudgetExhausted={() => setShowBudgetDialog(true)}
              prefilledPrompt={prefilledPrompt}
              skillId={skillId}
              skillTitle={skillTitle}
              requestedModel={requestedModel}
              variant="mobile"
              mode={playgroundMode}
            />
          </div>
          </>
        )}
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />
    </div>
  );
};

export default Playground;
