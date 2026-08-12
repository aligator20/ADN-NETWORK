import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Remappe `v` de [inMin, inMax] vers [outMin, outMax], borné. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  if (inMax === inMin) return outMin;
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

/** Index de séquence formaté : 1 → "001" */
export const pad = (n: number, size = 3) => String(n).padStart(size, "0");

/**
 * Résout un token du design system en valeur calculée.
 * Indispensable avant de le passer à GSAP : GSAP interpole des couleurs, pas
 * des expressions CSS — `var(--x)` ou `color-mix()` ne se tweenent pas.
 */
export function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/** `#rrggbb` + alpha → `rgba(r, g, b, a)`, tweenable par GSAP. */
export function withAlpha(hex: string, alpha: number) {
  if (!hex.startsWith("#")) return hex; // déjà une couleur fonctionnelle
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
