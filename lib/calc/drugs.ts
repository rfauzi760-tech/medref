import type { DosePopulation, DosePreparation, Drug, DrugDose, MgPerKgDose } from "@/lib/types";
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

export function getDoseOptions(drug: Drug, population?: DoseCalculationInput["population"], ageYears?: number): DoseOption[] {
  return drug.doses.flatMap((entry, index) => {
    if (!populationMatches(entry, population)) return [];
    if (ageYears !== undefined && ((entry.minAgeYears !== undefined && ageYears < entry.minAgeYears) ||
      (entry.maxAgeYears !== undefined && ageYears >= entry.maxAgeYears))) return [];
    return [{
      index,
      population: entry.population,
      route: entry.route,
      indication: entry.indication,
      label: `${POPULATION_LABELS[entry.population]} · ${entry.indication ?? "Dosis umum"} · ${entry.route}`,
    }];
  }).sort((left, right) => ageYears === undefined ? 0 :
    Number(Boolean(drug.doses[right.index].preferredForCalculation)) - Number(Boolean(drug.doses[left.index].preferredForCalculation)));
}

function numberFromText(value: string): number {
  return Number(value.replace(",", "."));
}

function preparationId(drugAmount: number, drugUnit: string, carrierAmount: number, carrierUnit: string): string {
  return `${drugAmount}-${drugUnit}-${carrierAmount}-${carrierUnit}`.toLowerCase();
}

function normalizedDrugUnit(value: string): DosePreparation["drugUnit"] {
  const unit = value.toLowerCase();
  return unit === "unit" || unit === "iu" ? "units" : unit as DosePreparation["drugUnit"];
}

function ascendingStrengths(value: string): number[] {
  const values = value.split("/").map(numberFromText);
  return values.every((item, index) => item > 0 && (index === 0 || item > values[index - 1])) ? values : [];
}

function inferredAdministration(item: string, carrierUnit: DosePreparation["carrierUnit"]): DosePreparation["administration"] {
  if (carrierUnit === "tablet" || carrierUnit === "kapsul") return "oral";
  if (carrierUnit === "suppositoria" || /\b(?:rektal|rectal|enema)\b/i.test(item)) return "rectal";
  if (/\b(?:respules?|nebulisasi|nebulizer|inhalasi|inhalation)\b/i.test(item)) return "inhalation";
  if (/\b(?:ampul|ampoule|vial|infus|injeksi|syringe)\b/i.test(item)) return "parenteral";
  if (/\b(?:sirup|syrup|suspensi|drops?|tetes|oral)\b/i.test(item)) return "oral";
  return undefined;
}

