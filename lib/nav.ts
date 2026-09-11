import {
  Activity,
  Baby,
  BookOpen,
  Calculator,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  ListChecks,
  Pill,
  Salad,
  Search,
  ShieldAlert,
  Syringe,
  Utensils,
  Weight,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { CATALOG_COUNTS } from "@/lib/catalog-counts";

export interface NavModule {
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  count: number;
  countLabel: string;
}

export const modules: NavModule[] = [
  {
    slug: "scores",
    name: "Skrining & Skor",
    description: "Skor klinis, aturan, dan kriteria diagnosis yang tervalidasi. Semua alat menghitung secara otomatis.",
    href: "/scores",
    icon: ListChecks,
    count: CATALOG_COUNTS.scores,
    countLabel: "alat",
  },
  {
    slug: "calculators",
    name: "Kalkulator Klinis",
    description: "Kalkulator dosis, cairan, ginjal, elektrolit, kardiologi dan tubuh.",
    href: "/calculators",
    icon: Calculator,
    count: CATALOG_COUNTS.calculators,
    countLabel: "kalkulator",
  },
  {
    slug: "indications",
    name: "Indikasi & Kontraindikasi",
    description: "Referensi prosedur terstruktur: indikasi, kontraindikasi, dan tindakan pencegahan.",
    href: "/indications",
    icon: ClipboardList,
    count: CATALOG_COUNTS.indications,
    countLabel: "prosedur",
  },
  {
    slug: "drugs",
    name: "Dosis Obat",
    description: "Referensi dosis dewasa & anak dengan kalkulator dosis berbasis berat badan.",
    href: "/drugs",
    icon: Pill,
    count: CATALOG_COUNTS.drugs,
    countLabel: "obat",
  },
  {
    slug: "interactions",
    name: "Interaksi Obat",
    description: "Pemeriksa interaksi obat antar pasangan obat secara berpasangan.",
    href: "/interactions",
    icon: ShieldAlert,
    count: CATALOG_COUNTS.interactions,
    countLabel: "interaksi",
  },
  {
    slug: "guidelines",
    name: "Panduan Klinis",
    description: "Ringkasan tata laksana penyakit terstruktur untuk dipakai di samping tempat tidur.",
    href: "/guidelines",
    icon: BookOpen,
    count: CATALOG_COUNTS.guidelines,
    countLabel: "panduan",
  },
  {
    slug: "anthropometry",
    name: "Antropometri Anak",
    description: "Standar pertumbuhan WHO: z-score, persentil, dan grafik pertumbuhan.",
    href: "/anthropometry",
    icon: Weight,
    count: 0,
    countLabel: "",
  },
  {
    slug: "development",
    name: "Perkembangan Anak",
    description: "Tonggak perkembangan berdasarkan usia dan tanda bahaya (red flags).",
    href: "/development",
    icon: Baby,
    count: 0,
    countLabel: "",
  },
  {
    slug: "immunization",
    name: "Imunisasi",
    description: "Jadwal imunisasi Indonesia: telah, jatuh tempo, akan datang, dan tertunda.",
    href: "/immunization",
    icon: Syringe,
    count: 0,
    countLabel: "",
  },
  {
    slug: "icd10",
    name: "Kamus ICD-10",
    description: "Pencarian cepat kode ICD-10 dengan istilah Bahasa Indonesia.",
    href: "/icd10",
    icon: Search,
    count: CATALOG_COUNTS.icd10,
    countLabel: "kode",
  },
  {
    slug: "nutrition",
    name: "Database Gizi",
    description: "Komposisi pangan untuk praktik klinis Indonesia.",
    href: "/nutrition",
    icon: Utensils,
    count: CATALOG_COUNTS.foods,
    countLabel: "bahan pangan",
  },
  {
    slug: "meal-planner",
    name: "Perencana Makan",
    description: "Rencana makan terstruktur yang dihitung dari database gizi.",
    href: "/meal-planner",
    icon: Salad,
    count: 0,
    countLabel: "",
  },
  {
    slug: "nutrition-guidance",
    name: "Panduan Gizi Klinis",
    description: "Prinsip gizi per kondisi penyakit dan panduan pemilihan makanan.",
    href: "/nutrition-guidance",
    icon: HeartPulse,
    count: CATALOG_COUNTS.nutritionGuidance,
    countLabel: "kondisi",
  },
  {
    slug: "specialties",
    name: "Spesialisasi",
    description: "Telusuri semua alat klinis menurut spesialisasi.",
    href: "/specialties",
    icon: Workflow,
    count: 0,
    countLabel: "",
  },
];

export const appName = "RFSmed";
