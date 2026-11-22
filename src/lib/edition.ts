import { LS_KEYS } from "@/lib/constants";

/* ── Auftritt (Edition) ──
 * Eine Codebasis, zwei Auftritte:
 * - "kurs": VHS-/Kursteilnehmende. Startet auf /kurs, ohne Abteilungen und Rollen.
 * - "organisation": die KI-Werkstatt für Organisationen (bisheriges Verhalten).
 *
 * Reihenfolge: VITE_APP_EDITION (Build) → Wahl im Browser (/org, siehe editionWahl.ts) → Hostname → "organisation".
 * So kann derselbe Build unter zwei Domains laufen, oder je Auftritt ein eigener Build.
 * Auf der Kurs-Domain öffnet /org die Organisationsversion (gemerkt im Browser), /org/aus schaltet zurück.
 * Spec: docs/specs/2026-11-22-kurs-auftritt.md
 */
export type Edition = "kurs" | "organisation";

/** Domains, die automatisch den Kurs-Auftritt zeigen.
 *  Hauptdomain (festgelegt 22.11.2026): prompting-studio.kilab.org; auf sie zeigen auch die QR-Codes der Folien.
 *  Der Organisations-Auftritt ist dort über /org erreichbar (siehe editionWahl.ts). */
export const KURS_HAUPTDOMAIN = "prompting-studio.kilab.org";
export const KURS_HOSTS = [
  KURS_HAUPTDOMAIN,
  "prompting-tutor.kilab.org",
  "prompt-tutor.kilab.org",
  "lernen.kilab.org",
];

/** Pfad, der in diesem Browser die Organisationsversion einschaltet; ORG_PFAD + "/aus" schaltet zurück. */
export const ORG_PFAD = "/org";

const istEdition = (x: unknown): x is Edition => x === "kurs" || x === "organisation";

export function getEdition(): Edition {
  const env = import.meta.env.VITE_APP_EDITION as string | undefined;
  if (istEdition(env)) return env;
  try {
    const gewaehlt = typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEYS.EDITION) : null;
    if (istEdition(gewaehlt)) return gewaehlt;
  } catch {
    /* localStorage nicht verfügbar */
  }
  if (typeof window !== "undefined" && KURS_HOSTS.includes(window.location.hostname)) return "kurs";
  return "organisation";
}

export const isKursEdition = () => getEdition() === "kurs";

/** Organisationsversion über /org auf einer Kurs-Domain gewählt? Dann gibt es den Rückweg „Zur Kursversion“. */
export const istOrgAufKursDomain = () =>
  getEdition() === "organisation" && typeof window !== "undefined" && KURS_HOSTS.includes(window.location.hostname);

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
