# Spec — die leichte Artefakt-Kette

Aus dem Baukasten (Ursprung ZAH). Ein Ordner, ein Artefakt je Vorhaben: `docs/specs/YYYY-MM-DD-<slug>.md` hält fest, **was, warum und wie** gebaut wird. Der freigegebene Plan wird selbst zur Spec; es entsteht kein zweites Dokument daneben. Die Spec wird mit der Umsetzung committet. Prozess: [entwicklungsprozess.md](../../CLAUDE.md).

## Wann eine Spec ins Repo gehört (Schwelle)

<!-- lokal:schwelle -->
- ein neues Modul, eine neue Seite oder eine neue Datenquelle,
- ein neues oder geändertes Speicherformat,
- ein neuer Guard, Skill, Hook oder Agent,
- ein Umbau von Aufbau, Build oder Workflow.
<!-- /lokal:schwelle -->

Die Zahl geänderter Dateien ist bewusst kein Kriterium: Sie trifft fast jedes Feature und macht aus jedem Plan ein Repo-Dokument, ohne dass eine neue Achse entsteht. Darunter genügt der Plan im Chat; ein Bugfix mit klarer Ursache geht direkt.

<!-- lokal:ablage -->
<!-- /lokal:ablage -->

## Zustand: die Stand-Zeile beginnt mit ihm

Eine Spec beschreibt einen Plan zu einem Zeitpunkt; den Ist-Zustand beschreibt das Themen-Doc. Damit niemand einen überholten Plan als gültig liest, beginnt die Stand-Zeile mit genau einem Wort:

| Zustand | heißt | wechselt, wenn |
|---|---|---|
| `offen` | Weg noch nicht klar (offene Spec, unten) | Fragen und Nebel leer sind |
| `freigegeben` | Plan steht, Bau läuft oder wartet | der letzte Schritt committet ist |
| `umgesetzt` | gebaut; ab hier gilt das Themen-Doc | — |

Form: `Stand: umgesetzt (<Datum>, v<Version>) · Ausgangspunkt: …`. Der Wechsel auf `umgesetzt` gehört in den Commit des letzten Schritts. Umgesetzte Specs bleiben liegen: Code-Kommentare und Docs verweisen auf sie als Begründung.

<!-- lokal:zustand -->
<!-- /lokal:zustand -->

## Mehrteilige Specs: Doku am Ende

Hat §4 mehrere Schritte, die einzeln committet werden (S1 … Sn), wird die Doku nur einmal nachgezogen, nicht in jedem Schritt:

- **In jedem Schritt:** Changelog, Häkchen und Entscheidungen in der Spec.
- **Erst im letzten Schritt:** Themen-Docs, `CONTEXT.md`, die Zeile in der `CLAUDE.md`, harte Regeln in der `CLAUDE.md` eines Modulordners. Bis dahin ist die Spec der Ist-Stand.
- **Im ersten Schritt** ein Satz im Themen-Doc, der auf die Spec zeigt — sonst liest ein Agent dort den alten Stand als gültig.
- **Pausiert die Serie** (der nächste Schritt wartet auf Betrieb oder Dritte, nicht auf die Freigabe des Nutzers), zieht der letzte gebaute Schritt nach.

<!-- lokal:mehrteilig -->
<!-- /lokal:mehrteilig -->

## Offene Spec: bevor der Weg klar ist

Manche Vorhaben sind zu groß für eine Sitzung, und der Weg ist noch nicht sichtbar: Fragen hängen an anderen Fragen, am Betrieb oder an Dritten. Dann endet das Grillen nicht mit einem Plan, sondern mit einer **offenen Spec**: dieselbe Datei, im Kopf `Stand: offen`, statt §3–§5 die Abschnitte unten.

