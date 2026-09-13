# Homepage, Siriraj Score, and Guideline Formatting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the RFSmed homepage, track recent module visits, fix Diare Akut hierarchy, and add a validated Siriraj Stroke Score.

**Architecture:** Keep the existing visual system and data-driven clinical renderers. Add a small client-side pathname tracker, express the Diare hierarchy in the protected server-side source data, and register Siriraj as a standalone score definition appended after canonical score conversion.

**Tech Stack:** Next.js 16.3.4 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Vercel.

## Global Constraints

- Preserve the existing light and dark themes.
- Use the existing RFSmed logo and Funnel typography.
- Do not add promotional tagline copy or restore “Cakupan aktual”.
- Clinical copy remains Indonesian and does not use an em dash.
- Siriraj is supportive only and must not replace CT/MRI or determine thrombolysis by itself.
- Push the verified result to `main`; Vercel deploys from GitHub.

---

### Task 1: Homepage and recent-module tracking

**Files:**
- Create: `components/module-visit-tracker.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `tests/visible-copy.test.ts`

**Interfaces:**
- Consumes: `modules: NavModule[]` and `useRecentTools().record(ref: ToolRef)`.
- Produces: `ModuleVisitTracker(): null`, mounted once in the root layout.

- [x] **Step 1: Write failing homepage contract tests**

```ts
const home = readFileSync("app/page.tsx", "utf8");
expect(home).not.toContain("Keputusan klinis yang lebih jelas");
expect(home).not.toContain("Cakupan aktual");
for (const slug of ["igd-toolkit", "emergency", "timer", "pediatric-emergency", "ecg-atlas", "radiology-atlas", "emergency-dose", "bilirubin", "antidotes", "pregnancy-drugs", "electrolytes", "ddx"]) {
  expect(home).toContain(`"${slug}"`);
}
expect(readFileSync("app/layout.tsx", "utf8")).toContain("ModuleVisitTracker");
```

- [x] **Step 2: Verify the test fails**

Run: `npm test -- tests/visible-copy.test.ts`

Expected: FAIL because the old hero and coverage section still exist and no module tracker is mounted.

- [x] **Step 3: Implement the minimal homepage and tracker changes**

```tsx
// components/module-visit-tracker.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { modules } from "@/lib/nav";
import { useRecentTools } from "@/components/use-local-store";

export function ModuleVisitTracker() {
  const pathname = usePathname();
  const { record } = useRecentTools();
  useEffect(() => {
    const item = modules.find((module) => module.href === pathname);
    if (item && pathname !== "/") record({ href: item.href, title: item.name, group: "modul" });
  }, [pathname]);
  return null;
}
```

In `app/layout.tsx`, render `<ModuleVisitTracker />` within `<Providers>`. In `app/page.tsx`, replace the promotional hero with `/rfsmed-logo.png` or the existing RFSmed logo asset plus the bold name, delete the coverage section/imports, and define the approved 13-item primary slug set. Build `primary` from all `modules` so hidden sidebar subtools can appear on the homepage; keep `secondary` limited to visible modules not already primary.

- [x] **Step 4: Verify the focused test passes**

Run: `npm test -- tests/visible-copy.test.ts`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx components/module-visit-tracker.tsx tests/visible-copy.test.ts
git commit -m "feat: simplify homepage and track module visits"
```

### Task 2: Diare Akut treatment hierarchy

**Files:**
- Modify: `lib/data/klinea-canonical.ts`
- Modify: `tests/klinea-adapters.test.ts`

**Interfaces:**
- Consumes: `structuredContent(value): ClinicalContentItem[]`.
- Produces: structured heading objects for strings matching `Rencana Terapi A`, `Rencana Terapi B`, and `Rencana Terapi C`, each owning following treatment items until the next plan heading or antibiotic section.

- [x] **Step 1: Write the failing hierarchy test**

```ts
const diare = GUIDELINES.find((item) => item.slug === "diare-anak");
const plans = diare?.sections.initialManagement?.filter((item) => typeof item !== "string" && /^Rencana Terapi [ABC]/.test(item.heading));
expect(plans).toHaveLength(3);
expect(plans?.every((plan) => typeof plan !== "string" && plan.children.length > 0)).toBe(true);
```

- [x] **Step 2: Verify the test fails**

Run: `npm test -- tests/klinea-adapters.test.ts`

Expected: FAIL because the plan labels are flat strings.

- [x] **Step 3: Add a narrow hierarchy normalizer**

