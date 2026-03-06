import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Level = "open" | "internal" | "confidential";

const config: Record<Level, { icon: string; label: string; labelShort: string; className: string; tooltip: string }> = {
  open: {
    icon: "🟢",
    label: "Offen",
    labelShort: "Offen",
    className: "bg-primary/10 text-primary",
    tooltip: "Externe Business-API erlaubt. Keine vertraulichen Daten.",
  },
  internal: {
    icon: "🟡",
    label: "Intern",
    labelShort: "Intern",
    className: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
    tooltip: "Interne KI empfohlen. Externe API nur ohne sensible Daten.",
  },
  confidential: {
    icon: "🔴",
    label: "Vertraulich",
    labelShort: "Vertr.",
    className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
    tooltip: "NUR interne KI. Externe API blockiert.",
  },
};

interface Props {
  level?: Level;
  reason?: string;
  compact?: boolean;
}

export const ConfidentialityBadge = ({ level = "open", reason, compact = false }: Props) => {
  const c = config[level];
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={`${c.className} text-[10px] gap-1 cursor-help`}>
          {c.icon} {compact ? c.labelShort : c.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p className="font-medium mb-0.5">{c.label}</p>
        <p>{reason || c.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const getConfidentialityConfig = (level: Level) => config[level];
