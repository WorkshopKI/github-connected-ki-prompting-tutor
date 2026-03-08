# CLAUDE.md

## Project Overview

Prompting Studio — Enterprise Prompting Platform für Organisationen mit Compliance-Anforderungen. Sidebar-basiertes Multi-Page Layout mit Abteilungskontext und Zwei-Stufen KI-Routing.

**Kernfeatures:**
- 5 Haupt-Seiten: Dashboard, Prompt Library, Prompt-Labor (Playground), Onboarding, Einstellungen
- Abteilungskontext (OrgContext): Privatgebrauch, Gesamte Organisation, oder 5 Abteilungen (Legal, Öffentlichkeitsarbeit, HR, IT, Bauverfahren)
- Zwei-Stufen KI-Routing: Interne KI vs. Externe Business-API mit Vertraulichkeitsklassifikation (open/internal/confidential)
- 126+ Prompts (76 generische + 50 abteilungsspezifische) mit `targetDepartment` + `confidentiality` Feldern
- Sidebar-Layout via AppShell für alle Seiten außer Login und Playground

## Tech Stack

- **Framework:** React 18 + TypeScript 5
- **Build:** Vite 5 (SWC plugin, dev server on port 8080)
- **Styling:** Tailwind CSS 3 with CSS variables design system in `src/index.css`
- **Components:** shadcn-ui (Radix UI primitives) in `src/components/ui/`
- **Routing:** React Router DOM 6 — Sidebar-Layout via AppShell. Routes: `/` (Dashboard), `/library`, `/playground`, `/onboarding`, `/settings`, `/login`, `/admin/teilnehmer`. Legacy redirects: `/workspace` → `/library`, `/analytics` → `/`, `/profil` → `/settings`
- **State:** React Context (`AuthContext`, `SyncContext`, `OrgContext`), local `useState`, React Query
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **LLM:** OpenRouter / Lovable AI Gateway via `llm-proxy` edge function (streaming SSE)
- **Icons:** lucide-react
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner (toast)
- **Dark mode:** next-themes (class-based toggling)
- **Package Manager:** npm (bun.lockb also present)

## Commands

