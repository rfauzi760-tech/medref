import type { ScoreTool } from "@/lib/types";

export const SIRIRAJ_SCORE: ScoreTool = {
  id: "siriraj-stroke-score",
  slug: "siriraj-stroke-score",
  title: "Siriraj Stroke Score",
  abbreviation: "SSS",
  type: "score",
  category: "score",
  description: "Alat bantu klinis untuk memperkirakan stroke perdarahan supratentorial atau infark saat pencitraan belum tersedia.",
  specialties: ["Neurology", "Emergency Medicine"],
  keywords: ["siriraj", "stroke", "perdarahan", "hemoragik", "infark", "iskemik"],
  indication: "Pasien dengan dugaan stroke akut supratentorial ketika CT atau MRI belum tersedia segera.",
  limitations: "Akurasi berbeda antar populasi. Skor tidak menggantikan CT atau MRI dan tidak boleh digunakan sendiri untuk menentukan trombolisis atau terapi spesifik stroke.",
  warnings: [
    "Lakukan pencitraan otak tanpa penundaan untuk membedakan perdarahan dan iskemia sebelum terapi reperfusi.",
    "Jangan menentukan trombolisis hanya dari Siriraj Stroke Score.",
  ],
  lastReviewed: "2026-09-13",
  source: {
    org: "Poungvarin N, Viriyavejakul A, Komontri C",
    title: "Siriraj stroke score and validation study to distinguish supratentorial intracerebral haemorrhage from infarction",
    year: 1991,
    url: "https://doi.org/10.1136/bmj.302.6792.1565",
  },
  variables: [
    {
      id: "consciousness",
      label: "Tingkat kesadaran",
      shortLabel: "Kesadaran",
      type: "select",
      required: true,
      options: [
        { label: "Sadar penuh", value: 0 },
        { label: "Mengantuk atau bingung", value: 2.5 },
        { label: "Tidak sadar atau koma", value: 5 },
      ],
    },
    {
      id: "vomiting",
      label: "Muntah",
      type: "select",
      required: true,
      options: [{ label: "Tidak", value: 0 }, { label: "Ya", value: 2 }],
    },
    {
      id: "headache",
      label: "Nyeri kepala",
      help: "Nyeri kepala dalam 2 jam pertama sejak onset.",
      type: "select",
      required: true,
      options: [{ label: "Tidak", value: 0 }, { label: "Ya", value: 2 }],
    },
    {
      id: "dbp",
      label: "Tekanan darah diastolik",
      shortLabel: "TDD",
      unit: "mmHg",
      type: "number",
      required: true,
      min: 20,
      max: 200,
      step: 1,
      scale: (value) => value * 0.1,
    },
    {
      id: "atheroma",
      label: "Penanda ateroma",
      help: "Riwayat diabetes, angina, atau klaudikasio intermiten. Nilai 1 bila satu atau lebih ada.",
      type: "select",
      required: true,
      options: [{ label: "Tidak ada", value: 0 }, { label: "Ada satu atau lebih", value: -3 }],
    },
  ],
  compute: (values) => ({
    total: Number(values.consciousness)
      + Number(values.vomiting)
      + Number(values.headache)
      + (0.1 * Number(values.dbp))
      + Number(values.atheroma)
      - 12,
  }),
  ranges: [
    { min: -9999, max: -1.000001, category: "Mengarah ke infark", label: "Skor < -1 mengarah ke infark serebral.", tone: "info" },
    { min: -1, max: 1, category: "Tidak pasti", label: "Skor -1 sampai 1 tidak dapat membedakan tipe stroke.", tone: "warning" },
    { min: 1.000001, max: 9999, category: "Mengarah ke perdarahan", label: "Skor > 1 mengarah ke perdarahan supratentorial.", tone: "danger" },
  ],
};
