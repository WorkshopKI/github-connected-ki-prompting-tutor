import { useState } from "react";
import { StepPlayer } from "../StepPlayer";
import { Eye, Fingerprint, ScanSearch, Scale } from "lucide-react";

/** Erklär-Animation 17: KI-Inhalte erkennen und kennzeichnen. Stand November 2026, keine Rechtsberatung. */

const WEGE = [
  { icon: Eye, name: "Hinsehen", text: "Seltsame Hände, verschwommene Schrift, zu glatte Haut, Floskeln im Text.", grenze: "Neue Modelle machen kaum noch solche Fehler. Unzuverlässig." },
  { icon: Fingerprint, name: "Unsichtbare Markierung", text: "Wasserzeichen im Bild oder Ton (z. B. SynthID) und Herkunftsdaten in der Datei (Content Credentials, C2PA).", grenze: "Gehen beim Abfotografieren oder Umwandeln oft verloren." },
  { icon: ScanSearch, name: "Erkennungs-Tools", text: "Programme, die schätzen, ob ein Text oder Bild von KI stammt.", grenze: "Viele Fehlalarme, besonders bei Texten. Nicht als Beweis nutzen." },
];

const FAELLE = [
  { frage: "Du lässt dir eine E-Mail von KI formulieren und schickst sie selbst ab.", antwort: "Keine Kennzeichnungspflicht. Du bist für den Inhalt verantwortlich." },
  { frage: "Dein Verein veröffentlicht ein täuschend echtes KI-Foto des Bürgermeisters bei einer erfundenen Szene.", antwort: "Kennzeichnen: Das ist ein Deepfake. Besser ganz lassen." },
  { frage: "Eure Website hat einen Chatbot, der Kundenfragen beantwortet.", antwort: "Kennzeichnen: Menschen müssen erkennen, dass sie mit einer KI sprechen." },
  { frage: "Du nutzt ein KI-Bild als erkennbare Illustration in einem Flyer.", antwort: "Meist keine Pflicht, wenn es offensichtlich künstlerisch ist. Ein Hinweis schafft trotzdem Vertrauen." },
];

export default function Kennzeichnung() {
  const [offen, setOffen] = useState<number | null>(null);
  const captions = [
    <p key={0}>KI-Texte, -Bilder und -Stimmen sind kaum noch von echten zu unterscheiden. Es gibt drei Wege, sie zu erkennen, und alle haben Grenzen.</p>,
    ...WEGE.map((w, i) => (
      <p key={i + 1}>
        <strong>{w.name}:</strong> {w.grenze}
      </p>
    )),
    <>
      <p>Darum setzt die EU auf <strong>Pflichten</strong> (KI-Verordnung, Artikel 50, gilt seit 2. August 2026):</p>
      <ul className="ml-5 list-disc space-y-1">
        <li>Anbieter markieren KI-Inhalte maschinenlesbar. Ältere Systeme haben bis 2. Dezember 2026 Zeit.</li>
        <li>Chatbots müssen sich als KI zu erkennen geben.</li>
        <li>Wer Deepfakes veröffentlicht, muss sie kennzeichnen.</li>
      </ul>
    </>,
    <>
      <p><strong>Was heißt das für dich?</strong> Klick die Fälle an.</p>
      <p className="text-sm text-muted-foreground">Vereinfachte Übersicht, keine Rechtsberatung. Im Beruf gelten zusätzlich die Regeln deines Betriebs.</p>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          {step <= WEGE.length && (
            <div className="grid gap-3 sm:grid-cols-3">
              {WEGE.map((w, i) => {
                const Icon = w.icon;
                const aktiv = step === i + 1;
                return (
                  <div key={w.name} className={`rounded-lg border p-4 transition-colors ${aktiv ? "border-input bg-brand-soft" : step > i ? "border-border bg-card" : "border-border bg-card opacity-60"}`}>
                    <Icon className="mb-2 h-5 w-5 text-brand-ink" strokeWidth={1.75} />
                    <div className="mb-1 font-semibold">{w.name}</div>
                    <p className="text-sm text-muted-foreground">{w.text}</p>
                    {step > i && <p className="mt-2 text-sm text-warning">{w.grenze}</p>}
                  </div>
                );
              })}
            </div>
          )}
          {step === WEGE.length + 1 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Scale className="h-5 w-5 text-brand-ink" strokeWidth={1.75} /> KI-Verordnung, Artikel 50
              </div>
              <ol className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Anbieter", "markieren KI-Inhalte technisch"],
                  ["Chatbots", "geben sich als KI zu erkennen"],
                  ["Wer Deepfakes veröffentlicht", "kennzeichnet sie sichtbar"],
                ].map(([a, b]) => (
                  <li key={a} className="rounded-md bg-muted p-3 text-sm">
                    <div className="font-semibold">{a}</div>
                    <div className="text-muted-foreground">{b}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {step === WEGE.length + 2 && (
            <div className="grid gap-2">
              {FAELLE.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setOffen(offen === i ? null : i)}
                  className="rounded-lg border border-border bg-card p-4 text-left transition-shadow hover:border-input hover:shadow-sm"
                  aria-expanded={offen === i}
                >
                  <div className="text-sm">{f.frage}</div>
                  {offen === i && <div className="mt-2 text-sm font-semibold text-brand-ink">{f.antwort}</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </StepPlayer>
  );
}
