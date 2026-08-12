"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Cursor } from "@/components/chrome/Cursor";
import { Grain } from "@/components/chrome/Grain";
import { GridOverlay } from "@/components/chrome/GridOverlay";
import { Header } from "@/components/chrome/Header";
import { Menu } from "@/components/chrome/Menu";
import { Preloader } from "@/components/chrome/Preloader";
import { RouteTransition } from "@/components/chrome/RouteTransition";
import { StatusBar } from "@/components/chrome/StatusBar";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollTo } from "@/lib/scroll";
import { AppContext } from "@/providers/app-context";
import { SmoothScroll } from "@/providers/SmoothScroll";

/**
 * Châssis persistant : tout ce qui ne scrolle jamais.
 * L'ordre de rendu fixe l'empilement — le contenu au fond (z-0), la grille et
 * le grain par-dessus, le HUD au-dessus encore, le curseur tout en haut.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const markReady = useCallback(() => setReady(true), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const value = useMemo(
    () => ({ ready, markReady, menuOpen, toggleMenu, closeMenu }),
    [ready, markReady, menuOpen, toggleMenu, closeMenu],
  );

  // Le retrait du rideau déverrouille le scroll et laisse les polices arriver :
  // toutes les mesures prises pendant le préchargement sont à refaire.
  useEffect(() => {
    if (!ready) return;
    ScrollTrigger.refresh();
  }, [ready]);

  /* — Changement de route ————————————————————————————————————
     Next conserve la position de scroll, et Lenis garde la sienne : sans
     reprise en main, arriver sur /work vous dépose au milieu de la page.
     Un hash dans l'URL (venu du menu) l'emporte sur le retour en haut. */
  const pathname = usePathname();
  useEffect(() => {
    const hash = window.location.hash;

    ScrollTrigger.refresh();

    if (!hash) {
      scrollTo(0, { immediate: true });
      return;
    }

    /* — Viser une ancre, et VÉRIFIER qu'on y est ————————————————
       Une ancre est inatteignable tant que la page est plus courte qu'elle : le
       navigateur écrête silencieusement le scroll à `scrollHeight - innerHeight`.
       On atterrit trop haut, sans la moindre erreur — c'est le piège.

       Or au montage d'une route le document est encore court : les pins de
       ScrollTrigger n'ont pas ajouté leur hauteur, la piste horizontale n'est
       pas dimensionnée, les polices arrivent. Chaque remesure le rallonge.

       On ne peut donc pas viser une fois et espérer. On vise, on CONTRÔLE, et
       on recommence tant que l'écart persiste — borné, et interrompu dès que la
       cible est atteinte. Volontairement sur `setTimeout` et non `rAF` : c'est
       aussi le chemin qui doit tenir quand la page n'anime pas encore. */
    let attempts = 0;
    let timer = 0;

    const aim = () => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      const y = target.getBoundingClientRect().top + window.scrollY;
      scrollTo(target, { immediate: true });

      const reached = Math.abs(window.scrollY - y) < 2;
      if (!reached && ++attempts < 8) {
        timer = window.setTimeout(aim, 120);
      }
    };

    aim();
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <AppContext.Provider value={value}>
      <SmoothScroll>
        {/* — contenu scrollé ——————————————————————————————— */}
        <main id="content" className="relative z-0">
          {children}
        </main>

        {/* — chrome fixe ———————————————————————————————————— */}
        <GridOverlay />
        <RouteTransition />
        <Menu />
        <Grain />
        <Header />
        <StatusBar />
        <Cursor />
        <Preloader onComplete={markReady} />
      </SmoothScroll>
    </AppContext.Provider>
  );
}
