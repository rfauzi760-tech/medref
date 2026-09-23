import { describe, expect, it } from "vitest";

import { DRUGS } from "@/lib/data/drugs";
import { GUIDELINES } from "@/lib/data/guidelines";
import { ICD10 } from "@/lib/data/icd10";
import { INTERACTIONS } from "@/lib/data/interactions";

describe("adapter konten klinis", () => {
  it("mempertahankan hierarki subjudul dan butir panduan", () => {
    const hypertension = GUIDELINES.find((item) => item.slug === "hipertensi");
    const investigations = hypertension?.sections.investigations ?? [];
    expect(investigations).toContainEqual({
      heading: "Pengukuran tekanan darah",
      children: expect.arrayContaining([
        expect.stringContaining("Diagnosis:"),
        expect.stringContaining("Konfirmasi"),
      ]),
    });
    expect(investigations).not.toContain(expect.stringContaining("Pengukuran tekanan darah Diagnosis:"));
  });

  it("menjadikan Rencana Terapi A, B, dan C sebagai subjudul Diare Akut", () => {
    const diare = GUIDELINES.find((item) => item.slug === "diare-anak");
    const plans = (diare?.sections.initialManagement ?? []).filter(
      (item) => typeof item !== "string" && /^Rencana Terapi [ABC]/.test(item.heading),
    );
    expect(plans).toHaveLength(3);
    expect(plans.every((plan) => typeof plan !== "string" && plan.children.length > 0)).toBe(true);
  });

  it("memakai katalog lengkap dan istilah Indonesia", () => {
    expect(DRUGS).toHaveLength(518);
    expect(DRUGS.find((item) => item.slug === "paracetamol")?.genericName).toBe(
      "Parasetamol (Asetaminofen)",
    );
    expect(GUIDELINES).toHaveLength(340);
    expect(GUIDELINES.find((item) => item.slug === "hipertensi")?.title).toBe("Hipertensi");
    expect(ICD10).toHaveLength(638);
    expect(ICD10.find((item) => item.code === "A00.9")?.id).toBe("Kolera");
  });

  it("memakai pasangan DDInter 2.0 dengan sumber yang dapat ditelusuri", () => {
    expect(INTERACTIONS).toHaveLength(4788);
    expect(INTERACTIONS.every((item) => item.source.org === "DDInter 2.0")).toBe(true);
    expect(INTERACTIONS.some((item) => item.a === "warfarin" && item.b === "ibuprofen")).toBe(true);
  });

  it("memisahkan panduan emergensi dan non-emergensi", () => {
    const emergency = GUIDELINES.filter((item) => item.emergency);
    const nonEmergency = GUIDELINES.filter((item) => !item.emergency);

    expect(emergency.length).toBeGreaterThan(0);
    expect(nonEmergency.length).toBeGreaterThan(0);
    expect(GUIDELINES.find((item) => item.slug === "stemi")?.emergency).toBe(true);
    expect(GUIDELINES.find((item) => item.slug === "hipertensi")?.emergency).toBe(false);
  });
});
