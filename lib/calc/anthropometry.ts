import { WHO_GROWTH_TABLES } from "@/lib/data/growth";
import type { GrowthIndicator, GrowthResult, GrowthSex } from "@/lib/types";
import { zToPercentile } from "@/lib/calc/units";

/**
 * WHO Child Growth Standards (2006) z-score engine using the official LMS
 * parameters (Box-Cox power L, median M, coefficient of variation S).
 *
 * z = ((X/M)^L − 1) / (L·S)        (L ≠ 0)
 * z = ln(X/M) / S                  (L = 0)
 *
 * Age-based indicators use monthly tables; weight-for-length/height use
 * centimetre tables. Children < 24 months are measured recumbent (length);
 * ≥ 24 months standing (height) — matching WHO Anthro behaviour, including
 * the 0.7 cm design offset at the 24-month junction.
 */

interface LMS {
  x: number;
  L: number;
  M: number;
  S: number;
}

type IndicatorKey = GrowthIndicator | "length-height-for-age";

/** Build a lookup keyed by `${sex}:${indicator}` with merged length/height tables. */
function buildLookup(): Record<string, LMS[]> {
  const map: Record<string, LMS[]> = {};
  // WHO Anthro rule: recumbent length for x < 24 months, standing height for x >= 24.
  const byX = new Map<string, Map<number, LMS>>();
  for (const t of WHO_GROWTH_TABLES) {
    let indicator: IndicatorKey = t.indicator as IndicatorKey;
    const isLength = indicator === "length-for-age";
    const isHeight = indicator === "height-for-age";
    if (isLength || isHeight) indicator = "length-height-for-age";
    const key = `${t.sex}:${indicator}`;
    let buckets = byX.get(key);
    if (!buckets) {
      buckets = new Map<number, LMS>();
      byX.set(key, buckets);
    }
    for (const [x, L, M, S] of t.data) {
      const existing = buckets.get(x);
      if (!existing) {
        buckets.set(x, { x, L, M, S });
      } else if (isHeight && x >= 24) {
        buckets.set(x, { x, L, M, S }); // height row wins at/after 24 months
      } else if (isLength && x < 24) {
        buckets.set(x, { x, L, M, S }); // length row wins before 24 months
      } else if (indicator === "bmi-for-age" && x >= 24) {
        buckets.set(x, { x, L, M, S }); // 24–60 mo BMI table wins at/after 24 months (WHO Anthro behaviour)
      }
    }
  }
  for (const [key, buckets] of byX) {
    map[key] = [...buckets.values()].sort((a, b) => a.x - b.x);
  }
  return map;
}

const LOOKUP = buildLookup();

export function tableRange(indicator: GrowthIndicator, sex: GrowthSex): { min: number; max: number } | null {
  const key = `${sex}:${(indicator === "length-for-age" || indicator === "height-for-age") ? "length-height-for-age" : indicator}`;
  const arr = LOOKUP[key];
  if (!arr || arr.length === 0) return null;
  return { min: arr[0].x, max: arr[arr.length - 1].x };
}

/** Linear interpolation of L, M, S at point x. Returns null when out of table range. */
export function lookupLMS(indicator: GrowthIndicator, sex: GrowthSex, x: number): LMS | null {
  const key = `${sex}:${(indicator === "length-for-age" || indicator === "height-for-age") ? "length-height-for-age" : indicator}`;
  const arr = LOOKUP[key];
  if (!arr || arr.length === 0) return null;
  if (x < arr[0].x || x > arr[arr.length - 1].x) return null;
  if (x <= arr[0].x) return arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (x <= arr[i].x) {
      const a = arr[i - 1];
      const b = arr[i];
      const f = (x - a.x) / (b.x - a.x);
      return { x, L: a.L + f * (b.L - a.L), M: a.M + f * (b.M - a.M), S: a.S + f * (b.S - a.S) };
    }
  }
  return arr[arr.length - 1];
}

/** z-score of measurement y at point x. Returns NaN when outside table range. */
export function zscore(indicator: GrowthIndicator, sex: GrowthSex, x: number, y: number): number {
  const lms = lookupLMS(indicator, sex, x);
  if (!lms || !(y > 0)) return NaN;
  const { L, M, S } = lms;
  const ratio = y / M;
  if (ratio <= 0) return NaN;
  if (Math.abs(L) < 1e-9) return Math.log(ratio) / S;
  return (Math.pow(ratio, L) - 1) / (L * S);
}

