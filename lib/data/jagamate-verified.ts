import type { Drug } from "@/lib/types";
import type { DrugEnrichment } from "./merge-drug-enrichments";

const CEFTRIAXONE_LABEL = {
  org: "DailyMed", title: "Ceftriaxone for Injection, USP", year: 2022,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a25ab5ea-c46d-4562-8f7e-0ccffc2ab069",
};
const AHA_PALS_2025 = {
  org: "AHA/AAP", title: "Pediatric Tachyarrhythmia With a Pulse Algorithm", year: 2025,
  url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf",
};
const AMBROXOL_LABEL = {
  org: "AEMPS", title: "Ficha técnica Ambroxol Normon 3 mg/mL", year: 2022,
  url: "https://cima.aemps.es/cima/dochtml/ft/63790/FT_63790.html",
};
const COTRIMOXAZOLE_LABEL = {
  org: "DailyMed", title: "Sulfatrim Pediatric Suspension", year: 2024,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b339af0b-4fa2-e8c3-e053-2995a90a6a34",
};
const ERYTHROMYCIN_LABEL = {
  org: "DailyMed", title: "Erythromycin Ethylsuccinate for Oral Suspension", year: 2020,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=86d6353c-2b58-4219-b31d-fb5b97789094",
};
const SALBUTAMOL_NEB_LABEL = {
  org: "DailyMed", title: "Albuterol Sulfate Inhalation Solution 0.5%", year: 2009,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=953ab65b-b157-41b3-8f90-98fa9d7f20c5",
};
const PROMETHAZINE_LABEL = {
  org: "DailyMed", title: "Promethazine Hydrochloride Oral Solution", year: 2022,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bd8d1f9a-242c-440b-a5eb-a50f64a1c1d9",
};
const BPOM_ANAPHYLAXIS = {
  org: "BPOM RI", title: "Petunjuk Teknis Surveilans KIPI", year: 2026,
  url: "https://e-meso.pom.go.id/web/useruploads/files/reference/2260122111801--Petunjuk%20Teknis%20Surveilans%20KIPI.pdf",
};
const CIPRO_ORAL_LABEL = {
  org: "DailyMed", title: "Ciprofloxacin for Oral Suspension", year: 2021,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=905503ef-4277-44ca-aa4a-5a969a041e16",
};
const CIPRO_IV_LABEL = {
  org: "DailyMed", title: "Ciprofloxacin Injection", year: 2022,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f406e796-17d9-4465-b8a7-00d966a4ba74",
};
const CETIRIZINE_LABEL = {
  org: "DailyMed", title: "Cetirizine Hydrochloride Oral Solution", year: 2024,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=71448ab0-e23e-4cf7-940e-7d67e7362fb4",
};
const CETIRIZINE_OTC_LABEL = {
  org: "DailyMed", title: "Cetirizine Hydrochloride Oral Solution Drug Facts", year: 2025,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c6f08e78-10fc-48d0-a3e1-e227081548eb",
};
const CHLORPHENIRAMINE_LABEL = {
  org: "DailyMed", title: "ED Chlorped Jr. Chlorpheniramine Maleate Liquid", year: 2025,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4a5e5968-1930-465a-9b8c-45ed936a0e11",
};
const GUAIFENESIN_LABEL = {
  org: "DailyMed", title: "Guaifenesin Oral Solution USP", year: 2026,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=888b6a2e-6631-4585-a7fe-eb122eb51b23",
};
const WHO_ZINC = {
  org: "WHO", title: "Zinc supplementation in the management of diarrhoea", year: 2011,
  url: "https://www.who.int/tools/elena/bbc/zinc-diarrhoea",
};
const MHRA_DOMPERIDONE = {
  org: "MHRA", title: "Domperidone for nausea and vomiting: lack of efficacy in children", year: 2019,
  url: "https://www.gov.uk/drug-safety-update/domperidone-for-nausea-and-vomiting-lack-of-efficacy-in-children-reminder-of-contraindications-in-adults-and-adolescents",
};
const PHENYTOIN_LABEL = {
  org: "DailyMed", title: "Phenytoin Sodium Injection", year: 2024,
  url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=035a8d4e-2063-4240-83cb-d7eebcabe301",
};

