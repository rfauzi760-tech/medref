import { existsSync, readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { appName } from "@/lib/nav";

describe("identitas dan teks antarmuka RFSmed", () => {
  it("menggunakan nama RFSmed tanpa tagline merek", () => {
    expect(appName).toBe("RFSmed");
    expect(readFileSync("lib/nav.ts", "utf8")).not.toContain("appTagline");
  });

  it("tidak membiarkan favicon bawaan Vercel mengalahkan ikon RFSmed", () => {
    expect(existsSync("app/favicon.ico")).toBe(false);
    expect(readFileSync("app/layout.tsx", "utf8")).toContain('/rfsmed-symbol.svg');
  });

  it("tidak memakai em dash pada teks yang terlihat", () => {
    const files = globSync(["app/**/*.tsx", "components/**/*.tsx", "lib/nav.ts"]);
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toContain("—");
  });

  it("membuat seluruh heading tebal", () => {
    expect(readFileSync("app/globals.css", "utf8")).toMatch(/h1,\s*h2,\s*h3\s*\{[\s\S]*?font-weight:\s*700/);
  });

  it("menampilkan beranda ringkas dengan modul klinis terbaru", () => {
    const home = readFileSync("app/page.tsx", "utf8");
    expect(home).not.toContain("Keputusan klinis yang lebih jelas");
    expect(home).not.toContain("Cakupan aktual");
    const primarySlugs = home.match(/const primaryModuleSlugs = \[([\s\S]*?)\] as const;/)?.[1];
    expect(primarySlugs?.match(/"([^"]+)"/g)).toEqual([
      '"drugs"', '"calculators"', '"guidelines"', '"scores"', '"interactions"',
      '"indications"', '"anthropometry"', '"immunization"', '"development"',
      '"ecg-module"', '"icd10"', '"igd-toolkit"',
    ]);
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("ModuleVisitTracker");
  });

  it("menyatukan dosis dewasa dan anak dalam satu modul", () => {
    const nav = readFileSync("lib/nav.ts", "utf8");
    expect(nav).toContain('name: "Dosis Obat"');
    expect(nav).not.toContain('name: "Dosis Obat Anak"');
    expect(nav).not.toContain('name: "Dosis Anak dan Kalkulator"');
    expect(readFileSync("components/shell.tsx", "utf8")).toContain('if (href === "/drugs") return pathname.startsWith("/drugs");');
  });
});
