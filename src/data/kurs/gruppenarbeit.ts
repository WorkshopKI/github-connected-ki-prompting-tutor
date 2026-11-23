/* ── Gruppenarbeit und Mini-Projekte ──
 * Zusammengeführt aus miniprojekte.lovable.app (Gruppenübungen) und Kursfolien (Mini-Projekte),
 * auf zwei Kurstage umgeschnitten. Tools Stand 22.11.2026.
 * Jede Übung: feste Phasen mit Zeit, Rollen, Startprompt zum Kopieren, Prüfkriterien,
 * Varianten für Einsteiger und Fortgeschrittene, Vorlage für den Padlet-Beitrag.
 */

export interface Phase {
  min: number;
  text: string;
}

export interface Gruppenaufgabe {
  id: string;
  tag: 1 | 2;
  /** Wann im Kurs, z. B. „nach Modul 2“. */
  wann: string;
  titel: string;
  ziel: string;
  gruppe: string;
  phasen: Phase[];
  rollen?: string[];
  startPrompt?: string;
  pruefen: string[];
  varianten?: { einsteiger: string; fortgeschritten: string };
  tools?: string[];
  /** Was ohne Abo oder bei Ausfall des Tools geht. */
  ersatz?: string;
  padlet: string;
  hinweis?: string;
  /** Bei Zeitmangel verzichtbar (gleiche Markierung wie im Fahrplan). */
  optional?: boolean;
}

export const dauerMin = (g: Gruppenaufgabe) => g.phasen.reduce((a, p) => a + p.min, 0);

const ROLLEN_STANDARD = [
  "Steuer: tippt die Prompts",
  "Prüfer: liest kritisch gegen, sucht Fehler",
  "Protokoll: notiert, was gewirkt hat, und postet ins Padlet",
];

