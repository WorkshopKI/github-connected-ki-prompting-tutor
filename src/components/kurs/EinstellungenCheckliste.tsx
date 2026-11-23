import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LS_KEYS } from "@/lib/constants";
import { loadArrayFromStorage, saveToStorage } from "@/lib/storage";
import type { Einstellung } from "@/data/kurs/lernpfad";

/**
 * Checkliste „Konto einrichten“: je Punkt Begründung, Klickpfad für Claude und ChatGPT,
 * Empfehlung. Abhaken wird im Browser gemerkt (ohne Anmeldung).
 */
export function EinstellungenCheckliste({ punkte }: { punkte: Einstellung[] }) {
  const [erledigt, setErledigt] = useState<string[]>(() => loadArrayFromStorage<string>(LS_KEYS.KURS_KONTO));
  const umschalten = (id: string) => {
    const neu = erledigt.includes(id) ? erledigt.filter((x) => x !== id) : [...erledigt, id];
    setErledigt(neu);
    saveToStorage(LS_KEYS.KURS_KONTO, neu);
  };

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">
        {erledigt.length} von {punkte.length} erledigt. Bezeichnungen Stand November 2026, sie können je nach App-Version leicht abweichen.
      </p>
      {punkte.map((p) => {
        const ok = erledigt.includes(p.id);
        return (
          <div key={p.id} className={cn("rounded-lg border border-border bg-card p-4", ok && "bg-success-soft")}>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={ok} onChange={() => umschalten(p.id)} className="sr-only" />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                  ok ? "border-success bg-success text-primary-foreground" : "border-input bg-card",
                )}
              >
                {ok && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{p.thema}</span>
                <span className="block text-sm text-muted-foreground">{p.warum}</span>
              </span>
            </label>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-md bg-muted p-2.5">
                <dt className="eyebrow mb-0.5">Claude</dt>
                <dd>{p.claude}</dd>
              </div>
              <div className="rounded-md bg-muted p-2.5">
                <dt className="eyebrow mb-0.5">ChatGPT</dt>
                <dd>{p.chatgpt}</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm">
              <span className="font-semibold">Empfehlung:</span> {p.empfehlung}
            </p>
          </div>
        );
      })}
    </div>
  );
}
