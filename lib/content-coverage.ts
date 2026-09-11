import { CATALOG_COUNTS } from "@/lib/catalog-counts";

export interface ContentCoverage {
  label: string;
  local: number;
  reference?: number;
  status: "complete" | "partial" | "local-only";
}

export const REFERENCE_COUNTS = {
  scores: 132,
  calculators: 12,
  drugs: 452,
  interactions: 100,
  guidelines: 340,
  icd10: 1893,
  foods: 303,
} as const;

export function getContentCoverage(): ContentCoverage[] {
  const rows = [
    { label: "Skrining & Skor", local: CATALOG_COUNTS.scores, reference: REFERENCE_COUNTS.scores },
    { label: "Kalkulator Klinis", local: CATALOG_COUNTS.calculators, reference: REFERENCE_COUNTS.calculators },
    { label: "Dosis Obat", local: CATALOG_COUNTS.drugs, reference: REFERENCE_COUNTS.drugs },
    { label: "Interaksi Obat", local: CATALOG_COUNTS.interactions, reference: REFERENCE_COUNTS.interactions },
    { label: "Panduan Klinis", local: CATALOG_COUNTS.guidelines, reference: REFERENCE_COUNTS.guidelines },
    { label: "Kamus ICD-10", local: CATALOG_COUNTS.icd10, reference: REFERENCE_COUNTS.icd10 },
    { label: "Bahan Pangan", local: CATALOG_COUNTS.foods, reference: REFERENCE_COUNTS.foods },
  ];

  return rows.map((row) => ({
    ...row,
    status: row.local >= row.reference ? "complete" : "partial",
  }));
}
