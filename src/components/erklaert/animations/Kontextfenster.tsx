import { StepPlayer } from "../StepPlayer";
import { Brain } from "lucide-react";

/** Erklär-Animation 6: Kontextfenster und Gedächtnis. Was ins Fenster nicht mehr passt, sieht das Modell nicht. */

const NACHRICHTEN = [
  { wer: "du", text: "Ich heiße Lea. Bitte duze mich und antworte kurz.", wichtig: true },
  { wer: "ki", text: "Klar, Lea. Worum geht es?" },
  { wer: "du", text: "Ich plane ein Sommerfest für 60 Leute im Garten." },
  { wer: "ki", text: "Gern. Hier ein erster Zeitplan …" },
  { wer: "du", text: "Hier ist die Excel-Liste mit allen Anmeldungen (lang)." },
  { wer: "ki", text: "Ich habe 58 Anmeldungen gezählt, davon 12 vegetarisch …" },
  { wer: "du", text: "Schreib jetzt die Einladung." },
];

/** Größe jeder Nachricht in „Fenster-Einheiten“, Fenster fasst 10. */
const GROESSE = [1, 1, 1, 2, 4, 2, 1];
const FENSTER = 10;

/** Ab welchem Index passt alles bis zur Nachricht `bis` noch ins Fenster? */
function sichtbarAb(bis: number) {
  let summe = 0;
  for (let i = bis; i >= 0; i--) {
    summe += GROESSE[i];
    if (summe > FENSTER) return i + 1;
  }
  return 0;
}

export default function Kontextfenster() {
  const n = NACHRICHTEN.length;
  const captions = [
    <p key={0}>Ein Modell liest bei jeder Antwort den ganzen Chat noch einmal. Aber nur so viel, wie in sein <strong>Kontextfenster</strong> passt. Heute sind das je nach Modell einige hundert bis über tausend Buchseiten.</p>,
    <p key={1}>Lea stellt sich vor und legt fest, wie sie angesprochen werden will.</p>,
    <p key={2}>Der Chat wächst. Noch passt alles ins Fenster.</p>,
    <p key={3}>Eine lange Datei füllt das Fenster schnell.</p>,
    <>
      <p>Jetzt ist das Fenster voll. <strong>Die ältesten Nachrichten fallen heraus</strong>, je nach App werden sie gekürzt oder zusammengefasst.</p>
      <p>Die Bitte, kurz zu antworten und zu duzen, sieht das Modell nicht mehr. Die Einladung kommt lang und förmlich.</p>
    </>,
    <>
      <p>Das <strong>Gedächtnis</strong> ist etwas anderes: Die App speichert einzelne Fakten außerhalb des Chats und legt sie in jeden neuen Chat wieder oben hinein.</p>
      <p>Du kannst es in den Einstellungen ansehen, bearbeiten und abschalten.</p>
    </>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Neues Thema, neuer Chat.</li>
        <li>Wichtige Regeln gehören in eigene Anweisungen oder ein Projekt, nicht an den Anfang eines langen Chats.</li>
        <li>Bei sehr langen Chats: um eine Zusammenfassung bitten und damit neu starten.</li>
      </ol>
    </>,
  ];

  const bisFuer = (step: number) => (step <= 0 ? -1 : step === 1 ? 1 : step === 2 ? 3 : step === 3 ? 5 : n - 1);

  return (
    <StepPlayer captions={captions}>
      {(step) => {
        const bis = bisFuer(step);
        const ab = bis >= 0 ? sichtbarAb(bis) : 0;
        const belegt = bis >= 0 ? GROESSE.slice(ab, bis + 1).reduce((a, b) => a + b, 0) : 0;
        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">Kontextfenster</span>
                <span className="tabular-nums text-muted-foreground">{belegt} / {FENSTER} belegt</span>
              </div>
              <div className="flex h-4 overflow-hidden rounded-md bg-muted">
                <div className={`h-full transition-all duration-500 ${belegt >= FENSTER ? "bg-warning" : "bg-chart-2"}`} style={{ width: `${(belegt / FENSTER) * 100}%` }} />
              </div>
            </div>
            <ul className="grid gap-2">
              {NACHRICHTEN.slice(0, bis + 1).map((m, i) => {
                const raus = i < ab;
                return (
                  <li
                    key={i}
                    className={`rounded-lg border p-3 text-sm transition-opacity ${raus ? "border-dashed border-border opacity-40" : m.wichtig ? "border-input bg-brand-soft" : "border-border bg-card"} ${m.wer === "du" ? "mr-10" : "ml-10"}`}
                  >
                    <span className="mr-2 text-xs font-semibold text-muted-foreground">{m.wer === "du" ? "Lea" : "KI"}</span>
                    <span className={raus ? "line-through" : ""}>{m.text}</span>
                    {raus && <span className="ml-2 text-xs text-ink-subtle">(nicht mehr im Fenster)</span>}
                  </li>
                );
              })}
            </ul>
            {step >= 5 && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <Brain className="mt-0.5 h-5 w-5 shrink-0 text-brand-ink" strokeWidth={1.75} />
                <div className="text-sm">
                  <div className="font-semibold">Gedächtnis (gespeichert, chatübergreifend)</div>
                  <div className="text-muted-foreground">Heißt Lea · möchte geduzt werden · plant Sommerfest</div>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </StepPlayer>
  );
}
