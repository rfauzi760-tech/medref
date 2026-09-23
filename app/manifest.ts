import type { MetadataRoute } from "next";
import { appName } from "@/lib/nav";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: "Referensi klinis untuk skor, kalkulator, dosis obat, interaksi, panduan, ICD-10, dan pediatri.",
    start_url: "/",
    display: "standalone",
    background_color: "#e2fdff",
    theme_color: "#5465ff",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
