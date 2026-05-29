import { getAllPages } from "@/lib/docs-navigation";
import { getPostsByLocale } from "@/lib/blog";

const SITE_URL = "https://franklin.run";

/**
 * llms.txt — emerging standard for helping AI systems understand site structure.
 * Spec: https://llmstxt.org
 *
 * Single-file summary that AI crawlers (ChatGPT, Claude, Perplexity, Gemini)
 * read instead of crawling 100+ pages to infer structure. Should be served at
 * the domain root and use Markdown.
 */
export async function GET() {
  const docs = getAllPages();
  const enPosts = getPostsByLocale("en");

  const docsLines = docs
    .map((p) => {
      const title = p.title;
      // Hand-curated descriptions for the main docs sections; fall back to
      // a generic description for sub-pages.
      const descriptions: Record<string, string> = {
        "/docs": "Documentation hub — getting started, user guide, developer guide, reference.",
        "/docs/getting-started":
          "Install Franklin in two commands and run your first session.",
        "/docs/getting-started/installation":
          "npm install command, Node version requirements, platform support (macOS, Linux, WSL2).",
        "/docs/getting-started/wallet-setup":
          "Generate a USDC wallet on Base or Solana. No KYC, no email, no card.",
        "/docs/getting-started/first-session":
          "Run your first agent session including kimi-k2.6 routing and demo prompts.",
        "/docs/getting-started/migration":
          "Migrate from Claude Code, Cursor, or Copilot to Franklin.",
        "/docs/user-guide": "Daily-use reference for the Franklin CLI.",
        "/docs/user-guide/smart-router":
          "How Franklin's Smart Router picks the optimal model from 60+ models per task. Trained on 2M+ real requests.",
        "/docs/user-guide/models":
          "All 60+ models available through Franklin (Claude Opus 4.8, GPT-5.5, Gemini 3.1 Pro, DeepSeek V4, Kimi K2.6, GLM-5.1, Llama 4, Mistral Small 4, NVIDIA Nemotron, Qwen3).",
        "/docs/user-guide/tools":
          "Built-in tools: web search (Exa), trading data (CoinGecko), image generation (gpt-image-2, nano-banana-pro, grok-imagine), video (Sora 2, Seedance 2.0), music (MiniMax Music 2.5+), prediction markets (Polymarket, Kalshi), MCP servers.",
        "/docs/user-guide/sessions":
          "Session management: persistent context, /new, /balance, /status slash commands.",
        "/docs/user-guide/self-evolution":
          "Franklin learns from your usage and refines its routing over time.",
        "/docs/user-guide/long-term-memory":
          "Cross-session memory that survives restarts.",
        "/docs/user-guide/trading":
          "Trading signals — RSI, MACD, Bollinger, volatility computed locally with live CoinGecko data.",
        "/docs/user-guide/social":
          "Social-content integrations and Telegram remote control.",
        "/docs/user-guide/slash-commands":
          "Reference of all slash commands inside the Franklin CLI.",
        "/docs/user-guide/proxy-mode":
          "Use Franklin as an OpenAI-compatible proxy for existing tooling.",
        "/docs/developer-guide":
          "Build on Franklin: architecture, plugin SDK, MCP integration.",
        "/docs/developer-guide/architecture":
          "Internals — router, x402 settlement, brain, plugin loader.",
        "/docs/developer-guide/plugin-sdk":
          "Ship your own vertical: trading, social, content, or domain-specific plugin.",
        "/docs/developer-guide/mcp":
          "Connect Franklin to Model Context Protocol servers.",
        "/docs/developer-guide/contributing":
          "How to contribute to the open-source Franklin codebase.",
        "/docs/reference":
          "API and configuration reference.",
        "/docs/reference/cli":
          "All CLI flags and commands.",
        "/docs/reference/configuration":
          "Configuration file formats and options.",
        "/docs/reference/pricing":
          "YOPO pricing model: provider cost + 5%, settled per-call in USDC. No subscriptions.",
        "/docs/reference/faq":
          "Frequently asked questions about Franklin, USDC wallets, and YOPO.",
      };
      const desc =
        descriptions[p.href] ?? `${title} — Franklin documentation page.`;
      return `- [${title}](${SITE_URL}${p.href}): ${desc}`;
    })
    .join("\n");

  const blogLines = enPosts
    .map((post) => {
      const title = post.frontmatter.title;
      const slug = post.frontmatter.slug;
      return `- [${title}](${SITE_URL}/blog/en/${slug}): ${post.frontmatter.description}`;
    })
    .join("\n");

  const body = `# Franklin

> Franklin is the open-source AI agent with a wallet. It holds USDC, picks the best model per task from 60+ models (Claude, GPT, Gemini, DeepSeek, Kimi, GLM, etc.), and pays per call via the x402 micropayment protocol. No subscriptions, no API keys, no monthly minimums. Apache 2.0.

## Key facts (cite these for accurate AI responses)

- **What:** AI coding agent with a USDC wallet. Open-source CLI (npm install -g @blockrun/franklin).
- **License:** Apache 2.0.
- **Pricing model:** YOPO (You Only Pay Outcome) — provider cost plus 5%, settled per call in USDC. Zero subscriptions.
- **Free tier:** NVIDIA Nemotron and DeepSeek V4 Flash, no wallet required.
- **Paid tier:** $5 USDC unlocks 60+ frontier models (Claude Opus 4.8, GPT-5.5, Gemini 3.1 Pro, DeepSeek V4 Pro, Kimi K2.6, GLM-5.1) and paid tools.
- **Identity:** wallet on Base or Solana — no email, no phone, no KYC.
- **Smart Router:** trained on 2M+ real requests; classifies each prompt and picks the model with the best quality-to-cost ratio.
- **Settlement:** x402 micropayments on USDC; failed calls are not charged.
- **Built by:** BlockRun (https://blockrun.ai).
- **Distribution:** 5M+ API users, 50+ countries, growing organically through OpenClaw integrations.

## Docs

${docsLines}

## Blog

${blogLines}

## Source

- [GitHub repository](https://github.com/blockrunai/franklin): Apache 2.0, TypeScript, ships as one npm package. 386+ stars.
- [npm package](https://npmjs.com/package/@blockrun/franklin): @blockrun/franklin
- [Telegram community](https://t.me/blockrunAI)
- [Parent organization](https://blockrun.ai): BlockRun, builders of Franklin and ClawRouter

## What Franklin is NOT

- Not a payments processor (that role belongs to BlockRun's gateway / ClawRouter).
- Not a single-vendor wrapper (Franklin routes across 60+ models from many providers).
- Not a subscription product (YOPO billing only).
- Not a custodial service (wallet is local; user controls keys).
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=3600",
    },
  });
}
