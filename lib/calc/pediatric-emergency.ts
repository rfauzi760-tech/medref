import "server-only";

export interface PawperSegment {
  lenMin: number;
  lenMax: number;
  ibw: number;
  tbw: readonly number[];
  macUpperBounds: readonly number[];
}

export const PAWPER_SEGMENTS: readonly PawperSegment[] = [
  { lenMin: 43, lenMax: 49.3, ibw: 3, tbw: [2.5, 2.8, 3, 3.2, 3.5, 4, 4.5], macUpperBounds: [9.4, 10.3, 11.5, 12.7, 13.9, 15.1] },
  { lenMin: 49.4, lenMax: 54.8, ibw: 4, tbw: [3.5, 3.8, 4, 4.5, 5, 6, 7], macUpperBounds: [9.6, 10.4, 11.7, 12.9, 14.1, 15.4] },
  { lenMin: 54.9, lenMax: 59.2, ibw: 5, tbw: [4, 4.5, 5, 5.5, 6, 7, 8], macUpperBounds: [11, 11.4, 12.4, 13.4, 15.4, 16.4] },
  { lenMin: 59.3, lenMax: 62.9, ibw: 6, tbw: [5, 5.5, 6, 6.5, 7, 8, 9], macUpperBounds: [11.5, 11.9, 13.1, 14.2, 15.2, 16.4] },
  { lenMin: 63, lenMax: 66.4, ibw: 7, tbw: [6, 6.5, 7, 7.5, 8, 9, 10], macUpperBounds: [11.5, 12.9, 14.4, 15.3, 16.4, 17.4] },
  { lenMin: 66.5, lenMax: 70.1, ibw: 8, tbw: [7, 7.5, 8, 8.5, 9.5, 10, 11], macUpperBounds: [12.5, 13.6, 14.4, 15.4, 16.9, 18.4] },
  { lenMin: 70.2, lenMax: 73.9, ibw: 9, tbw: [7.5, 8.5, 9, 10, 11, 12, 13], macUpperBounds: [12.6, 14.1, 15.4, 16.2, 18.1, 19.9] },
  { lenMin: 74, lenMax: 78.2, ibw: 10, tbw: [8.5, 9.5, 10, 11, 12, 13, 14], macUpperBounds: [12.7, 14.4, 15.4, 17, 18.6, 20.4] },
  { lenMin: 78.3, lenMax: 83.1, ibw: 11, tbw: [9, 10, 11, 12, 13, 14, 15], macUpperBounds: [12.7, 14.6, 15.4, 17, 18.9, 20.4] },
  { lenMin: 83.2, lenMax: 88, ibw: 12, tbw: [10, 11, 12, 13, 14, 16, 18], macUpperBounds: [13, 14.8, 15.7, 17.1, 18.9, 20.4] },
  { lenMin: 88.1, lenMax: 92.6, ibw: 13, tbw: [11, 12, 13, 14, 15, 17, 19], macUpperBounds: [13.5, 14.8, 15.8, 17.2, 19, 20.9] },
  { lenMin: 92.7, lenMax: 96.8, ibw: 14, tbw: [12, 13, 14, 15, 17, 19, 21], macUpperBounds: [14.2, 15.1, 16.5, 17.6, 19.3, 20.9] },
  { lenMin: 96.9, lenMax: 100.6, ibw: 15, tbw: [13, 14, 15, 16, 18, 20, 22], macUpperBounds: [14.4, 15.6, 16.5, 17.6, 19.4, 21.4] },
  { lenMin: 100.7, lenMax: 103.9, ibw: 16, tbw: [14, 15, 16, 17, 19, 21, 23], macUpperBounds: [14.8, 15.7, 17, 17.9, 19.7, 22.4] },
  { lenMin: 104, lenMax: 107, ibw: 17, tbw: [15, 16, 17, 18, 20, 22, 24], macUpperBounds: [15.3, 15.9, 17.4, 18, 19.9, 22.4] },
  { lenMin: 107.1, lenMax: 110, ibw: 18, tbw: [16, 17, 18, 19, 21, 24, 26], macUpperBounds: [15.6, 16.6, 17.8, 18.6, 21.9, 23.4] },
  { lenMin: 110.1, lenMax: 113.2, ibw: 19, tbw: [16, 18, 19, 21, 23, 25, 28], macUpperBounds: [15.6, 16.6, 17.8, 20.2, 22.5, 24.4] },
  { lenMin: 113.3, lenMax: 116.5, ibw: 20, tbw: [17, 19, 20, 22, 24, 26, 29], macUpperBounds: [15.6, 17.5, 18.4, 20.2, 22.9, 24.4] },
  { lenMin: 116.6, lenMax: 120.6, ibw: 22, tbw: [20, 21, 22, 24, 27, 29, 32], macUpperBounds: [16.3, 17.7, 19.1, 21.2, 23.1, 24.8] },
  { lenMin: 120.7, lenMax: 125.4, ibw: 24, tbw: [21, 23, 24, 26, 29, 32, 35], macUpperBounds: [16.5, 18.2, 19.4, 21.8, 23.4, 24.8] },
  { lenMin: 125.5, lenMax: 129.6, ibw: 26, tbw: [23, 25, 26, 28, 31, 34, 37], macUpperBounds: [17.5, 18.5, 20.4, 22, 24.4, 25.4] },
  { lenMin: 129.7, lenMax: 133.3, ibw: 28, tbw: [24, 26, 28, 30, 33, 36, 40], macUpperBounds: [17.8, 18.7, 20.7, 22.3, 25.6, 26.6] },
  { lenMin: 133.4, lenMax: 136.6, ibw: 30, tbw: [26, 28, 30, 33, 36, 40, 44], macUpperBounds: [17.9, 19.4, 22, 22.9, 25.6, 26.6] },
  { lenMin: 136.7, lenMax: 139.8, ibw: 32, tbw: [28, 30, 32, 35, 39, 42, 47], macUpperBounds: [19.2, 20.4, 22.3, 23.9, 25.6, 26.9] },
  { lenMin: 139.9, lenMax: 143.2, ibw: 34, tbw: [29, 32, 34, 38, 42, 46, 50], macUpperBounds: [19.2, 20.7, 23.2, 24.6, 26.5, 28.2] },
  { lenMin: 143.3, lenMax: 146.5, ibw: 36, tbw: [29, 33, 36, 39, 43, 48, 52], macUpperBounds: [19.5, 21, 23.3, 24.6, 26.9, 29.9] },
  { lenMin: 146.6, lenMax: 149.8, ibw: 38, tbw: [33, 36, 38, 41, 45, 50, 58], macUpperBounds: [20.2, 21.6, 23.3, 24.9, 26.9, 28.6] },
  { lenMin: 149.9, lenMax: 153.1, ibw: 40, tbw: [36, 39, 40, 48, 52, 57, 65], macUpperBounds: [20.8, 22.5, 24.1, 26.1, 27.8, 29.9] },
  { lenMin: 153.2, lenMax: 158, ibw: 45, tbw: [38, 43, 45, 55, 64, 72, 84], macUpperBounds: [21.1, 23.4, 25.5, 28.1, 31.5, 35.1] },
  { lenMin: 158.1, lenMax: 165, ibw: 50, tbw: [40, 45, 50, 60, 72, 79, 87], macUpperBounds: [22, 23.8, 26.1, 30.1, 32.7, 35.3] },
  { lenMin: 165.1, lenMax: 170, ibw: 55, tbw: [45, 49, 55, 65, 75, 85, 99], macUpperBounds: [22.7, 23.9, 27.4, 30.4, 33.7, 36.6] },
  { lenMin: 170.1, lenMax: 174, ibw: 60, tbw: [46, 54, 60, 77, 83, 91, 105], macUpperBounds: [23.2, 25.2, 30, 33.3, 35.5, 39.8] },
  { lenMin: 174.1, lenMax: 177, ibw: 65, tbw: [52, 59, 65, 80, 89, 98, 108], macUpperBounds: [24.2, 27.4, 30.2, 35.1, 39.3, 40.9] },
  { lenMin: 177.1, lenMax: 180, ibw: 70, tbw: [55, 63, 70, 87, 95, 105, 116], macUpperBounds: [25.7, 28.2, 32.6, 36, 39.5, 41.3] },
] as const;

