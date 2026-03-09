import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square, Brain } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { streamChat, type Msg } from "@/services/llmService";
import { toast } from "sonner";
import { ComparisonColumn, type ComparisonResult } from "./ComparisonColumn";
import { ModelSelect } from "./ModelSelect";
import { getModelLabel } from "@/data/models";

export interface ComparisonViewProps {
  systemPrompt: string;
  onBudgetExhausted: () => void;
}

export const ComparisonView = ({ systemPrompt, onBudgetExhausted }: ComparisonViewProps) => {
  const [thinkingEnabled, setThinkingEnabled] = useState(
    () => localStorage.getItem("thinking_enabled") === "true"
  );
  const [modelA, setModelA] = useState("google/gemini-3-flash-preview");
  const [modelB, setModelB] = useState("anthropic/claude-sonnet-4.6");
  const [prompt, setPrompt] = useState("");
  const [resultA, setResultA] = useState<ComparisonResult | null>(null);
  const [resultB, setResultB] = useState<ComparisonResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const accA = useRef("");
  const accB = useRef("");
  const abortA = useRef<AbortController | null>(null);
  const abortB = useRef<AbortController | null>(null);
  const doneCount = useRef(0);

  const handleCompare = useCallback(async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    doneCount.current = 0;
    accA.current = "";
    accB.current = "";
    setResultA({ model: modelA, content: "", isStreaming: true });
    setResultB({ model: modelB, content: "", isStreaming: true });

    const apiMessages: Msg[] = [];
    if (systemPrompt.trim()) {
      apiMessages.push({ role: "system", content: systemPrompt });
    }
    apiMessages.push({ role: "user", content: prompt });

    const markDone = () => {
      doneCount.current++;
      if (doneCount.current >= 2) setIsRunning(false);
    };

    abortA.current = new AbortController();
    abortB.current = new AbortController();

    const reasoningParam = thinkingEnabled ? { effort: "high" } : undefined;

    // Stream model A
    streamChat({
      messages: apiMessages,
      model: modelA,
      reasoning: reasoningParam,
      signal: abortA.current.signal,
      onDelta: (text) => {
        accA.current += text;
        setResultA({ model: modelA, content: accA.current, isStreaming: true });
      },
      onDone: () => {
        setResultA({ model: modelA, content: accA.current, isStreaming: false });
        markDone();
      },
      onError: (error, status) => {
        if (status === 402 || error === "budget_exhausted") onBudgetExhausted();
        else toast.error(`Modell A: ${error}`);
        setResultA((prev) => prev ? { ...prev, isStreaming: false } : null);
        markDone();
      },
    });

    // Stream model B
    streamChat({
      messages: apiMessages,
      model: modelB,
      reasoning: reasoningParam,
      signal: abortB.current.signal,
      onDelta: (text) => {
        accB.current += text;
        setResultB({ model: modelB, content: accB.current, isStreaming: true });
      },
      onDone: () => {
        setResultB({ model: modelB, content: accB.current, isStreaming: false });
        markDone();
      },
      onError: (error, status) => {
        if (status === 402 || error === "budget_exhausted") onBudgetExhausted();
        else toast.error(`Modell B: ${error}`);
        setResultB((prev) => prev ? { ...prev, isStreaming: false } : null);
        markDone();
      },
    });
  }, [prompt, isRunning, modelA, modelB, systemPrompt, onBudgetExhausted]);

  const handleStop = () => {
    abortA.current?.abort();
    abortB.current?.abort();
    setIsRunning(false);
    setResultA((prev) => prev ? { ...prev, isStreaming: false } : null);
    setResultB((prev) => prev ? { ...prev, isStreaming: false } : null);
  };

  const modelLabelA = getModelLabel(modelA);
  const modelLabelB = getModelLabel(modelB);

  return (
    <div className="space-y-4">
      {/* Model selectors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Modell A</label>
          <ModelSelect value={modelA} onValueChange={setModelA} disabled={isRunning} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Modell B</label>
          <ModelSelect value={modelB} onValueChange={setModelB} disabled={isRunning} />
        </div>
      </div>

      {/* Thinking toggle */}
      <div className="flex items-center gap-1.5">
        <Switch
          id="comparison-thinking-toggle"
          checked={thinkingEnabled}
          onCheckedChange={(checked) => {
            setThinkingEnabled(checked);
            localStorage.setItem("thinking_enabled", String(checked));
          }}
        />
        <Label htmlFor="comparison-thinking-toggle" className="text-xs flex items-center gap-1 cursor-pointer" title="Erweiterte Denkfähigkeit aktivieren (Reasoning/Thinking)">
          <Brain className="h-3.5 w-3.5" /> Thinking
        </Label>
      </div>

      {/* Prompt input */}
      <div className="flex gap-2 items-end">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt zum Vergleichen eingeben..."
          className="min-h-[44px] max-h-[120px] resize-none text-sm"
          rows={2}
          disabled={isRunning}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCompare();
            }
          }}
        />
        {isRunning ? (
          <Button onClick={handleStop} variant="destructive" size="icon" className="shrink-0 h-11 w-11">
            <Square className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCompare}
            disabled={!prompt.trim()}
            size="icon"
            className="shrink-0 h-11 w-11"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Results side by side */}
      {(resultA || resultB) && (
        <div className="grid grid-cols-2 gap-3">
          <ComparisonColumn
            label={modelLabelA}
            result={resultA}
          />
          <ComparisonColumn
            label={modelLabelB}
            result={resultB}
          />
        </div>
      )}
    </div>
  );
};
