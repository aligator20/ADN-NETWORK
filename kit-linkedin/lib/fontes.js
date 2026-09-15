/**
 * LES FONTES DE LA MARQUE, RÉCUPÉRÉES À LA DEMANDE.
 *
 * Le site charge Archivo et JetBrains Mono par `next/font/google`, qui n'en
 * garde que des .woff2 dans un cache de build — inutilisables par le moteur de
 * rendu SVG. On récupère donc les .ttf d'origine, une fois, dans un dossier
 * ignoré par git : un kit qui embarquerait 1,1 Mo de binaires dupliquerait des
 * fichiers que leurs auteurs publient déjà mieux que nous.
 *
 * Les deux familles sont sous SIL Open Font License 1.1 : redistribuables,
 * modifiables, utilisables commercialement. La licence est déposée à côté.
 */
const fs = require("fs");
const path = require("path");

const DOSSIER = path.join(__dirname, "..", ".fontes");
const CONF = path.join(DOSSIER, "fonts.conf");

const SOURCES = {
  "Archivo-Black.ttf":
    "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/Archivo-Black.ttf",
  "Archivo-Bold.ttf":
    "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/Archivo-Bold.ttf",
  "Archivo-Regular.ttf":
    "https://github.com/Omnibus-Type/Archivo/raw/master/fonts/ttf/Archivo-Regular.ttf",
  "JetBrainsMono-Regular.ttf":
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Regular.ttf",
  "JetBrainsMono-Medium.ttf":
    "https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Medium.ttf",
};

async function assurerFontes() {
  fs.mkdirSync(DOSSIER, { recursive: true });
  fs.mkdirSync(path.join(DOSSIER, "cache"), { recursive: true });

  for (const [nom, url] of Object.entries(SOURCES)) {
    const cible = path.join(DOSSIER, nom);
    if (fs.existsSync(cible) && fs.statSync(cible).size > 50000) continue;
    process.stdout.write(`  fonte ${nom}… `);
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${nom} : HTTP ${r.status}`);
    fs.writeFileSync(cible, Buffer.from(await r.arrayBuffer()));
    console.log("ok");
  }

  /* fontconfig ne lit que des chemins absolus : le fichier est donc réécrit à
     chaque exécution, pour survivre à un déplacement du dépôt. */
  fs.writeFileSync(
    CONF,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${DOSSIER.replace(/\\/g, "/")}</dir>
  <dir>C:/Windows/Fonts</dir>
  <cachedir>${path.join(DOSSIER, "cache").replace(/\\/g, "/")}</cachedir>
</fontconfig>
`,
  );
}

/**
 * Relance le processus avec FONTCONFIG_FILE réglé, si ce n'est pas déjà fait.
 *
 * POURQUOI UNE RELANCE PLUTÔT QU'UN `process.env` BIEN PLACÉ
 *
 * libvips fige sa pile de rendu de texte au chargement de sa DLL. Écrire la
 * variable depuis Node avant le `require("sharp")` paraît suffisant et ne l'est
 * pas : la première exécution a produit dix diapositives entières dans une
 * serif de repli, sans une ligne d'avertissement. Un réglage qui échoue en
 * silence sur un visuel de marque coûte plus cher qu'un processus relancé.
 *
 * Renvoie `true` si l'appelant doit s'arrêter là (l'enfant fait le travail).
 */
function relancerAvecFontes(fichierAppelant) {
  if (process.env.FONTCONFIG_FILE === CONF) return false;
  const { spawnSync } = require("child_process");
  const r = spawnSync(process.execPath, [fichierAppelant, ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, FONTCONFIG_FILE: CONF },
  });
  process.exit(r.status === null ? 1 : r.status);
}

module.exports = { assurerFontes, relancerAvecFontes, DOSSIER, CONF };
