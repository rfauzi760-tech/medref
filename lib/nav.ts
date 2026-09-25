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
  Search,
  ShieldAlert,
  Siren,
  Syringe,
  Timer,
  Weight,
  Workflow,
  type LucideIcon,
} from "lucide-react";
export interface NavModule {
  slug: string;
  name: string;
  href: string;
  icon: LucideIcon;
  showInNav?: boolean;
}

export const modules: NavModule[] = [
  {
    slug: "igd-toolkit",
    name: "Toolkit IGD",
    href: "/igd-toolkit",
    icon: Siren,
  },
  {
    slug: "emergency-dose",
    name: "Kalkulator Dosis IGD",
    href: "/emergency-dose",
    icon: Pill,
    showInNav: false,
  },
  {
    slug: "bilirubin",
    name: "Kalkulator Bilirubin",
    href: "/bilirubin",
    icon: Baby,
    showInNav: false,
  },
  {
    slug: "antidotes",
    name: "Toksikologi & Antidot",
    href: "/antidotes",
    icon: FlaskConical,
    showInNav: false,
  },
  {
    slug: "pregnancy-drugs",
    name: "Obat Kehamilan & Menyusui",
    href: "/pregnancy-drugs",
    icon: HeartPulse,
    showInNav: false,
  },
  {
    slug: "electrolytes",
    name: "Koreksi Elektrolit",
    href: "/electrolytes",
    icon: Activity,
    showInNav: false,
  },
  {
    slug: "ddx",
    name: "Mesin Diagnosis Banding",
    href: "/ddx",
    icon: Search,
    showInNav: false,
  },
  {
    slug: "scores",
    name: "Skrining & Skor",
    href: "/scores",
    icon: ListChecks,
  },
  {
    slug: "calculators",
    name: "Kalkulator Klinis",
    href: "/calculators",
    icon: Calculator,
  },
  {
    slug: "indications",
    name: "Indikasi & Kontraindikasi",
    href: "/indications",
    icon: ClipboardList,
  },
  {
    slug: "drugs",
    name: "Dosis Obat",
    href: "/drugs",
    icon: Pill,
  },
  {
    slug: "interactions",
    name: "Interaksi Obat",
    href: "/interactions",
    icon: ShieldAlert,
  },
  {
    slug: "guidelines",
    name: "Panduan Klinis",
    href: "/guidelines",
    icon: BookOpen,
  },
  {
    slug: "emergency",
    name: "Algoritma IGD",
    href: "/emergency",
    icon: Siren,
  },
  {
    slug: "timer",
    name: "Timer Protokol",
    href: "/timer",
    icon: Timer,
  },
  {
    slug: "pediatric-emergency",
    name: "Gawat Darurat Anak",
    href: "/pediatric-emergency",
    icon: Baby,
  },
  {
    slug: "neonatal-resuscitation",
    name: "Resusitasi Neonatus",
    href: "/neonatal-resuscitation",
    icon: Workflow,
  },
  {
    slug: "ecg-module",
    name: "Modul EKG",
    href: "/ecg-module",
    icon: BookOpen,
  },
  {
    slug: "anthropometry",
    name: "Antropometri Anak",
    href: "/anthropometry",
    icon: Weight,
  },
  {
    slug: "development",
    name: "Perkembangan Anak",
    href: "/development",
    icon: Baby,
  },
  {
    slug: "immunization",
    name: "Imunisasi",
    href: "/immunization",
    icon: Syringe,
  },
  {
    slug: "icd10",
    name: "Kamus ICD-10",
    href: "/icd10",
    icon: Search,
  },
  {
    slug: "specialties",
    name: "Spesialisasi",
    href: "/specialties",
    icon: Workflow,
  },
];

export const appName = "RFSmed";
