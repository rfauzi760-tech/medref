import { describe, expect, it } from "vitest";
import { ANTIDOTES, searchAntidotes } from "@/lib/data/antidotes";

describe("panduan toksikologi dan antidot", () => {
  it("memuat seluruh kelompok antidot utama", () => {
    expect(ANTIDOTES.length).toBeGreaterThanOrEqual(19);
    expect(new Set(ANTIDOTES.map((item) => item.id)).size).toBe(ANTIDOTES.length);
    expect(ANTIDOTES.every((item) => item.indication && item.doses.length && item.source)).toBe(true);
  });

  it("mencari dengan nama toksin, antidot, dan sinonim", () => {
    expect(searchAntidotes("baygon")[0]?.id).toBe("organophosphate");
    expect(searchAntidotes("nalokson")[0]?.id).toBe("opioid");
    expect(searchAntidotes("paracetamol")[0]?.id).toBe("paracetamol");
  });
});
