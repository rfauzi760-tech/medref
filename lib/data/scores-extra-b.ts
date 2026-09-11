import type { ScoreTool } from "@/lib/types";

/**
 * Extended criteria / scoring library — bagian B.
 * Fokus: pediatri, infeksi, hati & pencernaan, urologi, THT, kebidanan.
 * Konten disusun ulang secara orisinal dari sumber-sumber yang dikutip.
 */

export const EXTRA_SCORES_B: ScoreTool[] = [
  /* ------------------------------------------------------------------ */
  /* Pediatri & infeksi                                                  */
  /* ------------------------------------------------------------------ */
  {
    id: "imci-batuk",
    slug: "imci-batuk",
    title: "MTBS/IMCI — Klasifikasi Batuk atau Sukar Bernapas (2 bulan – 5 tahun)",
    abbreviation: "MTBS",
    type: "score",
    category: "criteria",
    description:
      "Klasifikasi cepat berdasarkan pedoman MTBS (WHO/IDAI/Kemenkes) untuk balita 2 bulan – 5 tahun yang datang dengan batuk atau sukar bernapas.",
    specialties: ["Pediatrics", "Emergency Medicine"],
    keywords: ["imci", "mtbs", "batuk", "pneumonia", "balita", "sesak", "integrated management", "childhood illness"],
    indication: "Balita usia 2 bulan – 5 tahun dengan keluhan batuk dan/atau sukar bernapas di layanan primer/IGD.",
    limitations: "Bukan pengganti pemeriksaan penuh; saturasi oksigen tidak termasuk dalam klasifikasi MTBS dasar — ukur bila tersedia.",
    warnings: ["Bila ada tanda bahaya umum MTBS (tidak bisa minum, muntah semua, kejang, letargi), klasifikasikan sebagai penyakit sangat berat dan rujuk segera."],
    lastReviewed: "2025-06-01",
    source: {
      org: "World Health Organization",
      title: "Integrated Management of Childhood Illness (IMCI) — Chart Booklet",
      year: 2014,
      url: "https://www.who.int/publications/i/item/9789241506823",
    },
    variables: [
      { id: "danger", label: "Terdapat tanda bahaya: tidak bisa minum/menyusu, muntah semua, kejang, letargi/tidak sadar", shortLabel: "Tanda bahaya", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "stridor", label: "Stridor saat tenang", shortLabel: "Stridor", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "chest", label: "Tarik dinding dada ke dalam (chest indrawing)", shortLabel: "Tarik dada", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "fastbreath", label: "Napas cepat (≥ 50×/mnt usia 2–11 bln; ≥ 40×/mnt usia 12 bln–5 thn)", shortLabel: "Napas cepat", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const danger = Number(v.danger) || 0;
      const stridor = Number(v.stridor) || 0;
      const chest = Number(v.chest) || 0;
      const fast = Number(v.fastbreath) || 0;
      if (danger === 1 || stridor === 1 || chest === 1) {
        return { total: 2, detail: "Penyakit sangat berat/pneumonia berat — beri dosis pertama antibiotik, rujuk segera." };
      }
      if (fast === 1) {
        return { total: 1, detail: "Pneumonia — beri amoksisilin oral 5 hari + nasihat perawatan di rumah." };
      }
      return { total: 0, detail: "Bukan pneumonia (batuk pilek biasa) — rawat jalan, beri nasihat." };
    },
    ranges: [
      { min: 0, max: 0, category: "Bukan pneumonia", label: "Batuk pilek biasa — tidak perlu antibiotik", action: "Beri parasetamol bila demam, jaga asupan cairan, edukasi kapan kembali.", tone: "success" },
      { min: 1, max: 1, category: "Pneumonia", label: "Pneumonia — antibiotik oral + perawatan rumah", action: "Amoksisilin oral 5 hari; evaluasi ulang bila memburuk.", tone: "warning" },
      { min: 2, max: 2, category: "Pneumonia berat / penyakit sangat berat", label: "Rujuk segera ke fasilitas yang mampu rawat inap", action: "Beri dosis pertama antibiotik (mis. ampisilin IM/IV) sebelum rujuk; jaga jalan napas & suhu.", tone: "danger" },
    ],
  },
  {
    id: "who-sam",
    slug: "who-sam",
    title: "WHO — Gizi Buruk Akut Berat (Severe Acute Malnutrition) pada Balita",
    abbreviation: "SAM",
    type: "score",
    category: "criteria",
    description:
      "Kriteria diagnosis gizi buruk akut berat pada anak 6–59 bulan menurut WHO: BB/TB < −3 SD, LILA < 11,5 cm, atau edema bilateral.",
    specialties: ["Pediatrics", "Nutrition"],
    keywords: ["gizi buruk", "malnutrisi", "sam", "marasmus", "kwashiorkor", "lila", "severe acute malnutrition", "wasting"],
    indication: "Skrining gizi pada anak 6–59 bulan, terutama di layanan primer dan gizi buruk.",
    limitations: "WHO 2006–2025 memakai −3 SD (z-score) sebagai ambang SAM; klasifikasi WHO 2025 memperbarui penilaian edema (edema tidak selalu = SAM berat bila tanpa wasting parah).",
    warnings: ["Anak SAM + anoreksia berat, demam, atau tanda bahaya = komplikasi — rawat inap."],
    lastReviewed: "2025-06-01",
    source: {
      org: "World Health Organization / Kementerian Kesehatan RI",
      title: "WHO guideline on the prevention and management of wasting and nutritional oedema (acute malnutrition)",
      year: 2025,
      url: "https://www.who.int/publications/i/item/9789240083006",
    },
    variables: [
      { id: "whz", label: "Berat badan terhadap tinggi badan (BB/TB)", shortLabel: "BB/TB", type: "select", required: true, options: [{ label: "< −3 SD (z-score)", value: 1 }, { label: "−3 s.d. −2 SD", value: 0 }, { label: "≥ −2 SD", value: 0 }] },
      { id: "muac", label: "Lingkar lengan atas (LILA)", shortLabel: "LILA", type: "select", required: true, options: [{ label: "< 11,5 cm", value: 1 }, { label: "11,5–12,5 cm", value: 0 }, { label: "≥ 12,5 cm", value: 0 }] },
      { id: "edema", label: "Edema bilateral (punggung kaki/kaki)", shortLabel: "Edema", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const whz = Number(v.whz) || 0;
      const muac = Number(v.muac) || 0;
      const edema = Number(v.edema) || 0;
      if (whz === 1 || muac === 1 || edema === 1) {
        return { total: 1, detail: "SAM terpenuhi — tatalaksana sesuai panduan gizi buruk (F-75/F-100, RUTF), waspadai komplikasi." };
      }
      return { total: 0, detail: "Kriteria SAM belum terpenuhi — nilai gizi kurang/wasting sedang bila BB/TB −3 s.d. −2 SD atau LILA 11,5–12,5 cm." };
    },
    ranges: [
      { min: 0, max: 0, category: "Bukan SAM", label: "Kriteria gizi buruk akut berat tidak terpenuhi", action: "Klasifikasikan gizi kurang bila ada; edukasi gizi dan pantau.", tone: "success" },
      { min: 1, max: 1, category: "SAM (gizi buruk akut berat)", label: "SAM — butuh tata laksana gizi terstruktur; nilai komplikasi medis", action: "Tanpa komplikasi: RUTF/rawat jalan. Dengan komplikasi (anoreksia, demam, tanda bahaya): rawat inap, F-75, antibiotik, koreksi hipoglikemia/hipotermia.", tone: "danger" },
    ],
  },
  {
    id: "kawasaki",
    slug: "kawasaki",
    title: "Kriteria Diagnosis Penyakit Kawasaki",
    abbreviation: "Kawasaki",
    type: "score",
    category: "criteria",
    description:
      "Kriteria klinis penyakit Kawasaki (AHA 2017): demam ≥ 5 hari + ≥ 4 dari 5 temuan mukokutaneus; atau 3 temuan dengan bukti eko aneurisma koroner.",
    specialties: ["Pediatrics", "Rheumatology", "Cardiology"],
    keywords: ["kawasaki", "demam", "vaskulitis", "anak", "mukokutaneus", "aneurisma koroner", "iga"],
    indication: "Anak dengan demam ≥ 5 hari yang tidak dapat dijelaskan penyebabnya.",
    limitations: "Kawasaki inkomplit umum pada bayi — pertimbangkan bila demam ≥ 5 hari + 2–3 temuan + tanda laboratoris/eho mendukung.",
    warnings: ["Komplikasi utama: aneurisma arteri koroner. IVIG + aspirin dini menurunkan risiko 5× lipat."],
    lastReviewed: "2025-06-01",
    source: {
      org: "American Heart Association (McCrindle BW et al.)",
      title: "Diagnosis, Treatment, and Long-Term Management of Kawasaki Disease",
      year: 2017,
      url: "https://doi.org/10.1161/CIR.0000000000000484",
    },
    variables: [
      { id: "fever", label: "Demam ≥ 5 hari", shortLabel: "Demam ≥ 5 hari", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "conj", label: "Injeksi konjungtiva bilateral non-eksudatif", shortLabel: "Konjungtivitis", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "oral", label: "Perubahan mukosa mulut (faring hiperemis, bibir pecah, lidah stroberi)", shortLabel: "Mukosa oral", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "rash", label: "Ruam polimorfik", shortLabel: "Ruam", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "extrem", label: "Perubahan ekstremitas (eritema/edema telapak, deskuamasi periungual fase subakut)", shortLabel: "Ekstremitas", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "lad", label: "Limfadenopati servikal ≥ 1,5 cm (biasanya unilateral)", shortLabel: "Limfadenopati", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "echo", label: "Bukti ekokardiografi aneurisma arteri koroner", shortLabel: "Eko koroner", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const fever = Number(v.fever) || 0;
      const clinical = ["conj", "oral", "rash", "extrem", "lad"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      const echo = Number(v.echo) || 0;
      if (fever === 0) return { total: 0, detail: "Demam < 5 hari — pertimbangkan diagnosis lain; nilai ulang bila demam menetap." };
      const met = clinical >= 4 || (clinical >= 3 && echo === 1);
      return { total: met ? 1 : 0, detail: `Temuan klinis: ${clinical}/5${echo === 1 ? " + eko mendukung" : ""}.` };
    },
    ranges: [
      { min: 0, max: 0, category: "Kriteria belum terpenuhi", label: "Pertimbangkan Kawasaki inkomplit bila demam menetap + temuan klinis/lab mendukung (CRP, LED, albumin, trombosit, eko)", tone: "warning" },
      { min: 1, max: 1, category: "Penyakit Kawasaki", label: "Kriteria terpenuhi — mulai terapi segera", action: "IVIG 2 g/kgBB dosis tunggal + aspirin dosis anti-inflamasi dalam 10 hari sakit; ekokardiografi awal dan serial.", tone: "danger" },
    ],
  },
  {
    id: "jones",
    slug: "jones",
    title: "Kriteria Jones — Demam Rematik Akut",
    abbreviation: "Jones",
    type: "score",
    category: "criteria",
    description:
      "Kriteria diagnosis demam rematik akut (AHA 2015). Untuk populasi risiko sedang/tinggi: 2 kriteria mayor, atau 1 mayor + 2 minor, atau 3 minor — dengan bukti infeksi streptokokus.",
    specialties: ["Pediatrics", "Rheumatology", "Cardiology"],
    keywords: ["demam rematik", "jones", "reumatik", "karditis", "artritis", "streptokokus", "acute rheumatic fever"],
    indication: "Pasien dengan kecurigaan demam rematik akut (biasanya anak 5–15 tahun) dan bukti infeksi streptokokus grup A baru.",
    limitations: "Penerapan berbeda pada populasi risiko rendah; diagnosis membutuhkan bukti infeksi streptokokus — jangan hanya mengandalkan jumlah kriteria.",
    warnings: ["Karditis dapat terjadi tanpa bising terdengar — ekokardiografi penting."],
    lastReviewed: "2025-06-01",
    source: {
      org: "American Heart Association (Gewitz MH et al.)",
      title: "Revision of the Jones Criteria for the Diagnosis of Acute Rheumatic Fever",
      year: 2015,
      url: "https://doi.org/10.1161/CIR.0000000000000205",
    },
    variables: [
      { id: "carditis", label: "Mayor: Karditis (klinis/subklinis)", shortLabel: "Karditis", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "arthritis", label: "Mayor: Poliartritis", shortLabel: "Poliartritis", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "chorea", label: "Mayor: Koresa", shortLabel: "Koresa", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "em", label: "Mayor: Eritema marginatum", shortLabel: "Eritema marginatum", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "nodules", label: "Mayor: Nodul subkutan", shortLabel: "Nodul subkutan", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "arthralgia", label: "Minor: Artralgia (risiko sedang/tinggi)", shortLabel: "Artralgia", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "fever", label: "Minor: Demam ≥ 38,5°C (risiko sedang/tinggi)", shortLabel: "Demam", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "acute", label: "Minor: LED ≥ 60 dan/atau CRP ≥ 3 mg/dL (risiko sedang/tinggi)", shortLabel: "LED/CRP", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "pr", label: "Minor: Interval PR memanjang (bila bukan karena karditis)", shortLabel: "PR memanjang", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "strep", label: "Bukti infeksi streptokokus grup A baru (ASTO/anti-DNase B meningkat, kultur/tests positif, atau riwayat demam skarlatina)", shortLabel: "Bukti streptokokus", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const maj = ["carditis", "arthritis", "chorea", "em", "nodules"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      const min = ["arthralgia", "fever", "acute", "pr"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      const strep = Number(v.strep) || 0;
      const met = strep === 1 && (maj >= 2 || (maj === 1 && min >= 2) || (maj === 0 && min >= 3));
      return {
        total: met ? 1 : 0,
        detail: met
          ? `Kriteria terpenuhi (mayor ${maj}, minor ${min}) untuk populasi risiko sedang/tinggi.`
          : `Mayor ${maj}, minor ${min}${strep === 0 ? " — bukti infeksi streptokokus belum terpenuhi." : " — kriteria belum cukup."}`,
      };
    },
    ranges: [
      { min: 0, max: 0, category: "Kriteria belum terpenuhi", label: "Belum memenuhi kriteria demam rematik akut — evaluasi diagnosis banding", tone: "warning" },
      { min: 1, max: 1, category: "Demam rematik akut", label: "Diagnosis demam rematik akut — mulai tatalaksana", action: "Eradikasi streptokokus (benzatin penisilin/penisilin oral), anti-inflamasi (ASA/ibuprofen; steroid bila karditis berat), profilaksis sekunder jangka panjang.", tone: "danger" },
    ],
  },
  {
    id: "dic-isth",
    slug: "dic-isth",
    title: "Skor DIC Overt (ISTH)",
    abbreviation: "DIC ISTH",
    type: "score",
    category: "score",
    description:
      "Skor koagulasi intravaskular diseminata overt menurut International Society on Thrombosis and Haemostasis. Skor ≥ 5 konsisten dengan DIC overt.",
    specialties: ["Hematology", "Intensive Care", "Emergency Medicine"],
    keywords: ["dic", "isth", "koagulasi", "disseminated intravascular coagulation", "trombosit", "pt", "fibrinogen", "d-dimer"],
    indication: "Pasien dengan penyakit dasar yang berisiko DIC (sepsis, trauma, keganasan, obstetri) dan gangguan koagulasi.",
    limitations: "Skor untuk DIC overt; DIC non-overt memakai skor terpisah. Ulangi serial bila mencurigakan.",
    warnings: ["Skor ≥ 5 → DIC overt: atasi penyebab dasar + terapi suportif; konsultasi hematologi."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Taylor FB et al. (ISTH)",
      title: "Towards definition, clinical and laboratory criteria, and a scoring system for disseminated intravascular coagulation",
      year: 2001,
      url: "https://doi.org/10.1160/TH01-05-0249",
    },
    variables: [
      { id: "plt", label: "Trombosit", shortLabel: "Trombosit", type: "select", required: true, options: [{ label: "> 100.000/µL", value: 0 }, { label: "50.000–100.000/µL", value: 1 }, { label: "< 50.000/µL", value: 2 }] },
      { id: "fibrin", label: "Penanda fibrin terdegradasi (D-dimer/fibrin degradation products) meningkat", shortLabel: "D-dimer/FDP", type: "select", required: true, options: [{ label: "Tidak meningkat", value: 0 }, { label: "Meningkat sedang", value: 2 }, { label: "Meningkat kuat", value: 3 }] },
      { id: "pt", label: "Perpanjangan PT", shortLabel: "PT", type: "select", required: true, options: [{ label: "< 3 detik", value: 0 }, { label: "3–6 detik", value: 1 }, { label: "> 6 detik", value: 2 }] },
      { id: "fibrinogen", label: "Fibrinogen", shortLabel: "Fibrinogen", type: "select", required: true, options: [{ label: "> 1,0 g/L", value: 0 }, { label: "≤ 1,0 g/L", value: 1 }] },
    ],
    ranges: [
      { min: 0, max: 4, category: "Tidak overt", label: "Skor < 5 — DIC overt belum terpenuhi; nilai ulang secara serial bila dicurigai", tone: "success" },
      { min: 5, max: 8, category: "DIC overt", label: "Skor ≥ 5 — konsisten dengan DIC overt", action: "Atasi penyebab dasar, dukungan komponen darah sesuai indikasi, konsultasi hematologi.", tone: "danger" },
    ],
  },
  {
    id: "cam-delirium",
    slug: "cam-delirium",
    title: "CAM — Confusion Assessment Method (Delirium)",
    abbreviation: "CAM",
    type: "score",
    category: "criteria",
    description:
      "Algoritma diagnostik delirium 4 butir: onset akut/fluktuatif + inatensi + (gangguan berpikir ATAU perubahan kesadaran).",
    specialties: ["Psychiatry", "Geriatrics", "Intensive Care", "Internal Medicine"],
    keywords: ["delirium", "cam", "confusion assessment method", "bingung akut", "geriatri", "lansia"],
    indication: "Skrining delirium pada pasien rawat, terutama lansia dan pascaoperasi.",
    limitations: "Butuh penilaian terlatih; bukan pengganti evaluasi penyebab medis (infeksi, obat, metabolik).",
    warnings: ["Delirium = kegawatan medis: cari dan atasi penyebab dasar."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Inouye SK et al.",
      title: "Clarifying confusion: the confusion assessment method",
      year: 1990,
      url: "https://doi.org/10.7326/0003-4819-113-12-941",
    },
    variables: [
      { id: "acute", label: "Onset akut dan/atau perjalanan fluktuatif", shortLabel: "Onset akut/fluktuatif", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "inattention", label: "Inatensi (sulit mempertahankan perhatian, mudah teralih)", shortLabel: "Inatensi", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "thinking", label: "Gangguan berpikir tidak terorganisir", shortLabel: "Berpikir tak terorganisir", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "level", label: "Perubahan tingkat kesadaran (selain waspada penuh)", shortLabel: "Perubahan kesadaran", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const acute = Number(v.acute) || 0;
      const inatt = Number(v.inattention) || 0;
      const think = Number(v.thinking) || 0;
      const level = Number(v.level) || 0;
      const met = acute === 1 && inatt === 1 && (think === 1 || level === 1);
      return { total: met ? 1 : 0, detail: met ? "CAM positif — delirium." : "CAM negatif — pertimbangkan penyebab lain." };
    },
    ranges: [
      { min: 0, max: 0, category: "CAM negatif", label: "Kriteria delirium tidak terpenuhi", tone: "success" },
      { min: 1, max: 1, category: "CAM positif — delirium", label: "Delirium terdiagnosis — cari penyebab medis", action: "Evaluasi obat tersembunyi, infeksi, elektrolit, hipoksia; koreksi; non-farmakologis dulu, antipsikotik bila agitasi berat.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Hati, pencernaan & perdarahan                                       */
  /* ------------------------------------------------------------------ */
  {
    id: "child-pugh",
    slug: "child-pugh",
    title: "Child-Pugh (Kelas Sirosis)",
    abbreviation: "Child-Pugh",
    type: "score",
    category: "score",
    description:
      "Skor keparahan sirosis (5–15) dari bilirubin, albumin, INR, asites, dan ensefalopati — klasifikasi kelas A/B/C.",
    specialties: ["Gastroenterology", "Hepatology", "Surgery"],
    keywords: ["sirosis", "child pugh", "hati", "cirrhosis", "asites", "ensefalopati hepatik", "melb"],
    indication: "Pasien sirosis — stratifikasi fungsi hati, pertimbangan terapi dan prognosis.",
    limitations: "Variabel subjektif (asites, ensefalopati); nilai dapat berubah dengan terapi; tidak untuk gagal hati akut.",
    lastReviewed: "2025-06-01",
    source: {
      org: "Pugh RNH et al.",
      title: "Transection of the oesophagus for bleeding oesophageal varices",
      year: 1973,
      url: "https://doi.org/10.1002/bjs.1800600717",
    },
    variables: [
      { id: "bili", label: "Bilirubin total", shortLabel: "Bilirubin", type: "select", required: true, options: [{ label: "< 2 mg/dL (< 34 µmol/L)", value: 1 }, { label: "2–3 mg/dL (34–50 µmol/L)", value: 2 }, { label: "> 3 mg/dL (> 50 µmol/L)", value: 3 }] },
      { id: "alb", label: "Albumin", shortLabel: "Albumin", type: "select", required: true, options: [{ label: "> 3,5 g/dL", value: 1 }, { label: "2,8–3,5 g/dL", value: 2 }, { label: "< 2,8 g/dL", value: 3 }] },
      { id: "inr", label: "INR", shortLabel: "INR", type: "select", required: true, options: [{ label: "< 1,7", value: 1 }, { label: "1,7–2,3", value: 2 }, { label: "> 2,3", value: 3 }] },
      { id: "ascites", label: "Asites", shortLabel: "Asites", type: "select", required: true, options: [{ label: "Tidak ada", value: 1 }, { label: "Ringan–sedang (terkontrol)", value: 2 }, { label: "Berat / refrakter", value: 3 }] },
      { id: "enceph", label: "Ensefalopati hepatik", shortLabel: "Ensefalopati", type: "select", required: true, options: [{ label: "Tidak ada", value: 1 }, { label: "Grade I–II", value: 2 }, { label: "Grade III–IV", value: 3 }] },
    ],
    ranges: [
      { min: 5, max: 6, category: "Kelas A", label: "Child-Pugh A (5–6) — fungsi hati baik; risiko bedah rendah", tone: "success" },
      { min: 7, max: 9, category: "Kelas B", label: "Child-Pugh B (7–9) — kompensasi terganggu; perencanaan terapi hati-hati", tone: "warning" },
      { min: 10, max: 15, category: "Kelas C", label: "Child-Pugh C (10–15) — sirosis dekompensata; prognosis buruk; pertimbangkan transplantasi", action: "Evaluasi MELD, konsultasi hepatologi/gastroenterologi.", tone: "danger" },
    ],
  },
  {
    id: "rockall",
    slug: "rockall",
    title: "Skor Rockall (Perdarahan Saluran Cerna Atas)",
    abbreviation: "Rockall",
    type: "score",
    category: "score",
    description:
      "Skor risiko mortalitas perdarahan saluran cerna atas pasca-endoskopi (usia, syok, komorbid, diagnosis, stigmata perdarahan).",
    specialties: ["Gastroenterology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["rockall", "perdarahan saluran cerna", "ugib", "hematemesis", "melena", "endoskopi", "varises"],
    indication: "Pasien perdarahan saluran cerna atas yang telah menjalani endoskopi.",
    limitations: "Skor pasca-endoskopi; untuk skrining pra-endoskopi gunakan Glasgow-Blatchford.",
    warnings: ["Varises perlu penilaian terpisah — Rockall tidak menggantikan terapi varises."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Rockall TA et al.",
      title: "Risk assessment after acute upper gastrointestinal haemorrhage",
      year: 1996,
      url: "https://doi.org/10.1136/gut.38.3.316",
    },
    variables: [
      { id: "age", label: "Usia", shortLabel: "Usia", type: "select", required: true, options: [{ label: "< 60 tahun", value: 0 }, { label: "60–79 tahun", value: 1 }, { label: "≥ 80 tahun", value: 2 }] },
      { id: "shock", label: "Syok", shortLabel: "Syok", type: "select", required: true, options: [{ label: "Tidak ada (sistolik ≥ 100, nadi < 100)", value: 0 }, { label: "Takikardia (nadi ≥ 100, sistolik ≥ 100)", value: 1 }, { label: "Hipotensi (sistolik < 100)", value: 2 }] },
      { id: "comorb", label: "Komorbiditas", shortLabel: "Komorbid", type: "select", required: true, options: [{ label: "Tidak ada", value: 0 }, { label: "Gagal jantung, penyakit jantung iskemik, komorbid mayor lain", value: 2 }, { label: "Gagal ginjal, gagal hati, keganasan diseminata", value: 3 }] },
      { id: "diag", label: "Diagnosis endoskopik", shortLabel: "Diagnosis", type: "select", required: true, options: [{ label: "Mallory-Weiss tear atau tanpa lesi", value: 0 }, { label: "Semua diagnosis lain", value: 1 }, { label: "Keganasan saluran cerna atas", value: 2 }] },
      { id: "stigmata", label: "Stigmata perdarahan", shortLabel: "Stigmata", type: "select", required: true, options: [{ label: "Tidak ada atau hanya bercak hitam", value: 0 }, { label: "Darah segar, koagulum, atau pembuluh tampak (visible vessel)", value: 2 }] },
    ],
    ranges: [
      { min: 0, max: 2, category: "Risiko rendah", label: "Rockall 0–2 — mortalitas rendah (< 0,5%)", action: "Pertimbangkan rawat jalan/observasi singkat bila stabil.", tone: "success" },
      { min: 3, max: 5, category: "Risiko sedang", label: "Rockall 3–5 — mortalitas ~3–11%; rawat dan pantau", tone: "warning" },
      { min: 6, max: 11, category: "Risiko tinggi", label: "Rockall ≥ 6 — mortalitas tinggi (~25–40%)", action: "Rawat intensif; terapi endoskopi/PPI IV; konsultasi gastroentero-bedah.", tone: "danger" },
    ],
  },
  {
    id: "maddrey",
    slug: "maddrey",
    title: "Maddrey Discriminant Function (Hepatitis Alkoholik)",
    abbreviation: "Maddrey DF",
    type: "score",
    category: "score",
    description:
      "Fungsi diskriminan untuk menilai keparahan hepatitis alkoholik: DF = 4,6 × (PT pasien − PT kontrol) + bilirubin total (mg/dL). DF ≥ 32 = hepatitis alkoholik berat, pertimbangkan steroid.",
    specialties: ["Gastroenterology", "Hepatology"],
    keywords: ["maddrey", "hepatitis alkoholik", "df", "alkohol", "liver", "discriminant function", "steroid"],
    indication: "Pasien dengan kecurigaan hepatitis alkoholik (ikterus + riwayat konsumsi alkohol berat).",
    limitations: "Membutuhkan PT kontrol laboratorium setempat; diagnosis banding (infeksi, obstruksi) harus disingkirkan.",
    warnings: ["DF ≥ 32 → mortalitas tinggi tanpa terapi — pertimbangkan prednisolon (bila tidak ada kontraindikasi)."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Maddrey WC et al.",
      title: "Corticosteroid therapy of alcoholic hepatitis",
      year: 1978,
      url: "https://doi.org/10.1016/0016-5085(78)90200-3",
    },
    variables: [
      { id: "pt", label: "Waktu protrombin (PT) pasien", shortLabel: "PT pasien", type: "number", required: true, min: 0, max: 300, step: 0.1, unit: "detik" },
      { id: "ptcontrol", label: "PT kontrol laboratorium", shortLabel: "PT kontrol", type: "number", required: true, min: 0, max: 300, step: 0.1, unit: "detik" },
      { id: "bili", label: "Bilirubin total", shortLabel: "Bilirubin", type: "number", required: true, min: 0, max: 60, step: 0.1, unit: "mg/dL" },
    ],
    compute: (v) => {
      const pt = Number(v.pt);
      const control = Number(v.ptcontrol);
      const bili = Number(v.bili);
      if (!Number.isFinite(pt) || !Number.isFinite(control) || !Number.isFinite(bili)) return { total: 0 };
      const df = 4.6 * (pt - control) + bili;
      return {
        total: df,
        detail: `DF = 4,6 × (${pt} − ${control}) + ${bili} = ${df.toFixed(1)}`,
      };
    },
    ranges: [
      { min: 0, max: 31.99, category: "Ringan–sedang", label: "DF < 32 — steroid umumnya tidak diindikasikan; hentikan alkohol, dukungan nutrisi, pantau", tone: "success" },
      { min: 32, max: 9999, category: "Berat", label: "DF ≥ 32 — hepatitis alkoholik berat, mortalitas tinggi", action: "Pertimbangkan prednisolon 40 mg/hari (atau pentoksifilin bila kontraindikasi steroid) setelah menyingkirkan infeksi/perdarahan GI aktif.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Urologi & kebidanan                                                 */
  /* ------------------------------------------------------------------ */
  {
    id: "twist",
    slug: "twist",
    title: "TWIST Score (Torsio Testis)",
    abbreviation: "TWIST",
    type: "score",
    category: "score",
    description:
      "Testicular Workup for Ischemia and Suspected Torsion — skor 0–7 untuk memprediksi torsio testis pada skrotum akut.",
    specialties: ["Urology", "Emergency Medicine", "Pediatrics"],
    keywords: ["twist", "torsio testis", "testicular torsion", "skrotum akut", "nyeri testis"],
    indication: "Anak/dewasa muda dengan skrotum akut (nyeri testis mendadak).",
    limitations: "Skor ≥ 5 sangat sugestif torsio — jangan menunda eksplorasi menunggu USG; skor 0–2 torsio tidak umum tetapi tetap perlu penilaian klinis.",
    warnings: ["Torsio testis = kegawatan bedah (window 6 jam untuk menyelamatkan testis)."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Barbosa JA et al.",
      title: "Development and initial validation of a scoring system to diagnose testicular torsion in children",
      year: 2013,
      url: "https://doi.org/10.1016/j.juro.2012.10.056",
    },
    variables: [
      { id: "vomiting", label: "Muntah", shortLabel: "Muntah", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "high", label: "Testis terletak tinggi (high-riding)", shortLabel: "Testis tinggi", type: "select", required: true, options: [{ label: "Ya", value: 2 }, { label: "Tidak", value: 0 }] },
      { id: "hard", label: "Testis keras saat palpasi", shortLabel: "Testis keras", type: "select", required: true, options: [{ label: "Ya", value: 2 }, { label: "Tidak", value: 0 }] },
      { id: "absent", label: "Refleks kremaster tidak ada", shortLabel: "Kremaster (-)", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "red", label: "Skrotum merah/nyeri tekan", shortLabel: "Skrotum merah", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 2, category: "Risiko rendah", label: "TWIST 0–2 — torsio kurang mungkin; pertimbangkan diagnosis lain (epididimitis, hidrokel)", tone: "success" },
      { min: 3, max: 4, category: "Risiko sedang", label: "TWIST 3–4 — lakukan USG doppler bila tersedia segera", action: "Bila USG tidak tersedia atau meragukan, konsultasi urologi/bedah.", tone: "warning" },
      { min: 5, max: 7, category: "Risiko tinggi", label: "TWIST 5–7 — sangat sugestif torsio testis", action: "Jangan menunggu USG — konsultasi bedah/urologi untuk eksplorasi segera.", tone: "danger" },
    ],
  },
  {
    id: "amsel",
    slug: "amsel",
    title: "Kriteria Amsel (Vaginosis Bakterial)",
    abbreviation: "Amsel",
    type: "score",
    category: "criteria",
    description:
      "Diagnosis vaginosis bakterial bila ≥ 3 dari 4 kriteria: fluor homogen tipis, pH > 4,5, whiff test positif, sel clue ≥ 20%.",
    specialties: ["Obstetrics & Gynecology", "Infectious Disease"],
    keywords: ["amsel", "vaginosis bakterial", "fluor", "keputihan", "clue cell", "whiff test", "bacterial vaginosis"],
    indication: "Wanita dengan keluhan keputihan (duh tubuh vagina) — diagnosis vaginosis bakterial.",
    limitations: "Kriteria Nugent (pewarnaan Gram) lebih sensitif di penelitian; Amsel praktis untuk klinik.",
    warnings: ["Vaginosis bakterial pada kehamilan dikaitkan dengan persalinan preterm — skrining bila bergejala."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Amsel R et al.",
      title: "Nonspecific vaginitis: diagnostic criteria and microbial and epidemiologic associations",
      year: 1983,
      url: "https://doi.org/10.1016/0002-9378(83)90323-1",
    },
    variables: [
      { id: "fluor", label: "Fluor vagina homogen tipis berwarna putih keabu-abuan", shortLabel: "Fluor homogen", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "ph", label: "pH vagina > 4,5", shortLabel: "pH > 4,5", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "whiff", label: "Whiff test positif (bau amina dengan KOH 10%)", shortLabel: "Whiff test (+)", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "clue", label: "Sel clue ≥ 20% pada pemeriksaan basah", shortLabel: "Sel clue ≥ 20%", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const n = ["fluor", "ph", "whiff", "clue"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      return { total: n, detail: `${n}/4 kriteria Amsel terpenuhi.` };
    },
    ranges: [
      { min: 0, max: 2, category: "Vaginosis bakterial tidak terdiagnosis", label: "< 3 kriteria — pertimbangkan kandidiasis vulvovaginal, trikomoniasis, atau servisitis", tone: "warning" },
      { min: 3, max: 4, category: "Vaginosis bakterial", label: "≥ 3 kriteria — vaginosis bakterial terdiagnosis", action: "Metronidazol oral/vaginal atau klindamisin vaginal; skrining IMS lain bila berisiko.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* THT                                                             */
  /* ------------------------------------------------------------------ */
  {
    id: "stopbang",
    slug: "stopbang",
    title: "STOP-BANG (Skrining Sleep Apnea Obstruktif)",
    abbreviation: "STOP-BANG",
    type: "score",
    category: "score",
    description:
      "Skrining risiko obstructive sleep apnea (0–8). Skor ≥ 3 = risiko sedang–tinggi OSA; ≥ 5 = risiko tinggi OSA berat.",
    specialties: ["ENT", "Pulmonology", "Anesthesiology"],
    keywords: ["stopbang", "osa", "sleep apnea", "mendengkur", "snoring", "obstructive sleep apnea"],
    indication: "Praoperasi dan klinik — pasien dengan keluhan mendengkur, kantuk berlebih, atau obesitas.",
    limitations: "Skrining saja — konfirmasi dengan polisomnografi bila klinis tinggi.",
    lastReviewed: "2025-06-01",
    source: {
      org: "Chung F et al.",
      title: "STOP questionnaire: a tool to screen patients for obstructive sleep apnea",
      year: 2008,
      url: "https://doi.org/10.1097/ALN.0b013e31816d83e4",
    },
    variables: [
      { id: "snore", label: "S — Mendengkur keras (lebih keras dari bicara, terdengar lewat pintu)", shortLabel: "Mendengkur", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "tired", label: "T — Sering lelah/kantuk di siang hari", shortLabel: "Lelah siang", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "observed", label: "O — Ada yang mengamati Anda berhenti napas saat tidur", shortLabel: "Teramati apnea", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "pressure", label: "P — Tekanan darah tinggi (dirawat atau diketahui hipertensi)", shortLabel: "Hipertensi", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "bmi", label: "B — IMT > 35 kg/m²", shortLabel: "IMT > 35", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "age", label: "A — Usia > 50 tahun", shortLabel: "Usia > 50", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "neck", label: "N — Lingkar leher > 40 cm", shortLabel: "Lingkar leher > 40 cm", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "gender", label: "G — Laki-laki", shortLabel: "Laki-laki", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 2, category: "Risiko rendah OSA", label: "STOP-BANG 0–2 — risiko rendah", tone: "success" },
      { min: 3, max: 4, category: "Risiko sedang OSA", label: "STOP-BANG 3–4 — risiko sedang OSA; pertimbangkan rujukan tidur bila gejala mengganggu", tone: "warning" },
      { min: 5, max: 8, category: "Risiko tinggi OSA", label: "STOP-BANG 5–8 — risiko tinggi OSA berat; rujuk untuk polisomnografi", action: "Diskusikan CPAP/PAP dan modifikasi gaya hidup.", tone: "danger" },
    ],
  },
];
