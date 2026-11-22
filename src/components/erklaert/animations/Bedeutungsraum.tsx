import { StepPlayer } from "../StepPlayer";

/** Erklär-Animation 13: Bedeutungsraum. Wörter als Punkte, Nähe heißt ähnliche Bedeutung. */

type Gruppe = "tier" | "verkehr" | "essen" | "person" | "bank";
const WOERTER: { w: string; x: number; y: number; g: Gruppe; ab: number }[] = [
  { w: "Hund", x: 15, y: 20, g: "tier", ab: 1 },
  { w: "Katze", x: 22, y: 14, g: "tier", ab: 1 },
  { w: "Pferd", x: 10, y: 28, g: "tier", ab: 1 },
  { w: "Auto", x: 78, y: 18, g: "verkehr", ab: 1 },
  { w: "Bus", x: 86, y: 26, g: "verkehr", ab: 1 },
  { w: "Fahrrad", x: 72, y: 30, g: "verkehr", ab: 1 },
  { w: "Apfel", x: 20, y: 75, g: "essen", ab: 1 },
  { w: "Brot", x: 30, y: 82, g: "essen", ab: 1 },
  { w: "Käse", x: 14, y: 86, g: "essen", ab: 1 },
  { w: "Mann", x: 58, y: 62, g: "person", ab: 3 },
  { w: "Frau", x: 58, y: 82, g: "person", ab: 3 },
  { w: "König", x: 80, y: 56, g: "person", ab: 3 },
  { w: "Königin", x: 80, y: 76, g: "person", ab: 3 },
  { w: "Bank (Geld)", x: 46, y: 40, g: "bank", ab: 4 },
  { w: "Bank (Sitz)", x: 36, y: 56, g: "bank", ab: 4 },
];

const FARBE: Record<Gruppe, string> = {
  tier: "hsl(var(--chart-5))",
  verkehr: "hsl(var(--chart-2))",
  essen: "hsl(var(--chart-3))",
  person: "hsl(var(--chart-4))",
  bank: "hsl(var(--primary))",
};

export default function Bedeutungsraum() {
  const captions = [
    <p key={0}>Ein Modell rechnet nicht mit Wörtern, sondern mit <strong>Zahlenlisten</strong>. Jede Liste ist ein Punkt in einem Raum mit tausenden Richtungen. Wir zeigen ihn vereinfacht in zwei.</p>,
    <p key={1}>Wörter mit ähnlicher Bedeutung liegen <strong>nah beieinander</strong>: Tiere bei Tieren, Verkehrsmittel bei Verkehrsmitteln. Das hat niemand programmiert, es ergibt sich aus dem Training.</p>,
    <p key={2}>Nähe heißt: Diese Wörter kommen in ähnlichen Sätzen vor. „Ich füttere den Hund“ und „Ich füttere die Katze“.</p>,
    <p key={3}>Auch <strong>Beziehungen</strong> werden zu Richtungen. Der Weg von „Mann“ zu „Frau“ ähnelt dem von „König“ zu „Königin“.</p>,
    <p key={4}>Mehrdeutige Wörter wie <strong>„Bank“</strong> landen je nach Satz an anderer Stelle. Die Aufmerksamkeit schiebt sie dorthin, wo der Kontext passt.</p>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Das Modell versteht Bedeutung über Nähe, nicht über Definitionen.</li>
        <li>Darum findet es auch Synonyme und passende Umschreibungen.</li>
        <li>Fachbegriffe im Prompt ziehen die Antwort in den richtigen Bereich.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="rounded-lg border border-border bg-card p-4">
          <svg viewBox="0 0 100 100" className="aspect-square w-full max-h-[28rem]" role="img" aria-label="Wörter als Punkte im Bedeutungsraum">
            <defs>
              <marker id="pfeil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            {step >= 2 && step < 5 && (
              <g fill="none" stroke="hsl(var(--border))" strokeWidth="0.4" strokeDasharray="1.5 1">
                <ellipse cx="16" cy="21" rx="13" ry="12" />
                <ellipse cx="79" cy="24" rx="13" ry="11" />
                <ellipse cx="21" cy="81" rx="13" ry="10" />
              </g>
            )}
            {step >= 3 && (
              <g stroke="hsl(var(--primary))" strokeWidth="0.6" markerEnd="url(#pfeil)">
                <line x1="58" y1="64" x2="58" y2="79" />
                <line x1="80" y1="58" x2="80" y2="73" />
              </g>
            )}
            {step === 0 && WOERTER.map((p) => <circle key={p.w} cx={p.x} cy={p.y} r="1.4" fill="hsl(var(--muted-foreground) / 0.4)" />)}
            {WOERTER.filter((p) => step >= p.ab).map((p) => (
              <g key={p.w}>
                <circle cx={p.x} cy={p.y} r="1.6" fill={FARBE[p.g]} />
                <text x={p.x + 2.4} y={p.y + 1.2} fontSize="3.4" fill="hsl(var(--foreground))">{p.w}</text>
              </g>
            ))}
            {step >= 4 && (
              <g fontSize="2.8" fill="hsl(var(--muted-foreground))">
                <text x="46" y="36">„Geld abheben“</text>
                <text x="30" y="62">„im Park sitzen“</text>
              </g>
            )}
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">Vereinfachte Darstellung: Echte Modelle nutzen tausende Dimensionen.</p>
        </div>
      )}
    </StepPlayer>
  );
}
