import { describe, expect, it } from "vitest";
import { correctedCalcium, correctedSodium, freeWaterDeficit, potassiumDeficitEstimate } from "@/lib/calc/electrolytes";

describe("kalkulator koreksi elektrolit", () => {
  it("mengoreksi natrium pada hiperglikemia", () => {
    expect(correctedSodium(130, 500)).toBeCloseTo(136.4, 1);
  });

  it("mengoreksi kalsium terhadap albumin", () => {
    expect(correctedCalcium(7.5, 2)).toBeCloseTo(9.1, 1);
  });

  it("menghitung defisit air bebas", () => {
    expect(freeWaterDeficit({ sodium: 160, weightKg: 70, sex: "male", olderAdult: false })).toBeCloseTo(6, 1);
  });

  it("memberi rentang estimasi defisit kalium", () => {
    expect(potassiumDeficitEstimate(2.5)).toEqual({ minMmol: 200, maxMmol: 400 });
  });
});
