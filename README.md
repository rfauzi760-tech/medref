# RFSmed: Free Clinical Decision Support

A production-quality, 100% free clinical reference and decision-support platform in **Bahasa Indonesia-first**. Every module is accessible to every user: no accounts, no subscriptions, no Plus/Pro tiers, no locked features.

**Alat pendukung keputusan & edukasi klinis. Tidak menggantikan penilaian klinis profesional atau protokol institusi setempat.** Sumber ditampilkan pada setiap alat.

## Modules

Jumlah di bawah diverifikasi dari data aplikasi melalui `npm run audit:coverage`, bukan angka statis.

| Modul | Rute | Isi |
|---|---|---|
| Skrining & Skor | `/scores` | 163 skor/aturan/kriteria interaktif (qSOFA, SOFA, NEWS2, GCS, FOUR, NIHSS, CURB-65, Wells, PERC, HEART, TIMI, GRACE, PESI, CIWA, Burch, Canadian CT Head Rule, ASPECTS, ICH Score, KPSP, M-CHAT-R, Denver II, SLEDAI, DAS28, SCORTEN, IPSS, IIEF-5, WIfI, dan lainnya) |
| Kalkulator Klinis | `/calculators` | 29 kalkulator (BMI, BSA, eGFR, CrCl, MELD-Na, anion gap, osmolalitas, MAP, QTc, P/F, Holliday-Segar, tetes infus, analisis gas darah, GA/EDD, dan lainnya) |
| Indikasi & Kontraindikasi | `/indications` | 14 referensi prosedur terstruktur: indikasi, kontraindikasi, dan tindakan pencegahan |
| Dosis Obat | `/drugs` | 517 obat dengan dosis dewasa/anak/neonatus + kalkulator dosis per berat badan |
| Interaksi Obat | `/interactions` | 2.479 pasangan interaksi terkurasi (dari 152 aturan Klinea yang diperluas melalui kelompok obat) |
| Panduan Klinis | `/guidelines` | 340 halaman panduan ringkas di samping tempat tidur, mencakup kegawatan, kardiologi, endokrin, onkologi, infeksi dan tropika, obstetri-ginekologi, dermatologi, forensik, dan lainnya. Setiap halaman diberi label kekuatan sumber (T1-T3) berdasarkan rujukan yang dikutip |
| Toolkit IGD | `/igd-toolkit` | 10 alat: dosis infus, bilirubin, toksikologi dan antidot, obat kehamilan dan menyusui, koreksi elektrolit, diagnosis banding, gawat darurat anak, algoritma, timer, dan analisis gas darah |
| Alur IGD | `/emergency` | 15 alur kegawatan (syok/sepsis, nyeri dada, sesak, aritmia, stroke, kejang, trauma, elektrolit, keracunan, obstetri, neonatus, anak, abdomen akut, anafilaksis, infeksi tropis) yang menautkan panduan, skor, kalkulator, dan tanda bahaya yang sudah tersedia |
| Timer Protokol | `/timer` | 5 protokol waktu-kritis dengan target terpublikasi: code stroke, PCI primer, fibrinolisis, bundel sepsis 1 jam, dan survei primer trauma |
| Atlas EKG | `/ecg-atlas` | 43 pola EKG dengan temuan utama, catatan IGD, dan pitfall |
| Imaging | `/radiology-atlas` | 159 pola X-ray, CT, MRI, dan USG dengan temuan utama dan pitfall |
| Kamus ICD-10 | `/icd10` | 638 kode dengan istilah Indonesia, salin sekali klik |
| Antropometri Anak | `/anthropometry` | Standar pertumbuhan WHO (0-60 bulan), z-score, persentil, grafik pertumbuhan |
| Perkembangan Anak | `/development` | Tonggak perkembangan 5 domain + tanda bahaya |
| Imunisasi | `/immunization` | Jadwal Indonesia (Kemenkes/IDAI): selesai / jatuh tempo / terlambat |
| Database Gizi | `/nutrition` | 478 bahan pangan Indonesia (per 100 g) |
| Perencana Makan | `/meal-planner` | Rencana makan terstruktur dari database gizi |
| Panduan Gizi Klinis | `/nutrition-guidance` | 16 kondisi (diabetes, CKD, hipertensi, dislipidemia, obesitas, malnutrisi, kehamilan, dan lainnya) |
| Spesialisasi | `/specialties` | 30 spesialisasi menggabungkan alat dari metadata |

Plus: pencarian global fuzzy (⌘K / Ctrl+K) dengan navigasi ↑↓/Enter/Esc yang dijalankan di server, favorit & riwayat (localStorage), mode terang/gelap, PWA manifest, cetak/PDF, dan metadata per halaman.

## Sumber konten kanonik (Klinea)

Konten klinis kanonik berasal dari snapshot bundel publik Klinea yang di-vendor di dalam repositori:

