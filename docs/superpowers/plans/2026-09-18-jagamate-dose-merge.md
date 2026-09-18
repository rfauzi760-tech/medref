# Integrasi Dosis Jaga Mate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Seluruh 45 pilihan obat tunggal Jaga Mate terpetakan terhadap RFSmed; kekurangan dosis dan sediaan yang terverifikasi masuk ke kalkulator tanpa menimpa regimen yang sudah ada.

**Architecture:** Audit sumber dipisahkan dari data produksi. Perubahan produksi berupa patch terkurasi yang digabungkan setelah `canonicalDrugs`, karena fungsi itu hanya mengembalikan obat dalam katalog Klinea. Setiap regimen baru memiliki sumber sendiri; yang tidak terverifikasi tetap di laporan audit dan tidak dihitung.

**Tech Stack:** Next.js 16.3.4, React 19, TypeScript, Vitest, data `Drug` RFSmed.

## Global Constraints

- Hanya `Obat Tunggal`: indikasi, usia, rute, dosis, frekuensi, maksimum, sediaan, konversi. Jangan salin Racikan, kalkulator lain, tampilan, akun, atau gamifikasi Jaga Mate.
- Pengguna menyatakan memiliki izin penggunaan dan publikasi data Jaga Mate. Jangan menyimpan sesi, token, kredensial, atau salinan mentah situs di repositori.
- Verifikasi angka aktif terhadap pedoman IDAI/WHO, informasi BPOM, atau label obat resmi; catat sumber dan tanggal telaah. Konflik yang belum selesai tidak menjadi angka kalkulator.
- Pertahankan desain RFSmed dan tema terang/gelap. Jangan membuat duplikat nama generik atau mengganti regimen lama diam-diam.
- Sebelum mengubah kode Next.js, baca panduan yang relevan di `node_modules/next/dist/docs/`, sesuai `AGENTS.md`.

---

### Task 1: Audit 45 obat dan bukti klinis

**Files:**
- Create: `docs/clinical/jagamate-dose-audit.md`
- Read: `lib/data/drugs.ts`, `lib/data/drugs-extra-*.ts`, `lib/data/klinea-canonical.ts`, `lib/types.ts`

**Interfaces:**
- Produces: satu baris per pilihan obat dengan nama sumber, slug RFSmed, indikasi/rute/sediaan yang belum ada, sumber resmi, dan keputusan `tercakup | perkaya | obat baru | tunda`.

- [ ] **Step 1: Pastikan sesi sah aktif.** Di tab Jaga Mate yang dibuka pengguna, pastikan `LOGOUT` dan `TRIAL ACTIVE` tampil. Jangan membuka data di luar hak akses akun itu.
- [ ] **Step 2: Inventarisasi.** Buka `Obat Tunggal`, catat seluruh 45 pilihan dari sembilan kategori, lalu untuk setiap pilihan catat semua opsi indikasi, sediaan, rumus yang terlihat, frekuensi, rute, dan batas maksimum. Gunakan contoh berat 20 kg hanya untuk membaca formula, bukan sebagai validasi klinis. Jangan commit hasil mentah.
- [ ] **Step 3: Buat tabel audit.** Isi `docs/clinical/jagamate-dose-audit.md` dengan baris untuk setiap pilihan; sebutkan bila kalium/natrium diklofenak atau diazepam berdasarkan rute perlu entri berbeda. Jangan menyamakan satu obat hanya dari nama dagangnya.
- [ ] **Step 4: Verifikasi.** Untuk setiap angka yang akan diaktifkan, buka pedoman/label resmi yang relevan, catat URL, populasi, indikasi, rute, interval, dan dosis maksimum. Bila angka sumber tidak sejalan atau sumber primer tidak ditemukan, pilih `tunda` dan jelaskan alasannya. Contoh konsentrasi parasetamol 160 mg/5 mL dapat diverifikasi pada label resmi [DailyMed](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=debfa787-7a48-48b5-94b0-612820524032&type=display).
- [ ] **Step 5: Periksa cakupan.** Hitung tepat 45 pilihan dan satu keputusan final per pilihan. Commit hanya laporan audit yang tidak memuat mirror mentah.

### Task 2: Penggabungan patch obat yang aman

**Files:**
- Create: `lib/data/merge-drug-enrichments.ts`
- Create: `lib/data/jagamate-verified.ts` (ekspor array kosong pada siklus Task 2)
- Create: `tests/merge-drug-enrichments.test.ts`
- Modify: `lib/types.ts`
- Modify: `lib/data/drugs.ts`

