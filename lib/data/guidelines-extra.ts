import type { GuidelineEntry } from "@/lib/types";

/**
 * Panduan klinis ringkas - bagian 1 (Bahasa Indonesia).
 * Konten disusun secara orisinal merujuk sumber-sumber resmi yang dikutip;
 * tidak menyalin teks dari sumber mana pun secara verbatim.
 */

export const EXTRA_GUIDELINES_A: GuidelineEntry[] = [
  {
    id: "cedera-kepala",
    slug: "cedera-kepala",
    title: "Cedera Kepala",
    specialties: ["Surgery", "Emergency Medicine", "Neurology", "Intensive Care"],
    keywords: ["cedera kepala", "trauma kepala", "trauma kapitis", "head injury", "tbi", "traumatic brain injury", "gcs", "perdarahan intrakranial", "subdural", "epidural", "ct kepala"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Cedera kepala = trauma pada kepala yang dapat mengenai kulit kepala, tulang tengkorak, duramater, atau jaringan otak (Traumatic Brain Injury/TBI).",
        "Skala keparahan fungsional memakai GCS pasca-resusitasi: ringan 13–15, sedang 9–12, berat ≤ 8.",
        "Penyebab tersering: kecelakaan lalu lintas, jatuh, dan kekerasan. Penilaian sistematis mengikuti prinsip ATLS: trauma kepala adalah diagnosis sistemik - cedera lain (servikal, toraks, abdomen) sering menyertai.",
      ],
      classification: [
        "Berdasarkan GCS pasca-resusitasi (bukan GCS saat kejadian):",
        "Ringan: GCS 13–15 - mayoritas; namun risiko perdarahan intrakranial tetap ada (lihat Canadian CT Head Rule / NICE).",
        "Sedang: GCS 9–12 - perlu rawat dan CT kepala.",
        "Berat: GCS ≤ 8 - intubasi dini bila tidak dapat melindungi jalan napas; CT kepala segera setelah stabilisasi.",
        "Lesi intrakranial: epidural (EDH), subdural (SDH), subaraknoid traumatik, kontusio/perdarahan intraserebral, perdarahan intraventrikular, diffuse axonal injury.",
        "Fraktur tengkorak: linear, impresi, basis kranii (gejala: rinorea/otorea CSS, hemotimpanum, mata rakun, tanda Battle).",
      ],
      initialAssessment: [
        "Primary survey (ABCDE): Airway + imobilisasi C-spine (kolar) pada semua trauma berisiko; Breathing - oksigenasi, pertahankan SpO₂ ≥ 94%; Circulation - kendalikan perdarahan, hindari hipotensi (SBP ≥ 100–110 mmHg); Disability - GCS serial, pupil, tanda lateralisasi; Exposure - cari cedera lain.",
        "Hipoksia dan hipotensi memperburuk cedera otak sekunder - keduanya harus dicegah/dikoreksi agresif.",
        "Penilaian neurologis serial: GCS tiap 15–30 menit pada pasien berisiko; dokumentasikan ukuran dan reaktivitas pupil.",
        "Perburukan neurologis (GCS turun ≥ 2, anisokoria baru, lateralisasi) = tanda herniasi - tindakan segera.",
      ],
      investigations: [
        "CT kepala non-kontras adalah baku emas penilaian lesi intrakranial akut pada pasien bergejala/berisiko.",
        "Indikasi CT pada cedera kepala ringan: ikuti Canadian CT Head Rule (faktor risiko tinggi: GCS < 15 pada 2 jam, curiga fraktur terbuka/impresi, tanda fraktur basis kranii, muntah ≥ 2×, usia ≥ 65; atau amnesia ≥ 30 menit + mekanisme berbahaya) atau pedoman NICE.",
        "Foto polos tengkorak jarang mengubah tata laksana - tidak menggantikan CT.",
        "CT servikal harus dipikirkan bersamaan pada trauma (CT kapito-servikal).",
        "Laboratorium: darah rutin, koagulasi, glukosa, elektrolit; toksikologi bila ada indikasi.",
      ],
      initialManagement: [
        "Ringan tanpa faktor risiko: boleh pulang dengan instruksi observasi dan edukasi tanda bahaya (muntah berulang, nyeri kepala hebat, kejang, kesadaran menurun, kelemahan anggota gerak).",
        "Sedang/berat: rawat; pasang IV line, oksigen; puasakan bila ada indikasi operasi; pantau ketat.",
        "GCS ≤ 8 atau tidak mampu melindungi jalan napas: intubasi dengan fiksasi in-line C-spine (Rapid Sequence Intubation).",
        "Hindari hipotensi (SBP < 100 mmHg) dan hipoksia. Kaki kepala 15–30°, leher netral untuk membantu drainase vena.",
        "Hipotermia terapeutik TIDAK direkomendasikan rutin pada TBI dewasa.",
      ],
      definitiveManagement: [
        "EDH yang membesar dengan efek massa dan perburukan klinis = operasi segera (kraniotomi evakuasi).",
        "SDH akut dengan efek massa / ketebalan > 10 mm / midline shift > 5 mm = pertimbangkan evakuasi bedah (BTF).",
        "Konsultasi bedah saraf untuk: lesi dengan efek massa, fraktur impresi terbuka, kebocoran CSS, pneumosefalus, atau perburukan neurologis.",
        "Monitor tekanan intrakranial (ICP) pada pasien GCS ≤ 8 dengan CT abnormal; target ICP < 22 mmHg dan CPP 60–70 mmHg.",
        "Terapi peningkatan ICP: sedasi- analgesia, drainase CSS, manitol/NaCl hipertonik, hiperventilasi singkat hanya pada herniasi (jangan profilaksis), dekompresi kraniektomi pada kasus terpilih.",
      ],
      medications: [
        "Tidak ada neuroprotektor yang terbukti; hindari kortikosteroid (meningkatkan mortalitas pada TBI - CRASH trial).",
        "Antikonvulsan profilaksis (fenitoin/levetirasetam) hanya jangka pendek (7 hari) pada pasien berisiko kejang dini pasca-trauma; tidak untuk profilaksis epilepsi jangka panjang.",
        "Analgesia adekuat (hindari sedasi berlebih yang menutupi pemeriksaan); parasetamol lini pertama.",
        "Koreksi koagulopati; pada pasien antikoagulan, balikkan efek obat sesuai protokol.",
      ],
      admissionCriteria: [
        "Rawat inap: GCS 13–14 dengan faktor risiko, defisit neurologis, gangguan koagulasi, CT abnormal, atau tidak ada pengawas yang andal di rumah.",
        "Rawat observasi singkat untuk pasien sedang dan lesi intrakranial kecil yang tidak dioperasi - nilai ulang serial.",
      ],
      icuCriteria: [
        "ICU: GCS ≤ 8 (setelah stabilisasi), intubasi, perburukan neurologis, lesi intrakranial dengan efek massa, syok, atau trauma multisistem.",
        "Konsultasi bedah saraf dini untuk semua perdarahan intrakranial dan fraktur tengkorak signifikan.",
      ],
      discharge: [
        "Pasien ringan yang dipulangkan: edukasi pengawas tentang tanda bahaya dan instruksi kapan kembali; hindari alkohol.",
        "Jadwalkan kontrol bila ada keluhan menetap (nyeri kepala, pusing, gangguan konsentrasi - sindrom pasca-konkusi).",
      ],
      followUp: [
        "Evaluasi ulang 24–72 jam bila nyeri kepala/gejala menetap; CT ulang hanya bila ada indikasi klinis (bukan rutin).",
        "Edukasi kembali ke fasilitas bila muncul kejang, muntah berulang, kelemahan, atau penurunan kesadaran.",
      ],
      redFlags: [
        "GCS menurun (≥ 2 poin) atau tidak kembali normal.",
        "Anisokoria / pupil non-reaktif baru; lateralisasi (hemiparesis).",
        "Muntah berulang, nyeri kepala hebat progresif, kejang.",
        "Rinorea/otorea CSS, hematoma retroaurikular (Battle) atau periorbital (raccoon eyes) = fraktur basis kranii.",
        "Riwayat antikoagulan/koagulopati; gangguan koagulasi; alkoholisme.",
        "Usia lanjut dengan mekanisme cedera ringan pun dapat mengalami perdarahan intrakranial.",
      ],
    },
    references: [
      { org: "American College of Surgeons", title: "ATLS Advanced Trauma Life Support, 10th ed.", year: 2018, url: "https://www.facs.org/quality-programs/trauma/education/advanced-trauma-life-support/" },
      { org: "Carney N et al. (Brain Trauma Foundation)", title: "Guidelines for the Management of Severe Traumatic Brain Injury, 4th ed.", year: 2017, url: "https://doi.org/10.1093/neuros/nyw055" },
      { org: "Stiell IG et al.", title: "Canadian CT Head Rule", year: 2001, url: "https://www.cmaj.ca/content/165/7/877" },
      { org: "National Institute for Health and Care Excellence", title: "Head injury: assessment and early management (NG232)", year: 2023, url: "https://www.nice.org.uk/guidance/ng232" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "trauma-toraks",
    slug: "trauma-toraks",
    title: "Trauma Toraks",
    specialties: ["Surgery", "Emergency Medicine", "Intensive Care"],
    keywords: ["trauma toraks", "trauma dada", "pneumotoraks", "hemotoraks", "flail chest", "chest trauma", "tension pneumothorax", "tamponade"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Cedera pada dinding dada, pleura, paru, atau mediastinum akibat trauma tumpul/tajam. Empat kondisi yang membunuh cepat: obstruksi jalan napas, tension pneumothorax, tamponade jantung terbuka, dan perdarahan masif.",
        "Enam kondisi yang membunuh lambat: pneumotoraks sederhana, hemotoraks, flail chest, kontusio paru, ruptur aorta, ruptur diafragma.",
      ],
      classification: [
        "Pneumotoraks terbuka (sucking chest wound) vs tertutup; tension pneumothorax = kegawatan (udara satu arah, mediastinum terdorong).",
        "Hemotoraks: darah dalam rongga pleura (≥ 1.500 mL = masif).",
        "Flail chest: ≥ 2 fraktur iga berdekatan dalam ≥ 2 tempat → segmen dada paradoks.",
        "Tamponade jantung: trias Beck (hipotensi, JVP meninggi, bunyi jantung jauh) - pada trauma tajam/penetrasi.",
      ],
      initialAssessment: [
        "Primary survey ABCDE: inspeksi (gerakan dada simetris?), palpasi, perkusi, auskultasi kedua lapang paru.",
        "Saturasi dan EKG kontinu; akses IV besar pada dugaan perdarahan.",
        "eFAST untuk mendeteksi cairan pleura/perikardial dan pneumotoraks.",
      ],
      investigations: [
        "Foto toraks AP tegak (bila memungkinkan) - pneumotoraks, hemotoraks, pelebaran mediastinum.",
        "CT toraks untuk trauma tumpul berenergi tinggi dan dugaan cedera aorta.",
        "USG (eFAST) sebagai pelengkap penilaian cepat.",
      ],
      initialManagement: [
        "Tension pneumothorax: dekompresi jarum segera (line midklavikula sela iga II) lalu water seal drainage (WSD) - jangan menunggu foto.",
        "Pneumotoraks terbuka: tutup luka dengan dressing tiga sisi, lalu WSD.",
        "Hemotoraks masif: WSD; darah awal ≥ 1.500 mL atau ≥ 200 mL/jam selama 2–4 jam = indikasi torakotomi.",
        "Flail chest + gagal napas: oksigen, analgesia epidural/IV adekuat, ventilasi bila diperlukan.",
        "Tamponade: perikardiosentesis/emergency department thoracotomy (penetrasi) pada pusat yang mampu.",
      ],
      admissionCriteria: [
        "Semua trauma toraks dengan gangguan pernapasan, hemotoraks/pneumotoraks yang memerlukan WSD, atau kontusio paru: rawat.",
      ],
      icuCriteria: [
        "Gagal napas/intubasi, syok, trauma toraks masif, atau trauma multisistem.",
      ],
      redFlags: [
        "Distres napas progresif, hipoksia refrakter.",
        "Hipotensi tidak responsif resusitasi awal.",
        "Pelebaran mediastinum / dugaan ruptur aorta (trauma deselerasi).",
        "Emfisema subkutis menyebar, suara usus di dada (ruptur diafragma).",
      ],
    },
    references: [
      { org: "American College of Surgeons", title: "ATLS Advanced Trauma Life Support, 10th ed.", year: 2018 },
      { org: "Kementerian Kesehatan RI / PERABOI", title: "Pedoman Pelayanan Gawat Darurat Trauma", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "luka-bakar",
    slug: "luka-bakar",
    title: "Luka Bakar",
    specialties: ["Surgery", "Emergency Medicine"],
    keywords: ["luka bakar", "combustio", "burn", "parkland", "rule of nine", "resusitasi cairan"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Cedera jaringan akibat panas, listrik, kimia, atau radiasi. Luas (TBSA) dan kedalaman menentukan kebutuhan resusitasi dan rujukan.",
      ],
      classification: [
        "Luas: Rule of Nine dewasa (kepala 9%, ekstremitas atas 9% masing-masing, anterior/posterior trunk 18%, ekstremitas bawah 18% masing-masing, perineum 1%); anak: aturan modifikasi (kepala lebih besar).",
        "Kedalaman: derajat I (epidermis, eritema), derajat II superfisial/dalam (dermis), derajat III (full-thickness, putih/arang), derajat IV (hingga otot/tulang).",
        "Hitung TBSA derajat II dan III saja untuk resusitasi.",
      ],
      initialAssessment: [
        "Hentikan proses terbakar, lepaskan pakaian dan perhiasan; jaga suhu tubuh.",
        "Primary survey ABCDE: perhatikan inhalasi asap (suara serak, jelaga, bulu hidung terbakar, COHb) - intubasi dini bila dicurigai edema jalan napas.",
        "Akses IV besar melalui kulit sehat; mulai resusitasi.",
        "Kaji mekanisme: listrik (risiko aritmia/rhabdomiolisis), kimia (bilas lama), ledakan (cedera tersembunyi).",
      ],
      investigations: [
        "Laboratorium dasar, gas darah + COHb bila ada kecurigaan inhalasi, EKG pada luka bakar listrik.",
        "Rontgen/CT sesuai mekanisme trauma penyerta.",
      ],
      initialManagement: [
        "Resusitasi cairan Parkland: 4 mL × berat badan (kg) × %TBSA per 24 jam - separuh dalam 8 jam pertama, separuh dalam 16 jam berikutnya; kristaloid (RL).",
        "Sasaran diuresis: 0,5–1 mL/kgBB/jam dewasa, 1–1,5 mL/kgBB/jam anak.",
        "Analgesia adekuat (opioid titrasi). Balutan steril; jangan pecahkan bulla besar yang utuh; salep perak sulfadiazin/antibiotik topikal sesuai fase.",
        "Tetanus prophylaxis sesuai status imunisasi.",
      ],
      definitiveManagement: [
        "Perawatan luka serial (debridement, balutan antimikroba), eksisi dan grafting pada full-thickness/luka bakar dalam.",
        "Nutrisi tinggi kalori-protein sejak dini; rehabilitasi dan terapi fisik.",
      ],
      admissionCriteria: [
        "Rawat/rujuk ke pusat luka bakar bila: > 10% TBSA dewasa / > 5–10% anak, luka bakar derajat III, wajah/tangan/kaki/perineum/sendi, luka bakar listrik atau kimia, inhalasi asap, atau komorbid berat.",
      ],
      icuCriteria: [
        "Luka bakar masif dengan syok, inhalasi berat/intubasi, atau kegagalan organ.",
      ],
      redFlags: [
        "Distres napas/suara serak pasca paparan api di ruang tertutup.",
        "Hipotensi tidak responsif - cari penyebab lain (perdarahan, sepsis dini).",
        "Luka bakar sirkumferensial ekstremitas/dada → kompartemen/eskarotomi.",
      ],
    },
    references: [
      { org: "American Burn Association / Advanced Burn Life Support", title: "ABLS Course", year: 2020 },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Nasional Pelayanan Kedokteran Tata Laksana Luka Bakar", year: 2020 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "hipertensi-krisis",
    slug: "hipertensi-krisis",
    title: "Hipertensi Krisis (Emergensi & Urgensi)",
    specialties: ["Cardiology", "Emergency Medicine", "Internal Medicine"],
    keywords: ["hipertensi krisis", "hipertensi emergensi", "hipertensi urgensi", "td tinggi", "hypertensive emergency", "crisis"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Hipertensi krisis = tekanan darah sangat tinggi (umumnya TD ≥ 180/120 mmHg). Dibedakan menjadi emergensi (ada kerusakan organ target akut) dan urgensi (tanpa kerusakan organ akut).",
      ],
      classification: [
        "Emergensi hipertensif: TD ≥ 180/120 + kerusakan organ akut - ensefalopati, perdarahan intraserebral, iskemia/infark, gagal jantung akut/edema paru, ACS, diseksi aorta, eklampsia, gagal ginjal akut, retinopati/ papiledema.",
        "Urgensi hipertensif: TD sangat tinggi tanpa kerusakan organ akut.",
      ],
      initialAssessment: [
        "Ukur TD kedua lengan (dugaan diseksi bila asimetris), ulangi setelah istirahat.",
        "Anamnesis: kepatuhan obat, obat terlarang/NSAID/steroid, kehamilan.",
        "Pemeriksaan fisis: funduskopi (perdarahan, eksudat, papiledema), neurologis, kardiovaskular, tanda gagal jantung.",
        "Identifikasi organ target: EKG, fungsi ginjal + urinalisis, troponin, Rontgen/BNP bila sesak, CT kepala bila defisit neurologis, CT angiografi aorta bila dicurigai diseksi.",
      ],
      investigations: [
        "Laboratorium: kreatinin, elektrolit, urinalisis (protein/sedimen), glukosa; troponin; pada kehamilan: asam urat, fungsi hati, trombosit.",
        "Pencitraan sesuai kecurigaan organ target.",
      ],
      initialManagement: [
        "Emergensi: rawat ICU/HD; obat IV titrasi - target penurunan bertahap (tidak > 25% dalam 1 jam pertama).",
        "Pilihan IV: nikardipin, labetalol, nitrogliserin (sindrom koroner/gagal jantung), sodium nitroprusida (hindari pada uremia/kehamilan), esmolol, hidralazin (kehamilan).",
        "Pengecualian penurunan cepat: diseksi aorta (SBP < 120 dalam 20 menit), perdarahan intraserebral (sesuai pedoman), edema paru, eklampsia.",
        "Urgensi: mulai/kembalikan obat oral; jangan turunkan terlalu cepat atau berikan nifedipin sublingual (berbahaya).",
        "Eklampsia/PE berat: MgSO₄ + antihipertensi IV + terminasi sesuai indikasi obstetri.",
      ],
      admissionCriteria: [
        "Emergensi hipertensif: rawat (ICU bila memerlukan obat IV kontinu).",
        "Urgensi tanpa kerusakan organ: dapat dipantau di unit observasi sampai TD terkendali, lalu rawat jalan.",
      ],
      redFlags: [
        "Nyeri dada/retak, sesak berat, defisit neurologis, kejang, kehamilan, atau TD asimetris.",
        "Jangan pernah menurunkan TD terlalu cepat pada pasien tanpa kerusakan organ - risiko iskemia organ.",
      ],
    },
    references: [
      { org: "Whelton PK et al. / ACC-AHA", title: "2017 Hypertension Clinical Practice Guidelines", year: 2018, url: "https://doi.org/10.1161/HYP.0000000000000065" },
      { org: "PERKI", title: "Pedoman Tatalaksana Hipertensi", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "stroke-hemoragik",
    slug: "stroke-hemoragik",
    title: "Stroke Hemoragik (Perdarahan Intraserebral)",
    specialties: ["Neurology", "Emergency Medicine", "Intensive Care"],
    keywords: ["stroke hemoragik", "perdarahan intraserebral", "ich", "intracerebral hemorrhage", "sah"],
    emergency: true,
    ageGroup: "adult",
    sections: {
      overview: [
        "Perdarahan spontan dalam parenkim otak (atau sistem ventrikel/ruang subaraknoid). Hipertensi adalah penyebab tersering perdarahan intraserebral (PIS).",
      ],
      classification: [
        "PIS hipertensif: ganglia basal, talamus, pons, serebelum.",
        "Penyebab lain: angiopati amiloid (lansia, lobar), malformasi vaskular, antikoagulan, gangguan koagulasi, tumor, obat simpatomimetik.",
      ],
      initialAssessment: [
        "ABCDE; riwayat: onset mendadak, nyeri kepala, muntah, penurunan kesadaran, obat (antikoagulan/antiplatelet), trauma tersingkir.",
        "Neurologis: GCS, pupil, lateralisasi, NIHSS.",
      ],
      investigations: [
        "CT kepala non-kontras segera membedakan iskemik vs hemoragik (hiperdens).",
        "Laboratorium: darah rutin, koagulasi (PT/APTT/INR), fungsi ginjal-hepar, glukosa.",
        "CT angiografi bila dicurigai malformasi/aneurisma atau perdarahan atipikal; MRI sesuai indikasi.",
      ],
      initialManagement: [
        "Kendalikan tekanan darah: target SBP 130–140 mmHg (dengan IV titrasi, mis. nikardipin/labetalol) bila tidak ada kontraindikasi - ATACH-2/INTERACT-2.",
        "Balikkan antikoagulan segera (vitamin K + PCC/FFP untuk warfarin; antidot spesifik untuk DOAC bila ada); trombosit pada trombositopenia berat.",
        "GCS ≤ 8/aspirasi: intubasi; jaga normoksia; hindari hiperglikemia/hipoglikemia.",
        "Antikonvulsan profilaksis tidak rutin - obati kejang klinis/EEG.",
      ],
      definitiveManagement: [
        "Evakuasi bedah: perdarahan serebelum > 3 cm dengan perburukan/kompresi batang otak/hidrosefalus.",
        "EDH/SDH traumatik: sesuai pedoman bedah saraf; ICH skor digunakan untuk prognosis, bukan untuk menahan terapi.",
        "Manajemen ICP (monitor bila GCS ≤ 8); hidrosefalus: drainase ventrikel.",
      ],
      icuCriteria: [
        "Penurunan kesadaran, perdarahan besar/efek massa, hidrosefalus, atau kebutuhan ventilasi.",
        "Konsultasi bedah saraf dini.",
      ],
      followUp: [
        "Rehabilitasi dini; kontrol TD ketat; etiologi sekunder (angiografi) sebelum memutuskan penyebab.",
      ],
      redFlags: [
        "Perburukan neurologis cepat, dilatasi pupil, pernapasan tidak teratur.",
        "Perdarahan saat antikoagulan = gawat - balikkan efek segera.",
      ],
    },
    references: [
      { org: "Greenberg SM et al. (AHA/ASA)", title: "2022 Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage", year: 2022, url: "https://doi.org/10.1161/STR.0000000000000407" },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "meningitis",
    slug: "meningitis",
    title: "Meningitis (Bakterial & Viral)",
    specialties: ["Neurology", "Infectious Disease", "Emergency Medicine", "Pediatrics"],
    keywords: ["meningitis", "meningitis bakterial", "kaku kuduk", "lp", "lumbal pungsi", "ensefalitis", "demam nyeri kepala"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Peradangan selaput otak; bakterial adalah kegawatan (mortalitas tinggi bila antibiotik tertunda). Viral (enterovirus, HSV) lebih sering namun umumnya lebih ringan.",
      ],
      classification: [
        "Bakterial: pneumokokus, meningokokus, Haemophilus influenzae tipe b (vaksinable), Listeria (usia ekstrem/immunosupresi), E. coli (neonatus).",
        "Tuberkulosis: subakut, lebih sering di Indonesia - awasi pada demam berkepanjangan + tanda meningitis.",
        "Viral: enterovirus, herpes simpleks (ensefalitis fokal).",
      ],
      initialAssessment: [
        "Trias klasik: demam, nyeri kepala, kaku kuduk - bisa tidak lengkap pada bayi/lansia.",
        "Tanda meningeal: kaku kuduk, Kernig, Brudzinski.",
        "Bayi: iritabel, tangis melengking, ubun-ubun menonjol, kejang, letargi, tidak mau minum, hipotermia.",
        "Cari tanda bahaya: penurunan kesadaran, kejang fokal, defisit neurologis, petekie/ruam, papiledema.",
      ],
      investigations: [
        "Lumbar puncture (LP) setelah menyingkirkan kontraindikasi (efek massa pada CT, gangguan koagulasi, infeksi kulit di lokasi).",
        "Analisis CSS: tekanan, sel, protein, glukosa (bandingkan glukosa darah); Gram + kultur; PCR virus bila tersedia.",
        "Pola bakterial: pleositosis PMN, protein tinggi, glukosa rendah. Viral: limfosit dominan, glukosa normal.",
        "Darah: kultur, leukosit, CRP/prokalsitonin, gula darah (LP simultan).",
      ],
      initialManagement: [
        "Curiga bakterial: beri antibiotik empirik SEGERA (sebelum CT/LP bila LP tertunda): seftriakson 2 g IV + vankomisin; + ampisilin pada usia < 3 bulan, > 55 tahun, atau imunosupresi (Listeria).",
        "Deksametason 0,15 mg/kgBB IV sebelum/sesaat setelah antibiotik pertama (pneumokokus dewasa/anak) - lanjutkan 4 hari bila bakterial terkonfirmasi.",
        "Isolasi droplet pada dugaan meningokokus; profilaksis kontak erat (rifampisin/siprofloksasin).",
        "Cairan: jaga normovolemia; awasi SIADH.",
      ],
      admissionCriteria: [
        "Semua dugaan meningitis bakterial: rawat inap; monitoring ketat tanda neurologis.",
      ],
      icuCriteria: [
        "Penurunan kesadaran, kejang berulang, sepsis/syok, atau perburukan cepat.",
      ],
      followUp: [
        "Evaluasi ulang LP 24–48 jam bila tidak membaik; tuntaskan durasi antibiotik sesuai agen.",
      ],
      redFlags: [
        "Petekie/ruam purpura progresif (meningokokus).",
        "Defisit neurologis fokal, kejang, papiledema - jangan LP sebelum CT.",
        "Kegagalan respons 48 jam → cari komplikasi (abses, sinusitis, mastoiditis) dan TB.",
      ],
    },
    references: [
      { org: "van de Beek D et al. (ESCMID/IDSA)", title: "ESC guideline: acute bacterial meningitis", year: 2016, url: "https://doi.org/10.1016/j.cmi.2016.01.007" },
      { org: "Kementerian Kesehatan RI", title: "Pedoman pengendalian meningitis", year: 2022 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "kejang-demam",
    slug: "kejang-demam",
    title: "Kejang Demam",
    specialties: ["Pediatrics", "Neurology", "Emergency Medicine"],
    keywords: ["kejang demam", "febrile seizure", "step", "kejang pada anak", "demam"],
    emergency: true,
    ageGroup: "pediatric",
    sections: {
      overview: [
        "Kejang yang terjadi pada anak usia 6 bulan–5 tahun dengan demam tanpa infeksi susunan saraf pusat, tanpa gangguan elektrolit akut, dan tanpa riwayat kejang tanpa demam.",
        "Umumnya jinak; risiko epilepsi jangka panjang sedikit meningkat (terutama kompleks + abnormal neurologis).",
      ],
      classification: [
        "Sederhana: generalisata, < 15 menit, sekali dalam 24 jam, anak normal sebelumnya.",
        "Kompleks: fokal, ≥ 15 menit, berulang dalam 24 jam, atau anak dengan kelainan neurologis.",
      ],
      initialAssessment: [
        "Stabilkan: posisi miring, jangan memasukkan benda ke mulut; oksigen bila sianosis; ukur gula darah.",
        "Hentikan kejang ≥ 5 menit: diazepam rektal/IV 0,3–0,5 mg/kgBB (maks 10 mg) atau midazolam; bila refrakter → status epileptikus protocol.",
        "Cari sumber demam: faring, telinga, saluran napas, saluran kemih (urinalisis pada bayi/balita sesuai indikasi).",
        "Tanda yang mengarah ke infeksi SSP: ubun-ubun menonjol, letargi berkepanjangan, kejang fokal lama, atau tidak pulih sadar penuh → LP dipertimbangkan.",
      ],
      investigations: [
        "Tidak semua kejang demam sederhana perlu pemeriksaan luas - fokus pada mencari penyebab demam.",
        "Elektrolit, glukosa, LP, EEG, dan neuroimaging hanya sesuai indikasi (kejang kompleks, tanda SSP, atau atipikal).",
        "EEG tidak rutin pada kejang demam sederhana.",
      ],
      initialManagement: [
        "Atasi demam (parasetamol/ibuprofen) untuk kenyamanan - antipiretik tidak mencegah kejang berulang.",
        "Edukasi orang tua: cara menangani kejang di rumah dan kapan harus ke fasilitas.",
        "Profilaksis diazepam intermiten/antikonvulsan harian TIDAK dianjurkan rutin.",
      ],
      admissionCriteria: [
        "Kejang kompleks, kejang berulang, usia < 12 bulan, atau penyebab demam memerlukan rawat.",
      ],
      discharge: [
        "Kejang demam sederhana dengan anak sudah pulih dan penyebab demam jelas → boleh pulang dengan edukasi.",
      ],
      followUp: [
        "Kontrol bila kejang berulang atau ada keterlambatan perkembangan; rujuk neurologi anak bila kompleks/atipikal.",
      ],
      redFlags: [
        "Kejang > 15 menit/status epileptikus, kejang fokal, kejang tanpa demam.",
        "Tanda infeksi SSP (letargi, ubun-ubun menonjol, tidak pulih).",
        "Anak < 6 bulan atau > 5 tahun dengan gambaran kejang demam - cari penyebab lain.",
      ],
    },
    references: [
      { org: "Subcommittee on Febrile Seizures, American Academy of Pediatrics", title: "Neurodiagnostic Evaluation of the Child With a Simple Febrile Seizure", year: 2011 },
      { org: "IDAI", title: "Rekomendasi Penatalaksanaan Kejang Demam", year: 2016 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "demam-tifoid",
    slug: "demam-tifoid",
    title: "Demam Tifoid",
    specialties: ["Infectious Disease", "Internal Medicine", "Pediatrics"],
    keywords: ["tifoid", "demam tifoid", "typhoid", "salmonella typhi", "demam", "widal", "tipes"],
    emergency: false,
    ageGroup: "both",
    sections: {
      overview: [
        "Infeksi sistemik Salmonella enterica serovar Typhi; endemik di Indonesia. Penularan fecal-oral (makanan/minuman terkontaminasi).",
      ],
      classification: [
        "Klinis: demam naik bertahap, nyeri kepala, nyeri perut, konstipasi/diare, bradikardia relatif, lidah kotor (coated tongue), hepatosplenomegali.",
        "Komplikasi: perdarahan usus, perforasi usus (nyeri perut hebat mendadak), ensefalopati, syok.",
      ],
      initialAssessment: [
        "Demam ≥ 3–7 hari tanpa fokus + gejala gastrointestinal - tanyakan riwayat makanan/minuman dan kontak.",
        "Periksa tanda dehidrasi dan komplikasi abdomen (distensi, nyeri lepas, defans).",
      ],
      investigations: [
        "Kultur darah (baku emas, positif awal perjalanan penyakit); kultur sumsum tulang lebih sensitif.",
        "Uji serologi Widal/Tubex: interpretasi hati-hati (nilai rendah, reaksi silang, endemisitas).",
        "Darah rutin: leukopenia/leukositosis mungkin, trombositopenia; fungsi hati sering terganggu ringan.",
        "Feses/kultur bila dicurigai karier.",
      ],
      initialManagement: [
        "Antibiotik: seftriakson 1–2 g IV/hari (dewasa) atau 75 mg/kgBB/hari (anak) 5–7 hari; alternatif oral azitromisin 1 g/hari (dewasa) 7 hari untuk kasus tanpa komplikasi.",
        "Kloramfenikol/ampisilin/kotrimoksazol: resistensi luas - hanya bila sensitivitas mendukung.",
        "Hidrasi, antipiretik, nutrisi adekuat; jangan berikan antimotilitas.",
        "Perforasi usus → konsultasi bedah + antibiotik antianaerob.",
      ],
      admissionCriteria: [
        "Demam tinggi tidak dapat minum, toksik, komplikasi, atau bayi/lansia/immunosupresi - rawat.",
      ],
      redFlags: [
        "Nyeri perut hebat mendadak/peritonitis (perforasi).",
        "Perdarahan usus (melena masif, syok).",
        "Penurunan kesadaran (ensefalopati).",
      ],
      followUp: [
        "Edukasi higiene; pada karier (contoh pekerja makanan), pertimbangkan eradikasi.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "Typhoid fever - background document", year: 2023, url: "https://www.who.int/news-room/fact-sheets/detail/typhoid" },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Pengendalian Demam Tifoid", year: 2022 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "malaria",
    slug: "malaria",
    title: "Malaria",
    specialties: ["Infectious Disease", "Internal Medicine", "Pediatrics"],
    keywords: ["malaria", "plasmodium", "falciparum", "vivax", "demam", "rdt", "artesunat", "malaria berat"],
    emergency: false,
    ageGroup: "both",
    sections: {
      overview: [
        "Infeksi Plasmodium melalui gigitan nyamuk Anopheles. Spesies penting: P. falciparum (risiko berat), P. vivax (relaps hipnozoit), P. malariae, P. ovale, P. knowlesi.",
      ],
      classification: [
        "Malaria tanpa komplikasi vs malaria berat (salah satu dari: kesadaran menurun/koma, anemia berat, gagal napas, syok, DIC, hemoglobinuria, ikterus + disfungsi organ, hiperparasitemia > 5–10%).",
        "Gejala: demam periodik, menggigil, nyeri kepala, mialgia, muntah, anemia, splenomegali.",
      ],
      initialAssessment: [
        "Tanyakan riwayat perjalanan ke daerah endemis (termasuk luar Jawa) dalam 1–4 minggu terakhir.",
        "Cari tanda malaria berat: letargi/koma, napas cepat/asidosis, ikterus, perdarahan, syok, dehidrasi.",
      ],
      investigations: [
        "Sediaan apus darah tipis & tebal (konfirmasi, spesies, parasitemia) - ulangi bila negatif dan klinis kuat (interval 6–12 jam).",
        "RDT (rapid diagnostic test) di layanan tanpa mikroskop.",
        "Darah rutin, glukosa, fungsi ginjal-hati, elektrolit pada kasus berat.",
      ],
      initialManagement: [
        "Malaria falciparum tanpa komplikasi: ACT (mis. DHP/artemether-lumefantrine sesuai pedoman nasional); vivax/ovale: ACT + primakuin (eradikasi hipnozoit; skrining G6PD bila memungkinkan).",
        "Malaria berat: artesunat IV (2,4 mg/kgBB pada jam 0, 12, 24, lalu 1×/hari) - berikan segera meski harus merujuk; lanjutkan ACT oral setelah mampu.",
        "Koreksi hipoglikemia, anemia, dehidrasi; awasi gagal ginjal (hindari NSAID).",
        "Ibu hamil: ACT yang aman (kinin + klindamisin pada trimester 1 sesuai pedoman); vivax: profilaksis primakuin setelah melahirkan.",
      ],
      admissionCriteria: [
        "Malaria berat, falciparum pada ibu hamil/bayi, atau tidak dapat minum obat: rawat.",
      ],
      redFlags: [
        "Kesadaran menurun, kejang, napas asidotik, urin gelap, ikterus, syok - malaria berat.",
        "Jangan menunda terapi menunggu konfirmasi parasit pada klinis kuat di daerah endemis.",
      ],
      followUp: [
        "Evaluasi parasitemia serial; edukasi pencegahan gigitan nyamuk.",
      ],
    },
    references: [
      { org: "World Health Organization", title: "WHO Guidelines for Malaria", year: 2023, url: "https://www.who.int/publications/i/item/guidelines-for-malaria" },
      { org: "Kementerian Kesehatan RI", title: "Pedoman Tatalaksana Malaria", year: 2023 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "tetanus",
    slug: "tetanus",
    title: "Tetanus",
    specialties: ["Infectious Disease", "Surgery", "Emergency Medicine"],
    keywords: ["tetanus", "opistotonus", "trismus", "kaku", "clostridium tetani", "ats", "spasme"],
    emergency: true,
    ageGroup: "both",
    sections: {
      overview: [
        "Infeksi Clostridium tetani - toksin tetanospasmin menghambat pelepasan GABA → hipertonia dan spasme. Umumnya melalui luka terkontaminasi tanah.",
        "Neonatal (tetanus neonatorum) terkait perawatan tali pusat tidak higienis.",
      ],
      classification: [
        "Generalisata (paling sering): trismus (lockjaw), risus sardonicus, kaku otot abdomen/leher, opistotonus, spasme dipicu rangsang.",
        "Lokal: spasme otot di sekitar luka. Sefalik: kelumpuhan saraf kranial (jarang).",
        "Berat: spasme sering, disfagia, spasme laring, disfungsi otonom (hipertensi/aritmia).",
      ],
      initialAssessment: [
        "Kaji riwayat luka, imunisasi TT/Td, dan durasi gejala (inkubasi pendek = prognosis buruk).",
        "Nilai keparahan: frekuensi spasme, keterlibatan pernapasan, disfungsi otonom.",
      ],
      investigations: [
        "Diagnosis klinis - laboratorium tidak membantu rutin.",
        "Kultur luka anaerob (jarang positif); jangan menunda terapi.",
      ],
      initialManagement: [
        "AIG (anti-immunoglobulin tetanus) 3.000–6.000 unit IM - netralkan toksin bebas; bila tidak ada, ATS serum.",
        "Debridement luka + antibiotik (metronidazol 500 mg IV q8h selama 7–10 hari; alternatif penisilin).",
        "Kontrol spasme: benzodiazepin (diazepam titrasi); spasme berat: magnesium sulfat IV, atau relaksan neuromuskular + ventilasi di ICU.",
        "Ruangan tenang, minim rangsang; monitor otonom.",
        "Imunisasi aktif TT/Td segera (penyakit tidak memberi kekebalan).",
      ],
      admissionCriteria: [
        "Semua kasus tetanus: rawat (ideal ICU bila spasme/gangguan menelan).",
      ],
      redFlags: [
        "Spasme laring, dispnea, disfagia - risiko henti napas.",
        "Disfungsi otonom parah (takikardia/hipotensi fluktuatif).",
        "Pencegahan: TT booster 10 tahunan + perawatan luka yang benar.",
      ],
    },
    references: [
      { org: "Centers for Disease Control and Prevention", title: "Tetanus - Pink Book / clinical guidance", year: 2023, url: "https://www.cdc.gov/tetanus/index.html" },
      { org: "World Health Organization", title: "Tetanus - fact sheet & treatment", year: 2023 },
    ],
    lastReviewed: "2025-06-01",
  },
  {
    id: "sirosis",
    slug: "sirosis",
    title: "Sirosis Hati & Komplikasinya",
    specialties: ["Gastroenterology", "Hepatology", "Internal Medicine"],
    keywords: ["sirosis", "cirrhosis", "asites", "ensefalopati hepatik", "varises", "sbp", "gagal hati", "child pugh"],
    emergency: false,
    ageGroup: "adult",
    sections: {
      overview: [
        "Fibrosis hati lanjut dengan arsitektur hati rusak; kompensata vs dekompensata. Etiologi: hepatitis B/C, alkohol, NAFLD.",
      ],
      classification: [
        "Child-Pugh A/B/C dan MELD-Na untuk keparahan/prognosis.",
        "Dekompensasi: asites, perdarahan varises, ensefalopati hepatik, ikterus.",
      ],
      initialAssessment: [
        "Kaji tanda dekompensasi: asites, spider naevi, ginekomastia, ikterus, splenomegali, caput medusa.",
        "Skrining etiologi: HBsAg, anti-HCV, kadar besi/feritin, autoimun, alkohol/NAFLD.",
      ],
      investigations: [
        "Fungsi hati, albumin, INR, bilirubin; darah rutin & trombosit (sitopenia = hipertensi portal); AFP + USG abdomen (skrining HCC 6 bulanan).",
        "Endoskopi untuk skrining varises; elastografi bila tersedia.",
      ],
      initialManagement: [
        "Hentikan penyebab (antiviral HBV/HCV, abstinensi alkohol); vaksinasi.",
        "Varises: non-selektif beta-blocker (propranolol/karvedilol) atau ligasi untuk profilaksis.",
        "Asites: diet rendah garam + spironolakton (plus furosemid bila perlu); paracentesis terapeutik bila tegang; waspadai SBP.",
        "Ensefalopati: cari pencetus (perdarahan, infeksi, konstipasi, obat sedatif, gangguan elektrolit) + laktulosa (+ rifaksimin bila berulang).",
        "Kaji status imunisasi, vaksin hepatitis A/B, pneumokokus, influenza.",
      ],
      admissionCriteria: [
        "Perdarahan varises, SBP, ensefalopati grade ≥ 2, atau dekompensasi akut: rawat.",
      ],
      redFlags: [
        "Hematemesis/melena (varises) - resusitasi + terapi vasoaktif (terlipresin/oktreotid) + antibiotik profilaksis + endoskopi < 12 jam.",
        "Demam + asites + nyeri perut → SBP: paracentesis diagnostik (PMN ≥ 250/µL → antibiotik).",
        "Penurunan kesadaran mendadak - cari perdarahan GI/ensefalopati.",
        "Hepatoseluler: nyeri perut, BB turun, AFP naik.",
      ],
      followUp: [
        "Skrining HCC rutin; endoskopi ulang sesuai profilaksis; rujuk transplantasi bila Child-Pugh C/MELD tinggi.",
      ],
    },
    references: [
      { org: "European Association for the Study of the Liver", title: "EASL Clinical Practice Guidelines on the management of decompensated cirrhosis", year: 2018 },
      { org: "AASLD", title: "Guidance on the management of ascites, SBP, and hepatorenal syndrome", year: 2021 },
    ],
    lastReviewed: "2025-06-01",
  },
];
