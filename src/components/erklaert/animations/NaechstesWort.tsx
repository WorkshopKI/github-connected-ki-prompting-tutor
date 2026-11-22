import { useMemo, useState } from "react";
import { StepPlayer, ProbBar } from "../StepPlayer";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/** Erklär-Animation 1: Ein Sprachmodell sagt immer nur das nächste Wort vorher. */

const PROMPT = "Am Wochenende fahren wir mit den Kindern an den";
const KONTEXT = "Wir wohnen in Konstanz.";

type Kandidat = [string, number];
interface Stufe {
  normal: Kandidat[];
  rest: number;
  mitKontext?: Kandidat[];
  restKontext?: number;
  text: string;
  textKontext?: string;
}

const STUFEN: Stufe[] = [
  {
    normal: [["Strand", 38], ["See", 27], ["Bodensee", 9], ["Rhein", 7], ["Wannsee", 6], ["Rand", 2]],
    rest: 11,
    mitKontext: [["Bodensee", 46], ["See", 22], ["Rhein", 9], ["Strand", 8], ["Hafen", 5], ["Rand", 1]],
    restKontext: 9,
    text: "Nach „an den“ folgen typischerweise Orte. Welche, hat das Modell aus sehr vielen Texten gelernt: Strand und See kommen dort am häufigsten vor.",
    textKontext: "Ein einziger Satz mehr Kontext verschiebt alles: Mit „Wir wohnen in Konstanz“ wird „Bodensee“ zum wahrscheinlichsten Wort. Genau das macht ein guter Prompt.",
  },
  { normal: [["und", 34], [".", 24], [",", 14], ["zum", 9], ["nach", 5]], rest: 14, text: "Jetzt geht es um die Satzstruktur: Endet der Satz oder geht er weiter? „und“ liegt knapp vorn." },
  { normal: [["bauen", 31], ["gehen", 18], ["spielen", 12], ["essen", 9], ["schwimmen", 8]], rest: 22, text: "Nach „und“ ist vieles möglich. Die Wahrscheinlichkeiten liegen nah beieinander, hier entscheidet die Temperatur oft mit." },
  { normal: [["eine", 52], ["Sandburgen", 21], ["dort", 9], ["zusammen", 6]], rest: 12, text: "„bauen“ verlangt ein Objekt. Das Modell hat gelernt, welche Wörter danach grammatisch passen." },
  { normal: [["Sandburg", 78], ["Burg", 9], ["Höhle", 3]], rest: 10, text: "Fast sicher: Kinder, Strand oder See, bauen, eine … Der ganze bisherige Text zeigt auf „Sandburg“." },
  { normal: [[".", 61], [",", 12], ["!", 9], ["mit", 6]], rest: 12, text: "Auch Satzzeichen sind Tokens. Das Modell sagt sie genauso vorher wie Wörter." },
];

interface Eintrag { w: string; q: number; rest: boolean }

function verteilung(i: number, temp: number, kontext: boolean): Eintrag[] {
  const s = STUFEN[i];
  const basis = i === 0 && kontext && s.mitKontext ? s.mitKontext : s.normal;
  const rest = i === 0 && kontext && s.restKontext !== undefined ? s.restKontext : s.rest;
  const roh = [...basis.map(([w, p]) => ({ w, p, rest: false })), { w: "übrige Wörter", p: rest, rest: true }];
  const skaliert = roh.map((e) => Math.pow(e.p, 1 / temp));
  const summe = skaliert.reduce((a, b) => a + b, 0);
  return roh.map((e, k) => ({ w: e.w, rest: e.rest, q: (skaliert[k] / summe) * 100 }));
}

const top = (v: Eintrag[]) => v.filter((e) => !e.rest).sort((a, b) => b.q - a.q)[0].w;
const SATZZEICHEN = /^[.,!?]$/;

