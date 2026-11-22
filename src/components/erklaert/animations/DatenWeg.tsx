import { useState } from "react";
import { StepPlayer } from "../StepPlayer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Keyboard, Lock, Server, Database, Brain, Trash2 } from "lucide-react";

/**
 * Erklär-Animation 15: Wohin gehen meine Daten?
 * Bewusst allgemein formuliert: Die Details hängen von Anbieter, Tarif und Einstellungen ab.
 */

export default function DatenWeg() {
  const [beruf, setBeruf] = useState(false);

  const stationen = [
    { icon: Keyboard, name: "Deine Eingabe", text: "Text, Dateien, Bilder, Spracheingaben" },
    { icon: Lock, name: "Übertragung", text: "Verschlüsselt über das Internet" },
    { icon: Server, name: "Server des Anbieters", text: beruf ? "Oft wählbar, z. B. Rechenzentren in der EU" : "Häufig in den USA" },
    { icon: Database, name: "Speicherung", text: beruf ? "Nach Vertrag und Admin-Einstellungen" : "Chatverlauf bleibt gespeichert, bis du ihn löschst" },
    { icon: Brain, name: "Training", text: beruf ? "In Geschäftstarifen in der Regel ausgeschlossen" : "Je nach Anbieter möglich, oft in den Einstellungen abschaltbar" },
    { icon: Trash2, name: "Löschen", text: beruf ? "Fristen regelt der Vertrag" : "Gelöschte Chats werden nach einer Frist entfernt" },
  ];

  const captions = [
    <p key={0}>Was passiert mit dem, was du eintippst? Wir verfolgen den Weg Station für Station. Mit dem Schalter wechselst du zwischen privatem Konto und Geschäftstarif.</p>,
    <p key={1}>Alles, was du eingibst oder hochlädst, wird an den Anbieter geschickt. Auch Dateinamen und Bildinhalte.</p>,
    <p key={2}>Die Übertragung ist verschlüsselt. Unterwegs liest niemand mit, beim Anbieter aber liegen die Daten im Klartext vor.</p>,
    <p key={3}>Wo die Server stehen, entscheidet mit, welches Recht gilt. Für den Beruf zählt: Gibt es einen Vertrag zur Auftragsverarbeitung?</p>,
    <p key={4}>Chats werden gespeichert, damit du sie wiederfindest. Das Gedächtnis kann zusätzlich Fakten über dich behalten.</p>,
    <p key={5}>Ob deine Eingaben zum Training künftiger Modelle genutzt werden, hängt von Anbieter, Tarif und Einstellungen ab. Prüf das in den Datenschutzeinstellungen.</p>,
    <>
      <p><strong>Faustregeln:</strong></p>
      <ol className="ml-5 list-decimal space-y-2">
        <li>Keine personenbezogenen oder vertraulichen Daten in private KI-Konten.</li>
        <li>Im Beruf nur Werkzeuge und Tarife nutzen, die dein Betrieb freigegeben hat.</li>
        <li>Namen, Adressen, Aktenzeichen vor dem Einfügen ersetzen.</li>
      </ol>
    </>,
  ];

  return (
    <StepPlayer
      captions={captions}
      controls={() => (
        <div className="flex items-center gap-3">
          <Switch id="beruf" checked={beruf} onCheckedChange={setBeruf} />
          <Label htmlFor="beruf" className="text-sm">{beruf ? "Geschäftstarif (Team, Business, Enterprise)" : "Privates Konto"}</Label>
        </div>
      )}
    >
      {(step) => (
        <div className="grid gap-3">
          {stationen.map((s, i) => {
            const Icon = s.icon;
            const sichtbar = step >= i + 1 || step === 0 || step === stationen.length + 1;
            const aktiv = step === i + 1;
            return (
              <div
                key={s.name}
                className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-500 motion-reduce:transition-none ${
                  !sichtbar ? "opacity-20" : aktiv ? "border-input bg-brand-soft" : "border-border bg-card"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${aktiv ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.text}</div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground">Allgemeine Übersicht, keine Rechtsberatung. Einzelheiten stehen in den Bedingungen des jeweiligen Anbieters.</p>
        </div>
      )}
    </StepPlayer>
  );
}
