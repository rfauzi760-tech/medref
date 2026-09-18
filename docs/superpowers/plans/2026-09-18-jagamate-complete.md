# Jaga Mate Complete Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Semua pilihan Obat Tunggal, Racikan, dan empat kelompok kalkulator yang terlihat di Jaga Mate tersedia dan dapat ditemukan di RFSmed tanpa menampilkan hitungan klinis yang belum aman.

**Architecture:** Data 45 pilihan disimpan sebagai peta slug, bukan salinan mentah situs. Mesin Racikan hanya menghitung regimen dan sediaan oral yang dipilih secara eksplisit; input dan batas diuji pada fungsi murni. Kalkulator tambahan menjadi fungsi murni dengan formulir kecil, sementara alat yang sudah ada ditautkan dari indeks baru.

**Tech Stack:** Next.js 16.3.4, React 19.2.8, TypeScript, Vitest, Tailwind 4.

## Global Constraints

- Pertahankan desain RFSmed dan dua tema; semua UI baru berbahasa Indonesia, heading tebal, tanpa em dash.
- Jangan menyimpan akun, sesi, atau salinan mentah Jaga Mate.
- Usia, berat, indikasi, rute, dosis, dan sediaan wajib jelas sebelum menampilkan hasil angka; jangan membulatkan tablet otomatis.
- Angka klinis baru harus memiliki sumber primer spesifik; pilihan tanpa verifikasi tetap terlihat sebagai teks dengan alasan penahanan.
- Baca panduan Next.js dari `node_modules/next/dist/docs/` sebelum mengubah halaman atau komponen.

---

### Task 1: Peta cakupan dan tautan fitur yang telah ada

**Files:** Create `lib/data/jagamate-choices.ts`, `app/jagamate-tools/page.tsx`, `tests/jagamate-coverage.test.ts`; modify `lib/nav.ts`.

**Interfaces:** Export `JAGAMATE_DRUG_CHOICES: { sourceName: string; slug: string }[]` of length 45. The index route links existing `/calculators/holliday-segar`, `/calculators/fluid-deficit`, `/scores/gcs`, `/anthropometry`, `/calculators/bmi`, and new routes built below.

- [ ] Write a failing Vitest count-and-slug test: each of the 45 choices is unique by source name and resolves in `DRUGS_BY_SLUG`.
- [ ] Run `npx vitest run tests/jagamate-coverage.test.ts` and observe failure.
- [ ] Add the exact 45 name-to-slug pairs from the existing audit, plus a compact index in the RFSmed card style. Do not import all 518 drugs into a client bundle.
- [ ] Rerun the focused test and commit as `feat: expose complete Jaga Mate tool inventory`.

### Task 2: Racikan calculation and safety gates

**Files:** Create `lib/calc/racikan.ts`, `tests/racikan.test.ts`, `components/racikan-form.tsx`, `app/drugs/racikan/page.tsx`.

**Interfaces:** Export `calculateRacikan(input)` with age in years, weight in kg, number of packets, frequency, and selected ingredients. Each ingredient provides drug slug, exact dose index, exact preparation ID, and optional target mg/kg within an allowed range. Return per-ingredient per-packet mg, batch mg, exact tablet equivalent, warnings, or a typed blocked reason.

- [ ] Write failing pure-function tests for a valid 20 kg/10-packet paracetamol example, minimum/maximum target bounds, invalid age or weight, liquid/injectable rejection, unsupported dose, mismatched route, and a two-drug worksheet whose compatibility is explicitly unverified.
- [ ] Run `npx vitest run tests/racikan.test.ts` and observe failure.
- [ ] Implement arithmetic through `calculateDose` and verified product selection. For weight-based ranges require explicit target selection; for per-day regimens require a verified frequency or withhold per-packet calculation. Do not generate a final compounding instruction if any ingredient is blocked.
- [ ] Build the form using server-provided names and selected-dose metadata, with labels, keyboard access, removable ingredients, copyable verified worksheet, and a visible pharmaceutical compatibility warning. Keep the existing visual tokens.
- [ ] Run focused tests, TypeScript, browser interaction in both themes, then commit as `feat: add guarded pediatric racikan worksheet`.

### Task 3: Missing clinical calculators

**Files:** Create `lib/calc/jagamate-tools.ts`, `tests/jagamate-tools.test.ts`, `components/jagamate-tools-form.tsx`, `app/jagamate-tools/[tool]/page.tsx`; modify the index from Task 1.

**Interfaces:** Export separate pure functions `calculateDiarrheaPlan`, `calculatePregnancyDating`, `calculateFundalEstimate`, and `calculateBurnResuscitation`, each with a discriminated result (`ok` or `blocked`) and source/limitation text.

- [ ] Verify WHO diarrhea Plan A/B/C, ACOG LMP dating, and a burn guideline before coding numeric formulas. Record exact URLs next to the tool definitions.
- [ ] Write failing tests for representative inputs and exclusion cases: Plan B 75 mL/kg, Plan C age bands, future HPHT rejection, and burn percent/age/timing restrictions.
- [ ] Run `npx vitest run tests/jagamate-tools.test.ts` and observe failure.
- [ ] Implement formulas as pure functions and render small RFSmed forms. Reuse existing GCS, Holliday-Segar, fluid deficit, BMI, and anthropometry rather than duplicate them. If a formula lacks adequate evidence, show an explanation without a numeric output.
- [ ] Run focused tests and browser checks, then commit as `feat: complete clinical calculator coverage`.

### Task 4: Release audit

**Files:** Modify `docs/clinical/jagamate-dose-audit.md` and navigation/index copy as needed.

- [ ] Verify all 45 drug choices appear in Obat Tunggal and Racikan, and all four source calculator categories resolve to a working tool or an explicit source-placeholder equivalence.
- [ ] Run `npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`; inspect dark/light browser UI, invalid inputs, and console errors.
- [ ] Review the clinical exclusions and document which source choices are intentionally text-only.
- [ ] Merge the worktree branch into `main` only after tests pass, then push the requested Git remote and verify Vercel deployment. Do not claim publication until the live URL responds with the new routes.
