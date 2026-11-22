# Kurs-Auftritt, Erklär-Animationen und Modell-Update

Stand: umgesetzt (22.11.2026, Branch feat/kurs-update-2026-11) · Ausgangspunkt: Überarbeitung des Workshops „ChatGPT & Co. – Einführung und Fortgeschrittene“, Zusammenführung von prompting-tutor, prompt-tutor und miniprojekte in diese App.

## 1 Was und warum

Die vier Lern-Apps werden zu dieser einen App zusammengeführt. VHS-Teilnehmende sollen einen einfachen Kursbereich ohne Abteilungen, Vertraulichkeitsstufen und Rollen sehen; die KI-Werkstatt für Organisationen bleibt unverändert.

Entscheidungen:

- **Eine Codebasis, zwei Auftritte.** `src/lib/edition.ts` bestimmt den Auftritt: `VITE_APP_EDITION` → Hostname (`KURS_HOSTS`) → `organisation`. Derselbe Build kann also unter zwei Domains laufen.
- **Öffentlicher Kursbereich** unter `/kurs` und `/erklaert`, gerendert in `PublicApp` vor der Moduswahl: ohne Auth-, Sync- und Org-Kontext. Läuft auch, wenn Login, Supabase oder die KI-Schnittstelle im Kurs ausfallen.
- **Erklär-Animationen ohne Live-KI**: vorbereitete Daten, Schritt-Steuerung per Pfeiltaste/Presenter (`StepPlayer`). Kein API-Verbrauch, offline-fähig.
- **Übungen mit KI-Feedback** bleiben in `/onboarding` und `/playground` (Workshop-Login). Der Kursbereich verlinkt dorthin.
- **Modelle als Klassen** (schnell & günstig · ausgewogen · stark). Standardmodell `openai/gpt-6-luna`, Fallbacks zentral über `DEFAULT_MODEL`.

## 2 Aufbau

| Pfad | Inhalt | Datei |
| --- | --- | --- |
| `/kurs` | Kursübersicht, 4 Disziplinen, Module Tag 1/2 | `pages/kurs/KursHome.tsx` |
| `/kurs/:id` | Modul: Ziel, Kernpunkte, Vorher/Nachher, Prompts, Animationen, Übung | `pages/kurs/KursModulPage.tsx`, Daten `data/kurs/lernpfad.ts` |
| `/kurs/gruppen` | Gruppenübungen und Mini-Projekte | `pages/kurs/KursGruppen.tsx`, `data/kurs/gruppenarbeit.ts` |
| `/kurs/stand` | Aktuelle Modelle, Tools, Neuigkeiten (monatlich pflegen) | `pages/kurs/KursStand.tsx`, `data/kurs/stand.ts` |
| `/erklaert`, `/erklaert/:slug` | Erklär-Animationen | `pages/kurs/Erklaert.tsx`, Register `data/kurs/erklaert.ts`, Bausteine `components/erklaert/` |

Fertige Animationen: 1 Nächstes Wort, 2 Tokens, 3 Aufmerksamkeit, 9+14 Agenten und Prompt-Injection, 11 Was das Modell sieht, 12 Halluzination, 15 Wohin gehen meine Daten. In Vorbereitung (im Register ohne `komponente`): 4, 5, 6, 7, 8, 10, 13, 16, 17.

Neue Animation anlegen: Komponente unter `components/erklaert/animations/` mit `StepPlayer`, Eintrag mit `lazy(() => import(...))` in `data/kurs/erklaert.ts`, Slug ggf. im Modul (`erklaert: [...]`) verlinken.

## 3 Betrieb

- Kurs-Auftritt aktivieren: eine der Domains in `KURS_HOSTS` auf das Lovable-Projekt zeigen lassen, oder einen zweiten Build mit `VITE_APP_EDITION=kurs`.
- `MODEL_COSTS` in `supabase/functions/llm-proxy/index.ts` wurde korrigiert; die Edge Functions `llm-proxy` und `evaluate-prompt` müssen neu deployt werden, damit Kostenschätzung und Standardmodell greifen.
- Stand-Seite und Modellliste monatlich prüfen (`data/kurs/stand.ts`, `data/models.ts`).

## 4 Offen

- Hauptdomain für den Kurs-Auftritt festlegen.
- Organisations-Auftritt später als eigener Build mit eigener Domain, wenn die Codepfade auseinanderlaufen.
- Weitere neun Animationen.
