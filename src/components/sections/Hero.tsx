"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";

import { ScrambleText } from "@/components/ui/ScrambleText";
import { SplitText } from "@/components/ui/SplitText";
import { disciplines, site, ui } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { useAppState } from "@/providers/app-context";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * Three.js pèse ~120 kB : le charger dans le bundle initial retarderait le
 * texte, qui est la vraie charge utile. Il part donc dans un chunk séparé,
 * téléchargé pendant que le préloader tourne — l'hélice est prête bien avant
 * que le rideau ne se retire, et le titre peut peindre sans l'attendre.
 * `ssr: false` : il n'y a rien à rendre au serveur pour un canvas WebGL.
 */
const HelixField = dynamic(
  () => import("@/components/webgl/HelixField").then((m) => m.HelixField),
  { ssr: false },
);

/**
 * SÉQUENCE 001 — HERO
 *
 * Composition asymétrique : le titre s'ancre en bas à gauche, l'hélice occupe
 * la droite. Rien n'est centré — le centrage est le réflexe du site vitrine,
 * l'ancrage éditorial est celui d'une identité.
 *
 * Deux chorégraphies indépendantes :
 *   ENTRÉE  — déclenchée par la fin du préloader (`ready`), jouée une fois.
 *   SORTIE  — pilotée au scroll (scrub) : le titre se disloque et l'hélice se
 *             déroule en réseau, ce qui enchaîne directement sur la séquence 002.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useAppState();
  const reduced = usePrefersReducedMotion();

  /** Driver du shader : écrit par ScrollTrigger, lu par la boucle WebGL. */
  const unwind = useRef(0);

  /* — ÉTAT INITIAL ————————————————————————————————————————
     Posé dès le montage, PAS à la fin du préloader : sans ça, le contenu
     apparaîtrait dans son état final pendant le retrait du rideau, puis
     sauterait en arrière pour s'animer. */
  useGSAP(
    () => {
      gsap.set("[data-split]", { yPercent: 110 });
      gsap.set(".hero-rule", { scaleX: 0 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 18 });
    },
    { scope: root },
  );

  /* — ENTRÉE ————————————————————————————————————————————— */
  useGSAP(
    () => {
      if (!ready) return;

      if (reduced) {
        gsap.set("[data-split], .hero-fade", { autoAlpha: 1, yPercent: 0, y: 0 });
        gsap.set(".hero-rule", { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

      tl.to(".hero-meta [data-split]", {
        yPercent: 0,
        duration: DUR.base,
        stagger: STAGGER.words,
      })
        // Le titre monte de son masque, lettre par lettre, décalé par ligne.
        .to(
          ".hero-line-a [data-split]",
          { yPercent: 0, duration: DUR.slow, stagger: STAGGER.chars },
          "-=0.65",
        )
        .to(
          ".hero-line-b [data-split]",
          { yPercent: 0, duration: DUR.slow, stagger: STAGGER.chars },
          "-=1.15",
        )
        // La règle se déploie depuis la gauche : elle « pose » le bloc de titre.
        .to(
          ".hero-rule",
          { scaleX: 1, duration: DUR.cinematic, ease: EASE.power },
          "-=1.0",
        )
        .to(
          ".hero-fade",
          { autoAlpha: 1, y: 0, duration: DUR.base, stagger: STAGGER.blocks },
          "-=1.6",
        );
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  /* — SORTIE au scroll ————————————————————————————————————— */
  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=110%",
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          // La valeur brute pilote le shader ; l'hélice se déroule exactement
          // au rythme du doigt sur la molette.
          onUpdate: (self) => {
            unwind.current = self.progress;
          },
        },
      });

      // Les deux lignes du titre partent en sens opposés : le mot se scinde,
      // il ne s'efface pas. C'est la dislocation de l'hélice, en typographie.
      tl.to(".hero-line-a", { xPercent: -14, ease: "none" }, 0)
        .to(".hero-line-b", { xPercent: 12, ease: "none" }, 0)
        .to(".hero-block", { autoAlpha: 0, ease: "none" }, 0.35)
        .to(".hero-meta, .hero-fade", { autoAlpha: 0, ease: "none" }, 0)
        .to(".hero-veil", { opacity: 0.75, ease: "none" }, 0);

      // Pas de kill manuel : useGSAP encapsule le contexte GSAP et révoque
      // lui-même les ScrollTriggers créés dans ce scope.
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden bg-void"
    >
      {/* — champ hélicoïdal ————————————————————————————— */}
      <HelixField unwindRef={unwind} />

      {/* — voile : creuse le contraste sous le titre et vignette les bords — */}
      <div
        aria-hidden
        className="hero-veil pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 15% 85%, rgba(5,5,6,0.94) 0%, rgba(5,5,6,0.55) 38%, rgba(5,5,6,0) 68%)," +
            "linear-gradient(to top, rgba(5,5,6,0.85) 0%, rgba(5,5,6,0) 45%)",
        }}
      />

      {/* — contenu ————————————————————————————————————— */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1800px] flex-col justify-end gutter pb-24 pt-28 md:pb-28">
        {/* méta de séquence — l'index qui transforme la page en instrument */}
        <div className="hero-meta mb-auto flex items-baseline gap-4 pt-8 md:pt-10">
          <span className="mask">
            <span data-split className="label text-signal">
              [{pad(1)}]
            </span>
          </span>
          <span className="mask">
            <span data-split className="label">
              {ui.sequence}
            </span>
          </span>
        </div>

        {/* bloc de titre, ancré en bas à gauche */}
        <div className="hero-block">
          <h1 className="display text-[clamp(3.25rem,17vw,17rem)] text-bone">
            <span className="hero-line-a block will-change-transform">
              <SplitText>{site.wordmark.first}</SplitText>
            </span>
            <span className="hero-line-b display-outline block will-change-transform">
              <SplitText>{site.wordmark.second}</SplitText>
            </span>
          </h1>

          <div className="hero-rule hairline mt-8 origin-left md:mt-10" />

          {/* tagline : trois blocs mono, séparés par l'accent */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <p className="hero-fade flex flex-wrap items-center gap-x-4 gap-y-2">
              {site.tagline.map((word, i) => (
                <span key={word} className="flex items-center gap-4">
                  {i > 0 && (
                    <span aria-hidden className="label text-signal">
                      /
                    </span>
                  )}
                  <ScrambleText className="label text-bone" playOnMount={ready}>
                    {word}
                  </ScrambleText>
                </span>
              ))}
            </p>

            {/* les 7 disciplines, en chaîne dense — aucune carte, jamais */}
            <p className="hero-fade hidden max-w-[34ch] text-right label leading-[1.9] md:block">
              {disciplines.map((d, i) => (
                <span key={d}>
                  {i > 0 && <span className="text-steel"> · </span>}
                  <span className="text-fog">{d}</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
