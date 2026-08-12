import type { Project } from "@/content/projects";
import { disciplineColor } from "@/content/services";
import { cn } from "@/lib/utils";

/**
 * Couverture d'un projet — le SEUL endroit où l'on décide comment une image
 * occupe sa plaque. Les trois surfaces qui en affichent une (galerie de
 * l'accueil, index /work, fiche projet) passent par ici, sinon la règle
 * diverge et un logo finit recadré à un endroit et pas à l'autre.
 *
 * La règle : toutes les images ne se traitent pas de la même façon.
 *
 *   `cover`   — l'image remplit la plaque et se fait recadrer. Réservé aux
 *               photos et aux rendus, où perdre les bords est sans conséquence.
 *
 *   `contain` — l'image est montrée ENTIÈRE et jamais agrandie au-delà de sa
 *               taille native. Obligatoire pour un logo ou une composition
 *               graphique : les recadrer les détruit, et les étirer les rend
 *               méconnaissables.
 *
 * Sans couverture, la plaque compose un fond teinté à la couleur de la
 * discipline — un projet est donc présentable dès son ajout.
 */
export function Cover({
  project,
  className,
  /** Recadrage maximal du `contain`, en % de la plaque. */
  inset = 76,
}: {
  project: Project;
  className?: string;
  inset?: number;
}) {
  const color = disciplineColor[project.discipline];
  const fit = project.coverFit ?? "cover";

  return (
    <span className={cn("relative block h-full w-full overflow-hidden bg-carbon", className)}>
      {/* Fond teinté : il sert de repli quand il n'y a pas d'image, et de
          support quand l'image est en `contain` — sans lui, un logo flotterait
          sur du noir plat. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 100% at 28% 18%, color-mix(in srgb, ${color} 28%, transparent) 0%, transparent 68%), linear-gradient(160deg, var(--color-graphite) 0%, var(--color-void) 75%)`,
        }}
      />

      {project.cover &&
        (fit === "cover" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // `w-auto h-auto` + `max-*` : l'image se réduit si elle dépasse, mais
          // n'est JAMAIS agrandie. C'est ce qui évite le logo pixellisé et
          // gonflé qu'on obtenait en `object-cover`.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover}
            alt={project.title}
            className="absolute inset-0 m-auto h-auto w-auto object-contain"
            style={{ maxHeight: `${inset}%`, maxWidth: `${inset}%` }}
          />
        ))}

      {/* filet de discipline : le code couleur, à l'endroit le plus lu */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 block h-px"
        style={{ background: color }}
      />
    </span>
  );
}
