import { describe, expect, it } from "vitest";
import { modules } from "@/lib/nav";

describe("navigasi dosis", () => {
  it("hanya menampilkan satu modul dosis obat", () => {
    const doseModules = modules.filter((item) => item.showInNav !== false && /dosis.*obat|obat.*dosis/i.test(item.name));
    expect(doseModules.map((item) => item.slug)).toEqual(["drugs"]);
  });
});
