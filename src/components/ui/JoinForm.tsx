"use client";

import { useRef, useState } from "react";

import { Magnetic } from "@/components/ui/Magnetic";
import { Whatsapp } from "@/components/ui/Whatsapp";
import { community } from "@/content/community";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * FORMULAIRE DE CANDIDATURE AU RÉSEAU
 *
 * Le site est un export statique : il n'a pas de serveur à lui. La collecte
 * passe donc par Netlify Forms — le formulaire vit dans le HTML livré, Netlify
 * intercepte le POST au bord de son réseau, enregistre la candidature dans le
 * tableau de bord du site et notifie par email. Aucune clé d'API n'est exposée
 * au navigateur, il n'y a aucune base à administrer, et l'export CSV est natif.
 *
 * Le formulaire est NON CONTRÔLÉ : la vérité, c'est le DOM. On lit les valeurs
 * une seule fois à l'envoi, avec `FormData`. C'est moins de code que six états
 * React, et surtout `checkValidity()` nous donne gratuitement la validation du
 * format email et des champs requis — la même que celle que le navigateur
 * imposerait si JavaScript était coupé.
 *
 * Trois précautions :
 *   — `action` et `method` sont posés en dur, donc le formulaire fonctionne
 *     SANS JavaScript : Netlify enregistre et sert `__forms.html` en réponse.
 *     Le `fetch` n'est qu'une amélioration, pas la condition du service.
 *   — `bot-field` est un leurre : les robots remplissent tous les champs, un
 *     humain ne voit pas celui-là. Netlify jette la soumission s'il est rempli.
 *   — en cas d'échec réseau, on retombe sur le mailto. Une candidature perdue
 *     à cause d'un 502 est une candidature perdue pour de bon.
 */
type Etat = "saisie" | "envoi" | "envoyee" | "echec";

const F = community.form;

