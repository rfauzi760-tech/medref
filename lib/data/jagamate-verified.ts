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

export const JAGAMATE_ENRICHMENTS: DrugEnrichment[] = [
  {
    slug: "ambroksol",
    preparations: ["Sirup oral 15 mg/5 mL"],
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
