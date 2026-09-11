import { describe, expect, it } from "vitest";
import { calculateBilirubinThreshold } from "@/lib/calc/bilirubin";

describe("kalkulator bilirubin AAP 2022", () => {
  it("menghasilkan ambang bayi 38 minggu usia 48 jam", () => {
    const result = calculateBilirubinThreshold({ gestationalAgeWeeks: 38, ageHours: 48, hasAdditionalRisk: false, tsb: 15 });
    expect(result.phototherapy).toBe(16);
    expect(result.exchange).toBe(24);
    expect(result.escalation).toBe(22);
    expect(result.action).toBe("pantau");
  });

  it("menurunkan ambang bila ada faktor risiko tambahan", () => {
    const standard = calculateBilirubinThreshold({ gestationalAgeWeeks: 38, ageHours: 48, hasAdditionalRisk: false });
    const risk = calculateBilirubinThreshold({ gestationalAgeWeeks: 38, ageHours: 48, hasAdditionalRisk: true });
    expect(risk.phototherapy).toBeLessThan(standard.phototherapy);
    expect(risk.exchange).toBeLessThan(standard.exchange);
  });

  it("menolak usia gestasi dan usia postnatal di luar cakupan", () => {
    expect(() => calculateBilirubinThreshold({ gestationalAgeWeeks: 34, ageHours: 48, hasAdditionalRisk: false })).toThrow();
    expect(() => calculateBilirubinThreshold({ gestationalAgeWeeks: 38, ageHours: 337, hasAdditionalRisk: false })).toThrow();
  });
});
