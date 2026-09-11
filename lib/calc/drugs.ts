import type { Drug, DrugDose } from "@/lib/types";
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
}

export interface DoseCalculationOutput {
  entry: DrugDose;
  perDoseMg?: number;
  perDoseText?: string;
  totalDailyMg?: number;
  totalDailyText?: string;
  maxWarnings: string[];
  notes: string[];
  /** true when the entry has no weight-based schema (text-only) */
  textOnly: boolean;
}

export function pickDoseEntry(drug: Drug, inp: DoseCalculationInput): DrugDose | null {
  const pop = inp.population ?? (inp.ageYears !== undefined && inp.ageYears < 18 ? "pediatric" : inp.ageYears !== undefined && inp.ageYears < 1 ? "neonatal" : "adult");
  const candidates = drug.doses.filter((d) => {
    if (pop === "neonatal") return d.population === "neonatal";
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
  const perKg = wb.min + (wb.max !== undefined ? (wb.max - wb.min) / 2 : 0);
  let perDoseMg: number | undefined;
  let totalDailyMg: number | undefined;

  if (wb.per === "dose") {
    perDoseMg = w * perKg;
    if (wb.frequencyPerDay) totalDailyMg = perDoseMg * wb.frequencyPerDay;
    if (wb.maxPerDoseMg && perDoseMg > wb.maxPerDoseMg) {
      perDoseMg = wb.maxPerDoseMg;
      maxWarnings.push(`Dosis terhitung melebihi dosis maksimal per pemberian (${fmt(wb.maxPerDoseMg, 0)} ${unit}). Nilai dibatasi.`);
    }
    if (wb.maxDailyMg && totalDailyMg && totalDailyMg > wb.maxDailyMg) {
      totalDailyMg = wb.maxDailyMg;
      maxWarnings.push(`Dosis harian terhitung melebihi batas maksimal (${fmt(wb.maxDailyMg, 0)} ${unit}/hari). Nilai dibatasi.`);
    }
  } else {
    // per day
    totalDailyMg = w * perKg;
    if (wb.maxDailyMg && totalDailyMg > wb.maxDailyMg) {
      totalDailyMg = wb.maxDailyMg;
      maxWarnings.push(`Dosis harian terhitung melebihi batas maksimal (${fmt(wb.maxDailyMg, 0)} ${unit}/hari). Nilai dibatasi.`);
    }
    // divide into per-dose amounts when a frequency is given
    if (wb.frequencyPerDay) perDoseMg = totalDailyMg / wb.frequencyPerDay;
  }

  const perDoseText = perDoseMg !== undefined ? `${fmt(perDoseMg, perDoseMg < 10 ? 1 : 0)} ${unit}${wb.frequencyPerDay ? ` ×${wb.frequencyPerDay}/hari` : ""}` : undefined;
  const totalDailyText = totalDailyMg !== undefined ? `${fmt(totalDailyMg, totalDailyMg < 10 ? 1 : 0)} ${unit}/hari` : undefined;

  notes.push(
    `Berdasarkan ${fmt(wb.min, 2)}${wb.max !== undefined ? ` sampai ${fmt(wb.max, 2)}` : ""} ${unit}/kg${wb.per === "day" ? "/hari" : ""}. Nilai tengah dipakai dan perlu dititrasi secara klinis.`,
  );
  if (wb.maxText) notes.push(wb.maxText);
  if (wb.note) notes.push(wb.note);
  if (entry.notes) notes.push(...entry.notes);

  return { entry, perDoseMg, perDoseText, totalDailyMg, totalDailyText, maxWarnings, notes, textOnly: false };
}

/** Human-readable summary used for the copy button. */
export function doseToText(drug: Drug, out: DoseCalculationOutput): string {
  const lines = [
    `${drug.genericName} - dosis berbasis berat badan`,
    `Rute: ${out.entry.route}${out.entry.indication ? ` (${out.entry.indication})` : ""}`,
  ];
  if (out.perDoseText) lines.push(`Dosis per pemberian: ${out.perDoseText}`);
  if (out.totalDailyText) lines.push(`Total harian: ${out.totalDailyText}`);
  for (const w of out.maxWarnings) lines.push(`⚠ ${w}`);
  lines.push(`Sumber: ${drug.source.org}, ${drug.source.title} (${drug.source.year})`);
  lines.push("Hanya alat bantu keputusan klinis. Verifikasi dengan protokol dan formularium setempat.");
  return lines.join("\n");
}

/** Estimate age (years) from weight (classic rule: weight ≈ 2×age + 8 kg for 1–10 y). */
export function estimateAgeYearsFromWeight(weightKg: number): number | undefined {
  if (!(weightKg > 0)) return undefined;
  if (weightKg >= 9 && weightKg <= 30) return (weightKg - 8) / 2;
  return undefined;
}
