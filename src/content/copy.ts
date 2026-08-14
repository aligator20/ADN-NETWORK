/**
 * LE DICTIONNAIRE
 *
 * Un seul point d'entrée pour tout le texte du site : `copy(lang)`. Les
 * composants n'importent plus `site`, `ui` ou `projects` directement — ils
 * demandent le paquet correspondant à la langue de la page.
 *
 * LE TYPE `Copy` EST ÉCRIT À LA MAIN, ET C'EST LE POINT IMPORTANT.
 *
 * On pourrait le déduire du français avec `typeof`. On aurait tort : les objets
 * français sont déclarés `as const`, donc leurs propriétés ont des types
 * LITTÉRAUX (`cta` vaut le type `"CONSTRUISONS L'IMPOSSIBLE."`, pas `string`).
 * Aucune traduction ne serait alors assignable. En déclarant le contrat
 * explicitement, on obtient l'inverse de ce piège : ajouter un libellé au
 * français et oublier l'anglais devient une ERREUR DE COMPILATION, pas un
 * texte français qui traîne dans une page anglaise.
 *
 * Ce qui n'est PAS ici : les couleurs, les identifiants de discipline, les
 * slugs, les statuts. Ce sont des données de structure, communes aux deux
 * langues, et elles continuent de s'importer depuis leur module d'origine.
 */
import {
  communityEn,
  legalEn,
  navEn,
  projectsEn,
  servicesEn,
  siteEn,
  statusLabelEn,
  aboutEn,
  contactEn,
  disciplinesEn,
  introManifestEn,
  metricsEn,
  sequencesEn,
  uiEn,
} from "@/content/en";
import { community as communityFr } from "@/content/community";
import { legal as legalFr, type LegalCopy } from "@/content/legal";
import { projects as projectsFr, statusLabel as statusLabelFr } from "@/content/projects";
import type { Project, ProjectStatus } from "@/content/projects";
import {
  disciplineColor,
  metrics as metricsFr,
  services as servicesFr,
} from "@/content/services";
import type { Service } from "@/content/services";
import {
  about as aboutFr,
  contact as contactFr,
  disciplines as disciplinesFr,
  introManifest as introManifestFr,
  nav as navFr,
  sequences as sequencesFr,
  site as siteFr,
  ui as uiFr,
  type NavItem,
  type SequenceId,
} from "@/content/site";
import type { Lang } from "@/lib/lang";

/* ── Le contrat ──────────────────────────────────────────────────────────── */

export type CommunityCopy = {
  name: string;
  lead: string;
  body: readonly string[];
  roles: readonly {
    id: string;
    title: string;
    color: string;
    body: string;
    give: string;
    get: string;
  }[];
  steps: readonly { title: string; body: string }[];
  limits: readonly string[];
  cta: { title: string; body: string; action: string };
  form: {
    name: string;
    endpoint: string;
    roleLegend: string;
    fields: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      phone: { label: string; placeholder: string; hint: string };
      place: { label: string; placeholder: string };
      project: { label: string; placeholder: string };
    };
    consent: string;
    honeypot: string;
    whatsapp: string;
    whatsappMessage: string;
    incomplete: string;
    sending: string;
    sent: { title: string; body: string };
    failed: { title: string; body: string; action: string };
  };
};

export type Copy = {
  site: {
    name: string;
    wordmark: { first: string; second: string };
    tagline: readonly string[];
    founded: string;
    base: { city: string; country: string; coords: string; timezone: string };
    email: string;
    whatsapp: { wa: string; display: string };
    url: string;
    owner: { name: string; role: string };
    socials: readonly { label: string; handle: string; url?: string }[];
    cta: string;
  };
  sequences: readonly { id: SequenceId; index: number; label: string }[];
  nav: readonly NavItem[];
  introManifest: readonly { text: string; accent?: boolean }[];
  disciplines: readonly string[];
  about: {
    lead: string;
    body: readonly string[];
    principles: readonly { title: string; text: string }[];
  };
  contact: { lead: string; action: string };
  /** Les clés viennent du français : en oublier une en anglais ne compile pas. */
  ui: Record<keyof typeof uiFr, string>;
  services: readonly Service[];
  metrics: readonly { value: number; suffix: string; label: string }[];
  projects: readonly Project[];
  statusLabel: Record<ProjectStatus, string>;
  community: CommunityCopy;
  legal: LegalCopy;
  /** Sert aux titres de sections dépourvus de conteneur dédié. */
  labels: {
    openNoFee: string;
    threeRoles: string;
    howItWorks: string;
    whatItIsNot: string;
    quickReply: string;
    legalInfo: string;
    noAccount: string;
    dataUse: string;
  };
};

