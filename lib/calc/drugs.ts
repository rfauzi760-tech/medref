import type { DosePopulation, DosePreparation, Drug, DrugDose } from "@/lib/types";
import { fmt, num } from "@/lib/calc/units";

/**
 * Weight-based drug dose calculation.
 * Pure functions over structured drug data - unit-tested.
 */

export interface DoseCalculationInput {
  /** kg */
  weightKg?: number;
  /** age in years (used to pick adult vs pediatric entry when both exist) */
  ageYears?: number;
  /** preferred dose entry index / route */
  population?: "adult" | "pediatric" | "neonatal";
  indication?: string;
  /** Exact index in drug.doses selected by the user. */
  doseIndex?: number;
  preparation?: DosePreparation;
}

export interface DoseCalculationOutput {
  entry: DrugDose;
  perDoseMg?: number;
  perDoseMin?: number;
  perDoseMax?: number;
  perDoseText?: string;
  totalDailyMg?: number;
  totalDailyMin?: number;
  totalDailyMax?: number;
  totalDailyText?: string;
  preparationPerDoseMin?: number;
  preparationPerDoseMax?: number;
  preparationText?: string;
  maxWarnings: string[];
  notes: string[];
  /** true when the entry has no weight-based schema (text-only) */
  textOnly: boolean;
}

export interface DoseOption {
  index: number;
  label: string;
  population: DosePopulation;
  route: string;
  indication?: string;
}

const POPULATION_LABELS: Record<DosePopulation, string> = {
  adult: "Dewasa",
  pediatric: "Anak",
  neonatal: "Neonatus",
  all: "Semua usia",
};

export const NEONATAL_MAX_AGE_YEARS = 28 / 365.25;

export function resolveDosePopulation({
  ageYears,
  population,
  pediatricMode = false,
}: {
  ageYears?: number;
  population?: DoseCalculationInput["population"];
  pediatricMode?: boolean;
}): DoseCalculationInput["population"] | undefined {
  if (population) return population;
  if (ageYears !== undefined && ageYears < NEONATAL_MAX_AGE_YEARS) return "neonatal";
  if (ageYears !== undefined && ageYears < 18) return "pediatric";
  if (ageYears !== undefined) return "adult";
  return pediatricMode ? "pediatric" : undefined;
}

function populationMatches(entry: DrugDose, population: DoseCalculationInput["population"]): boolean {
  if (!population) return true;
  return entry.population === population || entry.population === "all";
}

export function getDoseOptions(drug: Drug, population?: DoseCalculationInput["population"]): DoseOption[] {
  return drug.doses.flatMap((entry, index) => {
    if (!populationMatches(entry, population)) return [];
    return [{
      index,
      population: entry.population,
      route: entry.route,
      indication: entry.indication,
      label: `${POPULATION_LABELS[entry.population]} · ${entry.indication ?? "Dosis umum"} · ${entry.route}`,
    }];
  });
}

function numberFromText(value: string): number {
  return Number(value.replace(",", "."));
}

function preparationId(drugAmount: number, drugUnit: string, carrierAmount: number, carrierUnit: string): string {
  return `${drugAmount}-${drugUnit}-${carrierAmount}-${carrierUnit}`.toLowerCase();
}

/** Extract only unambiguous single-ingredient liquid concentrations. */
export function parseDosePreparations(items: string[]): DosePreparation[] {
  const parsed: DosePreparation[] = [];
  const seen = new Set<string>();
  const combinationStrength = /\d+(?:[.,]\d+)?\s*\/\s*\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|iu|units?)/i;
  const parenthesizedRatio = /\(\s*\d+(?:[.,]\d+)?\s*\/\s*\d+/;
  const liquid = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu|units?)\s*(?:\/|per)\s*(\d+(?:[.,]\d+)?)?\s*(mL)\b/gi;

  for (const item of items) {
    if (combinationStrength.test(item) || parenthesizedRatio.test(item)) continue;
    liquid.lastIndex = 0;
    for (const match of item.matchAll(liquid)) {
      const drugAmount = numberFromText(match[1]);
      const rawUnit = match[2].toLowerCase();
      const drugUnit = (rawUnit === "unit" || rawUnit === "iu" ? "units" : rawUnit) as DosePreparation["drugUnit"];
      const carrierAmount = match[3] ? numberFromText(match[3]) : 1;
      if (!(drugAmount > 0) || !(carrierAmount > 0)) continue;
      const id = preparationId(drugAmount, drugUnit, carrierAmount, "mL");
      if (seen.has(id)) continue;
      seen.add(id);
      parsed.push({
        id,
        label: `${drugAmount} ${drugUnit}/${carrierAmount} mL`,
        drugAmount,
        drugUnit,
        carrierAmount,
        carrierUnit: "mL",
      });
    }
  }
  return parsed;
}

