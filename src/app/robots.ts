import type { MetadataRoute } from "next";

/**
 * robots.txt — explicit AI crawler allowlist.
 *
 * Why explicit per-bot rules instead of just `User-Agent: *`?
 * - Some AI providers (Apple, Google AI Overviews) require an explicit allow
 *   on a separate user-agent before they index for AI surfaces.
 * - Explicit `Allow: /` for known AI bots signals you want to be cited.
 * - Helps when crawler operators inspect granular rules for analytics.
 *
 * Crawlers below are the ones currently powering ChatGPT, Claude, Perplexity,
 * Google AI Overviews, Gemini, Apple Intelligence, You.com, and a few others.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlerBots = [
    // OpenAI
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    // Anthropic
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    // Google
    "Google-Extended",
    "GoogleOther",
    // Apple
    "Applebot-Extended",
    // Perplexity
    "PerplexityBot",
    "Perplexity-User",
    // Meta
    "Meta-ExternalAgent",
    "FacebookBot",
    // Common Crawl (used by many AI labs)
    "CCBot",
    // You.com
    "YouBot",
    // Diffbot (used by some AI search)
    "Diffbot",
    // Cohere
    "cohere-ai",
    // ByteDance / Bytespider (used by ByteDance models incl. Seedance)
    "Bytespider",
    // DuckDuckGo (uses LLM-assisted answers)
    "DuckAssistBot",
    // Mistral
    "MistralAI-User",
  ];

  return {
    rules: [
      // Default — allow everything for everyone
      {
        userAgent: "*",
        allow: "/",
      },
      // Explicit per-AI-crawler allows. These are redundant with the wildcard
      // above but signal intent clearly to AI providers and help when their
      // crawl operators check for explicit grants on a per-bot basis.
      ...aiCrawlerBots.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
    ],
    sitemap: "https://franklin.run/sitemap.xml",
    host: "https://franklin.run",
  };
}
