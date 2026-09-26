/**
 * LES ACTUALITÉS — ce que nous publions, rassemblé ici.
 *
 * Une publication sur un réseau disparaît du fil en trois jours. Sur le site,
 * elle reste : quelqu'un qui arrive six mois plus tard voit que la structure
 * vit, ce qu'aucune page « à propos » ne dira à sa place.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * AJOUTER UNE PUBLICATION
 *
 * Ajouter un objet EN TÊTE du tableau `publications` : il est affiché dans
 * l'ordre du fichier, la plus récente d'abord. Les champs obligatoires sont
 * `id`, `date`, `reseau`, `titre`, `extrait` et `url`.
 *
 * `extrait` : les premières lignes du post, RECOPIÉES telles quelles. On ne
 * réécrit pas un texte déjà publié — un visiteur qui clique et lit autre chose
 * se demande lequel des deux est vrai.
 *
 * `embed` : l'adresse du plugin du réseau, si l'on veut afficher la
 * publication dans son cadre d'origine, avec ses réactions. Elle n'est
 * chargée QU'APRÈS un clic du visiteur — voir la note sur les traceurs
 * ci-dessous, et la page Mentions légales, qui le dit aux visiteurs.
 *
 * `visuel` : une image de /public. Ce sont NOS visuels, produits par l'atelier
 * de production : ils s'affichent sans rien demander à personne.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * POURQUOI LE CLIC AVANT LE CADRE
 *
 * Un cadre Facebook posé dans une page charge les scripts de Facebook chez
 * TOUS les visiteurs, y compris ceux qui ne le regardent pas — et dépose ses
 * cookies. La page Confidentialité de ce site promet qu'une seule partie du
 * site collecte des données. Le clic préalable est ce qui permet de tenir
 * cette promesse sans renoncer à montrer la publication.
 */

export type Publication = {
  /** Identifiant stable, court : il sert d'ancre et de clé de rendu. */
  id: string;
  /** AAAA-MM-JJ — la date de publication, pas celle de l'ajout au site. */
  date: string;
  reseau: "Facebook" | "LinkedIn" | "WhatsApp" | "Instagram";
  titre: string;
  /** Les premières lignes du post, recopiées telles quelles. */
  extrait: readonly string[];
  /** L'adresse de la publication. `www` et non `web` : voir content/site.ts. */
  url: string;
  /** Adresse du plugin, chargée seulement après un clic du visiteur. */
  embed?: string;
  /**
   * Chemin FRANÇAIS de la page qui explique ce dont parle la publication —
   * la version anglaise est déduite. Une annonce qui ne mène nulle part est
   * une annonce qu'on lit et qu'on oublie.
   */
  lien?: string;
  /** Un visuel de /public — les nôtres, jamais une image d'un tiers. */
  visuel?: { src: string; alt: string };
};

/** De la plus récente à la plus ancienne : l'ordre du fichier est l'ordre affiché. */
export const publications: readonly Publication[] = [
  {
    id: "agents-ia-disponibles",
    date: "2026-09-24",
    reseau: "Facebook",
    titre: "Nos agents IA sont disponibles",
    extrait: [
      "C'est disponible : ADN NETWORK monte désormais votre propre offre de services IA.",
      "Nous l'avons montée pour nous d'abord, et nous ne l'ouvrons qu'aujourd'hui, une fois qu'elle a servi sur nos propres commandes.",
      "Concrètement, ce que fait un agent chez nous : il rédige les textes d'une commande en français et en anglais, prépare les devis, écrit les messages de relance, et range ce que nous refaisions chaque semaine à la main. Nous relisons, nous décidons, nous envoyons.",
    ],
    url: "https://www.facebook.com/sylvere.adn.2025/posts/pfbid0iTfaW8uwPb7vuc1stL7mu8ecLS3T3sqPAnGvmt4aKXDUB2zczcWKjVzGNLmCq3gvl",
    embed:
      "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fsylvere.adn.2025%2Fposts%2Fpfbid0iTfaW8uwPb7vuc1stL7mu8ecLS3T3sqPAnGvmt4aKXDUB2zczcWKjVzGNLmCq3gvl&show_text=true&width=500",
    lien: "/services",
    visuel: {
      src: "/actualites/agents-ia-disponibles.webp",
      alt: "Nos agents IA sont disponibles — L'Agence IA, 200 000 FCFA, 15 jours ouvrés",
    },
  },
];

export type ActualitesCopy = {
  kicker: string;
  title: string;
  lead: string;
  /** Au-dessus du bouton qui charge le cadre du réseau. */
  embedNotice: string;
  embedAction: string;
  /** « Voir sur Facebook ↗ » — le nom du réseau est ajouté à la suite. */
  seeOn: string;
  empty: string;
  /** Renvoi vers la page qui explique l'offre dont parle la publication. */
  moreLabel: string;
};

export const actualites: ActualitesCopy = {
  kicker: "Actualités",
  title: "Ce que nous publions",
  lead: "Les annonces d'ADN NETWORK, rassemblées ici. Le texte est celui du réseau, sans retouche.",
  embedNotice:
    "La publication d'origine est hébergée par le réseau. L'afficher charge ses scripts et ses cookies : rien n'est chargé tant que vous ne cliquez pas.",
  embedAction: "Afficher la publication",
  seeOn: "Voir sur",
  empty: "Aucune publication pour l'instant.",
  moreLabel: "Voir la prestation",
};
