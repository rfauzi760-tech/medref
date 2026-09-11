import { describe, expect, it } from "vitest";

import { DRUGS } from "@/lib/data/drugs";
import { foods } from "@/lib/data/foods";
import { GUIDELINES } from "@/lib/data/guidelines";
import { ICD10 } from "@/lib/data/icd10";
import { INTERACTIONS } from "@/lib/data/interactions";
import { nutritionGuidance } from "@/lib/data/nutritionGuidance";

describe("adapter konten kanonik Klinea", () => {
  it("memakai katalog lengkap dan istilah Indonesia", () => {
    expect(DRUGS).toHaveLength(517);
    expect(DRUGS.find((item) => item.slug === "parasetamol")?.genericName).toBe(
      "Parasetamol (Asetaminofen)",
    );
    expect(GUIDELINES).toHaveLength(340);
    expect(GUIDELINES.find((item) => item.slug === "hipertensi")?.title).toBe("Hipertensi");
    expect(ICD10).toHaveLength(638);
    expect(ICD10.find((item) => item.code === "A00.9")?.id).toBe("Kolera");
    expect(foods).toHaveLength(478);
    expect(foods.find((item) => item.id === "nasi-putih")?.name).toBe("Nasi putih");
    expect(nutritionGuidance).toHaveLength(16);
  });

  it("mengembangkan interaksi kelompok menjadi pasangan obat", () => {
    expect(INTERACTIONS.length).toBeGreaterThan(152);
    expect(INTERACTIONS.some((item) => item.mechanism.includes("kalium"))).toBe(true);
  });
});
