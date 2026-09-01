import type { Metadata } from "next";

import { vitrineMetadata } from "@/app/_shared/pages";
import { VitrineView } from "@/components/sections/VitrineView";

export const metadata: Metadata = vitrineMetadata("fr");

export default function VitrinePage() {
  return <VitrineView />;
}
