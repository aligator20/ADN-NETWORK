/**
 * LA BOUTIQUE — vitrine de FullMesh Shop.
 *
 * POURQUOI UNE PAGE ET PAS SEULEMENT LA FICHE PROJET
 *
 * La fiche `/work/full-mesh` explique le TRAVAIL : la charte, le registre
 * d'affiche, le kit livré. Elle s'adresse à quelqu'un qui juge une prestation.
 * Cette page-ci s'adresse à quelqu'un qui veut ACHETER un guide ou en revendre.
 * Deux lecteurs, deux besoins ; les mélanger dessert les deux.
 *
 * ⚠️ AUCUN PRIX SUR CETTE PAGE, ET C'EST UNE DÉCISION.
 *
 * La fiche projet avait affiché « 5 000 F le pack ». C'était une offre de
 * lancement close le 31 août ; le prix est passé à 8 000 F dans la semaine,
 * soit soixante pour cent d'écart. Un prix recopié sur une page qu'on ne
 * pense pas à rouvrir devient un mensonge par inattention.
 *
 * La boutique Chariow est la SEULE autorité sur les prix. Cette page décrit ce
 * que chaque titre règle et envoie voir le montant à sa source. C'est un clic
 * de plus contre une exactitude permanente — le change est bon, et il évite
 * qu'un client arrive avec un chiffre périmé en main.
 *
 * Le catalogue est rangé PAR PROBLÈME et non par gamme de prix : personne ne
 * se réveille en cherchant « un produit à mille francs », on cherche à
 * trouver des clients ou à se faire payer.
 *
 * Relevé sur la boutique le 10 septembre 2026 : dix-sept titres.
 */
export type Rayon = {
  id: string;
  /** Le problème du lecteur, pas la catégorie du vendeur. */
  titre: string;
  /** Ce que le rayon règle, en une phrase. */
  promesse: string;
  /** Les titres, tels qu'ils s'appellent sur la boutique. */
  titres: readonly string[];
};

export type BoutiqueCopy = {
  kicker: string;
  name: string;
  lead: string;
  body: readonly string[];
  regleLabel: string;
  regle: readonly { titre: string; corps: string }[];
  rayonsLabel: string;
  rayonsLead: string;
  rayons: readonly Rayon[];
  prixLabel: string;
  prixNote: string;
  revendeurLabel: string;
  revendeurTitre: string;
  revendeur: readonly { titre: string; corps: string }[];
  ctaBoutique: string;
  ctaRevendeur: string;
  /** L'adresse réelle de la boutique. Elle vit ici, une seule fois. */
  url: string;
  ficheLabel: string;
};

