import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from '@tailwindcss/vite'

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://christiankozalla.com",
  outDir: "./docs", // docs are served by GitHub Pages
  integrations: [sitemap()],
  build: {
    assets: "astro-assets",
  },
  vite: {
    build: {
      assetsInlineLimit: 1024
    },

    plugins: [tailwindcss()]
  }
});
