import type { ScoreEvaluation, ScoreTool, ScoreValues } from "@/lib/types";

/**
 * Evaluate a scoring tool / clinical rule against answered values.
 * Pure function — UI-independent and fully testable.
 */
export function evaluateScore(tool: ScoreTool, values: ScoreValues): ScoreEvaluation {
  const perVariable: ScoreEvaluation["perVariable"] = [];
  const missing: string[] = [];

  for (const v of tool.variables) {
    if (v.hideWhen && v.hideWhen(values)) continue;
    const raw = values[v.id];
    let selected = "";
    let points = 0;
    let answered = false;

    if (v.type === "select") {
      const opt = v.options?.find((o) => String(o.value) === String(raw));
      if (opt) {
        answered = true;
        points = opt.value;
        selected = opt.label;
      } else if (raw !== undefined && raw !== "") {
        missing.push(v.label);
      }
    } else if (v.type === "bool") {
      const s = String(raw);
      if (s === "true" || s === "1") {
        answered = true;
        points = v.options?.[0]?.value ?? 1;
        selected = "Yes";
      } else if (s === "false" || s === "0") {
        answered = true;
        points = 0;
        selected = "No";
      }
    } else if (v.type === "number") {
      const n = typeof raw === "number" ? raw : parseFloat(String(raw ?? ""));
      if (Number.isFinite(n)) {
        answered = true;
        points = v.scale ? v.scale(n) : n;
        selected = `${n}${v.unit ? " " + v.unit : ""}`;
      }
    }

    if (v.required && !answered) missing.push(v.label);
    perVariable.push({ id: v.id, label: v.shortLabel ?? v.label, points, selected });
  }

  let total = perVariable.reduce((s, p) => s + p.points, 0);
  let computeDetail: string | undefined;
  if (tool.compute) {
    const res = tool.compute(values);
    total = res.total;
    computeDetail = res.detail;
  }

  const appliedModifiers: ScoreEvaluation["appliedModifiers"] = [];
  for (const m of tool.modifiers ?? []) {
    if (String(values[m.whenVar]) === String(m.whenValue)) {
      total += m.delta;
      appliedModifiers.push({ note: m.note ?? `Modifier: ${m.whenVar} = ${m.whenValue}`, delta: m.delta });
    }
  }

  const range = tool.ranges.find((r) => total >= r.min && total <= r.max) ?? undefined;

  const out: ScoreEvaluation = { total, range, perVariable, missing, appliedModifiers };
  if (computeDetail) (out as ScoreEvaluation & { computeDetail?: string }).computeDetail = computeDetail;
  return out;
}

/** True when every required variable has been answered. */
export function isComplete(tool: ScoreTool, values: ScoreValues): boolean {
  return evaluateScore(tool, values).missing.length === 0;
}

/** Text line used for the copy-result button. */
export function scoreToText(tool: ScoreTool, ev: ScoreEvaluation): string {
  const lines = [
    `${tool.title}${tool.abbreviation ? ` (${tool.abbreviation})` : ""}`,
    `Total score: ${ev.total}${ev.range ? ` — ${ev.range.category}: ${ev.range.label}` : ""}`,
  ];
  if (ev.computeDetail) lines.push(ev.computeDetail);
  for (const p of ev.perVariable) {
    if (p.selected) lines.push(`• ${p.label}: ${p.selected} (${p.points} pts)`);
  }
  for (const m of ev.appliedModifiers) lines.push(`• ${m.note} (${m.delta > 0 ? "+" : ""}${m.delta} pts)`);
  if (ev.range?.action) lines.push(`Next: ${ev.range.action}`);
  lines.push(`Source: ${tool.source.org}, ${tool.source.title} (${tool.source.year})`);
  lines.push("Clinical decision support only — does not replace clinical judgment.");
  return lines.join("\n");
}