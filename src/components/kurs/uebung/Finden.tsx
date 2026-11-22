import { useState } from "react";
import { Check, X } from "lucide-react";
import type { FindenUebung } from "@/data/kurs/uebungen";

/** Ankreuzen und auflösen: Aussagen prüfen, Fehler finden, Risiken erkennen. */
export function Finden({ u, onErledigt }: { u: FindenUebung; onErledigt: () => void }) {
  const [wahl, setWahl] = useState<boolean[]>(u.aussagen.map(() => false));
  const [aufgeloest, setAufgeloest] = useState(false);
  const treffer = u.aussagen.filter((a, i) => a.richtig === wahl[i]).length;

  return (
    <div className="grid gap-4">
      {u.material && <p className="whitespace-pre-line rounded-md bg-muted p-3 text-sm leading-relaxed">{u.material}</p>}
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-semibold">{u.frage}</legend>
        {u.aussagen.map((a, i) => {
          const ok = a.richtig === wahl[i];
          return (
            <div key={a.text} className={`rounded-md border p-3 ${aufgeloest ? (ok ? "border-border bg-success-soft" : "border-border bg-danger-soft") : "border-border bg-card"}`}>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  disabled={aufgeloest}
                  className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
                  checked={wahl[i]}
                  onChange={() => setWahl((w) => w.map((x, j) => (j === i ? !x : x)))}
                />
                <span className="flex-1">{a.text}</span>
                {aufgeloest && (ok ? <Check className="h-4 w-4 shrink-0 text-success" aria-label="richtig" /> : <X className="h-4 w-4 shrink-0 text-danger" aria-label="falsch" />)}
              </label>
              {aufgeloest && <p className="ml-6 mt-1 text-sm text-muted-foreground">{a.erklaerung}</p>}
            </div>
          );
        })}
      </fieldset>
      {!aufgeloest ? (
        <button
          onClick={() => {
            setAufgeloest(true);
            onErledigt();
          }}
          className="inline-flex h-9 w-fit items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
        >
          Auflösen
        </button>
      ) : (
        <p className="text-sm font-semibold">
          {treffer} von {u.aussagen.length} richtig eingeschätzt.{" "}
          <button className="font-semibold text-brand-ink hover:underline" onClick={() => { setAufgeloest(false); setWahl(u.aussagen.map(() => false)); }}>
            Noch einmal
          </button>
        </p>
      )}
    </div>
  );
}
