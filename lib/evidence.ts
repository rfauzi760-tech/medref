import type { ClinicalSource, GuidelineEntry } from "@/lib/types";

/**
 * Source strength (kekuatan sumber).
 *
 * This classifies the *provenance* of the reference an entry cites, not the
 * clinical strength of an individual recommendation. RFSmed stores references
 * but not per-recommendation GRADE labels, and inventing those would be unsafe.
 * So we expose what the data can honestly support: which tier of body a page
 * is sourced from.
 *
 * - Tier 1: international guideline bodies and public health agencies
 * - Tier 2: national/professional societies and institutional protocols
 * - Tier 3: reviews, textbooks and other references
 */

export type SourceTier = 1 | 2 | 3;

export const SOURCE_TIER_LABEL: Record<SourceTier, string> = {
  1: "Tingkat 1 - pedoman internasional",
  2: "Tingkat 2 - organisasi profesi",
  3: "Tingkat 3 - ulasan atau referensi lain",
};

export const SOURCE_TIER_SHORT: Record<SourceTier, string> = {
  1: "T1",
  2: "T2",
  3: "T3",
};

const TIER1_PATTERNS: RegExp[] = [
  /\bWHO\b/i,
  /World Health Organization/i,
  /CDC/i,
  /NICE/i,
  /KDIGO/i,
  /European Society of Cardiology/i,
  /\bESC\b/,
  /American Heart Association/i,
  /\bAHA\b/,
  /American College of Cardiology/i,
  /\bACC\b/,
  /\bIDSA\b/,
  /AASLD/i,
  /EASL/i,
  /ILCOR/i,
  /Resuscitation Council/i,
  /British Thoracic Society/i,
  /\bATS\b/,
  /Surviving Sepsis/i,
  /\bGOLD\b/,
  /\bGINA\b/,
  /American Diabetes/i,
  /\bADA\b/,
  /Difficult Airway Society/i,
  /Infusion Nurses Society/i,
  /American College of Surgeons/i,
  /\bAABB\b/i,
  /\bISTH\b/i,
  /\bSVS\b/,
  /\bAAN\b/,
  /\bACR\b/,
  /American Society of/i,
  /\bAHA\/ASA\b/i,
];

const TIER2_PATTERNS: RegExp[] = [
  /Kemenkes/i,
  /Kementerian Kesehatan/i,
  /\bIDAI\b/i,
  /\bPAPDI\b/i,
  /\bPERKI\b/i,
  /\bPDPI\b/i,
  /\bPERDOSSI\b/i,
  /\bNPSA\b/i,
  /society/i,
  /association/i,
  /college of/i,
];

export function sourceTier(source: ClinicalSource): SourceTier {
  const text = `${source.org} ${source.title}`;
  if (TIER1_PATTERNS.some((pattern) => pattern.test(text))) return 1;
  if (TIER2_PATTERNS.some((pattern) => pattern.test(text))) return 2;
  return 3;
}

/** Best (lowest number = strongest provenance) tier across an entry's references. */
export function bestSourceTier(references: ClinicalSource[]): SourceTier {
  if (references.length === 0) return 3;
  return Math.min(...references.map(sourceTier)) as SourceTier;
}

export function guidelineSourceTier(guideline: Pick<GuidelineEntry, "references">): SourceTier {
  return bestSourceTier(guideline.references);
}
