import type { Drug } from "@/lib/types";
import { EXTRA_DRUGS } from "./drugs-extra";
import { EXTRA_DRUGS_B } from "./drugs-extra-b";
import { EXTRA_DRUGS_C } from "./drugs-extra-c";
import { EXTRA_DRUGS_D } from "./drugs-extra-d";
import { EXTRA_DRUGS_E } from "./drugs-extra-e";
import { EXTRA_DRUGS_F } from "./drugs-extra-f";
import { EXTRA_DRUGS_G } from "./drugs-extra-g";
import { EXTRA_DRUGS_H } from "./drugs-extra-h";
import { EXTRA_DRUGS_I } from "./drugs-extra-i";
import { EXTRA_DRUGS_J } from "./drugs-extra-j";
import { EXTRA_DRUGS_K } from "./drugs-extra-k";
import { EXTRA_DRUGS_L } from "./drugs-extra-l";

/**
 * Drug dosing database.
 *
 * Doses are standard published doses (WHO Model List of Essential Medicines,
 * national formularies, IDSA/WHO guidance) — never invented. Where reliable
 * dosing is not available the field is simply omitted and marked unavailable.
 * Weight-based schemas power the dose calculator; text entries document fixed,
 * band-based or infusion dosing.
 */

const WHO_EML: Drug["source"] = { org: "WHO", title: "Model List of Essential Medicines", year: 2023, url: "https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines" };

