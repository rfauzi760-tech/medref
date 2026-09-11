import "server-only";
import Fuse from "fuse.js";
import { SCORES } from "@/lib/data/scores";
import { CALCULATORS } from "@/lib/data/calculators";
import { DRUGS } from "@/lib/data/drugs";
import { GUIDELINES } from "@/lib/data/guidelines";
import { ICD10 } from "@/lib/data/icd10";
import { PROCEDURES } from "@/lib/data/indications";
import { foods } from "@/lib/data/foods";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";
import type { SearchGroup, SearchHit } from "@/lib/search-types";

type ScoreItem = (typeof SCORES)[number];
type CalcItem = (typeof CALCULATORS)[number];
type DrugItem = (typeof DRUGS)[number];
type GuideItem = (typeof GUIDELINES)[number];
type IcdItem = (typeof ICD10)[number];
type ProcItem = (typeof PROCEDURES)[number];
type FoodItem = (typeof foods)[number];
type NutritionItem = (typeof nutritionGuidance)[number];

const igdTools = [
  { id: "igd-toolkit", title: "Toolkit IGD", subtitle: "Kumpulan alat kegawatdaruratan", href: "/igd-toolkit", keywords: "emergensi gawat darurat" },
  { id: "emergency-dose", title: "Kalkulator Dosis Obat IGD", subtitle: "Dosis total dan laju infus", href: "/emergency-dose", keywords: "infus pompa vasopresor" },
  { id: "bilirubin", title: "Kalkulator Bilirubin Neonatus", subtitle: "Ambang terapi AAP 2022", href: "/bilirubin", keywords: "fototerapi transfusi tukar bayi" },
  { id: "antidotes", title: "Panduan Toksikologi dan Antidot", subtitle: "Referensi keracunan", href: "/antidotes", keywords: "racun toksin antidote" },
  { id: "pregnancy-drugs", title: "Obat Kehamilan dan Menyusui", subtitle: "Kehamilan dan laktasi", href: "/pregnancy-drugs", keywords: "hamil bumil busui asi" },
  { id: "electrolytes", title: "Koreksi Elektrolit", subtitle: "Natrium, kalsium, kalium, magnesium", href: "/electrolytes", keywords: "defisit air hiponatremia hipokalemia" },
  { id: "ddx", title: "Mesin Diagnosis Banding", subtitle: "Prioritas diagnosis berdasarkan temuan", href: "/ddx", keywords: "differential diagnosis ddx" },
  { id: "pediatric-emergency", title: "Gawat Darurat Anak", subtitle: "Resusitasi pediatri", href: "/pediatric-emergency", keywords: "pediatric emergency anak" },
  { id: "emergency", title: "Algoritma IGD", subtitle: "Alur kegawatan", href: "/emergency", keywords: "protokol emergensi" },
  { id: "timer", title: "Timer Protokol", subtitle: "Target waktu tindakan kritis", href: "/timer", keywords: "stroke pci sepsis trauma" },
  { id: "ecg-atlas", title: "Atlas EKG", subtitle: "43 pola elektrokardiografi", href: "/ecg-atlas", keywords: "curve of life irama iskemia" },
  { id: "radiology-atlas", title: "Imaging", subtitle: "159 pola radiologi", href: "/radiology-atlas", keywords: "monochrome worlds xray ct mri usg" },
];

interface GroupDef<T> {
  key: string;
  label: string;
  items: T[];
  keys: string[];
  map: (item: T) => SearchHit;
}

