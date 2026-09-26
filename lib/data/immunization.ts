import type { ImmunizationSchedule } from "@/lib/types";

/**
 * Jadwal Imunisasi Anak Usia 0–18 Tahun.
 *
 * Structured, versioned data mirroring the IDAI (Ikatan Dokter Anak Indonesia)
 * 2024 recommended schedule chart. Doses follow the chart's age marks; the
 * legend categories (primer / catch-up / booster / daerah endemis / risiko
 * tinggi) are carried in each dose label because the assessment engine only
 * needs age windows.
 *
 * Used by the immunization status engine - do not hardcode into UI.
 */

export const immunizationSchedule: ImmunizationSchedule = {
  version: "2024-02",
  title: "Jadwal Imunisasi Anak Usia 0–18 Tahun",
  source: {
    org: "IDAI",
    title: "Jadwal Imunisasi Anak Usia 0–18 Tahun - Rekomendasi IDAI 2024",
    year: 2024,
    url: "https://idai.or.id",
  },
  vaccines: [
    {
      id: "hb",
      name: "Hepatitis B",
      shortName: "Hep B",
      description: "Hepatitis B - dosis lahir ditambah dosis 1-3 bulan dan dosis 18 bulan.",
      doses: [
        { doseNumber: 0, dueAgeMonths: 0, windowStart: 0, windowEnd: 0, label: "Lahir (≤ 24 jam)" },
        { doseNumber: 1, dueAgeMonths: 1, windowStart: 0, windowEnd: 2, label: "Usia 1 bulan" },
        { doseNumber: 2, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan" },
        { doseNumber: 3, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Usia 3 bulan" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Usia 18 bulan" },
      ],
    },
    {
      id: "polio",
      name: "Polio",
      shortName: "Polio",
      description: "Polio (OPV/IPV) - dosis lahir, seri dasar 1-3 bulan, dan dosis 18 bulan.",
      doses: [
        { doseNumber: 0, dueAgeMonths: 0, windowStart: 0, windowEnd: 0, label: "Lahir (OPV-0)" },
        { doseNumber: 1, dueAgeMonths: 1, windowStart: 0, windowEnd: 2, label: "Usia 1 bulan" },
        { doseNumber: 2, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan" },
        { doseNumber: 3, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Usia 3 bulan (IPV)" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Usia 18 bulan" },
      ],
    },
    {
      id: "bcg",
      name: "BCG",
      shortName: "BCG",
      description: "Bacillus Calmette-Guérin - dosis tunggal saat lahir.",
      doses: [{ doseNumber: 1, dueAgeMonths: 0, windowStart: 0, windowEnd: 1, label: "Lahir (0–1 bulan)" }],
    },
    {
      id: "dtp",
      name: "DTP",
      shortName: "DTP",
      description: "Difteri, tetanus, pertusis - seri primer, booster 18 bulan dan 5 tahun, lalu Td/Tdap.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan" },
        { doseNumber: 2, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Usia 3 bulan" },
        { doseNumber: 3, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Usia 4 bulan" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Usia 18 bulan" },
        { doseNumber: 5, dueAgeMonths: 60, windowStart: 54, windowEnd: 66, label: "Usia 5 tahun (booster)" },
        { doseNumber: 6, dueAgeMonths: 72, windowStart: 72, windowEnd: 216, label: "Td/Tdap usia 6–18 tahun" },
      ],
    },
    {
      id: "hib",
      name: "Hib",
      shortName: "Hib",
      description: "Haemophilus influenzae tipe b - seri primer dan booster 18 bulan.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan" },
        { doseNumber: 2, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Usia 3 bulan" },
        { doseNumber: 3, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Usia 4 bulan" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Usia 18 bulan" },
      ],
    },
    {
      id: "pcv",
      name: "PCV (Pneumokokus)",
      shortName: "PCV",
      description:
        "Pneumococcal conjugate vaccine - seri primer 2/4/6 bulan dan booster 12 bulan; usia 5-18 tahun untuk anak dengan risiko tinggi.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan" },
        { doseNumber: 2, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Usia 4 bulan" },
        { doseNumber: 3, dueAgeMonths: 6, windowStart: 5, windowEnd: 7, label: "Usia 6 bulan" },
        { doseNumber: 4, dueAgeMonths: 12, windowStart: 10, windowEnd: 14, label: "Usia 12 bulan (booster)" },
      ],
    },
    {
      id: "rota",
      name: "Rotavirus",
      shortName: "Rotavirus",
      description: "Rotavirus oral - RV1 atau RV5 sesuai produk; dosis ketiga hanya untuk produk RV5.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Usia 2 bulan (RV1/RV5)" },
        { doseNumber: 2, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Usia 4 bulan (RV1/RV5)" },
        { doseNumber: 3, dueAgeMonths: 6, windowStart: 5, windowEnd: 7, label: "Usia 6 bulan (RV5)" },
      ],
    },
    {
      id: "influenza",
      name: "Influenza",
      shortName: "Influenza",
      description: "Influenza - mulai usia 6 bulan, diulang setiap tahun 1 dosis.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 6, windowStart: 6, windowEnd: 216, label: "Mulai usia 6 bulan, diulang setiap tahun" },
      ],
    },
    {
      id: "mr",
      name: "MR / MMR",
      shortName: "MR/MMR",
      description: "Campak-rubela (MR) dan campak-mumps-rubela (MMR).",
      doses: [
        { doseNumber: 1, dueAgeMonths: 9, windowStart: 8, windowEnd: 10, label: "Usia 9 bulan (MR)" },
        { doseNumber: 2, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Usia 18 bulan (MR/MMR)" },
        { doseNumber: 3, dueAgeMonths: 60, windowStart: 60, windowEnd: 144, label: "Usia 5 tahun (MR/MMR)" },
      ],
    },
    {
      id: "je",
      name: "JE (Japanese Encephalitis)",
      shortName: "JE",
      description: "Japanese encephalitis - untuk daerah endemis.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 9, windowStart: 8, windowEnd: 10, label: "Usia 9 bulan (daerah endemis)" },
        { doseNumber: 2, dueAgeMonths: 24, windowStart: 21, windowEnd: 27, label: "Usia 24 bulan (daerah endemis)" },
      ],
    },
    {
      id: "varicella",
      name: "Varicela",
      shortName: "Varicela",
      description: "Varicela - 2 dosis, dimulai usia 12 bulan.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 12, windowStart: 12, windowEnd: 216, label: "Mulai usia 12 bulan" },
        { doseNumber: 2, dueAgeMonths: 60, windowStart: 24, windowEnd: 216, label: "Dosis 2 (interval 4–8 minggu atau usia 4–6 tahun)" },
      ],
    },
    {
      id: "hepa",
      name: "Hepatitis A",
      shortName: "Hep A",
      description: "Hepatitis A - 2 dosis, dimulai usia 12 bulan.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 12, windowStart: 12, windowEnd: 216, label: "Mulai usia 12 bulan" },
        { doseNumber: 2, dueAgeMonths: 18, windowStart: 15, windowEnd: 216, label: "Dosis 2 (interval 6–12 bulan)" },
      ],
    },
    {
      id: "tifoid",
      name: "Tifoid",
      shortName: "Tifoid",
      description: "Tifoid - mulai usia 24 bulan, diulang setiap 3 tahun 1 dosis.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 24, windowStart: 24, windowEnd: 216, label: "Mulai usia 24 bulan, diulang setiap 3 tahun" },
      ],
    },
    {
      id: "dengue",
      name: "Dengue",
      shortName: "Dengue",
      description: "Dengue - 2 dosis dengan interval 3 bulan, untuk usia sekolah dan remaja.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 84, windowStart: 72, windowEnd: 216, label: "Mulai usia 7 tahun" },
        { doseNumber: 2, dueAgeMonths: 87, windowStart: 75, windowEnd: 216, label: "Dosis 2 (interval 3 bulan)" },
      ],
    },
    {
      id: "hpv",
      name: "HPV",
      shortName: "HPV",
      description:
        "Human papillomavirus - 2 dosis pada usia 11–12 tahun; 3 dosis bila dimulai usia 15 tahun atau lebih.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 132, windowStart: 120, windowEnd: 216, label: "Usia 11 tahun (perempuan)" },
        { doseNumber: 2, dueAgeMonths: 144, windowStart: 132, windowEnd: 216, label: "Usia 12 tahun (interval 6–12 bulan)" },
      ],
    },
  ],
};

export function vaccineByShortName(shortName: string) {
  return immunizationSchedule.vaccines.find((v) => v.shortName === shortName);
}
