/**
 * Shared entity types for the clinical data layer.
 *
 * Every content entity carries source/version metadata so guidance can be
 * updated and superseded over time (source versioning from day one).
 */

export interface ClinicalSource {
  org: string;
  title: string;
  year: number;
  url?: string;
  version?: string;
}

export interface ClinicalToolMeta {
  id: string;
  slug: string;
  title: string;
  abbreviation?: string;
  description: string;
  specialties: string[];
  keywords: string[];
  /** ISO date of last clinical review */
  lastReviewed: string;
  source: ClinicalSource;
  warnings?: string[];
  /** primary clinical use */
  indication?: string;
  /** known caveats */
  limitations?: string;
}

/* ------------------------------------------------------------------ */
/* Scores, rules & diagnostic criteria                                 */
/* ------------------------------------------------------------------ */

export type ScoreVariableType = "select" | "number" | "bool";

export interface ScoreOption {
  label: string;
  /** points contributed */
  value: number;
  shortLabel?: string;
}

export interface ScoreVariable {
  id: string;
  label: string;
  shortLabel?: string;
  help?: string;
  type: ScoreVariableType;
  required?: boolean;
  /** select / bool options */
  options?: ScoreOption[];
  /** number input */
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** extra points for number inputs (e.g. GCS motor 6-1 mapping handled by options) */
  scale?: (v: number) => number;
  /** hide this variable unless predicate true (values include earlier answers) */
  hideWhen?: (values: ScoreValues) => boolean;
}

export type ScoreValues = Record<string, number | string | undefined>;

export type ScoreTone = "success" | "info" | "warning" | "danger";

export interface ScoreRange {
  min: number;
  max: number;
  category: string;
  label: string;
  action?: string;
  tone?: ScoreTone;
}

export interface ScoreModifier {
  whenVar: string;
  whenValue: string | number;
  /** e.g. Wells PE: -3 when no prior DVT */
  delta: number;
  note?: string;
}

export type ClinicalToolCategory = "score" | "rule" | "criteria";

export interface ScoreTool extends ClinicalToolMeta {
  type: "score";
  category: ClinicalToolCategory;
  /** for criteria tools: number of criteria that must be met for diagnosis */
  criteriaMode?: "count" | "all" | "any";
  variables: ScoreVariable[];
  ranges: ScoreRange[];
  modifiers?: ScoreModifier[];
  /** shown when total == 0 (all negatives) */
  zeroLabel?: string;
  /** optional custom computation for staging/grid tools (e.g. Sarnat, KDIGO AKI, CKD grid) */
  compute?: (values: ScoreValues) => { total: number; detail?: string };
}

export interface ScoreEvaluation {
  total: number;
  range?: ScoreRange;
  perVariable: { id: string; label: string; points: number; selected: string }[];
  missing: string[];
  appliedModifiers: { note: string; delta: number }[];
  computeDetail?: string;
}

/* ------------------------------------------------------------------ */
/* Calculators                                                         */
/* ------------------------------------------------------------------ */

export interface CalcInput {
  id: string;
  label: string;
  unit?: string;
  type: "number" | "select" | "bool" | "date";
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  options?: { label: string; value: string }[];
  help?: string;
  /** show only when predicate true */
  hideWhen?: (values: Record<string, number | string | undefined>) => boolean;
}

export interface CalcResultLine {
  label: string;
  value: string;
  unit?: string;
  tone?: ScoreTone;
  detail?: string;
}

export interface CalcResult {
  lines: CalcResultLine[];
  note?: string;
  warnings?: string[];
}

export type FormulaFn = (v: Record<string, number | string | undefined>) => CalcResult;

export interface CalculatorTool extends ClinicalToolMeta {
  type: "calculator";
  category:
    | "body"
    | "renal"
    | "fluid"
    | "electrolyte"
    | "drug"
    | "ventilation"
    | "cardio"
    | "obstetric"
    | "pediatric"
    | "metabolic";
  inputs: CalcInput[];
  /** formula displayed to the user */
  formulaText?: string;
  interpretation?: string;
}

/* ------------------------------------------------------------------ */
/* Drugs & interactions                                                */
/* ------------------------------------------------------------------ */

export type DosePopulation = "adult" | "pediatric" | "neonatal" | "all";

export interface MgPerKgDose {
  min: number;
  max?: number;
  /** basis: per dose or per day */
  per: "dose" | "day";
  /** times per day when per === "dose" */
  frequencyPerDay?: number;
  maxDailyMg?: number;
  maxPerDoseMg?: number;
  maxText?: string;
  note?: string;
  /** display unit for the per-kg and calculated amounts (default "mg") */
  doseUnit?: "mg" | "mcg" | "units" | "g";
}

export interface DrugDose {
  population: DosePopulation;
  route: string;
  indication?: string;
  /** human-readable standard dose */
  text: string;
  weightBased?: MgPerKgDose;
  notes?: string[];
}

export interface DosePreparation {
  id: string;
  label: string;
  drugAmount: number;
  drugUnit: NonNullable<MgPerKgDose["doseUnit"]>;
  carrierAmount: number;
  carrierUnit: "mL" | "tablet" | "kapsul" | "suppositoria";
  /** Route inferred from the dosage form; omitted when the source is not specific. */
  administration?: "oral" | "parenteral" | "rectal";
}

export interface Drug {
  id: string;
  slug: string;
  genericName: string;
  brandNames?: string[];
  drugClass: string;
  specialties: string[];
  keywords: string[];
  indications: string[];
  doses: DrugDose[];
  contraindications?: string[];
  majorWarnings?: string[];
  renalConsideration?: string;
  hepaticConsideration?: string;
  preparations?: string[];
  /** Machine-readable preparations for safe dose-to-volume/unit conversion. */
  dosePreparations?: DosePreparation[];
  pregnancy?: string;
  lactation?: string;
  notes?: string[];
  lastReviewed: string;
  source: ClinicalSource;
}

