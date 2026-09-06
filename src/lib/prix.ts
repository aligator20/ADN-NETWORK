import type { Lang } from "@/lib/lang";

/**
 * « 75 000 FCFA » en français, « 75,000 FCFA » en anglais.
 *
 * `toLocaleString("fr")` sépare les milliers par une espace fine insécable
 * (U+202F), qui est la règle typographique française. Elle tient en corps de
 * texte — et elle DISPARAÎT dans la fonte d'affichage, en graisse 900 avec un
 * crénage négatif : « 175 000 » s'y lit « 175000 ». Sur le nombre le plus
 * regardé de la page, la lisibilité passe avant la règle : on repasse à
 * l'espace insécable ordinaire (U+00A0), qui résiste au resserrement.
 *
 * Cette fonction vit ici plutôt que dans la vue parce que deux vues l'utilisent
 * — la page Vitrine et son annonce sur l'accueil. Recopiée, elle aurait fini
 * par diverger, et le piège de l'espace fine se serait retendu tout seul.
 */
export function formatPrix(n: number, lang: Lang, devise: string) {
  return `${n.toLocaleString(lang).replace(/ /g, " ")} ${devise}`;
}