```ts
const groupTreatmentPlans = (items: ClinicalContentItem[]): ClinicalContentItem[] => {
  const output: ClinicalContentItem[] = [];
  let current: Extract<ClinicalContentItem, { heading: string }> | undefined;
  for (const item of items) {
    if (typeof item === "string" && /^Rencana Terapi [ABC]\b/.test(item)) {
      current = { heading: item.replace(/:\s*$/, ""), children: [] };
      output.push(current);
    } else if (current && !(typeof item === "string" && /^Antibiotik\b/.test(item))) {
      current.children.push(item);
    } else {
      current = undefined;
      output.push(item);
    }
  }
  return output;
};
```

Apply it only when `guide.id === "diare-anak"` and `targetKey === "initialManagement"` so no clinical wording changes.

- [x] **Step 4: Verify the focused test passes**

Run: `npm test -- tests/klinea-adapters.test.ts`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add lib/data/klinea-canonical.ts tests/klinea-adapters.test.ts
git commit -m "fix: structure acute diarrhea treatment plans"
```

### Task 3: Siriraj Stroke Score

**Files:**
- Create: `lib/data/siriraj-score.ts`
- Modify: `lib/data/scores.ts`
- Modify: `tests/scores.test.ts`

**Interfaces:**
- Produces: `SIRIRAJ_SCORE: ScoreTool` with a custom `compute(values)` implementing the BMJ formula.
- Consumes: `evaluateScore(tool, values)` and the existing shared score page.

- [x] **Step 1: Write failing calculation and boundary tests**

```ts
describe("Siriraj Stroke Score", () => {
  const s = tool("siriraj-stroke-score");
  it("calculates infarction and hemorrhage examples", () => {
    expect(evaluateScore(s, { consciousness: "0", vomiting: "0", headache: "0", dbp: 80, atheroma: "0" }).total).toBe(-4);
    expect(evaluateScore(s, { consciousness: "2", vomiting: "1", headache: "1", dbp: 120, atheroma: "0" }).total).toBe(9);
  });
  it("keeps minus one through plus one equivocal", () => {
    expect(evaluateScore(s, { consciousness: "0", vomiting: "0", headache: "0", dbp: 110, atheroma: "0" }).range?.category).toBe("Tidak pasti");
  });
});
```

- [x] **Step 2: Verify the test fails**

Run: `npm test -- tests/scores.test.ts`

Expected: FAIL with `missing tool siriraj-stroke-score`.

- [x] **Step 3: Implement and register the score**

```ts
compute: (values) => ({
  total: (2.5 * Number(values.consciousness)) + (2 * Number(values.vomiting)) + (2 * Number(values.headache)) + (0.1 * Number(values.dbp)) - (3 * Number(values.atheroma)) - 12,
}),
ranges: [
  { min: -9999, max: -1.000001, category: "Mengarah ke infark", label: "Skor < -1 mengarah ke infark serebral.", tone: "info" },
  { min: -1, max: 1, category: "Tidak pasti", label: "Skor -1 sampai 1 tidak dapat membedakan tipe stroke.", tone: "warning" },
  { min: 1.000001, max: 9999, category: "Mengarah ke perdarahan", label: "Skor > 1 mengarah ke perdarahan supratentorial.", tone: "danger" },
],
```

Define all five required inputs in Indonesian, cite Poungvarin et al. BMJ 1991 (`https://doi.org/10.1136/bmj.302.6792.1565`), and include a warning that CT/MRI is still required and the result must not determine thrombolysis alone. Export `SCORES` as `[...canonicalScores(RFS_SCORES), SIRIRAJ_SCORE]`.

- [x] **Step 4: Verify focused score tests pass**

Run: `npm test -- tests/scores.test.ts`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add lib/data/siriraj-score.ts lib/data/scores.ts tests/scores.test.ts
git commit -m "feat: add Siriraj stroke score"
```

### Task 4: Full verification and deployment

**Files:**
- Verify all changed files and deployment output.

**Interfaces:**
- Consumes: completed Tasks 1 to 3.
- Produces: a tested GitHub commit set and successful Vercel deployment.

- [x] **Step 1: Run complete automated verification**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: all tests pass, lint and TypeScript return zero, production build succeeds.

- [x] **Step 2: Run browser smoke tests**

Start the production server and verify `/`, `/guidelines/diare-anak`, and `/scores/siriraj-stroke-score` at desktop and mobile widths in both themes. Confirm the homepage logo/name, search, module cards, recent visit entry, nested A/B/C treatment headings, correct score calculations, and no horizontal overflow.

- [x] **Step 3: Review the final diff**

Run: `git diff HEAD~3 --check && git status --short`

Expected: no whitespace errors; only planned files plus plan/spec documentation are changed.

- [x] **Step 4: Push and verify Vercel**

```bash
git push origin main
```

Confirm `https://rfsmed.vercel.app` serves the new homepage, Diare hierarchy, and Siriraj page after the connected Vercel project finishes deploying.
