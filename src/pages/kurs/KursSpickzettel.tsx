import { KursLayout } from "@/components/kurs/KursLayout";
import { Printer } from "lucide-react";

const ACTA = [
  ["A", "Rolle", "Als wer soll die KI antworten?"],
  ["C", "Kontext", "Für wen, wozu, was es schon gibt"],
  ["T", "Aufgabe", "Was genau soll entstehen?"],
  ["A", "Ausgabe", "Format, Länge, Ton"],
];
const DISZIPLINEN = [
  ["1 Fragen", "Präzise fragen mit ACTA"],
  ["2 Gestalten", "Projekte, eigene Anweisungen, Skills"],
  ["3 Steuern", "Klares Ziel und „fertig, wenn …“ statt vieler Regeln"],
  ["4 Spezifizieren", "Erst Plan, dann Freigabe, dann ausführen"],
];
const PRUEFEN = ["Quelle öffnen, Datum ansehen", "Zahlen und Zitate nachprüfen", "Bei Wichtigem: zweite Quelle oder Fachperson", "Ton sagt nichts über Richtigkeit"];
const DATEN = ["Keine Namen, Adressen, Gesundheitsdaten in private KI-Konten", "Im Beruf nur freigegebene Tools", "Schwärzen: [NAME], [FIRMA], [DATUM]", "Training in den Einstellungen abschalten, wo möglich"];
const AGENTEN = ["Ziel, Material, Grenzen, „fertig, wenn …“", "Kaufen, senden, löschen bestätigst du selbst", "Zugriffe nur so weit wie nötig", "Webseiten können versteckte Anweisungen enthalten"];
const SAETZE = [
  "„Stell mir zuerst Rückfragen, falls etwas fehlt.“",
  "„Nenne für jede Angabe Quelle und Datum.“",
  "„Gib mir drei ganz unterschiedliche Varianten.“",
  "„Nenne fünf Schwächen deines Entwurfs.“",
  "„Erstell zuerst einen Plan und warte auf meine Freigabe.“",
];

function Block({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid rounded-lg border border-border bg-card p-4 print:p-4">
      <h2 className="eyebrow mb-2">{titel}</h2>
      {children}
    </section>
  );
}

const Liste = ({ items }: { items: string[] }) => (
  <ul className="ml-4 list-disc space-y-1 text-sm print:text-[13.5px]">{items.map((i) => <li key={i}>{i}</li>)}</ul>
);

export default function KursSpickzettel() {
  return (
    <KursLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 print:mb-3">
        <div>
          <div className="eyebrow mb-1">Spickzettel · KI-Werkstatt</div>
          <h1 className="page-title print:text-3xl">Mit KI arbeiten auf einer Seite</h1>
        </div>
        <button onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent print:hidden">
          <Printer className="h-4 w-4" strokeWidth={1.75} /> Drucken oder als PDF speichern
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 print:grid-cols-2 print:gap-3">
        <Block titel="ACTA: so fragst du präzise">
          <ul className="grid gap-1.5">
            {ACTA.map(([b, n, t], i) => (
              <li key={i} className="flex gap-3 text-sm print:text-[13.5px]">
                <span className="w-5 font-serif text-lg font-semibold text-brand-ink print:text-xl">{b}</span>
                <span><span className="font-semibold">{n}:</span> {t}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block titel="Vier Disziplinen">
          <ul className="grid gap-1.5 text-sm print:text-[13.5px]">
            {DISZIPLINEN.map(([n, t]) => <li key={n}><span className="font-semibold">{n}:</span> {t}</li>)}
          </ul>
        </Block>
        <Block titel="Ergebnisse prüfen"><Liste items={PRUEFEN} /></Block>
        <Block titel="Datenschutz"><Liste items={DATEN} /></Block>
        <Block titel="Agenten sicher einsetzen"><Liste items={AGENTEN} /></Block>
        <Block titel="Sätze, die fast immer helfen">
          <ul className="grid gap-1 font-mono text-[13px] print:text-[12px]">{SAETZE.map((s) => <li key={s}>{s}</li>)}</ul>
        </Block>
        <Block titel="Modell wählen">
          <p className="text-sm print:text-[13.5px]"><span className="font-semibold">Schnell</span> für Alltag, <span className="font-semibold">ausgewogen</span> für Beruf, <span className="font-semibold">stark</span> für Analysen und Agenten. Mit „schnell“ starten, bei Bedarf eine Stufe höher.</p>
        </Block>
        <Block titel="Weiter üben">
          <p className="text-sm print:text-[13.5px]">Lern-App: Kurs, Übungen, Vorlagen und „KI erklärt“. Padlet: t1p.de/tz-padlet</p>
        </Block>
      </div>
      <p className="mt-4 text-xs text-ink-subtle print:mt-2">Stand November 2026 · keine Rechtsberatung</p>
    </KursLayout>
  );
}
