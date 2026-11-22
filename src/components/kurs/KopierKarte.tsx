import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/** Karte mit Prompt-Text und Kopier-Button. */
export function KopierKarte({ titel, text, kopf, fuss }: { titel: string; text: string; kopf?: ReactNode; fuss?: ReactNode }) {
  const [kopiert, setKopiert] = useState(false);
  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      setKopiert(false);
    }
  };
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      {kopf && <div className="mb-1">{kopf}</div>}
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="font-semibold">{titel}</span>
        <button onClick={kopieren} className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-brand-ink hover:bg-accent" aria-label={`${titel} kopieren`}>
          {kopiert ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {kopiert ? "Kopiert" : "Kopieren"}
        </button>
      </div>
      <p className="flex-1 whitespace-pre-line rounded-md bg-muted p-3 font-mono text-sm leading-relaxed">{text}</p>
      {fuss && <div className="mt-2">{fuss}</div>}
    </div>
  );
}
