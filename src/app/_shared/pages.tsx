import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { About } from "@/components/sections/About";
import { Community } from "@/components/sections/Community";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { ProjectView } from "@/components/sections/ProjectView";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { copy, disciplineNameIn, nextProjectIn, projectBySlugIn } from "@/content/copy";
import { projects } from "@/content/projects";
import type { Lang } from "@/lib/lang";
import { alternatesFor } from "@/lib/seo";

/**
 * LE CORPS DES PAGES, ÉCRIT UNE FOIS
 *
 * Les deux arbres de routes — `(fr)` et `(en)/en` — n'ont pas le droit de
 * contenir de logique : ce sont deux jeux de cinq fichiers, et toute règle
 * recopiée dix fois finit appliquée neuf fois. Chaque page de route se réduit
 * donc à choisir sa langue et à appeler ce qui suit.
 *
 * Le dossier est préfixé d'un `_` : Next l'exclut du routage.
 */

/* ── Accueil ─────────────────────────────────────────────────────────────── */

/**
 * Les six séquences. Reste un Server Component : seules les sections animées
 * sont des îlots clients, donc le HTML utile est rendu au build et le JS de
 * motion n'hydrate que ce qui bouge.
 */
export function HomeBody() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Work />
      <About />
      <Community />
      <Contact />
    </>
  );
}

/* ── Réalisations ────────────────────────────────────────────────────────── */

const WORK_DESCRIPTION: Record<Lang, string> = {
  fr:
    `Les ${projects.length} projets d'ADN NETWORK — digital, IA, automatisation, ` +
    "réseaux, cybersécurité, création, agritech, agriculture et agroalimentaire.",
  en:
    `The ${projects.length} projects of ADN NETWORK — digital, AI, automation, ` +
    "networks, cybersecurity, creative, agritech, farming and food processing.",
};

export function workMetadata(lang: Lang): Metadata {
  return {
    title: copy(lang).ui.selectedProjects,
    description: WORK_DESCRIPTION[lang],
    alternates: alternatesFor(lang, "/work"),
  };
}

/* ── Le Réseau ───────────────────────────────────────────────────────────── */

const RESEAU_DESCRIPTION: Record<Lang, string> = {
  fr:
    "Le Réseau d'ADN NETWORK : porteurs de projet, mentors et investisseurs " +
    "autour de la même table. Ouvert à tous, sans frais d'adhésion.",
  en:
    "The ADN NETWORK community: founders, mentors and investors around the same " +
    "table. Open to everyone, with no membership fee.",
};

export function reseauMetadata(lang: Lang): Metadata {
  return {
    title: copy(lang).community.name,
    description: RESEAU_DESCRIPTION[lang],
    alternates: alternatesFor(lang, "/reseau"),
  };
}

/* ── Mentions légales ────────────────────────────────────────────────────── */

export function legalMetadata(lang: Lang): Metadata {
  const { legal, site } = copy(lang);
  return {
    title: legal.title,
    description:
      lang === "fr"
        ? `Mentions légales du site ${site.name} — éditeur, hébergeur, propriété intellectuelle et données personnelles.`
        : `Legal notice for ${site.name} — publisher, host, intellectual property and personal data.`,
    alternates: alternatesFor(lang, "/mentions-legales"),
    robots: { index: false, follow: true },
  };
}

/* ── Fiche projet ────────────────────────────────────────────────────────── */

export type ProjectParams = { slug: string };

/**
 * Les slugs sont communs aux deux langues : la traduction est un étalement du
 * tableau français, donc la liste ne peut pas diverger.
 */
export function projectParams(): ProjectParams[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export function projectMetadata(lang: Lang, slug: string): Metadata {
  const project = projectBySlugIn(lang, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: alternatesFor(lang, `/work/${slug}`),
    openGraph: {
      title: `${project.title} — ${disciplineNameIn(lang, project.discipline)}`,
      description: project.summary,
      type: "article",
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  };
}

export function ProjectBody({ lang, slug }: { lang: Lang; slug: string }) {
  const project = projectBySlugIn(lang, slug);
  if (!project) notFound();

  // L'index affiché est la position dans la sélection, identique dans les deux
  // langues — on le prend donc sur la liste de la langue courante, qui a le
  // même ordre que le français par construction.
  const index = copy(lang).projects.findIndex((p) => p.slug === slug) + 1;

  return <ProjectView project={project} index={index} next={nextProjectIn(lang, slug)} />;
}
