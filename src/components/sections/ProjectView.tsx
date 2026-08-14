"use client";

import Link from "next/link";
import { useRef } from "react";

import { Cover } from "@/components/ui/Cover";
import { Magnetic } from "@/components/ui/Magnetic";
import { Status } from "@/components/ui/Status";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { type Project } from "@/content/projects";
import { useCopy, useDisciplineName, useHref } from "@/hooks/useCopy";
import { disciplineColor } from "@/content/services";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * PAGE /work/[slug] — FICHE PROJET
 *
 * La couleur de la discipline structure toute la page : filet de tête, index,
 * teinte de la plaque. On sait de quel métier relève le projet avant d'avoir
 * lu une ligne — c'est le code couleur qui travaille, pas une décoration.
 *
 * La plaque monte en parallaxe pendant que le titre reste : ce décalage installe
 * la profondeur sans la moindre image.
 */
export function ProjectView({
  project,
  index,
  next,
}: {
  project: Project;
  index: number;
  next?: Project;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { site, ui } = useCopy();
  const href = useHref();
  const disciplineName = useDisciplineName();
  const color = disciplineColor[project.discipline];

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

      gsap.from(".pv-visit", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        scrollTrigger: { trigger: ".pv-visit", start: "top 88%" },
      });

      tl.from(".pv-reveal", {
        yPercent: 115,
        duration: DUR.slow,
        stagger: STAGGER.lines,
      })
        .from(".pv-rule", { scaleX: 0, duration: DUR.cinematic, ease: EASE.power }, 0.1)
        .from(
          ".pv-fade",
          { autoAlpha: 0, y: 22, duration: DUR.base, stagger: 0.1 },
          "-=1.2",
        );

      gsap.to(".pv-plate", {
        yPercent: -9,
        ease: "none",
        scrollTrigger: {
          trigger: ".pv-plate-wrap",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      <article className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        {/* — repère + retour ————————————————————————————— */}
        <div className="pv-fade flex items-baseline justify-between gap-6">
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="label" style={{ color }}>
              [{pad(index)}]
            </span>
            <span className="label">{disciplineName(project.discipline)}</span>
            {/* L'état est annoncé avant le titre : ce que le lecteur doit
                savoir en premier, c'est si le projet tourne ou s'il cherche. */}
            <Status project={project} />
          </p>
          <Link
            href={href("/work")}
            data-cursor="hover"
            className="label transition-colors duration-300 hover:text-bone"
          >
            ← {ui.backToWork}
          </Link>
        </div>

        {/* — titre ————————————————————————————————————— */}
        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="pv-reveal display block text-[clamp(2.5rem,9vw,8rem)] leading-[0.88] text-bone">
              {project.title}
            </span>
          </span>
        </h1>

        <div
          className="pv-rule mt-10 h-px w-full origin-left md:mt-14"
          style={{ background: color }}
        />

        {/* — chiffres clés ————————————————————————————————
            Placés AVANT la fiche technique et avant l'image : quelqu'un qui
            évalue le projet doit tomber dessus sans avoir à défiler. */}
        {project.figures && (
          <div className="pv-fade mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-10">
            {project.figures.map((f) => (
              <div key={f.label}>
                <div className="hairline" />
                <p
                  className="display mt-5 text-[clamp(1.75rem,4vw,3.25rem)] leading-none tabular-nums"
                  style={{ color }}
                >
                  {f.value}
                </p>
                <p className="label mt-3 leading-[1.7]">{f.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* — fiche technique : des lignes, pas un tableau encadré ——— */}
        <dl className="pv-fade mt-14 grid grid-cols-2 gap-y-8 md:mt-20 md:grid-cols-4 md:gap-x-10">
          <Field label="Année" value={String(project.year)} />
          <Field label="Discipline" value={disciplineName(project.discipline)} accent={color} />
          {project.client && <Field label="Client" value={project.client} />}
          {project.stack && (
            <Field label="Mise en œuvre" value={project.stack.join(" · ")} />
          )}
        </dl>
      </article>

      {/* — plaque en parallaxe ————————————————————————————
          La FENÊTRE porte la hauteur et coupe ; le CALQUE qui bouge est plus
          haut qu'elle (120 %) et débordé en haut de 10 %. Sans cette marge, un
          déplacement de -9 % découvrirait le vide en bas de la fenêtre : une
          couche de parallaxe doit toujours être plus grande que ce qui la
          montre. */}
      <div className="pv-plate-wrap relative mt-16 h-[46vh] overflow-hidden md:mt-24 md:h-[66vh]">
        <div className="pv-plate absolute inset-x-0 -top-[10%] h-[120%]">
          <Cover project={project} inset={68} />
        </div>
      </div>

      {/* — le propos ————————————————————————————————————— */}
      <article className="mx-auto max-w-[1800px] gutter py-24 md:py-32">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
          <p className="label md:col-span-3">{ui.theProject}</p>
          <div className="md:col-span-9">
            <p className="display max-w-[24ch] text-[clamp(1.35rem,3vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-bone">
              {project.summary}
            </p>

            {/* Le site en ligne. Rendu UNIQUEMENT si `url` est renseignée —
                un projet sans site public ne doit pas afficher un bouton mort.
                C'est la seule action de la fiche, elle porte donc la couleur
                de la discipline. */}
            {project.url && (
              <Magnetic strength={0.3}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  className="pv-visit group mt-12 inline-flex items-center gap-5 md:mt-16"
                >
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ease-expo md:h-16 md:w-16"
                    style={{ borderColor: color }}
                  >
                    <span
                      aria-hidden
                      className="block text-lg transition-transform duration-500 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{ color }}
                    >
                      ↗
                    </span>
                  </span>
                  <span>
                    <span className="label block">{ui.liveSite}</span>
                    <span className="display mt-2 block text-[clamp(1.15rem,2.4vw,2rem)] leading-none text-bone">
                      {ui.visitSite}
                    </span>
                  </span>
                </a>
              </Magnetic>
            )}
          </div>
        </div>
      </article>

      {/* — l'opportunité ————————————————————————————————
          Distinct du dossier technique : ici on ne dit pas ce que le projet
          fait, on dit pourquoi il mérite du capital ou du temps. Marché, écart,
          modèle, besoin — dans cet ordre, parce que c'est l'ordre dans lequel
          un investisseur se pose les questions. */}
      {project.opportunity && (
        <article className="border-y border-steel/40 bg-carbon">
          <div className="mx-auto max-w-[1800px] gutter py-20 md:py-28">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
              <div className="md:col-span-3">
                <p className="label" style={{ color }}>
                  L&apos;opportunité
                </p>
                <p className="label mt-4 max-w-[24ch] leading-[1.8] text-steel">
                  Chiffres issus du plan d&apos;affaires du projet.
                </p>
              </div>

              <div className="md:col-span-9">
                {project.opportunity.map((o, i) => (
                  <div key={o.title} className="pv-block">
                    <div className="hairline" />
                    <div className="grid grid-cols-12 gap-x-4 py-7 md:gap-x-10 md:py-9">
                      <span className="col-span-2 label md:col-span-1">
                        {pad(i + 1, 2)}
                      </span>
                      <h2 className="display col-span-10 text-[clamp(1.1rem,2vw,1.75rem)] leading-[1.05] text-bone md:col-span-4">
                        {o.title}
                      </h2>
                      <p className="col-span-12 mt-4 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.9] text-fog md:col-span-7 md:mt-0">
                        {o.body}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="hairline" />
              </div>
            </div>
          </div>
        </article>
      )}

      {/* — le dossier détaillé ————————————————————————————
          Sections numérotées séparées par des filets, jamais encadrées : la
          fiche reste une lecture, pas un formulaire. Le lecteur en survole
          trois et s'arrête sur celle qui le concerne. */}
      {project.detail && (
        <article className="mx-auto max-w-[1800px] gutter pb-24 md:pb-32">
          <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
            <p className="label md:col-span-3">{ui.theFile}</p>

            <div className="md:col-span-9">
              {project.detail.map((s, i) => (
                <div key={s.title} className="pv-block">
                  <div className="hairline" />
                  <div className="grid grid-cols-12 gap-x-4 py-8 md:gap-x-10 md:py-10">
                    <span
                      className="col-span-2 label md:col-span-1"
                      style={{ color }}
                    >
                      {pad(i + 1, 2)}
                    </span>
                    <h2 className="display col-span-10 text-[clamp(1.1rem,2vw,1.75rem)] leading-[1.05] text-bone md:col-span-4">
                      {s.title}
                    </h2>
                    <p className="col-span-12 mt-4 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.9] text-fog md:col-span-7 md:mt-0">
                      {s.body}
                    </p>
                  </div>
                </div>
              ))}
              <div className="hairline" />
            </div>
          </div>
        </article>
      )}

      {/* — support ————————————————————————————————————————
          La fiche ne dit jamais tout : elle donne assez pour décider d'écrire.
          C'est le support qui transmet le dossier complet. */}
      <article className="border-t border-steel/40">
        <div className="mx-auto max-w-[1800px] gutter py-20 md:py-24">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-10">
            <p className="label md:col-span-3">{ui.supportTitle}</p>
            <div className="md:col-span-9">
              <p className="display max-w-[38ch] text-[clamp(1.15rem,2.2vw,1.9rem)] leading-[1.2] text-bone">
                {ui.supportBody}
              </p>
              <Magnetic strength={0.28}>
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent(
                    `${project.title} — demande d'informations`,
                  )}`}
                  data-cursor="hover"
                  className="group mt-10 inline-flex items-center gap-4"
                >
                  <span className="display text-[clamp(1.15rem,2.4vw,2rem)] leading-none text-bone transition-colors duration-300 group-hover:text-signal">
                    {ui.supportAction}
                  </span>
                  <span
                    aria-hidden
                    className="block h-px w-10 bg-signal transition-all duration-500 ease-expo group-hover:w-16"
                  />
                </a>
              </Magnetic>
              <p className="label mt-5">{site.email}</p>
              <Whatsapp
                message={`Bonjour, je souhaite en savoir plus sur le projet ${project.title}.`}
                label="Ou sur WhatsApp"
                showNumber
                className="mt-7"
              />
            </div>
          </div>
        </div>
      </article>

      {/* — projet suivant : la fiche ne se termine jamais sur du vide — */}
      {next && (
        <div className="border-t border-steel/40">
          <Magnetic strength={0.16}>
            <Link
              href={href(`/work/${next.slug}`)}
              data-cursor="hover"
              data-cursor-label={ui.view}
              className="group mx-auto flex max-w-[1800px] flex-col gutter py-20 md:py-28"
            >
              <span className="label">{ui.nextProject}</span>
              <span className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <span className="display text-[clamp(2rem,7vw,6rem)] leading-[0.9] text-bone transition-transform duration-700 ease-expo md:group-hover:translate-x-5">
                  {next.title}
                </span>
                <span
                  className="font-mono text-[0.625rem] uppercase tracking-[0.28em]"
                  style={{ color: disciplineColor[next.discipline] }}
                >
                  {disciplineName(next.discipline)}
                </span>
              </span>
            </Link>
          </Magnetic>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd
        className="mt-3 font-mono text-[0.8125rem] leading-relaxed text-bone/85"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
