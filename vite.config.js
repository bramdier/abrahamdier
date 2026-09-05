import { cpSync, existsSync } from "fs";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const STATIC_FILES = [
  "header.html",
  "footer.html",
  "robots.txt",
  "sitemap.xml",
  "logo_a.png",
  "hero.JPG",
  "hero_2.jpg",
];

export default defineConfig({
  publicDir: false,
  plugins: [
    tailwindcss(),
    {
      name: "copy-static",
      closeBundle() {
        for (const file of STATIC_FILES) {
          if (existsSync(file)) {
            cpSync(file, resolve("public", file));
          }
        }
      },
    },
  ],
  build: {
    outDir: "public",
    emptyOutDir: true,
  },
});
