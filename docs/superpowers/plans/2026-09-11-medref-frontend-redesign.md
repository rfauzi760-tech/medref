# MedRef Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every MedRef route as a cohesive Flyweel-inspired clinical workspace while preserving all calculations, content, and light/dark theme behavior.

**Architecture:** Establish typography and semantic design tokens globally, then update shared shell and UI primitives before migrating page families. Keep clinical data and calculation functions unchanged; all page work is presentation-only except for a small typed coverage summary derived from existing datasets.

**Tech Stack:** Next.js 16.3.4 App Router, React 19.2.8, TypeScript 5, Tailwind CSS 4, next/font, next-themes, Lucide React, Vitest 5.

## Global Constraints

- Preserve every current route, feature, clinical calculation, local favorite/history behavior, print action, and Bahasa Indonesia-first content.
- Preserve both light and dark themes with WCAG 2.1 AA contrast and visible keyboard focus.
- Use Funnel Display for headings and Funnel Sans for body text and controls.
- Use near-black and warm ivory surfaces with a restrained mint clinical accent.
- Use crisp one-pixel borders, modest corner radii, flat surfaces, and shadows only for overlays.
- Do not add decorative gradients, excessive pills, uniform card grids, oversized spacing, or promotional copy.
- Do not change clinical formulas or bulk-create clinical content.
- Preserve unrelated uncommitted user changes.
- Before implementation, consult `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` and `11-css.md`; use `next/font/google` at the root layout as documented.

---

### Task 1: Visual foundation and font contract

**Files:**
- Modify: `app/layout.tsx:1-50`
- Modify: `app/globals.css:1-220`
- Create: `tests/frontend-contract.test.ts`

**Interfaces:**
- Produces CSS variables `--font-display`, `--font-sans`, `--canvas`, `--surface`, `--surface-raised`, `--ink`, `--muted`, `--line`, `--accent`, and `--accent-ink`.
- Produces reusable classes `.display-type`, `.workspace-panel`, `.section-band`, `.focus-ring`, and `.index-row`.

- [ ] **Step 1: Write the failing foundation contract**

```ts
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
});
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `npx vitest run tests/frontend-contract.test.ts`
Expected: FAIL because Funnel font imports and semantic tokens do not exist.

- [ ] **Step 3: Install the root font variables**

In `app/layout.tsx`, import `Funnel_Display` and `Funnel_Sans` from `next/font/google`, configure each with `subsets: ["latin"]` and CSS variables `--font-display` and `--font-sans`, then add both `.variable` values to the `<html>` class alongside `suppressHydrationWarning`.

- [ ] **Step 4: Replace the global palette with semantic light/dark tokens**

In `app/globals.css`, keep `@import "tailwindcss"` and the existing print/scroll rules, but define the produced variables under `:root` and `.dark`. Set `body` to `background: var(--canvas)`, `color: var(--ink)`, and `font-family: var(--font-sans)`. Set headings and `.display-type` to `var(--font-display)` with low-to-medium weights and tight tracking. Add the five reusable classes listed under Interfaces with 10–12px radii, one-pixel borders, and `:focus-visible` outlines using the accent.

- [ ] **Step 5: Verify the foundation**

Run: `npx vitest run tests/frontend-contract.test.ts && npm run lint`
Expected: PASS with no lint errors.

- [ ] **Step 6: Commit the foundation**

```bash
git add app/layout.tsx app/globals.css tests/frontend-contract.test.ts
git commit -m "style: establish MedRef visual system"
```

### Task 2: Workspace shell, search, and shared primitives

**Files:**
- Modify: `components/shell.tsx:11-137`
- Modify: `components/global-search.tsx:8-164`
- Modify: `components/theme-toggle.tsx:7-25`
- Modify: `components/shared.tsx:8-81`
- Modify: `components/action-buttons.tsx`
- Modify: `components/source-block.tsx`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- `PageHeader({ title, description, count? })` remains source-compatible.
- `FilterInput`, `SpecialtyTags`, and `ToolCard` keep their current props.
- Shell continues to consume `modules`, `appName`, `appTagline`, `GlobalSearch`, and `ThemeToggle`.

- [ ] **Step 1: Extend the contract for shared workspace landmarks**

```ts
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
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `npx vitest run tests/frontend-contract.test.ts`
Expected: FAIL on the new workspace landmark assertions.

