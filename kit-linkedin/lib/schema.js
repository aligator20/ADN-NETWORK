/**
 * LE SCHÉMA DU RÉSEAU — une seule source, deux sorties.
 *
 * Le dessin sert à la fois à la diapositive du carrousel et à l'animation en
 * boucle. Le garder écrit deux fois garantissait qu'une correction n'arrive un
 * jour que d'un côté : la version fixe et la version animée finiraient par
 * montrer deux réseaux différents.
 *
 * `phase` va de 0 à 1 et décale les pointillés le long des liens. Les entrées
 * descendent vers l'annuaire, les retours remontent — donc leurs décalages
 * vont en SENS INVERSE. C'est cette opposition qui fait lire une boucle
 * plutôt qu'un entonnoir, et c'est la seule chose que l'animation ajoute.
 *
 * Le repère est local : (0, 0) est le coin haut-gauche du contenu. Les courbes
 * de retour débordent volontairement de 62 px à gauche et à droite — c'est ce
 * débordement qui les sort du rectangle et les fait lire comme un mouvement.
 */

const TIRET_ENTREE = 14; // 7 + 7
const TIRET_RETOUR = 16; // 8 + 8

function schemaReseau({ C, bloc, largeur, portes, retours, phase = 0 }) {
  const W = largeur;
  const ecart = 26;
  const largeurPorte = (W - 2 * ecart) / 3;
  const centres = portes.map((_, i) => i * (largeurPorte + ecart) + largeurPorte / 2);

  const yHaut = 0;
  const hautH = 104;
  const yAnn = yHaut + 230;
  const annH = 132;
  const yBas = yAnn + annH + 140;
  const basH = 104;
  const largeurRetour = W / 2 - 16;

  /* Les pointillés avancent d'un motif complet par tour : au bout d'un cycle
     l'image est identique à celle du départ, et la boucle ne saute pas. */
  const offEntree = -phase * TIRET_ENTREE;
  const offRetour = phase * TIRET_RETOUR;

  const boitesHaut = portes
    .map((p, i) => {
      const x = i * (largeurPorte + ecart);
      return (
        `<rect x="${x.toFixed(1)}" y="${yHaut}" width="${largeurPorte.toFixed(1)}" height="${hautH}" fill="${C.graphite}" stroke="${C.steel}" stroke-width="1.5"/>` +
        bloc({ x: x + 20, y: yHaut + 46, texte: p.nom, fonte: "monoMedium", taille: 22, fill: C.bone })
          .svg +
        bloc({ x: x + 20, y: yHaut + 78, texte: p.detail, fonte: "mono", taille: 19, fill: C.fog }).svg
      );
    })
    .join("");

  const traits = centres
    .map(
      (cx) =>
        `<path d="M ${cx.toFixed(1)} ${yHaut + hautH} C ${cx.toFixed(1)} ${yHaut + 170}, ${(W / 2).toFixed(1)} ${yHaut + 160}, ${(W / 2).toFixed(1)} ${yAnn}" fill="none" stroke="${C.steel}" stroke-width="2" stroke-dasharray="7 7" stroke-dashoffset="${offEntree.toFixed(2)}"/>`,
    )
    .join("");

  const annuaire =
    `<rect x="150" y="${yAnn}" width="${W - 300}" height="${annH}" fill="${C.signal}" opacity="0.08"/>` +
    `<rect x="150" y="${yAnn}" width="${W - 300}" height="${annH}" fill="none" stroke="${C.signal}" stroke-width="2"/>` +
    bloc({
      x: W / 2,
      y: yAnn + 50,
      texte: "LE POINT COMMUN",
      fonte: "mono",
      taille: 18,
      ls: 4,
      fill: C.signal,
      anchor: "middle",
    }).svg +
    bloc({
      x: W / 2,
      y: yAnn + 102,
      texte: "L'ANNUAIRE",
      fonte: "black",
      taille: 42,
      fill: C.bone,
      anchor: "middle",
    }).svg;

  const boitesBas = retours
    .map(
      (r) =>
        `<rect x="${r.x}" y="${yBas}" width="${largeurRetour.toFixed(1)}" height="${basH}" fill="${C.carbon}" stroke="${r.couleur}" stroke-width="1.5"/>` +
        bloc({
          x: r.x + 20,
          y: yBas + 46,
          texte: r.nom,
          fonte: "monoMedium",
          taille: 22,
          fill: r.couleur,
        }).svg +
        bloc({ x: r.x + 20, y: yBas + 78, texte: r.detail, fonte: "mono", taille: 18, fill: C.fog }).svg,
    )
    .join("");

  const descentes = retours
    .map((r) => {
      const cx = r.x + largeurRetour / 2;
      return `<path d="M ${(W / 2).toFixed(1)} ${yAnn + annH} C ${(W / 2).toFixed(1)} ${yAnn + annH + 70}, ${cx.toFixed(1)} ${yAnn + annH + 60}, ${cx.toFixed(1)} ${yBas}" fill="none" stroke="${r.couleur}" stroke-width="2" stroke-dasharray="8 8" stroke-dashoffset="${offRetour.toFixed(2)}" opacity="0.85"/>`;
    })
    .join("");

  const remontees = retours
    .map((r, i) => {
      const gauche = i === 0;
      const depart = gauche ? r.x : r.x + largeurRetour;
      const arrivee = gauche ? 0 : W;
      const ctrl = gauche ? -62 : W + 62;
      const yD = yBas + 52;
      const yA = yHaut + 52;
      const pointe = gauche ? 1 : -1;
      return (
        `<path d="M ${depart.toFixed(1)} ${yD} C ${ctrl} ${yD}, ${ctrl} ${yA}, ${arrivee} ${yA}" fill="none" stroke="${r.couleur}" stroke-width="2" stroke-dasharray="8 8" stroke-dashoffset="${offRetour.toFixed(2)}" opacity="0.85"/>` +
        `<path d="M ${arrivee - pointe * 16} ${yA - 9} L ${arrivee} ${yA} L ${arrivee - pointe * 16} ${yA + 9}" fill="none" stroke="${r.couleur}" stroke-width="2"/>`
      );
    })
    .join("");

  return {
    svg: remontees + descentes + traits + boitesHaut + annuaire + boitesBas,
    hauteur: yBas + basH,
    /** Ce que les courbes de retour débordent de chaque côté. */
    debord: 62,
  };
}

module.exports = { schemaReseau };
