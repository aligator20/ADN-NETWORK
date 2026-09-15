/**
 * MÉTRIQUES DE FONTE — lues dans le fichier, pas devinées.
 *
 * Un titre d'affichage de 90 px qui dépasse de la diapositive est un défaut
 * visible à cent mètres, et c'est exactement ce qui arrive quand on estime la
 * largeur d'un texte à « environ 0,5 × la taille ». Archivo n'est pas une
 * chasse fixe : « W » fait presque trois fois « i ».
 *
 * On lit donc les tables réelles du TTF — head (unitsPerEm), hhea + hmtx
 * (chasses), cmap (caractère → glyphe) — et la mise en page devient exacte :
 * une ligne qui tient ici tiendra au rendu, parce que c'est la même fonte qui
 * a fourni les deux chiffres.
 */
const fs = require("fs");

function lirePolice(chemin) {
  const b = fs.readFileSync(chemin);

  /* — table des tables ————————————————————————————————————— */
  const nbTables = b.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < nbTables; i++) {
    const o = 12 + i * 16;
    tables[b.toString("latin1", o, o + 4)] = { debut: b.readUInt32BE(o + 8) };
  }
  for (const nom of ["head", "hhea", "hmtx", "cmap", "maxp"]) {
    if (!tables[nom]) throw new Error(`${chemin} : table ${nom} absente`);
  }

  const unitsPerEm = b.readUInt16BE(tables.head.debut + 18);
  const nbMetriques = b.readUInt16BE(tables.hhea.debut + 34);
  const nbGlyphes = b.readUInt16BE(tables.maxp.debut + 4);

  /* — chasses ——————————————————————————————————————————————
     hmtx ne porte que `nbMetriques` chasses ; tous les glyphes au-delà
     partagent la dernière. C'est le cas des fontes à chasse fixe, où une
     seule valeur couvre 99 % des glyphes. */
  const chasses = new Uint16Array(nbGlyphes);
  let derniere = 0;
  for (let g = 0; g < nbGlyphes; g++) {
    if (g < nbMetriques) derniere = b.readUInt16BE(tables.hmtx.debut + g * 4);
    chasses[g] = derniere;
  }

  /* — cmap : on prend la meilleure sous-table Unicode disponible ————— */
  const cmapDebut = tables.cmap.debut;
  const nbSous = b.readUInt16BE(cmapDebut + 2);
  let fmt4 = null;
  let fmt12 = null;
  for (let i = 0; i < nbSous; i++) {
    const o = cmapDebut + 4 + i * 8;
    const plateforme = b.readUInt16BE(o);
    const encodage = b.readUInt16BE(o + 2);
    const debut = cmapDebut + b.readUInt32BE(o + 4);
    const format = b.readUInt16BE(debut);
    const unicode =
      plateforme === 0 || (plateforme === 3 && (encodage === 1 || encodage === 10));
    if (!unicode) continue;
    if (format === 12) fmt12 = debut;
    else if (format === 4 && fmt4 === null) fmt4 = debut;
  }
  if (fmt4 === null && fmt12 === null) throw new Error(`${chemin} : aucune cmap Unicode`);

  const cache = new Map();

  function glyphe(cp) {
    if (cache.has(cp)) return cache.get(cp);
    let g = 0;

    if (fmt12 !== null) {
      const nbGroupes = b.readUInt32BE(fmt12 + 12);
      for (let i = 0; i < nbGroupes; i++) {
        const o = fmt12 + 16 + i * 12;
        const d = b.readUInt32BE(o);
        const f = b.readUInt32BE(o + 4);
        if (cp >= d && cp <= f) {
          g = b.readUInt32BE(o + 8) + (cp - d);
          break;
        }
      }
    }

    if (g === 0 && fmt4 !== null && cp <= 0xffff) {
      const segX2 = b.readUInt16BE(fmt4 + 6);
      const fins = fmt4 + 14;
      const debuts = fins + segX2 + 2;
      const deltas = debuts + segX2;
      const plages = deltas + segX2;
      for (let s = 0; s < segX2; s += 2) {
        if (cp > b.readUInt16BE(fins + s)) continue;
        const d = b.readUInt16BE(debuts + s);
        if (cp < d) break;
        const plage = b.readUInt16BE(plages + s);
        if (plage === 0) {
          g = (cp + b.readInt16BE(deltas + s)) & 0xffff;
        } else {
          const adr = plages + s + plage + (cp - d) * 2;
          const brut = b.readUInt16BE(adr);
          g = brut === 0 ? 0 : (brut + b.readInt16BE(deltas + s)) & 0xffff;
        }
        break;
      }
    }

    cache.set(cp, g);
    return g;
  }

  /** Largeur d'un texte, en pixels, à la taille demandée. */
  function largeur(texte, taille, interlettre = 0) {
    let u = 0;
    let n = 0;
    for (const car of texte) {
      u += chasses[glyphe(car.codePointAt(0))] || 0;
      n++;
    }
    return (u / unitsPerEm) * taille + Math.max(0, n - 1) * interlettre;
  }

  return { largeur, unitsPerEm };
}

module.exports = { lirePolice };
