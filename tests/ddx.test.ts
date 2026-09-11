import { describe, expect, it } from "vitest";
import { DDX_FINDINGS, rankDifferentials } from "@/lib/calc/ddx";

describe("mesin diagnosis banding", () => {
  it("memuat kelompok temuan utama", () => {
    expect(DDX_FINDINGS.length).toBeGreaterThanOrEqual(20);
    expect(DDX_FINDINGS.some((item) => item.id === "chest-pain")).toBe(true);
  });

  it("memprioritaskan kondisi yang tidak boleh terlewat pada nyeri dada", () => {
    const results = rankDifferentials(["chest-pain", "st-elevation"]);
    expect(results[0].diagnosis).toBe("Sindrom Koroner Akut");
    expect(results[0].cantMiss).toBe(true);
  });

  it("mempersempit hasil berdasarkan beberapa temuan", () => {
    const broad = rankDifferentials(["shortness-of-breath"]);
    const focused = rankDifferentials(["shortness-of-breath", "unilateral-breath-sounds"]);
    expect(focused[0].diagnosis).toContain("Pneumotoraks");
    expect(focused[0].score).toBeGreaterThan(broad.find((item) => item.id === focused[0].id)?.score ?? 0);
  });
});
