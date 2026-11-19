# Begriffe

Ein Begriff je Zeile: Bedeutung in einem Satz · nicht sagen · Quelle. Der Skill `grillen` trägt geklärte Begriffe hier ein; Widersprüche zum Code werden benannt, nicht stillschweigend übernommen.

| Begriff | Bedeutung | Nicht sagen | Quelle |
|---|---|---|---|
| Vertraulichkeit | Stufe eines Prompts: `open`, `internal` oder `confidential`; `confidential` blockt die externe API. | Geheimhaltung, Schutzstufe | `src/data/models.ts`, CLAUDE.md „KI-Routing" |
| Abteilungskontext | Gewählter Scope aus `OrgContext` (`privat`, `organisation` oder eine von fünf Abteilungen); filtert Prompts, Beispiele und Use Cases. | Mandant, Tenant | `src/contexts/OrgContext.tsx` |
| ACTA | Methode zum Aufbau eines Prompts, im Onboarding gelehrt. | — | `src/components/ACTASection.tsx` |
