import type { Metadata } from "next";

import { methodeMetadata } from "@/app/_shared/pages";
import { MethodeView } from "@/components/sections/MethodeView";

export const metadata: Metadata = methodeMetadata("fr");

export default function MethodePage() {
  return <MethodeView />;
}
