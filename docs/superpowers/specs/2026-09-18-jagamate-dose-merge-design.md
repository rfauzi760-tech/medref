# Integrasi dosis Jaga Mate ke RFSmed

## Tujuan dan batas

Lengkapi modul `Dosis Obat` RFSmed dari seluruh entri obat yang dapat diakses dalam akun Jaga Mate milik pengguna. Pengguna menyatakan memiliki izin penggunaan dan publikasi data. Pada 18 September 2026, daftar `Obat Tunggal` yang terlihat memuat 45 pilihan dalam sembilan kategori, sedangkan katalog kanonis yang benar-benar ditampilkan RFSmed memiliki 517 entri obat. Jumlah tersebut adalah titik awal audit, bukan alasan untuk menganggap rincian dosis RFSmed sudah lengkap.

Lingkup pekerjaan adalah data obat tunggal: nama generik dan sinonim, indikasi, populasi/usia, rute, dosis, frekuensi, batas maksimum, sediaan, dan konversi. Fitur `Racikan`, kalkulator lain, tampilan Jaga Mate, akun, serta gamifikasi tidak disalin. Sesi, token, dan kredensial Jaga Mate tidak disimpan di repositori.

## Pendekatan yang dipilih

Lakukan audit dan penggabungan terverifikasi, bukan impor yang menimpa data lama. Setiap pilihan Jaga Mate diberi status `sudah tercakup`, `perlu diperkaya`, `obat baru`, atau `ditunda karena belum terverifikasi`. Sinonim, ejaan, dan bentuk garam dipetakan sebelum membuat entri baru. Perbedaan indikasi, usia, rute, atau bentuk sediaan dipertahankan sebagai pilihan dosis tersendiri, bukan dirata-ratakan.

Data Jaga Mate boleh digunakan sesuai izin pengguna, tetapi angka dosis yang mengaktifkan kalkulator harus diperiksa terhadap rujukan klinis primer atau otoritatif yang relevan, seperti pedoman IDAI/WHO, informasi obat BPOM, atau label resmi. Catat rujukan dan tanggal pemeriksaan per entri. Bila sumber berbeda atau tidak jelas, jangan mengganti dosis lama secara diam-diam. Simpan temuannya dalam daftar audit untuk peninjauan; jangan tampilkan angka hitung baru sampai terverifikasi.

## Arsitektur dan alur data

1. Catat daftar dan rincian obat dari sesi pengguna yang sah ke bahan kerja lokal. Jangan memasukkan salinan mentah situs atau informasi akun ke berkas publik.
2. Normalisasikan obat dan bandingkan dengan `DRUGS` di `lib/data/drugs.ts` serta data tambahan. Buat laporan silang yang mencakup semua 45 pilihan dan keputusan tiap pilihan.
3. Tambahkan atau perkaya `Drug`, `DrugDose`, dan `DosePreparation` mengikuti model yang sudah ada. Entri berbasis berat hanya diisi bila unit, dasar per dosis/per hari, frekuensi, batas dosis, dan populasi jelas. Regimen kompleks tetap berupa teks atau ditunda bila tidak dapat dihitung aman.
4. Kalkulator memakai pilihan dosis yang tepat menurut populasi, indikasi, dan rute, kemudian menerapkan batas maksimum sebelum konversi sediaan. Sediaan ambigu atau tidak cocok rute tidak mendapat konversi otomatis.
5. Tampilkan sumber dan batasan klinis yang relevan. Pertahankan desain RFSmed serta tema terang dan gelap.

## Penanganan konflik dan kegagalan

- Nama berbeda tetapi zat aktif sama: gabungkan sebagai sinonim; jangan buat duplikat.
- Dosis atau maksimum berbeda: bandingkan konteks klinis dan sumber. Jika belum dapat diputuskan, tandai untuk tinjauan dan jangan aktifkan hasil numerik baru.
- Sediaan kombinasi, konsentrasi tidak pasti, atau rute tidak sesuai: tampilkan informasi tanpa hitungan mL/unit.
- Umur, berat, atau satuan tidak valid: jangan tampilkan hasil dosis.
- Bila akses sesi berakhir saat audit, pertahankan progres audit dan lanjutkan setelah akses sah tersedia lagi; jangan melewati pembatasan akses.

## Verifikasi dan kriteria selesai

Audit harus mencakup seluruh 45 pilihan `Obat Tunggal` yang terlihat saat perancangan, dengan status akhir dan sumbernya; jika katalog berubah, catat selisihnya. Untuk setiap dosis numerik baru, uji contoh berat/usia, frekuensi, batas per dosis dan harian, kecocokan rute, serta konversi mg-ke-mL/unit. Jalankan tes regresi modul obat, pemeriksaan tipe/lint, build, dan pemeriksaan UI tema terang/gelap. Pekerjaan selesai bila semua pilihan terpetakan dan hanya dosis yang telah diverifikasi tersedia sebagai hitungan aktif. Daftar yang masih ditunda dilaporkan secara eksplisit, bukan disamarkan sebagai selesai.
