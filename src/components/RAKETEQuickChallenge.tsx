import { useState, useMemo } from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrgContext } from "@/contexts/OrgContext";

interface ChallengeContent {
  badPrompt: string;
  hint: string;
  solution: string;
}

const challenges: Record<string, ChallengeContent> = {
  default: {
    badPrompt: "Schreib mir einen Social-Media-Post.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist ein erfahrener Social-Media-Manager (R). Erstelle einen LinkedIn-Post über unser neues Zeiterfassungs-Feature (A). Wir sind ein B2B-SaaS-Startup, Zielgruppe: Teamleiter in KMUs (K). Keine Buzzwords, keine Emojis, kein Clickbait (E). Prüfe: Ist der CTA klar? Passt die Tonalität zu LinkedIn? (T). Max. 150 Wörter, 3 Bulletpoints, 1 Call-to-Action (E).\"",
  },
  legal: {
    badPrompt: "Schreib eine Stellungnahme zum Vertrag.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist Verwaltungsjurist:in mit Vergaberecht-Expertise (R). Erstelle eine juristische Stellungnahme zu den Haftungsklauseln des IT-Rahmenvertrags (A). Vertrag über Cloud-Hosting, 3 Jahre Laufzeit, Volumen 300.000 € (K). Keine abschließende Rechtsberatung, keine Vermutungen über Vertragspartner-Absichten. [JURIST:IN PRÜFEN] (E). Prüfe: Sind alle Haftungsklauseln erfasst? Sind die Rechtsgrundlagen korrekt zitiert? (T). Tabellenformat: Klausel → Bewertung → Risiko → Empfehlung, max. 2 Seiten (E).\"",
  },
  oeffentlichkeitsarbeit: {
    badPrompt: "Schreib was für unsere Social-Media-Kanäle.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist Pressesprecher:in einer Kommunalverwaltung (R). Erstelle einen Social-Media-Beitrag (Instagram + Facebook) zur neuen Bürgersprechstunde (A). Jeden 1. Mittwoch im Monat, 14-17 Uhr, Rathaus Raum 201, mit der Bürgermeisterin (K). Keine Behördensprache, keine Abkürzungen, keine politischen Wertungen. [PRESSESTELLE FREIGABE] (E). Prüfe: Sind alle W-Fragen beantwortet? Ist der Ton einladend? (T). Max. 100 Wörter, mit Termin-Zusammenfassung am Ende (E).\"",
  },
  hr: {
    badPrompt: "Mach eine Einladung zum Vorstellungsgespräch.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist HR-Sachbearbeiter:in im öffentlichen Dienst (R). Erstelle eine Einladung zum Vorstellungsgespräch für die Stelle Sachbearbeiter:in Haushalt (A). Termin: 15.04., 10:00 Uhr, Raum 3.12, Gespräch mit Amtsleitung + Personalrat, Dauer ca. 45 Min (K). Keine informelle Sprache, keine Gehaltsangaben im Einladungsschreiben. [HR-LEITUNG PRÜFEN] (E). Prüfe: Sind Datum, Uhrzeit, Ort und Teilnehmende korrekt? Ist der Hinweis auf Reisekostenerstattung enthalten? (T). Förmliches Schreiben, max. 1 Seite, mit Anfahrtsbeschreibung (E).\"",
  },
  it: {
    badPrompt: "Erstell eine Dokumentation für das System.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist IT-Dokumentationsspezialist:in (R). Erstelle eine Benutzeranleitung für das neue Ticketsystem (A). System: OTRS-basiert, 50 User im Bauordnungsamt, Zugang via Intranet, SSO-Authentifizierung (K). Keine technischen Implementierungsdetails, keine Admin-Funktionen beschreiben. Screenshots nur referenzieren, nicht einbetten (E). Prüfe: Kann ein:e neue:r Mitarbeiter:in ohne Vorkenntnisse ein Ticket erstellen? Sind alle Pflichtfelder erklärt? (T). Schritt-für-Schritt-Anleitung mit nummerierten Schritten, max. 3 Seiten (E).\"",
  },
  bauverfahren: {
    badPrompt: "Schreib dem Bauherrn wegen dem fehlenden Unterlagen.",
    hint: "Denk an alle 6 RAKETE-Felder: Rolle, Aufgabe, Kontext, Einschränkungen, Teste, Ergebnisformat.",
    solution: "\"Du bist Sachbearbeiter:in im Bauordnungsamt (R). Erstelle ein Nachforderungsschreiben für fehlende Bauantragsunterlagen (A). Bauvorhaben: Anbau Einfamilienhaus, § 63 BauO NRW, fehlend: Standsicherheitsnachweis + Entwässerungsplan (K). Keine Rechtsberatung, keine Bewertung des Bauvorhabens selbst, keine Zusagen zur Genehmigungsfähigkeit (E). Prüfe: Sind alle fehlenden Unterlagen mit Rechtsgrundlage aufgeführt? Ist die Frist angemessen? Ist der Hinweis auf Rechtsfolgen korrekt? (T). Förmliches Verwaltungsschreiben mit Frist (4 Wochen), Rechtsfolgenbelehrung (E).\"",
  },
};

export const RAKETEQuickChallenge = () => {
  const [userInput, setUserInput] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const { scope, isDepartment } = useOrgContext();

  const challenge = useMemo(() => {
    if (isDepartment && challenges[scope]) {
      return challenges[scope];
    }
    return challenges.default;
  }, [scope, isDepartment]);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">RAKETE-Challenge</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        Dieser Prompt ist vage: <span className="font-medium text-foreground">"{challenge.badPrompt}"</span>
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        {challenge.hint}
      </p>
      <Textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Dein verbesserter RAKETE-Prompt..."
        className="mb-3"
        rows={4}
      />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? "Lösung verbergen" : "Beispiel-Lösung"}
        </Button>
        {userInput.trim() && (
          <Button
            size="sm"
            onClick={() => {
              window.location.href = `/playground?prompt=${encodeURIComponent(userInput)}`;
            }}
          >
            In Prompt Werkstatt testen
          </Button>
        )}
      </div>
      {showSolution && (
        <div className="mt-4 bg-card rounded-lg p-4 border border-border text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Beispiel mit RAKETE:</p>
          <p className="italic">{challenge.solution}</p>
        </div>
      )}
    </div>
  );
};
