/**
 * LES ACTIVITÉS DU GROUPE — ce que l'annonce d'arrivée présente.
 *
 * ⚠️ UNE ACTIVITÉ N'ENTRE ICI QUE SI SON ADRESSE RÉPOND.
 *
 * Chaque lien externe de ce fichier a été ouvert avant d'être écrit. Une
 * annonce qui s'impose au visiteur et l'envoie sur une page morte coûte
 * beaucoup plus cher que l'absence d'annonce : elle a interrompu sa lecture
 * pour lui faire perdre son temps. Si une adresse tombe, on retire la ligne.
 *
 * `interne` distingue une page de ce site d'un site tiers : les premières
 * passent par le routeur et suivent la langue, les secondes s'ouvrent dans un
 * nouvel onglet avec `rel="noopener"`.
 */
export type Activite = {
  id: string;
  nom: string;
  /** Ce que l'activité fait, en une ligne. Pas un slogan. */
  phrase: string;
  /** Chemin interne (de référence, en français) ou adresse complète. */
  href: string;
  interne: boolean;
  /** La teinte de la pastille. Hors du code disciplinaire du site. */
  teinte: string;
};

export const activites: readonly Activite[] = [
  {
    id: "services",
    nom: "ADN NETWORK",
    phrase: "Sites, marque, IA, agriculture, santé — dix prestations chiffrées.",
    href: "/services",
    interne: true,
    teinte: "#c6f24e",
  },
  {
    id: "vitrine",
    nom: "La Vitrine",
    phrase: "Une page à votre nom, pour ceux qui ont déjà un métier.",
    href: "/vitrine",
    interne: true,
    teinte: "#4d93ff",
  },
  {
    id: "fullmesh",
    nom: "FullMesh Shop",
    phrase: "Dix-sept guides numériques, payables et téléchargeables en ligne.",
    href: "https://fullmeshshop.mychariow.market",
    interne: false,
    teinte: "#f5c518",
  },
  {
    id: "adone",
    nom: "ADONE Green Services",
    phrase: "Jardins, entretien sous contrat, plantes livrées à Cotonou.",
    href: "https://adone-green-services.netlify.app",
    interne: false,
    teinte: "#4ade80",
  },
  {
    id: "thugland",
    nom: "THUGLAND ENTERTAINMENT",
    phrase: "Le label d'OIM THUG : sorties, panoplies, ligne de vêtements.",
    href: "https://oimthug.life",
    interne: false,
    teinte: "#ff4d58",
  },
];
