"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Settings, BookOpen, FileText, Globe, ArrowUpRight, Check, ChevronRight, Languages, Palette } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { useTryLang, TRY_LANGS } from "@/lib/try-i18n";
import { useTheme, type Theme } from "@/hooks/use-theme";

// Bottom-left settings menu (Doubao-style): language + theme as right-flyout
// submenus, then official site, docs, blog, GitHub — all in one gear menu.
export function MoreMenu() {
  const { t, lang, setLang } = useTryLang();
  const { theme, setTheme } = useTheme();
  const themeOptions: { id: Theme; label: string }[] = [
    { id: "gold", label: t.themeGold },
    { id: "light", label: t.themeLight },
    { id: "dark", label: t.themeDark },
  ];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="try-settings" ref={ref}>
      <button className="try-lang-btn" onClick={() => setOpen((o) => !o)} aria-label={t.settings} aria-expanded={open}>
        <Settings className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <div className="try-settings-menu" role="menu">
          {/* Language → right flyout */}
          <div className="try-sub">
            <button type="button" className="try-select-option try-sub-row">
              <Languages className="h-4 w-4" />
              <span className="try-select-option-label">{t.language}</span>
              <ChevronRight className="h-4 w-4 try-sub-caret" />
            </button>
            <div className="try-submenu">
              {TRY_LANGS.map((l) => {
                const active = l.id === lang;
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={`try-select-option${active ? " is-active" : ""}`}
                    onClick={() => {
                      setLang(l.id);
                      setOpen(false);
                    }}
                  >
                    <span className="try-select-option-label">{l.label}</span>
                    {active && <Check className="try-select-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme → right flyout */}
          <div className="try-sub">
            <button type="button" className="try-select-option try-sub-row">
              <Palette className="h-4 w-4" />
              <span className="try-select-option-label">{t.theme}</span>
              <ChevronRight className="h-4 w-4 try-sub-caret" />
            </button>
            <div className="try-submenu">
              {themeOptions.map((o) => {
                const active = o.id === theme;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`try-select-option${active ? " is-active" : ""}`}
                    onClick={() => setTheme(o.id)}
                  >
                    <span className="try-select-option-label">{o.label}</span>
                    {active && <Check className="try-select-check" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="try-select-divider" />
          <Link className="try-select-option" href="/about">
            <Globe className="h-4 w-4" />
            <span className="try-select-option-label">{t.officialSite}</span>
          </Link>
          <Link className="try-select-option" href="/docs">
            <BookOpen className="h-4 w-4" />
            <span className="try-select-option-label">{t.docs}</span>
          </Link>
          <Link className="try-select-option" href="/blog/en">
            <FileText className="h-4 w-4" />
            <span className="try-select-option-label">{t.blog}</span>
          </Link>
          <a className="try-select-option" href="https://github.com/blockrunai/franklin" target="_blank" rel="noreferrer">
            <GitHubIcon className="h-4 w-4" />
            <span className="try-select-option-label">GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5 try-select-ext" />
          </a>
        </div>
      )}
    </div>
  );
}
