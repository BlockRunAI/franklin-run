"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRevealGroup } from "@/hooks/useReveal";

const NAV_ITEMS = ["The Wallet", "Trading", "Smart Router", "Learns You"] as const;

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
    id: "the-wallet",
    navLabel: "The Wallet",
    heading: "Software that can spend money.",
    description:
      "Claude Code writes code. Cursor writes code. Franklin writes code and buys what it needs to get the job done. It holds USDC on Base or Solana, picks the best model per task, purchases trading data, generates images, pays for web search — all autonomously from one wallet. You set a budget. Franklin runs it.",
    screenshot: "/images/panel-overview.png",
    cards: [
      {
        title: "Economic Autonomy",
        description:
          "Franklin doesn't just call APIs — it pays for them. Every model call, every data query, every image generation is a real USDC transaction signed from your wallet. No API keys, no billing portals, no accounts.",
      },
      {
        title: "Budget Caps, On-Chain",
        description:
          "Set a spending limit and Franklin enforces it. Every cent is tracked in real-time — per call, per session, per model. Run `franklin panel` for a full dashboard. No surprises.",
      },
      {
        title: "Base & Solana",
        description:
          "Choose your chain at setup. Switch anytime. Same USDC, same models, same capabilities — different rails. Non-custodial: your private keys never leave your machine.",
      },
    ],
  },
  {
    id: "trading",
    navLabel: "Trading",
    heading: "Buy data, make decisions, execute.",
    description:
      "This is where a wallet changes everything. Franklin purchases live market data, runs technical analysis, searches for alpha on X, and drafts trades — all in one session. The wallet isn't just for paying models. It's for buying the data and services that make the models useful.",
    terminalLines: [
      "❯ what's BTC looking like today?",
      "  TradingSignal · BTC $107,842 (+2.3%)  ·  RSI 62",
      "  Fear & Greed: 72 (Greed)  ·  Signal: Bullish",
      "",
      "❯ find X posts about BTC ETF flows this week",
      "  SearchX · 12 results  ·  $0.003",
      "",
      "❯ generate a chart of BTC vs ETH YTD",
      "  ImageGen · saved to ./btc-eth-ytd.png  ·  $0.040",
    ],
    cards: [
      {
        title: "Live Market Intelligence",
        description:
          "Prices, RSI, MACD, Bollinger bands, Fear & Greed — ask about any token. Franklin buys the data, runs the analysis, and gives you the signal. One prompt, not five browser tabs.",
      },
      {
        title: "Social Signal Detection",
        description:
          "Search X for sentiment, find KOL posts, draft contextual replies. Franklin pays for X/Twitter intelligence via the same wallet it uses for models. No separate X API key.",
      },
      {
        title: "Research + Image + Video + Search",
        description:
          "Exa neural web search, image generation (DALL-E, Grok Imagine, Nano Banana), video generation (Grok Imagine Video), and prediction market data from Polymarket and Kalshi. Franklin buys what it needs to answer your question completely.",
      },
    ],
  },
  {
    id: "smart-router",
    navLabel: "Smart Router",
    heading: "55+ models. It picks the right one.",
    description:
      "No single model is best at everything. Claude writes better code, Gemini handles longer context, DeepSeek costs 20x less for simple tasks. Franklin's Smart Router classifies every request and routes to the optimal model automatically — up to 89% savings vs always using Opus. Multi-provider redundancy means your work never stops because one provider has a bad day.",
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
        title: "Automatic Model Selection",
        description:
          "You don't pick the model. Franklin classifies your request (coding, reasoning, trading, research) and routes to the best model in under 1ms. 55+ models across 12+ providers.",
      },
      {
        title: "Adapts to You",
        description:
          "Override the router a few times, and it learns. Your routing gets personalized to how you work — not a generic one-size-fits-all algorithm.",
      },
      {
        title: "Never Goes Down",
        description:
          "Claude has an outage? Franklin routes to GPT. GPT is slow? Gemini. Your work doesn't stop because one provider has a bad day.",
      },
    ],
  },
  {
    id: "learns-you",
    navLabel: "Learns You",
    heading: "Gets smarter the more you use it.",
    description:
      "Claude Code forgets everything between sessions. Franklin doesn't. After each session, it extracts your preferences — language, coding style, model choices, workflow patterns — and injects them into the next one. Combined with the wallet, this means an agent that knows what you like and can pay for what you need.",
    screenshot: "/images/panel-learnings.png",
    cards: [
      {
        title: "Automatic, Not Manual",
        description:
          "You don't configure preferences in a settings file. Franklin observes how you work and captures patterns automatically. Language, coding style, model preferences, communication tone.",
      },
      {
        title: "Evolves, Not Fossilizes",
        description:
          "Learnings confirmed across sessions gain confidence. Stale preferences decay after 30 days. Your agent stays current with how you work today, not how you worked last month.",
      },
      {
        title: "One-Click Migration",
        description:
          "Coming from Claude Code? `franklin migrate` imports your sessions, MCP configs, project memories, and preferences in seconds. Start where you left off.",
      },
    ],
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const revealRef = useRevealGroup<HTMLElement>();

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
    <section ref={revealRef} className="fr-grain relative overflow-hidden bg-[#faf5e8] text-[#0a0d12]">
      {/* Section ornament — engraved banknote-style border at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0a0d12]/15 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative lg:flex lg:gap-20">
          {/* Sticky Sidebar Nav */}
          <nav className="hidden lg:block lg:w-[200px] lg:shrink-0">
            <div className="sticky top-28 py-28">
              <div className="fr-engraved mb-6 flex items-center gap-2 text-[#0a0d12]/40">
                <span className="h-px w-6 bg-[#c9a300]/60" />
                Contents
              </div>
              <div className="flex flex-col gap-0">
                {NAV_ITEMS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => scrollToSection(i)}
                    className="group relative flex items-baseline gap-4 py-3 text-left transition-colors"
                    style={{
                      color: activeIndex === i ? "#0a0d12" : "rgba(10, 13, 18, 0.36)",
                    }}
                  >
                    <span
                      className="font-mono text-[11px] tabular-nums transition-colors"
                      style={{
                        color: activeIndex === i ? "#c9a300" : "rgba(10, 13, 18, 0.25)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[14px] font-semibold">{label}</span>
                    <span
                      className="h-px w-4 self-center transition-all"
                      style={{
                        backgroundColor: activeIndex === i ? "#c9a300" : "transparent",
                        width: activeIndex === i ? "20px" : "8px",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-1">
            {FEATURE_DATA.map((feature, i) => (
              <div
                key={feature.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className={`relative py-20 lg:py-28 ${i < FEATURE_DATA.length - 1 ? "border-b border-[#0a0d12]/8" : ""}`}
              >
                {/* Chapter numeral — oversized, banknote-style */}
                <div className="fr-reveal mb-8 flex items-center gap-4">
                  <span className="fr-numeral text-[72px] text-[#c9a300]/90 lg:text-[96px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="fr-engraved text-[#0a0d12]/50">
                      {feature.navLabel}
                    </div>
                    <div className="mt-2 h-px w-full bg-gradient-to-r from-[#c9a300]/60 via-[#0a0d12]/10 to-transparent" />
                  </div>
                </div>

                <h2 className="fr-reveal fr-reveal-delay-1 font-[family-name:var(--font-serif)] text-[2.4rem] leading-[1.02] tracking-[-0.03em] text-[#0a0d12] sm:text-[3rem] lg:text-[4.4rem] lg:leading-[1.0]">
                  {feature.heading}
                </h2>
                <p className="fr-reveal fr-reveal-delay-2 mt-6 max-w-[680px] text-[17px] leading-[1.7] text-[#0a0d12]/65">
                  {feature.description}
                </p>

                {/* YOPO signature stamp — only on The Wallet feature */}
                {feature.id === "the-wallet" && (
                  <div className="fr-reveal fr-reveal-delay-3 mt-10 max-w-[640px]">
                    <div className="relative overflow-hidden rounded-[3px] border border-[#c9a300]/40 bg-gradient-to-br from-[#faf5e8] to-[#f4ebd9] p-7 shadow-[0_2px_0_0_rgba(201,163,0,0.15),0_20px_40px_-20px_rgba(10,13,18,0.2)]">
                      {/* Top + bottom hairline gold rules */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a300] to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9a300]/50 to-transparent" />
                      {/* Corner marks — banknote security feature */}
                      <span className="absolute left-3 top-3 font-mono text-[9px] tracking-[0.3em] text-[#c9a300]/70">◆</span>
                      <span className="absolute right-3 top-3 font-mono text-[9px] tracking-[0.3em] text-[#c9a300]/70">◆</span>
                      <span className="absolute left-3 bottom-3 font-mono text-[9px] tracking-[0.3em] text-[#c9a300]/70">◆</span>
                      <span className="absolute right-3 bottom-3 font-mono text-[9px] tracking-[0.3em] text-[#c9a300]/70">◆</span>

                      <div className="flex items-baseline gap-5">
                        <span className="fr-numeral fr-gold-shimmer text-[64px] font-medium leading-none">
                          YOPO
                        </span>
                        <div className="flex-1">
                          <div className="fr-engraved text-[#0a0d12]/70">
                            You Only Pay Outcome
                          </div>
                          <div className="mt-2 h-px w-full bg-[#0a0d12]/15" />
                          <p className="mt-3 text-[14px] leading-[1.65] text-[#0a0d12]/70">
                            Not for access. Not for trying.
                            Only for the work Franklin delivers.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Screenshot or Terminal mockup */}
                {feature.screenshot ? (
                  <div className="fr-reveal fr-reveal-delay-3 relative mt-12 overflow-hidden rounded-[3px] border border-[#0a0d12]/12 shadow-[0_30px_60px_-20px_rgba(10,13,18,0.3)]">
                    <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent" />
                    <Image
                      src={feature.screenshot}
                      alt=""
                      width={1280}
                      height={800}
                      className="block h-auto w-full"
                    />
                  </div>
                ) : feature.terminalLines ? (
                  <div className="fr-reveal fr-reveal-delay-3 relative mt-12 overflow-hidden rounded-[3px] border border-[#0a0d12]/15 bg-[#0a0d12] shadow-[0_30px_60px_-20px_rgba(10,13,18,0.4)]">
                    <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
                    <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#08090f] px-4 py-3">
                      <span className="size-2.5 rounded-full bg-[#ff5f57]/70" />
                      <span className="size-2.5 rounded-full bg-[#febc2e]/70" />
                      <span className="size-2.5 rounded-full bg-[#28c840]/70" />
                      <span className="ml-3 font-mono text-[11px] tracking-wider text-white/25">~ franklin</span>
                    </div>
                    <pre className="p-6 font-mono text-[13px] leading-6 text-[#10b981]/90">
                      {feature.terminalLines.map((line, j) => (
                        <div key={j} className={line.startsWith("$") || line.startsWith("❯") ? "text-white/90" : ""}>{line || "\u00A0"}</div>
                      ))}
                    </pre>
                  </div>
                ) : null}

                <div className="mt-14 grid grid-cols-1 gap-px bg-[#0a0d12]/10 sm:grid-cols-3">
                  {feature.cards.map((card, cardIdx) => (
                    <div
                      key={card.title}
                      className={`fr-reveal fr-reveal-delay-${cardIdx + 3} group relative bg-[#faf5e8] p-7 transition-all duration-500 hover:bg-[#f4ebd9]`}
                    >
                      {/* Gold hover accent */}
                      <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#c9a300] transition-transform duration-500 group-hover:scale-x-100" />
                      <div className="fr-engraved mb-4 text-[#c9a300]/80">
                        {String(cardIdx + 1).padStart(2, "0")}
                      </div>
                      <h3 className="font-[family-name:var(--font-serif)] text-[22px] leading-[1.2] text-[#0a0d12]">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[14px] leading-[1.7] text-[#0a0d12]/65">
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

      {/* Bottom rule */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#0a0d12]/15 to-transparent" />
    </section>
  );
}
