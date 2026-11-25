/**
 * LE PLAN DE MARCHE — ce qu'on vend à quelqu'un qui a déjà un commerce.
 *
 * CE QUE CETTE PAGE N'EST PAS
 *
 * Ce n'est pas du coaching, et ce n'est pas une formation. On ne vend ni un
 * diplôme ni une expertise métier : ADN NETWORK n'en a pas, et la page le dit
 * en toutes lettres plutôt que de l'enfouir dans une mention légale. Ce qui se
 * vend est une MÉTHODE et un RYTHME — le problème posé, des gestes datés, des
 * routines tenues quatre semaines, et quelqu'un qui revient vérifier.
 *
 * POURQUOI ELLE A SA PAGE, ET PAS UNE LIGNE DANS « À LA CARTE »
 *
 * L'« à la carte » de la Vitrine porte une règle écrite : chaque ligne y
 * figure parce qu'une réalisation de ce site prouve qu'on sait la faire, et le
 * champ `preuve` y est OBLIGATOIRE. Cette offre n'a aucune réalisation
 * derrière elle — zéro client l'a suivie. L'y glisser aurait demandé
 * d'inventer une preuve. Elle vit donc ici, où son état réel est affiché.
 *
 * ⚠️ L'ÉTAT DE CHAQUE MÉTHODE EST ÉCRIT, ET IL N'EST PAS FLATTEUR.
 * « jamais appliquée » veut dire ce qu'il dit. Le jour où l'on écrira
 * « éprouvée », ce sera parce que cinq clients l'ont suivie et ont rendu leur
 * retour — le compteur vit dans l'atelier, pas dans une intention.
 *
 * ⚠️ LES PRIX SONT LIÉS À L'ATELIER. `node atelier.js verifier` compare le
 * plancher du service `plan-de-marche` au nombre écrit ici et refuse l'écart.
 * Le contrôle attend la forme exacte : `name:` puis `prix:` sur deux lignes
 * qui se suivent. Ne pas les séparer.
 *
 * ⚠️ LES CHIFFRES DU CONSTAT ONT TOUS LEUR SOURCE, et elle est affichée. Ils
 * viennent de l'enquête Enterprise Surveys de la Banque mondiale, Bénin 2024,
 * 364 entreprises interrogées entre septembre 2024 et janvier 2025. Cette
 * enquête ne couvre QUE les entreprises formelles de cinq salariés et plus :
 * c'est écrit sur la page, parce qu'un commerçant plus petit a le droit de
 * savoir que ces chiffres ne parlent pas exactement de lui.
 */

/** Une phrase de client, telle qu'il la dirait. C'est l'entrée du catalogue. */
export type Phrase = {
  /** L'identifiant partagé avec la bibliothèque de l'atelier. */
  id: string;
  /** Ses mots. Pas la catégorie du consultant. */
  mots: string;
  famille: string;
  /**
   * L'état réel de la méthode, jamais enjolivé.
   *
   * `neuve` : écrite sur données et expérience, aucun client ne l'a suivie.
   * `essai` : au moins un client l'a appliquée et a rendu son retour.
   * `eprouvee` : cinq clients ou plus, avec leurs mesures.
   */
  etat: "neuve" | "essai" | "eprouvee";
  /** Le professionnel à faire venir, quand le problème l'exige. */
  expert?: string;
};

/** Un palier de prix. `prix: null` veut dire « sur devis », jamais « gratuit ». */
export type Palier = {
  id: string;
  name: string;
  prix: number | null;
  unite: string;
  pour: string;
};

