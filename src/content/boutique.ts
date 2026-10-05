/**
 * LA BOUTIQUE — une vraie boutique, pas une page de présentation.
 *
 * CE QU'ELLE EST, ET CE QU'ELLE N'EST PAS
 *
 * On choisit, on met dans sa sélection, on envoie la demande. Le paiement, lui,
 * ne se fait PAS sur ce site, et c'est une contrainte réelle, pas un choix de
 * confort : l'entreprise n'a pas encore de numéro de facturation renseigné, et
 * une prestation sur mesure se chiffre au brief — le montant affiché est un
 * plancher. Un bouton « Payer » qui encaisse un acompte sur une charge non
 * arrêtée produit un litige, pas une vente.
 *
 * La sélection part donc par formulaire ou par WhatsApp, avec les articles et
 * le total. C'est le circuit réel d'un achat ici : on s'accorde, puis on paie
 * par mobile money.
 *
 * ⚠️ CHARIOW NE SERT QU'AUX EBOOKS. Les guides numériques se paient en ligne
 * et se téléchargent : eux seuls partent chez le vendeur. Toutes les autres
 * lignes se commandent ici. Mélanger les deux circuits envoyait un acheteur de
 * prestation sur une boutique de fichiers, où il ne trouvait rien.
 *
 * ⚠️ AUCUN PRIX N'EST ÉCRIT DANS CE FICHIER. Les montants vivent dans
 * `vedettes.ts` et `vitrine.ts`, une seule fois, et la vue les y lit. Cette
 * page a déjà affiché un tarif périmé de soixante pour cent ; on ne refait pas
 * l'erreur. Les compteurs sont comptés sur les données pour la même raison.
 *
 * ⚠️ PAS DE PAVÉS. Une boutique se parcourt, elle ne se lit pas. Tout ce qui
 * tenait en trois paragraphes tient ici en une ligne ou en trois mots — et ce
 * qui ne tenait pas a été retiré. Le texte long a sa place sur les fiches, où
 * quelqu'un qui hésite va le chercher.
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

/** Les familles du filtre. `tout` n'est pas une famille, c'est l'absence de filtre. */
export type FamilleId = "tout" | "prestations" | "vitrine" | "carte";

export type BoutiqueCopy = {
  /* ── L'en-tête ───────────────────────────────────────────────────────── */
  kicker: string;
  name: string;
  lead: string;
  /** Trois faits courts, affichés en pastilles. Pas de promesse, des faits. */
  faits: readonly string[];
  /** Libellés des compteurs. AUCUN NOMBRE ICI : la vue compte les données. */
  compteurs: { prestations: string; liaisons: string; produits: string };

  /* ── Le rayonnage ────────────────────────────────────────────────────── */
  famillesLabel: string;
  familles: Record<FamilleId, string>;
  /** Ce que la ligne comprend, en trois puces au plus. */
  inclusLabel: string;
  portfolioLabel: string;
  portfolioVide: string;
  detailCta: string;
  ajouter: string;
  retirer: string;
  ajoute: string;
  planchersNote: string;

  /* ── Ce qui est compris ──────────────────────────────────────────────── */
  liaisonsLabel: string;
  liaisonsTitre: string;
  liaisonsLead: string;

  /* ── La sélection, et la demande ─────────────────────────────────────── */
  panier: {
    ouvrir: string;
    titre: string;
    vide: string;
    article: string;
    articles: string;
    total: string;
    totalNote: string;
    vider: string;
    fermer: string;
    envoyer: string;
    /** Le formulaire Netlify de la commande. Distinct des deux autres. */
    form: {
      name: string;
      endpoint: string;
      honeypot: string;
      nom: { label: string; placeholder: string };
      telephone: { label: string; placeholder: string; hint: string };
      message: { label: string; placeholder: string };
      consent: string;
      incomplete: string;
      envoi: string;
      envoyee: { titre: string; corps: string };
      echec: { titre: string; corps: string; action: string };
      whatsapp: string;
      whatsappIntro: string;
    };
  };

  /* ── Les ebooks — le seul rayon qui part chez Chariow ────────────────── */
  produitsLabel: string;
  produitsTitre: string;
  produitsLead: string;
  /** La règle d'entrée du catalogue, en trois mots-clés et leur ligne. */
  regle: readonly { titre: string; corps: string }[];
  rayons: readonly Rayon[];
  prixNote: string;
  ctaBoutique: string;
  ctaRevendeur: string;
  /** L'adresse réelle de la boutique. Elle vit ici, une seule fois. */
  url: string;
  ficheLabel: string;

  /* ── Revendre ────────────────────────────────────────────────────────── */
  revendeurLabel: string;
  revendeurTitre: string;
  revendeur: readonly { titre: string; corps: string }[];
};

