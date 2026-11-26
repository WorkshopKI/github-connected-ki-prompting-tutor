import { Link } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { KopierKarte } from "@/components/kurs/KopierKarte";
import { TECHNIKEN } from "@/data/kurs/vorlagen";
import { ArrowLeft } from "lucide-react";

export default function KursProfi() {
  const gruppen = [...new Set(TECHNIKEN.map((t) => t.gruppe))];
  return (
    <KursLayout>
      <Link to="/kurs/vorlagen" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" strokeWidth={1.75} /> Prompt-Vorlagen
      </Link>
      <PageHeader
        className="mb-8"
        eyebrow="Vertiefung"
        title="Profi-Techniken"
        description="Neun Techniken für wichtige Analysen und knifflige Entscheidungen. Zu jeder steht, wann sie hilft und was starke Modelle 2026 schon von selbst machen."
      />
      <div className="grid gap-10">
        {gruppen.map((g) => (
          <section key={g} aria-label={g}>
            <h2 className="mb-4 text-xl font-semibold">{g}</h2>
            <div className="grid gap-4">
              {TECHNIKEN.filter((t) => t.gruppe === g).map((t) => (
                <div key={t.id} className="grid gap-4 rounded-lg border border-border bg-card p-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{t.name}</h3>
                    <p className="mb-3 text-muted-foreground">{t.idee}</p>
                    <p className="mb-2 text-sm"><span className="font-semibold">Wann:</span> {t.wann}</p>
                    <p className="rounded-md bg-brand-soft p-3 text-sm text-brand-soft-ink"><span className="font-semibold">Heute:</span> {t.heute}</p>
                  </div>
                  <KopierKarte titel="Beispiel" text={t.beispiel} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </KursLayout>
  );
}
