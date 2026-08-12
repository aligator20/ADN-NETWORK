import type { Metadata } from "next";

import { CommunityView } from "@/components/sections/CommunityView";
import { community } from "@/content/community";

export const metadata: Metadata = {
  title: community.name,
  description:
    "Le Réseau d'ADN NETWORK : porteurs de projet, mentors et investisseurs " +
    "autour de la même table. Ouvert à tous, sans frais d'adhésion.",
};

export default function ReseauPage() {
  return <CommunityView />;
}
