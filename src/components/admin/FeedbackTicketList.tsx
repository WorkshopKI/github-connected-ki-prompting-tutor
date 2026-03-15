import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FEEDBACK_CATEGORY_COLORS, FEEDBACK_STATUS_COLORS } from "@/lib/constants";
import { FEEDBACK_CATEGORY_LABELS } from "@/types";
import type { FeedbackItem, FeedbackCategory, FeedbackStatus } from "@/types";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  umgesetzt: "Umgesetzt",
  abgelehnt: "Abgelehnt",
  archiviert: "Archiviert",
};

interface Props {
  tickets: FeedbackItem[];
  loading: boolean;
  selectedId?: string;
  filterCategory: FeedbackCategory | "";
  filterStatus: FeedbackStatus | "";
  onFilterCategory: (v: FeedbackCategory | "") => void;
  onFilterStatus: (v: FeedbackStatus | "") => void;
  onSelect: (ticket: FeedbackItem) => void;
}

export function FeedbackTicketList({
  tickets,
  loading,
  selectedId,
  filterCategory,
  filterStatus,
  onFilterCategory,
  onFilterStatus,
  onSelect,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <Select
          value={filterCategory || "all"}
          onValueChange={(v) => onFilterCategory(v === "all" ? "" : v as FeedbackCategory)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {(Object.keys(FEEDBACK_CATEGORY_LABELS) as FeedbackCategory[]).map((cat) => (
              <SelectItem key={cat} value={cat}>{FEEDBACK_CATEGORY_LABELS[cat]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus || "all"}
          onValueChange={(v) => onFilterStatus(v === "all" ? "" : v as FeedbackStatus)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {(Object.keys(STATUS_LABELS) as FeedbackStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabelle */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Noch kein Feedback vorhanden.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Kategorie</TableHead>
              <TableHead>Text</TableHead>
              <TableHead className="w-[80px]">Priorität</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Datum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className={`cursor-pointer ${selectedId === ticket.id ? "bg-accent" : ""}`}
                onClick={() => onSelect(ticket)}
              >
                <TableCell>
                  <Badge className={FEEDBACK_CATEGORY_COLORS[ticket.category]}>
                    {FEEDBACK_CATEGORY_LABELS[ticket.category]}
                  </Badge>
                </TableCell>
                <TableCell className="truncate-safe max-w-[300px]">
                  {ticket.llm_summary || ticket.text || "–"}
                </TableCell>
                <TableCell>
                  {ticket.admin_priority ? (
                    <span className="text-sm font-medium">{ticket.admin_priority}/5</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">–</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={FEEDBACK_STATUS_COLORS[ticket.admin_status]}>
                    {STATUS_LABELS[ticket.admin_status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(ticket.created_at).toLocaleDateString("de-DE")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
