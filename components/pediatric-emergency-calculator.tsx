"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, Baby, Info, Ruler, Wind, Zap } from "lucide-react";
import { CopyButton, PrintButton } from "@/components/action-buttons";

interface EstimateResult {
  computeWeightKg: number | null;
  weightSource: "actual" | "TBW" | "IBW" | null;
  habitusScore: number | null;
  ibwKg: number | null;
  tbwKg: number | null;
  flags: string[];
  notes: string[];
}

interface ApiResult {
  estimate: EstimateResult;
  habitusLabel: string | null;
  airway: { cuffed: string; uncuffed: string; depth: string; suction: string; opa: string; blade: string; note: string | null } | null;
  resuscitation: {
    epinephrineMg: number;
    epinephrineMl1To10000: number;
    defibrillationFirstJ: number;
    defibrillationSecondJ: number;
    amiodaroneMg: number;
    cardioversionLowJ: number;
    cardioversionHighJ: number;
    adenosineFirstMg: number;
    adenosineSecondMg: number;
    atropineMg: number;
    fluidLowMl: number;
    fluidHighMl: number;
    dextroseD10Ml: number;
  } | null;
  lowSystolicThreshold: number | null;
  lowSystolicFormula: boolean;
  vitalIndex: number;
}

interface VitalRange {
  label: string;
  heartRate: string;
  respiratoryRate: string;
  maxYears: number;
}

function numberValue(value: string): number | undefined {
  const parsed = Number(value.replace(",", "."));
  return value !== "" && Number.isFinite(parsed) ? parsed : undefined;
}

function format(value: number): string {
  return String(Math.round(value * 10) / 10).replace(".", ",");
}

function ResultCard({ label, value, formula, note, source }: { label: string; value: string; formula?: string; note?: string; source?: string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] p-3">
      <p className="text-xs font-semibold text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-[var(--ink)]">{value}</p>
      {formula && <p className="mt-1 text-xs text-[var(--muted)]">{formula}</p>}
      {note && <p className="mt-1 text-xs font-medium text-accent-strong dark:text-accent">{note}</p>}
      {source && <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">{source}</p>}
    </div>
  );
}

