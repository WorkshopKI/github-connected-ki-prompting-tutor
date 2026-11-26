import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { GruppenAufgabe } from "@/components/kurs/GruppenAufgabe";
import { GRUPPENAUFGABEN, dauerMin, stationDerAufgabe } from "@/data/kurs/gruppenarbeit";
import { blockById, blockLabel, folienLabel } from "@/data/kurs/fahrplan";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { cn } from "@/lib/utils";

export default function KursGruppen() {
  /* Kurzlinks aus Folien und Fahrplan zeigen per #id auf eine Übung: aufklappen und hinscrollen.
   * Umgekehrt setzt das Aufklappen den Anker, damit die Du-bist-hier-Leiste die richtige Übung zeigt. */
  const { hash } = useLocation();
  const navigate = useNavigate();
  const anker = hash.replace("#", "");
  const [offen, setOffen] = useState<string[]>(anker ? [anker] : []);
  const selbstGesetzt = useRef(false);

  useEffect(() => {
    if (!anker) return;
    if (selbstGesetzt.current) {
      selbstGesetzt.current = false;
      return;
    }
    setOffen((o) => (o.includes(anker) ? o : [...o, anker]));
    const t = window.setTimeout(() => document.getElementById(anker)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => window.clearTimeout(t);
  }, [anker]);

  const wechsel = (neu: string[]) => {
    const dazu = neu.find((id) => !offen.includes(id));
    setOffen(neu);
    if (dazu && dazu !== anker) {
      selbstGesetzt.current = true;
      navigate({ hash: dazu }, { replace: true });
    }
  };

  return (
    <KursLayout>
      <PageHeader
        className="mb-6"
        eyebrow="Tag 1 und Tag 2"
        title="Gruppenarbeit und Mini-Projekte"
        description="Jede Übung hat feste Zeiten, Rollen, einen Startprompt und Prompt-Inspiration. Eure Ergebnisse kommen ins Padlet, Spalte „Ergebnisse der Gruppen“."
      />
      {[1, 2].map((tag) => (
        <section key={tag} className="mb-8">
          <h2 className="mb-3 text-xl font-semibold">Tag {tag}</h2>
          <Accordion type="multiple" value={offen} onValueChange={wechsel} className="grid gap-3">
            {GRUPPENAUFGABEN.filter((g) => g.tag === tag).map((g) => {
              const st = stationDerAufgabe(g);
              const aktuell = g.id === anker;
              return (
                <AccordionItem
                  key={g.id}
                  id={g.id}
                  value={g.id}
                  aria-current={aktuell ? "step" : undefined}
                  className={cn("scroll-mt-32 rounded-lg border bg-card px-4", aktuell ? "border-brand-ink/50 ring-1 ring-brand-ink/30" : "border-border")}
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span>
                      {st && (
                        <span className="mb-0.5 block text-xs font-semibold text-brand-ink">
                          {blockLabel(st).replace(/^Tag \d · /, "")} · {blockById(st.block).titel} · {folienLabel(st)}
                        </span>
                      )}
                      <span className="flex flex-wrap items-center gap-2 font-semibold">{g.titel}{g.optional && <OptionalBadge />}</span>
                      <span className="block text-sm font-normal text-muted-foreground">{g.ziel}</span>
                      <span className="mt-1 block text-xs font-normal text-ink-subtle">
                        {dauerMin(g)} Min · {g.gruppe} · {g.wann}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <GruppenAufgabe g={g} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      ))}
    </KursLayout>
  );
}
