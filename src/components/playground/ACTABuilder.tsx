import { useState, useMemo, useRef, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronUp, User, FileText, Target, Layout, Send, Copy, Loader2, Wand2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getLibraryTemplates, EMPTY_EXTENSIONS, type ACTAFields, type ACTAExtensions } from "./ACTATemplates";
import { PromptEvaluation } from "./PromptEvaluation";
import { ContextExtensions, TaskExtensions, AusgabeExtensions } from "./ACTAExtensionsUI";
import { useOrgContext } from "@/contexts/OrgContext";
import { useACTAAssist } from "@/hooks/useACTAAssist";
import { extractVariables } from "@/lib/promptUtils";

export interface ACTABuilderProps {
  fields: ACTAFields;
  onFieldsChange: (fields: ACTAFields) => void;
  onSendToPlayground: (assembledPrompt: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  bare?: boolean;
  mode?: "einsteiger" | "experte";
  selectedModel?: string;
  layout?: "vertical" | "horizontal";
  sourceTitle?: string | null;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  confidentiality?: "open" | "internal" | "confidential";
}

const FIELD_CONFIG = [
  { key: "act" as const, label: "Act (Rolle)", icon: User, placeholder: "z.B. ein erfahrener Marketing-Experte..." },
  { key: "context" as const, label: "Context (Kontext)", icon: FileText, placeholder: "Beschreibe die Ausgangssituation und den Hintergrund..." },
  { key: "task" as const, label: "Task (Aufgabe)", icon: Target, placeholder: "Was genau soll die KI tun?" },
  { key: "ausgabe" as const, label: "Ausgabe (Format)", icon: Layout, placeholder: "Wie soll das Ergebnis aussehen? (Länge, Struktur, Sprache...)" },
];

function replaceVariables(text: string, values: Record<string, string>): string {
  let result = text;
  for (const [key, val] of Object.entries(values)) {
    if (val.trim()) {
      result = result.replace(new RegExp(`\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`, "g"), val.trim());
    }
  }
  return result;
}

function assembleACTAPrompt(fields: ACTAFields, varValues?: Record<string, string>): string {
  const ext = fields.extensions;
  const innerParts: string[] = [];

  // Act
  if (fields.act.trim()) innerParts.push(`Du bist ${fields.act.trim()}.`);

  // Context + Extensions
  if (fields.context.trim()) innerParts.push(`\nKontext: ${fields.context.trim()}`);
  if (ext?.examples && ext.examples.filter(e => e.trim()).length > 0) {
    const exList = ext.examples.filter(e => e.trim()).map((e, i) => `Beispiel ${i + 1}: ${e.trim()}`).join("\n");
    innerParts.push(`\nBeispiele zur Orientierung:\n${exList}`);
  }
  if (ext?.rules?.trim()) innerParts.push(`\nWichtige Regeln:\n${ext.rules.trim()}`);

  // Task + Extensions
  if (fields.task.trim()) innerParts.push(`\nAufgabe: ${fields.task.trim()}`);
  if (ext?.reasoning && ext.reasoning !== "none") {
    const map: Record<string, string> = {
      "step-by-step": "Gehe Schritt für Schritt vor und erkläre jeden Denkschritt.",
      "pros-cons": "Analysiere zunächst Vor- und Nachteile, bevor du zu einer Empfehlung kommst.",
      "perspectives": "Betrachte die Aufgabe aus mindestens 3 verschiedenen Perspektiven, bevor du zu einem Ergebnis kommst.",
      "tree-of-thought": "Entwickle mehrere mögliche Lösungswege parallel, bewerte jeden, und verfolge den vielversprechendsten weiter.",
    };
    if (map[ext.reasoning]) innerParts.push(`\nDenkweise: ${map[ext.reasoning]}`);
  }
  if (ext?.verification) {
    innerParts.push(ext.verificationNote?.trim()
      ? `\nSelbstprüfung: ${ext.verificationNote.trim()}`
      : `\nSelbstprüfung: Überprüfe deine Antwort auf Vollständigkeit, Korrektheit und mögliche Schwachstellen. Korrigiere identifizierte Probleme.`
    );
  }

  // Ausgabe + Extensions
  if (fields.ausgabe.trim()) innerParts.push(`\nAusgabeformat: ${fields.ausgabe.trim()}`);
  if (ext?.negatives?.trim()) innerParts.push(`\nWICHTIG — NICHT:\n${ext.negatives.trim()}`);

  const innerPrompt = innerParts.join("\n");

  // Reverse Prompting Hülle
  let finalPrompt: string;
  if (ext?.reversePrompt) {
    finalPrompt = `Du bist ein Experte für Prompt-Design.\n\nSchritt 1: Lies die folgende Aufgabenbeschreibung und entwirf den bestmöglichen Prompt dafür. Berücksichtige fehlende Details, das optimale Output-Format und die effektivste Denkstrategie.\n\nAufgabenbeschreibung:\n---\n${innerPrompt}\n---\n\nSchritt 2: Zeige den von dir entworfenen Prompt.\n\nSchritt 3: Führe deinen entworfenen Prompt aus und liefere das Ergebnis.`;
  } else {
    finalPrompt = innerPrompt;
  }

  if (varValues) {
    finalPrompt = replaceVariables(finalPrompt, varValues);
  }
  return finalPrompt;
}

const CARD_CONFIG = [
  { key: "act" as const, icon: "👤", shortLabel: "ACT", placeholder: "Welche Expertenrolle soll die KI einnehmen?" },
  { key: "context" as const, icon: "📋", shortLabel: "CONTEXT", placeholder: "Hintergrund, Situation, Rahmenbedingungen..." },
  { key: "task" as const, icon: "🎯", shortLabel: "TASK", placeholder: "Was genau soll die KI tun?" },
  { key: "ausgabe" as const, icon: "📄", shortLabel: "AUSGABE", placeholder: "Länge, Struktur, Sprache des Ergebnisses..." },
];

interface ACTACardProps {
  icon: string;
  shortLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxHeight?: number;
}

function ACTACard({ icon, shortLabel, value, onChange, placeholder, maxHeight = 120 }: ACTACardProps) {
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEmpty = !value.trim();

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      autoResize(textareaRef.current);
    }
  }, [editing]);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  };

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      className={cn(
        "flex-1 min-w-0 rounded-lg p-2.5 transition-all cursor-pointer flex flex-col gap-1",
        editing
          ? "border-[1.5px] border-primary bg-card shadow-[0_0_0_3px_rgba(192,105,74,0.08)]"
          : isEmpty
            ? "border border-dashed border-border bg-muted/30 hover:border-primary/30"
            : "border border-primary/15 bg-card shadow-sm hover:shadow-md"
      )}
      style={{ cursor: editing ? "text" : "pointer" }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-sm leading-none">{icon}</span>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          isEmpty ? "text-muted-foreground/50" : "text-primary"
        )}>
          {shortLabel}
        </span>
        {!editing && !isEmpty && (
          <span className="ml-auto text-muted-foreground/40 text-xs">✏️</span>
        )}
        {editing && (
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(false); }}
            className="ml-auto text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5 hover:bg-primary/15 transition-colors"
          >
            ✓ Fertig
          </button>
        )}
      </div>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); autoResize(e.target); }}
          onBlur={() => setEditing(false)}
          placeholder={placeholder}
          className="w-full border-none outline-none resize-none text-xs leading-relaxed text-foreground bg-transparent font-[inherit] p-0"
          style={{ minHeight: 36, maxHeight, overflow: "auto" }}
        />
      ) : isEmpty ? (
        <span className="text-xs text-muted-foreground/50 leading-relaxed italic">
          {placeholder}
        </span>
      ) : (
        <div
          className="text-xs text-foreground leading-relaxed overflow-hidden break-words"
          style={{
            maxHeight,
            display: "-webkit-box",
            WebkitLineClamp: Math.floor(maxHeight / 18),
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

const EXTENSION_CHIPS = [
  { key: "examples" as const, label: "Few-Shot", type: "array" as const },
  { key: "rules" as const, label: "Regeln", type: "string" as const },
  { key: "reasoning" as const, label: "Denkweise", type: "select" as const },
  { key: "verification" as const, label: "Selbstprfg.", type: "boolean" as const },
  { key: "reversePrompt" as const, label: "Reverse", type: "boolean" as const },
  { key: "negatives" as const, label: "Negativ", type: "string" as const },
];

const REASONING_OPTIONS = [
  { value: "", label: "Keine" },
  { value: "step-by-step", label: "Schritt für Schritt" },
  { value: "pros-cons", label: "Vor- und Nachteile" },
  { value: "perspectives", label: "Mehrere Perspektiven" },
  { value: "tree-of-thought", label: "Lösungswege vergleichen" },
];

export const ACTABuilder = ({
  fields,
  onFieldsChange,
  onSendToPlayground,
  isOpen,
  onToggle,
  bare,
  mode,
  selectedModel,
  layout,
  sourceTitle,
  isExpanded: isExpandedProp,
  onExpandedChange,
  confidentiality,
}: ACTABuilderProps) => {
  const { scope } = useOrgContext();
  const templateGroups = useMemo(() => getLibraryTemplates(scope), [scope]);

  const isExperte = mode === "experte";
  const ext = fields.extensions ?? EMPTY_EXTENSIONS;
  const updateExtensions = (updated: ACTAExtensions) => {
    onFieldsChange({ ...fields, extensions: updated });
  };
  const hasActiveExtensions =
    ext.examples.some(e => e.trim()) ||
    ext.rules.trim() !== "" ||
    (ext.reasoning !== "" && ext.reasoning !== "none") ||
    ext.verification ||
    ext.reversePrompt ||
    ext.negatives.trim() !== "";

  const { suggest, improve, fillVariables, isLoading: aiLoading } = useACTAAssist();
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestInput, setSuggestInput] = useState("");

  // Variablen-Erkennung
  const allFieldsText = `${fields.act} ${fields.context} ${fields.task} ${fields.ausgabe}`;
  const variables = useMemo(() => extractVariables(allFieldsText), [allFieldsText]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const hasUnfilledVars = variables.length > 0 && variables.some(v => !variableValues[v]?.trim());

  const filledCount = FIELD_CONFIG.filter((f) => fields[f.key].trim().length > 10).length;
  const assembled = assembleACTAPrompt(fields, variableValues);
  const hasContent = assembled.trim().length > 0;

  // Horizontal layout state — controlled/uncontrolled pattern
  const [internalExpanded, setInternalExpanded] = useState(true);
  const expanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;
  const setExpanded = (val: boolean) => {
    if (onExpandedChange) onExpandedChange(val);
    else setInternalExpanded(val);
  };
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const updateField = (key: "act" | "context" | "task" | "ausgabe", value: string) => {
    onFieldsChange({ ...fields, [key]: value });
  };

  const handleTemplateSelect = (value: string) => {
    const [groupLabel, idxStr] = value.split("::");
    const idx = parseInt(idxStr, 10);
    const group = templateGroups.find(g => g.label === groupLabel);
    const template = group?.templates[idx];
    if (template) {
      onFieldsChange({ ...template.fields });
      setVariableValues({});
    }
  };

  const handleSend = () => {
    if (!hasContent) return;
    onSendToPlayground(assembled);
    setExpanded(false);
  };

  const handleCopy = () => {
    if (!hasContent) return;
    navigator.clipboard.writeText(assembled);
    toast.success("Prompt kopiert!");
  };

  const isChipActive = (key: string): boolean => {
    switch (key) {
      case "examples": return ext.examples.some(e => e.trim());
      case "rules": return ext.rules.trim() !== "";
      case "reasoning": return ext.reasoning !== "" && ext.reasoning !== "none";
      case "verification": return ext.verification;
      case "reversePrompt": return ext.reversePrompt;
      case "negatives": return ext.negatives.trim() !== "";
      default: return false;
    }
  };

  const handleChipClick = (chip: typeof EXTENSION_CHIPS[number]) => {
    if (chip.type === "boolean") {
      const key = chip.key as "verification" | "reversePrompt";
      updateExtensions({ ...ext, [key]: !ext[key] });
    } else {
      setActiveChip(activeChip === chip.key ? null : chip.key);
    }
  };

  // ── Horizontal layout (desktop) ──
  if (layout === "horizontal") {
    return (
      <div className="bg-card border-b border-border">
        {/* Header row — click to collapse/expand */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-1.5 cursor-pointer select-none hover:bg-muted/30 transition-colors"
        >
          <span className="text-xs font-bold">ACTA</span>
          {sourceTitle && (
            <span className="text-xs text-primary font-medium truncate max-w-[200px]">{sourceTitle}</span>
          )}
          {confidentiality === "confidential" && (
            <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0" title="Nur interne KI zugelassen — keine externen Modelle">
              🔒 Vertraulich
            </span>
          )}
          {confidentiality === "internal" && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0" title="Interne Daten — externe KI nur ohne sensible Inhalte">
              🟡 Intern
            </span>
          )}
          {/* Offene Variablen-Warnung — nur collapsed */}
          {!expanded && variables.length > 0 && hasUnfilledVars && (
            <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-600">
              {variables.filter(v => !variableValues[v]?.trim()).length} offen
            </Badge>
          )}
          {/* Aktive Extensions — nur collapsed + Experte */}
          {!expanded && isExperte && hasActiveExtensions && (
            <div className="flex gap-1">
              {EXTENSION_CHIPS.filter(c => isChipActive(c.key)).map(c => (
                <span key={c.key} className="text-[10px] text-primary bg-primary/10 px-1.5 rounded-full font-medium">
                  ✓ {c.label}
                </span>
              ))}
            </div>
          )}
          {/* KI-Suggest Icon — nur expanded + Experte */}
          {expanded && isExperte && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 ml-auto"
              title="KI: ACTA-Felder vorschlagen"
              onClick={(e) => { e.stopPropagation(); setShowSuggest(!showSuggest); }}
            >
              <Wand2 className="w-3.5 h-3.5 text-primary" />
            </Button>
          )}
          <ChevronDown className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0",
            !expanded && isExperte ? "" : "ml-auto",
            expanded && "rotate-180"
          )} />
        </div>

        {expanded && (
          <div className="px-4 pb-3 space-y-2">
            {/* KI-Suggest Eingabe — wenn aktiv */}
            {isExperte && showSuggest && (
              <div data-tour="acta-ki-suggest" className="bg-primary/5 border border-primary/15 rounded-lg p-2.5 space-y-2">
                <Textarea
                  value={suggestInput}
                  onChange={(e) => setSuggestInput(e.target.value)}
                  placeholder="Beschreibe kurz was du brauchst, z.B.: 'Pressemitteilung für die Eröffnung eines neuen Bürgerservice-Zentrums'"
                  className="text-xs min-h-[48px] resize-none"
                  rows={2}
                />
                <Button
                  size="sm"
                  className="w-full text-xs h-7"
                  disabled={!suggestInput.trim() || aiLoading}
                  onClick={async () => {
                    const result = await suggest(suggestInput, selectedModel);
                    if (result) {
                      onFieldsChange(result);
                      setVariableValues({});
                      setShowSuggest(false);
                      setSuggestInput("");
                    }
                  }}
                >
                  {aiLoading ? (
                    <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generiert...</>
                  ) : (
                    <><Wand2 className="w-3 h-3 mr-1" /> ACTA generieren</>
                  )}
                </Button>
              </div>
            )}

            {/* 4 ACTA Cards */}
            <div data-tour="acta-fields" className="flex gap-2">
              {CARD_CONFIG.map((card) => (
                <ACTACard
                  key={card.key}
                  icon={card.icon}
                  shortLabel={card.shortLabel}
                  value={fields[card.key]}
                  onChange={(v) => updateField(card.key, v)}
                  placeholder={card.placeholder}
                />
              ))}
            </div>

            {/* Inline variables */}
            {variables.length > 0 && (
              <div data-tour="acta-variables" className="flex items-center gap-2">
                <div className="flex flex-1 min-w-0 flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground shrink-0">
                    Angaben ({variables.filter(v => variableValues[v]?.trim()).length}/{variables.length}):
                  </span>
                  {variables.map((v) => (
                    <div key={v} className="flex items-center gap-1 flex-1 min-w-[80px]">
                      <span className="text-[11px] font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">{v}</span>
                      <input
                        type="text"
                        value={variableValues[v] || ""}
                        onChange={(e) => setVariableValues(prev => ({ ...prev, [v]: e.target.value }))}
                        placeholder="..."
                        className="h-6 text-xs px-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 flex-1 min-w-[50px]"
                      />
                    </div>
                  ))}
                </div>
                {hasUnfilledVars && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 gap-1 text-primary shrink-0"
                    disabled={aiLoading}
                    onClick={async () => {
                      const result = await fillVariables(variables.filter(v => !variableValues[v]?.trim()), fields, selectedModel);
                      if (result) setVariableValues(prev => ({ ...prev, ...result }));
                    }}
                  >
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Beispielwerte
                  </Button>
                )}
              </div>
            )}

            {/* Extension Chips + Action Buttons in one row */}
            <div className="flex items-center gap-1.5">
              {/* Extension Chips — only Experte */}
              {isExperte && (
                <div className="flex gap-1 flex-1 flex-wrap" data-tour="acta-extensions">
                  {EXTENSION_CHIPS.map((chip) => {
                    const active = isChipActive(chip.key);
                    return (
                      <button
                        key={chip.key}
                        onClick={() => handleChipClick(chip)}
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border transition-colors font-medium",
                          active
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        {active ? "✓ " : "+ "}{chip.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {!isExperte && <div className="flex-1" />}

              {/* Action Buttons */}
              <div className="flex gap-1.5 shrink-0" data-tour="acta-send">
                {/* → An KI senden */}
                <Button onClick={handleSend} disabled={!hasContent} size="sm" className="text-xs h-7 gap-1">
                  <Send className="w-3 h-3" /> An KI senden
                </Button>
                {/* 🔍 Prompt prüfen — nur Experte, Popover mit Evaluation + Verbessern */}
                {isExperte && hasContent && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 gap-1"
                        title="Prompt auf Qualität prüfen und Verbesserungsvorschläge erhalten"
                      >
                        <Search className="w-3 h-3" /> Prüfen
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[380px] max-h-[450px] overflow-y-auto p-4 space-y-3">
                      <h4 className="text-sm font-semibold">Prompt-Qualität prüfen</h4>
                      <PromptEvaluation prompt={assembled} />
                      <div className="border-t border-border pt-3">
                        <Button
                          onClick={async () => {
                            const result = await improve(fields, selectedModel);
                            if (result) { onFieldsChange(result); setVariableValues({}); }
                          }}
                          disabled={aiLoading}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs h-7 gap-1.5"
                        >
                          {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                          Verbesserungsvorschläge übernehmen
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                {/* 📋 Kopieren */}
                <Button
                  onClick={handleCopy}
                  disabled={!hasContent}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  title="Assemblierten Prompt in die Zwischenablage kopieren"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Active Chip Input Area */}
            {isExperte && activeChip === "examples" && (
              <div className="bg-muted/30 border border-border rounded-md p-2.5 space-y-1.5">
                <p className="text-[11px] text-muted-foreground">Zeige der KI 1–3 Beispiele (Few-Shot):</p>
                {ext.examples.map((ex, i) => (
                  <div key={i} className="flex gap-1.5 items-start">
                    <Textarea
                      value={ex}
                      onChange={(e) => {
                        const updated = ext.examples.map((v, j) => j === i ? e.target.value : v);
                        updateExtensions({ ...ext, examples: updated });
                      }}
                      placeholder={`Beispiel ${i + 1}...`}
                      className="text-xs min-h-[40px] resize-none flex-1"
                      rows={2}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 mt-1"
                      onClick={() => updateExtensions({ ...ext, examples: ext.examples.filter((_, j) => j !== i) })}
                    >
                      <span className="text-xs">✕</span>
                    </Button>
                  </div>
                ))}
                {ext.examples.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 w-full"
                    onClick={() => updateExtensions({ ...ext, examples: [...ext.examples, ""] })}
                  >
                    + Beispiel hinzufügen
                  </Button>
                )}
              </div>
            )}

            {isExperte && activeChip === "rules" && (
              <Textarea
                value={ext.rules}
                onChange={(e) => updateExtensions({ ...ext, rules: e.target.value })}
                placeholder="Wichtige Regeln und Einschränkungen..."
                className="text-xs"
                rows={2}
              />
            )}

            {isExperte && activeChip === "reasoning" && (
              <select
                value={ext.reasoning || ""}
                onChange={(e) => updateExtensions({ ...ext, reasoning: e.target.value })}
                className="text-xs border border-border rounded-md px-2 py-1.5 bg-background w-full focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {REASONING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}

            {isExperte && activeChip === "negatives" && (
              <Textarea
                value={ext.negatives}
                onChange={(e) => updateExtensions({ ...ext, negatives: e.target.value })}
                placeholder="Was die KI NICHT tun soll..."
                className="text-xs"
                rows={2}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // ── Vertical layout (existing sidebar / mobile) ──
  const verticalContent = (
    <div className="px-4 pb-4 space-y-4">
      <div data-tour="acta-template-select">
      <Select onValueChange={handleTemplateSelect}>
        <SelectTrigger className="w-full text-xs">
          <SelectValue placeholder="Vorlage aus Sammlung laden..." />
        </SelectTrigger>
        <SelectContent className="max-h-[280px] z-[120]">
          {templateGroups.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {group.label}
              </SelectLabel>
              {group.templates.map((t, i) => (
                <SelectItem key={`${group.label}-${i}`} value={`${group.label}::${i}`}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      </div>

      {isExperte && (
        <div data-tour="acta-ki-suggest" className="space-y-2">
          <button
            type="button"
            onClick={() => setShowSuggest(!showSuggest)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Wand2 className="w-3 h-3" />
            KI: ACTA-Felder vorschlagen lassen
          </button>
          {showSuggest && (
            <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 space-y-2">
              <Textarea
                value={suggestInput}
                onChange={(e) => setSuggestInput(e.target.value)}
                placeholder="Beschreibe kurz was du brauchst, z.B.: 'Pressemitteilung für die Eröffnung eines neuen Bürgerservice-Zentrums'"
                className="text-xs min-h-[48px] resize-none"
                rows={2}
              />
              <Button
                size="sm"
                className="w-full text-xs h-7"
                disabled={!suggestInput.trim() || aiLoading}
                onClick={async () => {
                  const result = await suggest(suggestInput, selectedModel);
                  if (result) {
                    onFieldsChange(result);
                    setVariableValues({});
                    setShowSuggest(false);
                    setSuggestInput("");
                  }
                }}
              >
                {aiLoading ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Generiert...</>
                ) : (
                  <><Wand2 className="w-3 h-3 mr-1" /> ACTA generieren</>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      <div data-tour="acta-fields" className="space-y-4">
      {FIELD_CONFIG.map((field) => {
        const Icon = field.icon;
        const value = fields[field.key];
        const isFilled = value.trim().length > 10;

        return (
          <div key={field.key} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <label className="text-xs font-medium">{field.label}</label>
              <Badge
                variant={isFilled ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0 h-4 ml-auto"
              >
                {isFilled ? "✓" : "–"}
              </Badge>
            </div>
            <Textarea
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="text-xs min-h-[72px] resize-none"
              rows={3}
            />
            {isExperte && field.key === "context" && <ContextExtensions extensions={ext} onChange={updateExtensions} />}
            {isExperte && field.key === "task" && <TaskExtensions extensions={ext} onChange={updateExtensions} />}
            {isExperte && field.key === "ausgabe" && <AusgabeExtensions extensions={ext} onChange={updateExtensions} />}
          </div>
        );
      })}
      </div>

      {variables.length > 0 && (
        <div data-tour="acta-variables" className="bg-muted/30 border border-border rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Angaben ausfüllen ({variables.filter(v => variableValues[v]?.trim()).length}/{variables.length})
            </p>
            {hasUnfilledVars && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 gap-1 text-primary"
                disabled={aiLoading}
                onClick={async () => {
                  const result = await fillVariables(
                    variables.filter(v => !variableValues[v]?.trim()),
                    fields,
                    selectedModel,
                  );
                  if (result) {
                    setVariableValues(prev => ({ ...prev, ...result }));
                  }
                }}
              >
                {aiLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Wand2 className="w-3 h-3" />
                )}
                Beispielwerte
              </Button>
            )}
          </div>
          {variables.map((v) => (
            <div key={v} className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] shrink-0 font-mono">
                {v}
              </Badge>
              <input
                type="text"
                value={variableValues[v] || ""}
                onChange={(e) => setVariableValues(prev => ({ ...prev, [v]: e.target.value }))}
                placeholder={`z.B. ...`}
                className="flex-1 h-7 text-xs px-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 mb-1">
        {FIELD_CONFIG.map((field, i) => {
          const filled = fields[field.key].trim().length > 10;
          return (
            <div key={field.key} className="flex items-center">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors",
                filled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {filled ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-[10px] ml-1 font-medium",
                filled ? "text-foreground" : "text-muted-foreground"
              )}>
                {field.key === "ausgabe" ? "Ausgabe" : field.key.charAt(0).toUpperCase() + field.key.slice(1)}
              </span>
              {i < 3 && <div className={cn(
                "w-4 h-0.5 mx-1.5 transition-colors",
                filled ? "bg-primary" : "bg-muted"
              )} />}
            </div>
          );
        })}
      </div>

      {hasContent && (
        <Card data-tour="acta-preview" className="p-3 bg-background/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Vorschau:</p>
          {hasUnfilledVars && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mb-1.5">
              {variables.filter(v => !variableValues[v]?.trim()).length} Angabe{variables.filter(v => !variableValues[v]?.trim()).length > 1 ? "n" : ""} noch offen
            </p>
          )}
          <p className="text-xs whitespace-pre-wrap leading-relaxed">{assembled}</p>
        </Card>
      )}

      <div data-tour="acta-send" className="flex gap-2">
        <Button onClick={handleSend} disabled={!hasContent} className="flex-1" size="sm">
          <Send className="w-3 h-3 mr-1.5" />
          An KI senden
        </Button>
        {isExperte && hasContent && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                title="Prompt auf Qualität prüfen und Verbesserungsvorschläge erhalten"
              >
                <Search className="w-3 h-3" /> Prüfen
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] max-h-[450px] overflow-y-auto p-4 space-y-3">
              <h4 className="text-sm font-semibold">Prompt-Qualität prüfen</h4>
              <PromptEvaluation prompt={assembled} />
              <div className="border-t border-border pt-3">
                <Button
                  onClick={async () => {
                    const result = await improve(fields, selectedModel);
                    if (result) { onFieldsChange(result); setVariableValues({}); }
                  }}
                  disabled={aiLoading}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-7 gap-1.5"
                >
                  {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  Verbesserungsvorschläge übernehmen
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Button
          onClick={handleCopy}
          disabled={!hasContent}
          variant="outline"
          size="sm"
          title="Assemblierten Prompt in die Zwischenablage kopieren"
        >
          <Copy className="w-3 h-3 mr-1.5" />
          Kopieren
        </Button>
      </div>
    </div>
  );

  if (bare) return verticalContent;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="bg-gradient-card rounded-xl border border-border shadow-lg">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-accent/50 rounded-t-xl transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">ACTA-Baukasten</span>
            <Badge variant="secondary" className="text-xs">
              {filledCount}/4{hasActiveExtensions ? " +" : ""}
            </Badge>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {verticalContent}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
