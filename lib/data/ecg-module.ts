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
 * Materi disusun sebagai bab belajar mandiri dari konsep elektrokardiografi dan sumber primer.
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
    detailBlocks: [
      { kind: "heading", title: "1. Urutan membaca ritme", text: "Jangan mulai dari menebak nama aritmia. Pastikan kualitas strip dan kondisi pasien, lalu baca atrium dan ventrikel secara terpisah. Gunakan lead II untuk gelombang P bila jelas, kemudian periksa V1 dan beberapa lead lain untuk mencari P yang tersembunyi." },
      { kind: "algorithm", title: "Alur interpretasi ritme", steps: [
        { label: "Tentukan stabilitas", text: "Nilai nadi, tekanan darah, kesadaran, nyeri dada, sesak, perfusi, dan tanda syok. Ketidakstabilan klinis memerlukan respons segera dan algoritme resusitasi setempat; pembacaan EKG tidak boleh menunda pertolongan." },
        { label: "Hitung rate atrium dan ventrikel", text: "Hitung PP dan RR secara terpisah. Pada ritme tidak teratur, ukur beberapa interval dan jangan mengandalkan satu kotak atau hasil otomatis." },
        { label: "Nilai regularitas", text: "Tentukan apakah PP dan RR teratur, ireguler teratur, atau ireguler tanpa pola. Ketidakteraturan RR membantu mengenali AF, tetapi juga dapat terjadi pada MAT, flutter dengan blok variabel, ektopi, dan artefak." },
        { label: "Cari P dan hubungannya dengan QRS", text: "Tanyakan apakah morfologi P konsisten, apakah setiap P diikuti QRS, apakah setiap QRS didahului P, serta apakah PR tetap. P yang tertutup T atau QRS perlu dicari pada lead lain atau strip yang lebih panjang." },
        { label: "Nilai lebar dan bentuk QRS", text: "QRS sempit biasanya berarti aktivasi ventrikel melalui sistem konduksi normal. QRS lebar dapat berupa blok cabang, pre-eksitasi, pacing, gangguan metabolik atau obat, maupun asal ventrikel." },
        { label: "Satukan temuan dengan konteks", text: "Bandingkan EKG sebelumnya, gejala, obat, penyakit struktural, elektrolit, oksigenasi, dan waktu timbulnya gejala. Tuliskan temuan yang terlihat sebelum memberi nama mekanisme." },
      ] },
      { kind: "table", title: "Pembeda takikardia atrium dan supraventrikular", headers: ["Ritme", "Pola atrium dan RR", "Petunjuk EKG", "Jebakan"], rows: [
        ["Sinus takikardia", "P sinus konsisten, biasanya 1:1 dengan QRS; RR teratur atau sedikit bervariasi", "P positif di II dan negatif di aVR; frekuensi meningkat bertahap", "Cari penyebab fisiologis atau klinis seperti demam, nyeri, hipovolemia, hipoksia, anemia, infeksi, atau emboli paru. Jangan hanya menekan angka frekuensi."],
        ["Fibrilasi atrium", "Tidak ada P sinus yang konsisten; RR biasanya irregularly irregular", "Baseline dapat menunjukkan gelombang fibrilasi halus atau kasar", "AF dengan blok AV lengkap atau pacing dapat tampak reguler. AF pre-eksitasi dapat berupa takikardia ireguler dengan QRS lebar."],
        ["Flutter atrium", "Aktivitas atrium teratur dan cepat; konduksi dapat tetap atau bervariasi", "Gelombang F berulang, sering tampak di II, III, aVF atau V1; konduksi 2:1 dapat memberi denyut ventrikel sekitar 150/menit", "F-wave bisa tersembunyi di QRS atau T. Takikardia reguler sekitar 150 bukan otomatis AVNRT."],
        ["Atrial tachycardia / MAT", "P berasal dari fokus atrium; pada MAT RR tidak teratur", "Atrial tachycardia memiliki P non-sinus yang seragam; MAT memiliki sedikitnya tiga morfologi P yang berbeda dengan interval PP dan PR bervariasi", "MAT tidak sama dengan AF. Cari penyakit paru, hipoksia, gangguan elektrolit, dan obat pemicu."],
        ["AVNRT / AVRT", "Sering takikardia reguler; P dapat tidak terlihat atau muncul retrograd", "RP dapat pendek, P dapat menyatu dengan QRS, atau tampak pseudo-r' di V1 dan pseudo-S di inferior", "Istilah SVT adalah kelompok mekanisme. Satu ciri morfologi tidak cukup untuk memastikan AVNRT atau AVRT."],
      ] },
      { kind: "heading", title: "2. Fibrilasi atrium dan flutter", text: "Pada AF, aktivasi atrium kacau dan respons ventrikel bergantung pada konduksi AV, tonus otonom, obat, serta jalur aksesori. Flutter memiliki aktivitas atrium yang lebih terorganisasi. Bentuk gelombang pada satu lead dapat sulit dibaca, sehingga kecepatan kertas, lead II dan V1, serta strip yang lebih panjang sering membantu." },
      { kind: "bullets", title: "Checklist AF", items: [
        "Pastikan tidak ada gelombang P sinus yang berulang dengan morfologi dan hubungan PR yang konsisten.",
        "Lihat apakah jarak RR bervariasi tanpa pola yang teratur; perhatikan ektopi dan artefak yang dapat menyerupai fibrilasi.",
        "Periksa lebar QRS. QRS lebar pada AF dapat berasal dari aberansi, blok cabang, pacing, atau pre-eksitasi dan memerlukan kehati-hatian lebih.",
        "Nilai frekuensi ventrikel, gejala, dan stabilitas. EKG saja tidak menentukan durasi AF, risiko emboli, atau strategi antikoagulasi.",
        "Bila ritme yang diduga AF tampak sangat reguler, evaluasi kemungkinan blok AV tinggi dengan escape, pacemaker, atau diagnosis alternatif.",
      ] },
      { kind: "bullets", title: "Checklist flutter", items: [
        "Cari aktivitas atrium berulang dengan interval dan morfologi yang konsisten, bukan hanya pola gigi gergaji klasik.",
        "Periksa inferior leads dan V1. Arah gelombang flutter bervariasi menurut sirkuit dan lokasi aktivasi.",
        "Hitung hubungan atrium-ventrikel: 2:1, 3:1, 4:1, atau blok variabel. Rasio dapat berubah sepanjang rekaman.",
        "Pada laju ventrikel sekitar 150/menit, cari gelombang flutter yang mungkin berada di tengah QRS atau T.",
      ] },
      { kind: "heading", title: "3. Takikardia kompleks sempit", text: "Mulai dengan menjawab apakah ritme teratur. Takikardia kompleks sempit reguler lebih sering berasal dari atas bifurkasi His, tetapi klasifikasi mekanisme tetap bergantung pada gelombang atrium, hubungan AV, riwayat, dan respons klinis. QRS sempit tidak otomatis berarti ritme jinak." },
      { kind: "table", title: "Takikardia reguler kompleks sempit", headers: ["Petunjuk", "Kemungkinan", "Langkah membaca"], rows: [
        ["P sinus sebelum setiap QRS dan PR tetap", "Sinus takikardia", "Cari onset bertahap, variasi dengan napas/aktivitas, dan penyebab pemicu."],
        ["P tidak tampak atau menyatu dengan QRS; RP sangat pendek", "AVNRT lebih mungkin", "Cari pseudo-r' di V1 atau pseudo-S di II, III, aVF; temuan ini suportif, bukan patognomonik."],
        ["P retrograd setelah QRS dengan RP pendek", "AVRT ortodromik atau mekanisme re-entry lain", "Cari bukti pre-eksitasi pada EKG sinus lama, tetapi tidak adanya delta wave tidak selalu menutup kemungkinan jalur aksesori."],
        ["P abnormal tampak sebelum QRS dengan RP lebih panjang", "Atrial tachycardia atau long-RP SVT", "Bandingkan bentuk P dengan P sinus dan perhatikan pemanasan/pendinginan ritme."],
        ["P reguler tetapi hubungan dengan QRS berubah", "Flutter atau atrial tachycardia dengan blok AV", "Cari lebih dari satu aktivitas atrium untuk setiap kompleks QRS."],
      ] },
      { kind: "algorithm", title: "Kerangka aman untuk takikardia reguler kompleks sempit", steps: [
        { label: "Stabilitas lebih dulu", text: "Bila terdapat hipotensi, perubahan kesadaran, tanda syok, nyeri iskemik, atau gagal jantung akut, eskalasi dan ikuti algoritme ALS. Persiapan kardioversi tersinkron dilakukan oleh tenaga terlatih sesuai protokol." },
        { label: "Jika stabil, rekam sebelum dan sesudah intervensi", text: "Pasang monitor, akses klinis yang diperlukan, dan simpan strip kontinu. Manuver vagal atau adenosin hanya dipertimbangkan untuk ritme yang sesuai, dengan pemantauan dan protokol lokal; adenosin dapat membuka aktivitas atrium sementara tanpa menghentikan flutter." },
        { label: "Waspadai pola ireguler dan pre-eksitasi", text: "Takikardia ireguler kompleks lebar bukan sasaran pendekatan SVT reguler biasa. Pertimbangkan AF pre-eksitasi dan minta bantuan ahli; terapi yang menekan nodus AV dapat berbahaya pada konteks ini." },
        { label: "Dokumentasikan mekanisme sebagai dugaan", text: "Tuliskan rate, regularitas, lebar QRS, aktivitas atrium, hubungan AV, stabilitas, dan respons. Hindari menyebut mekanisme pasti jika strip tidak cukup." },
      ] },
      { kind: "heading", title: "4. Bradikardia, escape, dan blok AV", text: "Bradikardia adalah temuan frekuensi, sedangkan diagnosis ritme menjelaskan sumber dan hubungan impuls. Escape rhythm merupakan mekanisme penyelamat ketika pacemaker lebih tinggi gagal atau impuls tidak mencapai ventrikel. QRS escape yang lebar sering menunjukkan fokus lebih distal, tetapi bentuk QRS dan kondisi pasien harus dinilai bersama." },
      { kind: "table", title: "Blok AV: apa yang harus terlihat", headers: ["Jenis", "Temuan", "Yang tidak boleh diasumsikan"], rows: [
        ["Derajat I", "Semua P diikuti QRS; PR >200 ms pada dewasa dan relatif tetap", "Tidak ada dropped beat. Ini adalah perlambatan konduksi, bukan kegagalan konduksi intermiten."],
        ["Derajat II Mobitz I", "PR memanjang bertahap sampai satu P tidak diikuti QRS; siklus kemudian berulang", "PR yang bervariasi saja belum cukup bila pola progresif dan reset tidak terlihat."],
        ["Derajat II Mobitz II", "P gagal dikonduksikan secara tiba-tiba; PR pada beat terkonduksi relatif tetap", "Pastikan bukan blocked PAC tersembunyi, artefak, atau sinus pause. Lebar QRS dapat memberi petunjuk lokasi, bukan kepastian."],
        ["Blok 2:1", "Setiap P kedua tidak diikuti QRS", "Satu pola 2:1 tidak selalu dapat diklasifikasikan Mobitz I atau II. Cari strip lebih panjang, respons rate, QRS, atau evaluasi lanjutan."],
        ["High-grade AV block", "Dua atau lebih P berturut-turut tidak dikonduksikan, dengan beberapa QRS yang masih muncul", "Escape yang menjaga perfusi tidak berarti bloknya aman."],
        ["Derajat III", "Aktivitas atrium dan ventrikel berjalan mandiri tanpa hubungan PR tetap; biasanya ada escape", "AV dissociation juga dapat terjadi ketika ventrikel lebih cepat dari atrium, misalnya pada VT. Lihat rate dan konteks sebelum menyimpulkan complete block."],
      ] },
      { kind: "algorithm", title: "Cara membedakan blok AV dan AV dissociation", steps: [
        { label: "Tandai semua gelombang P", text: "Gunakan lead dengan gelombang atrium paling jelas. Jangan menganggap setiap tonjolan di baseline sebagai P; T, F-wave, dan artefak bisa menipu." },
        { label: "Tentukan apakah ada PR yang berulang", text: "Jika P yang terkonduksi memiliki hubungan PR tertentu, nilai apakah PR tetap atau berubah. P yang sesekali jatuh pada QRS dapat memberi kesan hubungan padahal kebetulan." },
        { label: "Bandingkan frekuensi atrium dan ventrikel", text: "Atrial rate yang lebih cepat daripada escape ventricular mendukung blok AV tinggi/total; ventricular rate yang lebih cepat dapat menyebabkan AV dissociation tanpa complete AV block." },
        { label: "Nilai escape", text: "QRS sempit biasanya menunjukkan escape junctional, sedangkan kompleks lebar mengarah ke fokus ventrikel atau konduksi intraventrikel abnormal. Kecepatan, stabilitas, dan gejala menentukan urgensi." },
        { label: "Cari penyebab dan eskalasi", text: "Tinjau obat yang memperlambat nodus, iskemia, gangguan elektrolit, hipoksia, hipotermia, dan penyakit konduksi. Bradikardia dengan kompromi klinis perlu tata laksana segera sesuai algoritme." },
      ] },
      { kind: "bullets", title: "Bradikardia: konteks yang perlu diperiksa", items: [
        "Gejala dan perfusi lebih penting daripada satu ambang frekuensi: sinkop, hipotensi, perubahan kesadaran, iskemia, edema paru, dan tanda syok.",
        "Tinjau obat seperti beta-blocker, verapamil/diltiazem, digoksin, antiaritmia, serta interaksi atau overdosis yang relevan.",
        "Pertimbangkan iskemia akut, khususnya bila ada nyeri dada atau perubahan inferior, tetapi jangan mengaitkan satu lokasi infark dengan satu jenis blok secara mutlak.",
        "Cari penyebab metabolik atau sistemik seperti hiperkalemia, hipotermia, hipoksia, hipotiroid, infeksi berat, dan peningkatan tonus vagal.",
        "Bandingkan EKG lama. Blok baru, QRS lebar, escape lambat, atau jeda panjang meningkatkan kekhawatiran dan kebutuhan evaluasi segera.",
      ] },
      { kind: "cases", title: "Kasus latihan dan kunci penalaran", cases: [
        { title: "Kasus A: laju sekitar 150/menit, kompleks sempit, sangat reguler", text: "Jangan langsung menyebut AVNRT. Cari aktivitas atrium di inferior leads dan V1, hitung kemungkinan flutter 2:1, lalu periksa apakah P sinus terlihat dan konsisten." },
        { title: "Kasus B: ireguler tanpa P sinus yang jelas", text: "AF menjadi pertimbangan kuat. Tetap periksa artefak, ektopi, flutter dengan blok variabel, dan apakah QRS lebar atau ada tanda pre-eksitasi." },
        { title: "Kasus C: PR makin panjang sebelum QRS hilang", text: "Pola mendukung Mobitz I bila siklus progresi dan reset dapat ditunjukkan. Cari gejala, lokasi kemungkinan, obat, serta perubahan dari EKG sebelumnya." },
        { title: "Kasus D: satu P tidak diikuti QRS, PR beat lain tampak tetap", text: "Pertimbangkan Mobitz II, tetapi singkirkan blocked PAC tersembunyi dan artefak. Ulangi strip lebih panjang dan nilai lebar QRS serta kondisi klinis." },
        { title: "Kasus E: P dan QRS teratur tetapi tidak berkaitan; P lebih cepat", text: "Temuan mendukung AV dissociation dengan escape, termasuk kemungkinan high-grade atau complete AV block. Pastikan hubungan tersebut bukan kebetulan dan evaluasi perfusi segera." },
        { title: "Kasus F: P dan QRS teratur tetapi ventricular rate lebih cepat", text: "AV dissociation saja tidak sama dengan blok total. Pertimbangkan VT atau AIVR, periksa lebar QRS, capture/fusion beat, penyakit struktural, dan konteks reperfusi." },
      ] },
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
    detailBlocks: [
      { kind: "heading", title: "1. Apa yang sedang dinilai pada ST-T?", text: "EKG menggambarkan perubahan listrik, bukan melihat trombus atau aliran koroner secara langsung. Iskemia, cedera akut, dan infark adalah konsep klinis yang dikaitkan dengan gejala, perubahan serial, biomarker, dan bukti lain. Ukur ST relatif terhadap baseline yang sesuai dan nilai distribusinya, bentuknya, serta evolusinya." },
      { kind: "table", title: "Bahasa interpretasi ST-T", headers: ["Istilah", "Cara memahami", "Batas"], rows: [
        ["ST elevation", "J point tampak lebih tinggi dari baseline pada lead terkait", "Ambang bergantung lead, usia, jenis kelamin, morfologi, dan konteks. Satu lead atau satu angka tidak mendiagnosis infark sendirian."],
        ["ST depression", "J point atau segmen ST berada di bawah baseline", "Dapat mencerminkan iskemia, perubahan resiprokal, strain, obat, konduksi abnormal, atau penyebab lain."],
        ["T inversion / perubahan T dinamis", "Arah atau bentuk T berubah dibandingkan baseline atau rekaman serial", "T inversi memiliki diferensial luas. Kedalaman saja tidak menetapkan etiologi."],
        ["Hyperacute T", "T tampak relatif tinggi, lebar, atau simetris dibandingkan konteks dan EKG lama", "Subjektif dan dapat menyerupai variasi normal atau gangguan elektrolit. Periksa QRS, ST, gejala, serta perubahan serial."],
        ["Reciprocal change", "Perubahan berlawanan di lead yang memandang wilayah lain", "Meningkatkan perhatian terhadap pola teritorial, tetapi ketiadaannya tidak menyingkirkan oklusi."],
      ] },
      { kind: "table", title: "Ambang elevasi ST yang lazim dipakai pada dewasa", headers: ["Lead", "Ambang J point pada sedikitnya 2 lead berdekatan", "Catatan"], rows: [
        ["Selain V2-V3", "≥1 mm", "Gunakan lead anatomis berdekatan dan konteks klinis; pola ini bukan diagnosis infark tanpa bukti lain."],
        ["V2-V3, pria usia ≥40 tahun", "≥2 mm", "Ambang ini khusus V2-V3."],
        ["V2-V3, pria usia <40 tahun", "≥2,5 mm", "Cutoff berubah menurut usia."],
        ["V2-V3, perempuan", "≥1,5 mm", "Cutoff ini berlaku tanpa membedakan usia dewasa."],
      ] },
      { kind: "table", title: "Peta lead dan wilayah yang terlihat", headers: ["Wilayah permukaan", "Lead utama", "Langkah tambahan bila sesuai"], rows: [
        ["Inferior", "II, III, aVF", "Pertimbangkan V3R-V4R pada dugaan keterlibatan ventrikel kanan; I dan aVL dapat menunjukkan perubahan resiprokal."],
        ["Septal/anterior", "V1-V4", "Perhatikan progresi dari V1 ke V4 dan perluasan ke I, aVL, V5-V6."],
        ["Lateral", "I, aVL, V5-V6", "Bandingkan perubahan di lead yang berdekatan dan lihat perubahan resiprokal inferior bila ada."],
        ["Posterior", "V7-V9", "Depresi ST dominan V1-V3 dengan R anterior relatif tinggi pada gejala iskemik dapat menjadi petunjuk reciprocal; rekam posterior bila indikasi klinis ada."],
        ["Ventrikel kanan", "V3R-V4R", "Dinilai terutama saat inferior ACS dan kecurigaan klinis keterlibatan RV; dokumentasikan lokasi lead tambahan."],
      ] },
      { kind: "algorithm", title: "Alur membaca kecurigaan iskemia akut", steps: [
        { label: "Mulai dari pasien dan waktu", text: "Catat onset dan karakter gejala, tanda vital, perfusi, riwayat koroner, serta waktu EKG. Pasien tidak stabil atau gejala berisiko tinggi perlu eskalasi segera." },
        { label: "Periksa apakah rekaman dapat dipercaya", text: "Pastikan kalibrasi, kecepatan, lokasi lead, artefak, dan bandingkan dengan tracing lama. Lead yang tertukar atau prekordial terlalu tinggi/rendah dapat mengubah kesimpulan." },
        { label: "Cari pola berdekatan dan distribusinya", text: "Tentukan lead yang menunjukkan perubahan, apakah berkelompok anatomis, apakah ada reciprocal change, dan apakah perubahan melibatkan satu wilayah atau lebih luas." },
        { label: "Cari pola yang memerlukan lead tambahan", text: "Pada dugaan RV, rekam lead kanan sesuai protokol. Pada depresi ST anterior yang mencurigakan untuk posterior, pertimbangkan V7-V9. Jangan tunggu lead tambahan bila kondisi mengharuskan tindakan segera." },
        { label: "Gunakan EKG serial dan biomarker", text: "Jika gejala berlanjut atau berubah, EKG awal nondiagnostik tidak mengakhiri evaluasi. Ulangi EKG pada interval yang ditentukan klinis dan gunakan troponin serial sesuai jalur ACS." },
        { label: "Tulis kesan dengan tingkat kepastian", text: "Pisahkan temuan objektif dari interpretasi: lead, besar dan bentuk perubahan, perubahan serial, diferensial utama, serta urgensi tindak lanjut." },
      ] },
      { kind: "heading", title: "2. Pola oklusi dan tanda risiko tinggi", text: "Nama pola membantu komunikasi dan pemicu evaluasi cepat. Pola tidak menggantikan penilaian klinis atau jalur reperfusi. Hindari menunggu evolusi gelombang Q jika temuan dan kondisi pasien sudah memerlukan tindakan." },
      { kind: "table", title: "Contoh pola yang perlu dikenali", headers: ["Pola", "Temuan yang dapat mendukung", "Respons pembacaan"], rows: [
        ["Inferior ACS / STEMI", "Perubahan ST pada II, III, aVF; dapat disertai depresi resiprokal di I/aVL", "Nilai RV bila konteks cocok. Jangan menebak RCA atau LCx hanya dari satu rasio lead."],
        ["Keterlibatan ventrikel kanan", "Konteks inferior akut dan elevasi pada lead kanan, terutama V4R", "Catat lead kanan dan korelasikan dengan tekanan darah, vena jugularis, paru, serta konteks hemodinamik."],
        ["Posterior MI", "Depresi ST V1-V3, R relatif tinggi anterior, dan/atau elevasi ST pada V7-V9", "Pertimbangkan lead posterior pada gejala iskemik. Pola resiprokal dapat luput jika hanya membaca lead standar."],
        ["Pola Wellens", "T bifasik atau inversi dalam simetris di V2-V3, sering pada fase bebas nyeri dalam konteks yang sesuai", "Pola risiko tinggi memerlukan penilaian koroner segera. Jangan lakukan uji stres pada dugaan pola ini tanpa evaluasi ahli."],
        ["Pola de Winter", "Depresi ST upsloping di prekordial dengan T tinggi simetris, kadang disertai perubahan aVR", "Anggap sebagai pola oklusi berisiko tinggi dalam konteks klinis, bukan sebagai pengganti evaluasi ACS."],
        ["Iskemia subendokardial / NSTE-ACS", "Depresi ST horizontal/downsloping atau inversi T dinamis; dapat bersifat multipel atau difus", "Nilai gejala, perubahan serial, troponin, anemia, tekanan darah, dan kemungkinan mismatch suplai-permintaan."],
      ] },
      { kind: "bullets", title: "Sgarbossa dan kompleks QRS yang mengganggu pembacaan", items: [
        "LBBB atau pacing ventrikel membuat ST-T berubah sekunder terhadap depolarisasi; jangan membaca perubahan ini seperti QRS normal.",
        "Kriteria Sgarbossa dan modifikasi Smith dapat membantu mengidentifikasi oklusi pada LBBB atau ritme pacing, tetapi sensitivitasnya tidak sempurna dan harus dipadukan dengan kondisi pasien serta pembanding lama.",
        "Perubahan baru, discordance yang sangat tidak proporsional, nyeri iskemik, ketidakstabilan, atau perubahan serial meningkatkan urgensi konsultasi.",
        "LBBB baru saja tidak otomatis membuktikan STEMI. Sebaliknya, tidak terpenuhinya kriteria tertentu tidak aman untuk menyingkirkan oklusi bila kecurigaan klinis tinggi.",
      ] },
      { kind: "heading", title: "3. Membandingkan dengan diagnosis peniru", text: "Pola peniru dapat terlihat mirip tetapi konteks dan distribusinya berbeda. Tidak ada daftar morfologi yang menggantikan penilaian klinis, EKG lama, serial EKG, dan pemeriksaan lain." },
      { kind: "table", title: "Diferensial perubahan ST-T", headers: ["Kondisi", "Petunjuk", "Hal yang harus diingat"], rows: [
        ["Perikarditis / mioperikarditis", "Perubahan ST lebih difus dan dapat disertai PR depression", "Tidak selalu mengikuti pola klasik; troponin, nyeri, pemeriksaan, dan echo dapat membantu."],
        ["Early repolarization", "J-point elevation dengan notching atau slurring pada konteks tertentu", "Jangan otomatis menyebut benign pada pasien dengan gejala akut atau perubahan dinamis."],
        ["LVH strain", "Voltase tinggi dengan ST depression/T inversion sekunder, sering lateral", "Bandingkan tracing lama dan tanda klinis. Iskemia dapat berkoeksistensi."],
        ["Gangguan konduksi", "BBB atau pacing menimbulkan perubahan ST-T diskordan sekunder", "Gunakan kriteria yang sesuai dan bandingkan dengan rekaman sebelumnya."],
        ["Gangguan elektrolit", "Perubahan T, ST, PR, dan QRS bergantung jenis serta berat gangguan", "EKG tidak mengukur kadar elektrolit; konfirmasi laboratorium bila diperlukan."],
      ] },
      { kind: "bullets", title: "Kesalahan interpretasi yang sering terjadi", items: [
        "Mengukur ST dari baseline yang salah ketika PR atau TP berubah.",
        "Menganggap semua ST elevation sebagai infark atau semua depresi ST sebagai iskemia koroner primer.",
        "Melewatkan perubahan kecil karena tidak membandingkan rekaman serial atau EKG lama.",
        "Mengabaikan posterior atau ventrikel kanan karena hanya membaca 12 lead standar.",
        "Menyebut STEMI/NSTEMI hanya dari EKG. Diagnosis infark memerlukan bukti cedera miokard akut dalam konteks iskemia; EKG sendiri tidak mengukur troponin.",
        "Menunda aktivasi jalur akut demi mencari label arteri culprit yang sempurna.",
      ] },
      { kind: "cases", title: "Kasus latihan", cases: [
        { title: "Kasus A: nyeri dada, ST berubah di II, III, aVF", text: "Sebutkan distribusi inferior, cari reciprocal change di I/aVL, periksa tekanan darah dan tanda RV, lalu pertimbangkan lead kanan. Jangan menyimpulkan arteri culprit dari satu ciri EKG saja." },
        { title: "Kasus B: nyeri dada, depresi ST V1-V3 dan R tinggi", text: "Pola dapat merupakan cerminan perubahan posterior. Rekam V7-V9 bila sesuai, bandingkan EKG serial, dan aktifkan jalur evaluasi ACS sesuai kondisi." },
        { title: "Kasus C: perubahan T anterior saat nyeri telah mereda", text: "T bifasik atau inversi dalam simetris di V2-V3 pada konteks yang sesuai menimbulkan kecurigaan pola Wellens. Jangan menyamakan dengan varian normal tanpa menilai gejala dan biomarker." },
        { title: "Kasus D: ST elevation luas dan PR depression", text: "Perikarditis termasuk diferensial, tetapi evaluasi tetap mencakup ACS, miokarditis, dan penyebab lain. Distribusi difus tidak dengan sendirinya menyingkirkan oklusi." },
        { title: "Kasus E: gejala menetap, EKG awal nondiagnostik", text: "Satu EKG normal atau nondiagnostik tidak mengeksklusi ACS. Ulangi EKG saat gejala berubah dan lanjutkan pemeriksaan biomarker serta penilaian klinis." },
      ] },
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
    detailBlocks: [
      { kind: "heading", title: "1. Aksis QRS pada bidang frontal", text: "Aksis adalah arah rata-rata depolarisasi ventrikel pada bidang frontal. Gunakan lebih dari satu lead dan baca keseluruhan kompleks QRS. Metode kuadran I-aVF memberi orientasi cepat, lalu lead II dapat membantu membedakan aksis sedikit kiri dari deviasi aksis kiri yang lebih nyata pada dewasa." },
      { kind: "algorithm", title: "Metode cepat aksis I dan aVF", steps: [
        { label: "Lihat kompleks QRS di lead I", text: "QRS dominan positif menunjukkan vektor rata-rata mengarah ke kiri; dominan negatif mengarah menjauhi kiri." },
        { label: "Lihat kompleks QRS di aVF", text: "QRS dominan positif menunjukkan komponen inferior; dominan negatif menunjukkan vektor yang lebih superior." },
        { label: "Gabungkan kuadran", text: "I positif dan aVF positif umumnya aksis normal; I positif dan aVF negatif mengarah ke aksis kiri; I negatif dan aVF positif mengarah ke aksis kanan; keduanya negatif mengarah ke aksis ekstrem." },
        { label: "Konfirmasi batas kiri dengan lead II", text: "Bila I positif dan aVF negatif, QRS positif di II dapat menunjukkan aksis antara sekitar 0° sampai −30° yang sering masih termasuk batas normal dewasa. QRS negatif di II lebih mendukung deviasi aksis kiri yang nyata." },
        { label: "Cocokkan usia dan keadaan", text: "Aksis kanan lebih lazim secara fisiologis pada neonatus dan berubah seiring pertumbuhan. Jangan menggunakan batas dewasa secara buta pada anak." },
      ] },
      { kind: "table", title: "Kuadran aksis dan diferensial", headers: ["Lead I", "aVF", "Arah", "Contoh penyebab yang perlu dipikirkan"], rows: [
        ["Positif", "Positif", "Kisaran normal dewasa yang lazim", "Kisaran normal bergantung usia; jangan menyimpulkan tidak ada penyakit struktural."],
        ["Positif", "Negatif", "Arah kiri", "Periksa lead II; LAFB, LVH, infark inferior lama, pacing, atau variasi normal dapat menjadi pertimbangan."],
        ["Negatif", "Positif", "Arah kanan", "Pertimbangkan RVH, penyakit paru/tekanan pulmonal, L posterior fascicular block, infark lateral, pre-eksitasi, atau perubahan usia."],
        ["Negatif", "Negatif", "Aksis ekstrem", "Periksa lead terbalik, ritme ventrikel, pacing, atau penyakit konduksi berat sebelum interpretasi etiologis."],
      ] },
      { kind: "bullets", title: "Validasi sebelum memberi label aksis", items: [
        "Pastikan lead ekstremitas tidak tertukar. Pembalikan RA-LA atau pemasangan limb lead yang salah dapat membuat aksis terlihat tidak wajar.",
        "Pada QRS bifasik, tentukan defleksi bersih, bukan hanya amplitudo R atau S terbesar.",
        "Aksis QRS tidak sama dengan aksis P atau T. Jika klinis memerlukan, nilai sumbu masing-masing gelombang secara terpisah.",
        "Aksis berubah dapat berasal dari perubahan posisi, napas, ritme, konduksi, atau pacing; bandingkan dengan tracing lama.",
      ] },
      { kind: "heading", title: "2. Lebar QRS dan blok cabang", text: "QRS menggambarkan depolarisasi ventrikel. Pada dewasa, durasi 120 ms atau lebih umumnya disebut melebar, tetapi standar dan interpretasi pediatrik berbeda. Durasi saja tidak menentukan penyebab; morfologi pada beberapa lead harus dinilai bersama." },
      { kind: "table", title: "Pola konduksi intraventrikel yang umum", headers: ["Pola", "Temuan morfologi yang mendukung", "Kehati-hatian"], rows: [
        ["RBBB komplet", "Pada dewasa QRS ≥120 ms; rsR', rsR, atau rSR' di V1/V2 dan S terminal lebar di I/V6 mendukung", "Harus dinilai pada beberapa lead. Lead prekordial yang terlalu tinggi dapat menghasilkan rSr' semu."],
        ["LBBB komplet", "Pada dewasa QRS ≥120 ms; R lebar/notched atau slurred di I, aVL, V5-V6; q biasanya tidak ada di I/V5/V6; V1 dominan negatif", "ST-T biasanya berlawanan arah terhadap QRS. Cari perubahan yang sesuai kriteria iskemia pada LBBB dan bandingkan EKG lama."],
        ["LAFB", "Aksis frontal −45° sampai −90°, qR di aVL dan rS di II, III, aVF; QRS biasanya <120 ms", "Perlu singkirkan penyebab lain deviasi aksis kiri. Konfirmasi seluruh pola, bukan hanya satu kuadran."],
        ["LPFB", "Aksis frontal +90° sampai +180°, rS di I/aVL dan qR di III/aVF; QRS biasanya <120 ms", "Jarang dan merupakan diagnosis eksklusi setelah menyingkirkan RVH, penyakit paru, infark lateral, dan variasi usia."],
        ["Nonspecific IVCD", "QRS melebar tanpa memenuhi morfologi RBBB atau LBBB yang jelas", "Gunakan istilah deskriptif dan cari penyebab; jangan memaksakan klasifikasi cabang."],
        ["Pre-eksitasi", "PR pendek, delta wave, dan QRS melebar pada irama sinus dapat menunjukkan aktivasi ventrikel awal", "Derajat pre-eksitasi dapat berubah. QRS lebar pada takikardia juga memiliki diferensial luas."],
      ] },
      { kind: "algorithm", title: "Alur pemeriksaan QRS lebar", steps: [
        { label: "Konfirmasi durasi dan kalibrasi", text: "Pastikan kecepatan kertas dan besar kotak. Pada 25 mm/detik, satu kotak kecil horizontal setara 40 ms. Rekaman dengan kalibrasi berbeda harus dihitung sesuai tanda pada kertas." },
        { label: "Tentukan apakah pola memenuhi BBB", text: "Nilai V1 dan V6, bentuk kompleks, durasi, dan lead lateral. Jangan mendiagnosis BBB hanya dari satu sadapan." },
        { label: "Cari pola fasikular", text: "Bila aksis sangat kiri atau kanan, periksa morfologi qR/rS yang relevan dan singkirkan penyebab alternatif. Kombinasi blok cabang dan fasikular dapat meningkatkan risiko penyakit konduksi." },
        { label: "Cari pre-eksitasi, pacing, dan konteks ventrikel", text: "Cari delta wave, spike pacemaker, scar, atau morfologi QRS yang tidak lazim. Pada takikardia, perlakukan wide-complex sebagai masalah berpotensi serius sambil menilai stabilitas." },
        { label: "Bandingkan perubahan ST-T dan tracing lama", text: "BBB, hipertrofi, dan pacing sering menyebabkan repolarisasi sekunder. Perubahan baru atau tidak proporsional dapat menandakan masalah tambahan dan perlu evaluasi klinis." },
      ] },
      { kind: "heading", title: "3. Hipertrofi atrium dan ventrikel", text: "Kriteria EKG adalah petunjuk listrik, bukan pengukuran langsung ketebalan atau volume ruang jantung. EKG dapat memiliki sensitivitas terbatas untuk hipertrofi; ekokardiografi atau imaging diperlukan bila pertanyaan klinisnya adalah anatomi dan fungsi." },
      { kind: "table", title: "Temuan yang dapat mendukung pembesaran ruang", headers: ["Ruang", "Petunjuk EKG", "Catatan interpretasi"], rows: [
        ["Atrium kiri", "P melebar atau berlekuk di II; komponen terminal negatif P V1 lebih menonjol dapat mendukung", "Istilah abnormalitas atrium kiri lebih tepat karena EKG tidak mengukur ukuran anatomi langsung."],
        ["Atrium kanan", "P tinggi dan runcing di inferior atau V1 pada konteks yang sesuai", "Bentuk P dapat dipengaruhi usia, posisi jantung, penyakit paru, dan teknik perekaman."],
        ["Ventrikel kiri", "Voltase prekordial/lateral tinggi, R aVL tinggi, atau pola strain lateral dapat ditemukan", "Kriteria voltase memiliki sensitivitas terbatas; tubuh, usia, jenis kelamin, atletis, dan konduksi berpengaruh."],
        ["Ventrikel kanan", "Aksis kanan, R dominan di V1, S dalam di lead lateral, atau strain kanan dapat mendukung", "Nilai usia, penyakit paru, pre-eksitasi, dan posisi lead. Tidak ada satu tanda yang memastikan RVH."],
      ] },
      { kind: "bullets", title: "Voltase LVH yang sering dipakai untuk belajar", items: [
        "Sokolow-Lyon: S di V1 ditambah R di V5 atau V6 sekurangnya sekitar 35 mm pada kalibrasi standar merupakan salah satu kriteria voltase dewasa.",
        "Cornell voltage: R aVL ditambah S V3 memakai cutoff yang berbeda menurut jenis kelamin; jangan menerapkan angka tanpa memastikan kalibrasi dan populasi rujukan.",
        "Strain lateral berarti depresi ST dan inversi T sekunder di I, aVL, V5-V6; ini dapat meningkatkan kecurigaan beban ventrikel tetapi juga memiliki diferensial.",
        "Voltase tinggi terisolasi, terutama pada atlet muda, tidak sama dengan diagnosis kardiomiopati. Nilai gejala, riwayat keluarga, repolarisasi, dan kriteria atlet.",
        "Jika ada sinkop saat olahraga, nyeri dada exertional, riwayat keluarga kematian mendadak, atau pola repolarisasi abnormal, evaluasi struktural dan spesialis diperlukan.",
      ] },
      { kind: "heading", title: "4. Perubahan ST-T sekunder dan pola khusus", text: "Depolarisasi yang terlambat mengubah repolarisasi. Karena itu, QRS yang abnormal dapat disertai ST-T diskordan tanpa iskemia akut. Pembacaan perlu membandingkan arah dan proporsi ST terhadap QRS serta menggabungkannya dengan gejala dan perubahan serial." },
      { kind: "cases", title: "Kasus latihan", cases: [
        { title: "Kasus A: I positif, aVF negatif, II positif", text: "Aksis mengarah kiri tetapi mungkin masih dalam rentang sekitar 0 sampai −30 derajat. Tinjau lead II dan morfologi lainnya sebelum menyebut deviasi aksis kiri patologis." },
        { title: "Kasus B: I positif, aVF negatif, II negatif", text: "Deviasi aksis kiri lebih mungkin. Cari pola qR di I/aVL dan rS inferior yang mendukung LAFB serta singkirkan LVH, infark inferior lama, dan penyebab lain." },
        { title: "Kasus C: QRS lebar dengan rSR' di V1 dan S lebar di I/V6", text: "Temuan mendukung RBBB bila durasi dan morfologi memenuhi kriteria. Periksa apakah ada LAFB, perubahan ST-T, dan keluhan sinkop atau penyakit struktural." },
        { title: "Kasus D: tegangan tinggi pada atlet tanpa gejala", text: "Voltase saja tidak membuktikan LVH patologis. Tinjau kriteria atlet, repolarisasi, riwayat keluarga, tekanan darah, dan indikasi imaging." },
        { title: "Kasus E: PR pendek, awal QRS terslurring", text: "Delta wave dengan QRS lebar pada irama sinus mendukung pola pre-eksitasi. Dokumentasikan dan hubungkan dengan gejala, riwayat palpitasi/sinkop, serta kemungkinan takikardia pre-eksitasi." },
      ] },
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
    detailBlocks: [
      { kind: "heading", title: "1. Prinsip keselamatan pada aritmia ventrikel", text: "Pada takikardia kompleks lebar, tentukan dulu ada tidaknya nadi dan apakah pasien stabil. Monitor dapat menunjukkan ritme yang sama dengan kondisi klinis berbeda. Pemeriksaan EKG yang rinci dilakukan sambil menyiapkan pertolongan sesuai algoritme ALS, bukan sebagai alasan menunda intervensi." },
      { kind: "algorithm", title: "Kerangka awal takikardia kompleks lebar", steps: [
        { label: "Pastikan pasien dan nadi", text: "Periksa respons, nadi, tekanan darah, perfusi, kesadaran, nyeri iskemik, dan gagal jantung. Bila tanpa nadi, ikuti algoritme henti jantung untuk ritme yang teridentifikasi." },
        { label: "Tentukan stabilitas", text: "Hipotensi, syok, perubahan kesadaran, nyeri dada iskemik, atau edema paru menandakan keadaan gawat. Ikuti algoritme takikardia ALS setempat dan panggil bantuan." },
        { label: "Klasifikasikan regularitas", text: "Ritme reguler monomorfik, reguler polimorfik, dan ireguler kompleks lebar memiliki diferensial berbeda. AF pre-eksitasi biasanya sangat ireguler dan berisiko." },
        { label: "Anggap VT sampai dinilai lebih jauh", text: "Pada dewasa dengan penyakit struktural atau riwayat infark, takikardia reguler kompleks lebar perlu diperlakukan sebagai VT sampai penyebab lain cukup kuat. Jangan mencoba obat untuk SVT secara empiris pada ritme ireguler lebar atau polimorfik." },
        { label: "Cari penyebab yang dapat dibalik", text: "Tinjau iskemia, hipoksia, asidosis, suhu, kalium, magnesium, obat yang memperpanjang QT atau memperlebar QRS, toksidrom, serta perubahan setelah intervensi." },
      ] },
      { kind: "table", title: "Ritme kompleks lebar yang perlu dibedakan", headers: ["Ritme", "Pola umum", "Petunjuk dan batas"], rows: [
        ["VT monomorfik", "Takikardia reguler dengan QRS lebar dan bentuk relatif seragam", "AV dissociation, capture beat, fusion beat, concordance, atau aksis ekstrem mendukung VT. Ketiadaan tanda ini tidak menyingkirkan VT."],
        ["VT polimorfik", "Kompleks lebar berubah bentuk atau aksis dari beat ke beat", "Nilai QT pada EKG sebelum episode. Penyebab dapat mencakup iskemia akut atau kanalopati; torsades adalah subtype dalam konteks QT memanjang."],
        ["Torsades de pointes", "Polymorphic VT yang berputar terhadap baseline pada substrat QT memanjang", "Cari QT/QTc sebelum episode, jeda atau sequence panjang-pendek, obat, bradikardia, dan elektrolit. Istilah torsades tidak tepat untuk semua polymorphic VT."],
        ["SVT dengan aberansi", "Takikardia supraventrikular dengan konduksi cabang yang melebar", "Morfologi BBB yang dikenal dapat mendukung, tetapi tidak cukup aman untuk menyingkirkan VT pada pasien berisiko."],
        ["AF dengan pre-eksitasi", "Irama ireguler sangat cepat dengan variasi lebar dan bentuk QRS", "Pola berisiko tinggi. Hindari asumsi AF biasa; penanganan perlu ahli dan protokol khusus."],
        ["AIVR", "Ritme ventrikel relatif lambat, sering bersifat sementara", "Dapat terjadi setelah reperfusi; bedakan dengan VT menggunakan laju, stabilitas, disosiasi AV, dan konteks klinis."],
      ] },
      { kind: "bullets", title: "Tanda EKG yang mendukung VT", items: [
        "Disosiasi AV: P dan QRS berjalan mandiri, kadang terlihat capture beat atau fusion beat.",
        "Concordance prekordial, aksis ekstrem, atau morfologi yang tidak cocok dengan pola BBB tipikal menambah kecurigaan.",
        "Riwayat infark, kardiomiopati, disfungsi ventrikel, atau VT sebelumnya meningkatkan probabilitas pra-uji VT.",
        "Jangan mengandalkan satu algoritme morfologi bila pasien tidak stabil atau tracing tidak lengkap; keselamatan dan algoritme klinis menjadi prioritas.",
        "Artefak dapat meniru VT. Periksa pulse oximetry, nadi, lead lain, kabel, dan apakah kompleks normal tetap tampak di sebagian lead.",
      ] },
      { kind: "heading", title: "2. QT, QTc, dan repolarisasi", text: "QT memanjang dari awal QRS sampai akhir gelombang T dan berubah bersama frekuensi jantung. QTc adalah perkiraan yang dikoreksi terhadap RR, bukan angka yang bebas dari kesalahan. Pada QRS lebar, sebagian waktu QT bertambah akibat depolarisasi yang lama, sehingga repolarisasi dapat dinilai dengan pendekatan JT oleh klinisi." },
      { kind: "algorithm", title: "Cara menilai QT dengan konsisten", steps: [
        { label: "Pilih lead yang jelas", text: "Gunakan lead dengan akhir T yang dapat diidentifikasi dengan baik; AHA menyarankan lead dengan gelombang T terpanjang untuk pemantauan QT. Gunakan lead yang sama untuk perbandingan serial bila memungkinkan." },
        { label: "Tentukan akhir gelombang T", text: "Ukur sampai T kembali ke baseline. Pada T bifasik atau berlekuk, pertimbangkan seluruh komponen T. U wave terpisah tidak dimasukkan sebagai bagian QT." },
        { label: "Hitung QTc dengan metode tercatat", text: "Catat metode koreksi yang digunakan. Bazett mudah ditemukan di mesin tetapi cenderung melebihkan koreksi pada takikardia dan dapat meremehkan pada bradikardia; bandingkan dengan metode dan konteks yang sesuai." },
        { label: "Pertimbangkan durasi QRS", text: "Pada BBB atau pacing, QT memanjang sebagian karena depolarisasi ventrikel yang lambat. Jangan menyebut acquired long-QT hanya dari QT mentah; pertimbangkan JT atau koreksi yang memperhitungkan QRS oleh tenaga klinis." },
        { label: "Cari faktor risiko dan perubahan serial", text: "Periksa obat, dosis dan interaksi, kalium, magnesium, kalsium, frekuensi, fungsi ginjal, riwayat sinkop, dan keluarga dengan kematian mendadak. QTc sekitar atau di atas 500 ms merupakan sinyal risiko penting, bukan keputusan mandiri." },
      ] },
      { kind: "table", title: "Perubahan EKG yang terkait elektrolit", headers: ["Gangguan", "Pola yang dapat terlihat", "Batas interpretasi"], rows: [
        ["Hiperkalemia", "T tinggi runcing, PR memanjang, P mengecil atau menghilang, QRS melebar, hingga pola sine-wave pada kasus berat", "Urutan tidak selalu textbook dan EKG dapat tampak relatif normal meski kalium tinggi. Konfirmasi laboratorium dan klinis."],
        ["Hipokalemia", "T mendatar/inversi, depresi ST, gelombang U menonjol, pemanjangan QU yang dapat tampak seperti QT panjang", "U wave dapat menyatu dengan T. Risiko aritmia meningkat bila disertai QT panjang atau obat terkait."],
        ["Hipokalsemia", "QT memanjang terutama melalui segmen ST yang lebih panjang", "Cari hasil kalsium terionisasi bila tepat dan konteks albumin/asam-basa."],
        ["Hiperkalsemia", "QT dapat memendek karena pemendekan segmen ST", "EKG tidak menggantikan pengukuran kalsium."],
        ["Hipomagnesemia", "Tidak ada satu pola EKG yang sensitif; dapat berkontribusi pada QT memanjang dan torsades", "Nilai magnesium, kalium, obat, dan faktor klinis bersama-sama."],
      ] },
      { kind: "heading", title: "3. Obat dan toksidrom dengan dampak pada EKG", text: "Perubahan EKG dapat menjadi petunjuk paparan obat, tetapi bukan konfirmasi toksisitas. Tinjau resep, obat bebas, zat rekreasional, perubahan dosis, fungsi ginjal/hati, interaksi, waktu konsumsi, dan gejala. Kasus dugaan overdosis memerlukan jalur toksikologi dan stabilisasi segera." },
      { kind: "table", title: "Pola obat/metabolik yang berguna dikenali", headers: ["Kelompok / kondisi", "Temuan yang mungkin", "Cara menghindari overdiagnosis"], rows: [
        ["Obat pemanjang QT", "QTc meningkat; torsades dapat muncul pada faktor pemicu tambahan", "Daftar obat berubah dan efek bergantung dosis, interaksi, fungsi ginjal, serta elektrolit. Periksa sumber obat terkini."],
        ["Blokade kanal natrium / toksisitas TCA", "QRS melebar, perubahan terminal QRS, aritmia; dapat disertai gangguan kesadaran dan hipotensi", "Pelebaran QRS tidak spesifik. Hubungkan dengan riwayat paparan dan konsultasi toksikologi."],
        ["Digoksin", "Scooped ST dapat menjadi efek terapi; toksisitas dapat menimbulkan berbagai ektopi, takikardia atrium dengan blok, atau blok", "Scooped ST sendiri bukan bukti keracunan. Perlu dosis, waktu kadar, fungsi ginjal, kalium, gejala, dan pemeriksaan klinis."],
        ["Obat pemblok nodus AV", "Bradikardia, PR memanjang, blok AV, atau escape dapat muncul", "Tinjau beta-blocker, verapamil/diltiazem, digoksin, antiaritmia, kombinasi, dan kemungkinan overdosis."],
        ["Kanalopati / Brugada pattern", "Pola coved di V1-V2 dapat mendukung pola Brugada tipe 1; demam dan obat tertentu dapat mengubah pola", "Bedakan pola EKG dari sindrom klinis. Posisi lead dan phenocopy dapat meniru; perlu evaluasi ahli."],
      ] },
      { kind: "bullets", title: "Jebakan QT dan obat", items: [
        "QT otomatis mesin perlu diperiksa ulang ketika T sulit dipisahkan dari U, T berlekuk, baseline bergerak, atau QRS melebar.",
        "QT berubah menurut rate. Bandingkan dengan denyut yang stabil dan metode yang konsisten.",
        "Polymorphic VT bukan otomatis torsades. Nama torsades memerlukan konteks QT memanjang.",
        "Efek digoksin berbeda dari keracunan digoksin. Scooped ST dapat ditemukan pada penggunaan terapetik.",
        "Perubahan elektrolit dapat memengaruhi beberapa segmen sekaligus dan tidak selalu mengikuti urutan yang dihafal.",
        "Periksa sumber obat dan protokol toksikologi setempat sebelum membuat keputusan terapi; modul ini tidak memberikan dosis penanganan aritmia atau overdosis.",
      ] },
      { kind: "cases", title: "Kasus latihan", cases: [
        { title: "Kasus A: takikardia reguler, QRS lebar, pasien tampak tidak stabil", text: "Panggil bantuan, tentukan nadi dan stabilitas, siapkan tindakan sesuai algoritme ALS. Setelah keselamatan ditangani, cari tanda VT dan penyebab reversibel." },
        { title: "Kasus B: QRS lebar ireguler dengan variasi bentuk", text: "Pertimbangkan AF pre-eksitasi, AF dengan aberansi, dan VT polimorfik. Periksa EKG sinus lama untuk delta wave, nilai QT sebelumnya, dan jangan memakai pendekatan SVT reguler." },
        { title: "Kasus C: episode polymorphic VT setelah jeda panjang", text: "Cari QT panjang sebelum episode, obat pemanjang QT, bradikardia, hipokalemia, dan hipomagnesemia. Bila QT sebelumnya normal, evaluasi penyebab lain seperti iskemia." },
        { title: "Kasus D: T tinggi runcing dan QRS mulai melebar", text: "Hiperkalemia perlu dipertimbangkan, tetapi periksa hasil kalium segera, fungsi ginjal, obat, dan kondisi klinis. Jangan menunggu pola sine-wave untuk mengenali bahaya." },
        { title: "Kasus E: depresi ST berbentuk scoop pada pengguna digoksin", text: "Temuan dapat mencerminkan efek digoksin. Untuk menilai toksisitas, gunakan gejala, ritme, paparan, waktu pengambilan kadar, fungsi ginjal, dan elektrolit." },
        { title: "Kasus F: QTc mesin panjang pada pasien dengan QRS 160 ms", text: "Konfirmasi QT dan akhir T secara manual, tinjau metode koreksi, dan pertimbangkan bahwa QRS lebar memperpanjang QT mentah. Penilaian repolarisasi dapat memerlukan JT oleh klinisi." },
      ] },
    ],
    sources: [
      { org: "AHA", title: "2025 Adult Advanced Life Support Guidelines", year: 2025, url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support" },
      { org: "ESC", title: "2022 Guidelines for Ventricular Arrhythmias and Prevention of Sudden Cardiac Death", year: 2022, url: "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/ventricular-arrhythmias-and-the-prevention-of-sudden-cardiac-death/" },
      { org: "AHA/ACC/HRS", title: "Recommendations for ECG Standardization, Part IV: ST-T, U Waves, and QT", year: 2009, url: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.108.191096" },
    ],
  },
] as const;
