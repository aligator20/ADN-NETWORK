/**
 * LES CADRES D'APPAREIL — dessinés, pas photographiés.
 *
 * Une maquette sur photo de MacBook posé sur un bureau en bois raconte une
 * autre marque que celle-ci, et oblige à vérifier la licence de la photo. Un
 * cadre dessiné aux couleurs du système reste à sa place : il encadre la
 * capture sans se faire remarquer, et c'est tout ce qu'on lui demande.
 *
 * Les proportions sont celles des captures — 1440 × 900 et 390 × 844 —, jamais
 * arrondies : une capture étirée de trois pour cent se voit immédiatement sur
 * du texte, et c'est précisément ce qu'on est en train de montrer.
 */

/** Arrondit les angles d'une image. */
async function arrondir(sharp, image, largeur, hauteur, rayon) {
  const masque = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${largeur}" height="${hauteur}">` +
      `<rect width="${largeur}" height="${hauteur}" rx="${rayon}" ry="${rayon}" fill="#fff"/></svg>`,
  );
  return sharp(image)
    .resize(largeur, hauteur)
    .composite([{ input: masque, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/**
 * Un ordinateur portable ouvert, vu de face.
 * `largeurEcran` est la largeur utile ; l'objet rendu est un peu plus large
 * à cause du socle.
 */
async function ordinateur(sharp, C, capture, largeurEcran) {
  const ecranW = Math.round(largeurEcran);
  const ecranH = Math.round((ecranW * 900) / 1440);
  const bord = 12;
  const corpsW = ecranW + bord * 2;
  const corpsH = ecranH + bord * 2;
  const socleW = Math.round(corpsW * 1.1);
  const socleH = 15;
  const W = socleW;
  const Hh = corpsH + socleH + 4;
  const decalX = Math.round((socleW - corpsW) / 2);

  const corps =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}">` +
    `<rect x="${decalX}" y="0" width="${corpsW}" height="${corpsH}" rx="14" fill="${C.graphite}" stroke="${C.steel}" stroke-width="2"/>` +
    // le socle, plus large que le capot, avec l'encoche d'ouverture
    `<rect x="0" y="${corpsH + 4}" width="${socleW}" height="${socleH}" rx="5" fill="${C.ash}" stroke="${C.steel}" stroke-width="1.5"/>` +
    `<rect x="${Math.round(W / 2 - 46)}" y="${corpsH + 4}" width="92" height="4" rx="2" fill="${C.steel}"/>` +
    `</svg>`;

  const ecran = await arrondir(sharp, capture, ecranW, ecranH, 5);

  const image = await sharp(Buffer.from(corps))
    .composite([{ input: ecran, left: decalX + bord, top: bord }])
    .png()
    .toBuffer();

  return { image, largeur: W, hauteur: Hh };
}

/** Un téléphone, encoche comprise. */
async function telephone(sharp, C, capture, largeurEcran) {
  const ecranW = Math.round(largeurEcran);
  const ecranH = Math.round((ecranW * 844) / 390);
  const bord = 10;
  const W = ecranW + bord * 2;
  const Hh = ecranH + bord * 2;

  const corps =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}">` +
    `<rect x="0" y="0" width="${W}" height="${Hh}" rx="${Math.round(W * 0.115)}" fill="${C.graphite}" stroke="${C.steel}" stroke-width="2"/>` +
    `</svg>`;

  const encoche =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}">` +
    `<rect x="${Math.round(W / 2 - ecranW * 0.16)}" y="${bord + 4}" width="${Math.round(ecranW * 0.32)}" height="${Math.round(ecranW * 0.075)}" rx="${Math.round(ecranW * 0.038)}" fill="${C.void}"/>` +
    `</svg>`;

  const ecran = await arrondir(sharp, capture, ecranW, ecranH, Math.round(W * 0.085));

  const image = await sharp(Buffer.from(corps))
    .composite([
      { input: ecran, left: bord, top: bord },
      { input: Buffer.from(encoche), left: 0, top: 0 },
    ])
    .png()
    .toBuffer();

  return { image, largeur: W, hauteur: Hh };
}

module.exports = { ordinateur, telephone };
