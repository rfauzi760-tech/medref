# Resusitasi Neonatus RFSmed

## Tujuan dan batas klinis

Sediakan skema resusitasi **bayi baru lahir saat persalinan** sebagai bagian tersendiri. Ini bukan pengganti alur PALS untuk bayi/anak di luar masa transisi kelahiran, pelatihan resusitasi, atau protokol setempat. Diagram pengguna menjadi acuan cakupan dan susunan visual, tetapi keputusan klinis diselaraskan dengan pedoman resmi terbaru.

## Penempatan

- Halaman utama baru: `Resusitasi Neonatus`, dapat dibuka langsung dari navigasi dan Toolkit IGD.
- Pintasan pada `Gawat Darurat Anak` menjelaskan bahwa alur bayi saat lahir berbeda dari kalkulator pediatri pada halaman tersebut.
- Katalog `Algoritma IGD` menautkan halaman yang sama, tanpa menggandakan konten.
- Panduan `Asfiksia Neonatorum` yang sudah ada tetap terpisah sebagai materi latar; pernyataan yang bertentangan dengan alur terbaru ditinjau dan diperbaiki.

## Skema halaman

Diagram responsif berbahasa Indonesia, mengikuti arah atas ke bawah. Pada desktop, cabang `Ya` dan `Tidak` tampak berdampingan; pada ponsel, cabang ditumpuk dengan label arah yang tetap eksplisit. Setiap simpul memiliki judul tebal, tindakan ringkas, dan panah/garis yang dapat diikuti tanpa mengandalkan warna. Tidak memakai em dash, slogan, atau dekorasi yang mengganggu pemindaian klinis. Tema terang dan gelap mengikuti desain RFSmed.

Urutan simpul:

1. Konseling antenatal, pembagian tugas tim, pemeriksaan alat, dan rencana penanganan tali pusat.
2. Kelahiran dan penilaian awal: cukup bulan, tonus baik, bernapas atau menangis. Cabang `Ya` menuju kontak kulit, perawatan rutin, suhu, dan evaluasi berkelanjutan.
3. Cabang `Tidak`: hangatkan, keringkan, posisikan, stimulasi, bersihkan jalan napas hanya bila perlu; ulang nilai napas dan denyut jantung.
4. Apnea/megap-megap atau denyut jantung <100/menit: ventilasi tekanan positif, oksimeter preduktal, pertimbangkan monitor jantung. Bila napas berat atau sianosis persisten tanpa indikasi ventilasi, tampilkan cabang oksimeter, oksigen bila perlu, dan pertimbangan CPAP.
5. Setelah ventilasi: bila denyut jantung tetap <100/menit, tampilkan koreksi ventilasi dan pertimbangan jalan napas alternatif. Bila <60/menit setelah ventilasi efektif, tampilkan jalan napas alternatif, kompresi 3:1, oksigen 100%, serta akses vaskular.
6. Bila tetap <60/menit, tampilkan epinefrin sesuai pedoman, penilaian ulang, dan pertimbangan hipovolemia atau pneumotoraks. Dosis dan rute hanya ditampilkan setelah diverifikasi secara terpisah terhadap pedoman resmi, dengan satuan yang jelas.
7. Jalur kembali ke perawatan pascaresusitasi, komunikasi keluarga, dan evaluasi tim.

Panel pendamping memuat target saturasi preduktal menurut menit kehidupan, pencegahan hipotermia, serta keterangan bahwa skor APGAR tidak menunda keputusan resusitasi. Detail khusus prematur, mekonium, dan perawatan lanjut disajikan sebagai catatan terpisah agar simpul utama tetap terbaca.

## Konten dan sumber

- Dasar urutan keputusan: AHA/AAP Neonatal Resuscitation Algorithm 2025: https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/1-2-Algorithm-Neonatal-Resuscitation-250129.pdf
- Dasar rincian tindakan: AHA/AAP Neonatal Resuscitation Guidelines 2025: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation
- Rujukan konteks Indonesia: IDAI, pedoman resusitasi/stabilisasi/transpor BBLR 2022: https://www.idai.or.id/professional-resources/pedoman-konsensus/pedoman-nasional-pelayanan-kedokteran-tata-laksana-berat-badan-lahir-rendah

Perbedaan materi gambar 2022 dan pedoman 2025 dicatat dalam proses peninjauan; halaman tidak menyalin bagan lama secara verbatim. Isi medis tidak diturunkan hanya dari teks gambar yang sulit dibaca. Tanggal tinjau dan tautan sumber tampil pada halaman.

## Implementasi dan pengujian

- Konten alur disimpan sebagai data klinis terstruktur, dengan simpul dan cabang yang dapat diuji; komponen visual hanya merender data tersebut.
- Halaman menyediakan tampilan teks berurutan sebagai alternatif aksesibel saat panah visual sulit diikuti.
- Tes memverifikasi seluruh simpul dan cabang memiliki tujuan, ambang keputusan konsisten, tautan navigasi valid, serta tidak ada kontradiksi dengan panduan `Asfiksia Neonatorum`.
- Verifikasi manual mencakup desktop/ponsel, tema terang/gelap, navigasi keyboard, dan pembacaan tanpa warna; jalankan tes, lint, dan build produksi.

## Di luar cakupan

- Simulator pasien, timer otomatis, atau instruksi perawatan individual.
- Menempelkan gambar sebagai satu-satunya konten, karena tidak responsif dan tidak aksesibel.
- Publikasi atau push tanpa persetujuan terpisah bila diperlukan.
