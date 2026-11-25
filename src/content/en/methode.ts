import { methode as fr, type MethodeCopy } from "@/content/methode";

/**
 * LE PLAN DE MARCHE, EN ANGLAIS.
 *
 * La zone couverte est francophone : l'anglais sert à celui qui tombe sur le
 * site sans lire le français, pas à vendre ailleurs. Il TRADUIT, il
 * n'enjolive pas — et surtout il ne durcit ni n'adoucit une limite. « Aucune
 * promesse de résultat » reste aussi catégorique en anglais, sinon la version
 * anglaise promet ce que la française refuse.
 *
 * Ce qui est repris du français par `fr.` est de la STRUCTURE, pas du texte :
 * les identifiants, les familles, les états, les montants. Un prix traduit
 * serait un prix qui diverge.
 */
export const methodeEn: MethodeCopy = {
  kicker: "The method",
  name: "The Marching Plan",
  lead: "Tell us what is going wrong, in your own words. We hand back a method, dated steps, and someone who comes back to check.",
  body: [
    "You have the location, the premises, the stock. What is missing is not courage — it is a way of working that holds when the week is bad.",
    "We are not experts in your trade. We frame the problem, we install a method, and we keep the rhythm with you for four weeks. When a specialist is needed, we say so and we look for one.",
  ],

  /* Les chemins viennent du français : une image traduite serait une image
     qui diverge. Seul le texte alternatif change. */
  scenes: {
    hero: { src: fr.scenes.hero.src, alt: "A trader arranges oranges on her stall." },
    constat: { src: fr.scenes.constat.src, alt: "Vendors and their carts in a market street." },
    etapes: { src: fr.scenes.etapes.src, alt: "A man checks his phone, a folder under his arm." },
  },

  constatLabel: "What the figures say",
  constatTitre: "Your money has not vanished. It is outside.",
  constat: [
    { valeur: 42, suffixe: " %", label: "of owners say their biggest obstacle is money" },
    { valeur: 90, suffixe: " %", label: "of small firms nonetheless hold a bank account" },
    { valeur: 28, suffixe: " %", label: "hold a loan" },
  ],
  comparaison: {
    titre: "Working capital financed by supplier and customer credit",
    unite: "% of firms",
    haut: { label: "Benin", valeur: 65.6 },
    bas: { label: "Sub-Saharan Africa", valeur: 24.3 },
    note: "Nearly three times the regional average. The money is not missing from the circuit: it is with your customers, and it is not coming back.",
  },
  constatSource:
    "World Bank, Enterprise Surveys — Benin 2024. 364 firms interviewed between September 2024 and January 2025.",
  constatReserve:
    "That survey covers only registered firms with five employees or more. It describes neither the market stall nor the person starting out alone. We say so because it is true, and because you are entitled to know who these figures are about.",

  phrasesLabel: "Where to start",
  phrasesLead:
    "Look for your own sentence. The one you would say to a friend, not the one from a textbook — that is how this catalogue is arranged.",
  phrases: [
    { ...fr.phrases[0], mots: "I sell every day, but there is never any money in the till." },
    { ...fr.phrases[1], mots: "People owe me money and I do not dare ask for it." },
    { ...fr.phrases[2], mots: "The bank will not lend to me." },
    { ...fr.phrases[3], mots: "My stock is asleep, and my money is in it." },
    { ...fr.phrases[4], mots: "I do not have enough customers." },
    { ...fr.phrases[5], mots: "I do not know whether I am making money or losing it." },
    { ...fr.phrases[6], mots: "I work alone and I can no longer keep up." },
    { ...fr.phrases[7], mots: "I want to innovate but I do not know how." },
    { ...fr.phrases[8], mots: "I want to start but I do not know where to begin." },
    { ...fr.phrases[9], mots: "The power cuts out and I lose money." },
    { ...fr.phrases[10], mots: "Taxes are suffocating me." },
  ].map((p, i) => ({
    ...p,
    famille: [
      "Money that does not come in",
      "Money that does not come in",
      "Money that does not come in",
      "Stock that sleeps",
      "Customers who do not come",
      "Not knowing where you stand",
      "Growing without breaking",
      "Growing without breaking",
      "Starting from nothing",
      "What you put up with",
      "What you put up with",
    ][i],
    expert: p.expert
      ? { juriste: "lawyer", comptable: "accountant", électricien: "electrician", "banquier ou institution de microfinance": "banker or microfinance institution" }[p.expert] || p.expert
      : undefined,
  })),
  etats: {
    neuve: {
      court: "Never applied",
      long: "Written from public data and our own experience. No client has followed it yet, and we say so before you order.",
    },
    essai: { court: "Being tried", long: "At least one client has applied it and reported back." },
    eprouvee: { court: "Proven", long: "Five clients or more have followed it, with their measurements." },
  },
  expertLabel: "Brings in a professional",

  etapesLabel: "How it works",
  etapes: [
    { n: "01", titre: "We listen", corps: "One hour, at your place, free. You talk; we ask questions and we write down your figures — never ours." },
    { n: "02", titre: "We frame the problem", corps: "Your problems ranked, and the one we start with. If none of it is within our reach, we say so and we stop there." },
    { n: "03", titre: "We write the method", corps: "Your document: what changes, the steps week by week, the routines that remain and the time each one takes." },
    { n: "04", titre: "We hold four weeks", corps: "Four follow-up points. We correct what does not hold — and a method that cannot be held gets corrected, not demanded." },
    { n: "05", titre: "You tell us", corps: "What worked, what did not hold. That report corrects the method for the next person. It is the only way it is worth more in six months than today." },
  ],

  prixLabel: "What it costs",
  prixLead:
    "The diagnosis is never charged for. A method from the catalogue has a fixed price. A method to be built is priced after we have listened to you — not before.",
  paliers: [
    { ...fr.paliers[0], name: "The Diagnosis", unite: "one hour of listening", pour: "What is really blocking you, and whether we know how to treat it. No commitment, and no follow-up if the answer is no." },
    { ...fr.paliers[1], name: "The Marching Plan", unite: "the method, four weeks of follow-up included", pour: "A method from the catalogue, put in your name, with its routines and its four follow-up points." },
    { ...fr.paliers[2], name: "The next method", unite: "each method after the first", pour: "When the plan chains several together. Cheaper because the listening is already done and is not charged twice." },
    { ...fr.paliers[3], name: "The method to be built", unite: "priced after the listening", pour: "When your problem is in none of these eleven sentences. The amount is set on the real work and on your means, announced before we start." },
  ],
  surDevis: "On quotation",
  gratuit: "Free",
  currency: fr.currency,

  limitesLabel: "What we do not do",
  limites: [
    "No promise of sales, customers or turnover. We install a method and a rhythm; what they produce depends on your market and your regularity.",
    "No tax, accounting, legal or financial advice. We prepare the consultation, we do not replace it.",
    "No loan, no advance, no guarantee, no investment advice. No money passes through ADN NETWORK.",
    "We do not collect your debts and we call none of your customers.",
    "We keep neither your till, nor your books, nor your filings.",
    "We do not carry out the steps for you. The method is held by you — that is its limit, and it is also why it stays when we leave.",
  ],

  form: {
    ...fr.form,
    titre: "Tell us what is going wrong",
    corps: "In your own words, as you would say it to someone. We call you back for the listening hour, which is free.",
    probleme: {
      label: "What is going wrong",
      placeholder: "For example: I sell every day but I can never restock…",
      hint: "Three lines is enough. Do not look for the right term: your sentence is worth more than ours.",
    },
    nom: { label: "Your name", placeholder: "First and last name" },
    telephone: { label: "Phone", placeholder: "+229 …", hint: "That is how we call you back. WhatsApp preferred." },
    consent:
      "These details are used only to prepare the interview and to answer it. They are neither sold on nor used for prospecting.",
    incomplete: "The name, the phone or the problem is missing.",
    envoi: "Sending…",
    envoyee: { titre: "Noted", corps: "We will call you to set the listening hour. It is free and commits you to nothing." },
    echec: {
      titre: "The send did not go through",
      corps: "The connection dropped. Your text is not lost: send it straight over WhatsApp, it is already written out.",
      action: "Send on WhatsApp",
    },
    whatsapp: "Or on WhatsApp",
    whatsappIntro: "Hello, here is what is going wrong in my business:",
    action: "Ask for the listening hour",
  },
};
