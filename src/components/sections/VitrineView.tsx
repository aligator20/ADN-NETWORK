"use client";

import { useRef } from "react";

import { BriefForm } from "@/components/ui/BriefForm";
import { GainBand } from "@/components/ui/GainBand";
import { useCopy, useLang } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * PAGE /vitrine — L'OFFRE PAYANTE
 *
 * Une page commerciale sur un site qui ne vend rien ailleurs doit se tenir
 * autrement qu'une grille de tarifs. Trois décisions de mise en page :
 *
 * 1. LES PRIX SONT DANS LE TEXTE, pas dans des cartes. Le site n'encadre rien,
 *    nulle part — sortir des boîtes ici pour vendre trahirait la direction
 *    artistique au moment précis où le visiteur juge le sérieux du prestataire.
 *
 * 2. LES LIMITES SONT AUSSI VISIBLES QUE L'OFFRE. « Ce que nous ne vendons
 *    pas » n'est pas une clause de bas de page : c'est l'argument. Sur un
 *    marché où l'on vend couramment de la visibilité fictive, dire ce qu'on ne
 *    promet pas est le seul moyen de rendre crédible ce qu'on promet.
 *
 * 3. AUCUN COMPTE À REBOURS, aucune place limitée, aucune remise qui expire.
 *    Ces procédés fonctionnent une fois et abîment définitivement une marque
 *    qui compte revenir vers les mêmes gens.
 */
