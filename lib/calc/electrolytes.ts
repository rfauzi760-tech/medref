function ensure(value: number, label: string) {
  if (!Number.isFinite(value)) throw new RangeError(`${label} tidak valid`);
}

const rounded = (value: number) => Math.round(value * 10) / 10;

export function correctedSodium(measuredSodium: number, glucoseMgDl: number) {
  ensure(measuredSodium, "Natrium");
  ensure(glucoseMgDl, "Glukosa");
  return rounded(measuredSodium + 1.6 * Math.max(0, glucoseMgDl - 100) / 100);
}

export function correctedCalcium(totalCalciumMgDl: number, albuminGDl: number) {
  ensure(totalCalciumMgDl, "Kalsium");
  ensure(albuminGDl, "Albumin");
  return rounded(totalCalciumMgDl + 0.8 * (4 - albuminGDl));
}

export function freeWaterDeficit(input: { sodium: number; weightKg: number; sex: "male" | "female"; olderAdult: boolean }) {
  const { sodium, weightKg, sex, olderAdult } = input;
  ensure(sodium, "Natrium");
  ensure(weightKg, "Berat badan");
  if (sodium <= 140 || weightKg <= 0) return 0;
  const fraction = olderAdult ? (sex === "male" ? 0.5 : 0.45) : sex === "male" ? 0.6 : 0.5;
  return rounded(weightKg * fraction * (sodium / 140 - 1));
}

export function potassiumDeficitEstimate(potassiumMmolL: number) {
  ensure(potassiumMmolL, "Kalium");
  if (potassiumMmolL >= 3.5) return { minMmol: 0, maxMmol: 0 };
  const gap = 3.5 - potassiumMmolL;
  return { minMmol: Math.round(gap * 200), maxMmol: Math.round(gap * 400) };
}

export function magnesiumDeficitEstimate(magnesiumMgDl: number, weightKg: number) {
  ensure(magnesiumMgDl, "Magnesium");
  ensure(weightKg, "Berat badan");
  if (magnesiumMgDl >= 1.7 || weightKg <= 0) return 0;
  return rounded((1.7 - magnesiumMgDl) * weightKg * 0.2);
}

export function sodiumCorrectionLimit(acute: boolean) {
  return acute ? "Target awal 4 sampai 6 mmol/L. Hindari koreksi berlebihan." : "Batasi umumnya sampai 8 mmol/L dalam 24 jam pada pasien berisiko.";
}
