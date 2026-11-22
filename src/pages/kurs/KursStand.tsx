import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { MODELL_KLASSEN, TOOLS, NEUIGKEITEN, STAND_DATUM } from "@/data/kurs/stand";
import { ExternalLink } from "lucide-react";

export default function KursStand() {
  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow={`Stand ${STAND_DATUM} · monatlich aktualisiert`}
        title="Aktuelle Modelle und Tools"
        description="Modellnamen ändern sich fast jeden Monat. Merk dir die drei Klassen, die Namen schlägst du hier nach."
      />

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Drei Modellklassen</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MODELL_KLASSEN.map((k) => (
            <div key={k.klasse} className="card-section">
              <div className="text-lg font-semibold">{k.klasse}</div>
              <p className="mb-3 text-sm text-muted-foreground">{k.wofuer}</p>
              <ul className="flex flex-wrap gap-1.5">
                {k.beispiele.map((b) => <li key={b} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Faustregel: mit „schnell“ beginnen und nur bei Bedarf eine Stufe höher gehen.</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">KI-Assistenten</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="group rounded-lg border border-border bg-card p-4 hover:border-input hover:shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{t.name}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-brand-ink" />
              </div>
              <div className="mb-2 text-xs text-muted-foreground">{t.anbieter}</div>
              <p className="text-sm">{t.kurz}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Was sich zuletzt geändert hat</h2>
        <ol className="grid gap-2">
          {NEUIGKEITEN.map((n) => (
            <li key={n.datum + n.text} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b border-border py-2 text-sm">
              <span className="tabular-nums text-muted-foreground">{n.datum}</span>
              <span>
                {n.text}{" "}
                <a href={n.quelle} target="_blank" rel="noreferrer" className="text-brand-ink underline-offset-2 hover:underline">Quelle</a>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </KursLayout>
  );
}
