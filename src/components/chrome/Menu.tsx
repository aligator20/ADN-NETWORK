"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { LangSwitch } from "@/components/chrome/LangSwitch";
import { disciplineColor } from "@/content/services";
import { type NavItem } from "@/content/site";
import { useCopy } from "@/hooks/useCopy";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { getLenis, scrollTo } from "@/lib/scroll";
import { pad } from "@/lib/utils";
import { useAppState } from "@/providers/app-context";

/**
 * MENU PLEIN ÉCRAN
 *
 * Seul endroit du site où Framer Motion est employé, et c'est exactement son
 * emploi : un élément monté puis démonté, dont la sortie doit être attendue
 * avant le démontage. GSAP sait le faire, mais au prix d'un état de sortie géré
 * à la main — `AnimatePresence` l'exprime en trois lignes.
 *
 * Le panneau ne se fond pas : il se DÉCOUPE (`clip-path`), du haut vers le bas
 * à l'ouverture, du bas vers le haut à la fermeture. Une coupe, jamais un
 * fondu — c'est la grammaire posée par le préloader.
 *
 * Empilement : sous le grain (z-40) et sous le HUD (z-50), pour que le châssis
 * et la texture restent au-dessus. Le menu s'ouvre DANS l'instrument, il ne le
 * remplace pas.
 */
const PANEL = {
  hidden: { clipPath: "inset(0% 0% 100% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.85, ease: [0.65, 0.05, 0, 1] as const },
  },
  exit: {
    clipPath: "inset(100% 0% 0% 0%)",
    transition: { duration: 0.65, ease: [0.65, 0.05, 0, 1] as const },
  },
};

const LIST = {
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.22 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const ITEM = {
  hidden: { yPercent: 115 },
  visible: {
    yPercent: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { yPercent: 115, transition: { duration: 0.4, ease: "easeIn" as const } },
};

const FADE = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export function Menu() {
  const { menuOpen, closeMenu } = useAppState();
  const { nav, services, site, ui } = useCopy();
  const pathname = usePathname();
  const router = useRouter();

  /* — Le scroll est gelé tant que le menu est ouvert ——————————————
     On coupe Lenis en plus du verrou CSS : sans ça, la molette continue de
     faire avancer son inertie interne, et la page a bougé quand on referme. */
  useEffect(() => {
    if (!menuOpen) return;

    const lenis = getLenis();
    lenis?.stop();
    document.body.dataset.locked = "true";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.dataset.locked = "false";
      lenis?.start();
    };
  }, [menuOpen, closeMenu]);

  /**
   * Deux destinations possibles, une seule interaction.
   *
   * Ancre ET déjà sur la bonne page → Lenis, pour garder l'inertie du site.
   * Sinon → navigation Next, l'ancre étant reportée dans l'URL pour que la
   * page d'arrivée sache où se placer.
   */
  const goTo = (item: NavItem) => {
    closeMenu();
    // On laisse la sortie du panneau se jouer avant de déplacer la page, sinon
    // le lecteur voit défiler le site à travers le menu qui se referme.
    window.setTimeout(() => {
      if (item.anchor && pathname === item.href) {
        scrollTo(`#${item.anchor}`);
      } else {
        router.push(item.anchor ? `${item.href}#${item.anchor}` : item.href);
      }
    }, 520);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="menu"
          variants={PANEL}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[35] bg-carbon"
          role="dialog"
          aria-modal="true"
          aria-label={ui.navigation}
        >
          <div className="mx-auto flex h-full max-w-[1800px] flex-col justify-center gutter pb-28 pt-28 md:pb-32 md:pt-32">
            <motion.p
              variants={FADE}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="label mb-8 md:mb-10"
            >
              {ui.navigation} — {pad(nav.length, 2)}
            </motion.p>

            <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
              {/* — les séquences ————————————————————————— */}
              <motion.nav
                variants={LIST}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:col-span-8"
              >
                <ul>
                  {nav.map((item, i) => {
                    const current =
                      pathname === item.href && (!item.anchor || pathname === "/");
                    return (
                      <li key={item.label} className="border-t border-steel/40">
                        <button
                          type="button"
                          onClick={() => goTo(item)}
                          data-cursor="hover"
                          aria-current={
                            pathname === item.href && !item.anchor ? "page" : undefined
                          }
                          className="menu-item group flex w-full items-baseline gap-5 py-3 text-left md:gap-8 md:py-4"
                        >
                          <span className="mask">
                            <motion.span
                              variants={ITEM}
                              className="label block transition-colors duration-300 group-hover:text-signal"
                            >
                              {pad(i + 1)}
                            </motion.span>
                          </span>
                          <span className="mask">
                            <motion.span
                              variants={ITEM}
                              className="display block text-[clamp(2rem,6.5vw,5rem)] leading-none text-bone transition-transform duration-500 ease-expo group-hover:translate-x-3"
                            >
                              {item.label}
                            </motion.span>
                          </span>
                          {/* Une page dédiée est signalée : le lecteur sait
                              qu'il quitte la page d'accueil. */}
                          {!item.anchor && (
                            <span className="mask">
                              <motion.span
                                variants={ITEM}
                                className="label block text-steel"
                              >
                                {current ? "●" : "↗"}
                              </motion.span>
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                  <li className="border-t border-steel/40" />
                </ul>
              </motion.nav>

              {/* — colonne d'information ————————————————— */}
              <motion.div
                variants={FADE}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-10 md:col-span-4 md:items-end md:text-right"
              >
                <div>
                  {/* Le sélecteur est aussi ici : le menu plein écran couvre le HUD,
                      et c'est le seul endroit atteignable une fois ouvert. */}
                  <LangSwitch className="mb-8 md:justify-end" />
                  <p className="label">{ui.contactLabel}</p>
                  <a
                    href={`mailto:${site.email}`}
                    data-cursor="hover"
                    className="mt-3 block font-mono text-[0.875rem] text-bone transition-colors duration-300 hover:text-signal"
                  >
                    {site.email}
                  </a>
                  <Whatsapp
                    message={`Bonjour, je vous contacte depuis le site ${site.name}.`}
                    label="WhatsApp"
                    className="mt-5 md:flex-row-reverse"
                  />
                  <p className="label mt-4 leading-[1.9]">
                    {site.base.city.toUpperCase()} — {site.base.country}
                    <br />
                    <span className="text-steel">{site.base.coords}</span>
                  </p>
                </div>

                <div>
                  <p className="label">{ui.followLabel}</p>
                  {/* Même repli que la séquence 006 : sans `url`, un libellé
                      simple plutôt qu'un lien mort. */}
                  {site.socials.map((s) =>
                    s.url ? (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-cursor="hover"
                        className="mt-3 block font-mono text-[0.875rem] text-bone/80 transition-colors duration-300 hover:text-signal"
                      >
                        {s.label} — {s.handle} ↗
                      </a>
                    ) : (
                      <p
                        key={s.label}
                        className="mt-3 font-mono text-[0.875rem] text-bone/80"
                      >
                        {s.label} — {s.handle}
                      </p>
                    ),
                  )}
                </div>

                {/* Le code couleur de la marque, rappelé en pied de menu :
                    sept points, sept disciplines. */}
                <div>
                  <p className="label">{pad(services.length, 2)} disciplines</p>
                  <ul className="mt-4 flex flex-wrap gap-2 md:justify-end">
                    {services.map((s) => (
                      <li
                        key={s.id}
                        title={s.name}
                        className="h-1.5 w-8 rounded-full"
                        style={{ background: disciplineColor[s.id] }}
                      />
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
