import { cpSync, existsSync, mkdirSync, rmSync } from "fs";

const OUT = "public";

const files = [
  "index.html",
  "header.html",
  "footer.html",
  "layout-include.js",
  "tabs.js",
  "robots.txt",
  "sitemap.xml",
];

const dirs = ["css"];

const optionalFiles = ["hero.JPG", "hero_2.jpg", "logo_a.png"];

if (existsSync(OUT)) {
  rmSync(OUT, { recursive: true, force: true });
}
mkdirSync(OUT, { recursive: true });

for (const file of files) {
  cpSync(file, `${OUT}/${file}`);
}

for (const dir of dirs) {
  cpSync(dir, `${OUT}/${dir}`, { recursive: true });
}

for (const file of optionalFiles) {
  if (existsSync(file)) {
    cpSync(file, `${OUT}/${file}`);
  }
}

console.log("Built static site → public/");