- [ ] **Step 3: Redesign the shell**

Keep the existing desktop sidebar and mobile drawer state. Change the sidebar to a 248px compact rail, add `aria-label="Navigasi klinis"`, group the brand and module count hierarchy, apply the semantic surface/border tokens, render the active item through `data-active={active}`, and retain the clinical disclaimer. Keep the desktop top bar sticky and use a constrained reading width for `<main>`.

- [ ] **Step 4: Redesign shared controls**

Apply the shared panel, band, row, and focus classes to `PageHeader`, `FilterInput`, `ToolCard`, action buttons, source metadata, theme toggle, and global search. Preserve component signatures and keyboard behavior. Search results must remain navigable by ArrowUp, ArrowDown, Enter, and Escape.

- [ ] **Step 5: Verify shared behavior**

Run: `npx vitest run tests/frontend-contract.test.ts && npm test && npm run lint`
Expected: the new contract passes, the existing 92 tests still pass, and lint passes.

- [ ] **Step 6: Commit shared UI**

```bash
git add components/shell.tsx components/global-search.tsx components/theme-toggle.tsx components/shared.tsx components/action-buttons.tsx components/source-block.tsx tests/frontend-contract.test.ts
git commit -m "style: redesign clinical workspace shell"
```

### Task 3: Homepage and truthful coverage summary

**Files:**
- Create: `lib/content-coverage.ts`
- Create: `tests/content-coverage.test.ts`
- Modify: `app/page.tsx:10-115`
- Modify: `lib/nav.ts`
- Modify: `README.md`

**Interfaces:**
- Produces `ContentCoverage` with `{ label: string; local: number; reference?: number; status: "complete" | "partial" | "local-only" }`.
- Produces `getContentCoverage(): ContentCoverage[]`, derived from existing exported datasets.

- [ ] **Step 1: Write failing coverage tests**

```ts
import { describe, expect, test } from "vitest";
import { getContentCoverage } from "@/lib/content-coverage";

describe("content coverage", () => {
  test("reports real local counts and honest status", () => {
    const rows = getContentCoverage();
    expect(rows.find((row) => row.label === "Panduan Klinis")?.status).toBe("complete");
    expect(rows.find((row) => row.label === "Dosis Obat")?.status).toBe("partial");
    expect(rows.every((row) => row.local > 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npx vitest run tests/content-coverage.test.ts`
Expected: FAIL because `lib/content-coverage.ts` does not exist.

- [ ] **Step 3: Implement coverage derivation**

Import `SCORES`, `CALCULATORS`, `DRUGS`, `drugInteractions`, `guidelines`, `icd10Codes`, and `foods`. Use one `REFERENCE_COUNTS` constant shared by the function and README values. Return actual array lengths and compute `complete` only when `local >= reference`; use `local-only` when no reference exists.

- [ ] **Step 4: Recompose the homepage**

Use an editorial hero with one display heading, concise description, primary global search, and compact actual-count strip. Preserve recent tools and favorites. Replace the uniform module grid with a two-column index where primary clinical modules receive wider rows and secondary modules remain compact. Add a short coverage disclosure linking conceptually to the README without claiming full completeness.

- [ ] **Step 5: Reconcile documentation claims**

Update README coverage totals to use the same baseline values documented in `REFERENCE_COUNTS`; state explicitly which datasets are complete or partial and remove contradictory totals.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run tests/content-coverage.test.ts tests/coverage-audit.test.ts tests/frontend-contract.test.ts && npm run lint`
Expected: PASS.

```bash
git add lib/content-coverage.ts tests/content-coverage.test.ts app/page.tsx lib/nav.ts README.md
git commit -m "feat: add honest clinical coverage overview"
```

### Task 4: Reference indexes and detail reading pages

**Files:**
- Modify: `app/scores/page.tsx:13-98`
- Modify: `app/calculators/page.tsx:8-92`
- Modify: `app/drugs/page.tsx:7-74`
- Modify: `app/guidelines/page.tsx:9-99`
- Modify: `app/indications/page.tsx:7-68`
- Modify: `app/nutrition/page.tsx:7-89`
- Modify: `app/nutrition-guidance/page.tsx:8-52`
- Modify: `app/specialties/page.tsx:14-43`
- Modify: `app/icd10/page.tsx:8-108`
- Modify: `app/guidelines/[slug]/page.tsx:25-80`
- Modify: `app/indications/[slug]/page.tsx:21-73`
- Modify: `app/nutrition-guidance/[slug]/page.tsx:20-96`
- Modify: `app/specialties/[slug]/page.tsx:24-63`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- All routes and existing query/filter state remain unchanged.
- All index pages use `PageHeader`, `FilterInput`, `.index-row`, and `.workspace-panel`.

- [ ] **Step 1: Add route-family contract assertions**

```ts
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
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `npx vitest run tests/frontend-contract.test.ts`
Expected: FAIL for unmigrated route files.