const groups: GroupDef<unknown>[] = [
  {
    key: "igd-toolkit",
    label: "Toolkit IGD",
    items: igdTools as unknown[],
    keys: ["title", "subtitle", "keywords"],
    map: (item) => {
      const tool = item as (typeof igdTools)[number];
      return { id: tool.id, title: tool.title, subtitle: tool.subtitle, href: tool.href, group: "igd-toolkit" };
    },
  },
  {
    key: "scores",
    label: "Skor & Kriteria",
    items: SCORES as unknown[],
    keys: ["title", "abbreviation", "description", "keywords", "specialties"],
    map: (item) => {
      const s = item as ScoreItem;
      return { id: s.slug, title: s.title, subtitle: s.description, href: `/scores/${s.slug}`, group: "scores", badge: s.abbreviation };
    },
  },
  {
    key: "calculators",
    label: "Kalkulator",
    items: CALCULATORS as unknown[],
    keys: ["title", "abbreviation", "description", "keywords", "specialties"],
    map: (item) => {
      const c = item as CalcItem;
      return { id: c.slug, title: c.title, subtitle: c.description, href: `/calculators/${c.slug}`, group: "calculators", badge: c.abbreviation };
    },
  },
  {
    key: "drugs",
    label: "Obat",
    items: DRUGS as unknown[],
    keys: ["genericName", "brandNames", "drugClass", "indications", "keywords", "specialties"],
    map: (item) => {
      const d = item as DrugItem;
      return { id: d.slug, title: d.genericName, subtitle: d.drugClass, href: `/drugs/${d.slug}`, group: "drugs", badge: d.drugClass };
    },
  },
  {
    key: "guidelines",
    label: "Panduan Klinis",
    items: GUIDELINES as unknown[],
    keys: ["title", "keywords", "specialties"],
    map: (item) => {
      const g = item as GuideItem;
      return { id: g.slug, title: g.title, subtitle: "Panduan klinis", href: `/guidelines/${g.slug}`, group: "guidelines" };
    },
  },
  {
    key: "icd10",
    label: "ICD-10",
    items: ICD10 as unknown[],
    keys: ["code", "en", "id"],
    map: (item) => {
      const c = item as IcdItem;
      return { id: c.code, title: `${c.code} - ${c.id ?? c.en}`, subtitle: c.en, href: `/icd10?q=${encodeURIComponent(c.code)}`, group: "icd10", badge: c.code };
    },
  },
  {
    key: "indications",
    label: "Prosedur",
    items: PROCEDURES as unknown[],
    keys: ["title", "keywords", "specialties"],
    map: (item) => {
      const p = item as ProcItem;
      return { id: p.slug, title: p.title, subtitle: "Indikasi dan kontraindikasi", href: `/indications/${p.slug}`, group: "indications" };
    },
  },
  {
    key: "nutrition",
    label: "Bahan Pangan",
    items: foods as unknown[],
    keys: ["name", "nameId", "category"],
    map: (item) => {
      const f = item as FoodItem;
      return { id: f.id, title: f.name, subtitle: f.category, href: `/nutrition?q=${encodeURIComponent(f.name)}`, group: "nutrition", badge: f.category };
    },
  },
  {
    key: "nutrition-guidance",
    label: "Panduan Gizi Klinis",
    items: nutritionGuidance as unknown[],
    keys: ["title", "keywords", "specialties"],
    map: (item) => {
      const n = item as NutritionItem;
      return { id: n.slug, title: n.title, subtitle: "Panduan gizi klinis", href: `/nutrition-guidance/${n.slug}`, group: "nutrition-guidance" };
    },
  },
];

const engines = groups.map((g) => ({
  ...g,
  fuse: new Fuse(g.items as object[], {
    keys: g.keys,
    threshold: 0.42,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  }),
}));

export function globalSearch(query: string, limitPerGroup = 5): SearchGroup[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const out: SearchGroup[] = [];
  for (const g of engines) {
    const raw = g.fuse.search(q);
    const hits = raw.slice(0, limitPerGroup).map((r) => g.map(r.item as never));
    if (hits.length > 0) out.push({ label: g.label, key: g.key, hits });
  }
  return out;
}

/** Exact slug lookup helpers for static generation. */
export const allSearchableSlugs = {
  scores: SCORES.map((s) => s.slug),
  calculators: CALCULATORS.map((c) => c.slug),
  drugs: DRUGS.map((d) => d.slug),
  guidelines: GUIDELINES.map((g) => g.slug),
  indications: PROCEDURES.map((p) => p.slug),
  nutritionGuidance: nutritionGuidance.map((n) => n.slug),
};
