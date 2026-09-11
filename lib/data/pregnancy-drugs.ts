import "server-only";

export interface PregnancyDrugEntry {
  id: string;
  name: string;
  category: string;
  pregnancyRating: string;
  lactationRating: string;
  summary: string;
  pregnancyNote: string;
  lactationNote: string;
}

type RawDrug = [id: string, name: string, category: string, pregnancy: string, lactation: string, summary?: string];

const raw: RawDrug[] = [
  ["aspirin", "Aspirin", "Analgesik", "C", "L3", "Risiko bergantung dosis, indikasi, dan usia gestasi."],
  ["fentanyl", "Fentanil", "Analgesik", "C", "L2"],
  ["ibuprofen", "Ibuprofen / NSAID", "Analgesik", "C", "L1", "Hindari terutama setelah 20 minggu dan pada trimester ketiga kecuali diarahkan spesialis."],
  ["codeine", "Kodein", "Analgesik", "A", "L3", "Hindari penggunaan rutin saat menyusui karena variasi metabolisme dan risiko sedasi bayi."],
  ["morphine", "Morfin", "Analgesik", "C", "L3"],
  ["paracetamol", "Parasetamol", "Analgesik", "A", "L1", "Pilihan pertama untuk nyeri atau demam bila digunakan sesuai dosis."],
  ["tramadol", "Tramadol", "Analgesik", "C", "L3"],
  ["gentamicin", "Aminoglikosida (Gentamisin)", "Antibiotik", "D", "L2"],
  ["penicillin", "Amoksisilin / Penisilin", "Antibiotik", "A", "L1"],
  ["macrolide", "Azitromisin / Eritromisin", "Antibiotik", "B1", "L2"],
  ["fluoroquinolone", "Fluorokuinolon", "Antibiotik", "B3", "L3"],
  ["clindamycin", "Klindamisin", "Antibiotik", "A", "L2"],
  ["tmp-smx", "Kotrimoksazol (TMP-SMX)", "Antibiotik", "C", "L3", "Pertimbangkan risiko folat pada awal kehamilan dan kernikterus menjelang persalinan."],
  ["metronidazole", "Metronidazol", "Antibiotik", "B2", "L2"],
  ["nitrofurantoin", "Nitrofurantoin", "Antibiotik", "A", "L2", "Hindari dekat persalinan atau pada defisiensi G6PD."],
  ["cephalosporin", "Sefalosporin", "Antibiotik", "B1", "L1"],
  ["tetracycline", "Tetrasiklin / Doksisiklin", "Antibiotik", "D", "L3"],
  ["domperidone", "Domperidon", "Antiemetik", "B2", "L1"],
  ["metoclopramide", "Metoklopramid", "Antiemetik", "A", "L2"],
  ["ondansetron", "Ondansetron", "Antiemetik", "B1", "L2"],
  ["pyridoxine", "Piridoksin (B6)", "Antiemetik", "A", "L1"],
  ["promethazine", "Prometazin", "Antiemetik", "C", "L2"],
  ["acei-arb", "ACE inhibitor / ARB", "Antihipertensi", "D", "L2", "Kontraindikasi dalam kehamilan karena fetotoksisitas, terutama trimester kedua dan ketiga."],
  ["amlodipine", "Amlodipin", "Antihipertensi", "C", "L3"],
  ["hydralazine", "Hidralazin", "Antihipertensi", "C", "L2"],
  ["labetalol", "Labetalol", "Antihipertensi", "C", "L2"],
  ["methyldopa", "Metildopa", "Antihipertensi", "A", "L2"],
  ["nifedipine", "Nifedipin", "Antihipertensi", "C", "L2"],
  ["heparin", "Heparin (UFH)", "Antikoagulan", "C", "L1"],
  ["lmwh", "LMWH (Enoksaparin)", "Antikoagulan", "C", "L2"],
  ["warfarin", "Warfarin", "Antikoagulan", "D", "L2", "Umumnya dihindari dalam kehamilan. Keputusan khusus memerlukan spesialis."],
  ["valproate", "Asam valproat", "Antikonvulsan", "D", "L2", "Risiko malformasi dan gangguan perkembangan tinggi. Jangan dihentikan mendadak tanpa rencana klinis."],
  ["benzodiazepine", "Benzodiazepin", "Antikonvulsan", "C", "L3"],
  ["phenytoin", "Fenitoin", "Antikonvulsan", "D", "L2"],
  ["levetiracetam", "Levetirasetam", "Antikonvulsan", "D", "L2"],
  ["magnesium-sulfate", "Magnesium sulfat", "Antikonvulsan", "A", "L1"],
  ["antihistamine", "Loratadin / Setirizin", "Lainnya", "B1", "L2"],
  ["tranexamic-acid", "Asam traneksamat", "Lainnya", "B1", "L2"],
  ["epinephrine", "Epinefrin (Adrenalin)", "Lainnya", "A", "L1", "Jangan ditunda pada anafilaksis karena keselamatan ibu menjadi prioritas."],
  ["famotidine", "Famotidin", "Lainnya", "B1", "L1"],
  ["insulin", "Insulin", "Lainnya", "A", "L1"],
  ["omeprazole", "Omeprazol (PPI)", "Lainnya", "B3", "L2"],
  ["antenatal-steroid", "Deksametason / Betametason", "Lainnya", "C", "L2"],
  ["ipratropium", "Ipratropium", "Respirasi", "B1", "L2"],
  ["systemic-steroid", "Kortikosteroid sistemik", "Respirasi", "C", "L2"],
  ["salbutamol", "Salbutamol", "Respirasi", "A", "L1"],
  ["etomidate", "Etomidat", "Sedasi / RSI", "C", "L2"],
  ["ketamine", "Ketamin", "Sedasi / RSI", "B3", "L3"],
  ["propofol", "Propofol", "Sedasi / RSI", "C", "L2"],
  ["rocuronium", "Rokuronium", "Sedasi / RSI", "B2", "L2"],
  ["succinylcholine", "Suksinilkolin", "Sedasi / RSI", "A", "L2"],
];

