import type { MetadataRoute } from "next";

import { site } from "@/content/site";

// Voir sitemap.ts : indispensable en mode export statique.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Le site de soutien AquaControl est servi depuis /public : c'est une
      // page complète avec ses propres titres, elle ferait doublon dans les
      // résultats de recherche avec la fiche projet qui y renvoie.
      disallow: ["/sites/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
