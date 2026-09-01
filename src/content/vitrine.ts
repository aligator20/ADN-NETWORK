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
};

export type VitrineCopy = {
  name: string;
  kicker: string;
  lead: string;
  body: readonly string[];
  formulesLabel: string;
  formules: readonly Formule[];
  delaiLabel: string;
  delai: string;
  stepsLabel: string;
  steps: readonly { title: string; body: string }[];
  limitsLabel: string;
  limits: readonly string[];
  /** Mise en forme du prix : « 75 000 FCFA ». L'unité suit la langue. */
  currency: string;
  from: string;
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

  form: {
    name: "devis-vitrine",
    endpoint: "/__forms.html",
    formuleLegend: "Formule envisagée",
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
