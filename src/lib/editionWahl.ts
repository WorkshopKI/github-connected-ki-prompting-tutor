/* ── Wahl des Auftritts über den Pfad ──
 * Wird in main.tsx als ERSTES importiert: Die Auftrittswahl muss feststehen, bevor App,
 * AppShell und KursLayout geladen werden (sie lesen isKursEdition() beim Import).
 *
 * - /org, /org/<pfad>  → Organisationsversion in diesem Browser merken, weiter auf / bzw. /<pfad>
 * - /org/aus           → Wahl löschen (wieder nach Domain), weiter auf /kurs
 *
 * Gilt je Browser (localStorage), nicht je Gerät oder Konto.
 */
import { LS_KEYS } from "@/lib/constants";
import { ORG_PFAD } from "@/lib/edition";

function waehle() {
  if (typeof window === "undefined") return;
  const { pathname, search, hash } = window.location;
  if (pathname !== ORG_PFAD && !pathname.startsWith(ORG_PFAD + "/")) return;
  const rest = pathname.slice(ORG_PFAD.length).replace(/\/$/, "");
  try {
    if (rest === "/aus") {
      localStorage.removeItem(LS_KEYS.EDITION);
      window.history.replaceState(null, "", "/kurs");
      return;
    }
    localStorage.setItem(LS_KEYS.EDITION, "organisation");
  } catch {
    /* ohne localStorage bleibt es beim Auftritt der Domain */
  }
  window.history.replaceState(null, "", (rest || "/") + search + hash);
}

waehle();
