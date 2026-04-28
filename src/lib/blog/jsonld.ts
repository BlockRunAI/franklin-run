import type { Post, Locale } from "./index";
import { LOCALE_META, blogPostUrl } from "./index";
import { cdnUrl } from "@/lib/cdn";

const SITE_URL = "https://franklin.run";

function favicon(): string {
  const u = cdnUrl("/favicon.png");
  return u.startsWith("http") ? u : `${SITE_URL}${u}`;
}

/**
 * Build the BlogPosting (or Article) JSON-LD for a single post.
 *
 * Strengthens E-E-A-T signals AI search engines look for:
 * - explicit `Person` author (or Organization) with sameAs links
 * - `publisher` Organization referenced by @id matching root layout
 * - `inLanguage`, `dateModified`, `articleSection`, `keywords`, `wordCount`
 * - `mainEntityOfPage` matching canonical URL
 *
 * Sources for the spec used here:
 * - schema.org BlogPosting + Article
 * - Google E-E-A-T (Experience, Expertise, Authoritativeness, Trust) guidance
 * - llms.txt / GEO best practices for AI citation surfaces
 */
export function blogPostingJsonLd(post: Post, locale: Locale) {
  const url = SITE_URL + blogPostUrl(locale, post.frontmatter.slug);
  const ogImageUrl = `${url}/opengraph-image`;

  // Approximate word count (used by some AI surfaces as a quality signal)
  const wordCount = post.content.trim().split(/\s+/).length;

  // Author resolution. We support either a known org ("BlockRun") or a person
  // name in frontmatter. When it's a person, we render a Person schema with
  // sameAs links so AI surfaces can resolve the entity.
  const isOrgAuthor = !post.frontmatter.author ||
    post.frontmatter.author === "BlockRun";
  const author = isOrgAuthor
    ? {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "BlockRun",
        url: "https://blockrun.ai",
        sameAs: [
          "https://github.com/blockrunai",
          "https://x.com/BlockRunAI",
          "https://t.me/blockrunAI",
        ],
      }
    : {
        "@type": "Person",
        name: post.frontmatter.author,
        url: `${SITE_URL}/about`,
        worksFor: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "BlockRun",
          url: "https://blockrun.ai",
        },
      };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.frontmatter.title,
    alternativeHeadline: post.frontmatter.description,
    description: post.frontmatter.description,
    image: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    inLanguage: LOCALE_META[locale].htmlLang,
    isAccessibleForFree: true,
    datePublished: post.frontmatter.publishedAt,
    dateModified: post.frontmatter.updatedAt ?? post.frontmatter.publishedAt,
    wordCount,
    author,
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "BlockRun",
      url: "https://blockrun.ai",
      logo: {
        "@type": "ImageObject",
        url: favicon(),
        width: 256,
        height: 256,
      },
      sameAs: [
        "https://github.com/blockrunai",
        "https://x.com/BlockRunAI",
        "https://t.me/blockrunAI",
        "https://franklin.run",
      ],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: post.frontmatter.cat,
    keywords: post.frontmatter.tags?.join(", "),
    about: [
      {
        "@type": "Thing",
        name: "Franklin",
        url: SITE_URL,
      },
      {
        "@type": "SoftwareApplication",
        name: "@blockrun/franklin",
        applicationCategory: "DeveloperApplication",
      },
    ],
  };
}
