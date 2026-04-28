import Link from "next/link";
import type { Post, Locale } from "@/lib/blog";
import { blogPostUrl, PILLARS, LOCALE_META } from "@/lib/blog";
import { PillarBadge } from "./PillarBadge";

interface PostCardProps {
  post: Post;
  locale: Locale;
  index: number;
  lead?: boolean;
}

function formatDate(dateString: string, locale: Locale): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(LOCALE_META[locale].htmlLang, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function PostCard({ post, locale, index, lead }: PostCardProps) {
  const num = post.frontmatter.num ?? `№ ${String(index + 1).padStart(2, "0")}`;
  const cat =
    post.frontmatter.cat ?? PILLARS[post.frontmatter.pillar].label;
  return (
    <Link
      href={blogPostUrl(locale, post.frontmatter.slug)}
      className={`post${lead ? " lead" : ""}`}
    >
      <div className="post-meta">
        <span className="cat">{cat}</span>
        <span className="dot" />
        <span>{formatDate(post.frontmatter.publishedAt, locale)}</span>
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
}

export { PillarBadge };
