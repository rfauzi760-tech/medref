# Mode Dosis Obat Anak RFSmed

## Tujuan

Menambahkan alur dosis pediatrik yang cepat dan aman pada modul Dosis Obat RFSmed tanpa menggandakan basis data atau meniru tampilan situs referensi.

## Keputusan desain

- Modul utama tetap `Dosis Obat`.
- Tambahkan filter `Anak` pada katalog dan pintasan `Dosis Obat Anak` di navigasi yang membuka katalog dalam mode anak.
- Halaman obat memakai data terstruktur yang sama untuk dewasa, anak, dan neonatus.
- Mode anak menampilkan input usia dan berat badan terlebih dahulu, lalu indikasi, rute, dan sediaan yang tersedia.
- Hasil utama menampilkan dosis per pemberian, total harian, frekuensi, dosis maksimum, dan konversi sediaan bila konsentrasi dapat ditentukan dengan aman.
- Teks dan visual mengikuti sistem desain RFSmed yang sekarang, termasuk tema terang dan gelap.

## Alur pengguna

1. Pengguna membuka `Dosis Obat Anak` atau mengaktifkan filter `Anak` pada katalog obat.
2. Pengguna mencari nama generik, merek, kelas, atau indikasi.
3. Pengguna membuka obat dan memasukkan usia serta berat badan.
4. Pengguna memilih indikasi dan rute dari entri dosis yang benar-benar tersedia.
5. Pengguna memilih sediaan terstruktur atau memasukkan konsentrasi manual.
6. RFSmed menampilkan hasil dosis dan volume atau jumlah unit per pemberian, beserta batas maksimum dan peringatan.

## Model data

`DrugDose` mendapat identitas pilihan yang stabil dan metadata usia opsional. Sediaan tetap mempertahankan teks lama, tetapi dapat memiliki representasi terstruktur berupa kekuatan, satuan obat, jumlah pembawa, satuan volume/unit, dan label.

Parser hanya mengubah sediaan dengan pola yang tidak ambigu seperti `120 mg/5 mL`. Sediaan kombinasi, rentang, atau teks yang meragukan tetap tampil sebagai referensi tanpa konversi otomatis.

## Aturan perhitungan

- Pemilihan populasi otomatis harus memprioritaskan neonatus sebelum anak.
- Pemilihan indikasi dan rute menentukan satu `DrugDose`; kalkulator tidak boleh diam-diam memilih entri lain.
- Dosis rentang ditampilkan sebagai rentang, bukan hanya nilai tengah.
- Batas per dosis dan per hari diterapkan secara terpisah.
- Konversi sediaan dihitung dari dosis akhir setelah batas maksimum diterapkan.
- Hasil tidak ditampilkan bila berat, usia, atau konsentrasi tidak valid.

## Keselamatan

- Tampilkan peringatan bahwa hasil adalah alat bantu klinis dan wajib diverifikasi dengan formularium serta kondisi pasien.
- Jangan mengonversi sediaan yang ambigu.
- Pertahankan peringatan mayor, pertimbangan ginjal, hati, kehamilan, dan sumber.
- Tidak ada dosis baru yang disalin dari situs referensi. Data klinis tambahan harus bersumber dari pedoman atau formularium yang berwenang.

## Pengujian

- Unit test untuk populasi neonatus, pemilihan indikasi/rute, rentang dosis, batas maksimum, dan konversi mL.
- Regression test untuk kalkulasi obat yang sudah ada.
- Uji katalog mode anak dan empty state.
- Build, lint, dan pemeriksaan browser pada desktop/mobile serta tema terang/gelap.

## Di luar cakupan tahap ini

- Menyalin basis data, aset, atau desain situs referensi.
- Menambahkan ribuan merek tanpa sumber yang dapat diverifikasi.
- Penyesuaian dosis otomatis berdasarkan fungsi ginjal atau hati.