**Interfaces:**
- Consumes: `Drug[]` hasil `canonicalDrugs`, patch terverifikasi, dan obat baru terverifikasi.
- Produces: `mergeDrugEnrichments(base: Drug[], patches: DrugEnrichment[], newDrugs: Drug[]): Drug[]`; `DrugDose.source?: ClinicalSource`.

- [ ] **Step 1: Tulis tes gagal.** Dalam `tests/merge-drug-enrichments.test.ts`, uji bahwa patch slug `paracetamol` menambah satu sediaan dan satu regimen tanpa menghapus regimen lama; patch slug tak dikenal, duplikat patch, duplikat obat baru, dan regimen patch tanpa sumber melempar galat. Uji bahwa pemanggilan ulang tidak membuat duplikat.
- [ ] **Step 2: Jalankan tes terarah.** `npm test -- tests/merge-drug-enrichments.test.ts`; harapkan gagal karena fungsi belum ada.
- [ ] **Step 3: Implementasikan helper murni.** Tambahkan `source?: ClinicalSource` pada `DrugDose`. Di `lib/data/merge-drug-enrichments.ts`, gunakan tipe dan alur berikut. Dosis dengan kunci sama dilewati agar penggabungan idempoten; patch slug duplikat, target tak dikenal, dan sumber yang tidak lengkap ditolak.

  ```ts
  import type { DosePreparation, Drug, DrugDose } from "@/lib/types";

  export interface DrugEnrichment {
    slug: string;
    doses?: DrugDose[];
    preparations?: string[];
    dosePreparations?: DosePreparation[];
    keywords?: string[];
  }

  const doseKey = (dose: DrugDose) =>
    [dose.population, dose.route, dose.indication ?? "", dose.text].join("|");

  export function mergeDrugEnrichments(
    base: Drug[], patches: DrugEnrichment[], newDrugs: Drug[],
  ): Drug[] {
    const output = base.map((drug) => ({ ...drug, doses: [...drug.doses] }));
    const indexes = new Map(output.map((drug, index) => [drug.slug, index]));
    const patchSlugs = new Set<string>();

    for (const patch of patches) {
      if (patchSlugs.has(patch.slug)) throw new Error(`Patch ganda: ${patch.slug}`);
      patchSlugs.add(patch.slug);
      const index = indexes.get(patch.slug);
      if (index === undefined) throw new Error(`Obat tidak ditemukan: ${patch.slug}`);
      const old = output[index];
      const keys = new Set(old.doses.map(doseKey));
      const doses = [...old.doses];
      for (const dose of patch.doses ?? []) {
        if (!dose.source?.url) throw new Error(`Sumber dosis tidak lengkap: ${patch.slug}`);
        if (!keys.has(doseKey(dose))) doses.push(dose);
        keys.add(doseKey(dose));
      }
      const preparations = [...new Set([...(old.preparations ?? []), ...(patch.preparations ?? [])])];
      const dosePreparations = [...new Map(
        [...(old.dosePreparations ?? []), ...(patch.dosePreparations ?? [])].map((item) => [item.id, item]),
      ).values()];
      output[index] = {
        ...old, doses, preparations, dosePreparations,
        keywords: [...new Set([...old.keywords, ...(patch.keywords ?? [])])],
      };
    }

    for (const drug of newDrugs) {
      if (indexes.has(drug.slug)) throw new Error(`Obat ganda: ${drug.slug}`);
      if (!drug.source.url || drug.doses.some((dose) => !dose.source?.url)) {
        throw new Error(`Sumber obat tidak lengkap: ${drug.slug}`);
      }
      indexes.set(drug.slug, output.length);
      output.push(drug);
    }
    return output;
  }
  ```

- [ ] **Step 4: Pasang setelah kanonisasi.** Buat `lib/data/jagamate-verified.ts` dengan ekspor `JAGAMATE_ENRICHMENTS: DrugEnrichment[] = []` dan `JAGAMATE_NEW_DRUGS: Drug[] = []`. Di `lib/data/drugs.ts`, gunakan ekspresi berikut; jangan menaruh obat baru hanya di `RFS_DRUGS` karena `canonicalDrugs` akan menghilangkannya.

  ```ts
  export const DRUGS: Drug[] = mergeDrugEnrichments(
    canonicalDrugs(RFS_DRUGS), JAGAMATE_ENRICHMENTS, JAGAMATE_NEW_DRUGS,
  );
  ```
