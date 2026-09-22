export interface EcgModuleSource {
  org: string;
  title: string;
  year: number;
  url: string;
}

export interface EcgModuleMeeting {
  number: number;
  title: string;
  summary: string;
  objectives: string[];
  lessons: { title: string; points: string[] }[];
  practice: string[];
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
