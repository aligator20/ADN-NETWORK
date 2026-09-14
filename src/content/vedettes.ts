import type { ServiceId } from "@/content/services";

/**
 * LES DIX VEDETTES — une prestation nommée par discipline.
 *
 * POURQUOI CE FICHIER EXISTE
 *
 * La section « Disciplines » dit ce qu'on SAIT faire. Elle ne dit nulle part ce
 * qu'on peut COMMANDER. Un visiteur convaincu par « Automatisation — les
 * processus qui vous coûtent des heures se mettent à tourner seuls » n'a
 * ensuite aucun objet à demander, aucun ordre de grandeur, aucune porte. Dix
 * disciplines, dix prestations : une par discipline, nommée et chiffrée.
 *
 * LA RÈGLE D'ADMISSION — CE QUI A ÉTÉ ÉCARTÉ, ET POURQUOI
 *
 * Chaque vedette doit être tenable sans dommage pour celui qui la vend. Le
 * champ `preuve` porte la réalisation qui l'atteste ; quand il est vide, c'est
 * que rien n'est encore publié, et la promesse est alors resserrée en
 * conséquence plutôt que gonflée pour compenser.
 *
 * Ont été écartés, faute de pouvoir être honorés aujourd'hui :
 *
 * — Le déploiement d'infrastructure réseau et le test d'intrusion. Réseau et
 *   Cybersécurité sont déclarés `pathway` : ce sont des voies d'accès, pas des
 *   prestations. Leurs vedettes sont donc des parcours de formation, ce qui est
 *   exactement ce que le matériel pédagogique existant permet de tenir.
 * — L'installation d'un système d'irrigation piloté. AquaControl AI est en
 *   recherche de financement, avec un prototype et zéro déploiement : vendre
 *   l'installation reviendrait à apprendre sur le chantier d'un client. La
 *   vedette Agritech est une ÉTUDE — dimensionnement, capteurs, coûts,
 *   retour sur investissement — ce que le dossier prouve savoir produire.
 * — Le développement de modèles sur mesure, l'entraînement spécifique et
 *   l'hébergement d'agents sous engagement de service. Aucune référence
 *   publiée, et un engagement de disponibilité se tient ou se paie.
 * — Tout ce qui touche au contenu médical. La discipline Santé le dit déjà
 *   dans sa propre phrase ; sa vedette s'arrête à la même ligne.
 *
 * LES PRIX SONT UNE PROPOSITION, PAS UNE DÉCISION — même règle que la Vitrine.
 * Ce sont des PLANCHERS : la charge réelle se fixe au brief, et un plancher
 * qu'on tient vaut mieux qu'un tarif qu'on renégocie.
 */
export type Vedette = {
  /** La discipline dont c'est la prestation phare. */
  id: ServiceId;
  name: string;
  /** Prix plancher en FCFA. Nombre : la mise en forme dépend de la langue. */
  prix: number;
  /** Ce que le client obtient, en une phrase. */
  promesse: string;
  /** Ce qui est livré, d'un trait. */
  contenu: string;
  /**
   * Le slug de la réalisation qui atteste la compétence, s'il en existe une.
   *
   * Absent pour Réseau et Cybersécurité : aucun projet publié dans ces
   * disciplines. Leur nature `pathway` porte déjà l'avertissement, et la vue
   * n'affiche pas de lien plutôt que d'en inventer un.
   */
  preuve?: { slug: string; texte: string };
  /**
   * Les démonstrations ouvrables produites pour cette prestation.
   *
   * Une LISTE, parce que la ligne IA en porte deux qui ne se remplacent pas :
   * l'étendue du travail qu'on fait pour quelqu'un, et l'offre qu'on monte à
   * quelqu'un. Un champ unique aurait obligé à en cacher une.
   *
   * Un lien vers une réalisation demande de croire sur parole ; une
   * démonstration se manipule. Les fichiers vivent sous /demo, hors du cache
   * long de /work, parce qu'ils seront corrigés plus souvent qu'une image.
   *
   * L'entreprise et les chiffres y sont fictifs, et chaque page le porte
   * écrit — y compris à l'impression, un document sorti de son écran ne
   * gardant que ce qui est imprimé dessus.
   */
  demo?: readonly { href: string; texte: string }[];
};

