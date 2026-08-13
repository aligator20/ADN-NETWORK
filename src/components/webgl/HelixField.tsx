"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import {
  helixLineFragment,
  helixPointFragment,
  helixVertex,
} from "@/components/webgl/shaders/helix";
import { usePointer } from "@/hooks/usePointer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn, cssVar } from "@/lib/utils";
import { FOLLOW } from "@/lib/motion";

type Props = {
  className?: string;
  /**
   * Progression du déroulement, 0 → 1. Écrit par ScrollTrigger depuis le Hero.
   * Volontairement une ref mutable et non une prop d'état : un `setState` par
   * frame de scroll ferait re-rendre React 60 fois par seconde pour rien.
   */
  unwindRef: { current: number };
};

/** Densité adaptée à l'appareil — le mobile n'a pas le budget du desktop. */
const density = () => {
  if (typeof window === "undefined") return { points: 4500, rungs: 90 };
  const small = window.innerWidth < 768;
  const weak = (navigator.hardwareConcurrency ?? 4) <= 4;
  if (small || weak) return { points: 5000, rungs: 90 };
  return { points: 14000, rungs: 210 };
};

/** Couleur Three lue depuis le design system — une seule source de vérité. */
const token = (name: string, fallback: string) =>
  new THREE.Color(cssVar(name, fallback));

/** Les 7 teintes de discipline, dans l'ordre canonique de `services`. */
const paletteTokens: readonly [string, string][] = [
  ["--color-digital", "#4d93ff"],
  ["--color-ai", "#a855f7"],
  ["--color-automation", "#ff8a1f"],
  ["--color-network", "#22d3ee"],
  ["--color-cyber", "#ff4d58"],
  ["--color-creative", "#ff5fae"],
  ["--color-agritech", "#4ade80"],
  ["--color-farming", "#8ab833"],
  ["--color-food", "#f2b705"],
];

/** Part des points qui portent une couleur de discipline plutôt que l'os. */
const COLORED_SHARE = 0.22;

/**
 * Double hélice particulaire — la seule pièce Three.js du site.
 *
 * Justification du WebGL : ~14 000 points dont la position est entièrement
 * calculée par le GPU, morphés d'une hélice vers un réseau plat au scroll, avec
 * un champ de répulsion au pointeur. En DOM/CSS c'est hors de portée ; en GSAP
 * ce serait 14 000 tweens. Ici : 2 draw calls et 3 uniforms mis à jour.
 */
