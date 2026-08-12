"use client";

import { Fragment, useRef } from "react";

import { metrics } from "@/content/services";
import { introManifest, sequences } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, pad } from "@/lib/utils";

/**
 * SÉQUENCE 002 — INTRODUCTION
 *
 * Le manifeste ne se révèle pas en bloc : chaque mot passe de l'ombre à la
 * pleine lumière au rythme exact du scroll. Le lecteur ne subit pas une
 * animation, il la produit — c'est ce qui distingue une expérience d'un site.
 *
 * Les chiffres, eux, ne comptent qu'une seule fois, à l'entrée dans le champ :
 * un compteur qui se rejoue à chaque passage devient un gadget.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(".mf-word", { opacity: 1 });
        gsap.set(".metric-rule", { scaleX: 1 });
        return;
      }

      /* — Remplissage du manifeste, mot à mot, piloté au scroll ————— */
      gsap.fromTo(
        ".mf-word",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.35,
          scrollTrigger: {
            trigger: ".mf-body",
            start: "top 78%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        },
      );

      /* — Bande de chiffres ————————————————————————————————— */
      gsap.from(".metric-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.08,
        scrollTrigger: { trigger: ".metric-band", start: "top 85%" },
      });

      // `once: true` — le compteur est un événement, pas une boucle.
      metrics.forEach((m, i) => {
        const el = root.current?.querySelector<HTMLElement>(`[data-metric="${i}"]`);
        if (!el) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: m.value,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = pad(Math.round(counter.v), m.value >= 100 ? 3 : 2);
          },
        });
      });

      /* — Colonne de gauche : elle s'installe, elle n'apparaît pas ——— */
      gsap.from(".mf-aside", {
        autoAlpha: 0,
        y: 24,
        duration: DUR.base,
        ease: EASE.expo,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="intro"
      className="relative border-t border-steel/40 bg-void py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1800px] gutter">
        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-10">
          {/* — repère de séquence, collant sur desktop ————————— */}
          <aside className="mf-aside md:col-span-3">
            <div className="md:sticky md:top-28">
              <p className="flex items-baseline gap-4">
                <span className="label text-signal">[{pad(2)}]</span>
                <span className="label">{sequences[1].label}</span>
              </p>
              <div className="hairline mt-5 max-w-[9rem]" />
            </div>
          </aside>

          {/* — le manifeste ——————————————————————————————— */}
          <div className="md:col-span-9">
            <p className="mf-body display text-[clamp(1.6rem,4vw,4rem)] leading-[1.12] tracking-[-0.03em] text-bone [text-wrap:pretty]">
              {introManifest.map((chunk, ci) => (
                <Fragment key={ci}>
                  {chunk.text.split(" ").map((word, wi) => (
                    <Fragment key={wi}>
                      <span
                        className={cn(
                          "mf-word inline-block",
                          "accent" in chunk && chunk.accent
                            ? "text-signal"
                            : "text-bone",
                        )}
                      >
                        {word}
                      </span>
                      {/* Un vrai nœud texte espace, pas une marge : deux
                          inline-block collés n'offrent aucune opportunité de
                          retour à la ligne, la ligne déborderait. */}
                      {" "}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </p>
          </div>
        </div>

        {/* — bande de chiffres : hairlines, pas de cartes ————————— */}
        <div className="metric-band mt-24 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-36 md:grid-cols-4 md:gap-x-10">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="metric-rule hairline origin-left" />
              <p className="mt-6 flex items-baseline text-bone">
                <span
                  data-metric={i}
                  className="display text-[clamp(2.5rem,6vw,5rem)] tabular-nums"
                >
                  {pad(0, m.value >= 100 ? 3 : 2)}
                </span>
                <span className="display text-[clamp(1rem,2vw,1.75rem)] text-signal">
                  {m.suffix}
                </span>
              </p>
              <p className="label mt-3">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
