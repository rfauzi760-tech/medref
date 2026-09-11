import type { GuidelineEntry } from "@/lib/types";

/** Panduan klinis ringkas — bagian 2 (Bahasa Indonesia). */

export const EXTRA_GUIDELINES_B: GuidelineEntry[] = [
  {
    id: "ugib",
    slug: "ugib",
    title: "Perdarahan Saluran Cerna Atas (UGIB)",
    specialties: ["Gastroenterology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["perdarahan saluran cerna", "ugib", "hematemesis", "melena", "hematokezia", "varises", "rockall", "blatchford", "upper gi bleeding"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Perdarahan dari esofagus, lambung, atau duodenum proksimal (ligamen Treitz). Penyebab: ulkus peptik, varises, Mallory-Weiss, gastritis erosif, keganasan.",
      ],
      initialAssessment: [
        "Primary survey: airway (aspirasi darah), breathing, circulation — 2 akses IV besar; resusitasi kristaloid; transfusi PRC sesuai target Hb ≥ 7 g/dL (≥ 8–9 pada penyakit kardiovaskular/perdarahan masif).",
        "Kaji jumlah, warna muntahan/tinja, sinkop, penggunaan NSAID/antikoagulan/aspirin, riwayat penyakit hati/alkohol.",
        "Tanda syok: hipotensi, takikardia, pucat, penurunan produksi urin.",
      ],
      investigations: [
        "Darah lengkap serial, koagulasi, fungsi hati-ginjal, golongan darah + crossmatch, laktat.",
        "Skor risiko: Glasgow-Blatchford (pra-endoskopi, untuk seleksi rawat jalan risiko rendah) dan Rockall (pasca-endoskopi).",
        "Nasogastrik tidak wajib; endoskopi adalah diagnostik utama.",
      ],
      initialManagement: [
        "Perdarahan non-varises: PPI IV dosis tinggi (mis. omeprazol 80 mg bolus + 8 mg/jam atau 80 mg/hari) sebelum/dan setelah endoskopi; endoskopi < 24 jam setelah stabilisasi.",
        "Perdarahan varises: terlipresin/oktreotid sejak awal + antibiotik profilaksis (seftriakson) + endoskopi < 12 jam (ligasi); hindari PPI rutin.",
        "Prokinetik (eritromisin IV) dapat diberikan sebelum endoskopi untuk membersihkan lambung.",
        "Balikkan antikoagulan sesuai agen dan indikasi.",
        "Kegagalan hemostasis endoskopik → ulangi endoskopi, atau embolisasi/bedah.",
      ],
      admissionCriteria: [
        "Semua pasien dengan tanda syok, Hb turun, komorbid, dugaan varises, atau skor risiko sedang–tinggi: rawat.",
        "Blatchford 0–1 + stabil: boleh pertimbangkan rawat jalan endoskopi elektif.",
      ],
      icuCriteria: [
        "Syok tidak responsif, perdarahan masif/berkelanjutan, varises dengan hemodinamik tidak stabil.",
      ],
      redFlags: [
        "Hematemesis masif, melena + syok, penurunan Hb cepat.",
        "Perdarahan pada sirosis — anggap varises sampai terbukti.",
      ],
    },
    references: [
      { org: "Gralnek IM et al. (ESGE)", title: "Diagnosis and management of nonvariceal upper gastrointestinal hemorrhage", year: 2021, url: "https://doi.org/10.1055/a-1369-5274" },
      { org: "de Franchis R et al. (Baveno VII)", title: "Baveno VII — portal hypertension", year: 2022 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "hiperkalemia",
    slug: "hiperkalemia",
    title: "Hiperkalemia",
    specialties: ["Nephrology", "Emergency Medicine", "Internal Medicine", "Cardiology"],
    keywords: ["hiperkalemia", "kalium", "potassium", "hiperkalemia emergensi", "ekg", "tall t wave"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Kalium serum > 5,5 mEq/L; > 6,0–6,5 mEq/L atau dengan perubahan EKG = kegawatan (risiko aritmia fatal).",
        "Penyebab: gagal ginjal, obat (ACEi/ARB, spironolakton, NSAID), asidosis, lisis sel (rabdomiolisis, tumor lisis), pseudohiperkalemia.",
      ],
      initialAssessment: [
        "EKG segera: gelombang T tinggi runcing, PR memanjang, QRS melebar, hilangnya gelombang P → pola sinusoidal → VF/asistol.",
        "Konfirmasi nilai (ulang, hindari hemolisis). Kaji penyebab dan obat.",
      ],
      initialManagement: [
        "Kalsium IV (kalsium glukonas 10% 10–30 mL atau kalsium klorida) untuk stabilisasi membran bila EKG abnormal/aritmia — tidak menurunkan kalium.",
        "Redistribusi: insulin regular 10 unit IV + dekstrosa 25–50 g (jangan tanpa glukosa bila gula normal); nebul salbutamol; NaHCO₃ hanya pada asidosis metabolik.",
        "Eliminasi: diuretik loop (furosemid), resin penukar kation (kayexalate / patiromer), atau dialisis (indikasi: gagal ginjal, kalium sangat tinggi, refrakter).",
        "Hentikan/ tinjau obat penahan kalium; diet rendah kalium.",
      ],
      admissionCriteria: [
        "Kalium > 6,0 dengan EKG abnormal, atau refrakter: rawat/observasi dengan monitoring.",
      ],
      icuCriteria: [
        "Aritmia, QRS melebar, kalium > 6,5, atau gagal ginjal dengan indikasi dialisis urgensi.",
      ],
      redFlags: [
        "EKG abnormal = tanda bahaya — berikan kalsium tanpa menunda.",
        "Pseudohiperkalemia (hemolisis) — konfirmasi sebelum terapi agresif.",
      ],
    },
    references: [
      { org: "KDIGO", title: "KDIGO Clinical Practice Guideline for Acute Kidney Injury & electrolyte management", year: 2024 },
      { org: "Vandenberghe W et al.", title: "Life-threatening hyperkalemia: management review", year: 2019 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "sepsis-neonatorum",
    slug: "sepsis-neonatorum",
    title: "Sepsis Neonatorum",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["sepsis neonatorum", "neonatus", "bayi baru lahir", "early onset", "late onset", "newborn sepsis", "infeksi neonatus"],
    emergency: true,
    ageGroup: "neonatal",
    sections: {
      overview: [
        "Infeksi sistemik pada bayi usia < 28 hari. Early-onset (< 72 jam, umumnya infeksi perinatal: GBS, E. coli) vs late-onset (≥ 72 jam, infeksi nosokomial/komunitas: koagulase-negatif stafilokokus, Klebsiella, E. coli).",
      ],
      classification: [
        "Early-onset: faktor risiko — KPD lama, korioamnionitis ibu, prematuritas, BBLR.",
        "Late-onset: terkait prosedur (kateter vaskular), menyusui/lingkungan, atau infeksi komunitas.",
      ],
      initialAssessment: [
        "Gejala tidak khas: sulit minum, letargi, hipotermia/demam, distres napas, apneu, ikterus, kembung, kejang, sianosis.",
        "Tanda syok: perfusi buruk, takikardia/bradikardia, hipotensi (lanjut), capillary refill memanjang.",
      ],
      investigations: [
        "Darah: darah rutin + hitung jenis, CRP, prokalsitonin (serial membantu menyingkirkan), kultur darah sebelum antibiotik.",
        "LP pada kecurigaan meningitis (atau kondisi stabil); urinalisis/kultur pada late-onset.",
        "Foto toraks bila ada distres napas.",
      ],
      initialManagement: [
        "Antibiotik empirik segera (jangan tunggu kultur): ampisilin + gentamisin (early-onset); + vankomisin bila faktor risiko nosokomial (late-onset berat).",
        "Hentikan pada 36–48 jam bila kultur negatif dan klinis membaik.",
        "Dukungan: termoregulasi, oksigen/ventilasi, koreksi glukosa/kalsium, resusitasi cairan hati-hati, inotropik bila syok.",
        "Asuhan menyusui dan identifikasi fokus infeksi (tali pusat, kulit).",
      ],
      admissionCriteria: [
        "Semua neonatus dengan kecurigaan sepsis: rawat NICU/perinatologi.",
      ],
      redFlags: [
        "Apneu, kejang, hipotermia berat, syok, atau memburuk cepat.",
        "Ikterus dini/muntah hijau pada bayi baru lahir juga bisa tanda sepsis.",
      ],
    },
    references: [
      { org: "Puopolo KM et al. (AAP)", title: "Management of Neonates at Risk for Early-Onset Sepsis", year: 2019 },
      { org: "IDAI / UKK Neonatologi", title: "Panduan Sepsis Neonatorum", year: 2022 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "ikterus-neonatorum",
    slug: "ikterus-neonatorum",
    title: "Ikterus Neonatorum",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["ikterus", "jaundice", "bayi kuning", "bilirubin", "fototerapi", "neonatus", "hiperbilirubinemia"],
    emergency: false,
    ageGroup: "neonatal",
    sections: {
      overview: [
        "Ikterus (kuning) karena akumulasi bilirubin — fisiologis pada banyak bayi, namun hiperbilirubinemia signifikan dapat menyebabkan ensefalopati bilirubin (kernikterus).",
      ],
      classification: [
        "Fisiologis: muncul hari ke-2–3, memuncak hari ke-3–5, hilang < 2 minggu; kadar di bawah ambang patologis sesuai usia jam.",
        "Patologis: ikterus < 24 jam, peningkatan cepat (> 0,5 mg/dL/jam), kadar melewati ambang, atau menetap > 2 minggu.",
        "Penyebab: fisiologis, inkompatibilitas ABO/Rh, defisiensi G6PD, sepsis, hipotiroid, atresia bilier (ikterus konjugasi + tinja pucat).",
      ],
      initialAssessment: [
        "Tentukan onset dan faktor risiko: prematuritas, BBLR, ASI tidak adekuat, inkompatibilitas golongan darah, riwayat saudara difototerapi.",
        "Periksa: warna kulit/kaki, hepatosplenomegali, tanda sepsis, tinja (pucat = curiga atresia bilier).",
        "Ikterus < 24 jam atau curiga patologis: ukur bilirubin total (transkutan awalnya, konfirmasi serum bila tinggi).",
      ],
      investigations: [
        "Bilirubin total & direk (bila direk > 1–2 mg/dL atau > 20% total: curiga kolestasis).",
        "Golongan darah ibu-bayi, Coombs, darah rutin, retikulosit; G6PD sesuai indikasi; skrining sepsis bila faktor risiko.",
        "Bandingkan dengan kurva/ambang fototerapi dan exchange transfusion (AAP 2022 / pedoman nasional) berdasarkan usia jam dan faktor risiko.",
      ],
      initialManagement: [
        "Fototerapi intensif sesuai ambang usia jam; proteksi mata dan gonad.",
        "Pastikan asupan ASI adekuat (suplementasi bila dehidrasi/BB turun).",
        "Exchange transfusion bila kadar melewati ambang tukar atau ada tanda ensefalopati akut bilirubin (letargi, tonus buruk, opistotonus, tangis melengking).",
        "IVIG pada isoimun (Rh/ABO) dengan kadar mendekati ambang tukar.",
        "Ikterus konjugasi/atresia bilier: rujuk untuk evaluasi bedah segera.",
      ],
      redFlags: [
        "Ikterus < 24 jam, tinja pucat, urine pekat, BB turun banyak, atau tanda ensefalopati bilirubin.",
        "Ikterus menetap > 2 minggu (aterm) — cari penyebab patologis.",
      ],
    },
    references: [
      { org: "American Academy of Pediatrics", title: "Clinical Practice Guideline: Management of Hyperbilirubinemia in the Newborn Infant ≥ 35 Weeks", year: 2022, url: "https://doi.org/10.1542/peds.2022-058859" },
      { org: "Kementerian Kesehatan RI", title: "Manajemen Ikterus Neonatorum (Panduan MTBS/neonatal)", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "pph",
    slug: "pph",
    title: "Perdarahan Pascapersalinan (PPH)",
    specialties: ["Obstetrics & Gynecology"],
    keywords: ["pph", "perdarahan postpartum", "atonia uteri", "postpartum hemorrhage", "masif", "obstetri"],
    emergency: true,
    ageGroup: "adult",
    pregnancyRelevant: true,
    sections: {
      overview: [
        "Perdarahan ≥ 500 mL setelah persalinan pervaginam atau ≥ 1.000 mL setelah seksio; atau perdarahan dengan tanda syok. Penyebab 4T: Tonus (atonia uteri), Trauma (laserasi, ruptur uteri, inversi), Tissue (retensi plasenta), Thrombin (koagulopati).",
      ],
      initialAssessment: [
        "Resusitasi simultan sambil mencari penyebab: 2 akses IV besar, kristaloid hangat, darah segera; panggil tim.",
        "Ukur perdarahan (tampon/weight), pantau tanda vital & produksi urin.",
        "Eksplorasi: kontraksi uterus?, plasenta utuh?, laserasi jalan lahir?, tanda koagulopati.",
      ],
      investigations: [
        "Darah lengkap serial, koagulasi, fibrinogen bila memungkinkan, crossmatch; laktat.",
        "USG untuk retensi jaringan.",
      ],
      initialManagement: [
        "Atonia: uterine massage + oksitosin 10 IU IM/IV lambat; lanjut metilergometrin 0,2 mg IM (hindari hipertensi) atau karboprost 0,25 mg IM (hindari asma) atau misoprostol 600–800 µg PR; kalau semua tersedia ikuti algoritma lokal.",
        "Traneksamat 1 g IV (dalam 3 jam, ulangi 1 g bila perlu) — HELLP/antikoagulan tetap boleh.",
        "Perbaiki laserasi; plasenta tertahan → manual removal/kuretase dengan anestesi; koagulopati → komponen darah.",
        "Perdarahan tidak berhenti: balon intrauterin (Bakri), kompresi uterus bimanual, kompresi jahitan (B-Lynch), ligasi arteri, atau histerektomi — jangan terlambat.",
        "Aktifkan protokol transfusi masif bila perdarahan masif (PRC:FFP:trombosit 1:1:1).",
      ],
      icuCriteria: [
        "Syok tidak responsif, perdarahan masif berlanjut, koagulopati berat — ICU + konsultasi obstetri senior/anestesi.",
      ],
      redFlags: [
        "Perdarahan terus meski uterus kontraksi baik — cari trauma/koagulopati.",
        "Tanda syok bisa muncul mendadak — jangan menunggu hipotensi.",
        "Jangan terlambat merujuk ke operasi bila perdarahan tidak terkendali.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "WHO recommendations on prevention and treatment of postpartum haemorrhage", year: 2023, url: "https://www.who.int/publications/i/item/9789240085390" },
      { org: "Kementerian Kesehatan RI", title: "PONED/PONEK — penanganan perdarahan pascapersalinan", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "keracunan-organofosfat",
    slug: "keracunan-organofosfat",
    title: "Keracunan Organofosfat",
    specialties: ["Toxicology", "Emergency Medicine", "Intensive Care"],
    keywords: ["organofosfat", "insektisida", "keracunan", "poisoning", "asetilkolinesterase", "atropin", "pestisida"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Paparan insektisida organofosfat (mis. dalam percobaan bunuh diri, kecelakaan pertanian, atau anak tidak sengaja) menghambat asetilkolinesterase → kelebihan asetilkolin.",
      ],
      classification: [
        "Sindrom muskarinik: SLUDGE/BBB (salivasi, lakrimasi, urinasi, defekasi, muntah, bronkore, bronkospasme, bradikardia, miosis).",
        "Sindrom nikotinik: fasikulasi, kelemahan, takikardia, hipertensi.",
        "Efek SSP: gelisah, kejang, koma. Intermediate syndrome: kelemahan otot pernapasan hari ke-1–4.",
      ],
      initialAssessment: [
        "ABCDE + dekontaminasi (lepas pakaian, cuci kulit; jangan induksi muntah).",
        "Identifikasi agen, jalur, jumlah, waktu; cek aktivitas asetilkolinesterase bila tersedia.",
        "Nilai sekresi, pupil, fasikulasi, status napas secara serial.",
      ],
      investigations: [
        "Diagnosis klinis terutama; kholinesterase plasma/eritrosit membantu konfirmasi.",
        "EKG, elektrolit, glukosa; gas darah pada gangguan napas.",
      ],
      initialManagement: [
        "Atropin: titrasi agresif sampai tanda atropinisasi (bebas sekresi, pupil midriasis) — bolus awal 1–3 mg dewasa (0,02–0,05 mg/kgBB anak), gandakan tiap 3–5 menit; sering butuh dosis total besar.",
        "Oksim (pralidoksim): berikan dini (1–2 g dewasa IV selama 30 menit, dilanjutkan infus) — efektivitas terbaik bila diberikan awal.",
        "Diazepam untuk kejang/agitasi.",
        "Ventilasi dini untuk kelemahan otot pernapasan dan sekresi masif.",
      ],
      icuCriteria: [
        "Gagal napas, kejang, hipoksia, atau kebutuhan atropin berkelanjutan — rawat ICU.",
      ],
      redFlags: [
        "Bradikardia + bronkore + miosis = toksisitas muskarinik berat — atropin segera.",
        "Intermediate syndrome dapat muncul setelah perbaikan awal — pantau kekuatan napas ≥ 72 jam.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Clinical management of acute pesticide intoxication", year: 2020 },
      { org: "Eddleston M et al.", title: "Management of acute organophosphorus pesticide poisoning", year: 2008, url: "https://doi.org/10.1016/S0140-6736(07)61202-1" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "overdosis-parasetamol",
    slug: "overdosis-parasetamol",
    title: "Overdosis Parasetamol (Asetaminofen)",
    specialties: ["Toxicology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["parasetamol", "asetaminofen", "overdosis", "keracunan", "nac", "n asetilsistein", "hepatotoksisitas", "acetaeminophen overdose"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Keracunan parasetamol → metabolit toksik NAPQI menipiskan glutathione → nekrosis hati. Dosis toksik akut: ≥ 150 mg/kgBB dewasa/anak (atau ≥ 7,5–10 g); toksisitas dapat terjadi lebih rendah pada peminum alkohol kronik, malnutrisi, atau pemakaian berulang.",
      ],
      classification: [
        "Fase 1 (0–24 jam): asimtomatik atau mual/muntah ringan.",
        "Fase 2 (24–72 jam): nyeri kuadran kanan atas, transaminase naik.",
        "Fase 3 (72–96 jam): gagal hati fulminan (ikterus, koagulopati, ensefalopati).",
        "Fase 4 (4 hari–2 minggu): resolusi atau kematian.",
      ],
      initialAssessment: [
        "Tentukan waktu, jumlah (mg/kgBB), dan bentuk sediaan (extended-release, kombinasi).",
        "Periksa fungsi hati & ginjal, INR, gula darah; pertimbangkan konsentrasi obat pada sediaan extended-release.",
      ],
      investigations: [
        "Kadar parasetamol serum 4 jam setelah ingesti → plot ke kurva Rumack-Matthew (batas terapi 150 µg/mL pada 4 jam).",
        "Fungsi hati, INR, kreatinin, laktat serial pada kasus signifikan.",
      ],
      initialManagement: [
        "N-asetilsistein (NAC) bila kadar di atas garis perawatan atau dosis > 150 mg/kgBB; semakin dini semakin efektif (ideal < 8 jam).",
        "Protokol IV: 150 mg/kgBB dalam 1 jam, lalu 50 mg/kgBB selama 4 jam, lalu 100 mg/kgBB selama 16 jam (atau protokol oral 72 jam).",
        "Arang aktif bila datang < 1–2 jam dengan dosis besar.",
        "Nilai ulang fungsi hati bila kadar sangat tinggi / keterlambatan.",
        "Gagal hati akut → rujuk transplantasi (kriteria King's College).",
      ],
      admissionCriteria: [
        "Kadar di atas garis perawatan, dosis > 150 mg/kgBB, fungsi hati terganggu, atau sediaan extended-release: rawat untuk NAC.",
      ],
      redFlags: [
        "Keterlambatan > 8 jam = risiko hepatotoksisitas tinggi — NAC tetap diberikan.",
        "Ensefalopati, INR > 1,5, hipoglikemia, asidosis = gagal hati berat.",
      ],
    },
    references: [
      { org: "American College of Medical Toxicology", title: "Acetaminophen poisoning — position statement & management", year: 2020 },
      { org: "Chiew AL et al.", title: "Updated guidelines for the management of paracetamol poisoning in Australia and New Zealand", year: 2020 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "glaukoma-akut",
    slug: "glaukoma-akut",
    title: "Glaukoma Sudut Tertutup Akut",
    specialties: ["Ophthalmology", "Emergency Medicine"],
    keywords: ["glaukoma", "glaukoma akut", "angle closure", "mata merah", "nyeri mata", "pupil midriasis", "halo"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Kegawatan mata: blokade aliran aqueous → tekanan intraokular (TIO) sangat tinggi. Dapat menyebabkan kebutaan permanen dalam hitungan jam-hari.",
        "Faktor risiko: hipermetropia, usia lanjut, wanita, ruang anterior dangkal, riwayat keluarga.",
      ],
      classification: [
        "Gejala khas: nyeri mata hebat, mata merah, penurunan penglihatan, halo (pelangi) saat melihat lampu, mual/muntah.",
        "Tanda: pupil midriasis non-reaktif, kornea edema/keruh, injeksi siliar, TIO > 40 mmHg (palpasi keras).",
      ],
      initialAssessment: [
        "Ukur TIO (tonometri); bila tidak tersedia, palpasi bandingkan.",
        "Periksa dengan senter: bilik mata depan dangkal; oftalmoskop untuk menilai.",
        "Bedakan dari konjungtivitis/uveitis (miosis, sel flare).",
      ],
      investigations: [
        "Diagnosis klinis; gonioskopi oleh spesialis mata untuk konfirmasi sudut tertutup.",
      ],
      initialManagement: [
        "Rujuk ke dokter mata segera — tata laksana awal sambil menunggu:",
        "Asetazolamid 500 mg IV/PO; timolol 0,5% tetes; pilokarpin 2% (hanya bila TIO < 40 mmHg dan sudut tidak sepenuhnya tertutup); apraklonidin.",
        "Hiperosmolar (manitol IV) bila TIO sangat tinggi.",
        "Pasien telentang; analgesik & antiemetik; hindari midriatik.",
        "Terapi definitif: laser iridotomi perifer; iridotomi profilaksis mata kontralateral.",
      ],
      admissionCriteria: [
        "TIO tidak terkendali atau komplikasi → rawat koordinasi mata.",
      ],
      redFlags: [
        "Mata merah nyeri + mual/muntah + penglihatan kabur — jangan diagnosis 'migrain'.",
        "Jangan berikan obat antikolinergik/midriatik (memperburuk).",
      ],
    },
    references: [
      { org: "American Academy of Ophthalmology", title: "Primary Angle-Closure Disease — Preferred Practice Pattern", year: 2020 },
      { org: "PERDAMI", title: "Panduan Penatalaksanaan Glaukoma di Indonesia", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "dvt-pe",
    slug: "dvt-pe",
    title: "Penyakit Tromboemboli Vena (DVT & Emboli Paru)",
    specialties: ["Cardiology", "Pulmonology", "Internal Medicine", "Emergency Medicine"],
    keywords: ["dvt", "deep vein thrombosis", "emboli paru", "pe", "trombosis vena", "pulmonary embolism", "antikoagulan", "wells"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Trombosis vena dalam (DVT) dan emboli paru (PE) adalah satu spektrum penyakit tromboemboli vena (VTE). Predisposisi: imobilisasi, pascaoperasi, keganasan, kehamilan/kontrasepsi, trombofilia, riwayat VTE.",
      ],
      initialAssessment: [
        "DVT: bengkak tungkai, nyeri, hangat, merah; bandingkan kedua tungkai (paha/betis); skor Wells DVT.",
        "PE: sesak mendadak, nyeri dada pleuritik, takikardia, hipoksemia, sinkop; skor Wells PE / aturan PERC.",
        "Stabilisasi: oksigen, hemodinamik; PE dengan syok = PE masif (pertimbangkan trombolisis).",
      ],
      investigations: [
        "DVT: D-dimer (untuk menyingkirkan pada probabilitas rendah) → USG Doppler kompresi bila Wells ≥ 2 atau D-dimer positif.",
        "PE: D-dimer pada probabilitas klinis rendah-sedang; CTPA bila probabilitas tinggi atau D-dimer positif.",
        "Alternatif PE: V/Q scan bila kontraindikasi CTPA.",
        "Ekokardiografi pada PE masif/syok.",
      ],
      initialManagement: [
        "Antikoagulan segera bila probabilitas klinis tinggi (sambil menunggu konfirmasi): DOAC (rivaroksaban/apiksaban), atau LMWH + warfarin; heparin pada gangguan ginjal berat.",
        "DVT proksimal: DOAC/LMWH minimum 3 bulan; pertimbangkan perpanjangan sesuai risiko.",
        "PE tanpa syok: antikoagulan + pertimbangkan rawat/observasi berdasarkan skor (PESI/sPESI).",
        "PE masif (syok): trombolisis IV (alteplase) kecuali kontraindikasi; embolectomy/kateter bila gagal.",
        "Kompresi stoking (stocking) untuk mencegah sindrom pasca-trombotik.",
        "Skrining keganasan tersembunyi bila VTE tidak beralasan.",
      ],
      admissionCriteria: [
        "PE dengan hemodinamik tidak stabil, hipoksia, atau risiko tinggi: rawat.",
        "DVT proksimal besar/gejala berat: pertimbangkan rawat singkat untuk antikoagulan.",
      ],
      icuCriteria: [
        "PE masif (syok), kebutuhan vasopresor/trombolisis.",
      ],
      followUp: [
        "Pantau antikoagulan (INR bila warfarin; fungsi ginjal); evaluasi ulang durasi terapi.",
      ],
      redFlags: [
        "Sinkop + takikardia + hipoksemia mendadak = PE masif.",
        "Jangan menunda antikoagulan pada probabilitas klinis tinggi.",
      ],
    },
    references: [
      { org: "Konstantinides SV et al. (ESC)", title: "2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism", year: 2019, url: "https://doi.org/10.1093/eurheartj/ehz405" },
      { org: "Ortel TL et al. (ASH)", title: "American Society of Hematology 2020 guidelines for management of VTE", year: 2020 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "diabetes-gestasional",
    slug: "diabetes-gestasional",
    title: "Diabetes Melitus Gestasional (GDM)",
    specialties: ["Obstetrics & Gynecology", "Endocrinology"],
    keywords: ["gdm", "diabetes gestasional", "kehamilan", "dm kehamilan", "ttgo", "gestational diabetes"],
    emergency: false,
    ageGroup: "adult",
    pregnancyRelevant: true,
    sections: {
      overview: [
        "Hiperglikemia yang pertama kali diketahui saat kehamilan (tidak memenuhi kriteria DM nyata). Berisiko pada ibu (preeklampsia, seksio) dan janin (makrosomia, hipoglikemia neonatal).",
      ],
      classification: [
        "Skrining: semua ibu hamil idealnya diperiksa; lakukan lebih awal (trimester 1) bila berisiko tinggi (obesitas, riwayat GDM, riwayat keluarga DM, riwayat bayi besar, PCOS, glikosuria).",
        "Diagnosis: TTGO 75 g — satu dari: GDP ≥ 92 mg/dL, atau 1 jam ≥ 180 mg/dL, atau 2 jam ≥ 153 mg/dL (IADPSG/WHO).",
      ],
      initialAssessment: [
        "Skrining 24–28 minggu bila belum dilakukan; nilai faktor risiko dan riwayat obstetri.",
        "Pantau berat badan, tekanan darah, gula darah puasa & 2 jam postprandial, ketonuria.",
      ],
      investigations: [
        "TTGO 75 g; HbA1c tidak direkomendasikan untuk diagnosis GDM.",
        "Pemantauan: GDP target < 95 mg/dL dan 1 jam < 140 / 2 jam < 120 mg/dL (panduan bervariasi).",
      ],
      initialManagement: [
        "Terapi lini pertama: modifikasi gaya hidup + diet (karbohidrat terkontrol) + aktivitas fisik.",
        "Bila target gula tidak tercapai dalam 1–2 minggu: insulin (atau metformin/glibenklamid sesuai panduan dan kebijakan setempat).",
        "Pemantauan janin: USG pertumbuhan (makrosomia), NST sesuai indikasi.",
        "Rencanakan persalinan; pada GDM terkontrol baik umumnya cukup aterm.",
      ],
      followUp: [
        "TTGO ulang 4–12 minggu pascapersalinan untuk menyingkirkan DM persisten; skrining DM berkala selanjutnya.",
        "Bayi: pantau hipoglikemia neonatal.",
      ],
      redFlags: [
        "Gula sangat tinggi / ketoasidosis pada kehamilan = kegawatan.",
        "Makrosomia berat / polihidramnion — koordinasi obstetri.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Diagnostic criteria and classification of hyperglycaemia first detected in pregnancy", year: 2013 },
      { org: "American Diabetes Association", title: "Management of Diabetes in Pregnancy (Standards of Care)", year: 2024 },
    ],
    lastReviewed: "2025-06-01",
  },
];
