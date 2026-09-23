import type { ClinicalSource, MilestoneAge } from "@/lib/types";

const milestoneSource: ClinicalSource = {
  org: "IDAI & Kementerian Kesehatan RI",
  title: "Buku KIA 2024, PRIMA IDAI, dan pemantauan perkembangan anak",
  year: 2024,
  url: "https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf",
};

/**
 * Ringkasan orientasi perkembangan, bukan salinan butir KPSP dan bukan alat
 * diagnosis. Skrining formal tetap menggunakan formulir KPSP sesuai usia.
 */
export const milestoneAges: MilestoneAge[] = [
  {
    ageMonths: 0, label: "Bayi baru lahir",
    milestones: {
      gross: ["Gerakan spontan kedua sisi tubuh tampak; amati postur dan tonus."],
      fine: ["Tangan sering menggenggam; penglihatan paling baik pada jarak dekat."],
      language: ["Menangis sebagai komunikasi awal dan bereaksi terhadap suara."],
      social: ["Mulai tenang dengan suara, sentuhan, dan kedekatan pengasuh."],
      cognitive: ["Mulai memusatkan pandangan singkat pada wajah atau kontras."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 2, label: "2 bulan",
    milestones: {
      gross: ["Saat tengkurap dan terjaga, mulai mengangkat kepala sebentar; amati simetri gerak."],
      fine: ["Tangan mulai lebih sering terbuka; mengikuti wajah atau benda dekat."],
      language: ["Mulai mengeluarkan suara selain menangis dan bereaksi pada suara pengasuh."],
      social: ["Menatap wajah dan mulai membalas interaksi, misalnya dengan senyum sosial."],
      cognitive: ["Memusatkan perhatian singkat pada wajah dan benda yang bergerak perlahan."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 4, label: "4 bulan",
    milestones: {
      gross: ["Kontrol kepala makin mantap; bertumpu pada lengan ketika tengkurap."],
      fine: ["Meraih benda dan membawa tangan atau benda ke mulut untuk mengeksplorasi."],
      language: ["Bersuara, tertawa, dan mulai bergantian membalas suara."],
      social: ["Menunjukkan senang saat diajak berinteraksi dan mengenali pengasuh."],
      cognitive: ["Mengamati tangan, wajah, dan benda; mengantisipasi rutinitas yang dikenal."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 6, label: "6 bulan",
    milestones: {
      gross: ["Berguling dan belajar duduk dengan bantuan; kemampuan tiap bayi dapat berbeda."],
      fine: ["Meraih, menggenggam, dan mengeksplorasi benda; mulai memindahkan benda antar tangan."],
      language: ["Mengoceh dengan variasi suara dan menoleh ke arah suara yang menarik."],
      social: ["Tertawa atau tersenyum dalam interaksi dan lebih tertarik pada orang yang dikenal."],
      cognitive: ["Mengeksplorasi benda dengan melihat, meraih, menggoyang, atau memasukkannya ke mulut."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 9, label: "9 bulan",
    milestones: {
      gross: ["Duduk tanpa disangga dan bergerak untuk menjangkau benda; cara berpindah dapat bervariasi."],
      fine: ["Memindahkan benda antar tangan dan mulai mengambil benda kecil dengan jari."],
      language: ["Mengoceh berulang dan mulai memahami isyarat atau kata yang sering didengar."],
      social: ["Mencari interaksi, meniru isyarat sederhana, dan mulai merespons nama atau suara akrab."],
      cognitive: ["Mencari benda yang terlihat disembunyikan dan memperhatikan arah perhatian pengasuh."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 12, label: "12 bulan",
    milestones: {
      gross: ["Menarik tubuh untuk berdiri atau berpegangan; sebagian anak mulai melangkah."],
      fine: ["Mengambil benda kecil dengan ibu jari-telunjuk dan memasukkan benda ke wadah."],
      language: ["Mengoceh dengan suku kata berulang; memahami kata atau instruksi yang sangat akrab."],
      social: ["Mengenali nama, menunjuk atau memberi isyarat, tersenyum, bertepuk tangan, atau melambai."],
      cognitive: ["Meniru tindakan sederhana dan mencari benda yang disembunyikan."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 15, label: "15 bulan",
    milestones: {
      gross: ["Eksplorasi berdiri dan berjalan bertambah; catat kemajuan dan kualitas gerak."],
      fine: ["Menggunakan jari untuk mengambil makanan atau benda dan mencoba mencoret."],
      language: ["Menggunakan suara, kata, dan gestur untuk meminta atau berbagi perhatian."],
      social: ["Meniru kegiatan sehari-hari dan mencari respons pengasuh saat bermain."],
      cognitive: ["Mencoba beberapa cara untuk mendapatkan benda dan menggunakan benda sehari-hari."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 18, label: "18 bulan",
    milestones: {
      gross: ["Berjalan mandiri; amati keseimbangan, simetri, dan kemampuan berpindah."],
      fine: ["Mencoret, memasukkan benda ke wadah, dan mulai mencoba makan sendiri."],
      language: ["Menambah kata bermakna dan memahami instruksi sederhana dalam rutinitas."],
      social: ["Menunjuk untuk meminta atau menunjukkan, meniru, dan bermain pura-pura sederhana."],
      cognitive: ["Menjelajahi cara kerja benda dan menyelesaikan masalah sederhana saat bermain."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 24, label: "2 tahun",
    milestones: {
      gross: ["Berjalan dan berlari makin mantap; mulai menendang atau menaiki tangga dengan bantuan."],
      fine: ["Menyusun balok, mencoret, membalik halaman, dan menggunakan sendok dengan latihan."],
      language: ["Mulai merangkai dua kata bermakna; memahami lebih banyak kata daripada yang diucapkan."],
      social: ["Meniru kegiatan rumah, bermain dekat anak lain, dan menunjukkan keinginan mandiri."],
      cognitive: ["Mulai bermain pura-pura, mencocokkan benda, dan mengikuti instruksi sederhana."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 30, label: "2,5 tahun",
    milestones: {
      gross: ["Berlari, memanjat dengan pengawasan, dan mencoba melompat."],
      fine: ["Membuka halaman satu per satu, membuat coretan terarah, dan mencoba melepas pakaian."],
      language: ["Menggabungkan beberapa kata dan mulai melakukan percakapan dua arah sederhana."],
      social: ["Bermain pura-pura, mulai bergiliran, dan menyatakan kebutuhan atau perasaan."],
      cognitive: ["Mengelompokkan atau mencocokkan benda sederhana dan mengikuti rutinitas bertahap."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 36, label: "3 tahun",
    milestones: {
      gross: ["Berlari dan menaiki tangga makin terkoordinasi; permainan gerak semakin bervariasi."],
      fine: ["Menggambar bentuk sederhana, menyusun benda, dan mulai membantu memakai pakaian."],
      language: ["Menyusun kalimat lebih panjang, menjawab pertanyaan sederhana, dan bercerita singkat."],
      social: ["Mulai bermain bersama, bergiliran, dan menunjukkan perhatian terhadap orang lain."],
      cognitive: ["Memahami instruksi berurutan sederhana, bermain pura-pura, dan memecahkan masalah saat bermain."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 48, label: "4 tahun",
    milestones: {
      gross: ["Melompat, berlari, dan menjaga keseimbangan dalam permainan aktif."],
      fine: ["Menggambar bentuk yang dikenal, menggunakan alat sederhana dengan pengawasan, dan berpakaian dengan bantuan minimal."],
      language: ["Bercerita tentang pengalaman dan memahami percakapan sehari-hari."],
      social: ["Bermain peran, bekerja sama, dan belajar mengelola emosi dengan bantuan orang dewasa."],
      cognitive: ["Mengenali beberapa warna atau pola, mengelompokkan benda, dan mengikuti aturan permainan sederhana."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 60, label: "5 tahun",
    milestones: {
      gross: ["Berpartisipasi dalam permainan yang membutuhkan koordinasi, lompatan, atau keseimbangan."],
      fine: ["Menggambar lebih terencana, menggunakan alat tulis, dan melakukan tugas berpakaian sederhana."],
      language: ["Menyampaikan cerita yang dapat diikuti dan memahami arahan sehari-hari."],
      social: ["Bermain dengan aturan dan teman, bergiliran, serta makin mandiri dalam rutinitas."],
      cognitive: ["Menunjukkan rasa ingin tahu, mengelompokkan atau menghitung benda, dan memahami urutan sederhana."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
  {
    ageMonths: 72, label: "6 tahun",
    milestones: {
      gross: ["Mengembangkan koordinasi dan stamina untuk permainan aktif sesuai kesempatan dan kondisi."],
      fine: ["Meningkatkan kontrol alat tulis, gambar, dan keterampilan bantu diri."],
      language: ["Mengikuti percakapan, menceritakan pengalaman berurutan, dan memahami petunjuk bertahap."],
      social: ["Belajar bekerja sama, mengikuti kesepakatan, berteman, dan meminta bantuan."],
      cognitive: ["Menunjukkan kesiapan belajar melalui perhatian, pemecahan masalah, bahasa, dan rasa ingin tahu."],
    }, redFlags: [], activities: [], source: milestoneSource,
  },
];

export const milestoneDomains: { key: "gross" | "fine" | "language" | "social" | "cognitive"; label: string; icon: string }[] = [
  { key: "gross", label: "Motorik kasar", icon: "🏃" },
  { key: "fine", label: "Motorik halus", icon: "✋" },
  { key: "language", label: "Bahasa dan komunikasi", icon: "🗣️" },
  { key: "social", label: "Sosial dan kemandirian", icon: "🤝" },
  { key: "cognitive", label: "Kognitif dan adaptif", icon: "🧠" },
];

export const kpspScheduleMonths = [3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72];

export const developmentSources = [
  { org: "Kementerian Kesehatan RI", title: "Buku Kesehatan Ibu dan Anak (KIA), Edisi 2024", url: "https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf" },
  { org: "Kementerian Kesehatan RI", title: "Kepmenkes HK.01.07/MENKES/84/2026: tindak lanjut skrining perkembangan dan KPSP", url: "https://jdih.kemkes.go.id/storage/documents/pdfs/2026kepmenkes084.pdf" },
  { org: "Kementerian Kesehatan RI", title: "Pedoman KPSP: cara menentukan usia dan interpretasi hasil", url: "https://p2.kemkes.go.id/wp-content/uploads/2025/05/Final_Pedoman-Nasional-Tata-Laksana-Klinis-Komunitas-dan-Lingkungan-Akibat-Pajanan-Timbal-Pada-Anak-dan-Ibu-Hamil.pdf" },
  { org: "Kementerian Kesehatan RI", title: "Kurikulum pelatihan SDIDTK dan kelompok usia skrining KPSP", url: "https://siakpel.kemkes.go.id/upload/akreditasi_kurikulum/kurikulum-1-36393833-3333-4839-b730-303933353031.pdf" },
  { org: "Kementerian Kesehatan RI", title: "Jadwal dan prosedur KPSP dalam Buku KIA", url: "https://repositori-ditjen-nakes.kemkes.go.id/100/2/02Buku-KIA-06-10-2015-small.pdf" },
  { org: "Kementerian Kesehatan RI", title: "Buku KIA Khusus Bayi Kecil: usia koreksi untuk bayi prematur/BBLR", url: "https://ayosehat.kemkes.go.id/buku-kia-khusus-bayi-kecil" },
  { org: "IDAI", title: "PRIMA IDAI untuk dokter anak: jadwal kunjungan dan pemantauan", url: "https://www.idai.or.id/prima-idai/untuk-dokter-anak.html" },
  { org: "IDAI", title: "Pentingnya Memantau Pertumbuhan dan Perkembangan Anak (Bagian 2)", url: "https://www.idai.or.id/artikel/seputar-kesehatan-anak/pentingnya-memantau-pertumbuhan-dan-perkembangan-anak-bagian-2" },
  { org: "IDAI", title: "Mencegah Terlambat Bicara pada Anak: tanda bahaya bahasa dan komunikasi", url: "https://www.idai.or.id/artikel/klinik/pengasuhan-anak/mencegah-terlambat-bicara-pada-anak" },
  { org: "IDAI", title: "Merangsang Perkembangan Personal Sosial Bayi", url: "https://www.idai.or.id/artikel/klinik/pengasuhan-anak/merangsang-perkembangan-personal-sosial-bayi" },
  { org: "IDAI", title: "Kapan Anak Siap Masuk Sekolah Dasar", url: "https://www.idai.or.id/artikel/klinik/pengasuhan-anak/kapan-anak-siap-masuk-sekolah-dasar" },
  { org: "American Academy of Pediatrics", title: "Promoting Optimal Development: Developmental Surveillance and Screening (Pediatrics, 2020)", url: "https://publications.aap.org/pediatrics/article/145/1/e20193449/36971/" },
];

export const developmentRedFlags = [
  "Kemampuan yang sebelumnya sudah dikuasai menghilang (regresi), kapan pun terjadi.",
  "Tidak ada suara sama sekali sampai 6 bulan, atau belum mengoceh sampai 12 bulan; belum ada satu kata bermakna pada 16 bulan; belum ada frasa bermakna setelah 24 bulan.",
  "Belum menunjuk untuk berbagi perhatian atau minat sekitar 20 bulan, atau respons terhadap suara tidak konsisten.",
  "Ucapan tetap sulit dipahami orang tua setelah 30 bulan, atau anak sering mengulang ucapan tanpa komunikasi timbal balik.",
  "Gerak sangat tidak simetris, kelemahan/tonus tampak tidak wajar, keterlambatan motorik yang menetap, atau ada kekhawatiran keluarga/tenaga kesehatan.",
  "Kecurigaan gangguan pendengaran atau penglihatan, respons sosial yang sangat terbatas, atau keterlambatan pada lebih dari satu domain.",
];

/** Best-matching milestone age entry for a given age in months. */
export function milestoneForAge(items: MilestoneAge[], ageMonths: number): MilestoneAge | null {
  let best: MilestoneAge | null = null;
  for (const milestone of items) {
    if (ageMonths >= milestone.ageMonths) best = milestone;
  }
  return best;
}
