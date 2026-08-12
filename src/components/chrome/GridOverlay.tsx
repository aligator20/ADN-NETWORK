/**
 * Grille technique persistante — 12 hairlines verticales à très basse opacité.
 * C'est le cadre qui signe la DA : il rappelle en permanence qu'il y a un
 * système derrière la composition. Purement décoratif, jamais interactif.
 */
export function GridOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 gutter"
    >
      <div className="mx-auto grid h-full max-w-[1800px] grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={
              i >= 4
                ? "hidden border-l border-bone/[0.035] md:block"
                : "border-l border-bone/[0.035]"
            }
          />
        ))}
      </div>
    </div>
  );
}
