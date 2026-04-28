import Link from "next/link";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/blog";

interface LocaleSwitcherProps {
  current: Locale;
  available: Locale[];
  hrefForLocale: (locale: Locale) => string;
}

export function LocaleSwitcher({
  current,
  available,
  hrefForLocale,
}: LocaleSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[rgba(10,13,18,0.5)]">
      <span>Read in:</span>
      {LOCALES.map((locale) => {
        const isActive = locale === current;
        const isAvailable = available.includes(locale);
        if (!isAvailable) {
          return (
            <span
              key={locale}
              className="opacity-30"
              title={`${LOCALE_META[locale].label} (coming soon)`}
            >
              {LOCALE_META[locale].nativeLabel}
            </span>
          );
        }
        return (
          <Link
            key={locale}
            href={hrefForLocale(locale)}
            className={
              isActive
                ? "border-b border-[var(--gold-dim)] pb-0.5 text-[var(--gold-dim)]"
                : "border-b border-transparent pb-0.5 transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            }
          >
            {LOCALE_META[locale].nativeLabel}
          </Link>
        );
      })}
    </div>
  );
}
