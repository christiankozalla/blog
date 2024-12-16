import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://christiankozalla.com",
  outDir: "./dist",
  integrations: [tailwind({
    applyBaseStyles: false,
  }), sitemap()],
  vite: {
    build: {
      assetsInlineLimit: 1024
    }
  }
});