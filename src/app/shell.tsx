import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { AppShell } from "@/providers/AppShell";
import { copy } from "@/content/copy";
import { alternatesFor } from "@/lib/seo";
import type { Lang } from "@/lib/lang";

/**
 * LE CHÂSSIS, PARTAGÉ PAR LES DEUX LANGUES
 *
 * Le site a DEUX layouts racines — `app/(fr)/layout.tsx` et
 * `app/(en)/layout.tsx` — parce que l'attribut `lang` de `<html>` ne peut être
 * posé que là, et qu'il doit être juste DANS LE HTML LIVRÉ. Le corriger côté
 * client après hydratation reviendrait à livrer des pages anglaises annoncées
 * comme françaises : un lecteur d'écran les prononcerait avec la phonétique
 * française jusqu'à l'exécution du JavaScript.
 *
 * Pour autant, rien n'est dupliqué : les deux layouts ne font qu'appeler ce
 * fichier. Les polices sont chargées ici une seule fois, sinon `next/font`
 * produirait deux jeux de variables CSS pour les mêmes fichiers.
 */

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

const DESCRIPTION: Record<Lang, string> = {
  fr:
    "ADN NETWORK conçoit des systèmes où la technologie, la créativité et " +
    "l'entreprise cessent d'être trois métiers séparés : développement web, IA, " +
    "automatisation, réseaux, cybersécurité, création et agritech.",
  en:
    "ADN NETWORK builds systems where technology, creativity and business stop " +
    "being three separate trades: web development, AI, automation, networks, " +
    "cybersecurity, creative and agritech.",
};

const KEYWORDS: Record<Lang, string[]> = {
  fr: [
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
  en: [
    "web development",
    "artificial intelligence",
    "automation",
    "networks",
    "cybersecurity",
    "branding",
    "agritech",
    "Cotonou",
    "Benin",
  ],
};

const OG_LOCALE: Record<Lang, string> = { fr: "fr_FR", en: "en_GB" };

/** Métadonnées communes d'une langue. Chaque page affine ensuite les siennes. */
export function metadataFor(lang: Lang): Metadata {
  const { site } = copy(lang);
  const baseline = site.tagline.join(". ") + ".";
  const titre = `${site.name} — ${baseline}`;

  return {
    // Indispensable aux aperçus de partage : sans base, Next émet des chemins
    // relatifs que les réseaux sociaux ne savent pas résoudre.
    metadataBase: new URL(site.url),
    title: { default: titre, template: `%s — ${site.name}` },
    description: DESCRIPTION[lang],
    alternates: alternatesFor(lang, "/"),
    applicationName: site.name,
    authors: [{ name: site.owner.name }],
    keywords: KEYWORDS[lang],
    openGraph: {
      type: "website",
      locale: OG_LOCALE[lang],
      siteName: site.name,
      title: titre,
      description: DESCRIPTION[lang],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: titre,
      description: DESCRIPTION[lang],
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export function Shell({
  lang,
  children,
}: Readonly<{ lang: Lang; children: React.ReactNode }>) {
  return (
    <html lang={lang} className={`${archivo.variable} ${jetbrains.variable}`}>
      <body className="bg-void text-bone antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
