/**
 * LA LANGUE, ET COMMENT ON LA DEVINE
 *
 * Le français vit à la racine, l'anglais sous `/en`. Ce choix n'est pas
 * esthétique : il préserve toutes les URL déjà publiées — `/reseau`, les huit
 * fiches projet, les visuels d'annonce qui portent l'adresse imprimée. Un
 * préfixe `/fr` aurait cassé l'existant pour un gain nul.
 *
 * Les segments de chemin sont IDENTIQUES dans les deux langues (`/en/reseau`,
 * pas `/en/network`). C'est un anglicisme d'URL assumé : en échange, passer
 * d'une langue à l'autre est un simple ajout ou retrait de préfixe, qui marche
 * sur n'importe quelle page, y compris `/work/[slug]`, sans table de
 * correspondance à tenir à jour — donc sans possibilité de la désynchroniser.
 */
export type Lang = "fr" | "en";

export const LANGS: readonly Lang[] = ["fr", "en"] as const;

/** Le français n'est pas « la langue par défaut » : c'est la langue du site. */
export const DEFAULT_LANG: Lang = "fr";

/** Libellés du sélecteur, dans leur propre langue — jamais traduits. */
export const LANG_LABEL: Record<Lang, string> = {
  fr: "Français",
  en: "English",
};

/** Clé de mémorisation du choix manuel. Voir `detect.ts`. */
export const LANG_KEY = "adn-lang";

/** Déduit la langue d'un chemin. `/en`, `/en/…` → anglais ; tout le reste → français. */
export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/** Le même chemin, dans l'autre langue. Sert au sélecteur et aux `hreflang`. */
export function pathForLang(pathname: string, lang: Lang): string {
  const nu = pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, "");
  const base = nu === "" ? "/" : nu;
  if (lang === "fr") return base;
  return base === "/" ? "/en" : `/en${base}`;
}
