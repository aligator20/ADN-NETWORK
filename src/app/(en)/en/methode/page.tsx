import type { Metadata } from "next";

import { methodeMetadata } from "@/app/_shared/pages";
import { MethodeView } from "@/components/sections/MethodeView";

export const metadata: Metadata = methodeMetadata("en");

export default function MethodePageEn() {
  return <MethodeView />;
}
