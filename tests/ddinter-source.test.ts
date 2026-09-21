import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { INTERACTIONS } from "@/lib/data/interactions";

describe("sumber interaksi obat", () => {
  it("menggunakan DDInter 2.0 dan bukan snapshot Klinea", () => {
    expect(INTERACTIONS).toHaveLength(4788);
    expect(INTERACTIONS.every((item) => item.source.org === "DDInter 2.0")).toBe(true);
    expect(readFileSync("lib/data/interactions.ts", "utf8")).not.toContain("canonicalInteractions");
    expect(readFileSync("lib/data/interactions.ts", "utf8")).not.toContain("klinea-canonical");
  });

  it("memuat pasangan terverifikasi dari DDInter", () => {
    const pair = INTERACTIONS.find((item) =>
      (item.a === "warfarin" && item.b === "ibuprofen") ||
      (item.a === "ibuprofen" && item.b === "warfarin"),
    );
    expect(pair).toMatchObject({ severity: "major", source: { org: "DDInter 2.0" } });
    expect(pair?.mechanism).toContain("bleeding");
  });
});
