"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { Magnetic } from "@/components/ui/Magnetic";
import { LangSwitch } from "@/components/chrome/LangSwitch";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";
import { useAppState } from "@/providers/app-context";

/**
 * Barre haute persistante : logotype + déclencheur d'index.
 * Elle ne scrolle jamais, elle ne se cache jamais — c'est le cadre du HUD.
 */
export function Header() {
  const root = useRef<HTMLElement>(null);
  const { ready, menuOpen, toggleMenu } = useAppState();
  const { site, ui } = useCopy();

  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        ".hud-top",
        { yPercent: -140 },
        {
          yPercent: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          delay: 0.15,
        },
      );
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <header
      ref={root}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 gutter py-6 md:py-8"
    >
      <div className="flex items-center justify-between gap-4">
        {/* — logotype ————————————————————————————————————— */}
        <div className="mask">
          <a
            href="#hero"
            data-cursor="hover"
            className="hud-top pointer-events-auto block font-mono text-[11px] uppercase tracking-[0.28em] text-bone transition-opacity duration-300 hover:opacity-60"
          >
            {site.wordmark.first}
            <span className="text-signal">°</span>
            {site.wordmark.second}
          </a>
        </div>

        {/* — langue + déclencheur d'index ————————————————— */}
        <div className="flex items-center gap-5 md:gap-7">
          <div className="mask">
            <LangSwitch className="hud-top pointer-events-auto" />
          </div>

          <Magnetic strength={0.35}>
            <div className="mask shrink-0">
              <button
                type="button"
                data-cursor="hover"
                onClick={toggleMenu}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? ui.menuClose : ui.menuOpen}
                className="hud-top pointer-events-auto flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-fog transition-colors duration-300 hover:text-bone"
              >
                {menuOpen ? ui.menuClose : ui.menuOpen}
                {/* Les deux barres se croisent en X : l'icône dit l'état, elle
                  ne se contente pas de déclencher. */}
                <span aria-hidden className="relative block h-4 w-4">
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 block h-px w-4 bg-current transition-transform duration-400 ease-expo",
                      menuOpen ? "rotate-45" : "-translate-y-[3px]",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 block h-px w-4 bg-current transition-transform duration-400 ease-expo",
                      menuOpen ? "-rotate-45" : "translate-y-[3px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
