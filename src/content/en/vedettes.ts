import { vedettes as fr, type VedettesCopy } from "@/content/vedettes";

/**
 * LES DIX VEDETTES — version anglaise.
 *
 * Les identifiants de discipline, les prix et les slugs de preuve viennent du
 * français : ce sont des données de structure et des liens, pas du texte.
 *
 * Les réserves sont traduites AVEC leur franchise. « Nous formons et nous
 * orientons ; nous ne déployons pas votre infrastructure » ne devient pas un
 * « consulting » vague : c'est précisément la phrase qui empêche un client de
 * commander ce qu'on ne peut pas livrer, et l'adoucir rétablirait le risque
 * que le français avait supprimé.
 */
export const vedettesEn: VedettesCopy = {
  kicker: "Ten services — from",
  name: "What we build",
  lead: "One named, priced service per discipline, instead of a list of skills nobody knows how to order.",
  body: [
    "Each one is here because it has already been produced at least once, and the link to that work sits beside it. Two carry no link: they are training pathways, in the two disciplines where we open the door without claiming to deliver.",
    "The figures are floors. The real workload is settled at the brief — a forty-page manual and a six-hundred-page catalogue do not cost the same, and announcing a single price would only mean renegotiating it in front of the client.",
  ],
  listLabel: "The ten",
  preuveLabel: "Already done",
  demoLabel: "Try it",
  sansPreuveLabel: "Pathway",
  from: "from",
  currency: "FCFA",
  cta: "See the ten services",

  items: [
    {
      ...fr.items[0],
      name: "The Full Site",
      promesse: "A site in your name, bilingual, that outlives you technically.",
      contenu:
        "Structure, copywriting, layout, publication and domain name. Static pages: nothing to maintain, nothing that falls over, and a hosting bill close to zero.",
      preuve: { ...fr.items[0].preuve!, texte: "The FullMesh Shop store" },
      demo: [{ ...fr.items[0].demo![0], texte: "Open the sample site" }],
    },
    {
      ...fr.items[1],
      name: "The AI Practice",
      promesse: "Your own AI service offering, built end to end.",
      contenu:
        "Service catalogue, prompt library, production line for visuals and copy, pricing grid, and the kit you sell with. We built ours first.",
      preuve: { ...fr.items[1].preuve!, texte: "FullMesh Shop, our own offering" },
      demo: [
        { ...fr.items[1].demo![0], texte: "The four AI workstreams" },
        { ...fr.items[1].demo![1], texte: "The launch dossier" },
      ],
    },
    {
      ...fr.items[2],
      name: "The Control Desk",
      promesse: "The instruments that keep the business running without you.",
      contenu:
        "Management and inventory workbooks, written procedures, tracking sheets. A business starts with its measuring instruments, not once the problems have arrived.",
      preuve: { ...fr.items[2].preuve!, texte: "The Résine Master instruments" },
      demo: [{ ...fr.items[2].demo![0], texte: "Open the demonstration" }],
    },
    {
      ...fr.items[3],
      name: "The Network Pathway",
      promesse: "A way into a trade that is hiring, without an expensive school.",
      contenu:
        "Orientation, fundamentals — addressing, VLANs, routing, wireless —, certification preparation and introductions. We train and we point the way; we do not deploy your infrastructure.",
      demo: [{ ...fr.items[3].demo![0], texte: "The syllabus and the VLSM bench" }],
    },
    {
      ...fr.items[4],
      name: "The Cyber Pathway",
      promesse: "A way into a field that recruits faster than it trains.",
      contenu:
        "Defensive fundamentals — port authentication, segmentation, hardening —, certification preparation, guidance along the way. No penetration testing sold: we support the people who want to get in.",
      demo: [{ ...fr.items[4].demo![0], texte: "Module 04 of the pathway" }],
    },
    {
      ...fr.items[5],
      name: "The Brand Book",
      promesse: "A system that holds everywhere, not a logo dropped onto a file.",
      contenu:
        "Emblem, reduced mark, type families, palette with roles, secondary motif and usage rules. A set of guidelines that forbids is worth more than one that suggests.",
      preuve: { ...fr.items[5].preuve!, texte: "The GEMINI brand book" },
    },
    {
      ...fr.items[6],
      name: "The Irrigation Study",
      promesse: "Know what water control costs and returns, before you buy it.",
      contenu:
        "Sizing, sensor selection, installation costing and return on investment. It is a study: the installation itself is beyond us today, and we say so before you find out.",
      preuve: { ...fr.items[6].preuve!, texte: "The AquaControl AI dossier" },
    },
    {
      ...fr.items[7],
      name: "The Land Plan",
      promesse: "A farm that grows on its own revenue, not on successive raises.",
      contenu:
        "Plot layout, cropping calendar, staged mechanisation, integrated livestock and a ten-year forecast.",
      preuve: { ...fr.items[7].preuve!, texte: "The FDR-Adone farm" },
    },
    {
      ...fr.items[8],
      name: "The Processing Unit",
      promesse: "Process on site what used to leave raw.",
      contenu:
        "Siting study, product range and brand, packaging, distribution channel and financial projections.",
      preuve: { ...fr.items[8].preuve!, texte: "ADN TASTE" },
    },
    {
      ...fr.items[9],
      name: "The Patient Journey",
      promesse: "Keep information moving where the care pathway lets it stall.",
      contenu:
        "Journey mapping, identification of breakpoints, continuity procedures and administrative mediation. Never medical content, never an act of care.",
      preuve: { ...fr.items[9].preuve!, texte: "The Continuity Operator" },
    },
  ],
};
