/**
 * Pure locale constants — no Node/fs imports, safe for client components.
 *
 * Both the blog lib (`@/lib/blog`) and the homepage dict lib (`@/lib/home`)
 * re-export from here. Putting fs-using helpers anywhere this file imports
 * would break Turbopack's client-bundle build, so keep this module data-only.
 */

export const LOCALES = [
  "en",
  "zh-CN",
  "ja",
  "ko",
  "ru",
  "id",
  "ar",
  "hi",
  "ur",
  "pt-BR",
  "vi",
  "tr",
  "fa",
] as const;
export type Locale = (typeof LOCALES)[number];

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar", "ur", "fa"]);

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const LOCALE_META: Record<
  Locale,
  { label: string; nativeLabel: string; htmlLang: string }
> = {
  en: { label: "English", nativeLabel: "English", htmlLang: "en" },
  "zh-CN": { label: "Chinese", nativeLabel: "中文", htmlLang: "zh-CN" },
  ja: { label: "Japanese", nativeLabel: "日本語", htmlLang: "ja" },
  ko: { label: "Korean", nativeLabel: "한국어", htmlLang: "ko" },
  ru: { label: "Russian", nativeLabel: "Русский", htmlLang: "ru" },
  id: { label: "Indonesian", nativeLabel: "Bahasa Indonesia", htmlLang: "id" },
  ar: { label: "Arabic", nativeLabel: "العربية", htmlLang: "ar" },
  hi: { label: "Hindi", nativeLabel: "हिन्दी", htmlLang: "hi" },
  ur: { label: "Urdu", nativeLabel: "اردو", htmlLang: "ur" },
  "pt-BR": {
    label: "Portuguese (BR)",
    nativeLabel: "Português",
    htmlLang: "pt-BR",
  },
  vi: { label: "Vietnamese", nativeLabel: "Tiếng Việt", htmlLang: "vi" },
  tr: { label: "Turkish", nativeLabel: "Türkçe", htmlLang: "tr" },
  fa: { label: "Persian", nativeLabel: "فارسی", htmlLang: "fa" },
};

/** Locales other than English. English lives at "/", others at "/<locale>". */
export const NON_DEFAULT_LOCALES: ReadonlyArray<Exclude<Locale, "en">> = LOCALES.filter(
  (l): l is Exclude<Locale, "en"> => l !== "en",
);

/** Canonical homepage URL for a locale. The English marketing homepage lives
 * at /about (the chat app now occupies /); other locales stay at /<locale>. */
export function homeUrl(locale: Locale): string {
  return locale === "en" ? "/about" : `/${locale}`;
}