/**
 * UNE LIAISON — une prestation dont la valeur vient des autres clients.
 *
 * Une vedette se paie parce qu'on fournit du travail. Une liaison ne coûte
 * rien à l'entrée et vaut d'autant plus que le réseau est fourni : c'est la
 * différence entre vendre dix produits et faire tenir un réseau.
 *
 * `gain` dit ce que chaque nouvelle entrée apporte à ceux qui sont déjà là.
 * Sans cette phrase, une liaison se lit comme un service gratuit de plus ;
 * avec elle, on comprend pourquoi elle grandit toute seule.
 */
export type Liaison = {
  id: string;
  name: string;
  /** Ce que ça coûte à l'entrée. Zéro, ou une part prélevée après coup. */
  cout: string;
  promesse: string;
  contenu: string;
  /** L'effet de réseau, dit en une phrase vérifiable. */
  gain: string;
};

export type VedettesCopy = {
  kicker: string;
  name: string;
  lead: string;
  body: readonly string[];
  listLabel: string;
  preuveLabel: string;
  demoLabel: string;
  sansPreuveLabel: string;
  from: string;
  currency: string;
  /** Porte depuis la section Disciplines de l'accueil. */
  cta: string;
  items: readonly Vedette[];
  liaisonsLabel: string;
  liaisonsTitre: string;
  liaisonsLead: string;
  liaisonsGainLabel: string;
  liaisonsCoutLabel: string;
  liaisons: readonly Liaison[];
  /** L'état réel du réseau, écrit sans fard. Voir le commentaire du contenu. */
  etatTitre: string;
  etat: string;
  prixNote: string;
};

