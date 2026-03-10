import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PromptExample {
  category: string;
  prompt: string;
  needsWeb?: boolean;
}

const level1Examples: PromptExample[] = [
  {
    category: "Rezepte",
    prompt: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe."
  },
  {
    category: "Urlaubsplanung",
    prompt: "Erstelle eine Reiseroute für einen 7-tägigen Urlaub in Italien mit den Schwerpunkten Kultur und Natur, maximal 2 Stunden Autofahrt pro Tag."
  },
  {
    category: "Geschenke",
    prompt: "Finde ein Geschenk für meine Mutter zum Geburtstag, das ihr gefällt und nicht mehr als 50 Euro kostet."
  },
  {
    category: "Training",
    prompt: "Erstelle einen 30-minütigen Trainingsplan für zu Hause ohne Ausrüstung, der sich auf Rücken und Körpermitte konzentriert."
  },
  {
    category: "Sprachenlernen",
    prompt: "Wie kann ich Grundkenntnisse in Spanisch in einem Monat erwerben? Erstelle einen strukturierten Lernplan."
  }
];

const level2Examples: PromptExample[] = [
  {
    category: "System-Prompt Design",
    prompt: "Du bist ein Projektmanagement-Experte. Dein Name ist PM-Bot. Du arbeitest für ein Startup mit 20 Mitarbeitern, das agile Methoden (Scrum) nutzt. Antworte immer strukturiert mit Bulletpoints. Berücksichtige unser Sprint-Zyklus von 2 Wochen."
  },
  {
    category: "Projekt-Konventionen (claude.md)",
    prompt: "Erstelle eine claude.md-Datei für ein React-Projekt. Definiere: Coding-Stil (Tailwind, funktionale Komponenten), Namenskonventionen (PascalCase für Komponenten), bevorzugte Libraries, und Teststandards. Die KI soll diese Konventionen automatisch befolgen."
  },
  {
    category: "Wissensbasis aufbauen",
    prompt: "Ich möchte eine Wissensbasis für meine KI erstellen. Fasse die folgenden 5 Dokumente zusammen und erstelle daraus ein Kontext-Dokument, das ich als System-Prompt verwenden kann: [Unternehmensrichtlinien, Produktkatalog, FAQ, Stilguide, Zielgruppenanalyse]."
  },
  {
    category: "Few-Shot Kontext",
    prompt: "Hier sind 3 Beispiele unserer Kundenkommunikation. Analysiere den Stil, Ton und die Struktur. Erstelle dann eine Kontext-Beschreibung, die ich als Vorlage für alle zukünftigen Antworten verwenden kann."
  },
  {
    category: "Umgebungs-Design",
    prompt: "Entwirf ein optimales System-Prompt-Setup für einen Kundenservice-Bot: Rolle, Tonalität, erlaubte Aktionen, verbotene Themen, Eskalationsregeln. Der Bot soll nur über unsere Produkte sprechen und bei Beschwerden an einen Menschen weiterleiten."
  }
];

const level3Examples: PromptExample[] = [
  {
    category: "Werte-Hierarchie",
    prompt: "Du bist mein persönlicher Berater. Priorisiere bei allen Empfehlungen: 1. Datenschutz > 2. Benutzerfreundlichkeit > 3. Kosten. Wenn zwei Optionen gleichwertig sind, wähle die datenschutzfreundlichere. Begründe Entscheidungen immer anhand dieser Hierarchie."
  },
  {
    category: "Entscheidungsregeln",
    prompt: "Du triffst Entscheidungen für unser Marketing-Team. Regeln: Budget unter 500€ → entscheide selbst. Budget 500-2000€ → schlage 2 Optionen vor mit Pro/Contra. Budget über 2000€ → erstelle vollständige Analyse, triff keine Entscheidung. Bei Unsicherheit: frage immer nach."
  },
  {
    category: "Autonome Zielvorgabe",
    prompt: "Dein Ziel: Erstelle einen vollständigen Social-Media-Kalender für Q2. Du darfst: Themen recherchieren, Texte schreiben, Hashtags wählen. Du darfst NICHT: Budget festlegen, Kooperationspartner kontaktieren, bezahlte Werbung planen. Wenn du dir bei einem Thema unsicher bist, markiere es mit [REVIEW]."
  },
  {
    category: "Eskalationsmuster",
    prompt: "Du bearbeitest Kundenanfragen autonom. Eskaliere an einen Menschen wenn: 1) Der Kunde rechtliche Schritte androht, 2) Eine Erstattung über 100€ nötig ist, 3) Du eine Frage dreimal nicht beantworten konntest, 4) Der Kunde explizit einen Menschen verlangt."
  },
  {
    category: "Qualitätssicherung",
    prompt: "Überprüfe jede deiner Antworten anhand dieser Checkliste bevor du sie gibst: [ ] Ist die Aussage faktenbasiert? [ ] Habe ich Quellen genannt? [ ] Ist der Ton professionell? [ ] Gibt es Widersprüche zu früheren Aussagen? Wenn ein Punkt nicht erfüllt ist, korrigiere zuerst."
  }
];

