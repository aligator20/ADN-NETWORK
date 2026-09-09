"use client";

import { useState } from "react";

import { Champ } from "@/components/ui/Champ";
import { Magnetic } from "@/components/ui/Magnetic";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { useCopy, useLang } from "@/hooks/useCopy";
import { useNetlifyForm } from "@/hooks/useNetlifyForm";
import { cn } from "@/lib/utils";

/**
 * DEMANDE DE DEVIS — LA VITRINE
 *
 * Second formulaire Netlify du site, DISTINCT de la candidature au Réseau. La
 * séparation est délibérée : une candidature gratuite et une demande payante
 * n'ont ni le même délai de réponse, ni la même suite, ni la même valeur. Les
 * mélanger dans une seule table rendrait les deux impossibles à traiter.
 *
 * La formule envisagée est facultative — et « je ne sais pas encore » est un
 * choix explicite, pas une absence de réponse. Quelqu'un qui hésite entre deux
 * formules abandonne un formulaire qui l'oblige à trancher avant d'avoir parlé
 * à quelqu'un ; ici il peut demander sans savoir, ce qui est exactement la
 * situation dans laquelle se trouve la majorité des acheteurs.
 *
 * Toute la mécanique d'envoi vit dans `useNetlifyForm` — y compris la raison
 * pour laquelle on poste sur l'`action` du formulaire et non sur une constante.
 */