- `vendor/klinea/data.js`, `data2.js`, `data3.js`, dan `data4.js` menyimpan bundel sumber; `vendor/klinea/source.json` mencatat URL, tanggal pengambilan (2026-09-11), dan SHA-256 setiap berkas agar setiap impor dapat diaudit.
- `scripts/import-klinea.mjs` menjalankan bundel dalam VM Node terisolasi, membuang fungsi skor yang dapat dieksekusi, menormalkan tanda baca, lalu menulis `lib/generated/klinea-content.json`.
- `lib/data/klinea-canonical.ts` memetakan katalog kanonik ke tipe aplikasi. Modul ini ditandai `server-only` sehingga katalog mentah tidak ikut ke bundel klien.
- Katalog yang hanya dimiliki RFSmed tetap dipertahankan, terutama mesin perhitungan skor yang teruji.
- Produksi tidak pernah mengambil data dari situs Klinea saat berjalan: aplikasi membaca salinan lokal.

Pencarian, evaluasi skor, dan pemeriksaan interaksi berjalan di server melalui `GET /api/search`, `POST /api/scores/[slug]`, dan `POST /api/interactions`.

## Perlindungan akses

Konten klinis tidak ditujukan untuk pengambilan otomatis:

- `proxy.ts` memblokir agen AI/crawler yang dikenal, membatasi 80 permintaan per menit per IP, dan mengirim header `X-Robots-Tag: noindex`.
- `app/robots.ts` menolak seluruh perayapan.
- Katalog mentah tidak dikirim ke bundel klien; klien memanggil API server.

## Pengembangan lokal

Membutuhkan Node.js ≥ 20.9.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Tes & audit

```bash
npm test                    # vitest run — semua mesin perhitungan klinis
npm run audit:coverage      # audit cakupan terhadap inventaris situs acuan + validasi data
```

`audit:coverage` mencetak tabel jumlah konten (acuan vs lokal) per modul, memeriksa item prioritas
(tool/skor, panduan, dan obat), memastikan relasi data valid, dan memastikan pencarian menemukan
topik-topik utama. Jumlah yang ditampilkan pada antarmuka selalu dihitung dari database sesungguhnya,
bukan angka statis.

## Catatan cakupan (transparan)

Database dikembangkan bertahap dan jujur terhadap jumlahnya. Baseline inventaris publik yang dipakai
oleh audit adalah: 132 skor, 12 kalkulator, 452 entri obat, sekitar 100 pasangan interaksi, 340 panduan,
1.893 kode ICD-10, dan 303 bahan pangan.

| Modul | Acuan | Lokal | Status |
|---|---:|---:|---|
| Skrining & Skor | 132 | 163 | Melampaui |
| Kalkulator Klinis | 12 | 29 | Melampaui |
| Indikasi & Kontraindikasi | - | 14 | Lokal |
| Dosis Obat | 452 | 517 | Melampaui |
| Interaksi Obat | 100 | 2.479 | Melampaui |
| Panduan Klinis | 340 | 340 | Setara |
| Kamus ICD-10 | 1.893 | 638 | Parsial |
| Bahan Pangan | 303 | 478 | Melampaui |
| Panduan Gizi Klinis | - | 16 | Lokal |

Saat ini hanya Kamus ICD-10 yang masih di bawah baseline. Item yang belum ada tidak diklaim sebagai
ada; gunakan `npm run audit:coverage` untuk melihat jumlah aktual dan menambah konten dari sumber
otoritatif.

## Deploy ke Vercel

Proyek Next.js (App Router) tanpa database server: semua data klinis berupa modul TypeScript
terstruktur yang dibaca dari salinan JSON lokal, sehingga ter-deploy sebagai situs penuh di Vercel.

1. Push repositori ke GitHub, lalu **Add New → Project** di Vercel (auto-detect Next.js, tanpa env var).
2. Atau dari terminal:
   ```bash
   npx vercel --prod
   ```

## Struktur proyek

```
app/              Halaman Next.js App Router (satu folder per modul) + app/api/ untuk pencarian, skor, interaksi
components/       UI terpakai ulang: renderer alat, pencarian global, shell, grafik
lib/calc/         Mesin klinis murni & teruji (skor, kalkulator, obat, antropometri, gizi, imunisasi)
lib/data/         Database klinis terstruktur + adaptor kanonik Klinea
lib/generated/    Artefak JSON hasil impor Klinea
lib/security/     Kebijakan pemblokiran agen dan pembatas laju
proxy.ts          Middleware: proteksi konten dan pembatas laju
vendor/klinea/    Snapshot bundel sumber Klinea beserta checksum
tests/            Tes unit Vitest + audit cakupan & validasi data
scripts/          Alat pengambilan data (importer Klinea, generator standar WHO)
docs/superpowers/ Catatan desain dan rencana implementasi
```

Konten klinis disusun dari sumber publik otoritatif yang dikutip (WHO, CDC, KDIGO, Kemenkes RI,
perhimpunan spesialis, studi validasi asli) dan diberi cap versi per catatan (`source`, `year`, `url`,
`lastReviewed`). Snapshot Klinea dipakai agar konten kanonik dapat diaudit; identitas merek aplikasi
adalah RFSmed.
