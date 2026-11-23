import { cn } from "@/lib/utils";
import { BADGE_COLORS } from "@/lib/constants";

/** Kennzeichnet Inhalte, die bei Zeitmangel entfallen können (Fahrplan, Module, Gruppenarbeit). */
export function OptionalBadge({ className, title }: { className?: string; title?: string }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", BADGE_COLORS.neutral, className)}
      title={title ?? "Kann bei Zeitmangel entfallen"}
    >
      Optional
    </span>
  );
}
