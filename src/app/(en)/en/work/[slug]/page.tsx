import type { Metadata } from "next";

import {
  ProjectBody,
  projectMetadata,
  projectParams,
  type ProjectParams,
} from "@/app/_shared/pages";

/** Chaque projet est prerendu au build, dans les deux langues. */
export function generateStaticParams(): ProjectParams[] {
  return projectParams();
}

/** Un slug inconnu ne doit pas produire une page vide mais un vrai 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  return projectMetadata("en", slug);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<ProjectParams>;
}) {
  const { slug } = await params;
  return <ProjectBody lang="en" slug={slug} />;
}
