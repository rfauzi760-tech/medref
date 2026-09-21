# Pemindahan Filter Kelas Obat

## Tujuan

Menghilangkan daftar chip kelas obat yang sangat panjang dari halaman Dosis Obat dan menyediakan penyaringan kelas yang ringkas pada halaman Interaksi Obat.

## Perubahan Antarmuka

- Halaman Dosis Obat hanya menampilkan pilihan populasi, pencarian, dan daftar obat. Seluruh chip kelas dihapus.
- Halaman Interaksi Obat memperoleh dropdown `Semua kelas` di samping kolom pencarian obat.
- Memilih kelas membatasi saran pencarian ke obat dalam kelas tersebut.
- Pencarian nama generik dan merek tetap bekerja seperti sebelumnya.
- Filter kelas tidak menghapus obat yang sudah ditambahkan ke daftar pemeriksaan.

## Data dan Logika

- Daftar kelas diturunkan dari properti `drugClass` pada data obat yang sudah dikirim ke komponen Interaksi Obat.
- Daftar dibuat unik dan diurutkan alfabetis di klien.
- Tidak ada perubahan pada API pemeriksaan interaksi atau basis data obat.

## Keadaan Antarmuka

- Dropdown selalu menyediakan `Semua kelas`.
- Bila kombinasi pencarian dan kelas tidak menemukan obat, tampilkan pesan bahwa tidak ada obat yang cocok.
- Tampilan tetap mendukung tema terang, gelap, keyboard, dan layar kecil.

## Pengujian

- Kontrak halaman Dosis Obat memastikan filter kelas tidak lagi dirender.
- Logika penyaringan Interaksi Obat diuji untuk nama obat, kelas, dan gabungan keduanya.
- Jalankan seluruh tes, build produksi, dan pemeriksaan browser sebelum deploy.
