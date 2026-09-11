export type FindingGroup = "Keluhan" | "Pemeriksaan fisik" | "Laboratorium dan EKG";

export interface DdxFinding {
  id: string;
  label: string;
  group: FindingGroup;
}

export interface DifferentialDefinition {
  id: string;
  diagnosis: string;
  specialty: string;
  cantMiss: boolean;
  findings: Record<string, number>;
  nextStep: string;
}

export const DDX_FINDINGS: DdxFinding[] = [
  { id: "chest-pain", label: "Nyeri dada", group: "Keluhan" },
  { id: "tearing-pain", label: "Nyeri dada atau punggung merobek mendadak", group: "Keluhan" },
  { id: "shortness-of-breath", label: "Sesak napas", group: "Keluhan" },
  { id: "pleuritic-pain", label: "Nyeri dada pleuritik", group: "Keluhan" },
  { id: "abdominal-pain", label: "Nyeri perut", group: "Keluhan" },
  { id: "rlq-pain", label: "Nyeri perut kanan bawah", group: "Keluhan" },
  { id: "fever", label: "Demam", group: "Keluhan" },
  { id: "headache", label: "Nyeri kepala", group: "Keluhan" },
  { id: "thunderclap", label: "Nyeri kepala hebat mendadak", group: "Keluhan" },
  { id: "altered-consciousness", label: "Penurunan kesadaran", group: "Keluhan" },
  { id: "seizure", label: "Kejang", group: "Keluhan" },
  { id: "vaginal-bleeding", label: "Perdarahan pervaginam", group: "Keluhan" },
  { id: "pregnant", label: "Tes kehamilan positif", group: "Keluhan" },
  { id: "opioid-exposure", label: "Dugaan pajanan opioid", group: "Keluhan" },
  { id: "hypotension", label: "Hipotensi", group: "Pemeriksaan fisik" },
  { id: "hypoxia", label: "Hipoksia", group: "Pemeriksaan fisik" },
  { id: "unilateral-breath-sounds", label: "Suara napas menurun unilateral", group: "Pemeriksaan fisik" },
  { id: "focal-deficit", label: "Defisit neurologis fokal", group: "Pemeriksaan fisik" },
  { id: "neck-stiffness", label: "Kaku kuduk", group: "Pemeriksaan fisik" },
  { id: "rigid-abdomen", label: "Defans muskular atau perut papan", group: "Pemeriksaan fisik" },
  { id: "st-elevation", label: "EKG menunjukkan elevasi ST", group: "Laboratorium dan EKG" },
  { id: "troponin", label: "Troponin meningkat", group: "Laboratorium dan EKG" },
  { id: "high-lactate", label: "Laktat meningkat", group: "Laboratorium dan EKG" },
  { id: "hypoglycemia", label: "Glukosa darah rendah", group: "Laboratorium dan EKG" },
  { id: "ketones", label: "Keton darah atau urin positif", group: "Laboratorium dan EKG" },
  { id: "wide-qrs", label: "QRS melebar", group: "Laboratorium dan EKG" },
];

