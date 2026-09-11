import { CALCULATORS } from "@/lib/data/calculators";
import { DRUGS } from "@/lib/data/drugs";
import { foods } from "@/lib/data/foods";
import { guidelines } from "@/lib/data/guidelines";
import { icd10Codes } from "@/lib/data/icd10";
import { drugInteractions } from "@/lib/data/interactions";
import { SCORES } from "@/lib/data/scores";

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
    { label: "Skrining & Skor", local: SCORES.length, reference: REFERENCE_COUNTS.scores },
    { label: "Kalkulator Klinis", local: CALCULATORS.length, reference: REFERENCE_COUNTS.calculators },
    { label: "Dosis Obat", local: DRUGS.length, reference: REFERENCE_COUNTS.drugs },
    { label: "Interaksi Obat", local: drugInteractions.length, reference: REFERENCE_COUNTS.interactions },
    { label: "Panduan Klinis", local: guidelines.length, reference: REFERENCE_COUNTS.guidelines },
    { label: "Kamus ICD-10", local: icd10Codes.length, reference: REFERENCE_COUNTS.icd10 },
    { label: "Bahan Pangan", local: foods.length, reference: REFERENCE_COUNTS.foods },
  ];

  return rows.map((row) => ({
    ...row,
    status: row.local >= row.reference ? "complete" : "partial",
  }));
}
