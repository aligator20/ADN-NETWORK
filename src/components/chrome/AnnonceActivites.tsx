"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { activites } from "@/content/activites";
import { useCopy, useHref } from "@/hooks/useCopy";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * L'ANNONCE DES ACTIVITÉS — elle s'ouvre toute seule, à la demande de Sylvère.
 *
 * J'avais déconseillé l'ouverture automatique : Google déclasse les
 * interstitiels intrusifs sur mobile, et une fenêtre qui s'impose contredit la
 * sobriété qui fait la crédibilité du reste du site. Sylvère a confirmé après
 * cet avertissement ; c'est donc sa décision, et elle est tenue.
 *
 * Ce qui suit n'affaiblit pas la demande, ça la rend tenable :
 *
 * — UNE SEULE FOIS PAR VISITEUR. Une annonce qui revient à chaque page cesse
 *   d'être une annonce et devient un obstacle : on la ferme sans la lire, et
 *   au troisième passage on quitte le site. Le passage est noté dans le
 *   navigateur du visiteur.
 * — APRÈS LE PREMIER AFFICHAGE. Elle attend que la page soit peinte. Couvrir
 *   l'écran pendant le chargement dégrade la mesure que Google utilise
 *   précisément pour juger les interstitiels.
 * — ELLE SE FERME DE QUATRE FAÇONS : le bouton, le fond, Échap, et le clic
 *   sur une activité. Une fenêtre dont on cherche la sortie est une fenêtre
 *   qu'on quitte en fermant l'onglet.
 *
 * Pour la revoir pendant une mise au point : effacer la clé ci-dessous dans
 * les données du site, ou passer en navigation privée.
 */

/** Le passage du visiteur. Vide ou illisible : l'annonce s'affiche. */
const CLE = "adn-annonce-activites";

/** Le temps laissé à la page avant de la couvrir. */
const DELAI = 2600;

export function AnnonceActivites() {
  const { annonce } = useCopy();
  const href = useHref();
  const reduced = usePrefersReducedMotion();
  const [ouverte, setOuverte] = useState(false);

  useEffect(() => {
    let vue = false;
    try {
      vue = window.localStorage.getItem(CLE) === "vue";
    } catch {
      /* données de site bloquées : on affiche, sans pouvoir s'en souvenir */
    }
    if (vue) return;

    const t = window.setTimeout(() => setOuverte(true), DELAI);
    return () => window.clearTimeout(t);
  }, []);

  const fermer = () => {
    setOuverte(false);
    try {
      window.localStorage.setItem(CLE, "vue");
    } catch {
      /* idem : on ferme quand même */
    }
  };

  useEffect(() => {
    if (!ouverte) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouverte]);

  if (!ouverte) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={annonce.titre}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      {/* Le fond ferme au clic. Il est sous la carte, jamais au-dessus. */}
      <button
        type="button"
        aria-label={annonce.fermer}
        onClick={fermer}
        className="absolute inset-0 bg-void/90 backdrop-blur-sm"
      />

      <div
        className={cn(
          "relative mx-4 mb-4 w-full max-w-[720px] border border-steel bg-carbon sm:mb-0",
          !reduced && "animate-[annonce_.5s_cubic-bezier(.16,1,.3,1)_both]",
        )}
      >
        <div className="flex items-baseline justify-between gap-6 border-b border-steel/60 px-6 py-5 md:px-8">
          <p className="label text-signal">{annonce.kicker}</p>
          <button
            type="button"
            onClick={fermer}
            data-cursor="hover"
            className="label transition-colors duration-300 hover:text-bone"
          >
            {annonce.fermer} ✕
          </button>
        </div>

        <div className="px-6 py-7 md:px-8">
          <h2 className="display max-w-[20ch] text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.04] text-bone">
            {annonce.titre}
          </h2>
          <p className="mt-4 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.8] text-fog">
            {annonce.lead}
          </p>

          <ul className="mt-7 max-h-[46vh] overflow-y-auto">
            {activites.map((a) => {
              const dedans = (
                <>
                  <span
                    aria-hidden
                    className="mt-[0.45rem] block h-2 w-2 shrink-0"
                    style={{ background: a.teinte }}
                  />
                  <span>
                    <span className="block font-mono text-[0.875rem] leading-[1.5] text-bone">
                      {a.nom}
                      {!a.interne && (
                        <span aria-hidden className="ml-2 text-fog">
                          ↗
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block font-mono text-[0.75rem] leading-[1.6] text-fog">
                      {a.phrase}
                    </span>
                  </span>
                </>
              );
              const classe =
                "flex gap-4 border-b border-steel/40 py-4 transition-colors duration-300 hover:bg-graphite/60";
              return (
                <li key={a.id}>
                  {a.interne ? (
                    <Link
                      href={href(a.href)}
                      onClick={fermer}
                      data-cursor="hover"
                      className={classe}
                    >
                      {dedans}
                    </Link>
                  ) : (
                    <a
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={fermer}
                      data-cursor="hover"
                      className={classe}
                    >
                      {dedans}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={fermer}
            data-cursor="hover"
            className="mt-7 w-full border border-steel px-6 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-fog sm:w-auto"
          >
            {annonce.continuer}
          </button>
        </div>
      </div>
    </div>
  );
}
