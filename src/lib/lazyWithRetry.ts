import { lazy, type ComponentType } from "react";

/* ── Lazy-Import mit Neulade-Schutz ──
 * Nach einem neuen Deploy zeigt ein offener Tab noch auf alte Chunk-Dateien
 * (z. B. FeedbackButton-<hash>.js), die es nicht mehr gibt. Dann schlägt der
 * dynamische Import fehl ("Failed to fetch dynamically imported module").
 * Lösung: einmal pro Sitzung die Seite neu laden, damit die aktuelle Version
 * geladen wird. Ein Flag in sessionStorage verhindert Endlosschleifen.
 */
const RELOAD_FLAG = "chunk_reload_at";
const RELOAD_WINDOW_MS = 10_000;

export function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk .* failed/i.test(msg);
}

/** Lädt die Seite neu, falls nicht gerade erst geschehen. true = Reload ausgelöst. */
export function reloadOnceForStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    /* sessionStorage nicht verfügbar — trotzdem einmal neu laden */
  }
  window.location.reload();
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      if (isChunkLoadError(err) && reloadOnceForStaleChunk()) {
        // Reload läuft — nie auflösen, damit kein Fehlerbildschirm aufblitzt.
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    }
  });
}
