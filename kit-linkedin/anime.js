/**
 * L'ANIMATION DU RÉSEAU — une boucle, sans logiciel de montage.
 *
 *     node kit-linkedin/anime.js
 *
 * POURQUOI UN GIF ET PAS UNE VIDÉO
 *
 * Il n'y a pas d'encodeur vidéo sur cette machine, et en installer un pour
 * deux secondes d'animation serait disproportionné. Le GIF, lui, se publie
 * directement sur LinkedIn, qui le convertit en vidéo à la lecture — le
 * résultat visible est le même, sans la chaîne de production.
 *
 * Ce que ça ne remplace pas : la vidéo de présentation décrite dans
 * SCRIPT-VIDEO.md, qui montre quelqu'un manipuler le site. Celle-là demande un
 * enregistrement d'écran et une voix. Cette boucle-ci sert d'autre chose :
 * illustrer la seule idée que le carrousel a du mal à faire passer à l'arrêt,
 * à savoir que quelque chose REPART de l'annuaire vers les membres.
 *
 * Le dessin vient de `lib/schema.js` — le même que la diapositive 09. Une
 * animation redessinée à part aurait divergé au premier changement de prix.
 */
const fs = require("fs");
const path = require("path");

const ICI = __dirname;
const RACINE = path.join(ICI, "..");

const creerJiti = require(path.join(RACINE, "node_modules", "jiti"));
const jiti = (creerJiti.default || creerJiti)(__filename, {
  alias: { "@": path.join(RACINE, "src") },
  interopDefault: true,
});
const { vedettes } = jiti(path.join(RACINE, "src/content/vedettes.ts"));
const { vitrine } = jiti(path.join(RACINE, "src/content/vitrine.ts"));
const { site } = jiti(path.join(RACINE, "src/content/site.ts"));
const { formatPrix } = jiti(path.join(RACINE, "src/lib/prix.ts"));

const prix = (n) => formatPrix(n, "fr", vedettes.currency);

/* ── Format ──────────────────────────────────────────────────────────────── */
const L = 1080;
const H = 800;
const LARGEUR_SCHEMA = 860;
const IMAGES = 30; // 30 × 60 ms = 1,8 s de boucle
const DELAI = 60;

async function main() {
  const { assurerFontes, relancerAvecFontes } = require("./lib/fontes");
  await assurerFontes();
  relancerAvecFontes(__filename);

  const { C, bloc, filet, rendre, verifierFontes, sharp } = require("./lib/dessin");
  const { schemaReseau } = require("./lib/schema");
  await verifierFontes();

  const portes = [
    { nom: "Un guide", detail: "FullMesh Shop" },
    { nom: vitrine.formules[0].name, detail: prix(vitrine.formules[0].prix) },
    { nom: "Un parcours", detail: prix(Math.min(...vedettes.items.map((v) => v.prix))) },
  ];
  const retours = [
    { nom: "Le Parrainage", detail: "20 % de sa 1re commande", couleur: C.food, x: 0 },
    {
      nom: "La Mise en relation",
      detail: "une demande repart",
      couleur: C.network,
      x: LARGEUR_SCHEMA / 2 + 16,
    },
  ];

  const decalX = Math.round((L - LARGEUR_SCHEMA) / 2);
  const decalY = 118;

  const entete =
    bloc({ x: 64, y: 66, texte: "ADN°NETWORK", fonte: "monoMedium", taille: 20, ls: 6, fill: C.fog })
      .svg +
    bloc({
      x: L - 64,
      y: 66,
      texte: "CE QUI ENTRE, ET CE QUI REPART",
      fonte: "mono",
      taille: 18,
      ls: 3,
      fill: C.signal,
      anchor: "end",
    }).svg;

  const pied =
    filet(64, H - 78, L - 128, C.steel, 1) +
    bloc({
      x: 64,
      y: H - 40,
      texte: site.url.replace("https://", ""),
      fonte: "mono",
      taille: 19,
      fill: C.fog,
    }).svg +
    bloc({
      x: L - 64,
      y: H - 40,
      texte: `${site.base.city} — ${site.base.country}`,
      fonte: "mono",
      taille: 19,
      fill: C.steel,
      anchor: "end",
    }).svg;

  const temporaire = fs.mkdtempSync(path.join(require("os").tmpdir(), "adn-anim-"));
  const images = [];

  for (let i = 0; i < IMAGES; i++) {
    const sch = schemaReseau({
      C,
      bloc,
      largeur: LARGEUR_SCHEMA,
      portes,
      retours,
      phase: i / IMAGES,
    });

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">` +
      `<rect width="${L}" height="${H}" fill="${C.void}"/>` +
      [L / 4, L / 2, (L * 3) / 4]
        .map((x) => `<rect x="${x}" y="0" width="1" height="${H}" fill="#0f0f13"/>`)
        .join("") +
      entete +
      `<g transform="translate(${decalX}, ${decalY})">${sch.svg}</g>` +
      pied +
      `</svg>`;

    const f = path.join(temporaire, `${String(i).padStart(3, "0")}.png`);
    await rendre(svg, f);
    images.push(f);
  }

  /* Palette réduite : un GIF de 30 images en 1080 px pèse vite trop lourd pour
     LinkedIn. Le dessin n'utilise qu'une douzaine de teintes, donc la
     réduction ne se voit pas — sauf sur les dégradés, qu'il n'y a pas ici. */
  const sortie = path.join(ICI, "schema-anime.gif");
  /* `delay` doit être un TABLEAU, une entrée par image. Passé en nombre, il
     n'est appliqué qu'à la première : les vingt-neuf autres sortent à 0 ms,
     et la boucle défile alors à la vitesse que le lecteur veut bien lui
     donner. Vérifié dans les métadonnées du fichier produit, pas supposé. */
  await sharp(images, { join: { animated: true } })
    .gif({ loop: 0, delay: new Array(IMAGES).fill(DELAI), colours: 64, effort: 10 })
    .toFile(sortie);

  fs.rmSync(temporaire, { recursive: true, force: true });

  const ko = fs.statSync(sortie).size / 1024;
  console.log(
    `  schema-anime.gif — ${IMAGES} images, ${(IMAGES * DELAI) / 1000} s, ${ko.toFixed(0)} Ko`,
  );
  if (ko > 7500) {
    console.warn(
      "  ⚠ au-delà de ~8 Mo, LinkedIn refuse le fichier : réduire IMAGES ou la largeur.",
    );
  }
}

main().catch((e) => {
  console.error("\n✖", e.message);
  process.exit(1);
});
