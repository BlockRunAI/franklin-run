import Link from "next/link";
import {
  blogIndexUrl,
  blogPostUrl,
  getFeaturedPosts,
  PILLARS,
} from "@/lib/blog";

function formatEnDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BlogSection() {
  const localPosts = getFeaturedPosts("en", 5);
  return (
    <section id="blog" className="light grain">
      <div className="top-rule" />
      <div className="inner">
        <div className="blog-head">
          <div>
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">Dispatches</span>
            </div>
            <h2 className="section-h">
              From the
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>bench</em>.
            </h2>
          </div>
          <div className="right">
            <p className="intro">
              Notes on multi-model coding agents, wallet-native AI, and frontier
              models for developers without global credit cards.
            </p>
            <Link className="blog-all" href={blogIndexUrl("en")}>
              All posts →
            </Link>
          </div>
        </div>

        <div className="blog-grid">
          {localPosts.map((post, i) => {
            const num =
              post.frontmatter.num ?? `№ ${String(i + 1).padStart(2, "0")}`;
            const cat =
              post.frontmatter.cat ??
              PILLARS[post.frontmatter.pillar].label;
            const lead = post.frontmatter.lead || i === 0;
            return (
              <Link
                key={post.frontmatter.slug}
                href={blogPostUrl("en", post.frontmatter.slug)}
                className={`post${lead ? " lead" : ""}`}
              >
                <div className="post-meta">
                  <span className="cat">{cat}</span>
                  <span className="dot" />
                  <span>{formatEnDate(post.frontmatter.publishedAt)}</span>
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
