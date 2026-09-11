import { describe, expect, it } from "vitest";
import { round, fmt, clamp, num, kgToLb, lbToKg, cmToIn, inToCm, zToPercentile, percentileToZ, glucoseMgdlToMmol, crMgdlToUmoll } from "@/lib/calc/units";

describe("rounding and formatting", () => {
  it("rounds to digits", () => {
    expect(round(3.14159, 2)).toBe(3.14);
    expect(round(2.5, 0)).toBe(3);
  });
  it("formats with a dash for non-finite", () => {
    expect(fmt(NaN)).toBe("-");
    expect(fmt(Infinity)).toBe("-");
  });
  it("clamps into range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe("number parsing", () => {
  it("parses strings and comma decimals", () => {
    expect(num("3.5")).toBe(3.5);
    expect(num("3,5")).toBe(3.5);
  });
  it("returns NaN for invalid input", () => {
    expect(Number.isNaN(num(""))).toBe(true);
    expect(Number.isNaN(num("abc"))).toBe(true);
    expect(Number.isNaN(num(undefined))).toBe(true);
  });
});

describe("unit conversions", () => {
  it("kg ↔ lb", () => {
    expect(kgToLb(1)).toBeCloseTo(2.20462, 4);
    expect(lbToKg(2.20462)).toBeCloseTo(1, 3);
  });
  it("cm ↔ in", () => {
    expect(cmToIn(2.54)).toBeCloseTo(1, 4);
    expect(inToCm(1)).toBeCloseTo(2.54, 4);
  });
  it("glucose mg/dL → mmol/L (100 → 5.55)", () => {
    expect(glucoseMgdlToMmol(100)).toBeCloseTo(5.55, 1);
  });
  it("creatinine mg/dL → µmol/L (1.0 → 88.4)", () => {
    expect(crMgdlToUmoll(1.0)).toBeCloseTo(88.4, 1);
  });
});

describe("normal distribution helpers", () => {
  it("z=0 → percentile 50", () => {
    expect(zToPercentile(0)).toBeCloseTo(50, 3);
  });
  it("z=1.96 → ~97.5th percentile", () => {
    expect(zToPercentile(1.96)).toBeCloseTo(97.5, 0.5);
  });
  it("round-trips z → pct → z", () => {
    for (const z of [-2.5, -1, 0, 1, 2.5]) {
      expect(percentileToZ(zToPercentile(z))).toBeCloseTo(z, 2);
    }
  });
});
