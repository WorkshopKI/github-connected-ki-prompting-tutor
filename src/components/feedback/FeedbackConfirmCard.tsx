import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FEEDBACK_CATEGORY_COLORS } from "@/lib/constants";

interface LLMClassification {
  category: string;
  summary: string;
  details: string;
  affectedArea: string;
  priority_suggestion: number;
  relevant_files?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Bug",
  feature: "Feature-Wunsch",
  ux: "UX-Feedback",
  praise: "Lob",
  question: "Frage",
};

const CATEGORY_MAP: Record<string, string> = {
  bug: "problem",
  feature: "idea",
  ux: "problem",
  praise: "praise",
  question: "question",
};

interface Props {
  classification: LLMClassification;
  onConfirm: () => void;
  onReject: () => void;
}

export function FeedbackConfirmCard({ classification, onConfirm, onReject }: Props) {
  const badgeColor = FEEDBACK_CATEGORY_COLORS[CATEGORY_MAP[classification.category] ?? "question"];

  return (
    <div className="card-section space-y-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Zusammenfassung
      </div>

      <Badge className={badgeColor}>
        {CATEGORY_LABELS[classification.category] ?? classification.category}
      </Badge>

      <p className="text-sm">{classification.summary}</p>

      {classification.details && (
        <p className="text-xs text-muted-foreground">{classification.details}</p>
      )}

      {classification.affectedArea && (
        <div className="text-xs text-muted-foreground">
          Bereich: <code className="rounded bg-muted px-1">{classification.affectedArea}</code>
        </div>
      )}

      {classification.relevant_files && classification.relevant_files.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Dateien: {classification.relevant_files.map((f) => (
            <code key={f} className="mr-1 rounded bg-muted px-1">{f}</code>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" onClick={onConfirm}>
          <Check className="mr-1 h-3 w-3" />
          Ja, stimmt
        </Button>
        <Button size="sm" variant="outline" onClick={onReject}>
          <X className="mr-1 h-3 w-3" />
          Nein, anders
        </Button>
      </div>
    </div>
  );
}
