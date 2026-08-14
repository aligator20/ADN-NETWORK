"use client";

import { usePathname } from "next/navigation";

import {
  copy,
  disciplineNameIn,
  projectCategoriesIn,
  projectsByCategoryIn,
  type Copy,
  type ProjectCategory,
} from "@/content/copy";
import type { Project } from "@/content/projects";
import type { ServiceId } from "@/content/services";
import { langFromPath, pathForLang, type Lang } from "@/lib/lang";

/**
 * LA LANGUE DE LA PAGE COURANTE, DÉDUITE DE L'URL
 *
 * Pas de contexte React, pas de provider : l'URL est déjà la source de vérité,
 * et elle est disponible au prérendu comme à l'hydratation. Un contexte
 * n'ajouterait qu'un endroit où l'état peut désynchroniser de l'adresse
 * affichée — exactement le bug qu'on ne veut pas sur un site multilingue.
 *
 * `usePathname` fonctionne pendant l'export statique : les composants client
 * sont rendus une fois côté serveur, avec le chemin de la route générée. Le HTML
 * livré est donc déjà dans la bonne langue, sans attendre le JavaScript.
 *
 * Les hooks qui suivent conservent la FORME des fonctions qu'ils remplacent
 * (`disciplineName(id)`, `projectsByCategory(active)`) : les appels existants
 * n'ont pas eu à changer, seule leur provenance a bougé. Une migration qui
 * réécrit aussi les points d'appel est une migration où l'on introduit des
 * erreurs sans rapport avec le sujet.
 */
export function useLang(): Lang {
  return langFromPath(usePathname());
}

/** Le dictionnaire de la page courante. */
export function useCopy(): Copy {
  return copy(useLang());
}

/**
 * Traduit un chemin de référence FRANÇAIS vers la langue courante.
 * `href("/work")` donne `/work` en français et `/en/work` en anglais.
 */
export function useHref(): (frPath: string) => string {
  const lang = useLang();
  return (frPath) => pathForLang(frPath, lang);
}

/** Le libellé d'une discipline, dans la langue courante. */
export function useDisciplineName(): (id: ServiceId) => string {
  const lang = useLang();
  return (id) => disciplineNameIn(lang, id);
}

/** Les catégories du filtre, dans la langue courante. */
export function useProjectCategories(): readonly ProjectCategory[] {
  return projectCategoriesIn(useLang());
}

/** Les projets d'une catégorie, dans la langue courante. */
export function useProjectsByCategory(): (id: ServiceId | null) => readonly Project[] {
  const lang = useLang();
  return (id) => projectsByCategoryIn(lang, id);
}
