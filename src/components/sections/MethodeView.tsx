"use client";

import { useRef, useState } from "react";

import { Champ } from "@/components/ui/Champ";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { useCopy, useLang } from "@/hooks/useCopy";
import { useNetlifyForm } from "@/hooks/useNetlifyForm";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { formatPrix } from "@/lib/prix";
import { cn } from "@/lib/utils";

/**
 * LE PLAN DE MARCHE — la page de la méthode.
 *
 * TROIS CHOIX DE FOND, ET CHACUN SE VOIT À L'ÉCRAN
 *
 * 1. LE CATALOGUE EST RANGÉ PAR LA PHRASE DU CLIENT. Pas par discipline, pas
 *    par famille de produit : par ce qu'il dirait à un ami. Un commerçant ne
 *    cherche pas « optimisation du besoin en fonds de roulement », il cherche
 *    « je n'ai jamais d'argent en caisse ». Cliquer sur une phrase la recopie
 *    dans le formulaire : il n'a plus à la réécrire, et nous recevons un
 *    problème déjà nommé.
 *
 * 2. L'ÉTAT DE CHAQUE MÉTHODE EST AFFICHÉ, Y COMPRIS QUAND IL DESSERT.
 *    Les onze sont « jamais appliquée ». Le dire avant la commande coûte
 *    quelques ventes et en sauve davantage : celui qui l'apprend après se
 *    sent trompé, et il le raconte. Le jour où l'état changera, il changera
 *    parce que des clients auront rendu leur retour, pas parce qu'on l'aura
 *    décidé.
 *
 * 3. LE PRIX DE LA MÉTHODE EST LIÉ À L'ATELIER. `node atelier.js verifier`
 *    compare le plancher du service `plan-de-marche` au nombre écrit dans
 *    `methode.ts` et refuse l'écart. Un montant modifié ici sans l'autre fait
 *    échouer le contrôle — c'est voulu.
 *
 * Le diagnostic est à zéro et s'affiche « Gratuit », pas « 0 FCFA » : un prix
 * nul écrit en chiffres se lit comme une erreur.
 */
/**
 * UNE PHOTOGRAPHIE, TENUE DANS LE NOIR DU SITE.
 *
 * Trois choses, et chacune a sa raison :
 *
 * — `scale-110` ménage la marge que la dérive au défilement consomme. Sans
 *   elle, le parallaxe découvrirait un bord vide en haut ou en bas.
 * — le dégradé vers `--color-void` fond le bas de l'image dans la page, au
 *   lieu de la poser comme une vignette collée sur du noir.
 * — le filet signal en haut est le même que celui des plaques du portfolio :
 *   c'est ce qui fait qu'une image appartient à ce site et pas à un autre.
 *
 * ⚠️ `figure` SANS `figcaption`, ET C'EST DÉLIBÉRÉ. Une légende sous une de
 * ces photos la ferait lire comme un cas réel. Ce sont des illustrations :
 * voir `public/scenes/LICENCES.md`.
 */
