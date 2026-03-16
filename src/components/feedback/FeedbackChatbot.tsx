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

/** Parse bot response: options JSON, summary fallback, or plain text */
function parseBotResponse(raw: string): { text: string; options?: string[] } {
  // Case 1: JSON block embedded at end of free text
  const jsonMatch = raw.match(/\{[\s\S]*"options"\s*:\s*\[[\s\S]*\]\s*\}\s*$/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.text && Array.isArray(parsed.options) && parsed.options.length > 0) {
        const textBefore = raw.slice(0, jsonMatch.index).trim();
        const fullText = textBefore ? `${textBefore}\n\n${parsed.text}` : parsed.text;
        return { text: fullText, options: parsed.options };
      }
    } catch { /* not valid JSON — continue */ }
  }
  // Case 2: Entire response is JSON
  try {
    const parsed = JSON.parse(raw);
    if (parsed.text && Array.isArray(parsed.options) && parsed.options.length > 0) {
      return { text: parsed.text, options: parsed.options };
    }
    if (parsed.summary || parsed.details) {
      const summary = parsed.summary || parsed.details || "";
      const area = parsed.affectedArea ? `\n\nBetroffener Bereich: ${parsed.affectedArea}` : "";
      return { text: `**Kurz zusammengefasst:** ${summary}${area}` };
    }
  } catch { /* not JSON */ }
  // Case 3: Plain text
  return { text: raw };
}

export function FeedbackChatbot({ feedbackId, initialText, context, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    const msgs: ChatMsg[] = [{ role: "system", content: buildFeedbackSystemPrompt(context) }];
    if (initialText) msgs.push({ role: "user", content: initialText });
    return msgs;
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [classification, setClassification] = useState<ReturnType<typeof parseFeedbackSummary>>(null);
  const [model, setModel] = useState("anthropic/claude-sonnet-4.6");
  const abortRef = useRef<AbortController | null>(null);
  const responseBuffer = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Modell aus Config laden
  useEffect(() => {
    loadFeedbackConfig().then((cfg) => setModel(cfg.llm_model));
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  // Erste Nachricht automatisch senden
  useEffect(() => {
    if (initialText && messages.length === 2) {
      sendToLLM(messages);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendToLLM = useCallback(async (msgs: ChatMsg[]) => {
    setIsThinking(true);
    responseBuffer.current = "";
    const controller = new AbortController();
    abortRef.current = controller;

    // Strip options field before sending to API
    const apiMsgs: Msg[] = msgs.map(({ options, ...rest }) => rest);

    await streamChat({
      messages: apiMsgs,
      model,
      signal: controller.signal,
      onDelta: (text) => {
        // Buffer in background — don't show to user
        responseBuffer.current += text;
      },
      onDone: () => {
        const raw = responseBuffer.current;
        const { text, options } = parseBotResponse(raw);
        const assistantMsg: ChatMsg = { role: "assistant", content: text, options };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);

        // Prüfen ob die Antwort eine Zusammenfassung enthält
        const summaryParsed = parseFeedbackSummary(raw);
        if (summaryParsed) setClassification(summaryParsed);
      },
      onError: (error) => {
        setIsThinking(false);
        toast.error(`LLM-Fehler: ${error}`);
      },
    });
  }, [model]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: ChatMsg = { role: "user", content: trimmed };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setClassification(null);
    sendToLLM(newMsgs);
  }, [input, isThinking, messages, sendToLLM]);

  const handleOptionClick = useCallback((optionText: string) => {
    if (isThinking) return;
    const userMsg: ChatMsg = { role: "user", content: optionText };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setClassification(null);
    sendToLLM(newMsgs);
  }, [isThinking, messages, sendToLLM]);

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
            <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-200">
              <div
                className={`rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-8 bg-primary/10 text-foreground"
                    : "mr-8 bg-muted text-foreground"
                }`}
              >
                {renderSimpleMarkdown(msg.content)}
              </div>

              {msg.role === "assistant" && msg.options && msg.options.length > 0 && (
                <div className="mr-8 mt-1.5 flex flex-wrap gap-1.5">
                  {msg.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => isLastAssistant && handleOptionClick(opt)}
                      disabled={!isLastAssistant || isThinking}
                      className={`
                        rounded-full border border-border px-3 py-1.5 text-xs
                        transition-colors duration-150
                        ${isLastAssistant && !isThinking
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

        {/* Thinking indicator — animated bouncing dots while LLM streams in background */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
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
          disabled={isThinking}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={isThinking || !input.trim()}
          className="h-9 w-9 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
