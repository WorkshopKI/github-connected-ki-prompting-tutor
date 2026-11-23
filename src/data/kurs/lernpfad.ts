/* ── Kurs-Lernpfad ──
 * Zwei Tage entlang der vier Disziplinen: Fragen → Gestalten → Steuern → Spezifizieren.
 * Inhalte zusammengeführt aus prompting-tutor.kilab.org, prompt-tutor.kilab.org,
 * miniprojekte.lovable.app und den Kursfolien v22. Stand: 23.11.2026.
 * `optional`: kann bei Zeitmangel entfallen (Hinweis, was dann geschieht). Gleiches Feld in fahrplan.json.
 */

export type Disziplin = "verstehen" | "fragen" | "gestalten" | "steuern" | "spezifizieren" | "anwenden";

export interface KursPrompt {
  titel: string;
  text: string;
  hinweis?: string;
}

export interface KursModul {
  id: string;
  tag: 1 | 2;
  disziplin: Disziplin;
  titel: string;
  dauer: string;
  ziel: string;
  kernpunkte: string[];
  erklaert?: string[];
  prompts?: KursPrompt[];
  vergleich?: { vorher: string; nachher: string; warum: string };
  uebung?: { aufgabe: string; link?: string; linkLabel?: string };
  /** Weiterführende Seiten im Kursbereich. */
  mehr?: { label: string; link: string }[];
  /** Bei Zeitmangel verzichtbar; der Text sagt, was dann passiert (z. B. „zu Hause nachholen“). */
  optional?: string;
  /** Checkliste mit Klickpfaden für Claude und ChatGPT (Lektion „Konto einrichten“). */
  einstellungen?: Einstellung[];
  /** Ablauf einer Übung in Schritten. */
  schritte?: string[];
}

export interface Einstellung {
  id: string;
  thema: string;
  warum: string;
  claude: string;
  chatgpt: string;
  empfehlung: string;
}

export const DISZIPLIN_LABEL: Record<Disziplin, string> = {
  verstehen: "Verstehen",
  fragen: "1 · Fragen",
  gestalten: "2 · Gestalten",
  steuern: "3 · Steuern",
  spezifizieren: "4 · Spezifizieren",
  anwenden: "Anwenden",
};

