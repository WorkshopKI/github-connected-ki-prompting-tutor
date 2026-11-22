import { StepPlayer } from "../StepPlayer";
import { Check, X } from "lucide-react";

/** Erklär-Animation 7: Reasoning. Zwischenschritte vor der Antwort. */

const AUFGABE = "Ein Schläger und ein Ball kosten zusammen 1,10 €. Der Schläger kostet 1 € mehr als der Ball. Was kostet der Ball?";

const GEDANKEN = [
  "Ball = x, Schläger = x + 1,00 €.",
  "Zusammen: x + (x + 1,00 €) = 1,10 €.",
  "Also 2x = 0,10 €, x = 0,05 €.",
  "Probe: 0,05 € + 1,05 € = 1,10 €. Unterschied 1,00 €. Stimmt.",
];

export default function Reasoning() {
  const captions = [
    <p key={0}>Eine Aufgabe mit Falle. Die erste Antwort, die einem in den Sinn kommt, ist falsch.</p>,
    <>
      <p><strong>Ohne Nachdenken</strong> schreibt das Modell sofort das naheliegendste Wort. „10 Cent“ ist eine sehr häufige Antwort auf diese bekannte Aufgabe.</p>
      <p>Schnell, günstig, aber hier falsch.</p>
    </>,
    <p key={2}>Ein <strong>Reasoning-Modell</strong> schreibt zuerst Zwischenschritte, die du meist nur zusammengefasst oder aufklappbar siehst.</p>,
    <p key={3}>Jeder Schritt wird Teil des Textes, auf dem der nächste aufbaut. So kann das Modell rechnen, prüfen und sich korrigieren.</p>,
    <p key={4}>Am Ende steht eine <strong>geprüfte Antwort</strong>. Dafür braucht das Modell länger und verbraucht mehr Rechenleistung.</p>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Für Rechnen, Planen, Analysen und knifflige Abwägungen ein Modell mit Nachdenken wählen.</li>
        <li>Für einfache Fragen reicht ein schnelles Modell.</li>
        <li>„Denk Schritt für Schritt“ musst du heute kaum noch schreiben. Wichtiger ist ein klares Ziel.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">Aufgabe</div>
            <p className="text-lg leading-relaxed">{AUFGABE}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {step >= 1 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-2 text-sm font-semibold">Schnelles Modell</div>
                <div className="mb-2 text-xs text-ink-subtle">Antwort nach 1 Sekunde</div>
                <p className="flex items-center gap-2 font-mono text-base">
                  <X className="h-4 w-4 text-danger" strokeWidth={2} /> Der Ball kostet 0,10 €.
                </p>
              </div>
            )}
            {step >= 2 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-2 text-sm font-semibold">Modell mit Nachdenken</div>
                <div className="mb-2 text-xs text-ink-subtle">Denkt {step >= 4 ? "12" : "…"} Sekunden nach</div>
                <ol className="mb-3 grid gap-1 rounded-md bg-muted p-3 font-mono text-sm text-muted-foreground">
                  {GEDANKEN.slice(0, step === 2 ? 1 : GEDANKEN.length).map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ol>
                {step >= 4 && (
                  <p className="flex items-center gap-2 font-mono text-base">
                    <Check className="h-4 w-4 text-success" strokeWidth={2} /> Der Ball kostet 0,05 €.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </StepPlayer>
  );
}
