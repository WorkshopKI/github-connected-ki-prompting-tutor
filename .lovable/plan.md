

## Plan: Modell-Auswahl, API-Key/Budget auf Profilseite, KI-Bewertung testen

### 1. Datenbank-Migration

Neue Spalte `preferred_model` in `user_profiles`:

```sql
ALTER TABLE user_profiles
  ADD COLUMN preferred_model text DEFAULT 'google/gemini-3-flash-preview';
```

### 2. AuthContext erweitern

`src/contexts/AuthContext.tsx`: `preferred_model` in das `UserProfile`-Interface und den `loadProfile`-Query aufnehmen.

### 3. Profilseite erweitern (`src/pages/Profile.tsx`)

Zwei neue Cards:

**Card "KI-Einstellungen"** mit Select-Dropdown fuer das Modell:
- anthropic/claude-sonnet-4.6
- openai/gpt-5.2
- google/gemini-3-flash-preview (Default)
- anthropic/claude-opus-4.6
- google/gemini-3.1-pro-preview

Speichern direkt in `user_profiles.preferred_model`.

**Card "KI-Budget"** mit:
- Budget-Anzeige aus `user_api_keys` (Fortschrittsbalken von 5.00 USD)
- Badge "Eigener Key aktiv" wenn `custom_key_active`
- Accordion zum Hinterlegen eines eigenen OpenRouter-Keys (gleiche Logik wie `BudgetDialog`)

### 4. ExerciseCard anpassen (`src/components/ExerciseCard.tsx`)

Das bevorzugte Modell aus dem AuthContext lesen und als `model`-Parameter an `evaluate-prompt` senden.

### 5. Edge Function anpassen (`supabase/functions/evaluate-prompt/index.ts`)

`model`-Parameter aus dem Request-Body akzeptieren und an den AI-Gateway weiterleiten (Fallback auf `google/gemini-3-flash-preview`).

### 6. End-to-End Test

Nach Implementierung die KI-Bewertung testen: Uebung auswaehlen, Prompt schreiben, bewerten lassen, pruefen ob Feedback und Modellauswahl funktionieren.

