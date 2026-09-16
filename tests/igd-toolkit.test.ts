import { describe, expect, it } from "vitest";
import { modules } from "@/lib/nav";
import { globalSearch } from "@/lib/search";

describe("navigasi Toolkit IGD", () => {
  it("memuat hub dan seluruh modul baru dengan rute unik", () => {
    const expected = ["igd-toolkit", "emergency-dose", "bilirubin", "antidotes", "pregnancy-drugs", "electrolytes", "ddx"];
    const found = modules.filter((item) => expected.includes(item.slug));
    expect(found.map((item) => item.slug).sort()).toEqual(expected.sort());
    expect(new Set(found.map((item) => item.href)).size).toBe(found.length);
  });

  it("mempertahankan modul anak, emergensi, EKG, dan imaging", () => {
    expect(modules.some((item) => item.slug === "pediatric-emergency")).toBe(true);
    expect(modules.some((item) => item.slug === "emergency")).toBe(true);
    expect(modules.some((item) => item.slug === "ecg-atlas")).toBe(true);
    expect(modules.some((item) => item.slug === "radiology-atlas")).toBe(true);
  });

  it("menyediakan Resusitasi Neonatus sebagai modul terpisah dan hasil pencarian", () => {
    expect(modules.find((item) => item.slug === "neonatal-resuscitation")?.href).toBe("/neonatal-resuscitation");
    const hits = globalSearch("resusitasi neonatus").flatMap((group) => group.hits);
    expect(hits.some((hit) => hit.href === "/neonatal-resuscitation")).toBe(true);
  });
});
