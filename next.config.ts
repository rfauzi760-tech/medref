import type { NextConfig } from "next";
import { resolve } from "node:path";

const isNextBuild = process.env.npm_lifecycle_event === "build:next" || process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(process.env.RFS_STATIC_EXPORT === "1" ? { output: "export", trailingSlash: true } : {}),
  ...(isNextBuild ? {
  turbopack: {
    resolveAlias: {
      "cloudflare:workers": "./lib/auth/cloudflare-env.vercel.ts",
    },
  },
  webpack(config) {
    config.resolve.alias["cloudflare:workers"] = resolve(process.cwd(), "lib/auth/cloudflare-env.vercel.ts");
    return config;
  },
  } : {}),
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rfsmed.vercel.app" }],
        destination: "https://rfsmed.web.id/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
