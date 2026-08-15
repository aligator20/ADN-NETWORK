/**
 * MENTIONS LÉGALES — le texte, sorti de la page.
 *
 * Il était écrit en dur dans `mentions-legales/page.tsx`. Une page qui doit
 * exister en deux langues ne peut pas porter son propre texte : c'est la
 * dernière page qu'on pense à traduire, et la première qu'un visiteur méfiant
 * va lire.
 *
 * ⚠️ UN CHAMP RESTE À COMPLÉTER : le numéro RCCM / IFU de la structure. C'est
 * une donnée d'immatriculation qu'on ne peut pas deviner, et l'inventer serait
 * pire que l'absence. Elle est obligatoire pour un site commercial.
 */

/**
 * Hébergeur réel du site.
 *
 * Ce n'est pas du texte traduisible : une raison sociale et une adresse
 * postale sont les mêmes dans toutes les langues. Les valeurs proviennent des
 * conditions d'utilisation publiées par Netlify, pas de mémoire.
 */
export const host = {
  name: "Netlify, Inc.",
  address: "101 2nd Street, San Francisco, CA 94105, USA",
  contact: "support@netlify.com",
};
export type LegalCopy = {
  title: string;
  kicker: string;
  back: string;
  toComplete: string;
  editor: {
    heading: string;
    denomination: string;
    publisher: string;
    capacity: string;
    address: string;
    contact: string;
    registration: string;
  };
  hosting: { heading: string; host: string; address: string; contact: string };
  paragraphs: readonly { title: string; body: string }[];
};

export const legal: LegalCopy = {
  title: "Mentions légales",
  kicker: "Informations légales",
  back: "Retour à l'accueil",
  toComplete: "À compléter",
  editor: {
    heading: "Éditeur du site",
    denomination: "Dénomination",
    publisher: "Responsable de la publication",
    capacity: "Qualité",
    address: "Adresse",
    contact: "Contact",
    registration: "Immatriculation",
  },
  hosting: {
    heading: "Hébergement",
    host: "Hébergeur",
    address: "Adresse",
    contact: "Contact",
  },
  paragraphs: [
    {
      title: "Propriété intellectuelle",
      body: "L'ensemble des contenus de ce site — textes, identité visuelle, photographies, illustrations générées, code source — est la propriété d'ADN NETWORK, sauf mention contraire. Les projets présentés restent la propriété de leurs porteurs respectifs ; leur présentation ici ne vaut pas cession de droits. Toute reproduction, même partielle, est soumise à autorisation écrite préalable.",
    },
    {
      title: "Données personnelles",
      body: "Une seule partie de ce site collecte des données : le formulaire de candidature au Réseau. Les informations que vous y saisissez — nom, email, téléphone si vous le renseignez, ville et description de votre projet — sont transmises et conservées par Netlify, hébergeur du site, et ne servent qu'à instruire votre candidature et à vous répondre. Elles ne sont ni cédées, ni revendues, ni utilisées pour de la prospection. Aucun compte n'est créé et aucun mot de passe ne vous est demandé. Vous pouvez à tout moment demander leur consultation, leur rectification ou leur suppression en écrivant à l'adresse de contact ci-dessus ; la suppression est effectuée sans condition et sans délai. Le formulaire de contact du site, lui, ne transmet rien : il prépare un message dans votre propre logiciel de messagerie, que vous envoyez vous-même.",
    },
    {
      title: "Langue et cookies",
      body: "Aucun cookie publicitaire ni traceur d'audience n'est déposé sur votre appareil. Le site ne comporte ni mesure d'audience, ni bouton de réseau social embarqué, ni régie publicitaire. Un unique témoin technique enregistre la langue que vous choisissez, afin de ne pas vous la redemander à chaque visite : il ne contient que « fr » ou « en », et rien qui permette de vous identifier. Sans choix explicite de votre part, la langue est déduite des préférences déclarées par votre navigateur et, à défaut, du pays depuis lequel vous consultez le site — sans que cette information soit conservée. C'est la raison pour laquelle aucune bannière de consentement ne vous est présentée : il n'y a rien à consentir.",
    },
    {
      title: "Liens externes",
      body: "Certaines pages renvoient vers des sites tiers, notamment les sites en ligne de projets présentés. ADN NETWORK n'exerce aucun contrôle sur leur contenu et ne saurait être tenu responsable de ce qui y est publié.",
    },
    {
      title: "Le Réseau",
      body: "L'adhésion au Réseau est gratuite et ne donne lieu à aucune facturation. ADN NETWORK n'intervient pas dans les relations qui se nouent entre porteurs de projet, mentors et investisseurs, et ne perçoit aucune commission sur celles-ci. L'exposition d'un projet ne constitue ni une garantie de financement, ni une caution portée sur ce projet.",
    },
  ],
};
