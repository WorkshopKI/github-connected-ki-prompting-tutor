import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Seitentitel (Stil title-1, Serif). Genau einer pro Seite. */
  title: ReactNode;
  /** Ein Satz Einordnung in ink-muted. */
  description?: ReactNode;
  /** Kontext über dem Titel, z. B. Abteilung (Stil overline). */
  eyebrow?: ReactNode;
  /** Höchstens eine primäre und eine sekundäre Aktion. */
  actions?: ReactNode;
  className?: string;
}

/** Design-System „KI-Werkstatt“ · PageHeader — ersetzt handgebaute h1 mit .page-title. */
export const PageHeader = ({ title, description, eyebrow, actions, className }: PageHeaderProps) => (
  <header className={cn("flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6", className)}>
    <div className="min-w-0 max-w-[680px]">
      {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {description && <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
  </header>
);
