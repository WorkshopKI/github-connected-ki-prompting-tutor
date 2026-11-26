/* ── Prompt-Inspiration je Gruppenübung ──
 * Steht direkt unter der Übung, damit niemand während der Gruppenarbeit in die Prompt-Vorlagen
 * springen muss (Rückmeldung Workshop 26.11.2026). Teils passende Prompt-Vorlagen und Profi-Techniken
 * (per Titel bzw. id verknüpft, damit sie nur an einer Stelle gepflegt werden), teils eigene Bausteine.
 * Regel: Inspiration zeigt Bauteile und Beispiele, nimmt aber das Ergebnis der Übung nicht vorweg.
 * Spec: docs/specs/2026-11-26-kurs-orientierung.md
 */
import { TECHNIKEN, VORLAGEN } from "./vorlagen";

export interface Inspiration {
  titel: string;
  text: string;
  /** Kleine Zeile über dem Titel, z. B. „Prompt-Vorlage · Kochen“. */
  herkunft: string;
  hinweis?: string;
}

/* Umbenannte Vorlage oder Technik: fällt still weg, meldet sich aber in der Entwicklung. */
function fehlt(was: string): null {
  if (import.meta.env.DEV) console.warn(`[gruppenInspiration] ${was} nicht gefunden`);
  return null;
}

function vorlage(titel: string): Inspiration | null {
  const v = VORLAGEN.find((x) => x.titel === titel);
  return v ? { titel: v.titel, text: v.text, hinweis: v.hinweis, herkunft: `Prompt-Vorlage · ${v.kategorie}` } : fehlt(`Prompt-Vorlage „${titel}“`);
}

function technik(id: string): Inspiration | null {
  const t = TECHNIKEN.find((x) => x.id === id);
  return t ? { titel: t.name, text: t.beispiel, hinweis: t.wann, herkunft: "Profi-Technik" } : fehlt(`Profi-Technik „${id}“`);
}

const eigen = (titel: string, text: string, hinweis?: string): Inspiration => ({ titel, text, hinweis, herkunft: "Baustein" });

