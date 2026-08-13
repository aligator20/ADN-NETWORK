/**
 * Les 7 disciplines — séquence 003.
 *
 * Le copy du site est en anglais (comme la baseline et le CTA) ; seuls les
 * commentaires sont en français.
 *
 * `statement` est la promesse — ce que ça change — pas la description technique.
 * `capabilities` reste volontairement court : 4 entrées maximum, sinon la ligne
 * cesse d'être une ligne et redevient une carte.
 */
export type ServiceId =
  | "digital"
  | "ai"
  | "automation"
  | "network"
  | "cybersecurity"
  | "creative"
  | "agritech"
  | "farming"
  | "food";

/**
 * Deux natures d'offre, et la distinction est affichée.
 *
 * `delivery` — nous produisons et nous livrons.
 * `pathway`  — nous ouvrons la voie : orientation, formation, mise en relation.
 *
 * Ce champ existe pour une raison précise : annoncer du test d'intrusion sans
 * une seule référence derrière fait perdre des contrats au lieu d'en gagner.
 * Dire « orientation » quand c'est de l'orientation est plus crédible, et
 * ouvre un marché — celui de gens qui cherchent un débouché dans le secteur.
 */
export type ServiceKind = "delivery" | "pathway";

export type Service = {
  id: ServiceId;
  name: string;
  kind: ServiceKind;
  statement: string;
  capabilities: readonly string[];
};

/**
 * Code couleur de la marque : une teinte par discipline.
 *
 * On référence les variables CSS et non des hexadécimaux : le design system
 * reste la source unique, et un changement de charte ne touche qu'à
 * `globals.css`. Tailwind ne peut pas générer de classe dynamique
 * (`text-${id}` n'existe pas), donc ces valeurs partent en style inline.
 */
export const disciplineColor: Record<ServiceId, string> = {
  digital: "var(--color-digital)",
  ai: "var(--color-ai)",
  automation: "var(--color-automation)",
  network: "var(--color-network)",
  cybersecurity: "var(--color-cyber)",
  creative: "var(--color-creative)",
  agritech: "var(--color-agritech)",
  farming: "var(--color-farming)",
  food: "var(--color-food)",
};

export const services: readonly Service[] = [
  {
    id: "digital",
    name: "Digital",
    kind: "delivery",
    statement: "Des plateformes et des produits taillés pour tenir la charge et la durée.",
    capabilities: ["Plateformes web", "Ingénierie produit", "Design systems", "Performance"],
  },
  {
    id: "ai",
    name: "IA",
    kind: "delivery",
    statement: "De l'intelligence appliquée, branchée sur vos données réelles.",
    capabilities: ["Intégration LLM", "RAG", "Vision par ordinateur", "Agents"],
  },
  {
    id: "automation",
    name: "Automatisation",
    kind: "delivery",
    statement: "Les processus qui vous coûtent des heures se mettent à tourner seuls.",
    capabilities: ["Orchestration", "Pipelines de données", "Intégrations", "RPA"],
  },
  {
    id: "network",
    name: "Réseau",
    kind: "pathway",
    statement:
      "Le secteur embauche, et presque personne n'ouvre la porte. Nous formons et nous orientons vers les métiers de l'infrastructure.",
    capabilities: [
      "Orientation métier",
      "Fondamentaux réseau",
      "Préparation aux certifications",
      "Mise en relation",
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersécurité",
    kind: "pathway",
    statement:
      "Un domaine qui recrute plus vite qu'il ne forme. Nous accompagnons ceux qui veulent y entrer, pas ceux qui veulent en parler.",
    capabilities: [
      "Orientation métier",
      "Fondamentaux défensifs",
      "Préparation aux certifications",
      "Accompagnement de parcours",
    ],
  },
  {
    id: "creative",
    name: "Création",
    kind: "delivery",
    statement: "Une identité qui rend la technologie désirable.",
    capabilities: ["Identité de marque", "Direction artistique", "Motion", "Design graphique"],
  },
  {
    id: "agritech",
    name: "Agritech",
    kind: "delivery",
    statement: "Le capteur, l'eau et la donnée — du champ au tableau de bord.",
    capabilities: ["Capteurs IoT", "Pilotage d'irrigation", "Analyse de rendement", "Traçabilité"],
  },
  {
    id: "farming",
    name: "Agriculture & Élevage",
    kind: "delivery",
    statement:
      "Des exploitations conçues pour grandir avec leurs propres revenus, pas avec des levées successives.",
    capabilities: [
      "Plan parcellaire",
      "Mécanisation par paliers",
      "Élevage intégré",
      "Économie circulaire",
    ],
  },
  {
    id: "food",
    name: "Agroalimentaire",
    kind: "delivery",
    statement:
      "Transformer sur place ce qui partait brut : la valeur reste là où elle est produite.",
    capabilities: ["Marque produit", "Unité de transformation", "Conditionnement", "Distribution"],
  },
] as const;

/** Chiffres de la séquence 002. `value` est la cible du compteur animé. */
export const metrics = [
  { value: 7, suffix: "", label: "Disciplines" },
  { value: 100, suffix: "%", label: "Sur-mesure" },
  { value: 24, suffix: "/7", label: "Supervision" },
  { value: 1, suffix: "", label: "Interlocuteur" },
] as const;
