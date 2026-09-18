import { describe, expect, it } from "vitest";
import { DRUGS_BY_SLUG } from "@/lib/data/drugs";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";
import { CALCULATORS_BY_SLUG } from "@/lib/data/calculators";
import { SCORES_BY_SLUG } from "@/lib/data/scores";

describe("Jaga Mate coverage", () => {
  it("exposes all 45 named medicines through existing RFSmed entries", () => {
    expect(JAGAMATE_DRUG_CHOICES).toHaveLength(45);
    expect(new Set(JAGAMATE_DRUG_CHOICES.map((choice) => choice.sourceName)).size).toBe(45);
    for (const choice of JAGAMATE_DRUG_CHOICES) {
      expect(DRUGS_BY_SLUG[choice.slug], choice.sourceName).toBeDefined();
    }
  });
  it("reuses working RFSmed calculators for source menu items already covered", () => {
    for (const slug of ["holliday-segar", "fluid-deficit", "bmi"]) expect(CALCULATORS_BY_SLUG[slug], slug).toBeDefined();
    expect(SCORES_BY_SLUG.gcs).toBeDefined();
  });
});
