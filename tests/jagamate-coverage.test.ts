import { describe, expect, it } from "vitest";
import { DRUGS_BY_SLUG } from "@/lib/data/drugs";
import { JAGAMATE_DRUG_CHOICES } from "@/lib/data/jagamate-choices";

describe("Jaga Mate coverage", () => {
  it("exposes all 45 named medicines through existing RFSmed entries", () => {
    expect(JAGAMATE_DRUG_CHOICES).toHaveLength(45);
    expect(new Set(JAGAMATE_DRUG_CHOICES.map((choice) => choice.sourceName)).size).toBe(45);
    for (const choice of JAGAMATE_DRUG_CHOICES) {
      expect(DRUGS_BY_SLUG[choice.slug], choice.sourceName).toBeDefined();
    }
  });
});
