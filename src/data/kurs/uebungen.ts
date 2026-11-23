/* ── Kurs-Übungen ──
 * Je Kursmodul zwei bis drei Übungen, passend zu den vier Disziplinen.
 * Funktionieren ohne Anmeldung und ohne KI-Verbindung: Selbstcheck, Musterlösung,
 * und ein Prüfprompt zum Kopieren, den man in jeden Chatbot einfügen kann.
 * Die Organisations-App behält ihren eigenen Lernpfad (inkl. RAKETE); im Kurs gilt ACTA.
 */

export interface VerbessernUebung {
  typ: "verbessern";
  id: string;
  modul: string;
  titel: string;
  lage: string;
  schwach: string;
  aufgabe: string;
  kriterien: string[];
  muster: string;
  warum: string;
}

export interface FindenUebung {
  typ: "finden";
  id: string;
  modul: string;
  titel: string;
  lage: string;
  /** Material, das geprüft wird (Text, Bericht, Auftrag). */
  material?: string;
  frage: string;
  aussagen: { text: string; richtig: boolean; erklaerung: string }[];
}

export type KursUebung = VerbessernUebung | FindenUebung;

export const KURS_UEBUNGEN: KursUebung[] = [
  // ── Wie ein Sprachmodell arbeitet
  {
    typ: "finden", id: "sm-aussagen", modul: "wie-sprachmodelle-arbeiten",
    titel: "Stimmt das?",
    lage: "Nach den Animationen: Was hast du über Sprachmodelle verstanden?",
    frage: "Kreuz alle Aussagen an, die stimmen.",
    aussagen: [
      { text: "Ein Sprachmodell schlägt Antworten in einer Datenbank nach.", richtig: false, erklaerung: "Es berechnet Wort für Wort, was wahrscheinlich folgt. Eine Datenbank mit Antworten gibt es nicht." },
      { text: "Mehr Kontext im Prompt verschiebt, welche Wörter wahrscheinlich sind.", richtig: true, erklaerung: "Genau das macht gutes Prompting wirksam." },
      { text: "Ohne Websuche kennt das Modell nur den Stand seines Trainings.", richtig: true, erklaerung: "Neuere Ereignisse kommen nur über Suche, Dateien oder deinen Prompt hinein." },
      { text: "Wenn die Antwort sicher klingt, ist sie meistens richtig.", richtig: false, erklaerung: "Der Ton sagt nichts über die Richtigkeit. Auch Erfundenes klingt flüssig." },
      { text: "Dieselbe Frage kann zu unterschiedlichen Antworten führen.", richtig: true, erklaerung: "Das Modell wählt mit etwas Zufall aus (Temperatur)." },
    ],
  },
  // ── ACTA
  {
    typ: "verbessern", id: "acta-vermieter", modul: "fragen-mit-acta",
    titel: "E-Mail an den Vermieter",
    lage: "In deiner Wohnung tropft seit zwei Wochen der Wasserhahn in der Küche. Du hast schon einmal angerufen, passiert ist nichts.",
    schwach: "Schreib eine Mail an meinen Vermieter wegen dem Wasserhahn.",
    aufgabe: "Bau mit ACTA einen Prompt, nach dem die Mail sofort verschickt werden kann.",
    kriterien: [
      "Der Kontext steht drin: seit wann, was schon passiert ist",
      "Die Aufgabe ist klar: Mail mit Bitte um Reparatur bis zu einem Termin",
      "Ton und Länge sind festgelegt",
      "Es ist klar, was am Ende in der Mail stehen muss (z. B. Frist, Erreichbarkeit)",
    ],
    muster: "Ich bin Mieterin einer Wohnung. Seit zwei Wochen tropft der Wasserhahn in der Küche, ich habe am 10. des Monats angerufen, seitdem ist nichts passiert.\nSchreib eine E-Mail an meinen Vermieter, Herrn {Name}, mit der Bitte, die Reparatur bis {Datum} zu veranlassen.\nTon: freundlich, aber bestimmt. Länge: höchstens 120 Wörter. Nenne am Ende, wann ich für Handwerker erreichbar bin: {Zeiten}.",
    warum: "Kontext und Frist machen aus einer Bitte eine klare Aufforderung. Eine Rolle braucht es hier nicht.",
  },
  {
    typ: "verbessern", id: "acta-protokoll", modul: "fragen-mit-acta",
    titel: "Notizen zu einem Protokoll",
    lage: "Du hast nach einer Vereinssitzung Stichpunkte getippt und willst daraus ein Protokoll für alle Mitglieder.",
    schwach: "Mach aus meinen Notizen ein Protokoll.",
    aufgabe: "Ergänze, was die KI wissen muss, damit das Protokoll passt.",
    kriterien: [
      "Für wen ist das Protokoll und wofür wird es genutzt",
      "Gliederung oder Format ist vorgegeben",
      "Beschlüsse und Aufgaben werden hervorgehoben",
      "Es ist gesagt, was die KI nicht tun soll (z. B. nichts erfinden)",
    ],
    muster: "Hier sind meine Stichpunkte aus der Vorstandssitzung unseres Sportvereins vom {Datum}.\nErstelle daraus ein Protokoll für alle Mitglieder. Gliederung: Teilnehmende, Themen, Beschlüsse, Aufgaben (wer, was, bis wann).\nFormuliere sachlich und kurz. Ergänze nichts, was nicht in den Notizen steht; markiere Unklares mit [?].\n\nNotizen:\n{Notizen}",
    warum: "Die Ausgabe ist genau beschrieben, und „nichts ergänzen“ verhindert erfundene Beschlüsse.",
  },
  {
    typ: "finden", id: "acta-bausteine", modul: "fragen-mit-acta",
    titel: "Welcher Baustein fehlt?",
    lage: "„Du bist Reiseberaterin. Plane eine Woche Urlaub.“",
    frage: "Was fehlt diesem Prompt am meisten? Kreuz alles an, was fehlt.",
    aussagen: [
      { text: "Die Rolle", richtig: false, erklaerung: "Die Rolle ist da: Reiseberaterin." },
      { text: "Der Kontext: wer reist, wohin, Budget, Interessen", richtig: true, erklaerung: "Ohne Kontext plant die KI einen Durchschnittsurlaub." },
      { text: "Die Ausgabe: Format, Länge", richtig: true, erklaerung: "Tabelle pro Tag? Fließtext? Mit Kosten? Das bleibt offen." },
      { text: "Die Aufgabe", richtig: false, erklaerung: "Die Aufgabe ist da, wenn auch knapp: eine Woche planen." },
    ],
  },
  // ── Recherche
  {
    typ: "finden", id: "rech-bericht", modul: "recherche",
    titel: "Bericht prüfen",
    lage: "Ein Deep-Research-Bericht zur Frage, ob sich ein Balkonkraftwerk für eine Mietwohnung in Stuttgart lohnt. Ausschnitt:",
    material: "„Ein Balkonkraftwerk mit 800 Watt erzeugt in Stuttgart rund 750 kWh pro Jahr [1]. Bei einem Strompreis von 28 Cent spart ein Haushalt damit etwa 210 € jährlich [2]. Die Stadt Stuttgart fördert jedes Gerät mit 500 € [3]. Vermieter müssen der Anbringung immer zustimmen [4].“\n\n[1] Herstellerseite eines Solarhändlers (ohne Datum)\n[2] Vergleichsportal, Stand 2023\n[3] Stuttgarter Zeitung, Artikel von 2022\n[4] Verbraucherzentrale, aktualisiert 2026",
    frage: "Welche Stellen solltest du nachprüfen, bevor du dich darauf verlässt?",
    aussagen: [
      { text: "Die 750 kWh: Quelle ist ein Händler, ohne Datum", richtig: true, erklaerung: "Händler rechnen gern optimistisch. Eine unabhängige Quelle (z. B. Verbraucherzentrale, Rechner der HTW Berlin) prüfen." },
      { text: "Der Strompreis von 2023", richtig: true, erklaerung: "Veraltet. Deinen aktuellen Tarif einsetzen, dann ändert sich die Ersparnis." },
      { text: "Die Förderung von 500 €: Zeitungsartikel von 2022", richtig: true, erklaerung: "Förderprogramme laufen aus. Auf der Seite der Stadt nachsehen, ob es sie noch gibt." },
      { text: "Die Aussage zur Zustimmung des Vermieters", richtig: true, erklaerung: "Quelle ist aktuell und seriös, aber das Wort „immer“ stimmt so nicht: Seit 2024 haben Mieter grundsätzlich einen Anspruch auf Zustimmung. Öffne die Quelle und lies selbst nach." },
    ],
  },
  {
    typ: "verbessern", id: "rech-websuche", modul: "recherche",
    titel: "Eine Websuche, die du prüfen kannst",
    lage: "Du willst wissen, ob es in deiner Stadt noch Zuschüsse für neue Fahrräder oder Lastenräder gibt.",
    schwach: "Gibt es Förderung für Lastenräder?",
    aufgabe: "Formuliere den Prompt so, dass die Antwort aktuell und überprüfbar ist.",
    kriterien: [
      "Ort und Zielgruppe sind genannt",
      "Es ist klar, dass aktuelle Angaben gebraucht werden (Stand, Zeitraum)",
      "Quelle und Stand (Datum) werden für jede Angabe verlangt",
      "Es ist gesagt, was passieren soll, wenn nichts gefunden wird",
    ],
    muster: "Gibt es derzeit Zuschüsse für Lastenräder für Privatpersonen in {Stadt} oder {Bundesland}?\nNenne für jedes Programm Förderhöhe, Bedingungen, Frist, Link und das Datum der Seite.\nNutze bevorzugt Seiten von Stadt, Land und Verbraucherzentrale. Wenn du nichts Aktuelles findest, sag das ausdrücklich, statt alte Programme aufzulisten.",
    warum: "Mit Ort, Stand und Quellenpflicht kannst du jede Aussage in einer Minute selbst prüfen. „Nutze die Websuche“ ist nicht nötig: Bei so einer Frage sucht die KI selbst. Fehlen in der Antwort die Links, Suche per Symbol einschalten.",
  },
  // ── Grenzen, Datenschutz, Recht
  {
    typ: "finden", id: "dsgvo-was-darf", modul: "grenzen-und-recht",
    titel: "Was darf in den Prompt?",
    lage: "Du nutzt ein privates, kostenloses KI-Konto.",
    frage: "Welche Eingaben sind unbedenklich?",
    aussagen: [
      { text: "„Formuliere eine Absage an einen Bewerber. Grund: andere Person besser passend.“", richtig: true, erklaerung: "Keine Namen, keine Details zur Person. Unbedenklich." },
      { text: "Den Arztbrief deiner Mutter hochladen und erklären lassen", richtig: false, erklaerung: "Gesundheitsdaten einer anderen Person. Vorher Namen, Geburtsdatum und Adresse schwärzen oder ein datenschutzfreundliches Angebot nutzen." },
      { text: "Eine Kundenliste mit Namen und Telefonnummern sortieren lassen", richtig: false, erklaerung: "Personenbezogene Daten von Dritten gehören nicht in ein privates KI-Konto." },
      { text: "„Erkläre mir den Unterschied zwischen Kündigung und Aufhebungsvertrag.“", richtig: true, erklaerung: "Allgemeine Wissensfrage ohne persönliche Daten." },
      { text: "Einen internen Vertrag deines Arbeitgebers zusammenfassen lassen", richtig: false, erklaerung: "Vertrauliche Firmendaten nur in Tools, die dein Betrieb freigegeben hat." },
    ],
  },
  {
    typ: "verbessern", id: "dsgvo-schwaerzen", modul: "grenzen-und-recht",
    titel: "Schwärzen vor dem Senden",
    lage: "Du willst Hilfe bei einer schwierigen Nachricht an eine Kollegin.",
    schwach: "Hilf mir, Frau Petra Schneider aus der Buchhaltung (Tel. 0711 123456) zu sagen, dass ihre Abrechnung vom 3. März schon wieder Fehler hatte und ich das an Herrn Weber melde.",
    aufgabe: "Schreib den Prompt so um, dass keine personenbezogenen Daten mehr drinstehen, die Hilfe aber genauso gut wird.",
    kriterien: [
      "Keine Namen, keine Telefonnummer",
      "Platzhalter wie [KOLLEGIN] oder [VORGESETZTER] statt echter Personen",
      "Die Lage bleibt verständlich (wiederholte Fehler, Meldung angekündigt)",
      "Ton und Ziel der Nachricht sind beschrieben",
    ],
    muster: "Hilf mir, einer Kollegin [KOLLEGIN] aus der Buchhaltung eine Nachricht zu schreiben: In ihrer Abrechnung waren zum zweiten Mal Fehler. Ich möchte ihr fair sagen, dass ich das beim nächsten Mal an [VORGESETZTER] melden muss.\nTon: sachlich, wertschätzend, klar. Höchstens 100 Wörter.",
    warum: "Für gute Formulierungen braucht die KI die Lage, aber keine echten Personen.",
  },
  // ── Sprechen, Fotos, Kamera
  {
    typ: "finden", id: "foto-zuschneiden", modul: "sprechen-und-sehen",
    titel: "Was zeigt dein Foto mehr als nötig?",
    lage: "Du willst ein Foto deiner Nebenkostenabrechnung erklären lassen. Auf dem Foto ist das ganze Blatt zu sehen, daneben liegt dein Handy mit einer offenen Nachricht.",
    frage: "Was solltest du vor dem Hochladen abschneiden oder abdecken?",
    aussagen: [
      { text: "Deinen Namen und deine Adresse", richtig: true, erklaerung: "Für die Erklärung braucht die KI sie nicht." },
      { text: "Die Kundennummer und IBAN", richtig: true, erklaerung: "Nummern, mit denen sich Konten oder Verträge zuordnen lassen, gehören nicht hoch." },
      { text: "Die Tabelle mit den Kostenposten", richtig: false, erklaerung: "Die brauchst du für die Frage. Sie bleibt drauf." },
      { text: "Das Handy mit der offenen Nachricht", richtig: true, erklaerung: "Fremde Nachrichten und Namen haben auf dem Foto nichts zu suchen." },
    ],
  },
  // ── KI im Betrieb
  {
    typ: "verbessern", id: "betrieb-start", modul: "ki-im-betrieb",
    titel: "Einen Pilotversuch beschreiben",
    lage: "Du willst deiner Chefin vorschlagen, KI für eine konkrete Aufgabe vier Wochen lang zu testen.",
    schwach: "Schreib einen Vorschlag, dass wir KI einführen.",
    aufgabe: "Lass dir einen kurzen, überzeugenden Vorschlag für einen Test schreiben.",
    kriterien: [
      "Eine konkrete Aufgabe statt „KI einführen“",
      "Messbarer Vergleich: Zeit oder Qualität vorher und nachher",
      "Regeln: welches Tool, welche Daten nicht",
      "Wer prüft die Ergebnisse, und wann wird entschieden",
    ],
    muster: "Ich arbeite im Kundenservice eines Versandhändlers mit 40 Beschäftigten. Schreib einen Vorschlag an meine Chefin (höchstens eine Seite) für einen vierwöchigen Test: KI formuliert Entwürfe für Antworten auf Standardanfragen, wir prüfen und senden selbst.\nEnthalten soll er: Ziel, Ablauf, gemessene Werte (Bearbeitungszeit, Rückfragen), Regeln (freigegebenes Tool, keine Kundendaten im Prompt), wer prüft, Entscheidung nach vier Wochen.\nTon: sachlich, ohne Übertreibung.",
    warum: "Ein kleiner, messbarer Test überzeugt mehr als eine große Vision, und die Regeln nehmen Bedenken vorweg.",
  },
  // ── Bilder
  {
    typ: "verbessern", id: "bild-4s", modul: "bilder",
    titel: "Ein Plakat-Motiv mit den vier S",
    lage: "Dein Chor sucht neue Mitglieder und braucht ein Bild für ein Plakat.",
    schwach: "Ein Bild von einem Chor.",
    aufgabe: "Ergänze Subjekt, Szene, Setting und Stil.",
    kriterien: [
      "Subjekt: wer genau ist zu sehen",
      "Szene: was passiert, welche Stimmung",
      "Setting: Ort und Hintergrund",
      "Stil: Fotografie, Illustration, Farben; dazu Platz für Text",
    ],
    muster: "Ein gemischter Chor aus Menschen zwischen 20 und 70 Jahren singt fröhlich, einige lachen, eine Frau in der Mitte dirigiert. Probenraum mit großen Fenstern, Abendlicht. Freundliche Illustration in warmen Farben, oben ein freier Bereich für Text, Querformat.",
    warum: "Vielfalt, Stimmung und Platz für Text sind die Dinge, die ein Plakat braucht. Echte Personen oder bekannte Marken bleiben draußen.",
  },
  // ── Gestalten
  {
    typ: "verbessern", id: "gest-anweisung", modul: "gestalten",
    titel: "Deine eigenen Anweisungen",
    lage: "Du willst nicht jedes Mal neu erklären, wer du bist und wie du Antworten haben willst.",
    schwach: "Sei hilfreich und antworte gut.",
    aufgabe: "Schreib eigene Anweisungen für dein KI-Konto (höchstens 6 Zeilen).",
    kriterien: [
      "Wer du bist und wofür du die KI meistens nutzt",
      "Wie Antworten aussehen sollen (Sprache, Länge, Ton)",
      "Was bei fehlenden Infos passieren soll (nachfragen statt raten)",
      "Kein Name, keine Adresse, keine vertraulichen Daten",
    ],
    muster: "Ich arbeite als {Beruf} und nutze dich vor allem für Texte, Recherchen und Planungen.\nAntworte auf Deutsch, sachlich und kurz; Listen nur, wenn es echte Aufzählungen sind.\nWenn dir Informationen fehlen, frag nach, statt zu raten.\nNenne bei Fakten zu Gesetzen, Preisen und Terminen eine Quelle.\nSag mir ehrlich, wenn du meine Idee für schwach hältst.",
    warum: "Diese Zeilen wirken in jedem Chat. Die letzte Zeile gleicht aus, dass Modelle antrainiert freundlich sind.",
  },
  // ── Steuern
  {
    typ: "verbessern", id: "steuern-ziel", modul: "steuern",
    titel: "Vom Regelkatalog zum Ziel",
    lage: "Du brauchst einen Text für die Website deines Handwerksbetriebs.",
    schwach: "Schreib einen Text über uns. IMMER kurze Sätze. NIEMALS Fachbegriffe. KEINE Superlative. Maximal 150 Wörter. Nicht zu werblich. Unbedingt sympathisch. Auf keinen Fall Floskeln.",
    aufgabe: "Ersetze die Regeln durch Ziel, Leserschaft und „fertig, wenn …“.",
    kriterien: [
      "Ein Ziel: Was soll der Text bei Lesenden bewirken",
      "Die Leserschaft ist beschrieben",
      "Die nötigen Fakten über den Betrieb sind genannt",
      "Ein prüfbares „fertig, wenn …“",
    ],
    muster: "Ziel: Menschen aus der Region, die eine neue Heizung brauchen, sollen nach dem Lesen bei uns anrufen.\nLeserschaft: Eigenheimbesitzer, oft über 50, wenig Technikwissen.\nFakten: Familienbetrieb seit 1987, 12 Beschäftigte, Wärmepumpen und Gasheizungen, Notdienst.\nFertig, wenn: Ein Leser in 30 Sekunden weiß, was wir machen, warum wir vertrauenswürdig sind und wie er uns erreicht.",
    warum: "Ein starkes Modell trifft die Stilentscheidungen selbst richtig, wenn es weiß, wozu der Text da ist.",
  },
  {
    typ: "finden", id: "steuern-ziel-regel", modul: "steuern",
    titel: "Ziel oder Regel?",
    lage: "Aus einem Prompt für einen Newsletter.",
    frage: "Welche Sätze geben ein Ziel oder einen Zweck vor (statt nur einer Regel)?",
    aussagen: [
      { text: "„Die Leser sollen sich bis Freitag für den Workshop anmelden.“", richtig: true, erklaerung: "Ein Ziel: Daran kann das Modell alles ausrichten." },
      { text: "„Verwende NIEMALS Ausrufezeichen.“", richtig: false, erklaerung: "Eine Regel ohne Begründung." },
      { text: "„Viele lesen auf dem Handy in der Bahn, also muss das Wichtigste oben stehen.“", richtig: true, erklaerung: "Ein Zweck mit Begründung. Daraus folgen viele Regeln von selbst." },
      { text: "„Maximal drei Absätze.“", richtig: false, erklaerung: "Eine Regel. Kann sinnvoll sein, besser mit Grund." },
    ],
  },
  // ── Delegieren
  {
    typ: "finden", id: "del-risiken", modul: "delegieren",
    titel: "Risiken im Agenten-Auftrag",
    lage: "Ein Auftrag an einen KI-Agenten mit Zugriff auf E-Mail und Browser:",
    material: "„Finde für unseren Vereinsausflug einen Bus für 40 Personen am 14. Juni. Hol Angebote ein, such das günstigste aus und buch es. Schick allen Mitgliedern die Bestätigung.“",
    frage: "Was ist an diesem Auftrag riskant?",
    aussagen: [
      { text: "Der Agent soll ohne Rückfrage buchen", richtig: true, erklaerung: "Kaufen und Buchen immer erst nach deiner Freigabe." },
      { text: "Der Agent schreibt eigenständig an alle Mitglieder", richtig: true, erklaerung: "Nachrichten an viele Menschen vorher selbst lesen und freigeben." },
      { text: "„Günstigstes“ ist das einzige Kriterium", richtig: true, erklaerung: "Ohne Mindestanforderungen (Sicherheit, Bewertungen, Abfahrtsort) kann das schiefgehen." },
      { text: "Das Datum und die Personenzahl sind angegeben", richtig: false, erklaerung: "Das ist gut so. Diese Angaben braucht der Agent." },
    ],
  },
  {
    typ: "verbessern", id: "del-auftrag", modul: "delegieren",
    titel: "Den Busauftrag sicher machen",
    lage: "Derselbe Vereinsausflug, aber diesmal mit klaren Grenzen.",
    schwach: "Finde einen Bus für 40 Personen am 14. Juni, buch das günstigste Angebot und schick allen die Bestätigung.",
    aufgabe: "Schreib den Auftrag mit Ziel, Material, Grenzen und „fertig, wenn …“.",
    kriterien: [
      "Klares Ergebnis: z. B. Vergleichstabelle mit drei Angeboten",
      "Mindestanforderungen an Angebote sind genannt",
      "Grenzen: nichts buchen, nichts versenden ohne Freigabe",
      "Prüfbares „fertig, wenn …“",
    ],
    muster: "Ziel: drei Angebote für einen Reisebus mit 40 Plätzen am 14. Juni, Abfahrt {Ort} 8 Uhr, Rückkehr 19 Uhr.\nAnforderungen: Unternehmen mit Sitz in der Region, Gurte, Bewertungen über 4 Sterne.\nGrenzen: Anfragen nur über Kontaktformulare, nichts buchen, keine Nachrichten an Mitglieder.\nFertig, wenn: eine Tabelle mit Anbieter, Preis, Leistungen und Link vorliegt und du mir eine Empfehlung mit Begründung gibst.",
    warum: "Der Agent erledigt die Fleißarbeit, die Entscheidung und alles Unumkehrbare bleiben bei dir.",
  },
  // ── Spezifizieren
  {
    typ: "verbessern", id: "spez-zerlegen", modul: "spezifizieren",
    titel: "Eine große Aufgabe zerlegen",
    lage: "Du sollst für deinen Betrieb ein Konzept für ein Sommerfest mit 120 Gästen erstellen.",
    schwach: "Plane unser Sommerfest.",
    aufgabe: "Lass die KI zuerst planen und erst nach deiner Freigabe ausarbeiten.",
    kriterien: [
      "Rahmendaten: Datum, Gäste, Budget, Ort",
      "Die KI soll zuerst einen Plan mit Teilaufgaben vorlegen",
      "Ausdrückliche Pause für deine Freigabe",
      "Festgelegtes Endprodukt mit Abnahmekriterien",
    ],
    muster: "Wir planen ein Sommerfest für 120 Beschäftigte und Familien am {Datum}, Budget {Betrag}, auf unserem Firmengelände.\nSchritt 1: Zerlege die Planung in Teilaufgaben (z. B. Essen, Programm für Kinder, Technik, Genehmigungen) und schätze für jede Aufwand und Kosten. Stell mir dann Rückfragen und warte auf meine Freigabe.\nSchritt 2 (nach Freigabe): Erstelle für jede Teilaufgabe eine Checkliste mit Verantwortlichen und Terminen.\nFertig, wenn: Alle Teilaufgaben eine Checkliste haben und die Summe im Budget liegt.",
    warum: "Ein Plan zum Freigeben verhindert, dass die KI eine Stunde in die falsche Richtung arbeitet.",
  },
];

export const uebungenFuer = (modulId: string) => KURS_UEBUNGEN.filter((u) => u.modul === modulId);

/** Prüfprompt zum Kopieren: funktioniert in jedem Chatbot, auch wenn die App-KI ausfällt. */
export function pruefPrompt(u: VerbessernUebung, eigenerPrompt: string) {
  return `Du bist ein strenger, freundlicher Prompt-Coach. Prüfe meinen Prompt.

Lage: ${u.lage}
Ziel der Übung: ${u.aufgabe}

Kriterien:
${u.kriterien.map((k, i) => `${i + 1}. ${k}`).join("\n")}

Bewerte jedes Kriterium mit „erfüllt“, „teilweise“ oder „fehlt“ und begründe kurz. Schlag danach eine verbesserte Fassung vor, die so nah wie möglich an meiner bleibt.

Mein Prompt:
${eigenerPrompt.trim() || "(noch leer)"}`;
}
