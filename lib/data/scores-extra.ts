import type { ScoreTool } from "@/lib/types";

/**
 * Extended scoring/criteria library - bagian A.
 * Fokus: cedera kepala, stroke & kegawatan neurologis.
 * Konten disusun ulang secara orisinal dari sumber-sumber yang dikutip.
 */

export const EXTRA_SCORES_A: ScoreTool[] = [
  /* ------------------------------------------------------------------ */
  /* Cedera kepala & neurologi                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "canadian-ct-head",
    slug: "canadian-ct-head",
    title: "Canadian CT Head Rule (Cedera Kepala Ringan)",
    abbreviation: "CCHR",
    type: "score",
    category: "rule",
    description:
      "Aturan keputusan klinis untuk menentukan perlunya CT kepala pada cedera kepala ringan (GCS 13–15 disertai kehilangan kesadaran, amnesia, atau disorientasi).",
    specialties: ["Emergency Medicine", "Neurology", "Surgery"],
    keywords: ["cedera kepala", "trauma kepala", "ct scan kepala", "head injury", "tbi", "canadian ct head rule", "trauma", "kepala"],
    indication:
      "Pasien cedera kepala ringan (GCS 13–15) dengan kehilangan kesadaran, amnesia, atau disorientasi. Bukan untuk cedera tembus, GCS < 13, usia < 16 tahun, gangguan koagulasi, atau defisit neurologis fokal.",
    limitations:
      "Tidak berlaku untuk pasien < 16 tahun, GCS < 13, trauma tembus, kehamilan lanjut, atau dengan kecurigaan perdarahan akibat gangguan koagulasi/obat antikoagulan. Keputusan akhir tetap klinis.",
    warnings: ["CT diindikasikan bila terdapat SATU faktor risiko tinggi, atau kombinasi amnesia + mekanisme berbahaya."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Stiell IG et al. (Canadian CT Head and C-Spine Study Group)",
      title: "The Canadian CT Head Rule for patients with minor head injury",
      year: 2001,
      url: "https://www.cmaj.ca/content/165/7/877",
    },
    variables: [
      { id: "hr_gcs", label: "GCS < 15 pada 2 jam setelah cedera", shortLabel: "GCS < 15 pada 2 jam", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "hr_skull", label: "Kecurigaan fraktur tengkorak terbuka atau impresi", shortLabel: "Fraktur terbuka/impresi", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "hr_basal", label: "Tanda fraktur basis kranii (hemotimpanum, mata rakun, tanda Battle, rinorea/otorea CSS)", shortLabel: "Tanda fraktur basis kranii", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "hr_vomit", label: "Muntah ≥ 2 kali", shortLabel: "Muntah ≥ 2 kali", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "hr_age", label: "Usia ≥ 65 tahun", shortLabel: "Usia ≥ 65 tahun", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "mr_mech", label: "Mekanisme berbahaya: terpental dari kendaraan bermotor, tertabrak kendaraan sebagai pejalan kaki, jatuh dari ketinggian > 1 m atau > 5 anak tangga", shortLabel: "Mekanisme berbahaya", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "mr_amnesia", label: "Amnesia retrograde ≥ 30 menit sebelum benturan", shortLabel: "Amnesia retrograde ≥ 30 mnt", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
    ],
    compute: (v) => {
      const high = ["hr_gcs", "hr_skull", "hr_basal", "hr_vomit", "hr_age"].reduce((s, k) => s + (Number(v[k]) || 0), 0);
      const mech = Number(v.mr_mech) || 0;
      const amnesia = Number(v.mr_amnesia) || 0;
      if (high > 0) {
        return { total: 1, detail: `≥ 1 kriteria risiko tinggi terpenuhi (${high} kriteria).` };
      }
      if (mech === 1 && amnesia === 1) {
        return { total: 1, detail: "Amnesia retrograde ≥ 30 menit disertai mekanisme berbahaya." };
      }
      return {
        total: 0,
        detail: "Tidak ada kriteria risiko tinggi maupun kombinasi amnesia + mekanisme berbahaya.",
      };
    },
    ranges: [
      { min: 0, max: 0, category: "CT tidak diindikasikan", label: "Menurut CCHR, CT kepala tidak diindikasikan - tetap lakukan observasi dan edukasi tanda bahaya (Canadian CT Head Rule tidak menggantikan penilaian klinis).", action: "Beri instruksi observasi mandiri; pasien dengan perburukan harus segera kembali ke fasilitas kesehatan.", tone: "success" },
      { min: 1, max: 1, category: "CT diindikasikan", label: "CT kepala diindikasikan - risiko tinggi perdarahan intrakranial yang memerlukan intervensi.", action: "Lakukan CT kepala non-kontras segera; konsultasikan dengan bedah saraf bila hasil abnormal.", tone: "danger" },
    ],
  },
  {
    id: "ich-score",
    slug: "ich-score",
    title: "Skor ICH (Perdarahan Intraserebral)",
    abbreviation: "ICH Score",
    type: "score",
    category: "score",
    description:
      "Skor stratifikasi untuk memprediksi mortalitas 30 hari pada perdarahan intraserebral spontan (0–6 poin).",
    specialties: ["Neurology", "Emergency Medicine", "Intensive Care"],
    keywords: ["perdarahan intraserebral", "ich", "stroke hemoragik", "intracerebral hemorrhage", "mortalitas", "otak"],
    indication: "Perdarahan intraserebral spontan (non-traumatik) yang dikonfirmasi CT kepala.",
    limitations: "Tidak untuk perdarahan akibat trauma, tumor, atau koagulopati sekunder; digunakan untuk prognosis, bukan untuk menahan terapi agresif.",
    warnings: ["Skor tinggi tidak berarti menahan pengobatan - keputusan terapi tetap individual."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Hemphill JC et al.",
      title: "The ICH score: a simple, reliable grading scale for intracerebral hemorrhage",
      year: 2001,
      url: "https://doi.org/10.1161/01.STR.32.4.891",
    },
    variables: [
      { id: "gcs", label: "Skor GCS", shortLabel: "GCS", type: "select", required: true, options: [{ label: "GCS 3–4", value: 2 }, { label: "GCS 5–12", value: 1 }, { label: "GCS 13–15", value: 0 }] },
      { id: "volume", label: "Volume perdarahan intraserebral pada CT", shortLabel: "Volume ICH", type: "select", required: true, options: [{ label: "≥ 30 cc", value: 1 }, { label: "< 30 cc", value: 0 }] },
      { id: "ivh", label: "Perdarahan intraventrikular (IVH)", shortLabel: "IVH", type: "select", required: true, options: [{ label: "Ya, ada IVH", value: 1 }, { label: "Tidak ada", value: 0 }] },
      { id: "infratentorial", label: "Lokasi perdarahan infratentorial (serebelum/batang otak)", shortLabel: "Infratentorial", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "age", label: "Usia", shortLabel: "Usia", type: "select", required: true, options: [{ label: "≥ 80 tahun", value: 1 }, { label: "< 80 tahun", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 0, category: "ICH 0", label: "Mortalitas 30 hari ~0%", tone: "success" },
      { min: 1, max: 1, category: "ICH 1", label: "Mortalitas 30 hari ~13%", tone: "success" },
      { min: 2, max: 2, category: "ICH 2", label: "Mortalitas 30 hari ~26%", tone: "warning" },
      { min: 3, max: 3, category: "ICH 3", label: "Mortalitas 30 hari ~72%", tone: "danger" },
      { min: 4, max: 4, category: "ICH 4", label: "Mortalitas 30 hari ~97%", tone: "danger" },
      { min: 5, max: 6, category: "ICH 5–6", label: "Mortalitas 30 hari ~100%", tone: "danger" },
    ],
  },
  {
    id: "hunt-hess",
    slug: "hunt-hess",
    title: "Skala Hunt-Hess (Perdarahan Subaraknoid)",
    abbreviation: "Hunt-Hess",
    type: "score",
    category: "score",
    description:
      "Derajat klinis perdarahan subaraknoid aneurismal - digunakan untuk stratifikasi keparahan dan panduan tata laksana.",
    specialties: ["Neurology", "Emergency Medicine", "Surgery"],
    keywords: ["perdarahan subaraknoid", "sah", "hunt hess", "aneurisma", "subarachnoid hemorrhage"],
    indication: "Pasien dengan perdarahan subaraknoid aneurismal.",
    limitations: "Penilaian dipengaruhi oleh sedasi/intubasi; bukan prediktor hasil tunggal.",
    lastReviewed: "2025-06-01",
    source: {
      org: "Hunt WE, Hess RM",
      title: "Surgical risk as related to time of intervention in the repair of intracranial aneurysms",
      year: 1968,
      url: "https://doi.org/10.3171/jns.1968.28.1.0014",
    },
    variables: [
      {
        id: "grade", label: "Pilih derajat klinis", shortLabel: "Derajat", type: "select", required: true,
        options: [
          { label: "I - Asimtomatik atau nyeri kepala ringan, kaku kuduk ringan", value: 1 },
          { label: "II - Nyeri kepala sedang–berat, kaku kuduk; tanpa defisit fokal selain paresis nervus kranial", value: 2 },
          { label: "III - Letargi/konfusi ringan, atau defisit fokal ringan", value: 3 },
          { label: "IV - Stupor, hemiparesis sedang–berat, kemungkinan rigiditas deserebrasi dini", value: 4 },
          { label: "V - Koma dalam, rigiditas deserebrasi, tampilan moribund", value: 5 },
        ],
      },
    ],
    ranges: [
      { min: 1, max: 1, category: "Grade I", label: "Risiko bedah rendah - penanganan aneurisma dapat dipertimbangkan dini", tone: "success" },
      { min: 2, max: 2, category: "Grade II", label: "Risiko bedah sedang - tatalaksana dini aneurisma umumnya dianjurkan", tone: "success" },
      { min: 3, max: 3, category: "Grade III", label: "Risiko bedah cukup tinggi - stabilisasi dulu; pertimbangkan tunda operasi", tone: "warning" },
      { min: 4, max: 4, category: "Grade IV", label: "Risiko bedah tinggi - stabilisasi agresif; prognosis lebih buruk", action: "Konsultasi bedah saraf & rawat intensif.", tone: "danger" },
      { min: 5, max: 5, category: "Grade V", label: "Risiko bedah sangat tinggi - mortalitas tinggi; diskusikan terapi bersama keluarga", tone: "danger" },
    ],
  },
  {
    id: "abcd2",
    slug: "abcd2",
    title: "ABCD2 (Risiko Stroke Setelah TIA)",
    abbreviation: "ABCD2",
    type: "score",
    category: "score",
    description:
      "Skor stratifikasi risiko stroke dalam 2 hari, 7 hari, dan 90 hari setelah transient ischemic attack (TIA).",
    specialties: ["Neurology", "Emergency Medicine"],
    keywords: ["tia", "abcd2", "transient ischemic attack", "stroke", "risiko stroke"],
    indication: "Pasien dengan dugaan TIA (defisit neurologis sementara, biasanya < 1 jam, tanpa infark pada pencitraan).",
    limitations: "Tidak menggantikan pencitraan dan evaluasi penyebab (karotis, kardiogenik). Risiko tinggi tetap perlu evaluasi cepat.",
    warnings: ["Pasien dengan ≥ 2 TIA dalam seminggu atau TIA saat antikoagulasi adalah risiko tinggi terlepas dari skor."],
    lastReviewed: "2025-06-01",
    source: {
      org: "Johnston SC et al.",
      title: "Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack",
      year: 2007,
      url: "https://doi.org/10.1016/S0140-6736(07)60150-0",
    },
    variables: [
      { id: "age", label: "Usia", shortLabel: "Usia", type: "select", required: true, options: [{ label: "≥ 60 tahun", value: 1 }, { label: "< 60 tahun", value: 0 }] },
      { id: "bp", label: "Tekanan darah saat datang", shortLabel: "TD", type: "select", required: true, options: [{ label: "Sistolik ≥ 140 dan/atau diastolik ≥ 90 mmHg", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "clinical", label: "Gambaran klinis", shortLabel: "Klinis", type: "select", required: true, options: [{ label: "Kelemahan satu sisi (unilateral weakness)", value: 2 }, { label: "Gangguan bicara tanpa kelemahan", value: 1 }, { label: "Gejala lain", value: 0 }] },
      { id: "dm", label: "Diabetes melitus", shortLabel: "DM", type: "select", required: true, options: [{ label: "Ya", value: 1 }, { label: "Tidak", value: 0 }] },
      { id: "duration", label: "Durasi gejala TIA", shortLabel: "Durasi", type: "select", required: true, options: [{ label: "≥ 60 menit", value: 2 }, { label: "10–59 menit", value: 1 }, { label: "< 10 menit", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 3, category: "Risiko rendah", label: "ABCD2 0–3 - risiko stroke 2 hari ~1%; tetap evaluasi penyebab, periksa EKG & neuroimaging", tone: "success" },
      { min: 4, max: 5, category: "Risiko sedang", label: "ABCD2 4–5 - risiko stroke 2 hari ~4%; rawat atau evaluasi cepat (klinik TIA) + mulai antiplatelet", tone: "warning" },
      { min: 6, max: 7, category: "Risiko tinggi", label: "ABCD2 6–7 - risiko stroke 2 hari ~8%; rawat, evaluasi segera, neuroimaging, mulai terapi antiplatelet/statin", action: "Pertimbangkan rawat inap dan evaluasi etiologi lengkap.", tone: "danger" },
    ],
  },
  {
    id: "four",
    slug: "four",
    title: "FOUR Score (Penilaian Kesadaran)",
    abbreviation: "FOUR",
    type: "score",
    category: "score",
    description:
      "Full Outline of UnResponsiveness - skala koma yang dapat menilai pasien terintubasi sekalipun; 4 komponen, masing-masing 0–4 (total 0–16).",
    specialties: ["Neurology", "Intensive Care", "Emergency Medicine"],
    keywords: ["four score", "kesadaran", "koma", "coma", "gcs alternatif", "icu"],
    indication: "Pasien penurunan kesadaran/koma, termasuk yang terintubasi dan tak dapat dinilai verbal.",
    limitations: "Membutuhkan latihan; nilai < 4 (mata+motor) berkorelasi dengan hasil buruk.",
    lastReviewed: "2025-06-01",
    source: {
      org: "Wijdicks EFM et al.",
      title: "Validation of a new coma scale: The FOUR score",
      year: 2005,
      url: "https://doi.org/10.1002/ana.20511",
    },
    variables: [
      { id: "eye", label: "Respons mata", shortLabel: "Mata (E)", type: "select", required: true, options: [
        { label: "E4 - membuka mata, menatap, mengikuti perintah/pergerakan", value: 4 },
        { label: "E3 - membuka mata, tidak menatap", value: 3 },
        { label: "E2 - membuka mata tanpa fiksasi", value: 2 },
        { label: "E1 - membuka mata hanya terhadap nyeri", value: 1 },
        { label: "E0 - mata tetap tertutup", value: 0 },
      ] },
      { id: "motor", label: "Respons motorik", shortLabel: "Motorik (M)", type: "select", required: true, options: [
        { label: "M4 - mengepalkan tangan, tanda 'peace', atau mengacungkan jempol sesuai perintah", value: 4 },
        { label: "M3 - melokalisasi nyeri", value: 3 },
        { label: "M2 - fleksi terhadap nyeri", value: 2 },
        { label: "M1 - ekstensi terhadap nyeri", value: 1 },
        { label: "M0 - tidak ada respons/flaksid", value: 0 },
      ] },
      { id: "brainstem", label: "Refleks batang otak", shortLabel: "Batang otak (B)", type: "select", required: true, options: [
        { label: "B4 - pupil dan kornea keduanya ada", value: 4 },
        { label: "B3 - satu pupil lebar dan non-reaktif", value: 3 },
        { label: "B2 - pupil atau kornea tidak ada respons", value: 2 },
        { label: "B1 - pupil dan kornea tidak ada respons", value: 1 },
        { label: "B0 - pupil, kornea, dan batuk semuanya tidak ada", value: 0 },
      ] },
      { id: "respiration", label: "Pola napas", shortLabel: "Napas (R)", type: "select", required: true, options: [
        { label: "R4 - teratur, tidak terintubasi", value: 4 },
        { label: "R3 - pola Cheyne-Stokes", value: 3 },
        { label: "R2 - tidak teratur", value: 2 },
        { label: "R1 - memicu ventilator (trigger) atau takipnea terhadap ventilasi", value: 1 },
        { label: "R0 - apnea / ventilator tanpa trigger", value: 0 },
      ] },
    ],
    ranges: [
      { min: 0, max: 4, category: "Koma dalam", label: "FOUR 0–4 - gangguan batang otak berat; prognosis sangat buruk", tone: "danger" },
      { min: 5, max: 8, category: "Koma", label: "FOUR 5–8 - koma sedang–dalam; evaluasi penyebab & serial", tone: "warning" },
      { min: 9, max: 12, category: "Penurunan kesadaran ringan–sedang", label: "FOUR 9–12 - respons batang otak sebagian besar utuh", tone: "warning" },
      { min: 13, max: 16, category: "Ringan–normal", label: "FOUR 13–16 - respons kesadaran baik", tone: "success" },
    ],
  },
  {
    id: "nihss",
    slug: "nihss",
    title: "NIHSS (National Institutes of Health Stroke Scale)",
    abbreviation: "NIHSS",
    type: "score",
    category: "score",
    description:
      "Skala terstandar untuk menilai keparahan defisit neurologis pada stroke iskemik akut; skor 0–42. Nilai sebelum dan setelah terapi reperfusi.",
    specialties: ["Neurology", "Emergency Medicine"],
    keywords: ["nihss", "stroke", "skala stroke", "deficit neurologis", "reperfusi", "rtpa"],
    indication: "Pasien stroke iskemik akut - untuk dokumentasi keparahan, panduan terapi, dan pemantauan.",
    limitations: "Inter-rater variability ada; item yang tidak dapat dinilai (intubasi, afasia) dinilai sesuai protokol.",
    lastReviewed: "2025-06-01",
    source: {
      org: "National Institute of Neurological Disorders and Stroke (NINDS)",
      title: "NIH Stroke Scale (NIHSS)",
      year: 2025,
      url: "https://www.ninds.nih.gov/stroke-scales-and-related-information",
    },
    variables: [
      { id: "loc", label: "1a. Tingkat kesadaran", shortLabel: "1a LOC", type: "select", required: true, options: [{ label: "0 - Sadar penuh", value: 0 }, { label: "1 - Mengantuk; mudah dibangunkan", value: 1 }, { label: "2 - Obtundasi; butuh rangsang berulang/nyeri", value: 2 }, { label: "3 - Koma; tidak ada respons selain refleks", value: 3 }] },
      { id: "locq", label: "1b. Menjawab 2 pertanyaan (bulan, usia)", shortLabel: "1b Pertanyaan", type: "select", required: true, options: [{ label: "0 - Keduanya benar", value: 0 }, { label: "1 - Satu benar", value: 1 }, { label: "2 - Keduanya salah/koma", value: 2 }] },
      { id: "locc", label: "1c. Melaksanakan 2 perintah (buka-tutup mata, kepal-genggam)", shortLabel: "1c Perintah", type: "select", required: true, options: [{ label: "0 - Keduanya benar", value: 0 }, { label: "1 - Satu benar", value: 1 }, { label: "2 - Keduanya salah/koma", value: 2 }] },
      { id: "gaze", label: "2. Pandangan (deviasi okuler)", shortLabel: "2 Pandangan", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Paresis pandangan parsial", value: 1 }, { label: "2 - Deviasi kuat / paresis total", value: 2 }] },
      { id: "visual", label: "3. Lapang pandang", shortLabel: "3 Visual", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Hemianopia parsial", value: 1 }, { label: "2 - Hemianopia total", value: 2 }, { label: "3 - Buta bilateral", value: 3 }] },
      { id: "facial", label: "4. Paresis wajah", shortLabel: "4 Fasialis", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Minor (asimetri halus)", value: 1 }, { label: "2 - Parsial (paralise bawah)", value: 2 }, { label: "3 - Total (atas dan bawah)", value: 3 }] },
      { id: "armr", label: "5a. Motorik lengan kanan (angkat 90°/45°, 10 detik)", shortLabel: "5a Lengan kanan", type: "select", required: true, options: [{ label: "0 - Tidak ada drift", value: 0 }, { label: "1 - Drift, jatuh sebelum 10 detik", value: 1 }, { label: "2 - Ada usaha melawan gravitasi, jatuh", value: 2 }, { label: "3 - Tidak ada usaha melawan gravitasi", value: 3 }, { label: "4 - Tidak ada gerakan", value: 4 }] },
      { id: "arml", label: "5b. Motorik lengan kiri (angkat 90°/45°, 10 detik)", shortLabel: "5b Lengan kiri", type: "select", required: true, options: [{ label: "0 - Tidak ada drift", value: 0 }, { label: "1 - Drift, jatuh sebelum 10 detik", value: 1 }, { label: "2 - Ada usaha melawan gravitasi, jatuh", value: 2 }, { label: "3 - Tidak ada usaha melawan gravitasi", value: 3 }, { label: "4 - Tidak ada gerakan", value: 4 }] },
      { id: "legr", label: "6a. Motorik tungkai kanan (angkat 30°, 5 detik)", shortLabel: "6a Tungkai kanan", type: "select", required: true, options: [{ label: "0 - Tidak ada drift", value: 0 }, { label: "1 - Drift, jatuh sebelum 5 detik", value: 1 }, { label: "2 - Ada usaha melawan gravitasi, jatuh", value: 2 }, { label: "3 - Tidak ada usaha melawan gravitasi", value: 3 }, { label: "4 - Tidak ada gerakan", value: 4 }] },
      { id: "legl", label: "6b. Motorik tungkai kiri (angkat 30°, 5 detik)", shortLabel: "6b Tungkai kiri", type: "select", required: true, options: [{ label: "0 - Tidak ada drift", value: 0 }, { label: "1 - Drift, jatuh sebelum 5 detik", value: 1 }, { label: "2 - Ada usaha melawan gravitasi, jatuh", value: 2 }, { label: "3 - Tidak ada usaha melawan gravitasi", value: 3 }, { label: "4 - Tidak ada gerakan", value: 4 }] },
      { id: "ataxia", label: "7. Ataksia anggota gerak", shortLabel: "7 Ataksia", type: "select", required: true, options: [{ label: "0 - Tidak ada", value: 0 }, { label: "1 - Ada pada satu anggota gerak", value: 1 }, { label: "2 - Ada pada dua anggota gerak", value: 2 }] },
      { id: "sensory", label: "8. Sensorik (tusukan jarum pada wajah/lengan/tungkai)", shortLabel: "8 Sensorik", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Gangguan ringan–sedang", value: 1 }, { label: "2 - Gangguan berat/total", value: 2 }] },
      { id: "language", label: "9. Bahasa (gambarkan gambar, beri nama, baca)", shortLabel: "9 Bahasa", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Afasia ringan–sedang", value: 1 }, { label: "2 - Afasia berat", value: 2 }, { label: "3 - Bisu/global", value: 3 }] },
      { id: "dysarthria", label: "10. Disartria", shortLabel: "10 Disartria", type: "select", required: true, options: [{ label: "0 - Normal", value: 0 }, { label: "1 - Ringan–sedang", value: 1 }, { label: "2 - Tidak dapat dimengerti/afonia", value: 2 }] },
      { id: "extinction", label: "11. Ekstingsi/inatensi", shortLabel: "11 Inatensi", type: "select", required: true, options: [{ label: "0 - Tidak ada", value: 0 }, { label: "1 - Satu modalitas terabaikan", value: 1 }, { label: "2 - Lebih dari satu modalitas terabaikan", value: 2 }] },
    ],
    ranges: [
      { min: 0, max: 0, category: "Tidak ada gejala stroke", label: "NIHSS 0 - tidak ada defisit (jangan diartikan bukan stroke)", tone: "success" },
      { min: 1, max: 4, category: "Ringan", label: "NIHSS 1–4 - stroke ringan", tone: "success" },
      { min: 5, max: 15, category: "Sedang", label: "NIHSS 5–15 - stroke sedang", tone: "warning" },
      { min: 16, max: 20, category: "Sedang–berat", label: "NIHSS 16–20 - stroke sedang–berat", tone: "warning" },
      { min: 21, max: 42, category: "Berat", label: "NIHSS 21–42 - stroke sangat berat", action: "Penilaian ulang serial dan konsultasi neurologi/neurointervensi bila memenuhi kriteria reperfusi.", tone: "danger" },
    ],
  },
];
