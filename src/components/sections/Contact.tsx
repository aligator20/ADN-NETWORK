"use client";

import Link from "next/link";
import { useRef } from "react";

import { Magnetic } from "@/components/ui/Magnetic";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { contact, sequences, site, ui } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pad } from "@/lib/utils";

/**
 * SÉQUENCE 006 — APPEL FINAL
 *
 * La dernière page doit faire une seule chose : donner envie d'écrire. Tout y
 * est donc soustrait sauf la phrase et l'adresse.
 *
 * La phrase se remplit mot à mot au scroll, comme le manifeste : le lecteur
 * arrive au bas du site en ayant produit lui-même la montée en intensité.
 * L'adresse est magnétique — elle vient au curseur avant d'être atteinte.
 */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      ref={root}
      id="contact"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-x-clip border-t border-steel/40 bg-void pb-24 pt-32 md:pb-28 md:pt-40"
    >
      <ContactMotion root={root} reduced={reduced} />

      <div className="mx-auto w-full max-w-[1800px] gutter">
        <div className="flex items-baseline justify-between gap-6">
          <p className="flex items-baseline gap-4">
            <span className="label text-signal">[{pad(7)}]</span>
            <span className="label">{sequences[6].label}</span>
          </p>
          <p className="label hidden md:block">{contact.lead}</p>
        </div>
      </div>

      {/* — l'appel ————————————————————————————————————— */}
      <div className="mx-auto w-full max-w-[1800px] gutter py-16">
        <h2 className="cta-line display text-[clamp(2.5rem,10.5vw,11rem)] leading-[0.86] text-bone [text-wrap:balance]">
          {site.cta.split(" ").map((w, i) => (
            <span key={i}>
              <span className="cta-word inline-block">{w}</span>{" "}
            </span>
          ))}
        </h2>

        <div className="cta-rule hairline mt-12 origin-left md:mt-16" />

        {/* adresse : la seule action de la page */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <Magnetic strength={0.28}>
            <a
              href={`mailto:${site.email}`}
              data-cursor="hover"
              data-cursor-label={ui.view}
              className="cta-fade group inline-block"
            >
              <span className="label block">{contact.action}</span>
              <span className="display mt-3 block text-[clamp(1.35rem,3.6vw,3rem)] leading-none text-bone transition-colors duration-300 group-hover:text-signal">
                {site.email}
              </span>
              <span className="mt-3 block h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 ease-expo group-hover:scale-x-100" />
            </a>
          </Magnetic>

          {/* WhatsApp à côté de l'email : sur téléphone, c'est le canal que
              le visiteur ouvrira réellement. */}
          <div className="cta-fade">
            <p className="label">Réponse rapide</p>
            <Whatsapp
              message={`Bonjour, je vous contacte depuis le site ${site.name}.`}
              label="Écrire sur WhatsApp"
              showNumber
              className="mt-4"
            />
          </div>

          {/* réseaux — `url` vide → libellé simple, jamais un lien mort */}
          <div className="cta-fade">
            <p className="label">{ui.followLabel}</p>
            <ul className="mt-3 space-y-1">
              {site.socials.map((s) =>
                s.url ? (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="hover"
                      className="font-mono text-[0.8125rem] text-bone/80 transition-colors duration-300 hover:text-signal"
                    >
                      {s.label} — {s.handle} ↗
                    </a>
                  </li>
                ) : (
                  <li
                    key={s.label}
                    className="font-mono text-[0.8125rem] text-bone/80"
                  >
                    {s.label} — {s.handle}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* — pied ————————————————————————————————————————— */}
      <div className="mx-auto w-full max-w-[1800px] gutter">
        <div className="hairline" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <p className="label">
            © {site.founded} {site.name} — {ui.allRights}
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href="/mentions-legales"
              data-cursor="hover"
              className="label transition-colors duration-300 hover:text-bone"
            >
              Mentions légales
            </Link>
            <p className="label">{site.owner.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Les animations sont isolées dans un composant frère pour que la section reste
 * lisible : le balisage d'un CTA doit tenir sur un écran.
 */
function ContactMotion({
  root,
  reduced,
}: {
  root: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  useGSAP(
    () => {
      if (reduced) return;

      gsap.fromTo(
        ".cta-word",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: ".cta-line",
            start: "top 85%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        },
      );

      gsap.from(".cta-rule", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        scrollTrigger: { trigger: ".cta-rule", start: "top 92%" },
      });

      gsap.from(".cta-fade", {
        autoAlpha: 0,
        y: 24,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: 0.14,
        scrollTrigger: { trigger: ".cta-rule", start: "top 92%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return null;
}
