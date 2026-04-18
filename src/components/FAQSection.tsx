"use client";

import { useState } from "react";
import { useRevealGroup } from "@/hooks/useReveal";

const faqData = [
  {
    question: "How is this different from Claude Code or Cursor?",
    answer:
      "Claude Code and Cursor write great code — but they can't spend money. They can't buy trading data, purchase API calls, generate images, or pay for web search. Franklin can. It holds a USDC wallet, decides what's worth spending on, and executes. Coding intelligence is table stakes. Economic autonomy is the differentiator.",
  },
  {
    question: "What do you mean by 'an agent with a wallet'?",
    answer:
      "Franklin holds USDC on Base or Solana. When it needs a model, data, or service, it signs a micropayment and pays for it — automatically, via the x402 protocol. You set a budget, Franklin runs it. Every cent is tracked in real-time. No API keys, no subscriptions, no billing portals. One wallet, everything.",
  },
  {
    question: "What can Franklin spend money on?",
    answer:
      "55+ AI models from 12+ providers (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, and more), image generation (DALL-E, Nano Banana, Grok Imagine), video generation (Grok Imagine Video), Exa neural web search, prediction market data from Polymarket and Kalshi, X/Twitter intelligence, and music generation. The Smart Router picks the best model per task automatically — up to 89% savings vs always using Opus.",
  },
  {
    question: "How much does it cost?",
    answer:
      "YOPO — You Only Pay Outcome. Provider cost + 5%, settled per call in USDC. That's the entire pricing model. A simple question: $0.001. A coding session: $0.02-0.10. A full 30-minute session: $0.10-0.50. No subscriptions, no monthly fees, no rate limits. Free NVIDIA models are always available at zero cost — no wallet needed.",
  },
  {
    question: "Does it learn how I work?",
    answer:
      "Yes. After each session, Franklin extracts your preferences — language, coding style, model choices, workflow patterns — and injects them into the next session. Unlike Claude Code, which forgets everything, Franklin gets smarter over time. Confirmed preferences gain confidence; stale ones decay after 30 days.",
  },
  {
    question: "Is my data private?",
    answer:
      "Everything stays local in ~/.blockrun/ on your machine. Session history, learnings, wallet keys — nothing phones home. Zero telemetry, zero crash reporting. Your private keys never leave your machine. The code is Apache 2.0 — audit every line.",
  },
  {
    question: "Can I use it for free?",
    answer:
      "Yes. Free NVIDIA models are available with unlimited usage — no wallet, no USDC, no setup. Fund your wallet only when you want Franklin to access premium models and paid data sources.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRevealGroup<HTMLElement>();

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section
      ref={containerRef}
      className="fr-grain relative overflow-hidden bg-[#faf5e8] text-[#0a0d12]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0a0d12]/12 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-28">
        {/* Left: editorial header */}
        <div className="lg:col-span-4">
          <div className="fr-reveal flex items-center gap-3 lg:sticky lg:top-28">
            <span className="h-px w-10 bg-[#c9a300]/70" />
            <span className="fr-engraved text-[#0a0d12]/55">Inquiries</span>
          </div>

          <h2 className="fr-reveal fr-reveal-delay-1 mt-6 font-[family-name:var(--font-serif)] text-[2.6rem] leading-[0.95] tracking-[-0.03em] text-[#0a0d12] sm:text-[3.2rem] lg:text-[4rem]">
            Questions &amp;<br />
            <em className="italic text-[#c9a300]">answers</em>.
          </h2>

          <p className="fr-reveal fr-reveal-delay-2 mt-6 max-w-[380px] text-[15px] leading-[1.7] text-[#0a0d12]/60">
            Everything you want to know about Franklin, the wallet, and the autonomous
            economic agent model. Answered plainly.
          </p>
        </div>

        {/* Right: accordion */}
        <div className="mt-12 lg:col-span-8 lg:mt-0">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`fr-reveal fr-reveal-delay-${Math.min(index + 2, 6)} border-t border-[#0a0d12]/12 ${index === faqData.length - 1 ? "border-b" : ""}`}
              >
                <button
                  onClick={() => toggle(index)}
                  className="group flex w-full items-start gap-5 py-6 text-left transition-colors"
                >
                  <span className="mt-1 font-mono text-[11px] tabular-nums text-[#c9a300]/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-[family-name:var(--font-serif)] text-[22px] leading-[1.3] text-[#0a0d12] transition-colors group-hover:text-[#c9a300] sm:text-[24px]">
                    {item.question}
                  </span>
                  <span
                    className="ml-4 mt-2 inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-[#0a0d12]/20 text-[#0a0d12]/50 transition-all duration-300 group-hover:border-[#c9a300] group-hover:text-[#c9a300]"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      borderColor: isOpen ? "#c9a300" : undefined,
                      color: isOpen ? "#c9a300" : undefined,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="10" y1="4" x2="10" y2="16" />
                      <line x1="4" y1="10" x2="16" y2="10" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="ml-10 max-w-[640px] pb-7 text-[15px] leading-[1.8] text-[#0a0d12]/65">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
