"use client";

import { useRef } from "react";

import { disciplineColor } from "@/content/services";
import { useCopy } from "@/hooks/useCopy";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cssVar, pad, withAlpha } from "@/lib/utils";

/**
 * SÉQUENCE 003 — SERVICES
 *
 * Sept disciplines, sept LIGNES. Pas de grille de cartes : une carte range,
 * une ligne hiérarchise. Le nom est en contour par défaut — il ne se remplit
 * que sous le curseur, si bien que la section au repos est presque vide et que
 * l'attention se porte sur une seule discipline à la fois.
 *
 * Le survol est câblé en écouteurs natifs dans le scope GSAP plutôt qu'en
 * props React : sept lignes × deux handlers, c'est 14 fermetures recréées à
 * chaque rendu pour une animation qui n'a aucune raison de repasser par React.
 */
export function Services() {
  const { sequences, services, ui } = useCopy();
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      // Requête explicitement portée par le scope : `gsap.utils.toArray` ne
      // respecte pas le scope de useGSAP, seules les méthodes d'animation le font.
      const rows = Array.from(
        root.current?.querySelectorAll<HTMLElement>(".svc-row") ?? [],
      );

      /* — Entrée : les lignes montent de leur masque ————————————— */
      if (!reduced) {
        gsap.from(".svc-row .svc-mask > *", {
          yPercent: 110,
          duration: DUR.slow,
          ease: EASE.expo,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
        gsap.from(".svc-rule", {
          scaleX: 0,
          duration: DUR.cinematic,
          ease: EASE.power,
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
      }

      /* — Survol ————————————————————————————————————————— */
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (reduced || !fine) return;

      const BONE = cssVar("--color-bone", "#ececee");
      const FOG = cssVar("--color-fog", "#7d7d86");

      // Chaque ligne se remplit de SA couleur de discipline, pas d'un accent
      // commun. La liste au repos est monochrome ; sous le curseur, elle
      // affiche le code couleur du site — c'est là que la section prend vie.
      const teintes = services.map((s) =>
        cssVar(disciplineColor[s.id].replace(/var\(|\)/g, ""), BONE),
      );

      const cleanups = rows.map((row, ri) => {
        const teinte = teintes[ri] ?? BONE;
        const name = row.querySelector(".svc-name");
        const idx = row.querySelector(".svc-idx");
        const detail = row.querySelector(".svc-detail");
        const wipe = row.querySelector<HTMLElement>(".svc-wipe");
        if (wipe) wipe.style.background = teinte;

        // Timeline construite une fois, jouée/rembobinée : aucune allocation
        // pendant l'interaction, donc aucun à-coup au survol rapide.
        const tl = gsap
          .timeline({ paused: true, defaults: { duration: 0.55, ease: EASE.expo } })
          // Le contour se remplit : c'est le même mot qui prend corps.
          .to(name, { color: teinte, x: 12 }, 0)
          .to(idx, { color: teinte }, 0)
          .to(detail, { autoAlpha: 1, x: 0 }, 0.05)
          .to(wipe, { scaleX: 1, duration: 0.7 }, 0);

        const enter = () => {
          tl.play();
          // Les autres lignes reculent : la hiérarchie se crée par le retrait.
          gsap.to(
            rows.filter((r) => r !== row),
            { opacity: 0.28, duration: 0.4, ease: "power2.out" },
          );
        };

        const leave = () => {
          tl.reverse();
          gsap.to(rows, { opacity: 1, duration: 0.4, ease: "power2.out" });
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);

        return () => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        };
      });

      // État de repos : nom en contour (couleur transparente), détail rentré.
      gsap.set(".svc-name", { color: withAlpha(BONE, 0) });
      gsap.set(".svc-idx", { color: FOG });
      gsap.set(".svc-detail", { autoAlpha: 0, x: 40 });
      gsap.set(".svc-wipe", { scaleX: 0 });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      ref={root}
      id="services"
      // `overflow-x-clip` et pas `hidden` : le détail entre par la droite en
      // translateX, il ne doit jamais élargir le document — et `clip` ne crée
      // pas de conteneur de défilement, donc rien ne casse `position: sticky`.
      className="relative overflow-x-clip border-t border-steel/40 bg-void py-32 md:py-44"
    >
      <div className="mx-auto max-w-[1800px] gutter">
        {/* — en-tête de séquence ————————————————————————— */}
        <div className="flex items-baseline justify-between gap-6">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(3)}]</span>
            <span className="label">{sequences[2].label}</span>
          </p>
          <p className="label hidden md:block">
            {pad(services.length, 2)} — {ui.fieldsOfPractice}
          </p>
        </div>

        {/* — la liste ————————————————————————————————— */}
        <ul className="mt-16 md:mt-24">
          {services.map((s, i) => (
            <li
              key={s.id}
              data-cursor="hover"
              className="svc-row group relative cursor-pointer"
            >
              {/* hairline de tête + trait d'accent qui balaie au survol */}
              <div className="svc-rule hairline origin-left" />
              {/* La couleur est posée en JS depuis `disciplineColor` : Tailwind
                  ne peut pas générer de classe dynamique par discipline. */}
              <div className="svc-wipe absolute inset-x-0 top-0 h-px origin-left" />

              <div className="grid grid-cols-12 items-baseline gap-x-4 py-7 md:gap-x-10 md:py-10">
                {/* index */}
                <div className="col-span-2 md:col-span-1">
                  <span className="svc-idx label block">{pad(i + 1)}</span>
                  {/* Une voie d'accès n'est pas une prestation : le dire ici
                      évite de laisser croire qu'on livre du pentest. */}
                  {s.kind === "pathway" && (
                    <span className="label mt-2 block text-signal">Voie</span>
                  )}
                </div>

                {/* Nom en contour, rempli au survol.
                    Le masque de révélation coupe en overflow:hidden, donc aussi
                    à l'horizontale. La colonne et le clamp sont dimensionnés
                    pour que le nom le plus long — AUTOMATISATION, 14 signes —
                    tienne à toutes les largeurs, décalage de survol compris.
                    Ajouter un nom plus long impose de rebaisser le maximum du
                    clamp : vérifier avec la marge mesurée, pas à l'œil. */}
                <div className="col-span-10 md:col-span-7">
                  <span className="svc-mask mask block">
                    <span className="svc-name display display-outline block text-[clamp(1.75rem,5.2vw,4.5rem)] will-change-transform">
                      {s.name}
                    </span>
                  </span>
                </div>

                {/* détail : caché au repos sur desktop, toujours lisible en dessous */}
                <div className="col-span-12 mt-4 md:col-span-4 md:mt-0">
                  <div className="svc-detail">
                    <p className="max-w-[38ch] font-mono text-[0.8125rem] leading-relaxed text-bone/80">
                      {s.statement}
                    </p>
                    <p className="label mt-4 leading-[1.9]">
                      {s.capabilities.map((c, ci) => (
                        <span key={c}>
                          {ci > 0 && <span className="text-steel"> · </span>}
                          <span className="text-fog">{c}</span>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* hairline de fermeture : la liste est un bloc, pas une suite ouverte */}
        <div className="svc-rule hairline origin-left" />
      </div>
    </section>
  );
}
