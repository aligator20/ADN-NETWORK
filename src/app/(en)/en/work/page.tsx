import type { Metadata } from "next";

import { workMetadata } from "@/app/_shared/pages";
import { WorkIndex } from "@/components/sections/WorkIndex";

export const metadata: Metadata = workMetadata("en");

export default function WorkPage() {
  return <WorkIndex />;
}
