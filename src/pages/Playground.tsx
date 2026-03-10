import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LogIn, BookOpen } from "lucide-react";
import { BudgetDialog } from "@/components/BudgetDialog";
import { PlaygroundContent } from "@/components/playground/PlaygroundContent";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { PromptBrowser } from "@/components/playground/PromptBrowser";
import { ACTABuilder } from "@/components/playground/ACTABuilder";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import { loadAIRouting, getAllModels } from "@/data/models";
import { LS_KEYS, DEFAULT_MODEL } from "@/lib/constants";
import { promptLibrary } from "@/data/prompts";
import { splitPromptToACTA } from "@/lib/promptUtils";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import type { AgentConfig } from "@/components/playground/AgentKnobs";
import { useTour } from "@/hooks/useTour";
import { getStepsForMode } from "@/components/playground/tourSteps";
import { TourOverlay } from "@/components/playground/TourOverlay";

const Playground = () => {
  const { isLoggedIn, isLoading, profile } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPrompt = searchParams.get("prompt") ?? undefined;
  const libraryTitle = searchParams.get("libraryTitle");
  const skillId = searchParams.get("skillId");
  const skillTitle = searchParams.get("skillTitle");
  const requestedModel = searchParams.get("model");

  // --- Model & routing state ---
  const allModels = getAllModels();
  const validModel = (id: string | undefined | null): string =>
    id && allModels.some((m) => m.value === id) ? id : DEFAULT_MODEL;

  const [selectedModel, setSelectedModel] = useState(
    () => validModel(profile?.preferred_model)
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
  const [sourcePromptTitle, setSourcePromptTitle] = useState<string | null>(null);
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

  // --- Guided tour ---
  const tourSteps = useMemo(() => getStepsForMode(playgroundMode), [playgroundMode]);
  const tour = useTour(tourSteps.length);

  useEffect(() => {
    if (!tour.hasCompleted && isLoggedIn && !isLoading) {
      const timer = setTimeout(() => tour.start(), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isLoading]);

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

  // --- Library prompt → ACTA pre-fill ---
  useEffect(() => {
    if (!libraryTitle) return;
    const match = promptLibrary.find(p => p.title === libraryTitle);
    if (!match) return;

    setSourcePromptTitle(match.title);

    if (match.actaFields) {
      setActaFields({
        act: match.actaFields.act || "",
        context: match.actaFields.context || "",
        task: match.actaFields.task || "",
        ausgabe: match.actaFields.ausgabe || "",
      });
    } else {
      setActaFields(splitPromptToACTA(match.prompt, match.title));
    }

    if (match.confidentiality) {
      setPromptConfidentiality(match.confidentiality);
    }
  }, [libraryTitle]);

  // --- Restore active conversation on mount ---
  useEffect(() => {
    if (prefilledPrompt) return;
    const restored = convos.restoreActiveConversation();
    if (restored) {
      chat.setMessages(restored.messages);
      setSystemPrompt(restored.systemPrompt);
      setSelectedModel(validModel(restored.model));
    }
  }, []);

  // --- Update model when profile loads ---
  useEffect(() => {
    if (profile?.preferred_model) setSelectedModel(validModel(profile.preferred_model));
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
    setSelectedModel(validModel(data.model));
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

  // --- Prompt Browser selection handler ---
  const handleBrowserSelect = (title: string) => {
    const found = promptLibrary.find(p => p.title === title);
    if (!found) return;
    setSourcePromptTitle(title);
    if (found.actaFields) {
      setActaFields({
        act: found.actaFields.act || "",
        context: found.actaFields.context || "",
        task: found.actaFields.task || "",
        ausgabe: found.actaFields.ausgabe || "",
      });
    } else {
      const fallback = splitPromptToACTA(found.prompt, found.title);
      setActaFields({ act: fallback.act, context: fallback.context, task: fallback.task, ausgabe: fallback.ausgabe });
    }
    if (found.confidentiality) setPromptConfidentiality(found.confidentiality);
  };

  const lastUserPrompt = [...chat.messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (isLoading) return null;

  // ⚠️ LAYOUT-KETTE: h-screen + overflow-hidden verhindert Body-Scroll.
  //    Playground hat eigene Scroll-Container in ChatPlayground und PromptBrowser.
  return (
    <div className="playground-root">
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
        sourceTitle={sourcePromptTitle}
        onStartTour={tour.start}
        onStartAgent={handleStartAgent}
        agentConfig={agentConfig}
        onAgentConfigChange={setAgentConfig}
      />

      {/* ⚠️ flex-1 + overflow-hidden: Nimmt Resthöhe (screen − header), kein Scroll auf dieser Ebene */}
      <div className="flex-1 overflow-hidden">
        {!isLoggedIn ? (
          <div className="px-4 py-4 max-w-[1380px] mx-auto">
            <Card className="max-w-md mx-auto mt-16 rounded-xl border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Anmeldung erforderlich
                </CardTitle>
                <CardDescription>
                  Melde dich an, um die Prompt Werkstatt zu nutzen und KI-Modelle
                  direkt auszuprobieren.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/login")} className="w-full">
                  Zur Anmeldung
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Desktop layout (≥ lg): 3-Panel */}
            <div className="hidden lg:flex h-full">
              {/* LEFT: Prompt Browser — fixed 220px */}
              <div className="w-[220px] shrink-0 border-r border-border">
                <PromptBrowser
                  onSelectPrompt={handleBrowserSelect}
                  activePromptTitle={sourcePromptTitle}
                  conversations={convos.conversations}
                  activeConversationId={convos.activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  onNewConversation={handleNewConversation}
                  onDeleteConversation={handleDeleteConversation}
                  onRenameConversation={convos.renameConversation}
                />
              </div>

              {/* CENTER: ACTA-Bar (top) + Chat (bottom) */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* ACTA Bar */}
                <ACTABuilder
                  fields={actaFields}
                  onFieldsChange={setActaFields}
                  onSendToPlayground={chat.sendMessage}
                  layout="horizontal"
                  mode={playgroundMode}
                  selectedModel={selectedModel}
                  sourceTitle={sourcePromptTitle}
                />

                {/* Chat */}
                <div className="flex-1 min-h-0 px-4 py-2">
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
                    lastUserPrompt={lastUserPrompt}
                    selectedModel={selectedModel}
                  />
                </div>
              </div>
            </div>

            {/* Mobile layout (< lg) */}
            <div className="lg:hidden h-full flex flex-col">
              {/* ACTA Bar — full width */}
              <ACTABuilder
                fields={actaFields}
                onFieldsChange={setActaFields}
                onSendToPlayground={chat.sendMessage}
                layout="horizontal"
                mode={playgroundMode}
                selectedModel={selectedModel}
                sourceTitle={sourcePromptTitle}
              />

              {/* Chat */}
              <div className="flex-1 min-h-0 px-4 py-2">
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
                  lastUserPrompt={lastUserPrompt}
                  selectedModel={selectedModel}
                />
              </div>

              {/* Prompt Browser as Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" className="fixed bottom-4 left-4 z-40 rounded-full shadow-lg h-12 w-12">
                    <BookOpen className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Vorlagen</SheetTitle>
                  <PromptBrowser
                    onSelectPrompt={handleBrowserSelect}
                    activePromptTitle={sourcePromptTitle}
                    conversations={convos.conversations}
                    activeConversationId={convos.activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    onNewConversation={handleNewConversation}
                    onDeleteConversation={handleDeleteConversation}
                    onRenameConversation={convos.renameConversation}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />

      {tour.isActive && tour.activeStep !== null && tourSteps[tour.activeStep] && (
        <TourOverlay
          step={tourSteps[tour.activeStep]}
          stepIndex={tour.activeStep}
          totalSteps={tourSteps.length}
          onNext={tour.next}
          onPrev={tour.prev}
          onFinish={tour.finish}
        />
      )}
    </div>
  );
};

export default Playground;
