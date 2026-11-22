import { useState } from "react";
import { StepPlayer, ProbBar } from "../StepPlayer";

/** Erklär-Animation 4: Temperatur. Wie stark das Modell vom wahrscheinlichsten Wort abweicht. */

const SATZ = "Der Workshop am Samstag war";
const LOGITS: { wort: string; logit: number }[] = [
  { wort: "spannend", logit: 3.0 },
  { wort: "lehrreich", logit: 2.6 },
  { wort: "gut", logit: 2.3 },
  { wort: "anstrengend", logit: 1.4 },
  { wort: "magisch", logit: 0.2 },
  { wort: "orange", logit: -1.2 },
];

const STUFEN = [
  { t: 0.2, name: "niedrig (0,2)", antworten: ["spannend", "spannend", "spannend"] },
  { t: 1.0, name: "mittel (1,0)", antworten: ["spannend", "lehrreich", "gut"] },
  { t: 2.0, name: "hoch (2,0)", antworten: ["anstrengend", "magisch", "orange"] },
];

function verteilung(t: number) {
  const ex = LOGITS.map((l) => Math.exp(l.logit / t));
  const sum = ex.reduce((a, b) => a + b, 0);
  return LOGITS.map((l, i) => ({ wort: l.wort, p: (ex[i] / sum) * 100 }));
}

export default function Temperatur() {
  const [wahl, setWahl] = useState(1);
  const stufeFuer = (step: number) => (step === 1 ? 1 : step === 2 ? 0 : step === 3 ? 2 : wahl);

  const captions = [
    <p key={0}>Das Modell berechnet für jedes mögliche nächste Wort eine Wahrscheinlichkeit. Dann muss es <strong>eines auswählen</strong>. Wie es auswählt, steuert die <strong>Temperatur</strong>.</p>,
    <>
      <p>Bei <strong>mittlerer Temperatur</strong> wird gewürfelt, gewichtet nach Wahrscheinlichkeit. Meist gewinnt ein häufiges Wort, manchmal ein anderes.</p>
      <p>Darum bekommst du auf dieselbe Frage nicht zweimal genau dieselbe Antwort.</p>
    </>,
    <p key={2}>Bei <strong>niedriger Temperatur</strong> wird der Favorit fast immer gewählt. Die Antworten werden gleichförmig und vorhersehbar. Gut für Fakten und Zusammenfassungen.</p>,
    <p key={3}>Bei <strong>hoher Temperatur</strong> werden die Chancen gleichmäßiger. Seltene Wörter kommen zum Zug, der Text wird überraschend, ab einem Punkt auch unsinnig.</p>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Ist dir eine Antwort zu brav, lass sie neu erzeugen oder bitte um „drei ganz unterschiedliche Varianten“.</li>
        <li>In Chat-Apps lässt sich die Temperatur meist nicht direkt einstellen, in der Werkstatt und über Schnittstellen schon.</li>
        <li>Probier die Stufen unten selbst aus.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer
      captions={captions}
      controls={(step) =>
        step === 4 ? (
          <div className="grid gap-2">
            <span className="text-sm font-semibold">Temperatur wählen</span>
            <div className="flex flex-wrap gap-2">
              {STUFEN.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setWahl(i)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${wahl === i ? "border-input bg-brand-soft font-semibold text-brand-soft-ink" : "border-border hover:bg-accent"}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        ) : null
      }
    >
      {(step) => {
        const s = STUFEN[stufeFuer(step)];
        const v = verteilung(s.t);
        const max = Math.max(...v.map((x) => x.p));
        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="font-mono text-lg">
                {SATZ} <span className="text-brand-ink">___</span>
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="font-semibold">Chance für das nächste Wort</span>
                {step > 0 && <span className="text-muted-foreground">Temperatur {s.name}</span>}
              </div>
              <div className="grid gap-2">
                {(step === 0 ? verteilung(1) : v).map((x, i) => (
                  <ProbBar key={x.wort} label={x.wort} value={x.p} max={step === 0 ? verteilung(1)[0].p : max} highlight={i === 0} />
                ))}
              </div>
            </div>
            {step > 0 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-2 text-sm font-semibold">Dreimal dieselbe Frage</div>
                <ul className="grid gap-1 font-mono text-sm">
                  {s.antworten.map((a, i) => (
                    <li key={i}>
                      {i + 1}. {SATZ} <strong>{a}</strong>.
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }}
    </StepPlayer>
  );
}
