import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Download } from "lucide-react";
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
  onStop: () => void;
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
  onStop,
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

  const exportAsMarkdown = () => {
    if (messages.length === 0) return;
    const lines: string[] = [
      "# Prompt-Labor-Gespräch",
      "",
      `*Exportiert am ${new Date().toLocaleDateString("de-DE")}*`,
      "",
    ];
    if (systemPrompt.trim()) {
      lines.push("## System-Prompt", "", `> ${systemPrompt}`, "");
    }
    lines.push("---", "");
    for (const msg of messages) {
      if (msg.role === "user") {
        lines.push("### Du", "", msg.content, "");
      } else if (msg.role === "assistant") {
        lines.push("### KI", "", msg.content, "");
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `playground-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Gespräch exportiert!");
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
            onClick={exportAsMarkdown}
            disabled={!hasMessages}
            className="text-xs"
          >
            <Download className="w-3 h-3 mr-1" />
            Exportieren
          </Button>
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
            Verlauf leeren
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[600px]"
        onScroll={handleScroll}
      >
        {!hasMessages && (
          <div className="flex items-center justify-center h-full">
            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              {[
                { title: "Text erstellen", prompt: "Schreibe einen professionellen LinkedIn-Post über künstliche Intelligenz im Mittelstand." },
                { title: "Analysieren", prompt: "Vergleiche die Vor- und Nachteile von Remote-Arbeit für ein Team mit 15 Personen." },
                { title: "Ideen sammeln", prompt: "Generiere 10 kreative Marketingideen für ein nachhaltiges Mode-Label mit Budget unter 5000 Euro." },
                { title: "Strukturieren", prompt: "Erstelle eine Checkliste für die Einführung eines neuen CRM-Systems in einem KMU." },
              ].map((s) => (
                <button
                  key={s.title}
                  onClick={() => onSendMessage(s.prompt)}
                  className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors text-left"
                >
                  <p className="text-sm font-medium mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{s.prompt}</p>
                </button>
              ))}
            </div>
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
          isStreaming={isStreaming}
          onStop={onStop}
          initialValue={initialPrompt}
        />
      </div>
    </div>
  );
};
