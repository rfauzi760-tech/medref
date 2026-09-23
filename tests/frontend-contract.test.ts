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

  test("global search uses the compact command palette treatment", () => {
    const search = read("components/global-search.tsx");

    expect(search).toContain("data-search-palette");
    expect(search).toContain("focus-within:border-accent");
    expect(search).toContain("max-w-2xl");
  });

  test("mounts Vercel Analytics once at the application root", () => {
    const layout = read("app/layout.tsx");

    expect(layout).toContain('@vercel/analytics/next');
    expect(layout.match(/<Analytics \/>/g)).toHaveLength(1);
  });

  test("reference indexes and reading pages use the shared system", () => {
    const indexes = [
      "components/catalog-pages/scores-page-client.tsx", "components/catalog-pages/calculators-page-client.tsx", "components/catalog-pages/drugs-page-client.tsx",
      "components/catalog-pages/guidelines-page-client.tsx", "components/catalog-pages/indications-page-client.tsx",
      "components/catalog-pages/specialties-page-client.tsx", "components/catalog-pages/icd10-page-client.tsx",
    ];
    for (const path of indexes) expect(read(path)).toContain("PageHeader");
    for (const path of indexes.slice(0, 6).concat("components/catalog-pages/icd10-page-client.tsx")) expect(read(path)).toContain("index-row");
    const details = [
      "app/guidelines/[slug]/page.tsx", "app/indications/[slug]/page.tsx",
      "app/specialties/[slug]/page.tsx",
    ];
    for (const path of details) expect(read(path)).toMatch(/workspace-panel|section-band/);
  });

  test("clinical guideline cards link to the existing detail route", () => {
    const guidelines = read("components/catalog-pages/guidelines-page-client.tsx");

    expect(guidelines).toContain('href={`/guidelines/${g.slug}`}');
    expect(guidelines).not.toContain('href={`/items/${g.slug}`}');
  });

  test("interactive tools share structured form language", () => {
    const files = ["components/calculator-tool.tsx", "components/score-tool.tsx", "components/pediatric-dose-form.tsx"];
    for (const path of files) {
      const source = read(path);
      expect(source).toContain("section-band");
      expect(source).toContain("workspace-panel");
      expect(source).toContain("<label");
      expect(source).toContain("focus-ring");
    }
    expect(read(files[0])).toContain("runCalculator");
    expect(read(files[1])).toContain("/api/scores/");
    expect(read("app/api/scores/[slug]/route.ts")).toContain("evaluateScore");
    expect(read(files[2])).toContain("calculateDose");
    expect(read("components/drug-view.tsx")).toContain("PediatricDoseForm");
  });

  test("specialized workspaces consume the shared visual system", () => {
    const paths = [
      "app/anthropometry/page.tsx", "components/growth-chart.tsx", "app/development/page.tsx",
      "components/catalog-pages/immunization-page-client.tsx", "components/catalog-pages/interactions-page-client.tsx",
    ];
    paths[2] = "components/catalog-pages/development-page-client.tsx";
    for (const path of paths) expect(read(path)).toContain("workspace-panel");
    for (const path of paths.filter((path) => !path.includes("growth-chart"))) {
      expect(read(path)).toContain("focus-ring");
    }
    expect(read(paths[0])).toContain("assess");
    expect(read(paths[3])).toContain("assessImmunization");
  });
});
