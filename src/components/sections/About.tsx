"use client";

import { useRef } from "react";

import { useCopy } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * SÉQUENCE 005 — STRUCTURE
 *
 * Section éditoriale, sans image et sans carte. La hiérarchie tient à trois
 * choses : une phrase d'attaque en corps massif, deux paragraphes en mono qui
 * argumentent, trois principes numérotés séparés par des filets.
 *
 * La parallaxe est LÉGÈRE et différentielle : la colonne de gauche et la
 * signature glissent un peu moins vite que le texte. C'est ce décalage, et non
 * une amplitude spectaculaire, qui donne la profondeur.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { about, sequences, site } = useCopy();

  useGSAP(
    () => {
      if (reduced) return;

      /* — Attaque : mot à mot, au rythme du scroll ————————————— */
      gsap.fromTo(
        ".ab-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.3,
          scrollTrigger: {
            trigger: ".ab-lead",
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );

      /* — Corps et principes : révélation masquée ————————————— */
      gsap.from(".ab-reveal", {
        yPercent: 110,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: STAGGER.lines,
        scrollTrigger: { trigger: ".ab-body", start: "top 82%" },
      });

      gsap.from(".ab-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.1,
        scrollTrigger: { trigger: ".ab-principles", start: "top 85%" },
      });

      gsap.from(".ab-principle", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".ab-principles", start: "top 85%" },
      });

      /* — Parallaxe différentielle ————————————————————————— */
      gsap.to(".ab-slow", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* — Signature ————————————————————————————————————— */
      gsap.from(".ab-sign", {
        autoAlpha: 0,
        y: 30,
        duration: DUR.base,
        ease: EASE.expo,
        scrollTrigger: { trigger: ".ab-sign", start: "top 88%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="about"
      className="relative overflow-x-clip border-t border-steel/40 bg-void py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1800px] gutter">
        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-10">
          {/* — repère de séquence ————————————————————————— */}
          <aside className="md:col-span-3">
            <div className="ab-slow md:sticky md:top-28">
              <p className="flex items-baseline gap-4">
                <span className="label text-signal">[{pad(5)}]</span>
                <span className="label">{sequences[4].label}</span>
              </p>
              <div className="hairline mt-5 max-w-[9rem]" />
            </div>
          </aside>

          <div className="md:col-span-9">
            {/* attaque */}
            <p className="ab-lead display text-[clamp(1.5rem,3.4vw,3.4rem)] leading-[1.14] tracking-[-0.03em] text-bone [text-wrap:pretty]">
              {about.lead.split(" ").map((w, i) => (
                <span key={i}>
                  <span className="ab-word inline-block">{w}</span>{" "}
                </span>
              ))}
            </p>

            {/* argumentaire */}
            <div className="ab-body mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
              {about.body.map((p, i) => (
                <span key={i} className="mask block">
                  <span className="ab-reveal block max-w-[46ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                    {p}
                  </span>
                </span>
              ))}
            </div>

            {/* principes — numérotés, séparés par des filets, jamais encadrés */}
            <div className="ab-principles mt-20 md:mt-28">
              {about.principles.map((p, i) => (
                <div key={p.title}>
                  <div className="ab-rule hairline origin-left" />
                  <div className="ab-principle grid grid-cols-12 items-baseline gap-x-4 py-8 md:gap-x-10 md:py-10">
                    <span className="ab-idx col-span-2 label md:col-span-1">
                      {pad(i + 1)}
                    </span>
                    <h3 className="display col-span-10 text-[clamp(1.35rem,3vw,2.5rem)] leading-[0.98] text-bone md:col-span-5">
                      {p.title}
                    </h3>
                    <p className="col-span-12 mt-3 max-w-[42ch] font-mono text-[0.8125rem] leading-[1.85] text-fog md:col-span-6 md:mt-0">
                      {p.text}
                    </p>
                  </div>
                </div>
              ))}
              <div className="ab-rule hairline origin-left" />
            </div>

            {/* Signature du fondateur — avec son visage.
                Un site bâti sur une transmission familiale ne peut pas être
                entièrement abstrait : c'est la seule photo de la page d'accueil,
                et elle est à l'endroit où l'on signe. */}
            <div className="ab-sign mt-20 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 md:mt-28">
              <div className="flex items-center gap-6">
                <span className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-full md:h-24 md:w-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/work/sylvere.webp"
                    alt={site.owner.name}
                    className="h-full w-full object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-1 ring-inset ring-bone/20"
                  />
                </span>
                <span>
                  <span className="label block">{site.owner.role}</span>
                  <span className="display mt-2 block text-[clamp(1.5rem,3vw,2.75rem)] leading-none text-bone">
                    {site.owner.name}
                  </span>
                </span>
              </div>
              <p className="label max-w-[22ch] leading-[1.9] md:text-right">
                {site.base.city.toUpperCase()} — {site.base.country}
                <br />
                <span className="text-steel">{site.base.coords}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
