---
name: grillen
description: Use when ein Vorhaben, Plan oder Entwurf geschärft werden soll, bevor gebaut wird — Feature-Bitte, Rückmeldung, Umbau, Architektur- oder Datenmodell-Frage, Plan vor der Freigabe; auch bei „grill mich", „stell Rückfragen", „prüf den Plan". Ersetzt in diesem Repo superpowers:brainstorming.
---

# Grillen — Frontier-Interview vor dem Bauen

Aus dem Baukasten (Ursprung ZAH). Ziel: gemeinsames Verständnis, bevor eine Zeile entsteht. Fakten holt der Agent, Entscheidungen trifft der Nutzer.

## Runde 0 — Befund statt Fragen

1. Den Entscheidungsbaum „Wo nachsehen" in [CLAUDE.md](../../../CLAUDE.md) lesen, das genannte Doc öffnen.
2. Aus dem Bestand beantworten (Grep, Docs, `git log`, höchstens ein Explore-Agent — nie beim Nutzer): Gibt es das schon (unsichtbar, anders benannt, Opt-in)? Ist das Gewünschte die Antwort auf das Problem? Ist es halb da und kaputt? Gibt es das Hindernis überhaupt? Gibt es das in einer Schwester-App oder im Baukasten (`C:\01b_genAI_Code\baukasten\`)?
3. Befund in höchstens acht Zeilen mit Fundstellen. Dann Runde 1.

<!-- lokal:bestand -->
<!-- /lokal:bestand -->

## Runden 1 … n — die Frontier

- Alle Fragen, deren Voraussetzungen geklärt sind, in **einer** Runde, nummeriert, jede mit Empfehlung:

  ```
  ❓ **Q1 – Titel**: Frage, bei Bedarf mit Optionen A/B/C.

  ➡️ Empfehlung und ein Satz Grund.
  ```

- Hängt eine Frage an einer offenen Frage derselben Runde, kommt sie in die nächste.
- Was sich noch nicht genau stellen lässt, ist **Nebel**: lose notieren, nicht in Fragen zerschneiden.
- Jede Frage hat einen Weg: Grillen (Nutzer entscheidet) · Recherche (Explore nebenher, die übrigen Fragen sofort stellen) · Prototyp · wartet auf Dritte.
- Nach den Antworten Frontier neu rechnen, nächste Runde.

<!-- lokal:wege -->
<!-- /lokal:wege -->

## Pflicht-Zweige (sobald berührt)

<!-- lokal:pflicht-zweige -->
| Zweig | Frage |
|---|---|
| Daten | localStorage (`LS_KEYS`), Supabase-Tabelle oder beides über `SyncContext` — was passiert bei leerem Stand und beim Merge? |
| Supabase | Neue Tabelle oder Spalte: Migration unter `supabase/migrations/`, RLS-Policy, Admin über `has_role()`; Secrets nur über Lovable. |
| Vertraulichkeit | Welche Stufe (`open`/`internal`/`confidential`), und blockt `confidential` die externe API weiter? |
| Abteilung | Für welche Scopes aus `OrgContext` sichtbar? |
| Lovable | Ändert Lovable dieselben Dateien mit? Vorher `git pull`; keine neue npm-Dependency ohne Absprache. |
| Beleg | Jede Zahl mit Einheit und Quelle, aus dem Bestand gezählt. |
| Abnahme | Selbst geprüft — oder benennen, was nur die echte Umgebung zeigt. |
<!-- /lokal:pflicht-zweige -->

## Glossar

Begriffe gegen [CONTEXT.md](../../../CONTEXT.md) halten; Widerspruch sofort benennen („CONTEXT.md sagt X, du meinst Y — welches gilt?"). Ein geklärter Begriff steht noch in derselben Runde dort (ein Satz · nicht sagen · Quelle). Eine schwer umkehrbare Entscheidung bekommt einen Warum-Absatz im Themen-Doc; keine ADRs.

## Ende

Frontier leer → Zusammenfassung (Entscheidungen, Annahmen, offene Fakten, **Bewusst draußen**) → ab der Schwelle Spec mit `## 0. Anlass` nach der [Spec-Schablone](../../../docs/specs/README.md). Gebaut wird nach Freigabe des Nutzers. Bleiben Nebel oder Fragen an Dritte: **offene Spec** (`Stand: offen`) statt Plan — die nächste Sitzung beginnt dort.

Nicht tun: einen Fakt beim Nutzer erfragen · eine Frage pro Nachricht · eine Frage ohne Empfehlung · das „Offensichtliche" auslassen (dort laufen Bitte und Bedarf auseinander).
