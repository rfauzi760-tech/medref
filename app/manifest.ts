import type { MetadataRoute } from "next";
import { appName } from "@/lib/nav";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: "Referensi klinis untuk skor, kalkulator, dosis obat, interaksi, panduan, ICD-10, dan pediatri.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0d9488",
    icons: [
      { src: "/rfsmed-mark.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
