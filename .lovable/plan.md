

# Code-Refactoring Plan

## Analyse — Identifizierte Probleme

### 1. Doppelte `Msg`-Typ-Exporte
`llmService.ts` re-exportiert `Msg` aus `@/types`, und zwei Playground-Komponenten importieren `Msg` von `@/services/llmService` statt direkt aus `@/types`. Das verwirrt Lovable bei zukünftigen Änderungen.

**Fix:** `export type { Msg }` aus `llmService.ts` entfernen. Imports in `ChatPlayground.tsx` und `PlaygroundContent.tsx` auf `@/types` umstellen.

### 2. Duplizierte Funktionen: `copyLastResponse` und `exportAsMarkdown`
Beide Funktionen existieren identisch in `ChatPlayground.tsx` UND `PlaygroundContent.tsx`. Da `PlaygroundContent` den `ChatPlayground` mit `hideToolbar` rendert, wird die ChatPlayground-Version nie genutzt.

**Fix:** `copyLastResponse` und `exportAsMarkdown` aus `ChatPlayground.tsx` entfernen (dort wird `hideToolbar` immer gesetzt). Die Toolbar-Logik in `ChatPlayground` kann ebenfalls entfernt werden, da sie nie sichtbar ist.

### 3. `evaluationService.ts` umgeht den Proxy
`evaluationService.ts` ruft die LLM-API direkt auf und nutzt nur den API-Key-Modus — kein Proxy-Fallback. Das funktioniert nicht für Workshop-User ohne eigenen Key.

**Fix:** `evaluationService.ts` refactoren, um den `complete()`-Service aus `completionService.ts` zu nutzen, der bereits beide Pfade (Direct + Proxy) unterstützt.

### 4. Dupliziertes SSE-Parsing
`llmService.ts` und `completionService.ts` enthalten nahezu identischen SSE-Parsing-Code (~20 Zeilen). Änderungen müssen an zwei Stellen gemacht werden.

**Fix:** SSE-Parsing in eine gemeinsame Hilfsfunktion `parseSSEStream()` in einer neuen Datei `src/services/sseParser.ts` extrahieren. Beide Services nutzen diese Funktion.

### 5. Duplizierte Auth+Fetch-Logik
Sowohl `llmService.ts` als auch `completionService.ts` haben den gleichen Proxy-Auth-Flow (Session holen, Headers setzen, Error-Handling). 

**Fix:** Gemeinsame `fetchWithAuth()` Hilfsfunktion in `src/services/apiKeyService.ts` hinzufügen, die beide Services nutzen können.

### 6. `PlaygroundContent.tsx` ist zu groß (492 Zeilen)
Die Datei enthält DOCX-Export-Logik (~50 Zeilen XML-Templates), Toolbar, Controls und Chat — alles in einer Komponente.

**Fix:** DOCX-Export-Funktion in `src/lib/exportChat.ts` extrahieren. Toolbar als eigene `PlaygroundToolbar.tsx` Komponente. KI-Controls-Bar als `PlaygroundControlsBar.tsx`.

### 7. `Playground.tsx` hat zu viele State-Variablen
Die Page-Komponente verwaltet ~15 State-Variablen direkt. Das macht es fehleranfällig bei Erweiterungen.

**Fix:** Kein sofortiges Refactoring nötig — die bestehenden Custom Hooks (`useChat`, `useConversations`) sind gut strukturiert. Aber die AI-Routing-Logik (Model, Tier, Confidentiality) könnte in einen `usePlaygroundSettings` Hook extrahiert werden.

---

## Priorisierter Umsetzungsplan

| # | Aufgabe | Risiko | Dateien |
|---|---------|--------|---------|
| 1 | `Msg`-Import vereinheitlichen | Niedrig | 3 Dateien |
| 2 | Tote Toolbar + duplizierte Funktionen aus `ChatPlayground` entfernen | Niedrig | 1 Datei |
| 3 | SSE-Parser extrahieren | Mittel | 3 Dateien (neu: `sseParser.ts`) |
| 4 | `evaluationService` auf `complete()` umstellen | Mittel | 1 Datei |
| 5 | DOCX-Export extrahieren | Niedrig | 2 Dateien (neu: `exportChat.ts`) |
| 6 | AI-Routing-Hook extrahieren | Mittel | 2 Dateien (neu: `usePlaygroundSettings.ts`) |

Insgesamt werden ca. 150 Zeilen duplizierten Code entfernt und 3 neue, fokussierte Module erstellt.

