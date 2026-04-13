"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = ["Wallet", "Smart Router", "Self-Evolution", "Tools & APIs"] as const;

interface FeatureCard {
  title: string;
  description: string;
}

interface FeatureSubSection {
  id: string;
  navLabel: string;
  heading: string;
  description: string;
  screenshot?: string;
  terminalLines?: string[];
  cards: FeatureCard[];
}

const FEATURE_DATA: FeatureSubSection[] = [
  {
    id: "wallet-powered",
    navLabel: "Wallet",
    heading: "No API keys. No setup. Just USDC and every model.",
    description:
      "One wallet unlocks 55+ models from every provider — forever. No API key management, no billing portals, no per-provider accounts. Fund with USDC and start using Claude, GPT, Gemini, Grok, DeepSeek, and more. Every cent is tracked, every call is logged.",
    screenshot: "/images/panel-overview.png",
    cards: [
      {
        title: "x402 Native Payments",
        description:
          "HTTP 402 Payment Required, handled automatically. Franklin signs payments from your wallet on every API call. No middleware, no billing portals.",
      },
      {
        title: "Dual Chain Support",
        description:
          "Base (EVM) and Solana wallets built in. Choose your chain at setup. Switch anytime. Same USDC, same models, different rails.",
      },
      {
        title: "Real-Time Cost Tracking",
        description:
          "Every call shows cost in the terminal. Session totals, daily trends, model breakdowns. Run `franklin panel` for a full dashboard.",
      },
    ],
  },
  {
    id: "smart-router",
    navLabel: "Smart Router",
    heading: "You don't pick models. Franklin picks for you.",
    description:
      "The Smart Router classifies every request — coding, trading, reasoning, research — and selects the model with the best quality-to-cost ratio. Every response shows which model was chosen, why, and how much you saved.",
    terminalLines: [
      "❯ refactor this auth module to use JWT",
      "  CODING → kimi-k2.5  ·  saved 84%",
      "",
      "❯ what's the BTC outlook for the week?",
      "  TRADING → grok-4-1-fast-reasoning  ·  saved 95%",
      "",
      "❯ prove that this algorithm is O(n log n)",
      "  REASONING → claude-sonnet-4.6",
    ],
    cards: [
      {
        title: "Four Routing Profiles",
        description:
          "Auto (best quality-to-cost ratio), Eco (cheapest possible), Premium (most capable), Free (NVIDIA models only). Switch anytime — the router adapts instantly.",
      },
      {
        title: "Learns From Your Usage",
        description:
          "If you keep retrying a model for coding tasks, Franklin adapts and picks a better one next time. Your router gets smarter the more you use it.",
      },
      {
        title: "Per-Session Cost Breakdown",
        description:
          "Run `/cost` to see exactly where your USDC went — model by model, category by category, with request counts and totals. No surprises.",
      },
    ],
  },
  {
    id: "self-evolution",
    navLabel: "Self-Evolution",
    heading: "Franklin learns your preferences. Gets smarter every session.",
    description:
      "Per-user self-evolution inspired by NousResearch. After each session, Franklin extracts your preferences — language, coding style, model choices, workflow patterns — and injects them into the next session. All data stays local.",
    screenshot: "/images/panel-learnings.png",
    cards: [
      {
        title: "Automatic Preference Extraction",
        description:
          "A cheap model analyzes your session trace after you exit. Language preference, coding conventions, communication style — all captured automatically.",
      },
      {
        title: "Confidence-Based Decay",
        description:
          "Learnings confirmed multiple times get higher confidence. Stale preferences decay after 30 days. Your agent stays current, not fossilized.",
      },
      {
        title: "One-Click Migration",
        description:
          "Coming from Claude Code? `franklin migrate` imports your sessions, MCP configs, project memories, and preferences in seconds.",
      },
    ],
  },
  {
    id: "tools-and-apis",
    navLabel: "Tools & APIs",
    heading: "Every premium API. One wallet to access them all.",
    description:
      "Trading data, image generation, web search, social automation — Franklin pays for premium tools and data the same way it pays for models. One USDC wallet replaces dozens of API keys and billing accounts.",
    terminalLines: [
      "❯ what's BTC looking like today?",
      "  TradingSignal · live price, RSI, MACD, Bollinger",
      "",
      "❯ generate a hero image for my landing page",
      "  ImageGen · DALL-E via x402  ·  $0.040",
      "",
      "❯ find X posts about ai agents and draft replies",
      "  SearchX · 8 results found  ·  3 drafts ready",
    ],
    cards: [
      {
        title: "Trading & Market Data",
        description:
          "Live prices, RSI, MACD, Bollinger bands, Fear & Greed — ask about any token. CoinGecko data computed locally, no separate API key needed.",
      },
      {
        title: "Image Generation & Search",
        description:
          "DALL-E, web search, research tools — all paid through x402 micropayments from the same USDC wallet. One balance covers everything.",
      },
      {
        title: "Social Automation",
        description:
          "Search X for relevant posts, draft contextual replies, post with your confirmation. Same wallet, same agent, no X API key required.",
      },
    ],
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        { rootMargin: "-30% 0px -50% 0px", threshold: 0 }
      );
      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-white text-[#0a0d12]">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative lg:flex lg:gap-20">
          {/* Sticky Sidebar Nav */}
          <nav className="hidden lg:block lg:w-[180px] lg:shrink-0">
            <div className="sticky top-28 flex flex-col gap-0 py-28">
              {NAV_ITEMS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => scrollToSection(i)}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[14px] font-semibold transition-colors"
                  style={{
                    color: activeIndex === i ? "#0a0d12" : "rgba(10, 13, 18, 0.36)",
                  }}
                >
                  <span
                    className="size-1.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: activeIndex === i ? "#0a0d12" : "transparent",
                    }}
                  />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1">
            {FEATURE_DATA.map((feature, i) => (
              <div
                key={feature.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className={`py-20 lg:py-28 ${i < FEATURE_DATA.length - 1 ? "border-b border-[#0a0d12]/8" : ""}`}
              >
                <h2 className="font-[family-name:var(--font-serif)] text-[2.4rem] leading-[1.05] tracking-[-0.03em] text-[#0a0d12] sm:text-[3rem] lg:text-[4.2rem] lg:leading-[1.05]">
                  {feature.heading}
                </h2>
                <p className="mt-5 max-w-[640px] text-[16px] leading-7 text-[#0a0d12]/60">
                  {feature.description}
                </p>

                {/* Screenshot or Terminal mockup */}
                {feature.screenshot ? (
                  <div className="relative mt-12 overflow-hidden rounded-xl border border-[#1e2130] shadow-2xl">
                    <Image
                      src={feature.screenshot}
                      alt=""
                      width={1280}
                      height={800}
                      className="block h-auto w-full"
                    />
                  </div>
                ) : feature.terminalLines ? (
                  <div className="relative mt-12 overflow-hidden rounded-xl border border-[#1e2130] bg-[#0a0d12] shadow-2xl">
                    <div className="flex items-center gap-2 border-b border-[#1e2130] px-4 py-3">
                      <span className="size-3 rounded-full bg-[#ff5f57]" />
                      <span className="size-3 rounded-full bg-[#febc2e]" />
                      <span className="size-3 rounded-full bg-[#28c840]" />
                      <span className="ml-3 text-[12px] text-white/30">franklin</span>
                    </div>
                    <pre className="p-6 font-mono text-[13px] leading-6 text-[#10b981]/90">
                      {feature.terminalLines.map((line, j) => (
                        <div key={j} className={line.startsWith("$") || line.startsWith("❯") ? "text-white/90" : ""}>{line || "\u00A0"}</div>
                      ))}
                    </pre>
                  </div>
                ) : null}

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                  {feature.cards.map((card) => (
                    <div key={card.title}>
                      <h3 className="text-[17px] font-semibold text-[#0a0d12]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-7 text-[#0a0d12]/60">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