- **Offene Fragen** sind genau gestellt (beantwortbar müssen sie nicht sein) und tragen ihren Weg: Grillen · Recherche · Prototyp · wartet auf Betrieb/Dritte.
- **Nebel** ist, was sich noch nicht genau fragen lässt — lose notiert, nicht vorab in Fragen zerschnitten.
- Jede Sitzung nimmt eine offene Frage aus der Frontier, trägt die Antwort unter **Entscheidungen** ein und prüft, ob Nebel zu Fragen geworden ist.
- Sind Fragen und Nebel leer, ist der Weg klar: `Stand` wechselt auf `freigegeben`, §3–§5 kommen dazu, die Entscheidungen wandern mit einem Satz Grund nach §3. Kein zweites Dokument.
- Offene Fäden laufender Serien gehören hierher, nicht nur ins Gedächtnis des Agenten.

```markdown
# <Titel>

Stand: offen (<Datum>) · Ziel: <woran man merkt, dass es fertig ist — Spec, Entscheidung oder Änderung>

## 0. Anlass
## 1. Warum
## 2. Befunde aus dem Bestand

## Entscheidungen
- <Frage> → <Antwort> (<Datum>, Weg)

## Offene Fragen
- <genau gestellte Frage> — Weg: Grillen | Recherche | Prototyp | wartet auf <wen/was>; hängt an: <Frage oder —>

## Nebel
- <lose Beschreibung>; lichtet sich, wenn <…>

## Bewusst draußen
- <was nicht Teil des Vorhabens ist, und warum>
```

## Schablone

```markdown
# <Titel>

Stand: freigegeben (<Datum>) · Ausgangspunkt: <ein Satz>

## 0. Anlass
In den Worten des Auslösers (Zitat, Rückmeldung, Beobachtung), 3–6 Zeilen. Pflicht.

## 1. Warum
Das Problem hinter dem Anlass; was die wörtliche Bitte nicht sagt.

## 2. Befunde aus dem Bestand
Gemessen, mit Datum, Datenstand und Fundstellen. Zahlen tragen Einheit und Quelle.

## 3. Entwurf
Bausteine, Datenfluss, Fehlerfälle, Tests — in Abschnitten je Baustein. Entscheidungen aus der Grill-Runde mit einem Satz Grund.

## 4. Schritte
Der freigegebene Plan: je Schritt Dateien, Schnittstellen, Reihenfolge. Checkboxen `- [ ]`, wenn die Umsetzung über mehrere Sitzungen läuft.
**S0 Gerüst** kommt vor S1, sobald neue Dateien oder Exporte entstehen: Dateien mit einem Kopfkommentar zur Verantwortung, exportierte Typen und Signaturen (Rumpf `throw new Error('Gerüst')`), dazu die `CLAUDE.md` eines neuen Modulordners. Zum Gerüst gehören die maschinell prüfbaren Abnahmekriterien aus §5 als Tests, die gegen das Gerüst **rot** laufen; belegt mit der Zeile `Rot gesehen: <n> Tests, <Dateien>, <Datum>` in diesem Abschnitt. Der Nutzer sieht den Gerüst-Diff, bevor S1 die Rümpfe füllt; S0 wird mit S1 committet, denn ein roter Test kommt nicht durchs Gate. Ändert ein späterer Schritt eine Gerüst-Signatur, steht der Grund hier.

## 5. Abnahmekriterien und Verifikation
Zuerst die Kriterien, vor der Freigabe: nummerierte, beobachtbare Sätze nach dem Muster *Ort · Handlung · was sichtbar ist (Text, Zahl, Zustand)*, kein „funktioniert", kein „besser". Was sich maschinell prüfen lässt, wird beim Bauen zuerst zum roten Test. Danach das Wie: Gate, Abnahme, was nur die echte Umgebung zeigt. Pflicht außer bei offenen Specs.

## 6. Bewusst draußen
Was nicht dazugehört, und warum.

## 7. Offene Fakten
```

## Pflichten dieser App

<!-- lokal:pflichten -->
Keine über die Schablone hinaus.
<!-- /lokal:pflichten -->
