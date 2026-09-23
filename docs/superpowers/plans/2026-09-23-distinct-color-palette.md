# Distinct color palette Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the green light and dark theme with the supplied periwinkle/cyan and navy/plum palettes.

**Architecture:** Keep the existing theme switch and map semantic CSS custom properties to light and dark values. Update only brand surfaces and browser/PWA color metadata that still contain the old palette.

**Tech Stack:** Next.js 16.3.4 App Router, Tailwind CSS 4, global CSS custom properties.

## Global Constraints

- Do not change dependencies or the theme switching behavior.
- Preserve semantic success, warning, and danger colors.
- Preserve explicit clinical source attribution; do not use a generic fallback when a catalog entry lacks a reference.
- Leave unrelated user changes in the working tree untouched.
- Do not add or run tests unless the user asks.

---

### Task 1: Update shared theme tokens and browser colors

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/manifest.ts`
- Modify: `app/page.tsx`
- Modify: `app/drugs/page.tsx`
- Modify: `app/scores/[slug]/page.tsx`
- Modify: `app/drugs/[slug]/page.tsx`
- Modify: `lib/calc/scores.ts`
- Modify: `components/shell.tsx`
- Modify: `components/jagamate-tools-form.tsx`
- Modify: `components/score-tool.tsx`
- Modify: `components/racikan-form.tsx`
- Modify: `components/pediatric-emergency-calculator.tsx`
- Modify: `components/protocol-timer.tsx`
- Modify: `components/catalog-pages/drugs-page-client.tsx`
- Modify: `components/catalog-pages/guidelines-page-client.tsx`
- Modify: `components/catalog-pages/immunization-page-client.tsx`
- Modify: `public/icon.svg`
- Modify: `public/icon-192.svg`
- Modify: `public/icon-512.svg`
- Modify: `lib/data/klinea-canonical.ts`
- Modify: `components/source-block.tsx`

**Interfaces:**
- Consumes: Existing `.dark` theme class from `next-themes` and CSS custom properties.
- Produces: Updated `--canvas`, `--surface`, `--surface-raised`, `--ink`, `--muted`, `--line`, `--accent`, `--accent-strong`, and `--accent-ink` values consumed by existing components.

- [x] **Step 1: Replace the light and dark values in `app/globals.css`** with the approved palette mapping and a contrast-safe light `--accent-strong` value of `#4351DD`.
- [x] **Step 2: Update theme metadata** in `app/layout.tsx` and `app/manifest.ts` to use `#E2FDFF` for light surfaces, `#0D0C1D` for dark surfaces, and `#5465FF` for the installed-app accent.
- [x] **Step 3: Remove remaining green brand tile backgrounds** from `app/page.tsx` and `components/shell.tsx`, keep the tiles white in both themes, and tint the existing logo mark with the same hue rotation in both themes.
- [x] **Step 4: Recolor the SVG app icon backgrounds** in `public/icon.svg`, `public/icon-192.svg`, and `public/icon-512.svg` to `#5465FF`.
- [x] **Step 5: Make `sourceFrom` return only explicit, allowed references** in `lib/data/klinea-canonical.ts`, and guard `SourceBlock` against displaying a source whose organization, title, or URL contains a blocked brand/domain.
- [x] **Step 6: Use the contrast-safe button token** for solid active controls in the listed form, score, timer, pediatric, catalog, and drug-tab components.
- [x] **Step 7: Review the diff and search for remaining old brand colors and displayed source names** in the touched files; preserve green semantic states and accurate explicit references elsewhere.
- [x] **Step 8: Set all dark-mode typography to white** and verify the updated contrast in the live local preview.

### Task 2: Review the final change

**Files:**
- Review: `app/globals.css`, `app/layout.tsx`, `app/manifest.ts`, `app/page.tsx`, `app/drugs/page.tsx`, `app/scores/[slug]/page.tsx`, `app/drugs/[slug]/page.tsx`, `lib/calc/scores.ts`, `components/shell.tsx`, `components/source-block.tsx`, `components/jagamate-tools-form.tsx`, `components/score-tool.tsx`, `components/racikan-form.tsx`, `components/pediatric-emergency-calculator.tsx`, `components/protocol-timer.tsx`, `components/catalog-pages/drugs-page-client.tsx`, `components/catalog-pages/guidelines-page-client.tsx`, `components/catalog-pages/immunization-page-client.tsx`, `lib/data/klinea-canonical.ts`, `public/icon.svg`, `public/icon-192.svg`, `public/icon-512.svg`

**Interfaces:**
- Consumes: Updated shared CSS tokens and metadata.
- Produces: A scoped diff with no changes to unrelated user edits.

- [x] **Step 1: Inspect the working diff** over the listed files and confirm formatting is clean.
- [x] **Step 2: Preserve the pre-existing score implementation and test edits as unstaged changes.**
