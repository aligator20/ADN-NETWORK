"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cssVar, withAlpha } from "@/lib/utils";

/**
 * Curseur en deux corps :
 *  - un POINT qui colle au pointeur (retour immédiat, aucune latence perçue)
 *  - un ANNEAU en retard (lerp doux) qui donne le poids et l'inertie
 *
 * Le morph est piloté par l'attribut `data-cursor` posé sur n'importe quel
 * élément de la page — les composants n'ont donc jamais à connaître le curseur.
 *   data-cursor="hover"  → anneau agrandi, accent signal
 *   data-cursor="drag"   → anneau plein + libellé
 *   data-cursor-label    → texte affiché au centre
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // Pointeur grossier (tactile) ou mouvement réduit → curseur natif.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    document.documentElement.dataset.cursorEnabled = "true";

    // Tokens résolus une fois : GSAP tweene des couleurs, pas des expressions.
    const SIGNAL = cssVar("--color-signal", "#c6f24e");
    const BONE = cssVar("--color-bone", "#ececee");
    const RING_IDLE = withAlpha(BONE, 0.45);
    const TRANSPARENT = withAlpha(BONE, 0);

    // Le centrage passe par GSAP (xPercent), pas par CSS : GSAP réécrit la
    // propriété `transform` entière, un translate en classe serait écrasé.
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 });

    // quickTo = setter interpolé réutilisable : bien moins coûteux qu'un
    // gsap.to() recréé à chaque mousemove.
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    const onLeave = () => {
      visible = false;
      gsap.to([ring, dot], { autoAlpha: 0, duration: 0.2 });
    };

    /* — Morph selon la cible survolée ————————————————————————— */
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      const mode = target?.dataset.cursor ?? "default";
      const text = target?.dataset.cursorLabel ?? "";

      label.textContent = text;

      switch (mode) {
        case "hover":
          gsap.to(ring, {
            width: 64,
            height: 64,
            borderColor: SIGNAL,
            backgroundColor: TRANSPARENT,
            duration: 0.4,
            ease: "expo.out",
          });
          gsap.to(dot, { scale: 0, duration: 0.3 });
          break;

        case "drag":
          gsap.to(ring, {
            width: 92,
            height: 92,
            borderColor: TRANSPARENT,
            backgroundColor: withAlpha(SIGNAL, 0.92),
            duration: 0.45,
            ease: "expo.out",
          });
          gsap.to(dot, { scale: 0, duration: 0.3 });
          break;

        default:
          gsap.to(ring, {
            width: 30,
            height: 30,
            borderColor: RING_IDLE,
            backgroundColor: TRANSPARENT,
            duration: 0.4,
            ease: "expo.out",
          });
          gsap.to(dot, { scale: 1, duration: 0.3 });
      }

      gsap.to(label, { autoAlpha: text ? 1 : 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.cursorEnabled;
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={ringRef}
        className="invisible absolute left-0 top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-bone/45 opacity-0 will-change-transform"
      >
        <span
          ref={labelRef}
          className="pointer-events-none select-none font-mono text-[9px] uppercase tracking-[0.2em] text-void opacity-0"
        />
      </div>

      <div
        ref={dotRef}
        className="invisible absolute left-0 top-0 h-[4px] w-[4px] rounded-full bg-signal opacity-0 will-change-transform"
      />
    </div>
  );
}
