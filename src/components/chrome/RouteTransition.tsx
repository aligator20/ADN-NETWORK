"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * TRANSITION DE ROUTE
 *
 * Un rideau passe entre deux pages. Il ne se fond pas : il MONTE, couvre, puis
 * se retire vers le haut — la coupe posée par le préloader et reprise par le
 * menu. Trois éléments du châssis parlent ainsi la même langue.
 *
 * Pourquoi ce n'est pas une simple animation d'entrée : sans rideau, cliquer un
 * projet fait clignoter le blanc du navigateur puis apparaître la page à moitié
 * mesurée. Le rideau couvre exactement le moment où ScrollTrigger remesure et
 * repositionne — le défaut devient le temps de la transition.
 *
 * Le rideau n'apparaît PAS au premier chargement : c'est le préloader qui tient
 * ce rôle, et les enchaîner ferait attendre deux fois.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const [covering, setCovering] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    setCovering(true);
    // Le rideau reste juste assez pour masquer la remesure de la nouvelle page.
    const t = window.setTimeout(() => setCovering(false), 420);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {covering && (
        <motion.div
          key="route-curtain"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[36] bg-void"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: { duration: 0.42, ease: [0.65, 0.05, 0, 1] },
          }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.62, ease: [0.65, 0.05, 0, 1] },
          }}
        />
      )}
    </AnimatePresence>
  );
}
