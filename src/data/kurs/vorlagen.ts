/* ── Vorlagen für den Kurs ──
 * Übernommen aus prompt-tutor.kilab.org (Bibliothek, drei Stufen, Advanced, Ressourcen).
 * Stand 23.11.2026 überarbeitet für aktuelle Modelle: Ziel und Zweck statt Befehl, Kontext als {Platzhalter},
 * Rückfragen und Annahmen erlaubt, Fotos, Dateien und Artefakte genutzt.
 * ChatGPT und Claude suchen bei Aktuellem selbst im Web; „Nutze die Websuche“ steht deshalb nicht mehr im Prompt.
 * `aktuell`: braucht frische Daten (Quelle und Datum verlangen, prüfen ob gesucht wurde).
 * `deepResearch`: Deep-Research-Modus im Chat auswählen.
 */

export type Stufe = "alltag" | "beruf" | "forschung";

export const STUFEN: { id: Stufe; name: string; untertitel: string; text: string }[] = [
  { id: "alltag", name: "Alltagshelfer", untertitel: "Stufe 1", text: "Alltägliche Aufgaben mit präzisem Kontext: kochen, reisen, planen, lernen. Gern mit Foto." },
  { id: "beruf", name: "Juniorassistent", untertitel: "Stufe 2", text: "Berufliche Aufgaben delegieren: Ziel nennen, Kontext geben, Ergebnis prüfen." },
  { id: "forschung", name: "Forschungsassistent", untertitel: "Stufe 3", text: "Aktuelles nachschlagen (die KI sucht selbst) und Deep Research für gründliche Berichte." },
];

export interface Vorlage {
  stufe: Stufe;
  kategorie: string;
  titel: string;
  text: string;
  /** Braucht aktuelle Daten aus dem Web. */
  aktuell?: boolean;
  deepResearch?: boolean;
  /** Kurzer Tipp unter dem Prompt. */
  hinweis?: string;
}

