import type { Metadata } from "next";

import { actualitesMetadata } from "@/app/_shared/pages";
import { ActualitesView } from "@/components/sections/ActualitesView";

export const metadata: Metadata = actualitesMetadata("en");

export default function ActualitesPage() {
  return <ActualitesView />;
}