/** Extract unambiguous liquid concentrations and single-ingredient solid strengths. */
export function parseDosePreparations(items: string[]): DosePreparation[] {
  const parsed: DosePreparation[] = [];
  const seen = new Set<string>();
  const pairedCombination = /\d+(?:[.,]\d+)?\s*\/\s*\d+(?:[.,]\d+)?(?:\s*(?:mg|mcg|g|iu|units?))?\s*(?:&|\+)\s*\d+(?:[.,]\d+)?\s*\/\s*\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|iu|units?)/i;
  const parenthesizedRatio = /\(\s*\d+(?:[.,]\d+)?\s*\/\s*\d+/;
  const liquid = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu|units?)\s*(?:\/|per)\s*(\d+(?:[.,]\d+)?)?\s*(mL)\b/gi;
  const sharedLiquid = /((?:\d+(?:[.,]\d+)?\s*\/\s*)+\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu|units?)\s*(?:\/|per)\s*(\d+(?:[.,]\d+)?)\s*mL\b/gi;
  const solidForms: Array<{ pattern: RegExp; unit: DosePreparation["carrierUnit"] }> = [
    { pattern: /\b(?:tablet|kaplet)\b/i, unit: "tablet" },
    { pattern: /\b(?:kapsul|capsule)\b/i, unit: "kapsul" },
    { pattern: /\b(?:supositoria|suppositoria|suppository)\b/i, unit: "suppositoria" },
  ];

  const add = (drugAmount: number, drugUnit: DosePreparation["drugUnit"], carrierAmount: number, carrierUnit: DosePreparation["carrierUnit"], sourceText: string) => {
    if (!(drugAmount > 0) || !(carrierAmount > 0)) return;
    const id = preparationId(drugAmount, drugUnit, carrierAmount, carrierUnit);
    if (seen.has(id)) return;
    seen.add(id);
    parsed.push({
      id,
      label: `${drugAmount} ${drugUnit}/${carrierAmount === 1 && carrierUnit !== "mL" ? "" : `${carrierAmount} `}${carrierUnit}`,
      drugAmount,
      drugUnit,
      carrierAmount,
      carrierUnit,
      administration: inferredAdministration(sourceText, carrierUnit),
    });
  };

  for (const item of items) {
    if (pairedCombination.test(item) || parenthesizedRatio.test(item) || /\b1\s*:\s*10(?:00|000)\b/i.test(item) || /\b(?:kombinasi|komponen|elementar|salt|base)\b/i.test(item)) continue;
    sharedLiquid.lastIndex = 0;
    for (const match of item.matchAll(sharedLiquid)) {
      const strengths = ascendingStrengths(match[1]);
      if (!strengths.length) continue;
      const drugUnit = normalizedDrugUnit(match[2]);
      const carrierAmount = numberFromText(match[3]);
      for (const drugAmount of strengths) add(drugAmount, drugUnit, carrierAmount, "mL", item);
    }

    liquid.lastIndex = 0;
    for (const match of item.matchAll(liquid)) {
      const drugAmount = numberFromText(match[1]);
      const drugUnit = normalizedDrugUnit(match[2]);
      const carrierAmount = match[3] ? numberFromText(match[3]) : 1;
      add(drugAmount, drugUnit, carrierAmount, "mL", item);
    }

    const form = solidForms.find(({ pattern }) => pattern.test(item));
    if (!form) continue;
    const strengthPattern = /((?:\d+(?:[.,]\d+)?\s*\/\s*)*\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu|units?)\b/gi;
    for (const match of item.matchAll(strengthPattern)) {
      const strengths = match[1].includes("/") ? ascendingStrengths(match[1]) : [numberFromText(match[1])];
      const drugUnit = normalizedDrugUnit(match[2]);
      for (const drugAmount of strengths) add(drugAmount, drugUnit, 1, form.unit, item);
    }
  }
  return parsed;
}

function doseUnit(value: string): NonNullable<MgPerKgDose["doseUnit"]> {
  const normalized = value.toLowerCase();
  return normalized === "unit" || normalized === "iu" ? "units" : normalized as NonNullable<MgPerKgDose["doseUnit"]>;
}

function convertUnit(value: number, from: NonNullable<MgPerKgDose["doseUnit"]>, to: NonNullable<MgPerKgDose["doseUnit"]>): number | undefined {
  if (from === to) return value;
  const toMg: Partial<Record<NonNullable<MgPerKgDose["doseUnit"]>, number>> = { mcg: 0.001, mg: 1, g: 1000 };
  const fromFactor = toMg[from];
  const toFactor = toMg[to];
  return fromFactor !== undefined && toFactor !== undefined ? value * fromFactor / toFactor : undefined;
}

export function areDoseUnitsCompatible(from: NonNullable<MgPerKgDose["doseUnit"]>, to: NonNullable<MgPerKgDose["doseUnit"]>): boolean {
  return convertUnit(1, from, to) !== undefined;
}

export function preparationMatchesRoute(preparation: DosePreparation, route: string): boolean {
  if (preparation.routes?.length) {
    const routeParts: string[] = route.toLowerCase().match(/\b(?:iv|io|im|sc|oral|po|pr)\b/g) ?? [];
    if (!preparation.routes.some((item) => routeParts.includes(item.toLowerCase()))) return false;
  }
  if (!preparation.administration) return true;
  const normalized = route.toLowerCase();
  const accepted = new Set<DosePreparation["administration"]>();
  if (/\b(?:oral|po)\b/.test(normalized)) accepted.add("oral");
  if (/\b(?:iv|im|sc)\b|intravena|intramusk|subkutan|parenteral/.test(normalized)) accepted.add("parenteral");
  if (/\bpr\b|rektal|rectal/.test(normalized)) accepted.add("rectal");
  if (/nebul|inhal|hirup/.test(normalized)) accepted.add("inhalation");
  return accepted.has(preparation.administration);
}

