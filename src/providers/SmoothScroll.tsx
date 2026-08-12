"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Lenis devient la source de vérité du scroll, et GSAP son horloge.
 *
 * Le point délicat : si Lenis et ScrollTrigger tournent sur deux rAF distincts,
 * les positions dérivent d'une frame et les éléments pinnés tremblent. On règle
 * ça en faisant tourner Lenis DANS le ticker GSAP et en poussant chaque scroll
 * vers `ScrollTrigger.update`.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return; // scroll natif, aucune inertie

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Sur mobile, l'inertie native est meilleure que toute émulation JS.
      syncTouch: false,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    // Publié pour que le menu et les galeries puissent défiler sans casser
    // l'inertie (voir `lib/scroll.ts`).
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  return <>{children}</>;
}
