"use client";

import { useMemo, useState } from "react";
import { generateMealPlan, estimateEnergyRequirement, formatTotalsLine, nutrientsFor, addTotals, emptyTotals } from "@/lib/calc/nutrition";
import { foods, foodCategories } from "@/lib/data/foods";
import { PageHeader } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";
import { CopyButton, PrintButton } from "@/components/action-buttons";
import { Minus, Plus } from "lucide-react";

type Activity = "sedentary" | "light" | "moderate" | "active";

export default function MealPlannerPage() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  const [age, setAge] = useState("30");
  const [activity, setActivity] = useState<Activity>("light");
  const [kcalTarget, setKcalTarget] = useState("");
  const [proteinTarget, setProteinTarget] = useState("");
  const [excluded, setExcluded] = useState<string[]>([]);
  const [seed, setSeed] = useState(1);
  const [customItems, setCustomItems] = useState<{ foodId: string; grams: number; meal: number }[]>([]);
  const [addFood, setAddFood] = useState("");
  const [addMeal, setAddMeal] = useState(0);

  const estimated = useMemo(
    () => estimateEnergyRequirement({ sex, weightKg: Number(weight) || 0, heightCm: Number(height) || 0, ageYears: Number(age) || 0, activity }),
    [sex, weight, height, age, activity],
  );

  const target = useMemo(() => {
    const kcal = Number(kcalTarget) || estimated.kcal;
    const proteinG = Number(proteinTarget) || estimated.proteinG;
    return { kcal, proteinG, excludeCategories: excluded, seed };
  }, [kcalTarget, proteinTarget, estimated, excluded, seed]);

  const plan = useMemo(() => generateMealPlan(foods, target), [target]);

  // Merge custom items into the plan
  const withCustom = useMemo(() => {
    const meals = plan.meals.map((m, mi) => {
      const customs = customItems
        .filter((c) => c.meal === mi)
        .map((c) => {
          const food = foods.find((f) => f.id === c.foodId)!;
          return { food, grams: c.grams, totals: nutrientsFor(food, c.grams) };
        });
      return { ...m, items: [...m.items, ...customs], totals: customs.reduce((acc, c) => addTotals(acc, c.totals), m.totals) };
    });
    const totals = meals.reduce((acc, m) => addTotals(acc, m.totals), emptyTotals());
    return { meals, totals };
  }, [plan, customItems]);

  const toggleCategory = (c: string) => {
    setExcluded((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const addCustom = () => {
    if (!addFood) return;
    setCustomItems((prev) => [...prev, { foodId: addFood, grams: 100, meal: addMeal }]);
    setAddFood("");
  };

  const planText = useMemo(() => {
    const lines = [`Rencana makan (target ${target.kcal} kcal, protein ${target.proteinG} g)`];
    for (const m of withCustom.meals) {
      lines.push(`\n${m.name}: ${formatTotalsLine(m.totals)}`);
      for (const i of m.items) lines.push(`  • ${i.food.name} - ${i.grams} g (${i.totals.kcal.toFixed(0)} kcal)`);
    }
    lines.push(`\nTotal harian: ${formatTotalsLine(withCustom.totals)}`);
    lines.push("Sumber: basis data pangan terstruktur dengan nilai per 100 g.");
    return lines.join("\n");
  }, [withCustom, target]);

  return (
    <div>
      <PageHeader
        title="Perencana Makan"
        description="Buat rencana makan terstruktur dari database gizi - setiap kalori dan zat gizi dihitung dari data terstruktur, tidak pernah dikarang. Sesuaikan target atau kecualikan kategori sesuai kebutuhan."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-4">
          <div className="workspace-panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Pasien dan target</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                {(["male", "female"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSex(s)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${sex === s ? "border-accent bg-accent/5" : "border-zinc-200 dark:border-zinc-700"}`}
                  >
                    {s === "male" ? "Laki-laki" : "Perempuan"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Berat badan (kg)</label>
                  <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="focus-ring w-full rounded-md border border-line bg-surface px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Tinggi badan (cm)</label>
                  <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Usia (tahun)</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Tingkat aktivitas</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      ["sedentary", "Sedenter"],
                      ["light", "Ringan"],
                      ["moderate", "Sedang"],
                      ["active", "Aktif"],
                    ] as [Activity, string][]
                  ).map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setActivity(k)}
                      className={`rounded-lg border px-2 py-1.5 text-xs capitalize ${activity === k ? "border-accent bg-accent/5" : "border-zinc-200 dark:border-zinc-700"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
                Perkiraan kebutuhan (Mifflin-St Jeor): <span className="font-semibold">{estimated.kcal} kcal</span>, protein{" "}
                <span className="font-semibold">{estimated.proteinG} g</span>. Sesuaikan target di bawah bila perlu.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Target kalori</label>
                  <input type="number" value={kcalTarget} onChange={(e) => setKcalTarget(e.target.value)} placeholder={String(estimated.kcal)} className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Target protein (g)</label>
                  <input type="number" value={proteinTarget} onChange={(e) => setProteinTarget(e.target.value)} placeholder={String(estimated.proteinG)} className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500 dark:text-zinc-400">Pembatasan diet (kecualikan kelompok pangan)</label>
                <div className="flex flex-wrap gap-1.5">
                  {foodCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleCategory(c)}
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${excluded.includes(c) ? "border-red-300 bg-red-50 text-red-600 line-through dark:border-red-800 dark:bg-red-950 dark:text-red-300" : "border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Variasi</span>
                <button onClick={() => setSeed((s) => s + 1)} className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-300">
                  Buat ulang ↻
                </button>
              </div>
            </div>
          </div>

          <div className="workspace-panel p-5">
            <h2 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Tambahkan bahan pangan</h2>
            <div className="flex gap-2">
              <select value={addFood} onChange={(e) => setAddFood(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                <option value="">Pilih bahan pangan…</option>
                {foods.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <select value={addMeal} onChange={(e) => setAddMeal(Number(e.target.value))} className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                <option value={0}>Sarapan</option>
                <option value={1}>Makan siang</option>
                <option value={2}>Makan malam</option>
              </select>
              <button onClick={addCustom} className="rounded-lg bg-accent px-2.5 py-1.5 text-sm text-white hover:opacity-90">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {customItems.length > 0 && (
              <div className="mt-2 space-y-1">
                {customItems.map((c, i) => {
                  const f = foods.find((x) => x.id === c.foodId)!;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{f.name}</span>
                      <input
                        type="number"
                        value={c.grams}
                        onChange={(e) => setCustomItems((prev) => prev.map((p, pi) => (pi === i ? { ...p, grams: Number(e.target.value) || 0 } : p)))}
                        className="w-16 rounded border border-zinc-200 px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                      />
                      <span>g</span>
                      <button onClick={() => setCustomItems((prev) => prev.filter((_, pi) => pi !== i))} className="ml-auto text-zinc-400 hover:text-red-500">
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Plan */}
        <div className="space-y-3">
          <div className="workspace-panel flex items-center justify-between p-5">
            <div>
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Rencana makan</h2>
              <p className="text-xs text-zinc-400">
                {Math.round(withCustom.totals.kcal)} kcal · protein {withCustom.totals.protein.toFixed(0)} g ({Math.round(plan.proteinMet * 100)}% of target) · carbs {withCustom.totals.carbs.toFixed(0)} g · fat {withCustom.totals.fat.toFixed(0)} g
              </p>
            </div>
            <div className="flex gap-2">
              <CopyButton text={planText} />
              <PrintButton />
            </div>
          </div>

          {withCustom.meals.map((m, mi) => (
            <div key={mi} className="workspace-panel p-5">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{m.name}</h3>
                <span className="text-xs text-zinc-400">{formatTotalsLine(m.totals)}</span>
              </div>
              <div className="space-y-1">
                {m.items.map((item, ii) => (
                  <div key={ii} className="flex items-baseline justify-between gap-2 rounded bg-zinc-50 px-2.5 py-1.5 text-sm dark:bg-zinc-800/50">
                    <span className="text-zinc-700 dark:text-zinc-200">{item.food.name}</span>
                    <span className="shrink-0 font-mono text-xs text-zinc-400">
                      {item.grams} g · {Math.round(item.totals.kcal)} kcal · P {item.totals.protein.toFixed(0)}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <p className="text-xs leading-relaxed text-zinc-400">
            Rencana dibuat dari basis data pangan berdasarkan pembagian kalori per kelompok pangan. Sesuaikan dengan kondisi klinis,
            panduan gizi, dan ketersediaan pangan setempat.
          </p>

          <SourceBlock
            source={{ org: "Klinea", title: "Basis data komposisi pangan Indonesia", year: 2026, url: "https://www.klinea.id/app.html" }}
            lastReviewed="2026-09-11"
          />
        </div>
      </div>
    </div>
  );
}
