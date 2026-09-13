# Desain Pembaruan Beranda, Format Panduan, dan Siriraj Score

## Tujuan

Menyederhanakan beranda RFSmed, menampilkan alat terbaru secara tepat, memperjelas hierarki konten Diare Akut, dan menambahkan Siriraj Stroke Score yang dapat dihitung secara interaktif dengan sumber primer.

## Beranda

- Hero hanya berisi logo RFSmed dan nama **RFSmed**.
- Badge, headline promosi, deskripsi, dan tagline dihapus.
- Pencarian global tetap tersedia dan ditempatkan berdampingan dengan identitas merek pada layar besar.
- Bagian **Cakupan aktual** dihapus seluruhnya.
- **Modul klinis utama** memprioritaskan fitur inti dan fitur yang baru ditambahkan: Toolkit IGD, Skrining & Skor, Algoritma IGD, Timer Protokol, Gawat Darurat Anak, Atlas EKG, Imaging, Kalkulator Dosis IGD, Kalkulator Bilirubin, Toksikologi & Antidot, Obat Kehamilan & Menyusui, Koreksi Elektrolit, dan Mesin Diagnosis Banding.
- Modul lain tetap tersedia di bagian layanan klinis lainnya agar tidak ada akses yang hilang.
- **Terakhir dibuka** akan mencatat kunjungan ke halaman modul baru, selain halaman alat detail yang sudah tercatat saat ini.

## Format Panduan Diare Akut

- Struktur data **Rencana Terapi A**, **Rencana Terapi B**, dan **Rencana Terapi C** diubah dari teks bullet menjadi heading terstruktur.
- Isi terapi di bawah setiap rencana tetap berupa konten atau bullet bertingkat sesuai hubungan klinisnya.
- Perubahan dibatasi pada hierarki yang salah agar data klinis tidak berubah.

## Siriraj Stroke Score

- Ditambahkan sebagai alat baru pada **Skrining & Skor**.
- Input: tingkat kesadaran, muntah, nyeri kepala, tekanan darah diastolik, dan penanda ateroma.
- Formula: `(2,5 × tingkat kesadaran) + (2 × muntah) + (2 × nyeri kepala) + (0,1 × TDD) - (3 × penanda ateroma) - 12`.
- Interpretasi: skor `> 1` mengarah ke perdarahan supratentorial, skor `< -1` mengarah ke infark, dan skor `-1 sampai 1` tidak pasti.
- Alat menyatakan secara jelas bahwa skor tidak menggantikan CT/MRI dan tidak boleh digunakan sendiri untuk menentukan trombolisis atau terapi spesifik stroke.
- Sumber utama: Poungvarin N, Viriyavejakul A, Komontri C. BMJ 1991. DOI `10.1136/bmj.302.6792.1565`.
- Pengingat pencitraan mengikuti pedoman AHA/ASA 2026 bahwa pencitraan otak diperlukan untuk mengeksklusi perdarahan sebelum terapi reperfusi.

## Pengujian

- Tes unit formula, semua batas interpretasi, dan kelengkapan input Siriraj.
- Tes regresi struktur Diare Akut untuk memastikan rencana terapi menjadi heading.
- Tes beranda untuk memastikan tagline dan cakupan aktual hilang serta modul baru masuk daftar utama.
- Verifikasi manual tampilan desktop dan seluler, tema terang dan gelap.
- Jalankan lint, TypeScript, seluruh tes, dan build produksi sebelum push.

## Deployment

Perubahan dibuat sebagai commit terfokus di `main`, didorong ke GitHub, lalu diverifikasi pada deployment otomatis Vercel di `rfsmed.vercel.app`.
