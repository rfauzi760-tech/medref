import { describe, expect, it } from "vitest";
import { calculateDose, pickDoseEntry, doseToText } from "@/lib/calc/drugs";
import { DRUGS } from "@/lib/data/drugs";

function drug(slug: string) {
  const d = DRUGS.find((x) => x.slug === slug);
  if (!d) throw new Error(`missing drug ${slug}`);
  return d;
}

describe("amoxicillin pediatric dosing", () => {
  const amox = drug("amoxicillin");
  it("18 kg child → ~180 mg/dose q8h (20–40 mg/kg/day ÷ 3)", () => {
    const out = calculateDose(amox, { weightKg: 18, ageYears: 5 });
    expect(out.textOnly).toBe(false);
    // mid-range 30 mg/kg/day → 540 mg/day ÷ 3 doses
    expect(out.perDoseMg).toBeGreaterThan(170);
    expect(out.perDoseMg).toBeLessThan(190);
    expect(out.totalDailyMg).toBeGreaterThan(530);
    expect(out.totalDailyMg).toBeLessThan(550);
  });
  it("caps at maximum daily dose (max 4 g/day)", () => {
    const out = calculateDose(amox, { weightKg: 50, ageYears: 15 });
    expect(out.totalDailyMg).toBeLessThanOrEqual(4000);
  });
  it("returns text-only schema when no weight provided", () => {
    const out = calculateDose(amox, {});
    expect(out.textOnly).toBe(true);
    expect(out.notes.join(" ")).toContain("Weight not provided");
  });
});

describe("paracetamol", () => {
  const pcm = drug("paracetamol");
  it("20 kg → 250 mg/dose (mid-range 12.5 mg/kg q4-6h)", () => {
    const out = calculateDose(pcm, { weightKg: 20, ageYears: 6 });
    expect(out.perDoseMg).toBe(250);
  });
  it("warns when exceeding max daily (4 g adult cap)", () => {
    const out = calculateDose(pcm, { weightKg: 100, ageYears: 30 });
    expect(out.maxWarnings.length).toBeGreaterThan(0);
  });
});

describe("adult text dosing", () => {
  it("azithromycin adult shows text-only", () => {
    const out = calculateDose(drug("azithromycin"), { ageYears: 35 });
    expect(out.textOnly).toBe(true);
    expect(out.entry.text.length).toBeGreaterThan(0);
  });
});

describe("doseToText", () => {
  it("produces a structured summary with source", () => {
    const amox = drug("amoxicillin");
    const out = calculateDose(amox, { weightKg: 18, ageYears: 5 });
    const text = doseToText(amox, out);
    expect(text).toContain("Amoxicillin");
    expect(text).toContain("Dose per administration");
    expect(text).toContain("Source:");
  });
});

describe("pickDoseEntry", () => {
  it("picks pediatric entry for a child", () => {
    const amox = drug("amoxicillin");
    const e = pickDoseEntry(amox, { ageYears: 5 });
    expect(e?.population).toBe("pediatric");
  });
});