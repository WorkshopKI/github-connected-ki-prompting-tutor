import { Link } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { KURS_MODULE, DISZIPLIN_LABEL, type KursModul } from "@/data/kurs/lernpfad";
import { ArrowRight, ClipboardCheck, FileText, GraduationCap, PlayCircle } from "lucide-react";

const DISZIPLINEN = [
  { nr: 1, name: "Fragen", text: "Präzise fragen mit ACTA", tag: "Tag 1" },
  { nr: 2, name: "Gestalten", text: "Kontext dauerhaft einrichten", tag: "Tag 2" },
  { nr: 3, name: "Steuern", text: "Klares Ziel statt vieler Regeln", tag: "Tag 2" },
  { nr: 4, name: "Spezifizieren", text: "Aufgaben an Agenten abgeben", tag: "Tag 2" },
];

function ModulKarte({ m, nr }: { m: KursModul; nr: number }) {
  return (
    <Link
      to={`/kurs/${m.id}`}
      className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-card p-4 transition-shadow duration-100 hover:border-input hover:shadow-sm"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-input font-semibold tabular-nums">{nr}</span>
      <span className="min-w-0">
        <span className="block font-semibold">{m.titel}</span>
        <span className="block text-sm text-muted-foreground">
          {DISZIPLIN_LABEL[m.disziplin]} · {m.dauer}
          {m.erklaert?.length ? ` · ${m.erklaert.length} Animation${m.erklaert.length > 1 ? "en" : ""}` : ""}
        </span>
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
    </Link>
  );
}

export default function KursHome() {
  const tag1 = KURS_MODULE.filter((m) => m.tag === 1);
  const tag2 = KURS_MODULE.filter((m) => m.tag === 2);
  return (
    <KursLayout>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Zweitägiger Workshop"
          title="Mit KI arbeiten: vom Fragen zum Delegieren"
          description="Du lernst, wie Sprachmodelle funktionieren, wie du präzise fragst, die KI dauerhaft einrichtest, Aufgaben an Agenten abgibst und Ergebnisse prüfst."
          actions={
            <>
              <Link to="/erklaert/naechstes-wort" className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent">
                <PlayCircle className="h-4 w-4" strokeWidth={1.75} /> Erste Animation
              </Link>
              <Link to={`/kurs/${tag1[0].id}`} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep">
                Mit Tag 1 starten <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </>
          }
        />

        <section aria-labelledby="disz">
          <h2 id="disz" className="eyebrow mb-3">Der rote Faden: vier Disziplinen</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISZIPLINEN.map((d) => (
              <li key={d.nr} className="card-section">
                <div className="mb-1 text-xs text-muted-foreground">{d.tag}</div>
                <div className="text-lg font-semibold">{d.nr} · {d.name}</div>
                <div className="text-sm text-muted-foreground">{d.text}</div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="t1">
            <h2 id="t1" className="text-xl font-semibold">Tag 1 · Verstehen und Fragen</h2>
            <p className="mb-4 text-sm text-muted-foreground">Grundlagen, ACTA, Recherche, Grenzen, Bilder</p>
            <div className="grid gap-3">{tag1.map((m, i) => <ModulKarte key={m.id} m={m} nr={i + 1} />)}</div>
          </section>
          <section aria-labelledby="t2">
            <h2 id="t2" className="text-xl font-semibold">Tag 2 · Gestalten, Delegieren, Prüfen</h2>
            <p className="mb-4 text-sm text-muted-foreground">Kontext, Steuerung, Agenten, Projekte</p>
            <div className="grid gap-3">{tag2.map((m, i) => <ModulKarte key={m.id} m={m} nr={tag1.length + i + 1} />)}</div>
          </section>
        </div>

        <section aria-labelledby="mehr">
          <h2 id="mehr" className="eyebrow mb-3">Üben und wiederholen</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { to: "/kurs/uebungen", icon: GraduationCap, titel: "Übungen", text: "Zu jedem Modul, mit Musterlösung, ohne Anmeldung" },
              { to: "/kurs/check", icon: ClipboardCheck, titel: "Wissenscheck", text: "Sechs Fragen am Ende jedes Kurstags" },
              { to: "/kurs/spickzettel", icon: FileText, titel: "Spickzettel", text: "Das Wichtigste auf einer Seite zum Ausdrucken" },
            ].map((k) => (
              <Link key={k.to} to={k.to} className="rounded-lg border border-border bg-card p-4 transition-shadow hover:border-input hover:shadow-sm">
                <k.icon className="mb-2 h-5 w-5 text-brand-ink" strokeWidth={1.75} />
                <div className="font-semibold">{k.titel}</div>
                <div className="text-sm text-muted-foreground">{k.text}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </KursLayout>
  );
}
