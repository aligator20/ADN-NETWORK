"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Glyphes de brouillage : alphabet technique, jamais de ponctuation molle. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>#*";

type Props = {
  children: string;
  className?: string;
  /** Déclenche le brouillage à l'apparition, en plus du survol. */
  playOnMount?: boolean;
  /** Frames de brouillage par caractère avant stabilisation. */
  speed?: number;
};

/**
 * Le texte se résout caractère par caractère, comme un décodage.
 *
 * Chaque lettre a sa propre frame de « verrouillage » : elles se figent de
 * gauche à droite, ce qui donne l'impression d'un flux qui se résout plutôt que
 * d'un effet appliqué en bloc. La largeur ne bouge jamais (même longueur de
 * chaîne à chaque frame), donc aucun reflow.
 */
export function ScrambleText({
  children,
  className,
  playOnMount = false,
  speed = 2,
}: Props) {
  const [display, setDisplay] = useState(children);
  const frame = useRef(0);
  const raf = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const scramble = useCallback(() => {
    if (reduced) return;
    stop();
    frame.current = 0;

    const target = children;
    // Décalage aléatoire par lettre → résolution en cascade, pas en bloc.
    const lock = Array.from(target, (_, i) => i * speed + Math.random() * speed * 4);
    const total = Math.max(...lock) + speed * 4;

    const tick = () => {
      const f = frame.current;
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === " ") {
          out += " ";
        } else if (f >= lock[i]) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);

      frame.current += 1;
      if (frame.current <= total) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        raf.current = null;
      }
    };

    raf.current = requestAnimationFrame(tick);
  }, [children, reduced, speed, stop]);

  useEffect(() => {
    if (playOnMount) scramble();
    return stop;
  }, [playOnMount, scramble, stop]);

  return (
    <span
      className={cn("inline-block", className)}
      onPointerEnter={scramble}
      aria-label={children}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
}
