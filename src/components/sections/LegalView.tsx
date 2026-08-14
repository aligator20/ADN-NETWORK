"use client";

import Link from "next/link";

import { useCopy, useLang } from "@/hooks/useCopy";
import { pathForLang } from "@/lib/lang";

/**
 * Page statique, sans animation — délibérément.
 *
 * Quelqu'un qui vient ici cherche une information précise, souvent parce qu'il
 * a un doute. Lui imposer un rideau et des révélations au scroll serait la pire
 * réponse possible. Le châssis du site reste, le reste s'efface.
 *
 * Le texte vit dans `content/legal.ts` — voir la note qui y figure sur les deux
 * champs restant à compléter (hébergeur et RCCM / IFU).
 */
export function LegalView() {
  const { legal, site } = useCopy();
  const lang = useLang();

  const sections = [
    {
      title: legal.editor.heading,
      rows: [
        [legal.editor.denomination, site.name],
        [legal.editor.publisher, site.owner.name],
        [legal.editor.capacity, site.owner.role],
        [legal.editor.address, `${site.base.city} — ${site.base.country}`],
        [legal.editor.contact, site.email],
        [legal.editor.registration, `RCCM / IFU — ${legal.toComplete.toLowerCase()}`],
      ],
    },
    {
      title: legal.hosting.heading,
      rows: [
        [legal.hosting.host, legal.toComplete],
        [legal.hosting.address, legal.toComplete],
        [legal.hosting.contact, legal.toComplete],
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1800px] gutter pb-32 pt-36 md:pb-40 md:pt-44">
      <p className="label">{legal.kicker}</p>

      <h1 className="display mt-8 text-[clamp(2rem,7vw,6rem)] leading-[0.9] text-bone">
        {legal.title}
      </h1>

      <div className="hairline mt-12 md:mt-16" />

      {/* — tableaux d'identification ————————————————————— */}
      {sections.map((s) => (
        <section key={s.title} className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-10">
            <h2 className="label md:col-span-3">{s.title}</h2>
            <dl className="md:col-span-9">
              {s.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-steel/40 py-4"
                >
                  <dt className="label w-full md:w-64 md:shrink-0">{k}</dt>
                  <dd className="font-mono text-[0.8125rem] text-bone/85">{v}</dd>
                </div>
              ))}
              <div className="border-t border-steel/40" />
            </dl>
          </div>
        </section>
      ))}

      {/* — clauses ————————————————————————————————————— */}
      {legal.paragraphs.map((p) => (
        <section key={p.title} className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-y-5 md:grid-cols-12 md:gap-x-10">
            <h2 className="label md:col-span-3">{p.title}</h2>
            <p className="max-w-[62ch] font-mono text-[0.8125rem] leading-[1.95] text-fog md:col-span-9">
              {p.body}
            </p>
          </div>
        </section>
      ))}

      <div className="hairline mt-16 md:mt-20" />

      <Link
        href={pathForLang("/", lang)}
        data-cursor="hover"
        className="label mt-8 inline-block transition-colors duration-300 hover:text-bone"
      >
        ← {legal.back}
      </Link>
    </div>
  );
}
