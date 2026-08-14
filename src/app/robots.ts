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
      // `__forms.html` porte la déclaration du formulaire de candidature et
      // sert de page de confirmation : aucune raison de l'indexer.
      disallow: ["/sites/", "/__forms.html"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
