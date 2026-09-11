"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { valueAtZ, tableRange } from "@/lib/calc/anthropometry";
import type { GrowthIndicator, GrowthSex } from "@/lib/types";

const TITLES: Record<string, string> = {
  "weight-for-age": "Berat badan menurut usia (0–60 bulan)",
  "length-height-for-age": "Panjang/tinggi badan menurut usia (0–60 bulan)",
  "bmi-for-age": "IMT menurut usia (0–60 bulan)",
  "head-circumference-for-age": "Lingkar kepala menurut usia (0–60 bulan)",
};

const Z_LINES = [-3, -2, -1, 0, 1, 2, 3];
const COLORS = ["#f43f5e", "#f59e0b", "#eab308", "#10b981", "#14b8a6", "#3b82f6", "#8b5cf6"];

export default function GrowthChart({
  indicator,
  sex,
  ageMonths,
  measurement,
}: {
  indicator: GrowthIndicator;
  sex: GrowthSex;
  ageMonths: number;
  measurement: number;
}) {
  const data = useMemo(() => {
    const range = tableRange(indicator, sex);
    if (!range) return [];
    const step = Math.max(1, Math.ceil((range.max - range.min) / 60));
    const rows: Record<string, number | string>[] = [];
    for (let x = range.min; x <= range.max; x += step) {
      const row: Record<string, number | string> = { x };
      for (const z of Z_LINES) row[`z${z}`] = Math.round(valueAtZ(indicator, sex, x, z) * 100) / 100;
      rows.push(row);
    }
    return rows;
  }, [indicator, sex]);

  const range = tableRange(indicator, sex);
  const inRange = ageMonths >= (range?.min ?? -1) && ageMonths <= (range?.max ?? -1);

  return (
    <div className="workspace-panel p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{TITLES[indicator] ?? indicator}</h3>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> pasien
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
            <XAxis dataKey="x" type="number" domain={["dataMin", "dataMax"]} tick={{ fontSize: 10, fill: "currentColor" }} label={{ value: indicator.includes("weight-for-") && !indicator.includes("age") ? "Panjang/tinggi (cm)" : "Usia (bulan)", position: "insideBottom", offset: -2, fontSize: 10 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10, fill: "currentColor" }} width={40} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
              formatter={(value, name) => [String(value), `z ${String(name).replace("z", "")}`]}
              labelFormatter={(l) => (indicator.includes("weight-for-") && !indicator.includes("age") ? `${l} cm` : `${l} bulan`)}
            />
            {Z_LINES.map((z, i) => (
              <Line
                key={z}
                type="monotone"
                dataKey={`z${z}`}
                stroke={COLORS[i]}
                strokeWidth={z === 0 ? 1.5 : 1}
                strokeDasharray={z === 0 ? undefined : "4 3"}
                dot={false}
                isAnimationActive={false}
              />
            ))}
            {inRange && (
              <ReferenceDot x={ageMonths} y={measurement} r={5} fill="#10b981" stroke="#fff" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-[10px] leading-relaxed text-zinc-400">
        Kurva z −3 sampai +3 berdasarkan parameter LMS Standar Pertumbuhan Anak WHO.
      </p>
    </div>
  );
}
