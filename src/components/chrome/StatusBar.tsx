"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { site, ui } from "@/content/site";
import { useAppState } from "@/providers/app-context";

/**
 * Barre basse persistante : coordonnées, horloge locale, indicateur de scroll.
 * Le détail qui vend l'idée d'« instrument » plutôt que de page : des données
 * réelles qui bougent, pas des ornements.
 */
export function StatusBar() {
  const root = useRef<HTMLDivElement>(null);
  const { ready } = useAppState();
  const [time, setTime] = useState("--:--:-- ---");

  useEffect(() => {
    // Heure du siège (site.base.timezone), pas celle du visiteur : l'agence a
    // une localité, c'est ce que la barre doit dire.
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "shortOffset",
      timeZone: site.base.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        ".hud-bottom",
        { yPercent: 140 },
        { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.25 },
      );
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 gutter py-6 md:py-8"
    >
      <div className="flex items-end justify-between gap-6">
        {/* — ancrage géographique ————————————————————————
            `shrink-0` est indispensable : `.mask` est en overflow:hidden, donc
            un item de flex qui se contracte ne fait pas déborder — il TRONQUE
            son texte, en silence. En dessous de md, on retire les coordonnées
            plutôt que de les laisser se faire couper. */}
        <div className="mask shrink-0">
          <p className="hud-bottom label">
            <span className="hidden md:inline">
              {site.base.coords}
              <span className="mx-2 text-steel">/</span>
            </span>
            <span className="text-bone/70">
              {site.base.city.toUpperCase()} — {site.base.country}
            </span>
          </p>
        </div>

        {/* — horloge du siège (desktop uniquement) ————————————— */}
        <div className="mask hidden shrink-0 md:block">
          <p className="hud-bottom label tabular-nums">{time}</p>
        </div>

        {/* — indicateur de scroll ————————————————————————— */}
        <div className="mask shrink-0">
          <p className="hud-bottom label flex items-center gap-3 text-bone/70">
            {ui.scroll}
            <span aria-hidden className="relative block h-6 w-px overflow-hidden bg-steel">
              <span className="absolute inset-x-0 top-0 h-2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-signal" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
