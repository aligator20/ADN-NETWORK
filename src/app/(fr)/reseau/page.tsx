import type { Metadata } from "next";

import { reseauMetadata } from "@/app/_shared/pages";
import { CommunityView } from "@/components/sections/CommunityView";

export const metadata: Metadata = reseauMetadata("fr");

export default function ReseauPage() {
  return <CommunityView />;
}
