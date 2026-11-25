/**
 * UNE PHOTOGRAPHIE EN BANDE, TENUE DANS LE NOIR DU SITE.
 *
 * Le même traitement que les scènes de `/methode`, sorti dans un composant
 * parce qu'il sert maintenant sur plusieurs pages :
 *
 * — le dégradé vers `--color-void` fond le bas de l'image dans la page, au
 *   lieu de la poser comme une vignette collée sur du noir ;
 * — le filet signal en haut est celui des plaques du portfolio : c'est ce qui
 *   fait qu'une image appartient à ce site et pas à un autre.
 *
 * ⚠️ `figure` SANS `figcaption`, ET C'EST DÉLIBÉRÉ. Une légende sous une de
 * ces photos la ferait lire comme un cas réel. Ce sont des illustrations :
 * elles ne montrent aucun client d'ADN NETWORK, aucune réalisation, aucun
 * lieu où nous serions intervenus. Voir `public/scenes/LICENCES.md`, qui
 * porte aussi l'obligation d'attribution de la licence Freepik gratuite.
 *
 * `alt` vide et `aria-hidden` : ces images n'ajoutent aucune information que
 * le texte voisin ne donne déjà. Les faire lire à voix haute allongerait la
 * page sans rien apprendre à personne.
 */
export function Photo({
  src,
  ratio = "21/9",
  className = "",
}: {
  src: string;
  /** Rapport de la bande. 21/9 pour une séparation, 16/9 pour une colonne. */
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      aria-hidden
      className={`relative block overflow-hidden bg-carbon ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, var(--color-void) 2%, transparent 62%)" }}
      />
      <span aria-hidden className="absolute inset-x-0 top-0 block h-px bg-signal/70" />
    </figure>
  );
}
