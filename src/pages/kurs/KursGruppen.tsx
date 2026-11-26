import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, MapPin } from "lucide-react";
import { KursLayout } from "@/components/kurs/KursLayout";
import { PageHeader } from "@/components/PageHeader";
import { GruppenAufgabe } from "@/components/kurs/GruppenAufgabe";
import { GRUPPENAUFGABEN, dauerMin, stationDerAufgabe, type Gruppenaufgabe } from "@/data/kurs/gruppenarbeit";
import { blockById, blockLabel, folienLabel, stationById } from "@/data/kurs/fahrplan";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OptionalBadge } from "@/components/kurs/OptionalBadge";
import { useZuletzt } from "@/lib/kursPosition";
import { cn } from "@/lib/utils";

const TAGE = [1, 2] as const;
const istMiniProjekt = (g: Gruppenaufgabe) => g.titel.startsWith("Mini-Projekt:");
/** Kurzname für die Zeile unter einem eingeklappten Tag: „Steuern-Duell“, „Lernvideo aus eigenen Quellen“. */
const kurzname = (g: Gruppenaufgabe) => (istMiniProjekt(g) ? g.titel.split(": ")[1] : g.titel.split(": ")[0]);

function anzahlText(aufgaben: Gruppenaufgabe[]) {
  const mini = aufgaben.filter(istMiniProjekt).length;
  const uebung = aufgaben.length - mini;
  return [uebung && `${uebung} ${uebung === 1 ? "Übung" : "Übungen"}`, mini && `${mini} Mini-Projekte`].filter(Boolean).join(", ");
}

function AufgabeKarte({ g, aktuell }: { g: Gruppenaufgabe; aktuell: boolean }) {
  const st = stationDerAufgabe(g);
  return (
    <AccordionItem
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
}

export default function KursGruppen() {
  /* Kurzlinks aus Folien und Fahrplan zeigen per #id auf eine Übung: Tag und Übung aufklappen, hinscrollen.
   * Umgekehrt setzt das Aufklappen den Anker, damit die Du-bist-hier-Leiste die richtige Übung zeigt.
   * Offen ist anfangs nur der Tag, an dem man im Kurs gerade ist (Anker, sonst zuletzt besuchte Station). */
  const { hash } = useLocation();
  const navigate = useNavigate();
  const zuletzt = useZuletzt();
  const anker = hash.replace("#", "");
  const [offen, setOffen] = useState<string[]>(anker ? [anker] : []);
  const selbstGesetzt = useRef(false);

  const ankerAufgabe = GRUPPENAUFGABEN.find((g) => g.id === anker);
  const zuletztStation = stationById(zuletzt?.station);
  const heute = ankerAufgabe?.tag ?? (zuletztStation ? blockById(zuletztStation.block).tag : undefined);
  const [offeneTage, setOffeneTage] = useState<number[]>(() => [heute ?? 1]);

  useEffect(() => {
    if (!anker) return;
    if (selbstGesetzt.current) {
      selbstGesetzt.current = false;
      return;
    }
    // Von außen angesprungen (Folie, Leiste, Kurzlink): nur der Tag dieser Übung bleibt offen
    const tag = GRUPPENAUFGABEN.find((g) => g.id === anker)?.tag;
    if (tag) setOffeneTage([tag]);
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

  const tagUmschalten = (tag: number, auf: boolean) => setOffeneTage((t) => (auf ? [...t, tag] : t.filter((x) => x !== tag)));

  return (
    <KursLayout>
      <PageHeader
        className="mb-6"
        eyebrow="Tag 1 und Tag 2"
        title="Gruppenarbeit und Mini-Projekte"
        description="Jede Übung hat feste Zeiten, Rollen, einen Startprompt und Prompt-Inspiration. Eure Ergebnisse kommen ins Padlet, Spalte „Ergebnisse der Gruppen“."
      />
      <div className="grid gap-4">
        {TAGE.map((tag) => {
          const aufgaben = GRUPPENAUFGABEN.filter((g) => g.tag === tag);
          const tagOffen = offeneTage.includes(tag);
          return (
            <Collapsible key={tag} open={tagOffen} onOpenChange={(auf) => tagUmschalten(tag, auf)} asChild>
              <section className="border-b border-border pb-4 last:border-b-0">
                <h2>
                  <CollapsibleTrigger className="group flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-md py-2 text-left">
                    <span className="text-xl font-semibold">Tag {tag}</span>
                    {heute === tag && (
                      <span className="inline-flex items-center gap-1 rounded bg-brand-soft px-1.5 py-0.5 text-xs font-semibold text-brand-soft-ink">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} /> Hier bist du
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">{anzahlText(aufgaben)}</span>
                    <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground group-hover:text-foreground">
                      <span className="max-sm:sr-only">{tagOffen ? "Einklappen" : "Aufklappen"}</span>
                      <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" strokeWidth={1.75} />
                    </span>
                  </CollapsibleTrigger>
                </h2>
                {!tagOffen && <p className="text-sm text-muted-foreground">{aufgaben.map(kurzname).join(" · ")}</p>}
                <CollapsibleContent>
                  <Accordion type="multiple" value={offen} onValueChange={wechsel} className="mt-2 grid gap-3">
                    {aufgaben.map((g) => (
                      <AufgabeKarte key={g.id} g={g} aktuell={g.id === anker} />
                    ))}
                  </Accordion>
                </CollapsibleContent>
              </section>
            </Collapsible>
          );
        })}
      </div>
    </KursLayout>
  );
}
