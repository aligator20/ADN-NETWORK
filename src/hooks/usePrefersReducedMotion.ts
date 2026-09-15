"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Valeur de départ : la vraie, dès le premier rendu client.
 *
 * Le serveur ne peut pas connaître la préférence : il rend donc `false`. Mais
 * côté client, la requête média est disponible AVANT le premier rendu, et
 * attendre le montage pour la lire coûtait cher.
 *
 * CE QUI SE PASSAIT AVANT
 *
 * Le premier rendu renvoyait `false` à tout le monde. `useGSAP` s'exécutait
 * une fois avec cette valeur et créait les `gsap.from(...)` d'entrée — dont le
 * rendu immédiat POSE l'état de départ : sur la section Disciplines, les dix
 * noms se retrouvaient translatés de 110 % sous un masque qui les coupe. La
 * préférence passait ensuite à `true`, `useGSAP` réexécutait son effet… mais
 * le retour en arrière ne restituait pas la transformation, et la branche
 * « mouvement réduit » ne crée aucune animation pour la défaire.
 *
 * Résultat : les dix disciplines de la page d'accueil étaient invisibles, de
 * façon permanente, pour quiconque a activé « réduire les animations ». Mesuré
 * au navigateur, pas supposé : décalage de 65 px sous un masque de 61 px, après
 * avoir parcouru la page entière et être remonté.
 *
 * Aucun risque d'écart d'hydratation : cette valeur ne sert qu'à l'intérieur
 * des effets de motion, jamais à choisir ce qui est écrit dans le HTML.
 */
function preferenceInitiale() {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

/**
 * Renvoie `true` si l'utilisateur demande un mouvement réduit.
 * Lue dès le premier rendu client, puis tenue à jour si le réglage change.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(preferenceInitiale);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
