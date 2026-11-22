/* ── Kurs-Lernpfad ──
 * Zwei Tage entlang der vier Disziplinen: Fragen → Gestalten → Steuern → Spezifizieren.
 * Inhalte zusammengeführt aus prompting-tutor.kilab.org, prompt-tutor.kilab.org,
 * miniprojekte.lovable.app und den Kursfolien v22. Stand: 22.11.2026.
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
    id: "wie-sprachmodelle-arbeiten",
    tag: 1,
    disziplin: "verstehen",
    titel: "Wie ein Sprachmodell arbeitet",
    dauer: "45 Min",
    ziel: "Du kannst erklären, warum ein Sprachmodell flüssig schreibt, aber nicht automatisch recht hat.",
    kernpunkte: [
      "Ein Sprachmodell sagt immer nur das nächste Wort (genauer: Token) vorher, auf Grundlage des gesamten bisherigen Textes.",
      "Die Wahrscheinlichkeiten hat es aus sehr vielen Texten gelernt. Es schlägt nichts nach, solange keine Websuche aktiv ist.",
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
    ziel: "Du formulierst Anfragen so, dass die KI ohne Rückfragen ein brauchbares Ergebnis liefert.",
    kernpunkte: [
      "A – Rolle (Act as): Als wer soll die KI antworten?",
      "C – Kontext: Welche Hintergrundinfos braucht sie? Beispiele (Few-Shot) helfen.",
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
      "Ohne Websuche antwortet die KI aus ihrem Trainingsstand. Für Aktuelles, Preise, Gesetze und Personen immer die Suche nutzen.",
      "Deep Research recherchiert mehrere Minuten selbstständig und schreibt einen Bericht mit Quellen.",
      "Quellen sind nur so gut wie ihre Prüfung: Zwei bis drei Links öffnen und Zahlen vergleichen.",
      "Gute Rechercheaufträge nennen Zeitraum, Gliederung, Mindestzahl an Quellen und gewünschte Quellenarten.",
    ],
    erklaert: ["websuche", "reasoning", "halluzination"],
    prompts: [
      { titel: "Vergleichsstudie", text: "Vergleiche Offshore- und Onshore-Windkraft in Europa nach Kosten pro MWh, Umweltauswirkungen, Genehmigungsdauer und Akzeptanz. Nutze nur Quellen ab 2024, nenne mindestens vier Studien und stelle die Ergebnisse zuerst als Tabelle dar." },
      { titel: "Literaturüberblick", text: "Fasse den Forschungsstand seit 2022 zum Einfluss von KI-gestütztem Unterricht auf die Lesekompetenz von Grundschulkindern zusammen. Gliederung: Methodik, Hauptergebnisse, Forschungslücken. Am Ende ein kommentiertes Literaturverzeichnis mit Links." },
      { titel: "Entscheidungsmatrix", text: "Ich überlege, ein E-Auto unter 40.000 Euro zu kaufen. Recherchiere die drei meistverkauften Modelle in Deutschland im aktuellen Jahr und vergleiche Reichweite, Gesamtkosten über 5 Jahre und Restwert. Gewichte: Reichweite 30 %, Kosten 40 %, Restwert 30 %. Nenne für jede Zahl die Quelle." },
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
    id: "steuern",
    tag: 2,
    disziplin: "steuern",
    titel: "Steuern: weniger Regeln, klares Ziel",
    dauer: "45 Min",
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
