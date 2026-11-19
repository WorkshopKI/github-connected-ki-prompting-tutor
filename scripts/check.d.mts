// Typ-Deklarationen für die Test-Oberfläche von check.mjs.

export interface StufenErgebnis {
  name: string;
  code: number;
  ms: number;
  ausgabe: string;
}

export const STUFEN: string[];
export const VORAB: string | null;
export function laufe(name: string, befehl: string, cwd?: string): Promise<StufenErgebnis>;
export function auszugRot(ausgabe: string, max?: number): string[];
export function kurzbericht(ergebnisse: StufenErgebnis[], logDir?: string): string;
