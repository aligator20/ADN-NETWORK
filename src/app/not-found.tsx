import Link from "next/link";

import "./globals.css";
import { fontVariables } from "@/app/shell";

/**
 * PAGE 404
 *
 * Elle porte son propre `<html>`, et c'est obligatoire : le site a deux layouts
 * racines — `(fr)` et `(en)` — et une page servie pour une URL INCONNUE
 * n'appartient par définition à aucun des deux. Next ne peut donc lui en
 * appliquer aucun.
 *
 * BILINGUE, ET SANS DÉTECTION. Elle est servie par Netlify pour tout chemin non
 * résolu, hors du routage du site : elle ne sait pas si le lien cassé pointait
 * vers le français ou l'anglais. Deviner d'après l'en-tête du navigateur
 * donnerait faux à un anglophone qui suivait un lien français. Afficher les deux
 * est plus court que se tromper, et offre au visiteur les deux portes de sortie.
 *
 * PAS D'`AppShell` ICI. Le préloader, le curseur personnalisé, GSAP et le champ
 * de particules sont une mise en scène d'arrivée. Quelqu'un qui atterrit sur une
 * erreur veut repartir, pas assister à une ouverture de rideau — et lui faire
 * télécharger trois cents kilo-octets de motion pour lui dire « cette page
 * n'existe pas » serait une faute de goût autant que de performance.
 */
export const metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

const SORTIES = [
  { href: "/", label: "Retour à l'accueil", lang: "fr" },
  { href: "/en", label: "Back to home", lang: "en" },
];

export default function NotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="bg-void text-bone antialiased">
        <main className="mx-auto flex min-h-screen max-w-[1800px] flex-col justify-center gutter py-24">
          <p className="label text-signal">[404]</p>

          <h1 className="display mt-8 text-[clamp(3rem,14vw,11rem)] leading-[0.85] tracking-[-0.04em]">
            Page
            <br />
            introuvable
          </h1>

          <div className="hairline mt-12 max-w-[42rem] md:mt-16" />

          <div className="mt-10 grid max-w-[52rem] gap-8 md:grid-cols-2 md:gap-12">
            <p
              lang="fr"
              className="font-mono text-[0.8125rem] leading-[1.9] text-fog"
            >
              Cette adresse ne correspond à aucune page. Le lien que vous avez suivi
              est peut-être ancien, ou la page a changé de nom.
            </p>
            <p
              lang="en"
              className="font-mono text-[0.8125rem] leading-[1.9] text-fog"
            >
              This address matches no page. The link you followed may be old, or the
              page may have been renamed.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 md:mt-20">
            {SORTIES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                lang={s.lang}
                data-cursor="hover"
                className="group inline-flex items-center gap-4"
              >
                <span className="display text-[clamp(1.15rem,2.4vw,1.75rem)] leading-none transition-colors duration-300 group-hover:text-signal">
                  ← {s.label}
                </span>
                <span
                  aria-hidden
                  className="block h-px w-8 bg-signal transition-all duration-500 ease-expo group-hover:w-14"
                />
              </Link>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
