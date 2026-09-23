"use client";

import { useMemo, useState } from "react";
import { assessImmunization, immunizationSummary, type ReceivedDose } from "@/lib/calc/immunization";
import type { ImmunizationSchedule } from "@/lib/types";
import { PageHeader } from "@/components/shared";
import { SourceBlock } from "@/components/source-block";
import { PrintButton } from "@/components/action-buttons";

type Filter = "all" | "due" | "overdue" | "upcoming" | "done";

export default function ImmunizationPageClient({ schedule }: { schedule: ImmunizationSchedule }) {
  const [dob, setDob] = useState("");
  const [received, setReceived] = useState<ReceivedDose[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [touched, setTouched] = useState(false);

  const dobDate = useMemo(() => (dob ? new Date(dob) : null), [dob]);

  const assessments = useMemo(() => {
    if (!dobDate) return [];
    return assessImmunization({ schedule: schedule, dob: dobDate, received });
  }, [dobDate, received]);

  const summary = useMemo(() => (assessments.length ? immunizationSummary(assessments) : null), [assessments]);

  const toggleDose = (vaccineId: string, doseNumber: number) => {
    setTouched(true);
    setReceived((prev) => {
      const exists = prev.some((r) => r.vaccineId === vaccineId && r.doseNumber === doseNumber);
      if (exists) return prev.filter((r) => !(r.vaccineId === vaccineId && r.doseNumber === doseNumber));
      const vaccine = schedule.vaccines.find((v) => v.id === vaccineId);
      const dose = vaccine?.doses.find((d) => d.doseNumber === doseNumber);
      const dueDate = dose ? addMonths(dobDate!, dose.dueAgeMonths) : new Date();
      return [...prev, { vaccineId, doseNumber, date: dueDate.toISOString().slice(0, 10) }];
    });
  };

  const visible = useMemo(() => {
    if (!assessments.length) return [];
    return assessments
      .map((a) => ({
        ...a,
        doses: a.doses.filter((d) => (filter === "all" ? true : d.status.state === filter)),
      }))
      .filter((a) => a.doses.length > 0);
  }, [assessments, filter]);

  return (
    <div>
      <PageHeader
        title="Imunisasi"
        description="Jadwal imunisasi anak Indonesia (Kemenkes RI / IDAI). Masukkan tanggal lahir dan tandai dosis yang telah diterima untuk melihat yang jatuh tempo, akan datang, atau terlambat."
      />

      <div className="workspace-panel mb-6 grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Tanggal lahir anak</label>
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
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">Ringkasan</label>
          {summary ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">✓ {summary.done} selesai</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">Jatuh tempo {summary.due}</span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 dark:bg-red-950 dark:text-red-200">Terlambat {summary.overdue}</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">Akan datang {summary.upcoming}</span>
            </div>
          ) : (
            <p className="pt-2 text-xs text-zinc-400">Masukkan tanggal lahir untuk melihat jadwal.</p>
          )}
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center text-sm text-zinc-400 dark:border-zinc-700">
          Masukkan tanggal lahir anak untuk menghitung status imunisasi.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700">
              {(
                [
                  ["all", "Semua"],
                  ["due", "Jatuh tempo"],
                  ["overdue", "Terlambat"],
                  ["upcoming", "Akan datang"],
                  ["done", "Selesai"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${filter === key ? "bg-accent-button text-accent-ink" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <PrintButton />
            </div>
          </div>

          <div className="space-y-2">
            {visible.map((a) => (
              <div key={a.vaccineId} className="workspace-panel p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{a.shortName}</span>
                  <h3 className="text-sm font-semibold">{a.vaccineName}</h3>
                </div>
                <div className="mt-3 space-y-1.5">
                  {a.doses.map((d) => (
                    <div key={d.doseNumber} className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
                      <button
                        type="button"
                        onClick={() => toggleDose(a.vaccineId, d.doseNumber)}
                        aria-label={`Tandai ${a.vaccineName} dosis ${d.doseNumber}`}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                          d.status.state === "done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-zinc-300 text-transparent dark:border-zinc-600"
                        }`}
                      >
                        ✓
                      </button>
                      <span className="text-sm text-zinc-700 dark:text-zinc-200">
                        Dosis {d.doseNumber} - {d.label}
                      </span>
                      {d.status.state === "done" ? (
                        <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {d.receivedDate ?? "Done"}
                        </span>
                      ) : (
                        <span className="ml-auto text-xs text-zinc-400">
                          jendela {d.dueStart} – {d.dueEnd}
                        </span>
                      )}
                      {d.status.state === "due" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">JATUH TEMPO</span>
                      )}
                      {d.status.state === "overdue" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800 dark:bg-red-950 dark:text-red-200">TERLAMBAT</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <p className="rounded-xl border border-dashed border-zinc-300 py-8 text-center text-sm text-zinc-400 dark:border-zinc-700">
                Tidak ada dosis pada kategori ini.
              </p>
            )}
          </div>

          <p className="text-xs leading-relaxed text-zinc-400">
            Waktu pemberian mengikuti jadwal dasar Kemenkes RI dengan rekomendasi IDAI. Dosis kejar (catch-up) harus mengikuti
            pedoman nasional terkini - konsultasikan dengan dokter anak bila imunisasi anak tertunda.
          </p>
        </div>
      )}

      <div className="mt-8">
        <SourceBlock source={schedule.source} lastReviewed="2025-06-01" />
      </div>
    </div>
  );
}

function addMonths(d: Date, months: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + Math.round(months));
  return out;
}
