"use client";

import { useMemo, useState } from "react";
import type { MilestoneAge, MilestoneDomain } from "@/lib/types";
import { PageHeader } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";
import { PrintButton } from "@/components/action-buttons";

const milestoneDomains: { key: MilestoneDomain; label: string; icon: string }[] = [
  { key: "gross", label: "Motorik kasar", icon: "🏃" },
  { key: "fine", label: "Motorik halus", icon: "✋" },
  { key: "language", label: "Bahasa", icon: "💬" },
  { key: "social", label: "Sosial", icon: "🤝" },
  { key: "cognitive", label: "Kognitif", icon: "🧠" },
];

function milestoneForAge(items: MilestoneAge[], ageMonths: number): MilestoneAge | null {
  let best: MilestoneAge | null = null;
  for (const item of items) {
    if (ageMonths >= item.ageMonths) best = item;
  }
  return best ?? items[0] ?? null;
}

export default function DevelopmentPageClient({ milestoneAges }: { milestoneAges: MilestoneAge[] }) {
  const [dob, setDob] = useState("");
  const [ageMonths, setAgeMonths] = useState<number | "">("");

  const handleDob = (v: string) => {
    setDob(v);
    if (v) {
      const ms = Date.now() - new Date(v).getTime();
      setAgeMonths(Math.max(0, Math.round(ms / (30.4375 * 86400000))));
    }
  };

  const effectiveAge = typeof ageMonths === "number" ? ageMonths : NaN;

  const entry = useMemo(
    () => (Number.isFinite(effectiveAge) ? milestoneForAge(milestoneAges, effectiveAge) : null),
    [effectiveAge, milestoneAges],
  );
  const isClose = (m: number) => entry && Math.abs(m - effectiveAge) <= 2;

  return (
    <div>
      <PageHeader
        title="Perkembangan Anak"
        description="Tonggak perkembangan berdasarkan usia pada domain motorik kasar, motorik halus, bahasa, sosial, dan kognitif - disertai tanda bahaya yang memerlukan penilaian profesional."
      />

      <div className="workspace-panel mb-6 grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Tanggal lahir (opsional)</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => handleDob(e.target.value)}
            className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Atau usia (bulan)</label>
          <input
            type="number"
            min={0}
            max={72}
            step={1}
            value={ageMonths === "" ? "" : ageMonths}
            onChange={(e) => {
              setAgeMonths(e.target.value === "" ? "" : Number(e.target.value));
              if (e.target.value !== "") setDob("");
            }}
            placeholder="mis. 18"
            className="focus-ring w-full rounded-md border border-line bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>

      {!entry ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-400 dark:border-zinc-700">
          Masukkan tanggal lahir atau usia untuk melihat tonggak perkembangan yang sesuai.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold">
                Usia: {entry.label}
                {isClose(entry.ageMonths) ? "" : " (usia tonggak terdekat)"}
              </h2>
              <PrintButton />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {milestoneAges.map((m) => (
                <button
                  key={m.ageMonths}
                  onClick={() => {
                    setDob("");
                    setAgeMonths(m.ageMonths);
                  }}
                  className={`rounded-full border px-2.5 py-1 text-xs ${m.ageMonths === entry.ageMonths ? "border-accent bg-accent/10 font-semibold text-accent-strong dark:text-accent" : "border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {milestoneDomains.map((d) => {
              const items = entry.milestones[d.key] ?? [];
              return (
                <div key={d.key} className="workspace-panel p-5">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                    <span className="text-base">{d.icon}</span> {d.label}
                  </h3>
                  <ul className="clinical-list space-y-1.5">
                    {items.map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-900 dark:bg-zinc-900">
              <h3 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">Tanda bahaya perkembangan - rujuk bila ada</h3>
              <ul className="clinical-list space-y-1.5">
                {entry.redFlags.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-red-800/90 dark:text-red-200/90">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="workspace-panel p-5">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Aktivitas sesuai usia</h3>
              <ul className="clinical-list space-y-1.5">
                {entry.activities.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-zinc-400">
            Tonggak perkembangan disusun dari daftar periksa CDC “Learn the Signs. Act Early.” - alat bantu skrining, bukan diagnosis.
            Keterlambatan tonggak atau hilangnya kemampuan yang sudah dikuasai memerlukan penilaian perkembangan formal.
          </p>

          <SourceBlock source={entry.source} lastReviewed="2025-06-01" />
        </div>
      )}
    </div>
  );
}
