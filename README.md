# MedRef — Free Clinical Decision Support

A production-quality, 100% free clinical reference and decision-support platform in **Bahasa Indonesia-first**. Every module is accessible to every user — no accounts, no subscriptions, no Plus/Pro tiers, no locked features.

**Alat pendukung keputusan & edukasi klinis. Tidak menggantikan penilaian klinis profesional atau protokol institusi setempat.** Sumber ditampilkan pada setiap alat.

## Modules

| Modul | Rute | Isi |
|---|---|---|
| Skrining & Skor | `/scores` | 164 skor/aturan/kriteria interaktif (qSOFA, SOFA, NEWS2, GCS, FOUR, NIHSS, CURB-65, Wells, PERC, HEART, TIMI, GRACE, PESI, CIWA, Burch, Canadian CT Head Rule, ASPECTS, ICH Score, KPSP, M-CHAT-R, Denver II, SLEDAI, DAS28, SCORTEN, IPSS, IIEF-5, WIfI, + 25 ceklis indikasi/kontraindikasi klinis…) |
| Kalkulator Klinis | `/calculators` | 28 kalkulator (BMI, BSA, eGFR, CrCl, MELD-Na, anion gap, osmolalitas, MAP, QTc, P/F, Holliday-Segar, tetes infus, GA/EDD…) |
| Dosis Obat | `/drugs` | 554 obat dengan dosis dewasa/anak/neonatus + kalkulator dosis per berat badan (termasuk morfin, tramadol, antidepresan, antiepilepsi, antijamur sistemik, antibiotik reservasi…) |
| Interaksi Obat | `/interactions` | Pemeriksa interaksi antar obat berpasangan (pasangan terkurasi) |
| Indikasi & Kontraindikasi | `/indications` | Referensi prosedur terstruktur |
| Panduan Klinis | `/guidelines` | **340 halaman** panduan ringkas di samping tempat tidur — **paritas penuh dengan inventaris acuan (340 topik)** — termasuk **Cedera Kepala**, trauma toraks & abdomen, syok, semua aritmia (AF, SVT, VT/VF, AV block), disektomi aorta, seluruh endokrin (tiroid, DKA/HHS, SIADH, adrenal, elektrolit), onkologi (15 keganasan), PJB (VSD, ASD, PDA, TOF, TGA), infeksi & tropika (HIV-OI, gonore, sifilis, kusta, frambusia, rabies), obstetri-ginekologi (PID, PCOS, AUB, endometriosis), STI lengkap, dermatologi (22), forensik (10: tanatologi, traumatologi, visum, DVI, toksikologi), ortopedi, urologi, THT-mata-gigi, dan lainnya |
| Kamus ICD-10 | `/icd10` | 903 kode dengan istilah Indonesia, salin sekali klik |
| Antropometri Anak | `/anthropometry` | Standar pertumbuhan WHO (0–60 bln), z-score, persentil, grafik pertumbuhan |
| Perkembangan Anak | `/development` | Tonggak perkembangan 5 domain + tanda bahaya |
| Imunisasi | `/immunization` | Jadwal Indonesia (Kemenkes/IDAI): selesai / jatuh tempo / terlambat |
| Database Gizi | `/nutrition` | 77 bahan pangan Indonesia (per 100 g) |
| Perencana Makan | `/meal-planner` | Rencana makan terstruktur dari database gizi |
| Panduan Gizi Klinis | `/nutrition-guidance` | 7 kondisi (diabetes, CKD, hipertensi, dislipidemia, obesitas, malnutrisi, kehamilan) |
| Spesialisasi | `/specialties` | 30 spesialisasi menggabungkan alat dari metadata |

Plus: pencarian global fuzzy (⌘K / Ctrl+K) dengan navigasi ↑↓/Enter/Esc, favorit & riwayat (localStorage), mode terang/gelap, PWA manifest, cetak/PDF, metadata SEO per halaman.

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
(tool/skor, panduan — termasuk *Cedera Kepala* — dan obat), memastikan relasi data valid, dan
memastikan pencarian menemukan topik-topik utama. Jumlah yang ditampilkan pada antarmuka selalu
dihitung dari database sesungguhnya — bukan angka statis.

## Catatan cakupan (transparan)

Database dikembangkan bertahap dan jujur terhadap jumlahnya. Baseline inventaris publik yang dipakai
oleh audit adalah: 132 skor, 12 kalkulator, 452 entri obat, sekitar 100 pasangan interaksi, 340 panduan,
1.893 kode ICD-10, dan 303 bahan pangan. Skor, kalkulator, dan panduan telah mencapai atau melampaui
baseline tersebut. Interaksi, ICD-10, dan pangan masih parsial. Item yang belum ada tidak diklaim
sebagai ada — gunakan `npm run audit:coverage` untuk melihat jumlah aktual dan menambah konten dari
sumber otoritatif.

## Deploy ke Vercel

Proyek Next.js (App Router) tanpa database server — semua data klinis berupa modul TypeScript
terstruktur, sehingga ter-deploy sebagai situs statis penuh.

1. Push repositori ke GitHub, lalu **Add New → Project** di Vercel (auto-detect Next.js, tanpa env var).
2. Atau dari terminal:
   ```bash
   npx vercel --prod
   ```

## Struktur proyek

```
app/              Halaman Next.js App Router (satu folder per modul)
components/       UI terpakai ulang: renderer alat, pencarian global, shell, grafik
lib/calc/         Mesin klinis murni & teruji (skor, kalkulator, obat, antropometri, gizi, imunisasi)
lib/data/         Database klinis terstruktur (skor, obat, panduan, ICD-10, pangan, WHO LMS, jadwal imunisasi)
tests/            Tes unit Vitest untuk semua mesin + audit cakupan & validasi data
scripts/          Alat pengambilan data (generator standar WHO)
```

Konten klinis disusun secara independen dari sumber publik otoritatif yang dikutip (WHO, CDC, KDIGO,
Kemenkes RI, perhimpunan spesialis, studi validasi asli) dan diberi cap versi per catatan (`source`,
`year`, `url`, `lastReviewed`). Tidak menyalin konten berpemilik situs acuan.
