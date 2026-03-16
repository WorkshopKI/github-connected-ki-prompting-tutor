import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquarePlus, X } from "lucide-react";
import { FeedbackPanel } from "./FeedbackPanel";
import { emitTrigger, dismissTrigger } from "@/lib/feedbackTriggers";
import type { FeedbackTrigger, FeedbackCategory } from "@/types";

const FADE_IN_DELAY = 30_000;
const BUBBLE_DURATION = 8_000;

// Globaler Timestamp für erstes Laden — überlebt Suspense-Remounts
let globalMountTime: number | null = null;

export default function FeedbackButton() {
  const [visible, setVisible] = useState(() => {
    if (globalMountTime && Date.now() - globalMountTime >= FADE_IN_DELAY) return true;
    if (!globalMountTime) globalMountTime = Date.now();
    return false;
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [bubble, setBubble] = useState<FeedbackTrigger | null>(null);
  const [preselectedCategory, setPreselectedCategory] = useState<FeedbackCategory | undefined>();
  const location = useLocation();

  // Sanftes Einblenden nach 30s (überlebt Suspense-Remounts)
  useEffect(() => {
    if (visible) return;
    const elapsed = globalMountTime ? Date.now() - globalMountTime : 0;
    const remaining = Math.max(0, FADE_IN_DELAY - elapsed);
    const timer = setTimeout(() => setVisible(true), remaining);
    return () => clearTimeout(timer);
  }, [visible]);

  // Sprechblase nach 8s ausblenden
  useEffect(() => {
    if (!bubble) return;
    const timer = setTimeout(() => setBubble(null), BUBBLE_DURATION);
    return () => clearTimeout(timer);
  }, [bubble]);

  // Custom-Event-Listener für Trigger
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const trigger = emitTrigger(detail?.event);
      if (trigger) {
        setTimeout(() => setBubble(trigger), trigger.delay);
      }
    };
    window.addEventListener("feedback-trigger", handler);
    return () => window.removeEventListener("feedback-trigger", handler);
  }, []);

  const handleFabClick = useCallback(() => {
    if (bubble?.category) {
      setPreselectedCategory(bubble.category);
    }
    setBubble(null);
    setPanelOpen(true);
  }, [bubble]);

  const handleDismissBubble = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setBubble(null);
    dismissTrigger();
  }, []);

  const handlePanelClose = useCallback(() => {
    setPanelOpen(false);
    setPreselectedCategory(undefined);
  }, []);

  const isPlayground = location.pathname === "/playground";

  return (
    <>
      {/* Floating Action Button */}
      <div
        className={`fixed right-6 z-50 transition-all duration-500 ${
          isPlayground ? "bottom-20" : "bottom-6"
        } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        {/* Sprechblase */}
        {bubble && (
          <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg border border-border bg-card p-3 shadow-lg">
            <button
              onClick={handleDismissBubble}
              className="absolute top-1 right-1 p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="pr-4 text-sm text-card-foreground">{bubble.message}</p>
            <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 h-2 w-2 border-b border-r border-border bg-card" />
          </div>
        )}

        <button
          onClick={handleFabClick}
          className={`
            group flex h-12 w-12 items-center justify-center rounded-full
            bg-primary text-primary-foreground
            shadow-[0_4px_12px_hsl(var(--primary)/0.3)]
            transition-all duration-200 ease-out
            hover:scale-110 hover:shadow-[0_6px_16px_hsl(var(--primary)/0.4)]
            active:scale-95
            ${bubble ? "animate-pulse" : ""}
          `}
        >
          <MessageSquarePlus className="h-5 w-5" />
        </button>
      </div>

      {/* Panel */}
      <FeedbackPanel
        open={panelOpen}
        onClose={handlePanelClose}
        preselectedCategory={preselectedCategory}
      />
    </>
  );
}
