import { Link } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { TabLink } from "@/components/kurs/TabLink";
import { KURS_MODULE, DISZIPLIN_LABEL, type KursModul } from "@/data/kurs/lernpfad";
import { stationById, stationKurztitel } from "@/data/kurs/fahrplan";
import { useZuletzt } from "@/lib/kursPosition";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, ClipboardCheck, FileText, GraduationCap, MonitorPlay } from "lucide-react";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";

const DISZIPLINEN = [
  { nr: 1, name: "Fragen", text: "präzise mit ACTA" },
  { nr: 2, name: "Gestalten", text: "Kontext einrichten" },
  { nr: 3, name: "Steuern", text: "Ziel statt Regeln" },
  { nr: 4, name: "Spezifizieren", text: "an Agenten abgeben" },
];

const TAGE = [
  { tag: 1 as const, titel: "Verstehen und Fragen", text: "Konto, Grundlagen, ACTA, Recherche, Grenzen, Bilder" },
  { tag: 2 as const, titel: "Gestalten, Delegieren, Prüfen", text: "Kontext, Artefakte, Steuerung, Agenten, Projekte" },
];

/** Eine Zeile je Modul, damit beide Kurstage ohne Scrollen auf den Bildschirm passen. */
function ModulZeile({ m, nr, zuletzt }: { m: KursModul; nr: number; zuletzt: boolean }) {
  return (
    <li>
      <Link
        to={`/kurs/${m.id}`}
        aria-current={zuletzt ? "step" : undefined}
        className={cn(
          "group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 transition-colors duration-100 hover:bg-accent",
          zuletzt && "bg-brand-soft hover:bg-brand-soft",
        )}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-input text-sm font-semibold tabular-nums">{nr}</span>
        <span className="flex min-w-0 flex-wrap items-center gap-x-2">
          <span className="font-semibold leading-snug">{m.titel}</span>
          {m.optional && <OptionalBadge title={m.optional} />}
          {zuletzt && <span className="text-xs font-semibold text-brand-soft-ink">zuletzt hier</span>}
        </span>
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs text-ink-subtle" title={`Disziplin: ${DISZIPLIN_LABEL[m.disziplin]}`}>
          {m.dauer}
          <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </span>
      </Link>
    </li>
  );
}

export default function KursHome() {
  const zuletzt = stationById(useZuletzt()?.station);
  const zuletztModul = zuletzt?.pfad.match(/^\/kurs\/([^/#?]+)$/)?.[1];
  const tag1 = KURS_MODULE.filter((m) => m.tag === 1);
  const weiter = zuletzt ? { to: zuletzt.pfad, label: `Weiter: ${stationKurztitel(zuletzt)}` } : { to: `/kurs/${tag1[0].id}`, label: "Mit Tag 1 starten" };

  return (
    <KursLayout>
      <div className="space-y-5">
        <PageHeader
          className="gap-4 pb-4"
          eyebrow="Zweitägiger Workshop"
          title="Mit KI arbeiten: vom Fragen zum Delegieren"
          description="Wie Sprachmodelle funktionieren, präzise fragen, die KI dauerhaft einrichten, Aufgaben an Agenten abgeben und Ergebnisse prüfen."
          actions={
            <>
              <TabLink
                to={ROUTES.KURS_FOLIEN}
                tab="folien"
                title="Öffnet die Folien in einem zweiten Tab; diese Seite bleibt offen"
                className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
              >
                <MonitorPlay className="h-4 w-4" strokeWidth={1.75} /> Folien im zweiten Tab
              </TabLink>
              <Link to={weiter.to} className="inline-flex h-9 max-w-[20rem] items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep">
                <span className="truncate-safe">{weiter.label}</span> <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              </Link>
            </>
          }
        />

        <section aria-labelledby="disz" className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <h2 id="disz" className="eyebrow">Der rote Faden</h2>
          <ol className="contents">
            {DISZIPLINEN.map((d, i) => (
              <li key={d.nr} className="inline-flex items-baseline gap-1.5">
                {i > 0 && <span className="text-ink-subtle" aria-hidden="true">→</span>}
                <span className="font-semibold">{d.nr} · {d.name}</span>
                <span className="text-muted-foreground">{d.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          {TAGE.map((t) => {
            const module = KURS_MODULE.filter((m) => m.tag === t.tag);
            const start = t.tag === 1 ? 0 : tag1.length;
            return (
              <section key={t.tag} aria-labelledby={`t${t.tag}`} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="flex items-baseline gap-x-2 border-b border-border px-3 py-2">
                  <h2 id={`t${t.tag}`} className="shrink-0 font-semibold">Tag {t.tag} · {t.titel}</h2>
                  <p className="truncate-safe text-xs text-muted-foreground" title={t.text}>{t.text}</p>
                </div>
                <ol className="divide-y divide-border">
                  {module.map((m, i) => (
                    <ModulZeile key={m.id} m={m} nr={start + i + 1} zuletzt={m.id === zuletztModul} />
                  ))}
                </ol>
              </section>
            );
          })}
        </div>

        <section aria-labelledby="mehr" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <h2 id="mehr" className="eyebrow">Üben und wiederholen</h2>
          {[
            { to: "/kurs/uebungen", icon: GraduationCap, titel: "Übungen", text: "zu jedem Modul, mit Musterlösung" },
            { to: "/kurs/check", icon: ClipboardCheck, titel: "Wissenscheck", text: "sechs Fragen je Kurstag" },
            { to: "/kurs/spickzettel", icon: FileText, titel: "Spickzettel", text: "eine Seite zum Ausdrucken" },
          ].map((k) => (
            <Link key={k.to} to={k.to} className="group inline-flex items-center gap-1.5">
              <k.icon className="h-4 w-4 text-brand-ink" strokeWidth={1.75} />
              <span className="font-semibold group-hover:underline">{k.titel}</span>
              <span className="text-muted-foreground">{k.text}</span>
            </Link>
          ))}
        </section>
      </div>
    </KursLayout>
  );
}