```bash
npm run dev        # Start dev server (port 8080)
npm run build      # Production build (TypeScript check + Vite)
npm run build:dev  # Development mode build
npm run lint       # ESLint (flat config)
npm run preview    # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── ui/                         # shadcn-ui Primitives (48 Komponenten)
│   ├── playground/                 # Playground Sub-Komponenten
│   │   ├── ACTABuilder.tsx         # ACTA-Methode Builder
│   │   ├── ACTATemplates.ts        # ACTA-Vorlagen
│   │   ├── AgentKnobs.tsx          # Agent-Konfiguration
│   │   ├── ChatInput.tsx           # Chat-Eingabefeld mit animiertem Stop-Button
│   │   ├── ChatMessage.tsx         # Einzelne Chat-Nachricht
│   │   ├── ChatPlayground.tsx      # Haupt-Chat-Bereich mit Lade-Indikator
│   │   ├── ComparisonView.tsx      # Modell-Vergleich
│   │   ├── ConversationHistory.tsx # Gesprächsverlauf
│   │   ├── IterationNudge.tsx      # Verbesserungsvorschläge nach erster KI-Antwort
│   │   ├── JudgePanel.tsx          # Judge-Bewertung durch Referenz-KI
│   │   ├── PlaygroundHeader.tsx    # Playground Top-Bar
│   │   ├── PlaygroundSidebar.tsx   # Playground linke Sidebar
│   │   ├── PromptEvaluation.tsx    # Prompt-Bewertung
│   │   ├── SystemPromptEditor.tsx  # System-Prompt Editor
│   │   ├── TechniquePanel.tsx      # Technik-Auswahl
│   │   ├── TechniqueTemplates.ts   # Technik-Vorlagen
│   │   └── ThinkingBlock.tsx       # Aufklappbarer Denkprozess-Block
│   ├── settings/                   # Settings Sub-Komponenten
│   │   ├── AIRoutingSettings.tsx   # KI-Konfiguration Tab
│   │   ├── AppearanceSettings.tsx  # Darstellung Tab
│   │   ├── ComplianceSettingsTab.tsx # Compliance Tab
│   │   ├── GeneralSettings.tsx     # Allgemein Tab
│   │   └── RolesSettings.tsx       # Rollen & Rechte Tab
│   ├── ACTAIntroduction.tsx        # Kombiniertes Intro: Vorher/Nachher + ACTA + Quick Challenge
│   ├── ACTAQuickChallenge.tsx      # Schnell-Challenge für ACTA-Methode
│   ├── ACTASection.tsx             # ACTA-Methode Erklärung
│   ├── AdvancedPromptingSection.tsx # Fortgeschrittene Techniken
│   ├── AnalyticsSection.tsx        # Dashboard Analytics & Insights (Collapsible)
│   ├── AppShell.tsx                # Sidebar-Layout mit Navigation (5 Nav-Items)
│   ├── BudgetDialog.tsx            # LLM Budget Info
│   ├── ConfidentialityBadge.tsx    # 🟢🟡🔴 Vertraulichkeits-Badges
│   ├── CreditsDialog.tsx           # Credits/Impressum Dialog
│   ├── DailyChallenge.tsx          # Tagesaufgabe auf dem Dashboard
│   ├── DataPrivacyIntro.tsx        # Datenschutz-Bonus-Modul (3 Stufen + Redaction-Drills)
│   ├── DecompositionAssistant.tsx  # Aufgaben-Zerlegung Assistent
│   ├── ExerciseCard.tsx            # Übungskarte mit LLM-Bewertung
│   ├── FlawExercise.tsx            # "Fehler finden" Übungstyp mit Checkboxen
│   ├── Footer.tsx                  # Footer
│   ├── GuestBanner.tsx             # Banner für Gast-Registrierung
│   ├── LevelCard.tsx               # Level-Karte für Onboarding
│   ├── Logo.tsx                    # Typografisches Logo mit sidebar-Variant
│   ├── MySkills.tsx                # Persönliche Skill-Sammlung (speichern, bearbeiten, exportieren)
│   ├── OrganizationUseCases.tsx    # Abteilungs-Use-Cases
│   ├── PendingReviews.tsx          # Review-Workflow (Mock)
│   ├── PracticeArea.tsx            # Übungs-Grid Container
│   ├── PracticeAreaCompact.tsx     # Kompakte Version der Übungen für Onboarding
│   ├── PromptDetail.tsx            # Prompt-Detail-Modal
│   ├── PromptExamples.tsx          # Prompt-Beispiele
│   ├── PromptLibrary.tsx           # Prompt-Bibliothek mit Abteilungs-Tabs
│   ├── RedactionExercise.tsx       # Datenschutz-Übung: Sensible Daten erkennen
│   ├── ResourcesSection.tsx        # Ressourcen & Links
│   ├── StatCard.tsx                # Wiederverwendbare Statistik-Karte
│   ├── SyncStatusIcon.tsx          # Cloud-Sync Indikator
│   ├── TeamMembers.tsx             # Team-Mitglieder (Mock)
│   ├── ThemePresetPicker.tsx       # Theme-Presets Auswahl
│   ├── ThemeProvider.tsx           # Theme Provider
│   ├── ThemeToggle.tsx             # Dark/Light Toggle
│   ├── UserMenu.tsx                # Dropdown mit Profil/Admin/Logout
│   └── themePresets.ts             # Theme-Preset Definitionen
├── contexts/
│   ├── AuthContext.tsx              # Auth State, OTP Login, Guest Login, Session
│   ├── SyncContext.tsx              # Progress Sync (localStorage ↔ Supabase)
│   └── OrgContext.tsx               # Abteilungs-/Organisationskontext
├── data/
│   ├── prompts.ts                  # 126+ Prompts mit targetDepartment + confidentiality
│   ├── exercises.ts                # 8 Übungen mit departmentVariants
│   ├── dailyChallenges.ts          # 25 Tagesaufgaben (prompt-improve, workflow, spot-the-flaw)
│   ├── flawChallenges.ts           # 10 "Fehler finden" Challenges mit eingebauten Fehlern
│   ├── redactionDrills.ts          # 10 Datenschutz-Übungen (sensible Daten erkennen)
│   ├── orgUseCases.ts              # 25 Use Cases mit Abteilungszuordnung
│   ├── learningPath.ts             # 2 Pflicht + 5 Bonus Onboarding-Module
│   ├── models.ts                   # Modelle + AIRoutingConfig (Standard/Premium/OpenSource)
│   ├── actaExamples.ts             # ACTA-Beispiele pro Abteilung
│   └── decompositionExamples.ts    # Dekompositions-Beispiele
├── hooks/
│   ├── useAuth.ts                  # Auth Hook re-export
│   ├── useChat.ts                  # Chat-State + Streaming + Thinking
│   ├── useConversations.ts         # Conversation-Management (localStorage)
│   ├── useCustomModels.ts          # Custom OpenRouter Modelle
│   ├── useDailyChallenge.ts        # Tagesaufgabe: Auswahl, History, Streak
│   ├── useExerciseEvaluation.ts    # LLM-basierte Prompt-Bewertung
│   ├── useExerciseProgress.ts      # Übungs-Fortschritt
│   ├── useMySkills.ts              # CRUD für persönliche Skills (localStorage)
│   ├── use-mobile.tsx              # Mobile Breakpoint Detection
│   └── use-toast.ts                # Toast Hook
├── integrations/supabase/
│   ├── client.ts                   # Supabase Client Init
│   └── types.ts                    # Generierte DB Types
├── services/
│   └── llmService.ts               # streamChat() SSE Client + onThinking, saveUserKey()
├── lib/
│   ├── utils.ts                    # cn() Tailwind Class Merger
│   ├── promptUtils.ts              # extractVariables() — zentralisiert
│   ├── exportSkill.ts              # Markdown + Agent Skill (ZIP) Export
│   └── storage.ts                  # Zentraler localStorage-Zugriff (Key-Registry im Header)
├── pages/
│   ├── Dashboard.tsx               # Übersicht + DailyChallenge + Analytics (Collapsible)
│   ├── Library.tsx                 # Tabs: Prompts | Use Cases | Meine Skills | Team | Reviews
│   ├── Playground.tsx              # Chat mit Zwei-Stufen KI-Auswahl (eigenes Layout)
│   ├── Onboarding.tsx              # Lernpfad: 2 Pflicht + 5 Bonus Module
│   ├── Settings.tsx                # Tabs: Mein Konto | Allgemein | Rollen | Compliance | KI-Konfiguration | Darstellung
│   ├── Profile.tsx                 # Exportiert ProfileContent (eingebettet in Settings)
│   ├── Login.tsx                   # Email OTP + Guest Code Login
│   ├── AdminParticipants.tsx       # Admin: Kurs-/Teilnehmerverwaltung
│   └── NotFound.tsx                # 404 Seite
├── App.tsx                         # Root: Router + Providers + PlatformLayout
├── main.tsx                        # Entry Point mit ThemeProvider
└── index.css                       # Globale Styles & CSS Variable Design System

supabase/
├── config.toml                     # Supabase Projekt-Konfiguration
├── migrations/                     # SQL Migrations (Schema, RLS, Triggers)
└── functions/                      # Deno Edge Functions
    ├── check-enrollment/           # Validiert Kurscode + Email-Whitelist
    ├── evaluate-prompt/            # LLM-basierte Übungsbewertung (Tool Use)
    ├── guest-login/                # Erstellt Guest Auth User
    ├── llm-proxy/                  # Streaming LLM Proxy (Budget + Key Management)
    ├── save-user-key/              # Verschlüsselt Custom OpenRouter API Keys
    └── auth-email-hook/            # Custom Email-Templates für Supabase Auth
```

