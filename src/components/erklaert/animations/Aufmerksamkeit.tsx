import { StepPlayer } from "../StepPlayer";

/** Erklär-Animation 3: Aufmerksamkeit (Attention) bestimmt die Bedeutung eines Wortes aus dem Kontext. */

interface Satz {
  woerter: string[];
  ziel: number;
  gewichte: Record<number, number>;
  bedeutung: string;
}

const SAETZE: Satz[] = [
  {
    woerter: "Am Morgen traf ich Herrn Müller auf der Bank vor dem alten Rathaus .".split(" "),
    ziel: 8,
    gewichte: { 2: 0.35, 4: 0.3, 5: 0.25, 9: 0.55, 12: 0.6, 6: 0.2 },
    bedeutung: "Sitzbank",
  },
  {
    woerter: "Anschließend ging ich zur Bank , um mein Konto zu überprüfen .".split(" "),
    ziel: 4,
    gewichte: { 8: 0.95, 7: 0.3, 10: 0.55, 1: 0.3 },
    bedeutung: "Geldinstitut",
  },
  {
    woerter: "Die Bank am Flussufer war nach dem Regen ganz nass .".split(" "),
    ziel: 1,
    gewichte: { 3: 0.85, 7: 0.6, 9: 0.65, 2: 0.2 },
    bedeutung: "Sitzbank",
  },
];

function SatzAnsicht({ s, zeigeGewichte }: { s: Satz; zeigeGewichte: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap gap-x-2 gap-y-3 text-2xl leading-snug">
        {s.woerter.map((w, i) => {
          const g = s.gewichte[i] ?? 0;
          const istZiel = i === s.ziel;
          return (
            <span
              key={i}
              className={`relative rounded-md px-1.5 py-0.5 transition-all duration-700 motion-reduce:transition-none ${istZiel ? "ring-2 ring-primary font-semibold" : ""}`}
              style={zeigeGewichte && !istZiel ? { backgroundColor: `hsl(var(--primary) / ${g * 0.55})` } : undefined}
            >
              {w}
              {zeigeGewichte && g >= 0.5 && !istZiel && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-brand-ink">{Math.round(g * 100)} %</span>
              )}
            </span>
          );
        })}
      </div>
      {zeigeGewichte && (
        <p className="mt-5 text-sm text-muted-foreground">
          „Bank“ wird hier gelesen als: <span className="font-semibold text-foreground">{s.bedeutung}</span>
        </p>
      )}
    </div>
  );
}

export default function Aufmerksamkeit() {
  const captions = [
    <p key={0}>Dreimal dasselbe Wort: <strong>Bank</strong>. Für Menschen ist sofort klar, was gemeint ist. Woher weiß es das Modell?</p>,
    <>
      <p>Für jedes Wort prüft das Modell, <strong>welche anderen Wörter im Text wichtig sind</strong>. Das heißt Aufmerksamkeit (Attention).</p>
      <p>Hier achtet „Bank“ vor allem auf „vor dem Rathaus“ und „traf ich Herrn Müller“: eine Sitzbank.</p>
    </>,
    <p key={2}>„Konto“ und „überprüfen“ ziehen fast die ganze Aufmerksamkeit auf sich. Jetzt ist „Bank“ ein Geldinstitut.</p>,
    <p key={3}>„Flussufer“ und „nass“ entscheiden: wieder eine Sitzbank, diesmal am Wasser.</p>,
    <>
      <p><strong>Die Bedeutung eines Wortes entsteht aus seinem Kontext.</strong> Das macht moderne Sprachmodelle so gut im Verstehen.</p>
      <p>Für deine Prompts heißt das: Je klarer der Kontext, desto eindeutiger das Ergebnis.</p>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          {step === 0 || step === 4
            ? SAETZE.map((s, i) => <SatzAnsicht key={i} s={s} zeigeGewichte={step === 4} />)
            : <SatzAnsicht s={SAETZE[step - 1]} zeigeGewichte />}
          {step > 0 && step < 4 && <p className="text-xs text-muted-foreground">Stärkere Färbung = mehr Aufmerksamkeit. Werte vereinfacht zur Veranschaulichung.</p>}
        </div>
      )}
    </StepPlayer>
  );
}