export const JAGAMATE_ENRICHMENTS: DrugEnrichment[] = [
  {
    slug: "domperidon",
    doses: [{
      population: "pediatric", route: "Oral", indication: "Mual dan muntah, usia ≥12 tahun dan BB ≥35 kg",
      minAgeYears: 12, maxAgeYears: 18, minWeightKg: 35,
      text: "10 mg oral hingga 3 kali sehari selama sesingkat mungkin, umumnya tidak lebih dari 1 minggu. Hindari pada pemanjangan QT, gangguan elektrolit bermakna, dan obat yang memperpanjang QT atau menghambat CYP3A4.",
      fixedDoseMg: 10, preferredForCalculation: true,
      notes: ["Kebijakan MHRA: tidak lagi berizin untuk anak <12 tahun atau BB <35 kg karena manfaat tidak terbukti. Pastikan status dan label produk setempat."],
      source: MHRA_DOMPERIDONE,
    }],
  },
  {
    slug: "fenitoin",
    doses: [
      {
        population: "adult", route: "IV", indication: "Status epileptikus, dosis muat IV dewasa",
        text: "10–15 mg/kg sebagai dosis muat IV perlahan, laju tidak melebihi 50 mg/menit. Pemantauan EKG, tekanan darah, dan napas wajib. Dosis rumatan adalah regimen terpisah, bukan frekuensi dosis muat.",
        weightBased: { min: 10, max: 15, per: "dose", note: "Dosis muat tunggal. Jangan ulangi otomatis tiap 8 jam." },
        preferredForCalculation: true, source: PHENYTOIN_LABEL,
      },
      {
        population: "pediatric", route: "IV", indication: "Status epileptikus, dosis muat IV anak",
        minAgeYears: 28 / 365.25, maxAgeYears: 18,
        text: "15–20 mg/kg sebagai dosis muat IV perlahan. Laju tidak melebihi 1–3 mg/kg/menit atau 50 mg/menit, pilih yang lebih lambat. Pantau EKG, tekanan darah, dan napas; jangan berikan IM rutin.",
        weightBased: { min: 15, max: 20, per: "dose", note: "Dosis muat tunggal. Laju infus harus dihitung terpisah dan dipantau." },
        preferredForCalculation: true, source: PHENYTOIN_LABEL,
      },
    ],
  },
  {
    slug: "setirizin",
    curatedPreparationsOnly: true,
    dosePreparations: [{
      id: "setirizin-5mg-5ml", label: "Setirizin larutan oral 5 mg/5 mL",
      drugAmount: 5, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral",
    }],
    doses: [
      {
        population: "pediatric", route: "Oral", indication: "Rinitis alergi perenial atau urtikaria, 6–23 bulan",
        minAgeYears: 0.5, maxAgeYears: 2,
        text: "2,5 mg oral sekali sehari. Pada usia 12–23 bulan, hanya bila perlu dapat ditingkatkan menjadi 2,5 mg tiap 12 jam sesuai penilaian klinis.",
        fixedDoseMg: 2.5, preferredForCalculation: true, source: CETIRIZINE_LABEL,
      },
      {
        population: "pediatric", route: "Oral", indication: "Urtikaria kronis, usia 2–5 tahun",
        minAgeYears: 2, maxAgeYears: 6,
        text: "Dosis awal 2,5 mg oral sekali sehari; maksimum 5 mg/hari menurut label.",
        fixedDoseMg: 2.5, preferredForCalculation: true, source: CETIRIZINE_LABEL,
      },
      {
        population: "pediatric", route: "Oral", indication: "Alergi, usia 6–17 tahun",
        minAgeYears: 6, maxAgeYears: 18,
        text: "5 mg oral sekali sehari sebagai dosis awal; dapat sampai 10 mg/hari bila diperlukan sesuai berat gejala. Periksa fungsi ginjal dan hati.",
        fixedDoseMg: 5, preferredForCalculation: true, source: CETIRIZINE_OTC_LABEL,
      },
    ],
  },
  {
    slug: "klorfeniramin",
    preparations: ["Larutan oral klorfeniramin maleat tunggal 2 mg/5 mL"],
    doses: [{
      population: "pediatric", route: "Oral", indication: "Alergi, usia 6–11 tahun",
      minAgeYears: 6, maxAgeYears: 12,
      text: "2 mg oral tiap 4–6 jam bila perlu, maksimum 6 dosis dalam 24 jam. Sediaan tunggal 2 mg/5 mL atau setengah tablet 4 mg sesuai label.",
      fixedDoseMg: 2, preferredForCalculation: true, source: CHLORPHENIRAMINE_LABEL,
    }],
  },
  {
    slug: "guaifenesin",
    preparations: ["Larutan oral guaifenesin tunggal 100 mg/5 mL"],
    doses: [
      {
        population: "pediatric", route: "Oral", indication: "Ekspektoran, usia 2–5 tahun",
        minAgeYears: 2, maxAgeYears: 6,
        text: "50–100 mg oral tiap 4 jam bila perlu, maksimum 6 dosis dalam 24 jam. Konsultasikan bila batuk menetap atau disertai gejala berat.",
        fixedDoseMg: 50, fixedDoseMaxMg: 100, preferredForCalculation: true, source: GUAIFENESIN_LABEL,
      },
      {
        population: "pediatric", route: "Oral", indication: "Ekspektoran, usia 6–11 tahun",
        minAgeYears: 6, maxAgeYears: 12,
        text: "100–200 mg oral tiap 4 jam bila perlu, maksimum 6 dosis dalam 24 jam.",
        fixedDoseMg: 100, fixedDoseMaxMg: 200, preferredForCalculation: true, source: GUAIFENESIN_LABEL,
      },
    ],
  },
  {
    slug: "zinc-sulfat",
    curatedPreparationsOnly: true,
    doses: [
      {
        population: "pediatric", route: "Oral", indication: "Diare akut, usia 28 hari sampai <6 bulan",
        minAgeYears: 28 / 365.25, maxAgeYears: 0.5,
        text: "10 mg zink elemental oral sekali sehari selama 10–14 hari, bersama oralit dan asupan makan/ASI yang diteruskan. Periksa kadar zink elemental pada kemasan.",
        fixedDoseMg: 10, preferredForCalculation: true, source: WHO_ZINC,
      },
      {
        population: "pediatric", route: "Oral", indication: "Diare akut, usia 6–59 bulan",
        minAgeYears: 0.5, maxAgeYears: 5,
        text: "20 mg zink elemental oral sekali sehari selama 10–14 hari, bersama oralit dan asupan makan/ASI yang diteruskan. Periksa kadar zink elemental pada kemasan.",
        fixedDoseMg: 20, preferredForCalculation: true, source: WHO_ZINC,
      },
    ],
  },
  {
    slug: "siprofloksasin",
    preparations: ["Suspensi oral 250 mg/5 mL setelah rekonstitusi"],
    doses: [
      {
        population: "pediatric", route: "Oral", indication: "ISK komplikata / pielonefritis, oral",
        minAgeYears: 1, maxAgeYears: 18,
        text: "10–20 mg/kg per pemberian oral tiap 12 jam, maksimum 750 mg per pemberian, selama 10–21 hari. Bukan antibiotik lini pertama rutin pada anak; pertimbangkan risiko efek muskuloskeletal dan hasil kultur.",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 750,
          note: "Pilih dosis dalam rentang sesuai keparahan dan fungsi ginjal. Suspensi 250 mg/5 mL harus direkonstitusi sesuai label." },
        preferredForCalculation: true, source: CIPRO_ORAL_LABEL,
      },
      {
        population: "pediatric", route: "IV", indication: "ISK komplikata / pielonefritis, IV",
        minAgeYears: 1, maxAgeYears: 18,
        text: "6–10 mg/kg per pemberian IV tiap 8 jam, maksimum 400 mg per pemberian, selama 10–21 hari. Infus selama 60 menit. Dosis dan rute dipilih sesuai berat infeksi dan fungsi ginjal.",
        weightBased: { min: 6, max: 10, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 400,
          note: "Gunakan sediaan infus berlabel 2 mg/mL. Jangan gunakan suspensi oral untuk rute IV." },
        preferredForCalculation: true, source: CIPRO_IV_LABEL,
      },
    ],
  },
  {
    slug: "epinefrin",
    curatedPreparationsOnly: true,
    dosePreparations: [{
      id: "epinefrin-im-1mg-1ml", label: "Epinefrin 1 mg/mL (1:1000), hanya IM",
      drugAmount: 1, drugUnit: "mg", carrierAmount: 1, carrierUnit: "mL",
      administration: "parenteral", routes: ["IM"],
    }],
    doses: [{
      population: "pediatric", route: "IM", indication: "Anafilaksis anak, IM 1 mg/mL",
      text: "0,01 mg/kg IM pada paha anterolateral, maksimum 0,3 mg per pemberian; ulang setelah 5–15 menit bila perlu. Pakai larutan 1 mg/mL (1:1000) tanpa pengenceran untuk rute IM. Jangan gunakan konsentrasi ini sebagai bolus IV.",
      weightBased: {
        min: 0.01, per: "dose", maxPerDoseMg: 0.3,
        note: "Konsentrasi 1 mg/mL khusus hitungan IM anafilaksis ini; algoritme henti jantung IV memakai pengenceran berbeda.",
      },
      preferredForCalculation: true,
      source: BPOM_ANAPHYLAXIS,
    }],
  },
  {
    slug: "difenhidramin-syr",
    preparations: ["Larutan oral prometazin HCl 6,25 mg/5 mL"],
    curatedPreparationsOnly: true,
    dosePreparations: [{
      id: "prometazin-6.25mg-5ml", label: "Prometazin HCl larutan oral 6,25 mg/5 mL",
      drugAmount: 6.25, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral",
    }],
    doses: [{
      population: "pediatric", route: "Oral", indication: "Alergi, dosis awal usia ≥2 tahun",
      minAgeYears: 2, maxAgeYears: 18,
      text: "6,25 mg per pemberian hingga 3 kali sehari; gunakan dosis efektif terendah. Kontraindikasi pada usia <2 tahun karena risiko depresi napas fatal.",
      fixedDoseMg: 6.25, preferredForCalculation: true,
      notes: ["Hindari kombinasi dengan obat yang menekan napas. Verifikasi kebutuhan antihistamin sedatif pada anak."],
      source: PROMETHAZINE_LABEL,
    }],
  },
  {
    slug: "salbutamol",
    preparations: ["Larutan inhalasi pekat 2,5 mg/0,5 mL (harus diencerkan sebelum nebulisasi)"],
    dosePreparations: [{
      id: "salbutamol-neb-2.5mg-0.5ml", label: "Salbutamol inhalasi pekat 2,5 mg/0,5 mL",
      drugAmount: 2.5, drugUnit: "mg", carrierAmount: 0.5, carrierUnit: "mL", administration: "inhalation",
    }],
    doses: [{
      population: "pediatric", route: "Nebulisasi", indication: "Bronkospasme, nebulisasi usia 2–12 tahun",
      minAgeYears: 2, maxAgeYears: 13,
      text: "Dosis awal 0,1–0,15 mg/kg per pemberian, maksimum 2,5 mg, 3–4 kali sehari sesuai respons. Larutan pekat 0,5% harus diencerkan dengan NaCl steril hingga volume total 3 mL sebelum nebulisasi.",
      weightBased: {
        min: 0.1, max: 0.15, per: "dose", maxPerDoseMg: 2.5,
        note: "Hasil mL adalah volume larutan pekat sebelum pengenceran, bukan volume akhir nebulizer. Jangan pakai sirup atau tablet untuk nebulisasi.",
      },
      source: SALBUTAMOL_NEB_LABEL,
    }],
  },
  {
    slug: "eritromisin",
    preparations: ["Suspensi oral eritromisin etilsuksinat 400 mg/5 mL"],
    doses: [{
      population: "pediatric", route: "Oral", indication: "Infeksi ringan sampai sedang, eritromisin etilsuksinat",
      text: "30–50 mg/kg/hari aktivitas eritromisin, dibagi tiap 6 jam. Gunakan hanya bila etiologi bakteri dan indikasinya sesuai; pastikan sediaan etilsuksinat.",
      weightBased: {
        min: 30, max: 50, per: "day", frequencyPerDay: 4, maxDailyMg: 4000,
        note: "Dosis didasarkan pada aktivitas eritromisin dalam sediaan etilsuksinat. Batas 4 g/hari berasal dari batas dosis dewasa label, bukan target dosis anak.",
      },
      source: ERYTHROMYCIN_LABEL,
    }],
  },
  {
    slug: "kotrimoksazol",
    curatedPreparationsOnly: true,
    doses: [{
      population: "pediatric", route: "Oral", indication: "ISK atau otitis media akut, usia ≥2 bulan",
      minAgeYears: 2 / 12,
      text: "8 mg/kg/hari berdasarkan komponen trimetoprim (TMP), dibagi tiap 12 jam selama 10 hari. Pastikan produk mengandung TMP 40 mg dan SMX 200 mg per 5 mL; sesuaikan pada gangguan ginjal.",
      weightBased: {
        min: 8, per: "day", frequencyPerDay: 2, maxDailyMg: 320,
        note: "Dosis dihitung berdasarkan TMP saja. Batas 320 mg TMP/hari mengikuti dosis dewasa standar pada label, bukan dosis terapi Pneumocystis.",
      },
      source: COTRIMOXAZOLE_LABEL,
    }],
    dosePreparations: [{
      id: "tmp-40mg-smx-200mg-per-5ml",
      label: "TMP 40 mg + SMX 200 mg/5 mL",
      drugAmount: 40, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral",
    }],
  },
  {
    slug: "ambroksol",
    preparations: ["Sirup oral 15 mg/5 mL"],
    curatedPreparationsOnly: true,
    dosePreparations: [
      { id: "ambroksol-15mg-5ml", label: "Ambroksol sirup 15 mg/5 mL", drugAmount: 15, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
      { id: "ambroksol-30mg-5ml", label: "Ambroksol sirup 30 mg/5 mL", drugAmount: 30, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
    ],
    doses: [
      {
        population: "pediatric", route: "Oral", indication: "Mukolitik, usia 2–5 tahun",
        minAgeYears: 2, maxAgeYears: 6,
        text: "7,5 mg per pemberian hingga 3 kali sehari. Periksa konsentrasi sirup pada kemasan.",
        fixedDoseMg: 7.5, preferredForCalculation: true, source: AMBROXOL_LABEL,
      },
      {
        population: "pediatric", route: "Oral", indication: "Mukolitik, usia 6–11 tahun",
        minAgeYears: 6, maxAgeYears: 12,
        text: "15 mg per pemberian hingga 3 kali sehari. Periksa konsentrasi sirup pada kemasan.",
        fixedDoseMg: 15, preferredForCalculation: true, source: AMBROXOL_LABEL,
      },
    ],
  },
  {
    slug: "paracetamol",
    preparations: ["Sirup oral 160 mg/5 mL (periksa konsentrasi pada kemasan)"],
  },
  {
    slug: "seftriakson",
    doses: [{
      population: "pediatric", route: "IV/IM", indication: "Meningitis bakteri",
      text: "100 mg/kg/hari, maksimum 4 g/hari; dapat diberikan sekali sehari atau dibagi tiap 12 jam. Tidak untuk neonatus tanpa penilaian khusus.",
      weightBased: { min: 100, per: "day", maxDailyMg: 4000,
        note: "Regimen meningitis. Periksa usia, kontraindikasi neonatus, dan protokol setempat." },
      source: CEFTRIAXONE_LABEL,
    }],
  },
  {
    slug: "adenosin",
    doses: [
      {
        population: "pediatric", route: "IV/IO", indication: "SVT, dosis awal",
        text: "0,1 mg/kg IV/IO dorong cepat, maksimum 6 mg, segera ikuti bilasan IV.",
        weightBased: { min: 0.1, per: "dose", maxPerDoseMg: 6,
          note: "Gunakan sesuai algoritme PALS pada takiaritmia dengan nadi; pemantauan EKG diperlukan." },
        source: AHA_PALS_2025,
      },
      {
        population: "pediatric", route: "IV/IO", indication: "SVT, dosis ulang",
        text: "Bila perlu, 0,2 mg/kg IV/IO dorong cepat, maksimum 12 mg, segera ikuti bilasan IV.",
        weightBased: { min: 0.2, per: "dose", maxPerDoseMg: 12,
          note: "Hanya dosis eskalasi setelah penilaian respons dosis awal sesuai algoritme PALS." },
        source: AHA_PALS_2025,
      },
    ],
  },
];
const GINA_ASTHMA = {
  org: "GINA", title: "Global Strategy for Asthma Management and Prevention", year: 2026,
  url: "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf",
};

export const JAGAMATE_NEW_DRUGS: Drug[] = [{
  id: "prednisolon-sistemik", slug: "prednisolon-sistemik", genericName: "Prednisolon oral",
  drugClass: "Kortikosteroid sistemik", specialties: ["Anak", "Pulmonologi"],
  keywords: ["prednisolon", "prednisolone", "asma", "kortikosteroid"],
  indications: ["Eksaserbasi asma anak"],
  doses: [
    {
      population: "pediatric", route: "Oral", indication: "Eksaserbasi asma, usia <2 tahun",
      minAgeYears: 28 / 365.25, maxAgeYears: 2,
      text: "1–2 mg/kg/hari, maksimum 20 mg/hari, selama 3–5 hari. Untuk eksaserbasi sedang-berat sesuai penilaian klinis.",
      weightBased: { min: 1, max: 2, per: "day", maxDailyMg: 20, note: "Total dosis per hari; hanya untuk usia di bawah 2 tahun." },
      source: GINA_ASTHMA,
    },
    {
      population: "pediatric", route: "Oral", indication: "Eksaserbasi asma, usia 2–5 tahun",
      minAgeYears: 2, maxAgeYears: 6,
      text: "1–2 mg/kg/hari, maksimum 30 mg/hari, selama 3–5 hari. Untuk eksaserbasi sedang-berat sesuai penilaian klinis.",
      weightBased: { min: 1, max: 2, per: "day", maxDailyMg: 30, note: "Total dosis per hari; hanya untuk usia 2–5 tahun." },
      source: GINA_ASTHMA,
    },
    {
      population: "pediatric", route: "Oral", indication: "Eksaserbasi asma, usia 6–11 tahun",
      minAgeYears: 6, maxAgeYears: 12,
      text: "1–2 mg/kg/hari, maksimum 40 mg/hari, selama 3–5 hari. Ikuti protokol eksaserbasi asma setempat.",
      weightBased: { min: 1, max: 2, per: "day", maxDailyMg: 40, note: "Total dosis per hari; hanya untuk usia 6–11 tahun." },
      source: GINA_ASTHMA,
    },
  ],
  majorWarnings: ["Jangan gunakan regimen oral ini untuk sediaan tetes mata.", "Hindari penghentian mendadak setelah penggunaan jangka panjang."],
  preparations: ["Larutan oral 15 mg/5 mL (periksa kadar prednisolon basa pada kemasan)"],
  lastReviewed: "2026-09-18", source: GINA_ASTHMA,
}];