## Architecture

### Layout
- **AppShell** (Sidebar + Content) für alle Seiten außer Login und Playground
- **PlatformLayout** wrapper in `App.tsx`: `<AppShell>` + `<GuestBanner>` + children
- **Playground:** Eigenes Layout OHNE AppShell, mit eigenem sticky Top-Bar
- **Sidebar:** 5 Nav-Items: Dashboard, Prompt Library, Prompt-Labor, Onboarding, Einstellungen

### Provider Hierarchy
`QueryClientProvider` → `TooltipProvider` → `BrowserRouter` → `AuthProvider` → `SyncProvider` → `OrgProvider` → Routes

### Abteilungskontext (OrgContext)
- 7 Scopes: `privat`, `organisation`, `legal`, `oeffentlichkeitsarbeit`, `hr`, `it`, `bauverfahren`
- Bestimmt welche Prompts, Beispiele, Use Cases angezeigt werden
- Gespeichert in `localStorage` (`org_scope` key)
- `isDepartment` / `isOrg` computed flags

### KI-Routing (Zwei-Stufen)
- Jeder Prompt hat `confidentiality: "open" | "internal" | "confidential"`
- Playground wählt KI-Stufe (Intern/Extern) automatisch vor
- Vertrauliche Prompts blockieren externe API
- `AIRoutingConfig` in `src/data/models.ts` steuert Routing-Regeln
- Modelle: Standard (Gemini 3 Flash, Sonnet 4.6, GPT-5.2), Premium (Opus 4.6, Gemini 3.1 Pro), Open Source (7 Modelle), Custom

