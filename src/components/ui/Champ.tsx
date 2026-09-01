"use client";

/**
 * CHAMP À FILET, SANS BOÎTE
 *
 * La grammaire du site : un libellé en mono, un trait, rien autour. Partagé par
 * les deux formulaires — candidature au Réseau et demande de devis — parce que
 * deux champs recopiés finissent toujours par diverger d'un pixel, puis d'un
 * comportement.
 */
export function Champ({
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
