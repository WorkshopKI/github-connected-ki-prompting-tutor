import { cn } from "@/lib/utils";
import { BLOECKE, STATIONEN, TYP_LABEL, type Station } from "@/data/kurs/fahrplan";

interface KursAblaufProps {
  /** Station, die gerade läuft (live) oder angesehen wird. */
  aktiv?: string;
  /** Erledigt = alle Stationen vor dieser. */
  live?: string;
  onWahl: (s: Station) => void;
}

/** Ablauf beider Tage: Blöcke mit ihren Stationen und Folien. */
export function KursAblauf({ aktiv, live, onWahl }: KursAblaufProps) {
  const liveIdx = live ? STATIONEN.findIndex((s) => s.id === live) : -1;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2].map((tag) => (
        <section key={tag} aria-labelledby={`ablauf-t${tag}`}>
          <h2 id={`ablauf-t${tag}`} className="mb-2 text-lg font-semibold">
            Tag {tag}
          </h2>
          <ol className="grid gap-3">
            {BLOECKE.filter((b) => b.tag === tag).map((b) => (
              <li key={b.id} className="rounded-lg border border-border bg-card p-3">
                <div className="mb-1 text-sm font-semibold">
                  <span className="text-ink-subtle">Block {b.nr} · </span>
                  {b.titel}
                </div>
                <ul className="grid gap-0.5">
                  {STATIONEN.filter((s) => s.block === b.id).map((s) => {
                    const idx = STATIONEN.indexOf(s);
                    const istLive = s.id === live;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => onWahl(s)}
                          aria-current={s.id === aktiv ? "step" : undefined}
                          className={cn(
                            "flex w-full items-baseline gap-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent",
                            s.id === aktiv && "bg-brand-soft text-brand-soft-ink",
                            liveIdx > idx && "text-muted-foreground",
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            {s.titel}
                            {istLive && <span className="ml-2 text-xs font-semibold text-brand-ink">● jetzt</span>}
                          </span>
                          <span className="shrink-0 text-xs text-ink-subtle">
                            {TYP_LABEL[s.typ]} · Folie {s.folien[0]}
                            {s.folien[1] !== s.folien[0] ? `–${s.folien[1]}` : ""}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
