/* ── Zentraler localStorage-Zugriff ──
 * Ersetzt die über 10+ Dateien verstreuten try/catch + JSON.parse/stringify Pattern.
 */

/** Wert aus localStorage laden mit Fallback auf defaults. */
export function loadFromStorage<T>(key: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) } as T;
  } catch {
    return defaults;
  }
}

/** JSON-Array oder primitiven Wert aus localStorage laden. */
export function loadArrayFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Wert in localStorage speichern. */
export function saveToStorage(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Schlüssel aus localStorage entfernen. */
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}

/** Einfachen String-Wert laden (ohne JSON). */
export function loadStringFromStorage(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
