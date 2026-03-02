import { CheckCircle2, Lightbulb, AlertCircle, BookOpen } from "lucide-react";

export const ResourcesSection = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Ressourcen & Best Practices
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Checklisten, Tipps und Wissenswertes für effektives Prompting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Checkliste für gute Prompts */}
        <div className="bg-gradient-card rounded-xl p-5 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">
              Checkliste für gute Prompts
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary text-sm">✓</div>
              <div>
                <p className="font-medium text-sm">Kontext bereitstellen</p>
                <p className="text-xs text-muted-foreground">Gib alle relevanten Rahmenbedingungen an</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary text-sm">✓</div>
              <div>
                <p className="font-medium text-sm">Spezifisch sein</p>
                <p className="text-xs text-muted-foreground">Je präziser die Anfrage, desto besser das Ergebnis</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary text-sm">✓</div>
              <div>
                <p className="font-medium text-sm">Einschränkungen definieren</p>
                <p className="text-xs text-muted-foreground">Länge, Format, Stil oder Zielgruppe angeben</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary text-sm">✓</div>
              <div>
                <p className="font-medium text-sm">Beispiele nutzen</p>
                <p className="text-xs text-muted-foreground">Zeige der KI, wie das Ergebnis aussehen soll</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-primary text-sm">✓</div>
              <div>
                <p className="font-medium text-sm">Rolle zuweisen</p>
                <p className="text-xs text-muted-foreground">Lass die KI als Experte agieren</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tipps für bessere Ergebnisse */}
        <div className="bg-gradient-card rounded-xl p-5 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">
              Profi-Tipps
            </h3>
          </div>

          <div className="space-y-2">
            <div>
              <p className="font-medium text-sm">🎯 Iterativ vorgehen</p>
              <p className="text-xs text-muted-foreground">
                Verfeinere deine Prompts basierend auf den Antworten der KI
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">🔄 Nachfragen stellen</p>
              <p className="text-xs text-muted-foreground">
                Bitte um Klarstellungen oder zusätzliche Details
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">📝 Struktur vorgeben</p>
              <p className="text-xs text-muted-foreground">
                Fordere Aufzählungen, Tabellen oder spezifische Formate
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">🎨 Ton & Stil bestimmen</p>
              <p className="text-xs text-muted-foreground">
                Formal, freundlich, technisch – gib den gewünschten Ton an
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">🔍 Quellen anfordern</p>
              <p className="text-xs text-muted-foreground">
                Bitte um Begründungen oder Quellenangaben für Fakten
              </p>
            </div>
          </div>
        </div>

        {/* Häufige Fehler vermeiden */}
        <div className="bg-gradient-card rounded-xl p-5 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-destructive/10 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <h3 className="text-lg font-bold">
              Häufige Fehler vermeiden
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">✗</div>
              <div>
                <p className="font-medium text-sm">Zu vage Anfragen</p>
                <p className="text-xs text-muted-foreground">„Erzähl mir was über KI" ist zu unspezifisch</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">✗</div>
              <div>
                <p className="font-medium text-sm">Fehlender Kontext</p>
                <p className="text-xs text-muted-foreground">Die KI kennt deine Situation nicht – erkläre sie</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">✗</div>
              <div>
                <p className="font-medium text-sm">Zu komplexe Anfragen</p>
                <p className="text-xs text-muted-foreground">Teile große Aufgaben in kleinere Schritte auf</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">✗</div>
              <div>
                <p className="font-medium text-sm">Annahmen treffen</p>
                <p className="text-xs text-muted-foreground">Die KI kann nicht erraten, was du implizit meinst</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wissenswertes */}
        <div className="bg-gradient-card rounded-xl p-5 shadow-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold">
              Wissenswertes
            </h3>
          </div>

          <div className="space-y-2">
            <div>
              <p className="font-medium text-sm">💡 Chain-of-Thought</p>
              <p className="text-xs text-muted-foreground">
                Bitte die KI, Schritt für Schritt zu denken und zu erklären
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">🎭 Few-Shot Learning</p>
              <p className="text-xs text-muted-foreground">
                Gib 2-3 Beispiele, damit die KI das Muster versteht
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">🔄 Prompt-Templates</p>
              <p className="text-xs text-muted-foreground">
                Erstelle wiederverwendbare Vorlagen für häufige Aufgaben
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">⚖️ Temperatur-Konzept</p>
              <p className="text-xs text-muted-foreground">
                Höhere Temperatur = kreativer, niedrigere = präziser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Rules Banner */}
      <div className="mt-4 bg-gradient-card rounded-xl p-5 text-center shadow-lg border border-border">
        <h4 className="text-lg font-bold mb-1 text-foreground">
          Die goldene Regel des Promptings
        </h4>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Je mehr relevanter Kontext und je spezifischer deine Anfrage, desto besser und nützlicher wird die Antwort der KI sein.
        </p>
      </div>
    </section>
  );
};
