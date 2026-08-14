import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { LANGS, pathForLang } from "@/lib/lang";

// Requis par `output: "export"` : sans cette déclaration, Next considère la
// route comme dynamique et refuse de l'inclure dans l'export statique.
export const dynamic = "force-static";

/**
 * Sitemap dérivé des routes réelles, dans les deux langues.
 *
 * Les fiches projet viennent du même tableau que la galerie : ajouter un projet
 * l'inscrit au sitemap sans qu'on y pense. Une liste maintenue à la main finit
 * toujours par oublier une page — et une page hors sitemap est une page que
 * personne ne trouve.
 *
 * Chaque entrée porte ses `alternates` : c'est ce qui dit à Google que
 * `/reseau` et `/en/reseau` sont la même page en deux langues, et non deux
 * contenus concurrents dont il n'indexerait qu'un.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /** Chemins de référence, en français, avec leur priorité. */
  const ROUTES: readonly { path: string; priority: number; freq: "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "monthly" },
    { path: "/work", priority: 0.9, freq: "monthly" },
    { path: "/reseau", priority: 0.9, freq: "monthly" },
    ...projects.map((p) => ({
      path: `/work/${p.slug}`,
      priority: 0.7,
      freq: "monthly" as const,
    })),
    { path: "/mentions-legales", priority: 0.2, freq: "yearly" },
  ];

  const absolu = (p: string) => `${site.url}${p === "/" ? "/" : p}`;

  return ROUTES.flatMap((r) =>
    LANGS.map((lang) => ({
      url: absolu(pathForLang(r.path, lang)),
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
      alternates: {
        languages: Object.fromEntries(
          LANGS.map((l) => [l, absolu(pathForLang(r.path, l))]),
        ),
      },
    })),
  );
}
