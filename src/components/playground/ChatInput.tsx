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
        placeholder="Nachricht eingeben... (Enter zum Senden, Shift+Enter für Zeilenumbruch)"
        className="min-h-[44px] max-h-[160px] resize-none"
        rows={1}
        disabled={disabled}
      />
      {isStreaming ? (
        <Button
          onClick={onStop}
          variant="destructive"
          size="icon"
          className="shrink-0 h-11 w-11"
          title="Stoppen"
        >
          <Square className="w-4 h-4" />
        </Button>
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
