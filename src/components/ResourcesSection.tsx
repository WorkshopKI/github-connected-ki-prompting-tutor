import { CheckCircle2, Lightbulb, AlertCircle, BookOpen } from "lucide-react";

export const ResourcesSection = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ressourcen & Best Practices
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Checklisten, Tipps und Wissenswertes für effektives Prompting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Checkliste für gute Prompts */}
        <div className="bg-gradient-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Checkliste für gute Prompts
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">✓</div>
              <div>
                <p className="font-medium">Kontext bereitstellen</p>
                <p className="text-sm text-muted-foreground">Gib alle relevanten Rahmenbedingungen an</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">✓</div>
              <div>
                <p className="font-medium">Spezifisch sein</p>
                <p className="text-sm text-muted-foreground">Je präziser die Anfrage, desto besser das Ergebnis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">✓</div>
              <div>
                <p className="font-medium">Einschränkungen definieren</p>
                <p className="text-sm text-muted-foreground">Länge, Format, Stil oder Zielgruppe angeben</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">✓</div>
              <div>
                <p className="font-medium">Beispiele nutzen</p>
                <p className="text-sm text-muted-foreground">Zeige der KI, wie das Ergebnis aussehen soll</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">✓</div>
              <div>
                <p className="font-medium">Rolle zuweisen</p>
                <p className="text-sm text-muted-foreground">Lass die KI als Experte agieren</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tipps für bessere Ergebnisse */}
        <div className="bg-gradient-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Profi-Tipps
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">🎯 Iterativ vorgehen</p>
              <p className="text-sm text-muted-foreground">
                Verfeinere deine Prompts basierend auf den Antworten der KI
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🔄 Nachfragen stellen</p>
              <p className="text-sm text-muted-foreground">
                Bitte um Klarstellungen oder zusätzliche Details
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">📝 Struktur vorgeben</p>
              <p className="text-sm text-muted-foreground">
                Fordere Aufzählungen, Tabellen oder spezifische Formate
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🎨 Ton & Stil bestimmen</p>
              <p className="text-sm text-muted-foreground">
                Formal, freundlich, technisch – gib den gewünschten Ton an
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🔍 Quellen anfordern</p>
              <p className="text-sm text-muted-foreground">
                Bitte um Begründungen oder Quellenangaben für Fakten
              </p>
            </div>
          </div>
        </div>

        {/* Häufige Fehler vermeiden */}
        <div className="bg-gradient-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-destructive/10 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Häufige Fehler vermeiden
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-destructive">✗</div>
              <div>
                <p className="font-medium">Zu vage Anfragen</p>
                <p className="text-sm text-muted-foreground">„Erzähl mir was über KI" ist zu unspezifisch</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-destructive">✗</div>
              <div>
                <p className="font-medium">Fehlender Kontext</p>
                <p className="text-sm text-muted-foreground">Die KI kennt deine Situation nicht – erkläre sie</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-destructive">✗</div>
              <div>
                <p className="font-medium">Zu komplexe Anfragen</p>
                <p className="text-sm text-muted-foreground">Teile große Aufgaben in kleinere Schritte auf</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-destructive">✗</div>
              <div>
                <p className="font-medium">Annahmen treffen</p>
                <p className="text-sm text-muted-foreground">Die KI kann nicht erraten, was du implizit meinst</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wissenswertes */}
        <div className="bg-gradient-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold">
              Wissenswertes
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">💡 Chain-of-Thought</p>
              <p className="text-sm text-muted-foreground">
                Bitte die KI, Schritt für Schritt zu denken und zu erklären
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🎭 Few-Shot Learning</p>
              <p className="text-sm text-muted-foreground">
                Gib 2-3 Beispiele, damit die KI das Muster versteht
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">🔄 Prompt-Templates</p>
              <p className="text-sm text-muted-foreground">
                Erstelle wiederverwendbare Vorlagen für häufige Aufgaben
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">⚖️ Temperatur-Konzept</p>
              <p className="text-sm text-muted-foreground">
                Höhere Temperatur = kreativer, niedrigere = präziser
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Rules Banner */}
      <div className="mt-8 bg-gradient-card rounded-2xl p-6 md:p-8 text-center shadow-lg border border-border">
        <h4 className="text-xl md:text-2xl font-bold mb-3 text-foreground">
          Die goldene Regel des Promptings
        </h4>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Je mehr relevanter Kontext und je spezifischer deine Anfrage, desto besser und nützlicher wird die Antwort der KI sein.
        </p>
      </div>
    </section>
  );
};
