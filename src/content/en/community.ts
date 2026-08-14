/**
 * VERSION ANGLAISE DU RÉSEAU
 *
 * Le nom reste « Le Réseau » en français dans le corps du texte français, mais
 * en anglais on dit « The Network » : c'est la seconde moitié du logotype qui
 * prend son sens, et elle est anglaise à l'origine. Garder « Le Réseau » dans
 * une phrase anglaise ferait de la communauté un objet étranger au lecteur.
 *
 * `roles[].id` et `roles[].color` ne sont pas traduits : l'identifiant sert de
 * valeur envoyée dans le formulaire — le traduire créerait deux vocabulaires
 * dans la même base de candidatures.
 *
 * `form.name` et `form.endpoint` sont IDENTIQUES au français, et doivent le
 * rester : c'est un seul formulaire Netlify, alimenté par deux langues. Deux
 * noms de formulaire, ce serait deux tableaux de candidatures à surveiller.
 */
import { community as fr } from "@/content/community";

export const communityEn = {
  name: "The Network",
  lead: "A founder almost never fails for lack of an idea. They fail alone.",
  body: [
    "In Benin as anywhere else, the gap between an idea and a company is not closed with courage: it is closed with people. An engineer who reads your architecture. A lawyer who reads your articles. Someone who has already failed at what you are about to attempt.",
    "The Network is open to anyone with a project and the intention to see it through. No selection on qualifications, no entry fee. What is asked: a written project, and enough to judge it by.",
  ],

  roles: [
    {
      ...fr.roles[0],
      title: "Founder",
      body: "You have a project, a prototype, or only a serious hunch. You put it to the Network and you get back what was missing: a critique, a contact, a skill.",
      give: "A written project",
      get: "Eyes, contacts, skills",
    },
    {
      ...fr.roles[1],
      title: "Mentor",
      body: "Engineer, agronomist, lawyer, accountant, designer. You give a few hours on one precise step — not long-term hand-holding, an answer that unblocks.",
      give: "A few hours",
      get: "Projects you watch come to life",
    },
    {
      ...fr.roles[2],
      title: "Investor",
      body: "You are looking for real files, not pitch decks. You get access to the projects on show, you ask your questions, and you back the ones that stand up.",
      give: "Capital, or a first contract",
      get: "First-hand files",
    },
  ],

  steps: [
    {
      title: "Submit",
      body: "You write up your project — problem, solution, where you are, what you are missing. One page is enough, and it is already a filter.",
    },
    {
      title: "Show",
      body: "The project is presented to the Network with its discipline and its stage. Mentors comment on it, investors read it.",
    },
    {
      title: "Meet",
      body: "Introductions are made one at a time, never in bulk. What gets decided next gets decided between you.",
    },
  ],

  limits: [
    "No membership fee, at any point.",
    "No financial transaction passes through ADN NETWORK.",
    "No guarantee of funding: exposure is not a promise.",
    "Projects remain the property of their founders.",
  ],

  cta: {
    title: "Join The Network",
    body: "Tell us who you are and what you bring. The answer comes by email.",
    action: "Send my application",
  },

  form: {
    /* Un seul formulaire Netlify pour les deux langues — ne pas renommer. */
    name: fr.form.name,
    endpoint: fr.form.endpoint,

    roleLegend: "I am joining as",
    fields: {
      name: { label: "Full name", placeholder: "" },
      email: { label: "Email", placeholder: "" },
      phone: {
        label: "WhatsApp",
        placeholder: "+229 …",
        hint: "Optional — often faster than email.",
      },
      place: { label: "City and country", placeholder: "Cotonou, Benin" },
      project: {
        label: "Your project, or what you bring",
        placeholder: "The problem, where you are, what you are missing.",
      },
    },
    consent: "I agree that ADN NETWORK may keep this information to consider my application.",
    honeypot: "Do not fill in",
    whatsapp: "Reach us on WhatsApp",
    whatsappMessage: "Hello, I have just submitted an application to The Network ({role}).",

    incomplete: "Name, email and city are needed for us to reply.",
    sending: "Sending",
    sent: {
      title: "Application recorded.",
      body: "It arrived. We read it in full — project included — and we reply by email within a few days. If you have heard nothing after a week, chase us: something got lost.",
    },
    failed: {
      title: "The send did not go through.",
      body: "The server did not answer. Do not try three times — write to us directly, it comes to the same thing and you will get the same reply.",
      action: "Send by email",
    },
  },
};
