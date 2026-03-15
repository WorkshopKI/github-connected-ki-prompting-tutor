import { useState, useRef, useCallback, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { streamChat } from "@/services/llmService";
import { buildFeedbackSystemPrompt, parseFeedbackSummary } from "@/services/feedbackLlm";
import { loadFeedbackConfig, updateFeedback } from "@/services/feedbackService";
import { FeedbackConfirmCard } from "./FeedbackConfirmCard";
import type { Msg, FeedbackContext } from "@/types";
import { toast } from "sonner";

interface Props {
  feedbackId: string;
  initialText: string;
  context: FeedbackContext;
  onClose: () => void;
}

export function FeedbackChatbot({ feedbackId, initialText, context, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>(() => {
    const msgs: Msg[] = [{ role: "system", content: buildFeedbackSystemPrompt(context) }];
    if (initialText) msgs.push({ role: "user", content: initialText });
    return msgs;
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [classification, setClassification] = useState<ReturnType<typeof parseFeedbackSummary>>(null);
  const [model, setModel] = useState("anthropic/claude-sonnet-4.6");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modell aus Config laden
  useEffect(() => {
    loadFeedbackConfig().then((cfg) => setModel(cfg.llm_model));
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamingContent]);

  // Erste Nachricht automatisch senden
  useEffect(() => {
    if (initialText && messages.length === 2) {
      sendToLLM(messages);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendToLLM = useCallback(async (msgs: Msg[]) => {
    setStreaming(true);
    setStreamingContent("");
    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = "";

    await streamChat({
      messages: msgs,
      model,
      signal: controller.signal,
      onDelta: (text) => {
        accumulated += text;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        const assistantMsg: Msg = { role: "assistant", content: accumulated };
        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingContent("");
        setStreaming(false);

        // Prüfen ob die Antwort eine Zusammenfassung enthält
        const parsed = parseFeedbackSummary(accumulated);
        if (parsed) setClassification(parsed);
      },
      onError: (error) => {
        setStreaming(false);
        setStreamingContent("");
        toast.error(`LLM-Fehler: ${error}`);
      },
    });
  }, [model]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setClassification(null);
    sendToLLM(newMsgs);
  }, [input, streaming, messages, sendToLLM]);

  const handleConfirm = useCallback(async () => {
    if (!classification) return;
    try {
      await updateFeedback(feedbackId, {
        user_confirmed: true,
        llm_summary: classification.summary,
        llm_classification: classification,
      });
      toast.success("Feedback bestätigt!");
      onClose();
    } catch {
      toast.error("Fehler beim Speichern.");
    }
  }, [classification, feedbackId, onClose]);

  const handleReject = useCallback(() => {
    setClassification(null);
    setInput("");
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Nur user/assistant-Nachrichten anzeigen (kein System-Prompt)
  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex-col-layout">
      <div ref={scrollRef} className="scroll-container space-y-3 px-1">
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.role === "user"
                ? "ml-8 bg-primary/10 text-foreground"
                : "mr-8 bg-muted text-foreground"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {streaming && streamingContent && (
          <div className="mr-8 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
            {streamingContent}
            <span className="ml-1 inline-block animate-pulse">▊</span>
          </div>
        )}

        {streaming && !streamingContent && (
          <div className="mr-8 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            Denkt nach...
          </div>
        )}

        {classification && (
          <FeedbackConfirmCard
            classification={classification}
            onConfirm={handleConfirm}
            onReject={handleReject}
          />
        )}
      </div>

      <div className="flex items-end gap-2 border-t pt-3 mt-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht eingeben..."
          rows={2}
          className="resize-none text-sm"
          disabled={streaming}
        />
        <Button size="icon" onClick={handleSend} disabled={streaming || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
