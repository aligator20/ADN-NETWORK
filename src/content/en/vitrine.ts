import { vitrine as fr, type VitrineCopy } from "@/content/vitrine";

/**
 * LA VITRINE — version anglaise.
 *
 * Le nom devient « The Showcase » : « vitrine » ne se comprend pas en anglais,
 * et l'anglicisme « window display » évoque un magasin. Les identifiants de
 * formule ne sont pas traduits — ils partent dans le formulaire, et deux
 * vocabulaires dans une même colonne rendraient les demandes infiltrables.
 *
 * Les prix restent en FCFA et ne sont PAS convertis : une conversion serait
 * fausse la semaine suivante, et un client qui paie depuis la diaspora paie de
 * toute façon en francs CFA.
 */
export const vitrineEn: VitrineCopy = {
  name: "The Showcase",
  kicker: "Quoted individually — from",
  lead: "Your skill is not the problem. What is missing is the page that makes it obvious in thirty seconds.",
  body: [
    "An engineer, an agronomist, a designer, a craftsman: most lose contracts not because they work badly, but because nothing shows it. A social media profile disappears within a day. A phone number proves nothing. A badly made document works against the person who sends it.",
    "We build the missing piece: a page in your name, written, laid out and published, that you pass on with a single link. It says what you can do before you have to say it — and it says it with the same care as the project pages on this site, which you can judge before you buy.",
  ],

  formulesLabel: "Three packages",
  formules: [
    {
      ...fr.formules[0],
      name: "The Page",
      promesse: "An address in your name, which you send instead of explaining yourself.",
      livrables: [
        "Framing interview and full copywriting",
        "One published page, in French and English",
        "A cover visual produced for you",
        "Permanent link, shareable on WhatsApp",
      ],
      pour: "You have a trade and nothing online that shows it.",
      gain: {
        ...fr.formules[0].gain,
        avant: "You explain yourself every time, and they have to take your word for it.",
        apres: "You send a link. They judge you before they even meet you.",
      },
    },
    {
      ...fr.formules[1],
      name: "The Dossier",
      promesse: "The document you leave behind after a meeting.",
      livrables: [
        "Everything in The Page",
        "An eight to twelve page PDF dossier",
        "Your figures laid out and defensible",
        "Downloadable from your page",
      ],
      pour: "You approach companies or funders and leave empty-handed.",
      gain: {
        ...fr.formules[1].gain,
        avant: "The meeting ends, and nothing of you stays on their desk.",
        apres: "They leave with a document they can re-read and pass on.",
      },
    },
    {
      ...fr.formules[2],
      name: "The Identity",
      promesse: "Enough to hold up everywhere, not only on one page.",
      livrables: [
        "Everything in The Dossier",
        "Logotype and usage guidelines",
        "Templates for social media",
        "Source files, yours to keep",
      ],
      pour: "You are building a brand, not only a personal reputation.",
      gain: {
        ...fr.formules[2].gain,
        avant: "A logo here, a colour there, another tone elsewhere. Nothing matches.",
        apres: "The same you everywhere, down to the source files you keep.",
      },
    },
  ],

  delaiLabel: "Turnaround",
  delai: "Ten working days from the approved brief. One round of revisions is included.",

  stepsLabel: "How it works",
  steps: [
    {
      title: "The brief",
      body: "You describe your trade, your work and what you are after. A thirty-minute conversation is enough — we do the writing, not you.",
    },
    {
      title: "Production",
      body: "We write, lay out and produce the visual. You read it once and correct what needs correcting.",
    },
    {
      title: "Going live",
      body: "The page is published at its permanent address. You share it the same day.",
    },
  ],

  limitsLabel: "What we do not sell",
  limits: [
    "No audience. We do not sell visitors and we promise no traffic figures.",
    "No contract, no investment. A showcase decides nobody for you — it puts you in a position to convince.",
    "No rented slot. You are not paying for a place on a page, you are paying for production work.",
    "No subscription. You pay once; the page stays online as long as this site does.",
  ],

  currency: "FCFA",
  from: "from",
  gainBefore: "Today",
  gainAfter: "After",

  form: {
    ...fr.form,
    formuleLegend: "Package you have in mind",
    metier: { label: "Your trade", placeholder: "Network engineer, agronomist, cabinetmaker…" },
    projet: {
      label: "What you do, and what you are after",
      placeholder: "Your work, your current clients, the kind of contract you want.",
    },
    undecided: "Not sure yet",
  },

  cta: {
    title: "Request a quote",
    body: "Tell us your trade and what you are after. We reply with a firm quote, or we tell you it is not for you.",
    action: "Send my request",
  },
};
