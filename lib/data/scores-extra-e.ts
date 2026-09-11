import type { ScoreTool } from "@/lib/types";

/** Skor tambahan - bagian E: trauma, asma, geriatri, paliatif, bedah, tidur. */

export const EXTRA_SCORES_E: ScoreTool[] = [
  {
    id: "rts",
    slug: "rts",
    title: "Revised Trauma Score (RTS)",
    abbreviation: "RTS",
    type: "score",
    category: "score",
    description:
      "Skor fisiologis trauma (GCS, tekanan darah sistolik, laju napas) dengan pembobotan - dipakai triase dan prediksi mortalitas. RTS = 0,9368·GCS + 0,7326·SBP + 0,2908·RR.",
    specialties: ["Emergency Medicine", "Surgery", "Intensive Care"],
    keywords: ["rts", "revised trauma score", "trauma", "triage", "skor trauma"],
    indication: "Penilaian fisiologis pada pasien trauma; serial untuk memantau perburukan.",
    limitations: "Tidak menilai anatomi cedera/usia - gunakan bersama skor anatomis bila tersedia.",
    warnings: ["RTS rendah = risiko mortalitas tinggi - aktifkan trauma team dan siapkan rujukan."],
    lastReviewed: "2025-06-01",
    source: { org: "Champion HR et al.", title: "A revision of the Trauma Score", year: 1989, url: "https://doi.org/10.1097/00005373-198905000-00017" },
    variables: [
      { id: "gcs", label: "GCS (nilai saat penilaian)", shortLabel: "GCS", type: "select", required: true, options: [
        { label: "13–15", value: 4 }, { label: "9–12", value: 3 }, { label: "6–8", value: 2 }, { label: "4–5", value: 1 }, { label: "3", value: 0 },
      ] },
      { id: "sbp", label: "Tekanan darah sistolik (mmHg)", shortLabel: "SBP", type: "select", required: true, options: [
        { label: "> 89", value: 4 }, { label: "76–89", value: 3 }, { label: "50–75", value: 2 }, { label: "1–49", value: 1 }, { label: "0", value: 0 },
      ] },
      { id: "rr", label: "Laju napas (×/menit)", shortLabel: "RR", type: "select", required: true, options: [
        { label: "10–29", value: 4 }, { label: "≥ 29", value: 3 }, { label: "6–9", value: 2 }, { label: "1–5", value: 1 }, { label: "0", value: 0 },
      ] },
    ],
    compute: (v) => {
      const g = Number(v.gcs) || 0;
      const s = Number(v.sbp) || 0;
      const r = Number(v.rr) || 0;
      const rts = +(0.9368 * g + 0.7326 * s + 0.2908 * r).toFixed(2);
      return { total: rts, detail: `RTS = 0,9368(${g}) + 0,7326(${s}) + 0,2908(${r}) = ${rts}` };
    },
    ranges: [
      { min: 7.8, max: 7.85, category: "Stabil", label: "RTS ≥ 7,8 - fisiologis baik; mortalitas rendah", tone: "success" },
      { min: 6, max: 7.79, category: "Ringan–sedang", label: "RTS 6,0–7,8 - pantau ketat; pertimbangkan rujukan trauma", tone: "warning" },
      { min: 4, max: 5.99, category: "Berat", label: "RTS 4,0–5,9 - risiko mortalitas meningkat; aktifkan trauma team", tone: "danger" },
      { min: 0, max: 3.99, category: "Kritis", label: "RTS < 4 - mortalitas sangat tinggi; resusitasi agresif & rujuk pusat trauma", tone: "danger" },
    ],
  },
  {
    id: "gina-control",
    slug: "gina-control",
    title: "Penilaian Kontrol Asma (GINA)",
    abbreviation: "GINA",
    type: "score",
    category: "score",
    description:
      "Kontrol asma 4 minggu terakhir menurut GINA: gejala siang > 2×/minggu, terbangun malam, perlu pelega > 2×/minggu, keterbatasan aktivitas.",
    specialties: ["Pulmonology", "Pediatrics"],
    keywords: ["asma", "gina", "kontrol asma", "asthma control"],
    indication: "Penilaian kontrol asma pada kunjungan - dasar penyesuaian terapi (langkah GINA).",
    limitations: "Jangan dinilai saat eksaserbasi akut; faktor risiko eksaserbasi dinilai terpisah.",
    warnings: ["Kontrol buruk → naikkan langkah terapi; kontrol baik ≥ 3 bulan → pertimbangkan turun langkah."],
    lastReviewed: "2025-06-01",
    source: { org: "GINA", title: "Global Strategy for Asthma Management and Prevention - assessment of asthma control", year: 2024, url: "https://ginasthma.org/" },
    variables: [
      { id: "day", label: "Gejala asma siang hari > 2×/minggu", shortLabel: "Gejala siang", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "night", label: "Terbangun malam karena asma", shortLabel: "Terbangun malam", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "reliever", label: "Perlu obat pelega (SABA) > 2×/minggu", shortLabel: "Pelega > 2×/minggu", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "limit", label: "Keterbatasan aktivitas karena asma", shortLabel: "Aktivitas terbatas", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const n = ["day", "night", "reliever", "limit"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      return { total: n, detail: `${n}/4 butir kontrol tidak terpenuhi.` };
    },
    ranges: [
      { min: 0, max: 0, category: "Terkontrol penuh", label: "Kontrol baik - pertahankan terapi; tinjau ulang setiap 3–6 bulan", tone: "success" },
      { min: 1, max: 2, category: "Terkontrol parsial", label: "Kontrol parsial - pertimbangkan naik satu langkah terapi & evaluasi kepatuhan/teknik inhalasi", tone: "warning" },
      { min: 3, max: 4, category: "Tidak terkontrol", label: "Kontrol buruk - naikkan langkah terapi, nilai kepatuhan/teknik, faktor risiko dan komorbid", action: "Kontrol ulang 2–6 minggu; bila tetap buruk rujuk spesialis paru.", tone: "danger" },
    ],
  },
  {
    id: "lawton",
    slug: "lawton",
    title: "Skala IADL Lawton (Aktivitas Instrumental Harian)",
    abbreviation: "Lawton IADL",
    type: "score",
    category: "score",
    description:
      "Penilaian 8 aktivitas instrumental (telepon, belanja, memasak, pekerjaan rumah, laundry, transportasi, obat, keuangan) untuk lansia di komunitas.",
    specialties: ["Geriatrics", "Internal Medicine"],
    keywords: ["lawton", "iadl", "aktivitas instrumental", "lansia", "kemandirian"],
    indication: "Menilai kemandirian fungsional lansia dan kebutuhan dukungan.",
    limitations: "Berbasis jenis kelamin tradisional pada versi asli - nilai kemampuan aktual.",
    lastReviewed: "2025-06-01",
    source: { org: "Lawton MP, Brody EM", title: "Assessment of older people: self-maintaining and instrumental activities of daily living", year: 1969, url: "https://doi.org/10.1093/geront/9.3_Part_1.179" },
    variables: [
      { id: "phone", label: "Menggunakan telepon", shortLabel: "Telepon", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "shopping", label: "Belanja", shortLabel: "Belanja", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "food", label: "Menyiapkan makanan", shortLabel: "Memasak", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "house", label: "Pekerjaan rumah tangga", shortLabel: "Rumah tangga", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "laundry", label: "Mencuci pakaian", shortLabel: "Laundry", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "transport", label: "Menggunakan transportasi", shortLabel: "Transportasi", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "meds", label: "Mengelola obat", shortLabel: "Obat", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
      { id: "finances", label: "Mengelola keuangan", shortLabel: "Keuangan", type: "select", required: true, options: [{ label: "Mandiri", value: 1 }, { label: "Membutuhkan bantuan", value: 0 }] },
    ],
    ranges: [
      { min: 8, max: 8, category: "Mandiri penuh", label: "Mandiri pada seluruh 8 aktivitas instrumental", tone: "success" },
      { min: 6, max: 7, category: "Ketergantungan ringan", label: "Umumnya mandiri; bantuan untuk sebagian aktivitas kompleks", tone: "warning" },
      { min: 4, max: 5, category: "Ketergantungan sedang", label: "Membutuhkan bantuan rutin untuk beberapa aktivitas", tone: "warning" },
      { min: 0, max: 3, category: "Ketergantungan berat", label: "Membutuhkan dukungan besar - nilai kebutuhan perawatan & dukungan keluarga", tone: "danger" },
    ],
  },
  {
    id: "pps",
    slug: "pps",
    title: "Palliative Performance Scale (PPS)",
    abbreviation: "PPS",
    type: "score",
    category: "score",
    description:
      "Skala fungsional paliatif 0–100% (ambulasi, aktivitas, perawatan diri, asupan, kesadaran) - perkiraan prognosis dan kebutuhan perawatan.",
    specialties: ["Palliative Care", "Oncology", "Geriatrics"],
    keywords: ["pps", "palliative performance scale", "paliatif", "karnofsky", "prognosis"],
    indication: "Pasien paliatif/kanker lanjut - stratifikasi fungsi dan panduan perawatan.",
    limitations: "Bukan satu-satunya prediktor prognosis - kombinasikan penilaian klinis.",
    lastReviewed: "2025-06-01",
    source: { org: "Anderson F et al.", title: "Palliative Performance Scale (PPSv2)", year: 1996 },
    variables: [
      {
        id: "pps", label: "Pilih tingkat fungsi (PPS %)", shortLabel: "PPS", type: "select", required: true,
        options: [
          { label: "100% - Aktif penuh, sehat, asupan normal", value: 100 },
          { label: "90% - Aktif penuh; sedikit gejala", value: 90 },
          { label: "80% - Aktivitas normal dengan usaha; sebagian gejala", value: 80 },
          { label: "70% - Tidak dapat bekerja normal; rawat diri sendiri", value: 70 },
          { label: "60% - Hobi/aktivitas menurun; butuh bantuan sesekali", value: 60 },
          { label: "50% - Terutama duduk/berbaring; butuh bantuan cukup besar", value: 50 },
          { label: "40% - Terutama berbaring; butuh bantuan penuh perawatan", value: 40 },
          { label: "30% - Total bedridden; butuh bantuan penuh; asupan menurun", value: 30 },
          { label: "20% - Total bedridden; asupan sangat sedikit; sulit menelan", value: 20 },
          { label: "10% - Moribund; hanya cairan sesendok; mengantuk/koma", value: 10 },
          { label: "0% - Meninggal", value: 0 },
        ],
      },
    ],
    ranges: [
      { min: 70, max: 100, category: "Fungsi baik", label: "PPS ≥ 70 - mandiri sebagian besar; diskusikan tujuan perawatan dini", tone: "success" },
      { min: 50, max: 60, category: "Menurun", label: "PPS 50–60 - butuh bantuan; proyeksi prognosis minggu-bulan; pastikan dukungan", tone: "warning" },
      { min: 30, max: 40, category: "Buruk", label: "PPS 30–40 - perawatan penuh; prognosis minggu; kendalikan gejala & siapkan keluarga", tone: "warning" },
      { min: 0, max: 20, category: "Sangat buruk", label: "PPS ≤ 20 - prognosis hari-minggu; perawatan paliatif penuh, obati nyeri/sesak", action: "Libatkan tim paliatif; diskusikan keinginan akhir hayat.", tone: "danger" },
    ],
  },
  {
    id: "hinchey",
    slug: "hinchey",
    title: "Klasifikasi Hinchey (Divertikulitis Akut)",
    abbreviation: "Hinchey",
    type: "score",
    category: "criteria",
    description:
      "Klasifikasi keparahan divertikulitis akut: I abses kecil, II abses pelvik, III peritonitis purulen, IV peritonitis fekal - memandu terapi bedah.",
    specialties: ["Surgery", "Gastroenterology"],
    keywords: ["hinchey", "divertikulitis", "diverticulitis", "peritonitis", "abses"],
    indication: "Divertikulitis akut (biasanya dengan CT) - menentukan tatalaksana konservatif vs operatif.",
    limitations: "Modifikasi modern (Hinchey 0/Ia) membedakan divertikulitis tanpa abses - gunakan bersama temuan CT.",
    warnings: ["Peritonitis difus (Hinchey III–IV) = operasi segera."],
    lastReviewed: "2025-06-01",
    source: { org: "Hinchey EJ et al.", title: "Treatment of perforated diverticular disease of the colon", year: 1978 },
    variables: [
      {
        id: "grade", label: "Pilih stadium (berdasarkan klinis + CT)", shortLabel: "Stadium", type: "select", required: true,
        options: [
          { label: "I - Abses peri-kolik atau flegmon lokal", value: 1 },
          { label: "II - Abses pelvik/intraabdomen yang lebih jauh", value: 2 },
          { label: "III - Peritonitis purulen umum", value: 3 },
          { label: "IV - Peritonitis fekal", value: 4 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "Hinchey I", label: "Abses kecil/flegmon - antibiotik + drainase perkutan bila abses > 3–5 cm; diet sesuai toleransi", tone: "success" },
      { min: 2, max: 2, category: "Hinchey II", label: "Abses pelvik - drainase perkutan + antibiotik; operasi bila gagal", tone: "warning" },
      { min: 3, max: 3, category: "Hinchey III", label: "Peritonitis purulen - operasi segera (reseksi primer ± anastomosis/stoma)", tone: "danger" },
      { min: 4, max: 4, category: "Hinchey IV", label: "Peritonitis fekal - operasi emergensi (reseksi + stoma umumnya lebih aman)", action: "Resusitasi agresif + konsultasi bedah digestif segera.", tone: "danger" },
    ],
  },
  {
    id: "epworth",
    slug: "epworth",
    title: "Epworth Sleepiness Scale (ESS)",
    abbreviation: "ESS",
    type: "score",
    category: "score",
    description:
      "Kemungkinan mengantuk pada 8 situasi sehari-hari (0–3 per item; total 0–24). ESS ≥ 10 = kantuk berlebih; ≥ 16 = kantuk berat.",
    specialties: ["ENT", "Pulmonology", "Neurology"],
    keywords: ["epworth", "ess", "kantuk", "sleepiness", "tidur", "osa"],
    indication: "Skrining kantuk berlebihan di siang hari (OSA, narkolepsi, hipersomnia).",
    limitations: "Subjektif; interpretasikan bersama riwayat dan pemeriksaan.",
    lastReviewed: "2025-06-01",
    source: { org: "Johns MW", title: "A new method for measuring daytime sleepiness: the Epworth Sleepiness Scale", year: 1991, url: "https://doi.org/10.5665/sleep/14.6.540" },
    variables: [
      { id: "s1", label: "Duduk dan membaca", shortLabel: "Membaca", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s2", label: "Menonton TV", shortLabel: "TV", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s3", label: "Duduk pasif di tempat umum (bioskop, rapat)", shortLabel: "Duduk pasif", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s4", label: "Menumpang kendaraan sebagai penumpang 1 jam tanpa berhenti", shortLabel: "Penumpang kendaraan", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s5", label: "Berbaring untuk istirahat siang", shortLabel: "Istirahat siang", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s6", label: "Duduk dan berbicara dengan seseorang", shortLabel: "Berbicara", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s7", label: "Duduk tenang setelah makan siang tanpa alkohol", shortLabel: "Setelah makan", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
      { id: "s8", label: "Dalam mobil saat berhenti sesaat di lampu merah", shortLabel: "Saat macet", type: "select", required: true, options: [
        { label: "Tidak akan tertidur", value: 0 }, { label: "Sedikit kemungkinan", value: 1 }, { label: "Kemungkinan sedang", value: 2 }, { label: "Kemungkinan besar", value: 3 },
      ] },
    ],
    ranges: [
      { min: 0, max: 9, category: "Normal", label: "ESS < 10 - kantuk siang dalam batas normal", tone: "success" },
      { min: 10, max: 15, category: "Kantuk berlebih", label: "ESS 10–15 - kantuk berlebih; evaluasi OSA bila mendengkur/berhenti napas", tone: "warning" },
      { min: 16, max: 24, category: "Kantuk berat", label: "ESS ≥ 16 - kantuk berat; rujuk untuk polisomnografi dan evaluasi penyebab", action: "Edukasi bahaya mengemudi; evaluasi OSA/narkolepsi.", tone: "danger" },
    ],
  },
];
