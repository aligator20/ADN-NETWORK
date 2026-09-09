/**
 * LA VITRINE — l'offre payante.
 *
 * CE QUE CETTE PAGE VEND, ET CE QU'ELLE NE VEND PAS
 *
 * Elle vend un TRAVAIL DE PRODUCTION : une page écrite, mise en page, publiée.
 * Le client repart avec une pièce qui existe, même si personne ne la visite.
 *
 * Elle ne vend ni audience, ni emplacement, ni promesse de contrat. Ce refus
 * n'est pas de la prudence juridique, c'est l'argument : le site affirme
 * partout qu'il ne promet rien qu'il ne puisse tenir, et une page commerciale
 * qui contredirait cette ligne détruirait la crédibilité de toutes les autres.
 *
 * POURQUOI ELLE NE CONCURRENCE PAS LE RÉSEAU
 *
 * Le Réseau est gratuit et le restera : il expose une IDÉE à des mentors et des
 * investisseurs. La Vitrine vend la fabrication d'un OUTIL à quelqu'un qui a
 * déjà un métier. Deux publics, deux promesses. Les limites énoncées plus bas
 * disent la différence noir sur blanc, parce qu'un visiteur qui soupçonne que
 * le gratuit sert d'appât ne revient pas.
 *
 * ⚠️ LES PRIX SONT UNE PROPOSITION, PAS UNE DÉCISION.
 *
 * Ils sont calés sur ce qu'un professionnel qualifié gagne au Bénin et sur la
 * charge réelle de chaque formule. Ils n'engagent personne tant qu'ils n'ont
 * pas été validés par le propriétaire du site. Ils vivent ici et nulle part
 * ailleurs : une ligne à changer, et tout le site suit.
 */
export type Formule = {
  id: string;
  name: string;
  /** Prix en FCFA. Nombre, pas texte : la mise en forme dépend de la langue. */
  prix: number;
  /** Ce que la formule règle, en une phrase. */
  promesse: string;
  /** Livrables. Quatre maximum — au-delà, la liste cesse d'être lue. */
  livrables: readonly string[];
  /** Pour qui, dit franchement. Évite au mauvais client d'acheter. */
  pour: string;
  /**
   * Le gain, montré plutôt que promis.
   *
   * Deux phrases — l'état d'aujourd'hui, celui d'après — et un motif dessiné.
   * Une offre qu'on lit sans la voir ne se vend pas ; une offre illustrée par
   * une image générique ne se vend pas non plus.
   */
  gain: { avant: string; apres: string };
};

/**
 * UN TRAVAIL COMMANDABLE SEUL, à côté des formules.
 *
 * Les trois formules sont une ÉCHELLE : chacune contient la précédente. Y
 * ajouter des barreaux les transformerait en tableau comparatif, et le client
 * choisirait au moins-disant avant d'avoir lu ce que chacune règle. Ces
 * services-ci se commandent seuls, ou en plus d'une formule.
 *
 * RÈGLE D'ADMISSION : aucun service n'entre ici sans une réalisation de ce
 * site qui prouve qu'on sait le faire — c'est ce que porte `preuve`. Une offre
 * qu'on ne peut pas honorer coûte plus cher que l'absence d'offre : elle amène
 * une demande qu'il faut refuser, et un refus après paiement se raconte.
 */
export type Service = {
  id: string;
  name: string;
  /** Prix en FCFA. Nombre, pas texte : la mise en forme dépend de la langue. */
  prix: number;
  /**
   * Vrai quand la charge varie trop d'un client à l'autre pour un forfait —
   * un manuel de quarante pages et un catalogue de six cents ne se facturent
   * pas au même prix. On affiche alors un plancher, pas un tarif.
   */
  plancher?: boolean;
  /** Ce que le prix couvre exactement, quand ce n'est pas un plancher. */
  unite?: string;
  /** Ce que le service règle, en une phrase. */
  promesse: string;
  /** Le contenu livré, d'un trait. */
  contenu: string;
  /**
   * La réalisation de ce site qui prouve la compétence.
   *
   * `slug` n'est pas typé contre la liste des projets : `ProjectSlug` vit dans
   * la surcouche anglaise et l'importer ici lierait deux fichiers de contenu
   * pour un gain d'ergonomie. La vue vérifie l'existence du projet avant de
   * poser le lien — un slug erroné dégrade en texte simple, jamais en 404.
   */
  preuve: { slug: string; texte: string };
};

