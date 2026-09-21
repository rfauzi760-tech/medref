"use client";

import { useState } from "react";
import type { DosePreparation, Drug } from "@/lib/types";
import {
  areDoseUnitsCompatible,
  calculateDose,
  convertPrescribedDose,
  doseToText,
  getDoseOptions,
  NEONATAL_MAX_AGE_YEARS,
  parseDosePreparations,
  preparationMatchesRoute,
  resolveDosePopulation,
} from "@/lib/calc/drugs";
import { CopyButton, PrintButton } from "@/components/action-buttons";

type Population = "" | "adult" | "pediatric" | "neonatal";
type AgeUnit = "hari" | "bulan" | "tahun";

const inputClass = "focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none";
const labelClass = "mb-1 block text-xs font-bold text-[var(--muted)]";

function ageInYears(value: string, unit: AgeUnit): number | undefined {
  const parsed = Number(value);
  if (!value || !Number.isFinite(parsed)) return undefined;
  if (unit === "hari") return parsed / 365.25;
  if (unit === "bulan") return parsed / 12;
  return parsed;
}

function uniquePreparations(drug: Drug): DosePreparation[] {
  const items = [...(drug.dosePreparations ?? []), ...parseDosePreparations(drug.preparations ?? [])];
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

export function PediatricDoseForm({ drug, initialPediatricMode = false }: { drug: Drug; initialPediatricMode?: boolean }) {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<AgeUnit>("tahun");
  const [population, setPopulation] = useState<Population>("");
  const [doseIndex, setDoseIndex] = useState("");
  const [preparationId, setPreparationId] = useState("");
  const [manualDrugAmount, setManualDrugAmount] = useState("");
  const [manualCarrierAmount, setManualCarrierAmount] = useState("");
  const [manualCarrierUnit, setManualCarrierUnit] = useState<DosePreparation["carrierUnit"]>("mL");
  const [prescribedAmount, setPrescribedAmount] = useState("");

  const weightNumber = weight ? Number(weight) : undefined;
  const explicitAgeYears = ageInYears(age, ageUnit);
  const resolvedAgeYears = explicitAgeYears;
  const effectivePopulation = resolveDosePopulation({
    ageYears: resolvedAgeYears,
    population: population || undefined,
    pediatricMode: initialPediatricMode,
  });
  const options = getDoseOptions(drug, effectivePopulation, resolvedAgeYears);
  const selectedDoseIndex = doseIndex !== "" && options.some((option) => option.index === Number(doseIndex))
    ? Number(doseIndex)
    : options[0]?.index;
  const selectedEntry = selectedDoseIndex !== undefined ? drug.doses[selectedDoseIndex] : undefined;
  const doseUnit = selectedEntry?.weightBased?.doseUnit ?? "mg";
  const curatedPreparationsOnly = drug.curatedPreparationsOnly;
  const hasAutomaticDose = Boolean(selectedEntry?.weightBased || selectedEntry?.fixedDoseMg);
  const canConvertPreparation = Boolean(selectedEntry) && (!curatedPreparationsOnly || Boolean(drug.dosePreparations?.length));

  const availablePreparations = (curatedPreparationsOnly ? drug.dosePreparations ?? [] : uniquePreparations(drug)).filter((item) =>
    areDoseUnitsCompatible(doseUnit, item.drugUnit) && preparationMatchesRoute(item, selectedEntry?.route ?? "") &&
    (item.minAgeYears === undefined || (resolvedAgeYears !== undefined && resolvedAgeYears >= item.minAgeYears)) &&
    (item.maxAgeYears === undefined || (resolvedAgeYears !== undefined && resolvedAgeYears < item.maxAgeYears)),
  );
  const manualDrugNumber = Number(manualDrugAmount);
  const manualCarrierNumber = Number(manualCarrierAmount);
  const manualPreparation: DosePreparation | undefined = preparationId === "manual" && manualDrugNumber > 0 && manualCarrierNumber > 0
    ? {
      id: "manual",
      label: `${manualDrugNumber} ${doseUnit}/${manualCarrierNumber} ${manualCarrierUnit}`,
      drugAmount: manualDrugNumber,
      drugUnit: doseUnit,
      carrierAmount: manualCarrierNumber,
      carrierUnit: manualCarrierUnit,
    }
    : undefined;
  const selectedPreparation = preparationId === "manual"
    ? manualPreparation
    : availablePreparations.find((item) => item.id === preparationId);
  const visiblePreparationId = preparationId === "manual" && !curatedPreparationsOnly
    ? "manual" : selectedPreparation?.id ?? "";
  const conversionHelp = !hasAutomaticDose
    ? "Dosis otomatis belum tersedia. Pilih sediaan lalu masukkan jumlah zat aktif yang sudah ditetapkan dokter."
    : curatedPreparationsOnly && !drug.dosePreparations?.length
      ? "Kadar zat aktif pada sediaan belum terverifikasi, jadi konversi tidak dihitung."
      : curatedPreparationsOnly && availablePreparations.length === 0
        ? "Tidak ada sediaan terverifikasi yang cocok dengan usia dan rute ini."
        : availablePreparations.length === 0
          ? "Tidak ada sediaan terdaftar yang cocok. Periksa label sebelum memasukkan konsentrasi manual."
          : undefined;

  const ageInvalid = explicitAgeYears !== undefined && (
    explicitAgeYears < 0 || explicitAgeYears > 120 ||
    (initialPediatricMode && explicitAgeYears >= 18) ||
    (population === "adult" && explicitAgeYears < 18) ||
    (population === "pediatric" && explicitAgeYears >= 18) ||
    (population === "pediatric" && explicitAgeYears < NEONATAL_MAX_AGE_YEARS) ||
    (population === "neonatal" && explicitAgeYears >= NEONATAL_MAX_AGE_YEARS)
  );
  const weightInvalid = weightNumber !== undefined && (!Number.isFinite(weightNumber) || weightNumber <= 0 || weightNumber > 300);
  const result = selectedDoseIndex !== undefined && !ageInvalid && !weightInvalid
    ? calculateDose(drug, {
        weightKg: weightNumber,
        ageYears: resolvedAgeYears,
        population: effectivePopulation,
        doseIndex: selectedDoseIndex,
        preparation: selectedPreparation,
      })
    : undefined;
  const prescribedNumber = Number(prescribedAmount);
  const prescribedConversion = !hasAutomaticDose && selectedPreparation
    ? convertPrescribedDose(prescribedNumber, doseUnit, selectedPreparation)
    : undefined;

  const availablePopulations = (["adult", "pediatric", "neonatal"] as const).filter((item) =>
    drug.doses.some((dose) => dose.population === item || dose.population === "all"),
  );
  const availableRoutes = [...new Set(drug.doses.map((dose) => dose.route))].join(", ");

  return (
    <section className="workspace-panel overflow-hidden pb-4" aria-labelledby="dose-calculator-title">
      <div className="section-band flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="dose-calculator-title" className="display-type text-base font-bold">Kalkulator dosis dan konversi sediaan</h2>
        <div className="flex gap-2 sm:shrink-0">
          <CopyButton text={result ? doseToText(drug, result) : ""} label="Salin dosis" />
          <PrintButton />
        </div>
      </div>
      <p className="px-4 pt-4 text-xs text-[var(--muted)]">
        Pilih regimen yang sesuai, lalu masukkan data pasien bila diperlukan. RFSmed mempertahankan rentang dosis dan menerapkan batas maksimum yang tersedia.
      </p>

      <div className="mt-4 grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="dose-weight" className={labelClass}>Berat badan (kg)</label>
          <input
            id="dose-weight"
            type="number"
            inputMode="decimal"
            min={0.1}
            max={300}
            step={0.1}
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="Contoh: 18"
            aria-invalid={weightInvalid}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="dose-age" className={labelClass}>Usia</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              id="dose-age"
              type="number"
              inputMode="decimal"
              min={0}
              step={ageUnit === "hari" ? 1 : 0.1}
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="Contoh: 5"
              aria-invalid={ageInvalid}
              className={inputClass}
            />
            <select aria-label="Satuan usia" value={ageUnit} onChange={(event) => setAgeUnit(event.target.value as AgeUnit)} className={`${inputClass} w-28`}>
              <option value="hari">hari</option>
              <option value="bulan">bulan</option>
              <option value="tahun">tahun</option>
            </select>
          </div>
          {!age && initialPediatricMode && <p className="mt-1 text-xs text-[var(--muted)]">Isi usia untuk membedakan neonatus dan anak.</p>}
        </div>

        <div>
          <label htmlFor="dose-population" className={labelClass}>Kelompok usia</label>
          <select id="dose-population" value={population} onChange={(event) => { setPopulation(event.target.value as Population); setDoseIndex(""); }} className={inputClass}>
            <option value="">Otomatis dari usia</option>
            {!initialPediatricMode && availablePopulations.includes("adult") && <option value="adult">Dewasa</option>}
            {availablePopulations.includes("pediatric") && <option value="pediatric">Anak</option>}
            {availablePopulations.includes("neonatal") && <option value="neonatal">Neonatus</option>}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="dose-regimen" className={labelClass}>Indikasi dan rute</label>
          <select id="dose-regimen" value={selectedDoseIndex ?? ""} onChange={(event) => { setDoseIndex(event.target.value); setPreparationId(""); }} className={inputClass}>
            {options.length === 0 && <option value="">Tidak ada regimen untuk kelompok ini</option>}
            {options.map((option) => <option key={option.index} value={option.index}>{option.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="dose-preparation" className={labelClass}>Sediaan untuk konversi</label>
          <select id="dose-preparation" value={visiblePreparationId} onChange={(event) => setPreparationId(event.target.value)} disabled={!canConvertPreparation} aria-describedby={conversionHelp ? "dose-preparation-help" : undefined} className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}>
            <option value="">{canConvertPreparation ? "Tanpa konversi sediaan" : "Konversi tidak tersedia"}</option>
            {availablePreparations.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            {!curatedPreparationsOnly && <option value="manual">Masukkan konsentrasi manual</option>}
          </select>
          {conversionHelp && <p id="dose-preparation-help" className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{conversionHelp}</p>}
        </div>
      </div>

      {preparationId === "manual" && canConvertPreparation && (
        <fieldset className="mx-4 mt-3 rounded-lg border border-[var(--line)] p-3">
          <legend className="px-1 text-xs font-bold text-[var(--muted)]">Konsentrasi pada kemasan</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="manual-drug" className={labelClass}>Jumlah obat ({doseUnit})</label>
              <input id="manual-drug" type="number" min={0.001} step="any" value={manualDrugAmount} onChange={(event) => setManualDrugAmount(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="manual-carrier" className={labelClass}>Dalam jumlah</label>
              <input id="manual-carrier" type="number" min={0.001} step="any" value={manualCarrierAmount} onChange={(event) => setManualCarrierAmount(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="manual-unit" className={labelClass}>Satuan sediaan</label>
              <select id="manual-unit" value={manualCarrierUnit} onChange={(event) => setManualCarrierUnit(event.target.value as DosePreparation["carrierUnit"])} className={inputClass}>
                <option value="mL">mL</option>
                <option value="tablet">tablet</option>
                <option value="kapsul">kapsul</option>
                <option value="suppositoria">suppositoria</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      {!hasAutomaticDose && selectedEntry && (
        <div className="mx-4 mt-3 rounded-lg border border-[var(--line)] p-3">
          <label htmlFor="prescribed-dose" className={labelClass}>Dosis zat aktif yang sudah ditetapkan ({doseUnit})</label>
          <input id="prescribed-dose" type="number" min={0.001} step="any" value={prescribedAmount} onChange={(event) => setPrescribedAmount(event.target.value)} placeholder="Masukkan dosis per pemberian" className={inputClass} />
          {prescribedConversion && <p className="mt-3 rounded-lg bg-accent/10 px-3 py-2 text-sm font-bold text-accent-strong dark:text-accent">Hasil konversi: {prescribedConversion.text}</p>}
          <p className="mt-2 text-xs text-[var(--muted)]">Kolom ini hanya mengonversi dosis yang sudah ditetapkan. RFSmed tidak menentukan dosis dari regimen teks.</p>
        </div>
      )}

      {(ageInvalid || weightInvalid) && (
        <p role="alert" className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          Periksa kembali usia dan berat badan. Mode anak hanya menerima usia di bawah 18 tahun dan nilai fisiologis yang valid.
        </p>
      )}

      {result && (
        <div className="mx-4 mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-4" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">
            {result.entry.route} · {result.entry.indication ?? drug.indications[0] ?? "Dosis umum"}
          </p>
          {result.textOnly ? (
            <p className="mt-2 text-sm leading-relaxed">{result.entry.text}</p>
          ) : (
            <div className="mt-3 divide-y divide-[var(--line)] text-sm">
              {result.perDoseText && (
                <div className="flex items-baseline justify-between gap-4 py-2 first:pt-0">
                  <span className="text-[var(--muted)]">Per pemberian</span>
                  <strong className="text-right">{result.perDoseText}</strong>
                </div>
              )}
              {result.totalDailyText && (
                <div className="flex items-baseline justify-between gap-4 py-2">
                  <span className="text-[var(--muted)]">Total harian</span>
                  <strong className="text-right">{result.totalDailyText}</strong>
                </div>
              )}
              {result.preparationText && (
                <div className="flex items-baseline justify-between gap-4 py-2 text-accent-strong dark:text-accent">
                  <span>Hasil sediaan</span>
                  <strong className="text-right">{result.preparationText}</strong>
                </div>
              )}
            </div>
          )}
          {result.maxWarnings.map((warning) => (
            <p key={warning} className="mt-2 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">⚠ {warning}</p>
          ))}
          <div className="mt-3 space-y-1">
            {result.notes.map((note, index) => <p key={index} className="text-xs leading-relaxed text-[var(--muted)]">{note}</p>)}
          </div>
          {result.entry.source?.url && (
            <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)]">
              Sumber regimen: <a href={result.entry.source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--foreground)]">
                {result.entry.source.org}, {result.entry.source.title} ({result.entry.source.year})
              </a>
            </p>
          )}
        </div>
      )}

      <p className="mt-3 px-4 text-xs text-[var(--muted)]">
        Rute tersedia: {availableRoutes}. Verifikasi hasil dengan formularium, fungsi organ, dan kondisi klinis pasien sebelum meresepkan.
      </p>
    </section>
  );
}
