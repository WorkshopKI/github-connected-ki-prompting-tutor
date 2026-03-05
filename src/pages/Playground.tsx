import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { streamChat, type Msg } from "@/services/llmService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, LogIn, MessageSquare, GitCompare, Sparkles, Bot, Brain, Wrench, History, Wand2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { STANDARD_MODELS, PREMIUM_MODELS, OPEN_SOURCE_MODELS, getAllModels } from "@/data/models";

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
  const [thinkingEnabled, setThinkingEnabled] = useState(
    () => localStorage.getItem("thinking_enabled") === "true"
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        reasoning: thinkingEnabled ? { effort: "high" } : undefined,
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
            Zurück zur Plattform
          </Button>

          <h1 className="text-2xl font-bold">Prompt-Labor</h1>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Switch
                id="thinking-toggle"
                checked={thinkingEnabled}
                onCheckedChange={(checked) => {
                  setThinkingEnabled(checked);
                  localStorage.setItem("thinking_enabled", String(checked));
                }}
              />
              <Label htmlFor="thinking-toggle" className="text-xs flex items-center gap-1 cursor-pointer" title="Erweiterte Denkfähigkeit aktivieren (Reasoning/Thinking)">
                <Brain className="h-3.5 w-3.5" /> Denkprozess
              </Label>
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[220px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Standard</SelectLabel>
                  {STANDARD_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Premium</SelectLabel>
                  {PREMIUM_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Open Source</SelectLabel>
                  {OPEN_SOURCE_MODELS.map((m) => (
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
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Left sidebar - desktop */}
            <aside className="hidden lg:block space-y-4">
              <Accordion type="single" collapsible defaultValue="acta">
                <AccordionItem value="history" className="bg-gradient-card rounded-xl border border-border shadow-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Verlauf ({conversations.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    <ConversationHistory
                      conversations={conversations}
                      activeId={activeConversationId}
                      onSelect={handleSelectConversation}
                      onNew={handleNewConversation}
                      onDelete={handleDeleteConversation}
                      onRename={handleRenameConversation}
                      bare
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="acta" className="bg-gradient-card rounded-xl border border-border shadow-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">ACTA-Baukasten</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ACTABuilder
                      fields={actaFields}
                      onFieldsChange={setActaFields}
                      onSendToPlayground={handleSendFromACTA}
                      bare
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="techniques" className="bg-gradient-card rounded-xl border border-border shadow-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Fortgeschrittene Techniken</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TechniquePanel
                      onApplyToChat={handleApplyTechnique}
                      bare
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="agent" className="bg-gradient-card rounded-xl border border-border shadow-lg">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">Agenten-Modus</span>
                      <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">Fortgeschritten</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <AgentKnobs
                      config={agentConfig}
                      onConfigChange={setAgentConfig}
                      onStartAgent={handleStartAgent}
                      bare
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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

            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed bottom-4 left-4 z-40">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" className="rounded-full shadow-lg h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Wrench className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetTitle className="text-lg font-bold mb-4">Werkzeuge</SheetTitle>
                  <Accordion type="single" collapsible defaultValue="acta">
                    <AccordionItem value="history">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm">Verlauf ({conversations.length})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ConversationHistory
                          conversations={conversations}
                          activeId={activeConversationId}
                          onSelect={(conv) => { handleSelectConversation(conv); setSidebarOpen(false); }}
                          onNew={() => { handleNewConversation(); setSidebarOpen(false); }}
                          onDelete={handleDeleteConversation}
                          onRename={handleRenameConversation}
                          bare
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="acta">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="font-semibold text-sm">ACTA-Baukasten</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ACTABuilder
                          fields={actaFields}
                          onFieldsChange={setActaFields}
                          onSendToPlayground={(p) => { handleSendFromACTA(p); setSidebarOpen(false); }}
                          bare
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="techniques">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-sm">Fortgeschrittene Techniken</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TechniquePanel
                          onApplyToChat={(p) => { handleApplyTechnique(p); setSidebarOpen(false); }}
                          bare
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="agent">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Agenten-Modus</span>
                          <span className="ml-2 text-xs bg-secondary px-2 py-0.5 rounded-full">Fortgeschritten</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <AgentKnobs
                          config={agentConfig}
                          onConfigChange={setAgentConfig}
                          onStartAgent={(p) => { handleStartAgent(p); setSidebarOpen(false); }}
                          bare
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SheetContent>
              </Sheet>
            </div>

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
                    Assistent
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
