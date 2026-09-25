"use client";

import { useMemo, useState } from "react";
import { BackLink, PageHeader, SectionBand } from "@/components/shared";
import { INFUSION_PRESETS, doseFromRate, pumpRate, totalDose } from "@/lib/calc/emergency-dose";

const field = "focus-ring mt-1 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-sm outline-none";

export default function EmergencyDoseCalculator() {
  const [mode, setMode] = useState<"infusion" | "reverse" | "weight">("infusion");
  const [presetId, setPresetId] = useState(INFUSION_PRESETS[0].id);
  const preset = INFUSION_PRESETS.find((item) => item.id === presetId) ?? INFUSION_PRESETS[0];
  const [weight, setWeight] = useState(60), [dose, setDose] = useState(0.1), [concentration, setConcentration] = useState(preset.concentrations[0].mcgMl), [rate, setRate] = useState(5);
  const result = useMemo(() => { try { return mode === "infusion" ? pumpRate({ weightKg: weight, doseMcgKgMin: dose, concentrationMcgMl: concentration }) : mode === "reverse" ? doseFromRate({ weightKg: weight, rateMlHour: rate, concentrationMcgMl: concentration }) : totalDose({ weightKg: weight, dosePerKg: dose }); } catch { return null; } }, [mode, weight, dose, concentration, rate]);
  const choosePreset = (id: string) => { const next = INFUSION_PRESETS.find((item) => item.id === id)!; setPresetId(id); setConcentration(next.concentrations[0].mcgMl); };
  return <div><BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" /><PageHeader title="Kalkulator Dosis Obat IGD" />
    <div className="mb-4 flex flex-wrap gap-2">{[["infusion","Laju infus"],["reverse","Dosis dari laju"],["weight","Dosis total"]].map(([id,label]) => <button key={id} onClick={() => setMode(id as typeof mode)} data-active={mode===id} className="focus-ring rounded-full border border-[var(--line)] px-3 py-1.5 text-xs font-bold data-[active=true]:border-accent data-[active=true]:bg-accent/10 data-[active=true]:text-accent-strong">{label}</button>)}</div>
    <div className="grid gap-5 lg:grid-cols-2"><section className="workspace-panel overflow-hidden"><SectionBand>Parameter</SectionBand><div className="grid gap-4 p-5 sm:grid-cols-2">
      {mode !== "weight" && <><label className="text-xs font-bold sm:col-span-2">Preset obat<select value={presetId} onChange={(e) => choosePreset(e.target.value)} className={field}>{INFUSION_PRESETS.map((item) => <option key={item.id} value={item.id}>{item.name} | {item.category}</option>)}</select></label><label className="text-xs font-bold">Konsentrasi, mcg/mL<select value={concentration} onChange={(e) => setConcentration(Number(e.target.value))} className={field}>{preset.concentrations.map((item) => <option key={item.label} value={item.mcgMl}>{item.label}</option>)}</select></label></>}
      <label className="text-xs font-bold">Berat badan, kg<input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className={field} /></label>
      {mode === "reverse" ? <label className="text-xs font-bold">Laju, mL/jam<input type="number" min="0.01" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className={field} /></label> : <label className="text-xs font-bold">{mode === "weight" ? "Dosis per kg" : "Dosis, mcg/kg/menit"}<input type="number" min="0.001" step="0.01" value={dose} onChange={(e) => setDose(Number(e.target.value))} className={field} /></label>}
    </div></section><section className="workspace-panel overflow-hidden"><SectionBand>Hasil</SectionBand><div className="p-5"><strong className="display-type text-3xl font-bold tabular-nums">{result ?? "Tidak valid"}</strong><span className="ml-2 text-sm text-[var(--muted)]">{mode === "infusion" ? "mL/jam" : mode === "reverse" ? "mcg/kg/menit" : "total"}</span>{mode !== "weight" && <><h3 className="mt-6 text-sm font-bold">Catatan klinis</h3><p className="mt-2 text-xs leading-5 text-[var(--muted)]">{preset.note} Rentang referensi: {preset.range} {preset.unit}.</p></>}</div></section></div>
  </div>;
}