function Section({ icon: Icon, title, badge, children }: { icon: typeof Wind; title: string; badge: string; children: React.ReactNode }) {
  return (
    <section className="workspace-panel overflow-hidden">
      <div className="section-band justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-accent-strong dark:text-accent" />
          <h2 className="display-type text-base font-bold">{title}</h2>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-strong dark:text-accent">
          {badge}
        </span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

export default function PediatricEmergencyCalculator({ vitalRanges }: { vitalRanges: readonly VitalRange[] }) {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years");
  const [length, setLength] = useState("");
  const [mac, setMac] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState("");
  const hasInput = Boolean(weight || age || length);

  useEffect(() => {
    if (!hasInput) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/pediatric-emergency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          signal: controller.signal,
          body: JSON.stringify({
            weightKg: numberValue(weight),
            age: numberValue(age),
            ageUnit,
            lengthCm: numberValue(length),
            macCm: numberValue(mac),
          }),
        });
        const payload = (await response.json()) as ApiResult | { error?: string };
        if (!response.ok || !("estimate" in payload)) {
          setResult(null);
          setError("error" in payload && payload.error ? payload.error : "Perhitungan tidak dapat diproses.");
          return;
        }
        setResult(payload);
        setError("");
      } catch (requestError) {
        if ((requestError as Error).name !== "AbortError") setError("Perhitungan tidak dapat diproses.");
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [weight, age, ageUnit, length, mac, hasInput]);

  const visibleResult = hasInput ? result : null;
  const estimate = visibleResult?.estimate ?? null;
  const computedWeight = estimate?.computeWeightKg ?? null;
  const airway = visibleResult?.airway ?? null;
  const resuscitation = visibleResult?.resuscitation ?? null;

  const copyText = (() => {
    const lines = ["RFSmed: Gawat Darurat Anak"];
    if (computedWeight) lines.push(`Berat untuk perhitungan: ${format(computedWeight)} kg (${estimate?.weightSource})`);
    if (airway) {
      lines.push(`ETT cuffed: ${airway.cuffed} mm`, `ETT uncuffed: ${airway.uncuffed} mm`, `Kedalaman ETT: ${airway.depth} cm`, `Kateter suction: ${airway.suction} Fr`);
    }
    if (resuscitation) {
      lines.push(
        `Epinefrin IV/IO: ${format(resuscitation.epinephrineMg)} mg`,
        `Defibrilasi: ${resuscitation.defibrillationFirstJ} J, lalu ${resuscitation.defibrillationSecondJ} J`,
        `Amiodaron: ${resuscitation.amiodaroneMg} mg`,
        `Bolus cairan: ${resuscitation.fluidLowMl} sampai ${resuscitation.fluidHighMl} mL`,
      );
    }
    lines.push("Verifikasi seluruh nilai sesuai kondisi pasien dan kebijakan lokal.");
    return lines.join("\n");
  })();

  const inputClass = "focus-ring mt-1 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-sm font-medium outline-none";

  return (
    <div className="space-y-5">
      <section className="workspace-panel overflow-hidden">
        <div className="section-band justify-between">
          <div className="flex items-center gap-2">
            <Baby className="h-4 w-4 text-accent-strong dark:text-accent" />
            <h2 className="display-type text-base font-bold">Data Pasien</h2>
          </div>
          <div className="flex gap-2">
            <CopyButton text={copyText} label="Salin hasil" />
            <PrintButton />
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Berat badan aktual
            <div className="relative">
              <input type="number" min="0" step="0.1" inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="mis. 10" className={inputClass} />
              <span className="pointer-events-none absolute right-3 top-4 text-xs text-[var(--muted)]">kg</span>
            </div>
          </label>
          <label className="text-sm font-semibold">
            Usia
            <div className="mt-1 flex gap-2">
              <input type="number" min="0" step="0.1" inputMode="decimal" value={age} onChange={(event) => setAge(event.target.value)} placeholder="mis. 2" className="focus-ring h-11 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface-raised)] px-3 text-sm font-medium outline-none" />
              <div className="flex overflow-hidden rounded-lg border border-[var(--line)]">
                <button type="button" onClick={() => setAgeUnit("years")} className={`px-3 text-xs font-semibold ${ageUnit === "years" ? "bg-accent-button text-accent-ink" : "bg-[var(--surface-raised)] text-[var(--muted)]"}`}>Tahun</button>
                <button type="button" onClick={() => setAgeUnit("months")} className={`px-3 text-xs font-semibold ${ageUnit === "months" ? "bg-accent-button text-accent-ink" : "bg-[var(--surface-raised)] text-[var(--muted)]"}`}>Bulan</button>
              </div>
            </div>
          </label>
          <label className="text-sm font-semibold">
            Panjang telentang <span className="font-normal text-[var(--muted)]">(opsional)</span>
            <div className="relative">
              <input type="number" min="43" max="180" step="0.1" inputMode="decimal" value={length} onChange={(event) => setLength(event.target.value)} placeholder="43 sampai 180" className={inputClass} />
              <span className="pointer-events-none absolute right-3 top-4 text-xs text-[var(--muted)]">cm</span>
            </div>
            <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Ukur kepala sampai tumit dalam posisi telentang.</span>
          </label>
          <label className="text-sm font-semibold">
            Lingkar lengan atas <span className="font-normal text-[var(--muted)]">(opsional)</span>
            <div className="relative">
              <input type="number" min="0" step="0.1" inputMode="decimal" value={mac} disabled={!length} onChange={(event) => setMac(event.target.value)} placeholder={length ? "mis. 14" : "Isi panjang dahulu"} className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`} />
              <span className="pointer-events-none absolute right-3 top-4 text-xs text-[var(--muted)]">cm</span>
            </div>
            <span className="mt-1 block text-xs font-normal text-[var(--muted)]">Tanpa pengukuran ini, estimasi memakai IBW dan kurang presisi.</span>
          </label>
        </div>
      </section>

      {hasInput && error && <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

      {(length || weight) && (
        <section className="workspace-panel overflow-hidden">
          <div className="section-band">
            <Ruler className="h-4 w-4 text-accent-strong dark:text-accent" />
            <h2 className="display-type text-base font-bold">Estimasi Berat Badan PAWPER XL-MAC</h2>
          </div>
          <div className="p-4">
            {computedWeight ? (
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-3xl font-bold tracking-tight">{format(computedWeight)} kg</p>
                <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-semibold text-accent-strong dark:text-accent">
                  {estimate?.weightSource === "actual" ? "Berat aktual" : estimate?.weightSource === "TBW" ? "TBW dari panjang dan lingkar lengan" : "IBW dari panjang"}
                </span>
                  {estimate?.habitusScore && <span className="text-xs font-semibold text-[var(--muted)]">HS{estimate.habitusScore}: {visibleResult?.habitusLabel}</span>}
                {estimate?.ibwKg && estimate.tbwKg && estimate.ibwKg !== estimate.tbwKg && <span className="text-xs text-[var(--muted)]">IBW: {estimate.ibwKg} kg</span>}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">Belum dapat diestimasi. Periksa data pasien.</p>
            )}
            {estimate && estimate.notes.length > 0 && <ul className="mt-3 space-y-1 pl-5 text-xs leading-5 text-[var(--muted)]">{estimate.notes.map((note) => <li key={note} className="list-disc">{note}</li>)}</ul>}
          </div>
        </section>
      )}

      <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm leading-6"><strong>Perhatian:</strong> hasil merupakan estimasi. Untuk anak hingga 35 kg, pita resusitasi berbasis panjang badan lebih akurat daripada rumus usia atau berat. Sediakan ukuran alat sekitar 0,5 mm di atas dan bawah hasil. Batasi tekanan cuff ETT kurang dari 20 sampai 25 cmH₂O.</p>
      </div>

      <Section icon={Wind} title="Jalan Napas" badge="APLS">
        <ResultCard label="ETT cuffed, diameter internal" value={airway ? `${airway.cuffed} mm` : "Isi usia"} formula="(usia ÷ 4) + 3,5" source="APLS" />
        <ResultCard label="ETT uncuffed, diameter internal" value={airway ? `${airway.uncuffed} mm` : "Isi usia"} formula="(usia ÷ 4) + 4" source="APLS" />
        <ResultCard label="Kedalaman ETT di bibir" value={airway ? `${airway.depth} cm` : "Isi usia"} formula="(usia ÷ 2) + 12 atau diameter internal × 3" />
        <ResultCard label="Kateter suction" value={airway ? `${airway.suction} Fr` : "Isi usia"} formula="Diameter internal ETT × 2" />
        <ResultCard label="OPA atau Mayo" value={airway?.opa ?? "Isi usia"} formula="Ukur sudut mulut sampai angulus mandibula" />
        <ResultCard label="LMA" value={computedWeight ? `Ukuran ${computedWeight < 5 ? "1" : computedWeight < 10 ? "1,5" : computedWeight < 20 ? "2" : computedWeight < 30 ? "2,5" : computedWeight < 50 ? "3" : computedWeight < 70 ? "4" : "5"}` : "Isi berat atau panjang"} formula="Berdasarkan berat badan pabrikan" />
        <ResultCard label="Bilah laringoskop" value={airway?.blade ?? "Isi usia"} formula="Berdasarkan usia" />
        {airway?.note && <p className="sm:col-span-2 xl:col-span-3 text-xs text-[var(--muted)]">{airway.note}</p>}
      </Section>

      <Section icon={Zap} title="Henti Jantung dan Obat Emergensi" badge="PALS 2025">
        <ResultCard label="Epinefrin IV atau IO" value={resuscitation ? `${format(resuscitation.epinephrineMg)} mg` : "Isi berat atau panjang"} formula={resuscitation ? `${format(resuscitation.epinephrineMl1To10000)} mL larutan 1:10.000 setiap 3 sampai 5 menit` : "0,01 mg/kg"} note="Larutan 1:1.000: encerkan 1 mL dengan 9 mL NaCl 0,9%" source="PALS 2025" />
        <ResultCard label="Defibrilasi" value={resuscitation ? `${resuscitation.defibrillationFirstJ} J, lalu ${resuscitation.defibrillationSecondJ} J` : "Isi berat atau panjang"} formula="2 J/kg, lalu 4 J/kg" note="Maksimum 10 J/kg atau dosis dewasa" source="PALS 2025" />
        <ResultCard label="Amiodaron untuk VF atau pVT" value={resuscitation ? `${resuscitation.amiodaroneMg} mg` : "Isi berat atau panjang"} formula="5 mg/kg bolus, dapat diulang dua kali" note="Maksimum 15 mg/kg total atau 300 mg per dosis" source="PALS 2025" />
        <ResultCard label="Kardioversi tersinkron" value={resuscitation ? `${format(resuscitation.cardioversionLowJ)} sampai ${resuscitation.cardioversionHighJ} J` : "Isi berat atau panjang"} formula="0,5 sampai 1 J/kg, lalu 2 J/kg" source="PALS 2025" />
        <ResultCard label="Adenosin untuk SVT" value={resuscitation ? `${format(resuscitation.adenosineFirstMg)} mg, lalu ${format(resuscitation.adenosineSecondMg)} mg` : "Isi berat atau panjang"} formula="0,1 mg/kg, lalu 0,2 mg/kg" note="Maksimum 6 mg, lalu 12 mg. Berikan cepat dan lanjutkan flush." source="PALS 2025" />
        <ResultCard label="Atropin untuk bradikardia" value={resuscitation ? `${format(resuscitation.atropineMg)} mg` : "Isi berat atau panjang"} formula="0,02 mg/kg, dapat diulang satu kali" note="Maksimum 0,5 mg per dosis" source="PALS 2025" />
        <ResultCard label="Bolus cairan" value={resuscitation ? `${resuscitation.fluidLowMl} sampai ${resuscitation.fluidHighMl} mL` : "Isi berat atau panjang"} formula="10 sampai 20 mL/kg kristaloid isotonik" note="Pada syok septik, mulai 10 mL/kg lalu nilai ulang" source="PALS 2025" />
        <ResultCard label="Dekstrosa untuk hipoglikemia" value={resuscitation ? `${resuscitation.dextroseD10Ml} mL D10` : "Isi berat atau panjang"} formula="D10 5 mL/kg, setara 0,5 g/kg" note="Neonatus: D10 2 mL/kg" />
      </Section>

      <div className="flex gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-strong dark:text-accent" />
        <p className="text-sm leading-6 text-[var(--muted)]"><strong className="text-[var(--ink)]">Pembaruan PALS 2025:</strong> pada ritme shockable, berikan epinefrin setelah syok kedua. Pada ritme non-shockable, berikan epinefrin sedini mungkin. Targetkan tekanan darah pascahenti jantung di atas persentil ke-10 dan cegah hipertermia.</p>
      </div>

      <Section icon={Activity} title="Tanda Vital dan Ambang Hipotensi" badge="Rujukan">
        <ResultCard label="Ambang tekanan darah sistolik rendah" value={visibleResult?.lowSystolicThreshold === null || visibleResult?.lowSystolicThreshold === undefined ? "Isi usia" : `< ${visibleResult.lowSystolicThreshold} mmHg`} formula={visibleResult?.lowSystolicFormula ? "70 + (2 × usia dalam tahun)" : "Berdasarkan kelompok usia"} />
        <div className="overflow-x-auto rounded-lg border border-[var(--line)] sm:col-span-2 xl:col-span-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-subtle)]">
              <tr><th className="px-3 py-2 font-bold">Kelompok usia</th><th className="px-3 py-2 text-center font-bold">Nadi/menit</th><th className="px-3 py-2 text-center font-bold">Napas/menit</th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {vitalRanges.map((range, index) => (
                <tr key={range.label} className={index === visibleResult?.vitalIndex ? "bg-accent/10 font-semibold" : ""}>
                  <td className="px-3 py-2">{range.label}</td><td className="px-3 py-2 text-center">{range.heartRate}</td><td className="px-3 py-2 text-center">{range.respiratoryRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sm:col-span-2 xl:col-span-3 text-xs text-[var(--muted)]">Rentang rujukan PALS untuk anak sadar. Baris sesuai usia pasien akan disorot.</p>
      </Section>

      <section className="workspace-panel overflow-hidden">
        <h2 className="section-band display-type text-base font-bold">Sumber</h2>
        <ul className="space-y-3 p-4 text-sm leading-6 text-[var(--muted)]">
          <li><strong className="text-[var(--ink)]">PALS 2025 AHA/AAP:</strong> Circulation 2025;152(16_suppl_2):S479–S537. DOI 10.1161/CIR.0000000000001368.</li>
          <li><strong className="text-[var(--ink)]">APLS:</strong> Advanced Paediatric Life Support, rumus ETT, kedalaman, dan suction.</li>
          <li><strong className="text-[var(--ink)]">PAWPER XL-MAC:</strong> Wells M, Goldstein LN, Bentley A. South African Medical Journal 2017;107(11):1015–1021. DOI 10.7196/SAMJ.2017.v107i11.12505.</li>
          <li><strong className="text-[var(--ink)]">LMA:</strong> rekomendasi ukuran pabrikan berdasarkan berat badan.</li>
        </ul>
      </section>

      <p className="text-center text-xs leading-5 text-[var(--muted)]">Alat bantu hitung untuk klinisi. Bukan pengganti penilaian klinis, protokol institusi, atau panduan resmi.</p>
    </div>
  );
}
