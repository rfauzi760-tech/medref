export interface Specialty {
  slug: string;
  name: string;
  description: string;
}

export const SPECIALTIES: Specialty[] = [
  { slug: "emergency-medicine", name: "Kedokteran Emergensi", description: "Resusitasi, stratifikasi risiko, dan kondisi akut." },
  { slug: "internal-medicine", name: "Penyakit Dalam", description: "Perawatan pasien dewasa lintas sistem organ." },
  { slug: "pediatrics", name: "Pediatri", description: "Kesehatan, pertumbuhan, perkembangan, dan dosis anak." },
  { slug: "neonatology", name: "Neonatologi", description: "Penilaian bayi baru lahir dan kegawatdaruratan neonatal." },
  { slug: "obstetrics-gynecology", name: "Obstetri dan Ginekologi", description: "Kehamilan, risiko obstetri, dan kesehatan perempuan." },
  { slug: "infectious-disease", name: "Penyakit Infeksi", description: "Infeksi, sepsis, dan terapi antimikroba." },
  { slug: "cardiology", name: "Kardiologi", description: "Sindrom koroner, aritmia, dan gagal jantung." },
  { slug: "pulmonology", name: "Pulmonologi", description: "Jalan napas, pneumonia, emboli paru, dan gagal napas." },
  { slug: "gastroenterology", name: "Gastroenterologi", description: "Perdarahan saluran cerna, hati, dan penyakit pencernaan." },
  { slug: "hepatology", name: "Hepatologi", description: "Derajat penyakit hati dan prioritas transplantasi." },
  { slug: "nephrology", name: "Nefrologi", description: "Fungsi ginjal, AKI, dan PGK." },
  { slug: "hypertension", name: "Hipertensi", description: "Tatalaksana tekanan darah dan terapi gaya hidup." },
  { slug: "endocrinology", name: "Endokrinologi", description: "Diabetes, ketoasidosis, dan gangguan metabolik." },
  { slug: "neurology", name: "Neurologi", description: "Stroke, kejang, dan kegawatdaruratan neurologis." },
  { slug: "hematology", name: "Hematologi", description: "Anemia, koagulasi, dan transfusi." },
  { slug: "oncology", name: "Onkologi", description: "Terapi kanker dan perawatan suportif." },
  { slug: "surgery", name: "Bedah", description: "Keputusan bedah dan perawatan perioperatif." },
  { slug: "orthopedics", name: "Ortopedi", description: "Fraktur dan perawatan muskuloskeletal." },
  { slug: "urology", name: "Urologi", description: "Saluran kemih dan sistem reproduksi laki-laki." },
  { slug: "ent", name: "THT", description: "Telinga, hidung, tenggorok, infeksi, dan jalan napas." },
  { slug: "ophthalmology", name: "Oftalmologi", description: "Kegawatdaruratan mata dan penglihatan." },
  { slug: "dermatology", name: "Dermatologi", description: "Penyakit kulit dan kegawatdaruratan dermatologis." },
  { slug: "psychiatry", name: "Psikiatri", description: "Kegawatdaruratan kesehatan jiwa dan psikofarmaka." },
  { slug: "anesthesiology", name: "Anestesiologi", description: "Jalan napas, sedasi, dan dosis perioperatif." },
  { slug: "intensive-care", name: "Perawatan Intensif", description: "Dukungan organ, hemodinamik, dan penyakit kritis." },
  { slug: "geriatrics", name: "Geriatri", description: "Perawatan pasien lanjut usia." },
  { slug: "palliative-care", name: "Paliatif", description: "Kontrol gejala dan perawatan akhir hayat." },
  { slug: "nutrition", name: "Gizi", description: "Gizi klinis, diet, dan perencanaan makan." },
  { slug: "nursing", name: "Keperawatan", description: "Prosedur klinis dan perawatan infus." },
  { slug: "toxicology", name: "Toksikologi", description: "Penanganan keracunan dan overdosis." },
];

export function specialtyName(slug: string): string {
  return SPECIALTIES.find((s) => s.slug === slug)?.name ?? slug;
}
