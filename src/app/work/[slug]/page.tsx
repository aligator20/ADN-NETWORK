import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectView } from "@/components/sections/ProjectView";
import {
  disciplineName,
  nextProject,
  projectBySlug,
  projectIndex,
  projects,
} from "@/content/projects";

type Params = { slug: string };

/**
 * Chaque projet est prérendu au build. La liste vient du même tableau que la
 * galerie : ajouter un projet crée sa page, sans rien déclarer de plus.
 */
export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

/** Un slug inconnu ne doit pas produire une page vide mais un vrai 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: `${project.title} — ${disciplineName(project.discipline)}`,
      description: project.summary,
      type: "article",
      images: project.cover ? [{ url: project.cover }] : undefined,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);

  if (!project) notFound();

  return (
    <ProjectView
      project={project}
      index={projectIndex(slug)}
      next={nextProject(slug)}
    />
  );
}