export type MethodeCopy = {
  kicker: string;
  name: string;
  lead: string;
  body: readonly string[];

  /**
   * LES PHOTOGRAPHIES — des illustrations, et rien d'autre.
   *
   * ⚠️ AUCUNE NE MONTRE UN CLIENT, UN LIEU OÙ NOUS SERIONS INTERVENUS NI UNE
   * RÉALISATION. Les personnes photographiées n'ont aucun lien avec
   * l'entreprise et n'ont rien approuvé — la licence Pexels interdit
   * expressément de laisser croire le contraire. Leur `alt` décrit donc ce
   * qu'on voit, jamais qui ce serait : « une commerçante », jamais « notre
   * cliente ». Provenance et licences : `public/scenes/LICENCES.md`.
   */
  scenes: Record<"hero" | "constat" | "etapes", { src: string; alt: string }>;

  constatLabel: string;
  constatTitre: string;
  /**
   * Les trois chiffres qui posent le paradoxe, dans l'ordre où il se noue.
   *
   * `valeur` est un NOMBRE, pas une chaîne : la vue le fait compter au
   * défilement, comme la bande de l'accueil. Un chiffre écrit en dur ne
   * s'anime pas, et un chiffre qui s'anime se retient.
   */
  constat: readonly { valeur: number; suffixe: string; label: string }[];
  /**
   * LA COMPARAISON — c'est elle, l'image de cette page.
   *
   * Deux barres qui se dessinent au défilement : le Bénin contre la moyenne
   * régionale, sur la ligne où l'écart est le plus large. Aucune photo ne
   * dirait ça, et ce dessin-là n'appartient qu'à nous parce qu'il est tiré
   * d'une donnée que nous sommes allés chercher.
   */
  comparaison: {
    titre: string;
    unite: string;
    haut: { label: string; valeur: number };
    bas: { label: string; valeur: number };
    note: string;
  };
  constatSource: string;
  constatReserve: string;

  phrasesLabel: string;
  phrasesLead: string;
  phrases: readonly Phrase[];
  etats: Record<Phrase["etat"], { court: string; long: string }>;
  expertLabel: string;

  etapesLabel: string;
  etapes: readonly { n: string; titre: string; corps: string }[];

  prixLabel: string;
  prixLead: string;
  paliers: readonly Palier[];
  surDevis: string;
  gratuit: string;
  currency: string;

  limitesLabel: string;
  limites: readonly string[];

  form: {
    name: string;
    endpoint: string;
    honeypot: string;
    titre: string;
    corps: string;
    probleme: { label: string; placeholder: string; hint: string };
    nom: { label: string; placeholder: string };
    telephone: { label: string; placeholder: string; hint: string };
    consent: string;
    incomplete: string;
    envoi: string;
    envoyee: { titre: string; corps: string };
    echec: { titre: string; corps: string; action: string };
    whatsapp: string;
    whatsappIntro: string;
    action: string;
  };
};

