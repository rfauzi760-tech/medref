# RFSmed Toolkit IGD Design

## Tujuan

Melengkapi RFSmed dengan perangkat klinis IGD yang mudah dicari tanpa mengubah bahasa visual aplikasi saat ini. Konten hanya diambil dari halaman yang sah dibuka melalui akun pengguna atau dari referensi klinis resmi.

## Struktur informasi

### Toolkit IGD

Toolkit IGD menjadi satu pintu untuk:

- Kalkulator dosis obat IGD
- Kalkulator bilirubin neonatus
- Panduan toksikologi dan antidot
- Obat pada kehamilan dan menyusui
- Analisis gas darah
- Kalkulator koreksi elektrolit
- Mesin diagnosis banding
- Gawat Darurat Anak
- Protokol Emergensi
- Protocol Timer

Setiap alat tetap memiliki halaman sendiri sehingga pencarian global, tautan langsung, dan navigasi seluler tetap sederhana.

### Atlas EKG

Materi Curve of Life ditempatkan sebagai Atlas EKG karena isinya berpusat pada interpretasi elektrokardiografi. Atlas dapat dicari berdasarkan judul, kategori, dan kata kunci.

### Imaging

Materi Monochrome Worlds ditempatkan pada segmen Imaging yang berdiri sendiri. Atlas Radiologi menjadi bagian pertama dan dapat dikembangkan untuk modalitas lain tanpa mencampurkannya dengan kalkulator IGD.

## Arsitektur data

- Materi klinis lengkap disimpan pada modul server-only.
- Browser hanya menerima hasil yang dibutuhkan melalui endpoint privat dengan `no-store`.
- Navigasi dan pencarian hanya memuat metadata ringkas.
- Kalkulator memakai fungsi deterministik terpisah dari komponen tampilan.
- Materi yang tidak dapat dibuka secara sah tidak disalin atau ditebak.

## Antarmuka

- Mempertahankan desain RFSmed, tema terang dan gelap, tipografi, warna, dan pola kartu yang ada.
- Semua judul dan subjudul memiliki hierarki tebal yang jelas.
- Isi menggunakan daftar bertingkat, label, tabel, atau panel sesuai struktur klinisnya.
- Seluruh teks pengguna memakai Bahasa Indonesia dan tidak memakai em dash.
- Formulir memiliki label, satu pilihan aktif yang jelas, validasi, satuan, serta hasil yang mudah dipindai.

## Keamanan konten

- Data klinis tidak ditempatkan pada berkas statis publik.
- Endpoint menggunakan pembatasan permintaan dan respons privat.
- Crawler AI yang dikenal diblokir.
- Situs memakai `noindex` dan ketentuan penggunaan yang membatasi penyalinan otomatis.

Langkah ini mengurangi pengambilan massal, tetapi tidak dapat mencegah pengguna sah menyalin informasi yang sudah tampil di layar.

## Validasi

- Uji unit untuk setiap rumus dan aturan keputusan.
- Uji pilihan tunggal untuk mencegah dua jawaban aktif bersamaan.
- Uji kontrak rute dan jumlah materi.
- Uji pencarian, filter, keadaan kosong, tema, dan tampilan seluler.
- Jalankan seluruh pengujian, lint, pemeriksaan tipe, dan build produksi sebelum push.

## Pengiriman

- Perubahan dikirim ke branch `main` pada repositori GitHub pengguna.
- Integrasi GitHub Vercel melakukan deploy produksi.
- Arsip ZIP yang tidak memuat `.git`, dependensi, hasil build, kredensial, atau konfigurasi lokal disediakan sebagai cadangan deploy.
