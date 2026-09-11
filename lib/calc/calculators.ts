import type { CalcResult, FormulaFn } from "@/lib/types";
import { fmt, num, round, zToPercentile } from "@/lib/calc/units";

/**
 * Formula registry. Each formula is a pure function of raw input values.
 * All clinical math lives here (separated from UI) and is unit-tested.
 */

const n = (v: Record<string, number | string | undefined>, id: string): number => num(v[id]);

function gapLine(label: string, value: number, unit: string, low: number, high: number, tone?: CalcResult["lines"][0]["tone"]): CalcResult["lines"][0] {
  const out = `${fmt(value)}${unit ? " " + unit : ""}`;
  const ref = `Reference ${low}–${high}`;
  return { label, value: out, detail: ref, tone };
}

export const FORMULAS: Record<string, FormulaFn> = {
  /* ---------------- Body measurements ---------------- */
  bmi: (v) => {
    const w = n(v, "weight");
    const h = n(v, "height");
    if (!(w > 0) || !(h > 0)) return { lines: [{ label: "Enter weight and height", value: "-" }], warnings: ["Both weight and height are required."] };
    if (h < 50 || h > 250) return { lines: [] as CalcResult["lines"], warnings: ["Height outside plausible adult range (50–250 cm)."] };
    const bmi = w / ((h / 100) ** 2);
    const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obesity";
    const tone = bmi < 18.5 || bmi >= 30 ? "warning" : bmi >= 25 ? "info" : "success";
    return {
      lines: [
        { label: "BMI", value: fmt(bmi, 1), unit: "kg/m²", tone, detail: category },
        { label: "Category", value: category, tone },
      ],
      note: "Adult WHO classification. For children and adolescents use BMI-for-age (WHO growth standards), see Pediatric Anthropometry.",
    };
  },

  bsa: (v) => {
    const w = n(v, "weight");
    const h = n(v, "height");
    if (!(w > 0) || !(h > 0)) return { lines: [{ label: "Enter weight and height", value: "-" }] };
    const mosteller = Math.sqrt((w * h) / 3600);
    const dubois = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725);
    return {
      lines: [
        { label: "BSA (Mosteller)", value: fmt(mosteller, 2), unit: "m²" },
        { label: "BSA (DuBois & DuBois)", value: fmt(dubois, 2), unit: "m²" },
      ],
      note: "Mosteller formula: √(weight(kg) × height(cm) / 3600).",
    };
  },

  ibw: (v) => {
    const w = n(v, "weight");
    const h = n(v, "height");
    const sex = String(v.sex ?? "male");
    if (!(h > 0)) return { lines: [{ label: "Enter height", value: "-" }] };
    const inches = h / 2.54;
    const base = sex === "female" ? 45.5 : 50;
    const ibw = base + 2.3 * (inches - 60);
    const lines: CalcResult["lines"] = [{ label: "Ideal body weight (Devine)", value: fmt(ibw, 1), unit: "kg" }];
    if (w > 0) {
      const adj = ibw + 0.4 * (w - ibw);
      lines.push({ label: "Adjusted body weight", value: fmt(adj, 1), unit: "kg", detail: "IBW + 0.4 × (actual − IBW)" });
      lines.push({ label: "Difference from actual", value: fmt(w - ibw, 1), unit: "kg" });
    }
    return { lines, note: "Devine formula. Adjusted body weight is used for dosing in obesity (e.g. aminoglycosides, unfractionated heparin)." };
  },

  /* ---------------- Renal ---------------- */
  egfr: (v) => {
    const scr = n(v, "creatinine");
    const age = n(v, "age");
    const sex = String(v.sex ?? "male");
    if (!(scr > 0) || !(age > 0)) return { lines: [{ label: "Enter creatinine and age", value: "-" }] };
    if (scr < 0.2 || scr > 20) return { lines: [], warnings: ["Creatinine outside plausible range (0.2–20 mg/dL)."] };
    const kappa = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.241 : -0.302;
    const ratio = scr / kappa;
    const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * (sex === "female" ? 1.012 : 1);
    const stage = egfr >= 90 ? "G1 (normal or high)" : egfr >= 60 ? "G2 (mildly decreased)" : egfr >= 45 ? "G3a (mild–moderate)" : egfr >= 30 ? "G3b (moderate–severe)" : egfr >= 15 ? "G4 (severe)" : "G5 (kidney failure)";
    return {
      lines: [
        { label: "eGFR (CKD-EPI 2021)", value: fmt(egfr, 0), unit: "mL/min/1.73 m²" },
        { label: "CKD stage", value: stage },
      ],
      note: "CKD-EPI 2021 creatinine equation (no race coefficient). Valid for adults ≥18 years. For children use the Bedside Schwartz equation.",
      warnings: egfr < 15 ? ["eGFR < 15 - nephrology referral and renal replacement planning should be considered."] : undefined,
    };
  },

  "egfr-schwartz": (v) => {
    const scr = n(v, "creatinine");
    const height = n(v, "height");
    if (!(scr > 0) || !(height > 0)) return { lines: [{ label: "Enter creatinine and height", value: "-" }] };
    const egfr = (0.413 * height) / scr;
    return {
      lines: [{ label: "eGFR (Bedside Schwartz)", value: fmt(egfr, 0), unit: "mL/min/1.73 m²" }],
      note: "Bedside Schwartz equation (2009) for children 1–16 years: 0.413 × height(cm) / creatinine(mg/dL).",
    };
  },

  "meld-na": (v) => {
    const bili = Math.max(n(v, "bilirubin"), 1);
    const inr = Math.max(n(v, "inr"), 1);
    const cr = Math.max(n(v, "creatinine"), 1);
    const na = n(v, "sodium");
    const dialysis = String(v.dialysis) === "yes";
    if (!(bili > 0) || !(inr > 0) || !(cr > 0) || !(na > 0)) return { lines: [{ label: "Enter bilirubin, INR, creatinine and sodium", value: "-" }] };
    const crEff = dialysis ? 4 : cr;
    let meld = 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(crEff) + 6.43;
    meld = Math.min(Math.max(meld, 6), 40);
    const naClamped = Math.min(Math.max(na, 120), 137);
    let meldNa = meld + 1.32 * (137 - naClamped) - 0.033 * meld * (137 - naClamped);
    meldNa = Math.round(Math.min(Math.max(meldNa, 6), 40));
    meld = Math.round(meld);
    return {
      lines: [
        { label: "MELD score", value: fmt(meld, 0), detail: "Capped 6–40" },
        { label: "MELD-Na", value: fmt(meldNa, 0), detail: `Na ${fmt(na, 0)} mEq/L (clamped 120–137)` },
      ],
      note: "UNOS 2016 MELD-Na. Creatinine set to 4.0 for dialysis. Used for liver transplant prioritisation - 3-month mortality rises steeply above MELD-Na 20–25.",
    };
  },

  crcl: (v) => {
    const scr = n(v, "creatinine");
    const age = n(v, "age");
    const weight = n(v, "weight");
    const sex = String(v.sex ?? "male");
    if (!(scr > 0) || !(age > 0) || !(weight > 0)) return { lines: [{ label: "Enter creatinine, age and weight", value: "-" }] };
    const crcl = (((140 - age) * weight) / (72 * scr)) * (sex === "female" ? 0.85 : 1);
    const category = crcl >= 90 ? "Normal" : crcl >= 60 ? "Mild decrease" : crcl >= 30 ? "Moderate decrease" : crcl >= 15 ? "Severe decrease" : "Kidney failure";
    return {
      lines: [{ label: "Creatinine clearance (Cockcroft–Gault)", value: fmt(crcl, 0), unit: "mL/min", detail: category }],
      note: "Cockcroft–Gault: ((140 − age) × weight) / (72 × Scr) × 0.85 (female). Often used for drug dose adjustment; serum creatinine in mg/dL.",
    };
  },

  /* ---------------- Electrolytes / acid-base ---------------- */
  "anion-gap": (v) => {
    const na = n(v, "sodium");
    const cl = n(v, "chloride");
    const hco3 = n(v, "bicarbonate");
    if (!(na > 0) && !(cl > 0) && !(hco3 > 0)) return { lines: [{ label: "Enter Na⁺, Cl⁻, HCO₃⁻", value: "-" }] };
    if (!(na > 0) || !(cl > 0) || !(hco3 > 0)) return { lines: [], warnings: ["Sodium, chloride and bicarbonate are all required."] };
    const gap = na - (cl + hco3);
    const tone = gap > 12 ? "warning" : "success";
    return {
      lines: [gapLine("Anion gap", gap, "mEq/L", 8, 12, tone)],
      note: "Normal 8–12 mEq/L (classic); with newer ion-selective methods 3–11 mEq/L. High gap: consider ketoacidosis, lactic acidosis, renal failure, toxins (methanol, ethylene glycol, salicylates, paraldehyde).",
    };
  },

  "corrected-calcium": (v) => {
    const ca = n(v, "calcium");
    const alb = n(v, "albumin");
    if (!(ca > 0) || !(alb > 0)) return { lines: [{ label: "Enter calcium and albumin", value: "-" }] };
    const corr = ca + 0.8 * (4 - alb);
    return {
      lines: [
        { label: "Corrected calcium", value: fmt(corr, 1), unit: "mg/dL", detail: `Ca ${fmt(ca, 1)} + 0.8 × (4 − albumin ${fmt(alb, 1)})` },
        { label: "Ionized calcium (estimate)", value: fmt(corr / 2, 1), unit: "mmol/L" },
      ],
      note: "Payne correction for hypoalbuminemia. Correction is unreliable in critical illness; ionized calcium is preferred when available.",
      warnings: corr < 7 || corr > 13 ? ["Corrected calcium far outside normal range (8.5–10.5 mg/dL) - recheck and correlate clinically."] : undefined,
    };
  },

  "corrected-sodium": (v) => {
    const na = n(v, "sodium");
    const glu = n(v, "glucose");
    if (!(na > 0) || !(glu > 0)) return { lines: [{ label: "Enter sodium and glucose", value: "-" }] };
    const corr = na + 1.6 * ((glu - 100) / 100);
    const corr24 = na + 2.4 * ((glu - 100) / 100);
    return {
      lines: [
        { label: "Corrected sodium (Katz 1.6)", value: fmt(corr, 1), unit: "mEq/L" },
        { label: "Corrected sodium (Hillier 2.4)", value: fmt(corr24, 1), unit: "mEq/L" },
      ],
      note: "Corrects measured Na⁺ for hyperglycemia. Katz: +1.6 mEq/L per 100 mg/dL glucose above 100. Hillier (2.4) better reflects post-treatment sodium in severe hyperglycemia.",
    };
  },

  osmolality: (v) => {
    const na = n(v, "sodium");
    const glu = n(v, "glucose");
    const bun = n(v, "bun");
    if (!(na > 0)) return { lines: [{ label: "Enter sodium (and glucose/BUN if available)", value: "-" }] };
    const osm = 2 * na + (glu > 0 ? glu / 18 : 0) + (bun > 0 ? bun / 2.8 : 0);
    const lines: CalcResult["lines"] = [{ label: "Calculated serum osmolality", value: fmt(osm, 0), unit: "mOsm/kg H₂O", detail: "Reference 275–295" }];
    if (!(glu > 0) || !(bun > 0)) lines.push({ label: "Note", value: "Glucose/BUN omitted", detail: "Add glucose and BUN for a complete calculation" });
    return { lines };
  },

  "osmolar-gap": (v) => {
    const measured = n(v, "measured");
    const na = n(v, "sodium");
    const glu = n(v, "glucose");
    const bun = n(v, "bun");
    if (!(measured > 0) || !(na > 0)) return { lines: [{ label: "Enter measured osmolality and sodium", value: "-" }] };
    const calcOsm = 2 * na + (glu > 0 ? glu / 18 : 0) + (bun > 0 ? bun / 2.8 : 0);
    const gap = measured - calcOsm;
    return {
      lines: [
        { label: "Osmolar gap", value: fmt(gap, 0), unit: "mOsm/kg H₂O", tone: gap > 10 ? "warning" : "success", detail: "Normal < 10" },
        { label: "Calculated osmolality", value: fmt(calcOsm, 0), unit: "mOsm/kg H₂O" },
      ],
      note: "Elevated osmolar gap (>10) suggests unmeasured solutes: methanol, ethylene glycol, isopropanol, propylene glycol, ethanol.",
      warnings: gap > 10 ? ["Elevated osmolar gap - consider toxic alcohol exposure and urgent toxicology assessment."] : undefined,
    };
  },

  "free-water-deficit": (v) => {
    const na = n(v, "sodium");
    const weight = n(v, "weight");
    const sex = String(v.sex ?? "male");
    if (!(na > 0) || !(weight > 0)) return { lines: [{ label: "Enter sodium and weight", value: "-" }] };
    const tbv = weight * (sex === "female" ? 0.5 : 0.6);
    const deficit = ((na - 140) / 140) * tbv;
    return {
      lines: [
        { label: "Free water deficit", value: fmt(Math.max(deficit, 0), 0), unit: "L", detail: `Total body water ${fmt(tbv, 1)} L (${sex === "female" ? "50" : "60"}%)` },
      ],
      note: "Deficit = (Na − 140)/140 × TBW. Treat hypernatremia slowly (<10–12 mEq/L per 24 h); replace only part of the deficit in the first 24 h and recheck sodium frequently.",
      warnings: na > 160 ? ["Severe hypernatremia - correction must be slow and monitored; consider ICU."] : undefined,
    };
  },

  bicarb: (v) => {
    const hco3 = n(v, "bicarbonate");
    const weight = n(v, "weight");
    if (!(hco3 > 0) || !(weight > 0)) return { lines: [{ label: "Enter bicarbonate and weight", value: "-" }] };
    const deficit = 0.3 * weight * (24 - hco3);
    return {
      lines: [{ label: "Bicarbonate deficit (NaHCO₃)", value: fmt(deficit, 0), unit: "mEq", detail: "0.3 × weight × (24 − HCO₃)" }],
      note: "Give 50% of the calculated deficit, then reassess. Bicarbonate therapy in DKA/ketoacidosis is generally not recommended unless pH < 6.9–7.0.",
    };
  },

  /* ---------------- Cardiovascular / respiratory ---------------- */
  map: (v) => {
    const sbp = n(v, "sbp");
    const dbp = n(v, "dbp");
    if (!(sbp > 0) || !(dbp > 0)) return { lines: [{ label: "Enter systolic and diastolic BP", value: "-" }] };
    const map = (sbp + 2 * dbp) / 3;
    return {
      lines: [
        { label: "Mean arterial pressure", value: fmt(map, 0), unit: "mmHg", detail: "Target ≥ 65 mmHg in most critically ill adults" },
      ],
      note: "MAP = (SBP + 2 × DBP)/3.",
      warnings: map < 65 ? ["MAP < 65 mmHg - assess perfusion and consider vasopressor support."] : undefined,
    };
  },

  "shock-index": (v) => {
    const hr = n(v, "hr");
    const sbp = n(v, "sbp");
    if (!(hr > 0) || !(sbp > 0)) return { lines: [{ label: "Enter heart rate and systolic BP", value: "-" }] };
    const si = hr / sbp;
    const note = si >= 1 ? "Shock index ≥ 1.0 - consider early aggressive resuscitation" : si >= 0.7 ? "Elevated - monitor closely" : "Normal";
    return {
      lines: [{ label: "Shock index", value: fmt(si, 2), detail: note, tone: si >= 1 ? "danger" : si >= 0.7 ? "warning" : "success" }],
      note: "Shock index = HR/SBP. SI ≥ 0.7–1.0 is associated with increased transfusion requirements and mortality in trauma and sepsis.",
    };
  },

  qtc: (v) => {
    const qt = n(v, "qt");
    const hr = n(v, "hr");
    if (!(qt > 0) || !(hr > 0)) return { lines: [{ label: "Enter QT interval and heart rate", value: "-" }] };
    const rr = 60 / hr;
    const bazett = qt / Math.sqrt(rr);
    const fridericia = qt / Math.cbrt(rr);
    const long = bazett > 450;
    return {
      lines: [
        { label: "QTc (Bazett)", value: fmt(bazett, 0), unit: "ms", tone: long ? "warning" : "success" },
        { label: "QTc (Fridericia)", value: fmt(fridericia, 0), unit: "ms" },
      ],
      note: "Bazett: QT/√RR. Prolonged QTc: men >450 ms, women >460 ms. Fridericia is preferred when heart rate is fast or irregular.",
      warnings: long ? ["Prolonged QTc - review QT-prolonging drugs and electrolytes (K⁺, Mg²⁺, Ca²⁺)."] : undefined,
    };
  },

  "pf-ratio": (v) => {
    const pao2 = n(v, "pao2");
    const fio2 = n(v, "fio2");
    if (!(pao2 > 0) || !(fio2 > 0)) return { lines: [{ label: "Enter PaO₂ and FiO₂", value: "-" }] };
    const pf = pao2 / (fio2 / 100);
    const grade = pf >= 300 ? "Normal/mild" : pf >= 200 ? "Moderate hypoxemia (ARDS mild)" : pf >= 100 ? "Severe hypoxemia (ARDS moderate)" : "Critical hypoxemia (ARDS severe)";
    return {
      lines: [{ label: "PaO₂/FiO₂ ratio", value: fmt(pf, 0), detail: grade, tone: pf < 200 ? "warning" : pf < 300 ? "info" : "success" }],
      note: "Berlin ARDS criteria: mild 200–300, moderate 100–200, severe <100 (with PEEP ≥5 cmH₂O).",
    };
  },

  "aa-gradient": (v) => {
    const pao2 = n(v, "pao2");
    const paco2 = n(v, "paco2");
    const fio2 = n(v, "fio2");
    const age = n(v, "age");
    if (!(pao2 > 0) || !(paco2 > 0) || !(fio2 > 0)) return { lines: [{ label: "Enter PaO₂, PaCO₂ and FiO₂", value: "-" }] };
    const paiO2 = (fio2 / 100) * (760 - 47) - paco2 / 0.8;
    const grad = paiO2 - pao2;
    const maxExpected = age > 0 ? 2.5 + 0.21 * age : 15;
    return {
      lines: [
        { label: "A-a gradient", value: fmt(grad, 0), unit: "mmHg", detail: age > 0 ? `Expected ≤ ${fmt(maxExpected, 0)} at age ${age}` : "Expected ≤ 15 on room air" },
        { label: "Alveolar PO₂", value: fmt(paiO2, 0), unit: "mmHg" },
      ],
      note: "PAO₂ = FiO₂ × (760 − 47) − PaCO₂/0.8 (sea level). Widened gradient suggests V/Q mismatch, shunt, or diffusion impairment.",
    };
  },

  /* ---------------- Fluids ---------------- */
  "holliday-segar": (v) => {
    const w = n(v, "weight");
    if (!(w > 0)) return { lines: [{ label: "Enter weight", value: "-" }] };
    if (w > 70) return { lines: [], warnings: ["Holliday–Segar is validated up to ~70 kg; consider individualized fluid prescription above this."] };
    const perDay = w <= 10 ? w * 100 : w <= 20 ? 1000 + (w - 10) * 50 : 1500 + (w - 20) * 20;
    const perHour = perDay / 24;
    return {
      lines: [
        { label: "Maintenance fluid", value: fmt(perDay, 0), unit: "mL/24h" },
        { label: "Infusion rate", value: fmt(perHour, 0), unit: "mL/hour" },
      ],
      note: "Holliday–Segar: 100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg thereafter. Reassess in illness - use isotonic fluids with added glucose per local protocol.",
    };
  },

  "fluid-deficit": (v) => {
    const w = n(v, "weight");
    const pct = n(v, "percent");
    if (!(w > 0) || !(pct > 0)) return { lines: [{ label: "Enter weight and dehydration %", value: "-" }] };
    if (pct < 1 || pct > 15) return { lines: [], warnings: ["Dehydration percentage should be 1–15%. Clinical estimate of dehydration is unreliable >15%."] };
    const deficit = (pct / 100) * w * 1000;
    return {
      lines: [
        { label: "Fluid deficit", value: fmt(deficit, 0), unit: "mL", detail: `${fmt(pct, 0)}% × ${fmt(w, 1)} kg` },
      ],
      note: "Deficit (mL) = % dehydration × weight(kg) × 10. Replace deficit over 24–48 h depending on severity; add maintenance and ongoing losses.",
    };
  },

  "drip-rate": (v) => {
    const mlhr = n(v, "mlhr");
    const factor = n(v, "factor");
    if (!(mlhr > 0) || !(factor > 0)) return { lines: [{ label: "Enter rate (mL/h) and drop factor", value: "-" }] };
    const gtt = (mlhr * factor) / 60;
    return {
      lines: [
        { label: "Drip rate", value: fmt(gtt, 0), unit: "drops/min", detail: `${fmt(mlhr, 0)} mL/h × ${fmt(factor, 0)} gtt/mL ÷ 60` },
        { label: "Volume per 24 h", value: fmt(mlhr * 24, 0), unit: "mL" },
      ],
      note: "Common drop factors: macro 20 gtt/mL (blood), 15 gtt/mL (standard), micro 60 gtt/mL (1 mL/h = 1 gtt/min).",
    };
  },

  "iv-rate": (v) => {
    const volume = n(v, "volume");
    const hours = n(v, "hours");
    if (!(volume > 0) || !(hours > 0)) return { lines: [{ label: "Enter volume and time", value: "-" }] };
    return {
      lines: [
        { label: "Infusion rate", value: fmt(volume / hours, 0), unit: "mL/hour" },
        { label: "Duration", value: `${fmt(hours, 1)} hours` },
      ],
      note: "Rate = volume ÷ time. Verify with the drip-rate calculator for gravity infusions.",
    };
  },

  /* ---------------- Drug calculations ---------------- */
  "mgkg-dose": (v) => {
    const w = n(v, "weight");
    const dose = n(v, "dose");
    if (!(w > 0) || !(dose > 0)) return { lines: [{ label: "Enter weight and dose (mg/kg)", value: "-" }] };
    const total = w * dose;
    return {
      lines: [
        { label: "Total dose", value: fmt(total, 1), unit: "mg", detail: `${fmt(w, 1)} kg × ${fmt(dose, 1)} mg/kg` },
      ],
      note: "Always check the maximum single dose and daily maximum for the specific drug.",
    };
  },

  "infusion-rate": (v) => {
    const w = n(v, "weight");
    const dose = n(v, "dose"); // mcg/kg/min
    const conc = n(v, "concentration"); // mg/mL
    if (!(w > 0) || !(dose > 0) || !(conc > 0)) return { lines: [{ label: "Enter weight, dose (mcg/kg/min) and concentration (mg/mL)", value: "-" }] };
    const mlhr = (dose * w * 60) / (conc * 1000);
    return {
      lines: [
        { label: "Infusion rate", value: fmt(mlhr, 1), unit: "mL/hour", detail: `${fmt(dose, 1)} mcg/kg/min × ${fmt(w, 1)} kg × 60 ÷ (${fmt(conc, 1)} mg/mL × 1000)` },
        { label: "Dose delivered", value: fmt(dose * w * 60, 1), unit: "mg/hour" },
      ],
      note: "mL/h = dose(mcg/kg/min) × weight(kg) × 60 ÷ concentration(mcg/mL).",
    };
  },

  dilution: (v) => {
    const c1 = n(v, "c1");
    const v1 = n(v, "v1");
    const c2 = n(v, "c2");
    if (!(c1 > 0) || !(v1 > 0) || !(c2 > 0)) return { lines: [{ label: "Enter stock concentration, volume and target concentration", value: "-" }] };
    if (c2 >= c1) return { lines: [], warnings: ["Target concentration must be lower than the stock concentration."] };
    const v2 = (c1 * v1) / c2;
    const add = v2 - v1;
    return {
      lines: [
        { label: "Final volume", value: fmt(v2, 0), unit: "mL" },
        { label: "Diluent to add", value: fmt(add, 0), unit: "mL", detail: `C1V1 = C2V2` },
      ],
      note: "C1V1 = C2V2. Check drug compatibility before adding diluent.",
    };
  },

  /* ---------------- Obstetric ---------------- */
  "ga-edd": (v) => {
    const raw = v.lmpTs;
    const lmp = typeof raw === "number" ? raw : typeof raw === "string" && raw ? new Date(raw).getTime() : NaN;
    if (!(lmp > 0) || Number.isNaN(lmp)) return { lines: [{ label: "Enter LMP date", value: "-" }] };
    const lmpDate = new Date(lmp);
    const today = new Date();
    const gaDays = Math.floor((today.getTime() - lmpDate.getTime()) / 86400000);
    const gaWeeks = Math.floor(gaDays / 7);
    const gaDaysRem = gaDays % 7;
    const edd = new Date(lmpDate.getTime() + 280 * 86400000);
    const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
    return {
      lines: [
        { label: "Gestational age", value: `${gaWeeks}+${gaDaysRem}`, unit: "weeks", detail: `${gaDays} days` },
        { label: "Estimated due date", value: fmtDate(edd) },
      ],
      note: "Naegele's rule: EDD = LMP + 280 days. Ultrasound dating is more accurate in early pregnancy; adjust if discrepancy > 7 days.",
      warnings: gaDays < 0 ? ["LMP date is in the future - check the date entered."] : undefined,
    };
  },

  /* ---------------- Pediatric ---------------- */
  "paediatric-maint": (v) => {
    const w = n(v, "weight");
    if (!(w > 0)) return { lines: [{ label: "Enter weight", value: "-" }] };
    const perDay = w <= 10 ? w * 100 : w <= 20 ? 1000 + (w - 10) * 50 : 1500 + (w - 20) * 20;
    return {
      lines: [
        { label: "Maintenance fluid", value: fmt(perDay, 0), unit: "mL/24h" },
        { label: "Infusion rate", value: fmt(perDay / 24, 0), unit: "mL/hour" },
      ],
      note: "Holliday–Segar (4-2-1 rule). For children <10 kg use 100 mL/kg/day.",
    };
  },
};

export const CALCULATOR_CATEGORIES: { key: string; label: string }[] = [
  { key: "body", label: "Pengukuran Tubuh" },
  { key: "renal", label: "Ginjal" },
  { key: "electrolyte", label: "Asam-Basa dan Elektrolit" },
  { key: "cardio", label: "Kardiovaskular" },
  { key: "ventilation", label: "Ventilasi dan Oksigenasi" },
  { key: "fluid", label: "Cairan dan Infus" },
  { key: "drug", label: "Perhitungan Obat" },
  { key: "obstetric", label: "Obstetri" },
  { key: "pediatric", label: "Pediatri" },
];

export function zToPct(z: number): number {
  return zToPercentile(z);
}

/** Dispatch a calculator tool definition to its registered formula. */
export function runCalculator(tool: { slug: string }, values: Record<string, number | string | undefined>): CalcResult {
  const fn = FORMULAS[tool.slug];
  if (!fn) return { lines: [{ label: "Formula belum tersedia", value: "-" }], warnings: [`Formula untuk ${tool.slug} belum tersedia.`] };
  return fn(values);
}
