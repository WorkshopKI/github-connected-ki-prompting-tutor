# CLAUDE.md

## Project Overview

KI Prompting Tutor — an interactive single-page educational web app that teaches effective AI prompting techniques. Users progress through three learning levels: Alltag (Daily), Beruf (Professional), and Forschung (Research). Built with Lovable and deployed as a static site.

## Tech Stack

- **Framework:** React 18 + TypeScript 5
- **Build:** Vite 5 (SWC plugin, dev server on port 8080)
- **Styling:** Tailwind CSS 3 with CSS variables design system in `src/index.css`
- **Components:** shadcn-ui (Radix UI primitives) in `src/components/ui/`
- **Routing:** React Router DOM 6 (single route `/`)
- **State:** Local `useState`, React Query (configured but no API calls yet), next-themes for dark mode
- **Icons:** lucide-react
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner (toast)
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
├── components/          # Feature components (PascalCase files)
│   └── ui/              # shadcn-ui primitives (48 components)
├── pages/
│   ├── Index.tsx         # Main SPA page (all sections)
│   └── NotFound.tsx      # 404 page
├── hooks/               # Custom React hooks
├── lib/utils.ts         # Utility functions (cn() class merger)
├── App.tsx              # Root: Router + QueryClient + providers
├── main.tsx             # Entry point with ThemeProvider
└── index.css            # Global styles & CSS variable design system
```

## Architecture

- **Single Page App:** All content lives on `/` with section-based smooth scrolling (`id` attributes)
- **No backend:** Fully static, no API calls, no database. All data (prompts, exercises) is embedded in components
- **Client-side evaluation:** Exercise feedback uses simple keyword/length heuristics, not ML
- **Three learning levels** with progressive difficulty, each with prompt examples and exercises
- **Key sections:** Hero, Level Cards, ACTA Method, Prompt Library (60+ prompts), Practice Area (6 exercises), Resources, Advanced Techniques

## Coding Conventions

- **Components:** Functional, one per file, PascalCase filenames
- **Props:** Exported as `ComponentNameProps` interfaces
- **Styling:** Tailwind utility classes only (no separate CSS files). HSL color system via CSS variables
- **Imports:** Use `@/*` path alias (maps to `src/*`)
- **State:** Local state with `useState`; no global state manager
- **Feedback:** Toast notifications via Sonner (`toast.success()`, `toast.error()`)
- **Clipboard:** Native `navigator.clipboard` API
- **Responsive:** Mobile-first with `md:` breakpoint
- **Accessibility:** Radix UI primitives provide WCAG support

## Design System

Colors are defined as HSL CSS variables in `src/index.css`. Key tokens:
- `--primary`: Orange (#E07840 range)
- `--background`: Light beige
- `--foreground`: Dark brown
- Custom gradients: `gradient-primary`, `gradient-subtle`, `gradient-card`
- Custom shadows: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-glow`
- Dark mode supported via `next-themes` (class-based toggling)

## Linting & TypeScript

- ESLint flat config with TypeScript ESLint, react-hooks, and react-refresh plugins
- `@typescript-eslint/no-unused-vars` is disabled
- TypeScript strict mode is off; `noImplicitAny: false`
- Target: ES2020, JSX: react-jsx

## Notes

- Lovable-managed project with `lovable-tagger` plugin active in dev
- No data persistence — page reload loses user progress
- Content is in German (UI labels, prompts, exercises)
