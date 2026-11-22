import { CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { KursUebung } from "@/data/kurs/uebungen";
import { Verbessern } from "./Verbessern";
import { Finden } from "./Finden";
import { useErledigt } from "./useErledigt";

const TYP_LABEL = { verbessern: "Prompt verbessern", finden: "Prüfen und ankreuzen" } as const;

/** Liste von Kurs-Übungen als aufklappbare Karten. */
export function UebungsListe({ uebungen }: { uebungen: KursUebung[] }) {
  const { istErledigt, markiere } = useErledigt();
  return (
    <Accordion type="multiple" className="grid gap-3">
      {uebungen.map((u) => (
        <AccordionItem key={u.id} value={u.id} className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="text-left hover:no-underline">
            <span className="flex items-start gap-3">
              {istErledigt(u.id) ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={1.75} aria-label="erledigt" />
              ) : (
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full border border-input" aria-hidden />
              )}
              <span>
                <span className="block font-semibold">{u.titel}</span>
                <span className="block text-sm font-normal text-muted-foreground">{u.lage}</span>
                <span className="mt-1 block text-xs font-normal text-ink-subtle">{TYP_LABEL[u.typ]}</span>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {u.typ === "verbessern" ? <Verbessern u={u} onErledigt={() => markiere(u.id)} /> : <Finden u={u} onErledigt={() => markiere(u.id)} />}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