function pregnancyNote(rating: string) {
  if (rating === "A") return "Data manusia relatif meyakinkan pada penggunaan yang tepat.";
  if (rating.startsWith("B")) return "Data tidak menunjukkan peningkatan risiko yang jelas, tetapi konteks klinis tetap dinilai.";
  if (rating === "C") return "Gunakan bila manfaat klinis diperkirakan melebihi risiko.";
  return "Ada bukti risiko janin. Gunakan hanya pada indikasi kuat atau pilih alternatif yang lebih aman.";
}

function lactationNote(rating: string) {
  if (rating === "L1") return "Paling kompatibel berdasarkan data laktasi yang tersedia.";
  if (rating === "L2") return "Umumnya kompatibel, tetap pantau bayi sesuai efek obat.";
  return "Gunakan dengan kehati-hatian dan pantau bayi atau pertimbangkan alternatif.";
}

export const PREGNANCY_DRUGS: PregnancyDrugEntry[] = raw.map(([id, name, category, pregnancyRating, lactationRating, summary]) => ({
  id,
  name,
  category,
  pregnancyRating,
  lactationRating,
  summary: summary ?? "Nilai manfaat, dosis, durasi, usia gestasi, kondisi ibu, dan kondisi bayi sebelum penggunaan.",
  pregnancyNote: pregnancyNote(pregnancyRating),
  lactationNote: lactationNote(lactationRating),
}));

export function searchPregnancyDrugs(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return PREGNANCY_DRUGS;
  return PREGNANCY_DRUGS.filter((item) => {
    const aliases = item.id === "penicillin" || item.id === "cephalosporin" ? "beta-laktam beta lactam" : "";
    return `${item.name} ${item.category} ${aliases}`.toLowerCase().includes(needle);
  });
}
