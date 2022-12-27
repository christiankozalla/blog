import { defineConfig } from "astro/config";
// import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.christiankozalla.com",
  // output: "server",
  // adapter: node({
  //   mode: "standalone",
  // }),
  outDir: "./dist",
  server: {
    host: true,
    port: 3000,
  },
});
