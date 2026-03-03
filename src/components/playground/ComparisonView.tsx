import { useState, useRef, useCallback } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Square, Bot, Loader2, Brain } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { streamChat, type Msg } from "@/services/llmService";
import { toast } from "sonner";
import { ChatMessage } from "./ChatMessage";
import { STANDARD_MODELS, PREMIUM_MODELS, OPEN_SOURCE_MODELS, getAllModels, getModelLabel } from "@/data/models";

interface ComparisonResult {
  model: string;
  content: string;
  isStreaming: boolean;
}

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
          <Select value={modelA} onValueChange={setModelA} disabled={isRunning}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Standard</SelectLabel>
                {STANDARD_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Premium</SelectLabel>
                {PREMIUM_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Open Source</SelectLabel>
                {OPEN_SOURCE_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              {(() => {
                const custom = getAllModels().filter((m) => m.isCustom);
                return custom.length > 0 ? (
                  <>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Eigene</SelectLabel>
                      {custom.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                ) : null;
              })()}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Modell B</label>
          <Select value={modelB} onValueChange={setModelB} disabled={isRunning}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Standard</SelectLabel>
                {STANDARD_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Premium</SelectLabel>
                {PREMIUM_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Open Source</SelectLabel>
                {OPEN_SOURCE_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectGroup>
              {(() => {
                const custom = getAllModels().filter((m) => m.isCustom);
                return custom.length > 0 ? (
                  <>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Eigene</SelectLabel>
                      {custom.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </>
                ) : null;
              })()}
            </SelectContent>
          </Select>
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

function ComparisonColumn({
  label,
  result,
}: {
  label: string;
  result: ComparisonResult | null;
}) {
  return (
    <Card className="p-3 space-y-2 min-h-[200px]">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <Bot className="w-3 h-3 text-muted-foreground" />
        <Badge variant="outline" className="text-[10px]">
          {label}
        </Badge>
        {result?.isStreaming && (
          <Loader2 className="w-3 h-3 animate-spin text-primary ml-auto" />
        )}
      </div>

      {result ? (
        result.content ? (
          <ChatMessage
            role="assistant"
            content={result.content}
            isStreaming={result.isStreaming}
          />
        ) : result.isStreaming ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
            <Loader2 className="w-3 h-3 animate-spin" />
            Warte auf Antwort...
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-4">Keine Antwort.</p>
        )
      ) : null}
    </Card>
  );
}
