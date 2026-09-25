"use client";

import { useMemo, useState } from "react";
import { BackLink, PageHeader, SectionBand } from "@/components/shared";
import { calculateBilirubinThreshold } from "@/lib/calc/bilirubin";

const field = "focus-ring mt-1 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-sm outline-none";

export default function BilirubinCalculator() {
  const [ga, setGa] = useState(38);
  const [hours, setHours] = useState(48);
  const [tsb, setTsb] = useState(12);
  const [risk, setRisk] = useState(false);
  const result = useMemo(() => {
    try { return calculateBilirubinThreshold({ gestationalAgeWeeks: ga, ageHours: hours, hasAdditionalRisk: risk, tsb }); }
    catch { return null; }
  }, [ga, hours, risk, tsb]);

  return <div>
    <BackLink href="/igd-toolkit" label="Kembali ke Toolkit IGD" />
    <PageHeader title="Kalkulator Bilirubin Neonatus" />
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="workspace-panel overflow-hidden"><SectionBand>Data bayi</SectionBand><div className="grid gap-4 p-5 sm:grid-cols-2">
        <label className="text-xs font-bold">Usia gestasi, minggu<input type="number" min="35" max="40" value={ga} onChange={(e) => setGa(Number(e.target.value))} className={field} /></label>
        <label className="text-xs font-bold">Usia setelah lahir, jam<input type="number" min="1" max="336" value={hours} onChange={(e) => setHours(Number(e.target.value))} className={field} /></label>
        <label className="text-xs font-bold">Bilirubin total, mg/dL<input type="number" min="0" step="0.1" value={tsb} onChange={(e) => setTsb(Number(e.target.value))} className={field} /></label>
        <label className="flex items-center gap-3 self-end rounded-lg border border-[var(--line)] p-3 text-xs font-bold"><input type="checkbox" checked={risk} onChange={(e) => setRisk(e.target.checked)} /> Ada faktor risiko neurotoksisitas tambahan</label>
      </div></section>
      <section className="workspace-panel overflow-hidden"><SectionBand>Hasil</SectionBand><div className="p-5">
        {!result ? <p className="text-sm text-[var(--muted)]">Masukkan usia 1 sampai 336 jam dan gestasi 35 sampai 40 minggu.</p> : <>
          <strong className="display-type text-2xl font-bold capitalize">{result.action}</strong>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center"><Result label="Fototerapi" value={result.phototherapy} /><Result label="Eskalasi" value={result.escalation} /><Result label="Transfusi tukar" value={result.exchange} /></dl>
          <p className="mt-4 text-xs leading-5 text-[var(--muted)]">Selisih terhadap ambang fototerapi: {result.differenceFromPhototherapy?.toFixed(1)} mg/dL. Konfirmasi dengan grafik resmi dan kondisi klinis.</p>
        </>}
      </div></section>
    </div>
  </div>;
}

function Result({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-[var(--line)] p-3"><dt className="text-[10px] font-bold text-[var(--muted)]">{label}</dt><dd className="mt-1 text-lg font-bold tabular-nums">{value}</dd><span className="text-[9px] text-[var(--muted)]">mg/dL</span></div>;
}
