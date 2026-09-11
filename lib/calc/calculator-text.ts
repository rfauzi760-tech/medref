export function translateCalculatorText(value: string): string {
  const replacements: [RegExp, string][] = [
    [/Body weight/gi, "Berat badan"], [/Actual weight/gi, "Berat badan aktual"], [/Weight/gi, "Berat badan"],
    [/Height/gi, "Tinggi badan"], [/Age/gi, "Usia"], [/Sex/gi, "Jenis kelamin"], [/Male/gi, "Laki-laki"], [/Female/gi, "Perempuan"],
    [/Serum creatinine/gi, "Kreatinin serum"], [/Creatinine/gi, "Kreatinin"], [/Sodium/gi, "Natrium"], [/Calcium/gi, "Kalsium"],
    [/Glucose/gi, "Glukosa"], [/Albumin/gi, "Albumin"], [/Heart rate/gi, "Frekuensi nadi"], [/Systolic/gi, "Sistolik"], [/Diastolic/gi, "Diastolik"],
    [/Volume/gi, "Volume"], [/Duration/gi, "Durasi"], [/Concentration/gi, "Konsentrasi"], [/Dose/gi, "Dosis"],
    [/Yes/gi, "Ya"], [/No/gi, "Tidak"], [/Reference/gi, "Referensi"], [/Category/gi, "Kategori"],
    [/Normal weight/gi, "Berat badan normal"], [/Underweight/gi, "Berat badan kurang"], [/Overweight/gi, "Gizi lebih"], [/Obesity/gi, "Obesitas"],
    [/Enter /gi, "Masukkan "], [/required/gi, "wajib"], [/outside plausible range/gi, "di luar rentang wajar"],
  ];
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value).replace(/\s* - \s*/g, " - ");
}