export const boutique: BoutiqueCopy = {
  kicker: "La boutique",
  name: "Tout ce qui s'achète ici",
  lead: "Choisissez, mettez de côté, envoyez. On se rappelle dans la foulée.",
  faits: [
    "Prix affichés, pas sur demande",
    "La sélection n'engage à rien",
    "Paiement mobile money, au devis",
  ],
  compteurs: {
    prestations: "prestations chiffrées",
    liaisons: "liaisons à 0 F",
    produits: "guides numériques",
  },

  famillesLabel: "Le rayon",
  familles: {
    tout: "Tout",
    prestations: "Les prestations",
    vitrine: "Les formules web",
    carte: "À la carte",
  },
  inclusLabel: "Compris",
  portfolioLabel: "Déjà fait",
  portfolioVide: "Rien de publié — nous ouvrons la voie, nous ne livrons pas.",
  detailCta: "La fiche",
  ajouter: "Ajouter",
  retirer: "Retirer",
  ajoute: "Dans la sélection",
  planchersNote:
    "Les montants sont des planchers : la charge réelle se fixe au brief. Un manuel de quarante pages et un catalogue de six cents ne se facturent pas au même prix.",

  liaisonsLabel: "Compris, sans supplément",
  liaisonsTitre: "Ce qui vient avec, quoi que vous commandiez",
  liaisonsLead: "Rien à ajouter à la sélection : c'est dans le prix.",

  panier: {
    ouvrir: "Ma sélection",
    titre: "Votre sélection",
    vide: "Rien encore. Ajoutez une ligne pour commencer.",
    article: "article",
    articles: "articles",
    total: "À partir de",
    totalNote: "Le montant définitif se fixe au brief, après un échange. Rien n'est prélevé ici.",
    vider: "Tout retirer",
    fermer: "Continuer à choisir",
    envoyer: "Envoyer ma demande",
    form: {
      /* Un formulaire DISTINCT des deux autres : mélanger une commande, une
         candidature au Réseau et une demande de devis dans la même table les
         rendrait toutes les trois inexploitables. */
      name: "commande-boutique",
      endpoint: "/__forms.html",
      honeypot: "Ne pas remplir",
      nom: { label: "Votre nom", placeholder: "Nom et prénom" },
      telephone: {
        label: "Téléphone",
        placeholder: "+229 …",
        hint: "C'est par là qu'on vous rappelle. WhatsApp de préférence.",
      },
      message: {
        label: "Votre projet, en deux lignes",
        placeholder: "Ce que vous faites, et ce qui vous manque aujourd'hui.",
      },
      consent:
        "Ces informations servent uniquement à répondre à cette demande. Elles ne sont ni revendues, ni utilisées pour de la prospection.",
      incomplete: "Il manque le nom ou le téléphone.",
      envoi: "Envoi…",
      envoyee: {
        titre: "C'est parti",
        corps: "Votre sélection nous est arrivée. On revient vers vous par téléphone pour le brief — c'est là que le montant se fixe.",
      },
      echec: {
        titre: "L'envoi n'est pas passé",
        corps: "La connexion a lâché. Votre sélection n'est pas perdue : envoyez-la directement par WhatsApp, elle est déjà écrite.",
        action: "Envoyer par WhatsApp",
      },
      whatsapp: "Ou par WhatsApp",
      whatsappIntro: "Bonjour, je voudrais commander :",
    },
  },

  produitsLabel: "Les guides numériques",
  produitsTitre: "FullMesh Shop",
  produitsLead:
    "Le seul rayon qui se paie en ligne et s'ouvre dans la minute, sur un téléphone. Il est hébergé chez notre vendeur : les prix y sont toujours à jour.",
  regle: [
    {
      titre: "Utile dès demain",
      corps: "Chaque titre se termine par quelque chose à faire.",
    },
    {
      titre: "Tenable au téléphone",
      corps: "Ni ordinateur, ni logiciel payant, ni budget publicitaire.",
    },
    {
      titre: "Écrit pour ici",
      corps: "Francs CFA, mobile money, WhatsApp.",
    },
  ],
  rayons: [
    {
      id: "vendre",
      titre: "Trouver des clients, et se faire payer",
      promesse: "Le passage de la compétence au revenu, là où presque tout le monde reste bloqué.",
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
      promesse: "Démarrer sans capital, sans local, sans attendre un financement qui ne viendra pas.",
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
      promesse: "Un métier pris du premier geste jusqu'à la première vente.",
      titres: [
        "Devenez Community Manager Débutant en 30 Jours",
        "Vendre ses Produits Numériques sur Chariow",
        "Résine Époxy : du Premier Moule à la Première Vente",
      ],
    },
  ],
  prixNote:
    "Les prix des guides ne sont pas sur cette page : ils vivent sur la boutique, seul endroit où ils sont à jour. Les douze guides d'entrée y sont groupés en un pack moins cher que leur somme.",
  ctaBoutique: "Acheter sur FullMesh Shop",
  ctaRevendeur: "Devenir revendeur",
  url: "https://fullmeshshop.mychariow.market",
  ficheLabel: "Le travail de marque derrière la boutique",

  revendeurLabel: "Revendre",
  revendeurTitre: "35 % sur chaque vente, sans rien avancer",
  revendeur: [
    { titre: "Rien à avancer", corps: "Un lien, 35 % de commission, et le kit pour publier dès le premier jour." },
    { titre: "Payé le samedi", corps: "Mobile money, chaque semaine, sans montant minimum." },
    { titre: "Le kit fourni", corps: "Vingt textes prêts à publier et cinquante visuels." },
  ],
};
