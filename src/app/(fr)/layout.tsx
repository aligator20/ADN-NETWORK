import { metadataFor, Shell, viewport as sharedViewport } from "@/app/shell";

/**
 * Layout racine FRANÇAIS — le site à la racine du domaine.
 * Tout le châssis est dans `app/shell.tsx` ; ce fichier ne fait que le nommer.
 */
export const metadata = metadataFor("fr");
export const viewport = sharedViewport;

export default function FrenchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Shell lang="fr">{children}</Shell>;
}
