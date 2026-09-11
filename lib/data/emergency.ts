/**
 * Emergency (IGD) pathway index.
 *
 * This module is a navigation layer only: each pathway points at clinical
 * content that already exists in RFSmed (guidelines, scores, calculators).
 * No new clinical guidance is authored here, and the red flags shown on a
 * pathway page are read from the linked guideline's own red-flag section.
 *
 * Pure data: safe to import from client components such as the navigation.
 */

export type EmergencyRefKind = "guideline" | "score" | "calculator";

export interface EmergencyRef {
  kind: EmergencyRefKind;
  /** guideline id, score id/slug, or calculator id/slug */
  ref: string;
}

export interface EmergencyPathway {
  id: string;
  slug: string;
  title: string;
  /** short navigation description, no prescriptive content */
  description: string;
  category: string;
  specialties: string[];
  /** linked existing content */
  steps: EmergencyRef[];
  /** guideline whose red-flag section is surfaced on the pathway page */
  redFlagSource?: string;
  order: number;
}

const PATHWAYS: EmergencyPathway[] = [
  {
    id: "syok-sepsis",
    slug: "syok-sepsis",
    title: "Syok dan Sepsis",
    description: "Penilaian cepat hipoperfusi, penyaring sepsis, dan alat hemodinamik yang tersedia di RFSmed.",
    category: "Kegawatan Umum",
    specialties: ["Kedokteran Emergensi", "Perawatan Intensif", "Penyakit Infeksi"],
    steps: [
      { kind: "guideline", ref: "sepsis2" },
      { kind: "guideline", ref: "syok-kardiogenik" },
      { kind: "score", ref: "qsofa" },
      { kind: "score", ref: "sofa" },
      { kind: "score", ref: "news2" },
      { kind: "calculator", ref: "shock-index" },
      { kind: "calculator", ref: "map" },
      { kind: "calculator", ref: "infusion-rate" },
    ],
    redFlagSource: "sepsis2",
    order: 1,
  },
  {
    id: "nyeri-dada",
    slug: "nyeri-dada",
    title: "Nyeri Dada",
    description: "Stratifikasi risiko sindrom koroner akut serta kemungkinan emboli paru dan diseksi aorta.",
    category: "Kardiovaskular",
    specialties: ["Kardiologi", "Kedokteran Emergensi", "Penyakit Dalam"],
    steps: [
      { kind: "guideline", ref: "stemi" },
      { kind: "guideline", ref: "acs-nste" },
      { kind: "guideline", ref: "diseksi-aorta" },
      { kind: "guideline", ref: "pe" },
      { kind: "score", ref: "heart" },
      { kind: "score", ref: "grace" },
      { kind: "score", ref: "timi-nstemi" },
      { kind: "score", ref: "wells-pe" },
      { kind: "score", ref: "perc" },
      { kind: "calculator", ref: "qtc" },
    ],
    redFlagSource: "stemi",
    order: 2,
  },
  {
    id: "sesak",
    slug: "sesak",
    title: "Sesak Napas",
    description: "Pneumonia, asma, PPOK, gagal napas, efusi pleura, dan pneumotoraks.",
    category: "Respirasi",
    specialties: ["Pulmonologi", "Kedokteran Emergensi", "Perawatan Intensif"],
    steps: [
      { kind: "guideline", ref: "cap2" },
      { kind: "guideline", ref: "asma2" },
      { kind: "guideline", ref: "ppok2" },
      { kind: "guideline", ref: "ards" },
      { kind: "guideline", ref: "pneumotoraks" },
      { kind: "guideline", ref: "efusi-pleura" },
      { kind: "guideline", ref: "ghf" },
      { kind: "score", ref: "curb65" },
      { kind: "score", ref: "psi" },
      { kind: "score", ref: "news2" },
      { kind: "calculator", ref: "pf-ratio" },
      { kind: "calculator", ref: "aa-gradient" },
    ],
    redFlagSource: "cap2",
    order: 3,
  },
  {
    id: "aritmia",
    slug: "aritmia",
    title: "Aritmia dan Palpitasi",
    description: "Takikardia dan bradiaritmia, termasuk stratifikasi risiko tromboemboli dan perdarahan.",
    category: "Kardiovaskular",
    specialties: ["Kardiologi", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "vt-vf" },
      { kind: "guideline", ref: "svt" },
      { kind: "guideline", ref: "af" },
      { kind: "guideline", ref: "aflutter" },
      { kind: "guideline", ref: "av-block" },
      { kind: "score", ref: "chadsvasc" },
      { kind: "score", ref: "hasbled" },
      { kind: "calculator", ref: "qtc" },
    ],
    redFlagSource: "vt-vf",
    order: 4,
  },
  {
    id: "stroke-neurologi",
    slug: "stroke-neurologi",
    title: "Stroke dan Defisit Neurologis Akut",
    description: "Stroke iskemik dan hemoragik, TIA, serta penilaian beratnya defisit.",
    category: "Neurologi",
    specialties: ["Neurologi", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "stroke2" },
      { kind: "guideline", ref: "stroke-hemoragik" },
      { kind: "guideline", ref: "tia" },
      { kind: "score", ref: "nihss" },
      { kind: "score", ref: "aspects" },
      { kind: "score", ref: "canadian-ct" },
      { kind: "score", ref: "ich-score" },
      { kind: "score", ref: "four" },
      { kind: "score", ref: "gcs" },
    ],
    redFlagSource: "stroke2",
    order: 5,
  },
  {
    id: "kejang-kesadaran",
    slug: "kejang-kesadaran",
    title: "Kejang dan Penurunan Kesadaran",
    description: "Status epileptikus, kejang demam, infeksi sistem saraf pusat, dan penilaian kesadaran.",
    category: "Neurologi",
    specialties: ["Neurologi", "Pediatri", "Perawatan Intensif"],
    steps: [
      { kind: "guideline", ref: "statusep2" },
      { kind: "guideline", ref: "kejang-demam" },
      { kind: "guideline", ref: "meningitis" },
      { kind: "guideline", ref: "ensefalitis" },
      { kind: "guideline", ref: "hipoglikemia" },
      { kind: "score", ref: "gcs" },
      { kind: "score", ref: "four" },
      { kind: "score", ref: "camicu" },
      { kind: "score", ref: "rass" },
    ],
    redFlagSource: "statusep2",
    order: 6,
  },
  {
    id: "trauma",
    slug: "trauma",
    title: "Trauma",
    description: "Cedera kepala, toraks, abdomen, luka bakar, dan fraktur terbuka.",
    category: "Trauma",
    specialties: ["Kedokteran Emergensi", "Bedah", "Ortopedi"],
    steps: [
      { kind: "guideline", ref: "trauma-kepala" },
      { kind: "guideline", ref: "trauma-toraks" },
      { kind: "guideline", ref: "trauma-abdomen" },
      { kind: "guideline", ref: "luka-bakar" },
      { kind: "guideline", ref: "fraktur-terbuka" },
      { kind: "guideline", ref: "pneumotoraks" },
      { kind: "score", ref: "gcs" },
      { kind: "score", ref: "canadian-ct" },
    ],
    redFlagSource: "trauma-kepala",
    order: 7,
  },
  {
    id: "elektrolit-metabolik",
    slug: "elektrolit-metabolik",
    title: "Gangguan Elektrolit dan Metabolik",
    description: "Kalium, natrium, status asam-basa, ketoasidosis, dan hipoglikemia.",
    category: "Metabolik",
    specialties: ["Penyakit Dalam", "Nefrologi", "Perawatan Intensif"],
    steps: [
      { kind: "guideline", ref: "hiperkalemia" },
      { kind: "guideline", ref: "hipokalemia" },
      { kind: "guideline", ref: "hiponatremia" },
      { kind: "guideline", ref: "siadh" },
      { kind: "guideline", ref: "dka2" },
      { kind: "guideline", ref: "hipoglikemia" },
      { kind: "calculator", ref: "abg" },
      { kind: "calculator", ref: "anion-gap" },
      { kind: "calculator", ref: "corrected-sodium" },
      { kind: "calculator", ref: "free-water-deficit" },
      { kind: "calculator", ref: "bicarb" },
      { kind: "calculator", ref: "osmolality" },
    ],
    redFlagSource: "hiperkalemia",
    order: 8,
  },
  {
    id: "keracunan",
    slug: "keracunan",
    title: "Keracunan dan Overdosis",
    description: "Organofosfat, parasetamol, opioid, alkohol, dan gigitan ular berbisa.",
    category: "Toksikologi",
    specialties: ["Toksikologi", "Kedokteran Emergensi", "Perawatan Intensif"],
    steps: [
      { kind: "guideline", ref: "organofosfat" },
      { kind: "guideline", ref: "overdosis-parasetamol" },
      { kind: "guideline", ref: "opioid-uad" },
      { kind: "guideline", ref: "alkohol-uad" },
      { kind: "guideline", ref: "gigitan-ular" },
      { kind: "score", ref: "ciwa" },
    ],
    redFlagSource: "organofosfat",
    order: 9,
  },
  {
    id: "obstetri",
    slug: "obstetri",
    title: "Kegawatan Obstetri",
    description: "Preeklampsia, HELLP, perdarahan pascapersalinan, dan komplikasi kehamilan.",
    category: "Obstetri",
    specialties: ["Obstetri dan Ginekologi", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "preeklampsia2" },
      { kind: "guideline", ref: "hellp" },
      { kind: "guideline", ref: "pph" },
      { kind: "guideline", ref: "kpd" },
      { kind: "guideline", ref: "plasenta-previa" },
      { kind: "guideline", ref: "solusio" },
    ],
    redFlagSource: "preeklampsia2",
    order: 10,
  },
  {
    id: "neonatus",
    slug: "neonatus",
    title: "Kegawatan Neonatus",
    description: "Resusitasi, sepsis, gangguan napas, ikterus, dan berat lahir rendah.",
    category: "Neonatologi",
    specialties: ["Neonatologi", "Pediatri"],
    steps: [
      { kind: "guideline", ref: "sepsis-neo" },
      { kind: "guideline", ref: "asfiksia-neo" },
      { kind: "guideline", ref: "rds-neo" },
      { kind: "guideline", ref: "ikterus-neo" },
      { kind: "guideline", ref: "bblr" },
      { kind: "score", ref: "apgar" },
      { kind: "score", ref: "downes" },
      { kind: "score", ref: "silverman" },
      { kind: "score", ref: "sarnat" },
    ],
    redFlagSource: "sepsis-neo",
    order: 11,
  },
  {
    id: "gawat-anak",
    slug: "gawat-anak",
    title: "Gawat Darurat Anak",
    description: "Pneumonia, diare, kejang, obstruksi napas, dan malnutrisi berat.",
    category: "Pediatri",
    specialties: ["Pediatri", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "pneumonia-anak" },
      { kind: "guideline", ref: "diare-anak" },
      { kind: "guideline", ref: "bronkiolitis" },
      { kind: "guideline", ref: "croup" },
      { kind: "guideline", ref: "kejang-demam" },
      { kind: "guideline", ref: "gizi-buruk" },
      { kind: "score", ref: "imci" },
      { kind: "score", ref: "sam" },
      { kind: "calculator", ref: "paediatric-maint" },
      { kind: "calculator", ref: "holliday-segar" },
    ],
    redFlagSource: "pneumonia-anak",
    order: 12,
  },
  {
    id: "abdomen-cerna",
    slug: "abdomen-cerna",
    title: "Abdomen Akut dan Perdarahan Cerna",
    description: "Apendisitis, bilier, pankreatitis, obstruksi, peritonitis, dan perdarahan saluran cerna.",
    category: "Gastroenterologi",
    specialties: ["Bedah", "Gastroenterologi", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "acute-abdomen" },
      { kind: "guideline", ref: "apendisitis" },
      { kind: "guideline", ref: "kolesistitis" },
      { kind: "guideline", ref: "kolangitis" },
      { kind: "guideline", ref: "pankreatitis2" },
      { kind: "guideline", ref: "ileus-obstruktif" },
      { kind: "guideline", ref: "peritonitis" },
      { kind: "guideline", ref: "ugib" },
      { kind: "guideline", ref: "lgib" },
      { kind: "score", ref: "alvarado" },
      { kind: "score", ref: "blatchford" },
      { kind: "score", ref: "ranson" },
    ],
    redFlagSource: "acute-abdomen",
    order: 13,
  },
  {
    id: "alergi-anafilaksis",
    slug: "alergi-anafilaksis",
    title: "Anafilaksis dan Reaksi Alergi",
    description: "Pengenalan derajat reaksi dan tata laksana awal anafilaksis.",
    category: "Kegawatan Umum",
    specialties: ["Kedokteran Emergensi", "Penyakit Dalam", "Pediatri"],
    steps: [
      { kind: "guideline", ref: "anafilaksis" },
      { kind: "score", ref: "anafilaksis-grade" },
    ],
    redFlagSource: "anafilaksis",
    order: 14,
  },
  {
    id: "infeksi-tropis",
    slug: "infeksi-tropis",
    title: "Infeksi Tropis dan Demam",
    description: "Dengue, malaria, tifoid, leptospirosis, tetanus, dan rabies.",
    category: "Infeksi",
    specialties: ["Penyakit Infeksi", "Penyakit Dalam", "Kedokteran Emergensi"],
    steps: [
      { kind: "guideline", ref: "dengue2" },
      { kind: "guideline", ref: "malaria" },
      { kind: "guideline", ref: "typhoid" },
      { kind: "guideline", ref: "leptospirosis" },
      { kind: "guideline", ref: "tetanus" },
      { kind: "guideline", ref: "rabies" },
      { kind: "score", ref: "qsofa" },
    ],
    redFlagSource: "dengue2",
    order: 15,
  },
];

export const EMERGENCY_PATHWAYS: EmergencyPathway[] = [...PATHWAYS].sort((a, b) => a.order - b.order);

export const EMERGENCY_CATEGORIES: string[] = [...new Set(EMERGENCY_PATHWAYS.map((p) => p.category))];
