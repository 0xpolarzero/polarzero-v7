import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://polarzero.xyz",
  output: "static",
  adapter: vercel({
    maxDuration: 300,
  }),
});
