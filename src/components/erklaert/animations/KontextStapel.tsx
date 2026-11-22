import { StepPlayer } from "../StepPlayer";

/** Erklär-Animation 11: Was das Modell wirklich sieht. Alles wird zu einem einzigen Text gestapelt. */

const SCHICHTEN = [
  { name: "Systemanweisung des Anbieters", beispiel: "Du bist ein hilfreicher Assistent. Heute ist der 22.11.2026 …", wer: "Anbieter", anteil: 8 },
  { name: "Deine eigenen Anweisungen", beispiel: "Ich arbeite als Lehrerin. Antworte knapp und auf Deutsch.", wer: "du, einmalig eingestellt", anteil: 4 },
  { name: "Gedächtnis", beispiel: "Nutzerin unterrichtet Klasse 7, Fächer Deutsch und Geschichte.", wer: "automatisch gemerkt", anteil: 4 },
  { name: "Projektdateien", beispiel: "Lehrplan_Geschichte_7.pdf, Elternbrief_Vorlage.docx", wer: "du, im Projekt abgelegt", anteil: 34 },
  { name: "Suchergebnisse", beispiel: "3 Webseiten zum Thema „Mittelalter im Unterricht“", wer: "Werkzeug, bei Bedarf", anteil: 26 },
  { name: "Bisheriger Chat", beispiel: "Deine letzten Fragen und die Antworten darauf", wer: "dieses Gespräch", anteil: 20 },
  { name: "Deine neue Frage", beispiel: "Schreib mir einen Elternbrief zum Ausflug ins Museum.", wer: "du, jetzt", anteil: 4 },
];

/* Eine Farbe in Abstufungen (Tinte, von dunkel nach hell); nur „Deine neue Frage“ in der Markenfarbe,
 * weil sie die Pointe ist. Unterscheidung zusätzlich über Nummern, nicht über Farbe allein. */
const DECKKRAFT = [0.86, 0.72, 0.6, 0.48, 0.38, 0.28];
const flaeche = (i: number) =>
  i === SCHICHTEN.length - 1 ? "hsl(var(--primary))" : `hsl(var(--foreground) / ${DECKKRAFT[i]})`;
const schrift = (i: number) => (i === SCHICHTEN.length - 1 || DECKKRAFT[i] >= 0.48 ? "text-primary-foreground" : "text-foreground");

function Marke({ i, klein }: { i: number; klein?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded font-semibold tabular-nums ${schrift(i)} ${klein ? "h-5 w-5 text-xs" : "mt-0.5 h-6 w-6 text-xs"}`}
      style={{ backgroundColor: flaeche(i) }}
      aria-hidden="true"
    >
      {i + 1}
    </span>
  );
}

export default function KontextStapel() {
  const captions = [
    <p key={0}>Du stellst eine kurze Frage. Was das Modell tatsächlich liest, ist viel mehr. Wir stapeln es Schicht für Schicht.</p>,
    ...SCHICHTEN.map((s, i) => (
      <p key={i + 1}>
        <strong>{s.name}</strong> ({s.wer}).{" "}
        {i === 0 && "Du siehst sie nicht, sie steht aber immer ganz oben."}
        {i === 1 && "Gilt für jeden Chat. Hier lohnt es sich, einmal sorgfältig zu formulieren."}
        {i === 2 && "Nützlich, aber prüf ab und zu, was gespeichert ist. Veraltetes kann Antworten verzerren."}
        {i === 3 && "Projekte bündeln Material zu einem Thema. So musst du es nicht jedes Mal neu hochladen."}
        {i === 4 && "Mit Websuche kommen fremde Texte dazu. Das Modell kann sie nicht von deinen Anweisungen unterscheiden, wenn sie wie Anweisungen klingen."}
        {i === 5 && "Lange Chats füllen den Kontext. Für ein neues Thema lieber einen neuen Chat beginnen."}
        {i === 6 && "Deine eigentliche Frage ist oft der kleinste Teil."}
      </p>
    )),
    <>
      <p><strong>Alles zusammen ist ein einziger Text.</strong> Das Modell sagt das nächste Wort auf Grundlage dieses ganzen Stapels vorher.</p>
      <p>Darum wirkt „Kontext gestalten“: Wer Anweisungen, Projekte und Dateien gut einrichtet, kann kurze Fragen stellen und bekommt trotzdem passende Antworten.</p>
    </>,
  ];
  const n = SCHICHTEN.length;

  return (
    <StepPlayer captions={captions}>
      {(step) => {
        const sichtbar = Math.min(step, n);
        const ende = step === n + 1;
        return (
          <div className="grid gap-4">
            <div className="grid gap-2">
              {SCHICHTEN.slice(0, sichtbar).map((s, i) => (
                <div
                  key={s.name}
                  className={`flex min-w-0 items-start gap-3 rounded-lg border p-3 transition-all motion-reduce:transition-none ${i === sichtbar - 1 && !ende ? "border-input bg-brand-soft" : "border-border bg-card"}`}
                >
                  <Marke i={i} />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <div className="truncate font-mono text-xs text-muted-foreground">{s.beispiel}</div>
                  </div>
                </div>
              ))}
              {sichtbar === 0 && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                  „Schreib mir einen Elternbrief zum Ausflug ins Museum.“
                </div>
              )}
            </div>
            {ende && (
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="mb-2 text-sm font-semibold">Anteil am Text, den das Modell liest (Beispiel)</div>
                <div className="flex h-9 gap-[2px] overflow-hidden rounded-md bg-card">
                  {SCHICHTEN.map((s, i) => (
                    <div
                      key={s.name}
                      className={`flex items-center justify-center text-xs font-semibold tabular-nums ${schrift(i)}`}
                      style={{ width: `${s.anteil}%`, backgroundColor: flaeche(i) }}
                      title={`${s.name}: ${s.anteil} %`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                  {SCHICHTEN.map((s, i) => (
                    <li key={s.name} className="flex items-center gap-2">
                      <Marke i={i} klein />
                      <span className={i === SCHICHTEN.length - 1 ? "font-semibold text-foreground" : undefined}>
                        {s.name} · ca. {s.anteil} %
                      </span>
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