- [ ] **Step 3: Migrate index pages**

Keep filtering and mapping logic intact. Replace card-gallery wrappers with professional index rows: title and description on the left, specialty/category/count metadata on the right, full-row focus state, and a restrained arrow affordance. Use compact empty states with direct Indonesian guidance.

- [ ] **Step 4: Migrate reading pages**

Keep metadata generation and content order intact. Apply a consistent 72-character reading column, section bands, source block, and quiet clinical callouts. Preserve action buttons and all links.

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run tests/frontend-contract.test.ts tests/data-validation.test.ts && npm run lint`
Expected: PASS.

```bash
git add app/scores/page.tsx app/calculators/page.tsx app/drugs/page.tsx app/guidelines/page.tsx app/indications/page.tsx app/nutrition/page.tsx app/nutrition-guidance app/specialties app/icd10/page.tsx 'app/guidelines/[slug]/page.tsx' 'app/indications/[slug]/page.tsx' tests/frontend-contract.test.ts
git commit -m "style: redesign clinical indexes and reading pages"
```

### Task 5: Calculators, scores, and drug tools

**Files:**
- Modify: `components/calculator-tool.tsx:27-200`
- Modify: `components/score-tool.tsx:18-213`
- Modify: `components/drug-view.tsx:10-187`
- Modify: `app/calculators/[slug]/page.tsx:24-34`
- Modify: `app/scores/[slug]/page.tsx:24-34`
- Modify: `app/drugs/[slug]/page.tsx:24-34`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- `CalculatorToolView({ tool }: { tool: CalculatorTool })`, `ScoreToolView({ tool }: { tool: ScoreTool })`, and `DrugView({ drug }: { drug: Drug })` remain unchanged.
- `runCalculator`, `evaluateScore`, and `calculateDose` remain untouched.

- [ ] **Step 1: Add interactive-tool contract assertions**

```ts
test("interactive tools share structured form language", () => {
  const files = ["components/calculator-tool.tsx", "components/score-tool.tsx", "components/drug-view.tsx"];
  for (const path of files) {
    const source = read(path);
    expect(source).toContain("section-band");
    expect(source).toContain("workspace-panel");
    expect(source).toContain("<label");
    expect(source).toContain("focus-ring");
  }
  expect(read(files[0])).toContain("runCalculator");
  expect(read(files[1])).toContain("evaluateScore");
  expect(read(files[2])).toContain("calculateDose");
});
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `npx vitest run tests/frontend-contract.test.ts`
Expected: FAIL for missing structured-form classes.

- [ ] **Step 3: Redesign calculator and score forms**

Keep state and calculation calls unchanged. Divide inputs into a labeled workspace panel and results into a second panel. Use Funnel Display section headings, consistent 44px minimum control height, mint focus/selected states, explicit required markers, and sticky desktop results with `lg:sticky lg:top-24`. Keep mobile order as heading, inputs, results, interpretation, source.

- [ ] **Step 4: Redesign drug details and dose tool**

Use the same section bands and control language for dose inputs. Keep indications, contraindications, warnings, dosing, interactions, and source content in their existing order. Use semantic warning colors in addition to text/icons.

- [ ] **Step 5: Verify clinical outputs and commit**

Run: `npx vitest run tests/calculators.test.ts tests/scores.test.ts tests/drugs.test.ts tests/frontend-contract.test.ts && npm run lint`
Expected: PASS with unchanged calculation assertions.

```bash
git add components/calculator-tool.tsx components/score-tool.tsx components/drug-view.tsx 'app/calculators/[slug]/page.tsx' 'app/scores/[slug]/page.tsx' 'app/drugs/[slug]/page.tsx' tests/frontend-contract.test.ts
git commit -m "style: redesign interactive clinical tools"
```

