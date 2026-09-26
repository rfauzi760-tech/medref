"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { assessGrowth, ageInMonths, ageLabel, valueAtZ } from "@/lib/calc/anthropometry";
import type { GrowthIndicator, GrowthSex } from "@/lib/types";
import { CopyButton, PrintButton } from "@/components/action-buttons";
import { SourceBlock } from "@/components/source-block";
import { PageHeader } from "@/components/shared";

const GrowthChart = dynamic(() => import("@/components/growth-chart"), { ssr: false, loading: () => <div className="h-72 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" /> });

const INDICATOR_LABELS: Record<string, string> = {
  "weight-for-age": "Berat badan menurut usia",
  "length-height-for-age": "Panjang/tinggi badan menurut usia",
  "weight-for-length-height": "Berat badan menurut panjang/tinggi badan",
  "bmi-for-age": "IMT menurut usia",
  "head-circumference-for-age": "Lingkar kepala menurut usia",
};

export default function AnthropometryPage() {
  const [sex, setSex] = useState<GrowthSex>("male");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [head, setHead] = useState("");
  const [touched, setTouched] = useState(false);

  const ageMonths = useMemo(() => (dob ? ageInMonths(new Date(dob)) : NaN), [dob]);
  const isUnderTwo = ageMonths < 24;
  const lhCm = isUnderTwo ? lengthCm : heightCm;

  const result = useMemo(() => {
    if (!(ageMonths >= 0) || ageMonths > 60) return null;
    return assessGrowth({
      sex,
      ageMonths,
      weightKg: weight ? Number(weight) : undefined,
      lengthCm: lengthCm ? Number(lengthCm) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      headCircumferenceCm: head ? Number(head) : undefined,
    });
  }, [sex, ageMonths, weight, lengthCm, heightCm, head]);

  const showResults = touched && result !== null && result.assessments.length > 0 && (weight !== "" || lhCm !== "");

  const copyText = useMemo(() => {
    if (!result || !showResults) return "";
    const lines = [
      `Antropometri Anak (Standar Pertumbuhan Anak WHO 2006)`,
      `Jenis kelamin: ${sex === "male" ? "laki-laki" : "perempuan"} · Usia: ${ageLabel(ageMonths)}`,
    ];
    if (result.bmi) lines.push(`BMI: ${result.bmi.toFixed(1)} kg/m²`);
    for (const a of result.assessments) {
      lines.push(`• ${INDICATOR_LABELS[a.indicator] ?? a.indicator}: z ${a.z} (P${a.percentile.toFixed(0)})${a.classification ? ` - ${a.classification}` : ""}`);
    }
    lines.push("Sumber: Standar Pertumbuhan Anak WHO (2006)");
    return lines.join("\n");
  }, [result, showResults, sex, ageMonths]);

  const chartIndicators = useMemo(() => {
    const list: GrowthIndicator[] = ["weight-for-age", "length-height-for-age", "bmi-for-age", "head-circumference-for-age"];
    return list.filter((i) => {
      if (i === "weight-for-age") return weight !== "";
      if (i === "length-height-for-age") return lhCm !== "";
      if (i === "bmi-for-age") return weight !== "" && lhCm !== "";
      return head !== "";
    });
  }, [weight, lhCm, head]);

  return (
    <div>
      <PageHeader
        title="Antropometri Anak"
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Form */}
        <div className="workspace-panel space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Jenis kelamin</label>
              <div className="flex gap-2">
                {(["male", "female"] as GrowthSex[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`focus-ring flex-1 rounded-md border px-3 py-2 text-sm capitalize ${sex === s ? "border-accent bg-accent/10 text-ink" : "border-line hover:border-accent/50"}`}
                  >
                    {s === "male" ? "Laki-laki" : "Perempuan"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Tanggal lahir</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  setTouched(true);
                }}
                className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Berat badan (kg)</label>
              <input
                type="number"
                min={0.1}
                step={0.01}
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setTouched(true);
                }}
                placeholder="mis. 9,5"
                className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {isUnderTwo ? "Panjang badan (cm, telentang)" : "Tinggi badan (cm, berdiri)"}
              </label>
              <input
                type="number"
                min={30}
                max={130}
                step={0.1}
                value={isUnderTwo ? lengthCm : heightCm}
                onChange={(e) => {
                  setTouched(true);
                  if (isUnderTwo) setLengthCm(e.target.value);
                  else setHeightCm(e.target.value);
                }}
                placeholder="mis. 75"
                className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Lingkar kepala (cm, opsional)</label>
              <input
                type="number"
                min={20}
                max={60}
                step={0.1}
                value={head}
                onChange={(e) => {
                  setHead(e.target.value);
                  setTouched(true);
                }}
                placeholder="mis. 46"
                className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
              />
            </div>
          </div>

          {ageMonths >= 0 && !isNaN(ageMonths) && (
            <p className="text-xs text-zinc-400">
              Usia: <span className="font-medium text-zinc-600 dark:text-zinc-300">{ageLabel(ageMonths)}</span>
              {ageMonths > 60 && <span className="ml-2 text-amber-600 dark:text-amber-400"> - Standar WHO hanya mencakup usia 0–60 bulan.</span>}
            </p>
          )}
        </div>

        {/* Result */}
        <div className="space-y-3">
          <div className="workspace-panel p-5 lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Penilaian</h2>
              <div className="flex gap-2">
                <CopyButton text={copyText} />
                <PrintButton />
              </div>
            </div>

            {!showResults ? (
              <p className="py-8 text-center text-sm text-zinc-400">
                Masukkan tanggal lahir dan minimal satu pengukuran berat atau panjang/tinggi badan.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {result!.status.stunting && <StatusPill label={`Stunting: ${result!.status.stunting}`} tone="danger" />}
                {result!.status.wasting && <StatusPill label={`Wasting: ${result!.status.wasting}`} tone="danger" />}
                {result!.status.underweight && <StatusPill label={`Berat badan kurang: ${result!.status.underweight}`} tone="warning" />}
                {result!.status.overweight && <StatusPill label={`Gizi lebih/obesitas: ${result!.status.overweight}`} tone="warning" />}
                {result!.status.thinness && <StatusPill label={`Kurus: ${result!.status.thinness}`} tone="warning" />}
                {Object.keys(result!.status).length === 0 && <StatusPill label="Pertumbuhan dalam rentang normal" tone="success" />}

                {result!.bmi && (
                  <div className="flex items-baseline justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60">
                    <span className="text-zinc-500 dark:text-zinc-400">BMI</span>
                    <span className="font-semibold">{result!.bmi.toFixed(1)} kg/m²</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  {result!.assessments.map((a) => (
                    <div key={a.indicator} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">{INDICATOR_LABELS[a.indicator] ?? a.indicator}</span>
                        <span className="font-mono text-sm font-semibold">
                          z {a.z > 0 ? "+" : ""}{a.z}
                          <span className="ml-2 text-xs font-normal text-zinc-400">P{a.percentile.toFixed(0)}</span>
                        </span>
                      </div>
                      {a.classification && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{a.classification}</p>}
                    </div>
                  ))}
                </div>

                {result!.messages.map((m) => (
                  <p key={m} className="text-xs text-zinc-400">{m}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      {showResults && chartIndicators.length > 0 && ageMonths >= 0 && ageMonths <= 60 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Grafik pertumbuhan (standar WHO)</h2>
          {chartIndicators.map((ind) => (
            <GrowthChart
              key={ind}
              indicator={ind}
              sex={sex}
              ageMonths={ageMonths}
              measurement={
                ind === "weight-for-age"
                  ? Number(weight)
                  : ind === "length-height-for-age"
                    ? Number(lhCm)
                    : ind === "bmi-for-age"
                      ? Number(weight) / (Number(lhCm) / 100) ** 2
                      : Number(head)
              }
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <SourceBlock
          source={{ org: "WHO", title: "WHO Child Growth Standards", year: 2006, url: "https://www.who.int/tools/child-growth-standards" }}
          lastReviewed="2025-06-01"
        />
      </div>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "success" | "warning" | "danger" }) {
  const cls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
        : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200";
  return <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${cls}`}>{label}</div>;
}
