#!/usr/bin/env node
/**
 * PreToolUse-Hook für Bash/PowerShell in Claude Code — deterministische
 * Leitplanke für vier Regeln; die ersten drei stehen als Prosa in CLAUDE.md
 * und wurden dort regelmäßig gebrochen:
 *
 *   1. Shell-Konvention 1: keine Heredocs / Here-Strings (Windows-Shell).
 *   2. Parallele Sessions: `git add` nur mit Pathspec, nie `-A`/`.`/`-u`.
 *   3. Verwerfende Git-Operationen führt der Nutzer selbst im Terminal aus.
 *   4. Rekursives Löschen nur relativ im Projekt oder im Claude-Temp-Ordner —
 *      unter Windows haben Pfad-Aliase (`/c/…` gegen `C:\…`, leere Variable,
 *      `~`) schon ganze Laufwerke geleert.
 *
 * Aufruf durch Claude Code (`.claude/settings.json`): das Tool-Input kommt als
 * JSON auf stdin; Exit 2 + Grund auf stderr blockt den Aufruf, Exit 0 lässt ihn
 * durch. Parse-Fehler → Exit 0 (fail-open): ein kaputter Hook darf die Session
 * nicht lahmlegen. Kein Bypass-Marker — Determinismus ist der Zweck.
 *
 * Die Regeln leben in `pruefeBefehl()` (pur); `main()` ist nur die stdin-Hülle.
 * Ohne `.sh` im Dateinamen, damit die Windows-Autoerkennung von Claude Code
 * nichts voranstellt.
 *
 * Aus dem Baukasten (Ursprung ZAH), dort getestet in werkzeug/bash-guard.test.mjs.
 * Nicht in der App ändern: `baukasten sync` meldet das als „von Hand geändert".
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Ein Shell-Segment endet an `|`, `;`, `&` oder Zeilenende — so trifft
// `git status && git add -A` das zweite Segment, nicht das erste.
const SEG = String.raw`[^|;&\r\n]*?`;

const REGELN = [
  {
    name: 'heredoc',
    muster: /<<-?\s*['"]?[A-Za-z_]|<<<\s*\S/,
    grund:
      'Shell-Konvention 1 (CLAUDE.md): keine Heredocs/Here-Strings — den mehrzeiligen Inhalt mit dem Write-Tool in eine Datei schreiben und die Datei verwenden (Commit-Message: sitzungseigene Datei, z. B. .git/COMMIT_MSG-<sitzung>.tmp, dann git commit -F <datei>).',
  },
  {
    name: 'here-string-powershell',
    muster: /@["']\s*(\r?\n|$)/,
    grund:
      'Shell-Konvention 1 (CLAUDE.md): keine PowerShell-Here-Strings (@"…"@) — den Inhalt mit dem Write-Tool in eine Datei schreiben und die Datei verwenden.',
  },
  {
    name: 'git-add-ohne-pathspec',
    muster: new RegExp(String.raw`\bgit\b${SEG}\badd\b${SEG}(\s(-A|--all|-u|--update)(\s|$)|\s\.(\s|$))`),
    grund:
      'Parallele Sessions (CLAUDE.md): nur eigene Dateien per Pathspec stagen — `git status --short` ansehen, dann `git add <datei> …`; nie -A, --all, -u oder ".".',
  },
  {
    name: 'git-verwerfend',
    muster: new RegExp(
      String.raw`\bgit\b${SEG}\b(` +
        String.raw`push\b${SEG}\s(--force|-f)(\s|$)` +
        String.raw`|reset\s+--hard` +
        String.raw`|checkout\s+--\s+\.(\s|$)` +
        String.raw`|restore\s+(--staged\s+)?\.(\s|$)` +
        String.raw`|clean\s+-[a-zA-Z]*f` +
        String.raw`|stash\s+(drop|clear)` +
        String.raw`)`,
    ),
    grund:
      'Verwerfende Git-Operation (force-push, reset --hard, checkout/restore ".", clean -f, stash drop): der Nutzer führt sie selbst im Terminal aus. Erlaubt bleibt --force-with-lease.',
  },
  {
    name: 'loeschen-ausserhalb',
    pruefe: befehl => loeschtRiskant(befehl),
    grund:
      'Rekursives Löschen mit absolutem Pfad, ~, Variable, "..", "." oder "*" oder mit Ziel aus Pipe/xargs: Windows-Pfad-Aliase haben so schon ganze Laufwerke geleert. Ziel als relativen Pfad im Projekt schreiben (Scratchpad unter …\\Temp\\claude\\… geht absolut); alles andere löscht der Nutzer selbst.',
  },
];

// rm (bash) sowie Remove-Item und seine Aliase (PowerShell), rd/rmdir/del/erase (cmd).
const LOESCH_BEFEHLE = new Set(['rm', 'remove-item', 'ri', 'rd', 'rmdir', 'del', 'erase']);
const CMD_BEFEHLE = new Set(['rd', 'rmdir', 'del', 'erase']);
// Nach diesen Schaltern ist das nächste Token selbst ein Shell-Kommando.
const INNERE_SHELL = new Set(['-c', '-lc', '/c', '/k', '-command']);
const CLAUDE_TEMP = /[\\/]temp[\\/]claude[\\/][^\\/]+/i;

/** Wörter eines Segments; angrenzende Quote-Teile (`"$D"/x`) bleiben ein Wort, Quotes fallen weg. */
function woerter(segment) {
  return (segment.match(/(?:"[^"]*"|'[^']*'|[^\s"']+)+/g) ?? []).map(w => w.replace(/["']/g, ''));
}

