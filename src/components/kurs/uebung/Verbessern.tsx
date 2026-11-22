import { useState } from "react";
import { Check, ClipboardCopy, Eye } from "lucide-react";
import { pruefPrompt, type VerbessernUebung } from "@/data/kurs/uebungen";

/** Schwachen Prompt verbessern: Selbstcheck, Musterlösung, Prüfprompt für jeden Chatbot. */
export function Verbessern({ u, onErledigt }: { u: VerbessernUebung; onErledigt: () => void }) {
  const [text, setText] = useState("");
  const [haken, setHaken] = useState<boolean[]>(u.kriterien.map(() => false));
  const [zeigen, setZeigen] = useState(false);
  const [kopiert, setKopiert] = useState(false);

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(pruefPrompt(u, text));
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1800);
    } catch {
      setKopiert(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-md bg-muted p-3">
        <div className="mb-1 text-xs font-semibold text-muted-foreground">Schwacher Prompt</div>
        <p className="font-mono text-sm">{u.schwach}</p>
      </div>
      <label className="grid gap-1.5">
        <span className="text-sm font-semibold">{u.aufgabe}</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-input bg-card p-3 font-mono text-sm leading-relaxed"
          placeholder="Dein verbesserter Prompt"
        />
      </label>
      <fieldset className="grid gap-1.5">
        <legend className="mb-1 text-sm font-semibold">Selbstcheck</legend>
        {u.kriterien.map((k, i) => (
          <label key={k} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
              checked={haken[i]}
              onChange={() => setHaken((h) => h.map((x, j) => (j === i ? !x : x)))}
            />
            <span>{k}</span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setZeigen(true);
            onErledigt();
          }}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
        >
          <Eye className="h-4 w-4" strokeWidth={1.75} /> Musterlösung zeigen
        </button>
        <button onClick={kopieren} className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent">
          {kopiert ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" strokeWidth={1.75} />}
          {kopiert ? "Kopiert, jetzt im Chatbot einfügen" : "Von einer KI prüfen lassen"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">„Von einer KI prüfen lassen“ kopiert deinen Prompt mit den Kriterien. Füge ihn in ChatGPT, Claude, Gemini oder Mistral ein. Klappt auch, wenn die Lern-App offline ist.</p>
      {zeigen && (
        <div className="rounded-md border border-border bg-brand-soft p-4">
          <div className="eyebrow mb-2">Musterlösung</div>
          <p className="mb-3 whitespace-pre-line font-mono text-sm leading-relaxed text-brand-soft-ink">{u.muster}</p>
          <p className="text-sm text-brand-soft-ink"><span className="font-semibold">Warum das wirkt:</span> {u.warum}</p>
        </div>
      )}
    </div>
  );
}
