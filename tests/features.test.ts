import { describe, expect, test } from "vitest";
import { interpretAbg } from "@/lib/calc/abg";
import { translateCalculatorText } from "@/lib/calc/calculator-text";
import { runCalculator } from "@/lib/calc/calculators";
import { CALCULATORS } from "@/lib/data/calculators";
import { EMERGENCY_PATHWAYS } from "@/lib/data/emergency";
import { EMERGENCY_PROTOCOLS } from "@/lib/data/protocols";
import { resolveAllPathways } from "@/lib/emergency";
import { bestSourceTier, guidelineSourceTier, sourceTier } from "@/lib/evidence";

describe("analisis gas darah", () => {
  test("terjemahan hasil tidak merusak kata normal", () => {
    expect(translateCalculatorText("Dalam batas normal.")).toBe("Dalam batas normal.");
    expect(translateCalculatorText("No")).toBe("Tidak");
  });

  test("asidosis metabolik dengan kompensasi adekuat", () => {
    const result = interpretAbg({ ph: 7.3, pco2: 30, hco3: 15 });
    expect(result.acidBaseStatus).toBe("asidemia");
    expect(result.primary).toContain("Asidosis metabolik");
    expect(result.isMixed).toBe(false);
  });

  test("asidosis metabolik dengan anion gap tinggi dan delta ratio", () => {
    const result = interpretAbg({ ph: 7.2, pco2: 25, hco3: 10, na: 140, cl: 100 });
    expect(result.anionGap).toBe(30);
    expect(result.deltaRatio).toBeCloseTo(1.29, 2);
    expect(result.deltaRatioLabel).toBeTruthy();
  });

  test("asidosis respiratorik akut", () => {
    const result = interpretAbg({ ph: 7.25, pco2: 60, hco3: 26 });
    expect(result.primary).toContain("Asidosis respiratorik");
  });

  test("alkalosis respiratorik akut", () => {
    const result = interpretAbg({ ph: 7.5, pco2: 30, hco3: 24 });
    expect(result.primary).toContain("Alkalosis respiratorik");
  });

  test("gas darah normal", () => {
    const result = interpretAbg({ ph: 7.4, pco2: 40, hco3: 24 });
    expect(result.acidBaseStatus).toBe("normal");
  });

  test("kalkulator AGD terdaftar dan mengembalikan hasil", () => {
    const abg = CALCULATORS.find((calculator) => calculator.slug === "abg");
    expect(abg).toBeTruthy();
    const res = runCalculator({ slug: "abg" }, { ph: 7.3, pco2: 30, hco3: 15 });
    expect(res.lines.length).toBeGreaterThan(0);
    expect(res.lines.some((line) => line.value.includes("Asidosis metabolik"))).toBe(true);
  });

  test("hasil Winter menjelaskan rentang kompensasi dan membandingkan pCO2 aktual", () => {
    const result = runCalculator({ slug: "abg" }, { ph: 7.3, pco2: 30, hco3: 14 });
    const compensation = result.lines.find((line) => line.label === "Kompensasi yang diharapkan");

    expect(compensation).toMatchObject({
      label: "Kompensasi yang diharapkan",
      value: "29 ± 2",
      unit: "mmHg",
    });
    expect(compensation?.detail).toContain("rentang pCO₂ 27–31 mmHg");
    expect(compensation?.detail).toContain("pCO₂ aktual 30 mmHg");
    expect(compensation?.detail).toContain("sesuai dengan kompensasi");
  });

  test("hasil Winter menandai pCO2 di atas rentang sebagai kemungkinan gangguan tambahan", () => {
    const result = runCalculator({ slug: "abg" }, { ph: 7.2, pco2: 35, hco3: 14 });
    const compensation = result.lines.find((line) => line.label === "Kompensasi yang diharapkan");

    expect(compensation?.detail).toContain("di atas rentang");
    expect(compensation?.detail).toContain("asidosis respiratorik tambahan");
  });
});

describe("alur IGD", () => {
  test("alur stroke menampilkan Siriraj Stroke Score", () => {
    const stroke = resolveAllPathways().find((entry) => entry.pathway.slug === "stroke-neurologi");
    expect(stroke?.steps.some((step) => step.href === "/scores/siriraj-stroke-score")).toBe(true);
  });

  test("slug alur unik dan setiap rujukan terselesaikan", () => {
    const slugs = EMERGENCY_PATHWAYS.map((pathway) => pathway.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    const resolved = resolveAllPathways();
    const unresolved = resolved.flatMap((entry) => entry.unresolved.map((ref) => `${entry.pathway.slug} -> ${ref}`));
    expect(unresolved).toEqual([]);
    for (const entry of resolved) {
      expect(entry.steps.length).toBeGreaterThan(0);
      expect(entry.steps.every((step) => step.href.startsWith("/"))).toBe(true);
    }
  });

  test("setiap alur punya tanda bahaya dari panduan yang ditautkan", () => {
    const missing = resolveAllPathways().filter((entry) => entry.redFlags.length === 0).map((entry) => entry.pathway.slug);
    expect(missing).toEqual([]);
  });
});

describe("protocol timer", () => {
  test("setiap protokol punya target waktu yang valid", () => {
    for (const protocol of EMERGENCY_PROTOCOLS) {
      expect(protocol.milestones.length).toBeGreaterThan(0);
      for (const milestone of protocol.milestones) {
        expect(milestone.targetMinutes).toBeGreaterThan(0);
        expect(milestone.label.trim().length).toBeGreaterThan(0);
      }
      expect(protocol.source.org).toBeTruthy();
    }
  });
});

describe("kekuatan sumber", () => {
  test("mengklasifikasi badan pedoman internasional sebagai tingkat 1", () => {
    expect(sourceTier({ org: "WHO", title: "Model List of Essential Medicines", year: 2023 })).toBe(1);
    expect(sourceTier({ org: "KDIGO", title: "Clinical practice guideline", year: 2024 })).toBe(1);
    expect(sourceTier({ org: "NICE", title: "Head injury: assessment and early management", year: 2019 })).toBe(1);
  });

  test("mengklasifikasi organisasi profesi nasional sebagai tingkat 2 dan lainnya tingkat 3", () => {
    expect(sourceTier({ org: "Kementerian Kesehatan RI", title: "Pedoman nasional", year: 2020 })).toBe(2);
    expect(sourceTier({ org: "Katzung", title: "Basic & Clinical Pharmacology", year: 2021 })).toBe(3);
  });

  test("bestSourceTier mengambil tingkat terkuat", () => {
    expect(
      bestSourceTier([
        { org: "Local review", title: "Ringkasan", year: 2019 },
        { org: "WHO", title: "Guideline", year: 2022 },
      ]),
    ).toBe(1);
    expect(guidelineSourceTier({ references: [{ org: "Katzung", title: "Textbook", year: 2020 }] })).toBe(3);
  });
});
