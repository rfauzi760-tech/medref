import { describe, expect, it } from "vitest";
import { evaluateScore, isComplete, scoreToText } from "@/lib/calc/scores";
import { SCORES } from "@/lib/data/scores";
import { requiresServerScoreCalculation } from "@/lib/score-public";
function tool(slug: string) {
  const t = SCORES.find((x) => x.slug === slug);
  if (!t) throw new Error(`missing tool ${slug}`);
  return t;
}

describe("client-side score processing", () => {
  it("keeps most scoring tools calculable without a Worker request", () => {
    const localScores = SCORES.filter((score) => !requiresServerScoreCalculation(score));
    expect(localScores.length).toBeGreaterThan(SCORES.length / 2);
  });
});

describe("qSOFA", () => {
  const q = tool("qsofa");
  it("can be evaluated in the browser without a Worker request", () => {
    expect(requiresServerScoreCalculation(q)).toBe(false);
  });

  it("scores 0 for a normal patient", () => {
    const ev = evaluateScore(q, { rr: "0", sbp: "0", gcs: "0" });
    expect(ev.total).toBe(0);
    expect(ev.range?.category).toBe("Risiko rendah");
  });
  it("scores 3 when all three criteria present", () => {
    const ev = evaluateScore(q, { rr: "1", sbp: "1", ment: "1" });
    expect(ev.total).toBe(3);
    expect(ev.range?.category).toBe("Risiko tinggi");
  });
  it("flags missing required input", () => {
    const ev = evaluateScore(q, { rr: "1" });
    expect(ev.missing.length).toBeGreaterThan(0);
    expect(isComplete(q, { rr: "1" })).toBe(false);
  });
});

describe("CURB-65", () => {
  const c = tool("curb65");
  it("scores 0 for low-risk patient (age < 65, none present)", () => {
    const ev = evaluateScore(c, {
      confusion: "0",
      urea: "0",
      rr: "0",
      bp: "0",
      age: "0",
    });
    expect(ev.total).toBe(0);
  });
  it("scores 5 when all present", () => {
    const ev = evaluateScore(c, {
      confusion: "1",
      urea: "1",
      rr: "1",
      bp: "1",
      age: "1",
    });
    expect(ev.total).toBe(5);
  });
});

describe("identitas pilihan dengan poin yang sama", () => {
  it("membedakan pria dan wanita pada PSI serta menerapkan pengurang wanita", () => {
    const psi = tool("psi");
    const male = evaluateScore(psi, { age: 40, sex: "sex::0" });
    const female = evaluateScore(psi, { age: 40, sex: "sex::1" });

    expect(male.perVariable.find((item) => item.id === "sex")?.selected).toBe("Male");
    expect(female.perVariable.find((item) => item.id === "sex")?.selected).toBe("Female");
    expect(male.appliedModifiers).toHaveLength(0);
    expect(female.appliedModifiers).toEqual([expect.objectContaining({ delta: -10 })]);
    expect(female.total).toBe(male.total - 10);
  });

  it("membedakan setiap pilihan yang berbagi jumlah poin di seluruh skor", () => {
    for (const score of SCORES) {
      for (const variable of score.variables) {
        for (const [index, option] of (variable.options ?? []).entries()) {
          const duplicates = variable.options?.filter((candidate) => candidate.value === option.value).length ?? 0;
          if (duplicates < 2) continue;
          const evaluation = evaluateScore(score, { [variable.id]: `${variable.id}::${index}` });
          expect(evaluation.perVariable.find((item) => item.id === variable.id)?.selected).toBe(option.label);
        }
      }
    }
  });
});

describe("GCS", () => {
  const g = tool("gcs");
  it("scores 15 for fully alert patient", () => {
    const ev = evaluateScore(g, { eye: "4", verbal: "5", motor: "6" });
    expect(ev.total).toBe(15);
  });
  it("scores 3 for unresponsive patient", () => {
    const ev = evaluateScore(g, { eye: "1", verbal: "1", motor: "1" });
    expect(ev.total).toBe(3);
  });
  it("handles a middle case (E3V4M5 = 12)", () => {
    const ev = evaluateScore(g, { eye: "3", verbal: "4", motor: "5" });
    expect(ev.total).toBe(12);
  });
});

describe("Wells PE (3-level)", () => {
  const w = tool("wells-pe");
  it("applies the -3 modifier when no prior DVT/PE", () => {
    const ev = evaluateScore(w, {
      dvt: "0",
      mostLikely: "3",
      hr: "1.5",
      immobil: "0",
      prior: "0",
      hemoptysis: "0",
      malignancy: "0",
    });
    // 3 (PE most likely) + 1.5 (HR > 100) - 3 (prior DVT absent) = 1.5
    expect(ev.total).toBeCloseTo(1.5);
    expect(ev.appliedModifiers.length).toBe(1);
  });
});

