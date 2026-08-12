/**
 * Vocabulaire de mouvement.
 * Une seule source de vérité pour les durées et les courbes : c'est ce qui fait
 * qu'un site paraît « écrit par une seule main ».
 */

export const EASE = {
  /** Sortie très ample — révélations, entrées de titres. */
  expo: "expo.out",
  /** Accélération/décélération marquée — masques, rideaux. */
  power: "power4.inOut",
  /** Décélération douce — micro-interactions, survols. */
  soft: "power2.out",
  /** Rebond contenu — magnétisme, curseur. */
  elastic: "elastic.out(1, 0.75)",
} as const;

export const DUR = {
  micro: 0.28,
  fast: 0.5,
  base: 0.9,
  slow: 1.4,
  cinematic: 2.2,
} as const;

export const STAGGER = {
  chars: 0.026,
  words: 0.07,
  lines: 0.12,
  blocks: 0.18,
} as const;

/** Facteur d'inertie du curseur et des suiveurs (lerp par frame à 60 fps). */
export const FOLLOW = {
  cursorRing: 0.14,
  cursorDot: 0.5,
  pointerField: 0.06,
} as const;