export const HABITUS_LABELS: Record<number, string> = {
  1: "Kurus++",
  2: "Kurus",
  3: "Rata-rata",
  4: "Gemuk",
  5: "Gemuk+",
  6: "Obes",
  7: "Obes++",
};

export interface PediatricEstimate {
  computeWeightKg: number | null;
  weightSource: "actual" | "TBW" | "IBW" | null;
  habitusScore: number | null;
  ibwKg: number | null;
  tbwKg: number | null;
  lengthSegment: readonly [number, number] | null;
  flags: string[];
  notes: string[];
}

function segmentFor(lengthCm: number) {
  return PAWPER_SEGMENTS.find((segment) => lengthCm >= segment.lenMin && lengthCm <= segment.lenMax) ?? null;
}

function habitusScoreFor(segment: PawperSegment, macCm: number): number {
  if (macCm < segment.macUpperBounds[0]) return 1;
  for (let index = 1; index <= 5; index += 1) {
    if (macCm <= segment.macUpperBounds[index]) return index + 1;
  }
  return 7;
}

export function estimatePediatricWeight(input: { actualWeightKg?: number; lengthCm?: number; macCm?: number }): PediatricEstimate {
  const flags: string[] = [];
  const notes: string[] = [];
  const empty: PediatricEstimate = { computeWeightKg: null, weightSource: null, habitusScore: null, ibwKg: null, tbwKg: null, lengthSegment: null, flags, notes };
  const segment = input.lengthCm ? segmentFor(input.lengthCm) : null;

  if (input.actualWeightKg && input.actualWeightKg > 0) {
    flags.push("USED_ACTUAL_WEIGHT");
    notes.push("Berat badan aktual dipakai untuk perhitungan dosis.");
    return {
      computeWeightKg: input.actualWeightKg,
      weightSource: "actual",
      habitusScore: segment && input.macCm ? habitusScoreFor(segment, input.macCm) : null,
      ibwKg: segment?.ibw ?? null,
      tbwKg: null,
      lengthSegment: segment ? [segment.lenMin, segment.lenMax] : null,
      flags,
      notes,
    };
  }

  if (!input.lengthCm || input.lengthCm <= 0) {
    notes.push("Masukkan panjang telentang dan lingkar lengan atas, atau berat badan aktual.");
    return empty;
  }
  if (input.lengthCm < 43) {
    flags.push("BELOW_TAPE_RANGE");
    notes.push("Panjang kurang dari 43 cm. Gunakan jalur neonatus atau berat badan aktual.");
    return empty;
  }
  if (input.lengthCm > 180) {
    flags.push("ABOVE_TAPE_RANGE");
    notes.push("Panjang lebih dari 180 cm. Gunakan berat badan aktual atau pendekatan dewasa.");
    return empty;
  }
  if (!segment) {
    notes.push("Panjang tidak terpetakan ke segmen PAWPER.");
    return empty;
  }

  const lengthSegment = [segment.lenMin, segment.lenMax] as const;
  if (input.macCm && input.macCm > 0) {
    const habitusScore = habitusScoreFor(segment, input.macCm);
    const tbwKg = segment.tbw[habitusScore - 1];
    if (habitusScore >= 5) {
      flags.push("OBESE_USE_IBW_FOR_HYDROPHILIC");
      notes.push("Pada HS5 sampai HS7, dosis default memakai TBW. Pertimbangkan IBW untuk obat hidrofilik.");
    }
    if (habitusScore === 7) {
      flags.push("SEVERE_OBESITY_LOW_ACCURACY");
      notes.push("Akurasi estimasi menurun pada kategori MAC tertinggi.");
    }
    if (tbwKg < 6) {
      flags.push("INFANT_UNDER_6KG_LIMITED");
      notes.push("Data validasi terbatas pada estimasi di bawah 6 kg. Utamakan berat badan aktual.");
    }
    notes.push("Berat perhitungan memakai TBW dari panjang badan dan lingkar lengan atas.");
    return { computeWeightKg: tbwKg, weightSource: "TBW", habitusScore, ibwKg: segment.ibw, tbwKg, lengthSegment, flags, notes };
  }

  flags.push("NO_MAC_FELL_BACK_TO_IBW");
  if (segment.ibw < 6) {
    flags.push("INFANT_UNDER_6KG_LIMITED");
    notes.push("Data validasi terbatas pada estimasi di bawah 6 kg. Utamakan berat badan aktual.");
  }
  notes.push("Lingkar lengan atas belum diukur. Berat perhitungan memakai IBW dan kurang presisi.");
  return { computeWeightKg: segment.ibw, weightSource: "IBW", habitusScore: 3, ibwKg: segment.ibw, tbwKg: null, lengthSegment, flags, notes };
}

