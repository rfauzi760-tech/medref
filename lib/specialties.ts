export interface Specialty {
  slug: string;
  name: string;
  description: string;
}

export const SPECIALTIES: Specialty[] = [
  { slug: "emergency-medicine", name: "Emergency Medicine", description: "Resuscitation, risk stratification and acute presentations." },
  { slug: "internal-medicine", name: "Internal Medicine", description: "Adult hospital medicine across organ systems." },
  { slug: "pediatrics", name: "Pediatrics", description: "Child health, growth, development and pediatric dosing." },
  { slug: "neonatology", name: "Neonatology", description: "Newborn assessment and neonatal emergencies." },
  { slug: "obstetrics-gynecology", name: "Obstetrics & Gynecology", description: "Pregnancy, obstetric risk and women's health." },
  { slug: "infectious-disease", name: "Infectious Disease", description: "Infections, sepsis and antimicrobial therapy." },
  { slug: "cardiology", name: "Cardiology", description: "Coronary syndromes, arrhythmia and heart failure risk tools." },
  { slug: "pulmonology", name: "Pulmonology", description: "Airway, pneumonia, PE and respiratory failure." },
  { slug: "gastroenterology", name: "Gastroenterology", description: "GI bleeding, liver and digestive disease." },
  { slug: "hepatology", name: "Hepatology", description: "Liver disease severity and transplant prioritisation." },
  { slug: "nephrology", name: "Nephrology", description: "Kidney function, AKI and CKD." },
  { slug: "hypertension", name: "Hypertension", description: "Blood pressure management and lifestyle therapy." },
  { slug: "endocrinology", name: "Endocrinology", description: "Diabetes, ketoacidosis and metabolic disorders." },
  { slug: "neurology", name: "Neurology", description: "Stroke, seizures and neurological emergencies." },
  { slug: "hematology", name: "Hematology", description: "Anemia, coagulation and transfusion." },
  { slug: "oncology", name: "Oncology", description: "Cancer treatment and supportive care." },
  { slug: "surgery", name: "Surgery", description: "Surgical decision-making and perioperative care." },
  { slug: "orthopedics", name: "Orthopedics", description: "Fractures and musculoskeletal care." },
  { slug: "urology", name: "Urology", description: "Urinary tract and male reproductive system." },
  { slug: "ent", name: "ENT", description: "Ear, nose and throat — infections and airway." },
  { slug: "ophthalmology", name: "Ophthalmology", description: "Eye emergencies and vision." },
  { slug: "dermatology", name: "Dermatology", description: "Skin disease and dermatologic emergencies." },
  { slug: "psychiatry", name: "Psychiatry", description: "Mental health emergencies and psychotropics." },
  { slug: "anesthesiology", name: "Anesthesiology", description: "Airway, sedation and perioperative dosing." },
  { slug: "intensive-care", name: "Intensive Care", description: "Organ support, hemodynamics and critical illness." },
  { slug: "geriatrics", name: "Geriatrics", description: "Care of older adults." },
  { slug: "palliative-care", name: "Palliative Care", description: "Symptom control and end-of-life care." },
  { slug: "nutrition", name: "Nutrition", description: "Clinical nutrition, diet and meal planning." },
  { slug: "nursing", name: "Nursing", description: "Bedside procedures and infusion care." },
  { slug: "toxicology", name: "Toxicology", description: "Poisoning and overdose management." },
];

export function specialtyName(slug: string): string {
  return SPECIALTIES.find((s) => s.slug === slug)?.name ?? slug;
}