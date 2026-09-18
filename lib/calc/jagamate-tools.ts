export const JAGAMATE_TOOL_SOURCES = {
  diarrhea: "https://cdn.who.int/media/docs/default-source/nepal-documents/hss_nepal/standard-treatment-protocol-of-emergency-health-service-package.pdf?sfvrsn=6c838ca4_7",
  planC: "https://extranet.who.int/ncdccs/Data/GHA_D1_Standard-Treatment-Guideline-2010.pdf",
  shock: "https://iris.who.int/bitstream/handle/10665/331599/9789240002869-eng.pdf",
  dating: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date",
  fetalWeight: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11026007/",
  burn: "https://cdn.who.int/media/docs/default-source/integrated-health-services-%28ihs%29/csy/ect/ect-pocket-guide-%28a5%29.pdf",
} as const;

/** Adult rule of nines. Pediatric proportions vary with age and are not inferred here. */
export const ADULT_BURN_REGIONS = [
  { id: "head", label: "Kepala dan leher", percent: 9 },
  { id: "front-trunk", label: "Badan depan", percent: 18 },
  { id: "back-trunk", label: "Badan belakang", percent: 18 },
  { id: "right-arm", label: "Lengan kanan", percent: 9 },
  { id: "left-arm", label: "Lengan kiri", percent: 9 },
  { id: "right-leg", label: "Tungkai kanan", percent: 18 },
  { id: "left-leg", label: "Tungkai kiri", percent: 18 },
  { id: "perineum", label: "Perineum", percent: 1 },
] as const;

export function calculateAdultBurnArea(ids: string[]): number | undefined {
  if (new Set(ids).size !== ids.length) return undefined;
  const matched = ids.map((id) => ADULT_BURN_REGIONS.find((region) => region.id === id));
  if (matched.some((region) => !region)) return undefined;
  return matched.reduce((total, region) => total + region!.percent, 0);
}

type Blocked = { status: "blocked"; reason: string };
const blocked = (reason: string): Blocked => ({ status: "blocked", reason });

function validWeight(weightKg: number) { return Number.isFinite(weightKg) && weightKg > 0 && weightKg <= 200; }

export function calculateDiarrheaPlan(input: { plan: "A" | "B" | "C"; ageMonths: number; weightKg: number; severeMalnutrition: boolean }) {
  const { plan, ageMonths, weightKg, severeMalnutrition } = input;
  if (!validWeight(weightKg) || !Number.isFinite(ageMonths) || ageMonths < 1 || ageMonths >= 216) return blocked("Masukkan berat dan usia anak yang valid (1 bulan hingga kurang dari 18 tahun).");
  if (severeMalnutrition) return blocked("Malnutrisi akut berat memerlukan protokol rehidrasi khusus dan pemantauan langsung.");
  if (plan === "A") {
    if (ageMonths >= 120) return { status: "ok" as const, plan, note: "Berikan oralit sebanyak yang diinginkan setelah setiap BAB cair, sesuai toleransi. Lanjutkan ASI dan makan." };
    const minMl = ageMonths < 24 ? 50 : 100;
    const maxMl = ageMonths < 24 ? 100 : 200;
    return { status: "ok" as const, plan, minMl, maxMl, note: "Oralit setelah setiap BAB cair di rumah; nilai ulang bila muncul tanda dehidrasi atau bahaya." };
  }
  if (plan === "B") return { status: "ok" as const, plan, totalMl: 75 * weightKg, hours: 4, note: "Oralit 75 mL/kg selama 4 jam sesuai panduan WHO, lalu nilai ulang status dehidrasi." };
  if (plan === "C") {
    const infant = ageMonths < 12;
    return { status: "ok" as const, plan, totalMl: 100 * weightKg, firstMl: 30 * weightKg, firstHours: infant ? 1 : 0.5, secondMl: 70 * weightKg, secondHours: infant ? 5 : 2.5, note: "Ringer laktat IV atau NaCl 0,9% bila tidak tersedia. Lakukan di fasilitas kesehatan, nilai ulang berkala, dan mulai oralit saat anak dapat minum." };
  }
  return blocked("Rencana terapi tidak dikenal.");
}

