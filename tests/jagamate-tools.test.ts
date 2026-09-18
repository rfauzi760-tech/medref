import { describe, expect, it } from "vitest";
import { ADULT_BURN_REGIONS, calculateAdultBurnArea, calculateDiarrheaPlan, calculatePregnancyDating, calculateFundalEstimate, calculateBurnResuscitation, calculateShockBolus } from "@/lib/calc/jagamate-tools";

describe("Jaga Mate clinical tool equivalents", () => {
  it("uses WHO Plan A age bands", () => {
    expect(calculateDiarrheaPlan({ plan: "A", ageMonths: 12, weightKg: 10, severeMalnutrition: false })).toMatchObject({ status: "ok", minMl: 50, maxMl: 100 });
    expect(calculateDiarrheaPlan({ plan: "A", ageMonths: 36, weightKg: 12, severeMalnutrition: false })).toMatchObject({ status: "ok", minMl: 100, maxMl: 200 });
  });
  it("uses WHO Plan B 75 mL/kg over 4 hours", () => {
    expect(calculateDiarrheaPlan({ plan: "B", ageMonths: 60, weightKg: 20, severeMalnutrition: false })).toMatchObject({ status: "ok", totalMl: 1500, hours: 4 });
  });
  it("uses distinct WHO Plan C infant and child timings", () => {
    expect(calculateDiarrheaPlan({ plan: "C", ageMonths: 6, weightKg: 8, severeMalnutrition: false })).toMatchObject({ status: "ok", firstMl: 240, firstHours: 1, secondMl: 560, secondHours: 5 });
    expect(calculateDiarrheaPlan({ plan: "C", ageMonths: 24, weightKg: 12, severeMalnutrition: false })).toMatchObject({ status: "ok", firstMl: 360, firstHours: 0.5, secondMl: 840, secondHours: 2.5 });
    expect(calculateDiarrheaPlan({ plan: "C", ageMonths: 24, weightKg: 12, severeMalnutrition: true }).status).toBe("blocked");
  });
  it("blocks shock bolus in severe malnutrition", () => {
    expect(calculateShockBolus({ weightKg: 20, ageMonths: 60, severeMalnutrition: false, cardiacFailure: false })).toMatchObject({ status: "ok", minMl: 200, maxMl: 400 });
    expect(calculateShockBolus({ weightKg: 20, ageMonths: 60, severeMalnutrition: true, cardiacFailure: false }).status).toBe("blocked");
  });
  it("dates pregnancy from HPHT and rejects dates in the future", () => {
    expect(calculatePregnancyDating("2026-01-01", "2026-01-29")).toMatchObject({ status: "ok", weeks: 4, days: 0, dueDate: "2026-10-08" });
    expect(calculatePregnancyDating("2026-10-01", "2026-09-18").status).toBe("blocked");
  });
  it("restricts fundal-weight estimates to term pregnancy", () => {
    expect(calculateFundalEstimate({ fundalHeightCm: 34, station: "above", gestationalWeeks: 39 })).toMatchObject({ status: "ok", estimatedGrams: 3255 });
    expect(calculateFundalEstimate({ fundalHeightCm: 34, station: "above", gestationalWeeks: 28 }).status).toBe("blocked");
  });
  it("calculates burn resuscitation from injury time without implying pediatric maintenance is included", () => {
    expect(calculateBurnResuscitation({ ageYears: 30, weightKg: 70, tbsaPercent: 20, multiplier: 2, hoursSinceInjury: 1 })).toMatchObject({ status: "ok", first24hMl: 2800, first8hMl: 1400, next16hMl: 1400 });
    expect(calculateBurnResuscitation({ ageYears: 5, weightKg: 20, tbsaPercent: 15, multiplier: 3, hoursSinceInjury: 2 })).toMatchObject({ status: "ok", first24hMl: 900 });
    expect(calculateBurnResuscitation({ ageYears: 30, weightKg: 70, tbsaPercent: 20, multiplier: 2, hoursSinceInjury: 10 }).status).toBe("blocked");
  });
  it("uses adult rule-of-nines regions that total exactly 100 percent", () => {
    expect(ADULT_BURN_REGIONS.reduce((total, region) => total + region.percent, 0)).toBe(100);
    expect(calculateAdultBurnArea(["head", "front-trunk"])).toBe(27);
    expect(calculateAdultBurnArea(["unknown"])).toBeUndefined();
  });
});
