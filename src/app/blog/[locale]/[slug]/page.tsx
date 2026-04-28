import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogProse } from "@/components/blog/BlogProse";
import { LocaleSwitcher } from "@/components/blog/LocaleSwitcher";
import { PillarBadge } from "@/components/blog/PillarBadge";
import { MdxRenderer } from "@/components/blog/MdxRenderer";
import { HtmlLangSync } from "@/components/blog/HtmlLangSync";
import { InstallCTA } from "@/components/blog/InstallCTA";
import {
  LOCALES,
  LOCALE_META,
  blogPostUrl,
  getPost,
  getPostsByLocale,
  getTranslations,
  getCanonicalSlug,
  isValidLocale,
  isRTL,
  type Locale,
} from "@/lib/blog";
import { blogPostingJsonLd } from "@/lib/blog/jsonld";
import { cdnUrl } from "@/lib/cdn";

const SITE_URL = "https://franklin.run";

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const post of getPostsByLocale(locale)) {
      params.push({ locale, slug: post.frontmatter.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};

  const canonicalSlug = getCanonicalSlug(post);
  const translations = getTranslations(canonicalSlug);
  const url = `${SITE_URL}${blogPostUrl(locale, slug)}`;

  const languages: Record<string, string> = {};
  for (const [otherLocale, otherPost] of translations) {
    languages[LOCALE_META[otherLocale].htmlLang] =
      `${SITE_URL}${blogPostUrl(otherLocale, otherPost.frontmatter.slug)}`;
  }
  const enPost = translations.get("en");
  if (enPost) {
    languages["x-default"] = `${SITE_URL}${blogPostUrl(
      "en",
      enPost.frontmatter.slug,
    )}`;
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    keywords: post.frontmatter.tags,
    authors: post.frontmatter.author
      ? [{ name: post.frontmatter.author }]
      : undefined,
    alternates: {
      canonical: blogPostUrl(locale, slug),
      languages,
    },
    openGraph: {
      type: "article",
      url,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      locale: LOCALE_META[locale].htmlLang,
      siteName: "Franklin",
      publishedTime: post.frontmatter.publishedAt,
      modifiedTime:
        post.frontmatter.updatedAt ?? post.frontmatter.publishedAt,
      authors: post.frontmatter.author
        ? [post.frontmatter.author]
        : undefined,
      tags: post.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      site: "@BlockRunAI",
      creator: "@BlockRunAI",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

function formatDate(dateString: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const post = getPost(locale, slug);
  if (!post) notFound();

  const canonicalSlug = getCanonicalSlug(post);
  const translations = getTranslations(canonicalSlug);
  const availableLocales = Array.from(translations.keys());
  const isCJK = locale === "zh-CN" || locale === "ja" || locale === "ko";
  const rtl = isRTL(locale);
  const dir: "ltr" | "rtl" = rtl ? "rtl" : "ltr";

  const portraitUrl = cdnUrl(`/seo/blog/${locale}/${slug}-portrait.png`);
  const jsonLd = blogPostingJsonLd(post, locale);

  return (
    <>
      <HtmlLangSync lang={LOCALE_META[locale].htmlLang} dir={dir} />
      <Header variant="paper" />
      <main>
        <article>
          <section className="light grain" style={{ paddingTop: 64 }}>
            <div className="top-rule" />
            <div className="inner" style={{ maxWidth: 880 }}>
              <div style={{ paddingBottom: 32 }}>
                <div className="eyebrow" style={{ marginBottom: 24 }}>
                  <span className="line" />
                  <span className="engraved">
                    {LOCALE_META[locale].nativeLabel}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 24,
                  }}
                >
                  <PillarBadge
                    pillar={post.frontmatter.pillar}
                    locale={locale}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(10,13,18,0.5)",
                      alignSelf: "center",
                    }}
                  >
                    {formatDate(post.frontmatter.publishedAt, locale)} ·{" "}
                    {post.readingMinutes} min
                  </span>
                </div>

                <h1
                  className={isCJK ? "blog-title-cjk" : ""}
                  style={{
                    fontFamily: isCJK
                      ? "var(--font-serif-sc)"
                      : "var(--font-serif)",
                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                    lineHeight: 1.05,
                    letterSpacing: isCJK ? "-0.01em" : "-0.03em",
                    color: "var(--ink)",
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  {post.frontmatter.title}
                </h1>
                <p
                  style={{
                    marginTop: 24,
                    fontSize: 19,
                    lineHeight: 1.6,
                    color: "rgba(10,13,18,0.7)",
                    maxWidth: 720,
                    fontFamily: isCJK ? "var(--font-serif-sc)" : undefined,
                  }}
                >
                  {post.frontmatter.description}
                </p>
              </div>

              {/* Banknote portrait */}
              <div
                style={{
                  position: "relative",
                  margin: "16px 0 56px",
                  border: "1px solid rgba(201,162,39,0.4)",
                  borderRadius: 3,
                  overflow: "hidden",
                  background:
                    "linear-gradient(180deg, var(--paper-light) 0%, var(--paper) 100%)",
                  boxShadow:
                    "0 30px 60px -30px rgba(10,13,18,0.25), 0 2px 0 0 rgba(201,162,39,0.18)",
                  aspectRatio: "1200 / 630",
                }}
              >
                <Image
                  src={portraitUrl}
                  alt={post.frontmatter.title}
                  fill
                  sizes="(max-width: 880px) 100vw, 880px"
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              </div>

              <BlogProse locale={locale} dir={dir}>
                <MdxRenderer source={post.content} />
              </BlogProse>

              <InstallCTA locale={locale} />

              <hr style={{ margin: "56px 0 32px", border: 0, height: 1, background: "rgba(10,13,18,0.12)" }} />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  paddingBottom: 96,
                }}
              >
                <LocaleSwitcher
                  current={locale}
                  available={availableLocales}
                  hrefForLocale={(l) => {
                    const t = translations.get(l);
                    return t
                      ? blogPostUrl(l, t.frontmatter.slug)
                      : `/blog/${l}`;
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(10,13,18,0.5)",
                  }}
                >
                  {post.frontmatter.tags?.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bot-rule" />
          </section>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
      <Footer />
    </>
  );
}