function Scene({
  scene,
  className,
}: {
  scene: { src: string; alt: string };
  className?: string;
}) {
  return (
    <figure className={cn("me-scene relative block overflow-hidden bg-carbon", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={scene.src}
        alt={scene.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, var(--color-void) 2%, transparent 60%)" }}
      />
      <span aria-hidden className="absolute inset-x-0 top-0 block h-px bg-signal/70" />
    </figure>
  );
}

export function MethodeView() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { methode: M } = useCopy();
  const lang = useLang();
  const F = M.form;

  /** La phrase choisie, recopiée dans le champ. Vide : il écrit la sienne. */
  const [texte, setTexte] = useState("");
  const [choisie, setChoisie] = useState<string | null>(null);
  const champProbleme = useRef<HTMLTextAreaElement>(null);

  const { etat, prete, dernier, envoyer, surSaisie, envoiEnCours } = useNetlifyForm(F.endpoint);

  const prendrePhrase = (id: string, mots: string) => {
    setChoisie(id);
    setTexte(mots);
    // On amène le formulaire à l'écran : sans ça, le clic n'a l'air de rien
    // faire sur un téléphone, et le visiteur recommence trois fois.
    champProbleme.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    champProbleme.current?.focus({ preventScroll: true });
  };

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".me-fade", {
        y: 18,
        autoAlpha: 0,
        duration: DUR.slow,
        ease: EASE.expo,
        stagger: STAGGER.lines,
      });

      /* — Les photographies : une dérive lente, jamais un effet ————————
         L'image se déplace de 8 % pendant que la page en parcourt la
         hauteur. Au-delà, le mouvement se voit — et une image qui se voit
         bouger est un gadget, pas une respiration. */
      gsap.utils.toArray<HTMLElement>(".me-scene img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      /* — Les chiffres comptent, comme la bande de l'accueil ——————————
         `once: true` : un compteur est un événement, pas une boucle. */
      M.constat.forEach((c, i) => {
        const el = root.current?.querySelector<HTMLElement>(`[data-chiffre="${i}"]`);
        if (!el) return;
        const n = { v: 0 };
        gsap.to(n, {
          v: c.valeur,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(n.v).toLocaleString(lang);
          },
        });
      });

      /* — LA COMPARAISON — c'est l'image de cette page ————————————————
         Les deux barres se dessinent à la même vitesse : si celle du Bénin
         allait plus vite, le dessin mentirait sur l'écart. C'est leur
         LONGUEUR qui doit parler, pas leur vitesse. */
      gsap.from(".me-barre", {
        scaleX: 0,
        duration: DUR.cinematic,
        ease: EASE.power,
        stagger: 0.14,
        scrollTrigger: { trigger: ".me-comparaison", start: "top 82%", once: true },
      });

      [M.comparaison.haut, M.comparaison.bas].forEach((b, i) => {
        const el = root.current?.querySelector<HTMLElement>(`[data-barre="${i}"]`);
        if (!el) return;
        const n = { v: 0 };
        gsap.to(n, {
          v: b.valeur,
          duration: DUR.cinematic,
          ease: EASE.power,
          delay: i * 0.14,
          scrollTrigger: { trigger: ".me-comparaison", start: "top 82%", once: true },
          onUpdate: () => {
            el.textContent = n.v.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
          },
        });
      });

      /* — Les étapes s'installent une par une ——————————————————————— */
      gsap.from(".me-etape", {
        y: 20,
        autoAlpha: 0,
        duration: DUR.base,
        ease: EASE.expo,
        stagger: STAGGER.blocks,
        scrollTrigger: { trigger: ".me-etapes", start: "top 80%", once: true },
      });
    },
    { scope: root, dependencies: [reduced, lang] },
  );

  /** Les phrases regroupées par famille, dans l'ordre du fichier. */
  const familles: { nom: string; phrases: typeof M.phrases }[] = [];
  for (const p of M.phrases) {
    const derniere = familles[familles.length - 1];
    if (derniere && derniere.nom === p.famille) derniere.phrases = [...derniere.phrases, p];
    else familles.push({ nom: p.famille, phrases: [p] });
  }

  const messageWhatsapp = [F.whatsappIntro, "", texte || dernier.current.probleme || ""].join("\n").trim();

  return (
    <div ref={root}>
      {/* ── l'en-tête ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter pt-36 md:pt-44">
        <p className="me-fade label text-signal">{M.kicker}</p>
        <h1 className="me-fade display mt-5 max-w-[16ch] text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] text-bone">
          {M.name}
        </h1>
        <p className="me-fade mt-8 max-w-[52ch] font-mono text-[0.9375rem] leading-[1.8] text-bone">{M.lead}</p>
        <div className="me-fade mt-6 max-w-[62ch] space-y-4">
          {M.body.map((b) => (
            <p key={b} className="font-mono text-[0.8125rem] leading-[1.85] text-fog">
              {b}
            </p>
          ))}
        </div>
      </section>

      {/* ── la photographie d'ouverture ─────────────────────────────── */}
      <section className="me-fade mx-auto mt-16 max-w-[1800px] gutter md:mt-24">
        <Scene scene={M.scenes.hero} className="aspect-[2/1]" />
      </section>

      {/* ── le constat chiffré ──────────────────────────────────────── */}
      <section className="mt-20 border-y border-steel/40 bg-carbon md:mt-28">
        <div className="mx-auto max-w-[1800px] gutter py-16 md:py-20">
          <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-12">
            {/* L'image à gauche, les chiffres à droite : la photo dit de qui
                on parle, les chiffres disent quoi. Séparées, elles se
                répondent ; superposées, le texte deviendrait illisible. */}
            <div className="md:col-span-4">
              <Scene scene={M.scenes.constat} className="aspect-[4/5]" />
            </div>

            <div className="md:col-span-8">
              <p className="label text-signal">{M.constatLabel}</p>
              <h2 className="display mt-4 max-w-[22ch] text-[clamp(1.6rem,4vw,2.75rem)] leading-[1.04] text-bone">
                {M.constatTitre}
              </h2>

              <div className="mt-12 grid grid-cols-3 gap-x-6">
                {M.constat.map((c, i) => (
                  <div key={c.label}>
                    <p className="flex items-baseline text-bone">
                      <span
                        data-chiffre={i}
                        className="display text-[clamp(1.75rem,4.5vw,3.25rem)] leading-none tabular-nums"
                      >
                        0
                      </span>
                      <span className="display text-[clamp(0.9rem,1.6vw,1.25rem)] text-signal">{c.suffixe}</span>
                    </p>
                    <p className="mt-3 max-w-[22ch] font-mono text-[0.75rem] leading-[1.7] text-fog">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* — la comparaison : le dessin qui porte le coup — */}
              <div className="me-comparaison mt-14 border-t border-steel/40 pt-10">
                <p className="max-w-[46ch] font-mono text-[0.75rem] leading-[1.7] text-bone">
                  {M.comparaison.titre}
                </p>
                <div className="mt-8 space-y-6">
                  {[M.comparaison.haut, M.comparaison.bas].map((b, i) => (
                    <div key={b.label}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="label">{b.label}</span>
                        <span className="font-mono text-[0.8125rem] tabular-nums text-bone">
                          <span data-barre={i}>0,0</span> %
                        </span>
                      </div>
                      {/* La piste va jusqu'à 100 % : une barre dessinée sur
                          sa propre valeur exagérerait l'écart. */}
                      <div className="mt-3 h-2.5 w-full bg-graphite">
                        <div
                          className="me-barre h-full origin-left"
                          style={{
                            width: `${b.valeur}%`,
                            /* `fog` et non `steel` pour la barre de
                               comparaison : steel sur graphite ne se voit
                               pas, et une barre invisible ne compare rien.
                               Elle reste clairement seconde face au signal. */
                            background: i === 0 ? "var(--color-signal)" : "var(--color-fog)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-8 max-w-[56ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
                  {M.comparaison.note}
                </p>
                <p className="mt-2 label text-fog">{M.comparaison.unite}</p>
              </div>
            </div>
          </div>

          {/* La source et sa réserve ne sont pas des petits caractères : un
              chiffre sans son périmètre est un chiffre qui ment par omission. */}
          <p className="mt-14 max-w-[72ch] font-mono text-[0.75rem] leading-[1.8] text-fog">{M.constatSource}</p>
          <p className="mt-3 max-w-[72ch] border-l-2 border-steel pl-5 font-mono text-[0.75rem] leading-[1.8] text-fog">
            {M.constatReserve}
          </p>
        </div>
      </section>

      {/* ── les phrases ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter py-16 md:py-24">
        <p className="label text-signal">{M.phrasesLabel}</p>
        <p className="mt-5 max-w-[46ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">{M.phrasesLead}</p>

        <div className="mt-12 space-y-12">
          {familles.map((f) => (
            <div key={f.nom}>
              <p className="label border-b border-steel/40 pb-4">{f.nom}</p>
              <ul className="mt-5 grid grid-cols-1 gap-x-10 lg:grid-cols-2">
                {f.phrases.map((p) => {
                  const actif = choisie === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        data-cursor="hover"
                        onClick={() => prendrePhrase(p.id, p.mots)}
                        aria-pressed={actif}
                        className={cn(
                          "group w-full border-b border-steel/40 py-5 text-left transition-colors duration-300",
                          actif && "border-signal",
                        )}
                      >
                        <span
                          className={cn(
                            "block font-mono text-[0.875rem] leading-[1.6] transition-colors duration-300",
                            actif ? "text-signal" : "text-bone group-hover:text-signal",
                          )}
                        >
                          « {p.mots} »
                        </span>
                        <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="label text-fog" title={M.etats[p.etat].long}>
                            {M.etats[p.etat].court}
                          </span>
                          {p.expert && (
                            <span className="font-mono text-[0.6875rem] text-fog">
                              {M.expertLabel} — {p.expert}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* L'avertissement sur l'état, en toutes lettres et une seule fois. */}
        <p className="mt-12 max-w-[72ch] border-l-2 border-signal pl-5 font-mono text-[0.75rem] leading-[1.8] text-fog">
          {M.etats.neuve.long}
        </p>
      </section>

      {/* ── comment ça se passe ─────────────────────────────────────── */}
      <section className="border-y border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-16 md:py-24">
          <Scene scene={M.scenes.etapes} className="me-fade mb-14 aspect-[21/9]" />
          <p className="label text-signal">{M.etapesLabel}</p>
          <ol className="me-etapes mt-10 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-5">
            {M.etapes.map((e) => (
              <li key={e.n} className="me-etape">
                <p className="font-mono text-[0.6875rem] tabular-nums text-signal">{e.n}</p>
                <h3 className="display mt-3 text-[clamp(1.05rem,1.9vw,1.35rem)] leading-none text-bone">
                  {e.titre}
                </h3>
                <p className="mt-3 font-mono text-[0.75rem] leading-[1.8] text-fog">{e.corps}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── les prix ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter py-16 md:py-24">
        <p className="label text-signal">{M.prixLabel}</p>
        <p className="mt-5 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">{M.prixLead}</p>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {M.paliers.map((p) => (
            <div key={p.id} className="border-t-2 border-steel pt-6">
              <h3 className="display text-[clamp(1.1rem,2vw,1.4rem)] leading-none text-bone">{p.name}</h3>
              <p className="mt-5 display text-[clamp(1.5rem,3vw,2.25rem)] leading-none text-signal tabular-nums">
                {p.prix === null ? M.surDevis : p.prix === 0 ? M.gratuit : formatPrix(p.prix, lang, "")}
                {p.prix !== null && p.prix > 0 && (
                  <span className="ml-2 font-mono text-[0.75rem] tracking-normal text-fog">{M.currency}</span>
                )}
              </p>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-fog">{p.unite}</p>
              <p className="mt-5 font-mono text-[0.75rem] leading-[1.8] text-fog">{p.pour}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ce qu'on ne fait pas ────────────────────────────────────── */}
      <section className="border-y border-steel/40 bg-carbon">
        <div className="mx-auto max-w-[1800px] gutter py-16 md:py-20">
          <p className="label">{M.limitesLabel}</p>
          <ul className="mt-8 grid grid-cols-1 gap-x-12 gap-y-5 lg:grid-cols-2">
            {M.limites.map((l) => (
              <li key={l} className="flex gap-4">
                <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 bg-fog" />
                <span className="max-w-[56ch] font-mono text-[0.75rem] leading-[1.8] text-fog">{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── le formulaire ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1800px] gutter py-16 md:py-24">
        <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-4">
            <h2 className="display max-w-[14ch] text-[clamp(1.6rem,3.6vw,2.5rem)] leading-[1.04] text-bone">
              {F.titre}
            </h2>
            <p className="mt-5 max-w-[34ch] font-mono text-[0.8125rem] leading-[1.85] text-fog">{F.corps}</p>
            <Whatsapp message={messageWhatsapp} label={F.whatsapp} className="mt-8" showNumber />
          </div>

          {/* LE FORMULAIRE RESTE MONTÉ EN PERMANENCE.
              Netlify enregistre les formulaires en analysant le HTML construit :
              un formulaire monté sous condition n'est jamais enregistré, et les
              envois partent dans le vide sans que rien ne le signale. On change
              donc ce qui est AUTOUR, jamais la présence du <form>. */}
          <form
            name={F.name}
            method="POST"
            action={F.endpoint}
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={envoyer}
            onInput={surSaisie}
            className="md:col-span-8"
          >
            <input type="hidden" name="form-name" value={F.name} />
            {/* L'identifiant du problème, pas sa phrase traduite : c'est lui
                qui retombe sur la bibliothèque de l'atelier. */}
            <input type="hidden" name="probleme-id" value={choisie || ""} />
            <p hidden>
              <label>
                {F.honeypot} <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <fieldset disabled={envoiEnCours || etat === "envoyee"} className="space-y-8">
              <div>
                <label className="label block" htmlFor="me-probleme">
                  {F.probleme.label}
                  <span className="ml-1 text-signal">*</span>
                </label>
                <textarea
                  id="me-probleme"
                  ref={champProbleme}
                  name="probleme"
                  required
                  rows={4}
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  placeholder={F.probleme.placeholder}
                  aria-describedby="me-probleme-hint"
                  className="mt-4 w-full resize-none border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 placeholder:text-fog focus:border-signal"
                />
                <p id="me-probleme-hint" className="mt-3 font-mono text-[0.6875rem] text-fog">
                  {F.probleme.hint}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <Champ nom="nom" label={F.nom.label} placeholder={F.nom.placeholder} autoComplete="name" requis />
                <Champ
                  nom="telephone"
                  label={F.telephone.label}
                  type="tel"
                  placeholder={F.telephone.placeholder}
                  hint={F.telephone.hint}
                  autoComplete="tel"
                  requis
                />
              </div>
            </fieldset>

            <p className="mt-8 max-w-[56ch] font-mono text-[0.6875rem] leading-[1.8] text-fog">{F.consent}</p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="submit"
                data-cursor="hover"
                disabled={!prete || envoiEnCours || etat === "envoyee"}
                className={cn(
                  "border px-7 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
                  prete && etat !== "envoyee"
                    ? "border-signal bg-signal text-void hover:bg-transparent hover:text-signal"
                    : "border-steel text-fog",
                )}
              >
                {envoiEnCours ? F.envoi : F.action}
              </button>
              {!prete && etat === "saisie" && (
                <p className="font-mono text-[0.6875rem] text-fog">{F.incomplete}</p>
              )}
            </div>

            {etat === "envoyee" && (
              <div className="mt-10 border-l-2 border-signal pl-5">
                <p className="display text-[1.15rem] leading-none text-bone">{F.envoyee.titre}</p>
                <p className="mt-3 max-w-[48ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
                  {F.envoyee.corps}
                </p>
              </div>
            )}
            {etat === "echec" && (
              <div className="mt-10 border-l-2 border-steel pl-5">
                <p className="display text-[1.15rem] leading-none text-bone">{F.echec.titre}</p>
                <p className="mt-3 max-w-[48ch] font-mono text-[0.75rem] leading-[1.8] text-fog">
                  {F.echec.corps}
                </p>
                <Whatsapp message={messageWhatsapp} label={F.echec.action} className="mt-5" />
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
