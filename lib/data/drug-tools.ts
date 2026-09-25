export const DRUG_TOOL_GROUPS = [
  {
    title: "Dosis dan pemberian obat",
    links: [
      ["Kalkulator dosis obat IGD", "/emergency-dose"],
      ["Hitung dosis berdasarkan berat badan", "/calculators/mgkg-dose"],
      ["Laju infus obat", "/calculators/infusion-rate"],
      ["Pengenceran obat", "/calculators/dilution"],
    ],
  },
  {
    title: "Cairan dan rehidrasi",
    links: [
      ["Rencana terapi diare A, B, C", "/tools-dosis/diare"],
      ["Rumatan cairan Holliday-Segar", "/calculators/holliday-segar"],
      ["Rumatan cairan anak", "/calculators/paediatric-maint"],
      ["Defisit cairan", "/calculators/fluid-deficit"],
      ["Laju pemberian cairan IV", "/calculators/iv-rate"],
      ["Kecepatan tetesan infus", "/calculators/drip-rate"],
      ["Resusitasi syok", "/tools-dosis/syok"],
      ["Resusitasi luka bakar", "/tools-dosis/luka-bakar"],
    ],
  },
] as const;