export function calculateShockBolus(input: { weightKg: number; ageMonths: number; severeMalnutrition: boolean; cardiacFailure: boolean }) {
  if (!validWeight(input.weightKg) || !Number.isFinite(input.ageMonths) || input.ageMonths < 1 || input.ageMonths >= 216) return blocked("Masukkan berat dan usia anak yang valid.");
  if (input.severeMalnutrition || input.cardiacFailure) return blocked("Syok dengan malnutrisi akut berat atau dugaan gangguan jantung memerlukan protokol khusus, bukan bolus standar.");
  return { status: "ok" as const, minMl: 10 * input.weightKg, maxMl: 20 * input.weightKg, note: "Kisaran bolus kristaloid awal pada anak tanpa malnutrisi akut berat. Nilai ulang perfusi dan tanda overload setelah tiap bolus; jenis syok menentukan tata laksana." };
}

function parseIsoDate(iso: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  const date = new Date(`${iso}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? date : undefined;
}

export function calculatePregnancyDating(hphtIso: string, referenceIso: string) {
  const hpht = parseIsoDate(hphtIso), reference = parseIsoDate(referenceIso);
  if (!hpht || !reference) return blocked("Tanggal HPHT atau tanggal pemeriksaan tidak valid.");
  const elapsed = Math.floor((reference.getTime() - hpht.getTime()) / 86_400_000);
  if (elapsed < 0 || elapsed > 315) return blocked("HPHT harus pada masa lalu dan usia kehamilan tidak boleh melebihi 45 minggu.");
  const dueDate = new Date(hpht.getTime() + 280 * 86_400_000).toISOString().slice(0, 10);
  return { status: "ok" as const, dueDate, weeks: Math.floor(elapsed / 7), days: elapsed % 7, note: "Perkiraan berbasis HPHT dan siklus 28 hari. USG trimester pertama dapat mengubah penanggalan; gunakan estimasi obstetri terbaik." };
}

export function calculateFundalEstimate(input: { fundalHeightCm: number; station: "above" | "at" | "below"; gestationalWeeks: number }) {
  const { fundalHeightCm, station, gestationalWeeks } = input;
  if (!Number.isFinite(gestationalWeeks) || gestationalWeeks < 37 || gestationalWeeks > 42) return blocked("Rumus Johnson-Toshach pada sumber ini dinilai pada kehamilan aterm 37 sampai 42 minggu.");
  if (!Number.isFinite(fundalHeightCm) || fundalHeightCm < 20 || fundalHeightCm > 50) return blocked("Masukkan TFU 20 sampai 50 cm dan periksa kembali pengukuran.");
  const offset = { above: 13, at: 12, below: 11 }[station];
  if (!offset) return blocked("Pilih stasiun kepala janin.");
  return { status: "ok" as const, estimatedGrams: (fundalHeightCm - offset) * 155, note: "Estimasi klinis kasar untuk janin tunggal aterm presentasi kepala. Jangan menggantikan USG atau keputusan persalinan berdasarkan angka ini saja." };
}

export function calculateBurnResuscitation(input: { ageYears: number; weightKg: number; tbsaPercent: number; multiplier: 2 | 3 | 4; hoursSinceInjury: number }) {
  const { ageYears, weightKg, tbsaPercent, multiplier, hoursSinceInjury } = input;
  if (!Number.isFinite(ageYears) || ageYears < 0 || ageYears > 100 || !validWeight(weightKg)) return blocked("Masukkan usia dan berat badan yang valid.");
  if (!Number.isFinite(tbsaPercent) || tbsaPercent <= 0 || tbsaPercent > 100) return blocked("Persentase luas luka bakar tidak valid. Hitung hanya luka bakar parsial atau ketebalan penuh.");
  if (ageYears < 16 ? tbsaPercent < 10 : tbsaPercent < 15) return blocked("Persentase di bawah ambang panduan resusitasi IV; nilai kebutuhan cairan secara klinis.");
  if (![2, 3, 4].includes(multiplier)) return blocked("Pilih faktor awal 2, 3, atau 4 mL/kg/%TBSA.");
  if (!Number.isFinite(hoursSinceInjury) || hoursSinceInjury < 0 || hoursSinceInjury >= 8) return blocked("Setelah 8 jam sejak cedera, laju awal tidak boleh dihitung sebagai pengganti penilaian langsung.");
  const first24hMl = multiplier * weightKg * tbsaPercent;
  return { status: "ok" as const, first24hMl, first8hMl: first24hMl / 2, next16hMl: first24hMl / 2, remainingFirstWindowHours: 8 - hoursSinceInjury, note: `Perkiraan awal selama 24 jam sejak cedera, bukan order infus. Separuh volume dalam 8 jam pertama dihitung sejak waktu luka bakar, dan cairan yang sudah diberikan harus diperhitungkan. ${ageYears < 16 ? "Pada anak, cairan rumatan tambahan perlu dihitung terpisah." : ""} Titrasi menurut perfusi dan keluaran urin; hindari overload.` };
}
