"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { site, ui } from "@/content/site";
import { pad } from "@/lib/utils";

/**
 * Séquence d'ouverture.
 *
 * Trois mouvements :
 *   1. le compteur monte de 000 à 100 pendant que la hairline se remplit
 *   2. le compteur et le label sortent par le haut, masqués
 *   3. le rideau se retire par le bas en `clip-path` — pas un fondu : une coupe
 *
 * `onComplete` libère la timeline du Hero. Le scroll reste verrouillé
 * jusqu'au retrait complet du rideau.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      document.body.dataset.locked = "true";

      const finish = () => {
        document.body.dataset.locked = "false";
        setDone(true);
        onComplete();
      };

      if (reduced) {
        setCount(100);
        gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        return;
      }

      const counter = { value: 0 };

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.to(counter, {
        value: 100,
        duration: 2.1,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.round(counter.value)),
      })
        .to(".pre-progress", { scaleX: 1, duration: 2.1, ease: "power2.inOut" }, 0)
        // Le compteur ET le mot sortent par le haut, coupés par leur masque.
        .to(
          ".pre-out .mask > span",
          { yPercent: -110, duration: 0.7, stagger: 0.05, ease: "power4.in" },
          "+=0.15",
        )
        .to(".pre-progress-track", { scaleX: 0, duration: 0.5, ease: "power3.in" }, "<")
        // Le rideau se retire vers le haut : coupe franche, pas de fondu.
        .to(
          root.current,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1.05,
            ease: "expo.inOut",
            onComplete: finish,
          },
          "-=0.15",
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-void gutter py-6 md:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* — haut : identité minimale ————————————————————————— */}
      <div className="flex items-baseline justify-between">
        <span className="label text-bone">{site.name}</span>
        <span className="label">
          {ui.since} {site.founded}
        </span>
      </div>

      {/* — centre : la barre de chargement, seule ————————————— */}
      <div className="pre-progress-track mx-auto h-px w-full max-w-[520px] origin-left bg-bone/10">
        <div className="pre-progress h-px w-full origin-left scale-x-0 bg-signal" />
      </div>

      {/* — bas : compteur massif ——————————————————————————— */}
      <div className="pre-out flex items-end justify-between">
        <div className="mask">
          <span className="label block text-fog">{ui.loading}</span>
        </div>
        <div className="mask">
          <span
            className="display block text-[18vw] leading-none text-bone md:text-[10vw]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {pad(count)}
          </span>
        </div>
      </div>
    </div>
  );
}
