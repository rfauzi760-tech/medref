import { describe, expect, it } from "vitest";
import { mergeDrugEnrichments } from "@/lib/data/merge-drug-enrichments";
import type { Drug } from "@/lib/types";

const base: Drug = {
  id: "test", slug: "test", genericName: "Test", drugClass: "Test",
  specialties: [], keywords: [], indications: [],
  doses: [{ population: "pediatric", route: "PO", text: "Dosis lama" }],
  preparations: ["Sirup 120 mg/5 mL"], lastReviewed: "2026-09-18",
  source: { org: "WHO", title: "Test", year: 2026, url: "https://who.int" },
};
const cited = { org: "DailyMed", title: "Label", year: 2026, url: "https://dailymed.nlm.nih.gov" };
const dose = { population: "pediatric" as const, route: "IV", text: "Dosis baru", source: cited };

describe("mergeDrugEnrichments", () => {
  it("adds verified data without changing existing regimens and remains idempotent", () => {
    const patch = [{ slug: "test", doses: [dose], preparations: ["Sirup 160 mg/5 mL"] }];
    const once = mergeDrugEnrichments([base], patch, []);
    const twice = mergeDrugEnrichments(once, patch, []);
    expect(twice[0].doses.map((entry) => entry.text)).toEqual(["Dosis lama", "Dosis baru"]);
    expect(twice[0].preparations).toEqual(["Sirup 120 mg/5 mL", "Sirup 160 mg/5 mL"]);
    expect(base.doses).toHaveLength(1);
  });

  it("rejects unknown or duplicate patch targets", () => {
    expect(() => mergeDrugEnrichments([base], [{ slug: "missing" }], [])).toThrow();
    expect(() => mergeDrugEnrichments([base], [{ slug: "test" }, { slug: "test" }], [])).toThrow();
  });

  it("rejects uncited doses and duplicate new drugs", () => {
    expect(() => mergeDrugEnrichments([base], [{ slug: "test", doses: [{ ...dose, source: undefined }] }], [])).toThrow();
    expect(() => mergeDrugEnrichments([base], [], [base])).toThrow();
  });
});
