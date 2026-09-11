import { describe, expect, it } from "vitest";
import { doseFromRate, pumpRate, totalDose } from "@/lib/calc/emergency-dose";

describe("kalkulator dosis obat IGD", () => {
  it("menghitung dosis berbasis berat badan", () => {
    expect(totalDose({ weightKg: 10, dosePerKg: 0.1 })).toBe(1);
  });

  it("mengubah dosis per menit menjadi laju pompa", () => {
    expect(pumpRate({ weightKg: 60, doseMcgKgMin: 0.1, concentrationMcgMl: 80 })).toBe(4.5);
  });

  it("menghitung balik dosis dari laju pompa", () => {
    expect(doseFromRate({ weightKg: 60, rateMlHour: 4.5, concentrationMcgMl: 80 })).toBe(0.1);
  });
});
