/** Numeric helpers used across calculation engines. */

export function round(v: number, digits = 1): number {
  const f = 10 ** digits;
  return Math.round((v + Number.EPSILON) * f) / f;
}

export function fmt(v: number, digits = 1): string {
  if (!Number.isFinite(v)) return "—";
  return String(round(v, digits));
}

/** Clamp a value into [min, max] */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Parse a numeric input; returns NaN when missing/invalid. */
export function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export const KG_TO_LB = 2.20462;
export const CM_TO_IN = 0.393701;
export const MG_TO_G = 0.001;
export const MCG_TO_MG = 0.001;

export function kgToLb(kg: number): number {
  return kg * KG_TO_LB;
}

export function lbToKg(lb: number): number {
  return lb / KG_TO_LB;
}

export function cmToIn(cm: number): number {
  return cm * CM_TO_IN;
}

export function inToCm(inch: number): number {
  return inch / CM_TO_IN;
}

/** mg/dL glucose to mmol/L */
export function glucoseMgdlToMmol(mgdl: number): number {
  return mgdl / 18.0182;
}

/** mg/dL creatinine to µmol/L */
export function crMgdlToUmoll(mgdl: number): number {
  return mgdl * 88.4;
}

/** mg/dL calcium to mmol/L */
export function caMgdlToMmol(mgdl: number): number {
  return mgdl / 4.008;
}

/** mg/dL sodium to mmol/L — sodium molar mass 22.99, but clinically 1 mEq = 1 mmol; mg/dL → mmol/L = mg/dL * 10 / 22.99 */
export function naMgdlToMmol(mgdl: number): number {
  return (mgdl * 10) / 22.99;
}

/** mg/dL urea (BUN) to mmol/L urea — BUN mg/dL * 0.357 = mmol/L urea */
export function bunMgdlToMmol(bunMgdl: number): number {
  return bunMgdl * 0.357;
}

/** mg/dL urea nitrogen to mg/dL urea: urea = BUN * 2.14 */
export function bunToUrea(bunMgdl: number): number {
  return bunMgdl * 2.14;
}

/** standard normal CDF (percentile from z) — Abramowitz & Stegun approximation */
export function zToPercentile(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  let p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  if (z > 0) p = 1 - p;
  return p * 100;
}

/** percentile (0-100) to z-score (inverse normal CDF) — Beasley-Springer-Moro / Acklam */
export function percentileToZ(pct: number): number {
  const p = clamp(pct / 100, 1e-12, 1 - 1e-12);
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    q = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= phigh) {
    q = p - 0.5;
    const r = q * q;
    q = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    q = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  return q;
}