import type { DosePreparation, Drug } from "@/lib/types";
import { calculateDose, parseDosePreparations, preparationMatchesRoute } from "@/lib/calc/drugs";

export interface RacikanIngredientInput {
  slug: string;
  doseIndex: number;
  preparationId: string;
  /** mg/kg per dose, or mg/kg/day when the selected regimen uses a daily basis. */
  targetMgPerKg?: number;
  /** Exact active-ingredient amount per packet when the source regimen is text-only. */
  prescribedMg?: number;
}

export interface RacikanInput {
  ageYears: number;
  weightKg: number;
  packets: number;
  frequencyPerDay: number;
  ingredients: RacikanIngredientInput[];
}

export type RacikanResult =
  | { status: "blocked"; reasons: string[] }
  | { status: "ok"; ingredients: Array<{ name: string; mgPerPacket: number; totalMg: number; productUnits: number; productUnit: "tablet" | "kapsul"; preparation: string; source: string }>; warnings: string[] };

function preparations(drug: Drug): DosePreparation[] {
  const solidOnly = (drug.preparations ?? []).filter((item) =>
    /^\s*(?:tablet|kaplet|kapsul|capsule)\b/i.test(item) &&
    !/\b(?:sirup|syrup|suspensi|ampul|ampoule|vial|infus|injeksi|drops?|tetes|suppositoria)\b/i.test(item),
  );
  return drug.curatedPreparationsOnly
    ? drug.dosePreparations ?? []
    : [...new Map([...(drug.dosePreparations ?? []), ...parseDosePreparations(solidOnly)].map((item) => [item.id, item])).values()];
}

export function getRacikanOptions(drug: Drug, ageYears: number) {
  const allowed = drug.doses.flatMap((entry, index) => {
    if (/\b(?:iv|im|sc|pr|io|nebul|inhal)\b/i.test(entry.route)) return [];
    if (!/\b(?:oral|po)\b/i.test(entry.route) && !/(?:usia|tahun|bulan|\bth\b|[<>≥≤])/i.test(entry.route)) return [];
    if (entry.population !== "all" && entry.population !== (ageYears < 18 ? "pediatric" : "adult")) return [];
    if (entry.minAgeYears !== undefined && ageYears < entry.minAgeYears) return [];
    if (entry.maxAgeYears !== undefined && ageYears >= entry.maxAgeYears) return [];
    const products = preparations(drug).filter((item) =>
      (item.carrierUnit === "tablet" || item.carrierUnit === "kapsul") &&
      item.drugUnit === "mg" && preparationMatchesRoute(item, entry.route) &&
      (item.minAgeYears === undefined || ageYears >= item.minAgeYears) &&
      (item.maxAgeYears === undefined || ageYears < item.maxAgeYears),
    );
    if (!products.length) return [];
    const manualDose = !entry.weightBased && !entry.fixedDoseMg;
    return [{ index, label: `${entry.indication ?? "Dosis umum"} · ${entry.route}${manualDose ? " · dosis sesuai resep" : ""}`, basis: entry.weightBased?.per ?? "dose", minMgPerKg: entry.weightBased?.min, maxMgPerKg: entry.weightBased?.max ?? entry.weightBased?.min, manualDose, products: products.map(({ id, label }) => ({ id, label })) }];
  });
  return allowed;
}

