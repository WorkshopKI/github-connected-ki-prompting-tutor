/* ── Vorlagen für den Kurs ──
 * Übernommen aus prompt-tutor.kilab.org (Bibliothek, drei Stufen, Advanced, Ressourcen),
 * Stand 22.11.2026 aktualisiert: veraltete Jahreszahlen und Produktnamen entfernt,
 * Websuche-Prompts verlangen Datum und Quelle.
 */

export type Stufe = "alltag" | "beruf" | "forschung";

export const STUFEN: { id: Stufe; name: string; untertitel: string; text: string }[] = [
  { id: "alltag", name: "Alltagshelfer", untertitel: "Stufe 1", text: "Alltägliche Aufgaben mit präzisem Kontext: kochen, reisen, planen, lernen." },
  { id: "beruf", name: "Juniorassistent", untertitel: "Stufe 2", text: "Berufliche Aufgaben delegieren: E-Mails, Agenden, Feedback, Vorlagen." },
  { id: "forschung", name: "Forschungsassistent", untertitel: "Stufe 3", text: "Recherchen mit Websuche und Deep Research, Analysen, Konzepte." },
];

export interface Vorlage {
  stufe: Stufe;
  kategorie: string;
  titel: string;
  text: string;
  websuche?: boolean;
  deepResearch?: boolean;
}

