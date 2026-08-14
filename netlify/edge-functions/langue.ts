import type { Config, Context } from "@netlify/edge-functions";

/**
 * DÉTECTION DE LANGUE AU BORD DU RÉSEAU
 *
 * Le site est un export statique : il n'a pas de serveur pour décider quoi
 * servir. Cette fonction s'exécute avant lui, sur le point de présence Netlify
 * le plus proche du visiteur.
 *
 * POURQUOI PAS EN JAVASCRIPT DANS LA PAGE
 *
 * Une redirection côté client impose de charger la page française avant de
 * partir vers l'anglaise : on paie deux chargements et on laisse voir un
 * clignotement. Surtout, le seul indice géographique disponible dans un
 * navigateur est le fuseau horaire — et le fuseau du Bénin est `Africa/Lagos`,
 * partagé avec le Nigeria anglophone. Il trancherait donc à l'envers sur le
 * marché principal du site. Ici, `context.geo` donne le pays réel, résolu par
 * Netlify, sans appel à un service tiers et sans que rien ne soit conservé.
 *
 * L'ORDRE DES SIGNAUX, DU PLUS FIABLE AU MOINS FIABLE
 *
 *   1. Le témoin `adn-lang` — un choix explicite. Il gagne toujours.
 *   2. `Accept-Language` — la langue que le visiteur a lui-même réglée.
 *   3. Le pays — utile quand le navigateur ne mentionne pas le français, ce qui
 *      est courant en Afrique de l'Ouest où les téléphones sortent d'usine en
 *      anglais alors que la langue de lecture est le français.
 *
 * La fonction ne redirige que dans UN sens : du français vers l'anglais. Le
 * français est la langue du site, servie par défaut ; on ne dévie que si l'on a
 * une raison positive de croire que le visiteur ne le lit pas. Un doute laisse
 * donc les choses en place.
 *
 * ELLE ÉCHOUE OUVERTE. Toute erreur rend la main au contenu statique : une
 * fonction de bord se place devant chaque requête, et il vaut cent fois un site
 * en français pour un anglophone qu'un site en panne pour tout le monde.
 */

/** Pays où le français est officiel ou langue d'usage administratif. */
const FRANCOPHONES = new Set([
  // Afrique de l'Ouest et centrale
  "BJ", "BF", "CI", "GN", "ML", "NE", "SN", "TG", "CM", "GA", "CG", "CD", "CF", "TD",
  // Afrique du Nord et de l'Est, océan Indien
  "DZ", "MA", "TN", "DJ", "MG", "MR", "KM", "SC",
  // Europe
  "FR", "BE", "LU", "MC", "CH",
  // Amériques et Pacifique
  "CA", "HT", "GP", "MQ", "GF", "RE", "YT", "NC", "PF", "WF", "PM", "VU",
]);

const LANG_KEY = "adn-lang";

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url);

    /* 1 — Un choix explicite ne se discute pas. */
    const choisie = context.cookies.get(LANG_KEY);
    if (choisie === "fr") return;
    if (choisie === "en") return Response.redirect(new URL("/en" + suffixe(url), url), 302);

    /* 2 — La langue réglée par le visiteur. `fr` n'importe où dans la liste
           suffit : quelqu'un qui a déclaré lire le français le lit. */
    const entete = request.headers.get("accept-language") ?? "";
    if (/(^|[,\s])fr\b/i.test(entete)) return;

    /* 3 — À défaut, le pays. */
    const pays = context.geo?.country?.code;
    if (pays && FRANCOPHONES.has(pays)) return;

    /* Aucun signal en faveur du français : on sert l'anglais. */
    return Response.redirect(new URL("/en" + suffixe(url), url), 302);
  } catch {
    // Échec ouvert : le contenu statique est servi tel quel.
    return;
  }
};

/** Le chemin à reporter derrière `/en`. La racine ne reporte rien. */
function suffixe(url: URL): string {
  const p = url.pathname.replace(/\/$/, "");
  return (p === "" ? "" : p) + url.search;
}

/**
 * On ne surveille que les pages d'atterrissage plausibles. Ne PAS mettre `/*` :
 * la fonction s'exécuterait sur chaque image et chaque fichier JavaScript, pour
 * rien, et `/en/*` se retrouverait à devoir être exclu à la main.
 */
export const config: Config = {
  path: ["/", "/work", "/work/:slug", "/reseau"],
};