export const boutique: BoutiqueCopy = {
  kicker: "FullMesh Shop — produits numériques",
  name: "Un peu de tout, pourvu que ça serve",
  lead: "Dix-sept titres qui n'ont aucun sujet en commun, et une seule condition d'entrée : qu'on en ressorte plus efficace avec un téléphone et une connexion.",
  body: [
    "Mobile money, copywriting, WhatsApp, prompts, CV, résine époxy. La liste paraît décousue et elle l'est — volontairement. Un catalogue mono-sujet plafonne le jour où son sujet s'épuise ; celui-ci grandit par où la demande se présente.",
    "Ce qui tient l'ensemble n'est pas un thème, c'est un test. Un titre entre au catalogue si un lecteur peut s'en servir le lendemain, depuis son téléphone, sans rien acheter d'autre. Tout ce qui échoue à ce test reste dehors, aussi vendable soit-il.",
  ],

  regleLabel: "La règle d'entrée",
  regle: [
    {
      titre: "Utile dès le lendemain",
      corps: "Pas de culture générale, pas de théorie qu'il faudra transposer. Chaque titre se termine par quelque chose à faire, et quelqu'un qui l'a lu peut le faire le jour suivant.",
    },
    {
      titre: "Tenable depuis un téléphone",
      corps: "Aucun titre ne suppose un ordinateur, un logiciel payant ou un budget publicitaire. Ce qui exige un équipement que le lecteur n'a pas ne lui sert à rien.",
    },
    {
      titre: "Écrit pour ici",
      corps: "Montants en francs CFA, mobile money comme moyen de paiement, WhatsApp comme canal. Un guide traduit d'un marché américain fait perdre du temps à celui qui l'applique.",
    },
  ],

  rayonsLabel: "Le catalogue",
  rayonsLead: "Rangé par ce qu'il règle. Personne ne cherche « un produit à mille francs » — on cherche à trouver des clients, ou à se faire payer.",
  rayons: [
    {
      id: "vendre",
      titre: "Trouver des clients, et se faire payer",
      promesse: "Le passage de la compétence au revenu, qui est là où presque tout le monde reste bloqué.",
      titres: [
        "Trouver ses Premiers Clients sans Budget Publicitaire",
        "Gagner ses Premiers Clients grâce à l'IA, Étape par Étape",
        "Trouver des Clients et les Faire Payer",
        "Se Faire Payer pour une Compétence",
        "Vendre Efficacement sur WhatsApp",
        "Copywriting : Écrire pour Vendre",
      ],
    },
    {
      id: "lancer",
      titre: "Se lancer avec ce qu'on a",
      promesse: "Démarrer sans capital, sans local, et sans attendre un financement qui ne viendra pas.",
      titres: [
        "Créer une Entreprise avec Moins de 50 000 FCFA",
        "Se Lancer quand on a Peu d'Argent",
        "50 Petites Activités Rentables à Lancer en Afrique",
        "Comprendre le Mobile Money pour son Business",
      ],
    },
    {
      id: "ia",
      titre: "Faire travailler l'IA",
      promesse: "L'outil qui remplace le collaborateur qu'on ne peut pas encore embaucher.",
      titres: [
        "Faire Travailler l'IA pour Toi",
        "100 Prompts IA Prêts à l'Emploi pour Vendre Plus",
        "Créer des Visuels Professionnels avec Canva et l'IA",
        "Créer son CV Professionnel avec l'IA",
      ],
    },
    {
      id: "metier",
      titre: "Apprendre un métier en entier",
      promesse: "Les titres longs : un métier pris du premier geste jusqu'à la première vente.",
      titres: [
        "Devenez Community Manager Débutant en 30 Jours",
        "Vendre ses Produits Numériques sur Chariow",
        "Résine Époxy : du Premier Moule à la Première Vente",
      ],
    },
  ],

  prixLabel: "Les prix",
  prixNote:
    "Ils ne figurent pas sur cette page, et c'est délibéré. Cette fiche a déjà affiché un tarif d'offre de lancement qui a bougé de soixante pour cent en une semaine — un prix recopié sur une page qu'on ne pense pas à rouvrir devient faux tout seul. La boutique est le seul endroit où ils sont à jour, et les douze guides d'entrée y sont groupés en un pack moins cher que leur somme.",

  revendeurLabel: "Revendre",
  revendeurTitre: "Trente-cinq pour cent, sans rien avancer",
  revendeur: [
    {
      titre: "Aucune barrière",
      corps: "Rien à créer, rien à stocker, rien à avancer. Le revendeur reçoit un lien, une commission de 35 % sur chaque vente, et le kit qui lui sert à publier dès le premier jour.",
    },
    {
      titre: "Payé le samedi",
      corps: "Règlement hebdomadaire par mobile money, sans montant minimum. Un revendeur qui doit attendre un seuil pour toucher sa première commission arrête avant de l'atteindre.",
    },
    {
      titre: "Le kit fourni",
      corps: "Vingt textes prêts à publier et cinquante visuels. Ce qui tue un réseau de revendeurs, c'est le délai entre l'inscription et la première vente — le kit le supprime.",
    },
  ],

  ctaBoutique: "Voir la boutique et les prix",
  ctaRevendeur: "Devenir revendeur",
  url: "https://fullmeshshop.mychariow.market",
  ficheLabel: "Le travail de marque derrière la boutique",
};
