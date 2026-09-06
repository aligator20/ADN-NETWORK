"use client";

import Link from "next/link";
import { useRef } from "react";

import { useCopy, useHref, useLang, useSequence } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { formatPrix } from "@/lib/prix";
import { pad } from "@/lib/utils";

/**
 * SÉQUENCE 007 — LA VITRINE
 *
 * POURQUOI CETTE SECTION EXISTE
 *
 * La séquence « vitrine » était déclarée, la page `/vitrine` construite et
 * déployée, l'entrée présente au menu — mais l'accueil ne la mentionnait
 * nulle part : aucun lien, aucune section. Le seul chemin passait par le menu
 * plein écran, que la plupart des visiteurs n'ouvrent jamais. Une offre
 * payante invisible depuis la page d'accueil ne rapporte rien.
 *
 * CE QU'ELLE MONTRE, ET CE QU'ELLE NE MONTRE PAS
 *
 * Les trois formules sont nommées, pas tarifées. La page `/vitrine` range
 * volontairement ses formules en LIGNES pour qu'on lise ce que chacune règle
 * avant de voir son prix ; trois prix alignés en colonnes ici produiraient
 * exactement le tableau comparatif qu'elle refuse, et le visiteur arriverait
 * sur la page en ayant déjà choisi au moins-disant. Le seul chiffre affiché
 * est le plancher, dans l'en-tête — de quoi savoir si l'on est dans le budget,
 * pas de quoi arbitrer.
 *
 * La mise en page reprend celle du Réseau, section voisine : trois colonnes
 * séparées par des filets verticaux, puis une porte pleine largeur. Les deux
 * offres du site se présentent de la même façon parce qu'elles se valent en
 * importance — l'une gratuite, l'autre payante, aucune déguisée en l'autre.
 */
export function Vitrine() {
  const { vitrine, labels } = useCopy();
  const sequence = useSequence();
  const href = useHref();
  const lang = useLang();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const minimum = Math.min(...vitrine.formules.map((f) => f.prix));

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".vs-reveal", {
        yPercent: 115,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: STAGGER.lines,
        scrollTrigger: { trigger: root.current, start: "top 76%" },
      });

      gsap.from(".vs-formule", {
        autoAlpha: 0,
        y: 30,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".vs-formules", start: "top 84%" },
      });

      gsap.from(".vs-rule", {
        scaleY: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.1,
        scrollTrigger: { trigger: ".vs-formules", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="vitrine"
      className="relative overflow-x-clip border-t border-steel/40 bg-carbon py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1800px] gutter">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(sequence("vitrine").index)}]</span>
            <span className="label">{sequence("vitrine").label}</span>
          </p>
          <p className="label">
            {vitrine.kicker}{" "}
            <span className="text-bone">{formatPrix(minimum, lang, vitrine.currency)}</span>
          </p>
        </div>

        {/* — ce que l'offre règle ————————————————————— */}
        <h2 className="mt-14 md:mt-20">
          <span className="mask block">
            <span className="vs-reveal display block text-[clamp(1.75rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.035em] text-bone">
              {vitrine.name}
            </span>
          </span>
        </h2>

        <p className="mt-8 max-w-[46ch] display text-[clamp(1.15rem,2.4vw,2rem)] leading-[1.18] text-bone/85 md:mt-10">
          {vitrine.lead}
        </p>

        {/* — les trois formules, nommées et non tarifées ——————— */}
        <div className="vs-formules mt-16 grid grid-cols-1 gap-y-12 md:mt-24 md:grid-cols-3 md:gap-x-10">
          {vitrine.formules.map((f, i) => (
            <div key={f.id} className="vs-formule relative md:pl-8">
              {/* filet vertical : il sépare sans encadrer */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="vs-rule absolute left-0 top-0 hidden h-full w-px origin-top bg-steel md:block"
                />
              )}
              <p className="label text-signal">{pad(i + 1, 2)}</p>
              <p className="display mt-4 text-[clamp(1.35rem,2.6vw,2rem)] leading-none text-bone">
                {f.name}
              </p>
              <p className="mt-5 max-w-[34ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                {f.promesse}
              </p>
            </div>
          ))}
        </div>

        {/* — la porte vers la page dédiée ————————————————— */}
        <div className="mt-20 md:mt-28">
          <div className="hairline" />
          <Link
            href={href("/vitrine")}
            data-cursor="hover"
            className="group flex flex-wrap items-baseline justify-between gap-6 py-8 md:py-10"
          >
            <span className="display text-[clamp(1.5rem,4vw,3.25rem)] leading-none text-bone transition-transform duration-500 ease-expo md:group-hover:translate-x-4">
              {vitrine.cta.title}
            </span>
            <span className="flex items-center gap-4">
              <span className="label">{labels.seePackages}</span>
              <span
                aria-hidden
                className="block h-px w-10 bg-signal transition-all duration-500 ease-expo group-hover:w-20"
              />
            </span>
          </Link>
          <div className="hairline" />
        </div>
      </div>
    </section>
  );
}
