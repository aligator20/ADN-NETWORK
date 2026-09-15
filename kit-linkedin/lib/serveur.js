/**
 * UN SERVEUR STATIQUE QUI SE COMPORTE COMME NETLIFY.
 *
 * Les captures sont prises sur le dossier `out/` — la sortie réelle du build —
 * plutôt que sur le site en ligne. Deux raisons : ça marche sans connexion, et
 * surtout ça capture le code du dépôt à l'instant T, pas la version déployée
 * il y a trois jours. Un visuel de présentation qui montre l'ancien prix est le
 * même problème qu'un carrousel écrit à la main.
 *
 * Il faut donc reproduire une seule chose de Netlify : les adresses propres.
 * L'export statique écrit `services.html`, et le site s'adresse à `/services`.
 * Sans cette réécriture, la moitié des pages reviendrait en 404.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

/** Les trois formes qu'une adresse peut prendre dans un export statique. */
/**
 * La racine est TOUJOURS repassée par `path.resolve`.
 *
 * Le garde anti-remontée compare le chemin demandé à la racine. Sous Windows,
 * `path.join` produit des antislashes : une racine reçue en
 * « C:/…/out » ne préfixe alors jamais « C:\…\out », et le serveur répond 404
 * à tout — y compris à la page d'accueil. Le symptôme est déroutant, puisque
 * la même fonction appelée avec l'autre forme du chemin fonctionne.
 */
function resoudre(racineBrute, url) {
  const racine = path.resolve(racineBrute);

  const propre = decodeURIComponent(url.split("?")[0].split("#")[0]);
  const relatif = path.normalize(propre).replace(/^([/\\])+/, "");

  // Hors de la racine : on refuse plutôt que de servir n'importe quoi.
  const base = path.join(racine, relatif);
  if (!base.startsWith(racine)) return null;

  const candidats = [base, `${base}.html`, path.join(base, "index.html")];
  for (const c of candidats) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function demarrer(racine, port = 4321) {
  return new Promise((resolve) => {
    const serveur = http.createServer((req, res) => {
      const fichier = resoudre(racine, req.url === "/" ? "/index.html" : req.url);
      if (!fichier) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("404");
        return;
      }
      res.writeHead(200, {
        "content-type": TYPES[path.extname(fichier).toLowerCase()] || "application/octet-stream",
        "cache-control": "no-store",
      });
      fs.createReadStream(fichier).pipe(res);
    });
    serveur.listen(port, "127.0.0.1", () => resolve({ serveur, base: `http://127.0.0.1:${port}` }));
  });
}

module.exports = { demarrer };
