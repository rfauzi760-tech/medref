import { describe, expect, it } from "vitest";
import { ECG_ATLAS_ENTRIES } from "@/lib/data/ecg-atlas";
import { RADIOLOGY_ATLAS_ENTRIES } from "@/lib/data/radiology-atlas";

describe("atlas klinis", () => {
  it("memuat seluruh pola EKG", () => {
    expect(ECG_ATLAS_ENTRIES).toHaveLength(43);
    expect(ECG_ATLAS_ENTRIES.every((entry) => entry.detail.includes("KENALI CEPAT"))).toBe(true);
  });

  it("memuat seluruh indeks radiologi", () => {
    expect(RADIOLOGY_ATLAS_ENTRIES).toHaveLength(159);
    expect(new Set(RADIOLOGY_ATLAS_ENTRIES.map((entry) => entry.title)).size).toBe(159);
  });

  it("tidak menampilkan em dash", () => {
    const text = JSON.stringify([...ECG_ATLAS_ENTRIES, ...RADIOLOGY_ATLAS_ENTRIES]);
    expect(text).not.toContain("—");
  });
});
