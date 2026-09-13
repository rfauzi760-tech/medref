import type { ScoreTool } from "@/lib/types";
import { canonicalScores } from "./klinea-canonical";
import { EXTRA_SCORES_A } from "./scores-extra";
import { EXTRA_SCORES_B } from "./scores-extra-b";
import { EXTRA_SCORES_C } from "./scores-extra-c";
import { EXTRA_SCORES_D } from "./scores-extra-d";
import { EXTRA_SCORES_E } from "./scores-extra-e";
import { EXTRA_SCORES_F } from "./scores-extra-f";
import { EXTRA_SCORES_G } from "./scores-extra-g";
import { EXTRA_SCORES_H } from "./scores-extra-h";
import { EXTRA_SCORES_I } from "./scores-extra-i";
import { SIRIRAJ_SCORE } from "./siriraj-score";

/**
 * Screening, scoring and diagnostic-criteria library.
 * Structured, data-driven definitions rendered by the shared score engine.
 * Clinical content authored from the cited authoritative sources.
 */

const RFS_SCORES: ScoreTool[] = [
  /* ------------------------------------------------------------------ */
  /* Emergency & Critical Care                                           */
  /* ------------------------------------------------------------------ */
  {
    id: "qsofa",
    slug: "qsofa",
    title: "Quick Sepsis-related Organ Failure Assessment",
    abbreviation: "qSOFA",
    type: "score",
    category: "score",
    description: "Bedside prompt for suspected infection to identify adults at higher risk of poor sepsis outcomes outside the ICU.",
    specialties: ["Emergency Medicine", "Intensive Care", "Internal Medicine"],
    keywords: ["sepsis", "septic", "qsofa", "screening", "organ failure", "infection"],
    indication: "Adults with suspected infection outside the ICU. A qSOFA ≥ 2 should prompt further evaluation for organ dysfunction and escalation.",
    limitations: "Not a diagnostic tool for sepsis by itself; does not replace clinical judgement. qSOFA is specific but less sensitive than SIRS.",
    warnings: ["qSOFA ≥ 2 identifies patients at risk of poor outcomes - escalate promptly."],
    lastReviewed: "2025-06-01",
    source: { org: "Seymour CW et al. / Third International Consensus (Sepsis-3)", title: "Assessment of Clinical Criteria for Sepsis", year: 2016, url: "https://jamanetwork.com/journals/jama/fullarticle/2543070" },
    variables: [
      { id: "rr", label: "Respiratory rate", shortLabel: "Respiratory rate", type: "select", required: true, options: [{ label: "≥ 22 breaths/min", value: 1 }, { label: "< 22 breaths/min", value: 0 }] },
      { id: "sbp", label: "Systolic blood pressure", shortLabel: "SBP", type: "select", required: true, options: [{ label: "≤ 100 mmHg", value: 1 }, { label: "> 100 mmHg", value: 0 }] },
      { id: "ment", label: "Mental status", shortLabel: "Mental status", type: "select", required: true, options: [{ label: "Altered mentation (GCS < 15)", value: 1 }, { label: "Alert", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "Low risk", label: "qSOFA 0–1 - monitor and reassess", tone: "success" },
      { min: 2, max: 3, category: "High risk", label: "qSOFA ≥ 2 - suspected sepsis; escalate care, evaluate for organ dysfunction", action: "Consider lactate, cultures, broad-spectrum antibiotics per local sepsis pathway.", tone: "danger" },
    ],
  },
  {
    id: "sofa",
    slug: "sofa",
    title: "Sequential Organ Failure Assessment",
    abbreviation: "SOFA",
    type: "score",
    category: "score",
    description: "Six-organ dysfunction score used to describe organ failure and track ICU morbidity.",
    specialties: ["Intensive Care", "Emergency Medicine"],
    keywords: ["sepsis", "organ failure", "icu", "septic shock", "sofa"],
    indication: "ICU patients; also defines sepsis as an acute increase of ≥ 2 SOFA points attributable to infection.",
    limitations: "Requires laboratory data. Baseline SOFA is assumed 0 in patients without known pre-existing organ dysfunction.",
    warnings: ["An increase of ≥ 2 points indicates organ dysfunction."],
    lastReviewed: "2025-06-01",
    source: { org: "Vincent JL et al.", title: "The SOFA (Sepsis-related Organ Failure Assessment) score", year: 1996, url: "https://link.springer.com/article/10.1007/BF01709751" },
    variables: [
      { id: "pf", label: "PaO₂/FiO₂", shortLabel: "Respiration", type: "select", required: true, options: [{ label: "≥ 400 mmHg", value: 0 }, { label: "< 400", value: 1 }, { label: "< 300", value: 2 }, { label: "< 200 (with respiratory support)", value: 3 }, { label: "< 100 (with respiratory support)", value: 4 }] },
      { id: "plt", label: "Platelets (×10³/µL)", shortLabel: "Coagulation", type: "select", required: true, options: [{ label: "≥ 150", value: 0 }, { label: "< 150", value: 1 }, { label: "< 100", value: 2 }, { label: "< 50", value: 3 }, { label: "< 20", value: 4 }] },
      { id: "bili", label: "Bilirubin (mg/dL)", shortLabel: "Liver", type: "select", required: true, options: [{ label: "< 1.2", value: 0 }, { label: "1.2–1.9", value: 1 }, { label: "2.0–5.9", value: 2 }, { label: "6.0–11.9", value: 3 }, { label: "≥ 12", value: 4 }] },
      { id: "cvs", label: "Cardiovascular (MAP / vasopressors)", shortLabel: "Cardiovascular", type: "select", required: true, options: [{ label: "MAP ≥ 70 mmHg", value: 0 }, { label: "MAP < 70 mmHg", value: 1 }, { label: "Dopamine ≤ 5 or dobutamine (any dose)", value: 2 }, { label: "Dopamine > 5, epi ≤ 0.1, or norepi ≤ 0.1 µg/kg/min", value: 3 }, { label: "Dopamine > 15, epi > 0.1, or norepi > 0.1 µg/kg/min", value: 4 }] },
      { id: "gcs", label: "Glasgow Coma Scale", shortLabel: "Neurology", type: "select", required: true, options: [{ label: "15", value: 0 }, { label: "13–14", value: 1 }, { label: "10–12", value: 2 }, { label: "6–9", value: 3 }, { label: "< 6", value: 4 }] },
      { id: "renal", label: "Renal (creatinine mg/dL / urine output)", shortLabel: "Renal", type: "select", required: true, options: [{ label: "Cr < 1.2", value: 0 }, { label: "Cr 1.2–1.9", value: 1 }, { label: "Cr 2.0–3.4", value: 2 }, { label: "Cr 3.5–4.9 or urine output < 500 mL/24 h", value: 3 }, { label: "Cr ≥ 5.0 or urine output < 200 mL/24 h", value: 4 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "Minimal dysfunction", label: "SOFA 0–1", tone: "success" },
      { min: 2, max: 6, category: "Mild–moderate", label: "SOFA 2–6 - escalating organ dysfunction", tone: "info" },
      { min: 7, max: 12, category: "Severe", label: "SOFA 7–12 - high mortality risk", tone: "warning" },
      { min: 13, max: 24, category: "Very severe", label: "SOFA ≥ 13 - mortality risk > 50%", tone: "danger" },
    ],
  },
  {
    id: "sirs",
    slug: "sirs",
    title: "Systemic Inflammatory Response Syndrome Criteria",
    abbreviation: "SIRS",
    type: "score",
    category: "criteria",
    criteriaMode: "count",
    description: "Four clinical criteria used historically to screen for systemic inflammation and sepsis (Sepsis-1/2).",
    specialties: ["Emergency Medicine", "Intensive Care", "Internal Medicine"],
    keywords: ["sepsis", "sirs", "inflammation", "septic", "screening"],
    indication: "Historical sepsis screening. Superseded by Sepsis-3 (SOFA/qSOFA) but still useful as a sensitive screen.",
    limitations: "Non-specific; many non-infectious conditions (trauma, pancreatitis, surgery) can trigger SIRS.",
    lastReviewed: "2025-06-01",
    source: { org: "Bone RC et al. / ACCP-SCCM Consensus", title: "Definitions for sepsis and organ failure", year: 1992, url: "https://journal.chestnet.org/article/S0012-3692(16)36808-0/fulltext" },
    variables: [
      { id: "temp", label: "Temperature", shortLabel: "Temperature", type: "select", required: true, options: [{ label: "> 38 °C or < 36 °C", value: 1 }, { label: "36–38 °C", value: 0 }] },
      { id: "hr", label: "Heart rate", shortLabel: "Heart rate", type: "select", required: true, options: [{ label: "> 90 bpm", value: 1 }, { label: "≤ 90 bpm", value: 0 }] },
      { id: "rr", label: "Respiratory rate / PaCO₂", shortLabel: "Respiration", type: "select", required: true, options: [{ label: "RR > 20/min or PaCO₂ < 32 mmHg", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "wbc", label: "White blood cell count", shortLabel: "WBC", type: "select", required: true, options: [{ label: "> 12,000 or < 4,000/µL, or > 10% bands", value: 1 }, { label: "Normal", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "SIRS 0–1", label: "Does not meet SIRS criteria (2 of 4 required)", tone: "success" },
      { min: 2, max: 4, category: "SIRS positive", label: "Meets SIRS criteria (≥ 2 of 4) - evaluate for infection and organ dysfunction", action: "Per Sepsis-3, move to qSOFA/SOFA assessment for risk stratification.", tone: "warning" },
    ],
  },
  {
    id: "news2",
    slug: "news2",
    title: "National Early Warning Score 2",
    abbreviation: "NEWS2",
    type: "score",
    category: "score",
    description: "Standardised early warning score for acute deterioration in adults; triggers structured clinical response.",
    specialties: ["Emergency Medicine", "Internal Medicine", "Intensive Care"],
    keywords: ["early warning", "deterioration", "rapid response", "news", "observation"],
    indication: "Routine bedside monitoring of acutely ill adults to trigger escalation.",
    limitations: "Not validated in pregnancy, children, or chronic hypercapnic respiratory failure (use scale 2 for SpO₂).",
    lastReviewed: "2025-06-01",
    source: { org: "Royal College of Physicians London", title: "National Early Warning Score (NEWS) 2", year: 2017, url: "https://www.rcp.ac.uk/improving-care/resources/national-early-warning-score-news-2" },
    variables: [
      { id: "rr", label: "Respiratory rate (per min)", shortLabel: "RR", type: "select", required: true, options: [{ label: "≤ 8", value: 3 }, { label: "9–11", value: 1 }, { label: "12–20", value: 0 }, { label: "21–24", value: 2 }, { label: "≥ 25", value: 3 }] },
      { id: "spo2", label: "SpO₂ (scale 1, %) ", shortLabel: "SpO₂", type: "select", required: true, options: [{ label: "≥ 96", value: 0 }, { label: "94–95", value: 1 }, { label: "92–93", value: 2 }, { label: "≤ 91", value: 3 }] },
      { id: "o2", label: "Supplemental oxygen", shortLabel: "Oxygen", type: "select", required: true, options: [{ label: "On supplemental oxygen", value: 2 }, { label: "On room air", value: 0 }] },
      { id: "sbp", label: "Systolic BP (mmHg)", shortLabel: "SBP", type: "select", required: true, options: [{ label: "≤ 90", value: 3 }, { label: "91–100", value: 2 }, { label: "101–110", value: 1 }, { label: "111–219", value: 0 }, { label: "≥ 220", value: 3 }] },
      { id: "pulse", label: "Pulse (per min)", shortLabel: "Pulse", type: "select", required: true, options: [{ label: "≤ 40", value: 3 }, { label: "41–50", value: 1 }, { label: "51–90", value: 0 }, { label: "91–110", value: 1 }, { label: "111–130", value: 2 }, { label: "≥ 131", value: 3 }] },
      { id: "conscious", label: "Consciousness", shortLabel: "Consciousness", type: "select", required: true, options: [{ label: "Alert", value: 0 }, { label: "New confusion / CVPU", value: 3 }] },
      { id: "temp", label: "Temperature (°C)", shortLabel: "Temp", type: "select", required: true, options: [{ label: "≤ 35.0", value: 3 }, { label: "35.1–36.0", value: 1 }, { label: "36.1–38.0", value: 0 }, { label: "38.1–39.0", value: 1 }, { label: "≥ 39.1", value: 2 }] },
    ],
    ranges: [
      { min: 0, max: 4, category: "Low", label: "NEWS2 0–4 - non-urgent; continue routine monitoring", tone: "success" },
      { min: 5, max: 6, category: "Medium", label: "NEWS2 5–6 - urgent ward-level response (or any single parameter 3)", action: "Request urgent review; consider escalation per local protocol.", tone: "warning" },
      { min: 7, max: 20, category: "High", label: "NEWS2 ≥ 7 - emergency assessment; critical care outreach", action: "Escalate immediately; consider transfer to higher level of care.", tone: "danger" },
    ],
    compute: (values) => {
      const pts = Object.values(values).map((v) => Number(v) || 0);
      const maxSingle = Math.max(...pts);
      return {
        total: pts.reduce((a, b) => a + b, 0),
        detail: maxSingle >= 3 ? "Includes a parameter scoring 3 - NEWS2 mandates at least a medium-threshold clinical response regardless of total." : undefined,
      };
    },
  },
  {
    id: "mews",
    slug: "mews",
    title: "Modified Early Warning Score",
    abbreviation: "MEWS",
    type: "score",
    category: "score",
    description: "Simple bedside score to identify deteriorating ward patients.",
    specialties: ["Emergency Medicine", "Internal Medicine", "Intensive Care"],
    keywords: ["early warning", "deterioration", "mews", "rapid response"],
    indication: "Ward monitoring to trigger escalation; score ≥ 5 warrants urgent review.",
    limitations: "MEWS ≥ 5 has ~75% sensitivity / ~75% specificity for ICU transfer or death in some cohorts.",
    lastReviewed: "2025-06-01",
    source: { org: "Subbe CP et al.", title: "Validation of a modified Early Warning Score in medical admissions", year: 2001, url: "https://academic.oup.com/qjmed/article/94/10/521/1581045" },
    variables: [
      { id: "hr", label: "Heart rate (per min)", shortLabel: "HR", type: "select", required: true, options: [{ label: "≤ 40", value: 2 }, { label: "41–50", value: 1 }, { label: "51–100", value: 0 }, { label: "101–110", value: 1 }, { label: "111–129", value: 2 }, { label: "≥ 130", value: 3 }] },
      { id: "sbp", label: "Systolic BP (mmHg)", shortLabel: "SBP", type: "select", required: true, options: [{ label: "≤ 70", value: 3 }, { label: "71–80", value: 2 }, { label: "81–100", value: 1 }, { label: "101–199", value: 0 }, { label: "≥ 200", value: 2 }] },
      { id: "rr", label: "Respiratory rate (per min)", shortLabel: "RR", type: "select", required: true, options: [{ label: "≤ 8", value: 2 }, { label: "9–14", value: 0 }, { label: "15–20", value: 1 }, { label: "21–29", value: 2 }, { label: "≥ 30", value: 3 }] },
      { id: "temp", label: "Temperature (°C)", shortLabel: "Temp", type: "select", required: true, options: [{ label: "≤ 35", value: 2 }, { label: "35.1–36.0", value: 1 }, { label: "36.1–38.0", value: 0 }, { label: "38.1–38.5", value: 1 }, { label: "≥ 38.6", value: 2 }] },
      { id: "avpu", label: "Consciousness (AVPU)", shortLabel: "AVPU", type: "select", required: true, options: [{ label: "Alert", value: 0 }, { label: "Voice", value: 1 }, { label: "Pain", value: 2 }, { label: "Unresponsive", value: 3 }] },
    ],
    ranges: [
      { min: 0, max: 4, category: "Low", label: "MEWS 0–4 - routine monitoring", tone: "success" },
      { min: 5, max: 6, category: "Elevated", label: "MEWS ≥ 5 - urgent review by ward clinician / rapid response", tone: "warning" },
      { min: 7, max: 14, category: "High", label: "MEWS ≥ 7 - emergency; senior review and consider critical care", tone: "danger" },
    ],
  },
  {
    id: "gcs",
    slug: "gcs",
    title: "Glasgow Coma Scale",
    abbreviation: "GCS",
    type: "score",
    category: "score",
    description: "Standard tool to assess level of consciousness (eye, verbal, motor).",
    specialties: ["Emergency Medicine", "Neurology", "Intensive Care", "Neurosurgery"],
    keywords: ["consciousness", "coma", "head injury", "neurology", "gcs"],
    indication: "Serial assessment of consciousness in trauma, stroke, intoxication and critical illness.",
    limitations: "Intubation/sedation invalidates verbal scoring; use GCS–E (motor × 6 + eye × 4) or full outline. In children, age-adapted scores are preferred.",
    warnings: ["GCS ≤ 8 - consider airway protection (intubation threshold)."],
    lastReviewed: "2025-06-01",
    source: { org: "Teasdale G, Jennett B.", title: "Assessment of coma and impaired consciousness", year: 1974, url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(74)91639-0/fulltext" },
    variables: [
      { id: "eye", label: "Eye opening", shortLabel: "Eye (E)", type: "number", min: 1, max: 4, step: 1, required: true, help: "4 spontaneous, 3 to speech, 2 to pain, 1 none" },
      { id: "verbal", label: "Verbal response", shortLabel: "Verbal (V)", type: "number", min: 1, max: 5, step: 1, required: true, help: "5 orientated, 4 confused, 3 inappropriate words, 2 incomprehensible sounds, 1 none" },
      { id: "motor", label: "Motor response", shortLabel: "Motor (M)", type: "number", min: 1, max: 6, step: 1, required: true, help: "6 obeys commands, 5 localises, 4 withdraws, 3 abnormal flexion, 2 extension, 1 none" },
    ],
    ranges: [
      { min: 13, max: 15, category: "Mild", label: "GCS 13–15 - mild impairment", tone: "success" },
      { min: 9, max: 12, category: "Moderate", label: "GCS 9–12 - moderate impairment", tone: "warning" },
      { min: 3, max: 8, category: "Severe", label: "GCS 3–8 - severe impairment", action: "Consider airway protection; urgent neuroimaging and neurosurgical review.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Pulmonology                                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "curb65",
    slug: "curb65",
    title: "CURB-65 Severity Score (Community-acquired Pneumonia)",
    abbreviation: "CURB-65",
    type: "score",
    category: "score",
    description: "Six-point severity score guiding site-of-care decisions in community-acquired pneumonia.",
    specialties: ["Pulmonology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["pneumonia", "cap", "severity", "curb", "respiratory"],
    indication: "Adults with community-acquired pneumonia to guide admission decision.",
    limitations: "Age < 65 with comorbidity may be under-scored; complements clinical judgement.",
    lastReviewed: "2025-06-01",
    source: { org: "Lim WS et al. (British Thoracic Society)", title: "Defining community acquired pneumonia severity on presentation to hospital", year: 2003, url: "https://thorax.bmj.com/content/58/5/377" },
    variables: [
      { id: "confusion", label: "New-onset confusion", shortLabel: "Confusion", type: "select", required: true, options: [{ label: "Present", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "urea", label: "Urea", shortLabel: "Urea", type: "select", required: true, options: [{ label: "Urea > 7 mmol/L (BUN > 19 mg/dL)", value: 1 }, { label: "Urea ≤ 7 mmol/L", value: 0 }] },
      { id: "rr", label: "Respiratory rate", shortLabel: "RR", type: "select", required: true, options: [{ label: "≥ 30 breaths/min", value: 1 }, { label: "< 30 breaths/min", value: 0 }] },
      { id: "bp", label: "Blood pressure", shortLabel: "BP", type: "select", required: true, options: [{ label: "SBP < 90 or DBP ≤ 60 mmHg", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "age", label: "Age", shortLabel: "Age", type: "select", required: true, options: [{ label: "≥ 65 years", value: 1 }, { label: "< 65 years", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "Low severity", label: "CURB-65 0–1 - consider outpatient management", tone: "success" },
      { min: 2, max: 2, category: "Intermediate", label: "CURB-65 2 - short-stay inpatient or supervised outpatient", tone: "warning" },
      { min: 3, max: 5, category: "Severe", label: "CURB-65 ≥ 3 - inpatient management", action: "Score ≥ 4: consider ICU admission.", tone: "danger" },
    ],
  },
  {
    id: "psi",
    slug: "psi",
    title: "Pneumonia Severity Index (PORT Score)",
    abbreviation: "PSI",
    type: "score",
    category: "score",
    description: "Multivariable risk score for 30-day mortality in community-acquired pneumonia; guides site of care.",
    specialties: ["Pulmonology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["pneumonia", "cap", "psi", "port", "severity", "mortality"],
    indication: "Adults with CAP: PSI class I–II → outpatient; III → short observation; IV–V → inpatient.",
    limitations: "Complex; may under-triage younger patients with comorbidity. CURB-65 is faster at the bedside.",
    lastReviewed: "2025-06-01",
    source: { org: "Fine MJ et al. (PORT)", title: "A prediction rule to identify low-risk patients with community-acquired pneumonia", year: 1997, url: "https://www.nejm.org/doi/full/10.1056/NEJM199701233360402" },
    variables: [
      { id: "age", label: "Age (years)", shortLabel: "Age", type: "number", min: 18, max: 120, step: 1, required: true, help: "Points = age in years" },
      { id: "sex", label: "Sex", shortLabel: "Sex", type: "select", required: true, options: [{ label: "Male", value: 0 }, { label: "Female", value: 0 }], help: "Female: −10 points" },
      { id: "nursing", label: "Nursing home resident", shortLabel: "Nursing home", type: "select", required: true, options: [{ label: "Yes", value: 10 }, { label: "No", value: 0 }] },
      { id: "neoplastic", label: "Neoplastic disease", shortLabel: "Neoplastic", type: "select", required: true, options: [{ label: "Yes", value: 30 }, { label: "No", value: 0 }] },
      { id: "liver", label: "Liver disease", shortLabel: "Liver disease", type: "select", required: true, options: [{ label: "Yes", value: 20 }, { label: "No", value: 0 }] },
      { id: "chf", label: "Congestive heart failure", shortLabel: "CHF", type: "select", required: true, options: [{ label: "Yes", value: 10 }, { label: "No", value: 0 }] },
      { id: "cvd", label: "Cerebrovascular disease", shortLabel: "Cerebrovascular", type: "select", required: true, options: [{ label: "Yes", value: 10 }, { label: "No", value: 0 }] },
      { id: "renal", label: "Renal disease", shortLabel: "Renal disease", type: "select", required: true, options: [{ label: "Yes", value: 10 }, { label: "No", value: 0 }] },
      { id: "mental", label: "Altered mental status", shortLabel: "Mental status", type: "select", required: true, options: [{ label: "Yes", value: 20 }, { label: "No", value: 0 }] },
      { id: "rr", label: "Respiratory rate", shortLabel: "RR", type: "select", required: true, options: [{ label: "≥ 30 breaths/min", value: 20 }, { label: "< 30", value: 0 }] },
      { id: "sbp", label: "Systolic BP", shortLabel: "SBP", type: "select", required: true, options: [{ label: "< 90 mmHg", value: 20 }, { label: "≥ 90", value: 0 }] },
      { id: "temp", label: "Temperature", shortLabel: "Temp", type: "select", required: true, options: [{ label: "< 35 °C or ≥ 40 °C", value: 15 }, { label: "Normal", value: 0 }] },
      { id: "hr", label: "Heart rate", shortLabel: "HR", type: "select", required: true, options: [{ label: "≥ 125 bpm", value: 10 }, { label: "< 125", value: 0 }] },
      { id: "ph", label: "Arterial pH", shortLabel: "pH", type: "select", required: true, options: [{ label: "< 7.35", value: 30 }, { label: "≥ 7.35", value: 0 }] },
      { id: "bun", label: "BUN", shortLabel: "BUN", type: "select", required: true, options: [{ label: "≥ 30 mg/dL (11 mmol/L)", value: 20 }, { label: "< 30", value: 0 }] },
      { id: "na", label: "Sodium", shortLabel: "Na⁺", type: "select", required: true, options: [{ label: "< 130 mEq/L", value: 20 }, { label: "≥ 130", value: 0 }] },
      { id: "glu", label: "Glucose", shortLabel: "Glucose", type: "select", required: true, options: [{ label: "≥ 250 mg/dL", value: 10 }, { label: "< 250", value: 0 }] },
      { id: "hct", label: "Hematocrit", shortLabel: "Hct", type: "select", required: true, options: [{ label: "< 30%", value: 10 }, { label: "≥ 30%", value: 0 }] },
      { id: "pao2", label: "Oxygenation", shortLabel: "PaO₂", type: "select", required: true, options: [{ label: "PaO₂ < 60 mmHg or SpO₂ < 90%", value: 10 }, { label: "Normal", value: 0 }] },
      { id: "effusion", label: "Pleural effusion", shortLabel: "Effusion", type: "select", required: true, options: [{ label: "Present", value: 10 }, { label: "Absent", value: 0 }] },
    ],
    modifiers: [{ whenVar: "sex", whenValue: "female", delta: -10, note: "Female sex" }],
    ranges: [
      { min: 0, max: 49, category: "Class I", label: "Class I (≤ 50) - low risk, outpatient", tone: "success" },
      { min: 51, max: 70, category: "Class II", label: "Class II (51–70) - outpatient", tone: "success" },
      { min: 71, max: 90, category: "Class III", label: "Class III (71–90) - brief inpatient observation", tone: "info" },
      { min: 91, max: 130, category: "Class IV", label: "Class IV (91–130) - inpatient", tone: "warning" },
      { min: 131, max: 500, category: "Class V", label: "Class V (> 130) - inpatient; consider ICU", tone: "danger" },
    ],
  },
  {
    id: "wells-pe",
    slug: "wells-pe",
    title: "Wells Score for Pulmonary Embolism",
    abbreviation: "Wells PE",
    type: "score",
    category: "score",
    description: "Clinical prediction rule for pre-test probability of pulmonary embolism.",
    specialties: ["Pulmonology", "Emergency Medicine", "Cardiology"],
    keywords: ["pulmonary embolism", "pe", "wells", "dvt", "thromboembolism", "pretest"],
    indication: "Risk-stratify suspected PE before D-dimer or imaging.",
    limitations: "The −3 modifier applies only in the original three-level version when prior DVT/PE is absent. D-dimer alone cannot rule out PE in high probability.",
    lastReviewed: "2025-06-01",
    source: { org: "Wells PS et al.", title: "Derivation of a simple clinical model to categorize patients' probability of pulmonary embolism", year: 2001, url: "https://www.acpjournals.org/doi/10.7326/0003-4819-135-2-200107170-00011" },
    variables: [
      { id: "dvt", label: "Clinical signs of DVT", shortLabel: "DVT signs", type: "select", required: true, options: [{ label: "Present (swelling, tenderness)", value: 3 }, { label: "Absent", value: 0 }] },
      { id: "mostLikely", label: "PE is the most likely diagnosis", shortLabel: "PE most likely", type: "select", required: true, options: [{ label: "Yes", value: 3 }, { label: "No", value: 0 }] },
      { id: "hr", label: "Heart rate", shortLabel: "HR", type: "select", required: true, options: [{ label: "> 100 bpm", value: 1.5 }, { label: "≤ 100 bpm", value: 0 }] },
      { id: "immobil", label: "Immobilisation or surgery", shortLabel: "Immobilisation", type: "select", required: true, options: [{ label: "Immobilisation ≥ 3 days or surgery within 4 weeks", value: 1.5 }, { label: "Absent", value: 0 }] },
      { id: "prior", label: "Previous DVT or PE", shortLabel: "Prior VTE", type: "select", required: true, options: [{ label: "Yes", value: 1.5 }, { label: "No", value: 0 }] },
      { id: "hemoptysis", label: "Hemoptysis", shortLabel: "Hemoptysis", type: "select", required: true, options: [{ label: "Present", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "malignancy", label: "Active malignancy", shortLabel: "Malignancy", type: "select", required: true, options: [{ label: "Present (treated within 6 months or palliative)", value: 1 }, { label: "Absent", value: 0 }] },
    ],
    modifiers: [{ whenVar: "prior", whenValue: "0", delta: -3, note: "No prior DVT/PE (original Wells −3)" }],
    ranges: [
      { min: 0, max: 1, category: "Low probability", label: "Wells < 2 - PE unlikely; D-dimer can exclude", tone: "success" },
      { min: 2, max: 6, category: "Moderate probability", label: "Wells 2–6 - further testing required", tone: "warning" },
      { min: 6.5, max: 12.5, category: "High probability", label: "Wells > 6 - proceed to imaging (CTPA)", tone: "danger" },
    ],
  },
  {
    id: "perc",
    slug: "perc",
    title: "PERC Rule (Pulmonary Embolism Rule-out Criteria)",
    abbreviation: "PERC",
    type: "score",
    category: "rule",
    criteriaMode: "count",
    description: "Eight criteria that can rule out PE without D-dimer in low pre-test probability patients.",
    specialties: ["Emergency Medicine", "Pulmonology"],
    keywords: ["pulmonary embolism", "pe", "perc", "rule out", "d-dimer"],
    indication: "Patients with suspected PE who are PERC-negative AND have low pre-test probability (Wells ≤ 4 / gestalt) may skip D-dimer.",
    limitations: "Only valid when pre-test probability is low. Never use PERC alone in high-risk patients.",
    lastReviewed: "2025-06-01",
    source: { org: "Kline JA et al.", title: "Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism", year: 2004, url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1538-7836.2004.00777.x" },
    variables: [
      { id: "age50", label: "Age < 50 years", shortLabel: "Age < 50", type: "select", required: true, options: [{ label: "Yes - low-risk attribute present", value: 1 }, { label: "No", value: 0 }], help: "PERC is negative (PE ruled out) only when ALL eight low-risk attributes are present (total = 8) in a low pre-test probability patient." },
      { id: "hr100", label: "Heart rate < 100 bpm", shortLabel: "HR < 100", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "spo2", label: "SpO₂ ≥ 95% on room air", shortLabel: "SpO₂ ≥ 95%", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "hemoptysis", label: "No hemoptysis", shortLabel: "No hemoptysis", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "estrogen", label: "No estrogen use", shortLabel: "No estrogen", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "prior", label: "No prior DVT or PE", shortLabel: "No prior VTE", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "leg", label: "No unilateral leg swelling", shortLabel: "No leg swelling", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "surgery", label: "No surgery/trauma needing hospitalisation in 4 weeks", shortLabel: "No recent surgery", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
    ],
    ranges: [
      { min: 8, max: 8, category: "PERC negative", label: "All eight low-risk attributes present - PE can be ruled out without D-dimer (low pre-test probability only)", tone: "success" },
      { min: 0, max: 7, category: "PERC positive", label: "One or more low-risk attributes absent - PERC cannot rule out PE", action: "Proceed with D-dimer (if low/intermediate probability) or CTPA.", tone: "warning" },
    ],
  },
  {
    id: "wells-dvt",
    slug: "wells-dvt",
    title: "Wells Score for Deep Vein Thrombosis",
    abbreviation: "Wells DVT",
    type: "score",
    category: "score",
    description: "Clinical prediction rule for pre-test probability of lower-limb DVT.",
    specialties: ["Emergency Medicine", "Cardiology", "Internal Medicine"],
    keywords: ["dvt", "deep vein thrombosis", "wells", "thromboembolism", "leg swelling"],
    indication: "Risk-stratify suspected lower-extremity DVT before D-dimer or compression ultrasound.",
    limitations: "Score < 2 + negative D-dimer can exclude DVT in most outpatients.",
    lastReviewed: "2025-06-01",
    source: { org: "Wells PS et al.", title: "Value of assessment of pretest probability of deep-vein thrombosis in clinical management", year: 1997, url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(97)08140-3/fulltext" },
    variables: [
      { id: "cancer", label: "Active cancer", shortLabel: "Cancer", type: "select", required: true, options: [{ label: "Yes (within 6 months or palliative)", value: 1 }, { label: "No", value: 0 }] },
      { id: "paralysis", label: "Paralysis, paresis or recent plaster immobilisation", shortLabel: "Paralysis", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "bedridden", label: "Bedridden ≥ 3 days or major surgery within 12 weeks", shortLabel: "Bedridden/surgery", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "tender", label: "Localised tenderness along deep veins", shortLabel: "Vein tenderness", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "legswell", label: "Entire leg swollen", shortLabel: "Entire leg swollen", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "calf", label: "Calf swelling > 3 cm compared to other leg", shortLabel: "Calf swelling", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "edema", label: "Pitting oedema (symptomatic leg only)", shortLabel: "Pitting oedema", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "collateral", label: "Collateral superficial veins (non-varicose)", shortLabel: "Collateral veins", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "prior", label: "Previously documented DVT", shortLabel: "Prior DVT", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "alternative", label: "Alternative diagnosis at least as likely as DVT", shortLabel: "Alternative dx", type: "select", required: true, options: [{ label: "Yes", value: -2 }, { label: "No", value: 0 }] },
    ],
    ranges: [
      { min: -2, max: 0, category: "Low probability", label: "Wells DVT < 2 - DVT unlikely; D-dimer can exclude", tone: "success" },
      { min: 1, max: 2, category: "Moderate probability", label: "Wells DVT 1–2 - D-dimer then ultrasound if positive", tone: "warning" },
      { min: 3, max: 10, category: "High probability", label: "Wells DVT ≥ 3 - proceed to compression ultrasound", tone: "danger" },
    ],
  },
  {
    id: "centor",
    slug: "centor",
    title: "Modified Centor Score (McIsaac)",
    abbreviation: "Centor",
    type: "score",
    category: "score",
    description: "Predicts likelihood of group A streptococcal pharyngitis; guides testing and antibiotic use.",
    specialties: ["Infectious Disease", "ENT", "Pediatrics", "Emergency Medicine"],
    keywords: ["pharyngitis", "strep throat", "tonsillitis", "centor", "mcisaac", "antibiotic"],
    indication: "Adults and children ≥ 3 years with acute sore throat to guide rapid-antigen testing / antibiotics.",
    limitations: "Does not apply to < 3 years. Score alone should not mandate antibiotics - use with rapid antigen test where available.",
    lastReviewed: "2025-06-01",
    source: { org: "McIsaac WJ et al.", title: "A clinical score to reduce unnecessary antibiotic use in patients with sore throat", year: 1998, url: "https://jamanetwork.com/journals/jama/fullarticle/187645" },
    variables: [
      { id: "fever", label: "Fever", shortLabel: "Fever", type: "select", required: true, options: [{ label: "> 38 °C (100.4 °F)", value: 1 }, { label: "≤ 38 °C", value: 0 }] },
      { id: "exudate", label: "Tonsillar exudate", shortLabel: "Exudate", type: "select", required: true, options: [{ label: "Present", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "nodes", label: "Tender anterior cervical lymphadenopathy", shortLabel: "Cervical nodes", type: "select", required: true, options: [{ label: "Present", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "cough", label: "Cough", shortLabel: "Cough", type: "select", required: true, options: [{ label: "Absent", value: 1 }, { label: "Present", value: 0 }] },
      { id: "age", label: "Age", shortLabel: "Age", type: "number", min: 3, max: 100, step: 1, required: true, help: "3–14 y: +1 · ≥ 45 y: −1" },
    ],
    ranges: [
      { min: 0, max: 1, category: "Low probability", label: "Score 0–1 - GAS pharyngitis unlikely (~1–17%); no antibiotics", tone: "success" },
      { min: 2, max: 3, category: "Moderate probability", label: "Score 2–3 - GAS ~28–35%; test (rapid antigen or culture) before treating", tone: "warning" },
      { min: 4, max: 5, category: "High probability", label: "Score 4–5 - GAS ~38–63%; consider empiric antibiotics or rapid test", tone: "danger" },
    ],
    compute: (values) => {
      const age = Number(values.age);
      const agePts = age >= 3 && age <= 14 ? 1 : age >= 45 ? -1 : 0;
      const base = [values.fever, values.exudate, values.nodes, values.cough].reduce<number>((s, v) => s + (Number(v) || 0), 0);
      return { total: base + agePts, detail: `Age adjustment: ${agePts > 0 ? "+1 (3–14 y)" : agePts < 0 ? "−1 (≥ 45 y)" : "0"}` };
    },
  },

  /* ------------------------------------------------------------------ */
  /* Neonatology & Pediatrics                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "apgar",
    slug: "apgar",
    title: "APGAR Score",
    abbreviation: "APGAR",
    type: "score",
    category: "score",
    description: "Rapid neonatal assessment at 1 and 5 minutes after birth (appearance, pulse, grimace, activity, respiration).",
    specialties: ["Neonatology", "Obstetrics & Gynecology", "Pediatrics"],
    keywords: ["apgar", "newborn", "neonatal", "birth", "resuscitation"],
    indication: "Assess transition and response to resuscitation in the newborn at 1, 5 (and 10) minutes.",
    limitations: "Not a predictor of long-term neurological outcome; affected by prematurity and sedation.",
    lastReviewed: "2025-06-01",
    source: { org: "Apgar V.", title: "A proposal for a new method of evaluation of the newborn infant", year: 1953, url: "https://pubs.asahq.org/anesthesiology/article/14/3/260/8706" },
    variables: [
      { id: "appearance", label: "Appearance (color)", shortLabel: "Appearance", type: "select", required: true, options: [{ label: "Blue or pale all over", value: 0 }, { label: "Body pink, extremities blue", value: 1 }, { label: "Completely pink", value: 2 }] },
      { id: "pulse", label: "Pulse (heart rate)", shortLabel: "Pulse", type: "select", required: true, options: [{ label: "Absent", value: 0 }, { label: "< 100 bpm", value: 1 }, { label: "≥ 100 bpm", value: 2 }] },
      { id: "grimace", label: "Grimace (response to stimulation)", shortLabel: "Grimace", type: "select", required: true, options: [{ label: "No response", value: 0 }, { label: "Grimace only", value: 1 }, { label: "Cry, cough, withdrawal", value: 2 }] },
      { id: "activity", label: "Activity (muscle tone)", shortLabel: "Activity", type: "select", required: true, options: [{ label: "Flaccid", value: 0 }, { label: "Some flexion of extremities", value: 1 }, { label: "Active movement", value: 2 }] },
      { id: "respiration", label: "Respiration", shortLabel: "Respiration", type: "select", required: true, options: [{ label: "Absent", value: 0 }, { label: "Weak, irregular, gasping", value: 1 }, { label: "Strong cry", value: 2 }] },
    ],
    ranges: [
      { min: 7, max: 10, category: "Reassuring", label: "APGAR 7–10 - normal transition", tone: "success" },
      { min: 4, max: 6, category: "Moderately depressed", label: "APGAR 4–6 - moderate depression; continue stimulation/oxygen per resuscitation algorithm", tone: "warning" },
      { min: 0, max: 3, category: "Severely depressed", label: "APGAR 0–3 - severe depression; initiate full resuscitation", tone: "danger" },
    ],
  },
  {
    id: "downes",
    slug: "downes",
    title: "Downes Score (Respiratory Distress in Newborn)",
    abbreviation: "Downes",
    type: "score",
    category: "score",
    description: "Neonatal respiratory distress score (rate, cyanosis, retractions, grunting, air entry).",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["respiratory distress", "rds", "newborn", "downes", "neonatal", "grunting"],
    indication: "Serial assessment of respiratory distress in neonates; guides CPAP/ventilation decisions.",
    limitations: "Designed for neonatal respiratory distress (esp. RDS); validated cut-offs vary by setting.",
    lastReviewed: "2025-06-01",
    source: { org: "Downes JJ et al.", title: "Respiratory distress syndrome of newborn as managed by positive airway pressure", year: 1970, url: "https://pubmed.ncbi.nlm.nih.gov/5511260/" },
    variables: [
      { id: "rate", label: "Respiratory rate (per min)", shortLabel: "Rate", type: "select", required: true, options: [{ label: "< 40", value: 0 }, { label: "40–60", value: 1 }, { label: "> 60", value: 2 }] },
      { id: "cyanosis", label: "Cyanosis", shortLabel: "Cyanosis", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "In room air", value: 1 }, { label: "In 40% oxygen", value: 2 }] },
      { id: "retract", label: "Intercostal retractions", shortLabel: "Retractions", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Mild", value: 1 }, { label: "Moderate–severe", value: 2 }] },
      { id: "grunt", label: "Expiratory grunting", shortLabel: "Grunting", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Audible with stethoscope", value: 1 }, { label: "Audible without stethoscope", value: 2 }] },
      { id: "air", label: "Air entry", shortLabel: "Air entry", type: "select", required: true, options: [{ label: "Clear", value: 0 }, { label: "Decreased", value: 1 }, { label: "Barely audible", value: 2 }] },
    ],
    ranges: [
      { min: 0, max: 3, category: "Mild distress", label: "Downes 0–3 - mild; observe, keep warm", tone: "success" },
      { min: 4, max: 6, category: "Moderate distress", label: "Downes 4–6 - moderate; consider CPAP/nasal prongs, escalate monitoring", tone: "warning" },
      { min: 7, max: 10, category: "Severe distress", label: "Downes ≥ 7 - impending respiratory failure; NICU and ventilation", tone: "danger" },
    ],
  },
  {
    id: "silverman",
    slug: "silverman",
    title: "Silverman-Andersen Retraction Score",
    abbreviation: "Silverman",
    type: "score",
    category: "score",
    description: "Five-sign assessment of respiratory distress severity in neonates.",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["respiratory distress", "silverman", "retraction", "newborn", "neonatal"],
    indication: "Assess severity of retractions and respiratory effort in the newborn.",
    limitations: "Assesses work of breathing, not oxygenation; combine with SpO₂ and clinical status.",
    lastReviewed: "2025-06-01",
    source: { org: "Silverman WA, Andersen DH.", title: "A controlled clinical trial of effects of water mist on obstructive respiratory signs", year: 1956, url: "https://publications.aap.org/pediatrics/article-abstract/17/1/1/27163" },
    variables: [
      { id: "chest", label: "Chest movement (upper vs lower)", shortLabel: "Chest movement", type: "select", required: true, options: [{ label: "Synchronous", value: 0 }, { label: "Lag on expiration", value: 1 }, { label: "See-saw", value: 2 }] },
      { id: "intercostal", label: "Intercostal retraction", shortLabel: "Intercostal", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Just visible", value: 1 }, { label: "Marked", value: 2 }] },
      { id: "xiphoid", label: "Xiphoid retraction", shortLabel: "Xiphoid", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Just visible", value: 1 }, { label: "Marked", value: 2 }] },
      { id: "flaring", label: "Nasal flaring", shortLabel: "Nasal flaring", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Minimal", value: 1 }, { label: "Marked", value: 2 }] },
      { id: "grunt", label: "Expiratory grunting", shortLabel: "Grunting", type: "select", required: true, options: [{ label: "None", value: 0 }, { label: "Audible with stethoscope", value: 1 }, { label: "Audible without stethoscope", value: 2 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "No–minimal distress", label: "Silverman 0–1 - minimal distress", tone: "success" },
      { min: 2, max: 4, category: "Mild distress", label: "Silverman 2–4 - mild; monitor closely", tone: "info" },
      { min: 5, max: 7, category: "Moderate distress", label: "Silverman 5–7 - moderate; escalate respiratory support", tone: "warning" },
      { min: 8, max: 10, category: "Severe distress", label: "Silverman 8–10 - severe; consider ventilation", tone: "danger" },
    ],
  },
  {
    id: "sarnat",
    slug: "sarnat",
    title: "Sarnat Staging of Hypoxic-Ischaemic Encephalopathy",
    abbreviation: "Sarnat",
    type: "score",
    category: "criteria",
    description: "Clinical staging (I–III) of neonatal hypoxic-ischaemic encephalopathy after perinatal asphyxia.",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["hie", "asphyxia", "sarnat", "encephalopathy", "newborn", "seizure", "therapeutic hypothermia"],
    indication: "Stage HIE severity to guide therapeutic hypothermia and prognostication (with EEG where available).",
    limitations: "Staging should be performed after stabilisation; consider aEEG/EEG, and exclude other encephalopathy causes.",
    lastReviewed: "2025-06-01",
    source: { org: "Sarnat HB, Sarnat MS.", title: "Neonatal encephalopathy following fetal distress", year: 1976, url: "https://jamanetwork.com/journals/jamaneurology/article-abstract/574647" },
    variables: [
      { id: "conscious", label: "Level of consciousness", shortLabel: "Consciousness", type: "select", required: true, options: [{ label: "Hyperalert", value: 1 }, { label: "Lethargic", value: 2 }, { label: "Stupor / coma", value: 3 }] },
      { id: "tone", label: "Muscle tone", shortLabel: "Tone", type: "select", required: true, options: [{ label: "Normal", value: 1 }, { label: "Hypotonia", value: 2 }, { label: "Flaccid", value: 3 }] },
      { id: "seizures", label: "Seizures", shortLabel: "Seizures", type: "select", required: true, options: [{ label: "None", value: 1 }, { label: "Myoclonic (usually < 24 h)", value: 2 }, { label: "Frequent / status", value: 3 }] },
      { id: "autonomic", label: "Autonomic function", shortLabel: "Autonomic", type: "select", required: true, options: [{ label: "Overactive (sympathetic)", value: 1 }, { label: "Underactive (parasympathetic)", value: 2 }, { label: "Absent", value: 3 }] },
    ],
    compute: (values) => {
      const stage = Math.max(Number(values.conscious) || 1, Number(values.tone) || 1, Number(values.seizures) || 1, Number(values.autonomic) || 1);
      return {
        total: stage,
        detail: `Highest stage among features: ${stage === 1 ? "Stage I - mild" : stage === 2 ? "Stage II - moderate" : "Stage III - severe"}`,
      };
    },
    ranges: [
      { min: 1, max: 1, category: "Stage I (mild)", label: "Hyperalert, normal tone, no seizures - usually recovers fully; observe for 24–48 h", tone: "info" },
      { min: 2, max: 2, category: "Stage II (moderate)", label: "Lethargy, hypotonia, seizures - the group most likely to benefit from therapeutic hypothermia", action: "Consider therapeutic hypothermia within 6 h of birth; EEG/aEEG monitoring.", tone: "warning" },
      { min: 3, max: 3, category: "Stage III (severe)", label: "Stupor/coma, flaccid, frequent seizures - high mortality; significant neurodevelopmental disability in survivors", action: "Therapeutic hypothermia, EEG monitoring, neuroimaging; discuss prognosis with family.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Nephrology                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: "kdigo-aki",
    slug: "kdigo-aki",
    title: "KDIGO AKI Staging",
    abbreviation: "KDIGO AKI",
    type: "score",
    category: "criteria",
    description: "KDIGO criteria and staging for acute kidney injury (creatinine and urine output).",
    specialties: ["Nephrology", "Intensive Care", "Internal Medicine"],
    keywords: ["aki", "acute kidney injury", "kdigo", "creatinine", "staging", "renal"],
    indication: "Detect and stage AKI: Stage 1–3 by creatinine rise and/or urine output.",
    limitations: "Baseline creatinine may be unknown - estimate from lowest recent value or back-calculate; urine output requires catheter or reliable recording.",
    lastReviewed: "2025-06-01",
    source: { org: "KDIGO", title: "Clinical Practice Guideline for Acute Kidney Injury", year: 2012, url: "https://kdigo.org/guidelines/acute-kidney-injury/" },
    variables: [
      { id: "baseline", label: "Baseline creatinine (mg/dL)", shortLabel: "Baseline Cr", type: "number", min: 0.1, max: 15, step: 0.1, required: true },
      { id: "current", label: "Current creatinine (mg/dL)", shortLabel: "Current Cr", type: "number", min: 0.1, max: 20, step: 0.1, required: true },
      { id: "uopLow", label: "Urine output", shortLabel: "Urine output", type: "select", required: true, options: [{ label: "≥ 0.5 mL/kg/h", value: 0 }, { label: "< 0.5 mL/kg/h for ≥ 6 h", value: 1 }, { label: "< 0.3 mL/kg/h for ≥ 24 h or anuria ≥ 12 h", value: 3 }] },
      { id: "rrt", label: "On renal replacement therapy", shortLabel: "RRT", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
    ],
    compute: (values) => {
      const base = Number(values.baseline);
      const cur = Number(values.current);
      const uop = Number(values.uopLow) || 0;
      const rrt = Number(values.rrt) || 0;
      const ratio = base > 0 ? cur / base : NaN;
      const rise = base > 0 ? cur - base : NaN;
      let crStage = 0;
      if (!Number.isNaN(ratio)) {
        if (ratio >= 3 || cur >= 4.0) crStage = 3;
        else if (ratio >= 2) crStage = 2;
        else if (ratio >= 1.5 || rise >= 0.3) crStage = 1;
      }
      const uopStage = uop === 3 ? 3 : uop === 1 ? 1 : 0;
      const stage = Math.max(crStage, uopStage, rrt ? 3 : 0);
      return {
        total: stage,
        detail: `Creatinine: ${cur} vs baseline ${base} (ratio ${Number.isNaN(ratio) ? "?" : ratio.toFixed(1)}×, rise ${Number.isNaN(rise) ? "?" : rise.toFixed(1)} mg/dL) · Urine output: ${uopStage} · Stage ${stage}`,
      };
    },
    ranges: [
      { min: 0, max: 0, category: "No AKI", label: "No AKI by KDIGO criteria", tone: "success" },
      { min: 1, max: 1, category: "Stage 1", label: "Cr 1.5–1.9× baseline, or ≥ 0.3 mg/dL increase, or UOP < 0.5 mL/kg/h × 6–12 h", action: "Review nephrotoxins, fluids, and haemodynamics.", tone: "warning" },
      { min: 2, max: 2, category: "Stage 2", label: "Cr 2.0–2.9× baseline, or UOP < 0.5 mL/kg/h × ≥ 12 h", action: "Nephrology referral; avoid nephrotoxins.", tone: "warning" },
      { min: 3, max: 3, category: "Stage 3", label: "Cr ≥ 3× baseline, or ≥ 4.0 mg/dL, or RRT, or UOP < 0.3 mL/kg/h × 24 h / anuria × 12 h", action: "Urgent nephrology review; consider dialysis indications.", tone: "danger" },
    ],
  },
  {
    id: "ckd-stage",
    slug: "ckd-stage",
    title: "CKD Staging (KDIGO GFR + Albuminuria)",
    abbreviation: "CKD stage",
    type: "score",
    category: "criteria",
    description: "KDIGO chronic kidney disease classification combining GFR (G1–G5) and albuminuria (A1–A3).",
    specialties: ["Nephrology", "Internal Medicine"],
    keywords: ["ckd", "chronic kidney disease", "kdigo", "staging", "albuminuria", "egfr"],
    indication: "Classify CKD and guide monitoring/referral (eGFR + albuminuria).",
    limitations: "CKD is defined as abnormalities ≥ 3 months. Single low eGFR requires confirmation.",
    lastReviewed: "2025-06-01",
    source: { org: "KDIGO", title: "Clinical Practice Guideline for the Evaluation and Management of CKD", year: 2024, url: "https://kdigo.org/guidelines/ckd-evaluation-and-management/" },
    variables: [
      { id: "egfr", label: "eGFR (mL/min/1.73 m²)", shortLabel: "eGFR", type: "number", min: 1, max: 200, step: 1, required: true },
      { id: "alb", label: "Albuminuria", shortLabel: "Albuminuria", type: "select", required: true, options: [{ label: "A1: < 30 mg/g (normal–mild)", value: 1 }, { label: "A2: 30–300 mg/g (moderately increased)", value: 2 }, { label: "A3: > 300 mg/g (severely increased)", value: 3 }] },
    ],
    compute: (values) => {
      const egfr = Number(values.egfr);
      const alb = Number(values.alb) || 1;
      let g = 0;
      let gLabel = "";
      if (egfr >= 90) { g = 1; gLabel = "G1"; }
      else if (egfr >= 60) { g = 2; gLabel = "G2"; }
      else if (egfr >= 45) { g = 3; gLabel = "G3a"; }
      else if (egfr >= 30) { g = 3; gLabel = "G3b"; }
      else if (egfr >= 15) { g = 4; gLabel = "G4"; }
      else { g = 5; gLabel = "G5"; }
      return { total: g, detail: `Combined category: ${gLabel}A${alb} - eGFR ${egfr} mL/min/1.73 m²` };
    },
    ranges: [
      { min: 1, max: 1, category: "G1", label: "G1 - normal or high eGFR (≥ 90). CKD only if kidney damage markers present", tone: "success" },
      { min: 2, max: 2, category: "G2", label: "G2 - mildly decreased (60–89). CKD only if kidney damage markers present", tone: "success" },
      { min: 3, max: 3, category: "G3", label: "G3 - moderately to severely decreased (30–59); review nephrotoxins and cardiovascular risk", tone: "warning" },
      { min: 4, max: 4, category: "G4", label: "G4 - severely decreased (15–29); prepare renal replacement options, nephrology referral", tone: "warning" },
      { min: 5, max: 5, category: "G5", label: "G5 - kidney failure (< 15); consider dialysis/transplant, urgent nephrology", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Endocrinology                                                       */
  /* ------------------------------------------------------------------ */
  {
    id: "dka",
    slug: "dka",
    title: "Diabetic Ketoacidosis Criteria",
    abbreviation: "DKA",
    type: "score",
    category: "criteria",
    criteriaMode: "all",
    description: "ADA criteria for the diagnosis and severity classification of diabetic ketoacidosis.",
    specialties: ["Endocrinology", "Emergency Medicine", "Internal Medicine", "Pediatrics"],
    keywords: ["dka", "ketoacidosis", "diabetes", "hyperglycemia", "ketones", "metabolic acidosis"],
    indication: "Diagnose DKA and grade severity (mild/moderate/severe).",
    limitations: "Euglycaemic DKA (SGLT2 inhibitors) can present with glucose < 250 mg/dL - check ketones and gap.",
    lastReviewed: "2025-06-01",
    source: { org: "American Diabetes Association", title: "Hyperglycemic Crises in Adult Patients With Diabetes (Position Statement)", year: 2009, url: "https://diabetesjournals.org/care/article/32/7/1335/27958" },
    variables: [
      { id: "glucose", label: "Plasma glucose", shortLabel: "Glucose", type: "select", required: true, options: [{ label: "≥ 250 mg/dL (≥ 200 mg/dL if known DM)", value: 1 }, { label: "< 250 mg/dL", value: 0 }] },
      { id: "ph", label: "Arterial pH", shortLabel: "pH", type: "number", min: 6.5, max: 7.6, step: 0.01, required: true, help: "Also used for severity grading" },
      { id: "hco3", label: "Bicarbonate (mEq/L)", shortLabel: "HCO₃", type: "number", min: 1, max: 40, step: 1, required: true },
      { id: "ketones", label: "Ketonemia / ketonuria", shortLabel: "Ketones", type: "select", required: true, options: [{ label: "Positive (serum β-hydroxybutyrate ≥ 3 mmol/L)", value: 1 }, { label: "Negative", value: 0 }] },
      { id: "gap", label: "Anion gap", shortLabel: "Anion gap", type: "select", required: true, options: [{ label: "> 12 mEq/L", value: 1 }, { label: "≤ 12 mEq/L", value: 0 }] },
    ],
    compute: (values) => {
      const glucose = Number(values.glucose) || 0;
      const ph = Number(values.ph);
      const hco3 = Number(values.hco3);
      const ketones = Number(values.ketones) || 0;
      const gap = Number(values.gap) || 0;
      const met = glucose === 1 && ketones === 1 && gap === 1 && ((Number.isFinite(ph) && ph < 7.3) || (Number.isFinite(hco3) && hco3 < 18));
      let severity = "";
      if (met) {
        if (Number.isFinite(ph)) {
          if (ph < 6.9) severity = "Severe DKA (pH < 6.9)";
          else if (ph < 7.24) severity = "Moderate DKA (pH 6.9–7.24)";
          else severity = "Mild DKA (pH 7.25–7.30)";
        } else if (Number.isFinite(hco3)) {
          severity = hco3 < 10 ? "Severe DKA (HCO₃ < 10)" : hco3 < 15 ? "Moderate DKA (HCO₃ 10–14.9)" : "Mild DKA (HCO₃ 15–18)";
        }
      }
      return { total: met ? 1 : 0, detail: met && severity ? severity : undefined };
    },
    ranges: [
      { min: 0, max: 0, category: "Not DKA", label: "Criteria not fully met - consider other causes of high anion gap acidosis (lactate, toxins, renal failure)", tone: "success" },
      { min: 1, max: 1, category: "DKA", label: "DKA criteria met (hyperglycaemia + ketosis + acidemia with elevated anion gap)", action: "Start protocol: IV fluids, insulin infusion, potassium replacement, monitor glucose hourly and electrolytes 2–4 hourly.", tone: "danger" },
    ],
  },
  {
    id: "hhs",
    slug: "hhs",
    title: "Hyperosmolar Hyperglycaemic State Criteria",
    abbreviation: "HHS",
    type: "score",
    category: "criteria",
    criteriaMode: "all",
    description: "ADA criteria for hyperosmolar hyperglycaemic state (formerly HONK).",
    specialties: ["Endocrinology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["hhs", "honk", "hyperosmolar", "hyperglycemia", "diabetes", "dehydration"],
    indication: "Diagnose HHS - distinguished from DKA by marked hyperosmolality and minimal ketosis.",
    limitations: "HHS and DKA can overlap; treat the dominant process.",
    lastReviewed: "2025-06-01",
    source: { org: "American Diabetes Association", title: "Hyperglycemic Crises in Adult Patients With Diabetes (Position Statement)", year: 2009, url: "https://diabetesjournals.org/care/article/32/7/1335/27958" },
    variables: [
      { id: "glucose", label: "Plasma glucose", shortLabel: "Glucose", type: "select", required: true, options: [{ label: "> 600 mg/dL", value: 1 }, { label: "≤ 600 mg/dL", value: 0 }] },
      { id: "osmol", label: "Effective serum osmolality", shortLabel: "Osmolality", type: "select", required: true, options: [{ label: "> 320 mOsm/kg", value: 1 }, { label: "≤ 320 mOsm/kg", value: 0 }], help: "2 × Na + glucose/18 (mOsm/kg)" },
      { id: "ketones", label: "Ketonemia", shortLabel: "Ketones", type: "select", required: true, options: [{ label: "No significant ketonemia (small/trace)", value: 1 }, { label: "Significant ketonemia", value: 0 }] },
      { id: "ph", label: "Arterial pH", shortLabel: "pH", type: "select", required: true, options: [{ label: "> 7.30", value: 1 }, { label: "≤ 7.30", value: 0 }] },
      { id: "hco3", label: "Bicarbonate", shortLabel: "HCO₃", type: "select", required: true, options: [{ label: "> 18 mEq/L", value: 1 }, { label: "≤ 18 mEq/L", value: 0 }] },
      { id: "mental", label: "Mental status", shortLabel: "Mental status", type: "select", required: true, options: [{ label: "Altered mental status (often)", value: 1 }, { label: "Alert", value: 0 }] },
    ],
    compute: (values) => {
      const met = Number(values.glucose) === 1 && Number(values.osmol) === 1 && Number(values.ketones) === 1 && Number(values.ph) === 1 && Number(values.hco3) === 1;
      return { total: met ? 1 : 0, detail: Number(values.mental) === 1 ? "Altered mental status present - common in HHS" : undefined };
    },
    ranges: [
      { min: 0, max: 0, category: "Not HHS", label: "Criteria not fully met - consider DKA or other hyperglycaemic emergencies", tone: "success" },
      { min: 1, max: 1, category: "HHS", label: "HHS criteria met - marked hyperglycaemia, hyperosmolality, minimal ketosis", action: "Aggressive but careful IV fluid rehydration (0.9% saline initially), low-dose insulin after fluids, potassium replacement, treat precipitant.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Obstetrics                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: "preeclampsia",
    slug: "preeclampsia",
    title: "Preeclampsia Diagnostic Criteria",
    abbreviation: "Preeclampsia",
    type: "score",
    category: "criteria",
    criteriaMode: "any",
    description: "ACOG criteria for preeclampsia: new-onset hypertension after 20 weeks with proteinuria or end-organ dysfunction.",
    specialties: ["Obstetrics & Gynecology", "Emergency Medicine"],
    keywords: ["preeclampsia", "pregnancy", "hypertension", "proteinuria", "eclampsia", "pregnancy induced hypertension"],
    indication: "Diagnose preeclampsia and identify severe features.",
    limitations: "Chronic hypertension + new proteinuria/end-organ dysfunction also meets criteria. Eclampsia = seizures, a separate emergency.",
    lastReviewed: "2025-06-01",
    source: { org: "ACOG", title: "Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia", year: 2020, url: "https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2020/06/gestational-hypertension-and-preeclampsia" },
    variables: [
      { id: "bp", label: "Blood pressure after 20 weeks", shortLabel: "BP", type: "select", required: true, options: [{ label: "SBP ≥ 140 and/or DBP ≥ 90 mmHg (twice, ≥ 4 h apart)", value: 1 }, { label: "Normal BP", value: 0 }] },
      { id: "proteinuria", label: "Proteinuria", shortLabel: "Proteinuria", type: "select", required: true, options: [{ label: "≥ 300 mg/24 h, or P/Cr ≥ 0.3, or dipstick ≥ 1+", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "thrombo", label: "Thrombocytopenia", shortLabel: "Platelets", type: "select", required: true, options: [{ label: "< 100,000/µL", value: 1 }, { label: "≥ 100,000/µL", value: 0 }] },
      { id: "renal", label: "Renal insufficiency", shortLabel: "Renal", type: "select", required: true, options: [{ label: "Creatinine > 1.1 mg/dL or doubling", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "liver", label: "Liver involvement", shortLabel: "Liver", type: "select", required: true, options: [{ label: "Transaminases ≥ 2× ULN", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "edema", label: "Pulmonary oedema", shortLabel: "Pulmonary oedema", type: "select", required: true, options: [{ label: "Present", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "neuro", label: "New-onset neurological symptoms", shortLabel: "Neurological", type: "select", required: true, options: [{ label: "Persistent headache, visual symptoms", value: 1 }, { label: "Absent", value: 0 }] },
    ],
    compute: (values) => {
      const bp = Number(values.bp) || 0;
      const proteinuria = Number(values.proteinuria) || 0;
      const severe = ["thrombo", "renal", "liver", "edema", "neuro"].reduce((s, k) => s + (Number(values[k]) || 0), 0);
      const met = bp === 1 && (proteinuria === 1 || severe > 0);
      const severeLabel = severe > 0 ? " - WITH severe features" : "";
      return {
        total: met ? 1 : 0,
        detail: met ? `Preeclampsia diagnosed${severeLabel}${severe > 0 ? " (manage as severe: IV antihypertensives, MgSO₄, delivery planning)" : ""}` : undefined,
      };
    },
    ranges: [
      { min: 0, max: 0, category: "Not preeclampsia", label: "Criteria not met - evaluate other causes of hypertension/symptoms", tone: "success" },
      { min: 1, max: 1, category: "Preeclampsia", label: "Preeclampsia - new hypertension + proteinuria or end-organ dysfunction after 20 weeks", action: "Admit; monitor BP/fetal wellbeing; treat severe features aggressively (MgSO₄, antihypertensives, delivery planning).", tone: "danger" },
    ],
  },
  {
    id: "hellp",
    slug: "hellp",
    title: "HELLP Syndrome Criteria",
    abbreviation: "HELLP",
    type: "score",
    category: "criteria",
    criteriaMode: "all",
    description: "Tennessee criteria for HELLP syndrome (haemolysis, elevated liver enzymes, low platelets) with Mississippi class by platelet count.",
    specialties: ["Obstetrics & Gynecology", "Hematology", "Intensive Care"],
    keywords: ["hellp", "preeclampsia", "pregnancy", "thrombocytopenia", "haemolysis", "liver enzymes"],
    indication: "Diagnose HELLP syndrome in pregnancy with hypertension/preeclampsia features.",
    limitations: "HELLP can occur without hypertension or proteinuria. LDH > 600 is the classic threshold.",
    lastReviewed: "2025-06-01",
    source: { org: "Sibai BM / Tennessee classification", title: "The HELLP syndrome (hemolysis, elevated liver enzymes, and low platelets): much ado about nothing?", year: 1993, url: "https://pubmed.ncbi.nlm.nih.gov/8425554/" },
    variables: [
      { id: "hemolysis", label: "Haemolysis", shortLabel: "Haemolysis", type: "select", required: true, options: [{ label: "Schistocytes, LDH > 600 U/L, or bilirubin > 1.2 mg/dL", value: 1 }, { label: "Absent", value: 0 }] },
      { id: "liver", label: "Elevated liver enzymes", shortLabel: "Liver enzymes", type: "select", required: true, options: [{ label: "AST ≥ 70 U/L", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "platelets", label: "Platelet count (/µL)", shortLabel: "Platelets", type: "select", required: true, options: [{ label: "> 150,000", value: 0 }, { label: "100,000–150,000", value: 1 }, { label: "50,000–99,999", value: 2 }, { label: "< 50,000", value: 3 }] },
    ],
    compute: (values) => {
      const hemolysis = Number(values.hemolysis) || 0;
      const liver = Number(values.liver) || 0;
      const plts = Number(values.platelets) ?? 0;
      const met = hemolysis === 1 && liver === 1 && plts > 0;
      return {
        total: met ? plts : 0,
        detail: met
          ? `HELLP syndrome (Tennessee criteria met) - Mississippi class ${plts === 3 ? "I (platelets < 50,000)" : plts === 2 ? "II (50,000–99,999)" : "III (100,000–150,000)"}`
          : "Not all Tennessee criteria met (partial HELLP possible - recheck in 4–6 h)",
      };
    },
    ranges: [
      { min: 0, max: 0, category: "Not HELLP", label: "Criteria not met - monitor closely if preeclampsia present", tone: "info" },
      { min: 1, max: 1, category: "HELLP class III", label: "HELLP class III - platelets 100,000–150,000", action: "Admit; monitor platelets/LDH/AST; delivery planning; MgSO₄ per preeclampsia protocol.", tone: "warning" },
      { min: 2, max: 2, category: "HELLP class II", label: "HELLP class II - platelets 50,000–99,999", action: "Urgent obstetric and ICU involvement; consider steroids and delivery.", tone: "warning" },
      { min: 3, max: 3, category: "HELLP class I", label: "HELLP class I - platelets < 50,000 (most severe)", action: "Emergency: control BP, MgSO₄, platelet transfusion if bleeding/surgery, expedite delivery.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Cardiology                                                          */
  /* ------------------------------------------------------------------ */
  {
    id: "chadsvasc",
    slug: "chadsvasc",
    title: "CHA₂DS₂-VASc Score",
    abbreviation: "CHA₂DS₂-VASc",
    type: "score",
    category: "score",
    description: "Stroke risk stratification in non-valvular atrial fibrillation.",
    specialties: ["Cardiology", "Internal Medicine", "Neurology"],
    keywords: ["atrial fibrillation", "stroke", "anticoagulation", "chadsvasc", "thromboembolism"],
    indication: "Estimate annual thromboembolic risk to guide oral anticoagulation in non-valvular AF.",
    limitations: "Not validated for valvular AF or mechanical valves (anticoagulate those regardless).",
    lastReviewed: "2025-06-01",
    source: { org: "Lip GYH et al.", title: "Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation (CHA₂DS₂-VASc)", year: 2010, url: "https://journal.chestnet.org/article/S0012-3692(10)60390-2/fulltext" },
    variables: [
      { id: "chf", label: "Congestive heart failure / LV dysfunction", shortLabel: "CHF", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "htn", label: "Hypertension", shortLabel: "HTN", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "age", label: "Age", shortLabel: "Age", type: "select", required: true, options: [{ label: "≥ 75 years", value: 2 }, { label: "65–74 years", value: 1 }, { label: "< 65 years", value: 0 }] },
      { id: "dm", label: "Diabetes mellitus", shortLabel: "Diabetes", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "stroke", label: "Stroke / TIA / thromboembolism", shortLabel: "Stroke/TIA", type: "select", required: true, options: [{ label: "Yes", value: 2 }, { label: "No", value: 0 }] },
      { id: "vascular", label: "Vascular disease (MI, PAD, aortic plaque)", shortLabel: "Vascular disease", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "sex", label: "Sex category", shortLabel: "Sex", type: "select", required: true, options: [{ label: "Female", value: 1 }, { label: "Male", value: 0 }] },
    ],
    compute: (values) => {
      const total = ["chf", "htn", "age", "dm", "stroke", "vascular", "sex"].reduce((s, k) => s + (Number(values[k]) || 0), 0);
      const female = String(values.sex) === "female";
      const rec = female ? (total === 2 ? "consider OAC" : total >= 3 ? "OAC recommended" : total <= 1 ? "no OAC recommended" : "consider OAC") : total === 1 ? "consider OAC" : total >= 2 ? "OAC recommended" : "no OAC recommended";
      return { total, detail: `Anticoagulation guidance (${female ? "female" : "male"}): ${rec}. Always weigh bleeding risk (HAS-BLED).` };
    },
    ranges: [
      { min: 0, max: 1, category: "Low–intermediate", label: "Score 0 (men) / 1 (women, sex only) - annual stroke risk ~0.2–1.3%; usually no anticoagulation", tone: "success" },
      { min: 2, max: 2, category: "Intermediate", label: "Score 1 (men) / 2 (women) - consider oral anticoagulation", tone: "warning" },
      { min: 3, max: 9, category: "High", label: "Score ≥ 2 (men) / ≥ 3 (women) - oral anticoagulation recommended", action: "Discuss DOAC vs warfarin; reassess bleeding risk (HAS-BLED).", tone: "danger" },
    ],
  },
  {
    id: "hasbled",
    slug: "hasbled",
    title: "HAS-BLED Bleeding Risk Score",
    abbreviation: "HAS-BLED",
    type: "score",
    category: "score",
    description: "Estimates 1-year major bleeding risk in patients on anticoagulation for AF.",
    specialties: ["Cardiology", "Internal Medicine"],
    keywords: ["bleeding", "anticoagulation", "hasbled", "atrial fibrillation", "warfarin"],
    indication: "Assess modifiable bleeding risk factors; score ≥ 3 warrants caution and review, not refusal of anticoagulation.",
    limitations: "A high HAS-BLED should prompt correction of modifiable factors, not denial of anticoagulation.",
    lastReviewed: "2025-06-01",
    source: { org: "Pisters R et al.", title: "A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation", year: 2010, url: "https://journal.chestnet.org/article/S0012-3692(10)60562-7/fulltext" },
    variables: [
      { id: "htn", label: "Hypertension (uncontrolled, SBP > 160)", shortLabel: "Hypertension", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "renal", label: "Abnormal renal function (dialysis, transplant, Cr > 2.26 mg/dL)", shortLabel: "Renal", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "liver", label: "Abnormal liver function (cirrhosis, bilirubin > 2×, transaminases > 3×)", shortLabel: "Liver", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "stroke", label: "Prior stroke", shortLabel: "Stroke", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "bleed", label: "Prior major bleeding or predisposition", shortLabel: "Bleeding", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "inr", label: "Labile INR (TTR < 60%)", shortLabel: "Labile INR", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "elderly", label: "Elderly (> 65 years)", shortLabel: "Elderly", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "drugs", label: "Drugs (antiplatelet, NSAID) or alcohol", shortLabel: "Drugs/alcohol", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 2, category: "Low risk", label: "HAS-BLED 0–2 - low bleeding risk", tone: "success" },
      { min: 3, max: 9, category: "High risk", label: "HAS-BLED ≥ 3 - high bleeding risk", action: "Address modifiable factors (BP, INR, alcohol, NSAIDs); reassess frequently. High score alone should not preclude anticoagulation when clearly indicated.", tone: "warning" },
    ],
  },
  {
    id: "heart",
    slug: "heart",
    title: "HEART Score for Chest Pain",
    abbreviation: "HEART",
    type: "score",
    category: "score",
    description: "Early risk stratification of undifferentiated chest pain for major adverse cardiac events (MACE).",
    specialties: ["Cardiology", "Emergency Medicine"],
    keywords: ["chest pain", "heart score", "mace", "acute coronary syndrome", "troponin", "ecg"],
    indication: "Patients with chest pain in the emergency department; guides admission vs observation vs discharge.",
    limitations: "Use with serial troponin and ECG; HEART 0–3 still requires follow-up.",
    lastReviewed: "2025-06-01",
    source: { org: "Six AJ et al.", title: "Chest pain in the emergency room: value of the HEART score", year: 2008, url: "https://link.springer.com/article/10.1007/BF03086124" },
    variables: [
      { id: "history", label: "History", shortLabel: "History", type: "select", required: true, options: [{ label: "Highly suspicious", value: 2 }, { label: "Moderately suspicious", value: 1 }, { label: "Slightly suspicious", value: 0 }] },
      { id: "ecg", label: "ECG", shortLabel: "ECG", type: "select", required: true, options: [{ label: "Significant ST-segment depression", value: 2 }, { label: "Non-specific repolarisation disturbance", value: 1 }, { label: "Normal", value: 0 }] },
      { id: "age", label: "Age", shortLabel: "Age", type: "select", required: true, options: [{ label: "≥ 65 years", value: 2 }, { label: "45–65 years", value: 1 }, { label: "< 45 years", value: 0 }] },
      { id: "rf", label: "Risk factors", shortLabel: "Risk factors", type: "select", required: true, options: [{ label: "≥ 3 risk factors or known CAD", value: 2 }, { label: "1–2 risk factors", value: 1 }, { label: "No risk factors", value: 0 }], help: "Risk factors: DM, smoking, hypertension, hyperlipidaemia, family history, obesity" },
      { id: "trop", label: "Troponin", shortLabel: "Troponin", type: "select", required: true, options: [{ label: "> 3× normal limit", value: 2 }, { label: "1–3× normal limit", value: 1 }, { label: "≤ normal limit", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 3, category: "Low risk", label: "HEART 0–3 - MACE ~1.7% (6 weeks); consider discharge with early follow-up", tone: "success" },
      { min: 4, max: 6, category: "Moderate risk", label: "HEART 4–6 - MACE ~13–17%; admit for observation, serial troponins, stress testing", tone: "warning" },
      { min: 7, max: 10, category: "High risk", label: "HEART 7–10 - MACE ~50%; urgent cardiology, invasive strategy", tone: "danger" },
    ],
  },
  {
    id: "timi",
    slug: "timi",
    title: "TIMI Risk Score (UA/NSTEMI)",
    abbreviation: "TIMI",
    type: "score",
    category: "score",
    description: "Seven-item risk score for 14-day outcomes in unstable angina / NSTEMI.",
    specialties: ["Cardiology", "Emergency Medicine"],
    keywords: ["timi", "unstable angina", "nstemi", "acute coronary syndrome", "chest pain"],
    indication: "Risk-stratify UA/NSTEMI patients; score 0–2 low, 3–4 intermediate, 5–7 high.",
    limitations: "Derived from the TIMI 11B trial; treat high-risk patients aggressively regardless of score.",
    lastReviewed: "2025-06-01",
    source: { org: "Antman EM et al. (TIMI Study Group)", title: "The TIMI risk score for unstable angina/non-ST elevation MI", year: 2000, url: "https://jamanetwork.com/journals/jama/fullarticle/192748" },
    variables: [
      { id: "age", label: "Age ≥ 65 years", shortLabel: "Age ≥ 65", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "rf", label: "≥ 3 CAD risk factors", shortLabel: "Risk factors", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }], help: "Family history, hypertension, hyperlipidaemia, diabetes, smoking" },
      { id: "cad", label: "Known CAD (stenosis ≥ 50%)", shortLabel: "Known CAD", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "asa", label: "Aspirin use in past 7 days", shortLabel: "ASA", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "angina", label: "≥ 2 anginal events in past 24 h", shortLabel: "Angina ×2", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "markers", label: "Elevated cardiac markers", shortLabel: "Markers", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "std", label: "ST deviation ≥ 0.5 mm", shortLabel: "ST deviation", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "Low risk", label: "TIMI 0–1 - 14-day event rate ~4.7%", tone: "success" },
      { min: 2, max: 4, category: "Intermediate risk", label: "TIMI 2–4 - 14-day event rate ~8.3–19.9%", tone: "warning" },
      { min: 5, max: 7, category: "High risk", label: "TIMI 5–7 - 14-day event rate ~26.2–40.9%", action: "Aggressive management: antiplatelet/anticoagulation, early invasive strategy.", tone: "danger" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Surgery & GI                                                        */
  /* ------------------------------------------------------------------ */
  {
    id: "alvarado",
    slug: "alvarado",
    title: "Alvarado Score (Appendicitis)",
    abbreviation: "Alvarado",
    type: "score",
    category: "score",
    description: "Clinical score for the likelihood of acute appendicitis.",
    specialties: ["Surgery", "Emergency Medicine"],
    keywords: ["appendicitis", "alvarado", "abdominal pain", "right lower quadrant"],
    indication: "Adults and children with suspected appendicitis; ≥ 7 → high probability, surgical review.",
    limitations: "Score < 5 does not exclude appendicitis; imaging (ultrasound/CT) remains definitive.",
    lastReviewed: "2025-06-01",
    source: { org: "Alvarado A.", title: "A practical score for the early diagnosis of acute appendicitis", year: 1986, url: "https://pubmed.ncbi.nlm.nih.gov/3729320/" },
    variables: [
      { id: "migration", label: "Migration of pain to RIF", shortLabel: "Migration", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "anorexia", label: "Anorexia", shortLabel: "Anorexia", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "nausea", label: "Nausea / vomiting", shortLabel: "Nausea", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "tenderness", label: "Tenderness in right iliac fossa", shortLabel: "RIF tenderness", type: "select", required: true, options: [{ label: "Yes", value: 2 }, { label: "No", value: 0 }] },
      { id: "rebound", label: "Rebound tenderness", shortLabel: "Rebound", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "fever", label: "Fever", shortLabel: "Fever", type: "select", required: true, options: [{ label: "> 37.3 °C", value: 1 }, { label: "≤ 37.3 °C", value: 0 }] },
      { id: "leukocytosis", label: "Leukocytosis", shortLabel: "WBC", type: "select", required: true, options: [{ label: "> 10,000/µL", value: 2 }, { label: "≤ 10,000/µL", value: 0 }] },
      { id: "shift", label: "Neutrophil shift to left", shortLabel: "Shift", type: "select", required: true, options: [{ label: "> 75% neutrophils", value: 1 }, { label: "≤ 75%", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 4, category: "Low probability", label: "Alvarado 0–4 - appendicitis unlikely; observe / consider imaging", tone: "success" },
      { min: 5, max: 6, category: "Equivocal", label: "Alvarado 5–6 - possible appendicitis; imaging advised", tone: "warning" },
      { min: 7, max: 10, category: "High probability", label: "Alvarado ≥ 7 - probable appendicitis; surgical consultation", tone: "danger" },
    ],
  },
  {
    id: "ranson",
    slug: "ranson",
    title: "Ranson Criteria (Acute Pancreatitis)",
    abbreviation: "Ranson",
    type: "score",
    category: "criteria",
    criteriaMode: "count",
    description: "Eleven criteria (5 on admission, 6 at 48 h) predicting severity and mortality in acute pancreatitis.",
    specialties: ["Gastroenterology", "Surgery", "Intensive Care"],
    keywords: ["pancreatitis", "ranson", "severity", "mortality", "amylase"],
    indication: "Assess severity of acute pancreatitis at admission and at 48 hours.",
    limitations: "Requires the full 48 h for completion; consider APACHE-II or BISAP earlier. Contemporary care uses organ-failure based systems.",
    lastReviewed: "2025-06-01",
    source: { org: "Ranson JHC et al.", title: "Prognostic signs and the role of operative management in acute pancreatitis", year: 1974, url: "https://pubmed.ncbi.nlm.nih.gov/4855349/" },
    variables: [
      { id: "age", label: "ADMISSION: Age > 55 years", shortLabel: "Age > 55", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "wbc", label: "ADMISSION: WBC > 16,000/µL", shortLabel: "WBC", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "glucose", label: "ADMISSION: Glucose > 200 mg/dL", shortLabel: "Glucose", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "ldh", label: "ADMISSION: LDH > 350 U/L", shortLabel: "LDH", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "ast", label: "ADMISSION: AST > 250 U/L", shortLabel: "AST", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "hct", label: "48 H: Hematocrit fall > 10%", shortLabel: "Hct fall", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "bun", label: "48 H: BUN rise > 5 mg/dL", shortLabel: "BUN rise", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "calcium", label: "48 H: Calcium < 8 mg/dL", shortLabel: "Calcium", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "pao2", label: "48 H: PaO₂ < 60 mmHg", shortLabel: "PaO₂", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "basedef", label: "48 H: Base deficit > 4 mEq/L", shortLabel: "Base deficit", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "seq", label: "48 H: Fluid sequestration > 6 L", shortLabel: "Fluid seq.", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
    ],
    compute: (values) => {
      const admission = ["age", "wbc", "glucose", "ldh", "ast"].reduce((s, k) => s + (Number(values[k]) || 0), 0);
      const h48 = ["hct", "bun", "calcium", "pao2", "basedef", "seq"].reduce((s, k) => s + (Number(values[k]) || 0), 0);
      return { total: admission + h48, detail: `At admission: ${admission}/5 · At 48 h: ${h48}/6 (complete at 48 hours)` };
    },
    ranges: [
      { min: 0, max: 2, category: "Mild", label: "Ranson 0–2 - mortality < 1%; supportive care", tone: "success" },
      { min: 3, max: 4, category: "Moderate", label: "Ranson 3–4 - mortality ~15%; close monitoring", tone: "warning" },
      { min: 5, max: 6, category: "Severe", label: "Ranson 5–6 - mortality ~40%; consider ICU", tone: "warning" },
      { min: 7, max: 11, category: "Very severe", label: "Ranson ≥ 7 - mortality > 90%; ICU management", tone: "danger" },
    ],
  },
  {
    id: "blatchford",
    slug: "blatchford",
    title: "Glasgow-Blatchford Score (Upper GI Bleeding)",
    abbreviation: "Blatchford",
    type: "score",
    category: "score",
    description: "Pre-endoscopy risk score for upper GI bleeding; predicts need for endoscopic intervention or transfusion.",
    specialties: ["Gastroenterology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["gi bleeding", "upper gi", "blatchford", "melena", "hematemesis", "endoscopy"],
    indication: "Identify low-risk patients with upper GI bleeding who may be managed as outpatients (score 0–1).",
    limitations: "Requires labs (BUN, Hb). Score 0–1 in otherwise fit patients suggests very low risk.",
    lastReviewed: "2025-06-01",
    source: { org: "Blatchford O et al.", title: "A risk score to predict need for treatment for upper-gastrointestinal haemorrhage", year: 2000, url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(00)02816-6/fulltext" },
    variables: [
      { id: "bun", label: "BUN (mg/dL)", shortLabel: "BUN", type: "select", required: true, options: [{ label: "> 70 mg/dL (> 25 mmol/L)", value: 6 }, { label: "28.1–70", value: 4 }, { label: "22.4–28.0", value: 3 }, { label: "18.2–22.3", value: 2 }, { label: "< 18.2", value: 0 }] },
      { id: "hb", label: "Haemoglobin (g/dL)", shortLabel: "Hb", type: "select", required: true, options: [{ label: "< 8.0", value: 6 }, { label: "8.0–9.9", value: 3 }, { label: "10.0–12.9 (men) / 10.0–11.9 (women)", value: 1 }, { label: "≥ 13.0 (men) / ≥ 12.0 (women)", value: 0 }], help: "Blatchford haemoglobin bands" },
      { id: "sbp", label: "Systolic BP (mmHg)", shortLabel: "SBP", type: "select", required: true, options: [{ label: "< 90", value: 3 }, { label: "90–99", value: 2 }, { label: "100–109", value: 1 }, { label: "≥ 110", value: 0 }] },
      { id: "hr", label: "Pulse (per min)", shortLabel: "Pulse", type: "select", required: true, options: [{ label: "≥ 100", value: 1 }, { label: "< 100", value: 0 }] },
      { id: "melena", label: "Melena", shortLabel: "Melena", type: "select", required: true, options: [{ label: "Yes", value: 1 }, { label: "No", value: 0 }] },
      { id: "syncope", label: "Syncope", shortLabel: "Syncope", type: "select", required: true, options: [{ label: "Yes", value: 2 }, { label: "No", value: 0 }] },
      { id: "hepatic", label: "Hepatic disease", shortLabel: "Hepatic", type: "select", required: true, options: [{ label: "Yes", value: 2 }, { label: "No", value: 0 }] },
      { id: "cardiac", label: "Cardiac failure", shortLabel: "Cardiac failure", type: "select", required: true, options: [{ label: "Yes", value: 2 }, { label: "No", value: 0 }] },
    ],
    ranges: [
      { min: 0, max: 1, category: "Very low risk", label: "Blatchford 0–1 - low risk of needing intervention; consider outpatient management", tone: "success" },
      { min: 2, max: 5, category: "Low–moderate", label: "Blatchford 2–5 - admit, monitor, plan endoscopy", tone: "info" },
      { min: 6, max: 11, category: "Moderate–high", label: "Blatchford ≥ 6 - higher risk of intervention/transfusion; early endoscopy", tone: "warning" },
      { min: 12, max: 23, category: "High", label: "Blatchford ≥ 12 - very high risk; urgent endoscopy and resuscitation", tone: "danger" },
    ],
  },
  ...EXTRA_SCORES_A,
  ...EXTRA_SCORES_B,
  ...EXTRA_SCORES_C,
  ...EXTRA_SCORES_D,
  ...EXTRA_SCORES_E,
  ...EXTRA_SCORES_F,
  ...EXTRA_SCORES_G,
  ...EXTRA_SCORES_H,
  ...EXTRA_SCORES_I,
];

export const SCORES: ScoreTool[] = [...canonicalScores(RFS_SCORES), SIRIRAJ_SCORE];

export const SCORES_BY_SLUG: Record<string, ScoreTool> = Object.fromEntries(SCORES.map((s) => [s.slug, s]));
