/**
 * LE RÉSEAU — la communauté.
 *
 * Le nom de la marque porte déjà l'idée : ADN NETWORK. La communauté ne
 * s'appelle donc pas « Community » mais LE RÉSEAU — c'est la seconde moitié du
 * logotype qui prend enfin son sens.
 *
 * Principe : trois rôles, une seule table. Un porteur expose, un mentor
 * corrige, un investisseur renchérit. Le site ne gère aucun compte ni aucune
 * transaction — il met en relation, et la suite se passe entre humains.
 */

export const community = {
  name: "Le Réseau",
  /** L'observation qui justifie l'existence de la communauté. */
  lead: "Un porteur de projet n'échoue presque jamais faute d'idée. Il échoue seul.",
  body: [
    "Au Bénin comme ailleurs, l'écart entre une idée et une entreprise ne se comble pas avec du courage : il se comble avec des gens. Un ingénieur qui relit votre architecture. Un juriste qui lit vos statuts. Quelqu'un qui a déjà raté ce que vous êtes en train de tenter.",
    "Le Réseau est ouvert à quiconque a un projet et l'intention de le mener. Aucune sélection sur le diplôme, aucun frais d'entrée. Ce qui est demandé : un projet écrit, et de quoi le juger.",
  ],

  /** Les trois rôles. La couleur reprend le code disciplinaire du site. */
  roles: [
    {
      id: "porteur",
      title: "Porteur",
      color: "var(--color-agritech)",
      body: "Vous avez un projet, une maquette, ou seulement une intuition sérieuse. Vous l'exposez au Réseau et vous recevez ce qui manque : une critique, un contact, une compétence.",
      give: "Un projet écrit",
      get: "Regards, contacts, compétences",
    },
    {
      id: "mentor",
      title: "Mentor",
      color: "var(--color-digital)",
      body: "Ingénieur, agronome, juriste, comptable, designer. Vous donnez quelques heures sur une étape précise — pas un accompagnement au long cours, une réponse qui débloque.",
      give: "Quelques heures",
      get: "Des projets à voir naître",
    },
    {
      id: "investisseur",
      title: "Investisseur",
      color: "var(--color-creative)",
      body: "Vous cherchez des dossiers réels, pas des présentations. Vous accédez aux projets exposés, vous posez vos questions, et vous renchérissez sur ceux qui tiennent debout.",
      give: "Du capital, ou un premier contrat",
      get: "Des dossiers de première main",
    },
  ],

  /** Le parcours, en trois temps. Aucun compte à créer. */
  steps: [
    {
      title: "Soumettre",
      body: "Vous écrivez votre projet — problème, solution, état d'avancement, ce qui vous manque. Une page suffit, et c'est déjà un filtre.",
    },
    {
      title: "Exposer",
      body: "Le projet est présenté au Réseau avec sa discipline et son stade. Les mentors le commentent, les investisseurs le consultent.",
    },
    {
      title: "Rencontrer",
      body: "Les mises en relation se font une à une, jamais en masse. Ce qui se décide ensuite se décide entre vous.",
    },
  ],

  /** Ce que la communauté N'EST PAS. Poser les limites protège des deux côtés. */
  limits: [
    "Aucun frais d'adhésion, à aucun moment.",
    "Aucune transaction financière ne transite par ADN NETWORK.",
    "Aucune garantie de financement : l'exposition n'est pas une promesse.",
    "Les projets restent la propriété de leurs porteurs.",
  ],

  cta: {
    title: "Rejoindre Le Réseau",
    body: "Dites-nous qui vous êtes et ce que vous apportez. La réponse arrive par email.",
    action: "Envoyer ma candidature",
  },

  /**
   * LE FORMULAIRE D'INSCRIPTION
   *
   * `name` est l'identifiant déclaré à Netlify Forms. Il doit être IDENTIQUE
   * en trois endroits, sinon la candidature part dans le vide :
   *   1. ici,
   *   2. l'attribut `name` du <form> et le champ caché `form-name`,
   *   3. `public/__forms.html`, que le robot de Netlify lit au déploiement.
   *
   * `endpoint` est la cible du POST. On ne poste pas sur `/reseau` : Netlify
   * n'enregistre une soumission que si le formulaire a été détecté à l'URL
   * visée, et `__forms.html` est justement le fichier qui porte la définition.
   * Il sert aussi de page d'arrivée si JavaScript est désactivé.
   */
  form: {
    name: "candidature-reseau",
    endpoint: "/__forms.html",

    roleLegend: "Je rejoins en tant que",
    fields: {
      name: { label: "Nom et prénom", placeholder: "" },
      email: { label: "Email", placeholder: "" },
      phone: {
        label: "WhatsApp",
        placeholder: "+229 …",
        hint: "Facultatif — souvent plus rapide que l'email.",
      },
      place: { label: "Ville et pays", placeholder: "Cotonou, Bénin" },
      project: {
        label: "Votre projet, ou ce que vous apportez",
        placeholder: "Le problème, où vous en êtes, ce qui vous manque.",
      },
    },
    consent:
      "J'accepte qu'ADN NETWORK conserve ces informations pour instruire ma candidature.",
    /** Libellé du champ-leurre. Invisible à l'écran, lu par les robots. */
    honeypot: "Ne pas remplir",
    whatsapp: "Nous joindre sur WhatsApp",
    /** Le marqueur `{role}` est remplacé par le rôle choisi. */
    whatsappMessage: "Bonjour, je viens de déposer une candidature au Réseau ({role}).",

    incomplete: "Nom, email et ville sont nécessaires pour vous répondre.",
    sending: "Envoi en cours",
    /** Ce que le candidat lit une fois la candidature enregistrée. */
    sent: {
      title: "Candidature enregistrée.",
      body: "Elle est arrivée. Nous la lisons entièrement — projet compris — et nous répondons par email sous quelques jours. Si vous n'avez rien reçu au bout d'une semaine, relancez-nous : c'est que quelque chose s'est perdu.",
    },
    /** Repli si l'envoi échoue : la candidature ne doit jamais être perdue. */
    failed: {
      title: "L'envoi n'a pas abouti.",
      body: "Le serveur n'a pas répondu. Ne recommencez pas trois fois — écrivez-nous directement, cela revient au même et nous vous répondrons pareil.",
      action: "Envoyer par email",
    },
  },
} as const;

export type CommunityRole = (typeof community.roles)[number];
