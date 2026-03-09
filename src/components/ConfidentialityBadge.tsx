import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BADGE_COLORS } from "@/lib/constants";

type Level = "open" | "internal" | "confidential";

const config: Record<Level, { icon: string; label: string; labelShort: string; className: string; tooltip: string }> = {
  open: {
    icon: "🟢",
    label: "Offen",
    labelShort: "Offen",
    className: BADGE_COLORS.low,
    tooltip: "Externe Business-API erlaubt. Keine vertraulichen Daten.",
  },
  internal: {
    icon: "🟡",
    label: "Intern",
    labelShort: "Intern",
    className: BADGE_COLORS.medium,
    tooltip: "Interne KI empfohlen. Externe API nur ohne sensible Daten.",
  },
  confidential: {
    icon: "🔴",
    label: "Vertraulich",
    labelShort: "Vertr.",
    className: BADGE_COLORS.high,
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