### Task 6: Specialized clinical workspaces

**Files:**
- Modify: `app/anthropometry/page.tsx:21-267`
- Modify: `components/growth-chart.tsx`
- Modify: `app/development/page.tsx:9-147`
- Modify: `app/immunization/page.tsx:12-183`
- Modify: `app/interactions/page.tsx:19-186`
- Modify: `app/meal-planner/page.tsx:13-266`
- Modify: `app/nutrition/page.tsx:7-89`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- Preserve existing state shapes, calculation imports, chart data, local storage, and generated meal plans.
- Each page uses the same `.workspace-panel`, `.section-band`, `.focus-ring`, and semantic status tokens.

- [ ] **Step 1: Add specialized-page contract assertions**

```ts
test("specialized workspaces consume the shared visual system", () => {
  const paths = [
    "app/anthropometry/page.tsx", "components/growth-chart.tsx", "app/development/page.tsx",
    "app/immunization/page.tsx", "app/interactions/page.tsx", "app/meal-planner/page.tsx",
    "app/nutrition/page.tsx",
  ];
  for (const path of paths) expect(read(path)).toContain("workspace-panel");
  for (const path of paths.filter((path) => !path.includes("growth-chart") && !path.includes("nutrition/page"))) {
    expect(read(path)).toContain("focus-ring");
  }
  expect(read(paths[0])).toContain("assess");
  expect(read(paths[3])).toContain("assessImmunization");
});
```

- [ ] **Step 2: Run the contract and verify failure**

Run: `npx vitest run tests/frontend-contract.test.ts`
Expected: FAIL for specialized pages not yet using the shared system.

- [ ] **Step 3: Migrate form-heavy pages**

Apply the calculator input/result structure to anthropometry, development, immunization, interactions, and meal planner. Keep interactive behavior unchanged. Replace colored decorative boxes with semantic bordered status rows; retain color-independent labels and icons.

- [ ] **Step 4: Migrate charts and food tables**

Update chart containers, axis/tooltip colors, and table/list surfaces to consume CSS tokens. Keep dataset values and chart calculations unchanged. Ensure horizontal overflow remains usable at 320px.

- [ ] **Step 5: Verify clinical behavior and commit**

Run: `npx vitest run tests/anthropometry.test.ts tests/immunization.test.ts tests/nutrition.test.ts tests/frontend-contract.test.ts && npm run lint`
Expected: PASS.

```bash
git add app/anthropometry/page.tsx components/growth-chart.tsx app/development/page.tsx app/immunization/page.tsx app/interactions/page.tsx app/meal-planner/page.tsx app/nutrition/page.tsx tests/frontend-contract.test.ts
git commit -m "style: unify specialized clinical workspaces"
```

### Task 7: Whole-app verification and polish

**Files:**
- Modify only files with verified visual, accessibility, or build defects found in this task.

**Interfaces:**
- No new public interfaces.

- [ ] **Step 1: Run automated verification**

Run: `npm test && npm run lint && npm run build`
Expected: all tests pass, lint exits zero, and Next.js produces a successful production build.

- [ ] **Step 2: Verify representative routes in both themes**

Run the development server and inspect `/`, `/scores`, one `/scores/[slug]`, `/calculators`, one `/calculators/[slug]`, `/drugs`, one `/drugs/[slug]`, `/guidelines`, one `/guidelines/[slug]`, `/icd10`, `/anthropometry`, `/immunization`, `/interactions`, and `/meal-planner`. Check 320, 768, 1024, and 1440px viewports; verify no overflow, clipped controls, unreadable text, or layout shift.

- [ ] **Step 3: Verify keyboard and state behavior**

Tab through the shell, theme toggle, global search, filters, one calculator, and mobile drawer. Verify visible focus, Escape closes overlays, Enter activates results, theme persists, and empty/warning/result states remain understandable without color.

- [ ] **Step 4: Fix only observed defects and rerun checks**

For each defect, make the smallest scoped change, then rerun its relevant Vitest file and `npm run lint`. Finish with `npm test && npm run build` and expect both to pass.

- [ ] **Step 5: Commit verified polish**

```bash
git add app components lib tests README.md
git commit -m "fix: polish responsive clinical interface"
```
