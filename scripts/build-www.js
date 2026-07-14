// Copie les fichiers web dans www/ (le dossier que Capacitor embarque dans l'app native).
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "www");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "icons"), { recursive: true });

const files = ["index.html", "manifest.webmanifest", "sw.js"];
for (const f of files) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
for (const f of fs.readdirSync(path.join(ROOT, "icons")))
  fs.copyFileSync(path.join(ROOT, "icons", f), path.join(OUT, "icons", f));

console.log("www/ prêt pour Capacitor");
