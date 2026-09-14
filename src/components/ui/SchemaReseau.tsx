"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * LE SCHÉMA DU RÉSEAU
 *
 * Le site s'appelle ADN NETWORK, vend « un réel réseau » — et n'avait jamais
 * dessiné ce réseau nulle part. Une page qui affirme une mécanique sans la
 * montrer demande au lecteur de la reconstituer de tête ; la plupart ne le
 * font pas et retiennent « catalogue ».
 *
 * CE QUE LE DESSIN DOIT FAIRE COMPRENDRE EN UN COUP D'ŒIL
 *
 * 1. On entre par où l'on peut — un guide à mille francs est une porte au
 *    même titre qu'un site complet.
 * 2. Tout converge vers l'annuaire, qui est le seul point du système dont la
 *    valeur augmente sans qu'on y retouche.
 * 3. Deux flux REPARTENT de l'annuaire vers les membres. C'est ça, la boucle :
 *    sans les flèches de retour, ce serait un entonnoir de vente, pas un
 *    réseau.
 *
 * L'animation fait circuler la matière le long des liens. Elle ne décore pas :
 * un trait fixe se lit comme une relation, un trait qui coule se lit comme un
 * échange — et c'est l'échange qui est le sujet.
 */
/** Une porte d'entrée du réseau. Sans prix, aucun montant n'est affiché. */
export type Porte = { nom: string; prix?: string };

export function SchemaReseau({ legende, portes }: { legende: string; portes: readonly Porte[] }) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      // Les liens d'entrée : la matière descend vers l'annuaire.
      gsap.to(".sr-entree", {
        strokeDashoffset: -28,
        duration: 1.4,
        ease: "none",
        repeat: -1,
        stagger: 0.18,
      });

      // Les deux boucles de retour coulent EN SENS INVERSE : c'est ce qui
      // distingue un retour d'une sortie, et le sens se lit sans légende.
      gsap.to(".sr-retour", {
        strokeDashoffset: 32,
        duration: 1.9,
        ease: "none",
        repeat: -1,
        stagger: 0.3,
      });

      gsap.to(".sr-coeur", {
        opacity: 0.42,
        duration: 1.7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <figure className="mt-14 border border-steel/40 bg-carbon">
      {/*
        LE SCHÉMA DÉFILE, IL NE RÉTRÉCIT PAS.

        Un `viewBox` de 1000 ramené à la largeur d'un téléphone donne une
        échelle de 0,31 : le texte de 11,5 px du dessin s'affiche alors à
        3,6 px — mesuré, pas supposé. Un schéma illisible n'est pas un schéma
        dégradé, c'est un bloc décoratif qui prend de la place.

        À 860 px de large minimum, le même texte tient autour de 10 px sur un
        écran de 360, et le lecteur fait glisser. C'est la convention des
        schémas techniques, et elle vaut mieux que la seule alternative
        honnête — ne rien montrer du tout sur la moitié du public.
      */}
      <div className="overflow-x-auto">
        <svg
          ref={root}
          viewBox="0 0 1000 430"
          className="block w-full min-w-[860px]"
          role="img"
          aria-label={legende}
        >
        {/* ── les portes d'entrée ─────────────────────────────────── */}
        <g fontFamily="var(--font-mono)" fontSize="12">
{/* Les trois portes viennent du contenu, jamais d'une valeur recopiée.
              Les ordonnées sont fixes parce que les liens qui partent d'elles
              le sont aussi : trois portes, trois courbes tracées à la main. */}
          {portes.slice(0, 3).map((porte, i) => {
            const y = [62, 186, 310][i];
            return (
              <g key={porte.nom}>
                <rect
                  x="34"
                  y={y}
                  width="198"
                  height="58"
                  fill="var(--color-graphite)"
                  stroke="var(--color-steel)"
                />
                <text x="50" y={y + 25} fill="var(--color-bone)" fontSize="14">
                  {porte.nom}
                </text>
                {porte.prix && (
                  <text x="50" y={y + 44} fill="var(--color-fog)" fontSize="11">
                    {porte.prix}
                  </text>
                )}
              </g>
            );
          })}
          <text
            x="34"
            y="42"
            fill="var(--color-fog)"
            fontSize="10"
            letterSpacing="3"
          >
            ON ENTRE PAR OÙ L’ON PEUT
          </text>
        </g>

        {/* ── les liens d'entrée ──────────────────────────────────── */}
        <g
          className="sr-entree"
          fill="none"
          stroke="var(--color-steel)"
          strokeWidth="1.6"
          strokeDasharray="7 7"
        >
          <path d="M232 91 C 330 91, 360 180, 452 205" />
          <path d="M232 215 L 452 215" />
          <path d="M232 339 C 330 339, 360 250, 452 225" />
        </g>

        {/* ── l'annuaire, au centre ───────────────────────────────── */}
        <g>
          <rect
            className="sr-coeur"
            x="452"
            y="160"
            width="206"
            height="110"
            fill="var(--color-signal)"
            opacity="0.1"
          />
          <rect
            x="452"
            y="160"
            width="206"
            height="110"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1.8"
          />
          <text
            x="555"
            y="200"
            textAnchor="middle"
            fill="var(--color-signal)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="3"
          >
            LE POINT COMMUN
          </text>
          <text
            x="555"
            y="232"
            textAnchor="middle"
            fill="var(--color-bone)"
            fontFamily="var(--font-display)"
            fontSize="26"
            fontWeight="700"
          >
            L’ANNUAIRE
          </text>
          <text
            x="555"
            y="254"
            textAnchor="middle"
            fill="var(--color-fog)"
            fontFamily="var(--font-mono)"
            fontSize="11"
          >
            par métier, par ville
          </text>
        </g>

        {/* ── les deux retours : c'est eux qui font la boucle ──────── */}
        <g fill="none" strokeWidth="1.6" strokeDasharray="8 8" className="sr-retour">
          <path d="M658 186 C 780 150, 760 48, 560 48 L 300 48" stroke="var(--color-food)" />
          <path d="M658 244 C 780 282, 760 386, 560 386 L 300 386" stroke="var(--color-network)" />
        </g>
        {/* têtes de flèche : le sens de circulation doit rester lisible
            quand l'animation est coupée */}
        <g fill="none" strokeWidth="1.6">
          <path d="M312 40 L 298 48 L 312 56" stroke="var(--color-food)" />
          <path d="M312 378 L 298 386 L 312 394" stroke="var(--color-network)" />
        </g>

        <g fontFamily="var(--font-mono)" fontSize="11.5">
          <text x="336" y="34" fill="var(--color-food)">
            Le Parrainage — 20 % de ce qu’il paie revient à qui l’a amené
          </text>
          <text x="336" y="410" fill="var(--color-network)">
            La Mise en relation — une demande repart vers un inscrit
          </text>
        </g>

        {/* ── ce qui sort à droite ────────────────────────────────── */}
        <g fontFamily="var(--font-mono)" fontSize="11.5">
          <text x="700" y="200" fill="var(--color-fog)">
            Plus l’annuaire est fourni,
          </text>
          <text x="700" y="220" fill="var(--color-bone)">
            plus chaque page déjà là
          </text>
          <text x="700" y="240" fill="var(--color-bone)">
            est trouvée.
          </text>
        </g>
        </svg>
      </div>
      <figcaption className="border-t border-steel/40 px-5 py-3 font-mono text-[0.75rem] text-fog">
        {legende}
      </figcaption>
    </figure>
  );
}
