import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Info, Lightbulb, ListChecks, Users } from "lucide-react";
import { PromptKompakt } from "@/components/kurs/PromptKompakt";
import { ROUTES } from "@/lib/constants";
import type { Gruppenaufgabe } from "@/data/kurs/gruppenarbeit";
import { inspirationFuer } from "@/data/kurs/gruppenInspiration";

function StartPrompt({ text }: { text: string }) {
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
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold">Startprompt</span>
        <button onClick={kopieren} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-brand-ink hover:bg-accent">
          {kopiert ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {kopiert ? "Kopiert" : "Prompt kopieren"}
        </button>
      </div>
      <p className="whitespace-pre-line rounded-md bg-muted p-3 font-mono text-sm leading-relaxed">{text}</p>
    </div>
  );
}

/** Prompt-Inspiration direkt unter der Übung, damit niemand in die Prompt-Vorlagen springen muss. */
function Inspiration({ id }: { id: string }) {
  const liste = inspirationFuer(id);
  if (!liste.length) return null;
  return (
    <section aria-labelledby={`insp-${id}`} className="border-t border-border pt-4">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`insp-${id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Lightbulb className="h-4 w-4 text-brand-ink" strokeWidth={1.75} /> Prompt-Inspiration
        </h3>
        <Link to={ROUTES.KURS_VORLAGEN} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
          Alle Prompt-Vorlagen <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((x) => (
          <PromptKompakt key={x.titel} titel={x.titel} text={x.text} hinweis={x.hinweis} kopf={x.herkunft} />
        ))}
      </div>
    </section>
  );
}

/** Inhalt einer Gruppenübung: Ablauf, Startprompt, Rollen, Prüfen, Padlet, dann Prompt-Inspiration. */
export function GruppenAufgabe({ g }: { g: Gruppenaufgabe }) {
  let t = 0;
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-5">
          <div>
            <div className="mb-2 text-sm font-semibold">Ablauf</div>
            <ol className="grid gap-2">
              {g.phasen.map((p, i) => {
                const start = t;
                t += p.min;
                return (
                  <li key={i} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 text-sm">
                    <span className="tabular-nums text-ink-subtle">{start}–{t} Min</span>
                    <span>{p.text}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          {g.startPrompt && <StartPrompt text={g.startPrompt} />}
          {g.varianten && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-muted p-3 text-sm"><div className="font-semibold">Leichter</div>{g.varianten.einsteiger}</div>
              <div className="rounded-md bg-muted p-3 text-sm"><div className="font-semibold">Schwerer</div>{g.varianten.fortgeschritten}</div>
            </div>
          )}
        </div>
        <div className="grid content-start gap-4">
          {g.rollen && (
            <div className="rounded-md border border-border p-3">
              <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold"><Users className="h-4 w-4" strokeWidth={1.75} /> Rollen</div>
              <ul className="grid gap-1 text-sm text-muted-foreground">{g.rollen.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
          <div className="rounded-md border border-border p-3">
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold"><ListChecks className="h-4 w-4" strokeWidth={1.75} /> Prüft gemeinsam</div>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">{g.pruefen.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="rounded-md bg-brand-soft p-3 text-sm text-brand-soft-ink">
            <div className="font-semibold">Ins Padlet</div>
            {g.padlet}
          </div>
          {g.tools && (
            <div className="flex flex-wrap gap-1.5">
              {g.tools.map((x) => <span key={x} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{x}</span>)}
            </div>
          )}
          {(g.hinweis || g.ersatz) && (
            <div className="grid gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
              {g.hinweis && <p className="flex gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} /> {g.hinweis}</p>}
              {g.ersatz && <p><span className="font-semibold text-foreground">Plan B:</span> {g.ersatz}</p>}
            </div>
          )}
        </div>
      </div>
      <Inspiration id={g.id} />
    </div>
  );
}
