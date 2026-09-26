import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { createRateLimiter, getRateLimitScope, isBlockedAgent } from "@/lib/security/request-policy";
import {
  getGoogleInspectionRobotsRules,
  isGoogleInspectionAllowed,
} from "@/lib/security/google-inspection";
import nextConfig from "../next.config";
import { config as proxyConfig, proxy as handleProxy } from "../proxy";

const root = process.cwd();

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

describe("perlindungan konten", () => {
  it("mengarahkan semua URL rfsmed.vercel.app ke domain utama", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual(expect.objectContaining({
      source: "/:path*",
      destination: "https://rfsmed.web.id/:path*",
      permanent: true,
      has: [{ type: "host", value: "rfsmed.vercel.app" }],
    }));
  });

  it("mengarahkan /admin ke path admin kanonis dengan trailing slash", () => {
    const adminPage = readFileSync(join(root, "app/(clinical)/admin/page.tsx"), "utf8");
    expect(adminPage).toContain('redirect("/admin/users/")');
  });

  it("membangun Worker dengan vinext dan tetap memakai Next.js di Vercel", () => {
    const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const vercelConfig = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8")) as {
      buildCommand: string;
    };

    expect(packageJson.scripts.build).toBe("npm run build:vinext");
    expect(packageJson.scripts["build:next"]).toBe("next build");
    expect(vercelConfig.buildCommand).toBe("npm run build:next");
  });

  it("memblokir crawler AI yang dikenal tanpa memblokir browser biasa", () => {
    expect(isBlockedAgent("Mozilla/5.0 compatible; GPTBot/1.2")).toBe(true);
    expect(isBlockedAgent("ClaudeBot/1.0")).toBe(true);
    expect(isBlockedAgent("PerplexityBot/1.0")).toBe(true);
    expect(isBlockedAgent("Mozilla/5.0 AppleWebKit/537.36 Chrome/140 Safari/537.36")).toBe(false);
  });

  it("memblokir bot umum dan klien otomasi, bukan hanya crawler AI", () => {
    expect(isBlockedAgent("Mozilla/5.0 (compatible; ExampleResearchBot/2.1)")).toBe(true);
    expect(isBlockedAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBlockedAgent("Scrapy/2.11.0 (+https://example.org/bot)")).toBe(true);
    expect(isBlockedAgent("Go-http-client/1.1")).toBe(true);
    expect(isBlockedAgent("Mozilla/5.0 (compatible; Google-InspectionTool/1.0)")).toBe(true);
    expect(isBlockedAgent("Mozilla/5.0 AppleWebKit/537.36 Chrome/140 Safari/537.36")).toBe(false);
  });

  it("membuka sementara hanya halaman publik dan aset antarmuka untuk alat inspeksi Google", () => {
    const inspectionAgent = "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)";
    const now = Date.parse("2026-09-26T00:00:00.000Z");

    expect(isGoogleInspectionAllowed(inspectionAgent, "/", "GET", now)).toBe(true);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/login", "HEAD", now)).toBe(true);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/_next/static/chunk.js", "GET", now)).toBe(true);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/guidelines/sepsis", "GET", now)).toBe(false);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/api/auth/sign-in", "GET", now)).toBe(false);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/", "POST", now)).toBe(false);
    expect(isGoogleInspectionAllowed("Googlebot/2.1", "/", "GET", now)).toBe(false);
    expect(isGoogleInspectionAllowed(inspectionAgent, "/", "GET", Date.parse("2026-10-03T00:00:00.000Z"))).toBe(false);
  });

  it("memberi izin robots hanya ke Google Inspection Tool dan hanya sampai batas waktu", () => {
    const activeRules = getGoogleInspectionRobotsRules(Date.parse("2026-09-26T00:00:00.000Z"));
    expect(activeRules).toContainEqual(expect.objectContaining({
      userAgent: "Google-InspectionTool",
      allow: expect.arrayContaining(["/$", "/login$", "/_next/static/"]),
      disallow: "/",
    }));
    expect(activeRules).toContainEqual({ userAgent: "*", disallow: "/" });

    expect(getGoogleInspectionRobotsRules(Date.parse("2026-10-03T00:00:00.000Z"))).toEqual([
      { userAgent: "*", disallow: "/" },
    ]);
  });

  it("menerapkan pengecualian di proxy tanpa membuka halaman klinis atau API", async () => {
    const inspectionAgent = "Mozilla/5.0 (compatible; Google-InspectionTool/1.0)";
    const homepage = await handleProxy(new NextRequest("https://rfsmed.web.id/", {
      headers: { "user-agent": inspectionAgent },
    }));
    const clinicalPage = await handleProxy(new NextRequest("https://rfsmed.web.id/drugs", {
      headers: { "user-agent": inspectionAgent },
    }));
    const api = await handleProxy(new NextRequest("https://rfsmed.web.id/api/auth/sign-in", {
      headers: { "user-agent": inspectionAgent },
    }));

    expect(homepage.status).toBe(200);
    expect(clinicalPage.status).toBe(403);
    expect(api.status).toBe(403);
  });

  it("menjaga Cloudflare menyajikan aset statis langsung agar CSS dan JavaScript tetap berfungsi", () => {
    expect(proxyConfig.matcher).toContain("/:path*");

    const workerConfig = JSON.parse(readFileSync(join(root, "wrangler.jsonc"), "utf8")) as {
      assets: { run_worker_first?: boolean };
    };
    expect(workerConfig.assets.run_worker_first).not.toBe(true);
  });

  it("membatasi permintaan berulang berdasarkan kunci klien", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000 });

    expect(limiter.consume("client-a", 0).allowed).toBe(true);
    expect(limiter.consume("client-a", 100).allowed).toBe(true);
    expect(limiter.consume("client-a", 200).allowed).toBe(false);
    expect(limiter.consume("client-a", 1_001).allowed).toBe(true);
    expect(limiter.consume("client-b", 200).allowed).toBe(true);
  });

  it("tidak membatasi kunjungan halaman atau API biasa", () => {
    expect(getRateLimitScope("/")).toBe(null);
    expect(getRateLimitScope("/guidelines/sepsis")).toBe(null);
    expect(getRateLimitScope("/api/search")).toBe(null);
    expect(getRateLimitScope("/api/scores/kpsp")).toBe(null);
  });

  it("tetap membatasi endpoint proxy gambar EKG", () => {
    expect(getRateLimitScope("/api/ecg-module-image/example")).toBe("ecg-image");
  });

  it("menonaktifkan indeks dan menyediakan ketentuan penggunaan", () => {
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    const robots = readFileSync(join(root, "app/robots.ts"), "utf8");
    const terms = readFileSync(join(root, "app/terms/page.tsx"), "utf8");

    expect(layout).toContain("index: false");
    expect(layout).toContain("follow: false");
    expect(robots).toContain("getGoogleInspectionRobotsRules");
    expect(terms).toContain("pelatihan model AI");
    expect(terms).toContain("scraping");
  });

  it("menjaga data sensitif server dan mewajibkan sesi pada halaman statis", () => {
    const canonical = readFileSync(join(root, "lib/data/klinea-canonical.ts"), "utf8");
    expect(canonical).toContain('import "server-only"');

    const clientFiles = [...sourceFiles(join(root, "app")), ...sourceFiles(join(root, "components"))]
      .filter((file) => readFileSync(file, "utf8").startsWith('"use client"'));
    for (const file of clientFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/import\s+(?!type\b)[^;]+from\s+["']@\/lib\/data\//);
      expect(source, file).not.toMatch(/from\s+["']@\/lib\/generated\//);
    }

    const gatedLayout = readFileSync(join(root, "app/(clinical)/layout.tsx"), "utf8");
    expect(gatedLayout).toContain("StaticSessionGate");
    const sessionGate = readFileSync(join(root, "components/auth/static-session-gate.tsx"), "utf8");
    expect(sessionGate).toContain("authClient.useSession()");
    expect(sessionGate).toContain("/login?next=");

    const rootLayout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(rootLayout).not.toContain("force-dynamic");
  });

  it("menghasilkan halaman statis tanpa mengubah endpoint autentikasi", () => {
    const publicPages = ["app/page.tsx", "app/terms/page.tsx", "app/privacy/page.tsx"];
    for (const page of publicPages) {
      expect(readFileSync(join(root, page), "utf8"), page).not.toContain("force-dynamic");
    }

    const login = readFileSync(join(root, "app/login/page.tsx"), "utf8");
    expect(login).not.toContain("force-dynamic");
    expect(login).toContain("googleEnabled");
    expect(login).toContain("emailVerificationEnabled");
    const authRoute = readFileSync(join(root, "app/api/auth/[...all]/route.ts"), "utf8");
    expect(authRoute).toContain('import("better-auth/next-js")');
    expect(authRoute).toContain('import("@/lib/auth")');
    const proxy = readFileSync(join(root, "proxy.ts"), "utf8");
    expect(proxy).toContain('pathname.startsWith("/api/auth/")');
    expect(proxy).toContain("new URL(`${pathname}${request.nextUrl.search}`, authContext.baseURL)");
    expect(proxy).toContain("auth.handler(new Request(authUrl, request))");
    expect(proxy).toContain('pathname !== "/api/auth/providers"');

    const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { scripts: Record<string, string> };
    expect(packageJson.scripts["build:vinext"]).toContain("RFS_STATIC_EXPORT=1");
    const wrangler = readFileSync(join(root, "wrangler.jsonc"), "utf8");
    expect(wrangler).toContain('"run_worker_first": ["/api/*"]');
  });
});
