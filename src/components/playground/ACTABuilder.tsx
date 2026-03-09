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

export const ACTABuilder = ({
  fields,
  onFieldsChange,
  onSendToPlayground,
  isOpen,
  onToggle,
  bare,
  mode,
  selectedModel,
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

  const content = (
    <div className="px-4 pb-4 space-y-4">
      <Select onValueChange={handleTemplateSelect}>
        <SelectTrigger className="w-full text-xs">
          <SelectValue placeholder="Vorlage aus Sammlung laden..." />
        </SelectTrigger>
        <SelectContent className="max-h-[280px]">
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

      {isExperte && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowSuggest(!showSuggest)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
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
                className="text-[11px] min-h-[48px] resize-none"
                rows={2}
              />
              <Button
                size="sm"
                className="w-full text-[11px] h-7"
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

      {variables.length > 0 && (
        <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Angaben ausfüllen ({variables.filter(v => variableValues[v]?.trim()).length}/{variables.length})
            </p>
            {hasUnfilledVars && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] h-6 gap-1 text-primary"
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
              <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                {v}
              </Badge>
              <input
                type="text"
                value={variableValues[v] || ""}
                onChange={(e) => setVariableValues(prev => ({ ...prev, [v]: e.target.value }))}
                placeholder={`z.B. ...`}
                className="flex-1 h-7 text-[11px] px-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
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
        <Card className="p-3 bg-background/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Vorschau:</p>
          {hasUnfilledVars && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mb-1.5">
              {variables.filter(v => !variableValues[v]?.trim()).length} Angabe{variables.filter(v => !variableValues[v]?.trim()).length > 1 ? "n" : ""} noch offen
            </p>
          )}
          <p className="text-xs whitespace-pre-wrap leading-relaxed">{assembled}</p>
        </Card>
      )}

      <div className="flex gap-2">
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

  if (bare) return content;

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
          {content}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
