import { useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, User, FileText, Target, Layout, Send, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getLibraryTemplates, type ACTAFields } from "./ACTATemplates";
import { useOrgContext } from "@/contexts/OrgContext";

export interface ACTABuilderProps {
  fields: ACTAFields;
  onFieldsChange: (fields: ACTAFields) => void;
  onSendToPlayground: (assembledPrompt: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  bare?: boolean;
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
  bare,
}: ACTABuilderProps) => {
  const { scope } = useOrgContext();
  const templateGroups = useMemo(() => getLibraryTemplates(scope), [scope]);

  const filledCount = FIELD_CONFIG.filter((f) => fields[f.key].trim().length > 10).length;
  const assembled = assembleACTAPrompt(fields);
  const hasContent = assembled.trim().length > 0;

  const updateField = (key: keyof ACTAFields, value: string) => {
    onFieldsChange({ ...fields, [key]: value });
  };

  const handleTemplateSelect = (value: string) => {
    const [groupLabel, idxStr] = value.split("::");
    const idx = parseInt(idxStr, 10);
    const group = templateGroups.find(g => g.label === groupLabel);
    const template = group?.templates[idx];
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

  const content = (
    <div className="px-4 pb-4 space-y-4">
      <Select onValueChange={handleTemplateSelect}>
        <SelectTrigger className="w-full text-xs">
          <SelectValue placeholder="Vorlage aus Sammlung laden..." />
        </SelectTrigger>
        <SelectContent>
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
              className="text-xs min-h-[56px] resize-none"
              rows={2}
            />
          </div>
        );
      })}

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
          <p className="text-xs whitespace-pre-wrap leading-relaxed">{assembled}</p>
        </Card>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSend} disabled={!hasContent} className="flex-1" size="sm">
          <Send className="w-3 h-3 mr-1.5" />
          → Prompt testen
        </Button>
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
              {filledCount}/4
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
