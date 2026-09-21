# Sumber interaksi obat RFSmed

## Sumber data

Data interaksi obat pada modul **Interaksi Obat** berasal dari DDInter 2.0, bukan dari Klinea.

- Sumber: https://ddinter2.scbdd.com/
- Publikasi: Xiong G, et al. *DDInter 2.0: an enhanced drug interaction resource with expanded data coverage, new interaction types, and improved user interface*. Nucleic Acids Research. 2025;53(D1):D1356-D1364.
- Data diambil dari tabel pasangan obat DDInter 2.0 dan dinormalisasi ke slug obat RFSmed yang memiliki kecocokan nama bahan aktif secara eksplisit.
- Rilis ini memuat 4.788 pasangan DDInter yang kedua bahan aktifnya dapat dipetakan secara eksplisit; manifest pemetaan disimpan di `lib/generated/ddinter-rfsmed-map.json`.
- Lisensi data: CC BY-NC-SA 4.0. Periksa kembali ketentuan sumber sebelum penggunaan komersial.

## Batasan klinis

DDInter menyediakan tingkat keparahan dan deskripsi mekanisme/efek, tetapi tidak menyediakan rekomendasi manajemen terstruktur untuk setiap pasangan. Karena itu RFSmed tidak mengarang rekomendasi dosis atau perubahan terapi. Jika pasangan tidak tercatat, aplikasi menampilkan bahwa data tersebut adalah celah pengetahuan, bukan jaminan tidak ada interaksi.

Data ini adalah alat bantu skrining dan harus diverifikasi terhadap label resmi, formularium lokal, kondisi pasien, fungsi ginjal/hati, serta farmasis atau dokter yang merawat.
