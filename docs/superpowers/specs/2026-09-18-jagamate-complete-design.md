# Cakupan lengkap fitur Jaga Mate di RFSmed

## Tujuan

Semua fungsi yang benar-benar terlihat pada akun Jaga Mate tanggal 18 September 2026 mempunyai tempat yang dapat ditemukan di RFSmed. Tiga kelompoknya adalah 45 pilihan Obat Tunggal, Racikan, dan empat kelompok Alat Bantu Klinis. Desain RFSmed, bahasa Indonesia, serta tema terang dan gelap tetap dipakai. Akun, gamifikasi, dan tampilan merek sumber tidak dipindah.

## Prinsip klinis

Ketersediaan pilihan tidak sama dengan izin menampilkan angka. Obat/rute/sediaan yang dosisnya belum dapat diverifikasi tetap muncul sebagai panduan teks dan alasan mengapa hitung otomatis ditahan. Tidak ada konversi tablet, volume, atau bahan campuran dari konsentrasi yang ambigu. Sumber primer ditautkan pada setiap rumus baru. Input usia, berat, dan satuan wajib tervalidasi sebelum hasil angka muncul.

## Kelompok 1: Obat Tunggal

Tabel audit `docs/clinical/jagamate-dose-audit.md` tetap menjadi inventaris 45 pilihan. Semua pilihan dipetakan ke halaman obat RFSmed. Regimen yang sudah terverifikasi digunakan; delapan pilihan yang belum layak angka otomatis tetap dapat dicari, dibaca, dan dipilih dengan status teks. Perbedaan indikasi, rute, umur, garam, serta sediaan tidak digabung menjadi satu dosis generik.

## Kelompok 2: Racikan

Tambahkan halaman `/drugs/racikan` sebagai lembar kerja dosis puyer, bukan replika antarmuka Jaga Mate. Pengguna memasukkan usia, berat, jumlah bungkus, frekuensi, lalu memilih satu atau lebih dari 45 pilihan obat. Setiap bahan memilih regimen oral dan sediaan oral padat yang konsentrasi dan kelayakan usianya terverifikasi. Untuk rentang dosis, pengguna wajib memilih dosis target di dalam rentang. Total bahan dihitung dari dosis per bungkus dikali jumlah bungkus, lalu dikonversi ke jumlah tablet sesuai kekuatan produk.

Jika satu bahan tidak memenuhi syarat, angka racikan dan teks resep akhir tidak ditampilkan. Bahan tetap tampil dengan alasan spesifik. Penggabungan beberapa bahan memerlukan pemeriksaan kompatibilitas oleh apoteker; hasilnya dinyatakan sebagai lembar perhitungan individual, bukan klaim bahwa campuran aman. Tidak ada pembulatan tablet otomatis atau substitusi sirup menjadi serbuk. Teks dapat disalin hanya saat semua bahan valid, dan tetap menyebut perlunya verifikasi farmasis.

## Kelompok 3: Alat Bantu Klinis

Halaman indeks `/jagamate-tools` menghubungkan fungsi yang telah ada dan mengisi yang belum ada:

- Cairan/diare: Holliday-Segar, defisit cairan yang sudah ada; tambahkan alur Plan A/B/C dan bolus syok hanya bila rumus dan kondisi penerapannya terverifikasi dari WHO/IDAI atau pedoman setara.
- Obstetri: usia kehamilan dan HPL dari HPHT; taksiran berat janin dari TFU diberi batasan ketidakakuratan dan tidak menjadi pengganti USG.
- Emergensi: GCS memakai skor yang sudah ada; kalkulator luka bakar menampilkan luas TBSA dan estimasi cairan resusitasi hanya untuk populasi dan waktu yang sesuai sumber.
- Status gizi: arahkan ke antropometri WHO/CDC dan BMI RFSmed yang sudah berfungsi. Pada sumber, kategori ini hanya placeholder, sehingga tidak ada rumus tersembunyi yang perlu disalin.

## Arsitektur dan pengujian

Rumus tetap murni di `lib/calc/`, data sumber di `lib/data/`, formulir interaktif di `components/`, dan halaman Next.js sebagai Server Component yang membungkus komponen interaktif. Gunakan rute dan komponen desain yang sudah ada. Untuk setiap rumus baru, buat tes hasil normal, batas usia/berat, input tidak valid, dan kondisi saat hasil harus ditahan. Uji alur browser pada terang/gelap, jalankan seluruh tes, lint, pemeriksaan tipe, serta build. Jangan publikasi ke `main`/Vercel sebelum semua kategori di atas dapat diakses dan hasil berisiko tidak lolos sebagai angka.
