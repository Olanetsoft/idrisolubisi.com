"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { lenses, type LensKey } from "@/data/lenses";

type LensState = { lens: LensKey; setLens: (key: LensKey) => void };

const LensContext = createContext<LensState | null>(null);

const lensForPath = (path: string): LensKey | null =>
  Object.values(lenses).find((l) => l.path === path)?.key ?? null;

/**
 * Holds the role the page is pitched for. The first render uses the lens of
 * the URL that was opened, so tailored links never flash the default. Picking
 * another lens swaps the content in place and updates the address bar, so the
 * current view can be copied and shared. Back and Forward re-read the lens
 * from the address bar, so the view always matches the URL.
 */
export function LensProvider({ initial, children }: { initial: LensKey; children: ReactNode }) {
  const [lens, setLensState] = useState<LensKey>(initial);

  const setLens = useCallback((key: LensKey) => {
    setLensState(key);
    const { path, metaTitle } = lenses[key];
    if (window.location.pathname !== path) {
      // A null state lets Next.js keep its own history state and its idea of
      // the current pathname in step with the new URL.
      window.history.replaceState(null, "", path + window.location.search + window.location.hash);
    }
    document.title = metaTitle;
  }, []);

  useEffect(() => {
    const sync = () => {
      const key = lensForPath(window.location.pathname);
      if (!key) return;
      setLensState(key);
      document.title = lenses[key].metaTitle;
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const value = useMemo(() => ({ lens, setLens }), [lens, setLens]);
  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens(): LensState {
  const value = useContext(LensContext);
  if (!value) throw new Error("useLens must be used inside LensProvider");
  return value;
}
