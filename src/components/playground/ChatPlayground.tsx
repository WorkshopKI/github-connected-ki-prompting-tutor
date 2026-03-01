import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Copy } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SystemPromptEditor } from "./SystemPromptEditor";
import type { Msg } from "@/services/llmService";

export interface ChatPlaygroundProps {
  messages: Msg[];
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  onClearChat: () => void;
  initialPrompt?: string;
}

export const ChatPlayground = ({
  messages,
  onSendMessage,
  isStreaming,
  streamingContent,
  systemPrompt,
  onSystemPromptChange,
  onClearChat,
  initialPrompt,
}: ChatPlaygroundProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    if (isAtBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingContent]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const threshold = 100;
    isAtBottomRef.current =
      target.scrollHeight - target.scrollTop - target.clientHeight < threshold;
  };

  const copyLastResponse = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      toast.success("Antwort kopiert!");
    }
  };

  const hasMessages = messages.length > 0 || isStreaming;
  const hasAssistantMessage = messages.some((m) => m.role === "assistant");

  return (
    <div className="flex flex-col h-full bg-gradient-card rounded-xl border border-border shadow-lg">
      {/* System Prompt */}
      <div className="px-4 pt-4">
        <SystemPromptEditor value={systemPrompt} onChange={onSystemPromptChange} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
        <span className="text-sm font-medium text-muted-foreground">Chat</span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyLastResponse}
            disabled={!hasAssistantMessage}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Kopieren
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            disabled={!hasMessages}
            className="text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Leeren
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[600px]"
        onScroll={handleScroll}
      >
        {!hasMessages && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Sende eine Nachricht, um loszulegen...
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" || msg.role === "assistant" ? (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ) : null
        )}

        {isStreaming && streamingContent && (
          <ChatMessage role="assistant" content={streamingContent} isStreaming />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <ChatInput
          onSend={onSendMessage}
          disabled={isStreaming}
          initialValue={initialPrompt}
        />
      </div>
    </div>
  );
};
