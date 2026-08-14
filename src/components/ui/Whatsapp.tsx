"use client";

import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

/**
 * Lien WhatsApp pré-rempli.
 *
 * Le message est composé côté client, comme les formulaires du site : rien
 * n'est envoyé à un serveur, l'utilisateur voit le texte avant de l'envoyer et
 * peut le modifier. `wa.me` ouvre l'application sur mobile et WhatsApp Web sur
 * ordinateur — le même lien couvre les deux cas.
 */
export function Whatsapp({
  message,
  label,
  className,
  showNumber = false,
}: {
  /** Contexte pré-rempli : le destinataire sait de quoi on lui parle. */
  message: string;
  label?: string;
  className?: string;
  showNumber?: boolean;
}) {
  const { site } = useCopy();
  const href = `https://wa.me/${site.whatsapp.wa}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="hover"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-signal/50 transition-colors duration-300 group-hover:border-signal"
      >
        {/* Glyphe WhatsApp en tracé, pas un logo importé : il s'aligne sur le
            reste du chrome et ne dépend d'aucune ressource externe. */}
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-signal" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      </span>
      <span>
        <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-bone transition-colors duration-300 group-hover:text-signal">
          {label ?? "WhatsApp"}
        </span>
        {showNumber && (
          <span className="mt-1 block font-mono text-[0.6875rem] text-fog">
            {site.whatsapp.display}
          </span>
        )}
      </span>
    </a>
  );
}
