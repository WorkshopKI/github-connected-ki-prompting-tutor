import { CheckCircle2, AlertCircle, Repeat, MessageCircleQuestion, LayoutList, Palette, FileSearch, Brain, BookCopy, LayoutTemplate, Thermometer, Lightbulb } from "lucide-react";

export const ResourcesSection = () => {
  return (
    <section className="mb-24">
      <div className="text-center mb-10">
        <span className="font-mono text-xs tracking-widest block mb-3" style={{ color: 'hsl(var(--primary-deep))' }}>05</span>
        <div className="w-10 h-0.5 mx-auto mb-4" style={{ backgroundColor: 'hsl(var(--primary-deep))' }} />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Ressourcen & Best Practices
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Checklisten und Tipps für effektives Prompting
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gute Prompts: Checkliste + Profi-Tipps */}
        <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-muted p-2.5 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold">Gute Prompts</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-foreground/60 text-sm">&#10003;</div>
              <div>
                <p className="font-medium text-sm">Kontext bereitstellen</p>
                <p className="text-xs text-muted-foreground">Gib alle relevanten Rahmenbedingungen an</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-foreground/60 text-sm">&#10003;</div>
              <div>
                <p className="font-medium text-sm">Spezifisch sein</p>
                <p className="text-xs text-muted-foreground">Je pr&auml;ziser die Anfrage, desto besser das Ergebnis</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-foreground/60 text-sm">&#10003;</div>
              <div>
                <p className="font-medium text-sm">Einschr&auml;nkungen definieren</p>
                <p className="text-xs text-muted-foreground">L&auml;nge, Format, Stil oder Zielgruppe angeben</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-foreground/60 text-sm">&#10003;</div>
              <div>
                <p className="font-medium text-sm">Beispiele nutzen</p>
                <p className="text-xs text-muted-foreground">Zeige der KI, wie das Ergebnis aussehen soll</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-foreground/60 text-sm">&#10003;</div>
              <div>
                <p className="font-medium text-sm">Rolle zuweisen</p>
                <p className="text-xs text-muted-foreground">Lass die KI als Experte agieren</p>
              </div>
            </div>

          </div>
        </div>

        {/* H&auml;ufige Fehler + Wissenswertes */}
        <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-muted p-2.5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold">H&auml;ufige Fehler</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">&#10007;</div>
              <div>
                <p className="font-medium text-sm">Zu vage Anfragen</p>
                <p className="text-xs text-muted-foreground">&bdquo;Erz&auml;hl mir was &uuml;ber KI&ldquo; ist zu unspezifisch</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">&#10007;</div>
              <div>
                <p className="font-medium text-sm">Fehlender Kontext</p>
                <p className="text-xs text-muted-foreground">Die KI kennt deine Situation nicht &ndash; erkl&auml;re sie</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">&#10007;</div>
              <div>
                <p className="font-medium text-sm">Zu komplexe Anfragen</p>
                <p className="text-xs text-muted-foreground">Teile gro&szlig;e Aufgaben in kleinere Schritte auf</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-destructive text-sm">&#10007;</div>
              <div>
                <p className="font-medium text-sm">Annahmen treffen</p>
                <p className="text-xs text-muted-foreground">Die KI kann nicht erraten, was du implizit meinst</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Best Practices Grid */}
      <div className="mt-6 bg-card rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-muted p-2.5 rounded-lg">
            <Lightbulb className="w-5 h-5 text-foreground/70" />
          </div>
          <h3 className="text-lg font-semibold">Best Practices</h3>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Brain className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Chain-of-Thought</p>
              <p className="text-xs text-muted-foreground">Bitte die KI, Schritt f&uuml;r Schritt zu denken und zu erkl&auml;ren</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookCopy className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Few-Shot Learning</p>
              <p className="text-xs text-muted-foreground">Gib 2-3 Beispiele, damit die KI das Muster versteht</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <LayoutTemplate className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Prompt-Templates</p>
              <p className="text-xs text-muted-foreground">Erstelle wiederverwendbare Vorlagen f&uuml;r h&auml;ufige Aufgaben</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Thermometer className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Temperatur-Konzept</p>
              <p className="text-xs text-muted-foreground">H&ouml;here Temperatur = kreativer, niedrigere = pr&auml;ziser</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Repeat className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Iterativ vorgehen</p>
              <p className="text-xs text-muted-foreground">Verfeinere deine Prompts basierend auf den Antworten der KI</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircleQuestion className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Nachfragen stellen</p>
              <p className="text-xs text-muted-foreground">Bitte um Klarstellungen oder zus&auml;tzliche Details</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <LayoutList className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Struktur vorgeben</p>
              <p className="text-xs text-muted-foreground">Fordere Aufz&auml;hlungen, Tabellen oder spezifische Formate</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Palette className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Ton & Stil bestimmen</p>
              <p className="text-xs text-muted-foreground">Formal, freundlich, technisch &ndash; gib den gew&uuml;nschten Ton an</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileSearch className="w-4 h-4 text-foreground/70 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">Quellen anfordern</p>
              <p className="text-xs text-muted-foreground">Bitte um Begr&uuml;ndungen oder Quellenangaben f&uuml;r Fakten</p>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Rules Banner */}
      <div className="mt-6 bg-gradient-card rounded-2xl p-8 md:p-12 text-center shadow-md">
        <h4 className="text-xl font-bold mb-2 text-foreground">
          Die goldene Regel des Promptings
        </h4>
        <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
          Je mehr relevanter Kontext und je spezifischer deine Anfrage, desto besser und n&uuml;tzlicher wird die Antwort der KI sein.
        </p>
      </div>
    </section>
  );
};
