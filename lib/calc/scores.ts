import type { ScoreEvaluation, ScoreOption, ScoreTool, ScoreValues, ScoreVariable } from "@/lib/types";

export function scoreSelectionKey(variableId: string, optionIndex: number): string {
  return `${variableId}::${optionIndex}`;
}

function resolveOption(variable: ScoreVariable, raw: ScoreValues[string]): { option: ScoreOption; index: number } | undefined {
  const options = variable.options ?? [];
  const keyedIndex = typeof raw === "string" && raw.startsWith(`${variable.id}::`)
    ? Number.parseInt(raw.slice(variable.id.length + 2), 10)
    : Number.NaN;
  if (Number.isInteger(keyedIndex) && options[keyedIndex]) return { option: options[keyedIndex], index: keyedIndex };
  const index = options.findIndex((option) => String(option.value) === String(raw));
  return index >= 0 ? { option: options[index], index } : undefined;
}

export function normalizedScoreValues(tool: ScoreTool, values: ScoreValues): ScoreValues {
  const normalized = { ...values };
  for (const variable of tool.variables) {
    if (variable.type !== "select") continue;
    const resolved = resolveOption(variable, values[variable.id]);
    if (resolved) normalized[variable.id] = resolved.option.value;
  }
  return normalized;
}

export function visibleScoreVariableIds(tool: ScoreTool, values: ScoreValues): string[] {
  const normalized = normalizedScoreValues(tool, values);
  return tool.variables
    .filter((variable) => !(variable.hideWhen && variable.hideWhen(normalized)))
    .map((variable) => variable.id);
}

/**
 * Evaluate a scoring tool / clinical rule against answered values.
 * Pure function - UI-independent and fully testable.
 */
export function evaluateScore(tool: ScoreTool, values: ScoreValues): ScoreEvaluation {
  const perVariable: ScoreEvaluation["perVariable"] = [];
  const missing: string[] = [];
  const normalized = normalizedScoreValues(tool, values);

  for (const v of tool.variables) {
    if (v.hideWhen && v.hideWhen(normalized)) continue;
    const raw = values[v.id];
    let selected = "";
    let points = 0;
    let answered = false;

    if (v.type === "select") {
      const resolved = resolveOption(v, raw);
      if (resolved) {
        answered = true;
        points = resolved.option.value;
        selected = resolved.option.label;
      } else if (raw !== undefined && raw !== "") {
        missing.push(v.label);
      }
    } else if (v.type === "bool") {
      const s = String(raw);
      if (s === "true" || s === "1") {
        answered = true;
        points = v.options?.[0]?.value ?? 1;
        selected = "Ya";
      } else if (s === "false" || s === "0") {
        answered = true;
        points = 0;
        selected = "Tidak";
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
    const res = tool.compute(normalized);
    total = res.total;
    computeDetail = res.detail;
  }

  const appliedModifiers: ScoreEvaluation["appliedModifiers"] = [];
  for (const m of tool.modifiers ?? []) {
    const variable = tool.variables.find((candidate) => candidate.id === m.whenVar);
    const resolved = variable ? resolveOption(variable, values[m.whenVar]) : undefined;
    const matchesValue = String(normalized[m.whenVar]) === String(m.whenValue);
    const matchesLabel = resolved?.option.label.toLowerCase() === String(m.whenValue).toLowerCase();
    if (matchesValue || matchesLabel) {
      total += m.delta;
      appliedModifiers.push({ note: m.note ?? `Pengubah: ${m.whenVar} = ${m.whenValue}`, delta: m.delta });
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
    `Skor total: ${ev.total}${ev.range ? ` - ${ev.range.category}: ${ev.range.label}` : ""}`,
  ];
  if (ev.computeDetail) lines.push(ev.computeDetail);
  for (const p of ev.perVariable) {
    if (p.selected) lines.push(`• ${p.label}: ${p.selected} (${p.points} poin)`);
  }
  for (const m of ev.appliedModifiers) lines.push(`• ${m.note} (${m.delta > 0 ? "+" : ""}${m.delta} poin)`);
  if (ev.range?.action) lines.push(`Langkah berikut: ${ev.range.action}`);
  if (tool.source) lines.push(`Sumber: ${tool.source.org}, ${tool.source.title} (${tool.source.year})`);
  lines.push("Hanya alat bantu keputusan klinis. Tidak menggantikan penilaian klinis.");
  return lines.join("\n");
}