export const GRUPPENAUFGABEN: Gruppenaufgabe[] = [
  {
    id: "prompt-labor",
    tag: 1,
    wann: "nach Modul 3 (ACTA)",
    titel: "Prompt-Labor: Welcher Baustein wirkt?",
    ziel: "Ihr erlebt, welcher ACTA-Baustein eine Antwort am stärksten verbessert.",
    gruppe: "zu dritt",
    rollen: ROLLEN_STANDARD,
    phasen: [
      { min: 3, text: "Aufgabe wählen: Einladung zum Nachbarschaftsfest, Beschwerde an den Vermieter oder Wochenplan für die Familie." },
      { min: 5, text: "Runde 1: nur die Aufgabe in einem Satz eingeben. Antwort speichern." },
      { min: 10, text: "Runde 2 bis 4: je einen Baustein ergänzen (Kontext, dann Ausgabe, dann Rolle). Jedes Mal neu fragen, nicht im selben Chat." },
      { min: 5, text: "Vergleichen: Welche Runde hat den größten Sprung gebracht? Warum?" },
      { min: 2, text: "Ins Padlet posten." },
    ],
    startPrompt: "Schreib eine Einladung zum Nachbarschaftsfest.",
    pruefen: [
      "Würdet ihr die Antwort so verwenden?",
      "Was musstet ihr noch selbst ergänzen?",
      "Hat die Rolle überhaupt etwas verändert?",
    ],
    varianten: {
      einsteiger: "Nur zwei Runden: einfacher Prompt gegen vollständigen ACTA-Prompt.",
      fortgeschritten: "Zusätzlich eine Runde mit einem Beispiel (Few-Shot) und eine mit „Stell mir erst Rückfragen“.",
    },
    tools: ["ChatGPT", "Claude", "Mistral Vibe"],
    padlet: "Aufgabe · stärkster Baustein · ein Satz, warum",
  },
  {
    id: "tool-vergleich",
    optional: true,
    tag: 1,
    wann: "nach Modul 4 (Recherche)",
    titel: "Tool-Vergleich: Drei Assistenten, eine Frage",
    ziel: "Ihr findet heraus, welcher Assistent für welche Art Aufgabe am besten passt.",
    gruppe: "zu dritt, jede Person ein Tool",
    phasen: [
      { min: 3, text: "Gemeinsam eine Frage wählen, die aktuelles Wissen braucht, z. B. „Was ändert sich 2027 beim Deutschlandticket?“" },
      { min: 7, text: "Jede Person stellt dieselbe Frage in einem anderen Tool. Erscheinen Quellen-Links? Sonst Websuche einschalten." },
      { min: 10, text: "Bewertungstabelle ausfüllen (je 1 bis 3 Punkte): Richtigkeit, Aktualität, Quellen, Verständlichkeit." },
      { min: 7, text: "Je Tool eine genannte Quelle öffnen: Steht das wirklich dort?" },
      { min: 3, text: "Sieger küren und ins Padlet posten." },
    ],
    pruefen: [
      "Gibt jede Antwort ein Datum oder einen Stand an?",
      "Führen die Links zu passenden Seiten?",
      "Widersprechen sich die Tools? Wer hat recht?",
    ],
    varianten: {
      einsteiger: "Zwei Tools und eine Alltagsfrage, die kein aktuelles Wissen braucht.",
      fortgeschritten: "Zusätzlich Deep Research in einem Tool starten und mit den schnellen Antworten vergleichen.",
    },
    tools: ["ChatGPT", "Claude", "Gemini", "Mistral Vibe", "Perplexity"],
    padlet: "Frage · Tabelle mit Punkten · Sieger und warum",
  },
  {
    id: "eigener-anwendungsfall",
    tag: 1,
    wann: "Ende Tag 1",
    titel: "Mein Anwendungsfall",
    ziel: "Jede Person nimmt einen fertigen Prompt für eine echte Aufgabe aus dem eigenen Alltag mit.",
    gruppe: "zu zweit, abwechselnd",
    phasen: [
      { min: 5, text: "Jede Person nennt eine wiederkehrende Aufgabe, die Zeit kostet. Die andere fragt nach: Für wen? Wie oft? Was ist ein gutes Ergebnis?" },
      { min: 10, text: "ACTA-Prompt für Person A bauen und testen. Person B prüft das Ergebnis." },
      { min: 10, text: "Rollen tauschen." },
      { min: 5, text: "Prompts so umbauen, dass Platzhalter wie {Datum} wiederverwendbar sind. In der Werkstatt als Vorlage speichern." },
    ],
    startPrompt: "Du bist {Rolle}. Hintergrund: {für wen, worum geht es}. Aufgabe: {was soll entstehen}. Ausgabe: {Format, Länge, Ton}. Frag zuerst nach, falls etwas fehlt.",
    pruefen: [
      "Spart das Ergebnis wirklich Zeit?",
      "Stehen keine echten Namen oder vertraulichen Daten im Prompt?",
      "Würde der Prompt nächste Woche noch funktionieren?",
    ],
    varianten: {
      einsteiger: "Mit einer Vorlage aus der Werkstatt starten und nur anpassen.",
      fortgeschritten: "Den Prompt gleich als eigene Anweisung oder Projekt einrichten.",
    },
    padlet: "Aufgabe · Prompt mit Platzhaltern · geschätzte Zeitersparnis",
  },
  {
    id: "steuern-duell",
    optional: true,
    tag: 2,
    wann: "nach Modul 10 (Steuern)",
    titel: "Steuern-Duell: Regelkatalog gegen klares Ziel",
    ziel: "Ihr prüft selbst, ob viele Regeln oder ein klares Ziel das bessere Ergebnis bringen.",
    gruppe: "zwei Teams à zwei",
    phasen: [
      { min: 3, text: "Gemeinsame Aufgabe: ein Aushang für das schwarze Brett, z. B. „Fahrradwerkstatt im Hof sucht Helfer“." },
      { min: 7, text: "Team A schreibt einen Prompt mit mindestens acht Regeln (IMMER, NIEMALS, maximal …). Team B schreibt Ziel, Leserschaft und „fertig, wenn …“." },
      { min: 5, text: "Beide Prompts im selben Modell ausführen." },
      { min: 8, text: "Blind bewerten: Ein Team bewertet das Ergebnis des anderen nach Wirkung, Verständlichkeit, Länge." },
      { min: 2, text: "Ergebnis ins Padlet." },
    ],
    pruefen: ["Hat das Modell alle Regeln eingehalten?", "Welcher Aushang würde mehr Helfer bringen?", "Welcher Prompt war schneller geschrieben?"],
    tools: ["ChatGPT", "Claude"],
    padlet: "Beide Prompts · beide Aushänge · Gewinner",
  },
  {
    id: "lernvideo",
    tag: 2,
    wann: "Mini-Projekt, Nachmittag",
    titel: "Mini-Projekt: Lernvideo aus eigenen Quellen",
    ziel: "Ihr macht aus Unterlagen ein verständliches Erklärvideo oder einen Podcast und prüft es gegen die Quellen.",
    gruppe: "zu zweit bis viert",
    rollen: ["Quellen: sucht und lädt das Material", "Regie: formuliert Zielgruppe und Schwerpunkt", "Faktencheck: vergleicht Ergebnis und Quellen"],
    phasen: [
      { min: 10, text: "Thema und Zielgruppe festlegen, z. B. „Mülltrennung für neue Nachbarn“ oder „Unser Verein in 3 Minuten“." },
      { min: 15, text: "In NotebookLM ein Notizbuch anlegen, zwei bis fünf Quellen hochladen (PDF, Website, Text)." },
      { min: 10, text: "Im Studio „Video-Überblick“ oder „Audio-Überblick“ wählen, Sprache Deutsch, Zielgruppe und Schwerpunkt eintragen." },
      { min: 15, text: "Während es rechnet: im Chat drei Kontrollfragen an die Quellen stellen." },
      { min: 25, text: "Ansehen oder anhören. Faktencheck: drei Aussagen in den Quellen nachschlagen." },
      { min: 15, text: "Ins Padlet posten und vorbereiten: zwei Minuten Vorstellung." },
    ],
    startPrompt: "Zielgruppe: {wer}. Schwerpunkt: {was sie danach können sollen}. Ton: freundlich, ohne Fachwörter. Länge: kurz.",
    pruefen: ["Stimmt jede Kernaussage mit den Quellen überein?", "Fehlt etwas Wichtiges?", "Würde die Zielgruppe es verstehen?"],
    varianten: {
      einsteiger: "Audio-Überblick mit einer einzigen Quelle.",
      fortgeschritten: "Video-Überblick plus Lernkarten oder Quiz aus demselben Notizbuch.",
    },
    tools: ["NotebookLM"],
    ersatz: "Ohne Google-Konto: Zusammenfassung und Quiz mit einem Assistenten erzeugen und vortragen.",
    padlet: "Thema · Link oder Datei · zwei Sätze: Was war gut, was falsch?",
    hinweis: "Video- und Audio-Überblicke gibt es kostenlos auf Deutsch, mit einem Tageslimit pro Konto. Die „kinoartigen“ Video-Überblicke (Cinematic) gibt es nur auf Englisch und im Ultra-Abo. Stand 22.11.2026.",
  },
  {
    id: "praesentation",
    tag: 2,
    wann: "Mini-Projekt, Nachmittag",
    titel: "Mini-Projekt: Präsentation oder Website",
    ziel: "Ihr recherchiert ein Thema, lasst Folien oder eine Seite bauen und prüft jede Zahl.",
    gruppe: "zu zweit bis viert",
    rollen: ["Recherche: Fragen und Quellen", "Gestaltung: Folien oder Seite", "Faktencheck: jede Zahl gegen die Quelle"],
    phasen: [
      { min: 10, text: "Thema und Publikum festlegen, z. B. „Balkonkraftwerk lohnt sich?“ für die Hausversammlung." },
      { min: 20, text: "Mit Websuche oder Deep Research recherchieren, Quellen sammeln." },
      { min: 10, text: "Gliederung festlegen: sechs bis acht Folien oder Abschnitte, je eine Kernaussage." },
      { min: 25, text: "Folien oder Seite erstellen lassen." },
      { min: 15, text: "Faktencheck und Quellenfolie." },
      { min: 10, text: "Ins Padlet und vorstellen." },
    ],
    startPrompt: "Erstelle eine Präsentation mit 7 Folien für {Publikum} zum Thema {Thema}. Jede Folie: eine Aussage als Titel, höchstens drei Stichpunkte. Nutze nur die Quellen unten und nenne sie auf der letzten Folie.\n\nQuellen:\n{Links}",
    pruefen: ["Ist jede Zahl mit Quelle belegt?", "Sind die Titel Aussagen statt Überschriften?", "Würde das Publikum danach entscheiden können?"],
    tools: ["ChatGPT Work", "Claude", "Gamma"],
    padlet: "Thema · Link oder Datei · eine Zahl, die falsch war",
  },
  {
    id: "agenten-aufgabe",
    tag: 2,
    wann: "Mini-Projekt, Nachmittag",
    titel: "Mini-Projekt: Eine Aufgabe delegieren",
    ziel: "Ihr gebt eine echte Aufgabe an einen Agenten ab und bewertet das Ergebnis gegen eure eigenen Abnahmekriterien.",
    gruppe: "zu zweit bis dritt",
    rollen: ["Auftraggeber: schreibt den Auftrag", "Beobachter: notiert die Schritte des Agenten", "Abnahme: prüft gegen die Kriterien"],
    phasen: [
      { min: 10, text: "Aufgabe wählen, die Recherche und eine Datei als Ergebnis braucht, z. B. Vergleichstabelle, Ausflugsplan, Förderübersicht." },
      { min: 15, text: "Auftrag schreiben: Ziel, Material, Grenzen, „fertig, wenn …“. Abnahmekriterien vorher festlegen." },
      { min: 20, text: "Agenten arbeiten lassen, Zwischenschritte beobachten und notieren." },
      { min: 15, text: "Abnahme: jedes Kriterium mit erfüllt, teilweise oder nicht bewerten." },
      { min: 10, text: "Auftrag verbessern: Was hätte im Auftrag stehen müssen?" },
    ],
    startPrompt: "Ziel: {was am Ende vorliegen soll}\nMaterial: {erlaubte Quellen}\nGrenzen: nichts versenden, nichts kaufen, keine Konten anlegen.\nVorgehen: Erstell zuerst einen Plan und warte auf meine Freigabe.\nFertig, wenn: {prüfbare Kriterien}",
    pruefen: ["Hat der Agent die Grenzen eingehalten?", "Ist jedes Abnahmekriterium erfüllt?", "Wo hat er geraten statt nachgesehen?"],
    tools: ["ChatGPT Work", "Mistral Vibe Work Mode", "Claude"],
    padlet: "Auftrag · Ergebnis · Abnahme-Tabelle · eine Verbesserung am Auftrag",
    hinweis: "Keinen Zugriff auf private Mails, Kalender oder Konten freigeben.",
  },
];
