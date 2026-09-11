import { describe, expect, it } from "vitest";
import { runCalculator } from "@/lib/calc/calculators";
import { CALCULATORS } from "@/lib/data/calculators";

function calc(slug: string) {
  const c = CALCULATORS.find((x) => x.slug === slug);
  if (!c) throw new Error(`missing calculator ${slug}`);
  return c;
}

function valueFor(slug: string, inputs: Record<string, number | string | undefined>) {
  const res = runCalculator(calc(slug), inputs);
  return res;
}

describe("BMI", () => {
  it("computes BMI 24.2 for 70kg/170cm", () => {
    const r = valueFor("bmi", { weight: 70, height: 170 });
    const bmi = r.lines.find((l) => l.label.includes("BMI"))?.value;
    expect(bmi).toBe("24.2");
  });
  it("rejects zero height", () => {
    const r = valueFor("bmi", { weight: 70, height: 0 });
    expect(r.warnings?.length).toBeGreaterThan(0);
  });
});

describe("Anion gap", () => {
  it("AG 16 for Na 140, Cl 100, HCO3 24", () => {
    const r = valueFor("anion-gap", { sodium: 140, chloride: 100, bicarbonate: 24 });
    expect(parseFloat(r.lines[0].value)).toBe(16);
  });
  it("high AG with metabolic acidosis (Na 142, Cl 100, HCO3 12)", () => {
    const r = valueFor("anion-gap", { sodium: 142, chloride: 100, bicarbonate: 12 });
    expect(parseFloat(r.lines[0].value)).toBeGreaterThan(16);
  });
});

describe("eGFR (CKD-EPI 2021)", () => {
  it("matches reference: male 60y, Cr 1.0 → ~86", () => {
    const r = valueFor("egfr", { age: 60, sex: "male", creatinine: 1.0 });
    const val = Number(r.lines[0].value);
    expect(Math.abs(val - 86.2)).toBeLessThan(1);
  });
  it("female 30y, Cr 0.7 → ~110-112", () => {
    const r = valueFor("egfr", { age: 30, sex: "female", creatinine: 0.7 });
    const val = Number(r.lines[0].value);
    expect(val).toBeGreaterThan(105);
    expect(val).toBeLessThan(120);
  });
});

describe("Corrected calcium", () => {
  it("Ca 8.0, Alb 2.0 → corrected 9.6", () => {
    const r = valueFor("corrected-calcium", { calcium: 8.0, albumin: 2.0 });
    expect(Number(r.lines[0].value)).toBeCloseTo(9.6, 1);
  });
});

describe("MAP", () => {
  it("MAP 93 for BP 120/80", () => {
    const r = valueFor("map", { sbp: 120, dbp: 80 });
    expect(Number(r.lines[0].value)).toBe(93);
  });
});

describe("Gestational age", () => {
  it("computes GA from LMP", () => {
    const r = valueFor("ga-edd", { lmpTs: "2025-01-01" });
    expect(r.lines.length).toBeGreaterThan(0);
  });
  it("warns on future LMP", () => {
    const r = valueFor("ga-edd", { lmpTs: "2030-01-01" });
    expect(r.warnings?.length).toBeGreaterThan(0);
  });
});

describe("Fluid maintenance (Holliday-Segar)", () => {
  it("25 kg → 1600 mL/day (100+50+10)", () => {
    const r = valueFor("holliday-segar", { weight: 25 });
    const val = Number(r.lines[0].value);
    expect(val).toBe(1600);
  });
  it("10 kg → 1000 mL/day", () => {
    const r = valueFor("holliday-segar", { weight: 10 });
    expect(Number(r.lines[0].value)).toBe(1000);
  });
  it("3 kg → 300 mL/day", () => {
    const r = valueFor("holliday-segar", { weight: 3 });
    expect(Number(r.lines[0].value)).toBe(300);
  });
});

describe("Drip rate", () => {
  it("125 mL/h with 20 gtt/mL → 42 gtt/min", () => {
    const r = valueFor("drip-rate", { mlhr: 125, factor: "20" });
    expect(Number(r.lines[0].value)).toBe(42);
  });
  it("shows placeholder on zero rate", () => {
    const r = valueFor("drip-rate", { mlhr: 0, factor: "20" });
    expect(r.lines[0].value).toBe("-");
  });
});

describe("Corrected sodium", () => {
  it("Na 120, glucose 500 → corrected 126.4 (Katz) / 129.6 (Hillier)", () => {
    const r = valueFor("corrected-sodium", { sodium: 120, glucose: 500 });
    expect(Number(r.lines[0].value)).toBeCloseTo(126.4, 1);
    expect(Number(r.lines[1].value)).toBeCloseTo(129.6, 1);
  });
});
