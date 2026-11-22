/* ── Wissenscheck am Ende jedes Kurstags ──
 * Je Tag sechs Fragen mit einer richtigen Antwort und kurzer Erklärung.
 * Läuft offline; Ergebnis bleibt nur im Browser.
 */

export interface CheckFrage {
  frage: string;
  antworten: string[];
  richtig: number;
  erklaerung: string;
}

export const WISSENSCHECK: Record<1 | 2, CheckFrage[]> = {
  1: [
    {
      frage: "Wie entsteht eine Antwort von ChatGPT & Co.?",
      antworten: ["Sie wird aus einer Datenbank mit fertigen Antworten geholt.", "Das Modell berechnet Wort für Wort, was wahrscheinlich folgt.", "Ein Mensch im Hintergrund schreibt mit."],
      richtig: 1,
      erklaerung: "Sprachmodelle hängen immer das nächste wahrscheinliche Wort an. Darum wirkt Kontext im Prompt so stark.",
    },
    {
      frage: "Wofür steht das C in ACTA?",
      antworten: ["Kontext", "Kreativität", "Kontrolle"],
      richtig: 0,
      erklaerung: "Act (Rolle), Context, Task, Ausgabe. Der Kontext ist meist der wichtigste Baustein.",
    },
    {
      frage: "Du willst wissen, welche Förderprogramme es aktuell gibt. Was tust du?",
      antworten: ["Einfach fragen, das Modell weiß es.", "Websuche nutzen und Quellen mit Datum verlangen.", "Die Frage mehrmals stellen, bis die Antwort gleich bleibt."],
      richtig: 1,
      erklaerung: "Ohne Websuche kennt das Modell nur seinen Trainingsstand. Quelle und Datum machen die Antwort prüfbar.",
    },
    {
      frage: "Eine Antwort klingt sehr sicher und nennt ein Zitat mit Buchtitel. Was gilt?",
      antworten: ["Sicher klingende Antworten stimmen fast immer.", "Zitate erfindet KI nie.", "Gerade Zitate und Quellen solltest du nachprüfen."],
      richtig: 2,
      erklaerung: "Fehlt Wissen, füllt das Modell die Lücke mit Plausiblem. Der Ton sagt nichts über die Richtigkeit.",
    },
    {
      frage: "Welche Eingabe gehört nicht in ein privates, kostenloses KI-Konto?",
      antworten: ["Eine allgemeine Frage zum Mietrecht", "Die Kundenliste deines Arbeitgebers", "Ein Rezept mit deinen Vorräten"],
      richtig: 1,
      erklaerung: "Personenbezogene und vertrauliche Daten nur in Tools, die dein Betrieb freigegeben hat.",
    },
    {
      frage: "Du willst ein Bild ändern, das dir fast gefällt. Was ist meist am besten?",
      antworten: ["Den ganzen Prompt neu und länger schreiben", "Im Dialog sagen, was sich ändern soll", "Ein anderes Tool nehmen"],
      richtig: 1,
      erklaerung: "Aktuelle Bildmodelle verstehen Änderungswünsche wie „Mach den Himmel abendlich“.",
    },
  ],
  2: [
    {
      frage: "Wohin gehören Regeln, die in jedem Chat gelten sollen (z. B. „duze mich, antworte kurz“)?",
      antworten: ["An den Anfang jedes langen Chats", "In die eigenen Anweisungen oder ein Projekt", "Ans Ende jeder Frage"],
      richtig: 1,
      erklaerung: "Eigene Anweisungen und Projekte werden bei jeder Frage mitgeschickt. Lange Chats vergessen dagegen ihren Anfang.",
    },
    {
      frage: "Was wirkt bei starken Modellen 2026 meist am besten?",
      antworten: ["Viele Regeln in Großbuchstaben", "Ein klares Ziel und „fertig, wenn …“", "Möglichst kurze Prompts ohne Kontext"],
      richtig: 1,
      erklaerung: "Kennt das Modell den Zweck, trifft es Detailentscheidungen selbst richtig.",
    },
    {
      frage: "Ein Agent soll für dich Angebote vergleichen. Was solltest du nicht freigeben?",
      antworten: ["Webseiten lesen", "Eine Tabelle erstellen", "Ohne Rückfrage buchen und bezahlen"],
      richtig: 2,
      erklaerung: "Alles Unumkehrbare (kaufen, senden, löschen) bestätigst du selbst.",
    },
    {
      frage: "Was ist Prompt-Injection?",
      antworten: ["Versteckte Anweisungen in Webseiten oder Dateien, die einen Agenten umlenken", "Ein besonders langer Prompt", "Ein Fehler beim Kopieren"],
      richtig: 0,
      erklaerung: "Was ein Agent liest, kann Befehle enthalten. Darum Zugriffe sparsam freigeben.",
    },
    {
      frage: "Wie gehst du eine große Aufgabe wie die Planung eines Festes an?",
      antworten: ["Alles in einem Prompt verlangen", "Zuerst einen Plan anfordern, freigeben, dann ausarbeiten lassen", "Die KI ohne Vorgaben machen lassen"],
      richtig: 1,
      erklaerung: "Ein Plan zum Freigeben verhindert, dass die KI lange in die falsche Richtung arbeitet.",
    },
    {
      frage: "Was gilt seit August 2026 für Chatbots auf Websites?",
      antworten: ["Nichts Besonderes", "Sie müssen sich als KI zu erkennen geben", "Sie sind verboten"],
      richtig: 1,
      erklaerung: "Artikel 50 der KI-Verordnung: Menschen müssen erkennen, dass sie mit einer KI sprechen.",
    },
  ],
};
