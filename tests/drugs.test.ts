import { describe, expect, it } from "vitest";
import {
  calculateDose,
  pickDoseEntry,
  doseToText,
  getDoseOptions,
  parseDosePreparations,
  resolveDosePopulation,
} from "@/lib/calc/drugs";
import { DRUGS } from "@/lib/data/drugs";
import type { Drug } from "@/lib/types";

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
    expect(out.notes.join(" ")).toContain("Berat badan belum diisi");
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

  it("preserves the pediatric dose range and converts it to syrup volume", () => {
    const pcm = drug("paracetamol");
    const preparation = parseDosePreparations(pcm.preparations ?? []).find((item) => item.label.includes("120 mg/5 mL"));
    expect(preparation).toBeDefined();

    const out = calculateDose(pcm, { weightKg: 20, ageYears: 6, preparation });
    expect(out.perDoseMin).toBe(200);
    expect(out.perDoseMax).toBe(300);
    expect(out.preparationPerDoseMin).toBeCloseTo(8.33, 2);
    expect(out.preparationPerDoseMax).toBe(12.5);
    expect(out.preparationText).toContain("mL per pemberian");
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
    expect(text).toContain("Amoksisilin");
    expect(text).toContain("Dosis per pemberian");
    expect(text).toContain("Sumber:");
  });
});

describe("pickDoseEntry", () => {
  it("keeps pediatric mode when a child age becomes available", () => {
    expect(resolveDosePopulation({ ageYears: 5, pediatricMode: true })).toBe("pediatric");
    expect(resolveDosePopulation({ ageYears: 0.2, pediatricMode: true })).toBe("pediatric");
    expect(resolveDosePopulation({ ageYears: 20 / 365.25, pediatricMode: true })).toBe("neonatal");
  });

  it("picks pediatric entry for a child", () => {
    const amox = drug("amoxicillin");
    const e = pickDoseEntry(amox, { ageYears: 5 });
    expect(e?.population).toBe("pediatric");
  });

  it("picks a neonatal entry before a pediatric entry during the first 28 days", () => {
    const fixture: Drug = {
      ...drug("amoxicillin"),
      doses: [
        { population: "adult", route: "Oral", indication: "Terapi dewasa", text: "Dosis dewasa" },
        { population: "pediatric", route: "Oral", indication: "Terapi anak", text: "Dosis anak" },
        { population: "neonatal", route: "IV", indication: "Sepsis neonatus", text: "Dosis neonatus" },
      ],
    };
    const e = pickDoseEntry(fixture, { ageYears: 20 / 365.25 });
    expect(e?.population).toBe("neonatal");
  });

  it("allows an all-ages dose entry for a neonate", () => {
    const fixture: Drug = {
      ...drug("paracetamol"),
      doses: [{ population: "all", route: "Oral", indication: "Demam", text: "Dosis semua usia" }],
    };
    const e = pickDoseEntry(fixture, { ageYears: 20 / 365.25 });
    expect(e?.population).toBe("all");
  });

  it("uses the exact selected regimen", () => {
    const fixture: Drug = {
      ...drug("amoxicillin"),
      doses: [
        { population: "adult", route: "Oral", indication: "Terapi dewasa", text: "Dosis dewasa" },
        { population: "pediatric", route: "Oral", indication: "Terapi anak", text: "Dosis anak" },
        { population: "neonatal", route: "IV", indication: "Sepsis neonatus", text: "Dosis neonatus" },
      ],
    };
    const out = calculateDose(fixture, { weightKg: 8, ageYears: 20 / 365.25, doseIndex: 2 });
    expect(out.entry.population).toBe("neonatal");
    expect(out.entry.indication).toBe("Sepsis neonatus");
  });

  it("only offers dose entries compatible with the selected population", () => {
    const fixture: Drug = {
      ...drug("amoxicillin"),
      doses: [
        { population: "adult", route: "Oral", indication: "Terapi dewasa", text: "Dosis dewasa" },
        { population: "pediatric", route: "Oral", indication: "Terapi standar", text: "Dosis anak" },
        { population: "neonatal", route: "IV", indication: "Sepsis neonatus", text: "Dosis neonatus" },
      ],
    };
    const options = getDoseOptions(fixture, "pediatric");
    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ index: 1, population: "pediatric" });
    expect(options[0].label).toContain("Terapi standar");
    expect(options[0].label).toContain("Oral");
  });
});

describe("parseDosePreparations", () => {
  it("extracts unambiguous liquid concentrations", () => {
    expect(parseDosePreparations(["Syrup 120 mg/5 mL, 250 mg/5 mL"])).toEqual([
      { id: "120-mg-5-ml", label: "120 mg/5 mL", drugAmount: 120, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL" },
      { id: "250-mg-5-ml", label: "250 mg/5 mL", drugAmount: 250, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL" },
    ]);
  });

  it("does not convert ambiguous combination strengths", () => {
    expect(parseDosePreparations(["Syrup 156.25 mg/5 mL (125/31.25)"])).toEqual([]);
  });

  it("normalizes IU concentrations to units", () => {
    expect(parseDosePreparations(["Larutan 100 IU/mL"])[0]).toMatchObject({ drugUnit: "units", carrierAmount: 1 });
  });
});
