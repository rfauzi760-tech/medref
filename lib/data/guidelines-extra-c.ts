import type { GuidelineEntry } from "@/lib/types";

/** Panduan klinis ringkas - bagian 3 (Bahasa Indonesia). */

export const EXTRA_GUIDELINES_C: GuidelineEntry[] = [
  {
    id: "status-epileptikus",
    slug: "status-epileptikus",
    title: "Status Epileptikus",
    specialties: ["Neurology", "Emergency Medicine", "Intensive Care"],
    keywords: ["status epileptikus", "kejang", "konvulsi", "status epilepticus", "benzodiazepin", "leven", "fenitoin", "seizure"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Kejang berlangsung ≥ 5 menit atau kejang berulang tanpa pulih sadar di antaranya. Kegawatan neurologis: makin lama berlangsung, makin sulit dihentikan dan makin besar kerusakan otak.",
        "Jenis: konvulsif umum (tonik-klonik), non-konvulsif, dan fokal dengan kesadaran terganggu.",
      ],
      initialAssessment: [
        "ABCDE: posisi miring, lindungi dari cedera, oksigen, hisap bila perlu; jangan memasukkan benda ke mulut.",
        "Ukur glukosa darah segera (hipoglikemia sering). Cari tanda infeksi, trauma, ketidakpatuhan obat antiepilepsi, alkohol/obat, stroke.",
        "Akses IV; ambil darah (elektrolit, kalsium, magnesium, fungsi hati/ginjal, kadar obat antiepilepsi, toksikologi bila perlu).",
      ],
      investigations: [
        "CT kepala (setelah stabilisasi) bila ada trauma/defisit fokal/usia baru/kejang fokal.",
        "EEG untuk kejang non-konvulsif dan evaluasi pada yang tidak sadar kembali.",
        "LP bila dicurigai meningitis/ensefalitis.",
      ],
      initialManagement: [
        "Tahap 1 (0–5 mnt): benzodiazepin - midazolam 0,15–0,2 mg/kgBB IM/IV (maks 10 mg) atau diazepam 0,2–0,3 mg/kgBB IV (maks 10 mg), dapat diulang 1×.",
        "Tahap 2 (5–20 mnt): lini kedua bila tetap kejang - fenitoin 20 mg/kgBB IV (maks 50 mg/mnt, pantau EKG) atau levetirasetam 60 mg/kgBB IV (maks 4,5 g) atau asam valproat 40 mg/kgBB IV.",
        "Tahap 3 (refrakter > 20–30 mnt): infus anestesi - midazolam infus, propofol, atau barbiturat - intubasi dan rawat ICU.",
        "Koreksi hipoglikemia (dekstrosa 10–25%), gangguan elektrolit; atasi penyebab dasar.",
      ],
      admissionCriteria: [
        "Semua status epileptikus: rawat. Kejang yang berhenti namun penyebab belum jelas: observasi.",
      ],
      icuCriteria: [
        "Status refrakter, kebutuhan ventilasi/anestesi, atau etiologi berat (ensefalitis, stroke, sepsis).",
      ],
      redFlags: [
        "Kejang > 5 menit - jangan menunggu; mulai benzodiazepin.",
        "Pola kejang fokal berkepanjangan, kehamilan (eklamsia), imunosupresi, atau tidak kembali sadar - cari penyebab spesifik.",
      ],
    },
    references: [
      { org: "Glauser T et al. (ILAE)", title: "Evidence-based guideline: treatment of convulsive status epilepticus", year: 2016, url: "https://doi.org/10.1212/WNL.0000000000002911" },
      { org: "PERDOSSI", title: "Pedoman Tatalaksana Status Epileptikus", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "ensefalitis",
    slug: "ensefalitis",
    title: "Ensefalitis",
    specialties: ["Neurology", "Infectious Disease", "Pediatrics"],
    keywords: ["ensefalitis", "encephalitis", "herpes simpleks", "peradangan otak", "kejang", "penurunan kesadaran", "aciklovir"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Peradangan parenkim otak (berbeda dengan meningitis yang terutama selaput). Penyebab tersering di Indonesia: virus (terutama herpes simpleks/HSV), serta ensefalitis bakterial/parainfeksi.",
      ],
      classification: [
        "Viral: HSV-1 (fokal, temporal), virus arbo (dengue, JE, chikungunya), enterovirus, rabies, VZV.",
        "Autoimun/parainfeksi: ADEM, ensefalitis anti-NMDA.",
      ],
      initialAssessment: [
        "Gejala: demam, nyeri kepala, perubahan perilaku/kesadaran, kejang fokal, defisit neurologis baru.",
        "HSV: onset subakut + gangguan perilaku/bicara + kejang fokal + lesi temporal - terapi empirik segera.",
      ],
      investigations: [
        "LP: pleositosis limfosit, protein meningkat, glukosa normal (virus); PCR HSV/enterovirus bila tersedia.",
        "MRI kepala (lesi temporal HSV) dan EEG bila tersedia.",
        "Serologi dengue/JE/rabies sesuai epidemiologi; singkirkan TB.",
      ],
      initialManagement: [
        "Asiklovir IV 10 mg/kgBB tiap 8 jam (dewasa fungsi ginjal normal) bila HSV dicurigai - mulai tanpa menunggu hasil LP bila klinis kuat.",
        "Antikonvulsan untuk kejang; manajemen edema serebri bila ada (konsultasi neuro); hindari steroid rutin pada ensefalitis infeksi (kecuali HSV berat dengan edema/indikasi tertentu).",
        "Dukungan: cairan, nutrisi, pencegahan trombosis, rehabilitasi.",
      ],
      admissionCriteria: [
        "Semua suspek ensefalitis: rawat (neurologi/penyakit dalam).",
      ],
      icuCriteria: [
        "Penurunan kesadaran berat, status epileptikus, herniasi, atau kebutuhan ventilasi.",
      ],
      redFlags: [
        "Demam + perubahan perilaku + kejang = jangan diagnosis 'demam biasa'.",
        "Perburukan fokal cepat, tanda lateralisasi, papiledema.",
        "Paparan rabies (gigitan hewan) dengan gejala neurologis = fatal bila terlambat.",
      ],
    },
    references: [
      { org: "Tunkel AR et al. (IDSA)", title: "Encephalitis guideline", year: 2008, url: "https://doi.org/10.1086/595998" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "leptospirosis",
    slug: "leptospirosis",
    title: "Leptospirosis",
    specialties: ["Infectious Disease", "Internal Medicine"],
    keywords: ["leptospirosis", "leptospira", "weil", "demam", "ikterus", "penyakit kencing tikus"],
    emergency: false,
    ageGroup: "adult",
    sections: {
      overview: [
        "Zoonosis Leptospira melalui air/tanah terkontaminasi urine hewan (tikus). Fase awal seperti flu; fase imun dapat menimbulkan komplikasi organ (sindrom Weil: ikterus, gagal ginjal, perdarahan).",
      ],
      classification: [
        "Ringan (anikterik): demam, mialgia (betis/paha), sakit kepala, injeksi konjungtiva.",
        "Berat (sindrom Weil): ikterus, gagal ginjal akut, perdarahan (hemoptisis, purpura), meningitis aseptik, miokarditis.",
      ],
      initialAssessment: [
        "Riwayat kontak genangan air/bekas banjir, pekerjaan (sawah, pasar, kebersihan).",
        "Demam + mialgia betis + injeksi konjungtiva pada musim banjir - curiga leptospirosis.",
      ],
      investigations: [
        "Darah rutin (leukositosis, trombositopenia), fungsi ginjal-hati, urinalisis, kreatinin kinase.",
        "Serologi: IgM leptospira (MAT adalah baku emas namun butuh lab rujukan).",
        "Kultur (darah fase awal) hanya di lab khusus.",
      ],
      initialManagement: [
        "Antibiotik: doksisiklin 100 mg 2×/hari oral (atau IV) 7 hari; alternatif azitromisin, seftriakson, atau penisilin untuk kasus berat.",
        "Dukungan: hidrasi, pemantauan ginjal (gagal ginjal mungkin perlu dialisis), transfusi bila perdarahan.",
        "Kasus berat: rawat, pantau fungsi organ.",
      ],
      redFlags: [
        "Ikterus + oliguria + perdarahan = sindrom Weil - rawat intensif.",
        "Hemoptisis masif (perdarahan paru) dapat terjadi cepat.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Human leptospirosis: guidance for diagnosis, surveillance and control", year: 2003 },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Pengendalian Leptospirosis", year: 2019 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "rabies",
    slug: "rabies",
    title: "Rabies",
    specialties: ["Infectious Disease", "Emergency Medicine"],
    keywords: ["rabies", "anjing", "gigitan", "hidrofobia", "anti rabies", "var", "pep", "profilaksis pasca pajanan"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Ensefalitis virus Lyssavirus yang hampir selalu fatal setelah gejala muncul. Penularan: gigitan/cakaran/luka terbuka terpapar saliva hewan terinfeksi (anjing > 95% kasus Indonesia).",
      ],
      classification: [
        "Kategori pajanan (WHO): I - menyentuh/memberi makan hewan, kulit utuh; II - menggaruk kulit tanpa luka, atau lecet kecil tanpa perdarahan; III - gigitan/luka tembus kulit, luka lecet dengan perdarahan, atau pajanan mukosa.",
        "Gejala klinis: prodromal (demam, kesemutan di lokasi gigitan) → ensefalitis (hidrofobia, aerofobia, agitasi, kejang) atau bentuk paralitik.",
      ],
      initialAssessment: [
        "Tatalaksana luka SEGERA: cuci dengan sabun/air mengalir 10–15 menit, antiseptik (povidon iodin/alkohol).",
        "Tentukan kategori pajanan dan status hewan (tersedia untuk observasi 10–14 hari? / mati? / liar?).",
        "Jangan menjahit luka kategori III kecuali mutlak diperlukan.",
      ],
      investigations: [
        "Diagnosis rabies klinis/laboratorium (direktorat kesehatan hewan) pada kasus simtomatik; penanganan utama adalah pencegahan pasca pajanan.",
      ],
      initialManagement: [
        "Kategori II: VAR (vaksin anti-rabies) - jadwal 4 dosis (hari 0, 3, 7, 14) atau sesuai pedoman Kemenkes.",
        "Kategori III: VAR + SAR (serum anti-rabies) secepatnya (idealnya < 24 jam; dapat hingga 7 hari bila luka besar), infiltrasi di sekitar luka bila anatomis memungkinkan.",
        "Bila hewan tersedia dan sehat setelah observasi 10–14 hari, dosis lanjutan dapat dihentikan sesuai keputusan bersama dinas kesehatan.",
        "Profilaksis tetanus dan antibiotik sesuai luka; vaksinasi ulang sesuai status imunisasi rabies sebelumnya.",
      ],
      redFlags: [
        "Gigitan kepala/leher/tangan (pajanan risiko tinggi) - VAR+SAR segera.",
        "Hewan liar/tidak dapat diobservasi = anggap terinfeksi.",
        "Gejala neurologis rabies = mortalitas sangat tinggi; rawat paliatif-suportif di fasilitas yang mampu.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Rabies vaccines: WHO position paper / PEP guidance", year: 2018, url: "https://www.who.int/teams/immunization-vaccines-and-biologicals/diseases/rabies" },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Tatalaksana Rabies (PEP)", year: 2023 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "gigitan-ular",
    slug: "gigitan-ular",
    title: "Gigitan Ular Berbisa",
    specialties: ["Toxicology", "Emergency Medicine"],
    keywords: ["gigitan ular", "ular berbisa", "snake bite", "bisa ular", "antivenom", "sab", "koagulopati"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Kegawatan di daerah tropis. Keluarga penting di Indonesia: Viperidae (efek koagulopati/sitotoksik - ular tanah, bandotan) dan Elapidae (efek neurotoksik - kobra, weling).",
        "Kebanyakan gigitan ular tidak menyuntikkan bisa; tetapi pasien dengan tanda envenomasi membutuhkan antivenom segera.",
      ],
      classification: [
        "Lokal: bengkak progresif, nyeri, lepuh, nekrosis.",
        "Koagulopati (viper): perdarahan gusi/luka, hematemesis, hematuria; whole blood clotting test (WBCT20) memanjang.",
        "Neurotoksik (kobra/weling): ptosis, oftalmoplegia, diplopia, kelemahan otot bulbar → gagal napas.",
        "Sistemik lain: hipotensi/syok, rhabdomiolisis, gagal ginjal.",
      ],
      initialAssessment: [
        "ABCDE; identifikasi ular (foto bila memungkinkan) tanpa menangkapnya.",
        "Imobilisasi anggota tubuh yang tergigit (splint) setinggi jantung; lepaskan cincin/jam.",
        "JANGAN: menyedot bisa, menyayat luka, tourniquet arteri, mengompres es, memberikan listrik.",
        "Uji pembekuan (WBCT20) dan pantau serial (ptosis, kekuatan napas, bengkak).",
      ],
      investigations: [
        "Darah lengkap, koagulasi, kreatinin, CK, urinalisis; ulangi serial.",
        "Pertimbangkan foto/evaluasi lokal untuk nekrosis.",
      ],
      initialManagement: [
        "Antivenom (SABU - serum anti bisa ular) sesuai jenis: polivalen untuk viper/elapid sesuai panduan nasional; berikan di fasilitas yang mampu menangani reaksi anafilaksis.",
        "Indikasi antivenom: koagulopati (WBCT20 > 20 menit atau perdarahan), neurotoksik progresif, syok, atau bengkak progresif cepat.",
        "Dukungan: ventilasi bila gagal napas (neurotoksik), cairan, koreksi koagulopati, tatalaksana gagal ginjal.",
        "Profilaksis tetanus; antibiotik hanya bila ada tanda infeksi luka.",
      ],
      admissionCriteria: [
        "Semua gigitan berbisa (atau tidak dapat dipastikan) dengan tanda envenomasi: rawat.",
      ],
      icuCriteria: [
        "Gagal napas (neurotoksik), syok, koagulopati berat dengan perdarahan.",
      ],
      redFlags: [
        "Ptosis/diplopia = neurotoksik progresif - segera antivenom + siapkan ventilasi.",
        "Perdarahan tidak berhenti/hematuria = koagulopati berat.",
        "Bengkak menyebar cepat melewati sendi terdekat.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Guidelines for the management of snakebites", year: 2016, url: "https://apps.who.int/iris/handle/10665/249547" },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Nasional Pengendalian Gigitan Ular", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "anafilaksis",
    slug: "anafilaksis",
    title: "Anafilaksis",
    specialties: ["Emergency Medicine", "Allergy & Immunology", "Internal Medicine"],
    keywords: ["anafilaksis", "anaphylaxis", "syok anafilaktik", "epinefrin", "adrenalin", "alergi berat"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Reaksi hipersensitivitas sistemik berat, onset cepat, dapat fatal. Pemicu: obat (antibiotik, NSAID, kontras), makanan (kacang, seafood), sengatan serangga, lateks.",
      ],
      classification: [
        "Diagnosis bila salah satu: (1) onset akut (menit-jam) melibatkan kulit/mukosa + gangguan napas ATAU hipotensi; (2) 2 atau lebih organ segera setelah pajanan alergen potensial (kulit, napas, kardiovaskular, gastrointestinal); (3) hipotensi setelah pajanan alergen yang diketahui.",
      ],
      initialAssessment: [
        "Primary survey; nilai jalan napas (edema laring), napas (bronkospasme), sirkulasi (hipotensi).",
        "Cari tanda: urtikaria, angioedema, stridor, wheezing, muntah, sinkop.",
      ],
      initialManagement: [
        "Epinefrin IM 0,3–0,5 mg (dewasa) / 0,01 mg/kgBB (maks 0,3 mg, anak) di anterolateral paha - SEGERA, ulangi 5–15 menit bila perlu. Tidak ada kontraindikasi absolut pada anafilaksis.",
        "Hentikan agen penyebab; baringkan dengan kaki elevasi; oksigen aliran tinggi; IV line + kristaloid bolus cepat bila hipotensi.",
        "Bronkospasme: salbutamol nebul; antihistamin (difenhidramin) dan kortikosteroid sebagai terapi tambahan (bukan pengganti epinefrin).",
        "Refrakter/edema laring berat: pertimbangkan epinefrin infus dan rawat ICU.",
      ],
      admissionCriteria: [
        "Semua anafilaksis: observasi ≥ 4–6 jam (risiko bifasik); rawat bila berat/refrakter/komorbid.",
      ],
      redFlags: [
        "Jangan menunda epinefrin IM - menunggu obat lain meningkatkan mortalitas.",
        "Stridor/suara serak = edema laring; siapkan intubasi dini.",
      ],
    },
    references: [
      { org: "World Allergy Organization", title: "Anaphylaxis: Guidance 2020", year: 2020, url: "https://doi.org/10.1016/j.waojou.2020.100472" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "hipoglikemia",
    slug: "hipoglikemia",
    title: "Hipoglikemia",
    specialties: ["Endocrinology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["hipoglikemia", "gula darah rendah", "hypoglycemia", "insulin", "whipple", "koma"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Gula darah < 70 mg/dL (dewasa) disertai gejala, atau < 54 mg/dL sebagai ambang klinis berat. Penyebab: obat (insulin, sulfonilurea), sepsis, gagal organ, alkohol, malnutrisi, insulinoma.",
      ],
      classification: [
        "Gejala autonom: tremor, keringat dingin, palpitasi, lapar, cemas.",
        "Gejala neuroglikopenik: sulit konsentrasi, bicara kacau, perilaku aneh, kejang, koma.",
        "Berat: membutuhkan bantuan orang lain; kesadaran menurun/kejang.",
      ],
      initialAssessment: [
        "Ukur glukosa darah segera (POCT); konfirmasi bila ragu dan tersedia (hindari pengobatan berlebih pada tanpa gejala).",
        "Kaji obat (insulin/sulfonilurea, dosis & waktu), alkohol, sepsis, gagal ginjal/hepar, asupan.",
      ],
      investigations: [
        "Saat hipoglikemia tidak dapat dijelaskan: insulin, C-peptida, sulfonilurea skrining, kortisol, fungsi hati/ginjal.",
        "Pada dewasa muda sehat tanpa obat DM: cari penyebab (Whipple triad, insulinoma).",
      ],
      initialManagement: [
        "Sadar & bisa menelan: 15–20 g karbohidrat cepat oral (glukosa/gula, jus); ulangi bila < 70 mg/dL setelah 15 menit; lanjut makanan kompleks.",
        "Tidak sadar/tidak bisa menelan: dekstrosa 10–25% IV (0,2–0,5 g/kgBB; dewasa 25 g D40 atau 50 mL D50 bila tersedia) atau glukagon 1 mg IM; pertahankan jalan napas.",
        "Sulfonilurea: hipoglikemia dapat berulang - observasi ≥ 24 jam, infus dekstrosa sesuai kebutuhan.",
        "Setelah stabil: cari dan atasi penyebab; edukasi pasien (aturan 15-15, membawa gula/glukagon).",
      ],
      admissionCriteria: [
        "Hipoglikemia berat berulang, penyebab sulfonilurea, atau komorbid berat: rawat/observasi.",
      ],
      redFlags: [
        "Kejang/koma - jangan beri oral; IV glukosa/glukagon.",
        "Jangan berikan insulin pada dugaan hipoglikemia tanpa konfirmasi.",
      ],
    },
    references: [
      { org: "American Diabetes Association", title: "Standards of Care - Hypoglycemia", year: 2024 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "asfiksia-neonatorum",
    slug: "asfiksia-neonatorum",
    title: "Asfiksia Neonatorum",
    specialties: ["Neonatology", "Pediatrics"],
    keywords: ["asfiksia", "bayi baru lahir", "resusitasi", "newborn", "apgar", "hipoksia perinatal", "hypoxic ischemic encephalopathy"],
    emergency: true,
    ageGroup: "neonatal",
    sections: {
      overview: [
        "Gangguan pertukaran gas sebelum/selama persalinan → hipoksia, hiperkapnia, asidosis → kegagalan napas awal dan potensi kerusakan organ (terutama otak: HIE).",
        "Faktor risiko: gawat janin (denyut janin abnormal, mekonium), prematuritas, solusio/plasenta previa, distosia, persalinan lama.",
      ],
      classification: [
        "Skor APGAR mendokumentasikan kondisi bayi dan respons terhadap tindakan, tetapi tidak menentukan kapan resusitasi dimulai.",
        "Ensefalopati hipoksik-iskemik (HIE) dinilai setelah stabilisasi berdasarkan pemeriksaan neurologis dan kriteria klinis, bukan skor APGAR saja.",
      ],
      initialAssessment: [
        "Segera setelah lahir: nilai usia gestasi, tonus, dan napas atau tangisan; hangatkan, keringkan, posisikan, dan stimulasi bila perlu.",
        "Bila apnea, megap-megap, atau denyut jantung <100/menit setelah langkah awal, mulai ventilasi tekanan positif dalam 60 detik pertama.",
      ],
      initialManagement: [
        "Ventilasi adalah tindakan utama; berikan 30–60 inflasi/menit dan nilai kenaikan denyut jantung sebagai tanda efektivitas. Koreksi lekatan sungkup, posisi, sumbatan, dan tekanan bila tidak efektif.",
        "Bila denyut jantung <60/menit setelah 30 detik ventilasi efektif yang mengembangkan dada, gunakan jalan napas alternatif bila memungkinkan dan mulai kompresi terkoordinasi 3:1 dengan oksigen 100%.",
        "Bila denyut tetap <60/menit setelah 60 detik kompresi dan ventilasi adekuat, berikan epinefrin 0,01–0,03 mg/kg intravaskular melalui vena umbilikalis atau intraoseus; dosis endotrakeal 0,05–0,1 mg/kg hanya dipertimbangkan sambil menyiapkan akses vaskular.",
        "Titrasi oksigen menurut target saturasi preduktal dan usia gestasi. Pertahankan suhu 36,5–37,5 °C; pertimbangkan hipovolemia atau pneumotoraks bila respons tidak memadai.",
      ],
      investigations: [
        "Setelah stabilisasi, pantau napas, oksigenasi, denyut jantung, suhu, dan glukosa; nilai kemungkinan HIE serta komplikasi organ sesuai kondisi klinis.",
        "Hipotermia terapeutik untuk HIE sedang-berat pada bayi yang memenuhi kriteria (umumnya usia gestasi ≥36 minggu), dimulai dalam 6 jam setelah lahir selama 72 jam di fasilitas dengan protokol dan pemantauan yang memadai; rujuk dini bila perlu.",
      ],
      redFlags: [
        "Apnea atau megap-megap, denyut jantung <100/menit, atau tidak ada respons terhadap ventilasi memerlukan evaluasi dan eskalasi segera.",
        "Kejang, tonus buruk, gangguan napas menetap, atau kesulitan minum setelah resusitasi memerlukan penilaian HIE dan pemantauan atau rujukan.",
        "Cairan ketuban bercampur mekonium bukan indikasi pengisapan rutin. Pengisapan hanya dipertimbangkan bila ada bukti sumbatan jalan napas yang mengganggu ventilasi.",
      ],
    },
    references: [
      { org: "AHA/AAP", title: "2025 Guidelines for Neonatal Resuscitation", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/neonatal-resuscitation" },
      { org: "IDAI", title: "Resusitasi, Stabilisasi dan Transpor Bayi Berat Badan Lahir Rendah", year: 2022, url: "https://www.idai.or.id/professional-resources/pedoman-konsensus/pedoman-nasional-pelayanan-kedokteran-tata-laksana-berat-badan-lahir-rendah" },
    ],
    lastReviewed: "2026-09-16",
  },
];
