import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptKompaktProps {
  titel: string;
  text: string;
  /** Kleine Zeile über dem Titel (Kategorie, Stufe, Badges). */
  kopf?: ReactNode;
  hinweis?: string;
}

/**
 * Kompakte Prompt-Karte: Titel, Kopieren, Prompt auf drei Zeilen gekürzt (Klick zeigt ihn ganz).
 * Für Listen, in denen viele Prompts ohne Scrollen sichtbar sein sollen (Prompt-Vorlagen, Inspiration
 * in der Gruppenarbeit). Kopiert wird immer der ganze Prompt.
 */
export function PromptKompakt({ titel, text, kopf, hinweis }: PromptKompaktProps) {
  const [kopiert, setKopiert] = useState(false);
  const [offen, setOffen] = useState(false);
  const [gekuerzt, setGekuerzt] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Nur wenn der Prompt wirklich länger als drei Zeilen ist, gibt es „mehr“.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || offen) return;
    const messen = () => setGekuerzt(el.scrollHeight > el.clientHeight + 1);
    messen();
    window.addEventListener("resize", messen);
    return () => window.removeEventListener("resize", messen);
  }, [text, offen]);

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      setKopiert(false);
    }
  };

  const aufklappbar = gekuerzt || offen;

  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {kopf && <div className="mb-0.5 text-xs text-ink-subtle">{kopf}</div>}
          <h3 className="text-sm font-semibold leading-snug">{titel}</h3>
        </div>
        <button
          onClick={kopieren}
          className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-brand-ink hover:bg-accent"
          aria-label={`${titel} kopieren`}
        >
          {kopiert ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {kopiert ? "Kopiert" : "Kopieren"}
        </button>
      </div>
      <div className="flex-1 rounded-md bg-muted px-2.5 py-2">
        <div className="relative">
        <p
          ref={textRef}
          onClick={() => aufklappbar && setOffen((x) => !x)}
          className={cn("whitespace-pre-line font-mono text-[13px] leading-snug", !offen && "line-clamp-3", aufklappbar && "cursor-pointer")}
        >
          {text}
        </p>
        {aufklappbar && (
          <button
            onClick={() => setOffen((x) => !x)}
            aria-expanded={offen}
            aria-label={offen ? `${titel}: weniger zeigen` : `${titel}: ganzen Prompt zeigen`}
            className={cn(
              "inline-flex items-center gap-0.5 rounded px-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground",
              offen ? "mt-1" : "absolute bottom-0 right-0 bg-gradient-to-l from-muted from-60% to-transparent pl-6",
            )}
          >
            {offen ? "weniger" : "mehr"}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", offen && "rotate-180")} />
          </button>
        )}
        </div>
      </div>
      {hinweis && <p className="mt-1.5 text-xs text-muted-foreground">{hinweis}</p>}
    </article>
  );
}
