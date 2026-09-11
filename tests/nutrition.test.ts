import { describe, expect, it } from "vitest";
import { nutrientsFor, addTotals, generateMealPlan, estimateEnergyRequirement, formatTotalsLine } from "@/lib/calc/nutrition";
import { foods } from "@/lib/data/foods";

describe("nutrientsFor", () => {
  const banana = foods.find((f) => f.id === "banana")!;
  it("scales per-100g values linearly", () => {
    const t = nutrientsFor(banana, 100);
    expect(t.kcal).toBeCloseTo(banana.kcal);
    expect(t.protein).toBeCloseTo(banana.protein);
  });
  it("half a banana (60g) gives half the calories", () => {
    const t = nutrientsFor(banana, 60);
    expect(t.kcal).toBeCloseTo(banana.kcal * 0.6, 5);
  });
});

describe("addTotals", () => {
  it("sums nutrients", () => {
    const t = addTotals(nutrientsFor(foods[0], 100), nutrientsFor(foods[1], 100));
    expect(t.kcal).toBeGreaterThan(foods[0].kcal);
  });
});

describe("generateMealPlan", () => {
  it("produces a plan with all three meals and nonzero calories", () => {
    const plan = generateMealPlan(foods, { kcal: 2000, proteinG: 70 });
    expect(plan.meals.length).toBe(3);
    expect(plan.meals.every((m) => m.items.length > 0)).toBe(true);
    expect(plan.totals.kcal).toBeGreaterThan(1200);
  });
  it("is deterministic for the same seed", () => {
    const a = generateMealPlan(foods, { kcal: 1800, proteinG: 60, seed: 3 });
    const b = generateMealPlan(foods, { kcal: 1800, proteinG: 60, seed: 3 });
    expect(a.meals[0].items.map((i) => i.food.id)).toEqual(b.meals[0].items.map((i) => i.food.id));
  });
  it("respects category exclusions", () => {
    const plan = generateMealPlan(foods, { kcal: 1500, proteinG: 60, excludeCategories: ["Rice & staples"] });
    const ids = new Set(plan.meals.flatMap((m) => m.items.map((i) => i.food.id)));
    for (const id of ids) {
      const f = foods.find((x) => x.id === id)!;
      expect(f.category).not.toBe("Rice & staples");
    }
  });
  it("does not exceed the calorie target", () => {
    const plan = generateMealPlan(foods, { kcal: 2000, proteinG: 70 });
    expect(plan.totals.kcal).toBeLessThanOrEqual(2000);
  });
});

describe("estimateEnergyRequirement", () => {
  it("Mifflin-St Jeor with light activity for a 70kg/170cm/30y male", () => {
    const r = estimateEnergyRequirement({ sex: "male", weightKg: 70, heightCm: 170, ageYears: 30, activity: "light" });
    // BMR = 10·70 + 6.25·170 − 5·30 + 5 = 1617.5; ×1.375 ≈ 2224
    expect(r.kcal).toBeCloseTo(2224, 0);
  });
  it("protein target scales with weight", () => {
    const a = estimateEnergyRequirement({ sex: "female", weightKg: 50, heightCm: 160, ageYears: 40, activity: "sedentary" });
    const b = estimateEnergyRequirement({ sex: "female", weightKg: 70, heightCm: 160, ageYears: 40, activity: "sedentary" });
    expect(b.proteinG).toBeGreaterThan(a.proteinG);
  });
});

describe("formatTotalsLine", () => {
  it("formats a totals line", () => {
    const t = nutrientsFor(foods[0], 150);
    expect(formatTotalsLine(t)).toContain("kcal");
  });
});