export function pickDoseEntry(drug: Drug, inp: DoseCalculationInput): DrugDose | null {
  if (inp.doseIndex !== undefined && Number.isInteger(inp.doseIndex)) {
    return drug.doses[inp.doseIndex] ?? null;
  }
  const pop = resolveDosePopulation(inp) ?? "adult";
  const candidates = drug.doses.filter((d) => {
    if (pop === "neonatal") return d.population === "neonatal" || d.population === "all";
    if (pop === "pediatric") return d.population === "pediatric" || d.population === "all";
    return d.population === "adult" || d.population === "all";
  });
  // prefer a weight-based entry for the selected indication, else first candidate
  const withWeight = candidates.find((d) => d.weightBased);
  return withWeight ?? candidates[0] ?? null;
}

export function calculateDose(drug: Drug, inp: DoseCalculationInput): DoseCalculationOutput {
  const entry = pickDoseEntry(drug, inp);
  const notes: string[] = [];
  const maxWarnings: string[] = [];
  if (!entry) {
    return { entry: drug.doses[0], textOnly: true, notes: ["Data dosis belum tersedia. Periksa formularium setempat."], maxWarnings: [] };
  }
  const w = num(inp.weightKg);
  const wb = entry.weightBased;

  if (!wb) {
    return { entry, textOnly: true, notes: [...(entry.notes ?? [])], maxWarnings: [] };
  }

  if (!(w > 0)) {
    return {
      entry,
      textOnly: true,
      notes: [...(entry.notes ?? []), "Berat badan belum diisi. Masukkan berat badan untuk menghitung dosis."],
      maxWarnings: [],
    };
  }

  const unit = wb.doseUnit ?? "mg";
  let perDoseMin: number | undefined;
  let perDoseMax: number | undefined;
  let totalDailyMin: number | undefined;
  let totalDailyMax: number | undefined;

  const addMaxWarning = (message: string) => {
    if (!maxWarnings.includes(message)) maxWarnings.push(message);
  };

  if (wb.per === "dose") {
    perDoseMin = w * wb.min;
    perDoseMax = w * (wb.max ?? wb.min);
    if (wb.maxPerDoseMg && perDoseMax > wb.maxPerDoseMg) {
      perDoseMin = Math.min(perDoseMin, wb.maxPerDoseMg);
      perDoseMax = wb.maxPerDoseMg;
      addMaxWarning(`Dosis terhitung melebihi dosis maksimal per pemberian (${fmt(wb.maxPerDoseMg, 0)} ${unit}). Nilai dibatasi.`);
    }
    if (wb.frequencyPerDay) {
      if (wb.maxDailyMg && perDoseMax * wb.frequencyPerDay > wb.maxDailyMg) {
        const dailyLimitPerDose = wb.maxDailyMg / wb.frequencyPerDay;
        perDoseMin = Math.min(perDoseMin, dailyLimitPerDose);
        perDoseMax = dailyLimitPerDose;
        addMaxWarning(`Dosis harian terhitung melebihi batas maksimal (${fmt(wb.maxDailyMg, 0)} ${unit}/hari). Nilai dibatasi.`);
      }
      totalDailyMin = perDoseMin * wb.frequencyPerDay;
      totalDailyMax = perDoseMax * wb.frequencyPerDay;
    }
  } else {
    totalDailyMin = w * wb.min;
    totalDailyMax = w * (wb.max ?? wb.min);
    if (wb.maxDailyMg && totalDailyMax > wb.maxDailyMg) {
      totalDailyMin = Math.min(totalDailyMin, wb.maxDailyMg);
      totalDailyMax = wb.maxDailyMg;
      addMaxWarning(`Dosis harian terhitung melebihi batas maksimal (${fmt(wb.maxDailyMg, 0)} ${unit}/hari). Nilai dibatasi.`);
    }
    if (wb.frequencyPerDay) {
      perDoseMin = totalDailyMin / wb.frequencyPerDay;
      perDoseMax = totalDailyMax / wb.frequencyPerDay;
      if (wb.maxPerDoseMg && perDoseMax > wb.maxPerDoseMg) {
        perDoseMin = Math.min(perDoseMin, wb.maxPerDoseMg);
        perDoseMax = wb.maxPerDoseMg;
        totalDailyMin = perDoseMin * wb.frequencyPerDay;
        totalDailyMax = perDoseMax * wb.frequencyPerDay;
        addMaxWarning(`Dosis terhitung melebihi dosis maksimal per pemberian (${fmt(wb.maxPerDoseMg, 0)} ${unit}). Nilai dibatasi.`);
      }
    }
  }

  const midpoint = (min?: number, max?: number) => min !== undefined && max !== undefined ? (min + max) / 2 : undefined;
  const rangeText = (min: number, max: number) => {
    const left = fmt(min, min < 10 ? 2 : min < 100 ? 1 : 0);
    const right = fmt(max, max < 10 ? 2 : max < 100 ? 1 : 0);
    return left === right ? left : `${left} sampai ${right}`;
  };
  const perDoseMg = midpoint(perDoseMin, perDoseMax);
  const totalDailyMg = midpoint(totalDailyMin, totalDailyMax);
  const perDoseText = perDoseMin !== undefined && perDoseMax !== undefined
    ? `${rangeText(perDoseMin, perDoseMax)} ${unit}${wb.frequencyPerDay ? ` ×${wb.frequencyPerDay}/hari` : ""}`
    : undefined;
  const totalDailyText = totalDailyMin !== undefined && totalDailyMax !== undefined
    ? `${rangeText(totalDailyMin, totalDailyMax)} ${unit}/hari`
    : undefined;

  let preparationPerDoseMin: number | undefined;
  let preparationPerDoseMax: number | undefined;
  let preparationText: string | undefined;
  if (inp.preparation && inp.preparation.drugUnit === unit && perDoseMin !== undefined && perDoseMax !== undefined) {
    const carrierPerDrug = inp.preparation.carrierAmount / inp.preparation.drugAmount;
    preparationPerDoseMin = perDoseMin * carrierPerDrug;
    preparationPerDoseMax = perDoseMax * carrierPerDrug;
    preparationText = `${rangeText(preparationPerDoseMin, preparationPerDoseMax)} ${inp.preparation.carrierUnit} per pemberian (${inp.preparation.label})`;
  }

  notes.push(
    `Berdasarkan ${fmt(wb.min, 2)}${wb.max !== undefined ? ` sampai ${fmt(wb.max, 2)}` : ""} ${unit}/kg${wb.per === "day" ? "/hari" : ""}. Gunakan titik dalam rentang sesuai indikasi dan kondisi klinis.`,
  );
  if (wb.maxText) notes.push(wb.maxText);
  if (wb.note) notes.push(wb.note);
  if (entry.notes) notes.push(...entry.notes);

  return {
    entry,
    perDoseMg,
    perDoseMin,
    perDoseMax,
    perDoseText,
    totalDailyMg,
    totalDailyMin,
    totalDailyMax,
    totalDailyText,
    preparationPerDoseMin,
    preparationPerDoseMax,
    preparationText,
    maxWarnings,
    notes,
    textOnly: false,
  };
}

/** Human-readable summary used for the copy button. */
export function doseToText(drug: Drug, out: DoseCalculationOutput): string {
  const lines = [
    `${drug.genericName} - dosis berbasis berat badan`,
    `Rute: ${out.entry.route}${out.entry.indication ? ` (${out.entry.indication})` : ""}`,
  ];
  if (out.perDoseText) lines.push(`Dosis per pemberian: ${out.perDoseText}`);
  if (out.totalDailyText) lines.push(`Total harian: ${out.totalDailyText}`);
  if (out.preparationText) lines.push(`Sediaan: ${out.preparationText}`);
  for (const w of out.maxWarnings) lines.push(`⚠ ${w}`);
  lines.push(`Sumber: ${drug.source.org}, ${drug.source.title} (${drug.source.year})`);
  lines.push("Hanya alat bantu keputusan klinis. Verifikasi dengan protokol dan formularium setempat.");
  return lines.join("\n");
}
