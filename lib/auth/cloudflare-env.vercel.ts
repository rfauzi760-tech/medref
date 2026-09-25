import type { AuthRuntimeEnvironment } from "./options";

// Vercel only hosts the legacy-domain redirect. Authentication is served by Cloudflare.
export const env: AuthRuntimeEnvironment = { NODE_ENV: "production" };
