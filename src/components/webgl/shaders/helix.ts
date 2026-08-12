/**
 * Shaders du champ hélicoïdal.
 *
 * Le vertex shader est PARTAGÉ entre les points et les liaisons : les deux
 * géométries appliquent exactement la même fonction de position, donc les
 * barreaux restent collés aux points sans aucun calcul CPU par frame.
 *
 * Tout est calculé sur le GPU. Aucune position n'est mise à jour côté JS :
 * on ne touche qu'à des uniforms (temps, pointeur, progression du scroll).
 */

export const helixVertex = /* glsl */ `
  uniform float uTime;
  uniform float uUnwind;    // 0 = double hélice, 1 = réseau déplié
  uniform vec2  uPointer;   // pointeur lissé, -1 → 1
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aT;       // position le long du brin, 0 → 1
  attribute float aStrand;  // 0 ou 1 — les deux brins sont déphasés de PI
  attribute float aSeed;    // aléa stable par point
  attribute float aScale;   // variation de taille
  // La couleur vient en attribut plutôt que d'un tableau de uniforms indexé :
  // GLSL ES 1.00 n'autorise pas l'indexation dynamique d'un uniform array, et
  // l'assignation des 7 teintes est de toute façon figée à la construction.
  attribute vec3  aColor;

  varying float vDepth;
  varying float vSeed;
  varying vec3  vColor;

  const float TAU = 6.28318530718;
  const float PI  = 3.14159265359;

  // — Position sur la double hélice ————————————————————————————
  vec3 helixPos(float t, float strand, float time) {
    float turns  = 3.25;
    float angle  = t * turns * TAU + time * 0.16 + strand * PI;
    float radius = 1.55 + sin(t * TAU * 2.0 + time * 0.1) * 0.07;
    return vec3(cos(angle) * radius, (t - 0.5) * 9.5, sin(angle) * radius);
  }

  // — Position sur le réseau déplié (nuage plat, faible profondeur) ————
  vec3 latticePos(float seed, float t) {
    float x = (fract(seed * 41.7) - 0.5) * 13.0;
    float y = (fract(seed * 97.3) - 0.5) * 7.5;
    float z = (fract(seed * 13.9) - 0.5) * 2.2;
    return vec3(x, y, z);
  }

  void main() {
    vec3 hp = helixPos(aT, aStrand, uTime);
    vec3 lp = latticePos(aSeed, aT);

    // Le déroulement part du bas : les points en haut du brin restent plus
    // longtemps en hélice, ce qui fait lire le mouvement comme un dévidage.
    float delay = smoothstep(0.0, 0.85, uUnwind * 1.6 - aT * 0.55);
    vec3 pos = mix(hp, lp, delay);

    // Respiration : évite l'immobilité mécanique quand rien ne bouge.
    pos.x += sin(uTime * 0.32 + aSeed * TAU) * 0.055;
    pos.z += cos(uTime * 0.27 + aSeed * TAU) * 0.055;

    // — Champ de répulsion au pointeur ————————————————————————
    vec2 field = uPointer * vec2(4.2, 2.6);
    vec2 delta = pos.xy - field;
    float dist = length(delta);
    float push = smoothstep(3.0, 0.0, dist) * 0.85;
    pos.xy += normalize(delta + 0.0001) * push;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Profondeur normalisée pour le brouillard et l'atténuation.
    vDepth = clamp((-mvPosition.z - 3.0) / 12.0, 0.0, 1.0);
    vSeed  = aSeed;
    vColor = aColor;

    // Taille en perspective : les points lointains rétrécissent réellement.
    gl_PointSize = uSize * aScale * uPixelRatio * (14.0 / max(-mvPosition.z, 0.001));
  }
`;

export const helixPointFragment = /* glsl */ `
  precision highp float;

  uniform float uOpacity;

  varying float vDepth;
  varying float vSeed;
  varying vec3  vColor;

  void main() {
    // Point circulaire à bord doux — jamais de carré, jamais de texture.
    vec2 uv = gl_PointCoord - 0.5;
    float alpha = smoothstep(0.5, 0.05, length(uv));
    alpha *= alpha;

    // La couleur est décidée à la construction du buffer : la majorité des
    // points reste en os, une minorité porte l'une des 7 teintes de discipline.
    // L'hélice est donc littéralement l'ADN des sept métiers.
    float fog = 1.0 - vDepth;
    gl_FragColor = vec4(vColor, alpha * uOpacity * (0.18 + fog * 0.82));
  }
`;

export const helixLineFragment = /* glsl */ `
  precision highp float;

  uniform vec3  uColorBase;
  uniform float uOpacity;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float fog = 1.0 - vDepth;
    gl_FragColor = vec4(uColorBase, uOpacity * (0.05 + fog * 0.55));
  }
`;
