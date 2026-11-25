"use client";

import { boutique } from "@/content/boutique";
import { projects } from "@/content/projects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * LA BANDE DES TRAVAUX — ce que le visiteur voit AVANT d'avoir lu une ligne.
 *
 * Le problème qu'elle règle : l'accueil était un titre blanc sur noir. Il
 * fallait dérouler, ou lire, pour comprendre qu'ADN NETWORK fabrique des
 * choses. Une bande de vraies captures qui défile le dit en une seconde, et
 * elle le dit avec des preuves — pas avec un adjectif.
 *
 * ELLE NE MONTRE QUE DE VRAIES RÉALISATIONS. Les couvertures viennent de
 * `projects`, donc une réalisation ajoutée demain entre toute seule et une
 * réalisation retirée en sort. Aucune liste à tenir en double, et aucune
 * photo d'illustration ici : la bande perdrait exactement ce qui fait sa
 * valeur, qui est d'être vraie.
 *
 * LE DÉFILEMENT EST EN CSS PUR, pas en JavaScript : une transformation
 * continue sur la piste, rien qui tourne à chaque image. Le ruban est écrit
 * DEUX FOIS et translaté de -50 % : à la fin du premier exemplaire, le second
 * est exactement à la place du premier, et la boucle ne se voit pas.
 *
 * ⚠️ `prefers-reduced-motion` ARRÊTE LA BANDE, il ne la cache pas. Quelqu'un
 * qui a demandé moins d'animation a droit aux mêmes informations : il voit
 * alors une rangée fixe de réalisations. C'est aussi ce que voit un navigateur
 * qui n'exécute pas le script.
 */
export function BandeauTravaux() {
  const reduced = usePrefersReducedMotion();

  /**
   * DEUX SOURCES, ET C'EST VOULU.
   *
   * Les captures de réalisations sont des captures d'écran de sites sombres :
   * mises bout à bout sur le noir de la page, elles forment une bande noire
   * où l'on ne distingue rien — essayé le 25 novembre 2026, c'était illisible.
   * Les couvertures de la boutique, elles, sont noir et jaune vif. Alternées,
   * les unes donnent le contraste qui rend les autres lisibles.
   *
   * L'alternance n'est pas qu'esthétique : elle dit en une bande les deux
   * moitiés du métier — ce qu'on fabrique pour un client, et ce qu'on vend
   * déjà en ligne. Les deux listes sont DÉDUITES de leur contenu : une
   * réalisation ou un guide ajouté entre ici tout seul.
   */
  const realisations = projects
    .filter((p) => p.cover)
    .map((p) => ({ src: p.cover as string, nom: p.title, cle: p.slug }));

  const produits = boutique.rayons
    .flatMap((r) => r.titres)
    .filter((t) => t.image)
    .map((t) => ({ src: t.image as string, nom: t.titre, cle: t.image as string }));

  // Une réalisation, un produit, une réalisation… jusqu'à épuisement.
  const vignettes: { src: string; nom: string; cle: string }[] = [];
  for (let i = 0; i < Math.max(realisations.length, produits.length); i += 1) {
    if (realisations[i]) vignettes.push(realisations[i]);
    if (produits[i]) vignettes.push(produits[i]);
  }

  if (!vignettes.length) return null;

  // Deux fois la même liste : c'est ce qui rend la boucle invisible.
  const ruban = [...vignettes, ...vignettes];

  return (
    <div
      className="hero-fade relative mt-10 overflow-hidden"
      /* Les deux bords s'effacent dans le noir de la page : sans ce masque,
         la bande se termine par une coupe nette qui la fait lire comme un
         bandeau publicitaire collé sur la page. */
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
      }}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 z-10 block h-px bg-signal/50" />
      <ul
        className="flex w-max items-stretch gap-3"
        style={
          reduced
            ? undefined
            : { animation: "bandeau-defile 64s linear infinite" }
        }
      >
        {ruban.map((v, i) => (
          <li
            key={`${v.cle}-${i}`}
            aria-hidden={i >= vignettes.length}
            className="relative h-[74px] shrink-0 overflow-hidden bg-carbon md:h-[104px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={v.src}
              alt={i < vignettes.length ? v.nom : ""}
              loading={i < 8 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-auto max-w-none object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