const roundHalf = (value: number) => Math.round(value * 2) / 2;
const roundTenth = (value: number) => Math.round(value * 10) / 10;

export function airwayForAge(ageYears: number) {
  if (ageYears < 1) {
    const neonate = ageYears < 1 / 12;
    return {
      cuffed: neonate ? "3,0" : "3,0–3,5",
      uncuffed: neonate ? "3,0–3,5" : "3,5–4,0",
      depth: neonate ? "9–10" : "10–11",
      suction: neonate ? "6–8" : "8",
      opa: ageYears < 0.5 ? "Size 00 (sekitar 40 mm)" : "Size 0 (sekitar 50 mm)",
      blade: "Lurus (Miller) 0–1",
      note: "Pada bayi kurang dari satu tahun, gunakan ukuran standar dan verifikasi secara klinis.",
    };
  }

  const cuffed = roundHalf(ageYears / 4 + 3.5);
  const uncuffed = roundHalf(ageYears / 4 + 4);
  const depth = ageYears >= 2 ? roundHalf(ageYears / 2 + 12) : roundHalf(3 * uncuffed);
  return {
    cuffed: cuffed.toFixed(1).replace(".", ","),
    uncuffed: uncuffed.toFixed(1).replace(".", ","),
    depth: depth.toFixed(1).replace(".", ","),
    suction: String(Math.round(2 * uncuffed)),
    opa: ageYears < 3 ? "Size 1 (sekitar 60 mm)" : ageYears < 8 ? "Size 2 (sekitar 70 mm)" : "Size 3 (sekitar 80 mm)",
    blade: ageYears < 2 ? "Miller atau Macintosh 1" : ageYears < 8 ? "Macintosh 2" : "Macintosh 2–3",
    note: null,
  };
}

