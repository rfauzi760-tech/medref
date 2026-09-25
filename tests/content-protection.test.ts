import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createRateLimiter, getRateLimitScope, isBlockedAgent } from "@/lib/security/request-policy";
import nextConfig from "../next.config";
import { config as proxyConfig } from "../proxy";

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
    expect(isBlockedAgent("Mozilla/5.0 AppleWebKit/537.36 Chrome/140 Safari/537.36")).toBe(false);
  });

  it("menerapkan pemeriksaan bot juga ke aset statis dan gambar", () => {
    expect(proxyConfig.matcher).toContain("/:path*");
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
    expect(robots).toContain('disallow: "/"');
    expect(terms).toContain("pelatihan model AI");
    expect(terms).toContain("scraping");
  });

  it("menjaga basis data klinis di sisi server", () => {
    const canonical = readFileSync(join(root, "lib/data/klinea-canonical.ts"), "utf8");
    expect(canonical).toContain('import "server-only"');

    const clientFiles = [...sourceFiles(join(root, "app")), ...sourceFiles(join(root, "components"))]
      .filter((file) => readFileSync(file, "utf8").startsWith('"use client"'));
    for (const file of clientFiles) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/import\s+(?!type\b)[^;]+from\s+["']@\/lib\/data\//);
      expect(source, file).not.toMatch(/from\s+["']@\/lib\/generated\//);
    }

    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(layout).toContain('export const dynamic = "force-dynamic"');
  });
});