export const VORLAGEN: Vorlage[] = [
  // ── Stufe 1: Alltag
  { stufe: "alltag", kategorie: "Kochen", titel: "Vegetarisches Rezept", text: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe." },
  { stufe: "alltag", kategorie: "Reisen", titel: "Italien-Reiseroute", text: "Erstelle eine Reiseroute für einen 7-tägigen Urlaub in Italien mit den Schwerpunkten Kultur und Natur, maximal 2 Stunden Fahrt pro Tag." },
  { stufe: "alltag", kategorie: "Reisen", titel: "Japan für Erstbesucher", text: "Was sind die fünf Orte in Japan, die Erstbesucher gesehen haben sollten? Nenne zu jedem einen Grund und die beste Reisezeit." },
  { stufe: "alltag", kategorie: "Geschenke", titel: "Geburtstagsgeschenk", text: "Finde ein Geschenk für meine Mutter zum Geburtstag, das ihr gefällt und nicht mehr als 50 Euro kostet. Sie mag Gartenarbeit und Krimis. Frag nach, wenn du mehr wissen musst." },
  { stufe: "alltag", kategorie: "Fitness", titel: "Home-Workout", text: "Erstelle einen 30-minütigen Trainingsplan für zu Hause ohne Ausrüstung, der sich auf Rücken und Körpermitte konzentriert." },
  { stufe: "alltag", kategorie: "Hobby", titel: "Bonsai-Pflege", text: "Wie pflege ich einen Bonsai richtig? Gib mir eine Schritt-für-Schritt-Anleitung zu Bewässerung, Licht und Schnitt." },
  { stufe: "alltag", kategorie: "Hobby", titel: "Wohnzimmer streichen", text: "Erstelle eine Schritt-für-Schritt-Anleitung zum Streichen meines Wohnzimmers (20 m², Altbau) mit Materialliste und Zeitaufwand." },
  { stufe: "alltag", kategorie: "Familie", titel: "Familientreffen", text: "Schlag unterhaltsame Aktivitäten für ein Familientreffen mit Kindern zwischen 5 und 12 Jahren vor, drinnen und draußen." },
  { stufe: "alltag", kategorie: "Finanzen", titel: "Haushaltsbudget", text: "Erstelle einen einfachen Budgetplan für einen 2-Personen-Haushalt mit 3.000 € netto im Monat als Tabelle mit festen und variablen Kosten." },
  { stufe: "alltag", kategorie: "Lernen", titel: "Spanisch in einem Monat", text: "Wie lerne ich in einem Monat Grundkenntnisse in Spanisch? Erstelle einen Lernplan mit täglich 20 Minuten Übung." },
  { stufe: "alltag", kategorie: "Haustiere", titel: "Hundetraining", text: "Wie gewöhne ich meinen Hund an neue Menschen? Gib mir eine Trainingsmethode mit konkreten Schritten für zwei Wochen." },
  { stufe: "alltag", kategorie: "Kleidung", titel: "Outfit-Beratung", text: "Ich habe ein Vorstellungsgespräch in einer kreativen Agentur. Gib mir drei Outfit-Vorschläge mit kurzer Begründung." },
  { stufe: "alltag", kategorie: "Technik", titel: "Smartphone-Kaufberatung", text: "Ich suche ein Smartphone für höchstens 500 €. Wichtig sind eine gute Kamera und lange Akkulaufzeit. Nutze die Websuche und empfiehl drei aktuelle Modelle mit Quelle.", websuche: true },
  { stufe: "alltag", kategorie: "Bildung", titel: "Online-Kurs finden", text: "Ich möchte meine Excel-Kenntnisse verbessern. Welche kostenlosen Online-Kurse gibt es aktuell? Nutze die Websuche und nenne Anbieter, Dauer und Link.", websuche: true },
  { stufe: "alltag", kategorie: "Mobilität", titel: "Gebrauchtwagen-Check", text: "Worauf muss ich beim Kauf eines Gebrauchtwagens achten? Erstelle eine Checkliste für die Besichtigung zum Ausdrucken." },
  { stufe: "alltag", kategorie: "Wohnen", titel: "Heizkosten sparen", text: "Wie kann ich in meiner Mietwohnung Heizkosten sparen? Gib mir 10 praktische Tipps mit geschätztem Einsparpotenzial." },

  // ── Stufe 2: Beruf
  { stufe: "beruf", kategorie: "Marketing", titel: "Kampagnenideen", text: "Liste 10 kreative und ungewöhnliche Ideen für eine Social-Media-Kampagne für ein neues Bio-Erfrischungsgetränk. Zielgruppe: 20 bis 35 Jahre." },
  { stufe: "beruf", kategorie: "Marketing", titel: "Marketing-Trends", text: "Was sind die wichtigsten Trends im digitalen Marketing der letzten sechs Monate? Nutze die Websuche, nenne zu jedem Trend Quelle und Datum.", websuche: true },
  { stufe: "beruf", kategorie: "Meetings", titel: "Meeting-Agenda", text: "Erstelle eine Agenda für ein Team-Meeting zur Quartalsplanung, insgesamt 90 Minuten, mit Zeitangaben und Verantwortlichen je Punkt." },
  { stufe: "beruf", kategorie: "Kommunikation", titel: "Konstruktives Feedback", text: "Hilf mir, Feedback für einen Kollegen zu formulieren. Er liefert gute Arbeit, verpasst aber oft Termine. Der Ton soll wertschätzend, aber klar sein." },
  { stufe: "beruf", kategorie: "Projekte", titel: "Statusbericht-Vorlage", text: "Erstelle eine Vorlage für einen wöchentlichen Projektstatusbericht mit den Abschnitten Fortschritt, Herausforderungen, nächste Schritte und Budget." },
  { stufe: "beruf", kategorie: "IT-Sicherheit", titel: "Datensicherheit-Checkliste", text: "Erstelle eine Checkliste, mit der ich die Datensicherheit in meinem Betrieb mit 10 Beschäftigten überprüfen kann." },
  { stufe: "beruf", kategorie: "Präsentieren", titel: "Präsentationsfähigkeiten", text: "Wie verbessere ich meine Präsentationsfähigkeiten? Gib mir fünf konkrete Techniken, jeweils mit einer Übung." },
  { stufe: "beruf", kategorie: "Team", titel: "Konfliktgespräch", text: "Zwei Teammitglieder haben einen Konflikt. Erstelle einen Leitfaden für ein Klärungsgespräch, das ich moderiere. KEINE ECHTEN NAMEN verwenden." },
  { stufe: "beruf", kategorie: "Team", titel: "Onboarding-Plan", text: "Erstelle einen Zwei-Wochen-Plan für das Onboarding einer neuen Kollegin, die überwiegend im Homeoffice arbeitet." },
  { stufe: "beruf", kategorie: "Recht", titel: "Freelancer-Vertrag", text: "Was muss ein Vertrag mit Freelancern enthalten? Liste die wichtigsten Klauseln auf und markiere, was eine Juristin prüfen sollte. [JURIST:IN PRÜFEN]" },
  { stufe: "beruf", kategorie: "Content", titel: "LinkedIn-Post", text: "Schreib einen LinkedIn-Post über die Bedeutung von Work-Life-Balance, höchstens 1.300 Zeichen, professionell aber persönlich." },
  { stufe: "beruf", kategorie: "Zeitmanagement", titel: "Tagesplan", text: "Erstelle einen Tagesplan für 8 Arbeitsstunden mit vielen Meetings. Berücksichtige Pausen und zwei Blöcke für konzentriertes Arbeiten." },
  { stufe: "beruf", kategorie: "Kundenkontakt", titel: "Antwort auf Beschwerde", text: "Formuliere eine Antwort auf eine Kundenbeschwerde wegen langer Lieferzeit. Zeig Verständnis und biete eine konkrete Lösung an." },
  { stufe: "beruf", kategorie: "Vertrieb", titel: "Elevator Pitch", text: "Erstelle einen zweiminütigen Elevator Pitch für eine neue Projektmanagement-Software. Zielgruppe: kleine und mittlere Betriebe." },
  { stufe: "beruf", kategorie: "Innovation", titel: "Brainstorming moderieren", text: "Plane eine 60-minütige Online-Brainstorming-Session für ein neues Produktfeature: Ablauf, Methoden und Zeitplan." },

  // ── Stufe 3: Forschung (Websuche und Deep Research)
  { stufe: "forschung", kategorie: "Nachrichten", titel: "Tagesnachrichten", text: "Nutze die Websuche und liste die drei wichtigsten deutschsprachigen Nachrichten von heute, jeweils mit Kurzfassung und Quelle.", websuche: true },
  { stufe: "forschung", kategorie: "Nachrichten", titel: "Inflationszahlen", text: "Finde per Websuche die neueste Inflationsrate für Deutschland (letzter verfügbarer Monat). Nenne Quelle und Veröffentlichungsdatum.", websuche: true },
  { stufe: "forschung", kategorie: "Lokal", titel: "Restaurants finden", text: "Recherchiere per Websuche drei gut bewertete italienische Restaurants in Köln mit Adresse, Preisspanne und Link.", websuche: true },
  { stufe: "forschung", kategorie: "Lokal", titel: "Veranstaltungen", text: "Welche kulturellen Veranstaltungen gibt es nächstes Wochenende (Freitag bis Sonntag) in Berlin? Nutze die Websuche und nenne Links.", websuche: true },
  { stufe: "forschung", kategorie: "Sport", titel: "Bundesliga-Tabelle", text: "Wer führt aktuell die Bundesliga an? Nutze die Websuche und nenne die ersten fünf Teams mit Punkten, Tordifferenz und Stand der Tabelle.", websuche: true },
  { stufe: "forschung", kategorie: "Preise", titel: "Preisvergleich", text: "Suche im Web die drei günstigsten Online-Angebote für {Produkt} und nenne zu jedem Händler, Preis und Datum des Angebots.", websuche: true },
  { stufe: "forschung", kategorie: "Gesundheit", titel: "Ernährungsstudien", text: "Was sind die wichtigsten Erkenntnisse zu gesunder Ernährung aus Studien der letzten zwei Jahre? Fasse drei Studien zusammen und verlinke sie.", websuche: true },
  { stufe: "forschung", kategorie: "Technik", titel: "KI-Entwicklungen", text: "Recherchiere die wichtigsten KI-Entwicklungen der letzten drei Monate. Nenne mindestens fünf mit Datum und Quelle.", websuche: true },
  { stufe: "forschung", kategorie: "Wirtschaft", titel: "Börsen-Update", text: "Wie haben sich DAX und MDAX heute entwickelt? Nutze die Websuche und nenne die drei größten Gewinner und Verlierer mit Uhrzeit des Stands.", websuche: true },
  { stufe: "forschung", kategorie: "Wohnen", titel: "Mietpreise", text: "Recherchiere die durchschnittliche Miete für eine 2-Zimmer-Wohnung in München, Hamburg und Berlin und vergleiche die Städte in einer Tabelle mit Quellen.", websuche: true },
  { stufe: "forschung", kategorie: "Produktvergleich", titel: "E-Auto-Vergleich", text: "Vergleiche die drei meistverkauften E-Autos unter 40.000 € in Deutschland: Reichweite im Winter, Gesamtkosten über 5 Jahre und Restwert. Erstelle eine Tabelle und eine gewichtete Entscheidungsmatrix (Kosten 40 %, Reichweite 30 %, Restwert 30 %) und begründe die Empfehlung.", deepResearch: true },
  { stufe: "forschung", kategorie: "Vergleichsstudie", titel: "Windkraft in Europa", text: "Vergleiche Offshore- und Onshore-Windkraft in Europa nach Kosten pro MWh, Umweltauswirkungen, Genehmigungsdauer und Akzeptanz. Tabelle, dann Vor- und Nachteile im Fließtext, mindestens vier Studien der letzten drei Jahre.", deepResearch: true },
  { stufe: "forschung", kategorie: "Konzept", titel: "Digitale Arztpraxis", text: "Erstelle ein Konzept (ca. 1.200 Wörter) für die Digitalisierung der Patientenakten in einer mittelgroßen Arztpraxis: Beteiligte, Zeitplan, Kosten, Veränderungsmanagement, Risiken. Am Ende eine Roadmap in Stichpunkten.", deepResearch: true },
  { stufe: "forschung", kategorie: "Marktanalyse", titel: "Fleischersatz-Markt", text: "Analysiere den deutschen Markt für pflanzliche Fleischersatzprodukte: aktuelle Marktgröße, Prognose für die nächsten vier Jahre, wichtigste Anbieter, Zielgruppen, Preise. Executive Summary (höchstens 500 Wörter) plus Tabelle.", deepResearch: true },
  { stufe: "forschung", kategorie: "Bildung", titel: "Digitale Schule", text: "Wie steht Deutschland bei der digitalen Bildung in Schulen im internationalen Vergleich? Ausstattung, Fortbildung, Lernplattformen. Nur Studien der letzten drei Jahre, Bericht mit Empfehlungen (1.000 Wörter).", deepResearch: true },
  { stufe: "forschung", kategorie: "Nachhaltigkeit", titel: "CO₂-Bilanz", text: "Erstelle einen Leitfaden zur Berechnung und Senkung der CO₂-Bilanz für einen Produktionsbetrieb mit 100 Beschäftigten: Methode, Werkzeuge, schnelle Erfolge, langfristige Strategie.", deepResearch: true },
  { stufe: "forschung", kategorie: "Gesundheit", titel: "Telemedizin", text: "Entwickle ein Konzept für Telemedizin in einer Hausarztpraxis: Technik, Recht, Akzeptanz, Abrechnung, Risiken. Ca. 1.500 Wörter mit Umsetzungsplan. [JURIST:IN PRÜFEN]", deepResearch: true },
  { stufe: "forschung", kategorie: "Stadtentwicklung", titel: "Smart City", text: "Entwirf ein Smart-City-Konzept für eine deutsche Stadt mit 50.000 Einwohnern: Mobilität, Energie, Bürgerbeteiligung. Recherchiere Beispiele aus Europa, erstelle einen Fünf-Jahres-Plan und eine Kostenübersicht.", deepResearch: true },
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
    beispiel: "Entwirf den wirksamsten Prompt, um Quartalsberichte auf Warnsignale für finanzielle Probleme zu prüfen. Berücksichtige Details, Ausgabeformat und Denkschritte. Führe ihn dann auf diesen Bericht aus.",
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
    id: "ausfuehrlich", gruppe: "Denken anleiten", name: "Ausführlichkeit verlangen",
    idee: "Modelle fassen gern zusammen. Fordere Tiefe ausdrücklich an.",
    beispiel: "Fasse NICHT zusammen. Erweitere jeden Punkt um Umsetzungsdetails, Grenzfälle, typische Fehler und Hintergrund.",
    wann: "Gründliche Ausarbeitungen, Lernmaterial, Dokumentation.",
    heute: "Seltener nötig. Besser: Zielgruppe und Zweck nennen, dann passt die Länge meist von selbst.",
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
  { punkt: "Kontext geben", text: "Für wen, wozu, was es schon gibt." },
  { punkt: "Genau sein", text: "Je präziser die Anfrage, desto besser das Ergebnis." },
  { punkt: "Ausgabe festlegen", text: "Länge, Format, Ton, Zielgruppe." },
  { punkt: "Beispiele zeigen", text: "Zwei bis drei Beispiele machen das Muster klar." },
  { punkt: "Nachbessern", text: "Im Gespräch verfeinern statt alles neu zu schreiben." },
  { punkt: "Quellen verlangen", text: "Bei Fakten Quelle und Datum nennen lassen." },
];

export const FEHLER = [
  { punkt: "Zu vage", text: "„Erzähl mir was über KI“ lässt alles offen." },
  { punkt: "Kein Kontext", text: "Die KI kennt deine Lage nicht. Beschreib sie." },
  { punkt: "Zu viel auf einmal", text: "Große Aufgaben in Schritte zerlegen." },
  { punkt: "Unausgesprochenes", text: "Was du nicht schreibst, kann die KI nur raten." },
];
