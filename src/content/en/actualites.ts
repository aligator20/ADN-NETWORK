import type { ActualitesCopy } from "@/content/actualites";

/**
 * Version anglaise de la PAGE des actualités — pas des publications.
 *
 * Les publications elles-mêmes ne sont pas traduites, et c'est délibéré : ce
 * sont des textes réellement publiés, en français, sous une date. Les traduire
 * reviendrait à citer quelqu'un en lui faisant dire autre chose. Un lecteur
 * anglophone voit donc la page en anglais et les publications dans leur
 * langue d'origine — ce qui est exactement ce qu'il trouvera en cliquant.
 */
export const actualitesEn: ActualitesCopy = {
  kicker: "News",
  title: "What we publish",
  lead: "Announcements from ADN NETWORK, gathered here. The wording is the one published on the network, untouched — in French.",
  embedNotice:
    "The original post is hosted by the network. Displaying it loads their scripts and cookies: nothing is loaded until you click.",
  embedAction: "Show the post",
  seeOn: "View on",
  empty: "No posts yet.",
  moreLabel: "See the service",
};
