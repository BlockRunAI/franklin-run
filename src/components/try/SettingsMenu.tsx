"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { useTryLang, TRY_LANGS } from "@/lib/try-i18n";

// Gear menu for /try settings — switches the interface language (en / zh / es).
export function SettingsMenu() {
  const { lang, setLang, t } = useTryLang();
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
      <button
        className="try-lang-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.language}
        aria-expanded={open}
      >
        <Languages className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <div className="try-settings-menu" role="menu">
          <div className="try-select-group">{t.language}</div>
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
      )}
    </div>
  );
}
