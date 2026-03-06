import { useState, useRef, useCallback } from "react";
import { streamChat } from "@/services/llmService";
import { toast } from "sonner";
import type { Msg } from "@/types";

interface UseChatOptions {
  systemPrompt: string;
  selectedModel: string;
  thinkingEnabled: boolean;
  onBudgetExhausted: () => void;
}

interface UseChatReturn {
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  streamingContent: string;
  setStreamingContent: React.Dispatch<React.SetStateAction<string>>;
  isStreaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  handleStop: () => void;
}

export function useChat({ systemPrompt, selectedModel, thinkingEnabled, onBudgetExhausted }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const accRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

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
            onBudgetExhausted();
          } else {
            toast.error(error);
          }
        },
      });
    },
    [messages, isStreaming, systemPrompt, selectedModel, thinkingEnabled, onBudgetExhausted]
  );

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return {
    messages,
    setMessages,
    streamingContent,
    setStreamingContent,
    isStreaming,
    sendMessage,
    handleStop,
  };
}
