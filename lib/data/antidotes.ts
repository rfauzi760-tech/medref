import "server-only";

export interface AntidoteEntry {
  id: string;
  toxin: string;
  antidote: string;
  category: string;
  availability: "Umumnya tersedia" | "Sering terbatas";
  synonyms: string[];
  indication: string;
  doses: string[];
  alternative?: string;
  warnings?: string[];
  source: string;
}

const source = "Panduan toksikologi klinis, WHO, AHA, CHEMM, dan pusat informasi keracunan";

export const ANTIDOTES: AntidoteEntry[] = [
  {
    id: "snake-envenomation", toxin: "Envenomasi ular", antidote: "SABU polivalen", category: "Lainnya", availability: "Umumnya tersedia", synonyms: ["gigitan ular", "bisa ular", "biosave"],
    indication: "Koagulopati, perdarahan spontan, neurotoksisitas, cedera ginjal akut, atau pembengkakan lokal yang berkembang cepat.",
    doses: ["Ikuti dosis dan petunjuk produk antivenom yang tersedia", "Nilai ulang klinis dan WBCT 20 menit sesuai protokol lokal"],
    warnings: ["Jangan memakai hasil WBCT sebagai satu-satunya dasar keputusan", "Siapkan tata laksana anafilaksis selama pemberian"], source,
  },
  {
    id: "toxic-alcohol", toxin: "Metanol atau etilen glikol", antidote: "Fomepizol atau etanol", category: "Alkohol Toksik", availability: "Sering terbatas", synonyms: ["spiritus", "antifreeze", "alkohol oplosan"],
    indication: "Riwayat pajanan dengan asidosis metabolik anion gap tinggi, osmolar gap, gangguan penglihatan, atau kadar toksik.",
    doses: ["Fomepizol 15 mg/kg IV awal", "Lanjut 10 mg/kg IV tiap 12 jam untuk 4 dosis, lalu 15 mg/kg tiap 12 jam"],
    alternative: "Etanol dapat dipakai bila fomepizol tidak tersedia. Konsultasikan toksikolog dan pertimbangkan hemodialisis pada kasus berat.", source,
  },
  {
    id: "paracetamol", toxin: "Parasetamol", antidote: "N-asetilsistein", category: "Analgesik", availability: "Umumnya tersedia", synonyms: ["acetaminophen", "paracetamol", "nac"],
    indication: "Kadar di atas nomogram Rumack-Matthew, ingesti berisiko, waktu tidak diketahui, atau bukti cedera hati.",
    doses: ["IV 150 mg/kg selama 1 jam", "Lanjut 50 mg/kg selama 4 jam", "Lanjut 100 mg/kg selama 16 jam"],
    alternative: "Oral 140 mg/kg awal, lalu 70 mg/kg tiap 4 jam sebanyak 17 dosis.",
    warnings: ["Lanjutkan terapi bila kadar masih terdeteksi atau fungsi hati belum membaik", "Tangani reaksi anafilaktoid tanpa otomatis menghentikan seluruh terapi"], source,
  },
  {
    id: "doac", toxin: "Antikoagulan oral langsung", antidote: "Idarucizumab, andexanet alfa, atau PCC", category: "Antikoagulan", availability: "Sering terbatas", synonyms: ["dabigatran", "rivaroxaban", "apixaban", "doac"],
    indication: "Perdarahan mayor atau kebutuhan pembedahan darurat pada pasien yang masih memiliki efek antikoagulan.",
    doses: ["Dabigatran: idarucizumab 5 g IV", "Inhibitor faktor Xa: andexanet alfa sesuai obat, dosis, dan waktu terakhir", "Bila reversal spesifik tidak ada: PCC 4 faktor 50 unit/kg"], source,
  },
  {
    id: "heparin", toxin: "Heparin atau LMWH", antidote: "Protamin sulfat", category: "Antikoagulan", availability: "Umumnya tersedia", synonyms: ["enoxaparin", "enoksaparin", "ufh", "lmwh"],
    indication: "Perdarahan akibat heparin atau kebutuhan pembalikan antikoagulasi segera.",
    doses: ["1 mg protamin per 100 unit heparin yang masih beredar", "Maksimal 50 mg per dosis, berikan IV lambat"],
    warnings: ["Pembalikan efek anti-Xa LMWH hanya sebagian", "Pemberian cepat dapat menyebabkan hipotensi atau bradikardia"], source,
  },
  {
    id: "warfarin", toxin: "Warfarin atau kumarin", antidote: "Vitamin K dan PCC", category: "Antikoagulan", availability: "Umumnya tersedia", synonyms: ["rodentisida", "superwarfarin", "fitonadion"],
    indication: "INR tinggi dengan perdarahan atau kebutuhan tindakan segera.",
    doses: ["Perdarahan mayor: vitamin K 5 sampai 10 mg IV lambat", "Tambahkan PCC 4 faktor sesuai protokol"],
    alternative: "FFP 10 sampai 15 mL/kg bila PCC tidak tersedia.", source,
  },
  {
    id: "tca", toxin: "Antidepresan trisiklik", antidote: "Natrium bikarbonat", category: "Kardiovaskular", availability: "Umumnya tersedia", synonyms: ["tca", "amitriptyline", "amitriptilin"],
    indication: "QRS lebih dari 100 ms, aritmia ventrikel, kejang, atau hipotensi akibat overdosis.",
    doses: ["Natrium bikarbonat 1 sampai 2 mEq/kg IV bolus", "Ulangi sampai QRS menyempit dan pH sekitar 7,45 sampai 7,55"],
    warnings: ["Hindari antiaritmia kelas Ia dan Ic", "Flumazenil kontraindikasi pada kecurigaan ko-ingesti TCA"], source,
  },
  {
    id: "digoxin", toxin: "Digoksin", antidote: "Antibodi Fab spesifik digoksin", category: "Kardiovaskular", availability: "Sering terbatas", synonyms: ["digitalis", "digifab"],
    indication: "Aritmia yang mengancam nyawa, hiperkalemia bermakna, atau ingesti masif.",
    doses: ["Dosis berdasarkan jumlah yang tertelan atau kadar digoksin bila datanya memadai", "Pada kondisi kritis dapat diperlukan dosis empiris sesuai protokol produk"],
    alternative: "Atropin untuk bradikardia, pacing, serta koreksi kalium dan magnesium sambil mencari Fab.", source,
  },
  {
    id: "beta-blocker", toxin: "Penyekat beta", antidote: "Glukagon dan insulin dosis tinggi", category: "Kardiovaskular", availability: "Sering terbatas", synonyms: ["beta blocker", "propranolol", "atenolol"],
    indication: "Bradikardia atau hipotensi refrakter akibat overdosis penyekat beta.",
    doses: ["Glukagon 3 sampai 10 mg IV bolus, lanjut 3 sampai 5 mg/jam", "Insulin reguler 1 unit/kg IV awal, lanjut 0,5 sampai 1 unit/kg/jam dengan dekstrosa"],
    warnings: ["Pantau glukosa dan kalium sangat sering", "Propranolol dapat menyebabkan kejang dan pelebaran QRS"], source,
  },
  {
    id: "ccb", toxin: "Penyekat kanal kalsium", antidote: "Kalsium dan insulin dosis tinggi", category: "Kardiovaskular", availability: "Umumnya tersedia", synonyms: ["ccb", "verapamil", "diltiazem", "amlodipine"],
    indication: "Hipotensi atau bradikardia akibat overdosis penyekat kanal kalsium.",
    doses: ["Kalsium glukonat 10% 30 sampai 60 mL IV", "Insulin reguler 1 unit/kg IV awal, lanjut 0,5 sampai 1 unit/kg/jam dengan dekstrosa"],
    warnings: ["Pantau glukosa, kalium, EKG, dan hemodinamik"], source,
  },
  {
    id: "last", toxin: "Toksisitas anestetik lokal", antidote: "Emulsi lipid 20%", category: "Lainnya", availability: "Sering terbatas", synonyms: ["last", "lidocaine", "bupivacaine", "intralipid"],
    indication: "Kejang, aritmia, atau kolaps sirkulasi setelah anestetik lokal atau obat sangat lipofilik.",
    doses: ["Bolus emulsi lipid 20% 1,5 mL/kg IV", "Lanjut 0,25 mL/kg/menit", "Batas total sekitar 12 mL/kg"], source,
  },
  {
    id: "methemoglobinemia", toxin: "Methemoglobinemia", antidote: "Metilen biru", category: "Lainnya", availability: "Sering terbatas", synonyms: ["methemoglobin", "benzocaine", "dapsone"],
    indication: "MetHb lebih dari 20 sampai 30 persen atau terdapat gejala hipoksia jaringan.",
    doses: ["Metilen biru 1 sampai 2 mg/kg IV selama 5 menit", "Dapat diulang setelah 30 sampai 60 menit bila perlu"],
    warnings: ["Hindari pada defisiensi G6PD", "Waspadai sindrom serotonin bersama obat serotonergik"], source,
  },
  {
    id: "cyanide", toxin: "Sianida", antidote: "Hidroksokobalamin", category: "Lainnya", availability: "Sering terbatas", synonyms: ["cyanide", "asap kebakaran"],
    indication: "Paparan sianida atau inhalasi asap dengan asidosis laktat berat dan penurunan kesadaran.",
    doses: ["Dewasa 5 g IV selama 15 menit, dapat diulang sekali", "Anak 70 mg/kg IV, maksimal 5 g per dosis"],
    alternative: "Natrium tiosulfat dapat dipertimbangkan sesuai protokol toksikologi bila hidroksokobalamin tidak tersedia.", source,
  },
  {
    id: "sulfonylurea", toxin: "Sulfonilurea", antidote: "Oktreotid dan dekstrosa", category: "Lainnya", availability: "Sering terbatas", synonyms: ["glibenclamide", "glimepiride", "hipoglikemia"],
    indication: "Hipoglikemia berulang atau refrakter akibat sulfonilurea.",
    doses: ["Koreksi hipoglikemia dengan dekstrosa", "Oktreotid 50 sampai 100 mcg SC tiap 6 sampai 8 jam"],
    warnings: ["Bolus dekstrosa berlebihan dapat memicu hipoglikemia berulang"], source,
  },
  {
    id: "iron", toxin: "Besi elemental", antidote: "Deferoksamin", category: "Logam dan Khelasi", availability: "Sering terbatas", synonyms: ["iron", "ferrous", "zat besi"],
    indication: "Syok, asidosis metabolik, kadar besi serum tinggi, atau ingesti elemental berisiko.",
    doses: ["Deferoksamin 15 mg/kg/jam IV", "Titrasi terhadap respons dan batasi sesuai protokol toksikologi"],
    alternative: "Whole bowel irrigation dapat dipertimbangkan untuk tablet radioopak.", source,
  },
  {
    id: "benzodiazepine", toxin: "Benzodiazepin", antidote: "Flumazenil", category: "Opioid dan Sedatif", availability: "Sering terbatas", synonyms: ["diazepam", "alprazolam", "midazolam"],
    indication: "Depresi napas akibat benzodiazepin murni pada pasien terpilih. Dukungan ventilasi biasanya lebih aman.",
    doses: ["0,2 mg IV selama 30 detik", "Ulangi 0,2 mg tiap menit sampai respons, umumnya maksimal 1 mg"],
    warnings: ["Hindari pada penggunaan kronik, riwayat kejang, atau ko-ingesti prokonvulsan"], source,
  },
  {
    id: "opioid", toxin: "Opioid", antidote: "Nalokson", category: "Opioid dan Sedatif", availability: "Umumnya tersedia", synonyms: ["morfin", "heroin", "tramadol", "fentanil", "naloxone"],
    indication: "Depresi napas dengan kecurigaan pajanan opioid. Targetnya ventilasi adekuat, bukan kesadaran penuh.",
    doses: ["0,04 sampai 0,4 mg IV, IM, atau intranasal", "Titrasi tiap 2 sampai 3 menit", "Infus dapat dimulai sekitar dua pertiga dosis efektif per jam"],
    warnings: ["Waspadai putus opioid akut dan depresi napas berulang"], source,
  },
  {
    id: "isoniazid", toxin: "Isoniazid", antidote: "Piridoksin", category: "Lainnya", availability: "Umumnya tersedia", synonyms: ["inh", "obat tb", "vitamin b6"],
    indication: "Kejang refrakter atau asidosis laktat akibat overdosis isoniazid.",
    doses: ["Piridoksin 1 g IV per gram isoniazid yang tertelan", "Jika jumlah tidak diketahui: dewasa 5 g IV, anak 70 mg/kg IV"], source,
  },
  {
    id: "organophosphate", toxin: "Organofosfat atau karbamat", antidote: "Atropin dan pralidoksim", category: "Pestisida", availability: "Umumnya tersedia", synonyms: ["baygon", "insektisida", "pestisida", "dumbels", "sludge", "2-pam"],
    indication: "Toksidrom kolinergik dengan bronkorea, hipersalivasi, miosis, fasikulasi, bradikardia, atau kejang.",
    doses: ["Atropin 1 sampai 2 mg IV, gandakan tiap 5 menit sampai sekret paru terkontrol", "Infus rumatan 10 sampai 20 persen dari dosis atropinisasi total per jam", "Pralidoksim 1 sampai 2 g IV, lalu 8 sampai 10 mg/kg/jam"],
    warnings: ["Lindungi petugas dari kontaminasi sekunder", "Pralidoksim sering tidak diperlukan pada karbamat murni"], source,
  },
];

export function searchAntidotes(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return ANTIDOTES;
  return ANTIDOTES.filter((item) => [item.toxin, item.antidote, item.category, ...item.synonyms].join(" ").toLowerCase().includes(needle));
}