### Prompt Library
- 126+ Prompts in `src/data/prompts.ts`, gefiltert nach Abteilung
- Dynamischer Abteilungs-Tab wenn Abteilung gewählt
- 6 Level: `alltag`, `beruf`, `websuche`, `research`, `blueprint`, `organisation`
- Felder: `category`, `title`, `prompt`, `level`, `type`, `constraints`, `targetDepartment`, `confidentiality`, `riskLevel`, `official`
- `extractVariables()` zentralisiert in `src/lib/promptUtils.ts`

### Meine Skills
- User speichert Prompts als persönliche Skills (localStorage `my_saved_skills`)
- Bearbeiten: Titel, Prompt-Text, Variablen, Notizen, Ziel-Modell
- Export: Markdown (Wiki/Confluence) + Agent Skill ZIP (agentskills.io Format, via JSZip)
- Erreichbar über Library Tab "Meine Skills"

### Daily Challenge
- Tagesaufgabe auf Dashboard mit 3 Typen: `prompt-improve`, `workflow`, `spot-the-flaw`
- Deterministisch nach Datum (gleicher Tag = gleiche Aufgabe)
- Abteilungsfilter aktiv
- Streak-Tracking in localStorage

### Onboarding
- 2 Pflicht-Module: "Einführung & ACTA-Methode" + "Üben: Dein erster guter Prompt"
- 5 Bonus-Module: Prompting-Stufen, Zerlegung, Fortgeschrittene Techniken, Datenschutz, Checklisten
- Erfolgs-Meldung nach Pflicht-Abschluss
- Alte Modul-IDs werden auf neue gemappt (Abwärtskompatibilität)

### Prompt-Labor (Playground)
- Zwei-Stufen KI-Auswahl (Intern/Extern) mit Vertraulichkeits-Routing
- ThinkingBlock: Aufklappbarer Denkprozess (`reasoning_content` aus SSE-Stream)
- Lade-Indikator: Bouncing-Dots zwischen Senden und erstem Token
- IterationNudge: Vorschläge nach erster Antwort
- JudgePanel: Referenz-KI bewertet Output (Sidebar)
- Conversation-Management mit localStorage-Persistenz

### Settings
- 6 Tabs: Mein Konto | Allgemein | Rollen & Rechte | Compliance | KI-Konfiguration | Darstellung
- "Mein Konto" enthält Profil-Funktionalität (importiert `ProfileContent` aus `Profile.tsx`)
- `/profil` redirected auf `/settings`

### Auth System (`AuthContext`)
- **Email OTP:** Kurscode + Email → `check-enrollment` validiert → Supabase sendet OTP → 8-stelliger Code
- **Guest Tokens:** Admin erstellt Tokens → User gibt Code ein → `guest-login` erstellt Auth User + Session
- **Guest Upgrade:** Gast-User können Email via OTP auf der Settings-Seite verknüpfen
- **Admin Role:** Geprüft via `user_roles` Tabelle (separiert von Profilen für Sicherheit)

### Progress Sync (`SyncContext`)
- **Offline-first:** Alle Fortschritte in `localStorage` (`user_progress_v2` key)
- **Cloud Sync:** Bei Login merged Local + Cloud State (Union für Übungen/Lektionen, Max für Quiz-Scores)
- **Tracked:** Exercise Results (Prompt + Score + Feedback), Completed Lessons, Quiz Scores, Challenge Cards
- **Sync Status:** `idle | syncing | synced | error | offline`

### LLM Integration
- **Evaluate Prompt:** `evaluate-prompt` Edge Function nutzt LLM Tool Calling für Scoring
- **Streaming Chat:** `llm-proxy` Edge Function proxied zu OpenRouter oder Lovable AI Gateway (SSE)
- **Key Sources:** Provisioned (Lovable Gateway, $5 Budget/User) oder Custom OpenRouter Key (AES-256-GCM verschlüsselt)
- **Model Selection:** User wählt Modell auf Settings-Seite (Default: `google/gemini-3-flash-preview`)

