import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Scissors, Sparkles, Copy, Check, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { streamChat, type Msg } from "@/services/llmService";
import { useAuthContext } from "@/contexts/AuthContext";

const exampleProjects = [
  {
    label: "Website Redesign",
    text: "Redesign unserer Unternehmenswebsite mit 5 Seiten, responsive, SEO-optimiert, mit Blog-Integration und Kontaktformular. Aktuelle Seite ist WordPress, neue Seite soll mit Next.js gebaut werden.",
  },
  {
    label: "Mobile App",
    text: "Entwicklung einer Fitness-Tracking-App (iOS + Android) mit Nutzerregistrierung, Trainingsplan-Erstellung, Fortschritts-Tracking mit Diagrammen und Push-Benachrichtigungen für Erinnerungen.",
  },
  {
    label: "Online-Kurs erstellen",
    text: "Einen 8-wöchigen Online-Kurs zum Thema 'KI im Marketing' erstellen: Kursstruktur, 16 Video-Lektionen, Übungsaufgaben, Quiz, Teilnehmer-Zertifikate und eine Landing Page für den Verkauf.",
  },
  {
    label: "Daten-Pipeline",
    text: "Aufbau einer automatisierten Daten-Pipeline: CSV-Dateien aus 3 Quellen einlesen, bereinigen, in eine PostgreSQL-Datenbank laden, tägliche Reports als PDF generieren und per E-Mail versenden.",
  },
];

export const DecompositionAssistant = () => {
  const { profile, isLoggedIn } = useAuthContext();
  const [projectDescription, setProjectDescription] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const decompose = async () => {
    if (!projectDescription.trim()) {
      toast.error("Bitte beschreibe dein Projekt!");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Bitte melde dich an, um diese Funktion zu nutzen.");
      return;
    }

    setIsProcessing(true);
    setResult("");

    const systemMsg: Msg = {
      role: "system",
      content: `Du bist ein Experte für Projekt-Decomposition und agentisches Arbeiten. Deine Aufgabe ist es, komplexe Projekte in kleine, unabhängig ausführbare Teilaufgaben zu zerlegen.

Jede Teilaufgabe soll:
- Maximal 2 Stunden dauern (ideale Granularität für KI-Agenten)
- Einen klaren Input und Output haben
- Unabhängig oder mit minimalen Abhängigkeiten ausführbar sein
- Eigene Acceptance Criteria haben

Erstelle für jede Teilaufgabe:
1. **Titel** (kurz und prägnant)
2. **Input**: Was wird benötigt?
3. **Output**: Was wird geliefert?
4. **Abhängigkeiten**: Welche Aufgaben müssen vorher fertig sein? (oder "Keine")
5. **Acceptance Criteria**: Woran erkennt man Fertigstellung?
6. **Geschätzte Dauer**

Erstelle am Ende:
- Einen **Dependency-Graph** (als Text-Diagramm)
- Einen **optimalen Ausführungsplan** (welche Aufgaben parallel laufen können)
- Eine **Gesamtschätzung** der Projektdauer bei sequenzieller vs. paralleler Ausführung

Antworte auf Deutsch. Formatiere übersichtlich mit Markdown.`
    };

    const userMsg: Msg = {
      role: "user",
      content: `Zerlege folgendes Projekt in autonome Teilaufgaben von je max. 2 Stunden:\n\n${projectDescription.trim()}`
    };

    let accumulated = "";
    await streamChat({
      messages: [systemMsg, userMsg],
      model: profile?.preferred_model ?? "google/gemini-3-flash-preview",
      onDelta: (text) => {
        accumulated += text;
        setResult(accumulated);
      },
      onDone: () => {
        setIsProcessing(false);
      },
      onError: (error) => {
        setIsProcessing(false);
        toast.error(error);
      },
    });
  };

  const optimize = async () => {
    if (!result.trim()) return;

    setIsProcessing(true);

    const systemMsg: Msg = {
      role: "system",
      content: `Du bist ein rekursiver Prompt-Optimierer. Du bekommst eine Projekt-Zerlegung und verbesserst sie iterativ:

Version 1: Identifiziere fehlende Constraints und füge sie hinzu.
Version 2: Löse Mehrdeutigkeiten in den Acceptance Criteria auf.
Version 3: Erhöhe die Denktiefe – prüfe ob Abhängigkeiten korrekt sind und ob Teilaufgaben wirklich unabhängig sind.

Zeige die Verbesserungen klar markiert an. Antworte auf Deutsch.`
    };

    const userMsg: Msg = {
      role: "user",
      content: `Hier ist die aktuelle Projekt-Zerlegung. Bitte optimiere sie rekursiv (3 Iterationen):\n\n${result}`
    };

    let accumulated = "\n\n---\n\n## Rekursive Optimierung\n\n";
    const baseResult = result;

    await streamChat({
      messages: [systemMsg, userMsg],
      model: profile?.preferred_model ?? "google/gemini-3-flash-preview",
      onDelta: (text) => {
        accumulated += text;
        setResult(baseResult + accumulated);
      },
      onDone: () => {
        setIsProcessing(false);
        toast.success("Rekursive Optimierung abgeschlossen!");
      },
      onError: (error) => {
        setIsProcessing(false);
        toast.error(error);
      },
    });
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Ergebnis kopiert!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary mb-2">Werkzeug</span>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Scissors className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Projekt-Zerlegung
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Zerlege komplexe Großprojekte in kleine, unabhängig ausführbare Teilaufgaben
          von unter 2 Stunden – die ideale Granularität für KI-Agenten
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 bg-gradient-card rounded-2xl border border-border shadow-lg p-8 md:p-12">
        <Card className="p-6">
          <label className="block text-sm font-semibold mb-2">
            Beschreibe dein Projekt
          </label>
          <Textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="z.B.: Redesign unserer Unternehmenswebsite mit 5 Seiten, responsive, SEO-optimiert, mit Blog-Integration und Kontaktformular..."
            className="min-h-[120px] mb-3"
            disabled={isProcessing}
          />

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Lightbulb className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground">Beispiele:</span>
            {exampleProjects.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setProjectDescription(ex.text)}
                disabled={isProcessing}
                className="text-xs px-3 py-1 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                {ex.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={decompose}
              disabled={isProcessing || !projectDescription.trim() || !isLoggedIn}
              className="gap-2"
            >
              {isProcessing && !result ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Scissors className="w-4 h-4" />
              )}
              Projekt zerlegen
            </Button>

            {result && (
              <>
                <Button
                  variant="outline"
                  onClick={optimize}
                  disabled={isProcessing}
                  className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isProcessing && result ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Rekursiv optimieren
                </Button>

                <Button
                  variant="outline"
                  onClick={copyResult}
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Kopieren
                </Button>
              </>
            )}
          </div>

          {!isLoggedIn && (
            <p className="text-xs text-muted-foreground mt-3">
              Melde dich an, um die Projekt-Zerlegung zu nutzen.
            </p>
          )}
        </Card>

        {result && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Projekt-Zerlegung</h3>
              {isProcessing && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </div>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};
