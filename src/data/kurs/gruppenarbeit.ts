/* ── Gruppenarbeit und Mini-Projekte ──
 * Zusammengeführt aus miniprojekte.lovable.app (Gruppenübungen) und Kursfolien (Mini-Projekte),
 * auf zwei Kurstage umgeschnitten. Tools Stand 22.11.2026.
 */

export interface Gruppenaufgabe {
  id: string;
  tag: 1 | 2;
  titel: string;
  ziel: string;
  dauer: string;
  schritte: string[];
  tools?: string[];
  ergebnis: string;
  hinweis?: string;
}

export const GRUPPENAUFGABEN: Gruppenaufgabe[] = [
  {
    id: "prompt-labor",
    tag: 1,
    titel: "Prompt-Labor: Was macht den Unterschied?",
    ziel: "Die Wirkung unterschiedlicher Prompt-Formulierungen erleben.",
    dauer: "25 Min",
    schritte: [
      "Wählt eine Alltagsaufgabe (Einladung, Beschwerde, Reiseplan).",
      "Person A schreibt einen kurzen Prompt, Person B einen ACTA-Prompt.",
      "Beide Prompts im selben Tool ausführen und Ergebnisse vergleichen.",
      "Notieren: Welches Element (Rolle, Kontext, Aufgabe, Ausgabe) hat am meisten bewirkt?",
    ],
    ergebnis: "Zwei Prompts, zwei Antworten, ein Satz zur Erkenntnis",
  },
  {
    id: "tool-vergleich",
    tag: 1,
    titel: "Tool-Vergleich: verschiedene Assistenten im Test",
    ziel: "Stärken und Schwächen der Assistenten kennenlernen und je Aufgabe das passende wählen.",
    dauer: "30 Min",
    schritte: [
      "Gleichen Prompt in zwei bis drei Assistenten eingeben (z. B. ChatGPT, Claude, Mistral Vibe).",
      "Bewerten nach: Richtigkeit, Verständlichkeit, Quellen, Ton.",
      "Eine Aufgabe mit Websuche wiederholen und Quellen stichprobenartig öffnen.",
    ],
    tools: ["ChatGPT", "Claude", "Gemini", "Mistral Vibe", "Perplexity"],
    ergebnis: "Kleine Bewertungstabelle im Padlet",
  },
  {
    id: "eigener-anwendungsfall",
    tag: 1,
    titel: "Mein Anwendungsfall",
    ziel: "Einen konkreten Einsatz für KI im eigenen Alltag oder Beruf finden und ausprobieren.",
    dauer: "30 Min",
    schritte: [
      "Eine wiederkehrende Aufgabe aufschreiben, die Zeit kostet.",
      "Mit ACTA einen Prompt dafür bauen.",
      "Ergebnis prüfen: Was müsste ich noch selbst tun?",
    ],
    ergebnis: "Ein wiederverwendbarer Prompt für die eigene Prompt-Sammlung",
  },
  {
    id: "lernvideo",
    tag: 2,
    titel: "Mini-Projekt: Lernvideo aus eigenen Quellen",
    ziel: "Aus Unterlagen ein verständliches Erklärvideo oder einen Podcast machen.",
    dauer: "90 Min",
    schritte: [
      "In NotebookLM ein Notizbuch anlegen und zwei bis fünf Quellen hochladen (PDF, Website, Text).",
      "Im Studio „Video-Überblick“ oder „Audio-Überblick“ wählen, Sprache Deutsch.",
      "Zielgruppe und Schwerpunkt angeben, Ergebnis anhören oder ansehen.",
      "Prüfen: Stimmt alles mit den Quellen überein?",
    ],
    tools: ["NotebookLM"],
    ergebnis: "Link oder Datei im Padlet, dazu zwei Sätze: Was war gut, was falsch?",
    hinweis: "Die „kinoartigen“ Video-Überblicke gibt es bisher nur auf Englisch und im Abo.",
  },
  {
    id: "musikvideo",
    tag: 2,
    titel: "Mini-Projekt: Song und Musikvideo",
    ziel: "Text, Musik und Bewegtbild mit KI kombinieren.",
    dauer: "90 Min",
    schritte: [
      "Songtext mit einem Assistenten schreiben (Thema, Stil, Strophen, Refrain).",
      "Song mit Suno oder Flow Music (vormals Riffusion) erzeugen.",
      "Bild der Sängerin oder des Sängers erzeugen, dann ein kurzes Video daraus machen.",
      "Rechte prüfen: Darf das Ergebnis veröffentlicht werden?",
    ],
    tools: ["Suno", "Flow Music", "Gemini Omni", "ChatGPT Bilder"],
    ergebnis: "Kurzes Video im Padlet",
    hinweis: "Gemini Omni setzt ein Google-AI-Abo voraus; im EWR können keine eigenen Videos hochgeladen werden. Vor dem Kurs testen.",
  },
  {
    id: "praesentation",
    tag: 2,
    titel: "Mini-Projekt: Präsentation oder Website",
    ziel: "Ein Thema recherchieren und als Folien oder Seite aufbereiten lassen.",
    dauer: "90 Min",
    schritte: [
      "Thema wählen und mit Websuche recherchieren lassen (Quellen nennen!).",
      "Gliederung festlegen: 6 bis 8 Folien oder Abschnitte.",
      "Folien oder Seite erstellen lassen, z. B. mit einem Agenten oder einem Präsentationstool.",
      "Fakten und Bilder prüfen, Quellen auf der letzten Folie.",
    ],
    tools: ["ChatGPT Work", "Claude", "Gamma"],
    ergebnis: "Link oder Datei im Padlet",
  },
  {
    id: "agenten-aufgabe",
    tag: 2,
    titel: "Mini-Projekt: Eine Aufgabe delegieren",
    ziel: "Eine echte Aufgabe an einen Agenten abgeben und das Ergebnis bewerten.",
    dauer: "60 Min",
    schritte: [
      "Aufgabe wählen, die Recherche und eine Datei als Ergebnis braucht.",
      "Auftrag schreiben: Ziel, Material, Grenzen, „fertig, wenn …“.",
      "Agenten arbeiten lassen und Zwischenschritte beobachten.",
      "Ergebnis gegen die eigenen Abnahmekriterien prüfen.",
    ],
    tools: ["ChatGPT Work", "Mistral Vibe Work Mode"],
    ergebnis: "Auftrag, Ergebnis und Bewertung im Padlet",
    hinweis: "Keinen Zugriff auf private Mails oder Konten freigeben.",
  },
];
