import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { GRUPPENAUFGABEN } from "@/data/kurs/gruppenarbeit";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info } from "lucide-react";

export default function KursGruppen() {
  return (
    <KursLayout>
      <PageHeader
        className="mb-8"
        eyebrow="Tag 1 und Tag 2"
        title="Gruppenarbeit und Mini-Projekte"
        description="Arbeitet zu zweit bis zu viert. Eure Ergebnisse kommen ins Padlet, Spalte „Ergebnisse der Gruppen“."
      />
      {[1, 2].map((tag) => (
        <section key={tag} className="mb-10">
          <h2 className="mb-3 text-xl font-semibold">Tag {tag}</h2>
          <Accordion type="multiple" className="grid gap-3">
            {GRUPPENAUFGABEN.filter((g) => g.tag === tag).map((g) => (
              <AccordionItem key={g.id} value={g.id} className="rounded-lg border border-border bg-card px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span>
                    <span className="block font-semibold">{g.titel}</span>
                    <span className="block text-sm font-normal text-muted-foreground">{g.ziel} · {g.dauer}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-sm">
                    {g.schritte.map((s) => <li key={s}>{s}</li>)}
                  </ol>
                  {g.tools && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {g.tools.map((t) => <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{t}</span>)}
                    </div>
                  )}
                  <p className="text-sm"><span className="font-semibold">Ergebnis:</span> {g.ergebnis}</p>
                  {g.hinweis && (
                    <p className="mt-3 flex gap-2 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                      <Info className="mt-0.5 h-4 w-4 shrink-0" /> {g.hinweis}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </KursLayout>
  );
}