export const vedettes: VedettesCopy = {
  kicker: "Dix prestations — à partir de",
  name: "Ce que nous fabriquons",
  lead: "Une prestation nommée et chiffrée par discipline, plutôt qu'une liste de compétences que personne ne sait commander.",
  body: [
    "Chacune existe ici parce qu'elle a déjà été produite au moins une fois, et le lien vers la réalisation est posé à côté. Deux d'entre elles n'en portent pas : ce sont des parcours de formation, dans les deux disciplines où nous ouvrons la voie sans prétendre livrer.",
    "Les montants sont des planchers. La charge réelle se fixe au brief — un manuel de quarante pages et un catalogue de six cents ne se facturent pas au même prix, et annoncer un tarif unique obligerait à le renégocier devant le client.",
  ],
  listLabel: "Les dix",
  preuveLabel: "Déjà fait",
  demoLabel: "À manipuler",
  sansPreuveLabel: "Voie d'accès",
  from: "à partir de",
  currency: "FCFA",
  cta: "Voir les dix prestations",

  liaisonsLabel: "Les liaisons",
  liaisonsTitre: "Ce qui en fait un réseau plutôt qu'un catalogue",
  liaisonsLead:
    "Dix prestations côte à côte forment une liste. Ce qui suit ne se vend pas au travail fourni : ça ne coûte rien à l'entrée, et ça vaut d'autant plus que nous sommes nombreux. C'est la seule différence réelle entre une agence et un réseau.",
  liaisonsGainLabel: "Ce que ça rend",
  liaisonsCoutLabel: "À l'entrée",

  liaisons: [
    {
      id: "annuaire",
      name: "L'Annuaire",
      cout: "0 F — compris",
      promesse: "Toute page produite ici entre dans un annuaire public, à vie.",
      contenu:
        "Rangé par métier et par ville, consultable sans compte. Vous n'avez rien à tenir à jour : votre page est déjà écrite, elle entre telle quelle.",
      gain: "Chaque page qui entre rend l'annuaire plus consulté — donc chaque page déjà là plus visible. C'est la seule chose sur ce site dont la valeur augmente sans qu'on y retouche.",
    },
    {
      id: "relation",
      name: "La Mise en relation",
      cout: "0 F entre inscrits",
      promesse: "Une demande qui nous arrive part à quelqu'un de l'annuaire.",
      contenu:
        "Nous savons ce que chacun fait, puisque nous avons écrit sa page. Quand un client cherche un fournisseur, un artisan ou un technicien, il est orienté vers un inscrit — nommément, pas vers une liste.",
      gain: "Plus l'annuaire couvre de métiers, plus la demande qui arrive trouve preneur. Un inscrit de plus, c'est une demande de moins qui se perd.",
    },
    {
      id: "parrainage",
      name: "Le Parrainage",
      cout: "0 F — 20 % sur la première commande",
      promesse: "Vous amenez quelqu'un, vous touchez une part de ce qu'il paie.",
      contenu:
        "Vingt pour cent de sa première commande, réglés par mobile money, sans montant minimum. Rien à avancer, rien à stocker : la même mécanique que le réseau de revendeurs FullMesh, appliquée aux prestations.",
      gain: "C'est le seul mécanisme qui fait grandir l'annuaire sans budget de publicité — et celui qui parraine a intérêt à ce que le travail soit bien fait.",
    },
  ],

  /* ⚠️ L'ÉTAT RÉEL DU RÉSEAU, ÉCRIT SANS FARD.
     Un annuaire qui se prétend fourni quand il est vide se fait démasquer à
     la première recherche, et emporte la crédibilité de tout le reste de la
     page. Le dire protège — et c'est aussi le meilleur argument qui existe
     pour celui qui hésite : la première place vaut mieux que la centième. */
  etatTitre: "Où en est le réseau, aujourd'hui",
  etat: "L'annuaire ne contient encore que les projets de ce site. Nous préférons l'écrire plutôt que de vous laisser le découvrir : un réseau qui se prétend plein quand il est vide perd tout ce qu'il a construit à la première recherche. Vous savez donc exactement ce que vous rejoignez — et la première place y vaut mieux que la centième.",

  prixNote:
    "Les montants ci-dessus tiennent compte de ce que le réseau rend : une page entre à l'annuaire et y est trouvée, un client qui en amène un autre touche sa part. Ce n'est pas un rabais et il n'y a aucune date limite — c'est le partage d'un coût.",

  items: [
    {
      id: "digital",
      name: "Le Site complet",
      prix: 225000,
      promesse: "Un site à votre nom, bilingue, qui vous survit techniquement.",
      contenu:
        "Arborescence, rédaction, mise en page, publication et nom de domaine. Pages statiques : rien à maintenir, rien qui tombe, et une facture d'hébergement quasi nulle.",
      preuve: { slug: "full-mesh", texte: "La boutique FullMesh Shop" },
      demo: [{ href: "/demo/site/", texte: "Ouvrir le site d'exemple" }],
    },
    {
      id: "ai",
      name: "L'Agence IA",
      prix: 200000,
      promesse: "Votre propre offre de services IA, montée de bout en bout.",
      contenu:
        "Catalogue de prestations, bibliothèque de prompts, chaîne de production des visuels et des textes, grille de prix, et le kit qui vous sert à vendre. Nous l'avons monté pour nous d'abord.",
      preuve: { slug: "full-mesh", texte: "FullMesh Shop, notre propre offre" },
      demo: [
        { href: "/demo/ia/", texte: "Les quatre chantiers IA" },
        { href: "/demo/agence-ia/", texte: "Le dossier de lancement" },
      ],
    },
    {
      id: "automation",
      name: "Le Poste de pilotage",
      prix: 90000,
      promesse: "Les instruments qui font tourner l'entreprise sans vous.",
      contenu:
        "Classeurs de gestion et d'inventaire, procédures écrites, tableaux de suivi. L'entreprise démarre avec ses instruments de mesure, pas une fois les problèmes arrivés.",
      preuve: { slug: "resine-master", texte: "Les instruments de Résine Master" },
      demo: [{ href: "/demo/pilotage/", texte: "Ouvrir la démonstration" }],
    },
    {
      id: "network",
      name: "Le Parcours réseau",
      prix: 22500,
      promesse: "De quoi entrer dans un métier qui embauche, sans école coûteuse.",
      contenu:
        "Orientation, fondamentaux — adressage, VLAN, routage, sans-fil —, préparation aux certifications et mise en relation. Nous formons et nous orientons ; nous ne déployons pas votre infrastructure.",
      demo: [{ href: "/demo/reseau/", texte: "Le programme et l’établi VLSM" }],
    },
    {
      id: "cybersecurity",
      name: "Le Parcours cyber",
      prix: 22500,
      promesse: "L'entrée dans un domaine qui recrute plus vite qu'il ne forme.",
      contenu:
        "Fondamentaux défensifs — authentification par port, segmentation, durcissement —, préparation aux certifications, accompagnement de parcours. Aucun test d'intrusion vendu : nous accompagnons ceux qui veulent y entrer.",
      // Même page que le parcours réseau, à l'ancre du module 04 : le
      // fondamental défensif EST ce module. Une page séparée n'aurait rien
      // de plus à montrer et diviserait le seul matériel qui existe.
      demo: [{ href: "/demo/reseau/#programme", texte: "Le module 04 du parcours" }],
    },
    {
      id: "creative",
      name: "Le Dossier de marque",
      prix: 175000,
      promesse: "Un système qui tient partout, pas un logo posé sur un fichier.",
      contenu:
        "Emblème, déclinaison réduite, familles typographiques, palette à rôles, motif secondaire et règles d'usage. Une charte qui interdit vaut mieux qu'une charte qui suggère.",
      preuve: { slug: "tshirt-gemini", texte: "Le dossier GEMINI" },
    },
    {
      id: "agritech",
      name: "L'Étude d'irrigation",
      prix: 125000,
      promesse: "Savoir ce que coûte et ce que rapporte un pilotage de l'eau, avant d'acheter.",
      contenu:
        "Dimensionnement, choix des capteurs, chiffrage de l'installation et retour sur investissement. C'est une étude : l'installation elle-même n'est pas de notre ressort aujourd'hui, et nous le disons avant que vous le découvriez.",
      preuve: { slug: "aquacontrol-ai", texte: "Le dossier AquaControl AI" },
    },
    {
      id: "farming",
      name: "Le Plan parcellaire",
      prix: 100000,
      promesse: "Une exploitation qui grandit avec ses revenus, pas avec des levées.",
      contenu:
        "Découpage des parcelles, calendrier cultural, paliers de mécanisation, intégration de l'élevage et prévisionnel décennal.",
      preuve: { slug: "ferme-fdr-adone", texte: "La Ferme FDR-Adone" },
    },
    {
      id: "food",
      name: "L'Unité de transformation",
      prix: 175000,
      promesse: "Transformer sur place ce qui partait brut.",
      contenu:
        "Étude d'implantation, gamme et marque produit, conditionnement, circuit de distribution et comptes prévisionnels.",
      preuve: { slug: "adn-taste", texte: "ADN TASTE" },
    },
    {
      id: "sante",
      name: "Le Parcours patient",
      prix: 150000,
      promesse: "Faire circuler l'information là où le parcours de soins la laisse s'arrêter.",
      contenu:
        "Cartographie du parcours, repérage des points de rupture, procédures de continuité et médiation administrative. Jamais de contenu médical, jamais d'acte de soin.",
      preuve: { slug: "operateur-continuite", texte: "L'Opérateur de continuité" },
    },
  ],
};
