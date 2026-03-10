import { useState } from "react";
import { Download, Copy, Trash2, Sparkles, Scale, Bookmark, Settings, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import JSZip from "jszip";
import { ChatPlayground } from "./ChatPlayground";
import { ComparisonSplitView } from "./ComparisonSplitView";
import { PromptEvaluation } from "./PromptEvaluation";
import { JudgePanel } from "./JudgePanel";
import { AgentKnobs, type AgentConfig } from "./AgentKnobs";
import { ModelSelectGroups } from "./ModelSelect";
import { getModelLabel } from "@/data/models";
import { cn } from "@/lib/utils";
import type { Msg } from "@/services/llmService";
import type { AIRoutingConfig } from "@/types";

export interface PlaygroundContentProps {
  messages: Msg[];
  onSendMessage: (content: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  thinkingContent?: string;
  thinkingEnabled?: boolean;
  systemPrompt: string;
  onSystemPromptChange: (v: string) => void;
  onClearChat: () => void;
  onStop: () => void;
  onBudgetExhausted: () => void;
  prefilledPrompt?: string;
  skillId?: string | null;
  skillTitle?: string | null;
  requestedModel?: string | null;
  mode?: "einsteiger" | "experte";
  lastUserPrompt?: string;
  // KI-Controls (moved from header)
  selectedModel: string;
  onModelChange: (model: string) => void;
  onThinkingChange: (enabled: boolean) => void;
  aiTier: "internal" | "external";
  onAiTierChange: (tier: "internal" | "external") => void;
  canUseExternal: boolean;
  aiRouting: AIRoutingConfig;
  // Agent
  agentConfig: AgentConfig;
  onAgentConfigChange: (config: AgentConfig) => void;
  onStartAgent: (prompt: string) => void;
}

export const PlaygroundContent = ({
  messages,
  onSendMessage,
  isStreaming,
  streamingContent,
  thinkingContent,
  thinkingEnabled,
  systemPrompt,
  onSystemPromptChange,
  onClearChat,
  onStop,
  onBudgetExhausted,
  prefilledPrompt,
  skillId,
  skillTitle,
  requestedModel,
  mode = "experte",
  lastUserPrompt,
  selectedModel,
  onModelChange,
  onThinkingChange,
  aiTier,
  onAiTierChange,
  canUseExternal,
  aiRouting,
  agentConfig,
  onAgentConfigChange,
  onStartAgent,
}: PlaygroundContentProps) => {
  const isExperte = mode === "experte";
  const [chatMode, setChatMode] = useState<"chat" | "compare">("chat");
  const [agentEnabled, setAgentEnabled] = useState(false);

  const lastAssistantContent =
    messages.length >= 2 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1].content
      : "";
  const hasAssistantResponse = lastAssistantContent.length > 0;
  const hasMessages = messages.length > 0;
  const hasAssistantMessage = messages.some(m => m.role === "assistant");

  const copyLastResponse = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      toast.success("Antwort kopiert!");
    }
  };

  const exportAsMarkdown = () => {
    if (messages.length === 0) return;
    const md = messages.map(m => {
      const role = m.role === "user" ? "**Du:**" : "**KI:**";
      return `${role}\n\n${m.content}`;
    }).join("\n\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsDocx = async () => {
    if (messages.length === 0) return;
    const stripMd = (text: string) =>
      text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1");
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const paragraphs = messages.flatMap((m) => {
      const role = m.role === "user" ? "Du" : "KI";
      const roleStyle = m.role === "user" ? '<w:b/><w:color w:val="C0694A"/>' : '<w:b/>';
      const lines = stripMd(m.content).split("\n").filter(l => l.trim());
      return [
        `<w:p><w:pPr><w:spacing w:after="60"/></w:pPr><w:r><w:rPr>${roleStyle}<w:sz w:val="22"/></w:rPr><w:t>${esc(role)}:</w:t></w:r></w:p>`,
        ...lines.map(line =>
          `<w:p><w:pPr><w:spacing w:after="80"/></w:pPr><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${esc(line)}</w:t></w:r></w:p>`
        ),
        `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="E0E0E0"/></w:pBdr><w:spacing w:after="200"/></w:pPr></w:p>`,
      ];
    });
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 wp14">
  <w:body>
    <w:p><w:pPr><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="28"/></w:rPr><w:t>Chat-Export</w:t></w:r></w:p>
    <w:p><w:pPr><w:spacing w:after="200"/></w:pPr><w:r><w:rPr><w:color w:val="888888"/><w:sz w:val="18"/></w:rPr><w:t>${esc(new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }))}</w:t></w:r></w:p>
    ${paragraphs.join("\n    ")}
  </w:body>