export const VORLAGEN: Vorlage[] = [
  // ── Stufe 1: Alltag
  { stufe: "alltag", kategorie: "Kochen", titel: "Was koche ich heute?", text: "[Foto von Kühlschrank oder Vorrat anhängen]\nWas kann ich daraus heute Abend vegetarisch für 4 Personen kochen? Höchstens 30 Minuten, keine Spezialgeräte. Gib mir zuerst zwei Ideen in je einem Satz, zur gewählten dann das Rezept.", hinweis: "Ohne Foto: die Zutaten aufzählen." },
  { stufe: "alltag", kategorie: "Reisen", titel: "Italien-Reiseroute", text: "Plane eine Woche Italien für {Personen} im {Monat}, Schwerpunkt Kultur und Natur, Anreise mit {Auto/Bahn}, höchstens 2 Stunden Fahrt pro Tag. Mach zuerst einen groben Routenvorschlag und frag nach, was uns wichtig ist, bevor du ins Detail gehst." },
  { stufe: "alltag", kategorie: "Reisen", titel: "Japan für Erstbesucher", text: "Ich reise zum ersten Mal nach Japan, {Dauer} im {Monat}, und interessiere mich für {Interessen}. Welche fünf Orte passen zu mir? Je ein Satz, warum, und was ich vorher buchen oder reservieren muss." },
  { stufe: "alltag", kategorie: "Geschenke", titel: "Geburtstagsgeschenk", text: "Ich suche ein Geburtstagsgeschenk für meine Mutter, höchstens 50 €. Sie gärtnert gern und liest Krimis, hat aber schon fast alles. Schlag drei Ideen in verschiedenen Preisklassen vor, je mit Begründung. Frag nach, wenn du mehr wissen musst." },
  { stufe: "alltag", kategorie: "Fitness", titel: "Home-Workout", text: "Ich sitze viel am Schreibtisch und will meinen Rücken stärken. Erstelle ein 30-Minuten-Training für zu Hause ohne Geräte, für Einsteiger. Sag bei jeder Übung, worauf ich achten muss, und wann ich Beschwerden lieber ärztlich abklären sollte." },
  { stufe: "alltag", kategorie: "Hobby", titel: "Bonsai-Pflege", text: "[Foto des Bonsais anhängen]\nWas ist das für ein Bonsai, und wie pflege ich ihn auf meiner Fensterbank ({Himmelsrichtung}, Heizung darunter)? Sag mir, was ich diese Woche tun sollte und welche Fehler Anfänger oft machen.", hinweis: "Mit Foto erkennt die KI Art und Zustand." },
  { stufe: "alltag", kategorie: "Hobby", titel: "Wohnzimmer streichen", text: "Ich will mein Wohnzimmer (20 m², Altbau, Raufaser, bisher weiß) selbst streichen und habe das noch nie gemacht. Erstelle eine Anleitung mit Materialliste für den Baumarkt und einem realistischen Plan für ein Wochenende." },
  { stufe: "alltag", kategorie: "Familie", titel: "Familientreffen", text: "Wir haben ein Familientreffen mit 15 Personen, darunter Kinder zwischen 5 und 12. Wir sind im Garten, bei Regen im Gemeindesaal. Schlag fünf Aktivitäten vor, die Alt und Jung zusammenbringen, mit Material und Dauer." },
  { stufe: "alltag", kategorie: "Finanzen", titel: "Haushaltsbudget", text: "Erstelle für unseren 2-Personen-Haushalt (3.000 € netto im Monat) eine Budget-Tabelle mit festen und variablen Kosten, die ich weiter ausfüllen kann. Trag übliche Richtwerte ein und markier, welche Zahlen ich durch eigene ersetzen muss.", hinweis: "Claude legt eine Tabelle als Artefakt an, ChatGPT eine Excel-Datei." },
  { stufe: "alltag", kategorie: "Lernen", titel: "Spanisch in einem Monat", text: "Ich fahre in vier Wochen nach Spanien und will mich im Alltag verständigen: Restaurant, Weg fragen, Small Talk. Ich habe 20 Minuten am Tag. Mach mir einen Lernplan. Wenn ich danach „Lektion“ schreibe, übst du mit mir die nächste Einheit." },
  { stufe: "alltag", kategorie: "Haustiere", titel: "Hundetraining", text: "Mein Hund ({Rasse}, {Alter}) bellt Besuch an und springt hoch. Gib mir einen Zwei-Wochen-Plan mit kurzen täglichen Übungen. Frag nach, wenn du mehr über ihn wissen musst." },
  { stufe: "alltag", kategorie: "Kleidung", titel: "Outfit-Beratung", text: "[Fotos von zwei, drei Outfits anhängen]\nIch habe ein Vorstellungsgespräch in einer kreativen Agentur als {Stelle}. Welche Kombination passt am besten und warum? Wenn keine passt: Was sollte ich ergänzen?" },
  { stufe: "alltag", kategorie: "Technik", titel: "Smartphone-Kaufberatung", text: "Ich suche ein Smartphone bis 500 €. Wichtig sind eine gute Kamera, lange Akkulaufzeit und mindestens fünf Jahre Updates. Empfiehl drei aktuelle Modelle mit Preis, Testquelle und Datum.", aktuell: true },
  { stufe: "alltag", kategorie: "Bildung", titel: "Online-Kurs finden", text: "Ich will in Excel von den Grundlagen bis zu Pivot-Tabellen kommen und habe etwa zwei Stunden pro Woche. Welche kostenlosen Online-Kurse gibt es derzeit? Nenne Anbieter, Dauer, Link und ob es ein Zertifikat gibt.", aktuell: true },
  { stufe: "alltag", kategorie: "Mobilität", titel: "Gebrauchtwagen-Check", text: "Ich besichtige am Samstag einen Gebrauchtwagen ({Modell, Baujahr, Kilometer}). Erstelle eine Checkliste zum Ausdrucken mit den typischen Schwachstellen dieses Modells und Fragen an den Verkäufer." },
  { stufe: "alltag", kategorie: "Wohnen", titel: "Heizkosten sparen", text: "Ich wohne zur Miete ({Wohnfläche} m², {Heizungsart}). Gib mir die zehn wirksamsten Tipps zum Heizkostensparen, sortiert nach Wirkung, und sag bei jedem, ob ich den Vermieter fragen muss." },

  // ── Stufe 2: Beruf
  { stufe: "beruf", kategorie: "Marketing", titel: "Kampagnenideen", text: "Wir bringen ein Bio-Erfrischungsgetränk für 20- bis 35-Jährige auf den Markt, kleines Budget, Kanäle Instagram und TikTok. Entwickle zehn Kampagnenideen, davon drei ungewöhnliche. Bewerte jede kurz nach Aufwand und Wirkung und empfiehl am Ende eine." },
  { stufe: "beruf", kategorie: "Marketing", titel: "Marketing-Trends", text: "Welche Entwicklungen im digitalen Marketing der letzten sechs Monate sind für einen kleinen Onlinehandel wichtig? Fünf Trends, je mit Quelle und Datum und mit einem Vorschlag, was wir im nächsten Monat ausprobieren könnten.", aktuell: true },
  { stufe: "beruf", kategorie: "Meetings", titel: "Meeting-Agenda", text: "Ich leite nächste Woche ein Team-Meeting zur Quartalsplanung, 90 Minuten, 8 Personen. Ziel: Am Ende stehen drei Prioritäten mit Verantwortlichen fest. Erstelle die Agenda mit Zeiten als Text, den ich in die Einladung kopieren kann." },
  { stufe: "beruf", kategorie: "Kommunikation", titel: "Konstruktives Feedback", text: "Ich will einem Kollegen Feedback geben: Er liefert gute Arbeit, verpasst aber oft Termine, und das bremst das Team. Ich will, dass er etwas ändert, ohne sich angegriffen zu fühlen. Schreib mir einen Gesprächseinstieg und drei Sätze für den Kern." },
  { stufe: "beruf", kategorie: "Projekte", titel: "Statusbericht-Vorlage", text: "Ich melde der Geschäftsführung jeden Freitag den Projektstand, sie liest höchstens zwei Minuten. Erstelle eine Vorlage: oben eine Ampel, dann Fortschritt, Risiken, Entscheidungsbedarf und nächste Schritte." },
  { stufe: "beruf", kategorie: "IT-Sicherheit", titel: "Datensicherheit-Checkliste", text: "Unser Betrieb hat 10 Beschäftigte, Laptops, eine Cloud-Ablage und ein gemeinsames WLAN, aber keine eigene IT. Erstelle eine Checkliste, mit der ich in einer Stunde die größten Sicherheitslücken finde, sortiert nach Dringlichkeit." },
  { stufe: "beruf", kategorie: "Präsentieren", titel: "Präsentationsfähigkeiten", text: "In drei Wochen halte ich eine 10-Minuten-Präsentation vor der Geschäftsführung und werde dabei leicht nervös. Gib mir fünf Techniken mit je einer kurzen Übung, die ich bis dahin täglich machen kann." },
  { stufe: "beruf", kategorie: "Team", titel: "Konfliktgespräch", text: "Zwei Teammitglieder streiten über Zuständigkeiten, die Stimmung leidet. Ich moderiere ein Klärungsgespräch, Ziel ist eine schriftliche Vereinbarung. Erstelle einen Leitfaden mit Einstieg, Fragen und Abschluss. KEINE ECHTEN NAMEN verwenden." },
  { stufe: "beruf", kategorie: "Team", titel: "Onboarding-Plan", text: "Nächsten Monat beginnt eine neue Kollegin als {Rolle}, überwiegend im Homeoffice. Erstelle einen Zwei-Wochen-Plan, damit sie danach eigenständig {Aufgabe} kann. Markier, was ich vorher vorbereiten muss." },
  { stufe: "beruf", kategorie: "Recht", titel: "Freelancer-Vertrag", text: "Wir beauftragen erstmals eine Freelancerin für {Aufgabe}. Welche Klauseln braucht der Vertrag in Deutschland? Erklär jede in einem Satz und markier, wo Scheinselbstständigkeit droht. [JURIST:IN PRÜFEN]" },
  { stufe: "beruf", kategorie: "Content", titel: "LinkedIn-Post", text: "Schreib einen LinkedIn-Post zum Thema Work-Life-Balance über diese Erfahrung: {Erfahrung in zwei Sätzen}. Ton: persönlich, nicht belehrend. Die ersten zwei Zeilen sollen neugierig machen. Höchstens 150 Wörter, keine Hashtag-Wolke.", hinweis: "Die eigene Erfahrung macht den Unterschied zu Allerweltsposts." },
  { stufe: "beruf", kategorie: "Zeitmanagement", titel: "Tagesplan", text: "[Screenshot vom Kalender anhängen]\nMorgen habe ich viele Meetings. Plane den Tag so, dass ich zwei Blöcke für {Aufgabe} bekomme, und sag mir, welche Termine ich verschieben oder kürzen könnte." },
  { stufe: "beruf", kategorie: "Kundenkontakt", titel: "Antwort auf Beschwerde", text: "Ein Kunde beschwert sich, seine Lieferung kommt zwei Wochen zu spät:\n{Beschwerde einfügen, ohne Namen}\nFormuliere eine Antwort, die Verständnis zeigt, den Grund ehrlich nennt und eine konkrete Lösung anbietet. Höchstens 120 Wörter." },
  { stufe: "beruf", kategorie: "Vertrieb", titel: "Elevator Pitch", text: "Ich habe auf einer Messe zwei Minuten für unsere Projektmanagement-Software. Zielgruppe: Inhaber kleiner Handwerksbetriebe. Schreib einen Pitch, der mit ihrem Problem anfängt, und drei kurze Antworten auf typische Einwände." },
  { stufe: "beruf", kategorie: "Innovation", titel: "Brainstorming moderieren", text: "Plane eine 60-minütige Online-Brainstorming-Session mit 6 Personen für ein neues Produktfeature. Ziel: Am Ende sind drei Ideen ausgewählt und bewertet. Beschreib Ablauf, Methoden und Zeitplan." },

  // ── Stufe 3: Forschung (Aktuelles nachschlagen und Deep Research)
  { stufe: "forschung", kategorie: "Prüfen", titel: "Suche erzwingen und prüfen", text: "Such im Web nach {Frage} und antworte nur mit dem, was die gefundenen Quellen belegen. Nenne zu jeder Aussage die Quelle mit Datum. Wenn du nichts Aktuelles findest, sag das, statt aus dem Gedächtnis zu antworten.", aktuell: true, hinweis: "Keine Quellen-Links in der Antwort? Dann hat die KI nicht gesucht: Websuche über + oder das Globus-Symbol einschalten. In Firmen- und internen KIs ist sie oft aus." },
  { stufe: "forschung", kategorie: "Nachrichten", titel: "Tagesnachrichten", text: "Was sind heute die drei wichtigsten Nachrichten in Deutschland? Je zwei Sätze, worum es geht und was es für Bürgerinnen und Bürger bedeutet, mit Quelle und Uhrzeit.", aktuell: true },
  { stufe: "forschung", kategorie: "Nachrichten", titel: "Inflationszahlen", text: "Wie hoch ist die Inflationsrate in Deutschland im zuletzt veröffentlichten Monat, und wie hat sie sich im letzten Jahr entwickelt? Nenne Quelle und Veröffentlichungsdatum.", aktuell: true },
  { stufe: "forschung", kategorie: "Lokal", titel: "Restaurants finden", text: "Ich suche für Samstagabend ein italienisches Restaurant in {Stadt} für 6 Personen, mittlere Preisklasse, gut mit Bus und Bahn erreichbar. Drei Vorschläge mit Adresse, Preisspanne, Link und ob man reservieren muss.", aktuell: true },
  { stufe: "forschung", kategorie: "Lokal", titel: "Veranstaltungen", text: "Was ist am kommenden Wochenende (Freitag bis Sonntag) in {Stadt} los, das sich für {Interessen} lohnt? Höchstens fünf Tipps mit Datum, Uhrzeit, Preis und Link.", aktuell: true },
  { stufe: "forschung", kategorie: "Sport", titel: "Bundesliga-Tabelle", text: "Wie steht es in der Bundesliga? Die ersten fünf Teams mit Punkten und Tordifferenz, nach welchem Spieltag, mit Quelle.", aktuell: true },
  { stufe: "forschung", kategorie: "Preise", titel: "Preisvergleich", text: "Wo bekomme ich {Produkt} gerade am günstigsten bei seriösen Händlern? Drei Angebote mit Händler, Preis inklusive Versand, Datum und Link. Weise auf Angebote hin, die zu gut klingen, um wahr zu sein.", aktuell: true },
  { stufe: "forschung", kategorie: "Gesundheit", titel: "Ernährungsstudien", text: "Was haben gute Studien der letzten zwei Jahre zu {Ernährungsfrage} herausgefunden? Drei Studien mit Link, je ein Satz zum Ergebnis und wie belastbar es ist (Art und Größe der Studie).", aktuell: true },
  { stufe: "forschung", kategorie: "Technik", titel: "KI-Entwicklungen", text: "Was hat sich in den letzten drei Monaten bei KI-Assistenten wie ChatGPT, Claude und Gemini geändert, das für normale Nutzerinnen und Nutzer wichtig ist? Fünf Punkte mit Datum und Quelle.", aktuell: true },
  { stufe: "forschung", kategorie: "Wirtschaft", titel: "Börsen-Update", text: "Wie haben DAX und MDAX heute geschlossen? Nenne die drei größten Gewinner und Verlierer mit Prozent, Uhrzeit des Stands und Quelle.", aktuell: true },
  { stufe: "forschung", kategorie: "Wohnen", titel: "Mietpreise", text: "Was kostet derzeit eine 2-Zimmer-Wohnung (rund 60 m²) zur Miete in München, Hamburg und Berlin? Tabelle mit Durchschnittsmiete pro m², Quelle und Stand. Sag dazu, ob es Angebots- oder Bestandsmieten sind.", aktuell: true },
  { stufe: "forschung", kategorie: "Produktvergleich", titel: "E-Auto-Vergleich", text: "Ich will ein E-Auto bis 40.000 € kaufen, fahre täglich {Kilometer} km und kann {zu Hause / nur öffentlich} laden. Vergleiche die drei meistverkauften Modelle dieser Preisklasse in Deutschland: Winterreichweite, Gesamtkosten über 5 Jahre, Restwert. Tabelle, gewichtete Entscheidungsmatrix (Kosten 40 %, Reichweite 30 %, Restwert 30 %), Empfehlung mit Begründung.", deepResearch: true },
  { stufe: "forschung", kategorie: "Vergleichsstudie", titel: "Windkraft in Europa", text: "Für eine Bürgerversammlung brauche ich einen sachlichen Vergleich von Offshore- und Onshore-Windkraft in Europa: Kosten pro MWh, Umweltauswirkungen, Genehmigungsdauer, Akzeptanz. Nur Studien der letzten drei Jahre. Zuerst eine Tabelle, dann Vor- und Nachteile, am Ende die offenen Streitfragen.", deepResearch: true },
  { stufe: "forschung", kategorie: "Konzept", titel: "Digitale Arztpraxis", text: "Eine Arztpraxis mit 6 Beschäftigten will ihre Papierakten digitalisieren. Schreib ein Konzept, auf dessen Grundlage die Inhaberin entscheiden kann: Beteiligte, Zeitplan, Kosten, Datenschutz, Risiken, am Ende eine Roadmap. Nenne deine Annahmen ausdrücklich. [JURIST:IN PRÜFEN]", deepResearch: true },
  { stufe: "forschung", kategorie: "Marktanalyse", titel: "Fleischersatz-Markt", text: "Wir überlegen, mit einem pflanzlichen Fleischersatz in den deutschen Markt einzusteigen. Analysiere Marktgröße, Prognose, Anbieter, Zielgruppen und Preise. Zuerst eine Zusammenfassung für die Geschäftsführung (eine Seite), dann eine Tabelle mit Quellen. Markier widersprüchliche Zahlen.", deepResearch: true },
  { stufe: "forschung", kategorie: "Bildung", titel: "Digitale Schule", text: "Ich bin im Elternbeirat und will mitreden: Wie steht Deutschland bei der digitalen Bildung in Schulen international da (Ausstattung, Fortbildung, Lernplattformen)? Nur Studien der letzten drei Jahre. Ein verständlicher Bericht mit fünf Forderungen, die wir an unsere Schule richten können.", deepResearch: true },
  { stufe: "forschung", kategorie: "Nachhaltigkeit", titel: "CO₂-Bilanz", text: "Ein Produktionsbetrieb mit 100 Beschäftigten will seine CO₂-Bilanz berechnen und senken. Erstelle einen Leitfaden: Methode (z. B. GHG Protocol), Werkzeuge, aktuelle Förderprogramme in Deutschland, schnelle Erfolge und ein Fünf-Jahres-Plan.", deepResearch: true },
  { stufe: "forschung", kategorie: "Gesundheit", titel: "Telemedizin", text: "Eine Hausarztpraxis auf dem Land will Videosprechstunden anbieten. Erstelle ein Konzept zu Technik, Recht, Abrechnung, Akzeptanz bei älteren Patientinnen und Patienten und Risiken, mit einem Umsetzungsplan für die ersten drei Monate. [JURIST:IN PRÜFEN]", deepResearch: true },
  { stufe: "forschung", kategorie: "Stadtentwicklung", titel: "Smart City", text: "Unsere Stadt (50.000 Einwohner) will ein Smart-City-Programm starten. Recherchiere fünf vergleichbare Beispiele aus Europa: Was hat funktioniert, was nicht? Leite daraus einen Fünf-Jahres-Plan mit grober Kostenübersicht für Mobilität, Energie und Bürgerbeteiligung ab.", deepResearch: true },
];