export type VitrineCopy = {
  name: string;
  kicker: string;
  lead: string;
  body: readonly string[];
  formulesLabel: string;
  formules: readonly Formule[];
  servicesLabel: string;
  servicesLead: string;
  preuveLabel: string;
  services: readonly Service[];
  delaiLabel: string;
  delai: string;
  stepsLabel: string;
  steps: readonly { title: string; body: string }[];
  limitsLabel: string;
  limits: readonly string[];
  /** Mise en forme du prix : « 75 000 FCFA ». L'unité suit la langue. */
  currency: string;
  from: string;
  gainBefore: string;
  gainAfter: string;
  /** Mention portee par les illustrations : le personnage montre est fictif. */
  exemple: string;
  form: {
    /* Un formulaire Netlify DISTINCT de celui du Reseau : melanger une
       candidature gratuite et une demande de devis dans la meme table rendrait
       les deux inexploitables. */
    name: string;
    endpoint: string;
    formuleLegend: string;
    metier: { label: string; placeholder: string };
    projet: { label: string; placeholder: string };
    undecided: string;
  };
  cta: { title: string; body: string; action: string };
};

export const vitrine: VitrineCopy = {
  name: "La Vitrine",
  kicker: "Sur devis — à partir de",
  lead: "Votre compétence n'est pas en cause. Ce qui manque, c'est la page qui la rend évidente en trente secondes.",
  body: [
    "Un ingénieur, un agronome, un designer, un artisan : la plupart perdent des contrats non parce qu'ils travaillent mal, mais parce que rien ne le montre. Un profil sur un réseau social se noie en une journée. Un numéro de téléphone ne prouve rien. Un document mal fait dessert celui qui l'envoie.",
    "Nous fabriquons la pièce qui manque : une page à votre nom, écrite, mise en page et publiée, que vous transmettez d'un seul lien. Elle dit ce que vous savez faire avant que vous ayez à le dire — et elle le dit avec le même soin que les fiches projet de ce site, que vous pouvez juger avant d'acheter.",
  ],

  formulesLabel: "Trois formules",
  formules: [
    {
      id: "page",
      name: "La Page",
      prix: 75000,
      promesse: "Une adresse à votre nom, que vous envoyez au lieu de vous expliquer.",
      livrables: [
        "Entretien de cadrage et rédaction complète",
        "Une page publiée, en français et en anglais",
        "Un visuel de couverture produit pour vous",
        "Lien permanent, partageable sur WhatsApp",
      ],
      pour: "Vous avez un métier et aucune trace en ligne qui le montre.",
      gain: {
        avant: "Vous vous expliquez à chaque fois, et il faut vous croire sur parole.",
        apres: "Vous envoyez un lien. Il vous juge avant même de vous rencontrer.",
      },
    },
    {
      id: "dossier",
      name: "Le Dossier",
      prix: 175000,
      promesse: "Le document que vous laissez après un rendez-vous.",
      livrables: [
        "Tout ce que contient La Page",
        "Un dossier PDF de huit à douze pages",
        "Vos chiffres mis en forme et défendables",
        "Téléchargeable depuis votre page",
      ],
      pour: "Vous démarchez des entreprises ou des bailleurs et repartez les mains vides.",
      gain: {
        avant: "Le rendez-vous se termine, et il ne reste rien de vous sur son bureau.",
        apres: "Il repart avec un document qu'il peut relire et faire circuler.",
      },
    },
    {
      id: "identite",
      name: "L'Identité",
      prix: 350000,
      promesse: "De quoi tenir partout de la même façon, pas seulement sur une page.",
      livrables: [
        "Tout ce que contient Le Dossier",
        "Logotype et charte d'utilisation",
        "Gabarits pour les réseaux sociaux",
        "Fichiers sources, à vous",
      ],
      pour: "Vous construisez une marque, pas seulement une réputation personnelle.",
      gain: {
        avant: "Un logo ici, une couleur là, un ton ailleurs. Rien ne se ressemble.",
        apres: "Le même vous partout, jusqu'aux fichiers sources que vous gardez.",
      },
    },
  ],

  servicesLabel: "À la carte",
  servicesLead:
    "Quatre travaux qui se commandent seuls, ou en plus d'une formule. Chacun figure ici parce qu'une réalisation de ce site prouve qu'on sait le faire — vous pouvez aller la voir avant de commander.",
  preuveLabel: "Déjà fait",
  services: [
    {
      id: "kit",
      name: "Le Kit de lancement",
      prix: 60000,
      unite: "le jeu complet",
      promesse: "De quoi annoncer votre offre le jour même, partout où vous publiez.",
      contenu:
        "Bannière, vignettes carrées, couverture de boutique, et les légendes déjà écrites pour chaque réseau.",
      preuve: { slug: "full-mesh", texte: "Le kit revendeur de FullMesh Shop" },
    },
    {
      id: "video",
      name: "La Vidéo verticale",
      prix: 35000,
      unite: "la vidéo",
      promesse: "Le format qui circule vraiment ici : statuts WhatsApp, TikTok, Reels.",
      contenu:
        "Un montage 9:16 de trente à soixante secondes, sous-titré, livré en fichier — vous publiez depuis votre compte.",
      preuve: { slug: "full-mesh", texte: "La série de dix vidéos FullMesh" },
    },
    {
      id: "manuel",
      name: "Le Manuel",
      prix: 250000,
      plancher: true,
      promesse: "Votre savoir-faire transformé en document qui se vend tout seul.",
      contenu:
        "Entretiens, rédaction, mise en page, illustrations et fichier prêt à vendre. Le prix suit le nombre de pages, arrêté au brief.",
      preuve: { slug: "resine-master", texte: "Le manuel d'atelier Résine Master" },
    },
    {
      id: "plan",
      name: "Le Plan d'affaires",
      prix: 300000,
      plancher: true,
      promesse: "Le document qu'un bailleur peut instruire sans avoir à vous rappeler.",
      contenu:
        "Marché, modèle économique, comptes prévisionnels et plan de financement. Écrit pour être lu par quelqu'un qui doit décider.",
      preuve: { slug: "ferme-fdr-adone", texte: "Le dossier de la Ferme FDR-Adone" },
    },
  ],

  delaiLabel: "Délai",
  delai: "Dix jours ouvrés à compter du brief validé. Une relecture est comprise.",

  stepsLabel: "Comment ça se passe",
  steps: [
    {
      title: "Le brief",
      body: "Vous décrivez votre métier, vos réalisations et ce que vous cherchez. Un entretien de trente minutes suffit — c'est nous qui écrivons, pas vous.",
    },
    {
      title: "La production",
      body: "Nous rédigeons, mettons en page et produisons le visuel. Vous relisez une fois et vous corrigez ce qui doit l'être.",
    },
    {
      title: "La mise en ligne",
      body: "La page est publiée avec son adresse définitive. Vous la partagez le jour même.",
    },
  ],

  limitsLabel: "Ce que nous ne vendons pas",
  limits: [
    "Aucune audience. Nous ne vendons pas de visiteurs et ne promettons aucun chiffre de fréquentation.",
    "Aucun contrat, aucun investissement. Une vitrine ne décide personne à votre place — elle vous met en position de convaincre.",
    "Aucun emplacement loué. Vous ne payez pas une place sur une page, vous payez un travail de production.",
    "Aucun abonnement. Vous payez une fois ; la page reste en ligne aussi longtemps que ce site.",
  ],

  currency: "FCFA",
  from: "à partir de",
  gainBefore: "Aujourd'hui",
  gainAfter: "Après",
  exemple: "Exemple",

  form: {
    name: "devis-vitrine",
    endpoint: "/__forms.html",
    // La liste porte les trois formules ET les quatre services : parler de
    // « formule » y désignerait mal la moitié des choix.
    formuleLegend: "Ce que vous envisagez",
    metier: { label: "Votre métier", placeholder: "Ingénieur réseau, agronome, ébéniste…" },
    projet: {
      label: "Ce que vous faites, et ce que vous cherchez",
      placeholder: "Vos réalisations, vos clients actuels, le type de contrat visé.",
    },
    undecided: "Je ne sais pas encore",
  },

  cta: {
    title: "Demander un devis",
    body: "Dites-nous votre métier et ce que vous cherchez. Nous répondons avec un devis ferme, ou nous vous disons que ce n'est pas pour vous.",
    action: "Envoyer ma demande",
  },
};