const level4Examples: PromptExample[] = [
  {
    category: "Agenten-Blueprint",
    prompt: "BLUEPRINT: Marktrecherche für SaaS-Wettbewerbsanalyse.\n\nHABITAT: Nur öffentlich zugängliche Webquellen und Preisseiten.\nHANDS: Web-Recherche, Dokumenterstellung, Tabellen. KEIN Zugriff auf interne Daten.\nLEASH: Arbeite vollständig autonom. Frage nur nach, wenn Wettbewerber nicht eindeutig identifizierbar.\nPROOF: Jede Behauptung mit URL-Quelle belegen. Erstelle am Ende ein Confidence-Rating (hoch/mittel/niedrig) pro Datenpunkt.\n\nABNAHMEKRITERIEN: Vergleichstabelle mit min. 5 Wettbewerbern, Preise aktuell (2026), 3 Nischen-Empfehlungen."
  },
  {
    category: "Mehrtages-Spezifikation",
    prompt: "SPEZIFIKATION: Erstelle einen vollständigen Onboarding-Leitfaden für neue Mitarbeiter.\n\nPHASE 1 (Tag 1): Sammle alle verfügbaren Unternehmensinfos und strukturiere sie.\nPHASE 2 (Tag 2): Erstelle 90-Tage-Plan mit Meilensteinen.\nPHASE 3 (Tag 3): Schreibe Checklisten, E-Mail-Vorlagen und FAQ.\n\nCONSTRAINTS:\n- MUST: GoBD-konforme Dokumentation\n- MUST NOT: Keine personenbezogenen Beispieldaten verwenden\n- ESKALATION: Wenn arbeitsrechtliche Fragen aufkommen → [PAUSE]\n\nERFOLGSNACHWEIS: Inhaltsverzeichnis mit Seitenangaben, Review-Checkliste, 3 Test-Szenarien."
  },
  {
    category: "Constraint-Architektur",
    prompt: "Du arbeitest als autonomer Recherche-Agent. Hier ist deine vollständige Constraint-Architektur:\n\nMUST: Alle Fakten mit Primärquellen belegen. Widersprüchliche Quellen explizit kennzeichnen. Unsicherheit quantifizieren (70% sicher, etc.).\nMUST NOT: Keine Meinungen als Fakten darstellen. Keine Quellen älter als 2024. Keine Annahmen ohne Kennzeichnung.\nESKALATION: Bei widersprüchlichen Studien → beide zitieren + eigene Einschätzung markieren.\nOUTPUT: Executive Summary (300 Wörter) + Detailbericht + Quellenverzeichnis + Confidence-Matrix."
  },
  {
    category: "Decomposition-Muster",
    prompt: "Zerlege folgendes Großprojekt in autonome Teilaufgaben von je max. 2 Stunden:\n\nPROJEKT: Redesign unserer Unternehmenswebsite (5 Seiten, responsive, SEO-optimiert)\n\nFür jede Teilaufgabe definiere:\n1. Input: Was wird benötigt?\n2. Output: Was wird geliefert?\n3. Abhängigkeiten: Welche anderen Teilaufgaben müssen vorher fertig sein?\n4. Acceptance Criteria: Woran erkenne ich Fertigstellung?\n5. Geschätzte Dauer\n\nErstelle einen Dependency-Graph und einen optimalen Ausführungsplan."
  }
];

const allExamples = {
  1: level1Examples,
  2: level2Examples,
  3: level3Examples,
  4: level4Examples,
};

interface PromptExamplesProps {
  level: number;
}

export const PromptExamples = ({ level }: PromptExamplesProps) => {
  const navigate = useNavigate();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const examples = allExamples[level as keyof typeof allExamples] || level1Examples;
  const visibleExamples = showAll ? examples : examples.slice(0, 3);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Prompt kopiert!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Beispiel-Prompts</h3>
        <span className="text-sm text-muted-foreground">
          Klicke zum Kopieren
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {visibleExamples.map((example, index) => (
          <Card key={index} className="p-4 hover:shadow-md hover:ring-1 hover:ring-primary/10 hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-primary">
                    {example.category}
                  </span>
                  {example.needsWeb && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">
                      <Globe className="w-2.5 h-2.5" />
                      Web
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-foreground/80 bg-muted/50 rounded-md px-3 py-2 font-mono">
                  {example.prompt}
                </p>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(example.prompt, index)}
                  title="Kopieren"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-primary animate-scale-in" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => navigate(`/playground?prompt=${encodeURIComponent(example.prompt)}`)}
                  title="In der Werkstatt ausprobieren"
                >
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {examples.length > 3 && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Weniger anzeigen" : `Mehr Beispiele (${examples.length - 3})`}
          </Button>
        </div>
      )}
    </div>
  );
};
