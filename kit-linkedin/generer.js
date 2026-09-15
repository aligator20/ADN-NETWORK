/**
 * LE KIT LINKEDIN — généré, jamais recopié.
 *
 * POURQUOI UN SCRIPT PLUTÔT QUE DIX FICHIERS DESSINÉS
 *
 * Un carrousel de présentation annonce des prix, des compteurs et des noms de
 * prestations. Tous existent déjà dans `src/content`, et tous bougeront encore.
 * Un visuel dessiné à la main est juste le jour où on l'exporte et faux au
 * premier changement — sauf qu'il continue de circuler sur LinkedIn, où rien ne
 * se corrige après publication.
 *
 * Ce script lit donc le contenu réel du site (jiti charge les .ts directement),
 * mesure chaque ligne dans la vraie fonte, et refuse de produire une image dont
 * un texte déborde. Changer un prix dans `vedettes.ts` puis relancer suffit.
 *
 *     node kit-linkedin/generer.js
 *
 * CE QU'IL PRODUIT
 *
 *   carrousel/01…10.png        1080 × 1350 — le format 4:5, celui qui occupe le
 *                              plus de hauteur dans un fil LinkedIn
 *   ADN-NETWORK-carrousel.pdf  le même, en un fichier : c'est ce que LinkedIn
 *                              attend pour un « post document » paginé
 *   post-1200x627.png          l'image d'un post à lien simple
 *   banniere-1584x396.png      la bannière de profil ou de page entreprise
 */
const fs = require("fs");
const path = require("path");

const ICI = __dirname;
const RACINE = path.join(ICI, "..");
const SORTIE = path.join(ICI, "carrousel");

/* ── Le contenu réel du site ─────────────────────────────────────────────── */
const creerJiti = require(path.join(RACINE, "node_modules", "jiti"));
const jiti = (creerJiti.default || creerJiti)(__filename, {
  alias: { "@": path.join(RACINE, "src") },
  interopDefault: true,
});
const { vedettes } = jiti(path.join(RACINE, "src/content/vedettes.ts"));
const { vitrine } = jiti(path.join(RACINE, "src/content/vitrine.ts"));
const { services } = jiti(path.join(RACINE, "src/content/services.ts"));
const { site } = jiti(path.join(RACINE, "src/content/site.ts"));
const { projects } = jiti(path.join(RACINE, "src/content/projects.ts"));
const { boutique } = jiti(path.join(RACINE, "src/content/boutique.ts"));
const { formatPrix } = jiti(path.join(RACINE, "src/lib/prix.ts"));

const prix = (n) => formatPrix(n, "fr", vedettes.currency);

/* ── Géométrie ───────────────────────────────────────────────────────────── */
const L = 1080;
const H = 1350;
const M = 84;
const U = L - M * 2; // largeur utile : 912

