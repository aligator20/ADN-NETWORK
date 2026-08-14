"use client";

import { usePathname, useRouter } from "next/navigation";

import { LANG_KEY, LANGS, langFromPath, pathForLang, type Lang } from "@/lib/lang";
import { cn } from "@/lib/utils";

/**
 * SÉLECTEUR DE LANGUE
 *
 * Deux repères mono, `FR / EN`, dans le registre du reste du châssis. Pas de
 * drapeau : le français n'est pas la France, et l'anglais encore moins un pays.
 *
 * LE CLIC POSE UN TÉMOIN, ET C'EST LA PARTIE IMPORTANTE.
 *
 * La détection automatique vit dans une Edge Function Netlify, qui redirige les
 * visiteurs non francophones de `/` vers `/en`. Sans trace du choix manuel,
 * cette fonction renverrait vers l'anglais un anglophone venant de cliquer sur
 * « FR » — la détection écraserait la décision, ce qui est le défaut classique
 * de ce genre de dispositif. Le témoin `adn-lang` est donc lu au bord du réseau
 * AVANT toute déduction, et il gagne toujours.
 *
 * `max-age` d'un an, `SameSite=Lax`, aucune donnée personnelle : il ne contient
 * que « fr » ou « en ». Il est déclaré dans les mentions légales.
 */
export function LangSwitch({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const courante = langFromPath(pathname);

  const choisir = (lang: Lang) => {
    if (lang === courante) return;
    document.cookie = `${LANG_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(pathForLang(pathname, lang));
  };

  return (
    <div
      className={cn("flex items-baseline gap-1", className)}
      role="group"
      aria-label={courante === "fr" ? "Langue" : "Language"}
    >
      {LANGS.map((lang, i) => (
        <span key={lang} className="flex items-baseline gap-1">
          {i > 0 && (
            <span aria-hidden className="label text-steel">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => choisir(lang)}
            data-cursor="hover"
            lang={lang}
            aria-current={lang === courante ? "true" : undefined}
            className={cn(
              "label transition-colors duration-300",
              lang === courante ? "text-bone" : "text-steel hover:text-fog",
            )}
          >
            {lang.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