/** Expected measurement at a given z-score. */
export function valueAtZ(indicator: GrowthIndicator, sex: GrowthSex, x: number, z: number): number {
  const lms = lookupLMS(indicator, sex, x);
  if (!lms) return NaN;
  const { L, M, S } = lms;
  if (Math.abs(L) < 1e-9) return M * Math.exp(S * z);
  const inner = 1 + L * S * z;
  if (inner <= 0) return NaN;
  return M * Math.pow(inner, 1 / L);
}

export function percentileOf(z: number): number {
  return zToPercentile(z);
}

export interface AnthropometryInput {
  sex: GrowthSex;
  /** age in decimal months */
  ageMonths: number;
  weightKg?: number;
  lengthCm?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
}

export interface GrowthAssessment {
  indicator: GrowthIndicator;
  z: number;
  percentile: number;
  classification?: string;
  interpretation?: string;
}

export interface AnthropometryResult {
  assessments: GrowthAssessment[];
  /** WHO 2006 nutritional-status flags */
  status: {
    stunting?: "stunted" | "severely stunted";
    wasting?: "wasted" | "severely wasted";
    underweight?: "underweight" | "severely underweight";
    overweight?: "overweight" | "obese";
    thinness?: "thinness" | "severe thinness";
  };
  bmi?: number;
  messages: string[];
  outOfRange: string[];
}

function classifyLengthHeight(z: number): { classification: string; interpretation: string } | undefined {
  if (z < -3) return { classification: "Severely stunted", interpretation: "Height-for-age < −3 SD (severe chronic malnutrition)" };
  if (z < -2) return { classification: "Stunted", interpretation: "Height-for-age < −2 SD (chronic malnutrition)" };
  return undefined;
}

function classifyWeightForAge(z: number): { classification: string; interpretation: string } | undefined {
  if (z < -3) return { classification: "Severely underweight", interpretation: "Weight-for-age < −3 SD" };
  if (z < -2) return { classification: "Underweight", interpretation: "Weight-for-age < −2 SD" };
  return undefined;
}

function classifyWasting(z: number): { classification: string; interpretation: string } | undefined {
  if (z < -3) return { classification: "Severely wasted", interpretation: "Weight-for-length/height < −3 SD (severe acute malnutrition)" };
  if (z < -2) return { classification: "Wasted", interpretation: "Weight-for-length/height < −2 SD (acute malnutrition)" };
  if (z > 3) return { classification: "Obese", interpretation: "Weight-for-length/height > +3 SD" };
  if (z > 2) return { classification: "Overweight", interpretation: "Weight-for-length/height > +2 SD" };
  return undefined;
}

function classifyBmi(z: number): { classification: string; interpretation: string } | undefined {
  if (z < -3) return { classification: "Severe thinness", interpretation: "BMI-for-age < −3 SD" };
  if (z < -2) return { classification: "Thinness", interpretation: "BMI-for-age < −2 SD" };
  if (z > 3) return { classification: "Obesity", interpretation: "BMI-for-age > +3 SD" };
  if (z > 2) return { classification: "Overweight", interpretation: "BMI-for-age > +2 SD" };
  return undefined;
}

function assess(
  indicator: GrowthIndicator,
  sex: GrowthSex,
  x: number,
  y: number,
  classifier?: (z: number) => { classification: string; interpretation: string } | undefined,
): GrowthAssessment | null {
  if (!(y > 0)) return null;
  const z = zscore(indicator, sex, x, y);
  if (Number.isNaN(z)) return null;
  const cls = classifier?.(z);
  return {
    indicator,
    z: Math.round(z * 100) / 100,
    percentile: Math.round(zToPercentile(z) * 10) / 10,
    classification: cls?.classification,
    interpretation: cls?.interpretation,
  };
}

