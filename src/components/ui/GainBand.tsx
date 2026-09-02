import { MotifApres, MotifAvant } from "@/components/ui/GainMotifs";
import type { Formule } from "@/content/vitrine";

/**
 * BANDE AVANT / APRÈS
 *
 * L'argument de vente, dessiné. Un acheteur ne compare pas des listes de
 * livrables : il compare sa situation d'aujourd'hui à celle d'après. La bande
 * met les deux côte à côte et laisse l'écart parler.
 *
 * La première version n'affichait que des barres de couleur. C'était juste sur
 * le fond et vide sur la forme : on illustrait « fragmenté » et « entier » sans
 * jamais montrer CE QU'ON ACHÈTE. Les motifs de `GainMotifs` montrent
 * maintenant le livrable lui-même — un écran, un document posé sur une table,
 * un jeu de gabarits alignés.
 *
 * Ce composant ne porte AUCUNE animation : il pose des classes que la timeline
 * de `VitrineView` anime. Toute la motion de la page vit donc au même endroit,
 * avec le repli `prefers-reduced-motion` déjà en place.
 */
export function GainBand({
  formule,
  before,
  after,
}: {
  formule: Formule;
  before: string;
  after: string;
}) {
  const { gain } = formule;

  return (
    <div className="vt-gain mt-10 grid grid-cols-1 gap-y-10 border-t border-steel/40 pt-10 md:grid-cols-12 md:gap-x-8">
      {/* — aujourd'hui ————————————————————————————————— */}
      <div className="md:col-span-5">
        <p className="label text-fog">{before}</p>
        <div className="mt-5 max-w-[380px]">
          <MotifAvant id={formule.id} />
        </div>
        <p className="mt-6 max-w-[38ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
          {gain.avant}
        </p>
      </div>

      {/* — la bascule ————————————————————————————————————
          Alignée sur la hauteur des dessins, pas sur le haut du bloc : au
          milieu, elle relie les deux volets ; en haut, elle flotterait. */}
      <div className="flex items-center justify-center md:col-span-2 md:items-start">
        <span
          aria-hidden
          className="vt-gain-fleche block font-mono text-2xl text-signal md:mt-24"
        >
          →
        </span>
      </div>

      {/* — après ————————————————————————————————————————— */}
      <div className="md:col-span-5">
        <p className="label text-signal">{after}</p>
        {/* La coupe porte sur CE conteneur, pas sur les groupes SVG :
            `clip-path: inset()` appliqué à un <g> se rapporte à la boîte
            englobante de l'objet et non à une boîte CSS — le motif restait
            masqué en permanence. Sur une div, le comportement est celui
            attendu. */}
        <div className="vt-m-wipe mt-5 max-w-[380px]">
          <MotifApres id={formule.id} />
        </div>
        <p className="mt-6 max-w-[38ch] font-mono text-[0.75rem] leading-[1.8] text-bone/85">
          {gain.apres}
        </p>
      </div>
    </div>
  );
}