const INSPIRATION: Record<string, (Inspiration | null)[]> = {
  "prompt-labor": [
    eigen(
      "Baustein Kontext",
      "Das Fest ist am {Datum} ab 16 Uhr im Hof unseres Mehrfamilienhauses. 30 Parteien, viele Familien mit kleinen Kindern, einige ältere Nachbarn. Jede Partei bringt etwas zu essen mit, Getränke stellt der Hausverein.",
      "Runde 2: an den Ein-Satz-Prompt anhängen.",
    ),
    eigen(
      "Baustein Ausgabe",
      "Als Aushang fürs Treppenhaus: höchstens 120 Wörter, freundlich und locker, Datum, Uhrzeit und Ort gut sichtbar, am Ende die Bitte um Rückmeldung bis {Datum}.",
      "Runde 3.",
    ),
    eigen("Baustein Rolle", "Du bist eine erfahrene Nachbarschaftsorganisatorin und weißt, wie man auch Zurückhaltende zum Mitmachen bewegt.", "Runde 4: Verändert die Rolle wirklich etwas?"),
    eigen(
      "Andere Aufgabe: Beschwerde an den Vermieter",
      "Die Heizung in meiner Wohnung fällt seit drei Wochen immer wieder aus, der Hausmeister wurde zweimal informiert. Schreib eine sachliche E-Mail an die Hausverwaltung, die eine Frist von 14 Tagen setzt und Mietminderung nur als Möglichkeit erwähnt. Höchstens 150 Wörter.",
    ),
  ],
  "tool-vergleich": [vorlage("Suche erzwingen und prüfen"), vorlage("Veranstaltungen"), vorlage("Preisvergleich"), vorlage("Inflationszahlen")],
  "eigener-anwendungsfall": [
    vorlage("Meeting-Agenda"),
    vorlage("Statusbericht-Vorlage"),
    vorlage("Antwort auf Beschwerde"),
    vorlage("Konstruktives Feedback"),
    vorlage("Onboarding-Plan"),
    vorlage("Tagesplan"),
  ],
  "steuern-duell": [
    eigen(
      "Gerüst Team A: Regelkatalog",
      "Schreib einen Aushang für das schwarze Brett: {Anlass}.\nRegeln:\n1. IMMER …\n2. NIEMALS …\n3. Maximal … Wörter\n4. Verwende …\n5. Vermeide …\n(mindestens acht Regeln)",
      "Nur das Gerüst: Die Regeln schreibt ihr selbst.",
    ),
    eigen(
      "Gerüst Team B: klares Ziel",
      "Schreib einen Aushang für das schwarze Brett: {Anlass}.\nZiel: {was soll passieren, z. B. drei Leute melden sich bis Freitag}.\nLeserschaft: {wer geht am Brett vorbei, was hält sie ab}.\nFertig, wenn: {woran ihr erkennt, dass der Aushang wirkt}.",
      "Nur das Gerüst: Ziel und Kriterien schreibt ihr selbst.",
    ),
    technik("ergebnis"),
  ],
  lernvideo: [
    eigen("Kontrollfrage: das Wichtigste", "Welche drei Aussagen in den Quellen sind für {Zielgruppe} am wichtigsten? Nenn zu jeder die Fundstelle."),
    eigen("Kontrollfrage: Lücken", "Was fehlt in den Quellen, um {Thema} für {Zielgruppe} vollständig zu erklären? Sag ehrlich, wenn die Quellen dazu nichts enthalten."),
    eigen("Kontrollfrage: Quiz", "Erstelle fünf Quizfragen mit Lösung, nur aus den Quellen. Nenn bei jeder Lösung die Fundstelle."),
  ],
  praesentation: [
    eigen(
      "Recherche mit Belegen",
      "Ich bereite eine kurze Präsentation für {Publikum} zum Thema {Thema} vor. Such aktuelle, belastbare Zahlen (nicht älter als zwei Jahre) und nenne zu jeder Zahl Quelle, Datum und Link. Markier, wo sich Quellen widersprechen.",
    ),
    eigen(
      "Gliederung mit Aussagen",
      "Schlag eine Gliederung mit 7 Folien vor. Jeder Titel ist eine Aussage, nicht nur ein Stichwort, z. B. „Ein Balkonkraftwerk rechnet sich nach sechs Jahren“. Nutze nur die Zahlen aus unserer Recherche.",
    ),
    eigen("Faktencheck", "Prüf jede Zahl in dieser Präsentation gegen die Quellen unten. Tabelle: Folie, Zahl, Quelle, steht so in der Quelle (ja / nein / unklar).\n\n{Präsentation oder Text einfügen}\n\nQuellen:\n{Links}"),
  ],
  "agenten-aufgabe": [
    eigen(
      "Beispielauftrag: Vereinsausflug",
      "Ziel: ein Ausflugsplan für unseren Verein (25 Erwachsene) für einen Samstag im {Monat}, Anreise mit der Bahn ab {Ort}, als Tabelle zum Ausdrucken.\nMaterial: offizielle Websites der Ausflugsziele und der Bahn.\nGrenzen: nichts buchen, nichts versenden, keine Konten anlegen.\nVorgehen: Erstell zuerst einen Plan und warte auf meine Freigabe.\nFertig, wenn: drei Ziele mit Fahrzeit, Eintritt pro Person, Öffnungszeiten und Link; Gesamtkosten unter 40 € pro Person.",
    ),
    eigen(
      "Beispielauftrag: Förderübersicht",
      "Ziel: eine Übersicht der Förderprogramme für {Vorhaben, z. B. Wärmepumpe im Einfamilienhaus} in {Bundesland}, Stand heute.\nMaterial: nur offizielle Seiten (Bund, Land, KfW, BAFA).\nGrenzen: keine Anträge stellen, nichts versenden.\nVorgehen: Erstell zuerst einen Plan und warte auf meine Freigabe.\nFertig, wenn: Tabelle mit Programm, Höhe, Bedingungen, Frist und Link; jede Zeile mit Abrufdatum.",
    ),
    technik("annahmen"),
  ],
};

/** Prompt-Inspiration zu einer Gruppenübung (leer, wenn es keine gibt). */
export function inspirationFuer(id: string): Inspiration[] {
  return (INSPIRATION[id] ?? []).filter((x): x is Inspiration => !!x);
}