export function BriefForm() {
  const { vitrine, community, site } = useCopy();
  const lang = useLang();
  const F = vitrine.form;
  // Les libellés des champs communs viennent du formulaire du Réseau : ce sont
  // les mêmes informations, il n'y a aucune raison de les nommer autrement.
  const C = community.form;

  const [formule, setFormule] = useState<string>("");
  const { etat, prete, dernier, envoyer, surSaisie, envoiEnCours } = useNetlifyForm(F.endpoint);

  /**
   * Formules ET services : le devis se demande d'un seul formulaire.
   *
   * Chercher uniquement dans `formules` renverrait `undefined` pour une
   * demande de vidéo ou de manuel, et la demande partirait étiquetée « je ne
   * sais pas encore » — le devis serait alors à refaire au téléphone, ce que
   * ce formulaire existe précisément pour éviter.
   */
  const commandables = [...vitrine.formules, ...vitrine.services];
  const choisie = commandables.find((f) => f.id === formule);

  /* — Repli email si l'envoi échoue ————————————————————————— */
  const mailto = () => {
    const d = dernier.current;
    const corps = [
      `${F.formuleLegend} : ${choisie?.name ?? F.undecided}`,
      `${C.fields.name.label} : ${d.name ?? ""}`,
      `${C.fields.email.label} : ${d.email ?? ""}`,
      `${C.fields.phone.label} : ${d.phone || "—"}`,
      `${F.metier.label} : ${d.metier ?? ""}`,
      "",
      `${F.projet.label} :`,
      d.projet || "—",
    ].join("\n");
    return `mailto:${site.email}?subject=${encodeURIComponent(
      `${vitrine.name} — ${choisie?.name ?? F.undecided} — ${d.name ?? ""}`,
    )}&body=${encodeURIComponent(corps)}`;
  };

  /* — Accusé de réception ————————————————————————————————— */
  if (etat === "envoyee") {
    return (
      <div className="md:col-span-8" role="status" aria-live="polite">
        <span aria-hidden className="block h-px w-full bg-signal" />
        <p className="label mt-8 text-signal">{choisie?.name ?? F.undecided}</p>
        <h3 className="display mt-5 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.02] text-bone">
          {C.sent.title}
        </h3>
        <p className="mt-7 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.95] text-fog">
          {C.sent.body}
        </p>
        <Whatsapp
          message={`${vitrine.name} — ${choisie?.name ?? F.undecided}`}
          label={C.whatsapp}
          className="mt-10"
        />
      </div>
    );
  }

  return (
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
      {/* L'identifiant de formule, pas son nom traduit — voir `JoinForm`. */}
      <input type="hidden" name="formule" value={formule} />
      <input type="hidden" name="lang" value={lang} />
      <p hidden>
        <label>
          {C.honeypot} <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {/* — formule envisagée ————————————————————————————— */}
      <fieldset disabled={envoiEnCours}>
        <legend className="label">{F.formuleLegend}</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {commandables.map((f) => (
            <button
              key={f.id}
              type="button"
              data-cursor="hover"
              onClick={() => setFormule(f.id)}
              aria-pressed={formule === f.id}
              className={cn(
                "border px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
                formule === f.id
                  ? "border-transparent bg-signal text-void"
                  : "border-steel text-fog hover:text-bone",
              )}
            >
              {f.name}
            </button>
          ))}
          {/* Sortie explicite pour l'indécis : sans elle, il ferme la page. */}
          <button
            type="button"
            data-cursor="hover"
            onClick={() => setFormule("")}
            aria-pressed={formule === ""}
            className={cn(
              "border px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
              formule === ""
                ? "border-transparent bg-bone text-void"
                : "border-steel text-fog hover:text-bone",
            )}
          >
            {F.undecided}
          </button>
        </div>
      </fieldset>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Champ
          nom="name"
          label={C.fields.name.label}
          autoComplete="name"
          requis
          disabled={envoiEnCours}
        />
        <Champ
          nom="email"
          type="email"
          label={C.fields.email.label}
          autoComplete="email"
          requis
          disabled={envoiEnCours}
        />
        <Champ
          nom="phone"
          type="tel"
          label={C.fields.phone.label}
          placeholder={C.fields.phone.placeholder}
          hint={C.fields.phone.hint}
          autoComplete="tel"
          disabled={envoiEnCours}
        />
        <Champ
          nom="metier"
          label={F.metier.label}
          placeholder={F.metier.placeholder}
          requis
          disabled={envoiEnCours}
        />
      </div>

      <div className="mt-8">
        <label className="label block" htmlFor="vt-projet">
          {F.projet.label}
        </label>
        <textarea
          id="vt-projet"
          name="projet"
          rows={5}
          disabled={envoiEnCours}
          placeholder={F.projet.placeholder}
          className="mt-4 w-full resize-none border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 placeholder:text-steel focus:border-signal disabled:opacity-40"
        />
      </div>

      <label
        htmlFor="vt-consent"
        data-cursor="hover"
        className="mt-10 flex max-w-[52ch] cursor-pointer items-start gap-4"
      >
        <input
          id="vt-consent"
          name="consent"
          type="checkbox"
          required
          value="oui"
          disabled={envoiEnCours}
          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-steel bg-transparent transition-colors duration-300 checked:border-signal checked:bg-signal focus-visible:border-signal"
        />
        <span className="font-mono text-[0.75rem] leading-[1.8] text-fog">{C.consent}</span>
      </label>

      <Magnetic strength={0.25}>
        <button
          type="submit"
          disabled={!prete || envoiEnCours}
          data-cursor="hover"
          className="group mt-12 inline-flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="display text-[clamp(1.15rem,2.4vw,2rem)] leading-none text-bone transition-colors duration-300 group-enabled:group-hover:text-signal">
            {envoiEnCours ? C.sending : vitrine.cta.action}
          </span>
          <span
            aria-hidden
            className={cn(
              "block h-px bg-signal transition-all duration-500 ease-expo",
              envoiEnCours ? "w-16 animate-pulse" : "w-10 group-enabled:group-hover:w-16",
            )}
          />
        </button>
      </Magnetic>

      {!prete && etat === "saisie" && (
        <p className="label mt-4 text-steel">{C.incomplete}</p>
      )}

      {etat === "echec" && (
        <div role="alert" className="mt-8 border-l border-signal pl-5">
          <p className="label text-signal">{C.failed.title}</p>
          <p className="mt-3 max-w-[46ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
            {C.failed.body}
          </p>
          <a
            href={mailto()}
            data-cursor="hover"
            className="mt-5 inline-block font-mono text-[0.8125rem] text-bone underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-300 hover:text-signal"
          >
            {C.failed.action} ↗
          </a>
        </div>
      )}
    </form>
  );
}
