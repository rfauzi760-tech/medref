import "server-only";

export type NeonatalNodeKind = "start" | "action" | "decision" | "terminal";

export interface NeonatalFlowNode {
  id: string;
  kind: NeonatalNodeKind;
  title: string;
  body: readonly string[];
  branches: readonly { label: string; to: string }[];
}

export const NEONATAL_FLOW: readonly NeonatalFlowNode[] = [
  {
    id: "preparation",
    kind: "start",
    title: "Sebelum kelahiran",
    body: ["Konseling antenatal, penilaian risiko, pembagian tugas tim, dan pemeriksaan alat.", "Rencanakan penanganan tali pusat bersama tim obstetri."],
    branches: [{ label: "Saat bayi lahir", to: "birth" }],
  },
  {
    id: "birth",
    kind: "action",
    title: "Bayi lahir",
    body: ["Jalankan rencana penanganan tali pusat. Penundaan penjepitan ≥60 detik bermanfaat pada bayi yang tidak memerlukan resusitasi segera."],
    branches: [{ label: "Nilai bayi", to: "first-check" }],
  },
  {
    id: "first-check",
    kind: "decision",
    title: "Cukup bulan, tonus baik, dan bernapas atau menangis?",
    body: ["Ketiga temuan harus ada untuk masuk ke perawatan rutin."],
    branches: [{ label: "Ya", to: "routine-care" }, { label: "Tidak", to: "initial-steps" }],
  },
  {
    id: "routine-care",
    kind: "terminal",
    title: "Perawatan rutin bersama orang tua",
    body: ["Kontak kulit, jaga suhu normal, dukung menyusu, dan evaluasi napas serta suhu secara berkelanjutan."],
    branches: [],
  },
  {
    id: "initial-steps",
    kind: "action",
    title: "Langkah awal",
    body: ["Hangatkan dan pertahankan suhu, keringkan, posisikan jalan napas, serta stimulasi bila perlu.", "Bersihkan jalan napas hanya bila ada tanda sumbatan. Jangan tunda ventilasi."],
    branches: [{ label: "Nilai napas dan denyut jantung", to: "breathing-check" }],
  },
  {
    id: "breathing-check",
    kind: "decision",
    title: "Apnea, megap-megap, atau denyut jantung <100/menit?",
    body: ["Selesaikan penilaian awal dan mulai ventilasi bila terindikasi dalam 60 detik pertama setelah lahir."],
    branches: [{ label: "Ya", to: "ventilation" }, { label: "Tidak", to: "distress-check" }],
  },
  {
    id: "distress-check",
    kind: "decision",
    title: "Napas berat atau sianosis persisten?",
    body: ["Pantau kondisi dan tentukan apakah dukungan pernapasan diperlukan."],
    branches: [{ label: "Ya", to: "cpap" }, { label: "Tidak", to: "routine-care" }],
  },
  {
    id: "cpap",
    kind: "action",
    title: "Dukungan pernapasan",
    body: ["Pasang oksimeter preduktal, berikan oksigen bila perlu sesuai target saturasi, dan pertimbangkan CPAP.", "Nilai ulang usaha napas, oksigenasi, dan denyut jantung."],
    branches: [{ label: "Stabil", to: "post-care" }, { label: "Apnea atau denyut <100/menit", to: "ventilation" }],
  },
  {
    id: "ventilation",
    kind: "action",
    title: "Ventilasi tekanan positif",
    body: ["Mulai dalam menit pertama bila apnea, megap-megap, atau denyut jantung <100/menit.", "Berikan 30–60 inflasi/menit. Tekanan inflasi awal 20–30 cmH₂O dapat digunakan, lalu sesuaikan agar ventilasi efektif tanpa tekanan berlebihan.", "Pasang oksimeter preduktal dan pertimbangkan monitor jantung. Kenaikan denyut jantung adalah tanda utama ventilasi efektif."],
    branches: [{ label: "Evaluasi setelah ventilasi", to: "heart-rate-after-ventilation" }],
  },
  {
    id: "heart-rate-after-ventilation",
    kind: "decision",
    title: "Denyut jantung masih <100/menit?",
    body: ["Pastikan pengembangan dada dan respons denyut jantung."],
    branches: [{ label: "Ya", to: "correct-ventilation" }, { label: "Tidak", to: "post-care" }],
  },
  {
    id: "correct-ventilation",
    kind: "action",
    title: "Koreksi ventilasi",
    body: ["Perbaiki lekatan sungkup dan posisi jalan napas, nilai sumbatan, sesuaikan tekanan, dan pertimbangkan jalan napas alternatif.", "Jika ventilasi sungkup tidak efektif, pertimbangkan pipa endotrakeal atau sungkup laring."],
    branches: [{ label: "Setelah ventilasi efektif", to: "heart-rate-after-correction" }],
  },
  {
    id: "heart-rate-after-correction",
    kind: "decision",
    title: "Denyut jantung <60/menit setelah 30 detik ventilasi efektif?",
    body: ["Ventilasi yang mengembangkan dada harus dioptimalkan sebelum kompresi."],
    branches: [{ label: "Ya", to: "compressions" }, { label: "Tidak, tetapi <100/menit", to: "continue-ventilation" }, { label: "≥100/menit", to: "post-care" }],
  },
  {
    id: "continue-ventilation",
    kind: "action",
    title: "Lanjutkan ventilasi dan nilai ulang",
    body: ["Teruskan ventilasi efektif sambil menilai denyut jantung serta napas sampai kondisi membaik atau perlu eskalasi."],
    branches: [{ label: "Nilai ulang", to: "heart-rate-after-correction" }],
  },
  {
    id: "compressions",
    kind: "action",
    title: "Kompresi dada dan ventilasi",
    body: ["Gunakan pipa endotrakeal atau sungkup laring bila memungkinkan, lalu lakukan kompresi terkoordinasi 3:1 dengan ventilasi.", "Berikan oksigen 100% selama kompresi. Siapkan kateter vena umbilikalis; akses intraoseus bila akses intravaskular tidak memungkinkan.", "Lakukan 90 kompresi dan 30 inflasi per menit, lalu nilai ulang setelah 60 detik."],
    branches: [{ label: "Nilai ulang", to: "heart-rate-after-compressions" }],
  },
  {
    id: "heart-rate-after-compressions",
    kind: "decision",
    title: "Denyut jantung tetap <60/menit?",
    body: ["Pastikan ventilasi dan kompresi sudah efektif."],
    branches: [{ label: "Ya", to: "epinephrine" }, { label: "Tidak", to: "post-care" }],
  },
  {
    id: "epinephrine",
    kind: "action",
    title: "Epinefrin dan penilaian ulang",
    body: ["Epinefrin intravaskular 0,01–0,03 mg/kg melalui kateter vena umbilikalis atau akses intraoseus; verifikasi konsentrasi dan protokol setempat.", "Saat akses vaskular disiapkan, dosis endotrakeal 0,05–0,1 mg/kg dapat dipertimbangkan.", "Bila denyut tetap <60/menit, dosis tambahan tiap 3–5 menit dapat dipertimbangkan, utamakan jalur intravaskular."],
    branches: [{ label: "Nilai respons", to: "persistent-bradycardia" }],
  },
  {
    id: "persistent-bradycardia",
    kind: "decision",
    title: "Denyut jantung masih <60/menit?",
    body: ["Tinjau efektivitas ventilasi, kompresi, dan pemberian obat."],
    branches: [{ label: "Ya", to: "reversible-causes" }, { label: "Tidak", to: "post-care" }],
  },
  {
    id: "reversible-causes",
    kind: "action",
    title: "Pertimbangkan penyebab reversibel",
    body: ["Pertimbangkan hipovolemia atau pneumotoraks. Bila kehilangan darah dicurigai dan tidak merespons epinefrin intravaskular, pertimbangkan ekspansi volume sesuai protokol."],
    branches: [{ label: "Teruskan resusitasi dan nilai ulang", to: "persistent-bradycardia" }],
  },
  {
    id: "post-care",
    kind: "terminal",
    title: "Perawatan pascaresusitasi",
    body: ["Pantau napas, oksigenasi, denyut jantung, suhu, dan glukosa setelah stabilisasi.", "Bila resusitasi lanjut diperlukan, nilai risiko ensefalopati hipoksik-iskemik, tentukan kebutuhan rujukan, komunikasikan kondisi kepada keluarga, dan lakukan evaluasi tim."],
    branches: [],
  },
];

export const NEONATAL_OXYGEN_TARGETS = [
  { minute: 2, target: "65–70%" },
  { minute: 3, target: "70–75%" },
  { minute: 4, target: "75–80%" },
  { minute: 5, target: "80–85%" },
  { minute: 10, target: "85–95%" },
] as const;

export const NEONATAL_SOURCES = [
  { label: "AHA/AAP Neonatal Resuscitation Algorithm", year: 2025, url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/1-2-Algorithm-Neonatal-Resuscitation-250129.pdf" },
  { label: "AHA/AAP Neonatal Resuscitation Guidelines", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation" },
  { label: "IDAI: Resusitasi, stabilisasi, dan transpor BBLR", year: 2022, url: "https://www.idai.or.id/professional-resources/pedoman-konsensus/pedoman-nasional-pelayanan-kedokteran-tata-laksana-berat-badan-lahir-rendah" },
] as const;
