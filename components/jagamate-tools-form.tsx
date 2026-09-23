"use client";

import { useState, type FormEvent } from "react";
import { ADULT_BURN_REGIONS, calculateAdultBurnArea, calculateBurnResuscitation, calculateDiarrheaPlan, calculateFundalEstimate, calculatePregnancyDating, calculateShockBolus } from "@/lib/calc/jagamate-tools";

type Tool = "diare" | "syok" | "kehamilan" | "taksiran-janin" | "luka-bakar";
type DisplayResult = { lines: { label: string; value: string }[]; note: string } | { reason: string };
const fieldClass = "focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm";
const labelClass = "mb-1 block text-xs font-bold text-[var(--muted)]";
const ml = (value: number) => `${value.toLocaleString("id-ID", { maximumFractionDigits: 1 })} mL`;

export function JagamateToolsForm({ tool }: { tool: Tool }) {
  const [weight, setWeight] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [plan, setPlan] = useState<"A" | "B" | "C">("A");
  const [severeMalnutrition, setSevereMalnutrition] = useState(false);
  const [cardiacFailure, setCardiacFailure] = useState(false);
  const [hpht, setHpht] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [fundalHeight, setFundalHeight] = useState("");
  const [gestationalWeeks, setGestationalWeeks] = useState("");
  const [station, setStation] = useState<"above" | "at" | "below">("above");
  const [tbsa, setTbsa] = useState("");
  const [burnRegions, setBurnRegions] = useState<string[]>([]);
  const [multiplier, setMultiplier] = useState<2 | 3 | 4>(2);
  const [hours, setHours] = useState("");
  const [result, setResult] = useState<DisplayResult | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (tool === "diare") {
      const value = calculateDiarrheaPlan({ plan, ageMonths: Number(ageMonths), weightKg: Number(weight), severeMalnutrition });
      if (value.status === "blocked") { setResult({ reason: value.reason }); return; }
      const lines: { label: string; value: string }[] = [];
      if ("minMl" in value) lines.push({ label: "Oralit setelah setiap BAB cair", value: `${ml(value.minMl!)} sampai ${ml(value.maxMl!)}` });
      if ("totalMl" in value) lines.push({ label: plan === "B" ? "Oralit" : "Cairan IV total", value: ml(value.totalMl!) });
      if ("hours" in value) lines.push({ label: "Diberikan selama", value: `${value.hours} jam` });
      if ("firstMl" in value) lines.push({ label: "Tahap pertama", value: `${ml(value.firstMl!)} selama ${value.firstHours} jam` }, { label: "Tahap kedua", value: `${ml(value.secondMl!)} selama ${value.secondHours} jam` });
      setResult({ lines, note: value.note }); return;
    }
    if (tool === "syok") {
      const value = calculateShockBolus({ weightKg: Number(weight), ageMonths: Number(ageMonths), severeMalnutrition, cardiacFailure });
      setResult(value.status === "blocked" ? { reason: value.reason } : { lines: [{ label: "Kisaran bolus awal", value: `${ml(value.minMl)} sampai ${ml(value.maxMl)}` }], note: value.note }); return;
    }
    if (tool === "kehamilan") {
      const value = calculatePregnancyDating(hpht, referenceDate);
      setResult(value.status === "blocked" ? { reason: value.reason } : { lines: [{ label: "Usia kehamilan", value: `${value.weeks} minggu ${value.days} hari` }, { label: "HPL perkiraan", value: value.dueDate }], note: value.note }); return;
    }
    if (tool === "taksiran-janin") {
      const value = calculateFundalEstimate({ fundalHeightCm: Number(fundalHeight), station, gestationalWeeks: Number(gestationalWeeks) });
      setResult(value.status === "blocked" ? { reason: value.reason } : { lines: [{ label: "Taksiran berat janin", value: `${value.estimatedGrams.toLocaleString("id-ID")} g` }], note: value.note }); return;
    }
    const value = calculateBurnResuscitation({ ageYears: Number(ageYears), weightKg: Number(weight), tbsaPercent: Number(tbsa), multiplier, hoursSinceInjury: Number(hours) });
    setResult(value.status === "blocked" ? { reason: value.reason } : { lines: [
      { label: "Perkiraan 24 jam pertama", value: ml(value.first24hMl) },
      { label: "Target kumulatif 8 jam pertama sejak cedera", value: ml(value.first8hMl) },
      { label: "Sisa waktu pada jendela pertama", value: `${value.remainingFirstWindowHours.toLocaleString("id-ID")} jam` },
      { label: "16 jam berikutnya", value: ml(value.next16hMl) },
    ], note: value.note });
  }

  return <form onSubmit={submit} className="workspace-panel space-y-5 p-5">
    {tool === "diare" && <label className="block"><span className={labelClass}>Rencana terapi</span><select className={fieldClass} value={plan} onChange={(event) => { setPlan(event.target.value as "A" | "B" | "C"); setResult(null); }}><option value="A">Plan A, tanpa dehidrasi</option><option value="B">Plan B, dehidrasi ringan-sedang</option><option value="C">Plan C, dehidrasi berat</option></select></label>}
    {(tool === "diare" || tool === "syok" || tool === "luka-bakar") && <div className="grid gap-3 sm:grid-cols-2">
      <label><span className={labelClass}>Berat badan (kg)</span><input className={fieldClass} type="number" min="0.1" max="200" step="0.1" required value={weight} onChange={(event) => { setWeight(event.target.value); setResult(null); }} /></label>
      {(tool === "diare" || tool === "syok") && <label><span className={labelClass}>Usia (bulan)</span><input className={fieldClass} type="number" min="1" max="215" step="1" required value={ageMonths} onChange={(event) => { setAgeMonths(event.target.value); setResult(null); }} /></label>}
      {tool === "luka-bakar" && <label><span className={labelClass}>Usia (tahun)</span><input className={fieldClass} type="number" min="0" max="100" step="0.1" required value={ageYears} onChange={(event) => { setAgeYears(event.target.value); setBurnRegions([]); setTbsa(""); setResult(null); }} /></label>}
    </div>}
    {(tool === "diare" || tool === "syok") && <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={severeMalnutrition} onChange={(event) => { setSevereMalnutrition(event.target.checked); setResult(null); }} className="mt-1" /><span>Ada malnutrisi akut berat atau kecurigaan kondisi tersebut</span></label>}
    {tool === "syok" && <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={cardiacFailure} onChange={(event) => { setCardiacFailure(event.target.checked); setResult(null); }} className="mt-1" /><span>Ada dugaan gagal jantung atau overload cairan</span></label>}
    {tool === "kehamilan" && <div className="grid gap-3 sm:grid-cols-2"><label><span className={labelClass}>Hari pertama haid terakhir</span><input className={fieldClass} type="date" required value={hpht} onChange={(event) => { setHpht(event.target.value); setResult(null); }} /></label><label><span className={labelClass}>Tanggal pemeriksaan</span><input className={fieldClass} type="date" required value={referenceDate} onChange={(event) => { setReferenceDate(event.target.value); setResult(null); }} /></label></div>}
    {tool === "taksiran-janin" && <div className="grid gap-3 sm:grid-cols-3"><label><span className={labelClass}>TFU (cm)</span><input className={fieldClass} type="number" min="20" max="50" step="0.1" required value={fundalHeight} onChange={(event) => { setFundalHeight(event.target.value); setResult(null); }} /></label><label><span className={labelClass}>Usia kehamilan (minggu)</span><input className={fieldClass} type="number" min="37" max="42" step="0.1" required value={gestationalWeeks} onChange={(event) => { setGestationalWeeks(event.target.value); setResult(null); }} /></label><label><span className={labelClass}>Posisi kepala terhadap spina iskiadika</span><select className={fieldClass} value={station} onChange={(event) => { setStation(event.target.value as typeof station); setResult(null); }}><option value="above">Di atas (belum masuk)</option><option value="at">Setinggi spina (stasiun 0)</option><option value="below">Di bawah (stasiun positif)</option></select></label></div>}
    {tool === "luka-bakar" && <div className="grid gap-3 sm:grid-cols-3"><label><span className={labelClass}>Luas luka bakar parsial/penuh (%TBSA)</span><input className={fieldClass} type="number" min="1" max="100" step="0.1" required value={tbsa} onChange={(event) => { setTbsa(event.target.value); setBurnRegions([]); setResult(null); }} /></label><label><span className={labelClass}>Faktor awal (mL/kg/%TBSA)</span><select className={fieldClass} value={multiplier} onChange={(event) => { setMultiplier(Number(event.target.value) as 2 | 3 | 4); setResult(null); }}><option value="2">2, pendekatan konservatif</option><option value="3">3</option><option value="4">4, Baxter/Parkland klasik</option></select></label><label><span className={labelClass}>Jam sejak luka bakar</span><input className={fieldClass} type="number" min="0" max="7.9" step="0.1" required value={hours} onChange={(event) => { setHours(event.target.value); setResult(null); }} /></label></div>}
    {tool === "luka-bakar" && ageYears && Number(ageYears) >= 16 && <fieldset className="rounded-lg border border-[var(--line)] p-4"><legend className="px-1 text-sm font-bold">Bantuan luas area dewasa</legend><p className="mb-3 text-xs text-[var(--muted)]">Pilih hanya area yang terbakar seluruhnya dengan kedalaman parsial atau penuh. Untuk area sebagian, isi %TBSA secara manual.</p><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{ADULT_BURN_REGIONS.map((region) => <label key={region.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={burnRegions.includes(region.id)} onChange={(event) => { const selected = event.target.checked ? [...burnRegions, region.id] : burnRegions.filter((id) => id !== region.id); setBurnRegions(selected); setTbsa(String(calculateAdultBurnArea(selected) ?? "")); setResult(null); }} /><span>{region.label} ({region.percent}%)</span></label>)}</div></fieldset>}
    {tool === "luka-bakar" && ageYears && Number(ageYears) < 16 && <p className="text-xs leading-5 text-[var(--muted)]">Pada anak, persentase tiap bagian tubuh berubah menurut usia. Ukur %TBSA dengan bagan Lund-Browder sesuai usia, lalu masukkan nilainya di atas.</p>}
    <button type="submit" className="focus-ring rounded-lg bg-accent-button px-5 py-2.5 text-sm font-bold">Hitung</button>
    {result && ("reason" in result ? <p role="alert" className="rounded-lg border border-amber-500/40 p-4 text-sm text-amber-600 dark:text-amber-300">{result.reason}</p> : <section aria-live="polite" className="rounded-lg border border-accent/40 p-4"><h2 className="display-type text-lg font-bold">Hasil</h2><dl className="mt-3 divide-y divide-[var(--line)]">{result.lines.map((line) => <div key={line.label} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><dt>{line.label}</dt><dd className="font-bold">{line.value}</dd></div>)}</dl><p className="mt-3 text-xs leading-5 text-[var(--muted)]">{result.note}</p></section>)}
  </form>;
}