### Database Schema (Supabase/Postgres)
- `courses` — Kurs-Definitionen (id als Text PK, enrollment_open, max_participants, default_key_budget)
- `enrollment_whitelist` — Email-Allowlist pro Kurs
- `user_profiles` — Display Name, Auth Method, course_id, preferred_model
- `user_roles` — Rollenbasierter Zugang (admin/user Enum)
- `guest_tokens` — Temporäre Gast-Zugangscodes mit Ablauf
- `user_progress` — Synchronisierter Fortschritt (Lessons, Quizzes, Challenges, Werkstatt)
- `user_projects` — User ML Projekt-Daten (Pipeline Config, Models, Evaluation)
- `user_api_keys` — Provisioned Budget + verschlüsselte Custom OpenRouter Keys
- Alle Tabellen haben RLS aktiviert. Admin-Checks nutzen `has_role()` Security Definer Function.

## Design System

Farben als HSL CSS Variables in `src/index.css`:
- **Primary:** Terracotta/Orange (`--primary: 15 55% 52%`)
- **Background:** Warmes Beige (`--background: 48 33% 97%`)
- **Foreground:** Dunkles Braun (`--foreground: 48 20% 20%`)
- **Sidebar:** Dunkles warmes Braun (`--sidebar: 30 15% 18%`)
- **Sidebar Hover:** `bg-primary/8` (Tailwind-Klasse, dezente Aufhellung)
- **Sidebar Active:** `bg-primary/15 text-primary` (Tailwind-Klassen, klar sichtbar)

**Badges — nur 3 Varianten:**
- `bg-primary/10 text-primary` — Standard (z.B. Offen 🟢)
- `bg-amber-50 text-amber-800` / `dark:bg-amber-950 dark:text-amber-400` — Intern 🟡
- `bg-red-50 text-red-700` / `dark:bg-red-950 dark:text-red-400` — Vertraulich 🔴

**Vertraulichkeits-Badges (`ConfidentialityBadge.tsx`):**
- 🟢 Offen (primary/10)
- 🟡 Intern (amber-50)
- 🔴 Vertraulich (red-50)

**Theme Presets:** muted-stone-contrast, muted-moss-light, silber

**Einheitliche Komponenten:**
- `StatCard` — Wiederverwendbar für alle Statistik-Karten
- Card-Stil: `p-5 rounded-xl border border-border shadow-sm`
- Seitentitel: `text-2xl font-bold tracking-tight`
- Seiten-Layout: `<div className="space-y-6">` → Header → Content

## Wichtige Regeln für Claude Code

- **KEINE off-theme Farben** (kein `blue-100`, `emerald-100`, `purple-100`, `cyan-100`). NUR Theme-Farben.
- **Alle Seiten** folgen dem Pattern: `<div className="space-y-6">` → Header → Content
- **Seitentitel** immer: `text-2xl font-bold tracking-tight`
- **Card-Stil** immer: `p-5 rounded-xl border border-border shadow-sm`
- **Keine neuen npm-Dependencies** ohne Absprache
- **Dark Mode** muss immer funktionieren
- **Content ist auf Deutsch** (UI Labels, Prompts, Übungen, Fehlermeldungen)
- **Compliance-Hinweise** in Prompt-Texten (z.B. `[JURIST:IN PRÜFEN]`, `KEINE ECHTEN NAMEN`)
- **Imports:** `@/*` Path Alias (maps to `src/*`)
- **Styling:** Tailwind Utility Classes only (keine separaten CSS-Dateien)
- **State:** Contexts für globalen State (`AuthContext`, `SyncContext`, `OrgContext`), `useState` für lokalen
- **Feedback:** Toast Notifications via Sonner (`toast.success()`, `toast.error()`)
- **Edge Functions:** Deno Runtime, `serve()` from std, Supabase Client, CORS Headers

## Environment Variables

Frontend (in `.env`, prefixed `VITE_`):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `VITE_SUPABASE_PROJECT_ID` — Project ID

Edge function secrets (set in Supabase dashboard):
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — auto-provided
- `LOVABLE_API_KEY` — Lovable AI Gateway key (for provisioned LLM access)
- `ENCRYPTION_KEY` — 256-bit hex key for AES-GCM encryption of custom API keys

## Linting & TypeScript

- ESLint flat config with TypeScript ESLint, react-hooks, and react-refresh plugins
- `@typescript-eslint/no-unused-vars` is disabled
- TypeScript strict mode is off; `noImplicitAny: false`
- Target: ES2020, JSX: react-jsx

## Notes

- Lovable-managed project with `lovable-tagger` plugin active in dev
- `.env` contains only public Supabase anon key (safe to commit)
