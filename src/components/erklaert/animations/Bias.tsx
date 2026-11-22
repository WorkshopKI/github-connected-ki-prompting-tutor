import { StepPlayer } from "../StepPlayer";
import { UserRound } from "lucide-react";

/** Erklär-Animation 16: Verzerrungen. Muster aus den Trainingsdaten werden zu Mustern im Ergebnis. */

/** 12 Beispielbilder: m = männlich gelesen, w = weiblich gelesen. Ausgedacht, zeigt ein typisches Muster. */
const OHNE = ["m", "m", "m", "w", "m", "m", "m", "m", "w", "m", "m", "m"];
const MIT = ["w", "m", "w", "m", "w", "m", "w", "m", "w", "m", "w", "m"];

function Raster({ werte, zeigen }: { werte: string[]; zeigen: boolean }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {werte.map((g, i) => (
        <div
          key={i}
          className={`flex aspect-square items-center justify-center rounded-md border transition-colors duration-500 ${zeigen ? (g === "w" ? "border-input bg-brand-soft" : "border-border bg-muted") : "border-border bg-card"}`}
          aria-label={zeigen ? (g === "w" ? "Ärztin" : "Arzt") : "Bild"}
        >
          <UserRound className={`h-6 w-6 ${zeigen && g === "w" ? "text-brand-ink" : "text-ink-subtle"}`} strokeWidth={1.75} />
        </div>
      ))}
    </div>
  );
}

export default function Bias() {
  const anteilW = (w: string[]) => Math.round((w.filter((g) => g === "w").length / w.length) * 100);
  const captions = [
    <p key={0}>Der Auftrag ist neutral formuliert: <strong>„Ein Foto von jemandem, der als Arzt arbeitet.“</strong> Wir lassen zwölf Bilder erzeugen.</p>,
    <>
      <p>Auf den meisten Bildern ist ein <strong>Mann</strong> zu sehen, oft älter, mit weißem Kittel.</p>
      <p>Im Beispiel: {anteilW(OHNE)} % Ärztinnen.</p>
    </>,
    <p key={2}>Zum Vergleich: In Deutschland ist seit Ende 2024 erstmals mehr als die Hälfte der berufstätigen Ärzteschaft weiblich (50,1 %, Bundesärztekammer).</p>,
    <>
      <p><strong>Warum?</strong> Das Modell hat gelernt, was in seinen Trainingsdaten häufig vorkommt: Fotos, Texte und Bildunterschriften aus vielen Jahrzehnten und vielen Ländern.</p>
      <p>Alte Muster werden so fortgeschrieben, manchmal sogar verstärkt.</p>
    </>,
    <>
      <p>Mit einem <strong>bewussteren Prompt</strong> ändert sich das Ergebnis: „Zeige unterschiedliche Ärztinnen und Ärzte, verschiedenen Alters und verschiedener Herkunft.“</p>
    </>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Verzerrungen gibt es auch in Texten: bei Berufsbildern, Namen, Bewerbungen, Länderbeschreibungen.</li>
        <li>Ergebnisse kritisch lesen und bei Bedarf nach anderen Perspektiven fragen.</li>
        <li>Bei Entscheidungen über Menschen KI nie allein entscheiden lassen.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">Prompt</div>
            <p className="font-mono text-sm">
              {step >= 4 ? "Zeige unterschiedliche Ärztinnen und Ärzte, verschiedenen Alters und verschiedener Herkunft." : "Ein Foto von jemandem, der als Arzt arbeitet."}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <Raster werte={step >= 4 ? MIT : OHNE} zeigen={step >= 1} />
            {step >= 1 && (
              <div className="mt-4 grid gap-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-28 shrink-0">KI-Bilder</span>
                  <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-primary transition-all duration-700" style={{ width: `${anteilW(step >= 4 ? MIT : OHNE)}%` }} />
                  </div>
                  <span className="w-24 text-right tabular-nums">{anteilW(step >= 4 ? MIT : OHNE)} % Ärztinnen</span>
                </div>
                {step >= 2 && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0">Wirklichkeit</span>
                    <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-chart-2" style={{ width: "50.1%" }} />
                    </div>
                    <span className="w-24 text-right tabular-nums">50 % Ärztinnen</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Bildverteilung ausgedacht, sie zeigt ein in Studien oft beobachtetes Muster. Quelle Wirklichkeit: Ärztestatistik der Bundesärztekammer zum 31.12.2024.</p>
        </div>
      )}
    </StepPlayer>
  );
}
