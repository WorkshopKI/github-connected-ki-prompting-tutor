import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square } from "lucide-react";

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  isStreaming?: boolean;
  onStop?: () => void;
  initialValue?: string;
}

export const ChatInput = ({ onSend, disabled, isStreaming, onStop, initialValue }: ChatInputProps) => {
  const [input, setInput] = useState(initialValue ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialConsumed = useRef(false);

  useEffect(() => {
    if (initialValue && !initialConsumed.current) {
      setInput(initialValue);
      initialConsumed.current = true;
    }
  }, [initialValue]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Prompt eingeben... (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
        className="min-h-[44px] max-h-[160px] resize-none"
        rows={1}
        disabled={disabled}
      />
      {isStreaming ? (
        <button
          onClick={onStop}
          className="shrink-0 h-11 w-11 relative flex items-center justify-center rounded-md hover:bg-muted transition-colors"
          title="Stoppen"
        >
          <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="19" fill="none" strokeWidth="2" stroke="hsl(var(--primary) / 0.15)" />
            <circle cx="22" cy="22" r="19" fill="none" strokeWidth="2.5" stroke="hsl(var(--primary))" strokeDasharray="30 90" strokeLinecap="round" />
          </svg>
          <Square className="w-3.5 h-3.5 fill-primary text-primary" />
        </button>
      ) : (
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="shrink-0 h-11 w-11"
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
