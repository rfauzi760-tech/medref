/**
 * Validasi data klinis — gagalkan build bila ada duplikat id/slug, entri
 * tanpa sumber, relasi yang putus (interaksi → obat), atau struktur rusak.
 */
import { describe, expect, test } from "vitest";
import { SCORES } from "@/lib/data/scores";
import { CALCULATORS } from "@/lib/data/calculators";
import { DRUGS } from "@/lib/data/drugs";
import { drugInteractions } from "@/lib/data/interactions";
import { procedureEntries } from "@/lib/data/indications";
import { guidelines } from "@/lib/data/guidelines";
import { icd10Codes } from "@/lib/data/icd10";
import { milestoneAges } from "@/lib/data/milestones";
import { immunizationSchedule } from "@/lib/data/immunization";

function dupes(items: string[]) {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i) ? true : (seen.add(i), false)));
}
function empty(rows: { key: string; label: string }[], field: string) {
  return rows.filter((r) => !String((r as unknown as Record<string, unknown>)[field])?.trim()).map((r) => r.key);
}
const hasSource = (o: { source?: { org?: string; year?: number } }) => !!o.source?.org && typeof o.source.year === "number";

describe("validasi struktur data klinis", () => {
  test("skor: id & slug unik, field inti terisi, sumber ada", () => {
    expect(dupes(SCORES.map((s) => s.id))).toEqual([]);
    expect(dupes(SCORES.map((s) => s.slug))).toEqual([]);
    expect(SCORES.filter((s) => !s.title.trim() || !s.description.trim())).toEqual([]);
    expect(SCORES.filter((s) => !hasSource(s))).toEqual([]);
    for (const s of SCORES) {
      for (const v of s.variables) {
        if (v.type === "select") expect(v.options?.length, `${s.slug}/${v.id}`).toBeGreaterThan(0);
        if (v.type === "number") {
          expect(v.min === undefined || v.max === undefined || v.min! < v.max!, `${s.slug}/${v.id}`).toBe(true);
        }
      }
      for (const r of s.ranges) expect(r.min <= r.max, `${s.slug}: rentang ${r.min}–${r.max}`).toBe(true);
    }
  });

  test("kalkulator: unik & setiap rumus terdaftar (registry tidak kehilangan slug)", async () => {
    expect(dupes(CALCULATORS.map((c) => c.slug))).toEqual([]);
    expect(CALCULATORS.filter((c) => !c.formulaText && !c.interpretation)).toEqual([]);
    const { runCalculator } = await import("@/lib/calc/calculators");
    const unsupported = CALCULATORS.filter((c) => {
      try {
        runCalculator(c, {});
        return false;
      } catch (e) {
        return String((e as Error).message).includes("not implemented");
      }
    });
    expect(unsupported.map((c) => c.slug)).toEqual([]);
  });

  test("obat: id/slug unik, dosis & sumber ada, relasi interaksi valid", () => {
    expect(dupes(DRUGS.map((d) => d.id))).toEqual([]);
    expect(dupes(DRUGS.map((d) => d.slug))).toEqual([]);
    expect(DRUGS.filter((d) => d.doses.length === 0).map((d) => d.slug)).toEqual([]);
    expect(DRUGS.filter((d) => !hasSource(d)).map((d) => d.slug)).toEqual([]);
    const slugs = new Set(DRUGS.map((d) => d.slug));
    const broken = drugInteractions.filter((x) => !slugs.has(x.a) || !slugs.has(x.b)).map((x) => `${x.a}–${x.b}`);
    expect(broken).toEqual([]);
  });

  test("panduan klinis: slug unik & referensi terisi", () => {
    expect(dupes(guidelines.map((g) => g.slug))).toEqual([]);
    expect(guidelines.filter((g) => g.references.length === 0).map((g) => g.slug)).toEqual([]);
    expect(guidelines.filter((g) => Object.keys(g.sections).length === 0).map((g) => g.slug)).toEqual([]);
  });

  test("dataset lain: id unik", () => {
    expect(dupes(icd10Codes.map((c) => c.code))).toEqual([]);
    expect(dupes(procedureEntries.map((p) => p.slug))).toEqual([]);
    expect(dupes(milestoneAges.map((m) => String(m.ageMonths)))).toEqual([]);
    for (const v of immunizationSchedule.vaccines) expect(v.doses.length).toBeGreaterThan(0);
  });
});
