/**
 * Source unique du copy et des constantes de marque.
 * Aucun texte ne doit être écrit en dur dans un composant.
 *
 * Langue du site : FRANÇAIS. Seuls restent en anglais les noms propres
 * (ADN NETWORK, les titres de projets) et le vocabulaire technique consacré
 * (RAG, VoIP, RPA, SIEM…), qu'aucune traduction ne rendrait plus clair.
 */

export const site = {
  name: "ADN NETWORK",
  wordmark: { first: "ADN", second: "NETWORK" },
  /**
   * Baseline. Elle figurait en anglais dans le brief initial
   * (« Technology. Creativity. Systems. ») — la voici traduite.
   */
  tagline: ["Technologie", "Créativité", "Systèmes"] as const,
  founded: "2026",
  /** À ajuster : sert aux coordonnées affichées dans la barre de statut. */
  base: {
    city: "Cotonou",
    country: "BJ",
    coords: "06°22'N 02°26'E",
    /** Identifiant IANA — alimente l'horloge de la barre de statut. */
    timezone: "Africa/Porto-Novo",
  },
  /**
   * Adresse de contact — provisoire.
   *
   * Elle reçoit les demandes de support des fiches projet ET les candidatures
   * au Réseau. À remplacer par une adresse au nom de domaine le jour où il
   * existe : une adresse Gmail sur un site d'agence affaiblit la crédibilité
   * auprès d'un donneur d'ordres ou d'un investisseur.
   */
  email: "sylvereadone20@gmail.com",
  /**
   * ⚠️ À REMPLACER par le domaine réel avant mise en ligne.
   *
   * Cette URL n'est pas cosmétique : elle sert de `metadataBase`. Les aperçus
   * de partage (WhatsApp, LinkedIn, Facebook) exigent des URL ABSOLUES —
   * avec un domaine faux, l'image de partage ne s'affichera nulle part.
   * Elle alimente aussi le sitemap et le fichier robots.
   */
  //
  // Adresse PERMANENTE du site, pas celle d'un déploiement. Netlify sert aussi
  // chaque build sous une URL préfixée de son identifiant
  // (`6a7d5d4f...--helpful-taiyaki-27a370.netlify.app`) : celle-là change à
  // chaque mise en ligne et ne doit jamais être inscrite ici.
  //
  // À remplacer le jour où un vrai domaine est branché.
  url: "https://adn-network.netlify.app",
  /** Fondateur — signe le manifeste et la page contact. */
  owner: {
    name: "ADONE Sylvere",
    role: "Fondateur & Directeur technique",
  },
  /**
   * Réseaux. `url` vide → le composant rend un libellé simple plutôt qu'un lien
   * mort ; c'est le comportement de repli, pas une exception.
   *
   * Note : `www.facebook.com` et non `web.facebook.com`. Le sous-domaine `web`
   * force la mise en page bureau et dégrade la consultation sur mobile — or la
   * majorité des visiteurs arriveront de là.
   */
  socials: [
    {
      label: "Facebook",
      handle: "ADN Sylvere",
      url: "https://www.facebook.com/sylvere.adn.2025",
    },
  ],
  /**
   * Appel final — séquence 006. En anglais dans le brief initial
   * (« LET'S BUILD SOMETHING IMPOSSIBLE. »).
   */
  cta: "CONSTRUISONS L'IMPOSSIBLE.",
} as const;

export const sequences = [
  { id: "hero", index: 1, label: "Index" },
  { id: "intro", index: 2, label: "Manifeste" },
  { id: "services", index: 3, label: "Disciplines" },
  { id: "work", index: 4, label: "Réalisations" },
  { id: "about", index: 5, label: "Structure" },
  { id: "community", index: 6, label: "Le Réseau" },
  { id: "contact", index: 7, label: "Contact" },
] as const;

export type SequenceId = (typeof sequences)[number]["id"];

/**
 * Navigation du menu.
 *
 * Chaque entrée porte sa destination réelle. `anchor` signifie « section de la
 * page d'accueil » ; son absence signifie « page à part entière ». Le menu doit
 * fonctionner depuis N'IMPORTE QUELLE route : sans ce modèle, un item ancré
 * cliqué depuis /work chercherait un `#id` inexistant et ne ferait rien.
 */
export type NavItem = {
  label: string;
  href: string;
  /**
   * Section de la page d'accueil. Son ABSENCE est significative : elle désigne
   * une page à part entière. Le type doit donc rester optionnel et non
   * `as const`, sinon l'entrée sans ancre sort de l'union et `item.anchor`
   * devient inaccessible.
   */
  anchor?: SequenceId;
};

