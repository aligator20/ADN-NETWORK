"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Point d'enregistrement unique des plugins GSAP.
 * Importer `gsap` depuis ce module (jamais depuis "gsap" directement dans les
 * composants) garantit que ScrollTrigger est toujours enregistré.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Les valeurs par défaut du projet : tout hérite de la même signature.
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

export { gsap, ScrollTrigger, useGSAP };
