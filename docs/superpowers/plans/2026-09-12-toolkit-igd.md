# RFSmed Toolkit IGD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan Toolkit IGD lengkap, Atlas EKG, dan segmen Imaging ke RFSmed dengan kalkulasi teruji dan data klinis server-only.

**Architecture:** Setiap katalog klinis disimpan dalam modul `server-only` dan disajikan melalui API privat. Kalkulator memakai fungsi TypeScript murni yang diuji terpisah, sementara halaman klien hanya menangani input, pencarian, filter, dan presentasi.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Pertahankan desain RFSmed dan tema terang serta gelap.
- Seluruh teks pengguna memakai Bahasa Indonesia dan tidak memakai em dash.
- Gunakan materi yang dapat dibuka secara sah dan referensi klinis primer.
- Jangan menaruh materi klinis lengkap dalam berkas statis publik.
- Semua pilihan tunggal harus benar-benar eksklusif.

---

### Task 1: Hub Toolkit IGD

**Files:**
- Create: `app/igd-toolkit/page.tsx`
- Create: `components/igd-toolkit-page-client.tsx`
- Modify: `lib/nav.ts`
- Test: `tests/igd-toolkit.test.ts`

**Interfaces:**
- Produces: halaman `/igd-toolkit` dengan tautan ke seluruh alat IGD.

- [ ] Tulis uji yang memastikan seluruh kartu alat, Atlas EKG, dan Imaging memiliki rute unik.
- [ ] Jalankan `npm test -- --run tests/igd-toolkit.test.ts` dan pastikan uji gagal karena hub belum ada.
- [ ] Buat hub yang memakai komponen kartu, tipografi, warna, dan tema RFSmed yang sudah ada.
- [ ] Tambahkan `Toolkit IGD` ke navigasi dan kelompokkan Atlas EKG serta Imaging secara terpisah.
- [ ] Jalankan uji yang sama dan pastikan lulus.

### Task 2: Kalkulator Bilirubin Neonatus

**Files:**
- Create: `lib/calc/bilirubin.ts`
- Create: `components/bilirubin-calculator.tsx`
- Create: `app/bilirubin/page.tsx`
- Test: `tests/bilirubin.test.ts`

**Interfaces:**
- Produces: `calculateBilirubinThreshold(input)` yang mengembalikan ambang fototerapi, eskalasi perawatan, transfusi tukar, selisih TSB, dan kategori tindak lanjut.

- [ ] Tulis uji untuk usia gestasi 35 sampai 40 minggu, usia postnatal dalam jam, faktor risiko, dan batas input.
- [ ] Jalankan uji bilirubin dan pastikan fungsi belum tersedia.
- [ ] Implementasikan tabel ambang AAP 2022 dengan interpolasi terbatas pada rentang resmi.
- [ ] Buat formulir dengan usia gestasi, usia postnatal, faktor risiko, TSB, dan albumin opsional.
- [ ] Jalankan uji bilirubin dan build halaman.

### Task 3: Panduan Toksikologi dan Antidot

**Files:**
- Create: `lib/data/antidotes.ts`
- Create: `app/api/antidotes/route.ts`
- Create: `components/antidote-page-client.tsx`
- Create: `app/antidotes/page.tsx`
- Test: `tests/antidotes.test.ts`

**Interfaces:**
- Produces: katalog toksin, antidot, indikasi, dosis dewasa dan anak, alternatif, pemantauan, peringatan, ketersediaan, serta sumber.

- [ ] Tulis uji jumlah entri, keunikan ID, struktur dosis, dan hasil pencarian sinonim.
- [ ] Jalankan uji dan pastikan katalog belum tersedia.
- [ ] Susun data dari halaman yang dapat dibuka, lalu simpan sebagai `server-only`.
- [ ] Buat API dengan `Cache-Control: private, no-store`.
- [ ] Buat daftar yang dapat dicari dan difilter dengan detail bertingkat yang mudah dibaca.
- [ ] Jalankan uji katalog dan rute.

### Task 4: Obat pada Kehamilan dan Menyusui

**Files:**
- Create: `lib/data/pregnancy-drugs.ts`
- Create: `app/api/pregnancy-drugs/route.ts`
- Create: `components/pregnancy-drugs-page-client.tsx`
- Create: `app/pregnancy-drugs/page.tsx`
- Test: `tests/pregnancy-drugs.test.ts`

**Interfaces:**
- Produces: katalog obat dengan kategori, penilaian kehamilan, penilaian menyusui, catatan trimester, dan ringkasan klinis.