export function VitrineView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { vitrine, sequences } = useCopy();
  const lang = useLang();

  /**
   * « 75 000 FCFA » en français, « 75,000 FCFA » en anglais.
   *
   * `toLocaleString("fr")` sépare les milliers par une espace fine insécable
   * (U+202F), qui est la règle typographique française. Elle tient en corps de
   * texte — et elle DISPARAÎT dans la fonte d'affichage, en graisse 900 avec un
   * crénage négatif : « 175 000 » s'y lit « 175000 ». Sur le nombre le plus
   * regardé de la page, la lisibilité passe avant la règle : on repasse à
   * l'espace insécable ordinaire, qui résiste au resserrement.
   */
  const prix = (n: number) =>
    `${n.toLocaleString(lang).replace(/ /g, " ")} ${vitrine.currency}`;
  const minimum = Math.min(...vitrine.formules.map((f) => f.prix));

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      tl.from(".vt-reveal", { yPercent: 115, duration: DUR.slow, stagger: STAGGER.lines }).from(
        ".vt-fade",
        { autoAlpha: 0, y: 24, duration: DUR.base, stagger: 0.1 },
        "-=1.1",
      );

      gsap.from(".vt-formule", {
        autoAlpha: 0,
        y: 30,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".vt-formules", start: "top 82%" },
      });

      gsap.from(".vt-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.1,
        scrollTrigger: { trigger: ".vt-formules", start: "top 82%" },
      });

      // — les bandes avant/après ————————————————————————
      // Chaque bande est animée POUR ELLE-MÊME (un ScrollTrigger par bande) :
      // un seul déclencheur global les jouerait toutes à l'entrée de la
      // première, et les deux dernières seraient déjà finies quand on arrive
      // dessus.
      gsap.utils.toArray<HTMLElement>(".vt-gain").forEach((bande) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: bande, start: "top 80%" },
        });

        // Le côté « aujourd'hui » se pose pièce par pièce : chaque élément du
        // dessin arrive séparément, ce qui montre l'éparpillement au lieu de
        // le décrire.
        tl.from(bande.querySelectorAll(".vt-m-avant"), {
          autoAlpha: 0,
          y: 10,
          duration: DUR.base,
          ease: EASE.expo,
          stagger: 0.08,
        })
          .from(
            bande.querySelector(".vt-gain-fleche"),
            { autoAlpha: 0, x: -14, duration: DUR.base, ease: EASE.expo },
            "-=0.3",
          )
          // Le livrable, lui, se DÉCOUPE d'un bloc : une coupe, jamais un
          // fondu — c'est la grammaire posée par le préloader et le menu. Un
          // fondu dirait « ça apparaît », une coupe dit « ça se construit ».
          // Le livrable se DÉCOUPE d'un bloc, de gauche à droite : une coupe,
          // jamais un fondu — la grammaire posée par le préloader et le menu.
          // Un fondu dirait « ça apparaît », une coupe dit « ça se construit ».
          .from(
            bande.querySelector(".vt-m-wipe"),
            {
              clipPath: "inset(0% 100% 0% 0%)",
              duration: DUR.cinematic,
              ease: EASE.expo,
            },
            "-=0.2",
          );
      });

      gsap.from(".vt-step", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".vt-steps", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <div className="vt-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(7)}]</span>
            <span className="label">{sequences[6].label}</span>
          </p>
          <p className="label">
            {vitrine.kicker} <span className="text-bone">{prix(minimum)}</span>
          </p>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="vt-reveal display block text-[clamp(2.5rem,9vw,8rem)] leading-[0.88] text-bone">
              {vitrine.name}
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-[28ch] display text-[clamp(1.35rem,3vw,2.75rem)] leading-[1.14] text-bone md:mt-14">
          {vitrine.lead}
        </p>

        <div className="vt-fade mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {vitrine.body.map((p, i) => (
            <p key={i} className="max-w-[48ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* — les formules ————————————————————————————————
          Une par ligne, séparées par des filets. Trois colonnes côte à côte
          inviteraient à comparer les prix ; en lignes, on lit ce que chacune
          règle avant de voir combien elle coûte. */}
      <section className="vt-formules mx-auto max-w-[1800px] gutter py-24 md:py-32">
        <p className="label">{vitrine.formulesLabel}</p>

        <div className="mt-10">
          {vitrine.formules.map((f, i) => (
            <div key={f.id}>
              <div className="vt-rule hairline origin-left" />
              <div className="vt-formule grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-10 md:py-14">
                <div className="md:col-span-4">
                  <span className="label text-signal">{pad(i + 1, 2)}</span>
                  <h2 className="display mt-4 text-[clamp(1.75rem,4vw,3rem)] leading-none text-bone">
                    {f.name}
                  </h2>
                  <p className="display mt-5 text-[clamp(1.15rem,2.2vw,1.75rem)] leading-none text-signal tabular-nums">
                    {prix(f.prix)}
                  </p>
                </div>

                <div className="md:col-span-4">
                  <p className="max-w-[34ch] font-mono text-[0.875rem] leading-[1.85] text-bone/85">
                    {f.promesse}
                  </p>
                  <p className="mt-5 max-w-[34ch] font-mono text-[0.75rem] leading-[1.85] text-steel">
                    {f.pour}
                  </p>
                </div>

                <ul className="md:col-span-4">
                  {f.livrables.map((l) => (
                    <li
                      key={l}
                      className="flex items-baseline gap-4 border-t border-steel/40 py-3 font-mono text-[0.75rem] leading-[1.7] text-fog first:border-t-0 first:pt-0"
                    >
                      <span aria-hidden className="text-steel">
                        —
                      </span>
                      {l}
                    </li>
                  ))}
                </ul>

                <div className="md:col-span-12">
                  <GainBand
                    formule={f}
                    before={vitrine.gainBefore}
                    after={vitrine.gainAfter}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="vt-rule hairline origin-left" />
        </div>

        <p className="vt-fade mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="label">{vitrine.delaiLabel}</span>
          <span className="max-w-[52ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
            {vitrine.delai}
          </span>
        </p>
      </section>

      {/* — le parcours ————————————————————————————————— */}
      <section className="vt-steps border-t border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <p className="label">{vitrine.stepsLabel}</p>
          <div className="mt-10 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-10">
            {vitrine.steps.map((s, i) => (
              <div key={s.title} className="vt-step">
                <span className="label text-signal">{pad(i + 1, 2)}</span>
                <h3 className="display mt-4 text-[clamp(1.35rem,2.6vw,2.25rem)] leading-none text-bone">
                  {s.title}
                </h3>
                <p className="mt-5 max-w-[38ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* — les limites : elles portent l'argument ————————— */}
          <div className="mt-16 md:mt-20">
            <p className="label">{vitrine.limitsLabel}</p>
            <ul className="mt-6 space-y-3">
              {vitrine.limits.map((l) => (
                <li
                  key={l}
                  className="flex items-baseline gap-4 font-mono text-[0.8125rem] leading-[1.85] text-fog"
                >
                  <span aria-hidden className="text-steel">
                    —
                  </span>
                  <span className="max-w-[70ch]">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* — demande de devis ————————————————————————————— */}
      <section className="border-t border-steel/40">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-4">
              <h2 className="display text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.98] text-bone">
                {vitrine.cta.title}
              </h2>
              <p className="mt-6 max-w-[32ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
                {vitrine.cta.body}
              </p>
            </div>

            <BriefForm />
          </div>
        </div>
      </section>
    </div>
  );
}
