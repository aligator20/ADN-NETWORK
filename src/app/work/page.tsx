import type { Metadata } from "next";

import { WorkIndex } from "@/components/sections/WorkIndex";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    `Les ${projects.length} projets d'ADN NETWORK — digital, IA, automatisation, ` +
    "réseaux, cybersécurité, création et agritech.",
};

export default function WorkPage() {
  return <WorkIndex />;
}
