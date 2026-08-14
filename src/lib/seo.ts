import { pathForLang, type Lang } from "@/lib/lang";

/**
 * Les liens `hreflang` d'une page, dans les deux langues.
 *
 * Google n'a pas besoin qu'on lui dise quelle langue est laquelle : il a besoin
 * de savoir que deux URL sont la MÊME page en deux langues. Sans ces liens, il
 * traite `/reseau` et `/en/reseau` comme deux contenus concurrents et n'en
 * indexe qu'un.
 *
 * `x-default` désigne la version servie à qui ne correspond à aucune langue
 * déclarée. C'est le français : c'est la langue du site, pas un repli.
 *
 * @param frPath chemin de la version FRANÇAISE, toujours — c'est la référence.
 */
export function alternatesFor(lang: Lang, frPath: string) {
  return {
    canonical: pathForLang(frPath, lang),
    languages: {
      fr: pathForLang(frPath, "fr"),
      en: pathForLang(frPath, "en"),
      "x-default": pathForLang(frPath, "fr"),
    },
  };
}