export function assessGrowth(inp: AnthropometryInput): AnthropometryResult {
  const { sex, ageMonths, weightKg, lengthCm, heightCm, headCircumferenceCm } = inp;
  const isUnderTwo = ageMonths < 24;
  const assessments: GrowthAssessment[] = [];
  const outOfRange: string[] = [];
  const status: AnthropometryResult["status"] = {};
  const messages: string[] = [];
  let bmi: number | undefined;

  if (ageMonths < 0 || ageMonths > 60) {
    messages.push("This module uses the WHO Child Growth Standards (0–60 months). Ages outside 0–5 years are not supported yet.");
    return { assessments, status, messages, outOfRange: ["Age outside 0–60 months"] };
  }

  const push = (a: GrowthAssessment | null, label: string) => {
    if (!a) return;
    assessments.push(a);
    if (a.classification) {
      if (a.indicator === "length-height-for-age") status.stunting = a.classification.startsWith("Severe") ? "severely stunted" : "stunted";
      else if (a.indicator === "weight-for-length" || a.indicator === "weight-for-height") {
        if (a.z < -2) status.wasting = a.classification.startsWith("Severe") ? "severely wasted" : "wasted";
        else if (a.z > 2) status.overweight = a.classification === "Obese" ? "obese" : "overweight";
      } else if (a.indicator === "bmi-for-age") {
        if (a.z < -2) status.thinness = a.classification.startsWith("Severe") ? "severe thinness" : "thinness";
        else if (a.z > 2) status.overweight = a.classification === "Obesity" ? "obese" : "overweight";
      } else if (a.indicator === "weight-for-age") {
        status.underweight = a.classification.startsWith("Severe") ? "severely underweight" : "underweight";
      }
    }
    if (Number.isNaN(a.z)) outOfRange.push(label);
  };

  // Weight-for-age (0–60 months)
  push(assess("weight-for-age", sex, ageMonths, weightKg ?? NaN, classifyWeightForAge), "weight-for-age");

  // Length/height-for-age with measurement-position rule
  const lhIndicator: GrowthIndicator = isUnderTwo ? "length-for-age" : "height-for-age";
  const lhX = isUnderTwo ? lengthCm ?? NaN : heightCm ?? NaN;
  const lh = assess(lhIndicator, sex, ageMonths, lhX, classifyLengthHeight);
  if (lh) {
    assessments.push({ ...lh, indicator: "length-height-for-age" as GrowthIndicator });
    if (lh.classification) status.stunting = lh.classification.startsWith("Severe") ? "severely stunted" : "stunted";
  }
  if (isUnderTwo) messages.push("Age < 24 months: recumbent length is used (WHO standards).");
  else messages.push("Age ≥ 24 months: standing height is used (WHO standards).");

  // Weight-for-length (<24 mo) or weight-for-height (≥24 mo)
  const wlIndicator: GrowthIndicator = isUnderTwo ? "weight-for-length" : "weight-for-height";
  const wlX = isUnderTwo ? lengthCm ?? NaN : heightCm ?? NaN;
  push(assess(wlIndicator, sex, wlX, weightKg ?? NaN, classifyWasting), "weight-for-length/height");

  // BMI-for-age (computed whenever height available)
  const hCm = ageMonths < 24 ? lengthCm : heightCm;
  if (weightKg && hCm && hCm > 0) {
    bmi = weightKg / (hCm / 100) ** 2;
    const bmiA = assess("bmi-for-age", sex, ageMonths, bmi, classifyBmi);
    if (bmiA) assessments.push(bmiA);
  }

  // Head circumference (0–60 months)
  push(assess("head-circumference-for-age", sex, ageMonths, headCircumferenceCm ?? NaN), "head-circumference-for-age");

  return { assessments, status, bmi, messages, outOfRange };
}

/** Decimal age in months from a date of birth (as of `now`). */
export function ageInMonths(dob: Date, now: Date = new Date()): number {
  const ms = now.getTime() - dob.getTime();
  return ms / (30.4375 * 86400000);
}

export function ageLabel(months: number): string {
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y >= 1) return m === 0 ? `${y} y` : `${y} y ${m} mo`;
  return `${Math.round(months)} mo`;
}

export const WHO_GROWTH_INDICATOR_LABELS: Record<string, string> = {
  "weight-for-age": "Weight-for-age",
  "length-height-for-age": "Length/Height-for-age",
  "weight-for-length-height": "Weight-for-length/height",
  "bmi-for-age": "BMI-for-age",
  "head-circumference-for-age": "Head circumference-for-age",
};