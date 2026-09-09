import { boutique as fr, type BoutiqueCopy } from "@/content/boutique";

/**
 * LA BOUTIQUE — version anglaise.
 *
 * L'adresse de la boutique vient du français : c'est une donnée, pas du texte.
 *
 * LES TITRES DES GUIDES NE SONT PAS TRADUITS. Les documents sont écrits en
 * français et vendus en français : un lecteur anglophone qui verrait
 * « Selling Effectively on WhatsApp » commanderait un guide qu'il ne peut pas
 * lire. Une note le dit explicitement — c'est la seule information qui compte
 * vraiment pour lui sur cette page.
 */
export const boutiqueEn: BoutiqueCopy = {
  kicker: "FullMesh Shop — digital products",
  name: "A bit of everything, as long as it works",
  lead: "Seventeen titles with no subject in common, and one condition for entry: that you come out more effective with a phone and a connection.",
  body: [
    "Mobile money, copywriting, WhatsApp, prompts, CVs, epoxy resin. The list looks scattered, and it is — deliberately. A single-subject catalogue hits its ceiling the day its subject runs dry; this one grows wherever the demand shows up.",
    "What holds it together is not a theme, it is a test. A title enters the catalogue if a reader can act on it the next day, from their phone, without buying anything else. Whatever fails that test stays out, however sellable it looks.",
  ],

  regleLabel: "The entry rule",
  regle: [
    {
      titre: "Useful by tomorrow",
      corps: "No general knowledge, no theory to be transposed later. Every title ends in something to do, and whoever read it can do it the next day.",
    },
    {
      titre: "Doable from a phone",
      corps: "No title assumes a computer, paid software or an advertising budget. Anything that requires equipment the reader does not have is of no use to them.",
    },
    {
      titre: "Written for here",
      corps: "Amounts in CFA francs, mobile money as the payment method, WhatsApp as the channel. A guide translated from an American market wastes the time of whoever applies it.",
    },
  ],

  rayonsLabel: "The catalogue",
  rayonsLead: "Sorted by what it solves. Nobody goes looking for “a product at a thousand francs” — they go looking for customers, or for a way to get paid.",
  rayons: [
    { ...fr.rayons[0], titre: "Finding customers, and getting paid",
      promesse: "The step from skill to income, which is where almost everyone stalls." },
    { ...fr.rayons[1], titre: "Starting with what you have",
      promesse: "Getting going with no capital, no premises, and without waiting for funding that will not come." },
    { ...fr.rayons[2], titre: "Putting AI to work",
      promesse: "The tool that stands in for the colleague you cannot hire yet." },
    { ...fr.rayons[3], titre: "Learning a whole trade",
      promesse: "The long titles: a trade taken from the first move to the first sale." },
  ],

  prixLabel: "Prices",
  prixNote:
    "They are not on this page, and that is deliberate. This site once showed a launch price that moved sixty per cent in a week — a figure copied onto a page nobody thinks to reopen goes stale on its own. The shop is the only place where prices are current, and the twelve entry guides are bundled there for less than their sum. Note that every title is written in French.",

  revendeurLabel: "Reselling",
  revendeurTitre: "Thirty-five per cent, with nothing fronted",
  revendeur: [
    {
      titre: "No barrier",
      corps: "Nothing to create, nothing to stock, nothing to front. A reseller gets a link, 35 % commission on every sale, and the kit they need to start posting on day one.",
    },
    {
      titre: "Paid on Saturdays",
      corps: "Weekly settlement by mobile money, with no minimum. A reseller who has to reach a threshold before their first commission quits before reaching it.",
    },
    {
      titre: "The kit provided",
      corps: "Twenty ready-to-post texts and fifty visuals. What kills a reseller network is the delay between signing up and the first sale — the kit removes it.",
    },
  ],

  ctaBoutique: "See the shop and its prices",
  ctaRevendeur: "Become a reseller",
  url: fr.url,
  ficheLabel: "The brand work behind the shop",
};