/** Parse the first primary, non-infusion weight-based regimen from displayed dose text. */
export function parseWeightBasedDose(text: string): MgPerKgDose | undefined {
  // Conditional weight thresholds require an explicit branch, not a generic mg/kg formula.
  if (/\([^)]*(?:<|>|≤|≥)\s*\d+(?:[.,]\d+)?\s*kg[^)]*\)/i.test(text)) return undefined;
  const pattern = /(\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?\s*(mg|mcg|g|iu|units?)\s*\/\s*kg(?:bb)?(?:\s*\/\s*(dosis|hari|jam|menit))?/gi;
  const matches = [...text.matchAll(pattern)].filter((match) =>
    !/\bmaks(?:imum|imal)?\b[^.;:]{0,30}$/i.test(text.slice(Math.max(0, match.index! - 45), match.index)),
  );
  const match = matches[0];
  if (!match || /^(?:jam|menit)$/i.test(match[4] ?? "")) return undefined;

  const min = numberFromText(match[1]);
  const max = match[2] ? numberFromText(match[2]) : min;
  if (!(min > 0) || !(max >= min)) return undefined;
  const unit = doseUnit(match[3]);
  const per: MgPerKgDose["per"] = match[4]?.toLowerCase() === "hari" ? "day" : "dose";
  const result: MgPerKgDose = { min, max, per, doseUnit: unit };
  const nextMatchIndex = matches[1]?.index;
  const semicolonIndex = text.indexOf(";", match.index);
  const primaryEnd = [nextMatchIndex, semicolonIndex].filter((index): index is number => index !== undefined && index > match.index!).sort((a, b) => a - b)[0];
  const primaryText = text.slice(match.index, primaryEnd);

  const exactInterval = primaryText.match(/tiap\s+(\d+(?:[.,]\d+)?)\s*jam\b/i);
  if (exactInterval) {
    const hours = numberFromText(exactInterval[1]);
    if (hours > 0 && 24 % hours === 0) result.frequencyPerDay = 24 / hours;
  } else {
    const divided = primaryText.match(/(?:terbagi|dibagi)(?:\s+menjadi)?\s+(\d+)\s*(?:dosis|kali)?\b/i);
    if (divided) result.frequencyPerDay = numberFromText(divided[1]);
    else if (/\bsekali sehari\b/i.test(primaryText)) result.frequencyPerDay = 1;
    else if (/\bdua kali sehari\b/i.test(primaryText)) result.frequencyPerDay = 2;
    else if (/\btiga kali sehari\b/i.test(primaryText)) result.frequencyPerDay = 3;
  }

  const maximum = primaryText.match(/maks(?:imum|imal)?\s*(\d+(?:[.,]\d+)?)\s*(mg|mcg|g|iu|units?)(?!\s*\/\s*kg)(?:\s*\/\s*(dosis|hari))?/i);
  if (maximum) {
    const converted = convertUnit(numberFromText(maximum[1]), doseUnit(maximum[2]), unit);
    if (converted !== undefined) {
      const maximumBasis = maximum[3]?.toLowerCase();
      if (maximumBasis === "hari" || (!maximumBasis && per === "day")) result.maxDailyMg = converted;
      else result.maxPerDoseMg = converted;
      result.maxText = maximum[0];
    }
  }
  return result;
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
  // Never silently switch route or indication merely because another entry is calculable.
  return candidates[0] ?? null;
}