export const methode: MethodeCopy = {
  kicker: "La méthode",
  name: "Le Plan de marche",
  lead: "Dites ce qui ne va pas, avec vos mots. On vous rend une méthode, des gestes datés, et quelqu'un qui revient vérifier.",
  body: [
    "Vous avez l'emplacement, le local, la marchandise. Ce qui manque n'est pas le courage — c'est une façon de faire qui tient quand la semaine est mauvaise.",
    "Nous ne sommes pas experts de votre métier. Nous posons le problème, nous installons une méthode, et nous tenons le rythme à vos côtés pendant quatre semaines. Quand il faut un spécialiste, nous le disons et nous le cherchons.",
  ],

  scenes: {
    hero: { src: "/scenes/methode-hero.webp", alt: "Une commerçante range des oranges sur son étal." },
    constat: { src: "/scenes/methode-constat.webp", alt: "Des vendeurs et leurs charrettes dans une rue de marché." },
    etapes: { src: "/scenes/methode-etapes.webp", alt: "Un homme consulte son téléphone, un dossier sous le bras." },
  },

  constatLabel: "Ce que disent les chiffres",
  constatTitre: "Votre argent n'a pas disparu. Il est dehors.",
  constat: [
    { valeur: 42, suffixe: " %", label: "des patrons disent que leur plus gros obstacle est l'argent" },
    { valeur: 90, suffixe: " %", label: "des petites entreprises ont pourtant un compte en banque" },
    { valeur: 28, suffixe: " %", label: "seulement ont un prêt" },
  ],
  comparaison: {
    titre: "Le fonds de roulement, financé par du crédit fournisseur et client",
    unite: "% des entreprises",
    haut: { label: "Bénin", valeur: 65.6 },
    bas: { label: "Afrique subsaharienne", valeur: 24.3 },
    note: "Près de trois fois la moyenne régionale. L'argent n'est pas absent du circuit : il est chez vos clients, et il n'en revient pas.",
  },
  constatSource:
    "Banque mondiale, Enterprise Surveys — Bénin 2024. 364 entreprises interrogées entre septembre 2024 et janvier 2025.",
  constatReserve:
    "Cette enquête ne couvre que les entreprises enregistrées de cinq salariés et plus. Elle ne décrit ni l'étal du marché, ni celui qui se lance seul. Nous le disons parce que c'est vrai, et parce que vous avez le droit de savoir de qui parlent ces chiffres.",

  phrasesLabel: "Par où commencer",
  phrasesLead:
    "Cherchez votre phrase. C'est celle que vous diriez à un ami, pas celle d'un manuel — c'est comme ça que le catalogue est rangé.",
  phrases: [
    { id: "caisse-vide", mots: "Je vends, mais je n'ai jamais d'argent en caisse.", famille: "L'argent qui ne rentre pas", etat: "neuve" },
    { id: "credit-aux-clients", mots: "On me doit de l'argent et je n'ose pas réclamer.", famille: "L'argent qui ne rentre pas", etat: "neuve", expert: "juriste" },
    { id: "banque-refuse", mots: "La banque ne veut pas me prêter.", famille: "L'argent qui ne rentre pas", etat: "neuve", expert: "banquier ou institution de microfinance" },
    { id: "stock-dort", mots: "Ma marchandise dort, mon argent est dedans.", famille: "La marchandise qui dort", etat: "neuve" },
    { id: "pas-de-clients", mots: "Je n'ai pas assez de clients.", famille: "Les clients qui ne viennent pas", etat: "neuve" },
    { id: "sais-pas-si-je-gagne", mots: "Je ne sais pas si je gagne ou si je perds.", famille: "Ne pas savoir où on en est", etat: "neuve", expert: "comptable" },
    { id: "seul-deborde", mots: "Je travaille seul et je n'arrive plus à suivre.", famille: "Grandir sans casser", etat: "neuve", expert: "juriste" },
    { id: "veux-innover", mots: "Je veux innover mais je ne sais pas comment.", famille: "Grandir sans casser", etat: "neuve" },
    { id: "veux-me-lancer", mots: "Je veux me lancer mais je ne sais pas par où commencer.", famille: "Partir de zéro", etat: "neuve" },
    { id: "courant-coupe", mots: "Le courant coupe et je perds de l'argent.", famille: "Ce qu'on subit", etat: "neuve", expert: "électricien" },
    { id: "impots-etouffent", mots: "Les impôts m'étouffent.", famille: "Ce qu'on subit", etat: "neuve", expert: "comptable" },
  ],
  etats: {
    neuve: {
      court: "Jamais appliquée",
      long: "Écrite à partir de données publiques et de notre expérience. Aucun client ne l'a encore suivie, et nous le disons avant que vous commandiez.",
    },
    essai: { court: "En essai", long: "Au moins un client l'a appliquée et nous a rendu son retour." },
    eprouvee: { court: "Éprouvée", long: "Cinq clients ou plus l'ont suivie, mesures à l'appui." },
  },
  expertLabel: "Fait venir un professionnel",

  etapesLabel: "Comment ça se passe",
  etapes: [
    { n: "01", titre: "On écoute", corps: "Une heure, chez vous, gratuite. Vous racontez ; nous posons des questions et nous notons vos chiffres — jamais les nôtres." },
    { n: "02", titre: "On pose le problème", corps: "Vos problèmes classés, et celui par lequel on commence. Si rien de tout ça n'est à notre portée, nous le disons et nous nous arrêtons là." },
    { n: "03", titre: "On écrit la méthode", corps: "Votre document : ce qui change, les gestes semaine par semaine, les routines qui restent et le temps que chacune demande." },
    { n: "04", titre: "On tient quatre semaines", corps: "Quatre points de suivi. On corrige ce qui ne tient pas — et une méthode intenable se corrige, elle ne se réclame pas." },
    { n: "05", titre: "Vous nous dites", corps: "Ce qui a marché, ce qui n'a pas tenu. Ce retour corrige la méthode pour le suivant. C'est la seule façon qu'elle vaille mieux dans six mois qu'aujourd'hui." },
  ],

  prixLabel: "Ce que ça coûte",
  prixLead:
    "Le diagnostic ne se facture jamais. Une méthode du catalogue a un prix fixe. Une méthode à construire se chiffre après vous avoir écouté — pas avant.",
  paliers: [
    {
      id: "diagnostic",
      name: "Le Diagnostic",
      prix: 0,
      unite: "une heure d'écoute",
      pour: "Ce qui bloque réellement, et si nous savons le traiter. Sans engagement, et sans suite si la réponse est non.",
    },
    {
      id: "methode",
      name: "Le Plan de marche",
      prix: 25000,
      unite: "la méthode, quatre semaines de suivi comprises",
      pour: "Une méthode du catalogue, mise à votre nom, avec ses routines et ses quatre points de suivi.",
    },
    {
      id: "suivante",
      name: "La méthode suivante",
      prix: 15000,
      unite: "chaque méthode après la première",
      pour: "Quand le plan en enchaîne plusieurs. Moins cher parce que l'écoute est déjà faite et ne se refacture pas.",
    },
    {
      id: "sur-mesure",
      name: "La méthode à construire",
      prix: null,
      unite: "chiffré après l'écoute",
      pour: "Quand votre problème n'est dans aucune de ces onze phrases. Le montant se fixe sur le travail réel et sur vos moyens, annoncé avant qu'on commence.",
    },
  ],
  surDevis: "Sur devis",
  gratuit: "Gratuit",
  currency: "FCFA",

  limitesLabel: "Ce que nous ne faisons pas",
  limites: [
    "Aucune promesse de ventes, de clients ou de chiffre d'affaires. Nous installons une méthode et un rythme ; ce qu'ils produisent dépend de votre marché et de votre régularité.",
    "Aucun conseil fiscal, comptable, juridique ou financier. Nous préparons la consultation, nous ne la remplaçons pas.",
    "Aucun prêt, aucune avance, aucune garantie, aucun conseil de placement. Aucun argent ne transite par ADN NETWORK.",
    "Nous ne recouvrons pas vos créances et nous n'appelons aucun de vos clients.",
    "Nous ne tenons ni votre caisse, ni vos livres, ni vos déclarations.",
    "Nous n'exécutons pas les gestes à votre place. La méthode se tient par vous — c'est sa limite, et c'est aussi ce qui fait qu'elle reste quand nous partons.",
  ],

  form: {
    name: "probleme-methode",
    endpoint: "/__forms.html",
    honeypot: "Ne pas remplir",
    titre: "Dites-nous ce qui ne va pas",
    corps:
      "Avec vos mots, comme vous le diriez à quelqu'un. On vous rappelle pour l'heure d'écoute, qui est gratuite.",
    probleme: {
      label: "Ce qui ne va pas",
      placeholder: "Par exemple : je vends tous les jours mais je n'arrive jamais à réapprovisionner…",
      hint: "Trois lignes suffisent. Ne cherchez pas le terme juste : votre phrase vaut mieux que la nôtre.",
    },
    nom: { label: "Votre nom", placeholder: "Nom et prénom" },
    telephone: {
      label: "Téléphone",
      placeholder: "+229 …",
      hint: "C'est par là qu'on vous rappelle. WhatsApp de préférence.",
    },
    consent:
      "Ces informations servent uniquement à préparer l'entretien et à y répondre. Elles ne sont ni revendues, ni utilisées pour de la prospection.",
    incomplete: "Il manque le nom, le téléphone ou le problème.",
    envoi: "Envoi…",
    envoyee: {
      titre: "C'est noté",
      corps: "On vous rappelle pour fixer l'heure d'écoute. Elle est gratuite et elle n'engage à rien.",
    },
    echec: {
      titre: "L'envoi n'a pas abouti",
      corps: "La connexion a lâché. Votre texte n'est pas perdu : envoyez-le directement sur WhatsApp, il est déjà écrit.",
      action: "Envoyer sur WhatsApp",
    },
    whatsapp: "Ou sur WhatsApp",
    whatsappIntro: "Bonjour, voici ce qui ne va pas dans mon activité :",
    action: "Demander l'heure d'écoute",
  },
};
