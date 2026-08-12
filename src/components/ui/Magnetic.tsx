"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  /** 0 → inerte, 1 → l'élément colle au pointeur. */
  strength?: number;
  /** Rayon d'attraction en px au-delà de la boîte de l'élément. */
  padding?: number;
};

/**
 * Magnétisme : l'élément se déplace vers le pointeur quand celui-ci approche,
 * puis revient avec une élasticité contenue. C'est la micro-interaction qui
 * fait qu'une cible « répond » avant même d'être atteinte.
 *
 * Le calcul est fait à partir du centre de la boîte, pas de sa position figée,
 * pour rester juste si la page a scrollé entre-temps.
 */
export function Magnetic({ children, strength = 0.4, padding = 24 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced || !window.matchMedia("(pointer: fine)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "elastic.out(1, 0.6)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "elastic.out(1, 0.6)" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        const inside =
          Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding;

        if (inside) {
          xTo(dx * strength);
          yTo(dy * strength);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { dependencies: [strength, padding, reduced] },
  );

  return cloneElement(children, { ref });
}
