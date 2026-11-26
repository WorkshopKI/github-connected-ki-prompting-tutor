# Kurs-Orientierung: zwei Tabs statt Live-Sync, kompaktere Seiten

Stand: umgesetzt (26.11.2026, Branch feat/kurs-orientierung) · Ausgangspunkt: Im Workshop am 26.11.2026 lief der Live-Sync für Teilnehmende unzuverlässig; Teilnehmende verloren zwischen Folien-Tab und App-Tab den Faden.

## 0. Anlass

Thomas nach dem Workshop (26.11.2026), mit Bildschirmfotos von Vorlagen, Kursstart und Gruppenarbeit „Steuern-Duell“:

> bitte die prompts übersichtlicher, kompakter mit mehr prompts ohne scrollen sichtbar, Vorlagen umbenennen in Prompt-Vorlagen / prompt inspiration direkt unter gruppenübung, damit user nicht erst in die Vorlagen springen muss / die synchronisation hat heute im Workshop nicht gut funktioniert, bitte wieder entfernen. Die Teilnehmer sehen auf dem Beamer die Präsentation und haben den Präsi modus in einem Tab offen. In dem anderen Tab ist die App normal offen, von dort springen sie zu den Übungen und Gruppenübungen. Bitte User Journey verbessern, dass die User immer wissen, in welchem Thema und welcher Übung sie sind. / Startpage vertikal kompakter machen, damit user auf einen Blick ohne scrollen alles sieht

## 1. Warum

Die Teilnehmenden arbeiten mit zwei Tabs: Folien (selbst geblättert) und App (Übungen, Gruppenarbeit, Vorlagen). Der Live-Sync hat sie von außen umgesteuert; das hat im Raum mehr verwirrt als geholfen. Was fehlt, ist eine ruhige Orientierung, die ohne Netz und ohne Kursleitung funktioniert: Wo bin ich (Tag, Block, Thema, Übung), und wie komme ich zwischen den beiden Tabs hin und her, ohne dass immer neue Tabs aufgehen oder der eigene Tab ersetzt wird.

## 2. Befunde aus dem Bestand

- `/live` mit Code `VHS2026`, Live-Band (`LiveBand.tsx`) und „Folgen“ waren nur für Teilnehmende da; Präsentieren (`/kurs/praesentation`) und Leitstand (`/kurs/leitstand`) nutzt nur die Kursleitung.
- `FahrplanLeiste` stand unter dem Kopf und scrollte auf langen Seiten weg; auf `/kurs/gruppen` zeigte sie immer die erste Station der Seite (Prompt-Labor), egal welche Übung offen war.
- Vorlagen-Seite: eine Karte zeigte den ganzen Prompt; bei 1280×800 waren 2–3 Prompts sichtbar.
- Kursstart: zwei Tageskarten mit großen Modulkarten, bei 1280×800 nur Tag 1 ganz sichtbar.
- Gruppenübungen verwiesen für Beispiel-Prompts auf die Vorlagen-Seite.

## 3. Entwurf

**Live-Sync nur noch für die Kursleitung.** `kursLive.ts` kennt die Rollen `leitung` und `leitstand`. Teilnehmer-Rolle, Presence-Zählung, „Folgen“, `/live` und Live-Band entfallen; `/live` und `/live/:code` leiten auf `/kurs`. Der alte Speicher `kurs-live:teilnehmer` wird beim Laden gelöscht. Aus dem Live-Band bleibt für die Leitung „Zurück zur Präsentation“ (`LeitungZurueck.tsx`). Grund: Präsentieren und Leitstand liefen stabil, nur das Mitziehen der Teilnehmenden nicht.

**Kurs-Position statt Sync** (`src/lib/kursPosition.ts`). Jede Kursseite mit Station und jede Folie merkt sich die Station in `LS_KEYS.KURS_POSITION`. Das `storage`-Ereignis trägt sie in den anderen Tab. Kein Netz, nur dieser Browser.

**Zwei benannte Tabs.** `KursLayout` setzt `window.name` auf `ki-werkstatt-kurs` bzw. auf `/kurs/folien` `ki-werkstatt-folien`. `TabLink` öffnet Links in den anderen Tab mit `window.open(pfad, name)`: Der vorhandene Tab wird umgeleitet und nach vorn geholt, sonst entsteht er einmal. Blockt der Browser, öffnet die Seite im eigenen Tab. Mittelklick und Strg-Klick bleiben normale Links.

**Du-bist-hier-Leiste im mitlaufenden Kopf.** Tag, Block und Thema wie in der Fußzeile am Beamer („Tag 2 · Block 3/7 · Steuern“), Balken der Tagesblöcke, Typ und Titel der Station, Link „Folien X–Y“ in den Folien-Tab, „Als Nächstes“. Seiten ohne Station (Prompt-Vorlagen, Übungen, Aktuelle Modelle) zeigen „Zuletzt im Kurs: … Zurück dorthin“. Auf `/kurs` und `/kurs/folien` keine Leiste (Übersicht bzw. eigener Kopf). `stationFuerPfad` berücksichtigt den Anker und die zuletzt besuchte Station; Gruppenübungen und Mini-Projekte bilden ihren Anker über `station` in `gruppenarbeit.ts` auf die Station ab.

**Folien-Tab.** Öffnet ohne `?f` an der zuletzt besuchten Folie bzw. Station. Kopf mit Thema, Typ und Titel; bei Übungs- und Gruppenstationen eine Primäraktion „Zur Übung“/„Zur Gruppenarbeit“, die im App-Tab öffnet.

