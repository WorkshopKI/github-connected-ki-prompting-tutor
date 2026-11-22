import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { ERKLAERT, erklaertBySlug, type ErklaerEintrag } from "@/data/kurs/erklaert";
import { ArrowLeft, PlayCircle, Clock } from "lucide-react";

const GRUPPEN: ErklaerEintrag["gruppe"][] = ["Wie KI rechnet", "Sicher arbeiten", "Arbeiten mit Agenten"];

export function ErklaertIndex() {
  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow="Schritt für Schritt"
        title="KI erklärt"
        description="Kurze Animationen zum Mitklicken. Sie laufen ohne Anmeldung und ohne Verbindung zur KI; im Kurs steuert die Kursleitung sie mit den Pfeiltasten."
      />
      {GRUPPEN.map((g) => (
        <section key={g} className="mb-8">
          <h2 className="eyebrow mb-3">{g}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ERKLAERT.filter((e) => e.gruppe === g).map((e) =>
              e.komponente ? (
                <Link key={e.slug} to={`/erklaert/${e.slug}`} className="group rounded-lg border border-border bg-card p-4 hover:border-input hover:shadow-sm">
                  <PlayCircle className="mb-2 h-5 w-5 text-brand-ink" />
                  <div className="font-semibold">{e.titel}</div>
                  <div className="text-sm text-muted-foreground">{e.frage}</div>
                </Link>
              ) : (
                <div key={e.slug} className="rounded-lg border border-dashed border-border p-4 opacity-70">
                  <Clock className="mb-2 h-5 w-5 text-muted-foreground" />
                  <div className="font-semibold">{e.titel}</div>
                  <div className="text-sm text-muted-foreground">{e.frage}</div>
                  <div className="mt-1 text-xs text-muted-foreground">in Vorbereitung</div>
                </div>
              ),
            )}
          </div>
        </section>
      ))}
    </KursLayout>
  );
}

export function ErklaertDetail() {
  const { slug = "" } = useParams();
  const e = erklaertBySlug(slug);
  const Komponente = e?.komponente;
  return (
    <KursLayout>
      <Link to="/erklaert" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Alle Animationen
      </Link>
      {e && Komponente ? (
        <>
          <PageHeader className="mb-6" eyebrow={`KI erklärt · ${e.gruppe}`} title={e.titel} description={e.frage} />
          <Suspense fallback={<p className="text-muted-foreground">Animation wird geladen …</p>}>
            <Komponente />
          </Suspense>
        </>
      ) : (
        <p>{e ? "Diese Animation ist noch in Vorbereitung." : "Diese Animation gibt es nicht."}</p>
      )}
    </KursLayout>
  );
}
