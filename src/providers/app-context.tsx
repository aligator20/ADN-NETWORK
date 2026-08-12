"use client";

import { createContext, useContext } from "react";

export type AppState = {
  /** Le préchargement est terminé : les séquences peuvent jouer leur entrée. */
  ready: boolean;
  markReady: () => void;
  /** Menu plein écran. */
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

export const AppContext = createContext<AppState | null>(null);

/**
 * Le contexte vit dans son propre module — et pas dans `AppShell` — parce que
 * `AppShell` importe Header, StatusBar et Menu, qui consomment ce contexte. Le
 * sortir ici casse le cycle d'imports au lieu de compter sur le hoisting.
 */
export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState doit être utilisé dans <AppShell>");
  return ctx;
}
