"use client";

import { useRef, useState } from "react";

import { Magnetic } from "@/components/ui/Magnetic";
import { community } from "@/content/community";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, pad } from "@/lib/utils";

/**
 * PAGE /reseau — LA COMMUNAUTÉ
 *
 * Le formulaire ne poste rien : il compose un email que le candidat envoie
 * lui-même. C'est un choix, pas un pis-aller — le site reste entièrement
 * statique, aucune donnée personnelle ne transite par un serveur tiers, et il
 * n'y a aucune base à sécuriser. Le jour où le volume l'exigera, on branchera
 * un vrai backend ; d'ici là, ce serait une dette pour rien.
 */
export function CommunityView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [role, setRole] = useState<string>(community.roles[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");

  const selected = community.roles.find((r) => r.id === role) ?? community.roles[0];
  const complete = name.trim() !== "" && email.trim() !== "";

  const mailto = () => {
    const subject = `Le Réseau — ${selected.title} — ${name.trim()}`;
    const body = [
      `Rôle : ${selected.title}`,
      `Nom : ${name.trim()}`,
      `Email : ${email.trim()}`,
      "",
      "Projet / apport :",
      project.trim() || "(à compléter)",
    ].join("\n");
    return `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

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
          <p className="label">Ouvert — sans frais d&apos;entrée</p>
        </div>

        <h1 className="mt-10 md:mt-14">
          <span className="mask block">
            <span className="rz-reveal display block text-[clamp(2.5rem,9vw,8rem)] leading-[0.88] text-bone">
              Le Réseau
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
        <p className="label">Trois rôles, une seule table</p>
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
          <p className="label">Comment ça marche</p>
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
            <p className="label">Ce que Le Réseau n&apos;est pas</p>
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
                Aucune donnée n&apos;est envoyée à un serveur.
                <br />
                <span className="text-steel">
                  Ce formulaire prépare un email que vous envoyez vous-même.
                </span>
              </p>
            </div>

            <form
              className="md:col-span-8"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailto();
              }}
            >
              {/* rôle */}
              <fieldset>
                <legend className="label">Je rejoins en tant que</legend>
                <div className="mt-5 flex flex-wrap gap-3">
                  {community.roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      data-cursor="hover"
                      onClick={() => setRole(r.id)}
                      aria-pressed={role === r.id}
                      className={cn(
                        "border px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
                        role === r.id
                          ? "border-transparent text-void"
                          : "border-steel text-fog hover:text-bone",
                      )}
                      style={role === r.id ? { background: r.color } : undefined}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <Field label="Nom" value={name} onChange={setName} required />
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
              </div>

              <div className="mt-8">
                <label className="label block" htmlFor="rz-project">
                  Votre projet, ou ce que vous apportez
                </label>
                <textarea
                  id="rz-project"
                  rows={5}
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="mt-4 w-full resize-none border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 placeholder:text-steel focus:border-signal"
                  placeholder="Le problème, où vous en êtes, ce qui vous manque."
                />
              </div>

              <Magnetic strength={0.25}>
                <button
                  type="submit"
                  disabled={!complete}
                  data-cursor="hover"
                  className="group mt-12 inline-flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <span className="display text-[clamp(1.15rem,2.4vw,2rem)] leading-none text-bone transition-colors duration-300 group-enabled:group-hover:text-signal">
                    {community.cta.action}
                  </span>
                  <span
                    aria-hidden
                    className="block h-px w-10 bg-signal transition-all duration-500 ease-expo group-enabled:group-hover:w-16"
                  />
                </button>
              </Magnetic>

              {!complete && (
                <p className="label mt-4 text-steel">
                  Nom et email sont nécessaires pour vous répondre.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

/** Champ à filet, sans boîte : la même grammaire que le reste du site. */
function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = `rz-${label.toLowerCase()}`;
  return (
    <div>
      <label className="label block" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-signal">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 w-full border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 focus:border-signal"
      />
    </div>
  );
}
