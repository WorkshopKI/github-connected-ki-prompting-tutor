import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Globe, Lock, ShieldAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Level = "open" | "internal" | "confidential";

/* Design-System „KI-Werkstatt“ · ConfidentialityBadge
 * Die drei Stufen unterscheiden sich in Form UND Helligkeit, nicht nur im Farbton:
 * offen = Kontur, intern = getönte Fläche, vertraulich = volle Fläche. Immer Icon + Wort. */
const config: Record<Level, {
  label: string;
  labelShort: string;
  className: string;
  tooltip: string;
  icon: LucideIcon;
}> = {
  open: {
    label: "Offen",
    labelShort: "Offen",
    className: "border-success text-success bg-transparent",
    tooltip: "Externe Business-API erlaubt. Keine personenbezogenen oder vertraulichen Daten eingeben.",
    icon: Globe,
  },
  internal: {
    label: "Intern",
    labelShort: "Intern",
    className: "border-transparent bg-warning-soft text-warning",
    tooltip: "Interne KI empfohlen. Externe API nur ohne sensible Daten.",
    icon: Lock,
  },
  confidential: {
    label: "Vertraulich",
    labelShort: "Vertr.",
    className: "border-transparent bg-confidential text-confidential-foreground",
    tooltip: "Nur interne KI. Externe API ist gesperrt.",
    icon: ShieldAlert,
  },
};

interface Props {
  level?: Level;
  reason?: string;
  compact?: boolean;
  /** "Offen" ist in Listen der Normalfall und wird dort ausgeblendet.
   *  In Werkstatt, Detailansicht und KI-Routing `showOpen` setzen: dort ist die Stufe Entscheidungsgrundlage. */
  showOpen?: boolean;
}

export const ConfidentialityBadge = ({ level = "open", reason, compact = false, showOpen = false }: Props) => {
  const c = config[level];
  if (level === "open" && !showOpen) return null;

  const Icon = c.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "h-[22px] gap-1 rounded-sm px-2 py-0 text-xs font-semibold tracking-[0.02em] cursor-help",
            c.className,
          )}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          {compact ? c.labelShort : c.label}
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
