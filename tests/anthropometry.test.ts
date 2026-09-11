import { describe, expect, it } from "vitest";
import { assessGrowth, zscore, valueAtZ, lookupLMS, ageInMonths } from "@/lib/calc/anthropometry";

describe("WHO LMS lookup", () => {
  it("matches published median for boys weight-for-age at 12 months (9.648 kg)", () => {
    const lms = lookupLMS("weight-for-age", "male", 12);
    expect(lms).not.toBeNull();
    expect(lms!.M).toBeCloseTo(9.648, 2);
  });
  it("matches published median for girls BMI at 24 months (15.69, 2–5y table)", () => {
    const lms = lookupLMS("bmi-for-age", "female", 24);
    expect(lms!.M).toBeCloseTo(15.69, 1);
  });
  it("matches published median for boys height at 24 months (87.1)", () => {
    const lms = lookupLMS("height-for-age", "male", 24);
    expect(lms!.M).toBeCloseTo(87.1, 1);
  });
});

describe("z-score at median", () => {
  it("returns z≈0 at the median", () => {
    const z = zscore("weight-for-age", "male", 12, 9.648);
    expect(z).toBeCloseTo(0, 1);
  });
  it("returns z≈-2 at the published -2 SD weight (boys weight-for-age 12 mo ≈ 7.7 kg)", () => {
    const z = zscore("weight-for-age", "male", 12, 7.7);
    expect(z).toBeCloseTo(-2, 0.2);
  });
});

describe("valueAtZ round trip", () => {
  it("recovers the measurement from its z-score", () => {
    const v = valueAtZ("weight-for-age", "male", 24, -1.5);
    const z = zscore("weight-for-age", "male", 24, v);
    expect(z).toBeCloseTo(-1.5, 3);
  });
});

describe("assessGrowth", () => {
  it("classifies a stunted 3-year-old (height-for-age z < -2)", () => {
    const r = assessGrowth({ sex: "male", ageMonths: 36, weightKg: 12, heightCm: 82 });
    const lh = r.assessments.find((a) => a.indicator === "length-height-for-age");
    expect(lh).toBeDefined();
    expect(lh!.z).toBeLessThan(-2);
    expect(r.status.stunting).toBeDefined();
  });

  it("flags a normal child with no nutritional-status flags", () => {
    const r = assessGrowth({ sex: "female", ageMonths: 12, weightKg: 9.5, lengthCm: 75, headCircumferenceCm: 46 });
    expect(r.status.stunting).toBeUndefined();
    expect(r.status.wasting).toBeUndefined();
    expect(r.status.underweight).toBeUndefined();
    expect(r.assessments.length).toBeGreaterThanOrEqual(3);
  });

  it("uses length under 24 months and height at/over 24 months", () => {
    const under = assessGrowth({ sex: "male", ageMonths: 23, weightKg: 10, lengthCm: 80 });
    const over = assessGrowth({ sex: "male", ageMonths: 24, weightKg: 10, heightCm: 85 });
    expect(under.messages.join(" ")).toContain("recumbent length");
    expect(over.messages.join(" ")).toContain("standing height");
  });

  it("rejects age outside 0-60 months", () => {
    const r = assessGrowth({ sex: "male", ageMonths: 72, weightKg: 20, heightCm: 110 });
    expect(r.outOfRange.length).toBeGreaterThan(0);
  });

  it("computes BMI when both weight and height available", () => {
    const r = assessGrowth({ sex: "male", ageMonths: 48, weightKg: 20, heightCm: 110 });
    expect(r.bmi).toBeCloseTo(16.53, 1);
    expect(r.assessments.some((a) => a.indicator === "bmi-for-age")).toBe(true);
  });
});

describe("ageInMonths", () => {
  it("computes decimal age from DOB", () => {
    const dob = new Date("2024-01-15");
    const now = new Date("2025-01-15");
    expect(ageInMonths(dob, now)).toBeCloseTo(12, 0.1);
  });
});