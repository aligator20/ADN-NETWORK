import { metadataFor, Shell, viewport as sharedViewport } from "@/app/shell";

/**
 * Layout racine ANGLAIS — tout ce qui vit sous `/en`.
 * Voir `app/shell.tsx` pour la raison d'être de ce second layout racine.
 */
export const metadata = metadataFor("en");
export const viewport = sharedViewport;

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell lang="en">{children}</Shell>;
}
