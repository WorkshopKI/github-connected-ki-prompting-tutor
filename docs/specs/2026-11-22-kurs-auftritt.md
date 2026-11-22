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
| `/kurs/vorlagen` | 49 Beispiel-Prompts in drei Stufen (Alltagshelfer, Juniorassistent, Forschungsassistent), Suche, Checkliste | `pages/kurs/KursVorlagen.tsx`, `data/kurs/vorlagen.ts` |
| `/kurs/profi` | Neun Profi-Techniken mit Einordnung 2026 | `pages/kurs/KursProfi.tsx`, `data/kurs/vorlagen.ts` |
| `/kurs/stand` | Aktuelle Modelle, Tools, Neuigkeiten (monatlich pflegen) | `pages/kurs/KursStand.tsx`, `data/kurs/stand.ts` |
| `/erklaert`, `/erklaert/:slug` | Erklär-Animationen | `pages/kurs/Erklaert.tsx`, Register `data/kurs/erklaert.ts`, Bausteine `components/erklaert/` |

Alle 16 Animationen sind fertig: 1 Nächstes Wort, 2 Tokens, 3 Aufmerksamkeit, 4 Temperatur, 5 Training in Phasen, 6 Kontextfenster und Gedächtnis, 7 Reasoning, 8 Websuche und Quellen, 9+14 Agenten und Prompt-Injection, 10 Wie Bilder entstehen, 11 Was das Modell sieht, 12 Halluzination, 13 Bedeutungsraum, 15 Wohin gehen meine Daten, 16 Verzerrungen, 17 KI-Inhalte erkennen.

Gruppenübungen (`data/kurs/gruppenarbeit.ts`): je Übung Phasen mit Minuten, Rollen, Startprompt, Prüfkriterien, leichtere/schwerere Variante, Plan B ohne Abo, Vorlage für den Padlet-Beitrag.

Neue Animation anlegen: Komponente unter `components/erklaert/animations/` mit `StepPlayer`, Eintrag mit `lazy(() => import(...))` in `data/kurs/erklaert.ts`, Slug ggf. im Modul (`erklaert: [...]`) verlinken.

## 2a Zusammenführung der Lern-Apps

| Alte App | Was übernommen ist | Wo jetzt |
| --- | --- | --- |
| prompting-tutor.kilab.org | 4 Disziplinen, Projekt-Zerlegung | Kurs-Module `/kurs/:id` |
| prompt-tutor.kilab.org | Bibliothek (49 Prompts, aktualisiert), drei Stufen, Advanced-Techniken, Ressourcen-Checkliste | `/kurs/vorlagen`, `/kurs/profi` |
| miniprojekte.lovable.app | Gruppenübungen und Mini-Projekte | `/kurs/gruppen` |
| prompting-studio.kilab.org | ist diese App | – |

Alte Pfade leiten weiter (`LEGACY_REDIRECTS` in `lib/edition.ts`), sobald die alten Domains auf dieses Lovable-Projekt zeigen: `/bibliothek`, `/ressourcen` → `/kurs/vorlagen`; `/lernen/alltagshelfer|junior|forschung` → `/kurs/vorlagen?stufe=…`; `/advanced` → `/kurs/profi`; `/acta` → `/kurs/fragen-mit-acta`; `/ueben` → `/onboarding`. Die Domains stehen in `KURS_HOSTS` und zeigen damit automatisch den Kurs-Auftritt. miniprojekte.lovable.app ist eine Lovable-Subdomain; dort die Startseite durch einen Hinweis mit Link auf `/kurs/gruppen` ersetzen.

## 3 Betrieb

- Kurs-Auftritt aktivieren: eine der Domains in `KURS_HOSTS` auf das Lovable-Projekt zeigen lassen, oder einen zweiten Build mit `VITE_APP_EDITION=kurs`.
- `MODEL_COSTS` in `supabase/functions/llm-proxy/index.ts` wurde korrigiert; die Edge Functions `llm-proxy` und `evaluate-prompt` müssen neu deployt werden, damit Kostenschätzung und Standardmodell greifen.
- Stand-Seite und Modellliste monatlich prüfen (`data/kurs/stand.ts`, `data/models.ts`).

## 4 Offen

- Hauptdomain für den Kurs-Auftritt festlegen.
- Organisations-Auftritt später als eigener Build mit eigener Domain, wenn die Codepfade auseinanderlaufen.