export const KURS_MODULE: KursModul[] = [
  // ───────────── Tag 1 ─────────────
  {
    id: "konto-einrichten",
    tag: 1,
    disziplin: "anwenden",
    titel: "Konto einrichten: Datenschutz, Sicherheit, Anweisungen",
    dauer: "15 Min",
    ziel: "Du richtest Claude oder ChatGPT so ein, dass deine Daten geschützt sind und die Antworten zu dir passen.",
    kernpunkte: [
      "Claude und ChatGPT verwenden Chats aus privaten Konten standardmäßig zum Training. Du kannst das in den Einstellungen ausschalten; neue Chats sind dann ausgenommen.",
      "Ein gut gesichertes Konto schützt deine Chats: Passkey oder Zwei-Faktor-Anmeldung, unbekannte Geräte abmelden.",
      "Eigene Anweisungen gelten für alle Chats und sparen Wiederholungen. Halte sie kurz; an Tag 2 vertiefen wir das.",
      "Das Gedächtnis merkt sich Dinge über dich. Sieh ab und zu nach, was gespeichert ist, und lösche Falsches.",
      "Für einmalige, heikle Fragen gibt es einen Chat ohne Verlauf und Gedächtnis: temporärer Chat (ChatGPT) bzw. Inkognito-Chat (Claude).",
    ],
    einstellungen: [
      {
        id: "training",
        thema: "Nicht zum Training verwenden",
        warum: "Sonst können deine Chats in künftige Modelle einfließen und werden länger gespeichert.",
        claude: "Einstellungen → Datenschutz → „Claude verbessern“ (Help improve Claude) ausschalten",
        chatgpt: "Einstellungen → Datenkontrollen → „Das Modell für alle verbessern“ ausschalten",
        empfehlung: "Aus, sobald du mit beruflichen oder persönlichen Inhalten arbeitest.",
      },
      {
        id: "sicherheit",
        thema: "Konto absichern",
        warum: "Wer dein Konto übernimmt, liest alle Chats, Projekte und Dateien mit.",
        claude: "Einstellungen → Konto → „Wo du angemeldet bist“: fremde Geräte abmelden. Anmeldung über Google oder E-Mail-Code.",
        chatgpt: "Einstellungen → Sicherheit und Anmeldung: Passkey hinzufügen oder Authenticator-App einschalten, aktive Sitzungen prüfen",
        empfehlung: "Passkey oder Authenticator-App; Geräte nach dem Kurs am Leihrechner abmelden.",
      },
      {
        id: "profil",
        thema: "Name und Arbeitsbereich",
        warum: "Die KI spricht dich richtig an und wählt passende Beispiele.",
        claude: "Einstellungen → Konto: „Wie soll Claude dich nennen?“ und „Was beschreibt deine Arbeit am besten?“",
        chatgpt: "Einstellungen → Personalisierung: Spitzname und Beruf",
        empfehlung: "Vorname oder Spitzname reicht, kein vollständiger Name nötig.",
      },
      {
        id: "anweisungen",
        thema: "Eigene Anweisungen",
        warum: "Gelten für jeden Chat: Sprache, Ton, Rückfragen statt Raten.",
        claude: "Einstellungen → Dein Claude → Anweisungen",
        chatgpt: "Einstellungen → Personalisierung → Eigene Anweisungen",
        empfehlung: "Drei bis fünf Sätze, Vorlage unten. Keine vertraulichen Angaben.",
      },
      {
        id: "gedaechtnis",
        thema: "Gedächtnis prüfen",
        warum: "Falsche oder veraltete Erinnerungen färben jede Antwort.",
        claude: "Einstellungen → Funktionen → Gedächtnis: ansehen, bearbeiten oder ausschalten",
        chatgpt: "Einstellungen → ChatGPT-Speicher (früher Personalisierung → Gedächtnis): verwalten oder löschen",
        empfehlung: "An lassen, aber einmal im Monat prüfen. Heikles im temporären bzw. Inkognito-Chat fragen.",
      },
    ],
    prompts: [
      { titel: "Kurzvorlage: eigene Anweisungen", text: "Ich bin {Beruf/Rolle}. Antworte auf Deutsch, klar und ohne Fachjargon.\nWenn dir Informationen fehlen, frag kurz nach, statt zu raten.\nNenne bei Zahlen, Gesetzen und Preisen eine Quelle." },
      { titel: "Was weißt du über mich?", text: "Was hast du dir bisher über mich gemerkt? Liste es kurz auf, damit ich prüfen kann, ob etwas falsch ist oder gelöscht werden soll.", hinweis: "Funktioniert, wenn das Gedächtnis eingeschaltet ist." },
    ],
    uebung: { aufgabe: "Geh die fünf Punkte in deinem Konto durch und hake ab, was erledigt ist. Bezeichnungen können je nach App-Version leicht abweichen." },
  },
  {
    id: "wie-sprachmodelle-arbeiten",
    tag: 1,
    disziplin: "verstehen",
    titel: "Wie ein Sprachmodell arbeitet",
    dauer: "45 Min",
    ziel: "Du kannst erklären, warum ein Sprachmodell flüssig schreibt, aber nicht automatisch recht hat.",
    kernpunkte: [
      "Ein Sprachmodell sagt immer nur das nächste Wort (genauer: Token) vorher, auf Grundlage des gesamten bisherigen Textes.",
      "Die Wahrscheinlichkeiten hat es aus sehr vielen Texten gelernt. Es schlägt nichts nach, solange es nicht im Web sucht.",
      "Aufmerksamkeit (Attention) sorgt dafür, dass „Bank“ im Park etwas anderes bedeutet als „Bank“ beim Geld.",
      "Kontext im Prompt verschiebt die Wahrscheinlichkeiten. Darum wirkt gutes Prompting.",
      "Seit 2024 denken viele Modelle vor der Antwort in Zwischenschritten (Reasoning). Das Grundprinzip bleibt gleich.",
    ],
    erklaert: ["naechstes-wort", "tokens", "aufmerksamkeit", "bedeutungsraum", "temperatur", "training"],
  },
  {
    id: "fragen-mit-acta",
    tag: 1,
    disziplin: "fragen",
    titel: "Fragen mit der ACTA-Methode",
    dauer: "60 Min",
    mehr: [{ label: "Vorlagen Stufe 1: Alltagshelfer", link: "/kurs/vorlagen?stufe=alltag" }, { label: "Vorlagen Stufe 2: Juniorassistent", link: "/kurs/vorlagen?stufe=beruf" }],
    ziel: "Du formulierst Anfragen so, dass die KI ohne Rückfragen ein brauchbares Ergebnis liefert.",
    kernpunkte: [
      "A – Rolle (Act as), optional: Als wer soll die KI antworten? Zweck und Kontext wirken bei heutigen Modellen stärker als eine Rolle.",
      "C – Kontext: Wofür brauchst du das Ergebnis, und welche Hintergrundinfos braucht die KI? Beispiele, Fotos und Dateien helfen.",
      "T – Aufgabe (Task): Was genau soll erledigt werden?",
      "A – Ausgabe: Länge, Format, Ton, Zielgruppe.",
      "Vorab-Spezifikation statt Nachbessern: Ein vollständiger Prompt spart vier Rückfragen.",
    ],
    prompts: [
      { titel: "Rezept (einfach)", text: "Suche ein Rezept für ein vegetarisches Abendessen für 4 Personen mit Tomaten, Pasta und Zwiebeln, die ich zu Hause habe." },
      { titel: "Rezept (ACTA)", text: "Du bist eine erfahrene Köchin für schnelle Familienküche. Wir sind 4 Personen, zwei Kinder (6 und 9), keine Milchprodukte. Zu Hause: Tomaten, Pasta, Zwiebeln, Olivenöl. Schlage ein Abendessen vor, das in 30 Minuten fertig ist. Format: Zutatenliste, dann nummerierte Schritte, am Ende ein Tipp für Reste." },
      { titel: "Reise (ACTA)", text: "Du bist Reiseplaner für Familienurlaube. Plane eine einwöchige Reise ab Berlin für eine Familie mit zwei Kindern (8 und 11), Budget 2.500 Euro, Anreise mit der Bahn, Schwerpunkt Natur. Erstelle eine Tabelle mit Tag, Ort, Aktivität und geschätzten Kosten." },
      { titel: "Rückfragen einfordern", text: "Du bist Social-Media-Experte. Erstelle für unsere {Firma} einen LinkedIn-Post zu unserem Stand auf der nächsten Messe. Wir stellen {Produkt} vor.\n\nBevor du antwortest, stelle mir alle Fragen, die du brauchst, um den Post vollständig und passend zu machen.", hinweis: "Nützlich, wenn dir selbst noch nicht klar ist, was die KI wissen muss." },
    ],
    vergleich: {
      vorher: "Was soll ich kochen?",
      nachher: "Vegetarisches Abendessen, 4 Personen, Zutaten: Tomaten, Pasta, Zwiebeln. Keine Milchprodukte. Format: Zutatenliste und Schritt-für-Schritt, maximal 30 Minuten.",
      warum: "Der zweite Prompt enthält Kontext, Einschränkungen und Format. Die KI muss nichts raten.",
    },
    uebung: { aufgabe: "Verbessere schwache Prompts und lass dir von der KI Feedback geben.", link: "/onboarding", linkLabel: "Übungen starten" },
  },
  {
    id: "recherche",
    tag: 1,
    disziplin: "fragen",
    titel: "Websuche und Deep Research",
    dauer: "45 Min",
    ziel: "Du weißt, wann die KI suchen muss, und prüfst Quellen, bevor du Ergebnisse weitergibst.",
    kernpunkte: [
      "ChatGPT und Claude suchen bei aktuellen Fragen selbst im Web, „Nutze die Websuche“ ist nicht mehr nötig. Prüf aber, ob gesucht wurde: Nur dann stehen Quellen-Links in der Antwort.",
      "Fehlen die Links, Suche per + oder Globus-Symbol einschalten. In Firmen- und internen KIs ist die Websuche oft aus.",
      "Deep Research wählst du bewusst aus: Die KI recherchiert mehrere Minuten selbstständig und schreibt einen Bericht mit Quellen.",
      "Quellen sind nur so gut wie ihre Prüfung: Zwei bis drei Links öffnen und Zahlen vergleichen.",
      "Gute Rechercheaufträge nennen Zweck und Leser, Zeitraum, gewünschte Quellenarten und was am Ende entschieden werden soll.",
    ],
    mehr: [{ label: "Vorlagen Stufe 3: Forschungsassistent", link: "/kurs/vorlagen?stufe=forschung" }],
    erklaert: ["websuche", "reasoning", "halluzination"],
    prompts: [
      { titel: "Vergleichsstudie", text: "Für eine Bürgerversammlung brauche ich einen sachlichen Vergleich von Offshore- und Onshore-Windkraft in Europa: Kosten pro MWh, Umweltauswirkungen, Genehmigungsdauer, Akzeptanz. Nur Quellen der letzten drei Jahre, mindestens vier Studien. Zuerst eine Tabelle, am Ende die offenen Streitfragen." },
      { titel: "Literaturüberblick", text: "Ich bereite einen Elternabend vor. Fasse den Forschungsstand der letzten vier Jahre zum Einfluss von KI-gestütztem Unterricht auf die Lesekompetenz von Grundschulkindern zusammen. Gliederung: Methodik, Hauptergebnisse, Forschungslücken. Am Ende ein kommentiertes Literaturverzeichnis mit Links." },
      { titel: "Entscheidungsmatrix", text: "Ich überlege, ein E-Auto unter 40.000 Euro zu kaufen. Ich fahre täglich {Kilometer} km. Vergleiche die drei meistverkauften Modelle in Deutschland im aktuellen Jahr: Reichweite, Gesamtkosten über 5 Jahre und Restwert. Gewichte: Reichweite 30 %, Kosten 40 %, Restwert 30 %. Nenne für jede Zahl die Quelle." },
    ],
  },
  {
    id: "grenzen-und-recht",
    tag: 1,
    disziplin: "verstehen",
    titel: "Grenzen, Datenschutz und Recht",
    dauer: "45 Min",
    ziel: "Du erkennst typische Fehler und weißt, welche Daten nicht in ein KI-Werkzeug gehören.",
    kernpunkte: [
      "Halluzination: Fehlt Wissen, füllt das Modell die Lücke mit dem, was am plausibelsten klingt.",
      "Verzerrungen: Muster aus den Trainingsdaten tauchen in Texten und Bildern wieder auf.",
      "Keine personenbezogenen oder vertraulichen Daten in private KI-Konten. Im Beruf nur freigegebene Tarife nutzen.",
      "EU-KI-Verordnung: Pflicht zur KI-Kompetenz seit 02/2025, durch den KI-Omnibus (in Kraft seit 27.07.2026) als Handlungspflicht gefasst.",
      "Seit 02.08.2026 gelten Kennzeichnungspflichten (Art. 50): Chatbots geben sich zu erkennen, Deepfakes werden gekennzeichnet. Ältere KI-Systeme müssen ihre Inhalte bis 02.12.2026 technisch markieren.",
    ],
    erklaert: ["halluzination", "daten", "bias", "kennzeichnung"],
    uebung: { aufgabe: "Erkenne in Beispiel-Prompts die sensiblen Daten und schwärze sie.", link: "/onboarding", linkLabel: "Datenschutz-Übung starten" },
  },
  {
    id: "sprechen-und-sehen",
    tag: 1,
    optional: "Bei Zeitmangel kurz vorführen und zu Hause ausprobieren.",
    disziplin: "fragen",
    titel: "Sprechen, Fotos, Kamera",
    dauer: "30 Min",
    ziel: "Du nutzt die KI per Sprache, lässt Fotos und Dokumente auswerten und zeigst ihr live, was du siehst.",
    kernpunkte: [
      "Sprachmodus: frei sprechen wie am Telefon, die KI antwortet gesprochen. Gut beim Kochen, Autofahren, Üben einer Fremdsprache.",
      "Fotos auswerten: Rechnung, Beipackzettel, Verkehrsschild, Pflanze, Tabelle an der Wand. Frag gezielt: „Was steht hier zur Kündigungsfrist?“",
      "Live-Kamera und Bildschirm teilen (z. B. Gemini Live, ChatGPT): Die KI sieht mit und hilft Schritt für Schritt, etwa beim Einrichten eines Geräts.",
      "ACTA gilt auch gesprochen: Sag, wofür du die Antwort brauchst und wie ausführlich sie sein soll.",
      "Vorsicht: Fotos zeigen oft mehr als gedacht (Namen, Adressen, Kennzeichen, Gesichter). Vor dem Hochladen zuschneiden.",
    ],
    prompts: [
      { titel: "Foto einer Rechnung", text: "Auf dem Foto ist meine Stromrechnung. Erkläre mir in einfachen Worten: Wie hoch ist mein Verbrauch, was kostet eine Kilowattstunde, und wann wird der nächste Abschlag fällig? Wenn etwas nicht lesbar ist, sag es." },
      { titel: "Live-Hilfe mit Kamera", text: "Ich zeige dir jetzt die Rückseite meines Routers. Führ mich Schritt für Schritt durch das Einrichten des Gast-WLANs und warte nach jedem Schritt auf mein „fertig“." },
    ],
  },
  {
    id: "bilder",
    tag: 1,
    disziplin: "fragen",
    titel: "Bilder im Dialog erstellen",
    dauer: "45 Min",
    ziel: "Du beschreibst Bilder mit der 4-S-Methode und verbesserst sie im Gespräch statt mit immer längeren Prompts.",
    kernpunkte: [
      "Subjekt: Was steht im Vordergrund?",
      "Szene: Was passiert?",
      "Setting: Wo spielt es, was ist im Hintergrund?",
      "Stil: Foto, Aquarell, 3D-Rendering, Comic …",
      "Aktuelle Bildmodelle (ChatGPT Bilder, Gemini mit Nano Banana) verstehen Änderungswünsche im Dialog: „Mach den Himmel abendlich“ statt alles neu zu beschreiben.",
    ],
    erklaert: ["diffusion", "bias"],
    prompts: [
      { titel: "Schritt für Schritt", text: "Ein Roboter-Lehrer unterrichtet Kinder im Regenwald, Hyper-Realismus, warmes Morgenlicht." },
      { titel: "Im Dialog nachbessern", text: "Behalte die Szene bei, aber mach den Roboter freundlicher, mit runden Formen, und füge eine Tafel mit der Aufschrift „Natur“ hinzu." },
    ],
  },

  // ───────────── Tag 2 ─────────────
  {
    id: "gestalten",
    tag: 2,
    disziplin: "gestalten",
    titel: "Kontext gestalten: Projekte, Anweisungen, Skills",
    dauer: "60 Min",
    ziel: "Du richtest die KI so ein, dass gute Prompts kurz bleiben können.",
    kernpunkte: [
      "Die KI sieht bei jeder Antwort einen einzigen Text: Systemanweisung, deine eigenen Anweisungen, Gedächtnis, Projektdateien, Suchergebnisse und den Chat.",
      "Eigene Anweisungen (Custom Instructions) gelten für alle Chats: Wer du bist, wie Antworten aussehen sollen.",
      "Projekte bündeln Dateien und Anweisungen für ein Thema.",
      "Skills sind gespeicherte Anleitungen für wiederkehrende Aufgaben. Sie werden nur geladen, wenn sie passen.",
      "Gedächtnis kann helfen und stören: regelmäßig prüfen, was gespeichert ist.",
    ],
    erklaert: ["kontext-stapel", "kontextfenster"],
    prompts: [
      { titel: "Vorlage: eigene Anweisungen", text: "Ich arbeite als {Beruf} in {Branche}. Meine Leserinnen und Leser sind {Zielgruppe}.\nAntworte auf Deutsch, sachlich und knapp. Nutze Aufzählungen nur bei echten Listen.\nWenn dir Informationen fehlen, frage kurz nach, statt zu raten.\nNenne bei Fakten zu Gesetzen, Preisen und Personen eine Quelle." },
    ],
    uebung: { aufgabe: "Schreib deine eigenen Anweisungen und teste sie mit derselben Frage einmal mit und einmal ohne.", link: "/playground", linkLabel: "Werkstatt öffnen" },
  },
  {
    id: "artefakte",
    tag: 2,
    disziplin: "gestalten",
    titel: "Artefakte: vom Chat zum fertigen Ergebnis",
    dauer: "35 Min",
    ziel: "Du lässt Ergebnisse als bearbeitbares Dokument, Folien oder Tabelle erstellen, änderst gezielt einzelne Stellen und exportierst sie.",
    kernpunkte: [
      "Ein Artefakt ist ein Ergebnis, das neben dem Chat als eigenes Dokument entsteht: Text, Folien, Tabelle, Diagramm oder kleine Anwendung.",
      "Claude: Docs, Slides, Sheets, Design, Data (Dashboards) und Whiteboard. Im Chat anfragen oder im Bereich „Artifacts“ starten. Welche Typen du hast, hängt vom Tarif ab.",
      "ChatGPT: Canvas für Texte und Code (Befehl „/canvas“). Dokumente, Präsentationen und Tabellen erstellt ChatGPT als Dateien, je nach Tarif auch nach eigenen Vorlagen.",
      "Nicht neu prompten, sondern gezielt ändern: Stelle markieren und sagen, was anders sein soll, oder selbst tippen.",
      "Zum Schluss exportieren (PowerPoint, Word, Excel, PDF) oder per Link teilen. Ein geteilter Link ist für alle sichtbar, die ihn haben: nichts Vertrauliches hineinschreiben.",
    ],
    prompts: [
      { titel: "Fünf Folien", text: "Erstelle eine Präsentation mit fünf Folien für {Zielgruppe} zum Thema {Thema}. Folie 1: Titel. Folien 2 bis 4: je eine Kernaussage mit drei Stichpunkten. Folie 5: nächste Schritte. Schlichtes Design, auf Deutsch.", hinweis: "In Claude entsteht eine Slides-Präsentation, in ChatGPT eine Präsentationsdatei." },
      { titel: "Infoblatt im Canvas", text: "/canvas Schreibe ein einseitiges Infoblatt für {Zielgruppe}: „{Thema}“. Gliederung: Worum geht es, die drei wichtigsten Punkte, Ansprechperson. Höchstens 250 Wörter.", hinweis: "„/canvas“ gilt für ChatGPT; in Claude einfach „als Dokument“ schreiben." },
      { titel: "Tabelle zum Weiterarbeiten", text: "Erstelle eine Tabelle mit den Spalten {Spalten} für {Zweck}. Fülle drei Beispielzeilen aus und markiere, welche Angaben ich selbst prüfen muss." },
      { titel: "Nur eine Stelle ändern", text: "Ändere nur den markierten Abschnitt: kürzer und ohne Fachbegriffe. Alles andere bleibt genau so." },
    ],
    schritte: [
      "Wähle: Infoblatt, fünf Folien oder Tabelle zu deinem Anwendungsfall von Tag 1.",
      "Lass es als Artefakt (Claude) oder im Canvas bzw. als Datei (ChatGPT) erstellen. Nenne Zielgruppe und Umfang.",
      "Ändere zwei Stellen gezielt: markieren und sagen, was anders sein soll.",
      "Exportiere (PDF, PowerPoint, Word) oder erzeuge einen Link zum Teilen.",
      "Link oder Datei ins Padlet, dazu ein Satz, was du geändert hast.",
    ],
    uebung: { aufgabe: "Vom Chat zum fertigen Ergebnis, 25 Minuten, allein oder zu zweit. Prüf am Ende: Stimmen Zahlen, Namen und Daten? Würdest du es so verschicken?" },
    mehr: [{ label: "Mini-Projekt: Präsentation oder Website", link: "/kurs/gruppen#praesentation" }],
  },
  {
    id: "steuern",
    tag: 2,
    disziplin: "steuern",
    titel: "Steuern: weniger Regeln, klares Ziel",
    dauer: "45 Min",
    mehr: [{ label: "Profi-Techniken: Prüfschleife, Gegenprobe, Grenzfälle", link: "/kurs/profi" }],
    ziel: "Du weißt, warum lange Regelkataloge bei neuen Modellen eher stören, und ersetzt sie durch Ziel und Abnahmekriterien.",
    kernpunkte: [
      "Starke Modelle denken von selbst Schritt für Schritt. „Denke Schritt für Schritt“ ist meist überflüssig.",
      "OpenAI empfiehlt bei GPT-6 ausdrücklich schlankere Prompts: Alte Anweisungen können das Modell ausbremsen.",
      "Wirksam bleiben: ein klares Ziel, wichtiger Kontext, die Definition von „fertig“ und wenige echte Grenzen.",
      "Bei jedem Modellwechsel gespeicherte Prompts und Skills testen: einmal mit, einmal ohne die alte Anweisung.",
      "Denkaufwand (Reasoning-Stufe) wählen: niedrig für Routine, hoch für schwierige Analysen.",
    ],
    vergleich: {
      vorher: "Du bist ein Weltklasse-Experte. Denke Schritt für Schritt. Sei extrem gründlich. Prüfe alles dreimal. Antworte IMMER in Tabellen. Vergiss NIEMALS die Quellen. …",
      nachher: "Ziel: eine Entscheidungsvorlage für die Geschäftsführung, ob wir Videokonferenz-Tool A oder B einführen. Kontext: 40 Mitarbeitende, Datenschutz wichtig, Budget 5.000 Euro/Jahr. Fertig ist die Vorlage, wenn sie eine Empfehlung, drei Gründe und die offenen Risiken auf einer Seite enthält.",
      warum: "Der zweite Prompt sagt, wofür das Ergebnis gebraucht wird und wann es fertig ist. Das Modell entscheidet den Weg selbst.",
    },
    uebung: { aufgabe: "Vergleiche einen alten Mega-Prompt mit einer schlanken Fassung in zwei Modellen nebeneinander.", link: "/playground", linkLabel: "Modellvergleich öffnen" },
  },
  {
    id: "delegieren",
    tag: 2,
    disziplin: "spezifizieren",
    titel: "Delegieren an KI-Agenten",
    dauer: "60 Min",
    ziel: "Du gibst eine Aufgabe an einen Agenten ab und prüfst das Ergebnis, bevor es wirkt.",
    kernpunkte: [
      "Agenten (z. B. ChatGPT Work, Work Mode in Mistral Vibe) arbeiten selbstständig in Schritten: planen, Werkzeuge nutzen, prüfen, weiter.",
      "Sie können in deinen Apps handeln. Zugriffe nur so weit freigeben wie nötig.",
      "Mails, Bestellungen und Veröffentlichungen bestätigst du immer selbst.",
      "Prompt-Injection: Webseiten oder Dokumente können versteckte Anweisungen enthalten, die den Agenten umlenken.",
      "Ein guter Auftrag nennt Ziel, Material, Grenzen und woran das Ergebnis gemessen wird.",
    ],
    erklaert: ["agenten-schleife"],
    prompts: [
      { titel: "Auftrag an einen Agenten", text: "Ziel: eine Übersicht der fünf wichtigsten Förderprogramme für Digitalisierung in kleinen Betrieben in {Bundesland}, Stand heute.\nMaterial: nur offizielle Seiten von Bund, Land und IHK.\nGrenzen: nichts herunterladen, keine Formulare ausfüllen, nichts versenden.\nFertig, wenn: eine Tabelle mit Programm, Förderhöhe, Frist und Link vorliegt und jede Zeile eine Quelle hat." },
    ],
  },
  {
    id: "spezifizieren",
    tag: 2,
    disziplin: "spezifizieren",
    titel: "Spezifizieren: große Aufgaben zerlegen",
    dauer: "45 Min",
    ziel: "Du zerlegst ein Vorhaben in Teilaufgaben, die eine KI jeweils allein erledigen kann.",
    kernpunkte: [
      "Teilaufgaben von unter zwei Stunden sind für Agenten gut handhabbar.",
      "Jede Teilaufgabe hat ein Ergebnis, das man prüfen kann (Datei, Tabelle, Entwurf).",
      "Abhängigkeiten sichtbar machen: Was muss vorher fertig sein?",
      "Abnahmekriterien vorab festlegen, nicht erst beim Ergebnis.",
    ],
    uebung: { aufgabe: "Zerleg ein eigenes Vorhaben mit dem Zerlegungs-Assistenten.", link: "/onboarding", linkLabel: "Workflow-Modul öffnen" },
  },
  {
    id: "ki-im-betrieb",
    tag: 2,
    optional: "Vor allem für Teilnehmende aus Betrieben und Verwaltung; sonst überspringen.",
    disziplin: "anwenden",
    titel: "KI im Betrieb einführen",
    dauer: "30 Min",
    ziel: "Du weißt, wie Betriebe KI Schritt für Schritt einführen, und was du selbst beitragen kannst.",
    kernpunkte: [
      "Laut Bitkom (September 2026) nutzen 57 % der Unternehmen ab 20 Beschäftigten KI, vor zwei Jahren waren es 20 %. Zwei Drittel schätzen die KI-Kompetenz ihrer Beschäftigten als gering ein.",
      "Typische Stufen: ausprobieren → Regeln festlegen (KI-Richtlinie) → Werkzeuge freigeben → Abläufe umbauen → Aufgaben an Agenten abgeben.",
      "Eine KI-Richtlinie regelt: welche Tools, welche Daten, wer prüft Ergebnisse, wie wird gekennzeichnet.",
      "KI-Kompetenz (Art. 4 KI-Verordnung): Der Betrieb sorgt dafür, dass Beschäftigte KI sicher nutzen können, z. B. mit Schulungen wie dieser.",
      "Betriebsrat früh einbinden, wenn KI Arbeit oder Leistung von Beschäftigten berührt.",
      "Guter Einstieg: eine wiederkehrende Aufgabe, die Zeit kostet, ein klarer Vorher-Nachher-Vergleich, eine Person, die Ergebnisse prüft.",
    ],
    prompts: [
      { titel: "Einsatzideen finden", text: "Ich arbeite als {Beruf} in einem Betrieb mit {Anzahl} Beschäftigten. Liste zehn Aufgaben aus meinem Alltag, bei denen KI Zeit sparen könnte. Bewerte jede nach Nutzen, Risiko (Datenschutz, Fehlerfolgen) und Aufwand, und empfiehl die drei besten für den Start." },
      { titel: "Entwurf KI-Richtlinie", text: "Entwirf eine einseitige KI-Richtlinie für einen Handwerksbetrieb mit 25 Beschäftigten: erlaubte Tools, verbotene Daten, Prüfpflicht, Kennzeichnung, Ansprechperson. Einfache Sprache, Stichpunkte. [JURIST:IN PRÜFEN]" },
    ],
  },
  {
    id: "mini-projekte",
    tag: 2,
    disziplin: "anwenden",
    titel: "Mini-Projekte in Gruppen",
    dauer: "90 Min",
    ziel: "Du setzt das Gelernte in einem eigenen kleinen Projekt um und stellst es vor.",
    kernpunkte: [
      "Gruppen von 2 bis 4 Personen wählen ein Projekt.",
      "Ergebnisse kommen ins Padlet, Spalte „Ergebnisse der Gruppen“.",
      "Jede Gruppe stellt in 3 Minuten vor: Was hat funktioniert, was nicht?",
    ],
    uebung: { aufgabe: "Projekt auswählen und loslegen.", link: "/kurs/gruppen", linkLabel: "Gruppenarbeit öffnen" },
  },
];

export const modulById = (id: string) => KURS_MODULE.find((m) => m.id === id);
