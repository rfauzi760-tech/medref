import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("frontend design contract", () => {
  test("loads Funnel fonts and exposes semantic workspace tokens", () => {
    const layout = read("app/layout.tsx");
    const css = read("app/globals.css");

    expect(layout).toContain("Funnel_Display");
    expect(layout).toContain("Funnel_Sans");
    for (const token of ["--font-display", "--font-sans", "--canvas", "--surface", "--ink", "--line", "--accent"]) {
      expect(css).toContain(token);
    }
    expect(css).not.toContain("linear-gradient(");
  });

  test("shared workspace components expose semantic landmarks", () => {
    const shell = read("components/shell.tsx");
    const shared = read("components/shared.tsx");
    const search = read("components/global-search.tsx");

    expect(shell).toContain('aria-label="Navigasi klinis"');
    expect(shell).toContain("data-workspace-shell");
    expect(shell).toContain("data-active");
    for (const className of ["workspace-panel", "section-band", "index-row"]) expect(shared).toContain(className);
    expect(search).toContain('role="combobox"');
    for (const path of ["components/theme-toggle.tsx", "components/action-buttons.tsx"]) {
      expect(read(path)).toContain("aria-label");
    }
  });

  test("reference indexes and reading pages use the shared system", () => {
    const indexes = [
      "app/scores/page.tsx", "app/calculators/page.tsx", "app/drugs/page.tsx",
      "app/guidelines/page.tsx", "app/indications/page.tsx", "app/nutrition/page.tsx",
      "app/nutrition-guidance/page.tsx", "app/specialties/page.tsx", "app/icd10/page.tsx",
    ];
    for (const path of indexes) expect(read(path)).toContain("PageHeader");
    for (const path of indexes.slice(0, 6).concat("app/icd10/page.tsx")) expect(read(path)).toContain("index-row");
    const details = [
      "app/guidelines/[slug]/page.tsx", "app/indications/[slug]/page.tsx",
      "app/nutrition-guidance/[slug]/page.tsx", "app/specialties/[slug]/page.tsx",
    ];
    for (const path of details) expect(read(path)).toMatch(/workspace-panel|section-band/);
  });
});
