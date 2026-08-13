import { statusColor, statusLabel, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

/**
 * Pastille d'état d'un projet.
 *
 * Un point plein plutôt qu'un cadre : le site n'encadre rien, nulle part. La
 * couleur porte l'information, le mot la confirme — on ne demande jamais au
 * lecteur de mémoriser un code.
 *
 * « Recherche de financement » sort en lime, l'accent de la marque : c'est le
 * seul état qui appelle une action de la part de celui qui lit.
 */
export function Status({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const color = statusColor[project.status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.24em]",
        className,
      )}
      style={{ color }}
    >
      <span
        aria-hidden
        className="block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      {statusLabel[project.status]}
    </span>
  );
}
