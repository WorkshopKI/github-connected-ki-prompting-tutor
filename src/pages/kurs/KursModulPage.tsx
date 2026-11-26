import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { UebungsListe } from "@/components/kurs/uebung/UebungsListe";
import { uebungenFuer } from "@/data/kurs/uebungen";

const istKurs = (link?: string) => !!link && (link.startsWith("/kurs") || link.startsWith("/erklaert"));
import { PageHeader } from "@/components/PageHeader";
import { KURS_MODULE, DISZIPLIN_LABEL, modulById } from "@/data/kurs/lernpfad";
import { erklaertBySlug } from "@/data/kurs/erklaert";
import { ArrowLeft, ArrowRight, Check, Copy, PlayCircle } from "lucide-react";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { EinstellungenCheckliste } from "@/components/kurs/EinstellungenCheckliste";

function PromptKarte({ titel, text, hinweis }: { titel: string; text: string; hinweis?: string }) {
  const [kopiert, setKopiert] = useState(false);
  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 1500);
    } catch {
      setKopiert(false);
    }
  };
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-semibold">{titel}</span>
        <button onClick={kopieren} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-brand-ink hover:bg-accent">
          {kopiert ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {kopiert ? "Kopiert" : "Prompt kopieren"}
        </button>
      </div>
      <p className="whitespace-pre-line rounded-md bg-muted p-3 font-mono text-sm leading-relaxed">{text}</p>
      {hinweis && <p className="mt-2 text-sm text-muted-foreground">{hinweis}</p>}
    </div>
  );
}

export default function KursModulPage() {
  const { id = "" } = useParams();
  const m = modulById(id);
  if (!m) {
    return (
      <KursLayout>
        <p>Dieses Modul gibt es nicht. <Link to="/kurs" className="text-brand-ink underline">Zur Kursübersicht</Link></p>
      </KursLayout>
    );
  }
  const idx = KURS_MODULE.indexOf(m);
  const vor = KURS_MODULE[idx - 1];
  const nach = KURS_MODULE[idx + 1];

  return (
    <KursLayout>
      <Link to="/kurs" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Kursübersicht
      </Link>
      <PageHeader
        className="mb-8"
        eyebrow={`Modul ${idx + 1} von ${KURS_MODULE.length} · Tag ${m.tag} · ${DISZIPLIN_LABEL[m.disziplin]} · ${m.dauer}`}
        title={m.titel}
        description={m.ziel}
      />
      {m.optional && (
        <p className="-mt-4 mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <OptionalBadge /> {m.optional}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid gap-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Das Wichtigste</h2>
            <ul className="grid gap-2">
              {m.kernpunkte.map((k, i) => (
                <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-input text-xs font-semibold">{i + 1}</span>
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>

          {m.einstellungen && m.einstellungen.length > 0 && (
            <section id="checkliste">
              <h2 className="mb-1 text-lg font-semibold">Checkliste: Schritt für Schritt</h2>
              <EinstellungenCheckliste punkte={m.einstellungen} />
            </section>
          )}

          {m.schritte && m.schritte.length > 0 && (
            <section id="ablauf">
              <h2 className="mb-3 text-lg font-semibold">Übung: Ablauf</h2>
              <ol className="grid gap-2">
                {m.schritte.map((x, i) => (
                  <li key={i} className="flex gap-3 rounded-lg border border-border bg-card p-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{i + 1}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {m.vergleich && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Vorher und nachher</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted p-4">
                  <div className="eyebrow mb-2 text-muted-foreground">Vorher</div>
                  <p className="font-mono text-sm">{m.vergleich.vorher}</p>
                </div>
                <div className="rounded-lg border border-border bg-brand-soft p-4">
                  <div className="eyebrow mb-2">Nachher</div>
                  <p className="font-mono text-sm">{m.vergleich.nachher}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{m.vergleich.warum}</p>
            </section>
          )}

          {m.prompts && m.prompts.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Beispiel-Prompts zum Kopieren</h2>
              <div className="grid gap-3">{m.prompts.map((p) => <PromptKarte key={p.titel} {...p} />)}</div>
            </section>
          )}

          {uebungenFuer(m.id).length > 0 && (
            <section id="ueben">
              <h2 className="mb-1 text-lg font-semibold">Üben</h2>
              <p className="mb-3 text-sm text-muted-foreground">Ohne Anmeldung, mit Musterlösung. Deinen Prompt kannst du von jedem Chatbot prüfen lassen.</p>
              <UebungsListe uebungen={uebungenFuer(m.id)} />
            </section>
          )}
        </div>

        <aside className="grid content-start gap-4">
          {m.erklaert && m.erklaert.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="eyebrow mb-3">KI erklärt</h2>
              <div className="grid gap-2">
                {m.erklaert.map((slug) => {
                  const e = erklaertBySlug(slug);
                  if (!e) return null;
                  return (
                    <Link key={slug} to={`/erklaert/${slug}`} className="flex items-start gap-2 rounded-lg p-2 hover:bg-accent">
                      <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-ink" />
                      <span>
                        <span className="block text-sm font-semibold">{e.titel}</span>
                        <span className="block text-xs text-muted-foreground">{e.frage}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          {m.mehr && m.mehr.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="eyebrow mb-2">Weiter vertiefen</h2>
              <ul className="grid gap-1.5">
                {m.mehr.map((x) => (
                  <li key={x.link}>
                    <Link to={x.link} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
                      {x.label} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {m.uebung && (
            <div className={`rounded-lg border border-border p-4 ${istKurs(m.uebung.link) ? "bg-brand-soft" : "bg-card"}`}>
              <h2 className="eyebrow mb-2">{istKurs(m.uebung.link) ? "Übung" : "Vertiefen mit KI-Feedback"}</h2>
              <p className="mb-3 text-sm">{m.uebung.aufgabe}</p>
              {m.uebung.link && (
                <Link
                  to={m.uebung.link}
                  className={istKurs(m.uebung.link)
                    ? "inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
                    : "inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"}
                >
                  {m.uebung.linkLabel ?? "Los"} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              )}
              {!istKurs(m.uebung.link) && <p className="mt-2 text-xs text-muted-foreground">Mit Anmeldung, Zugangsdaten gibt es im Kurs.</p>}
            </div>
          )}
        </aside>
      </div>

      <nav className="mt-12 flex flex-wrap justify-between gap-3 border-t border-border pt-6" aria-label="Modul-Navigation">
        {vor ? (
          <Link to={`/kurs/${vor.id}`} className="inline-flex items-center text-sm hover:text-brand-ink"><ArrowLeft className="mr-1 h-4 w-4" /> {vor.titel}</Link>
        ) : <span />}
        {nach && (
          <Link to={`/kurs/${nach.id}`} className="inline-flex items-center text-sm font-semibold hover:text-brand-ink">{nach.titel} <ArrowRight className="ml-1 h-4 w-4" /></Link>
        )}
      </nav>
    </KursLayout>
  );
}
