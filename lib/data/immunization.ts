import type { ImmunizationSchedule } from "@/lib/types";

/**
 * Indonesian immunization schedule (children 0–18 years).
 * Structured, versioned data based on the publicly published Kementerian
 * Kesehatan RI basic immunization schedule and IDAI recommended schedule.
 * Used by the immunization status engine - do not hardcode into UI.
 */

export const immunizationSchedule: ImmunizationSchedule = {
  version: "2024-01",
  title: "Indonesian Child Immunization Schedule",
  source: {
    org: "Kemenkes RI / IDAI",
    title: "Jadwal Imunisasi Anak (PMK No. 12/2017 & rekomendasi IDAI 2023)",
    year: 2024,
    url: "https://idai.or.id",
  },
  vaccines: [
    {
      id: "hb0",
      name: "Hepatitis B (birth dose)",
      shortName: "HB-0",
      description: "Hepatitis B vaccine, birth dose - within 24 hours of birth.",
      doses: [{ doseNumber: 1, dueAgeMonths: 0, windowStart: 0, windowEnd: 0, label: "Birth (≤ 24 hours)" }],
    },
    {
      id: "bcg",
      name: "BCG",
      shortName: "BCG",
      description: "Tuberculosis vaccine - single dose soon after birth.",
      doses: [{ doseNumber: 1, dueAgeMonths: 1, windowStart: 0, windowEnd: 2, label: "Age 0–2 months" }],
    },
    {
      id: "polio0",
      name: "Polio 0 (birth)",
      shortName: "Polio 0",
      description: "OPV birth dose.",
      doses: [{ doseNumber: 1, dueAgeMonths: 0, windowStart: 0, windowEnd: 0, label: "Birth" }],
    },
    {
      id: "hb",
      name: "Hepatitis B (completion)",
      shortName: "HB",
      description: "Hepatitis B vaccine, doses 2 and 3 (pentavalent/DPT-HB-Hib).",
      doses: [
        { doseNumber: 2, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Age 2 months" },
        { doseNumber: 3, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Age 3 months" },
      ],
    },
    {
      id: "dpt",
      name: "DPT-HB-Hib (Pentavalent)",
      shortName: "DPT-HB-Hib",
      description: "Diphtheria, pertussis, tetanus, hepatitis B, Hib.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Age 2 months" },
        { doseNumber: 2, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Age 3 months" },
        { doseNumber: 3, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Age 4 months" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Booster age 18 months" },
      ],
    },
    {
      id: "polio",
      name: "Polio (OPV/IPV)",
      shortName: "Polio",
      description: "Oral polio vaccine doses + IPV dose.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Age 2 months" },
        { doseNumber: 2, dueAgeMonths: 3, windowStart: 2, windowEnd: 4, label: "Age 3 months" },
        { doseNumber: 3, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Age 4 months" },
        { doseNumber: 4, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Booster age 18 months" },
        { doseNumber: 5, dueAgeMonths: 60, windowStart: 54, windowEnd: 66, label: "Booster age 5 years" },
      ],
    },
    {
      id: "ipv",
      name: "IPV (Inactivated Polio)",
      shortName: "IPV",
      description: "Inactivated polio vaccine - one dose alongside OPV-3.",
      doses: [{ doseNumber: 1, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Age 4 months" }],
    },
    {
      id: "pcv",
      name: "PCV (Pneumococcal)",
      shortName: "PCV",
      description: "Pneumococcal conjugate vaccine (IDAI recommended).",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Age 2 months" },
        { doseNumber: 2, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Age 4 months" },
        { doseNumber: 3, dueAgeMonths: 12, windowStart: 10, windowEnd: 14, label: "Booster age 12 months" },
      ],
    },
    {
      id: "rota",
      name: "Rotavirus",
      shortName: "Rotavirus",
      description: "Rotavirus vaccine, oral (IDAI recommended).",
      doses: [
        { doseNumber: 1, dueAgeMonths: 2, windowStart: 1, windowEnd: 3, label: "Age 2 months" },
        { doseNumber: 2, dueAgeMonths: 4, windowStart: 3, windowEnd: 5, label: "Age 4 months" },
        { doseNumber: 3, dueAgeMonths: 6, windowStart: 5, windowEnd: 7, label: "Age 6 months (3-dose product)" },
      ],
    },
    {
      id: "measles",
      name: "Measles-Rubella (MR)",
      shortName: "MR",
      description: "Measles & rubella vaccine.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 9, windowStart: 8, windowEnd: 10, label: "Age 9 months" },
        { doseNumber: 2, dueAgeMonths: 18, windowStart: 15, windowEnd: 21, label: "Booster age 18 months" },
      ],
    },
    {
      id: "je",
      name: "JE (Japanese Encephalitis)",
      shortName: "JE",
      description: "Japanese encephalitis vaccine.",
      doses: [{ doseNumber: 1, dueAgeMonths: 9, windowStart: 8, windowEnd: 10, label: "Age 9 months" }],
    },
    {
      id: "dtp",
      name: "DTP booster (school age)",
      shortName: "DTP/Td",
      description: "Booster doses at school age.",
      doses: [
        { doseNumber: 1, dueAgeMonths: 60, windowStart: 54, windowEnd: 66, label: "Booster age 5 years (DT)" },
        { doseNumber: 2, dueAgeMonths: 144, windowStart: 132, windowEnd: 156, label: "Booster age 12 years (Td)" },
      ],
    },
    {
      id: "hpv",
      name: "HPV",
      shortName: "HPV",
      description: "Human papillomavirus vaccine (recommended, girls; school program).",
      doses: [
        { doseNumber: 1, dueAgeMonths: 132, windowStart: 120, windowEnd: 144, label: "Age 11 years" },
        { doseNumber: 2, dueAgeMonths: 134, windowStart: 121, windowEnd: 147, label: "1–2 months after dose 1" },
      ],
    },
  ],
};

export function vaccineByShortName(shortName: string) {
  return immunizationSchedule.vaccines.find((v) => v.shortName === shortName);
}