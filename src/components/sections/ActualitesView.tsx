"use client";

import Link from "next/link";
import { useState } from "react";

import { publications } from "@/content/actualites";
import { useCopy, useHref, useLang } from "@/hooks/useCopy";
import type { Lang } from "@/lib/lang";

/**
 * LES ACTUALITÉS — les publications, et la publication d'origine sur demande.
 *
 * Page statique, sans animation, comme les mentions légales : on vient y lire
 * quelque chose, pas y être impressionné.
 *
 * LE POINT QUI COMPTE : LE CADRE DU RÉSEAU NE SE CHARGE QU'AU CLIC.
 *
 * Un `<iframe>` Facebook posé dans la page appelle les serveurs de Facebook
 * dès l'ouverture, pour TOUS les visiteurs, et y dépose ses cookies — que
 * quelqu'un regarde la publication ou non. La page Confidentialité de ce site
 * promet qu'une seule partie du site collecte des données ; charger ce cadre
 * sans prévenir ferait de cette phrase un mensonge.
 *
 * On affiche donc notre propre visuel et le texte recopié, qui suffisent à
 * lire l'annonce, et le cadre d'origine derrière un bouton. Le visiteur
 * décide ; la promesse tient.
 */

const MOIS: Record<Lang, readonly string[]> = {
  fr: [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/**
 * Date lisible, écrite à la main et non par `toLocaleDateString`.
 *
 * La page est exportée en statique : le HTML est produit par Node au build,
 * puis réhydraté par le navigateur. Les deux n'ont pas forcément les mêmes
 * données de localisation, et une date rendue différemment des deux côtés
 * casse l'hydratation. Douze mots par langue coûtent moins qu'un bug qu'on ne
 * reproduit pas sur sa propre machine.
 */
function dateLisible(iso: string, lang: Lang) {
  const [a, m, j] = iso.split("-").map(Number);
  if (!a || !m || !j) return iso;
  const jour = lang === "fr" && j === 1 ? "1er" : String(j);
  return lang === "fr" ? `${jour} ${MOIS.fr[m - 1]} ${a}` : `${MOIS.en[m - 1]} ${j}, ${a}`;
}

export function ActualitesView() {
  const { actualites, ui } = useCopy();
  const lang = useLang();
  const href = useHref();
  /** L'identifiant de la publication dont le cadre a été demandé. */
  const [affichee, setAffichee] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1800px] gutter pb-32 pt-36 md:pb-40 md:pt-44">
      <p className="label">{actualites.kicker}</p>

      <h1 className="display mt-8 text-[clamp(2rem,7vw,6rem)] leading-[0.9] text-bone">
        {actualites.title}
      </h1>

      <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-relaxed text-bone/70">
        {actualites.lead}
      </p>

      <div className="hairline mt-12 md:mt-16" />

      {publications.length === 0 && <p className="mt-14 label">{actualites.empty}</p>}

      {publications.map((p) => (
        <article key={p.id} id={p.id} className="mt-14 border-t border-steel/40 pt-10 md:mt-20 md:pt-14">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-10">
            {/* — le visuel : le nôtre, il s'affiche sans rien demander à personne — */}
            {p.visuel && (
              <div className="md:col-span-4">
                <div className="relative aspect-square w-full overflow-hidden bg-carbon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.visuel.src}
                    alt={p.visuel.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className={p.visuel ? "md:col-span-8" : "md:col-span-12"}>
              <p className="flex flex-wrap items-baseline gap-x-4">
                <span className="label text-signal">{p.reseau}</span>
                <span className="label">{dateLisible(p.date, lang)}</span>
              </p>

              <h2 className="display mt-4 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.05] text-bone">
                {p.titre}
              </h2>

              <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-bone/80">
                {p.extrait.map((ligne, i) => (
                  <p key={i}>{ligne}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="hover"
                  className="font-mono text-[0.8125rem] text-bone/80 transition-colors duration-300 hover:text-signal"
                >
                  {actualites.seeOn} {p.reseau} ↗
                </a>

                {p.lien && (
                  <Link
                    href={href(p.lien)}
                    data-cursor="hover"
                    data-cursor-label={ui.view}
                    className="font-mono text-[0.8125rem] text-bone/80 transition-colors duration-300 hover:text-signal"
                  >
                    {actualites.moreLabel}
                  </Link>
                )}
              </div>

              {/* — la publication d'origine, seulement si on la demande — */}
              {p.embed && (
                <div className="mt-10 border-t border-steel/40 pt-8">
                  {affichee === p.id ? (
                    <iframe
                      src={p.embed}
                      title={`${p.reseau} — ${p.titre}`}
                      width={500}
                      height={720}
                      loading="lazy"
                      scrolling="no"
                      allowFullScreen
                      allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                      className="w-full max-w-[500px] border-0"
                      style={{ overflow: "hidden" }}
                    />
                  ) : (
                    <>
                      <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-bone/55">
                        {actualites.embedNotice}
                      </p>
                      <button
                        type="button"
                        onClick={() => setAffichee(p.id)}
                        data-cursor="hover"
                        className="label mt-5 inline-block border border-steel/60 px-5 py-3 text-bone transition-colors duration-300 hover:border-signal hover:text-signal"
                      >
                        {actualites.embedAction}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
