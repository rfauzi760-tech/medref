import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { appName } from "@/lib/nav";

describe("identitas dan teks antarmuka RFSmed", () => {
  it("menggunakan nama RFSmed tanpa tagline merek", () => {
    expect(appName).toBe("RFSmed");
    expect(readFileSync("lib/nav.ts", "utf8")).not.toContain("appTagline");
  });

  it("tidak memakai em dash pada teks yang terlihat", () => {
    const files = globSync(["app/**/*.tsx", "components/**/*.tsx", "lib/nav.ts"]);
    for (const file of files) expect(readFileSync(file, "utf8"), file).not.toContain("—");
  });

  it("membuat seluruh heading tebal", () => {
    expect(readFileSync("app/globals.css", "utf8")).toMatch(/h1,\s*h2,\s*h3\s*\{[\s\S]*?font-weight:\s*700/);
  });
});
