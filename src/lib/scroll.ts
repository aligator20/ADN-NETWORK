"use client";

import type Lenis from "lenis";

/**
 * Accès partagé à l'instance Lenis.
 *
 * Le scroll est piloté par Lenis : appeler `window.scrollTo` court-circuite son
 * inertie et produit un saut sec au milieu d'une page entièrement animée. Tout
 * déplacement programmé (ancres du menu, retour au début d'une galerie filtrée)
 * doit donc passer par ici.
 *
 * Un singleton de module plutôt qu'un contexte React : les appelants sont
 * souvent des callbacks GSAP ou des effets, pas des composants en cours de
 * rendu — et il n'y a jamais qu'un seul scroller.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

type ScrollTarget = number | string | HTMLElement;

/**
 * Défile vers une cible. Retombe sur le scroll natif si Lenis est absent
 * (mouvement réduit), pour que le comportement reste correct dans tous les cas.
 */
/** Position absolue d'une cible dans le document, en pixels. */
function resolveY(target: ScrollTarget): number | null {
  if (typeof target === "number") return target;
  const el =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function scrollTo(target: ScrollTarget, opts?: { immediate?: boolean }) {
  const lenis = getLenis();

  /* — Repositionnement immédiat (changement de route) ————————————
     On passe par le scroll natif plutôt que par Lenis. `lenis.scrollTo`
     calcule l'offset à partir de son scroll INTERNE, qui n'est synchronisé que
     dans sa boucle rAF — laquelle n'a pas encore tourné au moment où une route
     se monte. Viser une ancre par ce chemin atterrit à côté. On place donc la
     page nous-mêmes, puis on resynchronise Lenis sur la position obtenue. */
  if (opts?.immediate) {
    const y = resolveY(target);
    if (y === null) return;
    window.scrollTo(0, y);
    lenis?.scrollTo(y, { immediate: true, force: true });
    return;
  }

  if (lenis) {
    // `force` : sans lui, un scroll programmé est ignoré tant que Lenis est
    // arrêté — exactement le cas juste après la fermeture du menu.
    lenis.scrollTo(target, {
      force: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  // Mouvement réduit : Lenis n'existe pas, le scroll natif fait le travail.
  const y = resolveY(target);
  if (y !== null) window.scrollTo({ top: y, behavior: "smooth" });
}
