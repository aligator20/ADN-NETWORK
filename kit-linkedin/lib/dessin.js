/**
 * L'ATELIER DE DESSIN — SVG mesuré, rendu en PNG.
 *
 * Tout passe par `couper()`, qui découpe un texte en lignes à partir des
 * chasses réelles de la fonte. Aucune diapositive n'écrit une coupure à la
 * main : un texte corrigé dans `src/content` se remet en page tout seul, et
 * c'est la seule façon d'avoir un carrousel qui ne ment pas sur les prix.
 *
 * `rendre()` refuse silencieusement de deviner : si une ligne dépasse la
 * largeur utile, le générateur s'arrête. Mieux vaut un script en erreur qu'un
 * visuel publié avec un titre coupé.
 */
const path = require("path");
const fs = require("fs");

const RACINE = path.join(__dirname, "..", "..");
const DOSSIER_FONTES = path.join(__dirname, "..", ".fontes");

/* — fontconfig doit être réglé AVANT le démarrage du processus. `fontes.js`
     s'en charge en relançant node ; ici on se contente de refuser de tourner
     sans, plutôt que de rendre dix visuels dans une serif de repli. ———— */
const CONF = path.join(DOSSIER_FONTES, "fonts.conf");
/* Comparaison normalisée : sous Windows, « C:/…/fonts.conf » et
   « C:\…\fonts.conf » désignent le même fichier et doivent être acceptés. */
const memeChemin = (a, b) =>
  !!a && path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
if (!memeChemin(process.env.FONTCONFIG_FILE, CONF)) {
  throw new Error(
    "FONTCONFIG_FILE n'est pas réglé sur " + CONF + " — appeler relancerAvecFontes() d'abord.",
  );
}

const sharp = require(path.join(RACINE, "node_modules", "sharp"));
const { lirePolice } = require("./ttf");

/* ── La palette, recopiée de globals.css ──────────────────────────────────
   C'est la seule duplication assumée du kit : un fichier CSS ne se require
   pas depuis Node, et ces neuf valeurs n'ont pas bougé depuis l'origine. */
const C = {
  void: "#050506",
  carbon: "#0a0a0c",
  graphite: "#121215",
  ash: "#1c1c20",
  steel: "#2a2a30",
  fog: "#7d7d86",
  bone: "#ececee",
  signal: "#c6f24e",
  digital: "#4d93ff",
  ai: "#a855f7",
  automation: "#ff8a1f",
  network: "#22d3ee",
  cyber: "#ff4d58",
  cybersecurity: "#ff4d58",
  creative: "#ff5fae",
  agritech: "#4ade80",
  farming: "#8ab833",
  food: "#f2b705",
  sante: "#1fd6b2",
};

/** L'ordre des disciplines, celui du site. */
const DISCIPLINES = [
  "digital",
  "ai",
  "automation",
  "network",
  "cybersecurity",
  "creative",
  "agritech",
  "farming",
  "food",
  "sante",
];

/* ── Les fontes ─────────────────────────────────────────────────────────── */
const FICHIERS = {
  black: "Archivo-Black.ttf",
  bold: "Archivo-Bold.ttf",
  regular: "Archivo-Regular.ttf",
  mono: "JetBrainsMono-Regular.ttf",
  monoMedium: "JetBrainsMono-Medium.ttf",
};

const POLICES = {};
for (const [cle, fichier] of Object.entries(FICHIERS)) {
  POLICES[cle] = lirePolice(path.join(DOSSIER_FONTES, fichier));
}

/** Famille + graisse SVG correspondant à chaque clé de fonte. */
const FAMILLE = {
  black: { family: "Archivo Black", weight: 400 },
  bold: { family: "Archivo", weight: 700 },
  regular: { family: "Archivo", weight: 400 },
  mono: { family: "JetBrains Mono", weight: 400 },
  monoMedium: { family: "JetBrains Mono", weight: 500 },
};

/* ── Outils ─────────────────────────────────────────────────────────────── */

const esc = (t) =>
  String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Apostrophe typographique.
 *
 * Le contenu du site mêle les deux apostrophes selon l'âge du fichier. Sur une
 * page web personne ne les compare ; sur une diapositive où « L'Annuaire » et
 * « l'on peut » se suivent à deux lignes d'écart, la différence saute aux yeux.
 *
 * La substitution est faite AVANT la mesure, jamais à l'échappement : les deux
 * signes n'ont pas la même chasse dans Archivo, et mesurer l'un pour rendre
 * l'autre fait mentir le contrôle de débordement — d'autant plus sur un titre
 * d'affichage, où l'erreur est multipliée par la taille du corps.
 */
