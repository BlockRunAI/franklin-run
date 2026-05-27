"use client";

import { useEffect, useState } from "react";

export type Theme = "gold" | "light" | "dark";
const KEY = "franklin-theme";

// Theme switch for /try. "gold" is the default warm palette (no data-theme);
// "light"/"dark" set data-theme on <html>. Persisted in localStorage; the
// no-flash script in layout.tsx applies it before paint on reload.
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("gold");

  // Apply the saved theme AFTER mount (post-hydration), not via a pre-hydration
  // head script — mutating <html> before React hydrates causes a data-theme
  // mismatch error. Server + initial client render both have no data-theme, so
  // they match; the effect then applies it (a tiny flash for light/dark only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Theme | null;
      const next: Theme = saved === "light" || saved === "dark" ? saved : "gold";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(next);
      if (next === "gold") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", next);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
    if (t === "gold") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  };

  return { theme, setTheme };
}
