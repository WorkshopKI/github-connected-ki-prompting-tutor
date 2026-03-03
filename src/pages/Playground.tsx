import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { streamChat, type Msg } from "@/services/llmService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogIn, MessageSquare, GitCompare, Sparkles, Bot } from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { BudgetDialog } from "@/components/BudgetDialog";
import { ChatPlayground } from "@/components/playground/ChatPlayground";
import { ACTABuilder } from "@/components/playground/ACTABuilder";
import { ConversationHistory, type SavedConversation } from "@/components/playground/ConversationHistory";
import { TechniquePanel } from "@/components/playground/TechniquePanel";
import { PromptEvaluation } from "@/components/playground/PromptEvaluation";
import { ComparisonView } from "@/components/playground/ComparisonView";
import type { ACTAFields } from "@/components/playground/ACTATemplates";
import { AgentKnobs, type AgentConfig } from "@/components/playground/AgentKnobs";
import { BUILTIN_MODELS, LATEST_MODELS, getAllModels } from "@/data/models";

const LS_CONVERSATIONS = "playground_conversations";
const LS_ACTIVE_ID = "playground_active_id";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadConversations(): SavedConversation[] {
  try {
    const raw = localStorage.getItem(LS_CONVERSATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: SavedConversation[]) {
  localStorage.setItem(LS_CONVERSATIONS, JSON.stringify(convs));
}

function generateTitle(messages: Msg[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Neuer Chat";
  const text = firstUser.content.slice(0, 50);
  return text.length < firstUser.content.length ? text + "…" : text;
}

const Playground = () => {
  const { isLoggedIn, isLoading, profile } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPrompt = searchParams.get("prompt") ?? undefined;

  // --- Core chat state ---
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    profile?.preferred_model ?? "google/gemini-3-flash-preview"
  );

  // --- Conversation management ---
  const [conversations, setConversations] = useState<SavedConversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => localStorage.getItem(LS_ACTIVE_ID)
  );

  // --- Sidebar state ---
  const [actaFields, setActaFields] = useState<ACTAFields>({
    act: "", context: "", task: "", ausgabe: "",
  });
  const [actaOpen, setActaOpen] = useState(true);
  const [techniquesOpen, setTechniquesOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    habitat: "",
    hands: ["read", "write", "web"],
    leash: 50,
    proof: "sources",
    task: "",
  });

  // --- UI state ---
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // --- Refs ---
  const accRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  // --- Restore active conversation on mount ---
  useEffect(() => {
    if (prefilledPrompt) return;
    if (activeConversationId) {
      const conv = conversations.find((c) => c.id === activeConversationId);
      if (conv) {
        setMessages(conv.messages);
        setSystemPrompt(conv.systemPrompt);
        setSelectedModel(conv.model);
        return;
      }
    }
    // Migrate old single-history format
    try {
      const old = localStorage.getItem("playground_history");
      if (old) {
        const parsed = JSON.parse(old);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated: SavedConversation = {
            id: generateId(),
            title: generateTitle(parsed),
            messages: parsed,
            systemPrompt: "",
            model: "google/gemini-3-flash-preview",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          const updated = [migrated, ...conversations];
          setConversations(updated);
          saveConversations(updated);
          setActiveConversationId(migrated.id);
          setMessages(parsed);
          localStorage.removeItem("playground_history");
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Update selected model when profile loads
  useEffect(() => {
    if (profile?.preferred_model) {
      setSelectedModel(profile.preferred_model);
    }
  }, [profile?.preferred_model]);

  // --- Persist conversation on message change ---
  useEffect(() => {
    if (messages.length === 0 || isStreaming) return;

    setConversations((prev) => {
      let updated: SavedConversation[];
      if (activeConversationId) {
        updated = prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, messages, systemPrompt, model: selectedModel, updatedAt: Date.now(), title: c.title === "Neuer Chat" ? generateTitle(messages) : c.title }
            : c
        );
      } else {
        const newConv: SavedConversation = {
          id: generateId(),
          title: generateTitle(messages),
          messages,
          systemPrompt,
          model: selectedModel,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        updated = [newConv, ...prev];
        setActiveConversationId(newConv.id);
        localStorage.setItem(LS_ACTIVE_ID, newConv.id);
      }
      saveConversations(updated);
      return updated;
    });
  }, [messages, isStreaming]);

  // --- Persist active ID ---
  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(LS_ACTIVE_ID, activeConversationId);
    } else {
      localStorage.removeItem(LS_ACTIVE_ID);
    }
  }, [activeConversationId]);

  // --- Streaming ---
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: Msg = { role: "user", content };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setStreamingContent("");
      setIsStreaming(true);
      accRef.current = "";

      const apiMessages: Msg[] = [];
      if (systemPrompt.trim()) {
        apiMessages.push({ role: "system", content: systemPrompt });
      }
      apiMessages.push(...newMessages.slice(-20));

      abortRef.current = new AbortController();

      await streamChat({
        messages: apiMessages,
        model: selectedModel,
        signal: abortRef.current.signal,
        onDelta: (text) => {
          accRef.current += text;
          setStreamingContent(accRef.current);
        },
        onDone: () => {
          const finalContent = accRef.current;
          if (finalContent) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: finalContent },
            ]);
          }
          setStreamingContent("");
          setIsStreaming(false);
          abortRef.current = null;
        },
        onError: (error, status) => {
          setIsStreaming(false);
          setStreamingContent("");
          abortRef.current = null;
          if (status === 402 || error === "budget_exhausted") {
            setShowBudgetDialog(true);
          } else {
            toast.error(error);
          }
        },
      });
    },
    [messages, isStreaming, systemPrompt, selectedModel]
  );

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      // Content accumulated so far gets saved via onDone
    }
  };

  // --- Conversation management ---
  const handleClearChat = () => {
    setMessages([]);
    setStreamingContent("");
    setActiveConversationId(null);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setStreamingContent("");
    setSystemPrompt("");
    setActiveConversationId(null);
  };

  const handleSelectConversation = (conv: SavedConversation) => {
    setMessages(conv.messages);
    setSystemPrompt(conv.systemPrompt);
    setSelectedModel(conv.model);
    setActiveConversationId(conv.id);
    setStreamingContent("");
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveConversations(updated);
      return updated;
    });
    if (activeConversationId === id) {
      setMessages([]);
      setStreamingContent("");
      setActiveConversationId(null);
    }
  };

  const handleRenameConversation = (id: string, title: string) => {
    setConversations((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, title } : c));
      saveConversations(updated);
      return updated;
    });
  };

  // --- Sidebar actions ---
  const handleSendFromACTA = (assembledPrompt: string) => {
    sendMessage(assembledPrompt);
  };

  const handleApplyTechnique = (promptTemplate: string) => {
    sendMessage(promptTemplate);
  };

  const handleStartAgent = (assembledPrompt: string) => {
    setActiveTab("chat");
    sendMessage(assembledPrompt);
  };

  // Get last user prompt for evaluation
  const lastUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>

          <h1 className="text-2xl font-bold">Prompt-Playground</h1>

          <div className="ml-auto">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[220px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Standard</SelectLabel>
                  {BUILTIN_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Latest</SelectLabel>
                  {LATEST_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectGroup>
                {(() => {
                  const custom = getAllModels().filter((m) => m.isCustom);
                  return custom.length > 0 ? (
                    <>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Eigene</SelectLabel>
                        {custom.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </>
                  ) : null;
                })()}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auth guard */}
        {!isLoggedIn ? (
          <Card className="max-w-md mx-auto mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Anmeldung erforderlich
              </CardTitle>
              <CardDescription>
                Melde dich an, um den Playground zu nutzen und KI-Modelle
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
          <div className="grid md:grid-cols-[380px_1fr] gap-6">
            {/* Left sidebar */}
            <aside className="space-y-4">
              {/* Conversation history */}
              <ConversationHistory
                conversations={conversations}
                activeId={activeConversationId}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
                onDelete={handleDeleteConversation}
                onRename={handleRenameConversation}
              />

              {/* ACTA Builder */}
              <ACTABuilder
                fields={actaFields}
                onFieldsChange={setActaFields}
                onSendToPlayground={handleSendFromACTA}
                isOpen={actaOpen}
                onToggle={() => setActaOpen((o) => !o)}
              />

              {/* Advanced Techniques */}
              <TechniquePanel
                onApplyToChat={handleApplyTechnique}
                isOpen={techniquesOpen}
                onToggle={() => setTechniquesOpen((o) => !o)}
              />

              {/* Agent Simulator */}
              <AgentKnobs
                config={agentConfig}
                onConfigChange={setAgentConfig}
                onStartAgent={handleStartAgent}
                isOpen={agentOpen}
                onToggle={() => setAgentOpen((o) => !o)}
              />

              {/* Prompt Evaluation */}
              {lastUserPrompt && (
                <div className="bg-gradient-card rounded-xl border border-border shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">Prompt-Qualität</span>
                  </div>
                  <PromptEvaluation prompt={lastUserPrompt} model={selectedModel} />
                </div>
              )}
            </aside>

            {/* Main area with tabs */}
            <main className="min-h-[600px]">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="chat" className="gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="agent" className="gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    Agent
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="gap-1.5">
                    <GitCompare className="w-3.5 h-3.5" />
                    Vergleich
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-0">
                  <ChatPlayground
                    messages={messages}
                    onSendMessage={sendMessage}
                    isStreaming={isStreaming}
                    streamingContent={streamingContent}
                    systemPrompt={systemPrompt}
                    onSystemPromptChange={setSystemPrompt}
                    onClearChat={handleClearChat}
                    onStop={handleStop}
                    initialPrompt={prefilledPrompt}
                  />
                </TabsContent>

                <TabsContent value="agent" className="mt-0">
                  <div className="bg-gradient-card rounded-xl border border-border shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Agenten-Simulator</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                      Konfiguriere einen autonomen KI-Agenten mit den 4 Zuverlässigkeits-Reglern
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
                      Nutze den &quot;Agenten-Simulator&quot; in der Seitenleiste, um den Agenten zu konfigurieren und zu starten.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="compare" className="mt-0">
                  <div className="bg-gradient-card rounded-xl border border-border shadow-lg p-4">
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
        )}
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />
    </div>
  );
};

export default Playground;
