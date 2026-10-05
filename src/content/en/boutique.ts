import { boutique as fr, type BoutiqueCopy } from "@/content/boutique";

/**
 * LA BOUTIQUE — version anglaise.
 *
 * L'adresse de la boutique et le nom du formulaire Netlify viennent du
 * français : ce sont des données, pas du texte. Deux noms de formulaire pour
 * une même boutique produiraient deux tables de commandes.
 *
 * LES TITRES DES GUIDES NE SONT PAS TRADUITS. Ils sont écrits et vendus en
 * français : un lecteur anglophone qui verrait « Selling Effectively on
 * WhatsApp » commanderait un document qu'il ne peut pas lire. La note de prix
 * le dit — c'est la seule information qui compte vraiment pour lui sur ce
 * rayon-là.
 */
export const boutiqueEn: BoutiqueCopy = {
  kicker: "The shop",
  name: "Everything we sell",
  lead: "Pick, set aside, send. We call you back straight after.",
  faits: [
    "Prices shown, not on request",
    "Your selection commits you to nothing",
    "Mobile money, settled at the quote",
  ],
  compteurs: {
    prestations: "priced services",
    liaisons: "links at 0 F",
    produits: "digital guides",
  },

  famillesLabel: "Aisle",
  familles: {
    tout: "All",
    prestations: "Services",
    vitrine: "Web tiers",
    carte: "À la carte",
  },
  inclusLabel: "Included",
  portfolioLabel: "Already done",
  portfolioVide: "Nothing published — we open the way, we do not deliver.",
  detailCta: "Details",
  ajouter: "Add",
  retirer: "Remove",
  ajoute: "In your selection",
  planchersNote:
    "The amounts are floors: the real workload is settled at the brief. A forty-page manual and a six-hundred-page catalogue are not billed the same.",

  liaisonsLabel: "Included, at no extra cost",
  liaisonsTitre: "What comes with it, whatever you order",
  liaisonsLead: "Nothing to add to your selection: it is in the price.",

  panier: {
    ouvrir: "My selection",
    titre: "Your selection",
    vide: "Nothing yet. Add a line to get started.",
    article: "item",
    articles: "items",
    total: "From",
    totalNote: "The final amount is settled at the brief, after we talk. Nothing is charged here.",
    vider: "Remove all",
    fermer: "Keep browsing",
    envoyer: "Send my request",
    form: {
      name: fr.panier.form.name,
      endpoint: fr.panier.form.endpoint,
      honeypot: "Do not fill in",
      nom: { label: "Your name", placeholder: "First and last name" },
      telephone: {
        label: "Phone",
        placeholder: "+229 …",
        hint: "This is how we call you back. WhatsApp preferred.",
      },
      message: {
        label: "Your project, in two lines",
        placeholder: "What you do, and what you are missing today.",
      },
      consent:
        "This information is used only to answer this request. It is neither sold on nor used for cold outreach.",
      incomplete: "Name or phone number is missing.",
      envoi: "Sending…",
      envoyee: {
        titre: "On its way",
        corps: "Your selection has reached us. We will come back to you by phone for the brief — that is where the amount is settled.",
      },
      echec: {
        titre: "The send did not go through",
        corps: "The connection dropped. Your selection is not lost: send it straight over WhatsApp, it is already written out.",
        action: "Send on WhatsApp",
      },
      whatsapp: "Or on WhatsApp",
      whatsappIntro: "Hello, I would like to order:",
    },
  },

  produitsLabel: "The digital guides",
  produitsTitre: "FullMesh Shop",
  produitsLead:
    "The one aisle that is paid for online and opens within the minute, on a phone. It is hosted by our seller, where prices are always current. Note that every title is written in French.",
  regle: [
    { titre: "Useful by tomorrow", corps: "Every title ends in something to do." },
    { titre: "Doable on a phone", corps: "No computer, no paid software, no ad budget." },
    { titre: "Written for here", corps: "CFA francs, mobile money, WhatsApp." },
  ],
  rayons: [
    { ...fr.rayons[0], titre: "Finding customers, and getting paid",
      promesse: "The step from skill to income, where almost everyone stalls." },
    { ...fr.rayons[1], titre: "Starting with what you have",
      promesse: "Getting going with no capital, no premises, no waiting for funding that will not come." },
    { ...fr.rayons[2], titre: "Putting AI to work",
      promesse: "The tool that stands in for the colleague you cannot hire yet." },
    { ...fr.rayons[3], titre: "Learning a whole trade",
      promesse: "A trade taken from the first move to the first sale." },
  ],
  prixNote:
    "Guide prices are not on this page: they live on the shop, the only place where they are current. The twelve entry guides are bundled there for less than their sum.",
  ctaBoutique: "Buy on FullMesh Shop",
  ctaRevendeur: "Become a reseller",
  url: fr.url,
  ficheLabel: "The brand work behind the shop",

  revendeurLabel: "Reselling",
  revendeurTitre: "35 % on every sale, with nothing fronted",
  revendeur: [
    { titre: "Nothing to front", corps: "A link, 35 % commission, and the kit to start posting on day one." },
    { titre: "Paid on Saturdays", corps: "Mobile money, every week, with no minimum." },
    { titre: "The kit provided", corps: "Twenty ready-to-post texts and fifty visuals." },
  ],
};
