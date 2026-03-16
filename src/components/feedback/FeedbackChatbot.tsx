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

/** Extended message type with optional answer options (local to this component) */
interface ChatMsg extends Msg {
  options?: string[];
}

interface Props {
  feedbackId: string;
  initialText: string;
  context: FeedbackContext;
  onClose: () => void;
}

/** Renders **bold** markdown as <strong> in plain text */
function renderSimpleMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function FeedbackChatbot({ feedbackId, initialText, context, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    const msgs: ChatMsg[] = [{ role: "system", content: buildFeedbackSystemPrompt(context) }];
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

  const sendToLLM = useCallback(async (msgs: ChatMsg[]) => {
    setStreaming(true);
    setStreamingContent("");
    const controller = new AbortController();
    abortRef.current = controller;

    let accumulated = "";

    // Strip options field before sending to API
    const apiMsgs: Msg[] = msgs.map(({ options, ...rest }) => rest);

    await streamChat({
      messages: apiMsgs,
      model,
      signal: controller.signal,
      onDelta: (text) => {
        accumulated += text;
        setStreamingContent(accumulated);
      },
      onDone: () => {
        let assistantMsg: ChatMsg = { role: "assistant", content: accumulated };

        // Try to parse structured options JSON
        try {
          const parsed = JSON.parse(accumulated);
          if (parsed.text && Array.isArray(parsed.options) && parsed.options.length > 0) {
            assistantMsg = { role: "assistant", content: parsed.text, options: parsed.options };
          }
        } catch {
          // Not JSON — use raw text as-is
        }

        setMessages((prev) => [...prev, assistantMsg]);
        setStreamingContent("");
        setStreaming(false);

        // Prüfen ob die Antwort eine Zusammenfassung enthält
        const summaryParsed = parseFeedbackSummary(accumulated);
        if (summaryParsed) setClassification(summaryParsed);
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

    const userMsg: ChatMsg = { role: "user", content: trimmed };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setClassification(null);
    sendToLLM(newMsgs);
  }, [input, streaming, messages, sendToLLM]);

  const handleOptionClick = useCallback((optionText: string) => {
    if (streaming) return;
    const userMsg: ChatMsg = { role: "user", content: optionText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setClassification(null);
    sendToLLM(newMsgs);
  }, [streaming, messages, sendToLLM]);

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
        {visibleMessages.map((msg, i) => {
          const isLastAssistant =
            msg.role === "assistant" &&
            !visibleMessages.slice(i + 1).some((m) => m.role === "user");

          return (
            <div key={i}>
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-8 bg-primary/10 text-foreground"
                    : "mr-8 bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "assistant" && msg.options && msg.options.length > 0 && (
                <div className="mr-8 mt-1.5 flex flex-wrap gap-1.5">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => isLastAssistant && handleOptionClick(opt)}
                      disabled={!isLastAssistant || streaming}
                      className={`
                        rounded-full border border-border px-3 py-1.5 text-xs
                        transition-colors duration-150
                        ${isLastAssistant && !streaming
                          ? "hover:border-primary hover:bg-primary/5 cursor-pointer"
                          : "opacity-50 cursor-default"
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator — animated dots */}
        {streaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Streaming content */}
        {streaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-muted text-foreground rounded-xl rounded-bl-sm px-3.5 py-2.5 text-[13px] leading-[1.55]">
              {renderSimpleMarkdown(streamingContent)}
              <span className="ml-1 inline-block h-3.5 w-[2px] bg-foreground/60 animate-pulse" />
            </div>
          </div>
        )}

        {/* Confirmation card */}
        {classification && (
          <FeedbackConfirmCard
            classification={classification}
            onConfirm={handleConfirm}
            onReject={handleReject}
          />
        )}
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 border-t border-border px-3 py-2.5">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht eingeben..."
          rows={1}
          className="resize-none text-[13px] min-h-[36px] max-h-[80px]"
          disabled={streaming}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={streaming || !input.trim()}
          className="h-9 w-9 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
