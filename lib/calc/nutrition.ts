import type { FoodItem } from "@/lib/types";
import { clamp, fmt, round } from "@/lib/calc/units";

/**
 * Meal-planning engine. All nutrient values come from the structured food
 * database - no LLM-invented numbers. Pure functions, unit-tested.
 */

export interface NutrientTotals {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  potassium: number;
}

export function emptyTotals(): NutrientTotals {
  return { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, potassium: 0 };
}

/** nutrients for a given amount in grams */
export function nutrientsFor(food: FoodItem, grams: number): NutrientTotals {
  const f = grams / 100;
  return {
    kcal: food.kcal * f,
    protein: food.protein * f,
    carbs: food.carbs * f,
    fat: food.fat * f,
    fiber: (food.fiber ?? 0) * f,
    sodium: (food.sodium ?? 0) * f,
    potassium: (food.potassium ?? 0) * f,
  };
}

export function addTotals(a: NutrientTotals, b: NutrientTotals): NutrientTotals {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    fiber: a.fiber + b.fiber,
    sodium: a.sodium + b.sodium,
    potassium: a.potassium + b.potassium,
  };
}

export interface MealPlanItem {
  food: FoodItem;
  grams: number;
  totals: NutrientTotals;
}

export interface MealPlan {
  meals: { name: string; items: MealPlanItem[]; totals: NutrientTotals }[];
  totals: NutrientTotals;
  /** how close protein target was met (0-1) */
  proteinMet: number;
  kcalMet: number;
}

export interface MealPlanTarget {
  kcal: number;
  proteinG: number;
  /** dietary restrictions: food categories to exclude */
  excludeCategories?: string[];
  /** clinical considerations: food ids to exclude */
  excludeFoodIds?: string[];
  meals?: { name: string; kcalShare: number }[];
  /** seed for deterministic variation */
  seed?: number;
}

const DEFAULT_MEALS = [
  { name: "Sarapan", kcalShare: 0.3 },
  { name: "Makan siang", kcalShare: 0.35 },
  { name: "Makan malam", kcalShare: 0.35 },
];

const CATEGORY_ROLE: Record<string, { share: number; filter: string[] }> = {
  staple: { share: 0.35, filter: ["Makanan Pokok"] },
  protein: { share: 0.28, filter: ["Lauk Hewani", "Lauk Nabati"] },
  vegetable: { share: 0.17, filter: ["Sayur"] },
  fruit: { share: 0.12, filter: ["Buah"] },
  other: { share: 0.08, filter: ["Minuman", "Bahan & Bumbu", "Kudapan & Jajanan", "Hidangan Indonesia"] },
};

/**
 * Deterministically generate a meal plan: distribute the calorie target across
 * meals, then per meal across food roles, choosing database foods (seeded
 * rotation for variety) and scaling portions to hit calorie goals.
 */
export function generateMealPlan(foods: FoodItem[], target: MealPlanTarget): MealPlan {
  const seed = target.seed ?? 1;
  const meals = target.meals ?? DEFAULT_MEALS;
  const excluded = new Set<string>([...(target.excludeCategories ?? []), ...(target.excludeFoodIds ?? [])]);
  const usable = foods.filter(
    (f) => !excluded.has(f.category) && !excluded.has(f.id) && f.kcal > 0 && (f.protein > 0 || f.fat > 0 || f.carbs > 0),
  );

  const planMeals = meals.map((m, mi) => {
    const mealKcal = target.kcal * m.kcalShare;
    const items: MealPlanItem[] = [];
    let running = emptyTotals();
    const roles = Object.entries(CATEGORY_ROLE);

    for (const [role, cfg] of roles) {
      const pool = usable.filter((f) => cfg.filter.some((c) => f.category === c));
      if (pool.length === 0) continue;
      const idx = (seed * 31 + mi * 7 + role.length * 13) % pool.length;
      const food = pool[idx];
      const roleKcal = mealKcal * cfg.share;
      // grams to reach roleKcal from this food
      const grams = clamp((roleKcal / food.kcal) * 100, 10, 500);
      const totals = nutrientsFor(food, grams);
      items.push({ food, grams: round(grams, 0), totals });
      running = addTotals(running, totals);
    }
    return { name: m.name, items, totals: running };
  });

  const totals = planMeals.reduce((acc, m) => addTotals(acc, m.totals), emptyTotals());
  return {
    meals: planMeals,
    totals,
    proteinMet: target.proteinG > 0 ? clamp(totals.protein / target.proteinG, 0, 1) : 1,
    kcalMet: clamp(totals.kcal / target.kcal, 0, 1),
  };
}

/** Estimate daily energy requirement (Mifflin-St Jeor + activity factor). */
export function estimateEnergyRequirement(opts: {
  sex: "male" | "female";
  weightKg: number;
  heightCm: number;
  ageYears: number;
  activity: "sedentary" | "light" | "moderate" | "active";
}): { kcal: number; proteinG: number } {
  const { sex, weightKg, heightCm, ageYears, activity } = opts;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + (sex === "male" ? 5 : -161);
  const factor = activity === "sedentary" ? 1.2 : activity === "light" ? 1.375 : activity === "moderate" ? 1.55 : 1.725;
  const kcal = Math.round(bmr * factor);
  const proteinG = Math.round(weightKg * 1.0); // 1 g/kg baseline; adjust per condition
  return { kcal, proteinG };
}

export function formatTotalsLine(t: NutrientTotals): string {
  return `${fmt(t.kcal, 0)} kcal · protein ${fmt(t.protein, 0)} g · karbohidrat ${fmt(t.carbs, 0)} g · lemak ${fmt(t.fat, 0)} g · serat ${fmt(t.fiber, 0)} g`;
}