/* ── Profi-Techniken (vormals prompt-tutor.kilab.org/advanced) ──
 * Mit Einordnung für 2026: Was ein starkes Modell inzwischen von selbst macht, braucht weniger Anleitung.
 */
export interface Technik {
  id: string;
  gruppe: string;
  name: string;
  idee: string;
  beispiel: string;
  wann: string;
  heute: string;
}

export const TECHNIKEN: Technik[] = [
  {
    id: "ergebnis", gruppe: "Ziel setzen", name: "Ergebnis zuerst (Outcome-first)",
    idee: "Beschreib, wie das fertige Ergebnis aussieht und woran du erkennst, dass es gut ist. Den Weg dorthin überlässt du der KI.",
    beispiel: "Ziel: eine Seite für die Geschäftsführung, nach der sie Ja oder Nein zur Anschaffung sagen kann. Gut ist sie, wenn Kosten, Nutzen und Risiken mit Zahlen belegt und offene Punkte markiert sind. Wie du vorgehst, entscheidest du.",
    wann: "Fast immer, besonders bei Reasoning-Modellen und Agenten.",
    heute: "Die wichtigste Umstellung: OpenAI und Anthropic empfehlen inzwischen Ziel und Erfolgskriterien statt Schritt-für-Schritt-Anweisungen.",
  },
  {
    id: "annahmen", gruppe: "Ziel setzen", name: "Annahmen offenlegen",
    idee: "Die KI soll fehlende Angaben sinnvoll annehmen, sie nennen und weiterarbeiten, statt zu raten oder ständig nachzufragen.",
    beispiel: "Wenn dir Angaben fehlen, triff sinnvolle Annahmen, liste sie am Anfang auf und arbeite weiter. Frag nur nach, wenn eine falsche Annahme das ganze Ergebnis unbrauchbar machen würde.",
    wann: "Längere Aufgaben, Konzepte, Berechnungen.",
    heute: "Spart Hin und Her. Du siehst sofort, wo die KI geraten hat, und korrigierst nur das.",
  },
  {
    id: "verifikation", gruppe: "Selbst prüfen lassen", name: "Prüfschleife (Chain of Verification)",
    idee: "Die KI soll ihre eigene Antwort in einem festen Schritt überprüfen.",
    beispiel: "Analysiere diesen Vertrag und nenne die drei wichtigsten Erkenntnisse. Nenne dann drei Gründe, warum deine Analyse unvollständig sein könnte. Überarbeite deine Erkenntnisse danach.",
    wann: "Wichtige Analysen, bei denen Genauigkeit zählt.",
    heute: "Weiter nützlich. Reasoning-Modelle prüfen sich zwar selbst, ein ausdrücklicher Prüfschritt macht die Kritik aber sichtbar.",
  },
  {
    id: "angriff", gruppe: "Selbst prüfen lassen", name: "Gegenprobe (Adversarial Prompting)",
    idee: "Die KI soll gezielt Schwachstellen in ihrem eigenen Ergebnis suchen.",
    beispiel: "Greif deinen Entwurf an: Nenne fünf Wege, wie er scheitern könnte. Bewerte für jeden Wahrscheinlichkeit und Folgen.",
    wann: "Pläne, Konzepte, sicherheitskritische Aufgaben.",
    heute: "Sehr nützlich, weil Modelle antrainiert freundlich sind und von selbst zu wenig widersprechen.",
  },
  {
    id: "grenzfaelle", gruppe: "Mit Beispielen lenken", name: "Grenzfälle zeigen (Few-Shot)",
    idee: "Zeig der KI typische und knifflige Beispiele, damit sie feine Unterschiede erkennt.",
    beispiel: "Beispiel 1: eine eindeutige Beschwerde. Beispiel 2: eine Beschwerde, die wie Lob klingt. Beispiel 3: eine Frage, die wie eine Beschwerde klingt. Ordne nun diese 20 E-Mails ein …",
    wann: "Sortier- und Bewertungsaufgaben mit vielen Grenzfällen.",
    heute: "Weiter eine der wirksamsten Techniken. Zwei bis drei gute Beispiele ersetzen viele Regeln.",
  },
  {
    id: "meta", gruppe: "Prompts von der KI bauen lassen", name: "Prompt entwerfen lassen (Meta-Prompting)",
    idee: "Die KI entwirft den besten Prompt für eine Aufgabe und führt ihn dann aus.",
    beispiel: "Entwirf den wirksamsten Prompt, um Quartalsberichte auf Warnsignale für finanzielle Probleme zu prüfen. Berücksichtige Ziel, Erfolgskriterien und Ausgabeformat. Führe ihn dann auf diesen Bericht aus.",
    wann: "Neue, komplexe Aufgaben, bei denen du nicht weißt, wie der Prompt aussehen soll.",
    heute: "Nützlich als Startpunkt. Prüf den entworfenen Prompt, bevor du ihn als Vorlage speicherst.",
  },
  {
    id: "rekursiv", gruppe: "Prompts von der KI bauen lassen", name: "Prompt schrittweise verbessern",
    idee: "Die KI verbessert deinen Prompt in mehreren Durchgängen.",
    beispiel: "Hier ist mein Prompt: [PROMPT]. Version 1: Ergänze fehlende Vorgaben. Version 2: Beseitige Mehrdeutigkeiten. Version 3: Formuliere ein klares Ziel und „fertig, wenn …“.",
    wann: "Vorlagen, die du oft nutzt oder an andere weitergibst.",
    heute: "Gut für Skills und eigene Anweisungen. Ziel und Abnahmekriterien bringen mehr als zusätzliche Regeln.",
  },
  {
    id: "ausfuehrlich", gruppe: "Denken anleiten", name: "Tiefe begründen statt befehlen",
    idee: "Aktuelle Modelle antworten eher knapp. Wenn du Tiefe brauchst, sag, wofür.",
    beispiel: "Das ist Lernmaterial für neue Kolleginnen, die das Thema nicht kennen. Erklär deshalb jeden Punkt mit Umsetzungsdetails, typischen Fehlern und einem Beispiel.",
    wann: "Gründliche Ausarbeitungen, Lernmaterial, Dokumentation.",
    heute: "Statt GROSSBUCHSTABEN („NICHT zusammenfassen“) den Grund nennen. Wer weiß, wofür, wählt die passende Tiefe.",
  },
  {
    id: "konkurrierend", gruppe: "Denken anleiten", name: "Konkurrierende Szenarien",
    idee: "Mehrere Analysen derselben Lage nebeneinanderstellen.",
    beispiel: "Analysiere die Lage dreimal: bester Fall, schlechtester Fall, wahrscheinlichster Fall. Vergleiche dann die Annahmen hinter jeder Sicht.",
    wann: "Entscheidungen mit hoher Unsicherheit.",
    heute: "Weiter nützlich, besonders mit einem Reasoning-Modell.",
  },
  {
    id: "debatte", gruppe: "Perspektiven simulieren", name: "Debatte mehrerer Rollen",
    idee: "Die KI spielt mehrere Fachleute mit unterschiedlichen Zielen, die miteinander streiten.",
    beispiel: "Simuliere eine Debatte: Die Finanzchefin will Kosten sparen, der Technikchef will Qualität, die Geschäftsführerin will Tempo. Jede Person kritisiert die anderen. Leite dann eine Empfehlung ab.",
    wann: "Entscheidungen mit mehreren widerstreitenden Zielen.",
    heute: "Weiter nützlich, um blinde Flecken zu finden.",
  },
  {
    id: "sicherheit", gruppe: "Perspektiven simulieren", name: "Unsicher gegen sicher",
    idee: "Dieselbe Frage einmal aus vorsichtiger, einmal aus selbstsicherer Sicht beantworten lassen.",
    beispiel: "Analysiere das Problem zuerst als vorsichtige Berufseinsteigerin, die alles erklärt, dann als erfahrener Experte, der knapp urteilt. Zeig, wo Unsicherheit berechtigt ist.",
    wann: "Wenn du wissen willst, wie belastbar eine Einschätzung ist.",
    heute: "Ergänzend: Bitte direkt um eine Einschätzung, wie sicher sich das Modell ist und warum.",
  },
];

