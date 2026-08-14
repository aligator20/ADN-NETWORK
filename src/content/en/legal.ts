import type { LegalCopy } from "@/content/legal";

/**
 * MENTIONS LÉGALES — version anglaise.
 *
 * On garde « Mentions légales » comme intitulé français et « Legal notice » en
 * anglais : c'est le terme qu'un visiteur anglophone cherche. Le fond ne change
 * pas d'un mot — un engagement juridique qui diffère selon la langue lue n'est
 * plus un engagement.
 */
export const legalEn: LegalCopy = {
  title: "Legal notice",
  kicker: "Legal information",
  back: "Back to home",
  toComplete: "To be completed",
  editor: {
    heading: "Site publisher",
    denomination: "Name",
    publisher: "Responsible for publication",
    capacity: "Capacity",
    address: "Address",
    contact: "Contact",
    registration: "Company registration",
  },
  hosting: {
    heading: "Hosting",
    host: "Host",
    address: "Address",
    contact: "Contact",
  },
  paragraphs: [
    {
      title: "Intellectual property",
      body: "All content on this site — text, visual identity, photographs, generated illustrations, source code — is the property of ADN NETWORK unless stated otherwise. The projects presented remain the property of their respective founders; showing them here does not transfer any rights. Any reproduction, even partial, requires prior written permission.",
    },
    {
      title: "Personal data",
      body: "Only one part of this site collects data: the application form for The Network. The information you enter there — name, email, phone if you provide it, city and a description of your project — is transmitted to and stored by Netlify, the site's host, and is used only to consider your application and to reply to you. It is neither shared, nor sold, nor used for marketing. No account is created and no password is ever requested. You may at any time ask to see, correct or delete this data by writing to the contact address above; deletion is carried out without condition and without delay. The site's contact form, by contrast, transmits nothing: it prepares a message in your own mail application, which you send yourself.",
    },
    {
      title: "Language and cookies",
      body: "No advertising cookie and no analytics tracker is placed on your device. The site has no audience measurement, no embedded social media button and no ad network. A single technical marker records the language you choose, so that you are not asked again on every visit: it contains only “fr” or “en”, and nothing that could identify you. Without an explicit choice from you, the language is inferred from the preferences your browser declares and, failing that, from the country you are browsing from — without that information being stored. This is why you are shown no consent banner: there is nothing to consent to.",
    },
    {
      title: "External links",
      body: "Some pages link to third-party sites, in particular the live sites of the projects presented. ADN NETWORK exercises no control over their content and cannot be held responsible for what is published there.",
    },
    {
      title: "The Network",
      body: "Membership of The Network is free and is never invoiced. ADN NETWORK does not take part in the relationships formed between founders, mentors and investors, and receives no commission on them. Showing a project constitutes neither a guarantee of funding nor an endorsement of that project.",
    },
  ],
};
