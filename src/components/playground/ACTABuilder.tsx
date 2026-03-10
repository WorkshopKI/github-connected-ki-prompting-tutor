import { useState, useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, User, FileText, Target, Layout, Send, Copy, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getLibraryTemplates, EMPTY_EXTENSIONS, type ACTAFields, type ACTAExtensions } from "./ACTATemplates";
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

  // Horizontal layout state
  const [expanded, setExpanded] = useState(true);
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
          className="flex items-center gap-2 px-4 py-2 cursor-pointer select-none hover:bg-muted/30 transition-colors"
        >
          <span className="text-xs font-bold">ACTA</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {filledCount}/4{hasActiveExtensions ? " +" : ""}
          </Badge>
          {sourceTitle && (
            <span className="text-[10px] text-primary font-medium ml-2 truncate">
              Vorlage: {sourceTitle}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform ml-auto shrink-0",
              expanded && "rotate-180"
            )}
          />
        </div>

        {expanded && (
          <div className="px-4 pb-3 space-y-2">
            {/* KI-Suggest — only Experte */}
            {isExperte && (
              <div data-tour="acta-ki-suggest">
                <button
                  type="button"
                  onClick={() => setShowSuggest(!showSuggest)}
                  className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3 h-3" /> KI: ACTA-Felder vorschlagen lassen
                </button>
                {showSuggest && (
                  <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 space-y-2 mt-2">
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

            {/* 4 Fields in a grid */}
            <div data-tour="acta-fields" className="grid grid-cols-4 gap-2">
              {FIELD_CONFIG.map((field) => (
                <div key={field.key}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    {field.label.split(" (")[0]}
                  </label>
                  <Textarea
                    value={fields[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="text-xs min-h-[52px] resize-y"
                    rows={3}
                  />
                </div>
              ))}
            </div>

            {/* Variables panel — full width under fields */}
            {variables.length > 0 && (
              <div data-tour="acta-variables" className="bg-muted/30 border border-border rounded-md p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    Angaben ausfüllen ({variables.filter(v => variableValues[v]?.trim()).length}/{variables.length})
                  </span>
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
                <div className="grid grid-cols-2 gap-2">
                  {variables.map((v) => (
                    <div key={v} className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[11px] shrink-0 font-mono">{v}</Badge>
                      <input
                        type="text"
                        value={variableValues[v] || ""}
                        onChange={(e) => setVariableValues(prev => ({ ...prev, [v]: e.target.value }))}
                        placeholder="z.B. ..."
                        className="flex-1 h-7 text-xs px-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  ))}
                </div>
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
                <Button onClick={handleSend} disabled={!hasContent} size="sm" className="text-xs h-7 gap-1">
                  <Send className="w-3 h-3" /> Prompt testen
                </Button>
                {isExperte && hasContent && (
                  <Button
                    onClick={async () => {
                      const result = await improve(fields, selectedModel);
                      if (result) { onFieldsChange(result); setVariableValues({}); }
                    }}
                    disabled={aiLoading}
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="KI verbessert deine ACTA-Felder"
                  >
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  </Button>
                )}
                <Button onClick={handleCopy} disabled={!hasContent} variant="outline" size="sm" className="h-7 w-7 p-0">
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
          → Prompt testen
        </Button>
        {isExperte && hasContent && (
          <Button
            onClick={async () => {
              const result = await improve(fields, selectedModel);
              if (result) { onFieldsChange(result); setVariableValues({}); }
            }}
            disabled={aiLoading}
            variant="outline"
            size="sm"
            title="KI verbessert deine ACTA-Felder"
          >
            {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
          </Button>
        )}
        <Button onClick={handleCopy} disabled={!hasContent} variant="outline" size="sm">
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
