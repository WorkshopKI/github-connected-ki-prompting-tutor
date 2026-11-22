import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { KopierKarte } from "@/components/kurs/KopierKarte";
import { STUFEN, VORLAGEN, CHECKLISTE, FEHLER, type Stufe } from "@/data/kurs/vorlagen";
import { ArrowRight, Globe, Search, Telescope } from "lucide-react";

export default function KursVorlagen() {
  const [params, setParams] = useSearchParams();
  const stufe = (params.get("stufe") as Stufe | null) ?? null;
  const [suche, setSuche] = useState("");

  const liste = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return VORLAGEN.filter((v) => (!stufe || v.stufe === stufe) && (!q || `${v.titel} ${v.kategorie} ${v.text}`.toLowerCase().includes(q)));
  }, [stufe, suche]);

  const waehle = (s: Stufe | null) => {
    if (s) setParams({ stufe: s }, { replace: true });
    else setParams({}, { replace: true });
  };

  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow="Vorlagen"
        title="Beispiel-Prompts in drei Stufen"
        description="Vom Alltagshelfer über den Juniorassistenten bis zum Forschungsassistenten. Kopier eine Vorlage, pass sie an deine Lage an und ergänze, was fehlt."
        actions={
          <Link to="/kurs/profi" className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent">
            Profi-Techniken <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {STUFEN.map((s) => (
          <button
            key={s.id}
            onClick={() => waehle(stufe === s.id ? null : s.id)}
            aria-pressed={stufe === s.id}
            className={`rounded-lg border p-4 text-left transition-shadow ${stufe === s.id ? "border-input bg-brand-soft" : "border-border bg-card hover:border-input hover:shadow-sm"}`}
          >
            <div className="eyebrow mb-1">{s.untertitel}</div>
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm text-muted-foreground">{s.text}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <section aria-label="Vorlagen">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="relative min-w-[14rem] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" strokeWidth={1.75} />
              <input
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder="Suchen, z. B. Reise, E-Mail, Tabelle"
                className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm"
                aria-label="Vorlagen durchsuchen"
              />
            </label>
            <span className="text-sm text-muted-foreground tabular-nums">{liste.length} Vorlagen</span>
            {stufe && (
              <button onClick={() => waehle(null)} className="text-sm font-semibold text-brand-ink hover:underline">
                Alle Stufen zeigen
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {liste.map((v) => (
              <KopierKarte
                key={v.titel}
                titel={v.titel}
                text={v.text}
                kopf={
                  <span className="flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle">
                    {v.kategorie}
                    {v.websuche && <span className="inline-flex items-center gap-1 rounded-full bg-info-soft px-2 py-0.5 text-info"><Globe className="h-3 w-3" strokeWidth={1.75} /> Websuche</span>}
                    {v.deepResearch && <span className="inline-flex items-center gap-1 rounded-full bg-info-soft px-2 py-0.5 text-info"><Telescope className="h-3 w-3" strokeWidth={1.75} /> Deep Research</span>}
                  </span>
                }
              />
            ))}
          </div>
          {liste.length === 0 && <p className="text-sm text-muted-foreground">Keine Vorlage gefunden. Versuch einen anderen Suchbegriff.</p>}
        </section>

        <aside className="grid content-start gap-4">
          <div className="card-section">
            <h2 className="eyebrow mb-3">Checkliste</h2>
            <ul className="grid gap-2 text-sm">
              {CHECKLISTE.map((c) => (
                <li key={c.punkt}><span className="font-semibold">{c.punkt}:</span> <span className="text-muted-foreground">{c.text}</span></li>
              ))}
            </ul>
          </div>
          <div className="card-section">
            <h2 className="eyebrow mb-3">Häufige Fehler</h2>
            <ul className="grid gap-2 text-sm">
              {FEHLER.map((c) => (
                <li key={c.punkt}><span className="font-semibold">{c.punkt}:</span> <span className="text-muted-foreground">{c.text}</span></li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Mit KI-Feedback üben: <Link to="/onboarding" className="font-semibold text-brand-ink hover:underline">Übungen starten</Link>
          </p>
        </aside>
      </div>
    </KursLayout>
  );
}