export default function NaechstesWort() {
  const [temp, setTemp] = useState(1);
  const [kontext, setKontext] = useState(false);
  const [gezogen, setGezogen] = useState<string[]>([]);

  const total = 2 + STUFEN.length * 2;
  const zustand = (step: number) => {
    if (step === 0) return { art: "start" as const, k: 0 };
    if (step === total - 1) return { art: "ende" as const, k: STUFEN.length };
    const k = Math.floor((step - 1) / 2);
    return { art: (step - 1) % 2 === 0 ? ("zeigen" as const) : ("waehlen" as const), k };
  };

  const gewaehlt = useMemo(() => STUFEN.map((_, i) => top(verteilung(i, temp, kontext))), [temp, kontext]);

  const captions = Array.from({ length: total }, (_, step) => {
    const z = zustand(step);
    if (z.art === "start")
      return (
        <>
          <p>Ein Sprachmodell beantwortet im Kern immer nur eine Frage: <strong>Welches Wort kommt als Nächstes?</strong></p>
          <p>Dazu liest es den gesamten bisherigen Text, hier den Anfang eines Satzes.</p>
        </>
      );
    if (z.art === "ende")
      return (
        <>
          <p><strong>So entsteht jede Antwort:</strong> Wort für Wort, jedes Mal mit dem ganzen bisherigen Text als Grundlage.</p>
          <ol className="ml-5 list-decimal space-y-2">
            <li><strong>Wahrscheinlich ist nicht wahr.</strong> Fehlt Wissen, klingt die Antwort trotzdem flüssig.</li>
            <li><strong>Kontext verschiebt die Wahrscheinlichkeiten.</strong> Darum wirken gute Prompts.</li>
            <li><strong>Temperatur steuert den Zufall.</strong> Dieselbe Frage kann verschiedene Antworten bekommen.</li>
          </ol>
        </>
      );
    const s = STUFEN[z.k];
    if (z.art === "zeigen") return <p>{z.k === 0 && kontext && s.textKontext ? s.textKontext : s.text}</p>;
    return (
      <>
        <p>„{gewaehlt[z.k]}“ hat die höchste Wahrscheinlichkeit und wird angehängt.</p>
        <p>Danach beginnt alles von vorn, mit einem Wort mehr Text als Grundlage.</p>
      </>
    );
  });

  const ziehen = (k: number) => {
    const v = verteilung(k, temp, kontext);
    const out: string[] = [];
    for (let n = 0; n < 10; n++) {
      const r = Math.random() * 100;
      let acc = 0;
      let pick = v[v.length - 1];
      for (const e of v) {
        acc += e.q;
        if (r <= acc) { pick = e; break; }
      }
      out.push(pick.rest ? "…anderes" : pick.w);
    }
    setGezogen(out);
  };

  return (
    <StepPlayer
      captions={captions}
      onStepChange={() => setGezogen([])}
      controls={(step) => {
        const z = zustand(step);
        const aktiv = z.art === "zeigen" || z.art === "waehlen";
        return (
          <>
            <div className="grid gap-2">
              <div className="flex justify-between text-sm font-semibold">
                <Label htmlFor="temp">Temperatur</Label>
                <span className="tabular-nums">{temp.toLocaleString("de-DE", { minimumFractionDigits: 1 })}</span>
              </div>
              <Slider id="temp" min={0.2} max={1.6} step={0.1} value={[temp]} onValueChange={([v]) => { setTemp(v); setGezogen([]); }} />
              <span className="text-xs text-muted-foreground">niedrig = vorhersehbar · hoch = abwechslungsreicher</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="kontext" checked={kontext} onCheckedChange={(v) => { setKontext(v); setGezogen([]); }} />
              <Label htmlFor="kontext" className="text-sm">Mehr Kontext: „{KONTEXT}“</Label>
            </div>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" disabled={!aktiv} onClick={() => ziehen(z.k)}>10× würfeln</Button>
              <div className="flex min-h-7 flex-wrap gap-1.5" aria-live="polite">
                {gezogen.map((w, i) => (
                  <span key={i} className="rounded-full bg-brand-soft px-2.5 py-0.5 font-mono text-xs">{w}</span>
                ))}
              </div>
            </div>
          </>
        );
      }}
    >
      {(step) => {
        const z = zustand(step);
        const fertig = z.art === "start" ? 0 : z.art === "ende" ? STUFEN.length : z.art === "waehlen" ? z.k + 1 : z.k;
        const woerter = gewaehlt.slice(0, fertig);
        const v = z.art === "zeigen" || z.art === "waehlen" ? verteilung(z.k, temp, kontext) : null;
        const max = v ? Math.max(...v.map((e) => e.q)) : 0;
        return (
          <div className="grid gap-5">
            <div className="rounded-lg border border-border bg-card p-6">
              {kontext && <p className="mb-2 text-sm text-muted-foreground">Kontext im Prompt: <span className="font-semibold text-brand-ink">{KONTEXT}</span></p>}
              <p className="text-2xl font-semibold leading-snug md:text-3xl">
                {PROMPT}
                {woerter.map((w, i) => {
                  const neu = z.art === "waehlen" && i === woerter.length - 1;
                  return (
                    <span key={i}>
                      {SATZZEICHEN.test(w) ? "" : " "}
                      <span className={neu ? "rounded bg-brand-soft px-1 underline decoration-primary decoration-2 underline-offset-4" : ""}>{w}</span>
                    </span>
                  );
                })}
                {z.art !== "ende" && <span className="ml-1 inline-block h-[0.9em] w-[3px] animate-pulse bg-primary align-[-0.1em]" aria-hidden />}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-sm font-semibold">
                {v ? `Wort ${z.k + 1} von ${STUFEN.length}: Wahrscheinlichkeiten` : "Wahrscheinlichkeiten für das nächste Wort"}
              </h3>
              {v ? (
                <div className="grid gap-2.5">
                  {v.map((e) => (
                    <ProbBar key={e.w} label={e.w} value={e.q} max={max} muted={e.rest} highlight={z.art === "waehlen" && !e.rest && e.w === gewaehlt[z.k]} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {z.art === "start" ? "Noch keine Berechnung. Weiter mit →" : "Satz fertig. Das Modell hört auf, wenn ein Ende-Zeichen am wahrscheinlichsten ist."}
                </p>
              )}
              <p className="mt-4 text-xs text-muted-foreground">Werte vereinfacht. Echte Modelle rechnen mit Wortteilen (Tokens) und wählen aus über 100.000 Möglichkeiten.</p>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}
