import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { site } from "@/content/site";

// Requis par `output: "export"` : sans cette déclaration, Next considère la
// route comme dynamique et refuse de l'inclure dans l'export statique.
export const dynamic = "force-static";

/**
 * Sitemap dérivé des routes réelles.
 *
 * Les fiches projet viennent du même tableau que la galerie : ajouter un projet
 * l'inscrit au sitemap sans qu'on y pense. Une liste maintenue à la main finit
 * toujours par oublier une page — et une page hors sitemap est une page que
 * personne ne trouve.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/reseau`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${site.url}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...projectPages];
}
