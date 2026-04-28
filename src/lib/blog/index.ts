import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

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

export const PILLARS = {
  "agent-wallet": {
    label: "Agent + Wallet",
    labelZh: "智能体钱包",
  },
  "multi-model": {
    label: "Multi-Model",
    labelZh: "多模型",
  },
  "frontier-underbanked": {
    label: "Underbanked",
    labelZh: "无信用卡市场",
  },
  "field-notes": {
    label: "Field Notes",
    labelZh: "实战日志",
  },
} as const;
export type Pillar = keyof typeof PILLARS;

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

export interface PostFrontmatter {
  title: string;
  description: string;
  slug: string;
  locale: Locale;
  pillar: Pillar;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  translationOf?: string;
  heroPrompt?: string;
  heroSeed?: number;
  tags?: string[];
  featured?: boolean;
  lead?: boolean;
  /** Optional punchier blurb shown on the homepage BlogSection lead card.
   *  Falls back to `description` (used for SEO meta) when not set. */
  leadBlurb?: string;
  num?: string;
  cat?: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingMinutes: number;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "blog");

function localeDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale);
}

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

function parseFile(filepath: string, locale: Locale): Post | null {
  let raw: string;
  try {
    raw = fs.readFileSync(filepath, "utf-8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const frontmatter: PostFrontmatter = {
    title: data.title,
    description: data.description,
    slug: data.slug,
    locale,
    pillar: data.pillar,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    author: data.author,
    translationOf: data.translationOf,
    heroPrompt: data.heroPrompt,
    heroSeed: data.heroSeed,
    tags: data.tags ?? [],
    featured: data.featured ?? false,
    lead: data.lead ?? false,
    num: data.num,
    cat: data.cat,
  };
  const stats = readingTime(content);
  return {
    frontmatter,
    content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

export function getPost(locale: Locale, slug: string): Post | null {
  const filepath = path.join(localeDir(locale), `${slug}.mdx`);
  return parseFile(filepath, locale);
}

export function getPostsByLocale(locale: Locale): Post[] {
  const dir = localeDir(locale);
  return safeReadDir(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseFile(path.join(dir, f), locale))
    .filter((p): p is Post => p !== null)
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    );
}

export function getAllPosts(): Post[] {
  return LOCALES.flatMap((locale) => getPostsByLocale(locale));
}

/**
 * Returns the full translation set for a slug — every locale that has a post
 * with this canonical slug (matching either slug==canonical for EN or
 * translationOf==canonical for non-EN). Used for hreflang alternates.
 */
export function getTranslations(canonicalSlug: string): Map<Locale, Post> {
  const map = new Map<Locale, Post>();
  for (const locale of LOCALES) {
    const post = getPost(locale, canonicalSlug);
    if (post) {
      const isCanonical =
        locale === "en" || post.frontmatter.translationOf === canonicalSlug;
      const isAlias =
        post.frontmatter.translationOf === canonicalSlug ||
        post.frontmatter.slug === canonicalSlug;
      if (isCanonical || isAlias) {
        map.set(locale, post);
      }
    }
  }
  return map;
}

export function getCanonicalSlug(post: Post): string {
  return post.frontmatter.translationOf ?? post.frontmatter.slug;
}

export function getFeaturedPosts(locale: Locale, limit = 5): Post[] {
  return getPostsByLocale(locale)
    .filter((p) => p.frontmatter.featured)
    .slice(0, limit);
}

export function blogPostUrl(locale: Locale, slug: string): string {
  return `/blog/${locale}/${slug}`;
}

export function blogIndexUrl(locale: Locale): string {
  return `/blog/${locale}`;
}
