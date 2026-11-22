import { useState } from "react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { WISSENSCHECK } from "@/data/kurs/wissenscheck";
import { LS_KEYS } from "@/lib/constants";
import { loadFromStorage, saveToStorage } from "@/lib/storage";
import { Check, X } from "lucide-react";

type Bestwerte = Record<string, number>;

function Check1Tag({ tag }: { tag: 1 | 2 }) {
  const fragen = WISSENSCHECK[tag];
  const [wahl, setWahl] = useState<(number | null)[]>(fragen.map(() => null));
  const [fertig, setFertig] = useState(false);
  const [best, setBest] = useState<Bestwerte>(() => loadFromStorage<Bestwerte>(LS_KEYS.KURS_CHECK, {}));
  const punkte = fragen.filter((f, i) => wahl[i] === f.richtig).length;

  const auswerten = () => {
    setFertig(true);
    const neu = { ...best, [`tag${tag}`]: Math.max(best[`tag${tag}`] ?? 0, punkte) };
    setBest(neu);
    saveToStorage(LS_KEYS.KURS_CHECK, neu);
  };

  return (
    <section className="mb-10" aria-labelledby={`t${tag}`}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`t${tag}`} className="text-xl font-semibold">Tag {tag}</h2>
        {best[`tag${tag}`] !== undefined && <span className="text-sm text-muted-foreground">Bisher bestes Ergebnis: {best[`tag${tag}`]} von {fragen.length}</span>}
      </div>
      <ol className="grid gap-3">
        {fragen.map((f, i) => (
          <li key={f.frage} className="card-section">
            <fieldset>
              <legend className="mb-3 font-semibold">{i + 1}. {f.frage}</legend>
              <div className="grid gap-2">
                {f.antworten.map((a, j) => {
                  const gewaehlt = wahl[i] === j;
                  const stil = !fertig
                    ? gewaehlt ? "border-input bg-brand-soft" : "border-border bg-card hover:bg-accent"
                    : j === f.richtig ? "border-border bg-success-soft" : gewaehlt ? "border-border bg-danger-soft" : "border-border bg-card opacity-70";
                  return (
                    <label key={a} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${stil}`}>
                      <input type="radio" name={`t${tag}f${i}`} className="h-4 w-4 accent-[hsl(var(--primary))]" disabled={fertig} checked={gewaehlt} onChange={() => setWahl((w) => w.map((x, k) => (k === i ? j : x)))} />
                      <span className="flex-1">{a}</span>
                      {fertig && j === f.richtig && <Check className="h-4 w-4 text-success" aria-label="richtig" />}
                      {fertig && gewaehlt && j !== f.richtig && <X className="h-4 w-4 text-danger" aria-label="falsch" />}
                    </label>
                  );
                })}
              </div>
              {fertig && <p className="mt-3 text-sm text-muted-foreground">{f.erklaerung}</p>}
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!fertig ? (
          <button onClick={auswerten} disabled={wahl.some((w) => w === null)} className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-50">
            Auswerten
          </button>
        ) : (
          <>
            <span className="font-semibold">{punkte} von {fragen.length} richtig.</span>
            <button onClick={() => { setFertig(false); setWahl(fragen.map(() => null)); }} className="text-sm font-semibold text-brand-ink hover:underline">Noch einmal</button>
          </>
        )}
        {!fertig && wahl.some((w) => w === null) && <span className="text-sm text-muted-foreground">Beantworte alle Fragen, dann auswerten.</span>}
      </div>
    </section>
  );
}

export default function KursCheck() {
  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow="Wissenscheck"
        title="Was ist hängen geblieben?"
        description="Sechs Fragen pro Kurstag. Dein Ergebnis bleibt nur in deinem Browser."
      />
      <Check1Tag tag={1} />
      <Check1Tag tag={2} />
    </KursLayout>
  );
}
