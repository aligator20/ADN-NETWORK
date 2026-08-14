"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { Cover } from "@/components/ui/Cover";
import { Status } from "@/components/ui/Status";
import { type Project } from "@/content/projects";
import {
  useCopy,
  useDisciplineName,
  useHref,
  useProjectCategories,
  useProjectsByCategory,
} from "@/hooks/useCopy";
import { disciplineColor, type ServiceId } from "@/content/services";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, pad } from "@/lib/utils";

/**
 * PAGE /work — INDEX DES RÉALISATIONS
 *
 * Volontairement à l'opposé de la galerie de la page d'accueil : là c'était une
 * traversée horizontale, ici c'est une LISTE qu'on parcourt. Le même contenu
 * dans deux gestes différents — sinon la page dédiée ne justifierait pas son
 * existence.
 *
 * L'aperçu ne vit pas dans les lignes : un seul élément flotte et suit le
 * curseur. La liste reste donc une liste — du texte, des filets, du vide — et
 * l'image n'apparaît que sur intention.
 */
export function WorkIndex() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ServiceId | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const reduced = usePrefersReducedMotion();

  const { projects, sequences, ui } = useCopy();
  const href = useHref();
  const disciplineName = useDisciplineName();
  const projectCategories = useProjectCategories();
  const list = useProjectsByCategory()(active);

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".wi-reveal", {
        yPercent: 115,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: 0.06,
        delay: 0.1,
      });

      gsap.from(".wi-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.05,
        delay: 0.2,
      });

      /* — L'aperçu suit le curseur ————————————————————————
         quickTo plutôt qu'un tween par mousemove : le setter est réutilisé,
         donc aucune allocation pendant le survol. */
      const el = preview.current;
      if (!el || !window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="relative">
      {/* — Aperçu flottant, hors flux ————————————————————————
          `fixed` + `pointer-events-none` : il ne peut ni décaler la mise en
          page, ni intercepter le survol qui l'a fait apparaître. */}
      <div
        aria-hidden
        ref={preview}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-20 hidden h-[300px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-all duration-500 ease-expo md:block",
          hovered ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        {hovered && <Cover project={hovered} inset={80} />}
      </div>

      <div className="mx-auto max-w-[1800px] gutter pb-32 pt-36 md:pb-44 md:pt-44">
        {/* — en-tête ————————————————————————————————————— */}
        <div className="flex items-baseline justify-between gap-6">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(4)}]</span>
            <span className="label">{sequences[3].label}</span>
          </p>
          <p className="label">
            {pad(list.length, 2)} — {ui.selectedProjects}
          </p>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="wi-reveal display block text-[clamp(2.75rem,11vw,10rem)] leading-[0.86] text-bone">
              Réalisations
            </span>
          </span>
        </h1>

        {/* — filtre, dérivé des projets ————————————————————— */}
        <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 md:mt-16">
          <Filter
            label={ui.all}
            count={projects.length}
            color="var(--color-signal)"
            active={active === null}
            onSelect={() => setActive(null)}
          />
          {projectCategories.map((c) => (
            <Filter
              key={c.id}
              label={c.name}
              count={c.count}
              color={c.color}
              active={active === c.id}
              onSelect={() => setActive(c.id)}
            />
          ))}
        </div>

        {/* — la liste ————————————————————————————————— */}
        <ul className="mt-14 md:mt-20">
          {list.map((p, i) => (
            <li key={p.slug}>
              <div className="wi-rule hairline origin-left" />
              <Link
                href={href(`/work/${p.slug}`)}
                data-cursor="hover"
                data-cursor-label={ui.view}
                onPointerEnter={() => setHovered(p)}
                onPointerLeave={() => setHovered(null)}
                className="group grid grid-cols-12 items-baseline gap-x-4 py-7 md:gap-x-10 md:py-9"
              >
                <span className="col-span-2 label md:col-span-1">
                  {pad(i + 1)}
                </span>

                <span className="col-span-10 md:col-span-6">
                  <span className="display block text-[clamp(1.5rem,4.5vw,3.5rem)] leading-[0.98] text-bone transition-transform duration-500 ease-expo md:group-hover:translate-x-4">
                    {p.title}
                  </span>
                </span>

                <span
                  className="col-span-8 mt-3 flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-[0.28em] md:col-span-4 md:mt-0"
                  style={{ color: disciplineColor[p.discipline] }}
                >
                  {disciplineName(p.discipline)}
                  {/* Un projet consultable en ligne se signale dès l'index :
                      le visiteur sait avant de cliquer qu'il pourra y aller. */}
                  {p.url && (
                    <span
                      aria-label="Site en ligne"
                      title="Site en ligne"
                      className="text-[0.75rem] leading-none"
                    >
                      ↗
                    </span>
                  )}
                </span>

                <span className="col-span-4 mt-3 label text-right tabular-nums md:col-span-1 md:mt-0">
                  {p.year}
                </span>

                {/* L'état sous le titre : un lecteur doit savoir en un coup
                    d'œil si le projet tourne ou s'il cherche son financement. */}
                <span className="col-span-12 mt-2 block md:col-span-6 md:col-start-2 md:mt-1">
                  <Status project={p} />
                </span>

                {/* Sur mobile, pas de survol : l'aperçu est inline. */}
                <span className="col-span-12 mt-5 block md:hidden">
                  <span className="block h-[190px] w-full overflow-hidden">
                    <Cover project={p} inset={78} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <div className="wi-rule hairline origin-left" />
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

function Filter({
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
      aria-pressed={active}
      className={cn(
        "relative pb-1 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
        active ? "text-bone" : "text-fog hover:text-bone",
      )}
      style={active ? { color } : undefined}
    >
      {label}
      <sup className="ml-1.5 text-[0.5rem] text-steel">{pad(count, 2)}</sup>
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