export function HelixField({ className, unwindRef }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const pointer = usePointer();
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    /* — Contexte ————————————————————————————————————————— */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // inutile pour des points additifs, coûteux
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true); // pas de WebGL → le dégradé de repli prend le relais
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const group = new THREE.Group();
    group.rotation.z = -0.16; // légère diagonale : plus tendu qu'un axe vertical
    scene.add(group);

    /* — Géométries ————————————————————————————————————— */
    const { points: COUNT, rungs: RUNGS } = density();

    const buildAttributes = (n: number) => ({
      position: new Float32Array(n * 3), // requis par three, non lu par le shader
      aT: new Float32Array(n),
      aStrand: new Float32Array(n),
      aSeed: new Float32Array(n),
      aScale: new Float32Array(n),
      aColor: new Float32Array(n * 3),
    });

    const bone = token("--color-bone", "#ececee");
    const palette = paletteTokens.map(([name, fb]) => token(name, fb));

    // — nuage de points
    const pAttr = buildAttributes(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pAttr.aT[i] = Math.random();
      pAttr.aStrand[i] = i % 2;
      pAttr.aSeed[i] = Math.random();
      pAttr.aScale[i] = 0.35 + Math.random() * Math.random() * 1.8;

      // Une minorité de points porte une teinte de discipline. Les 7 couleurs
      // sont distribuées uniformément : aucune discipline ne domine l'hélice.
      const c =
        Math.random() < COLORED_SHARE
          ? palette[Math.floor(Math.random() * palette.length)]
          : bone;
      pAttr.aColor[i * 3] = c.r;
      pAttr.aColor[i * 3 + 1] = c.g;
      pAttr.aColor[i * 3 + 2] = c.b;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(pAttr.position, 3));
    pointsGeo.setAttribute("aT", new THREE.BufferAttribute(pAttr.aT, 1));
    pointsGeo.setAttribute("aStrand", new THREE.BufferAttribute(pAttr.aStrand, 1));
    pointsGeo.setAttribute("aSeed", new THREE.BufferAttribute(pAttr.aSeed, 1));
    pointsGeo.setAttribute("aScale", new THREE.BufferAttribute(pAttr.aScale, 1));
    pointsGeo.setAttribute("aColor", new THREE.BufferAttribute(pAttr.aColor, 3));
    pointsGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

    // — barreaux : 2 sommets par liaison, même aT et même seed, brins opposés
    const lAttr = buildAttributes(RUNGS * 2);
    for (let i = 0; i < RUNGS; i++) {
      const t = i / (RUNGS - 1);
      const seed = Math.random();
      for (let k = 0; k < 2; k++) {
        const idx = i * 2 + k;
        lAttr.aT[idx] = t;
        lAttr.aStrand[idx] = k;
        lAttr.aSeed[idx] = seed;
        lAttr.aScale[idx] = 1;
        // Les barreaux restent en os : la couleur appartient aux points, sinon
        // l'hélice vire au dégradé décoratif. L'attribut doit tout de même
        // exister — le vertex shader est partagé avec le nuage de points.
        lAttr.aColor[idx * 3] = bone.r;
        lAttr.aColor[idx * 3 + 1] = bone.g;
        lAttr.aColor[idx * 3 + 2] = bone.b;
      }
    }

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(lAttr.position, 3));
    linesGeo.setAttribute("aT", new THREE.BufferAttribute(lAttr.aT, 1));
    linesGeo.setAttribute("aStrand", new THREE.BufferAttribute(lAttr.aStrand, 1));
    linesGeo.setAttribute("aSeed", new THREE.BufferAttribute(lAttr.aSeed, 1));
    linesGeo.setAttribute("aScale", new THREE.BufferAttribute(lAttr.aScale, 1));
    linesGeo.setAttribute("aColor", new THREE.BufferAttribute(lAttr.aColor, 3));
    linesGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

    /* — Matériaux ————————————————————————————————————— */
    const shared = {
      uTime: { value: 0 },
      uUnwind: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: dpr },
      uSize: { value: 1.9 },
      uColorBase: { value: bone }, // barreaux uniquement — les points ont aColor
    };

    const pointsMat = new THREE.ShaderMaterial({
      vertexShader: helixVertex,
      fragmentShader: helixPointFragment,
      uniforms: { ...shared, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const linesMat = new THREE.ShaderMaterial({
      vertexShader: helixVertex,
      fragmentShader: helixLineFragment,
      uniforms: { ...shared, uOpacity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const cloud = new THREE.Points(pointsGeo, pointsMat);
    const rungs = new THREE.LineSegments(linesGeo, linesMat);
    cloud.frustumCulled = false;
    rungs.frustumCulled = false;
    group.add(rungs, cloud);

    /* — Dimensionnement ————————————————————————————————— */
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Composition : l'hélice s'ancre à droite sur desktop pour libérer la
      // colonne de gauche où vit le titre. Elle se recentre en dessous de 768px.
      const wide = w >= 768;
      group.position.x = wide ? 2.6 : 0;
      camera.position.z = wide ? 9.5 : 12.5;

      shared.uSize.value = wide ? 1.9 : 1.5;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* — Boucle ————————————————————————————————————————— */
    const clock = new THREE.Clock();
    const smoothPointer = new THREE.Vector2(0, 0);
    let raf = 0;
    let visible = true;
    let running = false;

    // Temps accumulé à la main plutôt que `clock.getElapsedTime()` : la boucle
    // se met en pause hors viewport, et l'horloge murale, elle, continue. Avec
    // l'elapsed brut, revenir sur le Hero ferait sauter la rotation d'un bond.
    // Le delta est borné pour absorber les longues pauses d'onglet.
    let elapsed = 0;

    const renderFrame = () => {
      elapsed += Math.min(clock.getDelta(), 1 / 30);
      const t = elapsed;

      // Le pointeur est lissé côté JS : le shader reçoit une valeur déjà
      // amortie, ce qui évite toute saccade sur un mousemove irrégulier.
      const p = pointer.current;
      smoothPointer.x += (p.nx - smoothPointer.x) * FOLLOW.pointerField;
      smoothPointer.y += (p.ny - smoothPointer.y) * FOLLOW.pointerField;

      shared.uTime.value = t;
      shared.uUnwind.value = unwindRef.current;
      shared.uPointer.value.copy(smoothPointer);

      // Fondu d'entrée : le champ apparaît par lui-même, sans tween externe.
      const fade = Math.min(t / 2.4, 1);
      pointsMat.uniforms.uOpacity.value = fade;
      // Les barreaux s'effacent à mesure que l'hélice se déroule.
      linesMat.uniforms.uOpacity.value = fade * (1 - unwindRef.current);

      group.rotation.y = t * 0.045 + smoothPointer.x * 0.12;
      group.rotation.x = smoothPointer.y * -0.08;

      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      clock.getDelta(); // purge le delta accumulé pendant la pause
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) {
      // Mouvement réduit : une seule frame, composition figée, zéro rAF.
      shared.uTime.value = 1.2;
      pointsMat.uniforms.uOpacity.value = 1;
      linesMat.uniforms.uOpacity.value = 1;
      renderer.render(scene, camera);
    } else {
      clock.start();
      start();
    }

    // Hors viewport ou onglet caché → on rend la main au navigateur.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* — Nettoyage ————————————————————————————————————— */
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      pointsGeo.dispose();
      linesGeo.dispose();
      pointsMat.dispose();
      linesMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [pointer, reduced, unwindRef]);

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0", failed && "webgl-fallback", className)}
    >
      <div ref={mount} className="h-full w-full" />
    </div>
  );
}
