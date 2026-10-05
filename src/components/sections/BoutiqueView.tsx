"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { FamilleId } from "@/content/boutique";
import { disciplineColor } from "@/content/services";
import { useCopy, useHref, useLang, useProjectsProving } from "@/hooks/useCopy";
import { useNetlifyForm } from "@/hooks/useNetlifyForm";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { formatPrix } from "@/lib/prix";
import { cn } from "@/lib/utils";

/**
 * PAGE /boutique — LA BOUTIQUE
 *
 * On choisit des lignes, on les met de côté, on envoie la demande. Le
 * raisonnement complet est dans `content/boutique.ts` ; trois points s'imposent
 * au code et méritent d'être relus avant d'y toucher.
 *
 * 1. AUCUN PRIX, AUCUN DÉCOMPTE N'EST ÉCRIT ICI. Les montants sont lus dans
 *    `vedettes` et `vitrine`, qui restent leur seule autorité, et les
 *    compteurs sont calculés sur les tableaux. Changer un tarif à sa source
 *    met la boutique à jour sans que personne y pense.
 *
 * 2. LE FORMULAIRE EST TOUJOURS DANS LE DOM, même sélection fermée. Netlify
 *    enregistre les formulaires en lisant le HTML produit au build : un
 *    formulaire monté seulement à l'ouverture du panneau n'existerait pas à ce
 *    moment-là, et les commandes partiraient dans le vide sans erreur visible.
 *    C'est le genre de panne qu'on ne découvre qu'en perdant une vente.
 *
 * 3. CHARIOW N'APPARAÎT QUE DANS LE RAYON DES GUIDES. Une prestation n'a rien
 *    à faire sur une boutique de fichiers ; un acheteur envoyé là-bas n'y
 *    trouve pas ce qu'il cherchait et ne revient pas.
 */

/** Le jaune électrique de FullMesh, borné au rayon des guides. */
const JAUNE = "#f5c518";

/** La clé de la sélection dans le navigateur du visiteur. */
const CLE = "adn-boutique-selection";

type Article = {
  cle: string;
  famille: Exclude<FamilleId, "tout">;
  nom: string;
  /** Montant en FCFA, pour le total. */
  prix: number;
  /** Vrai quand le montant est un plancher et non un tarif. */
  plancher: boolean;
  /** Ce que le prix couvre exactement, quand ce n'est pas un forfait. */
  unite?: string;
  promesse: string;
  /** Les livrables, quand la source en donne une liste. */
  inclus?: readonly string[];
  /** Sinon, la phrase de contenu. */
  contenu?: string;
  teinte: string;
  detail: string;
  preuves: readonly { slug: string; titre: string; livre: boolean; href: string }[];
};

/**
 * LA SÉLECTION, GARDÉE DANS LE NAVIGATEUR DU VISITEUR.
 *
 * Elle n'existe que chez lui : rien n'est envoyé tant qu'il n'a pas rempli le
 * formulaire, et le site n'a de toute façon aucun serveur pour la recevoir.
 * La lecture se fait APRÈS le premier rendu — lire `localStorage` pendant le
 * rendu ferait diverger le HTML prérendu de ce que React reconstruit, et la
 * page se remonterait entièrement à l'hydratation.
 *
 * Chaque accès est protégé : en navigation privée, ou avec les données de site
 * bloquées, `localStorage` lève au lieu de renvoyer vide. La boutique doit
 * fonctionner quand même — on perd la persistance, pas la page.
 */
function useSelection() {
  const [cles, setCles] = useState<readonly string[]>([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(CLE);
      if (brut) {
        const lu: unknown = JSON.parse(brut);
        if (Array.isArray(lu)) setCles(lu.filter((x): x is string => typeof x === "string"));
      }
    } catch {
      /* pas de persistance disponible : la sélection vit le temps de la visite */
    }
    setCharge(true);
  }, []);

  useEffect(() => {
    if (!charge) return;
    try {
      window.localStorage.setItem(CLE, JSON.stringify(cles));
    } catch {
      /* idem */
    }
  }, [cles, charge]);

  return {
    cles,
    contient: (c: string) => cles.includes(c),
    basculer: (c: string) => setCles((v) => (v.includes(c) ? v.filter((x) => x !== c) : [...v, c])),
    vider: () => setCles([]),
  };
}

