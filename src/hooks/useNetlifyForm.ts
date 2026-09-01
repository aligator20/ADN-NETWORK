"use client";

import { useRef, useState } from "react";

/**
 * L'ENVOI D'UN FORMULAIRE NETLIFY, ÉCRIT UNE FOIS
 *
 * Le site a deux formulaires — candidature au Réseau, demande de devis. Ils
 * diffèrent par leurs champs et par rien d'autre : même transport, même
 * validation, mêmes quatre états, même repli. Recopier cette mécanique aurait
 * garanti qu'elle diverge, et la leçon la plus coûteuse du site est justement
 * cachée dedans (voir `envoyer`).
 *
 * Les formulaires restent NON CONTRÔLÉS : la vérité est dans le DOM. On lit les
 * valeurs une seule fois à l'envoi, avec `FormData`. C'est moins de code que
 * six états React, et `checkValidity()` donne gratuitement la validation du
 * format email et des champs requis — la même que celle qu'imposerait le
 * navigateur sans JavaScript.
 */
export type EtatEnvoi = "saisie" | "envoi" | "envoyee" | "echec";

export function useNetlifyForm(repli: string) {
  const [etat, setEtat] = useState<EtatEnvoi>("saisie");
  const [prete, setPrete] = useState(false);
  /** Dernières valeurs saisies — servent au repli email en cas d'échec. */
  const dernier = useRef<Record<string, string>>({});

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    // `URLSearchParams` n'accepte pas un `FormData` en entrée côté types : on
    // recopie champ par champ, ce qui permet au passage d'en garder une trace.
    const corps = new URLSearchParams();
    const trace: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      const s = typeof v === "string" ? v : "";
      corps.append(k, s);
      trace[k] = s;
    });
    dernier.current = trace;

    setEtat("envoi");
    try {
      // ON POSTE SUR L'`action` DU FORMULAIRE SERVI, PAS SUR LA CONSTANTE.
      //
      // Netlify réécrit le HTML au déploiement : il enregistre le formulaire,
      // retire `data-netlify`, et son post-traitement raccourcit les URL —
      // `/__forms.html` devient `/__forms`. Une adresse écrite en dur pointerait
      // donc à côté de ce que le navigateur voit, et le jour où Netlify change
      // sa réécriture, la soumission partirait dans le vide sans que rien ne le
      // signale. Le DOM est la seule source fiable après post-traitement ; la
      // constante ne sert plus que de repli.
      const cible = form.getAttribute("action") || repli;
      const res = await fetch(cible, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: corps.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setEtat("envoyee");
    } catch {
      setEtat("echec");
    }
  };

  /** À brancher sur `onInput` du <form> : pilote l'activation du bouton. */
  const surSaisie = (e: React.FormEvent<HTMLFormElement>) =>
    setPrete(e.currentTarget.checkValidity());

  return { etat, prete, dernier, envoyer, surSaisie, envoiEnCours: etat === "envoi" };
}
