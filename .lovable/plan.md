

## Plan: App-Name in E-Mail-Templates aktualisieren

Drei Stellen müssen angepasst werden:

### 1. `supabase/functions/auth-email-hook/index.ts`
- Zeile 20: `'Einladung zum KI Prompting Kurs'` → `'Einladung zum Workshop KI - Prompting Tutor'`
- Zeile 38: `SITE_NAME = "Github connected KI Prompting Tutor"` → `SITE_NAME = "Workshop KI - Prompting Tutor"`

### 2. `supabase/functions/_shared/email-templates/signup.tsx`
- Zeile 33: `Willkommen beim KI Prompting Kurs!` → `Willkommen beim Workshop KI - Prompting Tutor!`

### 3. Edge Function neu deployen
- `auth-email-hook` deployen, damit die Änderungen live gehen

