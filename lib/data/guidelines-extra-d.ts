import type { GuidelineEntry } from "@/lib/types";

/** Panduan klinis ringkas - bagian 4 (Bahasa Indonesia). */

export const EXTRA_GUIDELINES_D: GuidelineEntry[] = [
  {
    id: "kehamilan-ektopik",
    slug: "kehamilan-ektopik",
    title: "Kehamilan Ektopik Terganggu (KET)",
    specialties: ["Obstetrics & Gynecology"],
    keywords: ["kehamilan ektopik", "ket", "ektopik", "ectopic pregnancy", "tuba", "nyeri perut", "perdarahan", "βhcg"],
    emergency: true,
    ageGroup: "adult",
    pregnancyRelevant: true,
    sections: {
      overview: [
        "Implantasi hasil konsepsi di luar kavum uteri (tersering tuba). Ruptur tuba = kegawatan perdarahan intraabdomen yang dapat fatal.",
        "Faktor risiko: riwayat KET/operasi tuba, IUD, PID, infertilitas/ART, endometriosis.",
      ],
      classification: [
        "Belum ruptur: nyeri perut bawah unilateral, spotting, amenorea, dapat tanpa gejala.",
        "Ruptur: nyeri hebat mendadak, pusing/sinkop, tanda syok, nyeri lepas, defans.",
      ],
      initialAssessment: [
        "Wanita usia reproduksi + nyeri perut/perdarahan → tes kehamilan; jangan pernah menyingkirkan KET sebelum hasil negatif.",
        "Tanda syok: hipotensi, takikardia, pucat - resusitasi dan rujuk operasi bila ruptur.",
        "Pemeriksaan: nyeri goyang porsio, massa adneksa, kavum Douglas menonjol.",
      ],
      investigations: [
        "β-hCG serial dan USG transvaginal: kavum kosong + β-hCG > ambang diskriminator atau β-hCG tidak naik adekuat.",
        "Bila ruptur/hemodinamik tidak stabil: jangan menunda laparotomi menunggu USG.",
      ],
      initialManagement: [
        "Ruptur/hemodinamik tidak stabil: laparotomi/laparoskopi segera + resusitasi + transfusi.",
        "Stabil & belum ruptur: pilihan - medikamentosa metotreksat (kriteria ketat) atau operatif (salpingektomi/salpingotomi) sesuai ukuran, β-hCG, dan keinginan fertilitas.",
        "Metotreksat hanya bila: β-hCG < 5.000, massa < 3,5–4 cm, tidak ada denyut janin, fungsi hati/ginjal baik, pasien dapat follow-up.",
        "Rujuk jika fasilitas tidak mampu menangani.",
      ],
      redFlags: [
        "Nyeri perut + sinkop + tes kehamilan positif (atau belum diketahui) = ruptur KET sampai terbukti lain.",
        "Jangan menunda operasi pada hemodinamik tidak stabil.",
      ],
    },
    references: [
      { org: "ACOG", title: "Practice Bulletin No. 191: Tubal Ectopic Pregnancy", year: 2018, url: "https://doi.org/10.1097/AOG.0000000000002460" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "bronkiolitis",
    slug: "bronkiolitis",
    title: "Bronkiolitis (Bayi & Balita)",
    specialties: ["Pediatrics", "Pulmonology"],
    keywords: ["bronkiolitis", "bronchiolitis", "bayi", "rsv", "mengi", "wheezing", "batuk", "sesak bayi"],
    emergency: false,
    ageGroup: "pediatric",
    sections: {
      overview: [
        "Infeksi virus saluran napas bawah (RSV tersering) pada bayi < 2 tahun: inflamasi bronkiolus → obstruksi, mengi, retraksi. Umumnya sembuh sendiri 1–2 minggu.",
      ],
      classification: [
        "Ringan: batuk + pilek, mengi ringan, saturasi normal, minum baik.",
        "Sedang: retraksi, napas cepat, saturasi 90–94%, minum berkurang.",
        "Berat: distres berat, saturasi < 90%, apneu, letargi, dehidrasi.",
      ],
      initialAssessment: [
        "Nilai saturasi, frekuensi napas, retraksi, kemampuan minum, riwayat apneu/prematuritas, komorbid.",
        "Cari tanda bahaya: apneu, napas < 60 dengan retraksi berat, tidak bisa minum, sianosis, letargi.",
      ],
      investigations: [
        "Umumnya diagnosis klinis - tidak perlu pemeriksaan rutin.",
        "Foto toraks hanya bila diagnosis meragukan/komplikasi; tes virus hanya untuk kohorting bila tersedia.",
      ],
      initialManagement: [
        "Suportif: posisi nyaman, bersihkan hidung (saline + suction), beri minum sedikit-sering, antipiretik.",
        "Oksigen bila saturasi < 90–92%; hindari oksigen rutin bila saturasi normal.",
        "TIDAK rutin: salbutamol, kortikosteroid, antibiotik, fisioterapi dada.",
        "Bila mengi berat dengan respons salbutamol yang jelas (jarang), dapat dicoba sekali; nebul salin hipertonik pada kasus terpilih.",
      ],
      admissionCriteria: [
        "Saturasi < 90–92%, apneu, tidak bisa minum (dehidrasi), distres sedang-berat, atau usia < 3 bulan dengan faktor risiko.",
      ],
      icuCriteria: [
        "Apneu berulang, gagal napas, saturasi rendah menetap, atau letargi.",
      ],
      redFlags: [
        "Apneu, napas sangat cepat dengan retraksi berat, tidak bisa minum = gawat.",
        "Bayi prematur/bblr dengan bronkiolitis berisiko tinggi memburuk.",
      ],
    },
    references: [
      { org: "American Academy of Pediatrics", title: "Clinical Practice Guideline: Bronchiolitis", year: 2014, url: "https://doi.org/10.1542/peds.2014-2742" },
      { org: "NICE", title: "Bronchiolitis in children (NG9)", year: 2021, url: "https://www.nice.org.uk/guidance/ng9" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "epistaksis",
    slug: "epistaksis",
    title: "Epistaksis (Mimisan)",
    specialties: ["ENT", "Emergency Medicine"],
    keywords: ["epistaksis", "mimisan", "nosebleed", "perdarahan hidung", "tampon anterior", "kauter"],
    emergency: false,
    ageGroup: "both",
    sections: {
      overview: [
        "Perdarahan dari rongga hidung. Anterior (pleksus Kiesselbach) paling sering, umumnya ringan; posterior (arteri sfenopalatina) lebih berat dan sering pada lansia/hipertensi.",
      ],
      initialAssessment: [
        "Tenangkan pasien; duduk condong ke depan, jangan menengadah; tekan bagian lunak hidung 10–15 menit (jangan lepas untuk memeriksa).",
        "Kaji jumlah, obat (aspirin/antikoagulan), trauma, hipertensi, gangguan koagulasi; tanda syok jarang namun mungkin pada perdarahan posterior masif.",
      ],
      investigations: [
        "Umumnya diagnosis klinis; darah lengkap/koagulasi bila perdarahan banyak, berulang, atau pasien antikoagulan.",
        "Nasoendoskopi untuk lokalisasi bila fasilitas memungkinkan.",
      ],
      initialManagement: [
        "Gagal kompresi: identifikasi sumber - kauter (perak nitrat) bila titik perdarahan anterior jelas.",
        "Tampon anterior (mis. nasal packing / Rapid Rhino) bila kauter tidak cukup.",
        "Tampon posterior/balon epistaksis bila anterior gagal - rujuk THT.",
        "Atasi hipertensi bila ada; tinjau antikoagulan bersama dokter; lumasi untuk mencegah kekeringan.",
      ],
      admissionCriteria: [
        "Perdarahan posterior, syok/hemodinamik tidak stabil, koagulopati, atau tampon yang memerlukan pemantauan: rawat.",
      ],
      redFlags: [
        "Perdarahan mengalir ke belakang (menelan darah/muntah darah) = curiga posterior - rujuk THT.",
        "Perdarahan berulang + massa/ulkus = evaluasi keganasan.",
      ],
    },
    references: [
      { org: "American Academy of Otolaryngology", title: "Clinical Practice Guideline: Nosebleed (Epistaxis)", year: 2020, url: "https://doi.org/10.1177/0194599819889955" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "kolik-renal",
    slug: "kolik-renal",
    title: "Kolik Renal / Batu Saluran Kemih",
    specialties: ["Urology", "Emergency Medicine"],
    keywords: ["kolik renal", "batu ginjal", "ureter", "renal colic", "urolitiasis", "nyeri pinggang", "hematuria"],
    emergency: false,
    ageGroup: "adult",
    sections: {
      overview: [
        "Nyeri kolik akibat obstruksi saluran kemih oleh batu - nyeri hebat menjalar dari pinggang ke selangkangan, gelisah, dapat disertai mual/muntah dan hematuria.",
      ],
      initialAssessment: [
        "Nyeri pinggang unilateral hebat onset mendadak; bedakan dari AAA (usia tua, pulsasi, hipotensi) dan pielonefritis (demam).",
        "Periksa demam (batu + infeksi = gawat), nyeri ketok sudut kostovertebra.",
        "Kaji fungsi ginjal dan kehamilan (jangan lupa tes kehamilan pada wanita usia reproduksi).",
      ],
      investigations: [
        "Urinalisis: hematuria (dapat negatif pada obstruksi total).",
        "CT non-kontras (baku emas) atau USG ginjal (alternatif, terutama kehamilan/anak) + foto polos.",
        "Kreatinin, elektrolit; darah rutin + CRP bila demam.",
      ],
      initialManagement: [
        "Analgesia: OAINS (diklofenak/ketorolak) lini pertama - lebih baik dari opioid; antiemetik; bila kontraindikasi, opioid short-acting.",
        "Hidrasi cukup (tidak ada bukti manfaat 'flush' berlebihan); tamsulosin (alpha-blocker) dapat membantu ekspulsi batu ureter distal 5–10 mm.",
        "Batu < 5 mm: observasi ekspulsi spontan (4–6 minggu); 5–10 mm: ekspulsi mungkin namun pertimbangkan intervensi.",
        "Batu + demam (urosepsis): drainase segera (DJ stent/PCN) + antibiotik - jangan hanya analgesik.",
        "Rujuk urologi: batu > 10 mm, gagal ekspulsi, obstruksi dengan gangguan ginjal, nyeri tak terkendali.",
      ],
      admissionCriteria: [
        "Demam/infeksi, gagal ginjal akut, anuria, nyeri tak terkendali rawat jalan, atau kehamilan dengan obstruksi.",
      ],
      redFlags: [
        "Batu + demam/menggigil = urosepsis - tindakan drainase segera.",
        "Anuria/oliguria, kreatinin naik = obstruksi bilateral/ginjal soliter.",
      ],
    },
    references: [
      { org: "European Association of Urology", title: "Urolithiasis Guidelines", year: 2024 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "sindrom-kompartemen",
    slug: "sindrom-kompartemen",
    title: "Sindrom Kompartemen Akut",
    specialties: ["Orthopedics", "Surgery", "Emergency Medicine"],
    keywords: ["sindrom kompartemen", "compartment syndrome", "fraktur", "nyeri hebat", "fasciotomi", "6p"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Tekanan dalam kompartemen osteofasial meningkat melampaui tekanan perfusi → iskemia otot-saraf. Kegawatan ortopedi: keterlambatan fasciotomi menyebabkan nekrosis permanen (kontraktur Volkmann) dan gagal ginjal.",
        "Pemicu: fraktur (tibia tersering), cedera remuk, gips ketat, perdarahan, reperfusi setelah iskemia.",
      ],
      classification: [
        "Gejala awal: nyeri hebat tidak sebanding cedera, memburuk dengan peregangan pasif otot, kompartemen tegang.",
        "Tanda lanjut ('5P'/'6P'): parestesia, pallor, pulselessness, paralysis, poikilotermia - tanda lanjut yang TIDAK boleh ditunggu.",
      ],
      initialAssessment: [
        "Tingkatkan kecurigaan pada fraktur tungkai bawah + nyeri berlebih. Periksa sensasi, motorik, dan peregangan pasif.",
        "Ukur tekanan kompartemen bila alat tersedia (ΔP = diastolik − tekanan kompartemen < 30 mmHg = indikasi fasciotomi).",
        "Longgarkan gips/perban segera.",
      ],
      initialManagement: [
        "Lepaskan/iris gips dan semua balutan melingkar segera.",
        "Pertahankan tungkai setinggi jantung (jangan elevasi berlebihan).",
        "Fasciotomi segera oleh bedah ortopedi bila klinis jelas atau ΔP < 30 mmHg.",
        "Jangan menunda fasciotomi menunggu pemeriksaan penunjang bila klinis kuat.",
      ],
      redFlags: [
        "Nyeri berlebih + peregangan pasif nyeri = kompartemen sampai terbukti lain.",
        "Tunggu hingga pulselessness/paralysis = kerusakan ireversibel.",
      ],
    },
    references: [
      { org: "American Academy of Orthopaedic Surgeons", title: "Acute Compartment Syndrome - Appropriate Use Criteria", year: 2019 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "anemia-defisiensi-besi",
    slug: "anemia-defisiensi-besi",
    title: "Anemia Defisiensi Besi (ADB)",
    specialties: ["Hematology", "Internal Medicine", "Pediatrics"],
    keywords: ["anemia", "defisiensi besi", "adb", "iron deficiency", "feritin", "besi", "pucat"],
    emergency: false,
    ageGroup: "both",
    sections: {
      overview: [
        "Anemia paling umum di dunia dan Indonesia: cadangan besi menipis (feritin rendah) → eritropoiesis defisien → mikrositik hipokrom.",
        "Penyebab: kehilangan darah (menstruasi, saluran cerna), asupan rendah, malabsorpsi, kebutuhan meningkat (anak, kehamilan).",
      ],
      classification: [
        "Ringan Hb 10–normal rendah; sedang 7–10; berat < 7 g/dL (dewasa; ambang anak sesuai usia).",
        "Morfologi: MCV rendah, MCH rendah, RDW tinggi; feritin rendah (atau saturasi transferin < 16–20%).",
      ],
      initialAssessment: [
        "Gejala: lemah, pucat, sesak saat aktivitas, pica; pada anak dapat gangguan kognisi/perilaku.",
        "Pada pria/pascamenopause dengan ADB: cari sumber perdarahan saluran cerna (endoskopi) - jangan hanya suplementasi.",
      ],
      investigations: [
        "Darah lengkap + indeks; feritin (penanda terbaik; pada inflamasi nilai 'normal' bisa menipu - gunakan ambang lebih tinggi atau saturasi transferin).",
        "Sesuai kecurigaan: darah saming feses, endoskopi, evaluasi menstruasi/kehamilan.",
      ],
      initialManagement: [
        "Besi oral: sulfas ferosus 65 mg elemen besi (200 mg) 1–3×/hari dewasa (lebih baik selang hari/tiap hari bila efek samping), anak 3–6 mg/kgBB/hari elemen besi; pantau Hb 4 minggu (naik ≥ 1 g/dL = adekuat).",
        "Berikan 3–6 bulan lagi setelah Hb normal untuk mengisi cadangan (feritin ≥ 30–50).",
        "Vitamin C meningkatkan absorpsi; teh/kopi/jangan bersamaan makan.",
        "Transfusi hanya bila anemia berat/gejala kardiovaskular/akan operasi; pada anak kriteria khusus.",
        "Atasi penyebab dasar; kehamilan: sesuai suplementasi rutin antenatal.",
      ],
      redFlags: [
        "ADB pada pria/lansia tanpa sumber jelas → cari keganasan GI.",
        "Tidak respons setelah 4–6 minggu: cek kepatuhan, diagnosis ulang, cari perdarahan berjalan/malabsorpsi.",
      ],
    },
    references: [
      { org: "Kementerian Kesehatan RI", title: "Pedoman penanggulangan anemia (termasuk suplementasi besi)", year: 2021 },
      { org: "WHO", title: "Guideline on use of ferritin concentrations to assess iron status", year: 2020 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "selulitis",
    slug: "selulitis",
    title: "Selulitis & Erisipelas",
    specialties: ["Dermatology", "Internal Medicine", "Emergency Medicine"],
    keywords: ["selulitis", "erisipelas", "cellulitis", "infeksi kulit", "merah", "bengkak", "antibiotik"],
    emergency: false,
    ageGroup: "both",
    sections: {
      overview: [
        "Infeksi dermis/subkutis (selulitis) atau dermis superfisial dengan batas tegas & meninggi (erisipelas). Penyebab tersering: Streptococcus pyogenes dan Staphylococcus aureus (termasuk MRSA).",
        "Predisposisi: luka, kaki diabetik, edema kronik/limfedema, insufisiensi vena, tinea pedis.",
      ],
      classification: [
        "Tanda: eritema, hangat, nyeri, bengkak, demam; erisipelas batas tegas meninggi; lepuh/ulkus dapat menyertai.",
        "Sistemik/berat: demam tinggi, menggigil, limfangitis, perluasan cepat, komorbid imunosupresi.",
      ],
      initialAssessment: [
        "Tandai batas eritema dengan pulpen untuk memantau perluasan; nilai tanda sistemik.",
        "Cari pintu masuk (interdigital, jamur kaki) dan komplikasi (abses, nekrosis).",
        "Bedakan: dermatitis kontak/stasis, DVT, gout, eritema migrans (Lyme).",
      ],
      investigations: [
        "Umumnya klinis. Kultur luka/darah hanya bila: imunosupresi, luka berat, sistemik, atau terapi gagal.",
        "CRP/leukosit membantu namun tidak wajib pada ringan.",
      ],
      initialManagement: [
        "Antibiotik oral anti-streptokokus-stafilokokus: kloksasilin/dikloksasilin atau sefaleksin 500 mg 4×/hari (atau sesuai sediaan lokal) 5–7 hari (perpanjang bila belum tuntas).",
        "MRSA (curiga/berisiko/riwayat): tambahkan kotrimoksazol atau doksisiklin.",
        "Elevasi tungkai, analgesik, antipiretik; obati tinea pedis/luka dasar.",
        "Perluasan cepat/tanda sistemik/selulitis wajah (risiko orbita/SSP): rawat, antibiotik IV (sefazolin/kloksasilin; + vankomisin bila MRSA).",
        "Kaki diabetik: pendekatan khusus (osteomielitis? iskemia?) - nilai dan rujuk.",
      ],
      admissionCriteria: [
        "Tanda sistemik, imunosupresi, perluasan cepat, wajah/periorbita, atau kegagalan terapi oral.",
      ],
      redFlags: [
        "Nyeri tidak sebanding + bulla hemoragik + krepitasi = necrotizing soft tissue infection - operasi segera.",
        "Selulitis orbita (nyeri mata, proptosis, oftalmoplegia) = gawat.",
      ],
    },
    references: [
      { org: "Stevens DL et al. (IDSA)", title: "Practice guidelines for the diagnosis and management of skin and soft tissue infections", year: 2014, url: "https://doi.org/10.1093/cid/ciu296" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "abdomen-akut",
    slug: "abdomen-akut",
    title: "Abdomen Akut",
    specialties: ["Surgery", "Emergency Medicine", "Internal Medicine"],
    keywords: ["abdomen akut", "acute abdomen", "nyeri perut", "apendisitis", "peritonitis", "ileus", "nyeri perut hebat"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Nyeri perut hebat onset mendadak/cepat memburuk yang menuntut keputusan cepat: observasi, medikamentosa, atau operasi. Pendekatan sistematis + diagnosis banding berbasis usia/jenis kelamin.",
      ],
      classification: [
        "Pola nyeri membantu: visceral (tengah, tumpul) vs somatik/parietal (tegas, terlokalisir) vs referred.",
        "Lokasi: RUQ (kolesistitis, hepatitis, ulkus), epigastrium (ulkus, pankreatitis), RLQ (apendisitis, adneksa, KET), LLQ (divertikulitis), suprapubik (urin).",
        "Penyebab vaskular (iskemia mesenterika, AAA ruptur) jarang namun fatal.",
      ],
      initialAssessment: [
        "Tanda vital, penampilan toksik, dehidrasi; pemeriksaan abdomen sistematis (inspeksi, auskultasi, palpasi, perkusi, nyeri lepas/defans).",
        "Tes kehamilan pada semua wanita usia reproduksi; rektal/vaginal bila perlu.",
        "Bedakan bedah vs non-bedah (gastroenteritis, ketoasidosis, kolik renal, pneumonia basal, porfiria).",
      ],
      investigations: [
        "Laboratorium: darah lengkap, elektrolit, fungsi ginjal-hepar, lipase/amilase, laktat, urinalisis, β-hCG.",
        "Pencitraan sesuai kecurigaan: USG abdomen (kandung empedu, obstetri, ginjal, apendiks di tangan terlatih); CT abdomen dengan kontras bila diagnosis tidak jelas di dewasa.",
        "Foto polos/CT tanpa kontras untuk obstruksi/perforasi.",
      ],
      initialManagement: [
        "Puasa + IV line + resusitasi cairan; koreksi elektrolit.",
        "Analgesia: jangan menahan opioid sampai diagnosis pada abdomen akut stabil (analgesia tidak menutupi tanda peritonitis yang menentukan keputusan operasi - bukti mendukung pemberian dini).",
        "Antibiotik bila peritonitis/perforasi/dugaan sepsis abdomen (jangan untuk semua nyeri perut).",
        "NGT bila ileus/obstruksi/muntah berulang; kateter urine untuk monitor pada syok/operasi.",
        "Konsultasi bedah segera bila: nyeri lepas/defans, distensi progresif dengan obstruksi, tanda iskemia/hemodinamik tidak stabil, atau diagnosis bedah kemungkinan besar.",
      ],
      admissionCriteria: [
        "Semua abdomen akut yang belum jelas / memerlukan observasi & analgetik IV: rawat.",
      ],
      icuCriteria: [
        "Syok septik/hemoragik, peritonitis difus, iskemia mesenterika, atau pascaoperasi besar.",
      ],
      redFlags: [
        "Nyeri hebat mendadak 'seperti disayat', defans, hilang bising usus = peritonitis.",
        "Lansia dengan nyeri 'ringan' namun takikardia/laktat naik - iskemia mesenterika mudah terlewat.",
        "Vaginal bleeding + nyeri = KET/aborsi sampai terbukti.",
      ],
    },
    references: [
      { org: "World Society of Emergency Surgery", title: "Diagnosis and management of acute abdomen - recommendations", year: 2020 },
    ],
    lastReviewed: "2025-06-01",
  },
];
