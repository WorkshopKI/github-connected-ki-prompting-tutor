/* ── Auftritt (Edition) ──
 * Eine Codebasis, zwei Auftritte:
 * - "kurs": VHS-/Kursteilnehmende. Startet auf /kurs, ohne Abteilungen und Rollen.
 * - "organisation": die KI-Werkstatt für Organisationen (bisheriges Verhalten).
 *
 * Reihenfolge: VITE_APP_EDITION (Build) → Hostname → "organisation".
 * So kann derselbe Build unter zwei Domains laufen, oder je Auftritt ein eigener Build.
 * Spec: docs/specs/2026-11-22-kurs-auftritt.md
 */
export type Edition = "kurs" | "organisation";

/** Domains, die automatisch den Kurs-Auftritt zeigen. */
export const KURS_HOSTS = [
  "prompting-tutor.kilab.org",
  "prompt-tutor.kilab.org",
  "lernen.kilab.org",
];

export function getEdition(): Edition {
  const env = import.meta.env.VITE_APP_EDITION as string | undefined;
  if (env === "kurs" || env === "organisation") return env;
  if (typeof window !== "undefined" && KURS_HOSTS.includes(window.location.hostname)) return "kurs";
  return "organisation";
}

export const isKursEdition = () => getEdition() === "kurs";

/** Öffentliche Bereiche ohne Login und ohne Moduswahl. */
export const PUBLIC_PREFIXES = ["/kurs", "/erklaert", "/live", "/f"];
export const isPublicPath = (pathname: string) =>
  PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

/** Alte Adressen von prompt-tutor.kilab.org und prompting-tutor.kilab.org → neue Kursseiten.
 *  Greift, sobald die alten Domains auf diese App zeigen. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/bibliothek": "/kurs/vorlagen",
  "/ressourcen": "/kurs/vorlagen",
  "/lernen/alltagshelfer": "/kurs/vorlagen?stufe=alltag",
  "/lernen/junior": "/kurs/vorlagen?stufe=beruf",
  "/lernen/forschung": "/kurs/vorlagen?stufe=forschung",
  "/advanced": "/kurs/profi",
  "/acta": "/kurs/fragen-mit-acta",
  "/ueben": "/onboarding",
};
