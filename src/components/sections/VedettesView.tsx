"use client";

import Link from "next/link";
import { useRef } from "react";

import { projectBySlug } from "@/content/projects";
import { disciplineColor } from "@/content/services";
import { useCopy, useDisciplineName, useHref, useLang } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatPrix } from "@/lib/prix";
import { pad } from "@/lib/utils";

/**
 * PAGE /services — LES DIX VEDETTES
 *
 * La section « Disciplines » de l'accueil dit ce qu'on sait faire ; elle ne
 * donne aucun objet à commander. Cette page-ci nomme et chiffre une prestation
 * par discipline.
 *
 * TROIS DÉCISIONS DE MISE EN PAGE
 *
 * 1. UNE LIGNE PAR PRESTATION, comme la Vitrine. Dix cartes en grille
 *    produiraient un comparateur, et le visiteur choisirait au prix avant
 *    d'avoir lu ce que chaque ligne règle.
 *
 * 2. LA COULEUR DE DISCIPLINE EST LE SEUL ORNEMENT. Elle rattache chaque
 *    prestation à la discipline dont elle vient, sans avoir à répéter un
 *    intertitre tous les deux blocs.
 *
 * 3. LA RÉSERVE EST À LA MÊME TAILLE QUE LA PROMESSE. « L'installation n'est
 *    pas de notre ressort », « aucun test d'intrusion vendu » : ces phrases
 *    sont ce qui rend le reste croyable, pas une clause à reléguer en petit.
 */
export function VedettesView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { vedettes } = useCopy();
  const disciplineName = useDisciplineName();
  const href = useHref();
  const lang = useLang();

  const prix = (n: number) => formatPrix(n, lang, vedettes.currency);
  const minimum = Math.min(...vedettes.items.map((v) => v.prix));

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      tl.from(".vd-reveal", { yPercent: 115, duration: DUR.slow, stagger: STAGGER.lines }).from(
        ".vd-fade",
        { autoAlpha: 0, y: 24, duration: DUR.base, stagger: 0.1 },
        "-=1.1",
      );

      // Un déclencheur PAR LIGNE : dix blocs sur un seul déclencheur seraient
      // tous joués à l'entrée du premier, et les sept derniers auraient fini
      // de s'animer bien avant qu'on les atteigne.
      gsap.utils.toArray<HTMLElement>(".vd-item").forEach((ligne) => {
        gsap.from(ligne, {
          autoAlpha: 0,
          y: 26,
          duration: DUR.base,
          ease: EASE.expo,
          scrollTrigger: { trigger: ligne, start: "top 88%" },
        });
        gsap.from(ligne.previousElementSibling, {
          scaleX: 0,
          duration: DUR.cinematic,
          ease: EASE.power,
          scrollTrigger: { trigger: ligne, start: "top 88%" },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <div className="vd-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(3)}]</span>
            <span className="label">{vedettes.listLabel}</span>
          </p>
          <p className="label">
            {vedettes.kicker} <span className="text-bone">{prix(minimum)}</span>
          </p>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="vd-reveal display block text-[clamp(2.25rem,8vw,7rem)] leading-[0.9] text-bone">
              {vedettes.name}
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-[30ch] display text-[clamp(1.35rem,3vw,2.75rem)] leading-[1.14] text-bone md:mt-14">
          {vedettes.lead}
        </p>

        <div className="vd-fade mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {vedettes.body.map((p, i) => (
            <p key={i} className="max-w-[48ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
        <div className="mt-2">
          {vedettes.items.map((v, i) => {
            // Un slug inconnu dégrade en texte simple plutôt qu'en lien mort.
            const projet = v.preuve ? projectBySlug(v.preuve.slug) : undefined;
            const teinte = disciplineColor[v.id];
            return (
              <div key={v.id}>
                <div className="hairline origin-left" />
                <div className="vd-item grid grid-cols-1 gap-y-6 py-10 md:grid-cols-12 md:gap-x-10 md:py-14">
                  <div className="md:col-span-4">
                    <p className="flex items-baseline gap-4">
                      <span className="label" style={{ color: teinte }}>
                        {pad(i + 1, 2)}
                      </span>
                      <span className="label text-steel">{disciplineName(v.id)}</span>
                    </p>
                    <h2 className="display mt-4 text-[clamp(1.6rem,3.6vw,2.75rem)] leading-none text-bone">
                      {v.name}
                    </h2>
                    <p className="display mt-5 text-[clamp(1.05rem,2vw,1.5rem)] leading-none text-signal tabular-nums">
                      {vedettes.from} {prix(v.prix)}
                    </p>
                  </div>

                  <div className="md:col-span-5">
                    <p className="max-w-[38ch] font-mono text-[0.875rem] leading-[1.85] text-bone/85">
                      {v.promesse}
                    </p>
                    <p className="mt-5 max-w-[42ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                      {v.contenu}
                    </p>
                  </div>

                  <div className="md:col-span-3">
                    {/* La démonstration passe AVANT la réalisation : elle
                        s'ouvre et se manipule, là où un lien vers une fiche
                        demande encore de croire sur parole. */}
                    {v.demo && (
                      <div className="mb-7">
                        <p className="label" style={{ color: teinte }}>
                          {vedettes.demoLabel}
                        </p>
                        {/* Une balise `a` et non `Link` : ces pages sont des
                            fichiers statiques hors du routeur, et le
                            préchargement de Next irait chercher un manifeste
                            de route qui n'existe pas. */}
                        <a
                          href={v.demo.href}
                          data-cursor="hover"
                          className="mt-4 flex items-baseline gap-3 font-mono text-[0.8125rem] leading-[1.7] text-bone underline decoration-steel underline-offset-4 transition-colors duration-300 hover:decoration-bone"
                        >
                          <span className="max-w-[26ch]">{v.demo.texte}</span>
                          <span aria-hidden style={{ color: teinte }}>
                            ↗
                          </span>
                        </a>
                      </div>
                    )}
                    {projet && v.preuve ? (
                      <>
                        <p className="label text-steel">{vedettes.preuveLabel}</p>
                        <Link
                          href={href(`/work/${v.preuve.slug}`)}
                          data-cursor="hover"
                          className="group mt-4 flex items-baseline gap-3 font-mono text-[0.8125rem] leading-[1.7] text-fog transition-colors duration-300 hover:text-bone"
                        >
                          <span className="max-w-[26ch]">{v.preuve.texte}</span>
                          <span aria-hidden style={{ color: teinte }}>
                            ↗
                          </span>
                        </Link>
                      </>
                    ) : (
                      /* Rien de publié dans cette discipline. On l'écrit,
                         plutôt que de laisser la colonne vide — une absence
                         nommée se lit comme une position, une absence muette
                         comme un oubli. */
                      <p className="label" style={{ color: teinte }}>
                        {vedettes.sansPreuveLabel}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="hairline origin-left" />
        </div>
      </section>
    </div>
  );
}
