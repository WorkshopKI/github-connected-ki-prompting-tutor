# Kurs-Fahrplan, Präsentieren aus der App, Live-Sync und Leitstand

Stand: umgesetzt (22.11.2026, Branch feat/kurs-live-sync) · Ausgangspunkt: Folien v26 und Lern-App liefen nebeneinander her; weder Kursleitung noch Teilnehmende sahen, wo sie im Ablauf stehen und was als Nächstes kommt.

## 0. Anlass

Folien verwiesen nur in Textform auf die App („Lern-App: KI erklärt → Tokens“), die App kannte die Folien nicht. Entscheidungen von Thomas (22.11.2026):

- **Präsentiert wird aus der App.** Die PPTX bleibt Rückfallebene.
- **Alle drei Stufen** nacheinander: Fahrplan, Live-Sync, Leitstand.
- **Volle Folien bauen sich schrittweise auf** (progressive disclosure), Weiterschalten manuell beim Vortrag.
- **Animationen werden ihrer Lektion zugeordnet** (Tag · Block · Folie), Übersicht nach Kursablauf.
- **„Was das Modell sieht“** einfarbig in Abstufungen statt bunt.

Recherche, warum nicht PowerPoint fernsteuern: Office.js meldet keinen Folienwechsel in der Bildschirmpräsentation (nur Polling, in PowerPoint für das Web gar nicht); „Present Live“ von PowerPoint für das Web ist seit Mai 2025 eingestellt. Das Muster „eine Präsentation führt, Geräte folgen“ (reveal.js multiplex) lässt sich mit Supabase Realtime ohne neuen Dienst bauen.

## 1. Abnahmekriterien

- [x] Jede Folie gehört genau einer Station; Station → Block → Tag (`fahrplan.json`).
- [x] Folien v27: Fußzeile „Tag · Block · Als Nächstes“, QR-Codes auf Mitmach-Folien, Klick-Animationen für den Aufbau.
- [x] `/kurs/praesentation`: Folienbilder je Aufbauschritt, Presenter/Pfeiltasten/Klick, Sprung per Ziffern, Beamer schwarz, App-Seite zur Folie öffnen (L) und zurück (Esc).
- [x] Teilnehmende treten mit Code bei (`/live`), sehen im Live-Band Folie, Block, Ansage; „Folgen“ öffnet Übungen/Demos.
- [x] Geräteübergreifend getestet (zwei Browser-Kontexte, Supabase Realtime) und im selben Browser (BroadcastChannel).
- [x] `/kurs/leitstand`: aktuelle und nächste Ansicht, Sprechernotiz, Zeit Soll/Ist je Station, Lage im Tagesplan, Ansagen, Fernbedienung, Springen.
- [x] Kurzlinks `/f/:nr` aus den QR-Codes führen zur passenden Seite.
- [x] „KI erklärt“ (App und Offline-Fassung) nach Lektionen geordnet, Detailseite mit Lektion, Folie, Modul.
- [x] `npm run check`, `tsc`, `eslint` ohne Fehler.

**Nachträge 23.11.2026:** fester Live-Code `VHS2026` (`kursCode` in `fahrplan.json`, Eingabe ohne Rücksicht auf Groß-/Kleinschreibung; QR auf Folie 2 führt direkt zu `/live/VHS2026`). PPTX: Abschnitte = Blöcke („Tag 1 · 3 Fragen mit ACTA“), größerer QR-Code, Schrittbalken in der Fußzeile (gefüllt = sichtbar, nur auf Folien mit Aufbau). Folienseite `/kurs/folien` mit einzeiligem Kopf und einzeiliger Steuerleiste.

## 2. Aufbau

