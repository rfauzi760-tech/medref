import { describe, expect, it } from "vitest";
import { calculateRacikan, getRacikanOptions } from "@/lib/calc/racikan";
import { DRUGS_BY_SLUG } from "@/lib/data/drugs";

const drugs = DRUGS_BY_SLUG;
const base = { ageYears: 5, weightKg: 20, packets: 10, frequencyPerDay: 3 };
const paracetamolOption = getRacikanOptions(drugs.paracetamol, 5)[0];
const paracetamolIngredient = { slug: "paracetamol", doseIndex: paracetamolOption.index, preparationId: paracetamolOption.products.find((item) => item.label.includes("500"))!.id, targetMgPerKg: 10 };

describe("racikan worksheet", () => {
  it("menampilkan regimen dan sediaan Asam Mefenamat untuk dosis resep manual", () => {
    const options = getRacikanOptions(drugs["asam-mefenamat"], 15);
    expect(options.length).toBeGreaterThan(0);
    expect(options.some((option) => option.manualDose && option.products.some((product) => product.label.includes("500 mg")))).toBe(true);
  });

  it("menghitung Asam Mefenamat dari dosis per bungkus yang ditetapkan", () => {
    const option = getRacikanOptions(drugs["asam-mefenamat"], 15).find((item) => item.manualDose)!;
    const product = option.products.find((item) => item.label.includes("500 mg"))!;
    const result = calculateRacikan(drugs, {
      ageYears: 15,
      weightKg: 50,
      packets: 10,
      frequencyPerDay: 3,
      ingredients: [{ slug: "asam-mefenamat", doseIndex: option.index, preparationId: product.id, prescribedMg: 250 }],
    });
    expect(result.status, JSON.stringify(result)).toBe("ok");
    if (result.status === "ok") expect(result.ingredients[0].productUnits).toBe(5);
  });

  it("calculates an exact oral solid amount without rounding tablets", () => {
    const result = calculateRacikan(drugs, {
      ...base,
      ingredients: [paracetamolIngredient],
    });
    expect(result.status, JSON.stringify(result)).toBe("ok");
    if (result.status === "ok") {
      expect(result.ingredients[0].mgPerPacket).toBe(200);
      expect(result.ingredients[0].totalMg).toBe(2000);
      expect(result.ingredients[0].productUnits).toBe(4);
      expect(result.warnings.join(" ")).toMatch(/kompatibilitas/i);
    }
  });
  it("blocks a target above the verified range", () => {
    const result = calculateRacikan(drugs, { ...base, ingredients: [{ ...paracetamolIngredient, targetMgPerKg: 20 }] });
    expect(result.status).toBe("blocked");
  });
  it("blocks missing or invalid patient data", () => {
    expect(calculateRacikan(drugs, { ...base, ageYears: -1, ingredients: [] }).status).toBe("blocked");
    expect(calculateRacikan(drugs, { ...base, weightKg: 0, ingredients: [] }).status).toBe("blocked");
  });
  it("blocks an injectable preparation", () => {
    const result = calculateRacikan(drugs, { ...base, ingredients: [{ ...paracetamolIngredient, preparationId: "10-mg-1-ml" }] });
    expect(result.status).toBe("blocked");
  });
  it("blocks incomplete ingredients and never gives a combined formula", () => {
    const result = calculateRacikan(drugs, { ...base, ingredients: [
      paracetamolIngredient,
      { slug: "gentamisin", doseIndex: 0, preparationId: "500-mg-1-tablet", targetMgPerKg: 1 },
    ] });
    expect(result.status).toBe("blocked");
  });
  it("blocks duplicate active ingredients", () => {
    expect(calculateRacikan(drugs, { ...base, ingredients: [paracetamolIngredient, paracetamolIngredient] }).status).toBe("blocked");
  });
});
