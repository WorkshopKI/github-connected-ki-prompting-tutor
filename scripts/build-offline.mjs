/* Baut „KI erklärt“ als eigenständige HTML-Dateien für die Offline-Nutzung im Kurs.
 * Ergebnis in dist-offline/: KI-erklaert.html (Übersicht) und je Animation eine Datei,
 * die direkt mit dieser Animation startet. Schriften (OFL) werden eingebettet.
 * Aufruf: npm run build:offline
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
execSync("npx vite build --config vite.offline.config.ts", { stdio: "inherit" });

const build = join(root, "dist-offline/build");
const html = readFileSync(join(build, "offline/erklaert.html"), "utf8");
const assets = join(build, "assets");
const datei = (re) => readdirSync(assets).find((f) => re.test(f));
const js = readFileSync(join(assets, datei(/\.js$/)), "utf8");
const css = readFileSync(join(assets, datei(/\.css$/)), "utf8").replace(/@import url\([^)]*fonts\.googleapis[^)]*\);?/g, "");

const fonts = [
  ["Source Sans 3", 400, "source-sans-3-latin-400-normal.woff2"],
  ["Source Sans 3", 600, "source-sans-3-latin-600-normal.woff2"],
  ["Source Serif 4", 600, "source-serif-4-latin-600-normal.woff2"],
  ["Source Code Pro", 400, "source-code-pro-latin-400-normal.woff2"],
  ["Source Code Pro", 500, "source-code-pro-latin-500-normal.woff2"],
]
  .map(([fam, w, f]) => {
    const b64 = readFileSync(join(root, "offline/fonts", f)).toString("base64");
    return `@font-face{font-family:"${fam}";font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
  })
  .join("");

// Inline-Skripte dürfen kein "</script" enthalten
const jsSicher = js.replace(/<\/script/gi, "<\\/script");
const basis = html
  .replace(/<script type="module" crossorigin src="[^"]+"><\/script>/, "")
  .replace(/<link rel="stylesheet" crossorigin href="[^"]+">/, "")
  .replace("</head>", `<style>${fonts}${css}</style>\n</head>`)
  .replace("</body>", `<script type="module">${jsSicher}</script>\n</body>`);

const out = join(root, "dist-offline");
for (const f of readdirSync(out)) if (f.endsWith(".html")) rmSync(join(out, f));
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "KI-erklaert.html"), basis);

const register = readFileSync(join(root, "src/data/kurs/erklaert.ts"), "utf8");
const slugs = [...register.matchAll(/slug: "([^"]+)", nr: (\d+)[^\n]*komponente/g)].map((m) => ({ slug: m[1], nr: Number(m[2]) }));
for (const { slug, nr } of slugs) {
  const start = `<script>if(!location.hash)location.hash="#/${slug}";</script>`;
  writeFileSync(join(out, `${String(nr).padStart(2, "0")}-${slug}.html`), basis.replace("<head>", `<head>\n${start}`));
}
rmSync(build, { recursive: true });
console.log(`Offline: KI-erklaert.html + ${slugs.length} Animationen in dist-offline/`);
