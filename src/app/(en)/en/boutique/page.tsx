import type { Metadata } from "next";

import { boutiqueMetadata } from "@/app/_shared/pages";
import { BoutiqueView } from "@/components/sections/BoutiqueView";

export const metadata: Metadata = boutiqueMetadata("en");

export default function BoutiquePage() {
  return <BoutiqueView />;
}
