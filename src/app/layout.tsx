import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { AppShell } from "@/providers/AppShell";
import { site } from "@/content/site";

/* — Display : grotesque industrielle, variable 100→900 ————————————— */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/* — Mono : tout ce qui est « machine » (index, coordonnées, labels) ——— */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const BASELINE = site.tagline.join(". ") + ".";

const DESCRIPTION =
  "ADN NETWORK conçoit des systèmes où la technologie, la créativité et " +
  "l'entreprise cessent d'être trois métiers séparés : développement web, IA, " +
  "automatisation, réseaux, cybersécurité, création et agritech.";

export const metadata: Metadata = {
  // Indispensable aux aperçus de partage : sans base, Next émet des chemins
  // relatifs que les réseaux sociaux ne savent pas résoudre.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${BASELINE}`,
    template: `%s — ${site.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  applicationName: site.name,
  authors: [{ name: site.owner.name }],
  keywords: [
    "développement web",
    "intelligence artificielle",
    "automatisation",
    "réseaux",
    "cybersécurité",
    "branding",
    "agritech",
    "Cotonou",
    "Bénin",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} — ${BASELINE}`,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${BASELINE}`,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body className="bg-void text-bone antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
