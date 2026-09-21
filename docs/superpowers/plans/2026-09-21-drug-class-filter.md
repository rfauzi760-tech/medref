# Drug Class Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the drug-class chip wall from Dosis Obat and add a compact class filter to Interaksi Obat.

**Architecture:** Keep interaction checking unchanged. Add a pure suggestion-filter helper, consume it from the Interaksi Obat client, and delete class-filter state and markup from the Dosis Obat client.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Preserve light and dark themes.
- Use one compact native select rather than rendering hundreds of chips.
- Do not change the interaction API or drug dataset.

---

### Task 1: Move drug-class filtering to Interaksi Obat

**Files:**
- Create: `lib/calc/interaction-search.ts`
- Create: `tests/interaction-search.test.ts`
- Modify: `components/catalog-pages/interactions-page-client.tsx`
- Modify: `components/catalog-pages/drugs-page-client.tsx`
- Modify: `app/drugs/page.tsx`

**Interfaces:**
- Produces: `filterInteractionSuggestions(drugs, addedSlugs, query, drugClass, limit)` returning matching unselected drugs.
- Consumes: existing drug summaries with `slug`, `genericName`, optional `brandNames`, and `drugClass`.

- [ ] **Step 1: Write the failing tests**

Add tests proving that the helper filters by class, combines class and text search, excludes selected drugs, and limits results.

- [ ] **Step 2: Verify the tests fail**

Run: `npx vitest run tests/interaction-search.test.ts`

Expected: failure because `filterInteractionSuggestions` does not exist.

- [ ] **Step 3: Implement the pure filter helper**

Normalize query text, require at least two query characters only when no class is selected, match generic names and brands, filter the exact class, exclude added slugs, and return at most eight results.

- [ ] **Step 4: Update both pages**

Delete `drugClasses`, `cls`, and the chip list from Dosis Obat. In Interaksi Obat, derive sorted unique classes, add a labeled `Semua kelas` select beside the search field, use the helper for suggestions, and show a concise empty result message.

- [ ] **Step 5: Verify behavior**

Run:

```bash
npm test
npm run build
npx eslint components/catalog-pages/drugs-page-client.tsx components/catalog-pages/interactions-page-client.tsx lib/calc/interaction-search.ts tests/interaction-search.test.ts
```

Expected: all tests and build pass with no lint errors in changed files.

- [ ] **Step 6: Browser verification and deployment**

Confirm Dosis Obat has no class chips, Interaksi Obat has one class dropdown, combined filtering works, then commit and push to `main` so Vercel deploys the update.
