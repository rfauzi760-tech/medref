"use client";

import { useState } from "react";
import { CopyButton, ResetButton, SpecialtyTags } from "@/components/action-buttons";
import { useRecordVisit } from "@/components/use-local-store";
import { KPSP_AGE_FORMS, kpspAction, kpspCategory } from "@/lib/calc/kpsp";

const formUrl = "https://repositori-ditjen-nakes.kemkes.go.id/100/2/02Buku-KIA-06-10-2015-small.pdf";
const toneByCategory = {
  "Sesuai (S)": "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  "Meragukan (M)": "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  "Penyimpangan (P)": "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
};

export function KpspForm({ title, abbreviation, specialties }: { title: string; abbreviation?: string; specialties: string[] }) {
  useRecordVisit({ href: "/scores/kpsp", title, group: "scores" });
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(10).fill(null));
  const ageForm = KPSP_AGE_FORMS.find((form) => form.months === ageMonths);
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const yesCount = answers.filter((answer) => answer === true).length;
  const category = answeredCount === 10 ? kpspCategory(yesCount) : null;
  const summary = category && ageMonths !== null
    ? `KPSP usia ${ageMonths} bulan: ${yesCount}/10 jawaban YA, ${category}. ${kpspAction(category)}`
    : "";

  const chooseAge = (value: string) => {
    setAgeMonths(value ? Number(value) : null);
    setAnswers(Array(10).fill(null));
  };

  const reset = () => setAnswers(Array(10).fill(null));

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h1 className="display-type text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
            {abbreviation && <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 font-mono text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">{abbreviation}</span>}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">Pilih formulir sesuai kelompok usia anak. Semua butir dan gambar petunjuk ditampilkan dari formulir resmi Kemenkes.</p>
        </div>
        <SpecialtyTags specialties={specialties} />
      </div>

      <div className="workspace-panel overflow-hidden">
        <div className="section-band justify-between">
          <h2 className="display-type text-base font-bold">Formulir KPSP</h2>
          <ResetButton onReset={reset} />
        </div>
        <div className="space-y-4 p-4">
          <div className="max-w-sm space-y-1.5">
            <label htmlFor="kpsp-age" className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">Usia formulir</label>
            <select
              id="kpsp-age"
              value={ageMonths ?? ""}
              onChange={(event) => chooseAge(event.target.value)}
              className="focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
            >
              <option value="">Pilih usia anak</option>
              {KPSP_AGE_FORMS.map(({ months }) => <option key={months} value={months}>{months} bulan</option>)}
            </select>
          </div>

          {!ageForm ? (
            <p className="rounded-lg border border-[var(--line)] p-4 text-sm text-[var(--muted)]">Pilih salah satu dari 16 kelompok usia, mulai 3 hingga 72 bulan, untuk menampilkan formulirnya.</p>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Butir KPSP usia {ageForm.months} bulan</h3>
                  <a href={`${formUrl}#page=${ageForm.page}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-accent underline underline-offset-2">Buka formulir Kemenkes</a>
                </div>
                <p className="text-sm text-[var(--muted)]">Lihat pertanyaan, cara melakukan, dan gambar peragaan pada lembar resmi berikut, lalu catat jawaban setiap butir.</p>
                <iframe
                  key={ageForm.months}
                  src={`${formUrl}#page=${ageForm.page}&toolbar=0&navpanes=0`}
                  title={`Formulir KPSP Kemenkes usia ${ageForm.months} bulan`}
                  className="h-[72vh] max-h-[760px] min-h-[480px] w-full rounded-lg border border-[var(--line)] bg-white"
                  loading="lazy"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Jawaban</h3>
                  <p className="text-sm text-[var(--muted)]">Jawab seluruh 10 butir sesuai petunjuk pada formulir.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {answers.map((answer, index) => (
                    <fieldset key={index} className="rounded-lg border border-[var(--line)] p-3">
                      <legend className="px-1 text-sm font-medium">Butir {index + 1}</legend>
                      <div className="mt-2 flex gap-2">
                        {[true, false].map((value) => (
                          <button
                            key={String(value)}
                            type="button"
                            aria-pressed={answer === value}
                            onClick={() => setAnswers((previous) => previous.map((item, itemIndex) => itemIndex === index ? value : item))}
                            className={`focus-ring min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${answer === value ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"}`}
                          >
                            {value ? "Ya" : "Tidak"}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[var(--line)] pt-4" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Hasil</h3>
                  {category && <CopyButton text={summary} />}
                </div>
                {!category ? (
                  <p className="text-sm text-[var(--muted)]">{answeredCount}/10 butir terjawab. Hasil tampil setelah semua butir diisi.</p>
                ) : (
                  <div className={`rounded-lg border px-4 py-3 ${toneByCategory[category]}`}>
                    <div className="flex items-baseline gap-2"><span className="text-3xl font-bold">{yesCount}/10</span><span className="font-semibold">{category}</span></div>
                    <p className="mt-1 text-sm">{kpspAction(category)}</p>
                  </div>
                )}
              </div>
            </>
          )}

          <p className="text-xs leading-relaxed text-[var(--muted)]">KPSP adalah alat skrining, bukan penetapan diagnosis. Ikuti petunjuk pelaksanaan dan interpretasi pada pedoman Kemenkes; hasil perlu ditindaklanjuti tenaga kesehatan.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--line)] pt-3 text-xs">
            <a href={formUrl} target="_blank" rel="noreferrer" className="text-[var(--muted)] underline underline-offset-2">Buku KIA Kemenkes RI, lampiran formulir KPSP</a>
            <a href="https://p2.kemkes.go.id/wp-content/uploads/2025/05/Final_Pedoman-Nasional-Tata-Laksana-Klinis-Komunitas-dan-Lingkungan-Akibat-Pajanan-Timbal-Pada-Anak-dan-Ibu-Hamil.pdf" target="_blank" rel="noreferrer" className="text-[var(--muted)] underline underline-offset-2">Pedoman Kemenkes RI 2025</a>
          </div>
        </div>
      </div>
    </div>
  );
}
