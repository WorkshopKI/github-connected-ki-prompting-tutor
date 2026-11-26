import type { MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { imTabOeffnen, istFolienSeite, type KursTab } from "@/lib/kursPosition";

interface TabLinkProps {
  to: string;
  /** In welchem der beiden Kurs-Tabs die Seite aufgehen soll. */
  tab: KursTab;
  className?: string;
  title?: string;
  children: ReactNode;
}

/**
 * Link zwischen App-Tab und Folien-Tab: Liegt das Ziel im anderen Tab, wird dieser geöffnet bzw. nach vorn
 * geholt, der eigene Tab bleibt stehen. Mit Strg/Cmd/Umschalt oder Mittelklick verhält er sich wie ein
 * normaler Link.
 */
export function TabLink({ to, tab, className, title, children }: TabLinkProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const eigenerTab: KursTab = istFolienSeite(pathname) ? "folien" : "app";

  const klick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (tab === eigenerTab) navigate(to);
    else imTabOeffnen(to, tab);
  };

  return (
    <a href={to} onClick={klick} className={className} title={title}>
      {children}
    </a>
  );
}
