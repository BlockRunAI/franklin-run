import {
  LOCALE_META,
  blogPostUrl,
  blogIndexUrl,
  getPostsByLocale,
  isValidLocale,
} from "@/lib/blog";

const SITE_URL = "https://franklin.run";

function escape(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return new Response("not found", { status: 404 });
  }
  const posts = getPostsByLocale(locale);
  const lang = LOCALE_META[locale].htmlLang;
  const channelTitle =
    locale === "zh-CN"
      ? "Franklin 速递"
      : "Franklin Dispatches";
  const channelDescription =
    locale === "zh-CN"
      ? "智能体钱包、开源支付基建、为没有信用卡的开发者打开的前沿大模型入口。"
      : "Field notes on multi-model coding agents, wallet-native AI, and frontier models for the half of the world without a credit card.";

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}${blogPostUrl(locale, post.frontmatter.slug)}`;
      const pubDate = new Date(post.frontmatter.publishedAt).toUTCString();
      return `    <item>
      <title>${escape(post.frontmatter.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(post.frontmatter.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(channelTitle)}</title>
    <link>${SITE_URL}${blogIndexUrl(locale)}</link>
    <atom:link href="${SITE_URL}${blogIndexUrl(locale)}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(channelDescription)}</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=600",
    },
  });
}
