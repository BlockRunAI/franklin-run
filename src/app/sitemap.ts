import type { MetadataRoute } from "next";
import {
  LOCALES,
  LOCALE_META,
  blogIndexUrl,
  blogPostUrl,
  getAllPosts,
  getCanonicalSlug,
  getTranslations,
} from "@/lib/blog";
import { homeUrl } from "@/lib/home";
import { getAllPages } from "@/lib/docs-navigation";

const SITE_URL = "https://franklin.run";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Chat app — the product front door at /, standalone (not part of the
  // marketing-homepage hreflang cluster).
  entries.push({
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  });

  // Marketing home — emit one entry per locale with hreflang to all sibling
  // translations. English lives at /about (see homeUrl).
  const homeLanguages: Record<string, string> = {};
  for (const l of LOCALES) {
    homeLanguages[LOCALE_META[l].htmlLang] = `${SITE_URL}${homeUrl(l)}`;
  }
  homeLanguages["x-default"] = `${SITE_URL}${homeUrl("en")}`;
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}${homeUrl(locale)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: locale === "en" ? 1 : 0.9,
      alternates: { languages: homeLanguages },
    });
  }

  // Docs (English only for now)
  for (const page of getAllPages()) {
    entries.push({
      url: `${SITE_URL}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Blog locale indexes — with hreflang to other locale indexes
  const indexLanguages: Record<string, string> = {};
  for (const l of LOCALES) {
    indexLanguages[LOCALE_META[l].htmlLang] = `${SITE_URL}${blogIndexUrl(l)}`;
  }
  indexLanguages["x-default"] = `${SITE_URL}${blogIndexUrl("en")}`;
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}${blogIndexUrl(locale)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: indexLanguages },
    });
  }

  // Blog posts — emit one entry per (locale, slug) with hreflang to all
  // existing translations of that canonical slug.
  for (const post of getAllPosts()) {
    const canonicalSlug = getCanonicalSlug(post);
    const translations = getTranslations(canonicalSlug);
    const languages: Record<string, string> = {};
    for (const [otherLocale, otherPost] of translations) {
      languages[LOCALE_META[otherLocale].htmlLang] = `${SITE_URL}${blogPostUrl(
        otherLocale,
        otherPost.frontmatter.slug,
      )}`;
    }
    const enPost = translations.get("en");
    if (enPost) {
      languages["x-default"] = `${SITE_URL}${blogPostUrl(
        "en",
        enPost.frontmatter.slug,
      )}`;
    }
    entries.push({
      url: `${SITE_URL}${blogPostUrl(post.frontmatter.locale, post.frontmatter.slug)}`,
      lastModified: post.frontmatter.updatedAt
        ? new Date(post.frontmatter.updatedAt)
        : new Date(post.frontmatter.publishedAt),
      changeFrequency: "monthly",
      priority: 0.65,
      alternates: { languages },
    });
  }

  return entries;
}