export function BoutiqueView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { boutique, vedettes, vitrine } = useCopy();
  const href = useHref();
  const lang = useLang();
  const prouvantes = useProjectsProving();
  const selection = useSelection();

  const [famille, setFamille] = useState<FamilleId>("tout");
  const [ouvert, setOuvert] = useState(false);

  const P = boutique.panier;
  const F = P.form;
  const { etat, prete, dernier, envoyer, surSaisie, envoiEnCours } = useNetlifyForm(F.endpoint);

  const prix = (n: number) => formatPrix(n, lang, vedettes.currency);

  /* ── Le rayonnage, dérivé des sources de prix ─────────────────────────── */

  const articles: readonly Article[] = useMemo(() => {
    const prestations: Article[] = vedettes.items.map((v) => ({
      cle: `v:${v.id}`,
      famille: "prestations",
      nom: v.name,
      prix: v.prix,
      plancher: true,
      promesse: v.promesse,
      contenu: v.contenu,
      teinte: disciplineColor[v.id],
      detail: href("/services"),
      preuves: prouvantes(v.id).map((p) => ({
        slug: p.slug,
        titre: p.title,
        livre: p.status === "livre",
        href: href(`/work/${p.slug}`),
      })),
    }));

    const formules: Article[] = vitrine.formules.map((f) => ({
      cle: `f:${f.id}`,
      famille: "vitrine",
      nom: f.name,
      prix: f.prix,
      plancher: false,
      promesse: f.promesse,
      inclus: f.livrables,
      teinte: "var(--color-signal)",
      detail: href("/vitrine"),
      preuves: [],
    }));

    /* `plancher` et `unite` s'excluent : un plancher ne peut pas annoncer ce
       qu'il couvre exactement, puisque c'est justement ce qui varie. */
    const carte: Article[] = vitrine.services.map((s) => ({
      cle: `s:${s.id}`,
      famille: "carte",
      nom: s.name,
      prix: s.prix,
      plancher: Boolean(s.plancher),
      unite: !s.plancher && s.unite ? s.unite : undefined,
      promesse: s.promesse,
      contenu: s.contenu,
      teinte: "var(--color-signal)",
      detail: href("/vitrine"),
      preuves: [],
    }));

    return [...prestations, ...formules, ...carte];
  }, [vedettes, vitrine, href, prouvantes]);

  const visibles = articles.filter((a) => famille === "tout" || a.famille === famille);
  const choisis = articles.filter((a) => selection.contient(a.cle));
  const total = choisis.reduce((n, a) => n + a.prix, 0);

  /* Les compteurs sont CALCULÉS : écrits à la main, ils mentiraient au premier
     ajout — c'est déjà arrivé au nombre de disciplines. */
  const nProduits = boutique.rayons.reduce((n, r) => n + r.titres.length, 0);
  const compteurs = [
    { n: articles.length, label: boutique.compteurs.prestations },
    { n: vedettes.liaisons.length, label: boutique.compteurs.liaisons },
    { n: nProduits, label: boutique.compteurs.produits },
  ];

  /** La sélection en texte — pour le champ caché, et pour WhatsApp. */
  const recap = useMemo(() => {
    if (!choisis.length) return "";
    const lignes = choisis.map(
      (a) => `• ${a.nom} — ${a.plancher ? `${vedettes.from} ` : ""}${prix(a.prix)}`,
    );
    return [...lignes, "", `${P.total} ${prix(total)}`].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choisis, total, lang]);

  const messageWhatsapp = [F.whatsappIntro, "", recap].join("\n");

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      tl.from(".bq-reveal", { yPercent: 115, duration: DUR.slow, stagger: STAGGER.lines }).from(
        ".bq-fade",
        { autoAlpha: 0, y: 24, duration: DUR.base, stagger: 0.08 },
        "-=1.1",
      );

      // Les CARTES ne sont pas animées à l'apparition : elles se filtrent, et
      // une carte laissée invisible par un `from` non rejoué disparaîtrait au
      // changement de rayon. C'est le bug classique d'une grille filtrable.
      gsap.from(".bq-band", {
        autoAlpha: 0,
        y: 26,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".bq-bands", start: "top 84%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  /* Fermer au clavier : un panneau qui se superpose doit se quitter sans souris. */
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  const lienChariow = (texte: string, plein: boolean) => (
    <a
      href={boutique.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="hover"
      className={cn(
        "inline-flex items-center gap-3 px-6 py-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-opacity duration-300",
        plein ? "font-bold hover:opacity-85" : "border border-steel text-bone hover:border-fog",
      )}
      style={plein ? { background: JAUNE, color: "#0a0a0b" } : undefined}
    >
      {texte}
      <span aria-hidden>↗</span>
    </a>
  );

  return (
    <div ref={root} className={cn(choisis.length > 0 && "pb-28")}>
      {/* ── l'en-tête ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <div className="bq-fade flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="label text-signal">{boutique.kicker}</p>
          <Link
            href={href("/work/full-mesh")}
            data-cursor="hover"
            className="label transition-colors duration-300 hover:text-bone"
          >
            {boutique.ficheLabel} ↗
          </Link>
        </div>

        <h1 className="mt-10 md:mt-12">
          <span className="mask block">
            <span className="bq-reveal display block text-[clamp(2.1rem,7.4vw,6.5rem)] leading-[0.9] text-bone">
              {boutique.name}
            </span>
          </span>
        </h1>

        <p className="mt-8 max-w-[28ch] display text-[clamp(1.35rem,3vw,2.5rem)] leading-[1.14] text-bone">
          {boutique.lead}
        </p>

        <ul className="bq-fade mt-10 flex flex-wrap gap-3">
          {boutique.faits.map((f) => (
            <li
              key={f}
              className="border border-steel px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-fog"
            >
              {f}
            </li>
          ))}
        </ul>

        <div className="bq-fade mt-12 grid grid-cols-3 gap-x-6 border-t border-steel/40 pt-8">
          {compteurs.map((c) => (
            <div key={c.label}>
              <p className="display text-[clamp(1.5rem,4vw,2.75rem)] leading-none text-signal tabular-nums">
                {c.n}
              </p>
              <p className="label mt-2">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── le filtre ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter pt-14">
        <div className="bq-fade flex flex-wrap items-center gap-3 border-b border-steel/40 pb-6">
          <span className="label mr-2">{boutique.famillesLabel}</span>
          {(Object.keys(boutique.familles) as FamilleId[]).map((id) => {
            const n = id === "tout" ? articles.length : articles.filter((a) => a.famille === id).length;
            const actif = famille === id;
            return (
              <button
                key={id}
                type="button"
                data-cursor="hover"
                onClick={() => setFamille(id)}
                aria-pressed={actif}
                className={cn(
                  "border px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300",
                  actif
                    ? "border-transparent bg-signal text-void"
                    : "border-steel text-fog hover:border-fog hover:text-bone",
                )}
              >
                {boutique.familles[id]}
                <span className={cn("ml-2 tabular-nums", actif ? "text-void/60" : "text-fog")}>
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── les cartes ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter pb-6 pt-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visibles.map((a) => {
            const dedans = selection.contient(a.cle);
            return (
              <article
                key={a.cle}
                className={cn(
                  "group relative flex flex-col border bg-carbon transition-colors duration-300",
                  dedans ? "border-signal" : "border-steel/60 hover:border-steel",
                )}
              >
                {/* La plaque teintée : un rayon se regarde avant de se lire, et
                    aucune de ces lignes n'a de photo — la couleur de discipline
                    fait le travail, comme dans la galerie des réalisations. */}
                <span aria-hidden className="block h-1.5 w-full" style={{ background: a.teinte }} />

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h2 className="display text-[clamp(1.25rem,2.4vw,1.7rem)] leading-[1.05] text-bone">
                    {a.nom}
                  </h2>

                  <p className="mt-4 font-mono text-[0.8125rem] leading-[1.8] text-fog">
                    {a.promesse}
                  </p>

                  {a.inclus && a.inclus.length > 0 && (
                    <>
                      <p className="label mt-6 text-fog">{boutique.inclusLabel}</p>
                      <ul className="mt-3 space-y-1.5">
                        {a.inclus.slice(0, 4).map((i) => (
                          <li
                            key={i}
                            className="flex gap-3 font-mono text-[0.75rem] leading-[1.7] text-bone/80"
                          >
                            <span aria-hidden style={{ color: a.teinte }}>
                              ·
                            </span>
                            <span>{i}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {!a.inclus && a.contenu && (
                    <p className="mt-5 font-mono text-[0.75rem] leading-[1.75] text-bone/70">
                      {a.contenu}
                    </p>
                  )}

                  {/* Le portfolio de la ligne, déduit des réalisations. */}
                  {a.famille === "prestations" && (
                    <div className="mt-6">
                      <p className="label" style={{ color: a.teinte }}>
                        {boutique.portfolioLabel}
                      </p>
                      {a.preuves.length === 0 ? (
                        <p className="mt-2 font-mono text-[0.75rem] leading-[1.7] text-fog">
                          {boutique.portfolioVide}
                        </p>
                      ) : (
                        <p className="mt-2 font-mono text-[0.75rem] leading-[1.9] text-bone/85">
                          {a.preuves.map((p, i) => (
                            <span key={p.slug}>
                              {i > 0 && <span className="text-fog"> · </span>}
                              <Link
                                href={p.href}
                                data-cursor="hover"
                                className="underline decoration-steel underline-offset-4 transition-colors duration-300 hover:decoration-bone"
                              >
                                {p.titre}
                              </Link>
                              {p.livre && (
                                <span aria-hidden style={{ color: a.teinte }}>
                                  {" "}
                                  ●
                                </span>
                              )}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Le prix et l'action restent collés en bas : des cartes de
                      hauteurs différentes aligneraient sinon leurs boutons
                      n'importe où, et le rayon cesserait d'être comparable. */}
                  <div className="mt-auto pt-7">
                    <p>
                      {a.plancher && (
                        <span className="label mb-1.5 block text-fog">{vedettes.from}</span>
                      )}
                      <span className="display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-none text-signal tabular-nums">
                        {prix(a.prix)}
                      </span>
                      {a.unite && (
                        <span className="ml-2 font-mono text-[0.75rem] text-fog">· {a.unite}</span>
                      )}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => selection.basculer(a.cle)}
                        className={cn(
                          "flex-1 border px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors duration-300",
                          dedans
                            ? "border-signal bg-signal text-void"
                            : "border-steel text-bone hover:border-signal hover:text-signal",
                        )}
                      >
                        {dedans ? `✓ ${boutique.ajoute}` : boutique.ajouter}
                      </button>
                      <Link
                        href={a.detail}
                        data-cursor="hover"
                        className="label shrink-0 transition-colors duration-300 hover:text-bone"
                      >
                        {boutique.detailCta} ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 max-w-[70ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
          {boutique.planchersNote}
        </p>
      </section>

      <div className="bq-bands">
        {/* ── compris avec toute commande ─────────────────────────── */}
        <section className="bq-band border-t border-steel/40 bg-carbon">
          <div className="mx-auto max-w-[1800px] gutter py-16 md:py-20">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <p className="label text-signal">{boutique.liaisonsLabel}</p>
              <p className="font-mono text-[0.75rem] text-fog">{boutique.liaisonsLead}</p>
            </div>
            <h2 className="mt-5 max-w-[26ch] display text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.04] text-bone">
              {boutique.liaisonsTitre}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {vedettes.liaisons.map((l) => (
                <div key={l.id} className="border border-steel/60 p-6">
                  <p className="label text-signal">{l.cout}</p>
                  <h3 className="display mt-3 text-[clamp(1.1rem,2vw,1.45rem)] leading-none text-bone">
                    {l.name}
                  </h3>
                  <p className="mt-4 font-mono text-[0.75rem] leading-[1.8] text-fog">
                    {l.promesse}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── les guides — le seul rayon qui part chez Chariow ─────── */}
        <section className="bq-band">
          <div className="mx-auto max-w-[1800px] gutter py-16 md:py-24">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
              <div className="md:col-span-5">
                <p className="label" style={{ color: JAUNE }}>
                  {boutique.produitsLabel}
                </p>
                <h2 className="display mt-4 text-[clamp(1.75rem,4vw,3rem)] leading-[1.02] text-bone">
                  {boutique.produitsTitre}
                </h2>
                <p className="mt-6 max-w-[40ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">
                  {boutique.produitsLead}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {lienChariow(boutique.ctaBoutique, true)}
                  {lienChariow(boutique.ctaRevendeur, false)}
                </div>
                <ul className="mt-10 space-y-3">
                  {boutique.regle.map((r) => (
                    <li key={r.titre} className="flex gap-4">
                      <span
                        aria-hidden
                        className="mt-2 block h-1.5 w-1.5 shrink-0"
                        style={{ background: JAUNE }}
                      />
                      <span className="font-mono text-[0.75rem] leading-[1.7]">
                        <span className="text-bone">{r.titre}</span>
                        <span className="text-fog"> — {r.corps}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:col-span-7">
                {boutique.rayons.map((r) => (
                  <div key={r.id} className="flex flex-col border border-steel/60 bg-carbon p-6">
                    <span aria-hidden className="mb-5 block h-px w-10" style={{ background: JAUNE }} />
                    <h3 className="display text-[clamp(1.05rem,1.9vw,1.35rem)] leading-[1.1] text-bone">
                      {r.titre}
                    </h3>
                    <p className="mt-3 font-mono text-[0.75rem] leading-[1.7] text-fog">
                      {r.promesse}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {r.titres.map((t) => (
                        <li
                          key={t}
                          className="flex gap-3 font-mono text-[0.75rem] leading-[1.6] text-bone/80"
                        >
                          <span aria-hidden style={{ color: JAUNE }}>
                            ·
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-auto pt-6">
                      <a
                        href={boutique.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="label transition-colors duration-300 hover:text-bone"
                        style={{ color: JAUNE }}
                      >
                        {boutique.ctaBoutique} ↗
                      </a>
                    </p>
                  </div>
                ))}
                <p className="font-mono text-[0.75rem] leading-[1.8] text-fog sm:col-span-2">
                  {boutique.prixNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── revendre ─────────────────────────────────────────────── */}
        <section className="bq-band border-t border-steel/40 bg-carbon">
          <div className="mx-auto max-w-[1800px] gutter py-16 md:py-20">
            <p className="label">{boutique.revendeurLabel}</p>
            <h2 className="mt-5 max-w-[24ch] display text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.04] text-bone">
              {boutique.revendeurTitre}
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {boutique.revendeur.map((r) => (
                <div key={r.titre}>
                  <h3 className="display text-[clamp(1.05rem,1.9vw,1.35rem)] leading-none text-bone">
                    {r.titre}
                  </h3>
                  <p className="mt-3 font-mono text-[0.75rem] leading-[1.8] text-fog">{r.corps}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">{lienChariow(boutique.ctaRevendeur, true)}</div>
          </div>
        </section>
      </div>

      {/* ── la barre de sélection ────────────────────────────────────
          Fixée en bas et affichée seulement quand il y a quelque chose :
          une barre vide est un bandeau publicitaire pour sa propre boutique. */}
      {choisis.length > 0 && !ouvert && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-signal/40 bg-void/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 gutter py-4">
            <p className="font-mono text-[0.75rem] leading-tight text-fog">
              <span className="text-bone">
                {choisis.length} {choisis.length > 1 ? P.articles : P.article}
              </span>
              <span className="mx-2 text-fog">·</span>
              {P.total} <span className="text-signal tabular-nums">{prix(total)}</span>
            </p>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setOuvert(true)}
              className="inline-flex items-center gap-3 bg-signal px-6 py-3.5 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-void transition-opacity duration-300 hover:opacity-85"
            >
              {P.ouvrir}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ── le panneau de commande ───────────────────────────────────
          TOUJOURS MONTÉ, jamais rendu conditionnellement : Netlify enregistre
          le formulaire en lisant le HTML produit au build. Un formulaire
          absent à ce moment-là accepterait les envois sans les enregistrer. */}
      <div
        hidden={!ouvert}
        className="fixed inset-0 z-50 overflow-y-auto bg-void/95 backdrop-blur"
      >
        <div className="mx-auto max-w-[900px] gutter py-16 md:py-24">
          <div className="flex items-baseline justify-between gap-6">
            <p className="label text-signal">{P.titre}</p>
            <button
              type="button"
              data-cursor="hover"
              onClick={() => setOuvert(false)}
              className="label transition-colors duration-300 hover:text-bone"
            >
              ← {P.fermer}
            </button>
          </div>

          {/* — l'accusé de réception —————————————————————— */}
          {etat === "envoyee" ? (
            <div role="status" aria-live="polite">
              <span aria-hidden className="mt-8 block h-px w-full bg-signal" />
              <h2 className="display mt-8 text-[clamp(1.6rem,4vw,2.75rem)] leading-[1.04] text-bone">
                {F.envoyee.titre}
              </h2>
              <p className="mt-6 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
                {F.envoyee.corps}
              </p>
              <Whatsapp message={messageWhatsapp} label={F.whatsapp} className="mt-10" />
            </div>
          ) : (
            <>
              <ul className="mt-8">
                {choisis.map((a) => (
                  <li
                    key={a.cle}
                    className="flex items-baseline justify-between gap-6 border-b border-steel/40 py-4"
                  >
                    <span className="font-mono text-[0.8125rem] leading-[1.6] text-bone">
                      {a.nom}
                    </span>
                    <span className="flex shrink-0 items-baseline gap-5">
                      <span className="font-mono text-[0.8125rem] text-signal tabular-nums">
                        {a.plancher && <span className="text-fog">{vedettes.from} </span>}
                        {prix(a.prix)}
                      </span>
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => selection.basculer(a.cle)}
                        className="label transition-colors duration-300 hover:text-bone"
                      >
                        {boutique.retirer}
                      </button>
                    </span>
                  </li>
                ))}
                {choisis.length === 0 && (
                  <li className="py-6 font-mono text-[0.8125rem] text-fog">{P.vide}</li>
                )}
              </ul>

              {choisis.length > 0 && (
                <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
                  <p>
                    <span className="label text-fog">{P.total}</span>
                    <span className="ml-4 display text-[clamp(1.5rem,3.4vw,2.25rem)] leading-none text-signal tabular-nums">
                      {prix(total)}
                    </span>
                  </p>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={selection.vider}
                    className="label transition-colors duration-300 hover:text-bone"
                  >
                    {P.vider}
                  </button>
                </div>
              )}
              <p className="mt-4 max-w-[60ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
                {P.totalNote}
              </p>

              <form
                name={F.name}
                method="POST"
                action={F.endpoint}
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={envoyer}
                onInput={surSaisie}
                className="mt-12"
              >
                <input type="hidden" name="form-name" value={F.name} />
                <input type="hidden" name="lang" value={lang} />
                {/* Les articles partent en texte : une commande doit rester
                    lisible dans la table Netlify sans rien décoder. */}
                <input type="hidden" name="selection" value={recap} />
                <p hidden>
                  <label>
                    {F.honeypot} <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <fieldset disabled={envoiEnCours} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="block">
                    <span className="label">{F.nom.label}</span>
                    <input
                      name="nom"
                      required
                      autoComplete="name"
                      placeholder={F.nom.placeholder}
                      className="mt-3 w-full border border-steel bg-transparent px-4 py-3 font-mono text-[0.8125rem] text-bone outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-signal"
                    />
                  </label>
                  <label className="block">
                    <span className="label">{F.telephone.label}</span>
                    <input
                      name="telephone"
                      required
                      type="tel"
                      autoComplete="tel"
                      placeholder={F.telephone.placeholder}
                      className="mt-3 w-full border border-steel bg-transparent px-4 py-3 font-mono text-[0.8125rem] text-bone outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-signal"
                    />
                    <span className="mt-2 block font-mono text-[0.6875rem] leading-[1.6] text-fog">
                      {F.telephone.hint}
                    </span>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="label">{F.message.label}</span>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder={F.message.placeholder}
                      className="mt-3 w-full resize-y border border-steel bg-transparent px-4 py-3 font-mono text-[0.8125rem] leading-[1.7] text-bone outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-signal"
                    />
                  </label>
                </fieldset>

                <p className="mt-6 max-w-[60ch] font-mono text-[0.6875rem] leading-[1.8] text-fog">
                  {F.consent}
                </p>

                {etat === "echec" && (
                  <div role="alert" className="mt-8 border-l-2 border-signal py-1 pl-5">
                    <p className="label text-signal">{F.echec.titre}</p>
                    <p className="mt-3 max-w-[52ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
                      {F.echec.corps}
                    </p>
                    <Whatsapp
                      message={[messageWhatsapp, "", dernier.current.nom || ""].join("\n").trim()}
                      label={F.echec.action}
                      className="mt-5"
                    />
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    data-cursor="hover"
                    disabled={!prete || envoiEnCours || choisis.length === 0}
                    className="inline-flex items-center gap-3 bg-signal px-7 py-4 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-void transition-opacity duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {envoiEnCours ? F.envoi : P.envoyer}
                    <span aria-hidden>→</span>
                  </button>
                  {choisis.length > 0 && <Whatsapp message={messageWhatsapp} label={F.whatsapp} />}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
