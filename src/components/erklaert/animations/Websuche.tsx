import { StepPlayer } from "../StepPlayer";
import { Search, FileText, AlertTriangle, ExternalLink } from "lucide-react";

/** Erklär-Animation 8: Websuche und Quellen. Wie aktuelles Wissen in die Antwort kommt. */

const FRAGE = "Welche Förderprogramme gibt es 2026 für Balkonkraftwerke in Baden-Württemberg?";
const SUCHEN = ["Förderung Balkonkraftwerk Baden-Württemberg 2026", "Balkonkraftwerk Zuschuss Stadt 2026", "Steckersolargerät Förderprogramm BW"];
const TREFFER = [
  { titel: "Landesportal: Förderprogramme Energie", art: "amtlich, aktualisiert Okt. 2026", gut: true },
  { titel: "Stadtwerke-Blog: Jetzt 200 € sichern!", art: "Werbung, Stand 2024", gut: false },
  { titel: "Verbraucherzentrale: Balkonkraftwerke", art: "unabhängig, aktualisiert 2026", gut: true },
];

export default function Websuche() {
  const captions = [
    <p key={0}>Das Wissen eines Modells endet mit seinem Training. Für Aktuelles muss es <strong>im Web nachsehen</strong>.</p>,
    <p key={1}>Das Modell formuliert selbst <strong>Suchanfragen</strong>, oft mehrere. Du siehst sie meist, wenn du die Details aufklappst.</p>,
    <p key={2}>Die Suchmaschine liefert Treffer. Das Modell <strong>liest einige Seiten</strong> und legt den Text in seinen Kontext.</p>,
    <>
      <p>Nicht jede Quelle ist gut. Ein veralteter Werbe-Blog landet genauso im Kontext wie das Landesportal.</p>
      <p>Das Modell gewichtet das nicht immer richtig.</p>
    </>,
    <p key={4}>Die Antwort nennt <strong>Quellen</strong> mit Nummern. Das macht sie prüfbar, aber noch nicht richtig.</p>,
    <>
      <p><strong>Für dich heißt das:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>ChatGPT und Claude suchen bei Aktuellem meist selbst. Prüf an den Quellen-Links, ob gesucht wurde, sonst Suche einschalten.</li>
        <li>Mindestens zwei Quellen öffnen: Stimmt die Aussage? Wie alt ist die Seite? Wer steht dahinter?</li>
        <li>Deep Research macht das in größerem Stil: viele Suchen, viele Seiten, ein Bericht. Die Prüfung bleibt bei dir.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer captions={captions}>
      {(step) => (
        <div className="grid gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">Frage</div>
            <p className="text-lg">{FRAGE}</p>
          </div>
          {step >= 1 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 text-sm font-semibold">Suchanfragen des Modells</div>
              <ul className="grid gap-1">
                {SUCHEN.map((s) => (
                  <li key={s} className="flex items-center gap-2 font-mono text-sm">
                    <Search className="h-4 w-4 text-ink-subtle" strokeWidth={1.75} /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step >= 2 && step < 4 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {TREFFER.map((t) => (
                <div key={t.titel} className={`rounded-lg border p-3 text-sm ${step === 3 && !t.gut ? "border-warning bg-warning-soft" : "border-border bg-card"}`}>
                  <div className="mb-1 flex items-center gap-1.5 font-semibold">
                    {step === 3 && !t.gut ? <AlertTriangle className="h-4 w-4 text-warning" strokeWidth={1.75} /> : <FileText className="h-4 w-4 text-ink-subtle" strokeWidth={1.75} />}
                    gelesen
                  </div>
                  <div>{t.titel}</div>
                  <div className="text-xs text-muted-foreground">{t.art}</div>
                </div>
              ))}
            </div>
          )}
          {step >= 4 && (
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-2 text-sm font-semibold">Antwort</div>
              <p className="text-sm leading-relaxed">
                Das Land fördert Steckersolargeräte derzeit nicht direkt [1]. Einige Städte zahlen Zuschüsse, meist 100 bis 200 € [2]. Ein Bonus von 200 € der Stadtwerke [3] ist nach meinen Quellen ausgelaufen.
              </p>
              <ol className="mt-3 grid gap-1 text-xs text-brand-ink">
                {TREFFER.map((t, i) => (
                  <li key={t.titel} className="flex items-center gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} /> [{i + 1}] {t.titel}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Beispiel mit ausgedachten Inhalten, um das Prinzip zu zeigen.</p>
        </div>
      )}
    </StepPlayer>
  );
}
