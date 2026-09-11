# Search and Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add global Vercel Web Analytics and replace the oversized search overlay styling with a compact accessible command palette.

**Architecture:** Keep the existing search state, ranking, and keyboard behavior in `GlobalSearch`; change only its dialog structure and semantic styling. Mount Vercel's official `Analytics` component once from the root layout.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Vitest, `@vercel/analytics`.

## Global Constraints

- Preserve both light and dark themes.
- Preserve existing search data, ranking, navigation, and keyboard behavior.
- Do not add custom analytics events or collect additional user input.

---

### Task 1: Search command palette

**Files:**
- Modify: `components/global-search.tsx`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- Consumes: `globalSearch(query)` and `SearchHit` from `lib/search.ts`
- Produces: unchanged `GlobalSearch({ autoFocus, onNavigate })` component API

- [ ] **Step 1: Add a failing structural test**

Assert that `global-search.tsx` contains `data-search-palette`, `focus-within:border-accent`, and a compact `max-w-2xl` dialog.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/frontend-contract.test.ts`; expect the new assertion to fail.

- [ ] **Step 3: Implement the compact palette**

Use a single 52px search row, container-level focus treatment, a contained close button, concise pre-query guidance, grouped results, and a compact keyboard footer. Retain all existing state and keyboard handlers.

- [ ] **Step 4: Verify green state**

Run `npx vitest run tests/frontend-contract.test.ts`; expect all assertions to pass.

### Task 2: Vercel Analytics and deployment

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `app/layout.tsx`
- Modify: `tests/frontend-contract.test.ts`

**Interfaces:**
- Consumes: `Analytics` from `@vercel/analytics/next`
- Produces: one global `<Analytics />` mount in `RootLayout`

- [ ] **Step 1: Add a failing Analytics contract test**

Assert that `app/layout.tsx` imports `@vercel/analytics/next` and renders `<Analytics />`.

- [ ] **Step 2: Verify red state**

Run `npx vitest run tests/frontend-contract.test.ts`; expect the Analytics assertion to fail.

- [ ] **Step 3: Install and mount Analytics**

Run `npm install @vercel/analytics`, import `Analytics`, and render it after the application providers inside `<body>`.

- [ ] **Step 4: Verify and ship**

Run `npm test && npm run lint && npm run build`; commit the changes, merge into `main`, and push `main` to trigger the connected Vercel deployment.
