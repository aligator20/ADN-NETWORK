/**
 * VERSION ANGLAISE DU CONTENU DE MARQUE
 *
 * Ce fichier ne redéclare que ce qui se TRADUIT. Tout ce qui est structurel —
 * l'email, le numéro WhatsApp, les coordonnées, l'URL, les identifiants de
 * séquence, les ancres de navigation — est repris du français par étalement.
 * Une constante dupliquée est une constante qui finira par diverger.
 *
 * Registre : le même qu'en français. Phrases courtes, affirmatives, aucun
 * superlatif. La traduction littérale du français donne un anglais mou ; on
 * traduit l'intention, pas la syntaxe.
 */
import {
  about as aboutFr,
  contact as contactFr,
  nav as navFr,
  site as siteFr,
  type NavItem,
} from "@/content/site";
import { pathForLang } from "@/lib/lang";

export const siteEn = {
  ...siteFr,
  /** La baseline d'origine du brief, que le français traduisait. */
  tagline: ["Technology", "Creativity", "Systems"],
  owner: { ...siteFr.owner, role: "Founder & Technical Director" },
  /** Idem : la formule anglaise est l'originale, pas une traduction. */
  cta: "LET'S BUILD SOMETHING IMPOSSIBLE.",
};

export const sequencesEn = [
  { id: "hero", index: 1, label: "Index" },
  { id: "intro", index: 2, label: "Manifesto" },
  { id: "services", index: 3, label: "Disciplines" },
  { id: "work", index: 4, label: "Work" },
  { id: "about", index: 5, label: "Structure" },
  { id: "community", index: 6, label: "The Network" },
  { id: "contact", index: 7, label: "Contact" },
] as const;

/**
 * Les destinations sont recalculées, jamais recopiées : `pathForLang` préfixe
 * les pages à part entière et laisse les ancres tranquilles. Ajouter une entrée
 * au menu français la propage ici sans rien écrire.
 */
const LABELS_EN = [
  "Index",
  "Manifesto",
  "Disciplines",
  "Work",
  "Structure",
  "The Network",
  "Contact",
];

export const navEn: readonly NavItem[] = navFr.map((item, i) => ({
  ...item,
  label: LABELS_EN[i] ?? item.label,
  href: pathForLang(item.href, "en"),
}));

export const introManifestEn = [
  { text: "ADN NETWORK builds systems where" },
  { text: "technology, creativity and business", accent: true },
  { text: "stop being three separate trades." },
  { text: "One structure. One standard. From the first line of code" },
  { text: "to the last moving image.", accent: true },
];

export const disciplinesEn = [
  "Digital",
  "AI",
  "Automation",
  "Network",
  "Cybersecurity",
  "Creative",
  "Agritech",
  "Farming",
  "Food",
];

export const aboutEn = {
  ...aboutFr,
  lead: "ADN NETWORK is not one more studio. It is a structure where engineering, design and business work in the same room.",
  body: [
    "Most projects fail at the seams: the developer waits on the designer, the designer waits on strategy, and nobody answers for the whole. We built the opposite — one team that holds the entire chain, from the server to the logotype.",
    "What that changes: a single point of contact, a single standard, and technical decisions taken with knowledge of the ground — because we also operate what we build.",
  ],
  principles: [
    {
      title: "One thread",
      text: "From the architecture to the last pixel, a single team answers for the complete chain.",
    },
    {
      title: "Nothing generic",
      text: "No template, no solution copied across. Every system is drawn for its own use.",
    },
    {
      title: "What holds",
      text: "We deliver what we will still know how to maintain in five years, not what impresses on demo day.",
    },
  ],
};

export const contactEn = {
  ...contactFr,
  lead: "A project, an idea, or a problem nobody has managed to solve yet.",
  action: "Write to the team",
};

export const uiEn = {
  since: "Since",
  loading: "Initialising sequence",
  index: "Index",
  scroll: "Scroll",
  sequence: "Index — Sequence",
  pending: "Sequence — upcoming",
  all: "All",
  view: "View",
  fieldsOfPractice: "Fields of practice",
  selectedProjects: "Selected projects",
  endOfSelection: "End of selection",
  moreOnRequest: "The rest on request",
  menuOpen: "Index",
  menuClose: "Close",
  navigation: "Navigation",
  contactLabel: "Contact",
  followLabel: "Follow",
  allRights: "All rights reserved",
  /* — Fiche projet ————————————————————————————————————— */
  theProject: "The project",
  theFile: "The file",
  liveSite: "Live site",
  visitSite: "Visit the site",
  backToWork: "All work",
  nextProject: "Next project",
  supportTitle: "To find out more",
  supportBody:
    "Every project has its complete file: specifications, figures, timeline, terms. Support sends it to you and answers your questions.",
  supportAction: "Contact support",
};
