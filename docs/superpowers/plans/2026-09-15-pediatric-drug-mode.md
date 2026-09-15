# Pediatric Drug Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Menambahkan mode dosis obat anak yang dapat memilih regimen dan mengonversi dosis akhir menjadi volume atau unit sediaan dengan batas keselamatan yang jelas.

**Architecture:** Pertahankan halaman server untuk memilih data obat, lalu letakkan seluruh interaksi pada `DrugView` sebagai Client Component kecil. Pindahkan pemilihan regimen, rentang dosis, pembatasan maksimum, parsing sediaan aman, dan konversi ke fungsi murni dalam `lib/calc/drugs.ts` agar dapat diuji tanpa browser.

**Tech Stack:** Next.js 16.3.4 App Router, React 19.2.8, TypeScript 5, Tailwind CSS 4, Vitest 5.

## Global Constraints

- Pertahankan layout, tipografi, warna, dan tema terang/gelap RFSmed.
- Semua teks antarmuka harus berbahasa Indonesia dan tidak memakai em dash.
- Jangan menyalin basis data, aset, atau tampilan situs referensi.
- Kalkulator wajib menampilkan sumber dan peringatan verifikasi klinis.
- Perubahan perilaku harus dibuat dengan tes gagal terlebih dahulu.

---

### Task 1: Perluas kontrak kalkulator dosis

**Files:**
- Modify: `lib/types.ts`
- Modify: `lib/calc/drugs.ts`
- Test: `tests/drugs.test.ts`

**Interfaces:**
- Consumes: `Drug`, `DrugDose`, dan `MgPerKgDose` yang ada.
- Produces: `DosePreparation`, `parseDosePreparations()`, input `doseIndex`, dan output rentang serta konversi sediaan.

- [x] **Step 1: Write the failing tests**

Tambahkan tes yang membuktikan neonatus dipilih sebelum pediatrik, `doseIndex` memilih regimen persis, dosis min/max tidak diringkas menjadi nilai tengah, maksimum diterapkan, dan `120 mg/5 mL` menghasilkan volume yang benar.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/drugs.test.ts`

Expected: FAIL karena kontrak regimen/rentang/sediaan belum tersedia dan neonatus masih salah pilih.

- [x] **Step 3: Write minimal implementation**

Tambahkan metadata sediaan opsional, parser konservatif untuk pola tunggal `amount unit / carrier unit`, pemilihan entri berdasarkan indeks, perhitungan dosis minimum dan maksimum, pembatasan maksimum, serta konversi akhir.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/drugs.test.ts`

Expected: PASS.

### Task 2: Tambahkan mode anak pada katalog obat

**Files:**
- Modify: `app/drugs/page.tsx`
- Modify: `components/catalog-pages/drugs-page-client.tsx`
- Modify: `lib/nav.ts`
- Test: `tests/visible-copy.test.ts`

**Interfaces:**
- Consumes: ringkasan obat dan keberadaan entri `pediatric`, `neonatal`, atau `all`.
- Produces: query `?mode=anak`, filter katalog, dan pintasan navigasi menuju mode anak.

- [x] **Step 1: Write the failing test**

Tambahkan assertion bahwa teks `Dosis Obat Anak` dan rute `/drugs?mode=anak` ada pada konfigurasi antarmuka.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/visible-copy.test.ts`

Expected: FAIL karena pintasan belum ada.

- [x] **Step 3: Write minimal implementation**

Kirim flag `hasPediatricDose` pada ringkasan obat, baca `mode` melalui `useSearchParams`, tambahkan tombol `Semua` dan `Anak`, lalu buat item navigasi `Dosis Obat Anak` yang menggunakan basis data yang sama.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/visible-copy.test.ts`

Expected: PASS.

### Task 3: Bangun formulir kalkulator pediatrik

**Files:**
- Create: `components/pediatric-dose-form.tsx`
- Modify: `components/drug-view.tsx`
- Test: `tests/drugs.test.ts`

**Interfaces:**
- Consumes: `Drug`, `calculateDose()`, `parseDosePreparations()`, dan pilihan regimen.
- Produces: formulir aksesibel untuk usia, berat, indikasi/rute, dan sediaan, serta panel hasil.

- [x] **Step 1: Write the failing test**

Tambahkan test fungsi pilihan regimen yang memastikan label unik terdiri dari populasi, indikasi, dan rute, serta tidak memilih regimen yang tidak tersedia.

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/drugs.test.ts`

Expected: FAIL karena helper pilihan belum tersedia.

- [x] **Step 3: Write minimal implementation**

Pisahkan formulir dari konten obat, gunakan elemen `label`, `input`, dan `select` native, tampilkan hasil rentang dosis, total harian, volume/unit, batas maksimum, dan alasan bila konversi tidak tersedia.

- [x] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/drugs.test.ts`

Expected: PASS.

### Task 4: Verifikasi regresi dan tampilan

**Files:**
- Modify: file yang terbukti perlu dari hasil lint/build/browser check saja.

**Interfaces:**
- Consumes: seluruh perubahan Task 1 sampai 3.
- Produces: build produksi dan alur browser yang tervalidasi.

- [x] **Step 1: Run the complete automated checks**

Run: `npm test && npm run lint && npm run build`

Expected: seluruh test PASS, lint tanpa error, dan build selesai.

- [x] **Step 2: Verify in a browser**

Periksa katalog `/drugs?mode=anak` dan minimal satu obat dengan sediaan cair pada 320 px serta desktop, dalam tema terang dan gelap. Pastikan navigasi keyboard, heading, hasil, peringatan, dan konsol browser bersih.

- [x] **Step 3: Commit the implementation**

Run: `git add app components lib tests docs && git commit -m "feat: add pediatric drug dosing mode"`

Expected: commit berhasil dan worktree bersih.
