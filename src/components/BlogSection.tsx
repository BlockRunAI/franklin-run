import Link from "next/link";
import {
  blogIndexUrl,
  blogPostUrl,
  getFeaturedPosts,
  PILLARS,
  LOCALE_META,
  type Locale,
} from "@/lib/blog";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

function formatLocaleDate(iso: string, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface BlogSectionProps {
  dict?: HomeDict;
  locale?: Locale;
}

export function BlogSection({ dict = defaultDict, locale = "en" }: BlogSectionProps) {
  // Prefer the user's locale; fall back to English when no posts have been
  // translated for that locale yet (so the section never renders empty).
  let posts = getFeaturedPosts(locale, 5);
  let postLocale: Locale = locale;
  if (posts.length === 0 && locale !== "en") {
    posts = getFeaturedPosts("en", 5);
    postLocale = "en";
  }
  const b = dict.blog;

  return (
    <section id="blog" className="light grain">
      <div className="top-rule" />
      <div className="inner">
        <div className="blog-head">
          <div>
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">{b.eyebrow}</span>
            </div>
            <h2 className="section-h">
              {b.titleTop}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>
                {b.titleEm}
              </em>
              .
            </h2>
          </div>
          <div className="right">
            <p className="intro">{b.intro}</p>
            <Link className="blog-all" href={blogIndexUrl(postLocale)}>
              {b.allPosts}
            </Link>
          </div>
        </div>

        <div className="blog-grid">
          {posts.map((post, i) => {
            const num =
              post.frontmatter.num ?? `№ ${String(i + 1).padStart(2, "0")}`;
            const cat =
              post.frontmatter.cat ??
              PILLARS[post.frontmatter.pillar].label;
            const lead = post.frontmatter.lead || i === 0;
            return (
              <Link
                key={post.frontmatter.slug}
                href={blogPostUrl(postLocale, post.frontmatter.slug)}
                className={`post${lead ? " lead" : ""}`}
              >
                <div className="post-meta">
                  <span className="cat">{cat}</span>
                  <span className="dot" />
                  <span>{formatLocaleDate(post.frontmatter.publishedAt, postLocale)}</span>
                  {lead ? (
                    <>
                      <span className="dot" />
                      <span>{post.readingMinutes} min</span>
                    </>
                  ) : null}
                </div>
                <div className="post-num">{num}</div>
                <h3>{post.frontmatter.title}</h3>
                <p>{post.frontmatter.description}</p>
                <div className="post-foot">
                  <span>
                    {lead
                      ? post.frontmatter.author
                      : `${post.readingMinutes} min`}
                  </span>
                  <span className="read">Read</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="bot-rule" />
    </section>
  );
}
