import { Suspense, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ErklaertNachLektion, lektionEyebrow } from "@/components/erklaert/ErklaertLektion";
import { erklaertBySlug } from "@/data/kurs/erklaert";
import { imKurs } from "@/data/kurs/erklaertImKurs";

const slugAusHash = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, ""));

/** Offline-Hülle: Übersicht und Animationen, Navigation über den Hash (#/slug). */
export default function ErklaertOffline() {
  const [slug, setSlug] = useState(slugAusHash);
  useEffect(() => {
    const f = () => {
      setSlug(slugAusHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  const e = slug ? erklaertBySlug(slug) : undefined;
  const Komponente = e?.komponente;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[70rem] items-center justify-between gap-4 px-4 py-3">
          <a href="#/" className="leading-tight">
            <span className="block font-serif text-xl font-semibold">KI-Werkstatt</span>
            <span className="block text-xs text-muted-foreground">KI erklärt · Offline-Fassung</span>
          </a>
          <span className="text-xs text-ink-subtle">Pfeiltasten oder Presenter zum Weiterschalten</span>
        </div>
      </header>
      <main className="mx-auto max-w-[70rem] px-4 py-8">
        {e && Komponente ? (
          <>
            <a href="#/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" /> Alle Animationen
            </a>
            <PageHeader className="mb-6" eyebrow={lektionEyebrow(e, imKurs(e.slug))} title={e.titel} description={e.frage} />
            <Suspense fallback={<p className="text-muted-foreground">Animation wird geladen …</p>}>
              <Komponente />
            </Suspense>
          </>
        ) : (
          <>
            <PageHeader
              className="mb-8"
              eyebrow="Schritt für Schritt"
              title="KI erklärt"
              description="Alle Animationen aus der Lern-App, geordnet nach den Lektionen des Kurses, auch ohne Internet. Diese Datei einfach im Browser öffnen."
            />
            <ErklaertNachLektion
              verlinke={(x, inhalt, className) => (
                <a href={`#/${x.slug}`} className={className}>
                  {inhalt}
                </a>
              )}
            />
          </>
        )}
      </main>
    </div>
  );
}
