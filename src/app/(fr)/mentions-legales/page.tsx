import type { Metadata } from "next";

import { legalMetadata } from "@/app/_shared/pages";
import { LegalView } from "@/components/sections/LegalView";

export const metadata: Metadata = legalMetadata("fr");

export default function MentionsLegalesPage() {
  return <LegalView />;
}
