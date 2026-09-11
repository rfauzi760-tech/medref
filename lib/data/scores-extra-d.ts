import type { ScoreTool } from "@/lib/types";

/** Skor/klasifikasi tambahan - bagian D: ortopedi, THT, paru, urologi. */

export const EXTRA_SCORES_D: ScoreTool[] = [
  {
    id: "ottawa-ankle",
    slug: "ottawa-ankle",
    title: "Ottawa Ankle Rules (Indikasi Rontgen)",
    abbreviation: "OAR",
    type: "score",
    category: "rule",
    description:
      "Aturan untuk memutuskan perlunya foto rontgen pada cedera pergelangan kaki/midfoot akut - menurunkan rontgen yang tidak perlu tanpa melewatkan fraktur signifikan.",
    specialties: ["Orthopedics", "Emergency Medicine"],
    keywords: ["ottawa ankle", "rontgen ankle", "fraktur", "cedera pergelangan", "ankle rules", "midfoot"],
    indication: "Cedera pergelangan kaki/midfoot akut pada dewasa (aplikasi pediatrik perlu modifikasi).",
    limitations: "Tidak berlaku bila nyeri dapat dilokalisasi di luar zona malleolus/midfoot (mis. fraktur shaft tibia), cedera > 10 hari, atau gangguan sensorik.",
    warnings: ["Rontgen diindikasikan bila terdapat nyeri di zona malleolus + salah satu kriteria, atau nyeri midfoot + salah satu kriteria."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Stiell IG et al.",
      title: "Ottawa ankle rules - decision rule for use of radiography in acute ankle injuries",
      year: 1992,
      url: "https://doi.org/10.1001/jama.1992.03490170065035",
    },
    variables: [
      { id: "painAnkle", label: "Nyeri di daerah pergelangan kaki (zona malleolus)", shortLabel: "Nyeri zona malleolus", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "postLat", label: "Nyeri tekan tepi belakang/ujung maleolus lateral", shortLabel: "Nyeri maleolus lateral", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "postMed", label: "Nyeri tekan tepi belakang/ujung maleolus medial", shortLabel: "Nyeri maleolus medial", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "painMidfoot", label: "Nyeri di daerah midfoot (bagian tengah kaki)", shortLabel: "Nyeri midfoot", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "nav", label: "Nyeri tekan os navikulare", shortLabel: "Nyeri navikulare", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "base5", label: "Nyeri tekan pangkal metatarsal ke-5", shortLabel: "Nyeri basis MT-5", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "cannotBear", label: "Tidak mampu menumpu berat badan 4 langkah (segera dan di IGD)", shortLabel: "Tidak mampu tumpu", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const n = (k: string) => Number(v[k]) || 0;
      const ankle = n("painAnkle") === 1 && (n("postLat") === 1 || n("postMed") === 1 || n("cannotBear") === 1);
      const foot = n("painMidfoot") === 1 && (n("nav") === 1 || n("base5") === 1 || n("cannotBear") === 1);
      if (ankle && foot) return { total: 3, detail: "Rontgen pergelangan (proyeksi ankle) dan kaki (foot) diindikasikan." };
      if (ankle) return { total: 2, detail: "Rontgen ankle diindikasikan." };
      if (foot) return { total: 1, detail: "Rontgen kaki (foot) diindikasikan." };
      return { total: 0, detail: "Kriteria tidak terpenuhi - fraktur signifikan tidak mungkin menurut aturan." };
    },
    ranges: [
      { min: 0, max: 0, category: "Rontgen tidak diindikasikan", label: "Ottawa ankle rules negatif - tatalaksana konservatif (RICE, analgesik), edukasi bila nyeri menetap", tone: "success" },
      { min: 1, max: 3, category: "Rontgen diindikasikan", label: "Salah satu aturan terpenuhi - lakukan foto rontgen sesuai zona nyeri", tone: "danger" },
    ],
  },
  {
    id: "gustilo",
    slug: "gustilo",
    title: "Klasifikasi Gustilo-Anderson (Fraktur Terbuka)",
    abbreviation: "Gustilo",
    type: "score",
    category: "criteria",
    description:
      "Klasifikasi keparahan fraktur terbuka berdasarkan ukuran luka, energi, kontaminasi, dan perfusi - memandu tatalaksana bedah dan prognosis.",
    specialties: ["Orthopedics", "Surgery", "Emergency Medicine"],
    keywords: ["gustilo", "fraktur terbuka", "open fracture", "luka terbuka", "klasifikasi"],
    indication: "Fraktur terbuka (tulang berhubungan dengan dunia luar).",
    limitations: "Klasifikasi sebaiknya dinilai di kamar operasi; penilaian awal di IGD bersifat sementara.",
    warnings: ["Semua fraktur terbuka: antibiotik dini, irigasi-debridement, profilaksis tetanus."],
    lastReviewed: "2025-06-01",
    source: { org: "Gustilo RB, Anderson JT", title: "Prevention of infection in the treatment of one thousand and twenty-five open fractures", year: 1976, url: "https://doi.org/10.2106/00004623-197658040-00004" },
    variables: [
      {
        id: "grade", label: "Pilih gambaran luka yang paling sesuai", shortLabel: "Derajat", type: "select", required: true,
        options: [
          { label: "I - Luka < 1 cm, bersih, energi rendah", value: 1 },
          { label: "II - Luka 1–10 cm tanpa kontaminasi berat / tanpa avulsi luas", value: 2 },
          { label: "IIIA - Luka > 10 cm, energi tinggi, kontaminasi, namun jaringan lunak dapat ditutup", value: 3 },
          { label: "IIIB - Luka > 10 cm dengan periosteal stripping / perlu flap untuk menutup", value: 4 },
          { label: "IIIC - Disertai cedera arteri yang memerlukan perbaikan", value: 5 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "Gustilo I", label: "Energi rendah - irigasi/debridement + fiksasi; antibiotik profilaksis (sefazolin) 24 jam", tone: "success" },
      { min: 2, max: 2, category: "Gustilo II", label: "Energi sedang - debridement luas + antibiotik; konsultasi ortopedi", tone: "warning" },
      { min: 3, max: 3, category: "Gustilo IIIA", label: "Energi tinggi/kontaminasi - debridement agresif serial, antibiotik luas, konsultasi ortopedi segera", tone: "danger" },
      { min: 4, max: 4, category: "Gustilo IIIB", label: "Perlu flap jaringan lunak - risiko infeksi tinggi; operasi oleh tim ortopedi rekonstruksi", tone: "danger" },
      { min: 5, max: 5, category: "Gustilo IIIC", label: "Cedera vaskular - ekstremitas terancam; perbaikan vaskular < 6 jam", action: "Konsultasi ortopedi & bedah vaskular segera; dokumentasikan status neurovaskular.", tone: "danger" },
    ],
  },
  {
    id: "salter-harris",
    slug: "salter-harris",
    title: "Klasifikasi Salter-Harris (Fraktur Lempeng Pertumbuhan)",
    abbreviation: "Salter-Harris",
    type: "score",
    category: "criteria",
    description:
      "Klasifikasi fraktur yang melibatkan lempeng pertumbuhan pada anak - menentukan risiko gangguan pertumbuhan.",
    specialties: ["Orthopedics", "Pediatrics"],
    keywords: ["salter harris", "fraktur anak", "lempeng pertumbuhan", "growth plate", "epifisis"],
    indication: "Fraktur di sekitar sendi pada anak dengan lempeng pertumbuhan masih terbuka.",
    limitations: "Foto kontralateral/khusus sering membantu; makin tinggi tipe, makin besar risiko gangguan pertumbuhan.",
    warnings: ["Salter-Harris I dapat tersamar (tanda hanya nyeri tekan lempeng) - nilai ulang bila nyeri menetap."],
    lastReviewed: "2025-06-01",
    source: { org: "Salter RB, Harris WR", title: "Injuries involving the epiphyseal plate", year: 1963 },
    variables: [
      {
        id: "type", label: "Pilih tipe Salter-Harris", shortLabel: "Tipe", type: "select", required: true,
        options: [
          { label: "I - Terpisahnya lempeng pertumbuhan (kadang tanpa pergeseran)", value: 1 },
          { label: "II - Fraktur melalui lempeng + metafisis (paling sering)", value: 2 },
          { label: "III - Fraktur melalui lempeng + epifisis (intra-artikular)", value: 3 },
          { label: "IV - Fraktur melalui epifisis, lempeng, dan metafisis", value: 4 },
          { label: "V - Cedera kompresi lempeng pertumbuhan", value: 5 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "SH I", label: "Prognosis baik; risiko gangguan pertumbuhan rendah", tone: "success" },
      { min: 2, max: 2, category: "SH II", label: "Umumnya prognosis baik; reduksi tertutup + imobilisasi", tone: "success" },
      { min: 3, max: 3, category: "SH III", label: "Perlu reduksi anatomis (umumnya operatif) - risiko gangguan pertumbuhan", tone: "warning" },
      { min: 4, max: 4, category: "SH IV", label: "Perlu reduksi anatomis operatif - risiko gangguan pertumbuhan & artrosis dini", tone: "warning" },
      { min: 5, max: 5, category: "SH V", label: "Risiko tertinggi gangguan pertumbuhan (sering baru tampak kemudian)", action: "Konsultasi ortopedi anak; follow-up serial.", tone: "danger" },
    ],
  },
  {
    id: "house-brackmann",
    slug: "house-brackmann",
    title: "Skala House-Brackmann (Paresis N. Fasialis)",
    abbreviation: "House-Brackmann",
    type: "score",
    category: "score",
    description:
      "Derajat fungsi nervus fasialis I–VI - dipakai pada Bell's palsy, sindrom Ramsay Hunt, dan pascaoperasi.",
    specialties: ["ENT", "Neurology"],
    keywords: ["house brackmann", "bells palsy", "paresis wajah", "nervus fasialis", "facial nerve"],
    indication: "Penilaian derajat kelemahan otot wajah.",
    limitations: "Klasifikasi global - rincian per cabang dapat menambah informasi.",
    lastReviewed: "2025-06-01",
    source: { org: "House JW, Brackmann DE", title: "Facial nerve grading system", year: 1985, url: "https://doi.org/10.1016/S0194-5998(85)80021-6" },
    variables: [
      {
        id: "grade", label: "Pilih derajat fungsi wajah", shortLabel: "Derajat", type: "select", required: true,
        options: [
          { label: "I - Fungsi normal", value: 1 },
          { label: "II - Disfungsi ringan: hampir normal, asimetri minimal saat berusaha", value: 2 },
          { label: "III - Disfungsi sedang: asimetri jelas namun dahi masih bergerak, mata dapat ditutup dengan usaha", value: 3 },
          { label: "IV - Disfungsi sedang-berat: dahi tidak bergerak, mata tidak dapat tertutup penuh", value: 4 },
          { label: "V - Disfungsi berat: nyaris tidak ada gerakan, deformitas saat istirahat", value: 5 },
          { label: "VI - Paralisis total", value: 6 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "Grade I", label: "Fungsi normal", tone: "success" },
      { min: 2, max: 2, category: "Grade II", label: "Disfungsi ringan - prognosis umumnya baik", tone: "success" },
      { min: 3, max: 3, category: "Grade III", label: "Disfungsi sedang - umumnya hasil baik pada Bell's palsy", tone: "warning" },
      { min: 4, max: 4, category: "Grade IV", label: "Disfungsi sedang-berat - proteksi mata penting", action: "Air mata buatan, tutup mata saat tidur; konsultasi THT/neurologi.", tone: "warning" },
      { min: 5, max: 5, category: "Grade V", label: "Disfungsi berat", tone: "danger" },
      { min: 6, max: 6, category: "Grade VI", label: "Paralisis total - evaluasi etiologi (Bell's, Ramsay Hunt, tumor, stroke)", tone: "danger" },
    ],
  },
  {
    id: "mmrc",
    slug: "mmrc",
    title: "Skala Dispnea mMRC",
    abbreviation: "mMRC",
    type: "score",
    category: "score",
    description:
      "Modified Medical Research Council dyspnoea scale (0–4) - mengukur dampak sesak pada aktivitas; dipakai pada PPOK dan asma.",
    specialties: ["Pulmonology", "Internal Medicine"],
    keywords: ["mmrc", "dispnea", "sesak", "ppok", "dyspnea", "copd"],
    indication: "Menilai keparahan sesak dan dampaknya pada aktivitas harian.",
    limitations: "Subjektif; kombinasikan dengan pemeriksaan fungsi paru.",
    lastReviewed: "2025-06-01",
    source: { org: "Fletcher CM", title: "Standardised questionnaire on respiratory symptoms (MRC)", year: 1959 },
    variables: [
      {
        id: "grade", label: "Pilih tingkat sesak", shortLabel: "mMRC", type: "select", required: true,
        options: [
          { label: "0 - Sesak hanya saat aktivitas berat", value: 0 },
          { label: "1 - Terengah saat berjalan cepat / menanjak landai", value: 1 },
          { label: "2 - Berjalan lebih lambat dari orang seumur karena sesak, atau berhenti saat berjalan di datar", value: 2 },
          { label: "3 - Berhenti setelah berjalan ±100 m atau beberapa menit di datar", value: 3 },
          { label: "4 - Terlalu sesak untuk keluar rumah / sesak saat berpakaian", value: 4 },
        ],
      },
    ],
    ranges: [
      { min: 0, max: 0, category: "mMRC 0", label: "Sesak hanya aktivitas berat", tone: "success" },
      { min: 1, max: 1, category: "mMRC 1", label: "Sesak saat berjalan cepat/menanjak", tone: "success" },
      { min: 2, max: 2, category: "mMRC 2", label: "Berjalan di datar lebih lambat karena sesak", tone: "warning" },
      { min: 3, max: 3, category: "mMRC 3", label: "Berhenti setelah ±100 m di datar", tone: "danger" },
      { min: 4, max: 4, category: "mMRC 4", label: "Sesak berat membatasi aktivitas minimal", action: "Evaluasi penyebab (PPOK/asthma/gagal jantung) dan terapi optimal.", tone: "danger" },
    ],
  },
  {
    id: "osteoporosis-tscore",
    slug: "osteoporosis-tscore",
    title: "Klasifikasi Osteoporosis WHO (T-score)",
    abbreviation: "WHO T-score",
    type: "score",
    category: "criteria",
    description:
      "Klasifikasi densitas mineral tulang berdasarkan T-score hasil DXA: normal, osteopenia, osteoporosis (WHO).",
    specialties: ["Orthopedics", "Endocrinology", "Geriatrics"],
    keywords: ["osteoporosis", "t score", "dxa", "bone density", "densitas tulang", "osteopenia"],
    indication: "Interpretasi hasil DXA dan skrining risiko fraktur.",
    limitations: "Klasifikasi T-score bukan satu-satunya penentu terapi - pertimbangkan FRAX dan riwayat fraktur.",
    warnings: ["Riwayat fraktur fragility + osteoporosis = indikasi terapi terlepas dari angka T-score."],
    lastReviewed: "2025-06-01",
    source: { org: "World Health Organization", title: "Assessment of fracture risk and its application (WHO study group)", year: 1994 },
    variables: [
      {
        id: "tscore", label: "T-score DXA (nilai atau rentang)", shortLabel: "T-score", type: "select", required: true,
        options: [
          { label: "≥ −1,0", value: 1 },
          { label: "−1,0 hingga −2,5 (osteopenia)", value: 2 },
          { label: "≤ −2,5 (osteoporosis)", value: 3 },
          { label: "≤ −2,5 disertai riwayat fraktur fragility (osteoporosis berat/mapan)", value: 4 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "Normal", label: "T-score ≥ −1,0 - normal; pertahankan asupan kalsium-vitamin D dan aktivitas", tone: "success" },
      { min: 2, max: 2, category: "Osteopenia", label: "T-score −1 s.d. −2,5 - risiko meningkat; nilai FRAX untuk keputusan terapi", tone: "warning" },
      { min: 3, max: 3, category: "Osteoporosis", label: "T-score ≤ −2,5 - osteoporosis; pertimbangkan terapi (bisfosfonat dll) + kalsium/vitamin D", action: "Skrining penyebab sekunder; edukasi pencegahan jatuh.", tone: "danger" },
      { min: 4, max: 4, category: "Osteoporosis berat", label: "Osteoporosis + fraktur fragility - indikasi terapi farmakologis jelas", action: "Mulai antiresorptif/anabolik sesuai panduan; rujuk bila perlu.", tone: "danger" },
    ],
  },
  {
    id: "ipss",
    slug: "ipss",
    title: "IPSS (International Prostate Symptom Score)",
    abbreviation: "IPSS",
    type: "score",
    category: "score",
    description:
      "Skor gejala saluran kemih bawah (LUTS) 7 pertanyaan (0–35) + skor kualitas hidup; dipakai pada BPH/LUTS.",
    specialties: ["Urology"],
    keywords: ["ipss", "bph", "luts", "prostat", "gejala kemih", "prostate symptom"],
    indication: "Penilaian keparahan LUTS dan pemantauan terapi BPH.",
    limitations: "Skor gejala saja - sertakan uroflow, residu urine, PSA sesuai indikasi.",
    lastReviewed: "2025-06-01",
    source: { org: "Barry MJ et al. (AUA)", title: "The American Urological Association symptom index for benign prostatic hyperplasia", year: 1992, url: "https://doi.org/10.1016/S0022-5347(17)37266-9" },
    variables: [
      { id: "q1", label: "1. Sensasi kandung kemih tidak tuntas dikosongkan", shortLabel: "Tidak tuntas", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q2", label: "2. Buang air kecil lagi < 2 jam setelah selesai", shortLabel: "Sering kencing", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q3", label: "3. Kencing terputus-putus (start-stop)", shortLabel: "Terputus", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q4", label: "4. Sulit menahan kencing", shortLabel: "Sulit menahan", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q5", label: "5. Aliran urine lemah", shortLabel: "Aliran lemah", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q6", label: "6. Mengejan untuk memulai kencing", shortLabel: "Mengejan", type: "select", required: true, options: [
        { label: "Tidak pernah", value: 0 }, { label: "< 1 kali dari 5", value: 1 }, { label: "Kurang dari separuh waktu", value: 2 }, { label: "Sekitar separuh waktu", value: 3 }, { label: "Lebih dari separuh waktu", value: 4 }, { label: "Hampir selalu", value: 5 },
      ] },
      { id: "q7", label: "7. Bangun malam untuk kencing (berapa kali rata-rata per malam)", shortLabel: "Nokturia", type: "select", required: true, options: [
        { label: "0 kali", value: 0 }, { label: "1 kali", value: 1 }, { label: "2 kali", value: 2 }, { label: "3 kali", value: 3 }, { label: "4 kali", value: 4 }, { label: "≥ 5 kali", value: 5 },
      ] },
    ],
    ranges: [
      { min: 0, max: 7, category: "Ringan", label: "IPSS 0–7 - gejala ringan; pendekatan watchful waiting + modifikasi gaya hidup", tone: "success" },
      { min: 8, max: 19, category: "Sedang", label: "IPSS 8–19 - gejala sedang; pertimbangkan terapi medikamentosa (alpha-blocker/5-ARI)", tone: "warning" },
      { min: 20, max: 35, category: "Berat", label: "IPSS 20–35 - gejala berat; evaluasi urologi (uroflow, residu, PSA) dan pertimbangkan intervensi", action: "Singkirkan retensi, hematuria, dan keganasan prostat.", tone: "danger" },
    ],
  },
  {
    id: "wagner",
    slug: "wagner",
    title: "Klasifikasi Wagner (Ulkus Kaki Diabetik)",
    abbreviation: "Wagner",
    type: "score",
    category: "criteria",
    description:
      "Derajat ulkus kaki diabetik 0–5 (kedalaman & gangren) - membantu stratifikasi keparahan dan komunikasi antar klinisi.",
    specialties: ["Endocrinology", "Surgery", "Dermatology"],
    keywords: ["wagner", "ulkus diabetik", "kaki diabetik", "diabetic foot", "gangren", "ulkus"],
    indication: "Penilaian awal ulkus kaki pada pasien diabetes.",
    limitations: "Tidak menilai iskemia/infeksi secara eksplisit - kombinasikan dengan pemeriksaan vaskular (ABI) dan tanda infeksi (kriteria IWGDF).",
    warnings: ["Ulkus + iskemia atau infeksi dalam = risiko amputasi - evaluasi vaskular dan konsultasi bedah."],
    lastReviewed: "2025-06-01",
    source: { org: "Wagner FW", title: "The dysvascular foot: a system for diagnosis and treatment", year: 1981 },
    variables: [
      {
        id: "grade", label: "Pilih derajat ulkus", shortLabel: "Derajat", type: "select", required: true,
        options: [
          { label: "0 - Kulit utuh (kaki berisiko: deformitas, kalus, neuropati)", value: 0 },
          { label: "1 - Ulkus superfisial (tanpa mengenai jaringan dalam)", value: 1 },
          { label: "2 - Ulkus dalam hingga tendon/tulang/sendi", value: 2 },
          { label: "3 - Ulkus dalam dengan abses/osteomielitis", value: 3 },
          { label: "4 - Gangren lokal (jari/kaki depan)", value: 4 },
          { label: "5 - Gangren luas seluruh kaki", value: 5 },
        ],
      },
    ],
    ranges: [
      { min: 0, max: 0, category: "Wagner 0", label: "Kaki berisiko - edukasi perawatan kaki, alas kaki, kontrol gula", tone: "success" },
      { min: 1, max: 1, category: "Wagner 1", label: "Ulkus superfisial - rawat luka, offloading, antibiotik bila infeksi; evaluasi vaskular", tone: "warning" },
      { min: 2, max: 2, category: "Wagner 2", label: "Ulkus dalam - debridement, antibiotik, evaluasi osteomielitis; konsultasi bedah", tone: "danger" },
      { min: 3, max: 3, category: "Wagner 3", label: "Ulkus + abses/osteomielitis - debridement agresif, antibiotik IV, pencitraan; risiko amputasi", tone: "danger" },
      { min: 4, max: 4, category: "Wagner 4", label: "Gangren lokal - revaskularisasi/amputasi parsial sesuai evaluasi vaskular", tone: "danger" },
      { min: 5, max: 5, category: "Wagner 5", label: "Gangren luas - amputasi mayor; manajemen multidisiplin", tone: "danger" },
    ],
  },
];