export function calculateDose(drug: Drug, inp: DoseCalculationInput): DoseCalculationOutput {
  const entry = pickDoseEntry(drug, inp);
  const notes: string[] = [];
  const maxWarnings: string[] = [];
  if (!entry) {
    return { entry: drug.doses[0], textOnly: true, notes: ["Data dosis belum tersedia. Periksa formularium setempat."], maxWarnings: [] };
  }
  if ((entry.population === "pediatric" || entry.population === "neonatal") && inp.ageYears === undefined) {
    return { entry, textOnly: true, notes: ["Isi usia pasien sebelum menghitung regimen anak atau neonatus."], maxWarnings: [] };
  }
  const agePopulation = inp.ageYears !== undefined ? resolveDosePopulation({ ageYears: inp.ageYears }) : undefined;
  if (agePopulation && entry.population !== "all" && entry.population !== agePopulation) {
    return { entry, textOnly: true, notes: ["Regimen tidak sesuai kelompok usia pasien."], maxWarnings: [] };
  }
  if (entry.minAgeYears !== undefined || entry.maxAgeYears !== undefined) {
    if (inp.ageYears === undefined ||
      (entry.minAgeYears !== undefined && inp.ageYears < entry.minAgeYears) ||
      (entry.maxAgeYears !== undefined && inp.ageYears >= entry.maxAgeYears)) {
      return { entry, textOnly: true, notes: ["Isi dan periksa usia pasien untuk memilih regimen sesuai rentang usia."], maxWarnings: [] };
    }
  }
  if (entry.minWeightKg !== undefined && (!(num(inp.weightKg) >= entry.minWeightKg))) {
    return { entry, textOnly: true, notes: [`Regimen ini memerlukan berat badan minimal ${entry.minWeightKg} kg.`], maxWarnings: [] };
  }
  const w = num(inp.weightKg);
  const wb = entry.weightBased;
  const fixedDoseMg = entry.fixedDoseMg;

  if (!wb && !(fixedDoseMg && fixedDoseMg > 0 &&
    (entry.fixedDoseMaxMg === undefined || entry.fixedDoseMaxMg >= fixedDoseMg))) {
    return { entry, textOnly: true, notes: [...(entry.notes ?? [])], maxWarnings: [] };
  }

  if (wb && !(w > 0)) {
    return {
      entry,
      textOnly: true,
      notes: [...(entry.notes ?? []), "Berat badan belum diisi. Masukkan berat badan untuk menghitung dosis."],
      maxWarnings: [],
    };
  }

  const unit = wb?.doseUnit ?? "mg";
  let perDoseMin: number | undefined;
  let perDoseMax: number | undefined;
  let totalDailyMin: number | undefined;
  let totalDailyMax: number | undefined;

  const addMaxWarning = (message: string) => {
    if (!maxWarnings.includes(message)) maxWarnings.push(message);
  };

  if (fixedDoseMg !== undefined) {
    perDoseMin = fixedDoseMg;
    perDoseMax = entry.fixedDoseMaxMg ?? fixedDoseMg;
  } else if (wb && wb.per === "dose") {
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
  } else if (wb) {
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
    ? `${rangeText(perDoseMin, perDoseMax)} ${unit}${wb?.frequencyPerDay ? ` ×${wb.frequencyPerDay}/hari` : ""}`
    : undefined;
  const totalDailyText = totalDailyMin !== undefined && totalDailyMax !== undefined
    ? `${rangeText(totalDailyMin, totalDailyMax)} ${unit}/hari`
    : undefined;

  let preparationPerDoseMin: number | undefined;
  let preparationPerDoseMax: number | undefined;
  let preparationText: string | undefined;
  const preparation = inp.preparation;
  const curatedOnly = drug.curatedPreparationsOnly;
  const preparationValid = preparation &&
    Number.isFinite(preparation.drugAmount) && preparation.drugAmount > 0 &&
    Number.isFinite(preparation.carrierAmount) && preparation.carrierAmount > 0 &&
    areDoseUnitsCompatible(unit, preparation.drugUnit) &&
    preparationMatchesRoute(preparation, entry.route) &&
    (preparation.minAgeYears === undefined || (inp.ageYears !== undefined && inp.ageYears >= preparation.minAgeYears)) &&
    (preparation.maxAgeYears === undefined || (inp.ageYears !== undefined && inp.ageYears < preparation.maxAgeYears)) &&
    (!curatedOnly || drug.dosePreparations?.some((item) =>
      item.id === preparation.id && item.drugAmount === preparation.drugAmount &&
      item.drugUnit === preparation.drugUnit && item.carrierAmount === preparation.carrierAmount &&
      item.carrierUnit === preparation.carrierUnit && item.administration === preparation.administration &&
      item.minAgeYears === preparation.minAgeYears && item.maxAgeYears === preparation.maxAgeYears &&
      JSON.stringify(item.routes ?? []) === JSON.stringify(preparation.routes ?? [])));
  if (preparation && !preparationValid) notes.push("Konversi sediaan tidak ditampilkan karena konsentrasi, satuan, atau rutenya tidak sesuai.");
  if (preparation && preparationValid) {
    const doseInPreparationUnitMin = perDoseMin !== undefined ? convertUnit(perDoseMin, unit, preparation.drugUnit) : undefined;
    const doseInPreparationUnitMax = perDoseMax !== undefined ? convertUnit(perDoseMax, unit, preparation.drugUnit) : undefined;
    const dailyInPreparationUnitMin = totalDailyMin !== undefined ? convertUnit(totalDailyMin, unit, preparation.drugUnit) : undefined;
    const dailyInPreparationUnitMax = totalDailyMax !== undefined ? convertUnit(totalDailyMax, unit, preparation.drugUnit) : undefined;
    const carrierPerDrug = preparation.carrierAmount / preparation.drugAmount;
    if (doseInPreparationUnitMin !== undefined && doseInPreparationUnitMax !== undefined) {
      preparationPerDoseMin = doseInPreparationUnitMin * carrierPerDrug;
      preparationPerDoseMax = doseInPreparationUnitMax * carrierPerDrug;
      preparationText = `${rangeText(preparationPerDoseMin, preparationPerDoseMax)} ${preparation.carrierUnit} per pemberian (${preparation.label})`;
    } else if (dailyInPreparationUnitMin !== undefined && dailyInPreparationUnitMax !== undefined) {
      const dailyPreparationMin = dailyInPreparationUnitMin * carrierPerDrug;
      const dailyPreparationMax = dailyInPreparationUnitMax * carrierPerDrug;
      preparationText = `${rangeText(dailyPreparationMin, dailyPreparationMax)} ${preparation.carrierUnit} per hari (${preparation.label})`;
    }
  }

  if (wb) {
    notes.push(
      `Berdasarkan ${fmt(wb.min, 2)}${wb.max !== undefined ? ` sampai ${fmt(wb.max, 2)}` : ""} ${unit}/kg${wb.per === "day" ? "/hari" : ""}. Gunakan titik dalam rentang sesuai indikasi dan kondisi klinis.`,
    );
    if (wb.maxText) notes.push(wb.maxText);
    if (wb.note) notes.push(wb.note);
  }
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
    `${drug.genericName} - ${out.textOnly ? "panduan dosis" : out.entry.fixedDoseMg !== undefined ? "dosis tetap" : "dosis berbasis berat badan"}`,
    `Rute: ${out.entry.route}${out.entry.indication ? ` (${out.entry.indication})` : ""}`,
  ];
  if (out.textOnly) lines.push(`Panduan: ${out.entry.text}`);
  if (out.perDoseText) lines.push(`Dosis per pemberian: ${out.perDoseText}`);
  if (out.totalDailyText) lines.push(`Total harian: ${out.totalDailyText}`);
  if (out.preparationText) lines.push(`Sediaan: ${out.preparationText}`);
  for (const w of out.maxWarnings) lines.push(`⚠ ${w}`);
  for (const note of out.notes) lines.push(`Catatan: ${note}`);
  const source = out.entry.source ?? drug.source;
  lines.push(`Sumber: ${source.org}, ${source.title} (${source.year})`);
  lines.push("Hanya alat bantu keputusan klinis. Verifikasi dengan protokol dan formularium setempat.");
  return lines.join("\n");
}
