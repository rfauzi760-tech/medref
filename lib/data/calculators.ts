import type { CalculatorTool } from "@/lib/types";

/**
 * Clinical calculator library. Definitions reference the pure formula
 * registry in lib/calc/calculators.ts.
 */

export const CALCULATORS: CalculatorTool[] = [
  /* ---------------- Body measurements ---------------- */
  {
    id: "bmi", slug: "bmi", title: "Body Mass Index", abbreviation: "BMI", type: "calculator", category: "body",
    description: "Weight-for-height index with adult WHO classification.",
    specialties: ["Internal Medicine", "Nutrition", "Endocrinology"], keywords: ["bmi", "obesity", "weight", "body mass index"],
    formulaText: "BMI = weight(kg) / height(m)²",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 1, max: 400, step: 0.1, required: true },
      { id: "height", label: "Height", unit: "cm", type: "number", min: 50, max: 250, step: 0.1, required: true },
    ],
    interpretation: "WHO adult classification: < 18.5 underweight · 18.5–24.9 normal · 25–29.9 overweight · ≥ 30 obese.",
    lastReviewed: "2025-06-01",
    source: { org: "WHO", title: "Obesity and overweight — BMI classification", year: 2000, url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
  },
  {
    id: "bsa", slug: "bsa", title: "Body Surface Area", abbreviation: "BSA", type: "calculator", category: "body",
    description: "Mosteller and DuBois body surface area — used for chemotherapy dosing and cardiac index.",
    specialties: ["Oncology", "Cardiology", "Anesthesiology"], keywords: ["bsa", "body surface area", "mosteller", "dubois", "dosing"],
    formulaText: "Mosteller: √(weight × height / 3600)",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 400, step: 0.1, required: true },
      { id: "height", label: "Height", unit: "cm", type: "number", min: 30, max: 250, step: 0.1, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Mosteller RD", title: "Simplified calculation of body-surface area", year: 1987, url: "https://www.nejm.org/doi/full/10.1056/NEJM198710223171717" },
  },
  {
    id: "ibw", slug: "ibw", title: "Ideal & Adjusted Body Weight", abbreviation: "IBW", type: "calculator", category: "body",
    description: "Devine ideal body weight with adjusted weight for obese patients (drug dosing).",
    specialties: ["Anesthesiology", "Intensive Care", "Internal Medicine"], keywords: ["ibw", "ideal body weight", "adjusted", "devine", "dosing"],
    formulaText: "IBW(male) = 50 + 2.3(ht−60in) · IBW(female) = 45.5 + 2.3(ht−60in)",
    inputs: [
      { id: "sex", label: "Sex", type: "select", required: true, options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
      { id: "height", label: "Height", unit: "cm", type: "number", min: 100, max: 250, step: 0.1, required: true },
      { id: "weight", label: "Actual weight (for adjusted BW)", unit: "kg", type: "number", min: 20, max: 400, step: 0.1 },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Devine BJ", title: "Gentamicin therapy (Devine formula)", year: 1974, url: "https://pubmed.ncbi.nlm.nih.gov/4615421/" },
  },

  /* ---------------- Renal ---------------- */
  {
    id: "egfr", slug: "egfr", title: "eGFR — CKD-EPI 2021", abbreviation: "eGFR", type: "calculator", category: "renal",
    description: "Estimated glomerular filtration rate using the race-free CKD-EPI 2021 creatinine equation (adults).",
    specialties: ["Nephrology", "Internal Medicine", "Geriatrics"], keywords: ["egfr", "ckd", "ckd-epi", "creatinine", "glomerular filtration"],
    formulaText: "CKD-EPI 2021: eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.2 × 0.9938^age × 1.012 (if female)",
    inputs: [
      { id: "creatinine", label: "Serum creatinine", unit: "mg/dL", type: "number", min: 0.2, max: 20, step: 0.01, required: true },
      { id: "age", label: "Age", unit: "years", type: "number", min: 18, max: 120, step: 1, required: true },
      { id: "sex", label: "Sex", type: "select", required: true, options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    ],
    interpretation: "CKD-EPI 2021 (no race coefficient). In children use the Bedside Schwartz equation.",
    lastReviewed: "2025-06-01",
    source: { org: "Inker LA et al. (CKD-EPI)", title: "New creatinine- and cystatin C-based equations to estimate GFR without race", year: 2021, url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2102953" },
  },
  {
    id: "egfr-schwartz", slug: "egfr-schwartz", title: "eGFR — Bedside Schwartz (Children)", abbreviation: "Schwartz", type: "calculator", category: "renal",
    description: "Paediatric eGFR estimation (1–16 years) from height and creatinine.",
    specialties: ["Pediatrics", "Nephrology"], keywords: ["egfr", "schwartz", "children", "pediatric", "creatinine"],
    formulaText: "eGFR = 0.413 × height(cm) / creatinine(mg/dL)",
    inputs: [
      { id: "creatinine", label: "Serum creatinine", unit: "mg/dL", type: "number", min: 0.1, max: 10, step: 0.01, required: true },
      { id: "height", label: "Height", unit: "cm", type: "number", min: 40, max: 190, step: 0.1, required: true },
    ],
    interpretation: "Bedside Schwartz (2009) for children 1–16 years.",
    lastReviewed: "2025-06-01",
    source: { org: "Schwartz GJ et al.", title: "New equations to estimate GFR in children with CKD", year: 2009, url: "https://jasn.asnjournals.org/content/20/3/629" },
  },
  {
    id: "crcl", slug: "crcl", title: "Creatinine Clearance — Cockcroft-Gault", abbreviation: "CrCl", type: "calculator", category: "renal",
    description: "Creatinine clearance estimate used for drug dose adjustment.",
    specialties: ["Nephrology", "Internal Medicine", "Geriatrics"], keywords: ["crcl", "cockcroft", "gault", "creatinine clearance", "dosing"],
    formulaText: "CrCl = ((140 − age) × weight) / (72 × Scr) × 0.85 (female)",
    inputs: [
      { id: "creatinine", label: "Serum creatinine", unit: "mg/dL", type: "number", min: 0.2, max: 20, step: 0.01, required: true },
      { id: "age", label: "Age", unit: "years", type: "number", min: 18, max: 120, step: 1, required: true },
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 20, max: 250, step: 0.1, required: true },
      { id: "sex", label: "Sex", type: "select", required: true, options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Cockcroft DW, Gault MH", title: "Prediction of creatinine clearance from serum creatinine", year: 1976, url: "https://www.nejm.org/doi/full/10.1056/NEJM197608192950803" },
  },
  {
    id: "meld-na", slug: "meld-na", title: "MELD-Na Score (Liver)", abbreviation: "MELD-Na", type: "calculator", category: "renal",
    description: "Model for End-Stage Liver Disease with sodium — transplant prioritisation.",
    specialties: ["Hepatology", "Gastroenterology", "Surgery"], keywords: ["meld", "liver", "cirrhosis", "transplant", "sodium", "prognosis"],
    formulaText: "MELD = 3.78·ln(bili) + 11.2·ln(INR) + 9.57·ln(Cr) + 6.43 · MELD-Na adds serum Na (clamped 120–137)",
    inputs: [
      { id: "bilirubin", label: "Bilirubin", unit: "mg/dL", type: "number", min: 0.1, max: 60, step: 0.1, required: true },
      { id: "inr", label: "INR", type: "number", min: 0.5, max: 15, step: 0.1, required: true },
      { id: "creatinine", label: "Creatinine", unit: "mg/dL", type: "number", min: 0.1, max: 15, step: 0.1, required: true },
      { id: "sodium", label: "Sodium", unit: "mEq/L", type: "number", min: 100, max: 160, step: 1, required: true },
      { id: "dialysis", label: "On dialysis (≥ 2× in past week)", type: "select", required: true, options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "UNOS / OPTN", title: "MELD-Na score for liver allocation", year: 2016, url: "https://optn.transplant.hrsa.gov/media/1575/policynotice_20151101.pdf" },
  },

  /* ---------------- Electrolytes & acid-base ---------------- */
  {
    id: "anion-gap", slug: "anion-gap", title: "Anion Gap", abbreviation: "AG", type: "calculator", category: "electrolyte",
    description: "Serum anion gap to screen for metabolic acidosis causes.",
    specialties: ["Internal Medicine", "Intensive Care", "Nephrology"], keywords: ["anion gap", "acidosis", "metabolic", "electrolytes"],
    formulaText: "AG = Na⁺ − (Cl⁻ + HCO₃⁻)",
    inputs: [
      { id: "sodium", label: "Sodium (Na⁺)", unit: "mEq/L", type: "number", min: 100, max: 180, step: 1, required: true },
      { id: "chloride", label: "Chloride (Cl⁻)", unit: "mEq/L", type: "number", min: 60, max: 140, step: 1, required: true },
      { id: "bicarbonate", label: "Bicarbonate (HCO₃⁻)", unit: "mEq/L", type: "number", min: 1, max: 60, step: 1, required: true },
    ],
    interpretation: "Normal 8–12 mEq/L. High gap: ketoacidosis, lactic acidosis, renal failure, toxins (methanol, ethylene glycol, salicylates).",
    lastReviewed: "2025-06-01",
    source: { org: "Emmett M, Narins RG", title: "Clinical use of the anion gap", year: 1977, url: "https://pubmed.ncbi.nlm.nih.gov/851052/" },
  },
  {
    id: "corrected-calcium", slug: "corrected-calcium", title: "Corrected Calcium", abbreviation: "Ca corr", type: "calculator", category: "electrolyte",
    description: "Payne correction of total calcium for albumin level.",
    specialties: ["Internal Medicine", "Nephrology", "Endocrinology"], keywords: ["calcium", "albumin", "corrected", "hypocalcemia", "hypercalcemia"],
    formulaText: "Ca corr = Ca + 0.8 × (4 − albumin) mg/dL",
    inputs: [
      { id: "calcium", label: "Total calcium", unit: "mg/dL", type: "number", min: 4, max: 20, step: 0.1, required: true },
      { id: "albumin", label: "Albumin", unit: "g/dL", type: "number", min: 0.5, max: 6, step: 0.1, required: true },
    ],
    interpretation: "Normal corrected calcium 8.5–10.5 mg/dL. Ionized calcium preferred in critical illness.",
    lastReviewed: "2025-06-01",
    source: { org: "Payne RB et al.", title: "Interpretation of serum calcium in patients with abnormal serum proteins", year: 1973, url: "https://pubmed.ncbi.nlm.nih.gov/4122908/" },
  },
  {
    id: "corrected-sodium", slug: "corrected-sodium", title: "Corrected Sodium (Hyperglycemia)", abbreviation: "Na corr", type: "calculator", category: "electrolyte",
    description: "Correct measured sodium for hyperglycemia (Katz and Hillier methods).",
    specialties: ["Endocrinology", "Internal Medicine", "Emergency Medicine"], keywords: ["sodium", "hyperglycemia", "corrected", "diabetes", "osmolarity"],
    formulaText: "Na corr = Na + 1.6 × (glucose − 100)/100 (Katz)",
    inputs: [
      { id: "sodium", label: "Measured sodium", unit: "mEq/L", type: "number", min: 100, max: 180, step: 1, required: true },
      { id: "glucose", label: "Glucose", unit: "mg/dL", type: "number", min: 50, max: 2000, step: 1, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Katz MA", title: "Hyperglycemia-induced hyponatremia — calculation of expected serum sodium depression", year: 1973, url: "https://pubmed.ncbi.nlm.nih.gov/4637202/" },
  },
  {
    id: "osmolality", slug: "osmolality", title: "Serum Osmolality (Calculated)", abbreviation: "Osm", type: "calculator", category: "electrolyte",
    description: "Calculated serum osmolality; compare with measured for osmolar gap.",
    specialties: ["Nephrology", "Internal Medicine", "Endocrinology"], keywords: ["osmolality", "osmolar", "dehydration", "hypernatremia"],
    formulaText: "Osm = 2 × Na + glucose/18 + BUN/2.8",
    inputs: [
      { id: "sodium", label: "Sodium", unit: "mEq/L", type: "number", min: 100, max: 180, step: 1, required: true },
      { id: "glucose", label: "Glucose", unit: "mg/dL", type: "number", min: 0, max: 2000, step: 1 },
      { id: "bun", label: "BUN", unit: "mg/dL", type: "number", min: 0, max: 200, step: 1 },
    ],
    interpretation: "Normal 275–295 mOsm/kg.",
    lastReviewed: "2025-06-01",
    source: { org: "Dorwart WV, Chalmers L", title: "Comparison of methods for calculating serum osmolality", year: 1975, url: "https://pubmed.ncbi.nlm.nih.gov/1127133/" },
  },
  {
    id: "osmolar-gap", slug: "osmolar-gap", title: "Osmolar Gap", abbreviation: "OG", type: "calculator", category: "electrolyte",
    description: "Difference between measured and calculated osmolality — detects unmeasured solutes.",
    specialties: ["Emergency Medicine", "Nephrology", "Toxicology"], keywords: ["osmolar gap", "toxic alcohol", "methanol", "ethylene glycol", "overdose"],
    formulaText: "OG = measured − calculated osmolality",
    inputs: [
      { id: "measured", label: "Measured osmolality", unit: "mOsm/kg", type: "number", min: 200, max: 500, step: 1, required: true },
      { id: "sodium", label: "Sodium", unit: "mEq/L", type: "number", min: 100, max: 180, step: 1, required: true },
      { id: "glucose", label: "Glucose", unit: "mg/dL", type: "number", min: 0, max: 2000, step: 1 },
      { id: "bun", label: "BUN", unit: "mg/dL", type: "number", min: 0, max: 200, step: 1 },
    ],
    interpretation: "Normal < 10 mOsm/kg. Gap > 10 suggests methanol, ethylene glycol, isopropanol, propylene glycol.",
    lastReviewed: "2025-06-01",
    source: { org: "Kraut JA, Kurtz I", title: "Toxic alcohol ingestions: clinical features, diagnosis, and management", year: 2008, url: "https://www.nejm.org/doi/full/10.1056/NEJMra0708934" },
  },
  {
    id: "free-water-deficit", slug: "free-water-deficit", title: "Free Water Deficit", abbreviation: "FWD", type: "calculator", category: "electrolyte",
    description: "Water deficit in hypernatremia — guides replacement volume.",
    specialties: ["Nephrology", "Endocrinology", "Internal Medicine"], keywords: ["free water", "hypernatremia", "deficit", "rehydration"],
    formulaText: "FWD = (Na − 140)/140 × TBW · TBW = 0.6 × wt (male), 0.5 × wt (female)",
    inputs: [
      { id: "sodium", label: "Sodium", unit: "mEq/L", type: "number", min: 145, max: 200, step: 1, required: true },
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 20, max: 250, step: 0.1, required: true },
      { id: "sex", label: "Sex", type: "select", required: true, options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    ],
    interpretation: "Correct hypernatremia slowly (≤ 10–12 mEq/L per 24 h).",
    lastReviewed: "2025-06-01",
    source: { org: "Adrogué HJ, Madias NE", title: "Hypernatremia (NEJM review)", year: 2000, url: "https://www.nejm.org/doi/full/10.1056/NEJM200005253422107" },
  },
  {
    id: "bicarb", slug: "bicarb", title: "Bicarbonate Deficit", abbreviation: "HCO₃ def", type: "calculator", category: "electrolyte",
    description: "Estimated sodium bicarbonate deficit for metabolic acidosis.",
    specialties: ["Intensive Care", "Internal Medicine", "Nephrology"], keywords: ["bicarbonate", "sodium bicarbonate", "acidosis", "deficit"],
    formulaText: "Deficit (mEq) = 0.3 × weight × (24 − HCO₃⁻)",
    inputs: [
      { id: "bicarbonate", label: "Bicarbonate", unit: "mEq/L", type: "number", min: 1, max: 24, step: 0.1, required: true },
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 20, max: 250, step: 0.1, required: true },
    ],
    interpretation: "Replace 50% of deficit then reassess. Bicarbonate is not routinely recommended in DKA.",
    lastReviewed: "2025-06-01",
    source: { org: "Adrogué HJ, Madias NE", title: "Management of life-threatening acid-base disorders (NEJM)", year: 1998, url: "https://www.nejm.org/doi/full/10.1056/NEJM199807163390407" },
  },

  /* ---------------- Cardiovascular ---------------- */
  {
    id: "map", slug: "map", title: "Mean Arterial Pressure", abbreviation: "MAP", type: "calculator", category: "cardio",
    description: "Mean arterial pressure from systolic and diastolic blood pressure.",
    specialties: ["Intensive Care", "Emergency Medicine", "Anesthesiology"], keywords: ["map", "blood pressure", "perfusion", "mean arterial pressure"],
    formulaText: "MAP = (SBP + 2 × DBP) / 3",
    inputs: [
      { id: "sbp", label: "Systolic BP", unit: "mmHg", type: "number", min: 30, max: 300, step: 1, required: true },
      { id: "dbp", label: "Diastolic BP", unit: "mmHg", type: "number", min: 10, max: 200, step: 1, required: true },
    ],
    interpretation: "Target MAP ≥ 65 mmHg in most critically ill adults.",
    lastReviewed: "2025-06-01",
    source: { org: "Surviving Sepsis Campaign", title: "Surviving Sepsis Campaign guidelines (hemodynamic targets)", year: 2021, url: "https://www.sccm.org/SurvivingSepsisCampaign/Guidelines/Adult-Patients" },
  },
  {
    id: "shock-index", slug: "shock-index", title: "Shock Index", abbreviation: "SI", type: "calculator", category: "cardio",
    description: "Heart rate divided by systolic blood pressure — early marker of haemodynamic compromise.",
    specialties: ["Emergency Medicine", "Intensive Care", "Obstetrics & Gynecology"], keywords: ["shock index", "hemorrhage", "sepsis", "tachycardia"],
    formulaText: "SI = HR / SBP",
    inputs: [
      { id: "hr", label: "Heart rate", unit: "bpm", type: "number", min: 20, max: 250, step: 1, required: true },
      { id: "sbp", label: "Systolic BP", unit: "mmHg", type: "number", min: 30, max: 300, step: 1, required: true },
    ],
    interpretation: "SI ≥ 0.7–1.0 associated with increased transfusion requirement and mortality.",
    lastReviewed: "2025-06-01",
    source: { org: "Rady MY et al.", title: "Early detection of occult hypoperfusion in the ED (shock index)", year: 1994, url: "https://pubmed.ncbi.nlm.nih.gov/8169181/" },
  },
  {
    id: "qtc", slug: "qtc", title: "QTc Interval (Bazett & Fridericia)", abbreviation: "QTc", type: "calculator", category: "cardio",
    description: "Heart-rate corrected QT interval to screen for QT prolongation.",
    specialties: ["Cardiology", "Internal Medicine", "Emergency Medicine"], keywords: ["qtc", "qt interval", "arrhythmia", "torsades", "long qt"],
    formulaText: "Bazett: QTc = QT/√RR · Fridericia: QTc = QT/∛RR",
    inputs: [
      { id: "qt", label: "QT interval", unit: "ms", type: "number", min: 200, max: 800, step: 1, required: true },
      { id: "hr", label: "Heart rate", unit: "bpm", type: "number", min: 20, max: 250, step: 1, required: true },
    ],
    interpretation: "Prolonged: men > 450 ms, women > 460 ms. Use Fridericia at fast/irregular rates.",
    lastReviewed: "2025-06-01",
    source: { org: "Bazett HC", title: "An analysis of the time-relations of electrocardiograms", year: 1920, url: "https://pubmed.ncbi.nlm.nih.gov/19971756/" },
  },

  /* ---------------- Ventilation & oxygenation ---------------- */
  {
    id: "pf-ratio", slug: "pf-ratio", title: "PaO₂/FiO₂ Ratio", abbreviation: "P/F", type: "calculator", category: "ventilation",
    description: "Oxygenation index used in ARDS classification (Berlin criteria).",
    specialties: ["Intensive Care", "Pulmonology", "Emergency Medicine"], keywords: ["pf ratio", "ards", "hypoxemia", "oxygenation", "pao2", "fio2"],
    formulaText: "P/F = PaO₂ / FiO₂",
    inputs: [
      { id: "pao2", label: "PaO₂", unit: "mmHg", type: "number", min: 20, max: 700, step: 1, required: true },
      { id: "fio2", label: "FiO₂", unit: "%", type: "number", min: 21, max: 100, step: 1, required: true },
    ],
    interpretation: "ARDS (Berlin): mild 200–300, moderate 100–200, severe < 100 with PEEP ≥ 5 cmH₂O.",
    lastReviewed: "2025-06-01",
    source: { org: "ARDS Definition Task Force", title: "Acute respiratory distress syndrome: the Berlin definition", year: 2012, url: "https://jamanetwork.com/journals/jama/fullarticle/1160659" },
  },
  {
    id: "aa-gradient", slug: "aa-gradient", title: "Alveolar-Arterial O₂ Gradient", abbreviation: "A-a", type: "calculator", category: "ventilation",
    description: "A-a gradient to distinguish hypoxemia due to V/Q mismatch/shunt from hypoventilation.",
    specialties: ["Pulmonology", "Intensive Care"], keywords: ["a-a gradient", "hypoxemia", "oxygenation", "shunt", "vq mismatch"],
    formulaText: "A-a = [FiO₂ × (760 − 47) − PaCO₂/0.8] − PaO₂ (sea level)",
    inputs: [
      { id: "pao2", label: "PaO₂", unit: "mmHg", type: "number", min: 20, max: 700, step: 1, required: true },
      { id: "paco2", label: "PaCO₂", unit: "mmHg", type: "number", min: 10, max: 150, step: 1, required: true },
      { id: "fio2", label: "FiO₂", unit: "%", type: "number", min: 21, max: 100, step: 1, required: true },
      { id: "age", label: "Age (optional)", unit: "years", type: "number", min: 18, max: 100, step: 1 },
    ],
    interpretation: "Normal ≤ 15 mmHg on room air; age-adjusted ≤ 2.5 + 0.21 × age.",
    lastReviewed: "2025-06-01",
    source: { org: "Standard pulmonary physiology (West JB)", title: "Pulmonary Pathophysiology — the essentials", year: 2012 },
  },

  /* ---------------- Fluids & infusion ---------------- */
  {
    id: "holliday-segar", slug: "holliday-segar", title: "Maintenance Fluids (Holliday-Segar)", abbreviation: "HS", type: "calculator", category: "fluid",
    description: "Daily maintenance fluid requirement for children and adults (4-2-1 rule).",
    specialties: ["Pediatrics", "Intensive Care", "Anesthesiology"], keywords: ["maintenance fluids", "holliday", "segar", "4-2-1", "hydration", "pediatric"],
    formulaText: "100 mL/kg (≤10 kg) + 50 mL/kg (10–20 kg) + 20 mL/kg (>20 kg) per day",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 70, step: 0.1, required: true },
    ],
    interpretation: "Output as mL/24h and mL/hour. In hospitalised children prefer isotonic fluids with glucose per local protocol.",
    lastReviewed: "2025-06-01",
    source: { org: "Holliday MA, Segar WE", title: "The maintenance need for water in parenteral fluid therapy", year: 1957, url: "https://publications.aap.org/pediatrics/article-abstract/19/5/823/26552" },
  },
  {
    id: "fluid-deficit", slug: "fluid-deficit", title: "Fluid Deficit (Dehydration)", abbreviation: "Deficit", type: "calculator", category: "fluid",
    description: "Estimated fluid deficit from clinical dehydration percentage.",
    specialties: ["Pediatrics", "Emergency Medicine", "Internal Medicine"], keywords: ["dehydration", "fluid deficit", "rehydration", "pediatric", "diarrhea"],
    formulaText: "Deficit (mL) = % dehydration × weight(kg) × 10",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 250, step: 0.1, required: true },
      { id: "percent", label: "Clinical dehydration", unit: "%", type: "select", required: true, options: [
        { label: "No dehydration (< 3%)", value: "0" },
        { label: "Some dehydration (3–5%)", value: "5" },
        { label: "Moderate dehydration (6–9%)", value: "7.5" },
        { label: "Severe dehydration (≥ 10%)", value: "10" },
      ] },
    ],
    interpretation: "Replace deficit over 24–48 h; add maintenance and ongoing losses.",
    lastReviewed: "2025-06-01",
    source: { org: "WHO", title: "The treatment of diarrhoea — a manual for physicians (plan B/C)", year: 2005, url: "https://www.who.int/publications/i/item/9241593180" },
  },
  {
    id: "drip-rate", slug: "drip-rate", title: "Drip Rate (Drops per Minute)", abbreviation: "gtt/min", type: "calculator", category: "fluid",
    description: "Convert mL/hour infusion rate to drops per minute for gravity sets.",
    specialties: ["Nursing", "Emergency Medicine", "Intensive Care"], keywords: ["drip rate", "drops", "infusion", "gtt", "intravenous"],
    formulaText: "gtt/min = (mL/h × drop factor) / 60",
    inputs: [
      { id: "mlhr", label: "Infusion rate", unit: "mL/hour", type: "number", min: 1, max: 5000, step: 1, required: true },
      { id: "factor", label: "Drop factor", unit: "gtt/mL", type: "select", required: true, options: [
        { label: "60 (micro)", value: "60" },
        { label: "20 (blood set)", value: "20" },
        { label: "15 (standard)", value: "15" },
        { label: "10 (macro)", value: "10" },
      ] },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Standard intravenous therapy reference", title: "Intravenous infusion rate calculations", year: 2020 },
  },
  {
    id: "iv-rate", slug: "iv-rate", title: "IV Infusion Rate (Volume/Time)", abbreviation: "mL/h", type: "calculator", category: "fluid",
    description: "Required infusion rate to deliver a volume over a set time.",
    specialties: ["Nursing", "Emergency Medicine", "Intensive Care"], keywords: ["infusion", "iv rate", "volume", "time", "ml per hour"],
    formulaText: "Rate = volume ÷ time",
    inputs: [
      { id: "volume", label: "Volume", unit: "mL", type: "number", min: 10, max: 10000, step: 10, required: true },
      { id: "hours", label: "Duration", unit: "hours", type: "number", min: 0.1, max: 72, step: 0.5, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Standard intravenous therapy reference", title: "Intravenous infusion rate calculations", year: 2020 },
  },

  /* ---------------- Drug calculations ---------------- */
  {
    id: "mgkg-dose", slug: "mgkg-dose", title: "Weight-based Dose (mg/kg)", abbreviation: "mg/kg", type: "calculator", category: "drug",
    description: "Calculate a total dose from a mg/kg prescription.",
    specialties: ["Pediatrics", "Anesthesiology", "Internal Medicine"], keywords: ["mg/kg", "dose", "weight based", "dosing", "pediatric"],
    formulaText: "Dose = weight × mg/kg",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 300, step: 0.1, required: true },
      { id: "dose", label: "Dose", unit: "mg/kg", type: "number", min: 0.01, max: 200, step: 0.01, required: true },
    ],
    interpretation: "Always check the maximum single dose and daily maximum.",
    lastReviewed: "2025-06-01",
    source: { org: "Standard dosing reference", title: "Weight-based drug dose calculation", year: 2020 },
  },
  {
    id: "infusion-rate", slug: "infusion-rate", title: "Vasopressor/Infusion Rate (mcg/kg/min)", abbreviation: "mcg/kg/min", type: "calculator", category: "drug",
    description: "Calculate mL/hour to deliver a mcg/kg/min infusion from a known concentration.",
    specialties: ["Intensive Care", "Anesthesiology", "Emergency Medicine"], keywords: ["infusion", "vasopressor", "norepinephrine", "mcg/kg/min", "dopamine"],
    formulaText: "mL/h = dose(mcg/kg/min) × wt × 60 ÷ concentration(mcg/mL)",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 300, step: 0.1, required: true },
      { id: "dose", label: "Dose", unit: "mcg/kg/min", type: "number", min: 0.01, max: 200, step: 0.01, required: true },
      { id: "concentration", label: "Concentration", unit: "mg/mL", type: "number", min: 0.001, max: 100, step: 0.01, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Standard infusion reference", title: "Weight-based infusion rate calculation", year: 2020 },
  },
  {
    id: "dilution", slug: "dilution", title: "Dilution Calculator (C1V1=C2V2)", abbreviation: "Dilution", type: "calculator", category: "drug",
    description: "Calculate diluent volume needed to reach a target concentration.",
    specialties: ["Nursing", "Pediatrics", "Anesthesiology"], keywords: ["dilution", "concentration", "diluent", "reconstitution", "c1v1"],
    formulaText: "C1V1 = C2V2",
    inputs: [
      { id: "c1", label: "Stock concentration (C1)", unit: "mg/mL", type: "number", min: 0.01, max: 1000, step: 0.1, required: true },
      { id: "v1", label: "Stock volume (V1)", unit: "mL", type: "number", min: 0.1, max: 1000, step: 0.1, required: true },
      { id: "c2", label: "Target concentration (C2)", unit: "mg/mL", type: "number", min: 0.001, max: 500, step: 0.01, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Standard pharmaceutical calculation reference", title: "Dilution calculations", year: 2020 },
  },

  /* ---------------- Obstetric ---------------- */
  {
    id: "ga-edd", slug: "ga-edd", title: "Gestational Age & EDD (LMP)", abbreviation: "GA/EDD", type: "calculator", category: "obstetric",
    description: "Gestational age from last menstrual period and estimated due date (Naegele's rule).",
    specialties: ["Obstetrics & Gynecology"], keywords: ["gestational age", "edd", "due date", "pregnancy", "lmp", "naegele"],
    formulaText: "EDD = LMP + 280 days",
    inputs: [
      { id: "lmpTs", label: "First day of last menstrual period", type: "date", required: true },
    ],
    interpretation: "Ultrasound dating is more accurate in the first trimester; adjust if discrepancy > 7 days.",
    lastReviewed: "2025-06-01",
    source: { org: "Naegele FC", title: "Naegele's rule (standard obstetric dating)", year: 1812, url: "https://www.acog.org" },
  },

  /* ---------------- Pediatric ---------------- */
  {
    id: "paediatric-maint", slug: "paediatric-maint", title: "Paediatric Maintenance Fluids", abbreviation: "Peds maint", type: "calculator", category: "pediatric",
    description: "Daily maintenance fluid for children (4-2-1 rule).",
    specialties: ["Pediatrics", "Neonatology", "Intensive Care"], keywords: ["maintenance", "pediatric", "fluid", "4-2-1", "child"],
    formulaText: "100 mL/kg/day (≤10 kg) · 1000 + 50×(wt−10) mL/day (10–20 kg) · 1500 + 20×(wt−20) mL/day (>20 kg)",
    inputs: [
      { id: "weight", label: "Weight", unit: "kg", type: "number", min: 0.5, max: 70, step: 0.1, required: true },
    ],
    lastReviewed: "2025-06-01",
    source: { org: "Holliday MA, Segar WE", title: "The maintenance need for water in parenteral fluid therapy", year: 1957, url: "https://publications.aap.org/pediatrics/article-abstract/19/5/823/26552" },
  },
];

export const CALCULATORS_BY_SLUG: Record<string, CalculatorTool> = Object.fromEntries(CALCULATORS.map((c) => [c.slug, c]));