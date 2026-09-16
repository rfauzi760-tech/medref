import { describe, expect, test } from "vitest";
import { NEONATAL_FLOW, NEONATAL_OXYGEN_TARGETS, NEONATAL_SOURCES } from "@/lib/neonatal-resuscitation";

describe("skema resusitasi neonatus", () => {
  test("setiap cabang bertujuan jelas dan dapat mencapai perawatan akhir", () => {
    const byId = new Map(NEONATAL_FLOW.map((node) => [node.id, node]));
    expect(byId.size).toBe(NEONATAL_FLOW.length);
    expect(byId.has("preparation")).toBe(true);

    function reachesTerminal(id: string, seen = new Set<string>()): boolean {
      const node = byId.get(id);
      if (!node || seen.has(id)) return false;
      if (node.kind === "terminal") return true;
      const visited = new Set([...seen, id]);
      return node.branches.some((branch) => reachesTerminal(branch.to, visited));
    }

    for (const node of NEONATAL_FLOW) {
      expect(node.title.trim().length, node.id).toBeGreaterThan(0);
      expect(node.body.length, node.id).toBeGreaterThan(0);
      expect(reachesTerminal(node.id), node.id).toBe(true);
      for (const branch of node.branches) {
        expect(byId.has(branch.to), `${node.id} -> ${branch.to}`).toBe(true);
        expect(branch.label.trim().length, node.id).toBeGreaterThan(0);
      }
      if (node.kind === "decision") expect(node.branches.length, node.id).toBeGreaterThanOrEqual(2);
    }
  });

  test("memuat ambang, langkah lanjut, target saturasi, dan sumber resmi", () => {
    const content = NEONATAL_FLOW.flatMap((node) => [node.title, ...node.body]).join(" ");
    expect(content).toContain("<100/menit");
    expect(content).toContain("<60/menit");
    expect(content).toContain("3:1");
    expect(content).toContain("0,01–0,03 mg/kg");
    expect(content).not.toMatch(/APGAR\s*[0-9]/i);
    expect(NEONATAL_OXYGEN_TARGETS.map((item) => item.minute)).toEqual([2, 3, 4, 5, 10]);
    expect(NEONATAL_OXYGEN_TARGETS.map((item) => item.target)).toEqual(["65–70%", "70–75%", "75–80%", "80–85%", "85–95%"]);
    expect(NEONATAL_SOURCES.some((source) => source.url.includes("cpr.heart.org") && source.year === 2025)).toBe(true);
  });
});
