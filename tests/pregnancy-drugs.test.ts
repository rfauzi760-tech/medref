import { describe, expect, it } from "vitest";
import { PREGNANCY_DRUGS, searchPregnancyDrugs } from "@/lib/data/pregnancy-drugs";

describe("obat pada kehamilan dan menyusui", () => {
  it("memuat katalog lengkap dengan rating dan catatan", () => {
    expect(PREGNANCY_DRUGS.length).toBeGreaterThanOrEqual(50);
    expect(new Set(PREGNANCY_DRUGS.map((item) => item.id)).size).toBe(PREGNANCY_DRUGS.length);
    expect(PREGNANCY_DRUGS.every((item) => item.pregnancyRating && item.lactationRating && item.summary)).toBe(true);
  });

  it("mendukung pencarian nama dan golongan", () => {
    expect(searchPregnancyDrugs("parasetamol")[0]?.id).toBe("paracetamol");
    expect(searchPregnancyDrugs("beta-laktam").length).toBeGreaterThan(1);
  });
});