**Gruppenarbeit.** Aufklappen setzt den Anker (die Leiste zeigt die Übung), die offene Übung ist hervorgehoben, jede Übung trägt Block, Thema und Folie. Unter jeder Übung „Prompt-Inspiration“: zwei bis sechs kompakte Prompts aus den Vorlagen, Profi-Techniken oder eigens geschriebene Gerüste (`gruppenInspiration.ts`).

**Prompt-Vorlagen.** Umbenannt (Navigation, Seitentitel, Verweise). Eine Filterzeile (Stufen mit Anzahl, Suche, Checkliste aufklappbar), Raster mit drei Spalten, Prompt auf drei Zeilen gekürzt mit „mehr“, Kopieren in der Karte (`PromptKompakt.tsx`).

**Kursstart.** Kopf mit „Weiter: <zuletzt>“ als Primäraktion und „Folien im zweiten Tab“, roter Faden in einer Zeile, Module beider Tage als dichte Listen, „Üben und wiederholen“ in einer Zeile. Modulseite zeigt „Modul n von 14“.

## 4. Schritte

Ein Schritt, ein Commit. Neue Dateien: `lib/kursPosition.ts`, `components/kurs/TabLink.tsx`, `components/kurs/PromptKompakt.tsx`, `components/kurs/GruppenAufgabe.tsx`, `data/kurs/gruppenInspiration.ts`; `components/kurs/live/LiveBand.tsx` → `LeitungZurueck.tsx`; `pages/kurs/KursLive.tsx` gelöscht.

## 5. Abnahmekriterien und Verifikation

1. `/live` und `/live/VHS2026` · aufrufen · landen auf `/kurs`; nirgends ein Feld für einen Live-Code.
2. `/kurs/praesentation` · Taste L, dann Esc · App-Seite zur Folie öffnet sich, „Zurück zur Präsentation · Folie N“ führt zurück; Leitstand verbindet sich und zeigt „verbunden“.
3. `/kurs/gruppen#steuern-duell` · öffnen · Übung ist aufgeklappt und hervorgehoben, Leiste im Kopf zeigt „Tag 2 · Block 3/7 · Steuern“ und „Gruppenarbeit Steuern-Duell“; beim Scrollen bleibt die Leiste sichtbar.
4. Gruppenübung „Steuern-Duell“ · aufklappen · darunter „Prompt-Inspiration“ mit Prompts zum Kopieren, ohne Seitenwechsel.
5. App-Tab `/kurs` · „Folien im zweiten Tab“ · zweiter Tab mit Folien öffnet sich; dort „Zur Gruppenarbeit“ · der App-Tab zeigt die Übung, kein dritter Tab.
6. App-Tab mit Leiste · „Folien X–Y“ · der Folien-Tab springt auf Folie X, kein neuer Tab.
7. Folien-Tab · auf eine andere Folie blättern · App-Tab auf `/kurs/vorlagen` zeigt „Zuletzt im Kurs: …“ mit dem Thema dieser Folie.
8. `/kurs/vorlagen` bei 1280×800 · öffnen · Navigation „Prompt-Vorlagen“, mindestens sechs Prompt-Karten ganz sichtbar, „mehr“ klappt einen Prompt auf.
9. `/kurs` bei 1280×800 · öffnen · Kopf, roter Faden, alle Module beider Tage und „Üben und wiederholen“ ohne Scrollen sichtbar.
10. `npm run check`, `tsc` und `eslint` ohne Fehler.

Verifikation: Gate; Abnahme im eingebauten Browser (Kurs-Auftritt per `app-edition`) und im echten Chrome für das Zusammenspiel zweier Tabs (5–7), weil der eingebaute Browser keine benannten Tabs kennt.

## 6. Bewusst draußen

- Präsentieren aus der App und Leitstand bleiben, samt Realtime-Kanälen der Leitung.
- Folie 2 der PPTX: erledigt in Folien v33 (Nachtrag unten).
- Keine Synchronisation des Fortschritts zwischen Geräten; die Kurs-Position gilt nur im eigenen Browser.

## 7. Offene Fakten

- Ob jeder Browser den anderen Tab per `focus()` nach vorn holt, hängt vom Browser ab (Chrome: Tab wird umgeleitet, im Test kein neuer Tab). Holt er ihn nicht nach vorn, ist der Inhalt trotzdem dort.

## 8. Nachtrag 26.11.2026: Folie 2 ohne Live-Code (Folien v33)

- Folie 2: „Lern-App: QR-Code oben rechts, dann „Folien im zweiten Tab“ öffnen“ statt Live-Code; QR-Code und Adresse `prompting-studio.kilab.org/kurs` (`folien.py bauen`: Folie mit Link `/kurs` bekommt die Adresse zum Abtippen statt `/f/<nr>`). Sprechernotiz erklärt die zwei Tabs.
- `folien.py export` schreibt die Daten jetzt über `daten_schreiben()`; so lassen sich einzelne Folien neu rendern.
- Gerendert auf Windows ohne `pdftoppm` und ohne die Ersatzschrift der bisherigen Bilder: Bilder von Folie 2 (`public/folien/f02-*.webp`) und `Kursfolien_November_2026_v33.pdf` über PowerPoint, also mit der echten Aptos. Die übrigen Folienbilder stammen weiter aus LibreOffice mit Inter als Ersatz für Aptos; der Fließtext von Folie 2 sieht in der App darum etwas anders aus als auf den Nachbarfolien. Beim nächsten vollständigen `export` gleicht sich das wieder an.
- Abnahme: QR-Code in `f02-3.webp` liest sich als `https://prompting-studio.kilab.org/kurs`; Text von v32 und v33 unterscheidet sich nur auf Folie 2; `validate.py` ohne Fehler; `npm run check` grün.
