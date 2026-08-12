import { disciplineColor, services, type ServiceId } from "@/content/services";

/**
 * Projets réels. Les résumés sont tirés des dossiers présents sur le poste
 * (business plans, chartes de marque, manuels de formation) — pas inventés.
 *
 * ⚠️ À VALIDER : les années sont toutes fixées à 2026 faute de dates dans les
 * sources, et Résine Master est classé en `automation` (voir sa note).
 *
 * Plusieurs de ces entreprises sont portées par M. ADONE K. Sylvère lui-même.
 * C'est un atout à assumer plutôt qu'à masquer : l'agence exploite ce qu'elle
 * construit, ce que dit déjà le manifeste de la séquence 005.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * AJOUTER UN PROJET
 *
 * Une seule chose à faire : ajouter un objet au tableau `projects` ci-dessous.
 * Le champ `discipline` suffit — la catégorie, sa couleur, son libellé, son
 * compteur et sa présence dans le filtre sont TOUS dérivés automatiquement plus
 * bas. Il n'existe aucune liste de catégories à maintenir en parallèle : une
 * seconde liste finit toujours par diverger de la première.
 *
 * `cover` est facultatif. Sans image, la galerie compose une plaque teintée à
 * la couleur de la discipline — le projet s'affiche donc immédiatement, sans
 * attendre les visuels.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type Project = {
  /** Identifiant d'URL — doit rester stable, il sert de lien permanent. */
  slug: string;
  title: string;
  client?: string;
  year: number;
  /** Détermine à lui seul la catégorie ET la couleur du projet. */
  discipline: ServiceId;
  /** Une phrase. Ce que le projet change, pas la liste de ce qui a été fait. */
  summary: string;
  /**
   * Dossier détaillé, rendu section par section sur la fiche projet.
   * Chaque entrée doit se tenir seule : le lecteur en survole trois et s'arrête
   * sur celle qui le concerne. Quatre à cinq sections, pas davantage — au-delà,
   * la fiche redevient un document et personne ne la lit.
   */
  detail?: readonly { title: string; body: string }[];
  stack?: readonly string[];
  /**
   * Chemin dans /public, ex. "/work/mon-projet.webp". Optionnel.
   *
   * Format attendu : WebP, 1000px de large, ou SVG pour les visuels générés.
   * Les plaques s'affichent au plus à ~26vw en 4:5 — au-delà de 1000px on
   * paie de la bande passante que personne ne voit. Un script d'optimisation
   * est décrit dans le README.
   */
  cover?: string;
  /**
   * Chiffres clés, affichés en grand juste sous le titre de la fiche.
   *
   * C'est la première chose que voit un investisseur. Quatre maximum, et
   * uniquement des valeurs qu'on peut défendre : elles viennent des plans
   * d'affaires et des dossiers, jamais d'une estimation de confort.
   */
  figures?: readonly { value: string; label: string }[];
  /**
   * Le dossier d'opportunité : marché, écart concurrentiel, modèle, besoin.
   * Distinct de `detail`, qui explique le PROJET — ici on explique pourquoi
   * il mérite qu'on y mette de l'argent ou du temps.
   */
  opportunity?: readonly { title: string; body: string }[];
  /**
   * Comment la couverture occupe sa plaque. Défaut : `cover`.
   *
   * Mettre `contain` dès que l'image est une COMPOSITION — logo, affiche,
   * visuel construit. Les plaques sont larges (jusqu'à 2:1 sur la fiche) alors
   * que ces images sont carrées ou verticales : les recadrer en `cover` les
   * ampute de moitié et les agrandit. Voir `components/ui/Cover.tsx`.
   */
  coverFit?: "cover" | "contain";
  /**
   * Site en ligne du projet. Renseigné → la fiche affiche un bouton « Visiter
   * le site » et l'index marque le projet d'un ↗. Vide ou absent → rien ne
   * s'affiche, plutôt qu'un lien mort.
   */
  url?: string;
};

