import { StepPlayer } from "../StepPlayer";

/** Erklär-Animation 10: Wie Bilder entstehen. Schrittweise Rauschen entfernen, gesteuert vom Text. */

const N = 24;
const PROMPT = "Sonnenuntergang über grünen Hügeln am See, Aquarell";

const FARBE = {
  himmel: "hsl(var(--chart-2) / 0.35)",
  sonne: "hsl(var(--warning))",
  huegel: "hsl(var(--success))",
  huegel2: "hsl(var(--chart-5))",
  see: "hsl(var(--chart-2))",
};
const RAUSCH = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--foreground))", "hsl(var(--card))"];

function ziel(x: number, y: number) {
  const sx = 16, sy = 7;
  if ((x + 0.5 - sx) ** 2 + (y + 0.5 - sy) ** 2 <= 10) return FARBE.sonne;
  if (y >= 19) return FARBE.see;
  const h1 = 13 + 3 * Math.sin((x + 2) / 4);
  const h2 = 15 + 2 * Math.sin((x + 9) / 3);
  if (y >= h2) return FARBE.huegel2;
  if (y >= h1) return FARBE.huegel;
  return FARBE.himmel;
}

/** Deterministisches Pseudo-Zufallsrauschen je Zelle und Start-Seed. */
function zufall(i: number, seed: number) {
  const s = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

const ANTEIL = [0, 0, 0.25, 0.5, 0.75, 1, 1];

export default function Diffusion() {
  const captions = [
    <p key={0}>Bildmodelle starten nicht mit einer leeren Leinwand, sondern mit <strong>reinem Rauschen</strong>: zufällige Farbpunkte.</p>,
    <p key={1}>Dazu kommt dein <strong>Prompt</strong>. Er wird in Zahlen übersetzt und gibt die Richtung vor.</p>,
    <p key={2}>In jedem Schritt schätzt das Modell: Welcher Teil davon ist Rauschen? Und <strong>entfernt ein Stück davon</strong>, passend zum Prompt.</p>,
    <p key={3}>Grobe Formen tauchen zuerst auf: Himmel oben, Hügel unten.</p>,
    <p key={4}>Dann kommen Details: Sonne, Uferlinie, Farbverläufe.</p>,
    <p key={5}>Nach 20 bis 50 Schritten ist das Bild fertig. Gelernt hat das Modell das an Millionen Bildern mit Beschreibung.</p>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Anderes Startrauschen, anderes Bild. Darum sieht jeder Versuch anders aus.</li>
        <li>Je genauer der Prompt (Subjekt, Szene, Setting, Stil), desto mehr Kontrolle.</li>
        <li>Neuere Modelle können ein Bild auch im Gespräch ändern: „Mach den Himmel dunkler“.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => {
        const anteil = ANTEIL[step];
        return (
          <div className="grid gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 text-xs font-semibold text-muted-foreground">Prompt</div>
              <p className={`font-mono text-sm transition-opacity ${step >= 1 ? "" : "opacity-30"}`}>{PROMPT}</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5">
              <div className="grid aspect-square w-full max-w-sm overflow-hidden rounded-md" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }} aria-label="Bild entsteht aus Rauschen">
                {Array.from({ length: N * N }, (_, i) => {
                  const x = i % N, y = Math.floor(i / N);
                  const fertig = zufall(i, 3) < anteil;
                  const farbe = fertig ? ziel(x, y) : RAUSCH[Math.floor(zufall(i, 7) * RAUSCH.length)];
                  return <div key={i} className="transition-colors duration-700 motion-reduce:transition-none" style={{ background: farbe }} />;
                })}
              </div>
              <div className="text-sm tabular-nums text-muted-foreground">Rauschen entfernt: {Math.round(anteil * 100)} %</div>
            </div>
          </div>
        );
      }}
    </StepPlayer>
  );
}
