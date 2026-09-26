import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";

export default defineConfig({
  plugins: [
    // Public pages are cached through the Cloudflare Workers Cache so cache hits
    // skip the render stage entirely. Required for production deploys once any
    // route is cacheable (login-gated routes stay server-rendered per request).
    vinext({ cache: { cdn: cdnAdapter() } }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