export const projects: readonly Project[] = [
  {
    slug: "aquacontrol-ai",
    title: "AquaControl AI",
    client: "ADN Network",
    year: 2026,
    discipline: "agritech",
    summary:
      "L'irrigation pilotée par les capteurs et la météo : l'eau va là où le rendement se joue.",
    stack: ["IoT", "Pilotage edge", "Prévision", "Tableau de bord"],
    cover: "/work/aquacontrol-ai.webp",
    // Le site de soutien est servi depuis /public : c'est un fichier HTML
    // autonome, il n'a besoin d'aucun hébergement séparé.
    url: "/sites/aquacontrol-ai.html",
    figures: [
      { value: "4,45 M", label: "FCFA — budget de lancement" },
      { value: "0 %", label: "capital cédé" },
      { value: "05", label: "exploitations pilotes" },
      { value: "200 ms", label: "décision locale, hors cloud" },
    ],
    opportunity: [
      {
        title: "Le besoin",
        body: "4 450 000 FCFA pour la Phase 1 : construction du prototype et cinq démonstrations pilotes. 100 % non dilutif — aucune part de capital n'est cédée.",
      },
      {
        title: "La répartition visée",
        body: "Fonds propres du fondateur 33 %, subventions agritech 34 %, concours et prix d'innovation 16 %, famille et pré-ventes pilotes 17 %. Aucune ligne ne dépend d'une seule source.",
      },
      {
        title: "Trois façons d'entrer",
        body: "Financer une ligne du budget contre une visibilité et un rapport d'impact chiffré. Donner quelques heures d'expertise — ingénieur, agronome, juriste, spécialiste subventions. Ou accueillir l'une des cinq démonstrations officielles sur sa parcelle.",
      },
      {
        title: "Ce qui est déjà vérifiable",
        body: "Le site de soutien n'affiche aucun montant collecté fictif et annonce une échéance réelle : prototype en construction, janvier 2027. La V1 pilote 2 000 m² avec un moteur de règles ; l'IA embarquée complète est financée par les premières ventes, pas promise avant.",
      },
    ],
    detail: [
      {
        title: "Le problème",
        body: "L'irrigation se décide au calendrier, pas au besoin. On arrose le mardi parce que c'est mardi — et l'eau part là où la plante n'en demandait pas.",
      },
      {
        title: "Le boîtier",
        body: "Panneau solaire 100 W et batterie LiFePO4 : autonomie énergétique totale, aucune dépendance au réseau électrique. Quatre vannes motorisées pilotées par zone, raccordées à un forage, une rivière ou un bassin.",
      },
      {
        title: "La décision",
        body: "Humidité du sol, météo locale et niveau d'eau relevés en continu. Un moteur de règles tranche sur place, en moins de 200 ms, sans attendre le cloud — l'IA embarquée complète arrive en V2, financée par les premières ventes.",
      },
      {
        title: "Le terrain",
        body: "Trépied mobile, fixation sur poteau ou pose au sol : installation en moins de quinze minutes, sans outillage spécialisé. Communication Wi-Fi ou LoRa, pour tenir en zone rurale à connectivité limitée.",
      },
      {
        title: "L'état d'avancement",
        body: "Prototype en construction, cinq exploitations pilotes prévues. Budget de lancement de 4 450 000 FCFA, 100 % non dilutif. Le site de soutien affiche l'avancement réel et n'annonce aucun montant collecté fictif.",
      },
    ],
  },
  {
    slug: "adone-green-service",
    title: "ADONE Green Services",
    client: "Groupe ADONE",
    year: 2026,
    discipline: "agritech",
    summary:
      "Aménagement paysager et entretien d'espaces verts, avec huit agents IA qui tiennent le devis, le planning et la qualité.",
    stack: ["Agents IA", "Devis & planning", "Suivi de chantier", "Pilotage"],
    cover: "/work/adone-green-service.svg",
    coverFit: "contain", // composition verticale construite : la recadrer la détruit
    figures: [
      { value: "150→400", label: "M FCFA — CA projeté" },
      { value: "5–10 M", label: "FCFA — levée Phase 1" },
      { value: "10 ans", label: "de savoir-faire familial" },
      { value: "90 %", label: "score client visé" },
    ],
    opportunity: [
      {
        title: "Le marché",
        body: "Le Programme d'Actions du Gouvernement 2021-2026 mobilise plus de 6 000 milliards de FCFA. Cotonou et Abomey-Calavi s'urbanisent de 3,5 % par an. Trente-cinq marchés modernes, l'ouverture du Sofitel en 2024, la présence de Maersk, Bolloré, Total et MTN : la demande en espaces verts professionnels est structurelle, pas conjoncturelle.",
      },
      {
        title: "L'écart",
        body: "Cette demande reste largement insatisfaite par des acteurs formels et réactifs. Aucun concurrent local ne combine aujourd'hui savoir-faire horticole transmis, procédures standardisées et automatisation par l'IA. Nous ne vendons pas des heures de jardinage.",
      },
      {
        title: "Le modèle",
        body: "Contrats d'entretien récurrents plutôt que chantiers ponctuels. L'entreprise vise l'autofinancement de sa croissance dès la deuxième année, la levée ne servant qu'au démarrage.",
      },
      {
        title: "Ce qui est recherché",
        body: "5 à 10 millions de FCFA sur les douze premiers mois : matériel professionnel, constitution de la SARL, fonds de roulement sur six mois, actions marketing et infrastructure numérique.",
      },
    ],
    detail: [
      {
        title: "L'entreprise",
        body: "SARL familiale d'aménagement paysager, d'entretien d'espaces verts et de nettoyage végétal. Le nom de famille devient une marque : l'objectif déclaré est une entreprise patrimoniale transmissible, pas une activité d'artisan.",
      },
      {
        title: "L'architecture ADONE 4.0",
        body: "Huit agents IA se répartissent le fonctionnement : commercial, devis, planning, comptabilité, RH, marketing, qualité et direction. Chacun tient un poste que l'entreprise n'a pas encore les moyens d'embaucher.",
      },
      {
        title: "Ce que ça change sur le chantier",
        body: "Le devis part le jour de la visite. Le planning se recale seul quand un chantier glisse. La fiche qualité se remplit sur place. Le dirigeant arbitre au lieu de ressaisir.",
      },
      {
        title: "Le socle documentaire",
        body: "Devis, facture, contrat d'entretien, contrat entreprise, fiche chantier, fiche client, rapport qualité, planning d'équipe, procédure interne : neuf modèles prêts à l'emploi dès le premier jour.",
      },
    ],
  },
  {
    slug: "full-mesh",
    title: "FullMesh Shop",
    year: 2026,
    discipline: "digital",
    summary:
      "Une boutique de produits numériques bâtie sur une règle : être vu avant d'être cru. Noir et jaune électrique, quatre couleurs, pas une de plus.",
    stack: ["Charte de marque", "Boutique en ligne", "Réseau de revendeurs"],
    cover: "/work/full-mesh.webp",
    // 1000x1250, soit exactement le 4:5 de la plaque de galerie : `contain`
    // la remplit donc presque entièrement, sans jamais la recadrer ailleurs.
    coverFit: "contain",
    figures: [
      { value: "35 %", label: "de commission revendeur" },
      { value: "12", label: "guides au catalogue" },
      { value: "5 000 F", label: "le pack — 12 000 F à l'unité" },
      { value: "Hebdo", label: "paiement, mobile money" },
    ],
    opportunity: [
      {
        title: "Le produit",
        body: "Douze guides pratiques en français, écrits pour l'Afrique francophone, montants en francs CFA. Achetés séparément : 12 000 F. En pack complet : 5 000 F. L'écart n'est pas une promotion inventée, c'est le vrai prix du catalogue.",
      },
      {
        title: "Le modèle",
        body: "Aucun stock, aucune avance, aucune livraison à gérer : le client paie, il reçoit ses fichiers par email dans la minute. Le coût marginal d'une vente supplémentaire est nul — c'est ce qui rend le modèle scalable.",
      },
      {
        title: "La distribution",
        body: "Un réseau de revendeurs rémunérés 35 % sur chaque vente, payés chaque samedi par mobile money, sans montant minimum. Le revendeur ne crée rien, ne stocke rien, n'avance rien : la barrière à l'entrée est nulle, et c'est le point.",
      },
      {
        title: "Ce qui décide de la croissance",
        body: "Le catalogue est produit et le coût de production est passé. La seule variable qui reste est le nombre de revendeurs actifs et la visibilité de leurs liens. Le kit revendeur — guide, vingt textes prêts à publier, cinquante visuels — existe pour supprimer le délai entre le recrutement et la première vente.",
      },
    ],
    detail: [
      {
        title: "Le positionnement",
        body: "Être vu avant d'être cru. Sur un téléphone, la décision se prend en moins d'une seconde : un visuel qu'on ne remarque pas ne convainc personne, aussi crédible soit-il. La direction assume l'ordre — gagner l'attention d'abord, la confiance ensuite.",
      },
      {
        title: "Quatre couleurs, pas une de plus",
        body: "Noir #0A0A0B, un vrai noir et pas un gris foncé, en fond. Jaune électrique #F5C518 pour l'accent, les prix et les boutons. Rouge #E23D28 réservé à l'urgence et aux dates limites. Le contraste noir-jaune est le plus fort qui existe : dans un fil qui défile, c'est ce qui arrête le pouce.",
      },
      {
        title: "L'écart qui crée la crédibilité",
        body: "Le registre est celui de l'affiche, pas de la brochure : gros caractères, diagonales franches, prix énorme. Ce registre est aussi celui des vendeurs, et il peut paraître agressif — on le compense par le fond. Jamais de promesse exagérée, toujours un chiffre vérifiable. La forme crie, le fond reste sérieux.",
      },
      {
        title: "Le kit livré",
        body: "Logo horizontal, empilé et monogramme, déclinés sur fond noir, blanc et jaune, en PNG et SVG. Jeu de favicons complet. Planches de construction, de tailles, de fonds et d'usages interdits. Couvertures, vignettes, bannières et kit revendeur pour la boutique.",
      },
    ],
  },
  {
    slug: "resine-master",
    title: "Résine Master",
    client: "Groupe ADONE",
    year: 2026,
    // ⚠️ DISCIPLINE À CONFIRMER. Classé en `automation` parce que ce que nous
    // avons livré, ce sont les OUTILS qui font tourner l'entreprise : gestion,
    // inventaire, manuel de formation, plan d'affaires. Si la commande portait
    // d'abord sur l'identité de la marque, basculer en `creative`.
    discipline: "automation",
    summary:
      "Une manufacture de résines structurée de bout en bout : plan d'affaires, outils de gestion et d'inventaire, manuel de formation professionnelle.",
    stack: ["Plan d'affaires", "Gestion & inventaire", "Manuel de formation"],
    cover: "/work/resine-master.svg",
    coverFit: "contain", // composition verticale construite
    figures: [
      { value: "6,55 M", label: "FCFA — investissement initial" },
      { value: "18→250", label: "M FCFA — CA projeté sur 10 ans" },
      { value: "03", label: "matrices de résine" },
      { value: "120 s", label: "polymérisation UV" },
    ],
    opportunity: [
      {
        title: "Le marché",
        body: "Le boom immobilier béninois — hôtellerie, bâtiments corporatifs, résidences de standing — se heurte à l'absence de fabricants locaux. Architectes, designers d'intérieur et promoteurs importent, en devises et avec des délais qu'ils subissent.",
      },
      {
        title: "L'investissement",
        body: "6 550 000 FCFA de capital de démarrage : équipement de coulée, polymérisation UV/LED de grade industriel à 395 nm, protection opérateur aux normes, et un premier lot de 200 kg de résine époxy.",
      },
      {
        title: "Les projections",
        body: "18 millions de FCFA de chiffre d'affaires la première année, puis 35 et 75, et 250 millions à l'horizon décennal — sur des hypothèses que le plan d'affaires déclare lui-même conservatrices.",
      },
      {
        title: "La barrière à l'entrée",
        body: "Le centre de formation intégré produit les applicateurs certifiés qui manquent au marché. Former la main-d'œuvre, c'est créer le marché en même temps que l'offre — et rendre l'avance technique difficile à rattraper.",
      },
    ],
    detail: [
      {
        title: "L'unité",
        body: "Manufacture de polymères à Abomey-Calavi : formulation, coulée et polymérisation industrielle de trois matrices — époxy bi-composants, polyuréthanes structurels, acryliques photopolymérisables UV. Constituée en SARL dès le premier jour, à rebours des ateliers informels du secteur.",
      },
      {
        title: "Le marché",
        body: "Le boom immobilier béninois — complexes hôteliers, bâtiments corporatifs, résidences de standing — se heurte à l'absence de fabricants locaux. Architectes et promoteurs importent, en devises et avec des délais qu'ils subissent.",
      },
      {
        title: "La gamme",
        body: "Pôle Fine Wood & Epoxy Architecture : mobilier monolithique de prestige — tables rivières, comptoirs de réception, plans de travail. Et l'application certifiée de sols industriels techniques.",
      },
      {
        title: "Le centre de formation",
        body: "Un manuel de formation professionnelle documente ratios, temps de mélange et règles de polymérisation. Former les applicateurs, c'est créer le marché en même temps que l'offre — et c'est là que se joue l'avance technique.",
      },
      {
        title: "Les instruments de pilotage",
        body: "Plan d'affaires bancaire et stratégie décennale, classeurs de gestion et d'inventaire. L'entreprise démarre avec ses instruments de mesure, pas une fois les problèmes arrivés.",
      },
    ],
  },
  {
    slug: "tshirt-gemini",
    title: "T-Shirt Gemini",
    year: 2026,
    discipline: "creative",
    summary:
      "Une typographie qui porte le message avant le vêtement : composition rouge, verticale, lisible à trois mètres.",
    stack: ["Design graphique", "Typographie", "Textile"],
    cover: "/work/tshirt-gemini.webp",
    coverFit: "contain", // affiche verticale : le recadrage n'en laissait qu'une bande
    detail: [
      {
        title: "L'idée",
        body: "Faire tenir sur un torse un signe du zodiaque, un motif béninois et une injonction de salle de sport — sans qu'aucun des trois n'écrase les deux autres.",
      },
      {
        title: "La composition",
        body: "Trois blocs typographiques empilés sur l'axe vertical — PUSH / YOUR / LIMIT — en serif groovy noir sur cartouches clairs. L'axe est tenu par une barre d'haltères qui traverse toute la hauteur du visuel.",
      },
      {
        title: "Le fond",
        body: "Un motif rouge dense, à la géométrie proche des tissus imprimés locaux, strictement symétrique par rapport à l'axe. Saturé là où le texte ne passe pas, atténué là où il passe : la lisibilité est obtenue par le fond, pas par un contour ajouté.",
      },
      {
        title: "Les signes",
        body: "Le glyphe des Gémeaux marque les deux épaules et referme la composition. « Woli Medji » l'ancre au Fa béninois — le même signe, dit dans deux langues.",
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   DÉRIVATIONS — rien à maintenir ici, tout découle de `projects`.
   ═══════════════════════════════════════════════════════════════════════ */

export type ProjectCategory = {
  id: ServiceId;
  name: string;
  color: string;
  count: number;
};

/**
 * Catégories réellement représentées, dans l'ordre canonique des disciplines.
 *
 * On part de `services` et non des projets pour l'ordre : trier par ordre
 * d'apparition ferait sauter le filtre d'une position dès qu'on ajoute un
 * projet en haut du tableau.
 */
export const projectCategories: readonly ProjectCategory[] = services
  .map((s) => ({
    id: s.id,
    name: s.name,
    color: disciplineColor[s.id],
    count: projects.filter((p) => p.discipline === s.id).length,
  }))
  .filter((c) => c.count > 0);

/** Projets d'une catégorie, ou tous si `null`. Toujours du plus récent au plus ancien. */
export function projectsByCategory(id: ServiceId | null): readonly Project[] {
  const list = id ? projects.filter((p) => p.discipline === id) : projects;
  return [...list].sort((a, b) => b.year - a.year);
}

/** Libellé de discipline d'un projet — évite de recroiser les deux tableaux à la main. */
export function disciplineName(id: ServiceId): string {
  return services.find((s) => s.id === id)?.name ?? id;
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * Projet suivant, en boucle.
 *
 * La boucle est délibérée : arriver au dernier projet ne doit pas produire un
 * cul-de-sac. Le lecteur qui suit l'enchaînement revient au premier plutôt que
 * de se retrouver devant un lien absent.
 */
export function nextProject(slug: string): Project | undefined {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return projects[(i + 1) % projects.length];
}

/** Position du projet dans la sélection — sert à l'index affiché. */
export function projectIndex(slug: string): number {
  return projects.findIndex((p) => p.slug === slug) + 1;
}
