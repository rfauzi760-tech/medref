import { describe, expect, it } from "vitest";
import { evaluateScore, isComplete, scoreToText } from "@/lib/calc/scores";
import { SCORES } from "@/lib/data/scores";

function tool(slug: string) {
  const t = SCORES.find((x) => x.slug === slug);
  if (!t) throw new Error(`missing tool ${slug}`);
  return t;
}

describe("qSOFA", () => {
  const q = tool("qsofa");
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
