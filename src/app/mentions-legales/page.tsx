import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Mentions légales du site ${site.name} — éditeur, hébergeur, propriété intellectuelle et données personnelles.`,
  robots: { index: false, follow: true },
};

/**
 * Page statique, sans animation — délibérément.
 *
 * Quelqu'un qui vient ici cherche une information précise, souvent parce qu'il
 * a un doute. Lui imposer un rideau et des révélations au scroll serait la
 * pire réponse possible. Le châssis du site reste, le reste s'efface.
 *
 * ⚠️ DEUX CHAMPS À COMPLÉTER AVANT MISE EN LIGNE : l'hébergeur (nom, raison
 * sociale, adresse) et le numéro RCCM / IFU de la structure. Ce sont les seuls
 * éléments que je ne peux pas renseigner à votre place.
 */
const SECTIONS = [
  {
    title: "Éditeur du site",
    rows: [
      ["Dénomination", site.name],
      ["Responsable de la publication", site.owner.name],
      ["Qualité", site.owner.role],
      ["Adresse", `${site.base.city} — ${site.base.country}`],
      ["Contact", site.email],
      ["Immatriculation", "RCCM / IFU — à compléter"],
    ],
  },
  {
    title: "Hébergement",
    rows: [
      ["Hébergeur", "À compléter"],
      ["Adresse", "À compléter"],
      ["Contact", "À compléter"],
    ],
  },
];

const PARAGRAPHS = [
  {
    title: "Propriété intellectuelle",
    body: "L'ensemble des contenus de ce site — textes, identité visuelle, photographies, illustrations générées, code source — est la propriété d'ADN NETWORK, sauf mention contraire. Les projets présentés restent la propriété de leurs porteurs respectifs ; leur présentation ici ne vaut pas cession de droits. Toute reproduction, même partielle, est soumise à autorisation écrite préalable.",
  },
  {
    title: "Données personnelles",
    body: "Ce site ne collecte aucune donnée personnelle. Il n'utilise ni base de données, ni compte utilisateur, ni traceur publicitaire. Les formulaires de contact et de candidature au Réseau ne transmettent rien à un serveur : ils préparent un message dans votre propre logiciel de messagerie, que vous envoyez vous-même. Les informations que vous nous adressez par email ne servent qu'à vous répondre, et ne sont ni cédées ni revendues.",
  },
  {
    title: "Cookies",
    body: "Aucun cookie n'est déposé sur votre appareil. Le site ne comporte ni mesure d'audience, ni bouton de réseau social embarqué, ni régie publicitaire. C'est la raison pour laquelle aucune bannière de consentement ne vous est présentée : il n'y a rien à consentir.",
  },
  {
    title: "Liens externes",
    body: "Certaines pages renvoient vers des sites tiers, notamment les sites en ligne de projets présentés. ADN NETWORK n'exerce aucun contrôle sur leur contenu et ne saurait être tenu responsable de ce qui y est publié.",
  },
  {
    title: "Le Réseau",
    body: "L'adhésion au Réseau est gratuite et ne donne lieu à aucune facturation. ADN NETWORK n'intervient pas dans les relations qui se nouent entre porteurs de projet, mentors et investisseurs, et ne perçoit aucune commission sur celles-ci. L'exposition d'un projet ne constitue ni une garantie de financement, ni une caution portée sur ce projet.",
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-[1800px] gutter pb-32 pt-36 md:pb-40 md:pt-44">
      <p className="label">Informations légales</p>

      <h1 className="display mt-8 text-[clamp(2rem,7vw,6rem)] leading-[0.9] text-bone">
        Mentions légales
      </h1>

      <div className="hairline mt-12 md:mt-16" />

      {/* — tableaux d'identification ————————————————————— */}
      {SECTIONS.map((s) => (
        <section key={s.title} className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-10">
            <h2 className="label md:col-span-3">{s.title}</h2>
            <dl className="md:col-span-9">
              {s.rows.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-steel/40 py-4"
                >
                  <dt className="label w-full md:w-64 md:shrink-0">{k}</dt>
                  <dd className="font-mono text-[0.8125rem] text-bone/85">{v}</dd>
                </div>
              ))}
              <div className="border-t border-steel/40" />
            </dl>
          </div>
        </section>
      ))}

      {/* — clauses ————————————————————————————————————— */}
      {PARAGRAPHS.map((p) => (
        <section key={p.title} className="mt-14 md:mt-20">
          <div className="grid grid-cols-1 gap-y-5 md:grid-cols-12 md:gap-x-10">
            <h2 className="label md:col-span-3">{p.title}</h2>
            <p className="max-w-[62ch] font-mono text-[0.8125rem] leading-[1.95] text-fog md:col-span-9">
              {p.body}
            </p>
          </div>
        </section>
      ))}

      <div className="hairline mt-16 md:mt-20" />

      <Link
        href="/"
        data-cursor="hover"
        className="label mt-8 inline-block transition-colors duration-300 hover:text-bone"
      >
        ← Retour à l&apos;accueil
      </Link>
    </div>
  );
}