export function lmaSizeForWeight(weightKg: number): string {
  if (weightKg < 5) return "1";
  if (weightKg < 10) return "1,5";
  if (weightKg < 20) return "2";
  if (weightKg < 30) return "2,5";
  if (weightKg < 50) return "3";
  if (weightKg < 70) return "4";
  return "5";
}

export function resuscitationForWeight(weightKg: number) {
  return {
    epinephrineMg: roundTenth(Math.min(0.01 * weightKg, 1)),
    epinephrineMl1To10000: roundTenth(Math.min(0.1 * weightKg, 10)),
    defibrillationFirstJ: Math.round(2 * weightKg),
    defibrillationSecondJ: Math.round(4 * weightKg),
    amiodaroneMg: Math.round(Math.min(5 * weightKg, 300)),
    cardioversionLowJ: roundTenth(0.5 * weightKg),
    cardioversionHighJ: Math.round(weightKg),
    adenosineFirstMg: roundTenth(Math.min(0.1 * weightKg, 6)),
    adenosineSecondMg: roundTenth(Math.min(0.2 * weightKg, 12)),
    atropineMg: roundTenth(Math.min(0.02 * weightKg, 0.5)),
    fluidLowMl: Math.round(10 * weightKg),
    fluidHighMl: Math.round(20 * weightKg),
    dextroseD10Ml: Math.round(5 * weightKg),
  };
}

export function lowSystolicThreshold(ageYears: number): number {
  if (ageYears < 1 / 12) return 60;
  if (ageYears < 1) return 70;
  if (ageYears <= 10) return Math.round(70 + 2 * ageYears);
  return 90;
}

export const PEDIATRIC_VITAL_RANGES = [
  { label: "Bayi (0–12 bulan)", heartRate: "100–160", respiratoryRate: "30–53", maxYears: 1 },
  { label: "Batita (1–3 tahun)", heartRate: "90–150", respiratoryRate: "22–37", maxYears: 3 },
  { label: "Prasekolah (3–6 tahun)", heartRate: "80–140", respiratoryRate: "20–28", maxYears: 6 },
  { label: "Usia sekolah (6–12 tahun)", heartRate: "70–120", respiratoryRate: "18–25", maxYears: 12 },
  { label: "Remaja (12–18 tahun)", heartRate: "60–100", respiratoryRate: "12–20", maxYears: 99 },
] as const;