export type InteractionSeverity = "contraindicated" | "major" | "moderate" | "minor" | "unknown";

export interface DrugInteraction {
  id: string;
  /** drug slugs - symmetric */
  a: string;
  b: string;
  severity: InteractionSeverity;
  mechanism: string;
  effect: string;
  management: string;
  source: ClinicalSource;
}

/* ------------------------------------------------------------------ */
/* Indications & contraindications                                     */
/* ------------------------------------------------------------------ */

export interface ProcedureEntry {
  id: string;
  slug: string;
  title: string;
  specialties: string[];
  keywords: string[];
  definition: string;
  indications: string[];
  absoluteContraindications: string[];
  relativeContraindications: string[];
  precautions: string[];
  preparation: string[];
  complications: string[];
  references: ClinicalSource[];
  lastReviewed: string;
}

/* ------------------------------------------------------------------ */
/* Guidelines                                                          */
/* ------------------------------------------------------------------ */

export type ClinicalContentItem =
  | string
  | {
      heading: string;
      children: ClinicalContentItem[];
    };

export interface GuidelineEntry {
  id: string;
  slug: string;
  title: string;
  specialties: string[];
  keywords: string[];
  emergency: boolean;
  ageGroup: "adult" | "pediatric" | "both" | "neonatal";
  pregnancyRelevant?: boolean;
  sections: Partial<Record<GuidelineSectionKey, ClinicalContentItem[]>>;
  references: ClinicalSource[];
  lastReviewed: string;
}

export type GuidelineSectionKey =
  | "overview"
  | "diagnosticCriteria"
  | "differentials"
  | "classification"
  | "initialAssessment"
  | "investigations"
  | "initialManagement"
  | "definitiveManagement"
  | "medications"
  | "admissionCriteria"
  | "icuCriteria"
  | "discharge"
  | "followUp"
  | "redFlags";

export const GUIDELINE_SECTIONS: { key: GuidelineSectionKey; label: string }[] = [
  { key: "overview", label: "Ringkasan" },
  { key: "diagnosticCriteria", label: "Kriteria Diagnosis" },
  { key: "differentials", label: "Diagnosis Banding" },
  { key: "classification", label: "Klasifikasi" },
  { key: "initialAssessment", label: "Penilaian Awal" },
  { key: "investigations", label: "Pemeriksaan Penunjang" },
  { key: "initialManagement", label: "Tatalaksana Awal" },
  { key: "definitiveManagement", label: "Tatalaksana Lanjut / Definitif" },
  { key: "medications", label: "Medikasi" },
  { key: "admissionCriteria", label: "Kriteria Rawat" },
  { key: "icuCriteria", label: "Kriteria ICU / Rujukan" },
  { key: "discharge", label: "Kriteria Pulang" },
  { key: "followUp", label: "Follow-up" },
  { key: "redFlags", label: "Tanda Bahaya (Red Flags)" },
];

/* ------------------------------------------------------------------ */
/* ICD-10                                                              */
/* ------------------------------------------------------------------ */

export interface Icd10Entry {
  code: string;
  en: string;
  id?: string;
  chapter: string;
}

/* ------------------------------------------------------------------ */
/* Nutrition                                                           */
/* ------------------------------------------------------------------ */

export interface FoodItem {
  id: string;
  name: string;
  nameId?: string;
  category: string;
  /** per 100 g */
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
  potassium?: number;
  /** typical serving size in grams */
  servingG?: number;
}

export interface NutritionGuidance {
  id: string;
  slug: string;
  title: string;
  specialties: string[];
  keywords: string[];
  summary: string;
  principles: string[];
  foodsRecommended: string[];
  foodsLimited: string[];
  sampleDay?: string[];
  references: ClinicalSource[];
  lastReviewed: string;
}

/* ------------------------------------------------------------------ */
/* Pediatrics                                                          */
/* ------------------------------------------------------------------ */

export type MilestoneDomain = "gross" | "fine" | "language" | "social" | "cognitive";

export interface MilestoneAge {
  ageMonths: number;
  label: string;
  milestones: Partial<Record<MilestoneDomain, string[]>>;
  redFlags: string[];
  activities: string[];
  source: ClinicalSource;
}

export interface VaccineDose {
  doseNumber: number;
  /** age in months at which dose is due */
  dueAgeMonths: number;
  /** acceptable window start (months) */
  windowStart?: number;
  windowEnd?: number;
  label: string;
}

export interface Vaccine {
  id: string;
  name: string;
  shortName: string;
  description: string;
  doses: VaccineDose[];
}

export interface ImmunizationSchedule {
  version: string;
  title: string;
  source: ClinicalSource;
  vaccines: Vaccine[];
}

export type VaccineStatus =
  | { state: "done" }
  | { state: "due"; dueAgeMonths: number }
  | { state: "upcoming"; dueAgeMonths: number }
  | { state: "overdue"; dueAgeMonths: number }
  | { state: "unscheduled" };

/* ------------------------------------------------------------------ */
/* Growth (WHO LMS)                                                    */
/* ------------------------------------------------------------------ */

export type GrowthSex = "male" | "female";

export type GrowthIndicator =
  | "weight-for-age"
  | "length-for-age"
  | "height-for-age"
  | "length-height-for-age"
  | "bmi-for-age"
  | "weight-for-length"
  | "weight-for-height"
  | "head-circumference-for-age";

export interface GrowthResult {
  indicator: GrowthIndicator;
  z: number;
  percentile: number;
  /** WHO classification for the indicator (stunting/wasting/overweight...) */
  classification?: string;
}
