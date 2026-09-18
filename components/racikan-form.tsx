"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import type { RacikanResult } from "@/lib/calc/racikan";
import { CopyButton } from "@/components/action-buttons";

type Choice = { name: string; slug: string };
type Option = { index: number; label: string; basis: "day" | "dose"; minMgPerKg?: number; maxMgPerKg?: number; products: { id: string; label: string }[] };
type Ingredient = { id: number; slug: string; doseIndex: string; preparationId: string; targetMgPerKg: string };
const fieldClass = "focus-ring h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm";
const labelClass = "mb-1 block text-xs font-bold text-[var(--muted)]";

export function RacikanForm({ choices }: { choices: Choice[] }) {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [packets, setPackets] = useState("10");
  const [frequency, setFrequency] = useState("3");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: 1, slug: "", doseIndex: "", preparationId: "", targetMgPerKg: "" }]);
  const [nextId, setNextId] = useState(2);
  const [options, setOptions] = useState<{ key: string; values: Record<number, { name: string; options: Option[] }> }>({ key: "", values: {} });
  const [result, setResult] = useState<RacikanResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const choiceKey = ingredients.map((item) => `${item.id}:${item.slug}`).join("|");
  const requestKey = `${age}|${choiceKey}`;

  useEffect(() => {
    const controller = new AbortController();
    const ageYears = Number(age);
    if (!age || !Number.isFinite(ageYears) || ageYears < 0 || ageYears >= 18) return;
    Promise.all(ingredients.filter((item) => item.slug).map(async (item) => {
      const response = await fetch(`/api/racikan?slug=${encodeURIComponent(item.slug)}&age=${encodeURIComponent(age)}`, { signal: controller.signal });
      if (!response.ok) return [item.id, { name: "", options: [] }] as const;
      return [item.id, await response.json() as { name: string; options: Option[] }] as const;
    })).then((pairs) => { if (!controller.signal.aborted) setOptions({ key: `${age}|${choiceKey}`, values: Object.fromEntries(pairs) }); }).catch(() => { if (!controller.signal.aborted) setOptions({ key: `${age}|${choiceKey}`, values: {} }); });
    return () => controller.abort();
    // Only refetch when the selected drugs or age change, not on every field edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age, choiceKey]);

  function update(id: number, patch: Partial<Ingredient>) {
    setIngredients((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
    setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/racikan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ageYears: Number(age), weightKg: Number(weight), packets: Number(packets), frequencyPerDay: Number(frequency),
        ingredients: ingredients.map((item) => ({ slug: item.slug, doseIndex: Number(item.doseIndex), preparationId: item.preparationId, targetMgPerKg: item.targetMgPerKg ? Number(item.targetMgPerKg) : undefined })),
      }) });
      const body = await response.json();
      if (!response.ok) setError(body.error ?? "Hitungan gagal."); else setResult(body as RacikanResult);
    } catch { setError("Koneksi gagal. Coba lagi."); }
    finally { setLoading(false); }
  }

  const copyText = result?.status === "ok" ? [
    `Racikan ${packets} bungkus, ${frequency} kali sehari`,
    ...result.ingredients.map((item) => `${item.name}: ${item.mgPerPacket.toLocaleString("id-ID")} mg/bungkus; total ${item.totalMg.toLocaleString("id-ID")} mg = ${item.productUnits.toLocaleString("id-ID", { maximumFractionDigits: 3 })} ${item.productUnit} (${item.preparation})`),
    ...result.warnings,
  ].join("\n") : "";

  return <form onSubmit={submit} className="workspace-panel space-y-5 p-5">
    <p className="text-sm text-[var(--muted)]">Lembar hitung ini tidak memvalidasi kompatibilitas, stabilitas, atau apakah tablet boleh dihancurkan. Verifikasi oleh apoteker wajib sebelum peracikan.</p>
    <div className="grid gap-3 sm:grid-cols-4">
      <label><span className={labelClass}>Usia (tahun)</span><input className={fieldClass} type="number" min="0" max="17.99" step="0.01" required value={age} onChange={(event) => { setAge(event.target.value); setResult(null); }} /></label>
      <label><span className={labelClass}>Berat badan (kg)</span><input className={fieldClass} type="number" min="0.1" max="200" step="0.1" required value={weight} onChange={(event) => { setWeight(event.target.value); setResult(null); }} /></label>
      <label><span className={labelClass}>Jumlah bungkus</span><input className={fieldClass} type="number" min="1" max="100" step="1" required value={packets} onChange={(event) => { setPackets(event.target.value); setResult(null); }} /></label>
      <label><span className={labelClass}>Kali sehari</span><select className={fieldClass} value={frequency} onChange={(event) => { setFrequency(event.target.value); setResult(null); }}>{[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} kali</option>)}</select></label>
    </div>
    <div className="space-y-3">
      <h2 className="display-type text-lg font-bold">Bahan obat</h2>
      {ingredients.map((item, index) => {
        const metadata = options.key === requestKey ? options.values[item.id] : undefined;
        const selected = metadata?.options.find((option) => String(option.index) === item.doseIndex);
        return <fieldset key={item.id} className="rounded-lg border border-[var(--line)] p-4">
          <legend className="px-1 text-sm font-bold">Bahan {index + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label><span className={labelClass}>Obat</span><select className={fieldClass} required value={item.slug} onChange={(event) => update(item.id, { slug: event.target.value, doseIndex: "", preparationId: "", targetMgPerKg: "" })}><option value="">Pilih obat</option>{choices.map((choice) => <option key={choice.name} value={choice.slug}>{choice.name}</option>)}</select></label>
            <label><span className={labelClass}>Indikasi dan regimen oral</span><select className={fieldClass} required value={item.doseIndex} onChange={(event) => update(item.id, { doseIndex: event.target.value, preparationId: "", targetMgPerKg: "" })}><option value="">Pilih regimen</option>{metadata?.options.map((option) => <option key={option.index} value={option.index}>{option.label}</option>)}</select></label>
            <label><span className={labelClass}>Sediaan tablet/kapsul</span><select className={fieldClass} required value={item.preparationId} onChange={(event) => update(item.id, { preparationId: event.target.value })}><option value="">Pilih sediaan</option>{selected?.products.map((product) => <option key={product.id} value={product.id}>{product.label}</option>)}</select></label>
            {selected?.minMgPerKg !== undefined && <label><span className={labelClass}>Target mg/kg{selected.basis === "day" ? "/hari" : "/dosis"} ({selected.minMgPerKg} sampai {selected.maxMgPerKg})</span><input className={fieldClass} type="number" min={selected.minMgPerKg} max={selected.maxMgPerKg} step="any" required value={item.targetMgPerKg} onChange={(event) => update(item.id, { targetMgPerKg: event.target.value })} /></label>}
          </div>
          {item.slug && metadata && metadata.options.length === 0 && <p className="mt-3 text-sm text-amber-600 dark:text-amber-300">Belum ada regimen oral padat yang aman dihitung otomatis untuk usia ini. <Link href={`/drugs/${item.slug}?mode=anak`} className="font-bold underline underline-offset-2">Buka panduan obat</Link>.</p>}
          {ingredients.length > 1 && <button type="button" onClick={() => { setIngredients((current) => current.filter((candidate) => candidate.id !== item.id)); setResult(null); }} className="focus-ring mt-3 rounded-lg border border-[var(--line)] px-3 py-2 text-xs font-bold">Hapus bahan</button>}
        </fieldset>;
      })}
      <button type="button" disabled={ingredients.length >= 8} onClick={() => { setIngredients((current) => [...current, { id: nextId, slug: "", doseIndex: "", preparationId: "", targetMgPerKg: "" }]); setNextId((value) => value + 1); setResult(null); }} className="focus-ring rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-bold disabled:opacity-50">Tambah bahan</button>
    </div>
    <button type="submit" disabled={loading} className="focus-ring rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? "Menghitung..." : "Hitung racikan"}</button>
    {error && <p role="alert" className="text-sm text-red-600 dark:text-red-300">{error}</p>}
    {result?.status === "blocked" && <div role="alert" className="rounded-lg border border-amber-500/40 p-4"><h2 className="font-bold">Hitungan ditahan</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
    {result?.status === "ok" && <section className="rounded-lg border border-accent/40 p-4"><div className="flex items-center justify-between gap-3"><h2 className="display-type text-lg font-bold">Lembar hitung</h2><CopyButton text={copyText} label="Salin hitungan" /></div><div className="mt-3 space-y-3">{result.ingredients.map((item, index) => <div key={`${item.name}-${index}`} className="border-t border-[var(--line)] pt-3 text-sm"><h3 className="font-bold">{item.name}</h3><p>{item.mgPerPacket.toLocaleString("id-ID")} mg/bungkus, total {item.totalMg.toLocaleString("id-ID")} mg</p><p>{item.productUnits.toLocaleString("id-ID", { maximumFractionDigits: 3 })} {item.productUnit} dari {item.preparation}, tanpa pembulatan otomatis</p><p className="mt-1 break-all text-xs text-[var(--muted)]">Sumber: {item.source}</p></div>)}</div><p className="mt-4 text-xs text-amber-600 dark:text-amber-300">{result.warnings.join(" ")}</p></section>}
  </form>;
}
