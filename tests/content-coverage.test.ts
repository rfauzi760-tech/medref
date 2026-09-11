import { describe, expect, test } from "vitest";
import { getContentCoverage } from "@/lib/content-coverage";

describe("content coverage", () => {
  test("reports real local counts and honest status", () => {
    const rows = getContentCoverage();

    expect(rows.find((row) => row.label === "Panduan Klinis")?.status).toBe("complete");
    expect(rows.find((row) => row.label === "Dosis Obat")?.status).toBe("complete");
    expect(rows.find((row) => row.label === "Kamus ICD-10")?.status).toBe("partial");
    expect(rows.every((row) => row.local > 0)).toBe(true);
  });
});
