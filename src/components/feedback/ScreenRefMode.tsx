import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScreenRef {
  ref: string;
  label: string;
}

interface Props {
  onSelect: (ref: ScreenRef) => void;
  onCancel: () => void;
}

export function ScreenRefMode({ onSelect, onCancel }: Props) {
  const [hoveredRef, setHoveredRef] = useState<string | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-feedback-ref]");
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        onSelect({
          ref: el.getAttribute("data-feedback-ref") ?? "",
          label: el.getAttribute("data-feedback-label") ?? "",
        });
      }
    },
    [onSelect]
  );

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest("[data-feedback-ref]");
    if (el) {
      const ref = el.getAttribute("data-feedback-ref");
      setHoveredRef(ref);
      el.classList.add("feedback-ref-highlight");
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const el = (e.target as HTMLElement).closest("[data-feedback-ref]");
    if (el) {
      setHoveredRef(null);
      el.classList.remove("feedback-ref-highlight");
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    // Alle referierbaren Elemente markieren
    const elements = document.querySelectorAll("[data-feedback-ref]");
    elements.forEach((el) => el.classList.add("feedback-ref-mode"));

    document.addEventListener("click", handleClick, true);
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      elements.forEach((el) => {
        el.classList.remove("feedback-ref-mode");
        el.classList.remove("feedback-ref-highlight");
      });
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick, handleMouseOver, handleMouseOut, handleKeyDown]);

  // Portal zu document.body — damit der Referenz-Modus außerhalb
  // des Sheet-Portals (Radix Dialog) gerendert wird und Klicks
  // auf die Seiten-Elemente ankommen.
  return createPortal(
    <div className="feedback-ref-overlay">
      {/* Toolbar oben */}
      <div className="fixed top-0 inset-x-0 z-[10000] flex items-center justify-between bg-card border-b border-border px-4 py-2 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Referenz-Modus aktiv</span>
          <span className="text-xs text-muted-foreground">
            — Klicke auf den betroffenen Bereich
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hoveredRef && (
            <code className="rounded bg-muted px-2 py-0.5 text-xs">{hoveredRef}</code>
          )}
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="mr-1 h-3 w-3" />
            Abbrechen
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
