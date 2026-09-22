export interface EcgModuleSource {
  org: string;
  title: string;
  year: number;
  url: string;
}

export type EcgModuleBlock =
  | { kind: "heading"; title: string; text?: string }
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "table"; title?: string; headers: string[]; rows: string[][] }
  | { kind: "algorithm"; title: string; steps: { label: string; text: string }[] }
  | { kind: "cases"; title: string; cases: { title: string; text: string }[] };

export interface EcgModuleMeeting {
  number: number;
  title: string;
  summary: string;
  objectives: string[];
  lessons: { title: string; points: string[] }[];
  practice: string[];
  detailBlocks?: EcgModuleBlock[];
  sources: EcgModuleSource[];
}

/**
 * Kurikulum EKG orisinal RFSmed.
 * Meeting 1 diringkas secara orisinal dari konsep publik, bukan salinan materi Auctus.
 * Detail klinis harus diverifikasi terhadap sumber primer dan protokol lokal.
 */
export const ECG_MODULE_MEETINGS: readonly EcgModuleMeeting[] = [
  {
    number: 1,
    title: "Fondasi EKG dan cara membaca sistematis",
    summary: "Mulai dari kualitas rekaman, kalibrasi, lead, interval, sampai urutan interpretasi yang konsisten.",
    objectives: [
      "Memeriksa identitas pasien, waktu rekaman, artefak, dan penempatan lead sebelum membaca pola.",
      "Menggunakan kalibrasi standar 25 mm/detik dan 10 mm/mV bila tidak ada keterangan berbeda.",
      "Menyusun pembacaan dari frekuensi, ritme, aksis, interval, morfologi, ST-T, sampai perbandingan serial.",
    ],
    lessons: [
      { title: "Peta 12 lead", points: ["Lead inferior: II, III, aVF.", "Lead lateral: I, aVL, V5, V6.", "Lead anterior/septal: V1 sampai V4.", "Lead tambahan kanan atau posterior dipasang bila konteks klinis mengharuskannya."] },
      { title: "Urutan 7 langkah", points: ["Kualitas dan kalibrasi.", "Frekuensi dan ritme.", "Aksis QRS.", "Interval PR, durasi QRS, dan QT yang dikoreksi.", "Gelombang P dan morfologi QRS.", "ST-T serta tanda iskemia atau strain.", "Bandingkan EKG lama dan cocokkan dengan kondisi pasien."] },
    ],
    practice: [
      "Baca tiga EKG normal menggunakan urutan yang sama, lalu tulis satu kesimpulan singkat.",
      "Tandai lead yang saling berdekatan dan jelaskan mengapa perubahan pada dua lead berdekatan lebih bermakna daripada satu lead saja.",
    ],
    detailBlocks: [
      { kind: "heading", title: "1. Elektrofisiologi jantung", text: "Semua sel jantung berasal dari jaringan otot, tetapi sebagian berdiferensiasi menjadi sel kontraktil, penghantar, atau pacemaker. Pembagian ini membantu menjelaskan mengapa impuls dapat dibuat, diperlambat, atau muncul sebagai escape rhythm." },
      { kind: "table", title: "Tiga kelompok sel", headers: ["Sel", "Fungsi utama", "Lokasi utama"], rows: [
        ["Muscle", "Kontraksi", "Atrium dan ventrikel"],
        ["Conducting", "Propagasi listrik cepat", "Sistem His-Purkinje"],
        ["Pacemaker", "Automaticity dan pembentukan impuls", "SA node serta fokus junctional dan Purkinje bila terjadi escape"],
      ] },
      { kind: "heading", title: "AV node: tiga zona fungsional", text: "AV node memperlambat impuls agar pengisian ventrikel tetap berlangsung dan membatasi jumlah impuls atrium yang mencapai ventrikel." },
      { kind: "bullets", items: [
        "AN atau atrionodal: zona masuk dari atrium.",
        "N atau nodal: zona penundaan utama, sekitar 0,1 detik sebagai gambaran fisiologis, bukan angka tetap untuk setiap pasien.",
        "NH atau nodo-Hisian: zona keluar menuju bundle of His.",
        "Suplai AV node terutama berasal dari RCA pada dominansi kanan. Pada dominansi kiri, suplai dapat berasal dari LCx. Karena itu, inferior STEMI dapat disertai AV block, tetapi hubungan tersebut tidak bersifat mutlak.",
      ] },
      { kind: "heading", title: "Jalur konduksi normal", text: "SA node → miokardium atrium → AV node → bundle of His → bundle branch kanan dan kiri → Purkinje → miokardium ventrikel. Cardiac skeleton memisahkan atrium dan ventrikel sehingga jalur fisiologis utama melewati AV node. Bundle kiri dapat dibahas sebagai fascicle anterior, posterior, dan komponen septal, walaupun pembagian fascicle dapat berbeda antar referensi." },
      { kind: "table", title: "Aksi potensial sel otot ventrikel", headers: ["Fase", "Proses", "Arus ion dominan"], rows: [
        ["0", "Depolarisasi cepat", "Influks Na⁺"],
        ["1", "Repolarisasi awal", "Efluks K⁺ transien"],
        ["2", "Plateau", "Influks Ca²⁺ yang menyeimbangkan efluks K⁺"],
        ["3", "Repolarisasi akhir", "Efluks K⁺ setelah kanal Ca²⁺ menutup"],
        ["4", "Resting potential sekitar -90 mV", "Keseimbangan ion membran"],
      ] },
      { kind: "bullets", title: "Aksi potensial SA node dan AV node", items: [
        "Fase 0 terutama bergantung pada influks Ca²⁺, sehingga depolarisasi dan konduksi nodal lebih lambat daripada sel miokard ventrikel.",
        "Sel nodal tidak memiliki fase 1 dan plateau yang jelas seperti sel otot ventrikel.",
        "Fase 4 mengalami depolarisasi spontan melalui funny current dan arus kalsium. Ivabradine menghambat funny current pada indikasi yang sesuai, tetapi tidak boleh dipakai sebagai pengganti evaluasi penyebab takikardia.",
      ] },
      { kind: "heading", title: "Refractory period", text: "Sel yang baru mengalami depolarisasi memerlukan waktu untuk memulihkan kanal ion. Absolute refractory period berarti stimulus baru tidak dapat menghasilkan propagasi. Effective refractory period berarti depolarisasi mungkin terjadi, tetapi belum dapat menghasilkan propagasi efektif. Relative refractory period berarti stimulus lebih kuat dapat memicu respons. Konsep supernormal dan re-entry bersifat elektrofisiologis dan tidak boleh dipakai sendirian untuk menentukan diagnosis klinis." },
      { kind: "bullets", title: "Chronotropic dan dromotropic", items: [
        "Chronotropic: perubahan frekuensi pembentukan impuls SA node, terutama dipengaruhi kemiringan fase 4.",
        "Dromotropic: perubahan kecepatan konduksi, terutama pada AV node.",
        "Contoh klinis: PAC dapat tidak diikuti QRS bila AV node atau sistem distal masih refrakter.",
      ] },
      { kind: "heading", title: "2. Sistem 12 lead", text: "Lead adalah sudut pandang terhadap vektor listrik. Depolarisasi yang bergerak menuju kutub positif lead menghasilkan defleksi positif, sedangkan depolarisasi yang menjauh menghasilkan defleksi negatif. Arah repolarisasi memiliki hubungan berlawanan terhadap defleksi karena polaritas gelombangnya berbeda." },
      { kind: "bullets", title: "Aplikasi vektor", items: [
        "R-wave progression: V1-V2 biasanya memiliki R kecil dan S dalam, sedangkan V5-V6 memiliki R lebih besar dan S lebih kecil karena vektor ventrikel dominan bergerak ke kiri dan posterior.",
        "Transition zone biasanya berada sekitar V3-V4. Progression yang buruk dapat disebabkan infark lama, RVH, dextrocardia, variasi tubuh, atau kesalahan penempatan lead.",
        "P bifasik di V1 mencerminkan depolarisasi atrium kanan yang lebih dekat ke V1 dan atrium kiri yang lebih menjauh.",
        "Small septal q dapat muncul pada lead lateral karena depolarisasi septum dari kiri ke kanan. Q patologis tidak ditentukan dari satu angka saja, tetapi dari durasi, kedalaman, distribusi, dan konteks.",
      ] },
      { kind: "heading", title: "3. Tracing EKG dan nilai normal", text: "Nilai normal adalah rentang dan harus dibaca bersama usia, jenis kelamin, frekuensi, lead, teknik rekaman, serta konteks klinis. Angka berikut adalah panduan pendidikan, bukan pengganti interpretasi profesional." },
      { kind: "table", title: "Parameter dasar", headers: ["Parameter", "Panduan umum", "Makna"], rows: [
        ["P wave", "Durasi <120 ms, amplitudo biasanya <2,5 mm di lead inferior, positif di II dan negatif di aVR pada ritme sinus", "Depolarisasi atrium"],
        ["PR interval", "120-200 ms, diukur dari awal P sampai awal QRS", "Konduksi atrium ke ventrikel dan delay AV"],
        ["QRS", "Biasanya <120 ms", "Depolarisasi ventrikel"],
        ["ST segment", "Dekat garis isoelektrik", "Fase awal repolarisasi ventrikel"],
        ["T wave", "Umumnya asimetris dan mengikuti arah QRS dominan", "Repolarisasi ventrikel"],
        ["QT atau QTc", "Ukur dari awal QRS sampai akhir T; gunakan metode koreksi yang sesuai", "Total depolarisasi dan repolarisasi ventrikel"],
      ] },
      { kind: "bullets", title: "Detail yang sering menjadi jebakan", items: [
        "PR segment berbeda dari PR interval. PR segment adalah bagian isoelektrik setelah P sampai awal QRS dan dapat membantu menilai perubahan perikarditis.",
        "Q adalah defleksi negatif pertama sebelum R. Defleksi negatif setelah R disebut S. Bila seluruh kompleks negatif tanpa R, gunakan istilah QS.",
        "Intrinsicoid deflection adalah waktu dari awal QRS sampai puncak R pada lead prekordial. Pemanjangan dapat mendukung keterlambatan aktivasi ventrikel, tetapi tidak boleh menjadi diagnosis tunggal.",
        "ST depression up-sloping dapat bersifat fisiologis pada konteks tertentu, sedangkan horizontal atau down-sloping lebih mengkhawatirkan bila sesuai gejala dan perubahan serial.",
        "QTc bergantung pada metode koreksi. QTc >500 ms sering dipakai sebagai sinyal peningkatan risiko torsades, tetapi keputusan klinis harus memasukkan obat, elektrolit, frekuensi, dan riwayat pasien.",
      ] },
      { kind: "table", title: "Ringkasan cepat", headers: ["Parameter", "Pertanyaan saat membaca"], rows: [
        ["P wave", "Apakah ada, seragam, dan berasal dari sinus?"],
        ["PR", "Apakah konstan, memanjang, atau berubah sebelum dropped beat?"],
        ["QRS", "Sempit atau lebar, dan apakah morfologinya konsisten?"],
        ["ST-T", "Apakah ada perubahan teritorial, difus, dinamis, atau sekunder terhadap QRS?"],
        ["QTc", "Apakah memanjang setelah mempertimbangkan frekuensi dan metode koreksi?"],
      ] },
      { kind: "heading", title: "4. Irama jantung", text: "Pisahkan selalu aktivitas atrium dan ventrikel. Pada AV dissociation, atrium dan ventrikel dapat dikendalikan oleh pacemaker yang berbeda. Atrial rate lebih cepat daripada ventricular rate mendukung blok AV tinggi atau total, sedangkan ventricular rate yang lebih cepat dapat terlihat pada VT atau AIVR." },
      { kind: "table", title: "Rate intrinsik pacemaker", headers: ["Pacemaker", "Rate intrinsik perkiraan"], rows: [
        ["SA node", "60-100/menit"],
        ["Junctional atau AV", "40-60/menit"],
        ["Ventrikel atau Purkinje distal", "<40/menit"],
      ] },
      { kind: "bullets", title: "Kriteria ritme sinus", items: [
        "P positif di II, III, aVF, negatif di aVR, dan dapat bifasik di V1.",
        "Setiap P diikuti QRS dengan hubungan PR yang sesuai.",
        "Morfologi P seragam dan ritme PP biasanya teratur.",
        "Frekuensi 60-100/menit disebut sinus rhythm; kurang dari 60 adalah sinus bradikardia dan lebih dari 100 adalah sinus takikardia pada dewasa.",
        "Sinus arrhythmia adalah variasi interval PP dengan morfologi P sinus, sering terkait respirasi pada orang muda.",
      ] },
      { kind: "algorithm", title: "5. Algoritme membaca irama", steps: [
        { label: "Langkah 1: P wave", text: "Tentukan apakah P terlihat, apakah morfologinya sinus, apakah P seragam, dan apakah ada lebih dari satu morfologi P. Jika P tidak terlihat, cari AF, flutter, P yang tersembunyi di T atau QRS, sinus arrest, dan artefak." },
        { label: "Langkah 2: PR interval", text: "Tentukan apakah atrium dan ventrikel terhubung. PR konstan, PR memanjang progresif, dropped beat, atau disosiasi AV mengarahkan diagnosis yang berbeda." },
        { label: "Langkah 3: QRS", text: "Tentukan apakah ventrikel dikendalikan dari atas atau bawah AV node. QRS sempit biasanya menunjukkan aktivasi melalui sistem His-Purkinje, sedangkan QRS lebar memerlukan penilaian BBB, pre-eksitasi, pacing, hiperkalemia, toksisitas natrium, atau VT." },
      ] },
      { kind: "table", title: "Hubungan rate atrium dan ventrikel", headers: ["Pola", "Kemungkinan utama"], rows: [
        ["A = V, P diikuti QRS, PR sesuai", "Ritme sinus"],
        ["A > V", "Flutter dengan blok, high-grade AV block, atau total AV block"],
        ["V > A", "VT, AIVR, atau ritme junctional dengan konduksi retrograd"],
      ] },
      { kind: "bullets", title: "Wide-complex tachycardia", items: [
        "AV dissociation, capture beat, fusion beat, dan concordance prekordial sangat mendukung VT bila benar-benar terlihat.",
        "Aksis ekstrem atau morfologi yang tidak sesuai pola BBB tipikal menambah kecurigaan, tetapi tidak ada satu tanda yang selalu memastikan diagnosis.",
        "QRS yang lebih sempit tidak menyingkirkan VT. Pada kondisi tidak pasti, keselamatan pasien didahulukan dan algoritme takikardia kompleks lebar harus diikuti.",
      ] },
      { kind: "table", title: "RP interval pada narrow-complex regular tachycardia", headers: ["Pola", "Kemungkinan"], rows: [
        ["P tersembunyi di QRS atau RP sangat pendek", "AVNRT lebih mungkin"],
        ["Short RP dengan P retrograd", "AVRT atau mekanisme re-entry lain"],
        ["Long RP", "Atrial tachycardia atau takikardia dengan konduksi retrograd"],
      ] },
      { kind: "cases", title: "6. Kasus latihan", cases: [
        { title: "Kasus 1: inferior STEMI dengan AV dissociation", text: "PP reguler dan RR reguler, tetapi hubungan PR berubah. QRS sempit mendukung escape junctional. ST elevation inferior dan reciprocal change perlu memicu evaluasi ACS segera, termasuk pertimbangan lead kanan dan posterior sesuai gejala." },
        { title: "Kasus 2: escape ventrikel", text: "P sinus lebih cepat daripada QRS, QRS lebar, dan rate escape lambat. Ini lebih mengkhawatirkan daripada escape junctional karena cadangan pacemaker dan perfusi dapat lebih buruk." },
        { title: "Kasus 3: isorhythmic AV dissociation", text: "P kadang tampak menempel pada QRS karena rate atrium dan ventrikel kebetulan berdekatan. Jangan memberi label Mobitz II atau 2:1 block hanya dari satu lead tanpa menilai strip lebih panjang." },
        { title: "Kasus 4: sinus bradikardia dengan junctional escape", text: "P dan QRS dapat tetap 1:1, tetapi fokus junctional mengambil alih saat sinus melambat. Bedakan dari total AV block dengan menilai hubungan P-QRS dan regularitas masing-masing." },
        { title: "Kasus 5: AF yang menjadi reguler", text: "AF biasanya irregularly irregular. Bila ritme menjadi sangat reguler, pikirkan blok AV tinggi dengan escape atau efek obat dan cocokkan dengan riwayat digoksin, beta-blocker, atau calcium-channel blocker." },
        { title: "Kasus 6 dan 7: wide-complex tachycardia", text: "Cari AV dissociation, capture beat, atau fusion beat. Bila pasien tidak stabil, ikuti algoritme ALS dan jangan menunda terapi demi klasifikasi sempurna." },
        { title: "Kasus 8: sinus takikardia dan P yang tersembunyi", text: "Pada frekuensi tinggi, P dapat menumpang pada T sehingga T tampak seperti memiliki dua puncak. Cari morfologi yang konsisten dan hubungan P-QRS sebelum menyimpulkan SVT." },
        { title: "Kasus 9: AVNRT", text: "Takikardia reguler kompleks sempit dengan P sulit terlihat, pseudo-R' di V1 atau pseudo-S di inferior dapat mendukung AVNRT, tetapi diagnosis tetap memerlukan konteks dan algoritme takikardia." },
        { title: "Kasus 10: MAT", text: "Takikardia dengan sedikitnya tiga morfologi P, PR bervariasi, dan RR ireguler. Sering dikaitkan dengan penyakit paru, tetapi tetap korelasikan dengan oksigenasi, obat, dan penyebab metabolik." },
      ] },
    ],
    sources: [
      { org: "AHA/ACC/HRS", title: "Recommendations for the Standardization and Interpretation of the ECG, Part I", year: 2007, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.106.180200" },
    ],
  },
  {
    number: 2,
    title: "Ritme sinus, aritmia atrium, dan blok AV",
    summary: "Membedakan ritme reguler dan ireguler, lalu menghubungkan temuan EKG dengan stabilitas hemodinamik.",
    objectives: [
      "Mengenali sinus takikardia dan bradikardia tanpa menganggap angka frekuensi sebagai diagnosis tunggal.",
      "Membedakan fibrilasi atrium, flutter atrium, SVT kompleks sempit, dan blok AV.",
      "Menilai stabilitas, penyebab reversibel, dan kebutuhan eskalasi pada bradikardia atau takikardia.",
    ],
    lessons: [
      { title: "Ritme atrium", points: ["AF: interval RR ireguler tanpa gelombang P sinus yang konsisten.", "Flutter: aktivitas atrium berulang dengan pola saw-tooth dan konduksi AV yang dapat berubah.", "SVT reguler kompleks sempit membutuhkan korelasi mekanisme, gejala, dan respons terhadap manuver atau terapi sesuai algoritme."] },
      { title: "Konduksi AV", points: ["PR memanjang tetap menunjukkan blok derajat I.", "PR yang makin memanjang sebelum dropped beat mendukung Mobitz I.", "Dropped beat dengan PR relatif tetap mengkhawatirkan Mobitz II.", "Disosiasi AV menunjukkan blok derajat tinggi atau derajat III sampai terbukti sebaliknya."] },
    ],
    practice: [
      "Klasifikasikan lima strip berdasarkan regularitas RR, hubungan P-QRS, dan lebar QRS.",
      "Untuk setiap strip, tulis satu penyebab reversibel yang perlu dicari dan tanda ketidakstabilan klinis.",
    ],
    sources: [
      { org: "AHA", title: "2025 Adult Advanced Life Support Guidelines", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support" },
      { org: "ESC", title: "2024 Guidelines for the Management of Atrial Fibrillation", year: 2024, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/" },
      { org: "ACC/AHA/HRS", title: "Guideline for Bradycardia and Cardiac Conduction Delay", year: 2018, url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000628" },
    ],
  },
  {
    number: 3,
    title: "Iskemia, infark, dan pola oklusi koroner",
    summary: "Membaca ST-T secara kontekstual, mengenali distribusi teritorial, dan tidak menunda evaluasi sindrom koroner akut.",
    objectives: [
      "Menghubungkan lead berdekatan dengan wilayah miokard tanpa menyimpulkan arteri hanya dari satu pola.",
      "Mengenali elevasi atau depresi ST, inversi T dinamis, gelombang hiperakut, dan pola posterior atau ventrikel kanan.",
      "Menggunakan EKG serial, gejala, troponin, dan respons klinis secara bersamaan.",
    ],
    lessons: [
      { title: "Pola teritorial", points: ["Inferior: II, III, aVF, dengan penilaian lead kanan bila ada dugaan keterlibatan ventrikel kanan.", "Anterior atau lateral: nilai luas perubahan, reciprocal change, dan dinamika serial.", "Depresi ST dominan V1 sampai V3 pada gejala iskemik dapat memerlukan lead posterior."] },
      { title: "Batas interpretasi", points: ["EKG normal tidak menyingkirkan ACS.", "ST-T abnormal tidak selalu berarti infark akut, sehingga bandingkan EKG lama dan konteks klinis.", "Keputusan reperfusi mengikuti protokol ACS setempat dan konsultasi segera."] },
    ],
    practice: [
      "Petakan lead yang berubah pada empat kasus, lalu tulis apakah perubahan bersifat teritorial, difus, atau tidak spesifik.",
      "Latih kalimat laporan: temuan, distribusi, perubahan serial, dan tindakan yang perlu dipercepat.",
    ],
    sources: [
      { org: "ESC", title: "2023 Guidelines for the Management of Acute Coronary Syndromes", year: 2023, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/" },
      { org: "ESC/ACC/AHA/WHF", title: "Fifth Universal Definition of Myocardial Infarction", year: 2026, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/universal-definition-myocardial-infarction/" },
      { org: "AHA/ACC/HRS", title: "Recommendations for ECG Standardization, Part VI: Acute Ischemia/Infarction", year: 2009, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191098" },
    ],
  },
  {
    number: 4,
    title: "Aksis, hipertrofi, dan gangguan konduksi intraventrikel",
    summary: "Menilai aksis dan morfologi QRS sambil memahami bahwa kriteria voltase bukan diagnosis struktural tunggal.",
    objectives: [
      "Menggunakan lead I dan aVF sebagai orientasi awal aksis, lalu memperluas analisis bila hasil meragukan.",
      "Mengenali pola RBBB, LBBB, hemiblok, dan perubahan sekunder ST-T.",
      "Membedakan temuan yang mendukung hipertrofi dari diagnosis struktural yang memerlukan ekokardiografi atau imaging.",
    ],
    lessons: [
      { title: "Aksis dan QRS", points: ["Tentukan arah QRS secara keseluruhan, bukan hanya satu gelombang.", "QRS melebar dapat berasal dari BBB, pre-eksitasi, pacing, atau fokus ventrikel.", "Bandingkan morfologi dengan EKG lama bila tersedia."] },
      { title: "Hipertrofi", points: ["Kriteria voltase membantu skrining tetapi sensitivitas dan spesifisitas terbatas.", "Strain, perubahan repolarisasi, gejala, dan temuan pemeriksaan meningkatkan perhatian klinis.", "Gunakan imaging untuk menilai anatomi dan fungsi, bukan EKG saja."] },
    ],
    practice: [
      "Tentukan aksis dan lebar QRS pada lima contoh tanpa memberi label etiologi sebelum melihat konteks.",
      "Bandingkan satu pola BBB dengan pola pre-eksitasi dan pacing, lalu catat pembeda utama.",
    ],
    sources: [
      { org: "AHA/ACC/HRS", title: "Recommendations for ECG Standardization, Part III: Intraventricular Conduction Disturbances", year: 2009, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191095" },
      { org: "AHA/ACC/HRS", title: "Recommendations for ECG Standardization, Part V: Cardiac Chamber Hypertrophy", year: 2009, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191097" },
    ],
  },
  {
    number: 5,
    title: "Aritmia ventrikel, QT, elektrolit, dan obat",
    summary: "Mengenali pola yang berpotensi fatal dan menghubungkannya dengan penyebab reversibel.",
    objectives: [
      "Membedakan takikardia kompleks lebar, VT, VF, torsades, dan artefak dengan prioritas keselamatan.",
      "Menilai QT atau QTc secara hati-hati dan mencari obat serta gangguan elektrolit yang memperpanjang repolarisasi.",
      "Menggunakan respons klinis dan algoritme ALS, bukan hanya morfologi monitor.",
    ],
    lessons: [
      { title: "Pola berisiko", points: ["Wide-complex tachycardia pada pasien dengan penyakit struktural diperlakukan sebagai VT sampai terbukti sebaliknya.", "Polymorphic VT dengan QT memanjang mengarah ke torsades, sedangkan polymorphic VT dengan QT normal memiliki diferensial berbeda.", "VF dan pulseless VT adalah ritme shockable dalam algoritme resusitasi."] },
      { title: "Penyebab reversibel", points: ["Cari hipokalemia, hipomagnesemia, hiperkalemia, hipoksia, iskemia, hipotermia, dan toksisitas obat.", "Efek digoksin atau obat lain tidak boleh ditentukan dari satu tanda EKG saja.", "EKG membantu triase, tetapi kadar elektrolit, riwayat obat, dan kondisi pasien tetap wajib."] },
    ],
    practice: [
      "Buat daftar tindakan pertama untuk pasien dengan wide-complex tachycardia stabil dan tidak stabil, tanpa menghafal satu obat di luar protokol lokal.",
      "Identifikasi faktor yang dapat memperpanjang QT pada tiga skenario obat dan elektrolit.",
    ],
    sources: [
      { org: "AHA", title: "2025 Adult Advanced Life Support Guidelines", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support" },
      { org: "ESC", title: "2022 Guidelines for Ventricular Arrhythmias and Prevention of Sudden Cardiac Death", year: 2022, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/ventricular-arrhythmias-and-the-prevention-of-sudden-cardiac-death/" },
      { org: "AHA/ACC/HRS", title: "Recommendations for ECG Standardization, Part IV: ST-T, U Waves, and QT", year: 2009, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191096" },
    ],
  },
  {
    number: 6,
    title: "Pembacaan kasus IGD dan komunikasi klinis",
    summary: "Menggabungkan semua langkah menjadi laporan ringkas yang dapat ditindaklanjuti dan aman.",
    objectives: [
      "Menyelesaikan pembacaan EKG dalam urutan tetap tanpa melewatkan red flag.",
      "Membedakan pola yang membutuhkan respons segera dari temuan yang perlu evaluasi lanjutan.",
      "Mengomunikasikan hasil dengan format singkat: ritme, frekuensi, aksis, interval, QRS, ST-T, kesan, dan tindakan.",
    ],
    lessons: [
      { title: "Checklist IGD", points: ["Apakah pasien tidak stabil? Bila ya, panggil bantuan dan ikuti algoritme resusitasi.", "Apakah ada STEMI atau pola oklusi berisiko tinggi? Aktifkan jalur ACS sesuai sistem setempat.", "Apakah ada wide-complex tachycardia, blok derajat tinggi, QT sangat panjang, atau tanda hiperkalemia? Eskalasi segera.", "Baca ulang setelah intervensi atau perubahan klinis."] },
      { title: "Format laporan", points: ["Tulis temuan objektif sebelum interpretasi.", "Nyatakan keterbatasan, misalnya artefak, lead terbalik, atau tidak ada EKG pembanding.", "Jangan mengganti penilaian klinis dengan pembacaan otomatis mesin."] },
    ],
    practice: [
      "Gunakan enam kasus campuran dan batasi laporan awal menjadi tiga kalimat yang menyebutkan urgensi.",
      "Lakukan post-test mandiri: ulangi kasus yang salah dan tulis mengapa diagnosis awal keliru.",
    ],
    sources: [
      { org: "AHA", title: "2025 Adult Advanced Life Support Guidelines", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support" },
      { org: "ESC", title: "2023 Guidelines for the Management of Acute Coronary Syndromes", year: 2023, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/acute-coronary-syndromes/" },
      { org: "AHA/ACC/HRS", title: "Recommendations for the Standardization and Interpretation of the ECG", year: 2007, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.106.180200" },
    ],
  },
] as const;
