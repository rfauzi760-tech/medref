import { describe, expect, it } from "vitest";
import {
  areDoseUnitsCompatible,
  calculateDose,
  pickDoseEntry,
  doseToText,
  getDoseOptions,
  parseDosePreparations,
  parseWeightBasedDose,
  preparationMatchesRoute,
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
  it("uses the canonical 25–50 mg/kg/day range for an 18 kg child", () => {
    const out = calculateDose(amox, { weightKg: 18, ageYears: 5 });
    expect(out.textOnly).toBe(false);
    expect(out.perDoseMg).toBeUndefined();
    expect(out.totalDailyMin).toBe(450);
    expect(out.totalDailyMax).toBe(900);
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
    expect(text).toContain("Total harian");
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
      { id: "120-mg-5-ml", label: "120 mg/5 mL", drugAmount: 120, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
      { id: "250-mg-5-ml", label: "250 mg/5 mL", drugAmount: 250, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
    ]);
  });

  it("does not convert ambiguous combination strengths", () => {
    expect(parseDosePreparations(["Syrup 156.25 mg/5 mL (125/31.25)"])).toEqual([]);
  });

  it("normalizes IU concentrations to units", () => {
    expect(parseDosePreparations(["Larutan 100 IU/mL"])[0]).toMatchObject({ drugUnit: "units", carrierAmount: 1 });
  });

  it("extracts alternative liquid strengths that share one carrier volume", () => {
    expect(parseDosePreparations(["Sirup kering 125/250 mg per 5 mL"])).toEqual([
      { id: "125-mg-5-ml", label: "125 mg/5 mL", drugAmount: 125, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
      { id: "250-mg-5-ml", label: "250 mg/5 mL", drugAmount: 250, drugUnit: "mg", carrierAmount: 5, carrierUnit: "mL", administration: "oral" },
    ]);
  });

  it("extracts solid single-ingredient strengths", () => {
    expect(parseDosePreparations(["Tablet 200/400 mg", "Kapsul 100 mg", "Supositoria 125/250 mg"])).toEqual([
      { id: "200-mg-1-tablet", label: "200 mg/tablet", drugAmount: 200, drugUnit: "mg", carrierAmount: 1, carrierUnit: "tablet", administration: "oral" },
      { id: "400-mg-1-tablet", label: "400 mg/tablet", drugAmount: 400, drugUnit: "mg", carrierAmount: 1, carrierUnit: "tablet", administration: "oral" },
      { id: "100-mg-1-kapsul", label: "100 mg/kapsul", drugAmount: 100, drugUnit: "mg", carrierAmount: 1, carrierUnit: "kapsul", administration: "oral" },
      { id: "125-mg-1-suppositoria", label: "125 mg/suppositoria", drugAmount: 125, drugUnit: "mg", carrierAmount: 1, carrierUnit: "suppositoria", administration: "rectal" },
      { id: "250-mg-1-suppositoria", label: "250 mg/suppositoria", drugAmount: 250, drugUnit: "mg", carrierAmount: 1, carrierUnit: "suppositoria", administration: "rectal" },
    ]);
  });

  it("still rejects multi-ingredient strengths", () => {
    expect(parseDosePreparations(["Tablet 500/125 mg & 875/125 mg"])).toEqual([]);
  });
});

describe("dose unit compatibility", () => {
  it("allows conversion between mass units but not between mass and activity units", () => {
    expect(areDoseUnitsCompatible("g", "mg")).toBe(true);
    expect(areDoseUnitsCompatible("mcg", "mg")).toBe(true);
    expect(areDoseUnitsCompatible("units", "mg")).toBe(false);
  });
});

describe("preparation route compatibility", () => {
  it("does not offer oral tablets for an IV or IM regimen", () => {
    const preparations = parseDosePreparations(["Ampul 30 mg/mL", "Tablet 10 mg"]);
    const ampoule = preparations.find((item) => item.carrierUnit === "mL")!;
    const tablet = preparations.find((item) => item.carrierUnit === "tablet")!;
    expect(preparationMatchesRoute(ampoule, "IV/IM")).toBe(true);
    expect(preparationMatchesRoute(tablet, "IV/IM")).toBe(false);
    expect(preparationMatchesRoute(tablet, "Oral")).toBe(true);
  });
});

describe("parseWeightBasedDose", () => {
  it("parses Indonesian decimal ranges, interval, and maximum per dose", () => {
    expect(parseWeightBasedDose("IV/IM: 0,5-1 mg/kg/dosis tiap 6 jam (maks 30 mg/dosis)")).toMatchObject({
      min: 0.5,
      max: 1,
      per: "dose",
      frequencyPerDay: 4,
      maxPerDoseMg: 30,
      doseUnit: "mg",
    });
  });

  it("parses daily dosing and divided frequency", () => {
    expect(parseWeightBasedDose("Oral: 30 mg/kg/hari terbagi tiap 12 jam")).toMatchObject({
      min: 30,
      max: 30,
      per: "day",
      frequencyPerDay: 2,
      doseUnit: "mg",
    });
  });

  it("does not turn infusion rates into bolus doses", () => {
    expect(parseWeightBasedDose("Infus 0,05-1 mcg/kg/menit")).toBeUndefined();
  });

  it("does not treat a maximum-only statement as the recommended dose", () => {
    expect(parseWeightBasedDose("Dosis maksimum anak 0,2 mg/kg/hari")).toBeUndefined();
  });
});

describe("canonical pediatric dose conversion", () => {
  it("calculates a previously text-only ketorolac dose and ampoule volume", () => {
    const ketorolac = drug("ketorolak");
    const preparation = parseDosePreparations(ketorolac.preparations ?? []).find((item) => item.label === "30 mg/1 mL");
    expect(preparation).toBeDefined();

    const out = calculateDose(ketorolac, { weightKg: 20, ageYears: 8, preparation });
    expect(out.textOnly).toBe(false);
    expect(out.perDoseMin).toBe(10);
    expect(out.perDoseMax).toBe(10);
    expect(out.preparationPerDoseMin).toBeCloseTo(1 / 3, 2);
    expect(out.preparationPerDoseMax).toBeCloseTo(1 / 3, 2);
  });

  it("uses the visible canonical amoxicillin range instead of stale legacy values", () => {
    const amoxicillin = drug("amoxicillin");
    const out = calculateDose(amoxicillin, { weightKg: 10, ageYears: 5 });
    expect(out.totalDailyMin).toBe(250);
    expect(out.totalDailyMax).toBe(500);
  });

  it("converts daily doses even when the source does not specify an exact division frequency", () => {
    const fixture: Drug = {
      ...drug("amoxicillin"),
      doses: [{
        population: "pediatric",
        route: "Oral",
        text: "1 g/kg/hari",
        weightBased: { min: 1, max: 1, per: "day", doseUnit: "g" },
      }],
    };
    const preparation = parseDosePreparations(["Tablet 500 mg"])[0];
    const out = calculateDose(fixture, { weightKg: 1, ageYears: 5, preparation });
    expect(out.preparationText).toContain("2 tablet per hari");
  });
});