</w:document>`;
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
    const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
    const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;
    const zip = new JSZip();
    zip.file("[Content_Types].xml", contentTypesXml);
    zip.file("_rels/.rels", relsXml);
    zip.file("word/document.xml", documentXml);
    zip.file("word/_rels/document.xml.rels", wordRelsXml);
    const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ⚠️ min-h-0 + min-w-0: Erlaubt Flex-Children zu schrumpfen statt zu überlaufen
  return (
    <main className="h-full flex flex-col min-h-0 min-w-0">
      {/* Skill-Banner */}
      {skillId && (
        <div className="bg-primary/5 border border-primary/15 rounded-lg px-4 py-2 mb-3 flex items-center gap-2 text-sm">
          <Bookmark className="w-4 h-4 text-primary shrink-0" />
          <span>
            Skill testen: <strong>{skillTitle}</strong>
            {requestedModel && (
              <>
                {" "}· Ziel-Modell:{" "}
                <Badge variant="outline" className="text-[10px] ml-1">
                  {requestedModel.split("/").pop()}
                </Badge>
              </>
            )}
          </span>
        </div>
      )}

      {/* ═══ TOOLBAR — Icon-only + kontextuelle Buttons ═══ */}
      <div className="flex items-center px-3 py-1.5 border-b border-border gap-1">
        <span className="text-xs font-semibold text-foreground mr-1">
          {chatMode === "compare" ? "Vergleich" : "Chat"}
        </span>

        {/* Prompt-Check — nur Experte + Chat + Prompt vorhanden */}
        {isExperte && lastUserPrompt && chatMode === "chat" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                <Sparkles className="w-3 h-3" /> Check
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[360px] max-h-[400px] overflow-y-auto p-4">
              <PromptEvaluation prompt={lastUserPrompt} model={selectedModel} />
            </PopoverContent>
          </Popover>
        )}

        {/* KI-Bewertung — nur Experte + Chat + Antwort vorhanden */}
        {isExperte && hasAssistantResponse && chatMode === "chat" && lastUserPrompt && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground">
                <Scale className="w-3 h-3" /> Bewertung
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[400px] max-h-[500px] overflow-y-auto p-4">
              <JudgePanel prompt={lastUserPrompt} output={lastAssistantContent} model={selectedModel || ""} />
            </PopoverContent>
          </Popover>
        )}

        <div className="flex-1" />

        {/* Icon-only actions */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Exportieren" disabled={!hasMessages}>
              <Download className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1.5">
            <button
              onClick={() => { exportAsMarkdown(); toast.success("Als Markdown exportiert!"); }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Als Markdown (.md)
            </button>
            <button
              onClick={() => { exportAsDocx(); toast.success("Als Word exportiert!"); }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Als Word (.docx)
            </button>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Kopieren" disabled={!hasAssistantMessage}>
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-1.5">
            <button
              onClick={copyLastResponse}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Letzte KI-Antwort
            </button>
            <button
              onClick={() => {
                const full = messages.map(m => `${m.role === "user" ? "Du" : "KI"}:\n${m.content}`).join("\n\n---\n\n");
                navigator.clipboard.writeText(full);
                toast.success("Ganzen Chat kopiert!");
              }}
              className="block w-full text-left px-3 py-1.5 text-[11px] rounded-md hover:bg-muted transition-colors"
            >
              Ganzen Chat
            </button>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          title="Verlauf leeren"
          onClick={onClearChat}
          disabled={!hasMessages}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* System-Prompt — nur Experte, Chat-Modus */}
      {isExperte && chatMode === "chat" && (
        <details className="border-b border-border">
          <summary className="text-[10px] text-muted-foreground px-4 py-1.5 cursor-pointer select-none hover:bg-muted/30 transition-colors">
            ⚙ System-Prompt (optional)
          </summary>
          <div className="px-4 pb-2">
            <Textarea
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Optionaler System-Prompt..."
              className="text-[11px] min-h-[48px] resize-y"
              rows={2}
            />
          </div>
        </details>
      )}

      {/* ═══ CONTENT — Chat oder Vergleich ═══ */}
      {chatMode === "compare" ? (
        <ComparisonSplitView
          systemPrompt={systemPrompt}
          onBudgetExhausted={onBudgetExhausted}
          selectedModel={selectedModel}
          onBackToChat={() => setChatMode("chat")}
        />
      ) : (
        <div data-tour="chat-area" className="flex-1 min-h-0">
          <ChatPlayground
            messages={messages}
            onSendMessage={onSendMessage}
            isStreaming={isStreaming}
            streamingContent={streamingContent}
            thinkingContent={thinkingContent}
            thinkingEnabled={thinkingEnabled}
            systemPrompt={systemPrompt}
            onSystemPromptChange={onSystemPromptChange}
            onClearChat={onClearChat}
            onStop={onStop}
            initialPrompt={prefilledPrompt}
            hideSystemPrompt
            hideToolbar
          />
        </div>
      )}

      {/* ═══ KI-CONTROLS BAR — über dem Input, nur Experte ═══ */}
      {isExperte && (
        <div className="border-t border-border px-3 py-1.5 flex items-center gap-2">
          {/* Modus-Switch */}
          <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
            <button
              onClick={() => setChatMode("chat")}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                chatMode === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setChatMode("compare")}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                chatMode === "compare" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              ⚖ Vergleich
            </button>
          </div>

          <div className="flex-1" />

          {/* Model badge + dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 hover:bg-muted text-[10px] font-medium text-foreground transition-colors">
                {aiTier === "internal" ? "🏢" : "☁️"} {getModelLabel(selectedModel)}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-3 space-y-3">
              <h4 className="text-xs font-semibold">Modell</h4>
              <Select value={selectedModel} onValueChange={onModelChange}>
                <SelectTrigger className="w-full text-xs h-8">
                  <span className="truncate">{getModelLabel(selectedModel)}</span>
                </SelectTrigger>
                <SelectContent>
                  {aiTier === "internal" ? (
                    <SelectGroup>
                      <SelectLabel>🏢 Interne KI</SelectLabel>
                      {aiRouting.internalModel ? (
                        <SelectItem value={aiRouting.internalModel}>
                          {aiRouting.internalModel}
                        </SelectItem>
                      ) : (
                        <SelectItem value="internal-default" disabled>
                          Nicht konfiguriert
                        </SelectItem>
                      )}
                    </SelectGroup>
                  ) : (
                    <ModelSelectGroups />
                  )}
                </SelectContent>
              </Select>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => onAiTierChange("internal")}
                  className={cn(
                    "flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                    aiTier === "internal"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  🏢 Intern
                </button>
                <button
                  onClick={() => canUseExternal && onAiTierChange("external")}
                  disabled={!canUseExternal}
                  className={cn(
                    "flex-1 px-2 py-1 text-[10px] font-medium transition-colors",
                    aiTier === "external" && canUseExternal
                      ? "bg-primary text-primary-foreground"
                      : canUseExternal
                        ? "text-muted-foreground hover:bg-muted/50"
                        : "text-muted-foreground/30 cursor-not-allowed"
                  )}
                >
                  ☁️ Extern
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Thinking toggle chip */}
          <button
            onClick={() => onThinkingChange(!thinkingEnabled)}
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors flex items-center gap-1",
              thinkingEnabled
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            <Brain className="w-3 h-3" />
            {thinkingEnabled ? "Denken an" : "Denken"}
          </button>

          {/* Settings Popover — Agent toggle + session settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3 space-y-3">
              <h4 className="text-xs font-semibold">Einstellungen</h4>
              <label className="flex items-center justify-between">
                <span className="text-[11px]">🤖 Agenten-Modus</span>
                <Switch checked={agentEnabled} onCheckedChange={setAgentEnabled} />
              </label>
              {agentEnabled && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-[11px] h-7 gap-1">
                      🤖 Agent konfigurieren
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
                    <SheetTitle className="text-base font-bold mb-4">🤖 Agenten-Modus</SheetTitle>
                    <AgentKnobs
                      config={agentConfig}
                      onConfigChange={onAgentConfigChange}
                      onStartAgent={onStartAgent}
                      bare
                    />
                  </SheetContent>
                </Sheet>
              )}
              <Separator />
              <p className="text-[10px] text-muted-foreground">
                Einstellungen gelten für diese Session.
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </main>
  );
};
