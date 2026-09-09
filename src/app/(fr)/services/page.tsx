import type { Metadata } from "next";

import { vedettesMetadata } from "@/app/_shared/pages";
import { VedettesView } from "@/components/sections/VedettesView";

export const metadata: Metadata = vedettesMetadata("fr");

export default function ServicesPage() {
  return <VedettesView />;
}
