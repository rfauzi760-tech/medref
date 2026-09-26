import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import { ModuleVisitTracker } from "@/components/module-visit-tracker";
import { appName } from "@/lib/nav";

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
    default: appName,
    template: `%s · ${appName}`,
  },
  description: "Referensi klinis untuk praktik sehari-hari.",
  applicationName: appName,
  openGraph: {
    title: appName,
    description: "Referensi klinis untuk praktik sehari-hari.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/rfsmed-symbol.svg" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e2fdff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c1d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${funnelSans.variable} ${funnelDisplay.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <ModuleVisitTracker />
          <Shell>{children}</Shell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
