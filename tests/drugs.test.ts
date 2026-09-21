import { describe, expect, it } from "vitest";
import {
  areDoseUnitsCompatible,
  calculateDose,
  convertPrescribedDose,
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

describe("konversi dosis yang sudah ditentukan", () => {
  it("mengubah dosis mg menjadi volume meski regimen hanya berupa teks", () => {
    const preparation = parseDosePreparations(["Sirup 125 mg/5 mL"])[0];
    expect(convertPrescribedDose(250, "mg", preparation)).toMatchObject({
      carrierAmount: 10,
      text: "10 mL (125 mg/5 mL)",
    });
  });

  it("menolak satuan yang tidak kompatibel", () => {
    const preparation = parseDosePreparations(["Larutan 100 units/mL"])[0];
    expect(convertPrescribedDose(10, "mg", preparation)).toBeUndefined();
  });
});

describe("amoxicillin pediatric dosing", () => {
  const amox = drug("amoxicillin");
  it("requires age before calculating a pediatric regimen", () => {
    const pediatricIndex = amox.doses.findIndex((dose) => dose.population === "pediatric");
    const out = calculateDose(amox, { weightKg: 18, population: "pediatric", doseIndex: pediatricIndex });
    expect(out.textOnly).toBe(true);
    expect(out.notes.join(" ")).toContain("usia");
  });
  it("uses the canonical 25–50 mg/kg/day range for an 18 kg child", () => {
    const out = calculateDose(amox, { weightKg: 18, ageYears: 5 });
    expect(out.textOnly).toBe(false);
    expect(out.perDoseMg).toBeUndefined();
    expect(out.totalDailyMin).toBe(450);
    expect(out.totalDailyMax).toBe(900);
  });
  it("does not inherit an unrelated adult maximum into the child regimen", () => {
    const out = calculateDose(amox, { weightKg: 50, ageYears: 15 });
    expect(out.totalDailyMin).toBe(1250);
    expect(out.totalDailyMax).toBe(2500);
    expect(out.entry.weightBased?.maxDailyMg).toBeUndefined();
  });
  it("returns text-only schema when no weight provided", () => {
    const out = calculateDose(amox, { ageYears: 5 });
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
  it("does not apply a pediatric mg/kg formula to the adult fixed-dose instruction", () => {
    const out = calculateDose(pcm, { weightKg: 100, ageYears: 30 });
    expect(out.textOnly).toBe(true);
    expect(out.perDoseMg).toBeUndefined();
    expect(pcm.doses.find((entry) => entry.population === "adult" && entry.route === "IV")?.weightBased).toBeUndefined();
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
  it("does not assume an adult regimen from weight alone when age is missing", () => {
    const item = drug("asam-valproat");
    const out = calculateDose(item, { weightKg: 20 });
    expect(out.textOnly).toBe(true);
    expect(out.notes.join(" ")).toContain("usia");
  });
  it("azithromycin adult shows text-only", () => {
    const out = calculateDose(drug("azithromycin"), { ageYears: 35 });
    expect(out.textOnly).toBe(true);
    expect(out.entry.text.length).toBeGreaterThan(0);
  });
});

describe("doseToText", () => {
  it("includes the actual instruction for a text-only regimen", () => {
    const item = drug("nac");
    const index = item.doses.findIndex((entry) => entry.population === "adult" && entry.route === "Parasetamol");
    const out = calculateDose(item, { ageYears: 30, doseIndex: index, weightKg: 60 });
    expect(out.textOnly).toBe(true);
    const copied = doseToText(item, out);
    expect(copied).toContain("Keracunan parasetamol");
    expect(copied).not.toContain("dosis berbasis berat badan");
  });
  it("produces a structured summary with source", () => {
    const amox = drug("amoxicillin");
    const out = calculateDose(amox, { weightKg: 18, ageYears: 5 });
    const text = doseToText(amox, out);
    expect(text).toContain("Amoksisilin");
    expect(text).toContain("Total harian");
    expect(text).toContain("Sumber:");
  });
  it("uses the selected regimen source when available", () => {
    const item = drug("amoxicillin");
    const source = { org: "DailyMed", title: "Regimen khusus", year: 2026, url: "https://dailymed.nlm.nih.gov" };
    const fixture: Drug = { ...item, doses: [{ ...item.doses[0], source }] };
    const result = calculateDose(fixture, { doseIndex: 0 });
    expect(doseToText(fixture, result)).toContain("DailyMed, Regimen khusus (2026)");
    expect(doseToText(fixture, result)).not.toContain(`Sumber: ${item.source.org}, ${item.source.title}`);
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

  it("does not calculate an adult regimen for a child even when an index is passed directly", () => {
    const fixture: Drug = {
      ...drug("amoxicillin"),
      doses: [{ population: "adult", route: "Oral", text: "20 mg/kg/dosis", weightBased: { min: 20, per: "dose" } }],
    };
    const result = calculateDose(fixture, { weightKg: 10, ageYears: 5, doseIndex: 0, population: "adult" });
    expect(result.textOnly).toBe(true);
    expect(result.perDoseMg).toBeUndefined();
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

describe("canonical regimen safety", () => {
  it("does not inherit a pediatric weight formula into fixed adult instructions", () => {
    for (const slug of ["paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "ondansetron"]) {
      const item = DRUGS.find((candidate) => candidate.slug === slug)!;
      const adult = item.doses.find((entry) => entry.population === "adult")!;
      expect(adult.weightBased, slug).toBeUndefined();
    }
  });

  it("keeps the first route unless the user explicitly chooses another regimen", () => {
    const fixture: Drug = {
      ...drug("paracetamol"),
      doses: [
        { population: "adult", route: "Oral", text: "500 mg tiap 6 jam" },
        { population: "adult", route: "IV", text: "15 mg/kg IV", weightBased: { min: 15, per: "dose" } },
      ],
    };
    expect(calculateDose(fixture, { ageYears: 35, weightKg: 60 }).entry.route).toBe("Oral");
    expect(calculateDose(fixture, { ageYears: 35, weightKg: 60, doseIndex: 1 }).entry.route).toBe("IV");
  });

  it("does not convert a weight-band or INR-titrated instruction as mg/kg", () => {
    for (const slug of ["oseltamivir", "warfarin"]) {
      const item = DRUGS.find((candidate) => candidate.slug === slug)!;
      const pediatric = item.doses.find((entry) => entry.population === "pediatric")!;
      expect(pediatric.weightBased, slug).toBeUndefined();
    }
  });

  it("does not treat maintenance frequency or the final NAC phase as a loading dose", () => {
    const phenytoin = drug("fenitoin").doses.find((entry) => entry.population === "adult")!;
    const antidote = drug("nac").doses.find((entry) => entry.population === "adult" && entry.route === "Parasetamol")!;
    expect(phenytoin.weightBased?.frequencyPerDay).toBeUndefined();
    expect(antidote.weightBased).toBeUndefined();
  });
});

describe("fixed age-band dose ranges", () => {
  it("converts both endpoints of a verified fixed-dose range", () => {
    const fixture: Drug = {
      ...drug("guaifenesin"),
      doses: [{ population: "pediatric", route: "Oral", text: "50–100 mg per pemberian", fixedDoseMg: 50, fixedDoseMaxMg: 100 }],
    };
    const preparation = { id: "syrup", label: "100 mg/5 mL", drugAmount: 100, drugUnit: "mg" as const,
      carrierAmount: 5, carrierUnit: "mL" as const, administration: "oral" as const };
    const out = calculateDose(fixture, { ageYears: 4, preparation });
    expect(out.perDoseMin).toBe(50);
    expect(out.perDoseMax).toBe(100);
    expect(out.preparationPerDoseMin).toBe(2.5);
    expect(out.preparationPerDoseMax).toBe(5);
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
  it("tidak memblokir sediaan ketika kolom rute berisi batas usia lama", () => {
    const tablet = parseDosePreparations(["Tablet 500 mg"])[0];
    expect(preparationMatchesRoute(tablet, "> 14 th")).toBe(true);
  });

  it("does not offer oral tablets for an IV or IM regimen", () => {
    const preparations = parseDosePreparations(["Ampul 30 mg/mL", "Tablet 10 mg"]);
    const ampoule = preparations.find((item) => item.carrierUnit === "mL")!;
    const tablet = preparations.find((item) => item.carrierUnit === "tablet")!;
    expect(preparationMatchesRoute(ampoule, "IV/IM")).toBe(true);
    expect(preparationMatchesRoute(tablet, "IV/IM")).toBe(false);
    expect(preparationMatchesRoute(tablet, "Oral")).toBe(true);
  });

  it("never offers oral products for nebulization and recognizes inhalation solution", () => {
    const preparations = parseDosePreparations(["Respules nebulisasi 2,5 mg/2,5 mL", "Tablet 2 mg"]);
    const respule = preparations.find((item) => item.carrierUnit === "mL")!;
    const tablet = preparations.find((item) => item.carrierUnit === "tablet")!;
    expect(respule.administration).toBe("inhalation");
    expect(preparationMatchesRoute(respule, "Nebulisasi")).toBe(true);
    expect(preparationMatchesRoute(tablet, "Nebulisasi")).toBe(false);
    expect(preparationMatchesRoute(respule, "Oral")).toBe(false);
  });

  it("does not calculate a preparation volume when its route is incompatible", () => {
    const drug: Drug = {
      ...DRUGS.find((item) => item.slug === "salbutamol")!,
      doses: [{
        population: "pediatric", route: "Nebulisasi", text: "0,15 mg/kg per dosis",
        weightBased: { min: 0.15, per: "dose", maxPerDoseMg: 2.5 },
      }],
    };
    const tablet = parseDosePreparations(["Tablet 2 mg"])[0];
    const result = calculateDose(drug, { weightKg: 10, ageYears: 5, preparation: tablet });
    expect(result.perDoseMg).toBeCloseTo(1.5);
    expect(result.preparationText).toBeUndefined();
  });

  it("keeps 1:1000 adrenaline ampoules from being inferred as an IV preparation", () => {
    expect(parseDosePreparations(["Ampul epinefrin 1 mg/mL (1:1000)"])).toEqual([]);
    const imPreparation = {
      id: "epinefrin-im", label: "Epinefrin 1 mg/mL IM", drugAmount: 1,
      drugUnit: "mg" as const, carrierAmount: 1, carrierUnit: "mL" as const,
      administration: "parenteral" as const, routes: ["IM"],
    };
    expect(preparationMatchesRoute(imPreparation, "IM")).toBe(true);
    expect(preparationMatchesRoute(imPreparation, "IV")).toBe(false);
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