describe("PERC", () => {
  const p = tool("perc");
  it("all low-risk attributes -> 8 points -> PE ruled out", () => {
    const ev = evaluateScore(p, {
      age50: "1",
      hr100: "1",
      spo2: "1",
      hemoptysis: "1",
      estrogen: "1",
      prior: "1",
      leg: "1",
      surgery: "1",
    });
    expect(ev.total).toBe(8);
    expect(ev.range?.category).toBe("PERC negatif");
  });
});

describe("HEART score", () => {
  const h = tool("heart");
  it("scores 0 with all low-risk findings", () => {
    const ev = evaluateScore(h, {
      history: "0",
      ecg: "0",
      age: "0",
      riskFactors: "0",
      troponin: "0",
    });
    expect(ev.total).toBe(0);
  });
  it("scores 10 with all high-risk findings", () => {
    const ev = evaluateScore(h, {
      history: "2",
      ecg: "2",
      age: "2",
      rf: "2",
      trop: "2",
    });
    expect(ev.total).toBe(10);
  });
  it("classifies 4 as moderate risk", () => {
    const ev = evaluateScore(h, {
      history: "1",
      ecg: "1",
      age: "0",
      rf: "1",
      trop: "1",
    });
    expect(ev.total).toBe(4);
    expect(ev.range?.category).toBe("Risiko sedang");
  });
});

describe("Sarnat staging (compute hook)", () => {
  const s = tool("sarnat");
  it("retains server evaluation for custom clinical rules", () => {
    expect(requiresServerScoreCalculation(s)).toBe(true);
  });

  it("classifies mild (stage 1) for a full-term infant with hyperalertness", () => {
    const ev = evaluateScore(s, { ga: "term", level: "hyperalert" });
    expect(ev.total).toBe(1);
    expect(ev.computeDetail).toBeDefined();
  });
  it("classifies severe (stage 3) for stupor/coma", () => {
    const ev = evaluateScore(s, { ga: "term", conscious: "3" });
    expect(ev.total).toBe(3);
  });
});

describe("KDIGO AKI staging (compute hook)", () => {
  const k = tool("kdigo-aki");
  it("stage 1 with creatinine rise 1.6x baseline", () => {
    const ev = evaluateScore(k, { baseline: "1.0", current: "1.6", uopLow: "0", rrt: "0" });
    expect(ev.total).toBe(1);
  });
  it("stage 3 with RRT", () => {
    const ev = evaluateScore(k, { baseline: "1.0", current: "1.0", uopLow: "0", rrt: "1" });
    expect(ev.total).toBe(3);
  });
});

describe("scoreToText", () => {
  it("produces a copyable multi-line summary", () => {
    const q = tool("qsofa");
    const ev = evaluateScore(q, { rr: "1", sbp: "0", ment: "1" });
    const text = scoreToText(q, ev);
    expect(text).toContain("qSOFA");
    expect(text).toContain("Skor total: 2");
  });
});

describe("Siriraj Stroke Score", () => {
  const s = tool("siriraj-stroke-score");

  it("menghitung contoh infark dan perdarahan", () => {
    const infarction = evaluateScore(s, { consciousness: "consciousness::0", vomiting: "vomiting::0", headache: "headache::0", dbp: 80, atheroma: "atheroma::0" });
    const hemorrhage = evaluateScore(s, { consciousness: "consciousness::2", vomiting: "vomiting::1", headache: "headache::1", dbp: 120, atheroma: "atheroma::0" });
    expect(infarction.total).toBe(-4);
    expect(infarction.range?.category).toBe("Mengarah ke infark");
    expect(infarction.perVariable.find((item) => item.id === "dbp")?.points).toBe(8);
    expect(hemorrhage.total).toBe(9);
    expect(hemorrhage.range?.category).toBe("Mengarah ke perdarahan");
  });

  it("menggolongkan skor minus satu sampai satu sebagai tidak pasti", () => {
    const ev = evaluateScore(s, { consciousness: "consciousness::0", vomiting: "vomiting::0", headache: "headache::0", dbp: 120, atheroma: "atheroma::0" });
    expect(ev.total).toBe(0);
    expect(ev.range?.category).toBe("Tidak pasti");
  });

  it("mewajibkan semua input", () => {
    const ev = evaluateScore(s, { consciousness: "0", vomiting: "0" });
    expect(ev.missing).toEqual(expect.arrayContaining(["Nyeri kepala", "Tekanan darah diastolik", "Penanda ateroma"]));
  });
});
