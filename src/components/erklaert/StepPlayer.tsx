import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

/**
 * Gemeinsamer Rahmen für alle Erklär-Animationen.
 * - Schritte per Pfeiltasten, Leertaste, Bild auf/ab (Presenter-Fernbedienung) oder Buttons.
 * - Keine Live-KI: Animationen arbeiten mit vorbereiteten Daten, laufen also offline und ohne Kosten.
 */
export interface StepPlayerProps {
  /** Erklärtext je Schritt. Die Anzahl bestimmt die Schrittzahl. */
  captions: ReactNode[];
  /** Bühne: wird mit dem aktuellen Schritt gerendert. */
  children: (step: number) => ReactNode;
  /** Optionale Bedienelemente unter der Erklärung (Regler, Schalter). */
  controls?: (step: number) => ReactNode;
  onStepChange?: (step: number) => void;
}

export function StepPlayer({ captions, children, controls, onStepChange }: StepPlayerProps) {
  const total = captions.length;
  const [step, setStep] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setStep((s) => {
        const n = Math.min(total - 1, Math.max(0, s + delta));
        if (n !== s) onStepChange?.(n);
        return n;
      });
    },
    [total, onStepChange],
  );

  const reset = () => {
    setStep(0);
    onStepChange?.(0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-1.5" aria-label={`Schritt ${step + 1} von ${total}`}>
        {captions.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-primary/60" : "w-2 bg-border"
            }`}
          />
        ))}
        <span className="ml-3 text-xs text-muted-foreground tabular-nums">
          {step + 1} / {total}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0">{children(step)}</div>
        <aside className="rounded-lg border border-border bg-card p-5" aria-live="polite">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Was gerade passiert</h2>
          <div className="text-base leading-relaxed [&_p]:mb-3 [&_strong]:text-foreground">{captions[step]}</div>
          {controls && <div className="mt-5 grid gap-4 border-t border-border pt-4">{controls(step)}</div>}
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} disabled={step === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Zurück
        </Button>
        <Button onClick={() => go(1)} disabled={step === total - 1}>
          Weiter <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw className="mr-1 h-4 w-4" /> Neu starten
        </Button>
        <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
          Steuerung: Pfeiltasten, Leertaste oder Presenter
        </span>
      </div>
    </div>
  );
}

/** Wiederverwendbarer Balken für Wahrscheinlichkeiten. */
export function ProbBar({ label, value, max, highlight, muted }: { label: string; value: number; max: number; highlight?: boolean; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)_3.5rem] items-center gap-3">
      <span className={`truncate text-right font-mono text-sm ${muted ? "text-muted-foreground" : ""} ${highlight ? "font-semibold" : ""}`}>{label}</span>
      <div className="h-7 overflow-hidden rounded-md bg-muted">
        <div
          className={`h-full rounded-md transition-all duration-700 ease-out motion-reduce:transition-none ${
            highlight ? "bg-primary" : muted ? "bg-muted-foreground/30" : "bg-foreground/70"
          }`}
          style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
        />
      </div>
      <span className={`text-sm tabular-nums ${highlight ? "font-semibold" : "text-muted-foreground"}`}>{Math.round(value)} %</span>
    </div>
  );
}
