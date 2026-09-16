# Resusitasi Neonatus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a dedicated, complete, responsive neonatal-at-birth resuscitation schematic in RFSmed and connect it to existing navigation.

**Architecture:** Keep the clinical flow in a server-only typed module, with an explicit directed graph and accompanying source metadata. Render it through a focused Server Component page with semantic headings and labelled branches. Link to that page from the nav, IGD toolkit, IGD algorithms, pediatric emergency, and search; reconcile the existing asphyxia guide with the 2025 guideline.

**Tech Stack:** Next.js 16.3.4 App Router, React 19, TypeScript, Tailwind 4, Vitest 5.

## Global Constraints

- User-visible copy in Bahasa Indonesia, no em dash, clear bold headings.
- Preserve RFSmed light and dark themes and current restrained visual style.
- Clinical decision logic follows AHA/AAP 2025; IDAI material provides Indonesian context. Do not let APGAR delay interventions or recommend routine suction for meconium.
- Contents are for trained clinicians and institutional protocol verification, not individualized advice.
- The prior uncommitted Siriraj regression fix remains in scope for the requested push.

---

### Task 1: Typed clinical flow and tests

**Files:** Create `lib/neonatal-resuscitation.ts`; create `tests/neonatal-resuscitation.test.ts`.

**Interfaces:** Produce `NEONATAL_FLOW` as nodes with `id`, `type`, `title`, `body`, and `branches: { label, to }[]`, plus `NEONATAL_OXYGEN_TARGETS` and `NEONATAL_SOURCES`.

- [ ] **Step 1: Write failing tests** for unique IDs, every branch target resolving, all terminal paths reaching a care/disposition node, decision labels, HR 100/60 thresholds, compressions 3:1, saturation targets, and source URLs.
- [ ] **Step 2: Run `npx vitest run tests/neonatal-resuscitation.test.ts`; expect failure because the module does not exist.**
- [ ] **Step 3: Implement typed graph** with preparation, birth, initial decision, routine care, initial steps, apnea/HR decision, ventilation, breathing distress/CPAP, ventilation correction, HR<60 decision, compressions and alternative airway, persistent HR<60/epinephrine, reversible causes, and postresuscitation nodes. Example:

```ts
{ id: "ventilation", type: "action", title: "Ventilasi tekanan positif", body: ["Mulai dalam menit pertama bila apnea, megap-megap, atau DJ <100/menit."], branches: [{ label: "Evaluasi ulang", to: "heart-rate-after-ventilation" }] }
```

- [ ] **Step 4: Run focused tests and commit this clinical-data slice.**

### Task 2: Dedicated page and navigation

**Files:** Create `app/neonatal-resuscitation/page.tsx` and `components/neonatal-flowchart.tsx`; modify `lib/nav.ts`, `app/igd-toolkit/page.tsx`, `app/pediatric-emergency/page.tsx`, `components/catalog-pages/emergency-page-client.tsx`, `lib/search.ts`, and `app/page.tsx`.

**Interfaces:** Route `/neonatal-resuscitation`; semantic diagram reading `NEONATAL_FLOW`; all links use `next/link`.

- [ ] **Step 1: Add failing navigation test** asserting that the new route is present in module navigation, toolkit, search, and the IGD pathway catalogue.
- [ ] **Step 2: Run focused test; expect missing route.**
- [ ] **Step 3: Implement Server Component and renderer.** Use semantic `section`/`h2`/`h3`, labelled `Ya`/`Tidak` branches, responsive desktop two-column branch display and single-column mobile layout, side panels for preductal SpO2 targets and temperature, visible citations and clinical caution. Do not embed the user image as the sole content.
- [ ] **Step 4: Add nav/toolkit/IGD/pediatric/search/home links and update toolkit count.**
- [ ] **Step 5: Run focused tests and build; inspect desktop/mobile plus dark/light rendering, then commit UI slice.**

### Task 3: Reconcile old guide and release

**Files:** Modify `lib/data/guidelines-extra-c.ts`; add focused assertions to `tests/neonatal-resuscitation.test.ts`.

- [ ] **Step 1: Add failing assertions** against the existing guide for no APGAR-based resuscitation trigger, no routine meconium suction, and 72-hour cooling reference under appropriate eligibility and facility protocol.
- [ ] **Step 2: Run focused test; expect clinical-text failures.**
- [ ] **Step 3: Edit only the affected asphyxia-guide entries**, updating citations to AHA/AAP 2025 and maintaining concise Indonesian prose.
- [ ] **Step 4: Run `npm test`, `npm run lint`, `npm run build`, and `git diff --check`; inspect staged changes for secrets.**
- [ ] **Step 5: Commit feature and Siriraj fix as separate logical commits, push `main` to `origin`, and verify Vercel deployment status when tooling allows.**
