import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { PromptKompakt } from "@/components/kurs/PromptKompakt";
import { STUFEN, VORLAGEN, CHECKLISTE, FEHLER, type Stufe } from "@/data/kurs/vorlagen";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, Globe, ListChecks, Search, Telescope } from "lucide-react";

const STUFE_NR: Record<Stufe, number> = { alltag: 1, beruf: 2, forschung: 3 };

export default function KursVorlagen() {
  const [params, setParams] = useSearchParams();
  const stufe = (params.get("stufe") as Stufe | null) ?? null;
  const [suche, setSuche] = useState("");

  const treffer = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return VORLAGEN.filter((v) => !q || `${v.titel} ${v.kategorie} ${v.text}`.toLowerCase().includes(q));
  }, [suche]);
  const liste = stufe ? treffer.filter((v) => v.stufe === stufe) : treffer;
  const aktiv = STUFEN.find((s) => s.id === stufe);

  const waehle = (s: Stufe | null) => {
    if (s) setParams({ stufe: s }, { replace: true });
    else setParams({}, { replace: true });
  };

  const filterKnopf = (an: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
      an ? "bg-brand-soft text-brand-soft-ink" : "text-muted-foreground hover:bg-accent hover:text-foreground",
    );

  return (
    <KursLayout>
      <PageHeader
        className="mb-4 gap-4 pb-4"
        eyebrow="Prompt-Vorlagen"
        title="Prompt-Vorlagen in drei Stufen"
        description="Kopieren, {Platzhalter} durch deine Lage ersetzen, ergänzen, was fehlt. Bei Aktuellem sucht die KI selbst."
        actions={
          <Link to="/kurs/profi" className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent">
            Profi-Techniken <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        }
      />

      {/* Filter in einer Zeile: Stufen · Suche · Checkliste */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Stufe wählen" className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          <button onClick={() => waehle(null)} aria-pressed={!stufe} className={filterKnopf(!stufe)}>
            Alle <span className="tabular-nums text-xs font-normal">{treffer.length}</span>
          </button>
          {STUFEN.map((s) => (
            <button key={s.id} onClick={() => waehle(s.id)} aria-pressed={stufe === s.id} title={s.text} className={filterKnopf(stufe === s.id)}>
              {STUFE_NR[s.id]} · {s.name}
              <span className="tabular-nums text-xs font-normal">{treffer.filter((v) => v.stufe === s.id).length}</span>
            </button>
          ))}
        </div>
        <label className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" strokeWidth={1.75} />
          <input
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Suchen, z. B. Reise, E-Mail, Tabelle"
            className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm"
            aria-label="Prompt-Vorlagen durchsuchen"
          />
        </label>
        <details className="group text-sm [&[open]]:w-full">
          <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-md border border-input bg-card px-3 font-semibold hover:bg-accent [&::-webkit-details-marker]:hidden">
            <ListChecks className="h-4 w-4 text-brand-ink" strokeWidth={1.75} /> Checkliste
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-2 grid gap-4 rounded-lg border border-border bg-card p-3 md:grid-cols-2">
            <h2 className="eyebrow md:col-span-2 -mb-2">Checkliste und häufige Fehler</h2>
            <ul className="grid content-start gap-1.5">
              {CHECKLISTE.map((c) => (
                <li key={c.punkt}><span className="font-semibold">{c.punkt}:</span> <span className="text-muted-foreground">{c.text}</span></li>
              ))}
            </ul>
            <ul className="grid content-start gap-1.5">
              {FEHLER.map((c) => (
                <li key={c.punkt}><span className="font-semibold">{c.punkt}:</span> <span className="text-muted-foreground">{c.text}</span></li>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {aktiv && (
        <p className="mb-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Stufe {STUFE_NR[aktiv.id]} · {aktiv.name}:</span> {aktiv.text}
        </p>
      )}

      <section aria-label="Prompt-Vorlagen" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {liste.map((v) => (
          <PromptKompakt
            key={v.titel}
            titel={v.titel}
            text={v.text}
            hinweis={v.hinweis}
            kopf={
              <span className="flex flex-wrap items-center gap-1.5">
                {!stufe && <span>Stufe {STUFE_NR[v.stufe]} ·</span>}
                {v.kategorie}
                {v.aktuell && <span title="Braucht aktuelle Daten: Die KI sucht selbst im Web. Prüf, ob Quellen-Links erscheinen." className="inline-flex items-center gap-1 rounded-full bg-info-soft px-1.5 py-px text-info"><Globe className="h-3 w-3" strokeWidth={1.75} /> Aktuell</span>}
                {v.deepResearch && <span title="Deep Research im Chat auswählen (Modus oder Werkzeug-Menü)" className="inline-flex items-center gap-1 rounded-full bg-info-soft px-1.5 py-px text-info"><Telescope className="h-3 w-3" strokeWidth={1.75} /> Deep Research</span>}
              </span>
            }
          />
        ))}
      </section>
      {liste.length === 0 && <p className="text-sm text-muted-foreground">Keine Vorlage gefunden. Versuch einen anderen Suchbegriff.</p>}

      <p className="mt-6 text-sm text-muted-foreground">
        Selbst üben, mit Musterlösung: <Link to="/kurs/uebungen" className="font-semibold text-brand-ink hover:underline">Übungen zu jedem Modul</Link>
      </p>
    </KursLayout>
  );
}
