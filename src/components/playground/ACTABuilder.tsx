import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, User, FileText, Target, Layout, Send, Copy } from "lucide-react";
import { toast } from "sonner";
import { ACTA_TEMPLATES, type ACTAFields } from "./ACTATemplates";

export interface ACTABuilderProps {
  fields: ACTAFields;
  onFieldsChange: (fields: ACTAFields) => void;
  onSendToPlayground: (assembledPrompt: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FIELD_CONFIG = [
  { key: "act" as const, label: "Act (Rolle)", icon: User, placeholder: "z.B. ein erfahrener Marketing-Experte..." },
  { key: "context" as const, label: "Context (Kontext)", icon: FileText, placeholder: "Beschreibe die Ausgangssituation und den Hintergrund..." },
  { key: "task" as const, label: "Task (Aufgabe)", icon: Target, placeholder: "Was genau soll die KI tun?" },
  { key: "ausgabe" as const, label: "Ausgabe (Format)", icon: Layout, placeholder: "Wie soll das Ergebnis aussehen? (Länge, Struktur, Sprache...)" },
];

function assembleACTAPrompt(fields: ACTAFields): string {
  const parts: string[] = [];
  if (fields.act.trim()) parts.push(`Du bist ${fields.act.trim()}.`);
  if (fields.context.trim()) parts.push(`\nKontext: ${fields.context.trim()}`);
  if (fields.task.trim()) parts.push(`\nAufgabe: ${fields.task.trim()}`);
  if (fields.ausgabe.trim()) parts.push(`\nAusgabeformat: ${fields.ausgabe.trim()}`);
  return parts.join("\n");
}

export const ACTABuilder = ({
  fields,
  onFieldsChange,
  onSendToPlayground,
  isOpen,
  onToggle,
}: ACTABuilderProps) => {
  const filledCount = FIELD_CONFIG.filter((f) => fields[f.key].trim().length > 10).length;
  const assembled = assembleACTAPrompt(fields);
  const hasContent = assembled.trim().length > 0;

  const updateField = (key: keyof ACTAFields, value: string) => {
    onFieldsChange({ ...fields, [key]: value });
  };

  const handleTemplateSelect = (value: string) => {
    const idx = parseInt(value, 10);
    const template = ACTA_TEMPLATES[idx];
    if (template) {
      onFieldsChange({ ...template.fields });
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

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="bg-gradient-card rounded-xl border border-border shadow-lg">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-accent/50 rounded-t-xl transition-colors">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">ACTA-Builder</span>
            <Badge variant="secondary" className="text-xs">
              {filledCount}/4
            </Badge>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* Template selector */}
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Vorlage wählen..." />
              </SelectTrigger>
              <SelectContent>
                {ACTA_TEMPLATES.map((t, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* ACTA fields */}
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
                    className="text-sm min-h-[60px] resize-none"
                    rows={2}
                  />
                </div>
              );
            })}

            {/* Quality progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filledCount}/4 Felder ausgefüllt</span>
                <span>{filledCount === 4 ? "Vollständig!" : ""}</span>
              </div>
              <Progress value={filledCount * 25} className="h-1.5" />
            </div>

            {/* Live preview */}
            {hasContent && (
              <Card className="p-3 bg-background/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">Vorschau:</p>
                <p className="text-xs whitespace-pre-wrap leading-relaxed">{assembled}</p>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button onClick={handleSend} disabled={!hasContent} className="flex-1" size="sm">
                <Send className="w-3 h-3 mr-1.5" />
                An Playground senden
              </Button>
              <Button onClick={handleCopy} disabled={!hasContent} variant="outline" size="sm">
                <Copy className="w-3 h-3 mr-1.5" />
                Kopieren
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
