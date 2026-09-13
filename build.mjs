import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/* Two outputs from one source:
     build/  → the Claude artifact (body-level fragment; the platform
               wraps it in its own document skeleton)
     site/   → the self-hosted site (a complete document, plus config.js
               which turns the Firebase backend on)                        */

const ROOT = path.resolve(".");
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "build");
const SITE = path.join(ROOT, "site");
const TMP = path.join(ROOT, "tmp", "tsc");

for (const d of [OUT, SITE, TMP]) fs.rmSync(d, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(SITE, { recursive: true });

const sources = fs.readdirSync(SRC).filter(f => f.endsWith(".jsx")).sort();
console.log("compiling:", sources.length, "files");

execSync(
  `npx tsc --jsx react --allowJs --checkJs false --target es2019 --outDir "${TMP}" ` +
  sources.map(f => `"${path.join(SRC, f)}"`).join(" "),
  { stdio: "inherit" }
);

const bundle = sources
  .map(f => {
    const js = fs.readFileSync(path.join(TMP, f.replace(/\.jsx$/, ".js")), "utf8");
    return `/* ---- ${f} ---- */\n` + js.replace(/^"use strict";\n?/, "");
  })
  .join("\n");

const appJs = '"use strict";\n' + bundle;
fs.writeFileSync(path.join(OUT, "app.js"), appJs);
fs.writeFileSync(path.join(SITE, "app.js"), appJs);

const css = fs.readFileSync(path.join(SRC, "styles.css"), "utf8");
const page = fs.readFileSync(path.join(ROOT, "page.html"), "utf8").replace("/*STYLES*/", css);

/* --- artifact build: exactly the fragment the platform expects --- */
fs.writeFileSync(path.join(OUT, "index.html"), page);

/* --- site build: split the fragment into a real head and body --- */
const cut = page.indexOf('<div id="root">');
if (cut < 0) throw new Error("page.html no longer contains the #root mount point");
const head = page.slice(0, cut).trim();
const body = page
  .slice(cut)
  .replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1',
    '<script src="config.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1'
  );

fs.writeFileSync(path.join(SITE, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Planning hub for the 2027 family trip to Japan — itinerary, food, bookings and group voting.">
<meta name="theme-color" content="#E7E5E0">
<meta name="robots" content="noindex">
${head}
<style>img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${body}
</body>
</html>
`);

fs.copyFileSync(path.join(ROOT, "config.js"), path.join(SITE, "config.js"));

const kb = p => (fs.statSync(p).size / 1024).toFixed(1) + " KB";
console.log("build/index.html", kb(path.join(OUT, "index.html")));
console.log("site/index.html ", kb(path.join(SITE, "index.html")));
console.log("app.js          ", kb(path.join(OUT, "app.js")));
