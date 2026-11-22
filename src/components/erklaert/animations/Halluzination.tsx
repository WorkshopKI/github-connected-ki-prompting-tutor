import { StepPlayer, ProbBar } from "../StepPlayer";
import { AlertTriangle, Link2 } from "lucide-react";

/** Erklär-Animation 12: Halluzination. Ohne Wissen füllt das Modell die Lücke mit dem Plausiblen. */

const FRAGE = "Wer hat 2025 den Ehrenamtspreis der Gemeinde Lindenfeld bekommen?";

export default function Halluzination() {
  const captions = [
    <p key={0}>Eine Frage zu einem kleinen, lokalen Ereignis. Darüber steht kaum etwas im Internet, also auch kaum etwas in den Trainingsdaten.</p>,
    <>
      <p>Das Modell <strong>muss trotzdem ein nächstes Wort wählen</strong>. Bei Namen gibt es keinen klaren Favoriten: Die Wahrscheinlichkeiten sind flach.</p>
      <p>Es nimmt trotzdem eines, das gut klingt.</p>
    </>,
    <>
      <p>Heraus kommt eine <strong>flüssige, überzeugte Antwort</strong>. Name, Begründung, sogar ein Zitat. Alles erfunden.</p>
      <p>Der Ton verrät nichts: Falsches klingt genauso sicher wie Richtiges.</p>
    </>,
    <>
      <p>Mit <strong>Websuche</strong> kann das Modell nachsehen. Findet es eine Quelle, stützt es sich darauf und verlinkt sie.</p>
      <p>Findet es nichts, sagt ein gutes Modell das auch. Prüf den Link trotzdem.</p>
    </>,
    <>
      <p><strong>Merksätze:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Je spezieller, lokaler oder neuer die Frage, desto größer das Risiko.</li>
        <li>Quellen verlangen und stichprobenartig öffnen.</li>
        <li>Bei Wichtigem: zweite Quelle oder Fachperson.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">Frage</div>
            <p className="text-xl">{FRAGE}</p>
          </div>
          {step === 1 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 text-sm font-semibold">Wahrscheinlichkeiten für den Namen</div>
              <div className="grid gap-2">
                <ProbBar label="Maria" value={9} max={12} />
                <ProbBar label="Thomas" value={8} max={12} />
                <ProbBar label="Anna" value={8} max={12} />
                <ProbBar label="Peter" value={7} max={12} />
                <ProbBar label="übrige" value={68} max={68} muted />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Kein klarer Favorit: Das Modell „weiß“ es nicht, schreibt aber trotzdem weiter.</p>
            </div>
          )}
          {step >= 2 && step !== 3 && step < 4 && (
            <div className="rounded-lg border border-destructive/50 bg-card p-5">
              <p className="text-base leading-relaxed">
                Den Ehrenamtspreis 2025 der Gemeinde Lindenfeld erhielt <strong>Maria Hoffmann</strong> für ihr langjähriges Engagement in der Lindenfelder Tafel. Bürgermeister Klaus Berger lobte sie als „Herz unserer Gemeinde“.
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="h-4 w-4" /> Name, Verein, Bürgermeister und Zitat sind erfunden.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-lg border border-input bg-card p-5">
              <p className="text-base leading-relaxed">
                Ich habe auf der Website der Gemeinde eine Meldung vom März 2025 gefunden. Dort wird der Preis erwähnt, der Name der Preisträgerin steht aber nur in einem PDF, das ich nicht öffnen konnte. Bitte prüf dort:
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm text-brand-ink">
                <Link2 className="h-4 w-4" /> lindenfeld.example/aktuelles/ehrenamtspreis-2025
              </p>
            </div>
          )}
          {step === 4 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-destructive/50 bg-card p-4 text-sm"><strong>Ohne Quelle:</strong> flüssig, sicher, falsch.</div>
              <div className="rounded-lg border border-input bg-card p-4 text-sm"><strong>Mit Quelle:</strong> vorsichtiger, nachprüfbar.</div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Gemeinde und Personen sind ausgedacht, um das Prinzip zu zeigen.</p>
        </div>
      )}
    </StepPlayer>
  );
}
