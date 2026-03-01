# CLAUDE.md

## Project Overview

KI Prompting Tutor — an interactive educational web app that teaches effective AI prompting techniques. Users progress through three learning levels: Alltag (Daily), Beruf (Professional), and Forschung (Research). Built with Lovable, backed by Supabase for auth, progress sync, and LLM proxy.

## Tech Stack

- **Framework:** React 18 + TypeScript 5
- **Build:** Vite 5 (SWC plugin, dev server on port 8080)
- **Styling:** Tailwind CSS 3 with CSS variables design system in `src/index.css`
- **Components:** shadcn-ui (Radix UI primitives) in `src/components/ui/`
- **Routing:** React Router DOM 6 (multi-route: `/`, `/login`, `/profil`, `/admin/teilnehmer`)
- **State:** React Context (`AuthContext`, `SyncContext`), local `useState`, React Query
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
├── components/              # Feature components (PascalCase files)
│   ├── ui/                  # shadcn-ui primitives (48 components)
│   ├── Navigation.tsx       # Top nav with auth-aware UserMenu
│   ├── GuestBanner.tsx      # Banner prompting guest users to register
│   ├── UserMenu.tsx         # Dropdown with profile/admin/logout links
│   ├── SyncStatusIcon.tsx   # Cloud sync indicator
│   ├── BudgetDialog.tsx     # LLM budget info dialog
│   ├── ExerciseCard.tsx     # Practice exercise with LLM evaluation
│   └── PracticeArea.tsx     # Exercise grid container
├── contexts/
│   ├── AuthContext.tsx       # Auth state, OTP login, guest login, session
│   └── SyncContext.tsx       # Progress sync (localStorage ↔ Supabase)
├── hooks/
│   ├── useAuth.ts            # Auth hook re-export
│   └── useExerciseProgress.ts
├── integrations/supabase/
│   ├── client.ts             # Supabase client init
│   └── types.ts              # Generated DB types
├── services/
│   └── llmService.ts         # streamChat() SSE client, saveUserKey()
├── pages/
│   ├── Index.tsx              # Main landing page (all content sections)
│   ├── Login.tsx              # Email OTP + Guest code login
│   ├── Profile.tsx            # User profile, model selection, API key, budget
│   ├── AdminParticipants.tsx  # Admin: course/participant management
│   └── NotFound.tsx           # 404 page
├── lib/utils.ts              # Utility functions (cn() class merger)
├── App.tsx                   # Root: Router + providers (Auth → Sync → Routes)
├── main.tsx                  # Entry point with ThemeProvider
└── index.css                 # Global styles & CSS variable design system

supabase/
├── config.toml               # Supabase project config
├── migrations/                # SQL migrations (schema, RLS, triggers)
└── functions/                 # Deno edge functions
    ├── check-enrollment/      # Validates course code + email whitelist
    ├── evaluate-prompt/       # LLM-based exercise evaluation (tool use)
    ├── guest-login/           # Creates guest auth user from token
    ├── llm-proxy/             # Streaming LLM proxy (budget + key management)
    ├── save-user-key/         # Encrypts & stores custom OpenRouter API key
    └── auth-email-hook/       # Custom email templates for Supabase Auth
```

## Architecture

### Frontend
- **Multi-page SPA:** Main content on `/` with section-based smooth scrolling, plus `/login`, `/profil`, `/admin/teilnehmer`
- **Provider hierarchy:** `QueryClientProvider` → `AuthProvider` → `SyncProvider` → Routes
- **Three learning levels** with progressive difficulty, each with prompt examples and exercises
- **Key sections:** Hero, Level Cards, ACTA Method, Prompt Library (70+ prompts), Practice Area (6 exercises), Resources, Advanced Techniques

### Auth System (`AuthContext`)
- **Email OTP:** User enters course code + email → `check-enrollment` validates → Supabase sends OTP → user verifies 8-digit code
- **Guest tokens:** Admin creates tokens → user enters code → `guest-login` creates auth user + session
- **Guest upgrade:** Guest users can link an email via OTP on the Profile page
- **Admin role:** Checked via `user_roles` table (separate from profiles for security)

### Progress Sync (`SyncContext`)
- **Offline-first:** All progress stored in `localStorage` (`user_progress_v2` key)
- **Cloud sync:** On login, merges local + cloud state (union for exercises/lessons, max for quiz scores), pushes merged result back
- **Tracked data:** Exercise results (prompt + score + feedback), completed lessons, quiz scores, challenge cards
- **Sync status:** Exposed as `idle | syncing | synced | error | offline`

### LLM Integration
- **Evaluate prompt:** `evaluate-prompt` edge function uses LLM tool calling to score user prompts on context/specificity/constraints
- **Streaming chat:** `llm-proxy` edge function proxies to OpenRouter or Lovable AI Gateway with SSE streaming
- **Key sources:** Provisioned (Lovable gateway with $5 budget per user) or custom OpenRouter key (AES-256-GCM encrypted)
- **Model selection:** User picks model on Profile page (default: `google/gemini-3-flash-preview`)

### Database Schema (Supabase/Postgres)
- `courses` — course definitions (id as text PK, enrollment_open, max_participants, default_key_budget)
- `enrollment_whitelist` — email allowlist per course
- `user_profiles` — display name, auth method, course_id, preferred_model
- `user_roles` — role-based access (admin/user enum)
- `guest_tokens` — temporary guest access codes with expiry
- `user_progress` — synced progress (lessons, quizzes, challenges, werkstatt)
- `user_projects` — user ML project data (pipeline config, models, evaluation)
- `user_api_keys` — provisioned budget + encrypted custom OpenRouter keys
- All tables have RLS enabled. Admin checks use `has_role()` security definer function to avoid recursion.

## Coding Conventions

- **Components:** Functional, one per file, PascalCase filenames
- **Props:** Exported as `ComponentNameProps` interfaces
- **Styling:** Tailwind utility classes only (no separate CSS files). HSL color system via CSS variables
- **Imports:** Use `@/*` path alias (maps to `src/*`)
- **State:** Contexts for global state (`AuthContext`, `SyncContext`), `useState` for local
- **Feedback:** Toast notifications via Sonner (`toast.success()`, `toast.error()`)
- **Clipboard:** Native `navigator.clipboard` API
- **Responsive:** Mobile-first with `md:` breakpoint
- **Accessibility:** Radix UI primitives provide WCAG support
- **Edge Functions:** Deno runtime, `serve()` from std, Supabase client for DB/auth, CORS headers on all responses

## Design System

Colors are defined as HSL CSS variables in `src/index.css`. Key tokens:
- `--primary`: Orange (#E07840 range)
- `--background`: Light beige
- `--foreground`: Dark brown
- Custom gradients: `gradient-primary`, `gradient-subtle`, `gradient-card`
- Custom shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-glow`
- Dark mode supported via `next-themes` (class-based toggling)

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
- Content is in German (UI labels, prompts, exercises, error messages)
- `.env` contains only public Supabase anon key (safe to commit)
