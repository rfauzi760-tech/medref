import { describe, expect, it } from "vitest";
import { KPSP_AGE_FORMS, kpspAction, kpspCategory } from "@/lib/calc/kpsp";

describe("KPSP forms and scoring", () => {
  it("includes each scheduled form from 3 through 72 months", () => {
    expect(KPSP_AGE_FORMS.map(({ months }) => months)).toEqual([3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60, 66, 72]);
  });

  it("applies Kemenkes yes-answer categories and follow-up", () => {
    expect(kpspCategory(9)).toBe("Sesuai (S)");
    expect(kpspCategory(8)).toBe("Meragukan (M)");
    expect(kpspCategory(6)).toBe("Penyimpangan (P)");
    expect(kpspAction("Meragukan (M)")).toContain("2 minggu");
  });
});
