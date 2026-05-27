"use client";

import { useEffect, useState } from "react";

export type Theme = "gold" | "light" | "dark";
const KEY = "franklin-theme";

// Theme switch for /try. "gold" is the default warm palette (no data-theme);
// "light"/"dark" set data-theme on <html>. Persisted in localStorage; the
// no-flash script in layout.tsx applies it before paint on reload.
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("gold");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Theme | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "light" || saved === "dark" || saved === "gold") setThemeState(saved);
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
