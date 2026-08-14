"use client";

import Link from "next/link";
import { useRef } from "react";

import { useCopy, useHref } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * SÉQUENCE 006 — LE RÉSEAU
 *
 * L'annonce de la communauté sur la page d'accueil : trois rôles, une phrase
 * chacun, et une porte vers /reseau. Le détail complet vit sur la page dédiée —
 * ici on ne cherche qu'à faire comprendre qu'il se passe quelque chose.
 *
 * Les trois rôles sont des COLONNES séparées par des filets verticaux, pas des
 * cartes : c'est la même règle que partout ailleurs sur le site.
 */
export function Community() {
  const { community, labels, sequences } = useCopy();
  const href = useHref();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".cm-reveal", {
        yPercent: 115,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: STAGGER.lines,
        scrollTrigger: { trigger: root.current, start: "top 76%" },
      });

      gsap.from(".cm-role", {
        autoAlpha: 0,
        y: 30,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".cm-roles", start: "top 84%" },
      });

      gsap.from(".cm-rule", {
        scaleY: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.1,
        scrollTrigger: { trigger: ".cm-roles", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="community"
      className="relative overflow-x-clip border-t border-steel/40 bg-carbon py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1800px] gutter">
        <div className="flex items-baseline justify-between gap-6">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(6)}]</span>
            <span className="label">{sequences[5].label}</span>
          </p>
          <p className="label hidden md:block">{labels.openNoFee}</p>
        </div>

        {/* — l'observation qui justifie tout le reste ————————— */}
        <h2 className="mt-14 md:mt-20">
          <span className="mask block">
            <span className="cm-reveal display block text-[clamp(1.75rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.035em] text-bone">
              {community.name}
            </span>
          </span>
        </h2>

        <p className="mt-8 max-w-[46ch] display text-[clamp(1.15rem,2.4vw,2rem)] leading-[1.18] text-bone/85 md:mt-10">
          {community.lead}
        </p>

        {/* — les trois rôles, en colonnes séparées par des filets ——— */}
        <div className="cm-roles mt-16 grid grid-cols-1 gap-y-12 md:mt-24 md:grid-cols-3 md:gap-x-10">
          {community.roles.map((r, i) => (
            <div key={r.id} className="cm-role relative md:pl-8">
              {/* filet vertical : il sépare sans encadrer */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="cm-rule absolute left-0 top-0 hidden h-full w-px origin-top bg-steel md:block"
                />
              )}
              <p
                className="font-mono text-[0.625rem] uppercase tracking-[0.28em]"
                style={{ color: r.color }}
              >
                {r.title}
              </p>
              <p className="mt-5 max-w-[34ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                {r.body}
              </p>
              <dl className="mt-7 space-y-3">
                <div className="flex items-baseline gap-4">
                  <dt className="label w-20 shrink-0 text-steel">Apporte</dt>
                  <dd className="font-mono text-[0.75rem] text-bone/80">{r.give}</dd>
                </div>
                <div className="flex items-baseline gap-4">
                  <dt className="label w-20 shrink-0 text-steel">Reçoit</dt>
                  <dd className="font-mono text-[0.75rem] text-bone/80">{r.get}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* — la porte vers la page dédiée ————————————————— */}
        <div className="mt-20 md:mt-28">
          <div className="hairline" />
          <Link
            href={href("/reseau")}
            data-cursor="hover"
            className="group flex flex-wrap items-baseline justify-between gap-6 py-8 md:py-10"
          >
            <span className="display text-[clamp(1.5rem,4vw,3.25rem)] leading-none text-bone transition-transform duration-500 ease-expo md:group-hover:translate-x-4">
              {community.cta.title}
            </span>
            <span className="flex items-center gap-4">
              <span className="label">{labels.howItWorks}</span>
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
