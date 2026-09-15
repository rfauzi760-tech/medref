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
    expect(readFileSync("app/layout.tsx", "utf8")).toContain('/rfsmed-mark.png');
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
    for (const slug of [
      "igd-toolkit", "scores", "emergency", "timer", "pediatric-emergency",
      "ecg-atlas", "radiology-atlas", "emergency-dose", "bilirubin", "antidotes",
      "pregnancy-drugs", "electrolytes", "ddx",
    ]) {
      expect(home).toContain(`"${slug}"`);
    }
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("ModuleVisitTracker");
  });

  it("menyediakan pintasan mode dosis obat anak", () => {
    const nav = readFileSync("lib/nav.ts", "utf8");
    expect(nav).toContain('name: "Dosis Obat Anak"');
    expect(nav).toContain('href: "/drugs?mode=anak"');
    expect(readFileSync("components/shell.tsx", "utf8")).toContain('searchParams.get("mode") === "anak"');
  });
});