async function main() {
  const { assurerFontes, relancerAvecFontes } = require("./lib/fontes");
  await assurerFontes();
  relancerAvecFontes(__filename); // ne revient pas : l'enfant fait le travail

  const D = require("./lib/dessin");
  const { C, bloc, filet, pastilles, mesure, rendre, verifierFontes, sharp } = D;
  await verifierFontes();

  fs.mkdirSync(SORTIE, { recursive: true });

  /** Taille de corps qui fait tenir exactement `texte` dans `cible`. */
  const ajuste = (fonte, texte, cible) => (cible / mesure(fonte, texte, 100, 0)) * 100;

  /* ── Le cadre commun ───────────────────────────────────────────────────── */
  /**
   * `bas` est l'ordonnée de la dernière chose écrite par la diapositive.
   *
   * Sans ce contrôle, un texte trop long passe simplement SOUS le filet du pied
   * et se superpose à l'adresse du site : l'image reste valide, le script ne
   * dit rien, et le défaut ne se voit qu'une fois le carrousel publié. Deux
   * diapositives sont sorties comme ça. On déclare donc la limite et on la
   * vérifie, plutôt que de compter sur la relecture.
   */
  const PLANCHER = H - 168; // le filet du pied est à H-132 ; on garde une gouttière

  function cadre(numero, total, contenu, { pied = "adn-network.netlify.app", bas } = {}) {
    if (bas !== undefined && bas > PLANCHER) {
      throw new Error(
        `Diapositive ${numero} : le contenu descend à ${Math.round(bas)} px, ` +
          `pour ${PLANCHER} px disponibles avant le pied de page.`,
      );
    }
    const verticales = [L / 4, L / 2, (L * 3) / 4]
      .map((x) => `<rect x="${x}" y="0" width="1" height="${H}" fill="#0f0f13"/>`)
      .join("");

    const entete =
      bloc({
        x: M,
        y: 104,
        texte: "ADN°NETWORK",
        fonte: "monoMedium",
        taille: 21,
        ls: 6,
        fill: C.fog,
      }).svg +
      bloc({
        x: L - M,
        y: 104,
        texte: `${String(numero).padStart(2, "0")} / ${total}`,
        fonte: "mono",
        taille: 21,
        ls: 3,
        fill: C.steel,
        anchor: "end",
      }).svg;

    const basPied =
      filet(M, H - 132, U, C.steel, 1) +
      bloc({ x: M, y: H - 86, texte: pied, fonte: "mono", taille: 20, fill: C.fog }).svg +
      bloc({
        x: L - M,
        y: H - 86,
        texte: `${site.base.city} — ${site.base.country}`,
        fonte: "mono",
        taille: 20,
        fill: C.steel,
        anchor: "end",
      }).svg;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
<rect width="${L}" height="${H}" fill="${C.void}"/>
${verticales}
${entete}
${contenu}
${basPied}
</svg>`;
  }

  /** Label + titre : l'ouverture de toutes les diapositives de contenu. */
  function tete(label, titre, { taille = 76, y = 300, couleur = C.bone } = {}) {
    const l = bloc({
      x: M,
      y: y - 74,
      texte: label,
      fonte: "monoMedium",
      taille: 20,
      ls: 5,
      fill: C.signal,
    });
    const t = bloc({
      x: M,
      y,
      texte: titre,
      fonte: "bold",
      taille,
      interligne: 1.06,
      fill: couleur,
      largeurMax: U,
    });
    return { svg: l.svg + t.svg, bas: y + t.hauteur };
  }

  const diapos = [];

  /* ══ 01 — Couverture ═══════════════════════════════════════════════════ */
  {
    const tailleMot = ajuste("black", "NETWORK", U);
    const yADN = 600;
    const yNET = yADN + tailleMot * 0.84;

    const contenu = [
      bloc({
        x: M,
        y: 300,
        texte: `${site.founded} — ${site.tagline.join(" / ").toUpperCase()}`,
        fonte: "monoMedium",
        taille: 21,
        ls: 5,
        fill: C.fog,
      }).svg,
      `<text x="${M}" y="${yADN}" font-family="Archivo Black" font-size="${tailleMot.toFixed(1)}" fill="${C.bone}">ADN</text>`,
      `<text x="${M}" y="${yNET.toFixed(1)}" font-family="Archivo Black" font-size="${tailleMot.toFixed(1)}" fill="none" stroke="${C.bone}" stroke-width="2.5">NETWORK</text>`,
      pastilles(M, yNET + 52, U, 12, 14),
      bloc({
        x: M,
        y: yNET + 190,
        texte: "Un réseau,\nplutôt qu'un catalogue.",
        fonte: "bold",
        taille: 60,
        interligne: 1.1,
        fill: C.signal,
        largeurMax: U,
      }).svg,
      bloc({
        x: M,
        y: yNET + 340,
        texte: `${vedettes.items.length} prestations · ${services.length} disciplines · ${projects.length} réalisations publiées`,
        fonte: "mono",
        taille: 23,
        fill: C.fog,
        largeurMax: U,
      }).svg,
      bloc({
        x: M,
        y: H - 190,
        texte: "→  faites glisser",
        fonte: "monoMedium",
        taille: 22,
        ls: 3,
        fill: C.steel,
      }).svg,
    ].join("\n");

    diapos.push(cadre(1, 10, contenu));
  }

  /* ══ 02 — Ce qui manque ════════════════════════════════════════════════ */
  {
    const t = tete("CE QUI MANQUE", "Votre compétence\nn'est pas en cause.", { taille: 82 });
    const corps = bloc({
      x: M,
      y: t.bas + 130,
      texte: "Ce qui manque, c'est la page qui la rend évidente en trente secondes.",
      fonte: "regular",
      taille: 38,
      interligne: 1.42,
      fill: C.bone,
      largeurMax: U,
    });
    const note = bloc({
      x: M + 28,
      y: corps.suivant + 190,
      texte:
        "Un numéro WhatsApp et trois photos ne se transmettent pas. Une adresse se colle dans une conversation, s'ouvre sur un téléphone d'occasion, et répond avant vous — y compris la nuit, y compris pendant que vous travaillez.",
      fonte: "mono",
      taille: 27,
      interligne: 1.85,
      fill: C.fog,
      largeurMax: U - 28,
    });
    diapos.push(
      cadre(
        2,
        10,
        t.svg +
          corps.svg +
          `<rect x="${M}" y="${corps.suivant + 152}" width="3" height="${note.hauteur + 40}" fill="${C.signal}"/>` +
          note.svg,
        { bas: note.bas },
      ),
    );
  }

  /* ══ 03 — Les dix disciplines ══════════════════════════════════════════ */
  {
    const t = tete("LE PÉRIMÈTRE", `${services.length} disciplines,\nun code couleur.`, {
      taille: 76,
    });
    const y = t.bas + 112;
    const pas = 70;
    const lignes = services
      .map((s, i) => {
        const yy = y + i * pas;
        const couleur = C[s.id] || C.bone;
        return (
          `<rect x="${M}" y="${yy - 26}" width="26" height="26" fill="${couleur}"/>` +
          bloc({ x: M + 52, y: yy, texte: s.name, fonte: "bold", taille: 34, fill: C.bone }).svg +
          bloc({
            x: L - M,
            y: yy,
            texte: String(i + 1).padStart(2, "0"),
            fonte: "mono",
            taille: 22,
            fill: C.steel,
            anchor: "end",
          }).svg +
          filet(M, yy + 26, U, "#17171c", 1)
        );
      })
      .join("");
    diapos.push(cadre(3, 10, t.svg + lignes, { bas: y + (services.length - 1) * pas + 26 }));
  }

  /* ══ 04 — Les dix prestations, chiffrées ═══════════════════════════════ */
  {
    const t = tete("CE QU'ON PEUT COMMANDER", "Dix prestations,\nnommées et chiffrées.", {
      taille: 66,
      y: 286,
    });
    const y = t.bas + 118;
    const pas = 66;
    const lignes = vedettes.items
      .map((v, i) => {
        const yy = y + i * pas;
        const couleur = C[v.id] || C.signal;
        return (
          `<rect x="${M}" y="${yy - 22}" width="4" height="24" fill="${couleur}"/>` +
          bloc({
            x: M + 24,
            y: yy,
            texte: v.name,
            fonte: "monoMedium",
            taille: 27,
            fill: C.bone,
          }).svg +
          bloc({
            x: L - M,
            y: yy,
            texte: prix(v.prix),
            fonte: "mono",
            taille: 27,
            fill: C.signal,
            anchor: "end",
          }).svg +
          filet(M, yy + 24, U, "#17171c", 1)
        );
      })
      .join("");
    const pied = bloc({
      x: M,
      y: y + 9 * pas + 82,
      texte: `Des planchers, ${vedettes.from} : la charge réelle se fixe au brief.`,
      fonte: "mono",
      taille: 22,
      fill: C.fog,
      largeurMax: U,
    });
    diapos.push(cadre(4, 10, t.svg + lignes + pied.svg, { bas: pied.bas }));
  }

  /* ══ 05 — Les montants ═════════════════════════════════════════════════ */
  {
    const t = tete("LES MONTANTS", "Ce n'est pas\nun rabais.", { taille: 86 });
    const corps = bloc({
      x: M,
      y: t.bas + 140,
      texte: vedettes.prixNote,
      fonte: "regular",
      taille: 37,
      interligne: 1.5,
      fill: C.bone,
      largeurMax: U,
    });
    const note = bloc({
      x: M,
      y: corps.suivant + 150,
      texte:
        "Aucune date limite, aucun compte à rebours. Un prix qui expire est un prix qu'on n'assumait pas.",
      fonte: "mono",
      taille: 26,
      interligne: 1.8,
      fill: C.fog,
      largeurMax: U,
    });
    diapos.push(
      cadre(5, 10, t.svg + corps.svg + filet(M, corps.suivant + 82, 180, C.signal, 3) + note.svg, {
        bas: note.bas,
      }),
    );
  }

  /* ══ 06 — Les trois liaisons ═══════════════════════════════════════════ */
  {
    /* Le titre du site — « Ce qui en fait un réseau plutôt qu'un catalogue » —
       redirait mot pour mot la couverture, trois écrans plus tôt. Sur une page
       qu'on parcourt de haut en bas la répétition passe ; dans un carrousel où
       chaque vue est isolée, elle donne l'impression d'avoir glissé pour rien. */
    const t = tete("CE QUI RELIE", "Trois choses\nqui ne se vendent pas.", { taille: 68 });
    let y = t.bas + 130;
    const blocs = vedettes.liaisons
      .map((l) => {
        const nom = bloc({ x: M, y, texte: l.name, fonte: "bold", taille: 42, fill: C.bone });
        const cout = bloc({
          x: L - M,
          y,
          texte: l.cout,
          fonte: "monoMedium",
          taille: 22,
          fill: C.signal,
          anchor: "end",
        });
        const gain = bloc({
          x: M,
          y: y + 54,
          texte: l.promesse,
          fonte: "mono",
          taille: 24,
          interligne: 1.7,
          fill: C.fog,
          largeurMax: U,
        });
        const svg = filet(M, y - 62, U, C.steel, 1) + nom.svg + cout.svg + gain.svg;
        y = gain.suivant + 100;
        return svg;
      })
      .join("");

    /* La dernière phrase de l'accroche du site, reprise telle quelle : c'est
       elle qui porte l'argument, et elle est déjà écrite. */
    const chute = bloc({
      x: M,
      y: y - 62 + 74,
      texte: vedettes.liaisonsLead.split(". ").pop(),
      fonte: "bold",
      taille: 34,
      interligne: 1.28,
      fill: C.signal,
      largeurMax: U,
    });

    diapos.push(
      cadre(6, 10, t.svg + blocs + filet(M, y - 62, U, C.steel, 1) + chute.svg, { bas: chute.bas }),
    );
  }

  /* ══ 07 — Le schéma ════════════════════════════════════════════════════ */
  {
    const t = tete("LE SCHÉMA", "Ce qui entre,\net ce qui repart.", { taille: 68 });
    const yHaut = t.bas + 150;
    const largeurPorte = (U - 2 * 26) / 3;

    const portes = [
      { nom: "Un guide", detail: "FullMesh Shop" },
      { nom: vitrine.formules[0].name, detail: prix(vitrine.formules[0].prix) },
      { nom: "Un parcours", detail: prix(Math.min(...vedettes.items.map((v) => v.prix))) },
    ];

    const boitesHaut = portes
      .map((p, i) => {
        const x = M + i * (largeurPorte + 26);
        return (
          `<rect x="${x.toFixed(1)}" y="${yHaut}" width="${largeurPorte.toFixed(1)}" height="104" fill="${C.graphite}" stroke="${C.steel}" stroke-width="1.5"/>` +
          bloc({
            x: x + 20,
            y: yHaut + 46,
            texte: p.nom,
            fonte: "monoMedium",
            taille: 22,
            fill: C.bone,
          }).svg +
          bloc({ x: x + 20, y: yHaut + 78, texte: p.detail, fonte: "mono", taille: 19, fill: C.fog })
            .svg
        );
      })
      .join("");

    const yAnn = yHaut + 230;
    const centres = portes.map((_, i) => M + i * (largeurPorte + 26) + largeurPorte / 2);
    const traits = centres
      .map(
        (cx) =>
          `<path d="M ${cx.toFixed(1)} ${yHaut + 104} C ${cx.toFixed(1)} ${yHaut + 170}, 540 ${yHaut + 160}, 540 ${yAnn}" fill="none" stroke="${C.steel}" stroke-width="2" stroke-dasharray="7 7"/>`,
      )
      .join("");

    const annH = 132;
    const annuaire =
      `<rect x="${M + 150}" y="${yAnn}" width="${U - 300}" height="${annH}" fill="${C.signal}" opacity="0.08"/>` +
      `<rect x="${M + 150}" y="${yAnn}" width="${U - 300}" height="${annH}" fill="none" stroke="${C.signal}" stroke-width="2"/>` +
      bloc({
        x: 540,
        y: yAnn + 50,
        texte: "LE POINT COMMUN",
        fonte: "mono",
        taille: 18,
        ls: 4,
        fill: C.signal,
        anchor: "middle",
      }).svg +
      bloc({
        x: 540,
        y: yAnn + 102,
        texte: "L'ANNUAIRE",
        fonte: "black",
        taille: 42,
        fill: C.bone,
        anchor: "middle",
      }).svg;

    const yBas = yAnn + annH + 140;
    const largeurRetour = U / 2 - 16;
    const retours = [
      { nom: "Le Parrainage", detail: "20 % de sa 1re commande", couleur: C.food, x: M },
      {
        nom: "La Mise en relation",
        detail: "une demande repart",
        couleur: C.network,
        x: M + U / 2 + 16,
      },
    ];

    const boitesBas = retours
      .map(
        (r) =>
          `<rect x="${r.x}" y="${yBas}" width="${largeurRetour}" height="104" fill="${C.carbon}" stroke="${r.couleur}" stroke-width="1.5"/>` +
          bloc({
            x: r.x + 20,
            y: yBas + 46,
            texte: r.nom,
            fonte: "monoMedium",
            taille: 22,
            fill: r.couleur,
          }).svg +
          bloc({ x: r.x + 20, y: yBas + 78, texte: r.detail, fonte: "mono", taille: 18, fill: C.fog })
            .svg,
      )
      .join("");

    /* Les deux descentes depuis l'annuaire, puis la remontée par les marges :
       sans les flèches de retour, le dessin serait un entonnoir de vente. */
    const descentes = retours
      .map((r) => {
        const cx = r.x + largeurRetour / 2;
        return `<path d="M 540 ${yAnn + annH} C 540 ${yAnn + annH + 70}, ${cx} ${yAnn + annH + 60}, ${cx} ${yBas}" fill="none" stroke="${r.couleur}" stroke-width="2" stroke-dasharray="8 8" opacity="0.8"/>`;
      })
      .join("");

    /**
     * Les deux remontées, en COURBES.
     *
     * Tracées en angles droits le long des marges, elles se refermaient en
     * rectangle autour du dessin : l'œil y lisait un cadre décoratif, et le
     * seul message du schéma — quelque chose repart vers les membres — était
     * perdu. Une courbe se lit comme un mouvement, un angle droit comme une
     * bordure.
     */
    const remontees = retours
      .map((r, i) => {
        const gauche = i === 0;
        const depart = gauche ? r.x : r.x + largeurRetour;
        const arrivee = gauche ? M : M + U;
        const ctrl = gauche ? 22 : L - 22;
        const yD = yBas + 52;
        const yA = yHaut + 52;
        const pointe = gauche ? 1 : -1;
        return (
          `<path d="M ${depart} ${yD} C ${ctrl} ${yD}, ${ctrl} ${yA}, ${arrivee} ${yA}" fill="none" stroke="${r.couleur}" stroke-width="2" stroke-dasharray="8 8" opacity="0.85"/>` +
          `<path d="M ${arrivee - pointe * 16} ${yA - 9} L ${arrivee} ${yA} L ${arrivee - pointe * 16} ${yA + 9}" fill="none" stroke="${r.couleur}" stroke-width="2"/>`
        );
      })
      .join("");

    diapos.push(
      cadre(7, 10, t.svg + remontees + descentes + traits + boitesHaut + annuaire + boitesBas, {
        bas: yBas + 104,
      }),
    );
  }

  /* ══ 08 — Les démonstrations ═══════════════════════════════════════════ */
  {
    const demos = [];
    for (const v of vedettes.items) {
      for (const d of v.demo || []) {
        const base = d.href.split("#")[0];
        if (!demos.some((x) => x.href === base)) demos.push({ href: base, texte: d.texte, id: v.id });
      }
    }

    const t = tete("À MANIPULER", `${demos.length} démonstrations\nouvertes.`, { taille: 72 });
    const y = t.bas + 150;
    const pas = 116;
    const lignes = demos
      .map((d, i) => {
        const yy = y + i * pas;
        return (
          filet(M, yy - 54, U, C.steel, 1) +
          bloc({
            x: M,
            y: yy,
            texte: d.texte,
            fonte: "bold",
            taille: 33,
            fill: C.bone,
            largeurMax: U,
          }).svg +
          bloc({
            x: M,
            y: yy + 38,
            texte: `${site.url.replace("https://", "")}${d.href}`,
            fonte: "mono",
            taille: 20,
            fill: C[d.id] || C.fog,
          }).svg
        );
      })
      .join("");
    const note = bloc({
      x: M,
      y: y + (demos.length - 1) * pas + 96,
      texte:
        "Entreprises et chiffres fictifs, écrit sur chaque page. Ce sont des livrables ouvrables, pas des captures d'écran.",
      fonte: "mono",
      taille: 22,
      interligne: 1.8,
      fill: C.fog,
      largeurMax: U,
    });
    diapos.push(
      cadre(
        8,
        10,
        t.svg + lignes + filet(M, y + (demos.length - 1) * pas + 46, U, C.steel, 1) + note.svg,
        { bas: note.bas },
      ),
    );
  }

  /* ══ 09 — L'état réel ══════════════════════════════════════════════════ */
  {
    const t = tete(
      vedettes.etatTitre.toUpperCase(),
      "L'annuaire ne contient\nencore que nos\npropres projets.",
      { taille: 62 },
    );
    const corps = bloc({
      x: M + 32,
      y: t.bas + 160,
      texte:
        "Nous préférons l'écrire plutôt que de vous laisser le découvrir : un réseau qui se prétend plein quand il est vide perd tout ce qu'il a construit à la première recherche.",
      fonte: "regular",
      taille: 31,
      interligne: 1.55,
      fill: C.bone,
      largeurMax: U - 32,
    });
    const chute = bloc({
      x: M,
      y: corps.suivant + 120,
      texte: "La première place\ny vaut mieux que la centième.",
      fonte: "bold",
      taille: 46,
      interligne: 1.2,
      fill: C.signal,
      largeurMax: U,
    });
    diapos.push(
      cadre(
        9,
        10,
        t.svg +
          `<rect x="${M}" y="${t.bas + 122}" width="3" height="${corps.hauteur + 44}" fill="${C.signal}"/>` +
          corps.svg +
          chute.svg,
        { bas: chute.bas },
      ),
    );
  }

  /* ══ 10 — Entrer ═══════════════════════════════════════════════════════ */
  {
    const t = tete("ENTRER", "On entre\npar où l'on peut.", { taille: 80 });
    const parcours = vedettes.items.find((v) => v.id === "network");
    /* Le nom de la boutique, pas le titre éditorial de la page : « Un peu de
       tout, pourvu que ça serve » est une bonne accroche et un mauvais nom de
       porte — personne ne saurait quoi taper pour la retrouver. */
    const enseigne = boutique.kicker.split(" — ")[0];
    const entrees = [
      { nom: enseigne, detail: "des guides — fullmeshshop.mychariow.market" },
      { nom: vitrine.formules[0].name, detail: `${prix(vitrine.formules[0].prix)} — une page publiée à votre nom` },
      { nom: parcours.name, detail: `${prix(parcours.prix)} — la formation et la mise en relation` },
    ];
    const y = t.bas + 150;
    const pas = 122;
    const lignes = entrees
      .map((e, i) => {
        const yy = y + i * pas;
        return (
          filet(M, yy - 54, U, C.steel, 1) +
          bloc({ x: M, y: yy, texte: e.nom, fonte: "bold", taille: 36, fill: C.bone }).svg +
          bloc({ x: M, y: yy + 38, texte: e.detail, fonte: "mono", taille: 20, fill: C.fog, largeurMax: U })
            .svg
        );
      })
      .join("");

    const yc = y + entrees.length * pas + 34;
    const contact =
      filet(M, yc - 54, U, C.steel, 1) +
      bloc({ x: M, y: yc, texte: site.whatsapp.display, fonte: "monoMedium", taille: 27, fill: C.signal })
        .svg +
      bloc({
        x: M,
        y: yc + 40,
        texte: site.url.replace("https://", ""),
        fonte: "mono",
        taille: 23,
        fill: C.bone,
      }).svg;

    const cta = bloc({
      x: M,
      y: H - 200,
      texte: site.cta,
      fonte: "black",
      taille: ajuste("black", site.cta, U),
      fill: C.bone,
    });

    diapos.push(
      cadre(10, 10, t.svg + lignes + contact + cta.svg, {
        pied: `${site.owner.name} — ${site.owner.role}`,
        bas: cta.bas,
      }),
    );
  }

  /* ── Rendu ─────────────────────────────────────────────────────────────── */
  const fichiers = [];
  for (let i = 0; i < diapos.length; i++) {
    const nom = path.join(SORTIE, `${String(i + 1).padStart(2, "0")}.png`);
    await rendre(diapos[i], nom);
    fichiers.push(nom);
    console.log(`  ${path.basename(nom)}`);
  }

  /* ── Le PDF, pour le post « document » ─────────────────────────────────── */
  const { ecrirePdf } = require("./lib/pdf");
  const pages = [];
  for (const f of fichiers) {
    pages.push({
      largeur: L,
      hauteur: H,
      jpeg: await sharp(f)
        .flatten({ background: C.void })
        .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
        .toBuffer(),
    });
  }
  const pdf = path.join(ICI, "ADN-NETWORK-carrousel.pdf");
  ecrirePdf(pages, pdf, "ADN NETWORK - un reseau plutot qu un catalogue");
  console.log(`  ${path.basename(pdf)} (${(fs.statSync(pdf).size / 1024).toFixed(0)} Ko)`);

  /* ══════════════════════════════════════════════════════════════════════════
     LES FORMATS PAYSAGE
     ════════════════════════════════════════════════════════════════════════ */

  /**
   * Le bloc de marque : « ADN » plein, « NETWORK » en filaire dessous.
   *
   * C'est le traitement de la page d'accueil et de l'image de partage. Il est
   * écrit une fois et posé à trois échelles : la bannière, l'image de post et
   * l'aperçu de lien doivent être reconnaissables comme un même objet.
   */
  function marque(x, yBase, largeur) {
    const taille = ajuste("black", "NETWORK", largeur);
    const yNet = yBase + taille * 0.84;
    return {
      svg:
        `<text x="${x}" y="${yBase.toFixed(1)}" font-family="Archivo Black" font-size="${taille.toFixed(1)}" fill="${C.bone}">ADN</text>` +
        `<text x="${x}" y="${yNet.toFixed(1)}" font-family="Archivo Black" font-size="${taille.toFixed(1)}" fill="none" stroke="${C.bone}" stroke-width="${(taille / 52).toFixed(2)}">NETWORK</text>`,
      bas: yNet,
      taille,
    };
  }

  /** Le voile vert très sourd de l'image de partage d'origine, reconduit. */
  const voile = (l, h) =>
    `<defs><radialGradient id="v" cx="62%" cy="26%" r="72%">` +
    `<stop offset="0%" stop-color="${C.signal}" stop-opacity="0.085"/>` +
    `<stop offset="100%" stop-color="${C.signal}" stop-opacity="0"/>` +
    `</radialGradient></defs><rect width="${l}" height="${h}" fill="url(#v)"/>`;

  const barres = (l, h) =>
    [l / 4, l / 2, (l * 3) / 4]
      .map((x) => `<rect x="${x.toFixed(0)}" y="0" width="1" height="${h}" fill="#0f0f13"/>`)
      .join("");

  /**
   * L'IMAGE DE PARTAGE DU SITE — refaite ici, et pas ailleurs.
   *
   * C'est exactement ce que LinkedIn affiche quand on colle l'adresse du site
   * dans un post : la vignette du lien, c'est `public/og.png`. Elle datait
   * d'août et portait SEPT pastilles de discipline alors que le site en compte
   * dix depuis. Une image de marque qui contredit la page qu'elle annonce est
   * le genre de détail que personne ne signale et que tout le monde enregistre.
   */
  {
    const l = 1200;
    const h = 630;
    const x = 80;
    const m = marque(x, 296, 900);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${h}" viewBox="0 0 ${l} ${h}">
<rect width="${l}" height="${h}" fill="${C.void}"/>
${voile(l, h)}
${barres(l, h)}
${bloc({ x, y: 92, texte: "ADN°NETWORK", fonte: "monoMedium", taille: 15, ls: 7, fill: C.fog }).svg}
${m.svg}
${pastilles(x, m.bas + 44, 300, 8, 10)}
${bloc({ x, y: m.bas + 122, texte: site.tagline.join(" / ").toUpperCase(), fonte: "monoMedium", taille: 18, ls: 5, fill: C.bone }).svg}
${bloc({ x, y: m.bas + 162, texte: `${site.base.city} — ${site.base.country}`, fonte: "mono", taille: 15, ls: 3, fill: C.fog }).svg}
</svg>`;
    const cible = path.join(RACINE, "public", "og.png");
    await rendre(svg, cible);
    console.log(`  public/og.png (${services.length} pastilles)`);
  }

  /** L'image d'un post à lien simple : 1200 × 627, le format du fil. */
  {
    const l = 1200;
    const h = 627;
    const x = 80;
    const m = marque(x, 250, 660);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${h}" viewBox="0 0 ${l} ${h}">
<rect width="${l}" height="${h}" fill="${C.void}"/>
${voile(l, h)}
${barres(l, h)}
${bloc({ x, y: 92, texte: "ADN°NETWORK", fonte: "monoMedium", taille: 15, ls: 7, fill: C.fog }).svg}
${m.svg}
${pastilles(x, m.bas + 40, 300, 8, 10)}
${bloc({ x, y: m.bas + 122, texte: "Un réseau,\nplutôt qu'un catalogue.", fonte: "bold", taille: 52, interligne: 1.08, fill: C.signal, largeurMax: l - x * 2 }).svg}
${bloc({ x, y: h - 62, texte: `${vedettes.items.length} prestations · ${vedettes.liaisons.length} liaisons · ${site.url.replace("https://", "")}`, fonte: "mono", taille: 19, fill: C.fog, largeurMax: l - x * 2 }).svg}
</svg>`;
    await rendre(svg, path.join(ICI, "post-1200x627.png"));
    console.log("  post-1200x627.png");
  }

  /**
   * La bannière de profil — 1584 × 396.
   *
   * La photo de profil vient se poser en BAS À GAUCHE et mange un disque
   * d'environ 300 px. Tout ce qui compte est donc décalé vers la droite : une
   * bannière dont la moitié du message passe sous l'avatar est une bannière
   * qu'on refait un mois plus tard.
   */
  {
    const l = 1584;
    const h = 396;
    const x = 420;
    const m = marque(x, 168, 420);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${h}" viewBox="0 0 ${l} ${h}">
<rect width="${l}" height="${h}" fill="${C.void}"/>
${voile(l, h)}
${barres(l, h)}
${m.svg}
${pastilles(x, m.bas + 30, 260, 7, 9)}
${bloc({ x: l - 132, y: 176, texte: "Un réseau,", fonte: "bold", taille: 40, fill: C.signal, anchor: "end" }).svg}
${bloc({ x: l - 132, y: 222, texte: "plutôt qu'un catalogue.", fonte: "bold", taille: 40, fill: C.signal, anchor: "end" }).svg}
${bloc({ x: l - 132, y: 272, texte: `${site.base.city} — ${site.url.replace("https://", "")}`, fonte: "mono", taille: 19, fill: C.fog, anchor: "end" }).svg}
</svg>`;
    await rendre(svg, path.join(ICI, "banniere-1584x396.png"));
    console.log("  banniere-1584x396.png");
  }

  console.log(`\n${fichiers.length} diapositives, le PDF, 2 formats paysage → kit-linkedin/`);
}

main().catch((e) => {
  console.error("\n✖", e.message);
  process.exit(1);
});
