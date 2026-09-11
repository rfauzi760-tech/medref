"use client";

import { useMemo, useState } from "react";
import { foods, foodCategories } from "@/lib/data/foods";
import { PageHeader, FilterInput, EmptyState } from "@/components/shared";

export default function NutritionPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return foods.filter((f) => {
      if (cat && f.category !== cat) return false;
      if (!query) return true;
      return f.name.toLowerCase().includes(query) || (f.nameId ?? "").toLowerCase().includes(query) || f.category.toLowerCase().includes(query);
    });
  }, [q, cat]);

  return (
    <div>
      <PageHeader
        title="Database Gizi"
        description="Data komposisi pangan (per 100 g bagian yang dapat dimakan) dari tabel komposisi pangan publik - dipakai perencana makan sehingga semua hitungan berasal dari data terstruktur."
        count={foods.length}
        countLabel="bahan pangan"
      />
      <FilterInput value={q} onChange={setQ} placeholder="Cari bahan pangan… mis. tempe, pisang, ikan kembung" />
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${!cat ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
        >
          All
        </button>
        {foodCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(cat === c ? "" : c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${cat === c ? "border-accent bg-accent/10 text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={`Tidak ada bahan pangan yang cocok dengan “${q}”.`} />
      ) : (
        <div className="workspace-panel index-row overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-400 dark:border-zinc-800">
                <th className="px-4 py-2.5 font-semibold">Bahan pangan</th>
                <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Kategori</th>
                <th className="px-4 py-2.5 text-right font-semibold">kcal</th>
                <th className="px-4 py-2.5 text-right font-semibold">Protein (g)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Karbohidrat (g)</th>
                <th className="px-4 py-2.5 text-right font-semibold">Lemak (g)</th>
                <th className="hidden px-4 py-2.5 text-right font-semibold md:table-cell">Serat (g)</th>
                <th className="hidden px-4 py-2.5 text-right font-semibold lg:table-cell">Na (mg)</th>
                <th className="hidden px-4 py-2.5 text-right font-semibold lg:table-cell">K (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((f) => (
                <tr key={f.id} className="index-row hover:bg-black/[0.025] dark:hover:bg-white/[0.04]">
                  <td className="px-4 py-2">
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">{f.name}</div>
                    {f.nameId && <div className="text-xs text-zinc-400">{f.nameId}</div>}
                  </td>
                  <td className="hidden px-4 py-2 text-xs text-zinc-400 sm:table-cell">{f.category}</td>
                  <td className="px-4 py-2 text-right font-semibold text-zinc-700 dark:text-zinc-200">{f.kcal}</td>
                  <td className="px-4 py-2 text-right text-zinc-600 dark:text-zinc-300">{f.protein}</td>
                  <td className="px-4 py-2 text-right text-zinc-600 dark:text-zinc-300">{f.carbs}</td>
                  <td className="px-4 py-2 text-right text-zinc-600 dark:text-zinc-300">{f.fat}</td>
                  <td className="hidden px-4 py-2 text-right text-zinc-500 dark:text-zinc-400 md:table-cell">{f.fiber ?? " - "}</td>
                  <td className="hidden px-4 py-2 text-right text-zinc-500 dark:text-zinc-400 lg:table-cell">{f.sodium ?? " - "}</td>
                  <td className="hidden px-4 py-2 text-right text-zinc-500 dark:text-zinc-400 lg:table-cell">{f.potassium ?? " - "}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-zinc-400">Nilai per 100 g bagian yang dapat dimakan. Sumber: data komposisi pangan Klinea.</p>
    </div>
  );
}
