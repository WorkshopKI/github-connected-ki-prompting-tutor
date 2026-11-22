-- KI-Budget pro Teilnehmer: 1 € statt 5 $.
-- Gespeichert wird weiter in US-Dollar, weil OpenRouter in USD abrechnet.
-- 1 € = 1,15 $ (Stand 22.11.2026), siehe src/lib/budget.ts.

ALTER TABLE public.courses
  ALTER COLUMN default_key_budget SET DEFAULT 1.15;

ALTER TABLE public.user_api_keys
  ALTER COLUMN provisioned_key_budget SET DEFAULT 1.15;

-- Bestehende Kurse auf das neue Startbudget setzen.
UPDATE public.courses
  SET default_key_budget = 1.15;

-- Bestehende Teilnehmer-Budgets auf höchstens 1 € kappen.
-- Wer schon weniger übrig hat, behält seinen Restbetrag. Admins sind ausgenommen.
UPDATE public.user_api_keys k
  SET provisioned_key_budget = 1.15,
      updated_at = now()
  WHERE k.provisioned_key_budget > 1.15
    AND NOT public.has_role(k.user_id, 'admin');
