import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import { appName, appTagline } from "@/lib/nav";

const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${appName} — ${appTagline}`,
    template: `%s · ${appName}`,
  },
  description:
    "Platform pendukung keputusan klinis gratis: skor skrining, kalkulator, dosis obat, interaksi obat, panduan klinis, ICD-10, tumbuh kembang anak dan gizi — semua alat dapat diakses tanpa bayar atau login.",
  applicationName: appName,
  openGraph: {
    title: `${appName} — ${appTagline}`,
    description: "Pendukung keputusan klinis, gratis diakses: skor, kalkulator, obat, panduan klinis, ICD-10 dan lainnya.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#070a08" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${funnelSans.variable} ${funnelDisplay.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
