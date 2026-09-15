/**
 * LES CAPTURES DU SITE RÉEL.
 *
 *     node kit-linkedin/captures.js
 *
 * Le carrousel typographique disait ce que fait ADN NETWORK sans jamais le
 * MONTRER. C'est le défaut classique d'une présentation de studio : on décrit
 * un savoir-faire visuel avec des mots. Ces captures existent pour qu'un
 * lecteur voie la chose avant de lire ce qu'on en dit.
 *
 * Elles sont prises sur `out/`, la sortie du dernier build, servie en local —
 * donc sur le code du dépôt, pas sur le déploiement en ligne. Et elles sont
 * REGÉNÉRABLES : après une refonte visuelle, une commande suffit, là où un
 * dossier de captures prises à la main vieillit sans que personne s'en
 * aperçoive.
 */
const fs = require("fs");
const path = require("path");

const ICI = __dirname;
const RACINE = path.join(ICI, "..");
const SORTIE = path.join(ICI, "site");
const EXPORT = path.join(RACINE, "out");

/* sharp est pris directement, pas via `lib/dessin` : les captures n'écrivent
   aucun texte, donc elles n'ont pas besoin de la configuration des fontes ni
   de la relance de processus qu'elle impose. */
const sharp = require(path.join(RACINE, "node_modules", "sharp"));

/* ── Ce qu'on capture ────────────────────────────────────────────────────── */

const BUREAU = { largeur: 1440, hauteur: 900 };
const TELEPHONE = { largeur: 390, hauteur: 844, mobile: true };

const PLANS = [
  { nom: "accueil", url: "/", cadre: BUREAU },
  { nom: "accueil-telephone", url: "/", cadre: TELEPHONE },
  { nom: "disciplines", url: "/", cadre: BUREAU, vers: "#services" },
  { nom: "realisations", url: "/", cadre: BUREAU, vers: "#work" },

  { nom: "services", url: "/services", cadre: BUREAU },
  { nom: "services-prix", url: "/services", cadre: BUREAU, vers: ".vd-item" },
  { nom: "services-telephone", url: "/services", cadre: TELEPHONE, vers: ".vd-item" },
  { nom: "schema-reseau", url: "/services", cadre: BUREAU, vers: ".vd-liaisons" },

  { nom: "vitrine", url: "/vitrine", cadre: BUREAU },
  { nom: "boutique", url: "/boutique", cadre: BUREAU },
  { nom: "projet", url: "/work/full-mesh", cadre: BUREAU },

  { nom: "demo-pilotage", url: "/demo/pilotage/", cadre: BUREAU },
  { nom: "demo-site", url: "/demo/site/", cadre: BUREAU },
  { nom: "demo-reseau", url: "/demo/reseau/", cadre: BUREAU },
  { nom: "demo-ia", url: "/demo/ia/", cadre: BUREAU },
];

async function main() {
  if (!fs.existsSync(path.join(EXPORT, "index.html"))) {
    throw new Error("Le dossier out/ est absent — lancer `npm run build` d'abord.");
  }

  const { demarrer } = require("./lib/serveur");
  const { ouvrir } = require("./lib/navigateur");

  fs.mkdirSync(SORTIE, { recursive: true });

  const { serveur, base } = await demarrer(EXPORT);
  const nav = await ouvrir();
  const manques = [];

  try {
    let cadreCourant = null;
    for (const plan of PLANS) {
      const cle = JSON.stringify(plan.cadre);
      if (cle !== cadreCourant) {
        await nav.cadrer(plan.cadre);
        cadreCourant = cle;
      }

      await nav.aller(base + plan.url);

      if (plan.vers) {
        const etat = await nav.placer(plan.vers, { decalage: -1 });
        if (etat === "absent") manques.push(`${plan.nom} → ${plan.vers}`);
      } else {
        await nav.placer(null);
      }

      const fichier = path.join(SORTIE, `${plan.nom}.png`);
      await nav.capturer(fichier);

      /* Le navigateur compresse à peine ce qu'il exporte : repasser l'image
         par l'encodeur la divise par deux, SANS TOUCHER À UN SEUL PIXEL —
         c'est du PNG, donc sans perte. Sur quinze captures en haute densité,
         ce sont sept mégaoctets de moins dans le dépôt pour une image
         strictement identique. */
      const brut = fs.readFileSync(fichier);
      await sharp(brut).png({ compressionLevel: 9, effort: 10 }).toFile(fichier);

      const ko = (fs.statSync(fichier).size / 1024).toFixed(0);
      console.log(
        `  ${plan.nom}.png`.padEnd(30) +
          `${plan.cadre.largeur}×${plan.cadre.hauteur} · ${ko} Ko` +
          `  (−${Math.round(100 - (fs.statSync(fichier).size / brut.length) * 100)} %)`,
      );
    }
  } finally {
    await nav.fermer();
    serveur.close();
  }

  /* Un sélecteur introuvable ne casse pas la capture : elle sort simplement
     cadrée en haut de page, ce qui ressemble à une capture réussie. On le dit. */
  if (manques.length) {
    throw new Error(`Sélecteurs introuvables :\n  ${manques.join("\n  ")}`);
  }

  console.log(`\n${PLANS.length} captures → kit-linkedin/site/`);
}

main().catch((e) => {
  console.error("\n✖", e.message);
  process.exit(1);
});