const diagnoses: DifferentialDefinition[] = [
  { id: "acs", diagnosis: "Sindrom Koroner Akut", specialty: "Kardiologi", cantMiss: true, findings: { "chest-pain": 4, "shortness-of-breath": 1, "st-elevation": 6, troponin: 5, hypotension: 2 }, nextStep: "EKG 12 sadapan segera, troponin serial, monitor, dan aktifkan alur reperfusi bila memenuhi kriteria." },
  { id: "aortic-dissection", diagnosis: "Diseksi Aorta", specialty: "Vaskular", cantMiss: true, findings: { "chest-pain": 2, "tearing-pain": 7, hypotension: 3 }, nextStep: "Nilai stabilitas dan pertimbangkan CT angiografi serta konsultasi bedah vaskular segera." },
  { id: "pulmonary-embolism", diagnosis: "Emboli Paru", specialty: "Kardiopulmoner", cantMiss: true, findings: { "shortness-of-breath": 4, "pleuritic-pain": 4, hypoxia: 3, hypotension: 2 }, nextStep: "Nilai probabilitas klinis, PERC atau Wells, D-dimer terpilih, dan CT pulmonary angiography bila sesuai." },
  { id: "tension-pneumothorax", diagnosis: "Pneumotoraks, termasuk tension", specialty: "Pulmonologi", cantMiss: true, findings: { "shortness-of-breath": 4, "pleuritic-pain": 2, "unilateral-breath-sounds": 8, hypoxia: 3, hypotension: 3 }, nextStep: "Bila tension dicurigai pada pasien tidak stabil, lakukan dekompresi segera tanpa menunggu radiologi." },
  { id: "pneumonia", diagnosis: "Pneumonia", specialty: "Pulmonologi", cantMiss: false, findings: { "shortness-of-breath": 2, fever: 5, hypoxia: 2 }, nextStep: "Nilai derajat berat, lakukan pencitraan yang sesuai, dan berikan terapi menurut pedoman lokal." },
  { id: "asthma-copd", diagnosis: "Eksaserbasi Asma atau PPOK", specialty: "Pulmonologi", cantMiss: false, findings: { "shortness-of-breath": 5, hypoxia: 2 }, nextStep: "Berikan bronkodilator, nilai kebutuhan steroid, dan pantau tanda gagal napas." },
  { id: "sepsis", diagnosis: "Sepsis atau Syok Septik", specialty: "Emergensi", cantMiss: true, findings: { fever: 4, hypotension: 5, "high-lactate": 4, "altered-consciousness": 2, "shortness-of-breath": 1 }, nextStep: "Cari sumber infeksi, ambil kultur tanpa menunda terapi, ukur laktat, dan mulai resusitasi terarah." },
  { id: "appendicitis", diagnosis: "Apendisitis Akut", specialty: "Bedah", cantMiss: false, findings: { "abdominal-pain": 3, "rlq-pain": 6, fever: 2 }, nextStep: "Gunakan pemeriksaan klinis terstruktur, USG atau CT terpilih, dan konsultasi bedah." },
  { id: "perforation", diagnosis: "Perforasi Viskus atau Peritonitis", specialty: "Bedah", cantMiss: true, findings: { "abdominal-pain": 4, "rigid-abdomen": 8, fever: 2, hypotension: 3 }, nextStep: "Resusitasi, antibiotik spektrum sesuai konteks, pencitraan cepat, dan konsultasi bedah segera." },
  { id: "ectopic", diagnosis: "Kehamilan Ektopik", specialty: "Obstetri dan Ginekologi", cantMiss: true, findings: { pregnant: 5, "vaginal-bleeding": 5, "abdominal-pain": 4, hypotension: 3 }, nextStep: "Periksa beta-hCG kuantitatif, USG transvaginal, dan konsultasi obstetri segera bila tidak stabil." },
  { id: "sah", diagnosis: "Perdarahan Subaraknoid", specialty: "Neurologi", cantMiss: true, findings: { headache: 2, thunderclap: 8, "altered-consciousness": 3, seizure: 2 }, nextStep: "CT kepala nonkontras segera, lalu evaluasi lanjutan bila CT negatif tetapi kecurigaan tetap tinggi." },
  { id: "stroke", diagnosis: "Stroke Akut", specialty: "Neurologi", cantMiss: true, findings: { "focal-deficit": 8, "altered-consciousness": 2, headache: 1 }, nextStep: "Tetapkan waktu onset, lakukan CT kepala, cek glukosa, dan aktifkan protokol stroke." },
  { id: "meningitis", diagnosis: "Meningitis atau Ensefalitis", specialty: "Neurologi dan Infeksi", cantMiss: true, findings: { fever: 4, headache: 3, "neck-stiffness": 7, "altered-consciousness": 3, seizure: 2 }, nextStep: "Ambil kultur dan mulai antimikroba empiris segera. Jangan menunda terapi untuk pungsi lumbal atau CT." },
  { id: "hypoglycemia", diagnosis: "Hipoglikemia", specialty: "Metabolik", cantMiss: true, findings: { hypoglycemia: 10, "altered-consciousness": 4, seizure: 3 }, nextStep: "Konfirmasi glukosa bedside dan koreksi segera sambil mencari penyebab." },
  { id: "dka", diagnosis: "Ketoasidosis Diabetik", specialty: "Metabolik", cantMiss: true, findings: { "abdominal-pain": 2, "altered-consciousness": 2, ketones: 7, "high-lactate": 1 }, nextStep: "Nilai glukosa, keton, AGD, anion gap, dan kalium sebelum serta selama cairan dan insulin." },
  { id: "opioid", diagnosis: "Overdosis Opioid", specialty: "Toksikologi", cantMiss: true, findings: { "opioid-exposure": 8, "altered-consciousness": 4, hypoxia: 3 }, nextStep: "Dukung ventilasi dan titrasi nalokson sampai napas adekuat. Pantau kekambuhan depresi napas." },
  { id: "tca", diagnosis: "Overdosis Antidepresan Trisiklik", specialty: "Toksikologi", cantMiss: true, findings: { "wide-qrs": 7, seizure: 3, hypotension: 3, "altered-consciousness": 2 }, nextStep: "Lakukan EKG serial dan berikan natrium bikarbonat bila QRS melebar atau terdapat instabilitas." },
  { id: "arrhythmia", diagnosis: "Takiaritmia Tidak Stabil", specialty: "Kardiologi", cantMiss: true, findings: { "chest-pain": 2, "shortness-of-breath": 2, hypotension: 4, "altered-consciousness": 3, "wide-qrs": 3 }, nextStep: "Monitor ritme, nilai tanda tidak stabil, dan ikuti algoritma kardioversi atau defibrilasi yang sesuai." },
  { id: "migraine", diagnosis: "Migrain", specialty: "Neurologi", cantMiss: false, findings: { headache: 5 }, nextStep: "Pastikan tidak ada tanda bahaya sekunder sebelum terapi simptomatik." },
  { id: "gastroenteritis", diagnosis: "Gastroenteritis atau Enterokolitis", specialty: "Gastroenterologi", cantMiss: false, findings: { "abdominal-pain": 3, fever: 2 }, nextStep: "Nilai dehidrasi, perdarahan saluran cerna, sepsis, dan kebutuhan pemeriksaan feses." },
];

export interface RankedDifferential extends DifferentialDefinition {
  score: number;
  matchedFindings: string[];
}

export function rankDifferentials(selectedFindingIds: string[]): RankedDifferential[] {
  const selected = new Set(selectedFindingIds);
  if (!selected.size) return [];
  return diagnoses
    .map((item) => {
      const matched = Object.keys(item.findings).filter((id) => selected.has(id));
      const score = matched.reduce((total, id) => total + item.findings[id], 0) + (item.cantMiss ? 0.25 : 0);
      return { ...item, score, matchedFindings: matched };
    })
    .filter((item) => item.matchedFindings.length > 0)
    .sort((a, b) => b.score - a.score || Number(b.cantMiss) - Number(a.cantMiss) || a.diagnosis.localeCompare(b.diagnosis));
}