function istRekursivSchalter(wort, cmdStil) {
  if (/^--?rec/i.test(wort)) return true; // --recursive, -Recurse
  if (cmdStil && /^\/s$/i.test(wort)) return true;
  // rm-Bündel wie -r, -rf, -Rf; -Force ist länger und zählt nicht.
  return /^-[a-zA-Z]{1,4}$/.test(wort) && /r/i.test(wort);
}

function zielRiskant(ziel) {
  if (ziel === '' || /[$%`]/.test(ziel) || ziel.startsWith('~')) return true;
  if (/(^|[\\/])\.\.([\\/]|$)/.test(ziel)) return true;
  if (/^(\.[\\/]?|\*.*|\.[\\/]\*)$/.test(ziel)) return true;
  const absolut = /^[\\/]/.test(ziel) || /^[a-zA-Z]:/.test(ziel);
  return absolut && !CLAUDE_TEMP.test(ziel) && !/^\/tmp\/./.test(ziel);
}

/**
 * Ob ein Kommando rekursiv löscht und ein Ziel außerhalb des Projekts treffen kann.
 * Bewusst grob: einzelne Dateien (`rm -f`) und Löschen aus Skripten prüft der Hook nicht.
 */
function loeschtRiskant(befehl) {
  const ohneUmleitung = befehl
    .replace(/\d*>&\d+/g, ' ')
    .replace(/\d*>>?\s*\S+/g, ' ')
    .replace(/<\s*\S+/g, ' ');
  for (const segment of ohneUmleitung.split(/&&|\|\||[|;&\r\n]/)) {
    const w = woerter(segment);
    for (let i = 0; i < w.length; i++) {
      if (INNERE_SHELL.has(w[i].toLowerCase()) && i + 1 < w.length && loeschtRiskant(w[i + 1])) return true;
      const name = w[i].split(/[\\/]/).pop().toLowerCase();
      if (!LOESCH_BEFEHLE.has(name) || w[i - 1] === 'git') continue;
      const cmdStil = CMD_BEFEHLE.has(name);
      const rest = w.slice(i + 1);
      if (!rest.some(x => istRekursivSchalter(x, cmdStil))) continue;
      const ziele = rest.filter(x => !x.startsWith('-') && !(cmdStil && /^\/[a-zA-Z]$/.test(x)));
      const ausPipe = w.slice(0, i).includes('xargs');
      if (ausPipe || ziele.length === 0 || ziele.some(zielRiskant)) return true;
    }
  }
  return false;
}

/**
 * Prüft ein Shell-Kommando gegen die Regeln.
 * @param {string | undefined} befehl
 * @returns {string | null} Grund der Blockade oder null (durchlassen).
 */
export function pruefeBefehl(befehl) {
  if (typeof befehl !== 'string' || befehl.trim() === '') return null;
  for (const regel of REGELN) {
    const trifft = regel.muster ? regel.muster.test(befehl) : regel.pruefe(befehl);
    if (trifft) return `[bash-guard:${regel.name}] ${regel.grund}`;
  }
  return null;
}

function main() {
  let eingabe;
  try {
    eingabe = JSON.parse(readFileSync(0, 'utf8'));
  } catch (e) {
    process.stderr.write(`[bash-guard] stdin nicht lesbar/parsebar, lasse durch: ${e?.message ?? e}\n`);
    process.exit(0);
  }
  const befehl = eingabe?.tool_input?.command;
  const grund = pruefeBefehl(befehl);
  if (grund === null) process.exit(0);
  process.stderr.write(`${grund}\n`);
  process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
