import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { modules } from "@/lib/nav";
import { DRUG_TOOL_GROUPS } from "@/lib/data/drug-tools";

describe("navigasi dosis", () => {
  it("hanya menampilkan satu modul dosis obat", () => {
    const doseModules = modules.filter((item) => item.showInNav !== false && /dosis.*obat|obat.*dosis/i.test(item.name));
    expect(doseModules.map((item) => item.slug)).toEqual(["drugs"]);
  });

  it("memperlakukan dosis anak sebagai filter di modul Dosis Obat yang sama", () => {
    const shell = readFileSync("components/shell.tsx", "utf8");
    const drugList = readFileSync("components/catalog-pages/drugs-page-client.tsx", "utf8");
    const drugDetail = readFileSync("app/drugs/[slug]/page.tsx", "utf8");

    expect(shell).not.toContain("pediatricDrugMode");
    expect(shell).toContain('if (href === "/drugs") return pathname.startsWith("/drugs");');
    expect(drugList).toContain('title="Dosis Obat"');
    expect(drugList).toMatch(/>\s*Anak\s*<\/button>/);
    expect(drugDetail.match(/label="Kembali ke Dosis Obat"/g)).toHaveLength(1);
  });

  it("hanya menampilkan kalkulator dosis dan cairan pada tab terkait dosis", () => {
    const titles = DRUG_TOOL_GROUPS.map(({ title }) => title);
    const links = DRUG_TOOL_GROUPS.flatMap(({ links }) => links.map(([, href]) => href));

    expect(titles).toEqual(["Dosis dan pemberian obat", "Cairan dan rehidrasi"]);
    expect(links).toEqual(expect.arrayContaining([
      "/emergency-dose",
      "/calculators/mgkg-dose",
      "/calculators/infusion-rate",
      "/calculators/dilution",
      "/tools-dosis/diare",
      "/calculators/holliday-segar",
      "/calculators/fluid-deficit",
      "/calculators/drip-rate",
      "/calculators/iv-rate",
      "/tools-dosis/syok",
      "/tools-dosis/luka-bakar",
    ]));
    for (const href of [
      "/scores/gcs",
      "/calculators/bmi",
      "/anthropometry",
      "/tools-dosis/kehamilan",
      "/tools-dosis/taksiran-janin",
    ]) expect(links).not.toContain(href);
  });
});
