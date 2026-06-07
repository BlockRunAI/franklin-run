import type { HomeDict } from "./types";

/**
 * English — source of truth. All other locales translate from this.
 *
 * Translators: brand and protocol terms (Franklin, BlockRun, USDC, Base,
 * Solana, x402, YOPO, kimi-k2.6, etc.) stay verbatim. Code snippets and
 * slash commands are not in this dict — they are universal.
 */
export const en: HomeDict = {
  nav: {
    features: "Features",
    compare: "Compare",
    blog: "Blog",
    gallery: "Gallery",
    docs: "Docs",
    tryFranklin: "Try Franklin",
    github: "GitHub",
    getStarted: "Get Started",
  },

  hero: {
    eyebrow: "The Autonomous Economic Agent",
    titleLine1: "The AI agent",
    titleLine2Pre: "with a",
    titleLine2Em: "wallet",
    titleLine2Post: ".",
    subPre: "Other agents write code. Franklin writes code",
    subEm: "and spends money",
    subPost:
      "to get it done — models, data, images, search. You set the budget. It runs it.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Star on GitHub",
    copyInstallAriaLabel: "Copy install command",
    pillYopoSuffix: "You Only Pay Outcome",
    pillUsdcBefore: "USDC on",
    pillX402Before: "Native",
    termAbort: "esc to abort",
  },

  features: {
    eyebrow: "Four Chapters",
    titleTop: "What a wallet",
    titleEm: "changes",
    introPre: "Coding intelligence is table stakes. The difference is",
    introEm: "purchasing power",
    introPost:
      "— and the quiet discipline that comes with an agent that must balance its own books.",
    cards: [
      {
        label: "The Wallet",
        title: "Software that can spend money.",
        desc: "Franklin holds USDC on Base or Solana. When it needs a model, a data feed, or an image — it signs a payment and takes it. Non-custodial. Your keys stay on your machine. You set a cap; it enforces it.",
      },
      {
        label: "Trading",
        title: "Buy data. Read the tape. Decide.",
        desc: "Ask “how’s BTC looking?” and Franklin purchases live prices, computes RSI, MACD, Bollinger, and volatility locally, then returns a signal. One prompt. No five browser tabs, no API key spaghetti.",
      },
      {
        label: "Smart Router",
        title: "60+ models. It picks. You save.",
        desc: "No single model is best at everything. The router classifies every request and routes in under a millisecond. Trained on 2M+ real requests, continuously scored by Elo, adapts to your overrides. Up to 89% savings vs. always-Opus.",
      },
      {
        label: "Learns You",
        title: "Gets smarter each session.",
        desc: "Claude Code forgets between runs. Franklin extracts preferences — language, style, model choices, workflow — and injects them into the next session. Confirmed patterns gain confidence. Stale ones decay at 30 days.",
      },
    ],
  },

  getStarted: {
    eyebrow: "Pricing · Install · Fund",
    titlePre: "Pay for the",
    titleEm: "outcome",
    titleAfterEm: ",",
    titlePost: "nothing else.",
    yopoLabel: "You Only Pay Outcome · YOPO",
    yopoTitle: "Provider cost + 5%, signed per action.",
    yopoBody:
      "No subscription (you don’t pay for access). No pay-per-call (you don’t pay for failed tries). The wallet balance is the hard cap. When it hits zero, Franklin stops. That’s the whole pricing model.",
    steps: [
      {
        title: "Install",
        body: "One npm command. Node 20+. macOS, Linux, WSL.",
      },
      {
        title: "Run free",
        body: "Free NVIDIA Nemotron & DeepSeek V4 Flash out of the box. No wallet required.",
      },
      {
        title: "Fund ($5 is plenty)",
        body: "Generate a Base or Solana wallet. Send USDC. Unlock every frontier model.",
      },
      {
        title: "State an outcome",
        body: "Code, trade, research, generate — Franklin picks, pays, reports, stops.",
      },
    ],
    ctaInstall: "Install from npm",
    ctaGitHub: "View on GitHub",
    slashEyebrow: "Slash Commands · 18 built-in",
    slashDescs: [
      "Interactive picker or direct switch",
      "Read-only planning, then run",
      "Deep reasoning for hard problems",
      "Structured context compression",
      "Search the codebase",
      "Full-text across past sessions",
      "Inspect or restore any session",
      "Git workflow helpers",
      "One-shot review, bugfix, tests",
      "Session spend + address + balance",
      "Spend breakdowns and trends",
      "What Franklin has picked up",
    ],
  },

  compare: {
    eyebrow: "The Ledger",
    titleTop: "In a table,",
    titleBottom: "to be plain.",
    intro:
      "AI products sell access. Subscriptions hand you monthly guilt and rate limits. Pay-per-call bills you for every failed try. Franklin settles for the outcome — once, in USDC.",
    headers: {
      saas: "Subscription SaaS",
      ppc: "Pay-per-call API",
      franklin: "Franklin — YOPO",
    },
    rows: [
      {
        label: "You pay for",
        saas: "Access, whether used or not",
        ppc: "Every attempt, including dead-ends",
        franklin: "The outcome. Once.",
      },
      {
        label: "Monthly fee",
        saas: "$20 — $200",
        ppc: "$0, plus usage",
        franklin: "$0. Pay only what you spend.",
      },
      {
        label: "Rate limits",
        saas: "Yes. Tightens when you need it most.",
        ppc: "Per-key quotas, tiers",
        franklin: "None. Wallet balance is the only cap.",
      },
      {
        label: "Identity",
        saas: "Email + credit card",
        ppc: "Vendor account, API keys per model",
        franklin: "A wallet. No email, no KYC.",
      },
      {
        label: "Model choice",
        saas: "Single vendor",
        ppc: "You juggle 12 keys",
        franklin: "60+ models via one wallet · router decides.",
      },
      {
        label: "Provider outage",
        saas: "You’re stopped.",
        ppc: "You’re stopped.",
        franklin: "Routes to the next provider.",
      },
      {
        label: "Overdraft risk",
        saas: "Silent auto-renew",
        ppc: "Unbounded bill at month end",
        franklin: "None. Wallet empty ⇒ Franklin stops.",
      },
      {
        label: "Source",
        saas: "Closed",
        ppc: "Closed SDK",
        franklin: "Apache 2.0 · local-first.",
      },
    ],
  },

  openSource: {
    eyebrow: "The Commons · Apache 2.0",
    titleTop: "You own",
    titleEm: "everything",
    labels: [
      { k: "Your data", v: "~/.blockrun/" },
      { k: "Your wallet", v: "Private keys · local" },
      { k: "Your models", v: "60+ · switch in 1 cmd" },
      { k: "Your license", v: "Apache 2.0" },
      { k: "Your uptime", v: "Fork it. Self-host." },
    ],
    paragraphs: [
      "With closed AI tools, the vendor owns your usage data, your preferences, your history. They change terms — you accept. They raise prices — you pay. They go down — you stop.",
      "Franklin is Apache 2.0 and runs on your machine. Wallet keys, session history, learnings — everything sits in ~/.blockrun/. Zero telemetry. Nothing phones home.",
      "If BlockRun disappears tomorrow, your USDC stays in your wallet and your agent still runs. That’s the point.",
    ],
    smallParagraph:
      "Read every line: the entire agent loop, the 16 built-in tools, the plugin SDK, the x402 client, the router — it’s all in the repo. Audit it, fork it, ship your own vertical.",
  },

  blog: {
    eyebrow: "Dispatches",
    titleTop: "From the",
    titleEm: "bench",
    intro:
      "Notes on multi-model coding agents, wallet-native AI, and frontier models for developers without global credit cards.",
    allPosts: "All posts →",
  },

  faq: {
    eyebrow: "Inquiries",
    titleTop: "Questions,",
    titleEm: "answered",
    intro:
      "The autonomous economic agent model in plain English. No hedging.",
    items: [
      {
        q: "How is this different from Claude Code or Cursor?",
        a: "They write great code. They can't spend money. They can't buy trading data, purchase API calls, pay for image generation, or settle a web-search bill. Franklin can — because it holds a USDC wallet and pays per action via x402. Coding intelligence is table stakes; economic autonomy is the category.",
      },
      {
        q: "What does “an agent with a wallet” actually mean?",
        a: "Franklin holds USDC on Base or Solana. When it needs a model, a data feed, or a service, it signs an EIP-712 micropayment and pays. You set a budget; Franklin enforces it. Every cent is tracked in real-time. No subscriptions, no API keys, no billing portals.",
      },
      {
        q: "What can Franklin spend on?",
        a: "60+ AI models (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, etc.), image gen (GPT Image, Nano Banana, Grok Imagine), video gen, Exa neural web search, prediction-market data (Polymarket, Kalshi), X/Twitter intelligence, music gen. The Smart Router picks the best model per task — up to 89% savings vs always-Opus.",
      },
      {
        q: "How much does it cost?",
        a: "YOPO — You Only Pay Outcome. Provider cost + 5%, settled per call in USDC. Simple question: ~$0.001. Coding session: $0.02–$0.10. 30-minute deep session: $0.10–$0.50. No subscriptions, no monthly fees, no rate limits. Free NVIDIA models are always available at zero cost — no wallet needed.",
      },
      {
        q: "Does it really learn how I work?",
        a: "Yes. After each session Franklin extracts preferences — language, style, model choices, workflow — and injects them into the next run. Confirmed preferences gain confidence. Stale ones decay at 30 days. Run /learnings to see what it knows.",
      },
      {
        q: "Is my data private?",
        a: "Everything stays local in ~/.blockrun/. Session history, learnings, wallet keys — nothing phones home. Zero telemetry, zero crash reporting. Your private keys never leave your machine. The code is Apache 2.0 — audit every line.",
      },
      {
        q: "Can I use it for free?",
        a: "Yes. Free NVIDIA models (Nemotron, DeepSeek V4 Flash) work with no wallet, no USDC, no signup. Fund the wallet only when you want Sonnet, Opus, GPT, Gemini, Grok, or paid tools.",
      },
      {
        q: "Why Base and Solana?",
        a: "Fast finality, negligible fees, mature USDC support, and a real x402 ecosystem on both. You pick at setup and can switch anytime. Same wallet UX, same models, different rails.",
      },
    ],
  },

  footer: {
    tagline:
      "The AI agent with a wallet. It holds your USDC and spends it toward outcomes. Apache 2.0.",
    aboutPre: "A",
    aboutLink: "BlockRun.ai",
    aboutPost: "product. Powered by the x402 micropayment protocol.",
    ctaGetStarted: "Get Started",
    colProduct: "Product",
    colResources: "Resources",
    colCommunity: "Community",
    linkFeatures: "Features",
    linkCompare: "Compare",
    linkGetStarted: "Get Started",
    linkNpm: "npm",
    linkDocs: "Documentation",
    linkBlog: "Blog",
    linkGallery: "Gallery",
    linkGateway: "BlockRun Gateway",
    linkX402: "x402 Protocol",
    linkGitHub: "GitHub",
    linkX: "X / Twitter",
    linkTelegram: "Telegram",
    copyright: "© 2026 BlockRun.ai. All rights reserved.",
    bottomRight: "The autonomous economic agent by BlockRun.ai",
  },

  localeSwitcherLabel: "Read in:",

  meta: {
    title: "Franklin — The AI Agent with a Wallet",
    description:
      "The AI agent with a wallet. It holds your USDC and spends it for you — 60+ models, trading data, image generation, video generation, web search. One wallet, no API keys. Open source.",
    ogTitle: "Franklin — The AI Agent with a Wallet",
    ogDescription:
      "Other agents write code. Franklin writes code and spends money to get things done. 60+ models, trading data, image gen, web search — one USDC wallet. Open source.",
    twitterTitle: "Franklin — The AI Agent with a Wallet",
    twitterDescription:
      "The AI agent with a wallet. 60+ models, trading data, image gen — it holds your USDC and spends it for you. Open source.",
  },
};