- [ ] Tulis uji skema, kategori, pencarian nama, dan penjelasan sistem peringkat.
- [ ] Jalankan uji dan pastikan katalog belum tersedia.
- [ ] Susun data yang dapat dibuka ke modul `server-only` tanpa mengubah makna klinis.
- [ ] Buat API privat dan halaman pencarian dengan filter kategori.
- [ ] Tampilkan peringatan bahwa kategori historis tidak menggantikan penilaian risiko individual.
- [ ] Jalankan uji katalog dan rute.

### Task 5: Dosis Obat IGD dan Koreksi Elektrolit

**Files:**
- Create: `lib/calc/emergency-dose.ts`
- Create: `lib/calc/electrolytes.ts`
- Create: `components/emergency-dose-calculator.tsx`
- Create: `components/electrolyte-calculator.tsx`
- Create: `app/emergency-dose/page.tsx`
- Create: `app/electrolytes/page.tsx`
- Test: `tests/emergency-dose.test.ts`
- Test: `tests/electrolytes.test.ts`

**Interfaces:**
- Produces: fungsi konversi dosis dan infus dua arah serta kalkulasi natrium, kalium, kalsium, magnesium, anion gap, osmolaritas, dan defisit air.

- [ ] Tulis uji dimensional untuk dosis, konsentrasi, laju infus, dan koreksi elektrolit.
- [ ] Jalankan uji dan pastikan fungsi baru belum tersedia.
- [ ] Implementasikan fungsi murni dengan validasi rentang dan pembulatan eksplisit.
- [ ] Buat halaman dosis dewasa dan anak serta halaman elektrolit dengan kontrol pilihan tunggal.
- [ ] Jalankan uji untuk kedua modul.

### Task 6: Mesin Diagnosis Banding

**Files:**
- Create: `lib/data/ddx.ts`
- Create: `lib/calc/ddx.ts`
- Create: `app/api/ddx/route.ts`
- Create: `components/ddx-page-client.tsx`
- Create: `app/ddx/page.tsx`
- Test: `tests/ddx.test.ts`

**Interfaces:**
- Produces: `rankDifferentials(findings)` yang memberi urutan diagnosis, kecocokan, temuan pendukung, temuan yang berlawanan, dan tanda bahaya.

- [ ] Tulis uji kasus nyeri dada, sesak, demam, nyeri perut, sakit kepala, dan penurunan kesadaran.
- [ ] Jalankan uji dan pastikan mesin belum tersedia.
- [ ] Bangun basis pengetahuan terbatas dari materi yang dapat dibuka dan tandai hasil sebagai dukungan keputusan.
- [ ] Buat API privat yang memvalidasi jumlah dan panjang temuan.
- [ ] Buat pemilih temuan dan daftar hasil yang transparan tanpa menampilkan diagnosis sebagai kepastian.
- [ ] Jalankan uji mesin dan rute.

### Task 7: Integrasi Materi yang Sudah Ada

**Files:**
- Modify: `app/pediatric-emergency/page.tsx`
- Modify: `app/emergency/page.tsx`
- Modify: `app/ecg-atlas/page.tsx`
- Modify: `app/radiology-atlas/page.tsx`
- Modify: `lib/nav.ts`
- Test: `tests/features.test.ts`

**Interfaces:**
- Consumes: rute Gawat Darurat Anak, Protokol Emergensi, Atlas EKG, dan Atlas Radiologi yang sudah ada.
- Produces: navigasi terpadu tanpa menggandakan materi.

- [ ] Tulis uji struktur menu dan tautan silang.
- [ ] Tambahkan tautan kembali ke Toolkit IGD pada halaman klinis terkait.
- [ ] Pastikan Atlas EKG berada di kelompok EKG dan Atlas Radiologi berada di Imaging.
- [ ] Jalankan uji fitur.

### Task 8: Keamanan, Verifikasi, dan Pengiriman

**Files:**
- Modify: `README.md`
- Modify: `tests/features.test.ts`

**Interfaces:**
- Produces: build produksi yang aman, repositori terkirim, dan ZIP deploy bersih.

- [ ] Pastikan seluruh endpoint klinis memakai respons privat, pembatasan permintaan, dan validasi input.
- [ ] Pastikan tidak ada materi baru di `public`, em dash pada teks aplikasi, atau kredensial yang terlacak.
- [ ] Jalankan `npm test -- --run`, `npm run lint`, `npx tsc --noEmit`, dan `npm run build`.
- [ ] Jalankan pemeriksaan browser pada halaman utama, Toolkit IGD, kalkulator, Atlas EKG, dan Imaging.
- [ ] Commit seluruh perubahan, push `main`, dan verifikasi deployment `https://rfsmed.vercel.app`.
- [ ] Buat ZIP deploy dengan mengecualikan `.git`, `node_modules`, `.next`, `.vercel`, dan seluruh `.env`.