- [ ] **Step 5: Jalankan tes dan commit.** `npm test -- tests/merge-drug-enrichments.test.ts tests/drugs.test.ts`, lalu commit helper dan tes.

### Task 3: Data terverifikasi per kategori

**Files:**
- Modify: `lib/data/jagamate-verified.ts`
- Modify: `docs/clinical/jagamate-dose-audit.md`
- Test: `tests/jagamate-verified.test.ts`, `tests/drugs.test.ts`, `tests/data-validation.test.ts`

**Interfaces:**
- Produces: `JAGAMATE_ENRICHMENTS: DrugEnrichment[]` dan `JAGAMATE_NEW_DRUGS: Drug[]`. Hanya baris audit berstatus `perkaya` atau `obat baru` yang memasok data numerik baru.

- [ ] **Step 1: Tulis tes cakupan dan keselamatan.** Daftar 45 nama sumber beserta slug hasil audit dalam fixture tes. Tegaskan setiap slug ada tepat sekali pada `DRUGS`, setiap `DrugDose` baru mempunyai sumber resmi dengan URL, dan sediaan otomatis memiliki konsentrasi positif serta rute yang cocok. Tambahkan kasus angka spesifik berdasarkan audit: berat 20 kg, batas per dosis/hari, serta konversi mg ke mL untuk tiap regimen numerik baru.
- [ ] **Step 2: Jalankan tes terarah.** `npm test -- tests/jagamate-verified.test.ts tests/drugs.test.ts tests/data-validation.test.ts`; harapkan kegagalan pada data yang belum dimasukkan.
- [ ] **Step 3: Masukkan data secara bertahap.** Isi `lib/data/jagamate-verified.ts` dari baris audit terverifikasi, per kategori. Pertahankan regimen lama; gunakan `DrugDose.source` untuk sumber regimen baru. Jangan aktifkan `weightBased` bila usia, rute, satuan, frekuensi, atau batas maksimum belum dapat dipastikan. Untuk sediaan ambigu, simpan teks saja tanpa `DosePreparation`.
- [ ] **Step 4: Uji dan commit per kelompok kategori.** Jalankan tes Task 3 setelah tiap kelompok analgesik/antialergi, antiinfeksi, emergensi/gastrointestinal, serta kortikosteroid/neurologi/respirasi. Commit perubahan yang lulus masing-masing siklus; status `tunda` tetap dicatat, tidak dihapus dari audit.

### Task 4: Atribusi dosis dan verifikasi akhir

**Files:**
- Modify: `lib/calc/drugs.ts`
- Modify: `components/pediatric-dose-form.tsx`
- Modify: `tests/drugs.test.ts`
- Read: `node_modules/next/dist/docs/`

**Interfaces:**
- Consumes: `DrugDose.source` bila ada; fallback ke `Drug.source` untuk dosis lama.
- Produces: sumber yang terlihat dan ikut tersalin bersama hasil regimen yang dipilih.

- [ ] **Step 1: Tulis tes gagal.** Di `tests/drugs.test.ts`, pastikan `doseToText` memakai `out.entry.source` untuk regimen baru dan `drug.source` untuk regimen lama. Tambahkan tes regresi bahwa pemilihan indikasi/rute tidak memilih dosis lain secara diam-diam.
- [ ] **Step 2: Jalankan tes.** `npm test -- tests/drugs.test.ts`; harapkan tes sumber regimen gagal.
- [ ] **Step 3: Implementasi.** Di `doseToText`, ganti baris sumber menjadi berikut. Di `PediatricDoseForm`, tampilkan organisasi, judul, tahun, dan tautan sumber untuk hasil terpilih bila `entry.source` ada, tanpa mengganti `SourceBlock` obat lama.

  ```ts
  const source = out.entry.source ?? drug.source;
  lines.push(`Sumber: ${source.org}, ${source.title} (${source.year})`);
  ```
- [ ] **Step 4: Verifikasi.** Jalankan `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, lalu periksa halaman obat desktop/mobile pada tema terang dan gelap. Pastikan semua 45 baris audit berstatus akhir; laporkan yang ditunda secara eksplisit. Commit setelah semua pemeriksaan lulus.

## Self-review

Plan ini mencakup inventaris, penggabungan setelah kanonisasi, sumber per regimen, data klinis terverifikasi, kegagalan aman, dan pengujian. Angka klinis yang belum ditemukan tidak diisi secara spekulatif: audit Task 1 menjadi masukan terukur untuk Task 3. Perbedaan sumber tidak boleh diselesaikan dengan memilih angka terbesar atau terkecil secara otomatis.
