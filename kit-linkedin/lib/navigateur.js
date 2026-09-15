/**
 * PILOTAGE D'UN NAVIGATEUR SANS DÉPENDANCE.
 *
 * Il n'y a ni Puppeteer ni Playwright dans ce dépôt, et en ajouter un pour
 * prendre douze captures ferait entrer ~300 Mo de Chromium dans un projet dont
 * tout l'intérêt est de ne rien porter d'inutile. Or Chrome et Edge sont déjà
 * installés sur la machine, et Node sait parler WebSocket depuis longtemps :
 * le protocole DevTools se pilote directement, en une centaine de lignes.
 *
 * DEUX PIÈGES DU SITE, TRAITÉS ICI
 *
 * 1. Les sections apparaissent au défilement (GSAP ScrollTrigger). Une capture
 *    naïve montrerait une page à moitié vide — les blocs sont à `opacity: 0`
 *    tant qu'on n'a pas défilé jusqu'à eux. On émule donc
 *    `prefers-reduced-motion: reduce` : le site respecte ce réglage et rend
 *    tout dans son état final. C'est aussi, littéralement, ce qu'on veut
 *    montrer.
 *
 * 2. Le préchargeur verrouille le défilement pendant environ deux secondes. On
 *    attend qu'il ait rendu la main avant de cadrer quoi que ce soit.
 */
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const NAVIGATEURS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

function trouverNavigateur() {
  const trouve = NAVIGATEURS.find((c) => fs.existsSync(c));
  if (!trouve) {
    throw new Error(
      "Aucun navigateur trouvé. Chrome ou Edge est nécessaire pour les captures.",
    );
  }
  return trouve;
}

async function ouvrir({ port = 9455, mouvementReduit = true } = {}) {
  const exe = trouverNavigateur();
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "adn-capture-"));

  const proc = spawn(
    exe,
    [
      "--headless=new",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profil}`,
      "--hide-scrollbars",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--force-color-profile=srgb",
      "--font-render-hinting=none",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  /* Le port n'est pas ouvert à l'instant où le processus démarre : on
     interroge jusqu'à ce qu'il réponde, plutôt que de dormir au hasard. */
  let cible = null;
  for (let essai = 0; essai < 60 && !cible; essai++) {
    await attendre(250);
    try {
      const liste = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      cible = liste.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    } catch {
      /* pas encore prêt */
    }
  }
  if (!cible) throw new Error(`Le navigateur n'a pas ouvert le port ${port}.`);

  const ws = new WebSocket(cible.webSocketDebuggerUrl);
  await new Promise((ok, ko) => {
    ws.onopen = ok;
    ws.onerror = () => ko(new Error("Connexion DevTools impossible."));
  });

  let n = 0;
  const attentes = new Map();
  const evenements = new Map();

  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && attentes.has(msg.id)) {
      const { ok, ko } = attentes.get(msg.id);
      attentes.delete(msg.id);
      msg.error ? ko(new Error(`${msg.error.message}`)) : ok(msg.result);
    } else if (msg.method && evenements.has(msg.method)) {
      evenements.get(msg.method).forEach((f) => f(msg.params));
      evenements.delete(msg.method);
    }
  };

  const envoyer = (method, params = {}) =>
    new Promise((ok, ko) => {
      const id = ++n;
      attentes.set(id, { ok, ko });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const surEvenement = (method) =>
    new Promise((ok) => {
      if (!evenements.has(method)) evenements.set(method, []);
      evenements.get(method).push(ok);
    });

  await envoyer("Page.enable");
  await envoyer("Runtime.enable");

  /* Le réglage décisif : le site rend tout dans son état final.
     Désactivable — c'est ce qui permet de comparer les deux comportements. */
  await envoyer("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: mouvementReduit ? "reduce" : "no-preference" },
    ],
  });

  return {
    /** Règle la fenêtre. `mobile` change aussi le point de rupture CSS. */
    async cadrer({ largeur, hauteur, mobile = false, echelle = 2 }) {
      await envoyer("Emulation.setDeviceMetricsOverride", {
        width: largeur,
        height: hauteur,
        deviceScaleFactor: echelle,
        mobile,
        screenWidth: largeur,
        screenHeight: hauteur,
      });
    },

    async aller(url, { attente = 2600 } = {}) {
      const charge = surEvenement("Page.loadEventFired");
      await envoyer("Page.navigate", { url });
      await charge;
      await attendre(attente); // le préchargeur rend la main
    },

    /** Amène un élément en haut de l'écran. Sans sélecteur, retourne en haut. */
    async placer(selecteur, { decalage = 0, attente = 700 } = {}) {
      const expression = selecteur
        ? `(() => {
             const e = document.querySelector(${JSON.stringify(selecteur)});
             if (!e) return "absent";
             window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY + ${decalage});
             return "ok";
           })()`
        : `window.scrollTo(0, 0), "ok"`;
      const r = await envoyer("Runtime.evaluate", { expression, returnByValue: true });
      await attendre(attente);
      return r.result.value;
    },

    /** Évalue une expression dans la page et renvoie sa valeur. */
    async evaluer(expression) {
      const r = await envoyer("Runtime.evaluate", { expression, returnByValue: true });
      if (r.exceptionDetails) {
        /* `exceptionDetails.text` vaut « Uncaught » et rien d'autre : le
           message réel est dans l'objet levé. Sans ça, toute erreur de sonde
           se présente à l'identique et on cherche au mauvais endroit. */
        const e = r.exceptionDetails.exception;
        throw new Error(e?.description || e?.value || r.exceptionDetails.text);
      }
      return r.result.value;
    },

    async capturer(fichier) {
      const { data } = await envoyer("Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: false,
      });
      fs.writeFileSync(fichier, Buffer.from(data, "base64"));
      return fichier;
    },

    async fermer() {
      try {
        ws.close();
      } catch {
        /* rien */
      }
      proc.kill();
      await attendre(500);
      /* Le navigateur garde parfois un verrou sur son profil une seconde de
         plus que son processus. Un dossier temporaire non supprimé ne justifie
         pas de faire échouer une génération : Windows le nettoiera. */
      try {
        fs.rmSync(profil, { recursive: true, force: true });
      } catch {
        /* sans importance */
      }
    },
  };
}

module.exports = { ouvrir };
