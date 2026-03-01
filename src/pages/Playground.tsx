import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { streamChat, type Msg } from "@/services/llmService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { BudgetDialog } from "@/components/BudgetDialog";
import { ChatPlayground } from "@/components/playground/ChatPlayground";
import { ACTABuilder } from "@/components/playground/ACTABuilder";
import type { ACTAFields } from "@/components/playground/ACTATemplates";

const LS_KEY = "playground_history";

const MODEL_OPTIONS = [
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { value: "openai/gpt-5.2", label: "GPT-5.2" },
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (Standard)" },
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
];

const Playground = () => {
  const { isLoggedIn, isLoading, profile } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledPrompt = searchParams.get("prompt") ?? undefined;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    profile?.preferred_model ?? "google/gemini-3-flash-preview"
  );
  const [actaFields, setActaFields] = useState<ACTAFields>({
    act: "",
    context: "",
    task: "",
    ausgabe: "",
  });
  const [actaOpen, setActaOpen] = useState(true);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);

  const accRef = useRef("");

  // Restore messages from localStorage on mount (only if no prefilled prompt)
  useEffect(() => {
    if (prefilledPrompt) return;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [prefilledPrompt]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LS_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Update selected model when profile loads
  useEffect(() => {
    if (profile?.preferred_model) {
      setSelectedModel(profile.preferred_model);
    }
  }, [profile?.preferred_model]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMsg: Msg = { role: "user", content };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setStreamingContent("");
      setIsStreaming(true);
      accRef.current = "";

      // Build API messages: optional system prompt + last 20 conversation messages
      const apiMessages: Msg[] = [];
      if (systemPrompt.trim()) {
        apiMessages.push({ role: "system", content: systemPrompt });
      }
      apiMessages.push(...newMessages.slice(-20));

      await streamChat({
        messages: apiMessages,
        model: selectedModel,
        onDelta: (text) => {
          accRef.current += text;
          setStreamingContent(accRef.current);
        },
        onDone: () => {
          const finalContent = accRef.current;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: finalContent },
          ]);
          setStreamingContent("");
          setIsStreaming(false);
        },
        onError: (error, status) => {
          setIsStreaming(false);
          setStreamingContent("");
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

  const handleClearChat = () => {
    setMessages([]);
    setStreamingContent("");
    localStorage.removeItem(LS_KEY);
  };

  const handleSendFromACTA = (assembledPrompt: string) => {
    sendMessage(assembledPrompt);
  };

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
              <SelectTrigger className="w-[200px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
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
          /* Main layout */
          <div className="grid md:grid-cols-[380px_1fr] gap-6">
            {/* ACTA Builder (left) */}
            <aside>
              <ACTABuilder
                fields={actaFields}
                onFieldsChange={setActaFields}
                onSendToPlayground={handleSendFromACTA}
                isOpen={actaOpen}
                onToggle={() => setActaOpen((o) => !o)}
              />
            </aside>

            {/* Chat (right) */}
            <main className="min-h-[600px]">
              <ChatPlayground
                messages={messages}
                onSendMessage={sendMessage}
                isStreaming={isStreaming}
                streamingContent={streamingContent}
                systemPrompt={systemPrompt}
                onSystemPromptChange={setSystemPrompt}
                onClearChat={handleClearChat}
                initialPrompt={prefilledPrompt}
              />
            </main>
          </div>
        )}
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />
    </div>
  );
};

export default Playground;
