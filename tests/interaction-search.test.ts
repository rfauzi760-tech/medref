import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { filterInteractionSuggestions } from "@/lib/calc/interaction-search";

const drugs = [
  { slug: "amoxicillin", genericName: "Amoksisilin", brandNames: ["Amoxsan"], drugClass: "Penisilin" },
  { slug: "ampicillin", genericName: "Ampisilin", drugClass: "Penisilin" },
  { slug: "warfarin", genericName: "Warfarin", drugClass: "Antikoagulan" },
];

describe("filter saran interaksi obat", () => {
  it("memfilter obat berdasarkan kelas tanpa memerlukan teks pencarian", () => {
    expect(filterInteractionSuggestions(drugs, [], "", "Penisilin").map((drug) => drug.slug)).toEqual(["amoxicillin", "ampicillin"]);
  });

  it("menggabungkan pencarian nama atau merek dengan kelas", () => {
    expect(filterInteractionSuggestions(drugs, [], "amox", "Penisilin").map((drug) => drug.slug)).toEqual(["amoxicillin"]);
    expect(filterInteractionSuggestions(drugs, [], "Amoxsan", "Penisilin").map((drug) => drug.slug)).toEqual(["amoxicillin"]);
  });

  it("mengecualikan obat yang sudah dipilih dan membatasi hasil", () => {
    expect(filterInteractionSuggestions(drugs, ["amoxicillin"], "", "Penisilin", 1).map((drug) => drug.slug)).toEqual(["ampicillin"]);
  });

  it("tidak menampilkan saran dari teks yang terlalu pendek tanpa filter kelas", () => {
    expect(filterInteractionSuggestions(drugs, [], "a", "")).toEqual([]);
  });
});

describe("penempatan filter kelas", () => {
  it("menghapus chip kelas dari Dosis Obat dan menaruh dropdown di Interaksi Obat", () => {
    const dosePage = readFileSync("components/catalog-pages/drugs-page-client.tsx", "utf8");
    const interactionPage = readFileSync("components/catalog-pages/interactions-page-client.tsx", "utf8");
    expect(dosePage).not.toContain("drugClasses.map");
    expect(interactionPage).toContain('id="interaction-drug-class"');
    expect(interactionPage).toContain("Semua kelas");
  });
});
