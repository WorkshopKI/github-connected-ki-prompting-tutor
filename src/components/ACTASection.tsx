import { User, FileText, Target, Layout } from "lucide-react";

export const ACTASection = () => {
  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Die ACTA-Methode
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ein strukturiertes Framework für perfekte Prompts
        </p>
      </div>

      {/* ACTA Overview */}
      <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-xl inline-flex mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">A</h3>
            <p className="font-semibold mb-2">Act / Rolle</p>
            <p className="text-sm text-muted-foreground">
              Als wer oder was soll die KI antworten?
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-xl inline-flex mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">C</h3>
            <p className="font-semibold mb-2">Context / Hintergrund</p>
            <p className="text-sm text-muted-foreground">
              Welche Hintergrundinfos sind wichtig?
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-xl inline-flex mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">T</h3>
            <p className="font-semibold mb-2">Task / Aufgabe</p>
            <p className="text-sm text-muted-foreground">
              Welche Aufgabe soll erledigt werden?
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 p-4 rounded-xl inline-flex mb-4">
              <Layout className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-primary">A</h3>
            <p className="font-semibold mb-2">Ausgabe / Format</p>
            <p className="text-sm text-muted-foreground">
              Welche Formatierung ist gewünscht?
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Explanations */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg">Act – Rolle definieren</h4>
          </div>
          <p className="text-muted-foreground mb-3">
            Weise der KI eine spezifische Rolle zu:
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm italic">
              „Bitte nimm die Rolle eines erfahrenen Marketing-Experten ein..."
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            💡 Die Rolle beeinflusst Stil, Fachkenntnis und Perspektive der Antwort
          </p>
        </div>

        <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg">Context – Hintergrund geben</h4>
          </div>
          <p className="text-muted-foreground mb-3">
            Liefere alle relevanten Informationen:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <p className="text-sm">Projektinformationen und Rahmenbedingungen</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <p className="text-sm">Beispiele für gewünschte Ausgabe (Few Shot)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <p className="text-sm">Oder ohne Beispiele arbeiten (Zero Shot)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg">Task – Aufgabe formulieren</h4>
          </div>
          <p className="text-muted-foreground mb-3">
            Beschreibe klar und präzise, was getan werden soll:
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm italic">
              „Erstelle einen LinkedIn-Post für unser neues Produkt..."
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            💡 Je spezifischer die Aufgabe, desto zielgerichteter die Antwort
          </p>
        </div>

        <div className="bg-gradient-card rounded-xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-lg">Ausgabe – Format bestimmen</h4>
          </div>
          <p className="text-muted-foreground mb-3">
            Lege das gewünschte Ausgabeformat fest:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background/50 rounded p-2 text-sm">📝 Fließtext</div>
            <div className="bg-background/50 rounded p-2 text-sm">📊 Tabelle</div>
            <div className="bg-background/50 rounded p-2 text-sm">📋 Liste</div>
            <div className="bg-background/50 rounded p-2 text-sm">🔹 Bulletpoints</div>
          </div>
        </div>
      </div>

      {/* ACTA Example */}
      <div className="bg-gradient-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
        <h3 className="text-2xl font-bold mb-6 text-center">
          ACTA in der Praxis – Vollständiges Beispiel
        </h3>
        
        <div className="bg-background/50 rounded-xl p-6 space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm font-semibold text-primary mb-1">Act (Rolle)</p>
            <p className="text-muted-foreground">
              „Du bist ein erfahrener Social-Media-Manager mit Fokus auf LinkedIn."
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm font-semibold text-primary mb-1">Context (Hintergrund)</p>
            <p className="text-muted-foreground">
              „Unser Unternehmen ist ein B2B-SaaS-Startup für Projektmanagement. Wir haben gerade ein neues Feature für die automatisierte Zeiterfassung gelauncht. Zielgruppe sind Teamleiter und Projektmanager in mittelständischen Unternehmen."
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm font-semibold text-primary mb-1">Task (Aufgabe)</p>
            <p className="text-muted-foreground">
              „Erstelle einen LinkedIn-Post, der das neue Feature vorstellt und die Vorteile für Teamleiter hervorhebt."
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <p className="text-sm font-semibold text-primary mb-1">Ausgabe (Format)</p>
            <p className="text-muted-foreground">
              „Der Post soll max. 150 Wörter haben, mit 3-5 Bulletpoints für die Key-Benefits und einem Call-to-Action am Ende."
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Mit dieser strukturierten ACTA-Methode erhältst du präzise und zielgerichtete Antworten
          </p>
        </div>
      </div>
    </section>
  );
};
