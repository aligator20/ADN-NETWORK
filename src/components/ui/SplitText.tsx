"use client";

import { Fragment, useMemo } from "react";

import { cn } from "@/lib/utils";

type Mode = "chars" | "words";

type Props = {
  children: string;
  /** Granularité du découpage. `chars` pour les titres, `words` pour le corps. */
  mode?: Mode;
  className?: string;
  /** Classe appliquée à chaque fragment animable. */
  itemClassName?: string;
  /** Balise du conteneur — `span` par défaut pour rester inline. */
  as?: "span" | "div";
};

/**
 * Découpe un texte en fragments masqués, prêts à être animés par GSAP.
 *
 * Implémentation maison plutôt que le plugin SplitText : on garde le contrôle du
 * markup, on évite un re-split après hydratation (donc aucun flash), et on ne
 * dépend d'aucun plugin sous licence.
 *
 * Accessibilité : le conteneur porte `aria-label` avec le texte intact, les
 * fragments sont masqués aux lecteurs d'écran.
 *
 * Cibles GSAP : `[data-split]` (à requêter dans le scope du composant parent).
 */
export function SplitText({
  children,
  mode = "chars",
  className,
  itemClassName,
  as: Tag = "span",
}: Props) {
  const words = useMemo(() => children.split(" "), [children]);

  return (
    <Tag className={cn("inline", className)} aria-label={children}>
      {words.map((word, wi) => (
        <Fragment key={`${word}-${wi}`}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {mode === "words" ? (
              <span className="mask">
                <span data-split className={itemClassName}>
                  {word}
                </span>
              </span>
            ) : (
              Array.from(word).map((char, ci) => (
                <span key={ci} className="mask">
                  <span data-split className={itemClassName}>
                    {char}
                  </span>
                </span>
              ))
            )}
          </span>
          {/* espace insécable : conserve l'inter-mot sans casser les masques */}
          {wi < words.length - 1 && <span aria-hidden>{" "}</span>}
        </Fragment>
      ))}
    </Tag>
  );
}
