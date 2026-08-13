"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  disciplineName,
  projectCategories,
  projects,
  projectsByCategory,
} from "@/content/projects";
import { Cover } from "@/components/ui/Cover";
import { Status } from "@/components/ui/Status";
import { disciplineColor, type ServiceId } from "@/content/services";
import { sequences, ui } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { scrollTo } from "@/lib/scroll";
import { cn, pad } from "@/lib/utils";

/**
 * SÉQUENCE 004 — WORK
 *
 * Galerie horizontale pinnée : le scroll vertical devient un déplacement
 * latéral. Le geste change, donc la section se lit comme un lieu et non comme
 * la suite de la page — c'est ce qui la sort du registre « grille de projets ».
 *
 * Chaque projet porte la couleur de sa discipline. Le filtre au-dessus n'est
 * pas écrit à la main : il est dérivé des projets (voir `projectCategories`).
 * Ajouter un projet le fait apparaître dans sa catégorie sans toucher ici.
 *
 * En dessous de 768px, pas de pin : le défilement horizontal reste natif, avec
 * accrochage. Détourner le scroll sur mobile se paie toujours en confort.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ServiceId | null>(null);
  const reduced = usePrefersReducedMotion();

  const list = projectsByCategory(active);

  useGSAP(
    () => {
      if (reduced) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const track = root.current?.querySelector<HTMLElement>(".wk-track");
        const stage = root.current?.querySelector<HTMLElement>(".wk-scroller");
        if (!track || !stage) return;

        // Course recalculée à chaque refresh : elle dépend du nombre de projets
        // visibles, donc elle change quand on filtre. D'où les valeurs sous
        // forme de fonction + `invalidateOnRefresh`.
        const travel = () => Math.max(0, track.scrollWidth - stage.clientWidth);

        // L'inclinaison porte sur la PISTE, pas sur les panneaux : ceux-ci sont
        // recréés à chaque changement de filtre, et un quickTo garderait des
        // références détachées. La piste, elle, survit à tous les filtrages.
        const skewTo = gsap.quickTo(track, "skewX", {
          duration: 0.5,
          ease: "power3.out",
        });

        gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + (travel() + window.innerHeight * 0.5),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // La vélocité incline légèrement les panneaux : la matière réagit
            // à la vitesse du geste. Bornée, sinon ça devient un effet.
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 500);
              skewTo(v);
            },
            onScrubComplete: () => skewTo(0),
          },
        });
      });

      /* — Entrée de l'en-tête ————————————————————————————— */
      gsap.from(".wk-head", {
        autoAlpha: 0,
        y: 24,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  /* — Le filtre change le nombre de panneaux, donc la course du pin. —————
       On rafraîchit plutôt que de reconstruire le ScrollTrigger : le
       reconstruire provoquerait un saut de scroll à chaque clic.

       Et on ramène la galerie à son début. Sans ça, filtrer sept projets vers
       un seul raccourcit la course du pin sous la position courante : le
       lecteur se retrouve éjecté après la section, devant une galerie qu'il
       n'a jamais vue. */
  const firstRun = useRef(true);
  useEffect(() => {
    ScrollTrigger.refresh();

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const el = root.current;
    if (!el) return;
    // Une fois pinnée, la section est en position fixed : c'est le pin-spacer
    // qui porte la vraie position dans le document.
    const spacer = el.parentElement?.classList.contains("pin-spacer")
      ? el.parentElement
      : el;
    scrollTo(spacer.getBoundingClientRect().top + window.scrollY);
  }, [active]);

  return (
    <section
      ref={root}
      id="work"
      className="relative overflow-x-clip border-t border-steel/40 bg-void"
    >
      <div className="flex h-[100svh] flex-col justify-center">
        {/* — en-tête + filtre ————————————————————————————— */}
        <div className="mx-auto w-full max-w-[1800px] shrink-0 gutter pt-28 md:pt-32">
          <div className="wk-head flex items-baseline justify-between gap-6">
            <p className="flex items-baseline gap-4">
              <span className="label text-signal">[{pad(4)}]</span>
              <span className="label">{sequences[3].label}</span>
            </p>
            <p className="label hidden md:block">
              {pad(list.length, 2)} — {ui.selectedProjects}
            </p>
          </div>

          <div className="hairline mt-6" />

          {/* Filtre entièrement dérivé de `projects` : aucune catégorie n'est
              écrite ici, chacune porte sa couleur de discipline. */}
          <div className="wk-head mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
            <FilterButton
              label={ui.all}
              count={projects.length}
              color="var(--color-signal)"
              active={active === null}
              onSelect={() => setActive(null)}
            />
            {projectCategories.map((c) => (
              <FilterButton
                key={c.id}
                label={c.name}
                count={c.count}
                color={c.color}
                active={active === c.id}
                onSelect={() => setActive(c.id)}
              />
            ))}
          </div>
        </div>

        {/* — la galerie ————————————————————————————————— */}
        <div className="wk-scroller mt-10 flex-1 overflow-x-auto md:mt-14 md:overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="wk-track flex h-full items-center gap-10 gutter md:gap-20">
            {list.map((p, i) => (
              <ProjectPanel key={p.slug} project={p} index={i + 1} />
            ))}

            {/* Fin de piste : la galerie se referme sur une porte de sortie
                vers l'index complet, jamais sur du vide. */}
            <div className="wk-panel flex h-full shrink-0 snap-center flex-col justify-center pr-6 md:pr-20">
              <p className="label">{ui.endOfSelection}</p>
              <p className="display mt-4 max-w-[16ch] text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] text-bone/40">
                {ui.moreOnRequest}
              </p>
              <Link
                href="/work"
                data-cursor="hover"
                className="group mt-8 inline-flex w-fit items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-bone transition-colors duration-300 hover:text-signal"
              >
                Voir l&apos;index complet
                <span
                  aria-hidden
                  className="block h-px w-8 bg-current transition-all duration-500 ease-expo group-hover:w-12"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

function FilterButton({
  label,
  count,
  color,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  color: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor="hover"
      className={cn(
        "group relative pb-1 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
        active ? "text-bone" : "text-fog hover:text-bone",
      )}
      style={active ? { color } : undefined}
      aria-pressed={active}
    >
      {label}
      <sup className="ml-1.5 text-[0.5rem] text-steel">{pad(count, 2)}</sup>
      {/* Le soulignement porte la couleur : l'état actif se lit sans compter
          sur la seule nuance de gris du libellé. */}
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-400 ease-expo",
          active ? "scale-x-100" : "scale-x-0",
        )}
        style={{ background: color }}
      />
    </button>
  );
}

function ProjectPanel({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const color = disciplineColor[project.discipline];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="wk-panel group flex h-full shrink-0 snap-center flex-col justify-center will-change-transform"
      data-cursor="hover"
      data-cursor-label={ui.view}
    >
      {/* — la plaque : visuel du projet ——————————————————————
          Sans image fournie, on compose une plaque teintée à la couleur de la
          discipline. Le projet est donc présentable dès son ajout, sans
          attendre les visuels — et le rendu ne trahit pas un trou. */}
      <div className="relative aspect-[4/5] w-[70vw] overflow-hidden md:w-[26vw]">
        {/* Le zoom au survol porte sur un conteneur, pas sur l'image : ainsi
            une couverture en `contain` grandit sans jamais être recadrée. */}
        <div className="absolute inset-0 transition-transform duration-700 ease-expo group-hover:scale-[1.04]">
          <Cover project={project} inset={86} />
        </div>

        {/* index en contre-masse, dans le coin */}
        <span
          aria-hidden
          className="display display-outline absolute bottom-4 right-5 text-[clamp(2.5rem,5vw,4.5rem)] opacity-30"
        >
          {pad(index, 2)}
        </span>

        {/* Le résumé passe EN SURIMPRESSION et non en dépliage de la légende :
            la scène est en overflow-hidden et à hauteur fixe, un dépliage
            pousserait la plaque hors cadre au survol. Ici, rien ne bouge dans
            le flux — le texte monte au-dessus de l'image. */}
        {/* Sur mobile il n'y a pas de survol : le résumé reste affiché. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 transition-all duration-500 ease-expo md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[130%] bg-gradient-to-t from-void via-void/85 to-transparent"
          />
          <p className="relative font-mono text-[0.75rem] leading-relaxed text-bone/90">
            {project.summary}
          </p>
          {project.stack && (
            <p className="relative mt-3 label leading-[1.9]">
              {project.stack.map((s, si) => (
                <span key={s}>
                  {si > 0 && <span className="text-steel"> · </span>}
                  <span className="text-fog">{s}</span>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* — la légende ————————————————————————————————— */}
      <div className="mt-6 w-[70vw] md:w-[26vw]">
        <p className="flex items-baseline justify-between gap-4">
          <span
            className="font-mono text-[0.625rem] uppercase tracking-[0.28em]"
            style={{ color }}
          >
            {disciplineName(project.discipline)}
          </span>
          <span className="label tabular-nums">{project.year}</span>
        </p>

        <h3 className="display mt-3 text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[0.95] text-bone">
          {project.title}
        </h3>
        <Status project={project} className="mt-3" />
      </div>
    </Link>
  );
}
