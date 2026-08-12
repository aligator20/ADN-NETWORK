"use client";

import { useEffect, useRef } from "react";

export type PointerState = {
  /** Position normalisée dans le viewport, -1 → 1 (y inversé, repère WebGL). */
  nx: number;
  ny: number;
  /** Position en pixels. */
  x: number;
  y: number;
  /** L'utilisateur a-t-il déjà bougé le pointeur ? */
  active: boolean;
};

/**
 * Suit le pointeur dans une ref mutable — volontairement HORS du state React :
 * un `setState` par mousemove ferait re-rendre l'arbre 60 fois par seconde.
 * Les consommateurs lisent `ref.current` depuis leur propre boucle rAF.
 */
export function usePointer() {
  const pointer = useRef<PointerState>({
    nx: 0,
    ny: 0,
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const p = pointer.current;
      p.x = e.clientX;
      p.y = e.clientY;
      p.nx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      p.active = true;
    };

    const onLeave = () => {
      pointer.current.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return pointer;
}
