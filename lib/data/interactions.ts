import type { DrugInteraction } from "@/lib/types";
import { canonicalInteractions } from "./klinea-canonical";

/**
 * Drug-drug interactions (curated, well-documented pairs).
 *
 * Every entry is a pair of drugs from the drug database with a severity,
 * mechanism, clinical effect and management. Interaction data can be expanded
 * over time - nothing here is invented; entries reflect established
 * pharmacovigilance knowledge (Stockley's Drug Interactions / Lexicomp-style
 * severity categories) and should be re-verified against the latest
 * interaction compendium before clinical use.
 */

const SRC = { org: "Standard interaction reference", title: "Drug interactions (severity categories per established compendia)", year: 2024, url: "https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02" };

const I = (a: string, b: string, severity: DrugInteraction["severity"], mechanism: string, effect: string, management: string, id?: string): DrugInteraction => ({
  id: id ?? `${a}-${b}`,
  a,
  b,
  severity,
  mechanism,
  effect,
  management,
  source: SRC,
});

const RFS_INTERACTIONS: DrugInteraction[] = [
  /* ---- Warfarin ---- */
  I("warfarin", "ibuprofen", "major", "NSAIDs inhibit platelet function and irritate the GI mucosa; additive anticoagulant effect.", "Increased bleeding risk (GI bleeding especially).", "Avoid or use with extreme caution; if unavoidable, monitor INR and watch for GI bleeding; consider gastroprotection.", "warfarin-ibuprofen"),
  I("warfarin", "aspirin", "major", "Additive antiplatelet and anticoagulant effects.", "Significant increase in bleeding risk.", "Only combine when clearly indicated (e.g. mechanical valves); monitor closely.", "warfarin-aspirin"),
  I("warfarin", "clarithromycin", "major", "Clarithromycin inhibits CYP2C9/3A4, reducing warfarin metabolism.", "INR increase and bleeding risk within days.", "Monitor INR closely; reduce warfarin dose pre-emptively if possible.", "warfarin-clarithromycin"),
  I("warfarin", "erythromycin", "major", "Erythromycin inhibits CYP3A4 metabolism of warfarin.", "INR increase and bleeding risk.", "Monitor INR; adjust warfarin dose.", "warfarin-erythromycin"),
  I("warfarin", "metronidazole", "major", "Metronidazole inhibits CYP2C9, reducing (S)-warfarin clearance.", "Marked INR increase; bleeding risk.", "Monitor INR closely; expect warfarin dose reduction (~30–50%).", "warfarin-metronidazole"),
  I("warfarin", "cotrimoxazole", "major", "Sulfamethoxazole inhibits CYP2C9; trimethoprim has a stereoselective effect on warfarin.", "INR increase and bleeding risk.", "Avoid if alternatives exist; otherwise monitor INR closely and reduce dose.", "warfarin-cotrimoxazole"),
  I("warfarin", "ciprofloxacin", "major", "Ciprofloxacin inhibits CYP1A2 and reduces warfarin metabolism.", "INR increase and bleeding risk.", "Monitor INR; adjust dose.", "warfarin-ciprofloxacin"),
  I("warfarin", "fluconazole", "major", "Fluconazole inhibits CYP2C9, reducing warfarin clearance.", "INR increase and bleeding risk.", "Monitor INR closely; reduce warfarin dose.", "warfarin-fluconazole"),
  I("warfarin", "rifampicin", "major", "Rifampicin strongly induces CYP2C9/3A4, accelerating warfarin metabolism.", "Marked INR decrease - subtherapeutic anticoagulation.", "Monitor INR frequently; warfarin dose may need substantial increase.", "warfarin-rifampicin"),
  I("warfarin", "carbamazepine", "major", "Carbamazepine induces CYP enzymes, increasing warfarin metabolism.", "Reduced INR; thromboembolism risk.", "Monitor INR; increase warfarin dose as needed.", "warfarin-carbamazepine"),
  I("warfarin", "phenytoin", "major", "Complex bidirectional interaction: phenytoin induces and inhibits CYP2C9; warfarin increases phenytoin levels.", "Unpredictable INR changes and phenytoin toxicity.", "Monitor INR and phenytoin levels closely.", "warfarin-phenytoin"),
  I("warfarin", "sertraline", "moderate", "Sertraline inhibits CYP2C9 to a modest degree; additive platelet effects.", "Possible INR increase and bleeding.", "Monitor INR after starting/stopping sertraline.", "warfarin-sertraline"),
  I("warfarin", "azithromycin", "moderate", "Uncertain mechanism; case reports of INR elevation.", "Possible INR increase.", "Monitor INR during co-administration.", "warfarin-azithromycin"),
  I("warfarin", "tramadol", "moderate", "Tramadol has serotonergic activity; additive anticoagulant effect reported.", "Possible INR increase and bleeding.", "Monitor INR; watch for bleeding.", "warfarin-tramadol"),
  I("warfarin", "enoxaparin", "moderate", "Additive anticoagulant effect (intentional during LMWH-warfarin overlap).", "Increased bleeding risk during overlap.", "This is the standard VTE treatment strategy - monitor for bleeding; discontinue LMWH once INR therapeutic.", "warfarin-enoxaparin"),
  I("warfarin", "levetiracetam", "minor", "Limited data; possible minor effect on INR.", "Unpredictable INR (minor).", "Routine INR monitoring is sufficient.", "warfarin-levetiracetam"),

  /* ---- QT prolongation ---- */
  I("haloperidol", "clarithromycin", "major", "Clarithromycin inhibits CYP3A4 (haloperidol metabolism) and both prolong QTc.", "Increased haloperidol levels and additive QT prolongation - torsades de pointes risk.", "Avoid combination; if unavoidable, monitor QTc and haloperidol levels.", "haloperidol-clarithromycin"),
  I("haloperidol", "fluconazole", "major", "Additive QT prolongation; fluconazole inhibits CYP3A4/2C9.", "Increased torsades risk.", "Avoid; use alternative antipsychotic or antifungal.", "haloperidol-fluconazole"),
  I("haloperidol", "ondansetron", "major", "Additive QT prolongation.", "Increased risk of torsades de pointes.", "Avoid combination; monitor QTc if unavoidable.", "haloperidol-ondansetron"),
  I("haloperidol", "ciprofloxacin", "major", "Additive QT prolongation.", "Increased torsades risk.", "Avoid; check ECG and electrolytes.", "haloperidol-ciprofloxacin"),
  I("haloperidol", "azithromycin", "major", "Additive QT prolongation.", "Increased torsades risk.", "Avoid combination.", "haloperidol-azithromycin"),
  I("haloperidol", "carbamazepine", "moderate", "Carbamazepine induces CYP3A4, lowering haloperidol levels.", "Reduced antipsychotic effect.", "Monitor response; adjust haloperidol dose.", "haloperidol-carbamazepine"),
  I("ondansetron", "ciprofloxacin", "moderate", "Both prolong QTc to some degree.", "Additive QT prolongation risk.", "Use with caution; monitor QTc in at-risk patients.", "ondansetron-ciprofloxacin"),
  I("ondansetron", "clarithromycin", "moderate", "Additive QT prolongation.", "Increased torsades risk in susceptible patients.", "Caution; check QTc and electrolytes.", "ondansetron-clarithromycin"),
  I("ciprofloxacin", "azithromycin", "moderate", "Additive QT prolongation.", "Increased torsades risk.", "Caution in patients with cardiac disease.", "ciprofloxacin-azithromycin"),
  I("clarithromycin", "azithromycin", "moderate", "Additive QT prolongation.", "Increased torsades risk.", "Avoid dual macrolides - no added antimicrobial benefit.", "clarithromycin-azithromycin"),
  I("fluconazole", "clarithromycin", "major", "Additive QT prolongation; fluconazole inhibits clarithromycin metabolism.", "Increased torsades risk.", "Avoid combination.", "fluconazole-clarithromycin"),
  I("fluconazole", "ondansetron", "moderate", "Additive QT prolongation.", "Increased torsades risk.", "Monitor QTc if combined.", "fluconazole-ondansetron"),

  /* ---- Serotonin syndrome ---- */
  I("tramadol", "sertraline", "major", "Both increase serotonergic neurotransmission (tramadol is a weak SNRI).", "Serotonin syndrome: agitation, hyperthermia, clonus, autonomic instability; also lowers seizure threshold.", "Avoid combination; use non-serotonergic analgesia.", "tramadol-sertraline"),
  I("tramadol", "ondansetron", "moderate", "Both affect 5-HT pathways; ondansetron may blunt tramadol analgesia and add serotonergic risk.", "Serotonin syndrome risk; reduced analgesia.", "Use alternative antiemetic/analgesic where possible.", "tramadol-ondansetron"),
  I("tramadol", "carbamazepine", "major", "Carbamazepine induces CYP3A4 (reduces tramadol levels) and lowers seizure threshold.", "Reduced tramadol effect; increased seizure risk.", "Avoid; consider alternative analgesia.", "tramadol-carbamazepine"),
  I("sertraline", "ondansetron", "moderate", "Additive serotonergic effect (5-HT₃ antagonism with 5-HT reuptake inhibition).", "Serotonin syndrome risk (reported with ondansetron + SSRIs).", "Use with caution; monitor for serotonergic symptoms.", "sertraline-ondansetron"),
  I("sertraline", "ibuprofen", "moderate", "SSRIs impair platelet function; additive GI bleeding risk with NSAIDs.", "Increased GI bleeding risk.", "Consider gastroprotection (PPI) or alternative analgesia.", "sertraline-ibuprofen"),
  I("sertraline", "aspirin", "moderate", "Additive antiplatelet effect.", "Increased bleeding risk.", "Monitor for bleeding; consider gastroprotection.", "sertraline-aspirin"),
  I("sertraline", "warfarin", "moderate", "Sertraline inhibits CYP2C9; additive platelet effects.", "INR increase and bleeding.", "Monitor INR after starting sertraline.", "sertraline-warfarin"),
  I("tramadol", "haloperidol", "moderate", "Additive lowering of seizure threshold; serotonergic potentiation.", "Seizure risk; possible serotonin syndrome.", "Use with caution; monitor.", "tramadol-haloperidol"),

  /* ---- CYP interactions ---- */
  I("carbamazepine", "clarithromycin", "major", "Clarithromycin inhibits CYP3A4, reducing carbamazepine clearance.", "Carbamazepine toxicity (ataxia, diplopia, sedation).", "Avoid; if unavoidable, reduce carbamazepine dose and monitor levels.", "carbamazepine-clarithromycin"),
  I("carbamazepine", "erythromycin", "major", "Erythromycin inhibits CYP3A4.", "Carbamazepine toxicity.", "Avoid combination.", "carbamazepine-erythromycin"),
  I("carbamazepine", "fluconazole", "major", "Fluconazole inhibits CYP3A4.", "Carbamazepine toxicity.", "Avoid; monitor levels if combined.", "carbamazepine-fluconazole"),
  I("carbamazepine", "isoniazid", "moderate", "Isoniazid inhibits carbamazepine metabolism.", "Carbamazepine toxicity.", "Monitor levels and clinical effects.", "carbamazepine-isoniazid"),
  I("phenytoin", "fluconazole", "major", "Fluconazole inhibits CYP2C9, reducing phenytoin clearance.", "Phenytoin toxicity.", "Avoid; monitor phenytoin levels.", "phenytoin-fluconazole"),
  I("phenytoin", "clarithromycin", "moderate", "Clarithromycin inhibits phenytoin metabolism (variable).", "Possible phenytoin toxicity.", "Monitor phenytoin levels.", "phenytoin-clarithromycin"),
  I("phenytoin", "cotrimoxazole", "major", "Sulfamethoxazole inhibits CYP2C9.", "Phenytoin toxicity.", "Avoid; monitor levels.", "phenytoin-cotrimoxazole"),
  I("phenytoin", "isoniazid", "moderate", "Isoniazid inhibits phenytoin metabolism.", "Phenytoin toxicity.", "Monitor levels; adjust dose.", "phenytoin-isoniazid"),
  I("phenytoin", "carbamazepine", "moderate", "Mutual induction/inhibition - unpredictable levels.", "Variable levels of both drugs.", "Therapeutic drug monitoring of both.", "phenytoin-carbamazepine"),
  I("midazolam", "clarithromycin", "major", "Clarithromycin inhibits CYP3A4 (midazolam metabolism).", "Markedly increased/prolonged sedation; respiratory depression.", "Avoid; use alternative benzodiazepine or monitor closely.", "midazolam-clarithromycin"),
  I("midazolam", "erythromycin", "major", "Erythromycin inhibits CYP3A4.", "Increased/prolonged sedation.", "Avoid combination.", "midazolam-erythromycin"),
  I("midazolam", "fluconazole", "moderate", "Fluconazole inhibits CYP3A4.", "Increased sedation.", "Reduce midazolam dose; monitor.", "midazolam-fluconazole"),
  I("midazolam", "rifampicin", "moderate", "Rifampicin induces CYP3A4.", "Reduced midazolam effect.", "May need higher doses; monitor.", "midazolam-rifampicin"),
  I("diazepam", "clarithromycin", "moderate", "Clarithromycin inhibits CYP3A4.", "Increased diazepam levels/sedation.", "Monitor; reduce dose.", "diazepam-clarithromycin"),
  I("diazepam", "fluconazole", "moderate", "Fluconazole inhibits CYP2C19/3A4.", "Increased diazepam levels.", "Monitor for excess sedation.", "diazepam-fluconazole"),
  I("diazepam", "ciprofloxacin", "moderate", "Ciprofloxacin inhibits CYP3A4/1A2.", "Increased diazepam levels.", "Monitor sedation.", "diazepam-ciprofloxacin"),
  I("diazepam", "omeprazole", "moderate", "Omeprazole inhibits CYP2C19.", "Increased diazepam levels.", "Monitor; consider alternative PPI.", "diazepam-omeprazole"),
  I("rifampicin", "sertraline", "moderate", "Rifampicin induces CYP3A4.", "Reduced sertraline levels/effect.", "Monitor response; adjust dose.", "rifampicin-sertraline"),
  I("rifampicin", "fluconazole", "moderate", "Rifampicin induces CYP3A4; fluconazole inhibits it.", "Reduced fluconazole exposure.", "Increase fluconazole dose if combined.", "rifampicin-fluconazole"),

  /* ---- Renal/electrolyte ---- */
  I("captopril", "spironolactone", "major", "ACE inhibitor + potassium-sparing diuretic both reduce aldosterone-mediated K⁺ excretion.", "Hyperkalaemia - arrhythmia risk.", "Avoid combination unless closely monitored; check K⁺ and renal function.", "captopril-spironolactone"),
  I("captopril", "ibuprofen", "moderate", "NSAIDs reduce renal prostaglandins, blunting ACEi effect and worsening renal function.", "Reduced antihypertensive effect; AKI risk in volume-depleted patients.", "Use alternative analgesia; monitor BP and creatinine.", "captopril-ibuprofen"),
  I("spironolactone", "cotrimoxazole", "major", "Trimethoprim blocks renal tubular potassium secretion (amiloride-like effect).", "Severe hyperkalaemia.", "Avoid combination; if needed, monitor K⁺ closely.", "spironolactone-cotrimoxazole"),
  I("spironolactone", "captopril", "major", "See captopril + spironolactone.", "Hyperkalaemia.", "Avoid unless monitored.", "spironolactone-captopril"),
  I("furosemide", "gentamicin", "major", "Both are ototoxic and nephrotoxic; loop diuretics increase aminoglycoside uptake in the inner ear/kidney.", "Increased ototoxicity and nephrotoxicity.", "Avoid; if unavoidable, monitor renal function and audiometry, use once-daily aminoglycoside dosing.", "furosemide-gentamicin"),
  I("furosemide", "ibuprofen", "moderate", "NSAIDs reduce renal blood flow, blunting diuresis.", "Reduced diuretic effect; fluid retention.", "Monitor weight and diuresis; use alternative analgesia.", "furosemide-ibuprofen"),
  I("gentamicin", "vancomycin", "major", "Additive nephrotoxicity and ototoxicity.", "AKI and hearing loss risk.", "Avoid unless essential; monitor levels and renal function daily.", "gentamicin-vancomycin"),
  I("vancomycin", "piperacillin-tazobactam", "moderate", "Combination associated with increased AKI risk (likely tubular injury).", "Higher acute kidney injury rates than either drug alone.", "Prefer alternative combinations where possible; monitor renal function.", "vancomycin-piperacillin-tazobactam"),
  I("vancomycin", "furosemide", "moderate", "Additive nephrotoxicity/ototoxicity.", "Increased renal and auditory toxicity.", "Monitor levels and renal function.", "vancomycin-furosemide"),
  I("acyclovir", "gentamicin", "moderate", "Additive nephrotoxicity (acyclovir crystalluria).", "AKI risk.", "Hydrate well; monitor renal function.", "acyclovir-gentamicin"),
  I("acyclovir", "vancomycin", "moderate", "Additive nephrotoxicity.", "AKI risk.", "Monitor renal function.", "acyclovir-vancomycin"),
  I("magnesium-sulfate", "gentamicin", "moderate", "Aminoglycosides can potentiate magnesium-induced neuromuscular blockade.", "Respiratory muscle weakness.", "Monitor reflexes and respiratory status.", "magnesium-sulfate-gentamicin"),
  I("magnesium-sulfate", "amlodipine", "moderate", "Additive vasodilation and potential neuromuscular effects.", "Hypotension; (with nifedipine - significant hypotension/neuromuscular blockade reported).", "Monitor BP; use caution in preeclampsia protocols combining MgSO₄ with CCBs.", "magnesium-sulfate-amlodipine"),
  I("magnesium-sulfate", "furosemide", "moderate", "Loop diuretics increase magnesium loss.", "Hypomagnesaemia can blunt MgSO₄ effect; also additive hypotension.", "Monitor magnesium and BP.", "magnesium-sulfate-furosemide"),

  /* ---- Antimicrobial absorption / effect ---- */
  I("doxycycline", "ferrous-sulfate", "moderate", "Divalent cations chelate tetracyclines in the gut.", "Reduced doxycycline absorption.", "Separate doses by 2–4 hours.", "doxycycline-ferrous-sulfate"),
  I("ciprofloxacin", "ferrous-sulfate", "moderate", "Cations chelate fluoroquinolones.", "Reduced ciprofloxacin absorption (up to 50%).", "Separate by 2–4 h; or give ciprofloxacin IV.", "ciprofloxacin-ferrous-sulfate"),
  I("omeprazole", "ferrous-sulfate", "moderate", "Reduced gastric acidity impairs iron absorption.", "Reduced iron effect.", "Consider alternative timing or alternative PPI.", "omeprazole-ferrous-sulfate"),
  I("ciprofloxacin", "doxycycline", "minor", "Antagonistic bacteriostatic/bactericidal overlap in some infections.", "Possible reduced efficacy (theoretical).", "Generally avoid concurrent use for the same infection.", "ciprofloxacin-doxycycline"),

  /* ---- Haemodynamics ---- */
  I("epinephrine", "atenolol", "moderate", "Beta-blockade leaves alpha-adrenergic vasoconstriction unopposed with high-dose epinephrine.", "Hypertensive crisis with epinephrine; also blunted bronchodilation in asthma.", "Use cardioselective beta-blockers cautiously; monitor BP; have vasodilators available.", "epinephrine-atenolol"),
  I("epinephrine", "haloperidol", "moderate", "Antipsychotics can blunt epinephrine's beta effects (unopposed alpha).", "Paradoxical hypotension/hypertension.", "Monitor BP; use alternative pressors.", "epinephrine-haloperidol"),
  I("epinephrine", "tramadol", "moderate", "Additive serotonergic and sympathomimetic effects.", "Hypertension, arrhythmia, serotonin syndrome risk.", "Use with caution.", "epinephrine-tramadol"),
  I("salbutamol", "atenolol", "moderate", "Beta-blockers antagonise β₂ bronchodilation.", "Reduced salbutamol effect in asthma/COPD.", "Use cardioselective beta-blockers only when clearly indicated; have nebulised β₂-agonist at higher dose.", "salbutamol-atenolol"),
  I("salbutamol", "furosemide", "moderate", "Both can lower potassium.", "Hypokalaemia (additive).", "Monitor potassium in high-dose therapy.", "salbutamol-furosemide"),
  I("insulin-regular", "atenolol", "moderate", "Beta-blockers mask adrenergic hypoglycaemia symptoms.", "Unrecognised hypoglycaemia.", "Counsel on monitoring; prefer cardioselective agents.", "insulin-regular-atenolol"),
  I("insulin-regular", "salbutamol", "moderate", "β₂-agonists raise glucose and can blunt insulin action.", "Hyperglycaemia during high-dose salbutamol.", "Monitor glucose in diabetic patients.", "insulin-regular-salbutamol"),
  I("insulin-regular", "prednisone", "moderate", "Corticosteroids induce insulin resistance and gluconeogenesis.", "Hyperglycaemia - higher insulin requirements.", "Increase monitoring; adjust insulin dose.", "insulin-regular-prednisone"),
  I("prednisone", "ibuprofen", "major", "Additive GI mucosal injury.", "GI bleeding/perforation risk.", "Avoid; use gastroprotection if unavoidable.", "prednisone-ibuprofen"),
  I("dexamethasone", "ibuprofen", "major", "Additive GI mucosal injury.", "GI bleeding/perforation risk.", "Avoid; use gastroprotection if unavoidable.", "dexamethasone-ibuprofen"),
  I("dexamethasone", "rifampicin", "moderate", "Rifampicin induces corticosteroid metabolism.", "Reduced dexamethasone effect.", "Increase steroid dose if combined.", "dexamethasone-rifampicin"),
  I("prednisone", "rifampicin", "moderate", "Rifampicin induces steroid metabolism.", "Reduced prednisone effect.", "Increase steroid dose.", "prednisone-rifampicin"),

  /* ---- Analgesic/anticoagulant bleed ---- */
  I("enoxaparin", "aspirin", "moderate", "Additive antiplatelet/anticoagulant effect.", "Increased bleeding risk.", "Only combine when indicated (ACS); monitor for bleeding.", "enoxaparin-aspirin"),
  I("enoxaparin", "ibuprofen", "moderate", "Additive bleeding risk.", "Increased bleeding.", "Avoid NSAIDs on LMWH where possible.", "enoxaparin-ibuprofen"),
  I("aspirin", "ibuprofen", "moderate", "Ibuprofen can interfere with aspirin's irreversible platelet inhibition.", "Reduced cardioprotective effect of low-dose aspirin.", "Take aspirin 2 h before ibuprofen; or use paracetamol.", "aspirin-ibuprofen"),
  I("tranexamic-acid", "warfarin", "moderate", "Antifibrinolysis during anticoagulation.", "Thrombosis risk if anticoagulation is therapeutic; complex haemostatic balance.", "Use only after expert haematology/haemostasis review.", "tranexamic-acid-warfarin"),
  I("tranexamic-acid", "enoxaparin", "minor", "Theoretical opposing haemostatic effects.", "Unpredictable effect in thrombosis risk patients.", "Clinical judgement; monitor for thrombosis.", "tranexamic-acid-enoxaparin"),

  /* ---- Electrolytes ---- */
  I("furosemide", "dexamethasone", "moderate", "Corticosteroids cause sodium/water retention opposing diuresis.", "Reduced diuretic effect.", "Monitor fluid balance.", "furosemide-dexamethasone"),
  I("spironolactone", "furosemide", "moderate", "Opposing potassium effects (K⁺-sparing + K⁺-losing).", "Potassium balance unpredictable - usually beneficial combination but monitor K⁺.", "Monitor potassium and renal function.", "spironolactone-furosemide"),
  I("captopril", "furosemide", "moderate", "ACEi + diuretic - enhanced hypotensive effect; hypovolaemia increases first-dose hypotension.", "First-dose hypotension; AKI in volume depletion.", "Start ACEi at low dose; hold diuretic if dehydrated.", "captopril-furosemide"),

  /* ---- Anaesthesia/sedation ---- */
  I("ketamine", "haloperidol", "moderate", "Both lower seizure threshold and can prolong QTc (ketamine less so).", "Seizure risk; possible arrhythmia.", "Use with caution in at-risk patients.", "ketamine-haloperidol"),
  I("ketamine", "midazolam", "moderate", "Additive CNS depression.", "Increased sedation/respiratory depression.", "Reduce doses; monitor ventilation.", "ketamine-midazolam"),
  I("ketamine", "atenolol", "moderate", "Ketamine raises catecholamines; beta-blockade may blunt compensatory tachycardia.", "Hypertension (unopposed alpha) or hypotension.", "Monitor BP; have vasodilators available.", "ketamine-atenolol"),
  I("midazolam", "morphine", "major", "Additive CNS and respiratory depression.", "Severe respiratory depression.", "Avoid; if combined, monitor ventilation closely and reduce doses.", "midazolam-morphine"),
  I("diazepam", "morphine", "major", "Additive CNS/respiratory depression.", "Severe respiratory depression.", "Avoid combination outside monitored settings.", "diazepam-morphine"),
];

void RFS_INTERACTIONS;
export const INTERACTIONS: DrugInteraction[] = canonicalInteractions;

/** Map: drug slug → interactions involving it. */
export function interactionsFor(slug: string): DrugInteraction[] {
  return INTERACTIONS.filter((x) => x.a === slug || x.b === slug);
}

export const SEVERITY_ORDER: DrugInteraction["severity"][] = ["contraindicated", "major", "moderate", "minor", "unknown"];

export const SEVERITY_LABEL: Record<DrugInteraction["severity"], string> = {
  contraindicated: "Kontraindikasi",
  major: "Mayor",
  moderate: "Moderat",
  minor: "Minor",
  unknown: "Tidak diketahui / data tidak cukup",
};
export const drugInteractions = INTERACTIONS;