| Teil | Datei |
| --- | --- |
| Fahrplan (Blöcke, Stationen, Links je Folie, Animation → Folie, QR-Folien) | `src/data/kurs/fahrplan.json`, Typen/Helfer `fahrplan.ts` |
| Folien-Daten (Titel, Aufbauschritte) und Bilder | `src/data/kurs/folien.json` + `folien.ts`, `public/folien/fNN-S.webp` (generiert) |
| Sprechernotizen (nur Leitstand lädt sie) | `src/data/kurs/folien-notizen.json` (generiert) |
| Schrittweiser Aufbau je Folie | `scripts/folien/aufbau.json` |
| Werkzeug PPTX → PPTX/Bilder | `scripts/folien/folien.py` (`bauen`, `export`) |
| Live-Store und Transporte | `src/lib/kursLive.ts` |
| Präsentationsmodus | `pages/kurs/KursPraesentation.tsx`, `hooks/usePraesentation.ts`, `components/kurs/live/Praesentation*.tsx` |
| Leitstand | `pages/kurs/KursLeitstand.tsx`, `components/kurs/live/Leitstand*.tsx` |
| Teilnehmende | `pages/kurs/KursLive.tsx` (`/live`), `pages/kurs/KursFolien.tsx` (`/kurs/folien`), `components/kurs/live/LiveBand.tsx` |
| Du-bist-hier ohne Live | `components/kurs/live/FahrplanLeiste.tsx` (in `KursLayout`) |
| Animationen nach Lektion | `data/kurs/erklaertImKurs.ts`, `components/erklaert/ErklaertLektion.tsx` |

**Live-Sync.** Rollen `leitung` (Beamer, einzige Quelle des Stands), `leitstand`, `teilnehmer`. Öffentlicher Kanal `kurs-live:<CODE>`: Broadcast `stand` bei jedem Klick, Presence für den Stand spät Dazukommender und die Zahl der Teilnehmenden (gebündelt, Realtime begrenzt Presence-Nachrichten). Geheimer Kanal `kurs-steuer:<CODE>:<TOKEN>` für Befehle Leitstand → Beamer; der Token steht nur im Leitstand-Link. Parallel BroadcastChannel für Fenster im selben Browser, auch ohne Internet. Speicher je Rolle unter `LS_KEYS.KURS_LIVE:<rolle>`, damit Beamer- und Leitstand-Fenster sich nicht überschreiben.

**Folgen.** Teilnehmende springen nur bei Stationen vom Typ `uebung`/`gruppe` und bei Demo-Seiten der Leitung, je Station einmal; abschaltbar.

## 3. Betrieb

Folien ändern: neue PPTX auf Basis der Version **ohne** Stempel (v26) bearbeiten, dann im Repo

```
pip install python-pptx qrcode pillow     # LibreOffice (soffice) und pdftoppm im PATH
python scripts/folien/folien.py bauen  --ein v26.pptx --aus v27.pptx [--basis-url https://…]
python scripts/folien/folien.py export --pptx v27.pptx --pdf Kursfolien_v27.pdf
```

`bauen` ersetzt vorhandene Stempel und Animationen, läuft also auch auf v27 erneut. Ändern sich Foliennummern, `fahrplan.json` (Stationen, `links`, `animationen`, `qr`) und `aufbau.json` mitziehen; `bauen` warnt, wenn ein Folientitel nicht mehr passt.

Realtime muss im Supabase-Projekt für öffentliche Kanäle erlaubt sein (Standard). Hauptdomain ist `prompting-studio.kilab.org` (`KURS_HAUPTDOMAIN` in `src/lib/edition.ts`, Standard von `--basis-url`); dorthin zeigen die QR-Codes.

## 4. Grenzen und offen

- Der Code ist kein Passwort: Wer ihn kennt, könnte einen Leitungs-Stand vortäuschen (ohne Token aber nichts am Beamer steuern). Für VHS-Kurse vertretbar; sonst Realtime Authorization mit privaten Kanälen.
- Sprechernotizen sind öffentlich abrufbar; keine vertraulichen Angaben hineinschreiben.
- Folienbilder rendert LibreOffice; Schriften müssen installiert sein (Source Sans/Serif).
- Hauptdomain festgelegt (22.11.2026): `prompting-studio.kilab.org` zeigt den Kurs-Auftritt. Der Organisations-Auftritt (KI-Werkstatt) ist dort über `/org` erreichbar (je Browser gemerkt, `/org/aus` schaltet zurück; `src/lib/editionWahl.ts`).
