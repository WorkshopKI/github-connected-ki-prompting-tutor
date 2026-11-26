#!/usr/bin/env node
/**
 * `npm run check` — die Gate-Stufen parallel, die Ausgabe kurz.
 *
 * Aus dem Baukasten (Ursprung ZAH). Die Stufen sind unabhängig und laufen
 * deshalb gleichzeitig, jede mit dem Befehl aus package.json (eine Quelle),
 * Ausgabe gepuffert:
 * - je Stufe eine Zeile mit Dauer; bei Rot ein Auszug mit den Ursachen
 *   (Testdatei > Testname, Typfehler-Stelle, Lint-Fehler, Zyklus);
 * - volles Protokoll je Stufe unter node_modules/.cache/check/;
 * - Exit-Code 1, sobald eine Stufe rot ist.
 *
 * Nie mit `| tail` kürzen: In ZAH gingen so Exit-Code und Testname verloren
 * (36–38 % der roten Läufe ohne erkennbare Ursache). Welche Stufen eine App
 * hat, steht im lokalen Block unten. Tests: src/__tests__/check-skript.test.ts.
 * Rein Node-Stdlib.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOG_DIR = join(ROOT, 'node_modules', '.cache', 'check');
// lokal:stufen
/**
 * Gate-Stufen: Namen von Skripten in package.json. `typecheck` und `lint` seit
 * 22.11.2026 grün und im Gate (lint: 0 Fehler, Warnungen bleiben erlaubt).
 * Einen Test-Runner hat die App nicht.
 */
export const STUFEN = ['build', 'typecheck', 'lint'];
/** Skript, das vor den Stufen allein läuft (z. B. ein erzeugtes Modul), oder null. */
export const VORAB = null;
// /lokal:stufen
const AUSZUG_ZEILEN = 40;
const MS_PRO_SEKUNDE = 1000;

/** Führt einen Shell-Befehl aus, puffert stdout+stderr, misst die Dauer. */
export function laufe(name, befehl, cwd = ROOT) {
  return new Promise(fertig => {
    const start = Date.now();
    const kind = spawn(befehl, { cwd, shell: true, env: process.env });
    let ausgabe = '';
    kind.stdout.on('data', d => { ausgabe += d; });
    kind.stderr.on('data', d => { ausgabe += d; });
    kind.on('error', fehler => {
      fertig({ name, code: 1, ms: Date.now() - start, ausgabe: `${ausgabe}\n${fehler.message}` });
    });
    kind.on('close', code => {
      fertig({ name, code: code ?? 1, ms: Date.now() - start, ausgabe });
    });
  });
}

const OHNE_FARBE = /\u001b\[[0-9;]*m/g;

/** Die Zeilen einer roten Ausgabe, die die Ursache nennen — höchstens `max`. */
export function auszugRot(ausgabe, max = AUSZUG_ZEILEN) {
  const zeilen = ausgabe.replace(OHNE_FARBE, '').split(/\r?\n/);
  const treffer = zeilen.filter(z =>
    /^\s*(FAIL|×|✗)\s|error TS\d+|AssertionError|^\s*(Expected|Received)\b|^\s*[-+] |\d+:\d+\s+error\s|✖ \d+ problems?|❌|^\s+Beteiligt|^\s+→/.test(z),
  );
  const schluss = zeilen.filter(z => /^\s*(Test Files|Tests)\s+\d/.test(z));
  const gewaehlt = (treffer.length > 0 ? treffer : zeilen.filter(z => z.trim() !== '').slice(-max)).slice(0, max);
  const rest = treffer.length - gewaehlt.length;
  return [...gewaehlt, ...(rest > 0 ? [`… ${rest} weitere Zeilen im Protokoll`] : []), ...schluss];
}

function sekunden(ms) {
  return `${(ms / MS_PRO_SEKUNDE).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
}

/** Kurzbericht: eine Zeile je Stufe, bei Rot der Auszug, am Ende der Protokollpfad. */
export function kurzbericht(ergebnisse, logDir = LOG_DIR) {
  const o = [];
  for (const e of ergebnisse) o.push(`${e.code === 0 ? '✓' : '✗'} ${e.name.padEnd(10)} ${sekunden(e.ms)}`);
  for (const e of ergebnisse.filter(x => x.code !== 0)) {
    o.push('', `── ${e.name} rot (Exit ${e.code}) ──`, ...auszugRot(e.ausgabe));
  }
  const rot = ergebnisse.filter(x => x.code !== 0).map(x => x.name);
  o.push('', rot.length === 0 ? 'check grün.' : `check ROT: ${rot.join(', ')}.`, `Volle Protokolle: ${logDir}`);
  return o.join('\n');
}

async function main() {
  const skripte = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).scripts;
  mkdirSync(LOG_DIR, { recursive: true });

  if (VORAB) {
    const vorab = await laufe(VORAB, skripte[VORAB]);
    writeFileSync(join(LOG_DIR, `${VORAB}.log`), vorab.ausgabe);
    if (vorab.code !== 0) {
      console.log(kurzbericht([vorab]));
      process.exit(1);
    }
  }

  const ergebnisse = await Promise.all(STUFEN.map(s => laufe(s, skripte[s])));
  for (const e of ergebnisse) writeFileSync(join(LOG_DIR, `${e.name}.log`), e.ausgabe);
  console.log(kurzbericht(ergebnisse));
  process.exit(ergebnisse.some(e => e.code !== 0) ? 1 : 0);
}

// Nur ausführen, wenn direkt gestartet (nicht beim Import in Tests).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