/* ── Français ────────────────────────────────────────────────────────────── */

const FR: Copy = {
  site: siteFr,
  sequences: sequencesFr,
  nav: navFr,
  introManifest: introManifestFr,
  disciplines: disciplinesFr,
  about: aboutFr,
  contact: contactFr,
  ui: uiFr,
  services: servicesFr,
  metrics: metricsFr,
  projects: projectsFr,
  statusLabel: statusLabelFr,
  community: communityFr,
  legal: legalFr,
  labels: {
    openNoFee: "Ouvert — sans frais d'entrée",
    threeRoles: "Trois rôles, une seule table",
    howItWorks: "Comment ça marche",
    whatItIsNot: "Ce que Le Réseau n'est pas",
    quickReply: "Réponse rapide",
    legalInfo: "Informations légales",
    noAccount: "Aucun compte à créer.",
    dataUse:
      "Vos réponses ne servent qu'à instruire la candidature. Elles ne sont ni cédées, ni revendues.",
  },
};

/* ── Anglais ─────────────────────────────────────────────────────────────── */

const EN: Copy = {
  site: siteEn,
  sequences: sequencesEn,
  nav: navEn,
  introManifest: introManifestEn,
  disciplines: disciplinesEn,
  about: aboutEn,
  contact: contactEn,
  ui: uiEn,
  services: servicesEn,
  metrics: metricsEn,
  projects: projectsEn,
  statusLabel: statusLabelEn,
  community: communityEn,
  legal: legalEn,
  labels: {
    openNoFee: "Open — no entry fee",
    threeRoles: "Three roles, one table",
    howItWorks: "How it works",
    whatItIsNot: "What The Network is not",
    quickReply: "Fast reply",
    legalInfo: "Legal information",
    noAccount: "No account to create.",
    dataUse:
      "Your answers are used only to consider the application. They are neither shared nor sold.",
  },
};

const DICTIONNAIRES: Record<Lang, Copy> = { fr: FR, en: EN };

/** Le paquet de textes d'une langue. Utilisable côté serveur comme client. */
export function copy(lang: Lang): Copy {
  return DICTIONNAIRES[lang];
}

/* ── Dérivations dépendantes de la langue ────────────────────────────────── */

export type ProjectCategory = {
  id: Service["id"];
  name: string;
  color: string;
  count: number;
};

/** Le libellé d'une discipline dans la langue demandée. */
export function disciplineNameIn(lang: Lang, id: Service["id"]): string {
  return copy(lang).services.find((s) => s.id === id)?.name ?? id;
}

/**
 * Les catégories du filtre, dans la langue demandée.
 *
 * Le comptage se fait sur les projets français : les deux tableaux ont la même
 * longueur et le même ordre par construction (`projectsEn` est un `map` du
 * français), donc compter d'un côté ou de l'autre revient au même — et compter
 * sur la référence évite qu'un jour les deux divergent silencieusement.
 */
export function projectCategoriesIn(lang: Lang): readonly ProjectCategory[] {
  return copy(lang)
    .services.map((s) => ({
      id: s.id,
      name: s.name,
      color: disciplineColor[s.id],
      count: projectsFr.filter((p) => p.discipline === s.id).length,
    }))
    .filter((c) => c.count > 0);
}

/** Les projets d'une catégorie dans la langue demandée, du plus récent au plus ancien. */
export function projectsByCategoryIn(
  lang: Lang,
  id: Service["id"] | null,
): readonly Project[] {
  const all = copy(lang).projects;
  const list = id ? all.filter((p) => p.discipline === id) : all;
  return [...list].sort((a, b) => b.year - a.year);
}

export function projectBySlugIn(lang: Lang, slug: string): Project | undefined {
  return copy(lang).projects.find((p) => p.slug === slug);
}

/** Projet suivant, en boucle — voir la note dans `projects.ts`. */
export function nextProjectIn(lang: Lang, slug: string): Project | undefined {
  const all = copy(lang).projects;
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return all[(i + 1) % all.length];
}