const typo = (t) => String(t).replace(/'/g, "’");

const mesure = (fonte, texte, taille, ls = 0) =>
  POLICES[fonte].largeur(typo(texte), taille, ls);

/**
 * Découpe un texte à la largeur utile. Les retours à la ligne explicites sont
 * respectés ; le reste est coupé aux espaces.
 */
function couper(texte, fonte, taille, largeurMax, ls = 0) {
  const lignes = [];
  for (const paragraphe of typo(texte).split("\n")) {
    const mots = paragraphe.split(/ +/).filter(Boolean);
    if (mots.length === 0) {
      lignes.push("");
      continue;
    }
    let courante = mots[0];
    for (let i = 1; i < mots.length; i++) {
      const essai = `${courante} ${mots[i]}`;
      if (mesure(fonte, essai, taille, ls) <= largeurMax) courante = essai;
      else {
        lignes.push(courante);
        courante = mots[i];
      }
    }
    lignes.push(courante);
  }
  return lignes;
}

/**
 * Un bloc de texte posé en (x, y). `y` est la LIGNE DE BASE de la première
 * ligne. Renvoie le SVG et la hauteur occupée, pour empiler sans compter.
 */
function bloc({
  x,
  y,
  texte,
  fonte = "mono",
  taille = 26,
  interligne = 1.75,
  fill = C.bone,
  ls = 0,
  largeurMax = Infinity,
  anchor = "start",
  opacite = 1,
}) {
  const lignes = Array.isArray(texte)
    ? texte.map(typo)
    : couper(texte, fonte, taille, largeurMax, ls);
  const pas = taille * interligne;
  const f = FAMILLE[fonte];

  const corps = lignes
    .map((ligne, i) => {
      const large = mesure(fonte, ligne, taille, ls);
      if (large > largeurMax + 0.5) {
        throw new Error(
          `Débordement : « ${ligne} » fait ${large.toFixed(0)} px pour ${largeurMax} px utiles ` +
            `(fonte ${fonte}, ${taille} px). Raccourcir le texte ou réduire la taille.`,
        );
      }
      return `<text x="${x}" y="${(y + i * pas).toFixed(1)}" font-family="${f.family}" font-weight="${f.weight}" font-size="${taille}" fill="${fill}"${ls ? ` letter-spacing="${ls}"` : ""}${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${opacite !== 1 ? ` opacity="${opacite}"` : ""}>${esc(ligne)}</text>`;
    })
    .join("\n");

  return {
    svg: corps,
    lignes,
    hauteur: (lignes.length - 1) * pas,
    /** Ligne de base de la DERNIÈRE ligne — ce qu'on compare au plancher. */
    bas: y + (lignes.length - 1) * pas,
    /** Ordonnée de base de la ligne suivante si l'on continue d'empiler. */
    suivant: y + lignes.length * pas,
  };
}

/** Un filet. Le trait de 1 px du site, à l'échelle de la diapositive. */
const filet = (x, y, largeur, couleur = C.steel, epaisseur = 2) =>
  `<rect x="${x}" y="${y}" width="${largeur}" height="${epaisseur}" fill="${couleur}"/>`;

/** Le code couleur des dix disciplines, en pastilles. */
function pastilles(x, y, largeurTotale, hauteur = 10, ecart = 12) {
  const l = (largeurTotale - ecart * (DISCIPLINES.length - 1)) / DISCIPLINES.length;
  return DISCIPLINES.map(
    (d, i) =>
      `<rect x="${(x + i * (l + ecart)).toFixed(1)}" y="${y}" width="${l.toFixed(1)}" height="${hauteur}" fill="${C[d]}"/>`,
  ).join("");
}

/**
 * CONTRÔLE DES FONTES — la seule panne de ce kit qui ne se voit pas.
 *
 * Quand fontconfig ne trouve pas une famille, il n'échoue pas : il en substitue
 * une autre et rend une image parfaitement valide. Les dix premières
 * diapositives produites ici étaient entièrement composées dans une serif de
 * repli, et rien dans la sortie du script ne le signalait.
 *
 * On ne peut pas interroger fontconfig depuis Node. On procède donc par
 * différence : le même texte est rendu dans chacune de nos cinq fontes ET dans
 * une famille qui n'existe nulle part. Si deux rendus sont identiques au
 * pixel près, c'est qu'ils ont été composés dans la même fonte — donc qu'au
 * moins une des deux n'a pas été trouvée.
 *
 * Ce contrôle attrape aussi le cas retors : « Archivo Black » absent, résolu
 * en « Archivo » par correspondance de famille. Le rendu serait crédible, et
 * le titre de la couverture serait dans la mauvaise graisse.
 */
async function verifierFontes() {
  const temoin = "HAMBURGEFONS 0123";
  const rendu = (family, weight) =>
    sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="140">` +
          `<rect width="1000" height="140" fill="#000"/>` +
          `<text x="12" y="100" font-family="${family}" font-weight="${weight}" font-size="72" fill="#fff">${temoin}</text></svg>`,
        "utf8",
      ),
    )
      .raw()
      .toBuffer();

  const rendus = { "(repli système)": await rendu("ZzFamilleQuiNExistePas", 400) };
  for (const [cle, f] of Object.entries(FAMILLE)) {
    rendus[`${cle} → ${f.family} ${f.weight}`] = await rendu(f.family, f.weight);
  }

  const cles = Object.keys(rendus);
  for (let i = 0; i < cles.length; i++) {
    for (let j = i + 1; j < cles.length; j++) {
      if (rendus[cles[i]].equals(rendus[cles[j]])) {
        throw new Error(
          `Fonte non résolue : « ${cles[i]} » et « ${cles[j]} » rendent le même dessin.\n` +
            `  Les .ttf attendus sont dans kit-linkedin/.fontes/ et FONTCONFIG_FILE doit y pointer.`,
        );
      }
    }
  }
}

/**
 * Rend un SVG en PNG, à l'échelle 1:1.
 *
 * `density: 72` n'est pas un réglage de confort. librsvg lit les dimensions
 * d'un SVG comme des POINTS : à la densité par défaut de 96, un document de
 * 1080 × 1350 sort en 1440 × 1800. Ce n'est pas anodin ici — la bannière doit
 * faire exactement 1584 × 396 pour ne pas être recadrée par LinkedIn, et
 * `public/og.png` doit correspondre au `width`/`height` déclarés dans les
 * métadonnées du site.
 *
 * Le 1:1 sert aussi le dessin : la maquette est pleine de filets d'un pixel,
 * et un filet rendu à 1,33 px puis ramené à 1 px devient un gris sale.
 *
 * La taille obtenue est ensuite VÉRIFIÉE contre celle déclarée dans le SVG :
 * une mise à l'échelle silencieuse est exactement le genre de panne qui se
 * découvre une fois le visuel publié.
 */
async function rendre(svg, fichier, surcouches = []) {
  const attendu = {
    width: Number(/\bwidth="(\d+)"/.exec(svg)[1]),
    height: Number(/\bheight="(\d+)"/.exec(svg)[1]),
  };

  /* Les captures d'écran sont posées PAR-DESSUS le SVG rendu, et non inséré
     dedans en base64 : un PNG de 2880 px encodé dans du XML fait grossir la
     source de plusieurs mégaoctets et ralentit le rendu sans rien apporter. */
  let tuyau = sharp(Buffer.from(svg, "utf8"), { density: 72 });
  if (surcouches.length) {
    /* Les ordonnées viennent d'empilements de tailles de corps : elles sont
       fractionnaires par nature. Le SVG s'en accommode, le compositeur non —
       il exige des entiers et échoue net. On arrondit ici plutôt que sur
       chaque appel, où l'oubli reviendrait à chaque nouvelle diapositive. */
    tuyau = tuyau.composite(
      surcouches.map((s) => ({ ...s, left: Math.round(s.left), top: Math.round(s.top) })),
    );
  }

  const info = await tuyau.png({ compressionLevel: 9 }).toFile(fichier);

  if (info.width !== attendu.width || info.height !== attendu.height) {
    throw new Error(
      `${path.basename(fichier)} : rendu en ${info.width}×${info.height} ` +
        `alors que le SVG déclare ${attendu.width}×${attendu.height}.`,
    );
  }
  return fichier;
}

module.exports = {
  C,
  DISCIPLINES,
  esc,
  mesure,
  couper,
  bloc,
  filet,
  pastilles,
  rendre,
  verifierFontes,
  sharp,
};