export const CHECKLISTE = [
  { punkt: "Ziel nennen", text: "Was soll am Ende vorliegen, und wofür brauchst du es?" },
  { punkt: "Kontext geben", text: "Für wen, was es schon gibt, was die KI nicht wissen kann. Fotos und Dateien helfen." },
  { punkt: "Ausgabe festlegen", text: "Format und Ton. Länge nur, wenn sie wirklich zählt." },
  { punkt: "Beispiele zeigen", text: "Zwei bis drei Beispiele machen das Muster klar." },
  { punkt: "Rückfragen erlauben", text: "„Frag nach, wenn etwas fehlt“ oder „Nenne deine Annahmen“." },
  { punkt: "Quellen verlangen", text: "Bei Fakten Quelle und Datum nennen lassen und zwei Links öffnen." },
  { punkt: "Nachbessern", text: "Im Gespräch verfeinern statt alles neu zu schreiben." },
];

export const FEHLER = [
  { punkt: "Zu vage", text: "„Erzähl mir was über KI“ lässt alles offen." },
  { punkt: "Kein Kontext", text: "Die KI kennt deine Lage nicht. Beschreib sie." },
  { punkt: "Weg statt Ziel", text: "Zehn Arbeitsschritte vorgeben, aber nicht sagen, was am Ende gut ist." },
  { punkt: "Alte Rezepte", text: "GROSSBUCHSTABEN, „Denk Schritt für Schritt“, „Nutze die Websuche“: Heutige Modelle brauchen das kaum." },
  { punkt: "Nicht geprüft", text: "Ob die KI gesucht hat, zeigen die Quellen-Links. Fehlen sie, stammt die Antwort aus dem Gedächtnis." },
];
