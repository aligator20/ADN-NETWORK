"use client";

import { useRef } from "react";

import { JoinForm } from "@/components/ui/JoinForm";
import { useCopy } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * PAGE /reseau — LA COMMUNAUTÉ
 *
 * Le formulaire d'inscription est isolé dans `JoinForm` : c'est le seul endroit
 * du site qui écrit quelque part, et il a sa propre machine à états. Le reste
 * de la page est de l'éditorial pur.
 */
export function CommunityView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { community, labels } = useCopy();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      tl.from(".rz-reveal", {
        yPercent: 115,
        duration: DUR.slow,
        stagger: STAGGER.lines,
      }).from(".rz-fade", { autoAlpha: 0, y: 24, duration: DUR.base, stagger: 0.1 }, "-=1.1");

      gsap.from(".rz-step", {
        autoAlpha: 0,
        y: 28,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".rz-steps", start: "top 82%" },
      });

      gsap.from(".rz-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.08,
        scrollTrigger: { trigger: ".rz-steps", start: "top 82%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <div className="rz-fade flex items-baseline justify-between gap-6">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(6)}]</span>
            <span className="label">{community.name}</span>
          </p>
          <p className="label">{labels.openNoFee}</p>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="rz-reveal display block text-[clamp(2.5rem,9vw,8rem)] leading-[0.88] text-bone">
              {community.name}
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-[30ch] display text-[clamp(1.35rem,3vw,2.75rem)] leading-[1.14] text-bone md:mt-14">
          {community.lead}
        </p>

        <div className="rz-fade mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {community.body.map((p, i) => (
            <p
              key={i}
              className="max-w-[48ch] font-mono text-[0.8125rem] leading-[1.9] text-fog"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* — les trois rôles ————————————————————————————— */}
      <section className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
        <p className="label">{labels.threeRoles}</p>
        <div className="mt-10 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-10">
          {community.roles.map((r) => (
            <div key={r.id}>
              <span
                aria-hidden
                className="block h-px w-full"
                style={{ background: r.color }}
              />
              <h2
                className="display mt-6 text-[clamp(1.5rem,3vw,2.5rem)] leading-none"
                style={{ color: r.color }}
              >
                {r.title}
              </h2>
              <p className="mt-5 max-w-[36ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* — le parcours ————————————————————————————————— */}
      <section className="rz-steps border-t border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <p className="label">{labels.howItWorks}</p>
          <div className="mt-10">
            {community.steps.map((s, i) => (
              <div key={s.title}>
                <div className="rz-rule hairline origin-left" />
                <div className="rz-step grid grid-cols-12 items-baseline gap-x-4 py-8 md:gap-x-10 md:py-10">
                  <span className="col-span-2 label text-signal md:col-span-1">
                    {pad(i + 1, 2)}
                  </span>
                  <h3 className="display col-span-10 text-[clamp(1.35rem,3vw,2.5rem)] leading-none text-bone md:col-span-4">
                    {s.title}
                  </h3>
                  <p className="col-span-12 mt-4 max-w-[46ch] font-mono text-[0.8125rem] leading-[1.9] text-fog md:col-span-7 md:mt-0">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
            <div className="rz-rule hairline origin-left" />
          </div>

          {/* — les limites : elles protègent les deux côtés ————— */}
          <div className="mt-16 md:mt-20">
            <p className="label">{labels.whatItIsNot}</p>
            <ul className="mt-6 space-y-3">
              {community.limits.map((l) => (
                <li
                  key={l}
                  className="flex items-baseline gap-4 font-mono text-[0.8125rem] text-fog"
                >
                  <span aria-hidden className="text-steel">
                    —
                  </span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* — candidature ————————————————————————————————— */}
      <section className="border-t border-steel/40">
        <div className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-4">
              <h2 className="display text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.98] text-bone">
                {community.cta.title}
              </h2>
              <p className="mt-6 max-w-[32ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
                {community.cta.body}
              </p>
              <p className="label mt-8 leading-[1.9]">
                {labels.noAccount}
                <br />
                <span className="text-steel">{labels.dataUse}</span>
              </p>
            </div>

            <JoinForm />
          </div>
        </div>
      </section>
    </div>
  );
}
