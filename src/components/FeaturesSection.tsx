"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NAV_ITEMS = ["Wallet", "Models", "Self-Evolution", "Social"] as const;

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
    heading: "Every action has a price tag. Franklin pays it.",
    description:
      "USDC micropayments via the x402 protocol. No API keys, no credit cards, no accounts. Fund your wallet and go. Every cent is tracked, every model call is logged, every dollar is visible.",
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
    id: "smart-routing",
    navLabel: "Models",
    heading: "55+ models. One endpoint. Smart routing picks the cheapest one.",
    description:
      "GPT-5, Claude, Gemini, DeepSeek, Grok, Llama, and 50 more — all through one gateway. Franklin scores every request on 15 dimensions and routes to the cheapest model that can handle it. Average savings: 89% vs Claude Opus.",
    terminalLines: [
      "$ franklin --trust -m auto",
      "  Router: SIMPLE → gemini-2.5-flash (91% savings)",
      "",
      "  ❯ explain this function",
      "  Using gemini-2.5-flash — $0.0003",
      "",
      "  ❯ refactor with full test coverage",
      "  Router: COMPLEX → claude-opus-4.6",
      "  Using claude-opus-4.6 — $0.0180",
    ],
    cards: [
      {
        title: "15-Dimension Request Scoring",
        description:
          "Token count, code detection, reasoning complexity, agentic patterns, multi-step tasks. Each request is classified into Simple, Medium, Complex, or Reasoning tiers.",
      },
      {
        title: "Three Routing Profiles",
        description:
          "Auto (balanced cost/quality), Eco (cheapest possible), Premium (most capable). Switch with `/model auto`, `/model eco`, or `/model premium`.",
      },
      {
        title: "Free Tier Always Available",
        description:
          "NVIDIA Nemotron and community models are free forever. Start coding without funding your wallet. Upgrade when you need premium models.",
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
    id: "social-growth",
    navLabel: "Social",
    heading: "Find posts. Draft replies. Grow your audience.",
    description:
      "Built-in X/Twitter marketing. Franklin searches for relevant posts, suggests replies with links, and lets you decide what to send. Pre-key dedup, daily caps, natural tone — all configurable.",
    terminalLines: [
      "❯ find posts about ai agents on X",
      "",
      "  1. @dev_sarah: \"Need an AI agent that can pay APIs\"",
      "     🔗 x.com/dev_sarah/status/123...",
      "     → \"We built this — Franklin pays with USDC\"",
      "",
      "  2. @crypto_builder: \"x402 protocol is interesting\"",
      "     🔗 x.com/crypto_builder/status/456...",
      "     → \"Yeah, it's our payment layer\"",
      "",
      "  Reply to any? Give me the number.",
    ],
    cards: [
      {
        title: "Human-in-the-Loop",
        description:
          "Franklin suggests, you decide. Every reply draft is shown with the original post link. Pick a number to send, or skip. Never auto-posts without your approval.",
      },
      {
        title: "Smart Dedup & Rate Limiting",
        description:
          "Pre-key hashing skips posts you've already seen — before spending LLM tokens. Daily caps and minimum delays prevent spam.",
      },
      {
        title: "Conversational Setup",
        description:
          "No JSON config files. Tell Franklin your handle, your product, your keywords. It writes the config for you.",
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
