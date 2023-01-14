import { defineConfig } from "astro/config";
// import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://christiankozalla.com",
  outDir: "./dist",
  // output: "server",
  // adapter: node({
  //   mode: "standalone",
  // }),
  // server: {
  //   host: true,
  //   port: 3000,
  // },
});
