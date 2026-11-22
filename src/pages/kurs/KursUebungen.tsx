import { Link } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { UebungsListe } from "@/components/kurs/uebung/UebungsListe";
import { useErledigt } from "@/components/kurs/uebung/useErledigt";
import { KURS_MODULE } from "@/data/kurs/lernpfad";
import { KURS_UEBUNGEN, uebungenFuer } from "@/data/kurs/uebungen";

export default function KursUebungen() {
  const { erledigt } = useErledigt();
  const anzahl = KURS_UEBUNGEN.filter((u) => erledigt.includes(u.id)).length;
  const module = KURS_MODULE.filter((m) => uebungenFuer(m.id).length > 0);
  return (
    <KursLayout>
      <PageHeader
        className="mb-6"
        eyebrow="Üben"
        title="Übungen zu jedem Modul"
        description="Ohne Anmeldung, auch ohne Internet zur Lern-App-KI: Selbstcheck, Musterlösung und ein Prüfprompt, den du in jeden Chatbot einfügen kannst."
      />
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
        <div className="min-w-[12rem] flex-1">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-semibold">Dein Fortschritt</span>
            <span className="tabular-nums text-muted-foreground">{anzahl} von {KURS_UEBUNGEN.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-muted">
            <div className="h-full bg-success transition-all" style={{ width: `${(anzahl / KURS_UEBUNGEN.length) * 100}%` }} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Mit KI-Bewertung und Werkstatt (Anmeldung): <Link to="/onboarding" className="font-semibold text-brand-ink hover:underline">Lernpfad öffnen</Link>
        </p>
      </div>
      <div className="grid gap-10">
        {module.map((m) => (
          <section key={m.id} aria-labelledby={`u-${m.id}`}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`u-${m.id}`} className="text-xl font-semibold">Tag {m.tag} · {m.titel}</h2>
              <Link to={`/kurs/${m.id}`} className="text-sm font-semibold text-brand-ink hover:underline">Zum Modul</Link>
            </div>
            <UebungsListe uebungen={uebungenFuer(m.id)} />
          </section>
        ))}
      </div>
    </KursLayout>
  );
}
