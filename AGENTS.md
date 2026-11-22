# AGENTS.md

- Lazy-load pages and components with `lazyWithRetry` from `src/lib/lazyWithRetry.ts`, never plain `React.lazy` — after a redeploy, open tabs request outdated chunk files and would otherwise show a blank screen instead of reloading once.
