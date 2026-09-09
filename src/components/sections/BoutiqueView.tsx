"use client";

import Link from "next/link";
import { useRef } from "react";

import { useCopy, useHref } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * PAGE /boutique — LA VITRINE DE FULLMESH SHOP
 *
 * Elle vend des produits ; la fiche `/work/full-mesh` explique le travail de
 * marque. Deux lecteurs distincts, deux pages.
 *
 * L'ACCENT EST LE JAUNE DE FULLMESH, pas le vert de la marque du site. Une
 * page qui vend les produits d'une autre marque porte les couleurs de cette
 * marque : le lecteur qui arrivera ensuite sur la boutique Chariow doit
 * reconnaître l'endroit. Le jaune est déclaré ici, en local, et ne fuit pas
 * dans le reste du site.
 *
 * AUCUN PRIX N'EST AFFICHÉ. La raison est écrite dans `content/boutique.ts` et
 * répétée au lecteur dans la section « Les prix » : cette page a déjà porté un
 * tarif de lancement qui a bougé de soixante pour cent en une semaine. La
 * boutique est la seule autorité, et deux boutons y mènent.
 */

/** Le jaune électrique de la charte FullMesh. */
const JAUNE = "#f5c518";

export function BoutiqueView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { boutique } = useCopy();
  const href = useHref();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      tl.from(".bq-reveal", { yPercent: 115, duration: DUR.slow, stagger: STAGGER.lines }).from(
        ".bq-fade",
        { autoAlpha: 0, y: 24, duration: DUR.base, stagger: 0.1 },
        "-=1.1",
      );

      gsap.from(".bq-regle", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".bq-regles", start: "top 84%" },
      });

      // Un déclencheur par rayon : quatre blocs sur un seul auraient tous
      // fini de s'animer avant qu'on atteigne le troisième.
      gsap.utils.toArray<HTMLElement>(".bq-rayon").forEach((r) => {
        gsap.from(r, {
          autoAlpha: 0,
          y: 26,
          duration: DUR.base,
          ease: EASE.expo,
          scrollTrigger: { trigger: r, start: "top 86%" },
        });
      });

      gsap.from(".bq-rev", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".bq-revendeur", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  /* Les deux boutons vers la boutique. `rel` est obligatoire sur un lien
     sortant en `_blank` : sans `noopener`, la page ouverte garde une
     référence sur celle-ci. */
  const bouton = (texte: string, plein: boolean) => (
    <a
      href={boutique.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={
        plein
          ? "inline-flex items-center gap-3 px-7 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.2em] font-bold transition-opacity duration-300 hover:opacity-85"
          : "inline-flex items-center gap-3 border border-steel px-7 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-fog"
      }
      style={plein ? { background: JAUNE, color: "#0a0a0b" } : undefined}
    >
      {texte}
      <span aria-hidden>↗</span>
    </a>
  );

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <div className="bq-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="label" style={{ color: JAUNE }}>
            {boutique.kicker}
          </p>
          <Link
            href={href("/work/full-mesh")}
            data-cursor="hover"
            className="label transition-colors duration-300 hover:text-bone"
          >
            {boutique.ficheLabel} ↗
          </Link>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="bq-reveal display block text-[clamp(2.1rem,7.4vw,6.5rem)] leading-[0.9] text-bone">
              {boutique.name}
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-[30ch] display text-[clamp(1.35rem,3vw,2.75rem)] leading-[1.14] text-bone md:mt-14">
          {boutique.lead}
        </p>

        <div className="bq-fade mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {boutique.body.map((p, i) => (
            <p key={i} className="max-w-[48ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
              {p}
            </p>
          ))}
        </div>

        <div className="bq-fade mt-12 flex flex-wrap gap-4">
          {bouton(boutique.ctaBoutique, true)}
          {bouton(boutique.ctaRevendeur, false)}
        </div>
      </section>

      {/* — la règle d'entrée ——————————————————————————— */}
      <section className="bq-regles border-t border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <p className="label">{boutique.regleLabel}</p>
          <div className="mt-12 grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-10">
            {boutique.regle.map((r, i) => (
              <div key={r.titre} className="bq-regle relative md:pl-8">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 hidden h-full w-px bg-steel md:block"
                  />
                )}
                <p className="label" style={{ color: JAUNE }}>
                  {pad(i + 1, 2)}
                </p>
                <h2 className="display mt-4 text-[clamp(1.25rem,2.4vw,1.85rem)] leading-none text-bone">
                  {r.titre}
                </h2>
                <p className="mt-5 max-w-[36ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                  {r.corps}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — le catalogue, rangé par problème ————————————— */}
      <section className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
        <p className="label">{boutique.rayonsLabel}</p>
        <p className="mt-6 max-w-[58ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
          {boutique.rayonsLead}
        </p>

        <div className="mt-12">
          {boutique.rayons.map((r, i) => (
            <div key={r.id}>
              <div className="hairline" />
              <div className="bq-rayon grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-10 md:py-14">
                <div className="md:col-span-5">
                  <p className="label" style={{ color: JAUNE }}>
                    {pad(i + 1, 2)}
                  </p>
                  <h2 className="display mt-4 max-w-[22ch] text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.02] text-bone">
                    {r.titre}
                  </h2>
                  <p className="mt-5 max-w-[34ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                    {r.promesse}
                  </p>
                </div>

                {/* Les titres sont une LISTE, pas des cartes : c'est un rayon
                    qu'on parcourt du regard, et une grille de vignettes
                    ferait croire à des produits comparables entre eux. */}
                <ul className="md:col-span-7">
                  {r.titres.map((t) => (
                    <li
                      key={t}
                      className="flex items-baseline gap-4 border-b border-steel/40 py-3 font-mono text-[0.8125rem] leading-[1.7] text-bone/85"
                    >
                      <span aria-hidden style={{ color: JAUNE }}>
                        ·
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="hairline" />
        </div>

        {/* — les prix, et pourquoi ils ne sont pas là ————— */}
        <div className="mt-16 border-l-2 py-1 pl-6" style={{ borderColor: JAUNE }}>
          <p className="label" style={{ color: JAUNE }}>
            {boutique.prixLabel}
          </p>
          <p className="mt-4 max-w-[62ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
            {boutique.prixNote}
          </p>
          <div className="mt-7">{bouton(boutique.ctaBoutique, true)}</div>
        </div>
      </section>

      {/* — revendre ————————————————————————————————— */}
      <section className="bq-revendeur border-t border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <p className="label">{boutique.revendeurLabel}</p>
          <h2 className="mt-6 max-w-[24ch] display text-[clamp(1.75rem,4.4vw,3.25rem)] leading-[1.02] text-bone">
            {boutique.revendeurTitre}
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-10">
            {boutique.revendeur.map((r, i) => (
              <div key={r.titre} className="bq-rev relative md:pl-8">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 hidden h-full w-px bg-steel md:block"
                  />
                )}
                <h3 className="display text-[clamp(1.15rem,2.2vw,1.6rem)] leading-none text-bone">
                  {r.titre}
                </h3>
                <p className="mt-5 max-w-[36ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                  {r.corps}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            {bouton(boutique.ctaRevendeur, true)}
          </div>
        </div>
      </section>
    </div>
  );
}
