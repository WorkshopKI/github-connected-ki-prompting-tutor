import { useState, useCallback } from "react";
import { Copy, Wand2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FEEDBACK_CATEGORY_COLORS, FEEDBACK_STATUS_COLORS } from "@/lib/constants";
import { FEEDBACK_CATEGORY_LABELS } from "@/types";
import type { FeedbackItem, FeedbackStatus } from "@/types";
import { updateFeedback } from "@/services/feedbackService";
import { generateClaudeCodePrompt } from "@/services/promptGenerator";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: "neu", label: "Neu" },
  { value: "in_bearbeitung", label: "In Bearbeitung" },
  { value: "umgesetzt", label: "Umgesetzt" },
  { value: "abgelehnt", label: "Abgelehnt" },
  { value: "archiviert", label: "Archiviert" },
];

interface Props {
  ticket: FeedbackItem | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function FeedbackTicketDetail({ ticket, onClose, onUpdated }: Props) {
  const [status, setStatus] = useState<FeedbackStatus>(ticket?.admin_status ?? "neu");
  const [priority, setPriority] = useState(ticket?.admin_priority ?? 3);
  const [notes, setNotes] = useState(ticket?.admin_notes ?? "");
  const [prompt, setPrompt] = useState(ticket?.generated_prompt ?? "");
  const [saving, setSaving] = useState(false);

  // Sync state when ticket changes
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) onClose();
  }, [onClose]);

  const handleSave = useCallback(async () => {
    if (!ticket) return;
    setSaving(true);
    try {
      await updateFeedback(ticket.id, {
        admin_status: status,
        admin_priority: priority,
        admin_notes: notes,
        generated_prompt: prompt || undefined,
      });
      toast.success("Ticket aktualisiert");
      onUpdated();
    } catch {
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }, [ticket, status, priority, notes, prompt, onUpdated]);

  const handleGeneratePrompt = useCallback(() => {
    if (!ticket) return;
    const generated = generateClaudeCodePrompt(ticket);
    setPrompt(generated);
    toast.success("Prompt generiert");
  }, [ticket]);

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(prompt);
    toast.success("In Zwischenablage kopiert");
  }, [prompt]);

  if (!ticket) return null;

  return (
    <Sheet open={!!ticket} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge className={FEEDBACK_CATEGORY_COLORS[ticket.category]}>
              {FEEDBACK_CATEGORY_LABELS[ticket.category]}
            </Badge>
            <Badge variant="outline" className={FEEDBACK_STATUS_COLORS[ticket.admin_status]}>
              {STATUS_OPTIONS.find((s) => s.value === ticket.admin_status)?.label}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5">
          {/* Feedback-Text */}
          <div>
            <Label className="text-xs text-muted-foreground">Feedback</Label>
            <p className="mt-1 text-sm">{ticket.text || "–"}</p>
          </div>

          {/* LLM-Zusammenfassung */}
          {ticket.llm_summary && (
            <div>
              <Label className="text-xs text-muted-foreground">KI-Zusammenfassung</Label>
              <p className="mt-1 text-sm">{ticket.llm_summary}</p>
              {ticket.user_confirmed !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {ticket.user_confirmed ? "Vom Nutzer bestätigt" : "Nicht bestätigt"}
                </span>
              )}
            </div>
          )}

          {/* Kontext */}
          <div>
            <Label className="text-xs text-muted-foreground">Kontext</Label>
            <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
              <div>Seite: {ticket.context.page} ({ticket.context.route})</div>
              <div>Modus: {ticket.context.mode}</div>
              <div>Gerät: {ticket.context.device} ({ticket.context.viewport})</div>
              <div>Letzte Aktion: {ticket.context.lastAction || "–"}</div>
              {ticket.screen_ref && <div>Bereich: <code className="bg-muted px-1 rounded">{ticket.screen_ref}</code></div>}
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-muted-foreground">
            Von: {ticket.user_display_name || ticket.user_id} · {new Date(ticket.created_at).toLocaleString("de-DE")}
          </div>

          <hr className="border-border" />

          {/* Admin-Felder */}
          <div className="space-y-3">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as FeedbackStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priorität: {priority}/5</Label>
              <Slider
                value={[priority]}
                onValueChange={([v]) => setPriority(v)}
                min={1}
                max={5}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Admin-Notizen</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 resize-none text-sm"
                placeholder="Interne Notizen..."
              />
            </div>
          </div>

          <hr className="border-border" />

          {/* Prompt-Generator */}
          <div className="space-y-2">
            <Button onClick={handleGeneratePrompt} className="gap-1.5">
              <Wand2 className="h-4 w-4" />
              Claude Code Prompt generieren
            </Button>

            {prompt && (
              <div className="relative">
                <pre className="rounded-lg bg-slate-950 p-3 text-xs text-slate-200 overflow-x-auto max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {prompt}
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-slate-200"
                  onClick={handleCopyPrompt}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Speichern */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Speichern..." : "Speichern"}
            </Button>
            <Button variant="outline" onClick={onClose}>Schließen</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
