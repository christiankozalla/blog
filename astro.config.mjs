import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://christiankozalla.com",
  outDir: "./docs", // docs are served by GitHub Pages
  integrations: [tailwind({
    applyBaseStyles: false,
  }), sitemap()],
  build: {
    assets: "astro-assets",
  },
  vite: {
    build: {
      assetsInlineLimit: 1024
    }
  }
});