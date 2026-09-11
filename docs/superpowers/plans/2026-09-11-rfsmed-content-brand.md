# RFSmed Content and Brand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Klinea the canonical source for RFSmed clinical content, rebrand the application, strengthen heading hierarchy, remove visible em dashes, and localize the interface to Indonesian.

**Architecture:** Vendor an auditable snapshot of Klinea's public content bundles and normalize them deterministically into a local JSON artifact. Typed adapters expose canonical Klinea records through the existing Next.js data interfaces, while calculation mechanics remain in tested application code.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node VM importer, Vitest, Tailwind CSS 4, Vercel.

## Global Constraints

- Klinea is the canonical source for overlapping clinical copy and catalog records.
- Production must not fetch Klinea at runtime.
- User-visible interface copy must be Indonesian and contain no em dash character.
- International clinical names and abbreviations remain unchanged when medically clearer.
- All `h1`, `h2`, and `h3` headings are bold.
- Preserve light and dark themes, search, calculations, and Vercel Analytics.

---

### Task 1: Canonical Klinea snapshot and importer

**Files:**
- Create: `vendor/klinea/data.js`
- Create: `vendor/klinea/data2.js`
- Create: `vendor/klinea/data3.js`
- Create: `vendor/klinea/data4.js`
- Create: `vendor/klinea/source.json`
- Create: `scripts/import-klinea.mjs`
- Create: `lib/generated/klinea-content.json`
- Create: `tests/klinea-source.test.ts`

**Interfaces:**
- Produces: normalized JSON keys `tools`, `toolExtra`, `drugs`, `drugGroups`, `interactions`, `guidelines`, `guidelineExtra`, `icd10`, `foods`, `nutrition`, and `milestones`.

- [ ] **Step 1: Write the failing source test**

Assert the generated artifact has 163 tools, 517 drugs, 152 interaction rules, 340 guidelines, 340 detailed guideline records, 638 ICD records, 478 foods, 16 nutrition guides, and 16 milestones. Recursively assert that generated strings contain no `—`.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/klinea-source.test.ts`; expect failure because the canonical artifact does not exist.

- [ ] **Step 3: Snapshot and normalize**

Download the four owner-authorized public bundles, record SHA-256 checksums, execute them in an isolated Node VM, omit executable score functions, recursively replace em dashes with ` - `, and serialize the named catalogs to `lib/generated/klinea-content.json`.

- [ ] **Step 4: Verify green state and commit**

Run `node scripts/import-klinea.mjs && npx vitest run tests/klinea-source.test.ts`; expect all assertions to pass, then commit the snapshot, importer, generated artifact, and test.

### Task 2: Typed canonical data adapters

**Files:**
- Create: `lib/data/klinea-canonical.ts`
- Modify: `lib/data/scores.ts`
- Modify: `lib/data/drugs.ts`
- Modify: `lib/data/guidelines.ts`
- Modify: `lib/data/interactions.ts`
- Modify: `lib/data/icd10.ts`
- Modify: `lib/data/foods.ts`
- Modify: `lib/data/nutritionGuidance.ts`
- Modify: `lib/data/milestones.ts`
- Modify: `tests/data-validation.test.ts`
- Modify: `tests/content-coverage.test.ts`

**Interfaces:**
- Produces: `canonicalScores(base)`, `canonicalDrugs`, `canonicalGuidelines`, `canonicalInteractions`, `canonicalIcd10`, `canonicalFoods`, `canonicalNutrition`, and `canonicalMilestones` using existing application types.

- [ ] **Step 1: Add failing adapter assertions**

Assert canonical catalog counts and representative Indonesian records such as `Hipertensi`, `Parasetamol`, and `Nasi putih` through the existing module exports.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/data-validation.test.ts tests/content-coverage.test.ts`; expect canonical count or content assertions to fail.

- [ ] **Step 3: Implement adapters**

Map Klinea field names to current typed interfaces. Overlay score presentation fields by canonical identifier while retaining tested score variables and computation. Replace drugs, guidelines, interactions, ICD-10, foods, nutrition guidance, and milestones with normalized Klinea catalogs.

- [ ] **Step 4: Verify green state and commit**

Run the adapter tests and affected clinical tests; expect all to pass, then commit adapters and module wiring.

### Task 3: RFSmed branding and logo

**Files:**
- Create: `public/rfsmed-logo.png`
- Modify: `lib/nav.ts`
- Modify: `components/shell.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/manifest.ts`
- Modify: `app/page.tsx`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- Produces: `appName = "RFSmed"` without a brand tagline and an optimized transparent logo asset.

- [ ] **Step 1: Add failing brand assertions**

Assert visible source uses `RFSmed`, references `/rfsmed-logo.png`, removes the sidebar tagline, and composes metadata without `appTagline`.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/frontend-contract.test.ts`; expect brand assertions to fail.

- [ ] **Step 3: Apply brand assets and copy**

Optimize the supplied 1254px transparent PNG, update navigation and metadata, simplify the rail brand block, remove the homepage brand tagline, and preserve functional page descriptions.

- [ ] **Step 4: Verify green state and commit**

Run the frontend contract test and visually inspect desktop and mobile branding, then commit.

### Task 4: Bold hierarchy and Indonesian interface

**Files:**
- Modify: `app/globals.css`
- Modify: user-facing files under `app/`, `components/`, and `lib/calc/`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- Produces: bold `h1` to `h3`, Indonesian interface labels, and no em dash in rendered source strings.

- [ ] **Step 1: Add failing language and typography assertions**

Assert global bold heading rules, representative Indonesian labels, and absence of em dashes in user-facing application and component source files.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/frontend-contract.test.ts`; expect typography, language, and punctuation assertions to fail.

- [ ] **Step 3: Apply the language system**

Add the global heading rule, replace light or medium heading utilities with bold where necessary, translate interface controls and results, and mechanically replace remaining visible em dashes with context-safe punctuation.

- [ ] **Step 4: Verify green state and commit**

Run the frontend contract and clinical tool tests; expect all assertions to pass, then commit.

### Task 5: Production verification and deployment

**Files:**
- Modify: no additional source files expected

- [ ] **Step 1: Verify the full application**

Run `npm test && npm run lint && npm run build`; require zero test or build failures and zero lint errors.

- [ ] **Step 2: Visual verification**

Inspect the homepage, search, one score, one drug, one guideline, nutrition, and mobile navigation in light and dark themes.

- [ ] **Step 3: Merge and deploy**

Merge the feature branch into `main`, rerun tests, push `main`, and wait for the Vercel GitHub deployment status to report success.
