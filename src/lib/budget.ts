/**
 * KI-Budget pro Teilnehmer.
 *
 * OpenRouter rechnet in US-Dollar ab, deshalb speichern Datenbank und
 * llm-proxy das Budget in US-Dollar. Angezeigt und eingegeben wird in Euro.
 * Der Kurs ist fest hinterlegt (Stand 22.11.2026: 1 € = 1,15 $). Bei einer
 * Änderung auch DEFAULT_BUDGET_USD im llm-proxy und die DB-Defaults anpassen.
 */
export const USD_PRO_EUR = 1.15;

/** Startbudget pro Teilnehmer in Euro. */
export const KURS_BUDGET_EUR = 1;

/** Startbudget in US-Dollar, so wie es in der Datenbank steht. */
export const KURS_BUDGET_USD = Math.round(KURS_BUDGET_EUR * USD_PRO_EUR * 100) / 100;

/** Kleinstes Budget, das ein Admin setzen kann, in Euro. */
export const MIN_BUDGET_EUR = 0.5;

export const usdZuEur = (usd: number) => usd / USD_PRO_EUR;
export const eurZuUsd = (eur: number) => Math.round(eur * USD_PRO_EUR * 10000) / 10000;

/** Formatiert einen US-Dollar-Betrag aus der Datenbank als Euro, z. B. „0,87 €“. */
export function formatEuro(usd: number, stellen = 2): string {
  return (
    usdZuEur(usd).toLocaleString("de-DE", {
      minimumFractionDigits: stellen,
      maximumFractionDigits: stellen,
    }) + " €"
  );
}
