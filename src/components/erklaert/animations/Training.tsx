import { StepPlayer } from "../StepPlayer";
import { BookOpen, MessagesSquare, ThumbsUp, Calculator, ArrowRight } from "lucide-react";

/** Erklär-Animation 5: Training in Phasen. Vom Lückentext-Rater zum Assistenten. */

const PHASEN = [
  {
    icon: BookOpen,
    name: "Vortraining",
    was: "Riesige Textmengen aus Web, Büchern, Code. Aufgabe: immer das nächste Wort erraten.",
    dauer: "Monate, tausende Grafikchips",
    antwort: "Wie koche ich Nudeln? Wie koche ich Reis? Wie koche ich Kartoffeln? 10 Fragen, die jeder Anfänger stellt …",
    kommentar: "Das Modell setzt Text fort, wie er im Internet vorkommt. Es antwortet nicht.",
  },
  {
    icon: MessagesSquare,
    name: "Feinschliff mit Beispielen",
    was: "Zehntausende vorbildliche Frage-Antwort-Paare, von Menschen geschrieben.",
    dauer: "Tage",
    antwort: "Bring Wasser mit Salz zum Kochen, gib die Nudeln hinein und koche sie nach Packungsangabe, meist 8 bis 10 Minuten.",
    kommentar: "Jetzt verhält es sich wie ein Assistent: Frage rein, Antwort raus.",
  },
  {
    icon: ThumbsUp,
    name: "Rückmeldung",
    was: "Menschen vergleichen zwei Antworten und wählen die bessere. Das Modell lernt, was gut ankommt.",
    dauer: "Wochen",
    antwort: "Für 100 g Nudeln etwa 1 Liter Wasser und einen Teelöffel Salz. Nach Packungsangabe kochen, eine Minute vorher probieren. Tipp: etwas Kochwasser für die Soße aufheben.",
    kommentar: "Hilfreicher, höflicher, vorsichtiger. Aber auch: Es lernt, zu gefallen, und widerspricht manchmal zu wenig.",
  },
  {
    icon: Calculator,
    name: "Üben an prüfbaren Aufgaben",
    was: "Seit 2024: Mathe, Code, Logik. Richtig oder falsch lässt sich automatisch prüfen, das Modell übt das Nachdenken.",
    dauer: "Wochen",
    antwort: "(denkt erst nach, rechnet Mengen für 4 Personen, prüft) … 400 g Nudeln, 4 Liter Wasser, 4 TL Salz …",
    kommentar: "Daraus entstehen die Reasoning-Modelle, die vor der Antwort Zwischenschritte machen.",
  },
];

export default function Training() {
  const captions = [
    <p key={0}>Ein Sprachmodell wird nicht programmiert, sondern <strong>trainiert</strong>, in mehreren Phasen. Wir stellen nach jeder Phase dieselbe Frage.</p>,
    ...PHASEN.map((p, i) => (
      <p key={i + 1}>
        <strong>{p.name}:</strong> {p.kommentar}
      </p>
    )),
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Das Wissen stammt aus dem Vortraining und hat einen Stichtag. Danach weiß das Modell nichts, außer es sucht im Web.</li>
        <li>Das freundliche Verhalten ist antrainiert. Freundlich heißt nicht richtig.</li>
        <li>Bitte ausdrücklich um Widerspruch, wenn du eine ehrliche Einschätzung willst.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => {
        const aktiv = step - 1;
        return (
          <div className="grid gap-4">
            <ol className="grid gap-2 sm:grid-cols-4">
              {PHASEN.map((p, i) => {
                const Icon = p.icon;
                const erreicht = i <= aktiv;
                return (
                  <li
                    key={p.name}
                    className={`relative rounded-lg border p-3 transition-colors ${i === aktiv ? "border-input bg-brand-soft" : erreicht ? "border-border bg-card" : "border-dashed border-border bg-card/50 text-muted-foreground"}`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-4 w-4" strokeWidth={1.75} /> Phase {i + 1}
                    </div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    {i < PHASEN.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-ink-subtle sm:block" strokeWidth={1.75} />}
                  </li>
                );
              })}
            </ol>
            {aktiv >= 0 && aktiv < PHASEN.length && (
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-1 text-sm text-muted-foreground">{PHASEN[aktiv].was}</div>
                <div className="mb-4 text-xs text-ink-subtle">Aufwand: {PHASEN[aktiv].dauer}</div>
                <div className="mb-1 text-xs font-semibold text-muted-foreground">Frage</div>
                <p className="mb-3 font-mono text-sm">Wie koche ich Nudeln?</p>
                <div className="mb-1 text-xs font-semibold text-muted-foreground">Antwort nach dieser Phase</div>
                <p className="rounded-md bg-muted p-3 font-mono text-sm leading-relaxed">{PHASEN[aktiv].antwort}</p>
              </div>
            )}
            {step === 0 && (
              <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">Vier Phasen, von links nach rechts. Mit „Weiter“ startest du die erste.</div>
            )}
            {step === PHASEN.length + 1 && (
              <div className="rounded-lg border border-border bg-card p-5 text-sm">
                <strong>Wissensstand</strong> = Stand des Vortrainings. Alles danach kommt nur über Websuche, Dateien oder deinen Prompt ins Modell.
              </div>
            )}
          </div>
        );
      }}
    </StepPlayer>
  );
}
