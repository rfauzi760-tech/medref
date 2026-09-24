export const KPSP_AGE_FORMS = [
  { months: 3, page: 306 },
  { months: 6, page: 308 },
  { months: 9, page: 309 },
  { months: 12, page: 311 },
  { months: 15, page: 312 },
  { months: 18, page: 313 },
  { months: 21, page: 314 },
  { months: 24, page: 315 },
  { months: 30, page: 316 },
  { months: 36, page: 317 },
  { months: 42, page: 318 },
  { months: 48, page: 319 },
  { months: 54, page: 320 },
  { months: 60, page: 322 },
  { months: 66, page: 324 },
  { months: 72, page: 326 },
] as const;

export type KpspCategory = "Sesuai (S)" | "Meragukan (M)" | "Penyimpangan (P)";

export function kpspCategory(yesCount: number): KpspCategory {
  if (yesCount >= 9) return "Sesuai (S)";
  if (yesCount >= 7) return "Meragukan (M)";
  return "Penyimpangan (P)";
}

export function kpspAction(category: KpspCategory): string {
  if (category === "Sesuai (S)") return "Lanjutkan stimulasi dan pemantauan perkembangan sesuai jadwal.";
  if (category === "Meragukan (M)") return "Lakukan stimulasi, ulangi KPSP 2 minggu kemudian, dan rujuk bila hasil tetap meragukan.";
  return "Rujuk ke fasilitas atau tenaga kesehatan untuk evaluasi perkembangan.";
}