export const nav: readonly NavItem[] = [
  { label: "Index", href: "/", anchor: "hero" },
  { label: "Manifeste", href: "/", anchor: "intro" },
  { label: "Disciplines", href: "/", anchor: "services" },
  { label: "Réalisations", href: "/work" },
  { label: "Structure", href: "/", anchor: "about" },
  { label: "Le Réseau", href: "/reseau" },
  { label: "Contact", href: "/", anchor: "contact" },
];

/**
 * Manifeste — séquence 002.
 *
 * Découpé en syntagmes et non en lignes : le composant recompose les lignes
 * selon la largeur, et le drapeau `accent` porte sur un groupe de mots entier.
 * Les mots sont révélés un à un au scroll, donc chaque syntagme doit se tenir
 * seul à la lecture.
 */
export const introManifest = [
  { text: "ADN NETWORK conçoit des systèmes où" },
  { text: "la technologie, la créativité et l'entreprise", accent: true },
  { text: "cessent d'être trois métiers séparés." },
  { text: "Une structure. Une exigence. De la première ligne de code" },
  { text: "à la dernière image en mouvement.", accent: true },
] as const;

/**
 * Les 7 disciplines, affichées dans le Hero en chaîne mono dense.
 * Elles annoncent la séquence SERVICES sans jamais recourir à une carte.
 */
export const disciplines = [
  "Digital",
  "IA",
  "Automatisation",
  "Réseau",
  "Cybersécurité",
  "Création",
  "Agritech",
] as const;

/**
 * Séquence 005 — STRUCTURE.
 * Le texte dit ce que l'agence change, pas ce qu'elle possède. Trois principes
 * maximum : au-delà, plus personne n'en retient un seul.
 */
export const about = {
  lead: "ADN NETWORK n'est pas un studio de plus. C'est une structure où l'ingénierie, la création et l'entreprise travaillent dans la même pièce.",
  body: [
    "La plupart des projets échouent à la couture : le développeur attend le designer, le designer attend la stratégie, et personne ne répond de l'ensemble. Nous avons construit l'inverse — une équipe qui tient la chaîne entière, du serveur au logotype.",
    "Ce que ça change : un seul interlocuteur, une seule exigence, et des décisions techniques prises en connaissance du terrain — parce que nous exploitons aussi ce que nous construisons.",
  ],
  principles: [
    {
      title: "Un seul fil",
      text: "De l'architecture au dernier pixel, une seule équipe répond de la chaîne complète.",
    },
    {
      title: "Rien de générique",
      text: "Aucun gabarit, aucune solution recopiée. Chaque système est dessiné pour son usage.",
    },
    {
      title: "Ce qui tient",
      text: "Nous livrons ce que nous saurons maintenir dans cinq ans, pas ce qui impressionne le jour de la démo.",
    },
  ],
} as const;

/** Séquence 006 — l'appel final. */
export const contact = {
  lead: "Un projet, une idée, ou un problème que personne n'a encore su résoudre.",
  action: "Écrire à l'équipe",
} as const;

/** Libellés d'interface — le chrome persistant et les repères de lecture. */
export const ui = {
  since: "Depuis",
  loading: "Initialisation de la séquence",
  index: "Index",
  scroll: "Défiler",
  sequence: "Index — Séquence",
  pending: "Séquence — à venir",
  all: "Tous",
  view: "Voir",
  fieldsOfPractice: "Domaines d'intervention",
  selectedProjects: "Projets sélectionnés",
  endOfSelection: "Fin de sélection",
  moreOnRequest: "Le reste sur demande",
  menuOpen: "Index",
  menuClose: "Fermer",
  navigation: "Navigation",
  contactLabel: "Contact",
  followLabel: "Suivre",
  allRights: "Tous droits réservés",
  /* — Fiche projet ————————————————————————————————————— */
  theProject: "Le projet",
  theFile: "Le dossier",
  liveSite: "Site en ligne",
  visitSite: "Visiter le site",
  backToWork: "Toutes les réalisations",
  nextProject: "Projet suivant",
  supportTitle: "Pour en savoir plus",
  supportBody:
    "Chaque projet a son dossier complet : spécifications, chiffres, calendrier, conditions. Le support vous le transmet et répond à vos questions.",
  supportAction: "Contacter le support",
} as const;