export const DRUGS: Drug[] = [
  /* ---------- Analgesics / antipyretics ---------- */
  {
    id: "paracetamol", slug: "paracetamol", genericName: "Paracetamol (Acetaminophen)", brandNames: ["Panadol", "Sanmol", "Tempra"],
    drugClass: "Analgesic / antipyretic", specialties: ["Pediatrics", "Internal Medicine", "Emergency Medicine"], keywords: ["paracetamol", "acetaminophen", "fever", "pain", "panadol", "sanmol"],
    indications: ["Fever", "Mild-moderate pain", "First-line antipyretic in children"],
    doses: [
      {
        population: "all", route: "PO / PR", indication: "Fever & pain",
        text: "Adults: 500–1000 mg q4–6h (max 4 g/day, 3 g/day if chronic liver disease or elderly). Children: 10–15 mg/kg/dose q4–6h (max 5 doses/day; max 75 mg/kg/day, not exceeding 4 g/day). Neonates: 10–15 mg/kg/dose q6–8h.",
        weightBased: { min: 10, max: 15, per: "dose", frequencyPerDay: 4, maxPerDoseMg: 1000, maxDailyMg: 4000, maxText: "Maximum 5 doses in 24 h; do not exceed 4 g/day (adults) or 75 mg/kg/day (children).", note: "Use weight-based dose in children; syrup concentration 120 mg/5 mL or 250 mg/5 mL — check preparation." },
      },
    ],
    contraindications: ["Severe hepatic impairment"], majorWarnings: ["Hepatotoxicity in overdose — treat with N-acetylcysteine within 8–10 h of ingestion."],
    renalConsideration: "Reduce interval to q8h in severe renal impairment (CrCl < 10).", preparations: ["Tablet 500 mg", "Syrup 120 mg/5 mL, 250 mg/5 mL", "Suppository 125/250 mg", "IV 10 mg/mL"],
    pregnancy: "Generally safe in therapeutic doses.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ibuprofen", slug: "ibuprofen", genericName: "Ibuprofen", brandNames: ["Brufen", "Proris", "Fenris"],
    drugClass: "NSAID", specialties: ["Pediatrics", "Internal Medicine", "Rheumatology"], keywords: ["ibuprofen", "nsaid", "pain", "fever", "antiinflammatory", "brufen"],
    indications: ["Fever", "Pain", "Inflammatory conditions"],
    doses: [
      {
        population: "all", route: "PO", indication: "Fever & pain",
        text: "Adults: 200–400 mg q6–8h (max 1.2 g OTC; up to 3.2 g/day Rx). Children ≥ 3 months: 5–10 mg/kg/dose q6–8h (max 40 mg/kg/day; max single dose 400 mg).",
        weightBased: { min: 5, max: 10, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 400, maxText: "Maximum 40 mg/kg/day in children (max 2.4 g/day); adults max 3.2 g/day.", note: "Take with food; avoid in dehydration." },
      },
    ],
    contraindications: ["Active peptic ulcer / GI bleeding", "Severe renal impairment", "Aspirin/NSAID allergy", "After cardiac surgery"],
    majorWarnings: ["GI bleeding risk", "Renal impairment in dehydration", "Avoid in dengue (bleeding risk)"],
    pregnancy: "Avoid in third trimester.", preparations: ["Tablet 200/400 mg", "Syrup 100 mg/5 mL", "Suppository 125 mg"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "morphine", slug: "morphine", genericName: "Morphine sulfate", brandNames: ["Morphin"],
    drugClass: "Opioid analgesic", specialties: ["Anesthesiology", "Palliative Care", "Emergency Medicine", "Oncology"], keywords: ["morphine", "opioid", "pain", "palliative", "analgesia"],
    indications: ["Moderate-severe pain", "Acute myocardial infarction pain", "Palliative care"],
    doses: [
      {
        population: "adult", route: "IV / SC", indication: "Severe acute pain",
        text: "2.5–10 mg IV/SC q2–4h titrated to effect; elderly/hepatic: reduce dose.",
        weightBased: { min: 0.05, max: 0.1, per: "dose", frequencyPerDay: 6, maxPerDoseMg: 10, note: "Titrate in 1–2 mg increments in the frail elderly." },
      },
      {
        population: "pediatric", route: "IV / PO", indication: "Severe pain",
        text: "IV: 0.05–0.1 mg/kg/dose q2–4h (max 10 mg). PO (immediate release): 0.2–0.5 mg/kg/dose q4h.",
        weightBased: { min: 0.05, max: 0.1, per: "dose", frequencyPerDay: 6, maxPerDoseMg: 10 },
      },
    ],
    contraindications: ["Respiratory depression", "Paralytic ileus"], majorWarnings: ["Respiratory depression — monitor sedation and respiratory rate; naloxone available."],
    renalConsideration: "Active metabolite accumulates — reduce dose in renal impairment.", preparations: ["Ampoule 10 mg/mL", "Tablet 10 mg", "Syrup 10 mg/5 mL"],
    pregnancy: "Use only if clearly needed (neonatal withdrawal risk with chronic use).", lactation: "Short-term use generally compatible.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ketamine", slug: "ketamine", genericName: "Ketamine", brandNames: ["Ketalar"],
    drugClass: "Dissociative anaesthetic / analgesic", specialties: ["Anesthesiology", "Emergency Medicine", "Pediatrics"], keywords: ["ketamine", "dissociative", "sedation", "analgesia", "induction"],
    indications: ["Procedural sedation", "Anaesthesia induction", "Analgesia (low dose)", "RSI in haemodynamic instability"],
    doses: [
      {
        population: "all", route: "IV / IM", indication: "Dissociative sedation",
        text: "IV: 1–2 mg/kg over 60 s (adult and child). IM: 4–5 mg/kg. Add atropine/glycopyrrolate for hypersalivation in children.",
        weightBased: { min: 1, max: 2, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 150, note: "Low-dose analgesia 0.1–0.3 mg/kg IV." },
      },
    ],
    contraindications: ["Schizophrenia/psychosis (relative)", "Severe uncontrolled hypertension", "Raised ICP (relative)"],
    majorWarnings: ["Emergence reactions", "Hypertension and tachycardia", "Laryngospasm risk"],
    preparations: ["Ampoule 10 mg/mL, 50 mg/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "tramadol", slug: "tramadol", genericName: "Tramadol", brandNames: ["Tramal", "Ultram"],
    drugClass: "Opioid analgesic (weak)", specialties: ["Anesthesiology", "Internal Medicine", "Orthopedics"], keywords: ["tramadol", "opioid", "pain", "analgesic"],
    indications: ["Moderate pain"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Moderate pain",
        text: "50–100 mg q6–8h (max 400 mg/day). Reduce dose in elderly and renal/hepatic impairment.",
        weightBased: { min: 1, max: 2, per: "dose", frequencyPerDay: 4, maxDailyMg: 400, note: "Children ≥ 12 years: 50–100 mg q6–8h; not recommended < 12 years." },
      },
    ],
    contraindications: ["MAO inhibitors", "Uncontrolled epilepsy", "Opioid dependence"],
    majorWarnings: ["Seizure risk", "Serotonin syndrome with SSRIs/SNRIs", "Respiratory depression"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Antibiotics ---------- */
  {
    id: "amoxicillin", slug: "amoxicillin", genericName: "Amoxicillin", brandNames: ["Amoxsan", "Hufamox"],
    drugClass: "Aminopenicillin", specialties: ["Pediatrics", "Internal Medicine", "ENT", "Infectious Disease"], keywords: ["amoxicillin", "penicillin", "antibiotic", "otitis media", "pneumonia"],
    indications: ["Community-acquired pneumonia", "Acute otitis media", "Streptococcal pharyngitis", "UTI (sensitive strains)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "General infections",
        text: "250–500 mg q8h (or 875 mg q12h); severe infections up to 1 g q8h.",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxDailyMg: 4000, note: "Severe infections 1 g q8h." },
      },
      {
        population: "pediatric", route: "PO", indication: "Standard dose",
        text: "20–40 mg/kg/day divided q8h (max 500 mg/dose); high dose for otitis media/pneumonia: 80–90 mg/kg/day divided q12h (max 4 g/day).",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxDailyMg: 4000, maxText: "High-dose regimen (80–90 mg/kg/day q12h) for AOM and pneumonia.", note: "Example: 18 kg child → 20–40 mg/kg/day = 360–720 mg/day ÷ 3 = 120–240 mg q8h." },
      },
      {
        population: "neonatal", route: "PO / IV", indication: "Neonatal infections",
        text: "25–50 mg/kg/day divided q12h (first week of life) — per neonatal formulary.",
        weightBased: { min: 25, max: 50, per: "day", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Penicillin allergy (anaphylaxis)"], majorWarnings: ["Anaphylaxis risk in penicillin allergy — cross-reaction with cephalosporins ~1-2%."],
    renalConsideration: "CrCl < 30 mL/min: increase interval (e.g. q12h → q24h).", preparations: ["Capsule 250/500 mg", "Syrup 125/250 mg per 5 mL", "IV 500 mg/1 g"],
    pregnancy: "Safe (category B).", lactation: "Compatible.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "amoxicillin-clavulanate", slug: "amoxicillin-clavulanate", genericName: "Amoxicillin-clavulanate (Co-amoxiclav)", brandNames: ["Augmentin"],
    drugClass: "Aminopenicillin + β-lactamase inhibitor", specialties: ["Pediatrics", "Internal Medicine", "ENT", "Infectious Disease"], keywords: ["co-amoxiclav", "augmentin", "amoxicillin", "clavulanate", "antibiotic"],
    indications: ["Community-acquired pneumonia", "Acute otitis media", "Sinusitis", "Animal/human bite infections", "UTI (ESBL-risk)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "General infections",
        text: "625 mg (500/125) q8h or 1 g (875/125) q12h. Severe: IV 1.2 g q8h.",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxPerDoseMg: 875, note: "Doses quoted for the amoxicillin component." },
      },
      {
        population: "pediatric", route: "PO", indication: "Standard dose",
        text: "20–40 mg/kg/day (amoxicillin component) divided q8h; high dose (AOM/sinusitis): 80–90 mg/kg/day divided q12h.",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxPerDoseMg: 875, maxText: "High-dose: 80–90 mg/kg/day of amoxicillin component.", note: "Example: 18 kg child → 40 mg/kg/day = 720 mg/day ÷ 3 = 240 mg q8h." },
      },
    ],
    contraindications: ["Penicillin allergy"], majorWarnings: ["Hepatotoxicity (especially elderly, prolonged use)", "Diarrhoea — C. difficile risk"],
    renalConsideration: "CrCl < 30: extend interval.", preparations: ["Tablet 625 mg (500/125), 1 g (875/125)", "Syrup 156.25 mg/5 mL (125/31.25)", "IV 1.2 g"],
    pregnancy: "Safe.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ampicillin", slug: "ampicillin", genericName: "Ampicillin", brandNames: ["Ampicin"],
    drugClass: "Aminopenicillin", specialties: ["Infectious Disease", "Neonatology", "Internal Medicine"], keywords: ["ampicillin", "penicillin", "neonatal", "meningitis", "listeria"],
    indications: ["Listeria meningitis", "Neonatal sepsis (with gentamicin)", "Enterococcal infections", "UTI"],
    doses: [
      {
        population: "adult", route: "IV / IM", indication: "Severe infections",
        text: "1–2 g IV q4–6h (meningitis: 2 g q4h).",
        weightBased: { min: 25, max: 50, per: "dose", frequencyPerDay: 4, maxPerDoseMg: 2000 },
      },
      {
        population: "pediatric", route: "IV / IM", indication: "Severe infections",
        text: "25–50 mg/kg/dose IV q6h; meningitis up to 100 mg/kg/dose q6h (max 2 g/dose).",
        weightBased: { min: 25, max: 50, per: "dose", frequencyPerDay: 4, maxPerDoseMg: 2000, note: "Meningitis: 100 mg/kg/dose q6h." },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal sepsis",
        text: "50 mg/kg/dose IV — q12h (< 7 days, < 2 kg), q8h (< 7 days, ≥ 2 kg), q8h (7–28 days, < 2 kg), q6h (7–28 days, ≥ 2 kg).",
        weightBased: { min: 50, max: 50, per: "dose", frequencyPerDay: 2, note: "Interval per gestational/postnatal age (see text)." },
      },
    ],
    contraindications: ["Penicillin allergy"], majorWarnings: ["Rash in EBV infection (amoxicillin more common)"],
    preparations: ["IV/IM 500 mg, 1 g"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ceftriaxone", slug: "ceftriaxone", genericName: "Ceftriaxone", brandNames: ["Rocephin", "Cefri"],
    drugClass: "Third-generation cephalosporin", specialties: ["Infectious Disease", "Pediatrics", "Emergency Medicine"], keywords: ["ceftriaxone", "cephalosporin", "meningitis", "sepsis", "typhoid"],
    indications: ["Community-acquired pneumonia", "Meningitis", "Typhoid fever", "Severe infections", "Gonorrhoea"],
    doses: [
      {
        population: "adult", route: "IV / IM", indication: "Severe infections",
        text: "1–2 g IV once daily (meningitis: 2 g q12h).",
        weightBased: { min: 50, max: 75, per: "day", frequencyPerDay: 1, maxDailyMg: 2000, note: "Meningitis: 2 g q12h." },
      },
      {
        population: "pediatric", route: "IV / IM", indication: "Severe infections",
        text: "50–75 mg/kg/day IV once daily (max 2 g/day). Meningitis: 100 mg/kg/day divided q12h (max 4 g/day).",
        weightBased: { min: 50, max: 75, per: "day", frequencyPerDay: 1, maxDailyMg: 2000, note: "Meningitis: 100 mg/kg/day ÷ q12h." },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal sepsis",
        text: "50 mg/kg/day IV once daily — use with caution (bilirubin displacement); alternatives preferred in jaundiced neonates.",
        weightBased: { min: 50, max: 50, per: "day", frequencyPerDay: 1 },
      },
    ],
    contraindications: ["Ceftriaxone allergy", "Neonates with hyperbilirubinaemia", "Concomitant IV calcium in neonates"],
    majorWarnings: ["Biliary sludging", "Do not mix with calcium-containing IV solutions in neonates"],
    renalConsideration: "No routine adjustment; reduce in severe renal impairment with hepatic dysfunction.", preparations: ["IV/IM 1 g", "IV 250 mg"],
    pregnancy: "Safe.", lactation: "Compatible.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "cefotaxime", slug: "cefotaxime", genericName: "Cefotaxime", brandNames: ["Claforan"],
    drugClass: "Third-generation cephalosporin", specialties: ["Infectious Disease", "Neonatology", "Pediatrics"], keywords: ["cefotaxime", "cephalosporin", "neonatal", "meningitis"],
    indications: ["Neonatal sepsis", "Meningitis", "Severe infections"],
    doses: [
      {
        population: "adult", route: "IV / IM", indication: "Severe infections",
        text: "1–2 g IV q8h (meningitis: 2 g q4–6h).",
        weightBased: { min: 50, max: 50, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "pediatric", route: "IV", indication: "Severe infections",
        text: "50 mg/kg/dose IV q8h (meningitis 50 mg/kg q6h; max 2 g/dose).",
        weightBased: { min: 50, max: 50, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal sepsis",
        text: "50 mg/kg/dose IV — q12h (< 7 days), q8h (≥ 7 days).",
        weightBased: { min: 50, max: 50, per: "dose", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Cephalosporin allergy"], preparations: ["IV 500 mg, 1 g"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ceftazidime", slug: "ceftazidime", genericName: "Ceftazidime", brandNames: ["Fortum"],
    drugClass: "Third-generation cephalosporin (antipseudomonal)", specialties: ["Infectious Disease", "Intensive Care"], keywords: ["ceftazidime", "pseudomonas", "cephalosporin"],
    indications: ["Pseudomonas aeruginosa infections", "Febrile neutropenia (combination)", "Severe nosocomial infections"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Severe infections",
        text: "1–2 g IV q8h (Pseudomonas: 2 g q8h).",
        weightBased: { min: 30, max: 50, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "pediatric", route: "IV", indication: "Severe infections",
        text: "30–50 mg/kg/dose IV q8h (max 2 g/dose).",
        weightBased: { min: 30, max: 50, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal infections",
        text: "30 mg/kg/dose IV q12h (first week), q8h thereafter.",
        weightBased: { min: 30, max: 30, per: "dose", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Cephalosporin allergy"], renalConsideration: "CrCl < 50: reduce dose/interval.", preparations: ["IV 1 g, 2 g"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "cefixime", slug: "cefixime", genericName: "Cefixime", brandNames: ["Cefix", "Suprax"],
    drugClass: "Third-generation cephalosporin (oral)", specialties: ["Infectious Disease", "Pediatrics", "Urology"], keywords: ["cefixime", "cephalosporin", "gonorrhea", "typhoid"],
    indications: ["Gonorrhoea (uncomplicated)", "Typhoid fever", "UTI", "Acute otitis media"],
    doses: [
      {
        population: "adult", route: "PO", indication: "General infections",
        text: "400 mg once daily.",
        weightBased: { min: 8, max: 8, per: "day", frequencyPerDay: 1, maxDailyMg: 400 },
      },
      {
        population: "pediatric", route: "PO", indication: "General infections",
        text: "8 mg/kg/day once daily (max 400 mg/day).",
        weightBased: { min: 8, max: 8, per: "day", frequencyPerDay: 1, maxDailyMg: 400 },
      },
    ],
    contraindications: ["Cephalosporin allergy"], preparations: ["Capsule 100/200 mg", "Syrup 100 mg/5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "cefuroxime", slug: "cefuroxime", genericName: "Cefuroxime", brandNames: ["Zinnat"],
    drugClass: "Second-generation cephalosporin", specialties: ["ENT", "Pediatrics", "Internal Medicine"], keywords: ["cefuroxime", "cephalosporin", "sinusitis", "otitis media"],
    indications: ["Acute otitis media", "Sinusitis", "Lower respiratory tract infection", "Surgical prophylaxis"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "General infections",
        text: "PO: 250–500 mg q12h. IV: 750 mg–1.5 g q8h.",
        weightBased: { min: 10, max: 15, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 500, note: "IV: 50 mg/kg/day divided q8h in children." },
      },
      {
        population: "pediatric", route: "PO", indication: "General infections",
        text: "10–15 mg/kg/dose PO q12h (max 500 mg/dose).",
        weightBased: { min: 10, max: 15, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 500 },
      },
    ],
    contraindications: ["Cephalosporin allergy"], preparations: ["Tablet 250/500 mg", "Syrup 125 mg/5 mL", "IV 750 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "cefalexin", slug: "cefalexin", genericName: "Cefalexin (Cephalexin)", brandNames: ["Keflex"],
    drugClass: "First-generation cephalosporin", specialties: ["Dermatology", "Pediatrics", "Urology"], keywords: ["cefalexin", "cephalexin", "cephalosporin", "cellulitis", "uti"],
    indications: ["Cellulitis / skin infections", "UTI (sensitive strains)", "Streptococcal pharyngitis (alternative)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "General infections",
        text: "250–500 mg q6h (max 4 g/day).",
        weightBased: { min: 25, max: 50, per: "day", frequencyPerDay: 4, maxPerDoseMg: 1000, maxDailyMg: 4000 },
      },
      {
        population: "pediatric", route: "PO", indication: "General infections",
        text: "25–50 mg/kg/day divided q6–8h (max 1 g/dose, 4 g/day).",
        weightBased: { min: 25, max: 50, per: "day", frequencyPerDay: 3, maxPerDoseMg: 1000, maxDailyMg: 4000 },
      },
    ],
    contraindications: ["Cephalosporin allergy"], renalConsideration: "Reduce dose in CrCl < 30.", preparations: ["Capsule 250/500 mg", "Syrup 125/250 mg per 5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "azithromycin", slug: "azithromycin", genericName: "Azithromycin", brandNames: ["Zithromax", "Azitrom"],
    drugClass: "Macrolide", specialties: ["Infectious Disease", "Pediatrics", "Pulmonology"], keywords: ["azithromycin", "macrolide", "atypical pneumonia", "trachoma", "zithromax"],
    indications: ["Atypical pneumonia", "Streptococcal pharyngitis (penicillin allergy)", "Trachoma", "Chancroid"],
    doses: [
      {
        population: "adult", route: "PO", indication: "CAP / atypical",
        text: "500 mg day 1, then 250 mg daily days 2–5 (or 500 mg daily × 3 days).",
        weightBased: { min: 10, max: 10, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 500, note: "Day 1: 10 mg/kg (max 500 mg), then 5 mg/kg (max 250 mg) days 2–5 in children." },
      },
      {
        population: "pediatric", route: "PO", indication: "Atypical pneumonia",
        text: "10 mg/kg on day 1 (max 500 mg), then 5 mg/kg days 2–5 (max 250 mg).",
        weightBased: { min: 10, max: 10, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 500 },
      },
    ],
    contraindications: ["Macrolide allergy"], majorWarnings: ["QT prolongation", "Hepatotoxicity"],
    preparations: ["Tablet 250/500 mg", "Syrup 200 mg/5 mL"], pregnancy: "Generally considered safe in short courses.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "clarithromycin", slug: "clarithromycin", genericName: "Clarithromycin", brandNames: ["Klacid"],
    drugClass: "Macrolide", specialties: ["Infectious Disease", "Pulmonology", "Gastroenterology"], keywords: ["clarithromycin", "macrolide", "h pylori", "atypical pneumonia"],
    indications: ["Atypical pneumonia", "H. pylori eradication (triple therapy)", "Pertussis (alternative)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "General infections",
        text: "250–500 mg q12h (H. pylori: 500 mg q12h × 7–14 days).",
        weightBased: { min: 7.5, max: 15, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 500 },
      },
      {
        population: "pediatric", route: "PO", indication: "General infections",
        text: "7.5–15 mg/kg/dose q12h (max 500 mg/dose).",
        weightBased: { min: 7.5, max: 15, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 500 },
      },
    ],
    contraindications: ["Macrolide allergy", "Concurrent cisapride/pimozide/ergotamine", "Prolonged QT"],
    majorWarnings: ["QT prolongation", "CYP3A4 inhibition — many interactions", "Hepatotoxicity"],
    renalConsideration: "CrCl < 30: halve dose.", preparations: ["Tablet 250/500 mg", "Suspension 125/250 mg per 5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "erythromycin", slug: "erythromycin", genericName: "Erythromycin", brandNames: ["Eryc"],
    drugClass: "Macrolide", specialties: ["Pediatrics", "Infectious Disease", "Gastroenterology"], keywords: ["erythromycin", "macrolide", "pertussis", "gastroparesis"],
    indications: ["Pertussis", "Legionella (alternative)", "Gastroparesis (prokinetic)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Pertussis",
        text: "250–500 mg q6h (pertussis: 2 g/day divided q6h × 14 days).",
        weightBased: { min: 30, max: 50, per: "day", frequencyPerDay: 4, maxDailyMg: 2000 },
      },
      {
        population: "pediatric", route: "PO", indication: "Pertussis",
        text: "30–50 mg/kg/day divided q6h (max 2 g/day).",
        weightBased: { min: 30, max: 50, per: "day", frequencyPerDay: 4, maxDailyMg: 2000 },
      },
    ],
    contraindications: ["Macrolide allergy"], majorWarnings: ["QT prolongation", "GI side effects common"],
    preparations: ["Tablet 250/500 mg", "Suspension 200 mg/5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "metronidazole", slug: "metronidazole", genericName: "Metronidazole", brandNames: ["Flagyl", "Metrozol"],
    drugClass: "Nitroimidazole", specialties: ["Infectious Disease", "Gastroenterology", "Gynecology"], keywords: ["metronidazole", "flagyl", "anaerobic", "amoebiasis", "giardiasis", "bacterial vaginosis"],
    indications: ["Anaerobic infections", "Amoebiasis", "Giardiasis", "Bacterial vaginosis", "Trichomoniasis", "C. difficile (oral)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Anaerobic infections",
        text: "400–500 mg q8h (max 4 g/day in severe amoebiasis; C. difficile: 500 mg PO q8h × 10 days).",
        weightBased: { min: 7.5, max: 7.5, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 500 },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Anaerobic infections",
        text: "7.5 mg/kg/dose q8h (max 500 mg/dose).",
        weightBased: { min: 7.5, max: 7.5, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 500 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal anaerobic infection",
        text: "15 mg/kg loading, then 7.5 mg/kg q12h (first week) / q8h (after first week).",
        weightBased: { min: 7.5, max: 7.5, per: "dose", frequencyPerDay: 2, note: "After 15 mg/kg loading dose." },
      },
    ],
    contraindications: ["Metronidazole allergy", "First trimester (relative — avoid)"],
    majorWarnings: ["Disulfiram-like reaction with alcohol", "Peripheral neuropathy (prolonged use)"],
    preparations: ["Tablet 250/500 mg", "IV 500 mg/100 mL", "Suspension 200 mg/5 mL"], pregnancy: "Avoid in first trimester.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "clindamycin", slug: "clindamycin", genericName: "Clindamycin", brandNames: ["Dalacin"],
    drugClass: "Lincosamide", specialties: ["Infectious Disease", "Dermatology", "Obstetrics & Gynecology"], keywords: ["clindamycin", "anaerobic", "skin infection", "osteomyelitis"],
    indications: ["Skin/soft-tissue infections", "Anaerobic infections", "Aspiration pneumonia", "Bacterial vaginosis (topical)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Moderate-severe infections",
        text: "PO: 300–450 mg q6–8h. IV: 600–900 mg q8h.",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxPerDoseMg: 900, maxDailyMg: 2700 },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Moderate-severe infections",
        text: "PO: 8–25 mg/kg/day divided q6–8h. IV: 20–40 mg/kg/day divided q8h.",
        weightBased: { min: 20, max: 40, per: "day", frequencyPerDay: 3, maxPerDoseMg: 900, maxDailyMg: 2700 },
      },
    ],
    contraindications: ["Clindamycin allergy"], majorWarnings: ["C. difficile colitis — highest risk antibiotic", "Neuromuscular blockade potentiation"],
    preparations: ["Capsule 150/300 mg", "IV 600 mg/4 mL", "Cream 2%"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "vancomycin", slug: "vancomycin", genericName: "Vancomycin", brandNames: ["Vancocin"],
    drugClass: "Glycopeptide", specialties: ["Infectious Disease", "Intensive Care", "Nephrology"], keywords: ["vancomycin", "mrsa", "glycopeptide", "trough", "iv"],
    indications: ["MRSA infections", "Severe gram-positive infection (penicillin allergy)", "C. difficile (oral)"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Serious MRSA infection",
        text: "15–20 mg/kg/dose IV q8–12h (max 2 g/dose); target trough 10–20 mg/L (AUC-guided preferred).",
        weightBased: { min: 15, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 2000, note: "Infuse over ≥ 60 min. AUC/MIC ≥ 400 target." },
      },
      {
        population: "pediatric", route: "IV", indication: "Serious MRSA infection",
        text: "15 mg/kg/dose IV q6h (max 1 g/dose); trough 10–20 mg/L.",
        weightBased: { min: 15, max: 15, per: "dose", frequencyPerDay: 4, maxPerDoseMg: 1000 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal sepsis (gram-positive)",
        text: "15 mg/kg loading, then 10–15 mg/kg/dose q12–48h depending on postmenstrual age and renal function.",
        weightBased: { min: 10, max: 15, per: "dose", frequencyPerDay: 1, note: "Interval per postmenstrual age — monitor levels." },
      },
      {
        population: "adult", route: "PO", indication: "C. difficile colitis",
        text: "125 mg PO q6h × 10 days (severe: 500 mg q6h).",
      },
    ],
    contraindications: ["Vancomycin allergy"], majorWarnings: ["Nephrotoxicity", "Ototoxicity", "Red man syndrome (infuse slowly)", "Monitor levels"],
    renalConsideration: "Dose by renal function and levels; avoid in CrCl < 30 without levels.", preparations: ["IV 500 mg, 1 g", "PO capsule 125/250 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "gentamicin", slug: "gentamicin", genericName: "Gentamicin", brandNames: ["Garamycin"],
    drugClass: "Aminoglycoside", specialties: ["Infectious Disease", "Neonatology", "Nephrology"], keywords: ["gentamicin", "aminoglycoside", "neonatal sepsis", "gram negative"],
    indications: ["Severe gram-negative infections (with β-lactam)", "Neonatal sepsis", "UTI (complicated)"],
    doses: [
      {
        population: "adult", route: "IV / IM", indication: "Once-daily dosing",
        text: "5–7 mg/kg IV once daily (extended-interval); traditional: 1–1.7 mg/kg q8h. Adjust by levels.",
        weightBased: { min: 5, max: 7, per: "day", frequencyPerDay: 1, maxDailyMg: 560, note: "Monitor peak/trough or once-daily levels; avoid in pregnancy if possible." },
      },
      {
        population: "pediatric", route: "IV", indication: "Once-daily dosing",
        text: "7.5 mg/kg IV once daily.",
        weightBased: { min: 7.5, max: 7.5, per: "day", frequencyPerDay: 1 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal sepsis",
        text: "4–5 mg/kg/dose IV q24h (≥ 37 weeks), q36h (34–37 weeks), q48h (< 34 weeks).",
        weightBased: { min: 4, max: 5, per: "dose", frequencyPerDay: 1, note: "Interval by gestational age; monitor levels." },
      },
    ],
    contraindications: ["Aminoglycoside allergy", "Myasthenia gravis (relative)"],
    majorWarnings: ["Nephrotoxicity and ototoxicity — monitor levels and renal function", "Neuromuscular blockade"],
    renalConsideration: "Extended intervals in renal impairment; levels mandatory.", preparations: ["IV/IM 40 mg/mL, 80 mg/2 mL"], pregnancy: "Avoid — fetal ototoxicity risk.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "meropenem", slug: "meropenem", genericName: "Meropenem", brandNames: ["Meronem"],
    drugClass: "Carbapenem", specialties: ["Infectious Disease", "Intensive Care"], keywords: ["meropenem", "carbapenem", "esbl", "severe infection"],
    indications: ["Severe/ESBL infections", "Febrile neutropenia", "Meningitis", "Nosocomial pneumonia"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Severe infections",
        text: "1 g IV q8h (meningitis/severe: 2 g q8h).",
        weightBased: { min: 20, max: 40, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "pediatric", route: "IV", indication: "Severe infections",
        text: "20–40 mg/kg/dose IV q8h (max 2 g/dose).",
        weightBased: { min: 20, max: 40, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 2000 },
      },
      {
        population: "neonatal", route: "IV", indication: "Neonatal severe infection",
        text: "20 mg/kg/dose IV q12h (first week), q8h thereafter.",
        weightBased: { min: 20, max: 20, per: "dose", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Carbapenem allergy", "Severe penicillin anaphylaxis (relative)"], majorWarnings: ["Seizure risk (renal impairment)", "C. difficile"],
    renalConsideration: "Reduce dose in CrCl < 50.", preparations: ["IV 500 mg, 1 g"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "piperacillin-tazobactam", slug: "piperacillin-tazobactam", genericName: "Piperacillin-tazobactam", brandNames: ["Tazocin"],
    drugClass: "Extended-spectrum penicillin + β-lactamase inhibitor", specialties: ["Infectious Disease", "Intensive Care"], keywords: ["piperacillin", "tazobactam", "tazocin", "pseudomonas", "severe infection"],
    indications: ["Nosocomial pneumonia", "Intra-abdominal infection", "Febrile neutropenia", "Pseudomonas infections"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Severe infections",
        text: "4.5 g IV q6h (Pseudomonas/severe: 4.5 g q6h).",
        weightBased: { min: 100, max: 100, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 4500, note: "Dose by piperacillin component (100 mg/kg/dose)." },
      },
      {
        population: "pediatric", route: "IV", indication: "Severe infections",
        text: "100 mg/kg/dose (piperacillin) IV q6–8h (max 4.5 g/dose).",
        weightBased: { min: 100, max: 100, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 4500 },
      },
    ],
    contraindications: ["Penicillin allergy"], majorWarnings: ["Thrombocytopenia/coagulopathy (prolonged use)", "Hypokalaemia", "C. difficile"],
    renalConsideration: "CrCl < 40: extend interval.", preparations: ["IV 4.5 g (4 g/0.5 g)"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ciprofloxacin", slug: "ciprofloxacin", genericName: "Ciprofloxacin", brandNames: ["Ciproflox", "Ciproxin"],
    drugClass: "Fluoroquinolone", specialties: ["Infectious Disease", "Urology", "Gastroenterology"], keywords: ["ciprofloxacin", "fluoroquinolone", "uti", "typhoid", "cipro"],
    indications: ["Complicated UTI / pyelonephritis", "Typhoid fever", "Traveler's diarrhoea", "Gram-negative sepsis (combination)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "General infections",
        text: "PO: 500–750 mg q12h. IV: 400 mg q12h (severe q8h).",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 750 },
      },
      {
        population: "pediatric", route: "PO", indication: "Specific approved indications only",
        text: "10–20 mg/kg/dose PO q12h (max 750 mg/dose) — fluoroquinolones only for specific indications (e.g. complicated UTI, anthrax, MDR typhoid).",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 750 },
      },
    ],
    contraindications: ["Quinolone allergy", "Children (except specific indications)"], majorWarnings: ["QT prolongation", "Tendon rupture", "Seizure risk", "Aortic dissection/aneurysm risk (rare)"],
    renalConsideration: "CrCl < 30: reduce dose.", preparations: ["Tablet 250/500/750 mg", "IV 200 mg/100 mL"], pregnancy: "Avoid.", lactation: "Avoid.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "doxycycline", slug: "doxycycline", genericName: "Doxycycline", brandNames: ["Vibramycin"],
    drugClass: "Tetracycline", specialties: ["Infectious Disease", "Dermatology", "Pulmonology"], keywords: ["doxycycline", "tetracycline", "leptospirosis", "rickettsia", "acne", "malaria"],
    indications: ["Rickettsial infections (scrub typhus)", "Leptospirosis", "Cholera", "Malaria prophylaxis/treatment (adjunct)", "Acne", "Chlamydia"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "General infections",
        text: "100 mg q12h (day 1: 200 mg loading for some indications).",
        weightBased: { min: 2.2, max: 4.4, per: "day", frequencyPerDay: 2, maxDailyMg: 200, note: "For children > 8 years." },
      },
      {
        population: "pediatric", route: "PO", indication: "Children > 8 years",
        text: "2.2–4.4 mg/kg/day divided q12h (max 200 mg/day).",
        weightBased: { min: 2.2, max: 4.4, per: "day", frequencyPerDay: 2, maxDailyMg: 200 },
      },
    ],
    contraindications: ["Tetracycline allergy", "Children < 8 years (tooth discolouration)"], majorWarnings: ["Oesophagitis — take with water upright", "Photosensitivity"],
    preparations: ["Capsule 100 mg", "Tablet 100 mg"], pregnancy: "Avoid (fetal teeth/bone effects).", lactation: "Avoid.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "cotrimoxazole", slug: "cotrimoxazole", genericName: "Co-trimoxazole (Trimethoprim-sulfamethoxazole)", brandNames: ["Bactrim", "Septrim"],
    drugClass: "Folate antagonist combination", specialties: ["Infectious Disease", "Urology", "Pediatrics"], keywords: ["cotrimoxazole", "tmp-smx", "bactrim", "pneumocystis", "uti"],
    indications: ["UTI", "Pneumocystis jirovecii pneumonia (treatment/prophylaxis)", "Nocardia", "MRSA skin infections (alternative)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "UTI",
        text: "960 mg (160/800) q12h. PCP treatment: 15–20 mg/kg/day TMP divided q6–8h.",
        weightBased: { min: 4, max: 4, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 320, doseUnit: "mg", note: "Dose quoted as TMP component (4 mg/kg/dose = 8 mg/kg/day)." },
      },
      {
        population: "pediatric", route: "PO", indication: "UTI",
        text: "8 mg/kg/day TMP divided q12h (max 320 mg TMP/day).",
        weightBased: { min: 4, max: 4, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 320, doseUnit: "mg" },
      },
    ],
    contraindications: ["Sulfonamide allergy", "G6PD deficiency (relative)", "Pregnancy (near term)"],
    majorWarnings: ["Stevens-Johnson syndrome", "Hyperkalaemia", "Bone marrow suppression", "Folic acid deficiency"],
    renalConsideration: "Avoid if CrCl < 15; halve dose CrCl 15–30.", preparations: ["Tablet 480 mg (80/400), 960 mg (160/800)", "Syrup 240 mg/5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "fluconazole", slug: "fluconazole", genericName: "Fluconazole", brandNames: ["Diflucan", "Flucoral"],
    drugClass: "Triazole antifungal", specialties: ["Infectious Disease", "Dermatology", "Oncology"], keywords: ["fluconazole", "antifungal", "candida", "azole"],
    indications: ["Candida infections (oropharyngeal, oesophageal, vulvovaginal)", "Cryptococcal infection (consolidation)", "Candiduria"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Candida infections",
        text: "Oropharyngeal: 100–200 mg daily. Systemic candidiasis: 400 mg (6 mg/kg) loading then 200–400 mg daily. Cryptococcal meningitis consolidation: 400–800 mg daily.",
        weightBased: { min: 3, max: 6, per: "day", frequencyPerDay: 1, maxDailyMg: 800 },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Candida infections",
        text: "3–6 mg/kg/day once daily (max 400 mg/day; up to 12 mg/kg/day for severe).",
        weightBased: { min: 3, max: 6, per: "day", frequencyPerDay: 1, maxDailyMg: 400 },
      },
      {
        population: "neonatal", route: "PO / IV", indication: "Neonatal candidiasis",
        text: "12 mg/kg/dose IV q48h (first 2 weeks), q24h thereafter.",
        weightBased: { min: 12, max: 12, per: "dose", frequencyPerDay: 1, note: "Extended interval in neonates." },
      },
    ],
    contraindications: ["Azole allergy", "Concurrent terfenadine/cisapride"], majorWarnings: ["Hepatotoxicity", "QT prolongation", "CYP inhibition (warfarin, statins)"],
    renalConsideration: "CrCl < 50: halve dose / extend interval.", preparations: ["Capsule 50/100/150/200 mg", "Syrup 50 mg/5 mL", "IV 2 mg/mL"], pregnancy: "Avoid high-dose in first trimester.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "acyclovir", slug: "acyclovir", genericName: "Aciclovir (Acyclovir)", brandNames: ["Zovirax"],
    drugClass: "Antiviral (nucleoside analogue)", specialties: ["Infectious Disease", "Dermatology", "Neonatology"], keywords: ["acyclovir", "herpes", "varicella", "zoster", "antiviral"],
    indications: ["Herpes simplex (HSV) encephalitis", "Varicella-zoster", "Neonatal HSV", "Genital herpes"],
    doses: [
      {
        population: "adult", route: "IV / PO", indication: "HSV encephalitis / severe",
        text: "IV: 10 mg/kg q8h (HSV encephalitis 14–21 days). PO: 200–800 mg 5×/day depending on indication.",
        weightBased: { min: 10, max: 10, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 1500 },
      },
      {
        population: "pediatric", route: "IV / PO", indication: "HSV / varicella",
        text: "IV: 10–20 mg/kg/dose q8h (neonatal HSV: 20 mg/kg q8h). PO varicella: 20 mg/kg/dose qid (max 800 mg/dose).",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 800, note: "Neonatal HSV: 20 mg/kg IV q8h × 14–21 days." },
      },
    ],
    contraindications: ["Aciclovir allergy"], majorWarnings: ["Renal impairment/crystalluria — hydrate well", "Neurotoxicity (elderly, renal)"],
    renalConsideration: "CrCl < 50: reduce dose/interval.", preparations: ["Tablet 200/400/800 mg", "IV 250/500 mg", "Cream 5%"], pregnancy: "Generally safe (IV for severe HSV).", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "oseltamivir", slug: "oseltamivir", genericName: "Oseltamivir", brandNames: ["Tamiflu"],
    drugClass: "Neuraminidase inhibitor", specialties: ["Infectious Disease", "Pediatrics", "Internal Medicine"], keywords: ["oseltamivir", "tamiflu", "influenza", "antiviral"],
    indications: ["Influenza treatment (within 48 h)", "Influenza prophylaxis"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Influenza treatment",
        text: "75 mg q12h × 5 days (prophylaxis: 75 mg once daily × 10 days).",
        weightBased: { min: 2, max: 2.5, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 75, note: "Band dosing (children): ≤ 15 kg 30 mg; 15–23 kg 45 mg; 23–40 kg 60 mg; > 40 kg 75 mg q12h." },
      },
      {
        population: "pediatric", route: "PO", indication: "Influenza treatment",
        text: "Band dosing q12h × 5 days: ≤ 15 kg 30 mg; 15.1–23 kg 45 mg; 23.1–40 kg 60 mg; > 40 kg 75 mg.",
        weightBased: { min: 2, max: 2.5, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 75, note: "Use the band table above." },
      },
      {
        population: "neonatal", route: "PO", indication: "Influenza treatment",
        text: "3 mg/kg/dose q12h × 5 days (term neonates).",
        weightBased: { min: 3, max: 3, per: "dose", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Severe renal impairment (CrCl < 10)"], majorWarnings: ["Neuropsychiatric events (rare)", "Nausea/vomiting — take with food"],
    renalConsideration: "CrCl 10–30: 75 mg daily (treatment).", preparations: ["Capsule 30/45/75 mg", "Suspension 6 mg/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Respiratory ---------- */
  {
    id: "salbutamol", slug: "salbutamol", genericName: "Salbutamol (Albuterol)", brandNames: ["Ventolin"],
    drugClass: "Short-acting β₂-agonist", specialties: ["Pulmonology", "Pediatrics", "Emergency Medicine"], keywords: ["salbutamol", "albuterol", "ventolin", "asthma", "bronchodilator"],
    indications: ["Acute asthma / bronchospasm", "COPD exacerbation", "Hyperkalaemia (adjunct)"],
    doses: [
      {
        population: "all", route: "Inhalation (MDI / nebuliser)", indication: "Acute bronchospasm",
        text: "MDI: 100–200 mcg (1–2 puffs) PRN. Nebulised: adults 2.5–5 mg q4–6h; children 0.15 mg/kg/dose (min 2.5 mg) q4–6h.",
        weightBased: { min: 0.15, max: 0.15, per: "dose", frequencyPerDay: 6, maxPerDoseMg: 5, maxText: "Minimum nebulised dose 2.5 mg per treatment.", doseUnit: "mg" },
      },
    ],
    contraindications: ["Hypersensitivity to salbutamol"], majorWarnings: ["Tachycardia/tremor", "Hypokalaemia (high dose)"],
    preparations: ["MDI 100 mcg/dose", "Nebule 2.5 mg/2.5 mL, 5 mg/2.5 mL", "Syrup 2 mg/5 mL"], pregnancy: "Safe — preferred bronchodilator.", lactation: "Compatible.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "ipratropium", slug: "ipratropium", genericName: "Ipratropium bromide", brandNames: ["Atrovent"],
    drugClass: "Short-acting antimuscarinic", specialties: ["Pulmonology", "Emergency Medicine"], keywords: ["ipratropium", "atrovent", "copd", "asthma", "anticholinergic"],
    indications: ["COPD exacerbation", "Acute severe asthma (with salbutamol)"],
    doses: [
      {
        population: "adult", route: "Inhalation (nebuliser / MDI)", indication: "Acute bronchospasm",
        text: "Nebulised 500 mcg q6–8h (severe asthma: 500 mcg q20min × 3). MDI: 2 puffs (40 mcg) q6h.",
      },
      {
        population: "pediatric", route: "Inhalation (nebuliser)", indication: "Acute asthma",
        text: "250 mcg nebulised q6–8h (severe: 250 mcg q20min × 3).",
      },
    ],
    contraindications: ["Atropine allergy"], majorWarnings: ["Dry mouth", "Paradoxical bronchospasm (rare)"],
    preparations: ["Nebule 250/500 mcg", "MDI 20 mcg/puff"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Steroids ---------- */
  {
    id: "prednisone", slug: "prednisone", genericName: "Prednisone / Prednisolone", brandNames: ["Meticorten", "Solone"],
    drugClass: "Corticosteroid (oral)", specialties: ["Internal Medicine", "Pulmonology", "Rheumatology", "Hematology"], keywords: ["prednisone", "prednisolone", "steroid", "asthma", "autoimmune"],
    indications: ["Asthma exacerbation", "COPD exacerbation", "Autoimmune disease", "Nephrotic syndrome", "ALL"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Asthma/COPD exacerbation",
        text: "40–60 mg daily × 5–7 days (asthma); 30–40 mg daily × 5–7 days (COPD).",
        weightBased: { min: 0.5, max: 1, per: "day", frequencyPerDay: 1, maxDailyMg: 60 },
      },
      {
        population: "pediatric", route: "PO", indication: "Asthma exacerbation",
        text: "1–2 mg/kg/day (max 60 mg/day) × 3–5 days.",
        weightBased: { min: 1, max: 2, per: "day", frequencyPerDay: 1, maxDailyMg: 60 },
      },
    ],
    contraindications: ["Systemic fungal infection (untreated)"], majorWarnings: ["Hyperglycaemia", "Immunosuppression", "Long-term: osteoporosis, adrenal suppression — taper"],
    preparations: ["Tablet 5 mg", "Syrup 5 mg/5 mL"], pregnancy: "Use lowest effective dose.", lactation: "Compatible (doses > 40 mg: delay 4 h).", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "dexamethasone", slug: "dexamethasone", genericName: "Dexamethasone", brandNames: ["Oradexon", "Dexa"],
    drugClass: "Corticosteroid (potent, long-acting)", specialties: ["Pediatrics", "Emergency Medicine", "Oncology", "ENT"], keywords: ["dexamethasone", "steroid", "croup", "meningitis", "antiinflammatory"],
    indications: ["Croup (single dose)", "Bacterial meningitis (adjunct)", "Cerebral oedema", "Chemotherapy antiemesis", "COVID-19 (severe)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Anti-inflammatory",
        text: "4–8 mg daily (COVID-19: 6 mg daily × 10 days; cerebral oedema: 10 mg load then 4 mg q6h).",
        weightBased: { min: 0.15, max: 0.3, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 16 },
      },
      {
        population: "pediatric", route: "PO / IV / IM", indication: "Croup",
        text: "Croup: 0.15–0.6 mg/kg single dose (max 10 mg). Meningitis: 0.15 mg/kg q6h × 2–4 days.",
        weightBased: { min: 0.15, max: 0.6, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 16 },
      },
    ],
    contraindications: ["Systemic fungal infection"], majorWarnings: ["Hyperglycaemia", "Immunosuppression", "GI perforation risk (with NSAIDs)"],
    preparations: ["Tablet 0.5 mg", "Ampoule 4 mg/mL", "Syrup 0.5 mg/5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "hydrocortisone", slug: "hydrocortisone", genericName: "Hydrocortisone", brandNames: ["Solu-Cortef"],
    drugClass: "Corticosteroid (short-acting)", specialties: ["Endocrinology", "Intensive Care", "Pediatrics"], keywords: ["hydrocortisone", "steroid", "adrenal insufficiency", "septic shock", "asthma"],
    indications: ["Adrenal insufficiency/crisis", "Septic shock (refractory)", "Acute severe asthma", "Congenital adrenal hyperplasia"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Adrenal crisis / septic shock",
        text: "100 mg IV q8h (stress dose) or 200 mg/day continuous; taper when stable.",
        weightBased: { min: 1, max: 2, per: "dose", frequencyPerDay: 4, maxDailyMg: 400 },
      },
      {
        population: "pediatric", route: "IV / PO", indication: "Adrenal crisis / asthma",
        text: "Adrenal crisis: 1–2 mg/kg IV then 100 mg/m²/day. Asthma: 1–2 mg/kg/dose IV q6h (max 100 mg/dose).",
        weightBased: { min: 1, max: 2, per: "dose", frequencyPerDay: 4, maxPerDoseMg: 100 },
      },
    ],
    contraindications: ["Systemic fungal infection"], majorWarnings: ["Hyperglycaemia", "Immunosuppression"],
    preparations: ["IV 100 mg vial", "Tablet 10/20 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Cardiovascular ---------- */
  {
    id: "furosemide", slug: "furosemide", genericName: "Furosemide (Frusemide)", brandNames: ["Lasix", "Farsix"],
    drugClass: "Loop diuretic", specialties: ["Cardiology", "Nephrology", "Internal Medicine"], keywords: ["furosemide", "lasix", "diuretic", "heart failure", "edema"],
    indications: ["Heart failure (fluid overload)", "Pulmonary oedema", "Oedema of renal/hepatic disease", "Hypertension (adjunct)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Heart failure",
        text: "20–80 mg PO/IV; titrate (pulmonary oedema: 40 mg IV, repeat; max 600 mg/day PO).",
        weightBased: { min: 0.5, max: 1, per: "dose", frequencyPerDay: 2, maxDailyMg: 600, note: "Pulmonary oedema: 40 mg IV initial." },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Fluid overload",
        text: "0.5–2 mg/kg/dose PO/IV q6–12h (max 6 mg/kg/day).",
        weightBased: { min: 0.5, max: 2, per: "dose", frequencyPerDay: 2, maxText: "Maximum 6 mg/kg/day in children." },
      },
    ],
    contraindications: ["Anuria", "Severe hypovolaemia"], majorWarnings: ["Hypokalaemia/hyponatraemia", "Ototoxicity (rapid IV)", "Dehydration"],
    renalConsideration: "Higher doses may be needed in renal impairment (responds despite low GFR).", preparations: ["Tablet 40 mg", "Ampoule 10 mg/mL", "Syrup 10 mg/5 mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "spironolactone", slug: "spironolactone", genericName: "Spironolactone", brandNames: ["Aldactone"],
    drugClass: "Potassium-sparing diuretic (MRA)", specialties: ["Cardiology", "Nephrology", "Endocrinology"], keywords: ["spironolactone", "aldactone", "heart failure", "hyperaldosteronism", "diuretic"],
    indications: ["Heart failure with reduced EF", "Resistant hypertension", "Primary hyperaldosteronism", "Ascites (cirrhosis)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Heart failure",
        text: "25–50 mg once daily (max 100 mg/day; ascites: 100–400 mg/day).",
        weightBased: { min: 1, max: 2, per: "day", frequencyPerDay: 1, maxDailyMg: 400 },
      },
      {
        population: "pediatric", route: "PO", indication: "Diuretic",
        text: "1–3 mg/kg/day divided q12–24h (max 100 mg/day).",
        weightBased: { min: 1, max: 3, per: "day", frequencyPerDay: 1, maxDailyMg: 100 },
      },
    ],
    contraindications: ["Hyperkalaemia", "Addison's disease", "Severe renal impairment"], majorWarnings: ["Hyperkalaemia — monitor K⁺ and renal function", "Gynaecomastia"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "amlodipine", slug: "amlodipine", genericName: "Amlodipine", brandNames: ["Norvasc", "Amcor"],
    drugClass: "Calcium channel blocker (dihydropyridine)", specialties: ["Cardiology", "Hypertension", "Internal Medicine"], keywords: ["amlodipine", "calcium channel blocker", "hypertension", "norvasc"],
    indications: ["Hypertension", "Chronic stable angina"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Hypertension",
        text: "5 mg once daily, titrate to 10 mg daily.",
        weightBased: { min: 0.1, max: 0.2, per: "day", frequencyPerDay: 1, maxDailyMg: 10 },
      },
      {
        population: "pediatric", route: "PO", indication: "Hypertension (6–17 y)",
        text: "2.5–5 mg once daily (0.1–0.2 mg/kg/day, max 10 mg/day).",
        weightBased: { min: 0.1, max: 0.2, per: "day", frequencyPerDay: 1, maxDailyMg: 10 },
      },
    ],
    contraindications: ["Severe hypotension", "Cardiogenic shock"], majorWarnings: ["Peripheral oedema", "Flushing/headache", "Reflex tachycardia (higher doses)"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "captopril", slug: "captopril", genericName: "Captopril", brandNames: ["Capoten"],
    drugClass: "ACE inhibitor", specialties: ["Cardiology", "Hypertension", "Nephrology"], keywords: ["captopril", "ace inhibitor", "hypertension", "heart failure"],
    indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Hypertension",
        text: "12.5–25 mg q8–12h, titrate (max 150 mg/day).",
        weightBased: { min: 0.3, max: 0.5, per: "dose", frequencyPerDay: 3, maxDailyMg: 150 },
      },
      {
        population: "pediatric", route: "PO", indication: "Hypertension",
        text: "0.3–0.5 mg/kg/dose q8h (neonates: 0.01–0.1 mg/kg/dose q8–24h).",
        weightBased: { min: 0.3, max: 0.5, per: "dose", frequencyPerDay: 3, maxDailyMg: 150 },
      },
    ],
    contraindications: ["Pregnancy", "Angioedema history", "Bilateral renal artery stenosis"], majorWarnings: ["Angioedema", "Hyperkalaemia", "Cough", "First-dose hypotension — check K⁺/Cr at baseline"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "nitroglycerin", slug: "nitroglycerin", genericName: "Nitroglycerin (GTN)", brandNames: ["Nitrolingual", "Nitrokaf"],
    drugClass: "Nitrate", specialties: ["Cardiology", "Emergency Medicine"], keywords: ["nitroglycerin", "gtn", "chest pain", "angina", "nitrate"],
    indications: ["Acute angina", "Acute coronary syndrome", "Pulmonary oedema (hypertensive)"],
    doses: [
      {
        population: "adult", route: "Sublingual / IV", indication: "Acute angina",
        text: "0.4 mg SL q5min up to 3 doses; if ongoing pain/ACS: IV infusion 10–20 mcg/min titrate.",
      },
    ],
    contraindications: ["SBP < 90 mmHg", "Right ventricular infarction", "Phosphodiesterase-5 inhibitors (24–48 h)", "Severe aortic stenosis"],
    majorWarnings: ["Hypotension", "Headache", "Tolerance with continuous use"],
    preparations: ["SL spray 0.4 mg/dose", "IV 1 mg/mL", "Ointment 2%"], pregnancy: "Use with caution (hypotension).", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "atenolol", slug: "atenolol", genericName: "Atenolol", brandNames: ["Tenormin"],
    drugClass: "Beta-blocker (cardioselective)", specialties: ["Cardiology", "Hypertension"], keywords: ["atenolol", "beta blocker", "hypertension", "angina"],
    indications: ["Hypertension", "Angina", "Post-MI", "Rate control in AF"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Hypertension",
        text: "25–100 mg once daily.",
        weightBased: { min: 0.5, max: 1, per: "day", frequencyPerDay: 1, maxDailyMg: 100 },
      },
      {
        population: "pediatric", route: "PO", indication: "Hypertension",
        text: "0.5–1 mg/kg/day once daily (max 100 mg/day).",
        weightBased: { min: 0.5, max: 1, per: "day", frequencyPerDay: 1, maxDailyMg: 100 },
      },
    ],
    contraindications: ["Bradycardia/AV block", "Decompensated heart failure", "Severe asthma"], majorWarnings: ["Bronchospasm (asthmatics)", "Bradycardia", "Don't stop abruptly"],
    renalConsideration: "CrCl < 35: reduce dose.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "aspirin", slug: "aspirin", genericName: "Aspirin (Acetylsalicylic acid)", brandNames: ["Aspro", "Bayer"],
    drugClass: "Antiplatelet / NSAID", specialties: ["Cardiology", "Neurology", "Internal Medicine", "Emergency Medicine"], keywords: ["aspirin", "asa", "acetylsalicylic", "antiplatelet", "antiplatelet", "stroke", "mi"],
    indications: ["Acute coronary syndrome", "Secondary prevention of MI/stroke/TIA", "Acute ischaemic stroke (within 24–48 h, no thrombolysis)", "Analgesia/antipyretic (low priority — paracetamol preferred in children)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "ACS / secondary prevention",
        text: "Loading 150–325 mg chewable, then 75–100 mg once daily. Acute ischaemic stroke: 160–300 mg daily starting within 24–48 h (if no thrombolysis).",
        weightBased: { min: 75, max: 100, per: "day", frequencyPerDay: 1, maxDailyMg: 325, note: "Maintenance 75–100 mg/day; loading dose 150–325 mg." },
      },
      {
        population: "pediatric", route: "PO", indication: "Kawasaki disease (adjunct) — specialist use",
        text: "Only under specialist guidance (e.g. Kawasaki disease high-dose phase). Avoid for routine fever in children (Reye syndrome risk).",
      },
    ],
    contraindications: ["Active peptic ulcer / GI bleeding", "Aspirin hypersensitivity / NSAID allergy", "Children with viral illness (Reye syndrome)", "Severe haemophilia"],
    majorWarnings: ["GI bleeding risk", "Bleeding with anticoagulants/antiplatelets", "Reye syndrome in children with viral infection — avoid"],
    renalConsideration: "Avoid in severe renal impairment.", hepaticConsideration: "Caution in severe liver disease.", preparations: ["Tablet 80/100 mg (enteric-coated)", "Tablet 325 mg", "Chewable 81 mg"],
    pregnancy: "Low-dose aspirin may be used for preeclampsia prevention (high-risk women); avoid high dose in third trimester.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "enoxaparin", slug: "enoxaparin", genericName: "Enoxaparin", brandNames: ["Clexane", "Lovenox"],
    drugClass: "Low-molecular-weight heparin", specialties: ["Cardiology", "Internal Medicine", "Obstetrics & Gynecology"], keywords: ["enoxaparin", "lmwh", "clexane", "anticoagulation", "dvt"],
    indications: ["VTE treatment", "VTE prophylaxis", "ACS (with antiplatelets)", "Pregnancy anticoagulation"],
    doses: [
      {
        population: "adult", route: "SC", indication: "VTE treatment",
        text: "1 mg/kg SC q12h (or 1.5 mg/kg once daily); prophylaxis: 40 mg daily.",
        weightBased: { min: 1, max: 1.5, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 100, note: "Prophylaxis 40 mg daily (fixed)." },
      },
      {
        population: "pediatric", route: "SC", indication: "VTE treatment",
        text: "1–1.5 mg/kg/dose SC q12h (anti-Xa guided).",
        weightBased: { min: 1, max: 1.5, per: "dose", frequencyPerDay: 2 },
      },
    ],
    contraindications: ["Active major bleeding", "Heparin-induced thrombocytopenia (HIT)", "Severe renal impairment (prefer UFH)"],
    majorWarnings: ["Bleeding", "HIT (less than UFH but possible)", "Epidural/spinal haematoma risk"],
    renalConsideration: "CrCl < 30: reduce dose / use UFH.", preparations: ["Prefilled syringe 20/40 mg, 60/80/100 mg"], pregnancy: "Preferred LMWH for VTE in pregnancy.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "warfarin", slug: "warfarin", genericName: "Warfarin", brandNames: ["Coumadin", "Simarc"],
    drugClass: "Vitamin K antagonist", specialties: ["Cardiology", "Hematology"], keywords: ["warfarin", "anticoagulation", "inr", "vitamin k antagonist"],
    indications: ["VTE treatment/prophylaxis", "AF anticoagulation (valvular/mechanical valve)", "Mechanical heart valves"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Anticoagulation",
        text: "Start 5 mg daily (2.5 mg elderly/low-weight); adjust by INR (target 2–3; mechanical mitral valve 2.5–3.5).",
        weightBased: { min: 0.1, max: 0.1, per: "day", frequencyPerDay: 1, maxDailyMg: 10, doseUnit: "mg", note: "INR-guided titration — never fixed dose long-term." },
      },
      {
        population: "pediatric", route: "PO", indication: "Anticoagulation",
        text: "0.1 mg/kg/day adjusted by INR (target varies by indication).",
        weightBased: { min: 0.1, max: 0.1, per: "day", frequencyPerDay: 1, maxDailyMg: 10 },
      },
    ],
    contraindications: ["Active bleeding", "Pregnancy (fetopathy)", "Uncontrolled hypertension"], majorWarnings: ["Bleeding — INR monitoring essential", "Many drug/food interactions", "Teratogenic"],
    preparations: ["Tablet 1/2/5 mg"], pregnancy: "Contraindicated — switch to LMWH.", lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Endocrine ---------- */
  {
    id: "metformin", slug: "metformin", genericName: "Metformin", brandNames: ["Glucophage"],
    drugClass: "Biguanide (oral antihyperglycaemic)", specialties: ["Endocrinology", "Internal Medicine"], keywords: ["metformin", "diabetes", "glucophage", "oral hypoglycemic"],
    indications: ["Type 2 diabetes (first-line)", "Prediabetes", "PCOS"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Type 2 diabetes",
        text: "500 mg q12h or 850 mg daily with meals; titrate to 2000 mg/day in divided doses.",
      },
      {
        population: "pediatric", route: "PO", indication: "Type 2 diabetes (≥ 10 y)",
        text: "500 mg q12h, titrate to 2000 mg/day (max).",
      },
    ],
    contraindications: ["eGFR < 30", "Metabolic acidosis/DKA", "Severe hypoxia/sepsis"], majorWarnings: ["Lactic acidosis (rare; hold in acute illness/contrast)", "GI upset", "B12 deficiency (long-term)"],
    renalConsideration: "eGFR 30–45: max 1000 mg/day; hold if eGFR < 30 or acute deterioration.", preparations: ["Tablet 500/850/1000 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "insulin-regular", slug: "insulin-regular", genericName: "Insulin regular (soluble)", brandNames: ["Actrapid", "Humulin R"],
    drugClass: "Short-acting insulin", specialties: ["Endocrinology", "Intensive Care", "Pediatrics"], keywords: ["insulin", "regular", "dka", "hyperglycemia", "soluble"],
    indications: ["DKA / HHS (IV infusion)", "Acute hyperglycaemia", "Mealtime bolus (with basal)"],
    doses: [
      {
        population: "all", route: "IV infusion", indication: "DKA",
        text: "DKA: 0.1 units/kg/h IV infusion (children: 0.05–0.1 units/kg/h); continue until gap closes and ketones clear.",
        weightBased: { min: 0.05, max: 0.1, per: "dose", frequencyPerDay: 24, doseUnit: "units", note: "units/kg/hour — see the infusion-rate calculator for pump settings. Dextrose added when glucose < 250 mg/dL." },
      },
      {
        population: "adult", route: "SC", indication: "Maintenance (basal-bolus)",
        text: "Total daily dose ~0.5–0.6 units/kg/day; ~50% basal (glargine/NPH), ~50% bolus (regular) divided pre-meals. Individualise.",
        weightBased: { min: 0.25, max: 0.3, per: "day", frequencyPerDay: 3, doseUnit: "units", note: "Bolus portion of a basal-bolus regimen; split across meals." },
      },
    ],
    contraindications: ["Hypoglycaemia"], majorWarnings: ["Hypoglycaemia — monitor glucose hourly in IV therapy", "Hypokalaemia"],
    renalConsideration: "Reduce doses as renal function declines.", preparations: ["Vial 100 units/mL"], pregnancy: "Insulin is the preferred agent in pregnancy.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "glargine", slug: "glargine", genericName: "Insulin glargine", brandNames: ["Lantus", "Basaglar"],
    drugClass: "Long-acting basal insulin", specialties: ["Endocrinology", "Internal Medicine"], keywords: ["glargine", "lantus", "basal insulin", "long acting"],
    indications: ["Basal insulin in type 1/type 2 diabetes"],
    doses: [
      {
        population: "adult", route: "SC", indication: "Basal insulin",
        text: "Start 10 units (or 0.1–0.2 units/kg) once daily; titrate by fasting glucose. Typical 0.3–0.5 units/kg/day when combined with bolus insulin.",
        weightBased: { min: 0.1, max: 0.2, per: "dose", frequencyPerDay: 1, doseUnit: "units", note: "Starting dose — titrate to fasting glucose target." },
      },
    ],
    majorWarnings: ["Hypoglycaemia", "Do not mix with other insulins"], preparations: ["Vial/pen 100 units/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Neurology / psychiatry ---------- */
  {
    id: "diazepam", slug: "diazepam", genericName: "Diazepam", brandNames: ["Valium", "Stesolid"],
    drugClass: "Benzodiazepine", specialties: ["Neurology", "Emergency Medicine", "Pediatrics"], keywords: ["diazepam", "valium", "seizure", "status epilepticus", "benzodiazepine"],
    indications: ["Status epilepticus", "Acute seizures", "Anxiety (short-term)", "Alcohol withdrawal"],
    doses: [
      {
        population: "adult", route: "IV / PR", indication: "Status epilepticus",
        text: "10 mg IV slow (repeat once after 5 min if ongoing); PR: 10–20 mg.",
        weightBased: { min: 0.15, max: 0.2, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 10 },
      },
      {
        population: "pediatric", route: "IV / PR", indication: "Status epilepticus",
        text: "0.2–0.3 mg/kg/dose IV/PR (max 10 mg); PR dose may be higher (0.5 mg/kg).",
        weightBased: { min: 0.2, max: 0.3, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 10 },
      },
    ],
    contraindications: ["Severe respiratory depression", "Myasthenia gravis", "Acute narrow-angle glaucoma"], majorWarnings: ["Respiratory depression", "Hypotension (rapid IV)", "Dependence with chronic use"],
    preparations: ["Ampoule 10 mg/2 mL", "Tablet 2/5 mg", "Rectal tube 5/10 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "midazolam", slug: "midazolam", genericName: "Midazolam", brandNames: ["Dormicum"],
    drugClass: "Benzodiazepine (short-acting)", specialties: ["Anesthesiology", "Emergency Medicine", "Pediatrics", "Intensive Care"], keywords: ["midazolam", "dormicum", "sedation", "seizure", "benzodiazepine"],
    indications: ["Procedural sedation", "Status epilepticus (buccal/IM/IN)", "ICU sedation"],
    doses: [
      {
        population: "adult", route: "IV / IM / IN", indication: "Sedation / seizure",
        text: "Sedation: 1–2.5 mg IV titrate. Status epilepticus: 10 mg IM/IN. ICU: 0.02–0.1 mg/kg/h infusion.",
        weightBased: { min: 0.1, max: 0.2, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 10 },
      },
      {
        population: "pediatric", route: "IV / IM / IN / buccal", indication: "Sedation / seizure",
        text: "0.1–0.2 mg/kg IV/IM/IN (max 10 mg); buccal 0.3–0.5 mg/kg (max 10 mg).",
        weightBased: { min: 0.1, max: 0.2, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 10 },
      },
    ],
    contraindications: ["Severe respiratory depression"], majorWarnings: ["Respiratory depression — have reversal agent (flumazenil) available", "Hypotension"],
    renalConsideration: "Reduce in renal impairment (accumulation).", preparations: ["Ampoule 1/5 mg/mL", "Buccal 10 mg/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "phenytoin", slug: "phenytoin", genericName: "Phenytoin", brandNames: ["Dilantin", "Phenytoin"],
    drugClass: "Antiepileptic (hydantoin)", specialties: ["Neurology", "Emergency Medicine"], keywords: ["phenytoin", "dilantin", "seizure", "antiepileptic"],
    indications: ["Focal/generalised tonic-clonic seizures", "Status epilepticus (second-line)"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Loading (status/first seizure)",
        text: "15–20 mg/kg IV load (max 50 mg/min, max 1500–2000 mg); maintenance 5–6 mg/kg/day PO/IV divided q8–12h.",
        weightBased: { min: 15, max: 20, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 2000, note: "This is the loading dose; see text for maintenance." },
      },
      {
        population: "adult", route: "PO", indication: "Maintenance",
        text: "5–6 mg/kg/day divided q8–12h (max 400 mg/day; therapeutic level 10–20 mg/L).",
        weightBased: { min: 5, max: 6, per: "day", frequencyPerDay: 2, maxDailyMg: 400 },
      },
    ],
    contraindications: ["Sinus bradycardia/AV block"], majorWarnings: ["Purple glove syndrome (IV extravasation)", "Hypotension/arrhythmia with rapid infusion", "Gingival hyperplasia, hirsutism (chronic)"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "levetiracetam", slug: "levetiracetam", genericName: "Levetiracetam", brandNames: ["Keppra"],
    drugClass: "Antiepileptic", specialties: ["Neurology", "Pediatrics"], keywords: ["levetiracetam", "keppra", "seizure", "antiepileptic"],
    indications: ["Focal seizures", "Generalised tonic-clonic", "Status epilepticus (IV, alternative)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Seizures",
        text: "500–1500 mg q12h (start 500 mg q12h; status: 40–60 mg/kg IV load, max 4.5 g).",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 1500 },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Seizures",
        text: "10–20 mg/kg/dose q12h (max 1500 mg/dose).",
        weightBased: { min: 10, max: 20, per: "dose", frequencyPerDay: 2, maxPerDoseMg: 1500 },
      },
    ],
    majorWarnings: ["Behavioural changes", "Somnolence"], renalConsideration: "CrCl < 80: reduce dose.", preparations: ["Tablet 250/500/1000 mg", "Syrup 100 mg/mL", "IV 100 mg/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "carbamazepine", slug: "carbamazepine", genericName: "Carbamazepine", brandNames: ["Tegretol", "Carbam"],
    drugClass: "Antiepileptic", specialties: ["Neurology", "Psychiatry"], keywords: ["carbamazepine", "tegretol", "seizure", "trigeminal neuralgia", "bipolar"],
    indications: ["Focal seizures", "Trigeminal neuralgia", "Bipolar disorder"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Epilepsy",
        text: "200–400 mg q8–12h (max 1200 mg/day); start 100–200 mg q12h.",
        weightBased: { min: 10, max: 20, per: "day", frequencyPerDay: 2, maxDailyMg: 1200 },
      },
      {
        population: "pediatric", route: "PO", indication: "Epilepsy",
        text: "10–20 mg/kg/day divided q8–12h (max 1200 mg/day).",
        weightBased: { min: 10, max: 20, per: "day", frequencyPerDay: 2, maxDailyMg: 1200 },
      },
    ],
    contraindications: ["AV block", "Bone marrow suppression", "MAO inhibitors"], majorWarnings: ["Hyponatraemia", "SJS/TEN (HLA-B*1502 in Asian populations)", "CYP3A4 induction — many interactions", "Aplastic anaemia (rare)"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "haloperidol", slug: "haloperidol", genericName: "Haloperidol", brandNames: ["Haldol"],
    drugClass: "Typical antipsychotic", specialties: ["Psychiatry", "Emergency Medicine"], keywords: ["haloperidol", "haldol", "antipsychotic", "agitation", "psychosis"],
    indications: ["Acute psychosis", "Agitation (IM)", "Delirium (low dose)"],
    doses: [
      {
        population: "adult", route: "PO / IM", indication: "Psychosis / agitation",
        text: "0.5–5 mg PO q8h; acute agitation 2–5 mg IM (repeat after 60 min; max 20 mg/day).",
        weightBased: { min: 0.05, max: 0.15, per: "day", frequencyPerDay: 2, maxDailyMg: 20, note: "Paediatric use: 0.05–0.15 mg/kg/day divided (specialist only)." },
      },
    ],
    contraindications: ["Comatose states", "Parkinson's disease (relative)", "Prolonged QT"], majorWarnings: ["QT prolongation — monitor", "Extrapyramidal reactions", "Neuroleptic malignant syndrome (rare)"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "sertraline", slug: "sertraline", genericName: "Sertraline", brandNames: ["Zoloft", "Sedepram"],
    drugClass: "SSRI antidepressant", specialties: ["Psychiatry", "Internal Medicine"], keywords: ["sertraline", "zoloft", "ssri", "depression", "anxiety"],
    indications: ["Major depression", "Anxiety disorders", "OCD", "PTSD", "Premenstrual dysphoric disorder"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Depression",
        text: "50 mg once daily, titrate to 100–200 mg daily.",
      },
      {
        population: "pediatric", route: "PO", indication: "OCD (6–17 y)",
        text: "25 mg once daily (children) / 50 mg (adolescents), titrate to max 200 mg/day — specialist supervision.",
      },
    ],
    contraindications: ["MAO inhibitors (14 days)"], majorWarnings: ["Serotonin syndrome (with triptans, tramadol, linezolid)", "Suicidality (young adults, early treatment)", "GI bleeding risk"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- Emergency drugs ---------- */
  {
    id: "epinephrine", slug: "epinephrine", genericName: "Epinephrine (Adrenaline)", brandNames: ["EpiPen"],
    drugClass: "Sympathomimetic", specialties: ["Emergency Medicine", "Anesthesiology", "Pediatrics"], keywords: ["epinephrine", "adrenaline", "anaphylaxis", "cardiac arrest"],
    indications: ["Anaphylaxis", "Cardiac arrest", "Severe asthma (adjunct)", "Croup (nebulised)"],
    doses: [
      {
        population: "adult", route: "IM", indication: "Anaphylaxis",
        text: "0.3–0.5 mg IM (1:1000) anterolateral thigh; repeat q5–15min as needed.",
        weightBased: { min: 0.01, max: 0.01, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 0.5, note: "1 mg/mL (1:1000) for IM." },
      },
      {
        population: "pediatric", route: "IM", indication: "Anaphylaxis",
        text: "0.01 mg/kg IM (max 0.5 mg; max single dose 0.3 mg per convention in some guidelines) — repeat q5–15min.",
        weightBased: { min: 0.01, max: 0.01, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 0.5 },
      },
      {
        population: "all", route: "IV", indication: "Cardiac arrest",
        text: "1 mg IV q3–5min (adult); 0.01 mg/kg IV (children, max 1 mg).",
        weightBased: { min: 0.01, max: 0.01, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 1 },
      },
    ],
    contraindications: ["None in anaphylaxis/arrest (life-saving)"], majorWarnings: ["Arrhythmias", "Severe hypertension", "Do not give IV 1:1000 by mistake"],
    preparations: ["Ampoule 1 mg/mL (1:1000)", "Ampoule 0.1 mg/mL (1:10000)", "Auto-injector 0.15/0.3 mg"], pregnancy: "Safe in anaphylaxis.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "naloxone", slug: "naloxone", genericName: "Naloxone", brandNames: ["Narcan"],
    drugClass: "Opioid antagonist", specialties: ["Emergency Medicine", "Anesthesiology", "Pediatrics"], keywords: ["naloxone", "narcan", "opioid overdose", "reversal"],
    indications: ["Opioid overdose/respiratory depression", "Opioid reversal post-anaesthesia"],
    doses: [
      {
        population: "adult", route: "IV / IM / IN", indication: "Opioid overdose",
        text: "0.4–2 mg IV/IM/IN q2–3min titrate to respiratory response (max 10 mg).",
        weightBased: { min: 0.01, max: 0.1, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 2 },
      },
      {
        population: "pediatric", route: "IV / IM / IN", indication: "Opioid overdose",
        text: "0.01–0.1 mg/kg IV (max 2 mg/dose); titrate.",
        weightBased: { min: 0.01, max: 0.1, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 2 },
      },
    ],
    majorWarnings: ["Acute withdrawal (agitation, seizures in dependence)", "Short half-life — re-dose as opioid effect returns", "Cardiac irritability"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "atropine", slug: "atropine", genericName: "Atropine sulfate", brandNames: ["Atropin"],
    drugClass: "Antimuscarinic", specialties: ["Emergency Medicine", "Anesthesiology", "Pediatrics"], keywords: ["atropine", "bradycardia", "organophosphate", "antimuscarinic"],
    indications: ["Symptomatic bradycardia", "Organophosphate poisoning", "Pre-induction (children)"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Bradycardia",
        text: "0.5–1 mg IV q3–5min (max 3 mg total).",
        weightBased: { min: 0.02, max: 0.02, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 1 },
      },
      {
        population: "pediatric", route: "IV", indication: "Bradycardia",
        text: "0.02 mg/kg IV (min dose 0.1 mg; max single 1 mg; max 1 mg child / 2 mg adolescent).",
        weightBased: { min: 0.02, max: 0.02, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 1 },
      },
    ],
    contraindications: ["Glaucoma", "Tachyarrhythmias (relative)"], majorWarnings: ["Tachycardia", "Anticholinergic effects", "Organophosphate poisoning: repeat large doses"],
    lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "tranexamic-acid", slug: "tranexamic-acid", genericName: "Tranexamic acid", brandNames: ["Transamin", "Cyklokapron"],
    drugClass: "Antifibrinolytic", specialties: ["Obstetrics & Gynecology", "Emergency Medicine", "Surgery"], keywords: ["tranexamic acid", "txa", "postpartum hemorrhage", "trauma", "antifibrinolytic"],
    indications: ["Postpartum haemorrhage", "Trauma (within 3 h)", "Menorrhagia", "Surgical bleeding"],
    doses: [
      {
        population: "adult", route: "IV / PO", indication: "PPH / trauma",
        text: "1 g IV over 10 min (PPH: repeat 1 g after 30 min if bleeding continues; trauma: 1 g IV over 10 min then 1 g over 8 h).",
        weightBased: { min: 15, max: 15, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 1000 },
      },
      {
        population: "pediatric", route: "IV", indication: "Bleeding",
        text: "15 mg/kg IV (max 1 g).",
        weightBased: { min: 15, max: 15, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 1000 },
      },
    ],
    contraindications: ["Active thromboembolic disease", "Colour vision disturbance (history)"], majorWarnings: ["Thromboembolism risk (rare)", "Seizures (high dose, renal impairment)"],
    renalConsideration: "Reduce dose in renal impairment.", preparations: ["IV 500 mg/5 mL", "Tablet 500 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "magnesium-sulfate", slug: "magnesium-sulfate", genericName: "Magnesium sulfate", brandNames: ["MgSO₄"],
    drugClass: "Electrolyte / anticonvulsant", specialties: ["Obstetrics & Gynecology", "Emergency Medicine", "Pediatrics"], keywords: ["magnesium", "preeclampsia", "eclampsia", "asthma", "torsades"],
    indications: ["Preeclampsia/eclampsia prophylaxis & treatment", "Severe asthma (adjunct)", "Torsades de pointes", "Hypomagnesaemia"],
    doses: [
      {
        population: "adult", route: "IV", indication: "Preeclampsia/eclampsia",
        text: "4–6 g IV over 15–20 min, then 1–2 g/h infusion (continue 24 h post-delivery/per last seizure). Monitor reflexes, respirations, urine output.",
      },
      {
        population: "adult", route: "IV", indication: "Severe asthma",
        text: "2 g IV over 20 min.",
        weightBased: { min: 25, max: 75, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 2000, note: "Paediatric asthma: 25–75 mg/kg IV (max 2 g)." },
      },
    ],
    contraindications: ["Heart block", "Myasthenia gravis", "Renal failure (relative)"], majorWarnings: ["Respiratory depression/loss of reflexes at toxicity — have calcium gluconate available", "Hypotension"],
    renalConsideration: "Reduce dose in renal impairment.", preparations: ["IV 20% (2 g/10 mL), 50% (5 g/10 mL)"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- GI ---------- */
  {
    id: "ondansetron", slug: "ondansetron", genericName: "Ondansetron", brandNames: ["Zofran", "Vomitrol"],
    drugClass: "5-HT₃ antagonist (antiemetic)", specialties: ["Emergency Medicine", "Oncology", "Pediatrics"], keywords: ["ondansetron", "zofran", "antiemetic", "vomiting", "nausea"],
    indications: ["Chemotherapy-induced nausea", "Postoperative nausea", "Acute gastroenteritis vomiting (single dose, children)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "Nausea/vomiting",
        text: "4–8 mg PO/IV q8h PRN (max 32 mg/day).",
        weightBased: { min: 0.1, max: 0.15, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 8, maxDailyMg: 32 },
      },
      {
        population: "pediatric", route: "PO / IV", indication: "Vomiting (gastroenteritis)",
        text: "0.1–0.15 mg/kg/dose q8h (max 4 mg/dose; single 0.15 mg/kg dose for gastroenteritis).",
        weightBased: { min: 0.1, max: 0.15, per: "dose", frequencyPerDay: 3, maxPerDoseMg: 4 },
      },
    ],
    contraindications: ["Prolonged QT (congenital)"], majorWarnings: ["QT prolongation", "Serotonin syndrome (with serotonergic drugs)", "Constipation"],
    preparations: ["Tablet 4/8 mg", "ODT 4/8 mg", "Syrup 4 mg/5 mL", "IV 2 mg/mL"], lastReviewed: "2025-06-01", source: WHO_EML,
  },
  {
    id: "omeprazole", slug: "omeprazole", genericName: "Omeprazole", brandNames: ["Losec", "Meprazol"],
    drugClass: "Proton pump inhibitor", specialties: ["Gastroenterology", "Internal Medicine"], keywords: ["omeprazole", "ppi", "gerd", "ulcer", "losec"],
    indications: ["GERD", "Peptic ulcer disease", "H. pylori eradication (triple therapy)", "GI bleeding (IV, high dose)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "GERD / ulcer",
        text: "20–40 mg once daily (H. pylori: 20 mg q12h; GI bleeding: 80 mg IV load then 8 mg/h).",
        weightBased: { min: 0.7, max: 1, per: "day", frequencyPerDay: 1, maxDailyMg: 40 },
      },
      {
        population: "pediatric", route: "PO", indication: "GERD",
        text: "0.7–1 mg/kg/day once daily (max 40 mg/day).",
        weightBased: { min: 0.7, max: 1, per: "day", frequencyPerDay: 1, maxDailyMg: 40 },
      },
    ],
    contraindications: ["Omeprazole allergy"], majorWarnings: ["Long-term: B12 deficiency, hypomagnesaemia, fracture risk", "CYP2C19 interactions (clopidogrel)"],
    preparations: ["Capsule 20/40 mg", "IV 40 mg"], lastReviewed: "2025-06-01", source: WHO_EML,
  },

  /* ---------- TB / antiparasitic ---------- */
  {
    id: "isoniazid", slug: "isoniazid", genericName: "Isoniazid (INH)", brandNames: ["INH"],
    drugClass: "Antituberculous (bactericidal)", specialties: ["Pulmonology", "Infectious Disease"], keywords: ["isoniazid", "inh", "tuberculosis", "tb", "antituberculous"],
    indications: ["Tuberculosis (first-line, with rifampicin)", "Latent TB"],
    doses: [
      {
        population: "adult", route: "PO", indication: "TB treatment",
        text: "5 mg/kg/day (max 300 mg/day).",
        weightBased: { min: 5, max: 5, per: "day", frequencyPerDay: 1, maxDailyMg: 300 },
      },
      {
        population: "pediatric", route: "PO", indication: "TB treatment",
        text: "10 mg/kg/day (max 300 mg/day).",
        weightBased: { min: 10, max: 10, per: "day", frequencyPerDay: 1, maxDailyMg: 300 },
      },
    ],
    contraindications: ["Acute liver disease", "INH-resistant TB (as monotherapy)"], majorWarnings: ["Hepatitis (esp. with rifampicin — monitor LFTs)", "Peripheral neuropathy — pyridoxine (vit B6) 10–25 mg/day", "Drug interactions (CYP)"],
    preparations: ["Tablet 100/300 mg", "Syrup 50 mg/5 mL"], pregnancy: "Safe — first-line in pregnancy.", lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guidelines for treatment of drug-susceptible tuberculosis", year: 2022, url: "https://www.who.int/publications/i/item/9789240048126" },
  },
  {
    id: "rifampicin", slug: "rifampicin", genericName: "Rifampicin (Rifampin)", brandNames: ["Rifadin", "Rimactane"],
    drugClass: "Antituberculous (rifamycin)", specialties: ["Pulmonology", "Infectious Disease"], keywords: ["rifampicin", "rifampin", "tb", "tuberculosis", "antituberculous"],
    indications: ["Tuberculosis (first-line)", "Leprosy", "Meningococcal prophylaxis (short course)"],
    doses: [
      {
        population: "adult", route: "PO / IV", indication: "TB treatment",
        text: "10 mg/kg/day (max 600 mg/day).",
        weightBased: { min: 10, max: 10, per: "day", frequencyPerDay: 1, maxDailyMg: 600 },
      },
      {
        population: "pediatric", route: "PO", indication: "TB treatment",
        text: "15 mg/kg/day (max 600 mg/day).",
        weightBased: { min: 15, max: 15, per: "day", frequencyPerDay: 1, maxDailyMg: 600 },
      },
    ],
    contraindications: ["Rifampicin allergy"], majorWarnings: ["Orange discolouration of body fluids", "Hepatotoxicity", "Strong CYP3A4 inducer — reduces efficacy of OCP, warfarin, many drugs"],
    preparations: ["Capsule 150/300 mg", "Syrup 100 mg/5 mL", "IV 600 mg"], pregnancy: "Safe — first-line.", lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guidelines for treatment of drug-susceptible tuberculosis", year: 2022, url: "https://www.who.int/publications/i/item/9789240048126" },
  },
  {
    id: "ethambutol", slug: "ethambutol", genericName: "Ethambutol", brandNames: ["Myambutol"],
    drugClass: "Antituberculous", specialties: ["Pulmonology", "Infectious Disease"], keywords: ["ethambutol", "tb", "tuberculosis", "optic neuritis"],
    indications: ["Tuberculosis (first-line, with others)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "TB treatment",
        text: "15–25 mg/kg/day (max 1.6 g/day).",
        weightBased: { min: 15, max: 25, per: "day", frequencyPerDay: 1, maxDailyMg: 1600 },
      },
      {
        population: "pediatric", route: "PO", indication: "TB treatment",
        text: "15–25 mg/kg/day (max 1.6 g/day).",
        weightBased: { min: 15, max: 25, per: "day", frequencyPerDay: 1, maxDailyMg: 1600 },
      },
    ],
    majorWarnings: ["Optic neuritis (colour vision loss) — test visual acuity/colour monthly", "Renal excretion — reduce dose in renal impairment"],
    preparations: ["Tablet 400 mg"], lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guidelines for treatment of drug-susceptible tuberculosis", year: 2022, url: "https://www.who.int/publications/i/item/9789240048126" },
  },
  {
    id: "pyrazinamide", slug: "pyrazinamide", genericName: "Pyrazinamide", brandNames: ["Zinamide"],
    drugClass: "Antituberculous", specialties: ["Pulmonology", "Infectious Disease"], keywords: ["pyrazinamide", "tb", "tuberculosis"],
    indications: ["Tuberculosis (first-line, intensive phase)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "TB treatment",
        text: "25 mg/kg/day (max 2 g/day).",
        weightBased: { min: 25, max: 25, per: "day", frequencyPerDay: 1, maxDailyMg: 2000 },
      },
      {
        population: "pediatric", route: "PO", indication: "TB treatment",
        text: "30–35 mg/kg/day (max 2 g/day).",
        weightBased: { min: 30, max: 35, per: "day", frequencyPerDay: 1, maxDailyMg: 2000 },
      },
    ],
    majorWarnings: ["Hepatotoxicity", "Hyperuricaemia/gout (rare)", "Monitor LFTs"],
    preparations: ["Tablet 500 mg"], lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guidelines for treatment of drug-susceptible tuberculosis", year: 2022, url: "https://www.who.int/publications/i/item/9789240048126" },
  },
  {
    id: "albendazole", slug: "albendazole", genericName: "Albendazole", brandNames: ["Zentel"],
    drugClass: "Anthelmintic (benzimidazole)", specialties: ["Infectious Disease", "Pediatrics"], keywords: ["albendazole", "zentel", "worm", "helminth", "deworming"],
    indications: ["Soil-transmitted helminths (roundworm, hookworm, whipworm)", "Strongyloidiasis", "Neurocysticercosis (with steroids)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "STH (deworming)",
        text: "400 mg single dose (with food).",
        weightBased: { min: 10, max: 10, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 400, note: "12–23 months: 200 mg single dose." },
      },
      {
        population: "pediatric", route: "PO", indication: "STH (deworming)",
        text: "400 mg single dose (≥ 2 years); 200 mg single dose (12–23 months); ≥ 12 months per WHO deworming guidelines.",
        weightBased: { min: 10, max: 10, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 400 },
      },
    ],
    contraindications: ["First trimester pregnancy", "Known hypersensitivity"], majorWarnings: ["Bone marrow suppression (prolonged use)", "Hepatotoxicity"],
    preparations: ["Tablet 400 mg", "Suspension 100 mg/5 mL"], pregnancy: "Avoid in first trimester (mass deworming programs exclude pregnancy).", lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guideline: preventive chemotherapy for soil-transmitted helminthiases", year: 2017, url: "https://www.who.int/publications/i/item/9789241550116" },
  },
  {
    id: "artemether-lumefantrine", slug: "artemether-lumefantrine", genericName: "Artemether-lumefantrine", brandNames: ["Coartem", "Riamet"],
    drugClass: "Artemisinin-based combination therapy (ACT)", specialties: ["Infectious Disease", "Emergency Medicine"], keywords: ["artemether", "lumefantrine", "coartem", "malaria", "act"],
    indications: ["Uncomplicated falciparum malaria"],
    doses: [
      {
        population: "all", route: "PO", indication: "Uncomplicated malaria",
        text: "Weight-band dosing (20/120 mg tablets): 5–14 kg: 1 tab; 15–24 kg: 2 tabs; 25–34 kg: 3 tabs; ≥ 35 kg: 4 tabs — at 0, 8, 24, 36, 48 and 60 h (6 doses total).",
        weightBased: { min: 1.15, max: 1.7, per: "dose", frequencyPerDay: 1, maxPerDoseMg: 4, doseUnit: "mg", note: "Use the official weight-band table (6 doses over 3 days) — the per-kg figure is approximate." },
      },
    ],
    contraindications: ["First trimester (prefer quinine-based regimens per WHO)", "Severe malaria (IV artesunate instead)"], majorWarnings: ["QT prolongation (avoid with halofantrine)", "Take with fatty food to improve absorption", "Repeat course if vomiting within 30 min"],
    preparations: ["Tablet 20/120 mg"], pregnancy: "Second/third trimester: safe; first trimester: specialist choice.", lastReviewed: "2025-06-01", source: { org: "WHO", title: "Guidelines for malaria", year: 2023, url: "https://www.who.int/publications/i/item/guidelines-for-malaria" },
  },

  /* ---------- Paediatrics / micronutrients ---------- */
  {
    id: "zinc-sulfate", slug: "zinc-sulfate", genericName: "Zinc sulfate", brandNames: ["Zincid", "Zinc"],
    drugClass: "Micronutrient", specialties: ["Pediatrics", "Nutrition"], keywords: ["zinc", "diarrhea", "micronutrient", "children"],
    indications: ["Acute diarrhoea in children (WHO — reduces duration/severity)"],
    doses: [
      {
        population: "pediatric", route: "PO", indication: "Acute diarrhoea",
        text: "< 6 months: 10 mg elemental zinc once daily × 10–14 days. ≥ 6 months: 20 mg once daily × 10–14 days.",
      },
    ],
    majorWarnings: ["Nausea (take with food)", "Do not exceed recommended dose"], preparations: ["Tablet 20 mg", "Syrup 10 mg/5 mL"], lastReviewed: "2025-06-01", source: { org: "WHO/UNICEF", title: "Clinical management of acute diarrhoea (zinc + ORS)", year: 2005, url: "https://www.who.int/publications/i/item/9241593180" },
  },
  {
    id: "ors", slug: "ors", genericName: "Oral Rehydration Salts (ORS)", brandNames: ["Oralit", "ORS"],
    drugClass: "Oral rehydration solution", specialties: ["Pediatrics", "Emergency Medicine", "Nutrition"], keywords: ["ors", "oralit", "rehydration", "diarrhea", "cholera"],
    indications: ["Diarrhoea with some dehydration (Plan B)", "Cholera", "Maintenance after rehydration"],
    doses: [
      {
        population: "all", route: "PO", indication: "Rehydration (WHO Plan B)",
        text: "WHO low-osmolarity ORS. Give in small frequent sips: after each loose stool — < 2 years: 50–100 mL; 2–10 years: 100–200 mL; > 10 years and adults: ad libitum. Reassess at 2–4 h.",
      },
    ],
    majorWarnings: ["Not a substitute for IV therapy in severe dehydration (Plan C)", "Use clean water", "Reassess hydration status regularly"], preparations: ["Sachet (WHO formula): Na 75 mmol/L, K 20, Cl 65, citrate 10, glucose 75 mmol/L"], lastReviewed: "2025-06-01", source: { org: "WHO", title: "The treatment of diarrhoea — a manual for physicians", year: 2005, url: "https://www.who.int/publications/i/item/9241593180" },
  },
  {
    id: "vitamin-d", slug: "vitamin-d", genericName: "Vitamin D (Cholecalciferol)", brandNames: ["Calcivit D"],
    drugClass: "Vitamin", specialties: ["Pediatrics", "Endocrinology", "Nutrition"], keywords: ["vitamin d", "cholecalciferol", "rickets", "deficiency"],
    indications: ["Vitamin D deficiency/insufficiency", "Rickets", "Prophylaxis (infants)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Deficiency treatment",
        text: "50,000 IU weekly × 8 weeks (or 1500–2000 IU daily), then maintenance 800–2000 IU daily. Recheck 25-OH-D after 3 months.",
      },
      {
        population: "pediatric", route: "PO", indication: "Deficiency / prophylaxis",
        text: "Prophylaxis (0–1 y): 400 IU daily. Deficiency: 1000–2000 IU daily for 12 weeks (infants/children) — specialist dose for rickets may be higher.",
      },
    ],
    majorWarnings: ["Toxicity at very high doses (hypercalcaemia)"], preparations: ["Capsule 1000/5000 IU", "Drops 400 IU/drop"], lastReviewed: "2025-06-01", source: { org: "Endocrine Society", title: "Evaluation, treatment, and prevention of vitamin D deficiency", year: 2011, url: "https://academic.oup.com/jcem/article/96/7/1911/2833671" },
  },
  {
    id: "ferrous-sulfate", slug: "ferrous-sulfate", genericName: "Ferrous sulfate (Iron)", brandNames: ["Ferrosi", "Iron"],
    drugClass: "Haematinic", specialties: ["Hematology", "Pediatrics", "Obstetrics & Gynecology"], keywords: ["iron", "ferrous", "anemia", "ida", "ferritin"],
    indications: ["Iron deficiency anaemia", "Iron prophylaxis (pregnancy, infants)"],
    doses: [
      {
        population: "adult", route: "PO", indication: "Iron deficiency anaemia",
        text: "65 mg elemental iron (e.g. 325 mg ferrous sulfate) 1–3× daily (dose by severity; continue 3 months after Hb normalises).",
        weightBased: { min: 2, max: 3, per: "day", frequencyPerDay: 1, maxDailyMg: 200, doseUnit: "mg", note: "Elemental iron dosing. Ferrous sulfate 325 mg = 65 mg elemental iron." },
      },
      {
        population: "pediatric", route: "PO", indication: "Iron deficiency anaemia",
        text: "3 mg/kg/day elemental iron in 1–2 divided doses (prophylaxis 1 mg/kg/day).",
        weightBased: { min: 1, max: 3, per: "day", frequencyPerDay: 1, maxDailyMg: 150, doseUnit: "mg" },
      },
    ],
    majorWarnings: ["Overdose is toxic in children — store safely", "Constipation/black stools", "Take with vitamin C, avoid with tea/coffee"], preparations: ["Tablet 325 mg (65 mg Fe)", "Syrup 25 mg Fe/5 mL", "Drops 15 mg Fe/mL"], pregnancy: "Standard prophylaxis 30–60 mg elemental iron daily.", lastReviewed: "2025-06-01", source: WHO_EML,
  },
  ...EXTRA_DRUGS,
  ...EXTRA_DRUGS_B,
  ...EXTRA_DRUGS_C,
  ...EXTRA_DRUGS_D,
  ...EXTRA_DRUGS_E,
  ...EXTRA_DRUGS_F,
  ...EXTRA_DRUGS_G,
  ...EXTRA_DRUGS_H,
  ...EXTRA_DRUGS_I,
  ...EXTRA_DRUGS_J,
  ...EXTRA_DRUGS_K,
  ...EXTRA_DRUGS_L,
];

export const DRUGS_BY_SLUG: Record<string, Drug> = Object.fromEntries(DRUGS.map((d) => [d.slug, d]));
export const DRUG_CLASSES: string[] = [...new Set(DRUGS.map((d) => d.drugClass))].sort();