export function JoinForm() {
  const [role, setRole] = useState<string>(community.roles[0].id);
  const [etat, setEtat] = useState<Etat>("saisie");
  const [prete, setPrete] = useState(false);
  const dernier = useRef<Record<string, string>>({});

  const choisi = community.roles.find((r) => r.id === role) ?? community.roles[0];

  /* — Repli email, construit à partir de ce qui a été saisi ———————— */
  const mailto = () => {
    const d = dernier.current;
    const corps = [
      `Rôle : ${d.role ?? choisi.title}`,
      `Nom : ${d.name ?? ""}`,
      `Email : ${d.email ?? ""}`,
      `WhatsApp : ${d.phone || "—"}`,
      `Lieu : ${d.place ?? ""}`,
      "",
      "Projet / apport :",
      d.project || "(à compléter)",
    ].join("\n");
    return `mailto:${site.email}?subject=${encodeURIComponent(
      `Le Réseau — ${d.role ?? choisi.title} — ${d.name ?? ""}`,
    )}&body=${encodeURIComponent(corps)}`;
  };

  const envoyer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    // `URLSearchParams` n'accepte pas un `FormData` en entrée côté types : on
    // recopie champ par champ, ce qui permet au passage de garder une trace
    // des valeurs pour le repli mailto.
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
      const res = await fetch(F.endpoint, {
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

  /* — Accusé de réception ————————————————————————————————— */
  if (etat === "envoyee") {
    return (
      <div className="md:col-span-8" role="status" aria-live="polite">
        <span aria-hidden className="block h-px w-full" style={{ background: choisi.color }} />
        <p className="label mt-8" style={{ color: choisi.color }}>
          {choisi.title}
        </p>
        <h3 className="display mt-5 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.02] text-bone">
          {F.sent.title}
        </h3>
        <p className="mt-7 max-w-[52ch] font-mono text-[0.8125rem] leading-[1.95] text-fog">
          {F.sent.body}
        </p>
        <Whatsapp
          message={`Bonjour, je viens de déposer une candidature au Réseau (${choisi.title}).`}
          label="Nous joindre sur WhatsApp"
          className="mt-10"
        />
      </div>
    );
  }

  const envoiEnCours = etat === "envoi";

  return (
    <form
      name={F.name}
      method="POST"
      action={F.endpoint}
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={envoyer}
      onInput={(e) => setPrete(e.currentTarget.checkValidity())}
      className="md:col-span-8"
    >
      {/* Netlify identifie la soumission par ce champ, pas par l'URL. */}
      <input type="hidden" name="form-name" value={F.name} />
      <input type="hidden" name="role" value={choisi.title} />
      <p hidden>
        <label>
          Ne pas remplir <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {/* — rôle ————————————————————————————————————————— */}
      <fieldset disabled={envoiEnCours}>
        <legend className="label">{F.roleLegend}</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {community.roles.map((r) => (
            <button
              key={r.id}
              type="button"
              data-cursor="hover"
              onClick={() => setRole(r.id)}
              aria-pressed={role === r.id}
              className={cn(
                "border px-5 py-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] transition-colors duration-300",
                role === r.id
                  ? "border-transparent text-void"
                  : "border-steel text-fog hover:text-bone",
              )}
              style={role === r.id ? { background: r.color } : undefined}
            >
              {r.title}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <Champ
          nom="name"
          label={F.fields.name.label}
          autoComplete="name"
          requis
          disabled={envoiEnCours}
        />
        <Champ
          nom="email"
          type="email"
          label={F.fields.email.label}
          autoComplete="email"
          requis
          disabled={envoiEnCours}
        />
        <Champ
          nom="phone"
          type="tel"
          label={F.fields.phone.label}
          placeholder={F.fields.phone.placeholder}
          hint={F.fields.phone.hint}
          autoComplete="tel"
          disabled={envoiEnCours}
        />
        <Champ
          nom="place"
          label={F.fields.place.label}
          placeholder={F.fields.place.placeholder}
          requis
          disabled={envoiEnCours}
        />
      </div>

      <div className="mt-8">
        <label className="label block" htmlFor="rz-project">
          {F.fields.project.label}
        </label>
        <textarea
          id="rz-project"
          name="project"
          rows={5}
          disabled={envoiEnCours}
          placeholder={F.fields.project.placeholder}
          className="mt-4 w-full resize-none border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 placeholder:text-steel focus:border-signal disabled:opacity-40"
        />
      </div>

      {/* — consentement : on stocke désormais, il faut le demander ——— */}
      <label
        htmlFor="rz-consent"
        data-cursor="hover"
        className="mt-10 flex max-w-[52ch] cursor-pointer items-start gap-4"
      >
        <input
          id="rz-consent"
          name="consent"
          type="checkbox"
          required
          value="oui"
          disabled={envoiEnCours}
          className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-steel bg-transparent transition-colors duration-300 checked:border-signal checked:bg-signal focus-visible:border-signal"
        />
        <span className="font-mono text-[0.75rem] leading-[1.8] text-fog">{F.consent}</span>
      </label>

      <Magnetic strength={0.25}>
        <button
          type="submit"
          disabled={!prete || envoiEnCours}
          data-cursor="hover"
          className="group mt-12 inline-flex items-center gap-4 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span className="display text-[clamp(1.15rem,2.4vw,2rem)] leading-none text-bone transition-colors duration-300 group-enabled:group-hover:text-signal">
            {envoiEnCours ? F.sending : community.cta.action}
          </span>
          <span
            aria-hidden
            className={cn(
              "block h-px bg-signal transition-all duration-500 ease-expo",
              envoiEnCours
                ? "w-16 animate-pulse"
                : "w-10 group-enabled:group-hover:w-16",
            )}
          />
        </button>
      </Magnetic>

      {!prete && etat === "saisie" && (
        <p className="label mt-4 text-steel">{F.incomplete}</p>
      )}

      {etat === "echec" && (
        <div role="alert" className="mt-8 border-l border-signal pl-5">
          <p className="label" style={{ color: "var(--color-signal)" }}>
            {F.failed.title}
          </p>
          <p className="mt-3 max-w-[46ch] font-mono text-[0.8125rem] leading-[1.9] text-fog">
            {F.failed.body}
          </p>
          <a
            href={mailto()}
            data-cursor="hover"
            className="mt-5 inline-block font-mono text-[0.8125rem] text-bone underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-300 hover:text-signal"
          >
            {F.failed.action} ↗
          </a>
        </div>
      )}
    </form>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

/** Champ à filet, sans boîte : la même grammaire que le reste du site. */
function Champ({
  nom,
  label,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  requis,
  disabled,
}: {
  nom: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  requis?: boolean;
  disabled?: boolean;
}) {
  const id = `rz-${nom}`;
  return (
    <div>
      <label className="label block" htmlFor={id}>
        {label}
        {requis && <span className="ml-1 text-signal">*</span>}
      </label>
      <input
        id={id}
        name={nom}
        type={type}
        required={requis}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-4 w-full border-0 border-b border-steel bg-transparent pb-3 font-mono text-[0.875rem] text-bone outline-none transition-colors duration-300 placeholder:text-steel focus:border-signal disabled:opacity-40"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-3 font-mono text-[0.6875rem] text-steel">
          {hint}
        </p>
      )}
    </div>
  );
}
