import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { ErklaertNachLektion, lektionEyebrow } from "@/components/erklaert/ErklaertLektion";
import { erklaertBySlug } from "@/data/kurs/erklaert";
import { animationenNachLektion, imKurs } from "@/data/kurs/erklaertImKurs";
import { ArrowLeft, ArrowRight, MonitorPlay } from "lucide-react";

export function ErklaertIndex() {
  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow="Schritt für Schritt"
        title="KI erklärt"
        description="Kurze Animationen zum Mitklicken, geordnet nach den Lektionen des Kurses. Sie laufen ohne Anmeldung und ohne Verbindung zur KI; im Kurs steuert die Kursleitung sie mit den Pfeiltasten."
      />
      <ErklaertNachLektion
        verlinke={(e, inhalt, className) => (
          <Link to={`/erklaert/${e.slug}`} className={className}>
            {inhalt}
          </Link>
        )}
      />
    </KursLayout>
  );
}

/** Nächste fertige Animation in Kursreihenfolge. */
function naechsteImKurs(slug: string) {
  const reihe = animationenNachLektion().flatMap((g) => g.eintraege.map((x) => x.e)).filter((e) => e.komponente);
  const i = reihe.findIndex((e) => e.slug === slug);
  return i >= 0 ? reihe[i + 1] : undefined;
}

export function ErklaertDetail() {
  const { slug = "" } = useParams();
  const e = erklaertBySlug(slug);
  const k = e ? imKurs(e.slug) : undefined;
  const Komponente = e?.komponente;
  const naechste = e ? naechsteImKurs(e.slug) : undefined;
  return (
    <KursLayout>
      <Link to="/erklaert" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Alle Animationen
      </Link>
      {e && Komponente ? (
        <>
          <PageHeader className="mb-4" eyebrow={lektionEyebrow(e, k)} title={e.titel} description={e.frage} />
          {k && (
            <p className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                Lektion: <span className="font-semibold text-foreground">{k.block.titel}</span> · {k.station.titel}
              </span>
              <Link to={`/kurs/folien?f=${k.folie}`} className="inline-flex items-center gap-1 font-semibold text-brand-ink hover:underline">
                <MonitorPlay className="h-4 w-4" strokeWidth={1.75} /> Folie {k.folie}
              </Link>
              {k.module.map((m) => (
                <Link key={m.id} to={`/kurs/${m.id}`} className="font-semibold text-brand-ink hover:underline">
                  Modul: {m.titel}
                </Link>
              ))}
            </p>
          )}
          <Suspense fallback={<p className="text-muted-foreground">Animation wird geladen …</p>}>
            <Komponente />
          </Suspense>
          {naechste && (
            <div className="mt-8 flex justify-end border-t border-border pt-4">
              <Link to={`/erklaert/${naechste.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
                Nächste Animation im Kurs: {naechste.titel} <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </>
      ) : (
        <p>{e ? "Diese Animation ist noch in Vorbereitung." : "Diese Animation gibt es nicht."}</p>
      )}
    </KursLayout>
  );
}