export function calculateRacikan(drugs: Record<string, Drug>, input: RacikanInput): RacikanResult {
  const reasons: string[] = [];
  if (!Number.isFinite(input.ageYears) || input.ageYears < 0 || input.ageYears >= 18) reasons.push("Usia anak harus 0 sampai kurang dari 18 tahun.");
  if (!Number.isFinite(input.weightKg) || input.weightKg <= 0 || input.weightKg > 200) reasons.push("Berat badan harus lebih dari 0 sampai 200 kg.");
  if (!Number.isInteger(input.packets) || input.packets < 1 || input.packets > 100) reasons.push("Jumlah bungkus harus 1 sampai 100.");
  if (!Number.isInteger(input.frequencyPerDay) || input.frequencyPerDay < 1 || input.frequencyPerDay > 6) reasons.push("Frekuensi harus 1 sampai 6 kali sehari.");
  if (!input.ingredients.length || input.ingredients.length > 8) reasons.push("Pilih 1 sampai 8 bahan obat.");
  if (new Set(input.ingredients.map((item) => item.slug)).size !== input.ingredients.length) reasons.push("Bahan obat yang sama tidak boleh dimasukkan dua kali.");
  if (reasons.length) return { status: "blocked", reasons };

  const ingredients: Extract<RacikanResult, { status: "ok" }>["ingredients"] = [];
  const warnings = ["Kompatibilitas, stabilitas, dan kelayakan penghancuran tiap produk belum diverifikasi. Apoteker harus menilai sebelum peracikan."];
  for (const item of input.ingredients) {
    const drug = drugs[item.slug];
    if (!drug) { reasons.push(`Obat ${item.slug} tidak ditemukan.`); continue; }
    const entry = drug.doses[item.doseIndex];
    const option = getRacikanOptions(drug, input.ageYears).find((candidate) => candidate.index === item.doseIndex);
    if (!entry || !option) { reasons.push(`${drug.genericName}: belum ada regimen oral padat yang dapat dihitung untuk usia ini.`); continue; }
    const preparation = preparations(drug).find((candidate) => candidate.id === item.preparationId && option.products.some((product) => product.id === candidate.id));
    if (!preparation) { reasons.push(`${drug.genericName}: sediaan tablet/kapsul yang dipilih tidak sesuai.`); continue; }
    let mgPerPacket: number;
    if (option.manualDose) {
      if (!Number.isFinite(item.prescribedMg) || !(item.prescribedMg! > 0) || item.prescribedMg! > 10_000) {
        reasons.push(`${drug.genericName}: masukkan dosis zat aktif per bungkus sesuai resep.`); continue;
      }
      mgPerPacket = item.prescribedMg!;
    } else {
      const dose = calculateDose(drug, { ageYears: input.ageYears, weightKg: input.weightKg, doseIndex: item.doseIndex, preparation });
      if (dose.textOnly || dose.perDoseMin === undefined || dose.perDoseMax === undefined || dose.preparationPerDoseMin === undefined) {
        reasons.push(`${drug.genericName}: dosis atau konversi sediaan belum terverifikasi.`); continue;
      }
      if (entry.weightBased?.doseUnit && entry.weightBased.doseUnit !== "mg") {
        reasons.push(`${drug.genericName}: satuan dosis bukan mg.`); continue;
      }
      const usualFrequency = entry.weightBased?.frequencyPerDay;
      if (usualFrequency && input.frequencyPerDay > usualFrequency) {
        reasons.push(`${drug.genericName}: frekuensi melampaui regimen terpilih.`); continue;
      }
      if (usualFrequency && input.frequencyPerDay !== usualFrequency && !/analges|antipire|antipyret/i.test(drug.drugClass)) {
        reasons.push(`${drug.genericName}: frekuensi harus ${usualFrequency} kali sehari sesuai regimen.`); continue;
      }
      if (entry.weightBased) {
      const target = item.targetMgPerKg;
      if (!Number.isFinite(target) || target === undefined || target < entry.weightBased.min || target > (entry.weightBased.max ?? entry.weightBased.min)) {
        reasons.push(`${drug.genericName}: pilih target mg/kg dalam rentang regimen.`); continue;
      }
        mgPerPacket = input.weightKg * target / (entry.weightBased.per === "day" ? usualFrequency ?? 0 : 1);
      } else {
        if (dose.perDoseMin !== dose.perDoseMax) { reasons.push(`${drug.genericName}: pilih dosis tepat dalam rentang, bukan titik tengah otomatis.`); continue; }
        mgPerPacket = dose.perDoseMin;
      }
      if (!Number.isFinite(mgPerPacket) || mgPerPacket < dose.perDoseMin - 1e-9 || mgPerPacket > dose.perDoseMax + 1e-9) {
        reasons.push(`${drug.genericName}: target melampaui batas dosis terhitung.`); continue;
      }
      if (entry.weightBased?.maxDailyMg && mgPerPacket * input.frequencyPerDay > entry.weightBased.maxDailyMg) {
        reasons.push(`${drug.genericName}: total harian melampaui batas maksimum.`); continue;
      }
    }
    const totalMg = mgPerPacket * input.packets;
    const productUnits = totalMg * preparation.carrierAmount / preparation.drugAmount;
    ingredients.push({
      name: drug.genericName,
      mgPerPacket,
      totalMg,
      productUnits,
      productUnit: preparation.carrierUnit as "tablet" | "kapsul",
      preparation: preparation.label,
      source: (entry.source ?? drug.source).url ?? `${(entry.source ?? drug.source).org}, ${(entry.source ?? drug.source).year}`,
    });
  }
  return reasons.length ? { status: "blocked", reasons } : { status: "ok", ingredients, warnings };
}
