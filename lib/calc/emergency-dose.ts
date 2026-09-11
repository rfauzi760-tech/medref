function valid(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(`${label} harus lebih dari 0`);
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function totalDose({ weightKg, dosePerKg }: { weightKg: number; dosePerKg: number }) {
  valid(weightKg, "Berat badan");
  valid(dosePerKg, "Dosis");
  return round(weightKg * dosePerKg);
}

export function pumpRate({ weightKg, doseMcgKgMin, concentrationMcgMl }: { weightKg: number; doseMcgKgMin: number; concentrationMcgMl: number }) {
  valid(weightKg, "Berat badan");
  valid(doseMcgKgMin, "Dosis");
  valid(concentrationMcgMl, "Konsentrasi");
  return round((doseMcgKgMin * weightKg * 60) / concentrationMcgMl);
}

export function doseFromRate({ weightKg, rateMlHour, concentrationMcgMl }: { weightKg: number; rateMlHour: number; concentrationMcgMl: number }) {
  valid(weightKg, "Berat badan");
  valid(rateMlHour, "Laju infus");
  valid(concentrationMcgMl, "Konsentrasi");
  return round((rateMlHour * concentrationMcgMl) / (weightKg * 60), 3);
}

export interface InfusionPreset {
  id: string;
  name: string;
  category: string;
  unit: string;
  range: string;
  concentrations: { label: string; mcgMl: number }[];
  note: string;
}

export const INFUSION_PRESETS: InfusionPreset[] = [
  { id: "norepinephrine", name: "Norepinefrin", category: "Vasopresor", unit: "mcg/kg/menit", range: "0,01 sampai 3", concentrations: [{ label: "4 mg dalam 50 mL", mcgMl: 80 }, { label: "8 mg dalam 50 mL", mcgMl: 160 }, { label: "4 mg dalam 100 mL", mcgMl: 40 }], note: "Pilihan pertama pada syok septik. Titrasi terhadap target perfusi dan MAP." },
  { id: "epinephrine", name: "Epinefrin", category: "Vasopresor", unit: "mcg/kg/menit", range: "0,01 sampai 1", concentrations: [{ label: "4 mg dalam 50 mL", mcgMl: 80 }, { label: "4 mg dalam 100 mL", mcgMl: 40 }], note: "Pantau aritmia, laktat, dan perfusi." },
  { id: "dopamine", name: "Dopamin", category: "Vasopresor", unit: "mcg/kg/menit", range: "2 sampai 20", concentrations: [{ label: "200 mg dalam 50 mL", mcgMl: 4000 }, { label: "400 mg dalam 50 mL", mcgMl: 8000 }], note: "Gunakan secara selektif karena risiko aritmia." },
  { id: "dobutamine", name: "Dobutamin", category: "Inotropik", unit: "mcg/kg/menit", range: "2 sampai 20", concentrations: [{ label: "250 mg dalam 50 mL", mcgMl: 5000 }, { label: "500 mg dalam 50 mL", mcgMl: 10000 }], note: "Pantau tekanan darah dan tanda hipoperfusi." },
  { id: "nicardipine", name: "Nikardipin", category: "Antihipertensi", unit: "mcg/kg/menit", range: "0,5 sampai 5", concentrations: [{ label: "25 mg dalam 50 mL", mcgMl: 500 }], note: "Titrasi bertahap dan hindari penurunan tekanan darah berlebihan." },
  { id: "midazolam", name: "Midazolam", category: "Sedasi", unit: "mcg/kg/menit", range: "0,02 sampai 0,2", concentrations: [{ label: "50 mg dalam 50 mL", mcgMl: 1000 }], note: "Pantau jalan napas, ventilasi, tekanan darah, dan tingkat sedasi." },
  { id: "morphine", name: "Morfin", category: "Analgesik", unit: "mcg/kg/menit", range: "0,01 sampai 0,1", concentrations: [{ label: "50 mg dalam 50 mL", mcgMl: 1000 }], note: "Titrasi terhadap nyeri dan pantau depresi napas." },
  { id: "fentanyl", name: "Fentanil", category: "Analgesik", unit: "mcg/kg/jam", range: "0,5 sampai 5", concentrations: [{ label: "500 mcg dalam 50 mL", mcgMl: 10 }], note: "Untuk satuan per jam, masukkan dosis per menit setelah dibagi 60." },
];
