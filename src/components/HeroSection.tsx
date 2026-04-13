"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Typing animation demos ─────────────────────────────────────────────

const DEMOS = [
  {
    prompt: "what's BTC looking like today?",
    response: [
      { text: "BTC/USD: $107,842 (+2.3%)", color: "text-[#10b981]" },
      { text: "24h Volume: $48.2B", color: "text-white/70" },
      { text: "Fear & Greed: 72 (Greed)", color: "text-[#ffd700]" },
      { text: "Signal: Bullish momentum, RSI at 62", color: "text-white/60" },
      { text: "", color: "" },
      { text: "3 calls  ·  $0.0012", color: "text-white/30" },
    ],
  },
  {
    prompt: "find X posts about ai agents",
    response: [
      { text: "1. @dev_sarah: \"Need an AI agent that can pay APIs\"", color: "text-white/80" },
      { text: "   🔗 x.com/dev_sarah/status/123456", color: "text-[#60a5fa]" },
      { text: "   → \"We built this — Franklin pays with USDC\"", color: "text-[#10b981]" },
      { text: "", color: "" },
      { text: "2. @builder_dao: \"x402 protocol looks promising\"", color: "text-white/80" },
      { text: "   🔗 x.com/builder_dao/status/789012", color: "text-[#60a5fa]" },
      { text: "   → \"It's our payment layer for agents\"", color: "text-[#10b981]" },
      { text: "", color: "" },
      { text: "Reply to any? Give me the number.", color: "text-white/50" },
    ],
  },
  {
    prompt: "generate a hero image for my landing page",
    response: [
      { text: "Using DALL-E via x402 micropayment...", color: "text-white/50" },
      { text: "✓ Image generated — saved to ./hero.png", color: "text-[#10b981]" },
      { text: "  1024×1024, style: modern minimal", color: "text-white/50" },
      { text: "", color: "" },
      { text: "1 call  ·  $0.040", color: "text-white/30" },
    ],
  },
  {
    prompt: "refactor this file with full test coverage",
    response: [
      { text: "Router: COMPLEX → claude-opus-4.6", color: "text-white/50" },
      { text: "Reading src/agent/loop.ts...", color: "text-white/40" },
      { text: "✓ Refactored: extracted 3 functions, added types", color: "text-[#10b981]" },
      { text: "✓ Tests: 12 cases, 100% branch coverage", color: "text-[#10b981]" },
      { text: "✓ Committed: \"refactor: extract token pipeline\"", color: "text-[#10b981]" },
      { text: "", color: "" },
      { text: "47,291 in / 8,104 out  ·  $0.0340", color: "text-white/30" },
    ],
  },
];

function TerminalDemo() {
  const [demoIdx, setDemoIdx] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "responding" | "pausing">("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const demo = DEMOS[demoIdx];
  const prompt = demo.prompt;

  useEffect(() => {
    if (phase === "typing") {
      if (typedChars < prompt.length) {
        timerRef.current = setTimeout(() => setTypedChars((c) => c + 1), 45 + Math.random() * 35);
      } else {
        // Done typing, start showing response
        timerRef.current = setTimeout(() => {
          setShowResponse(true);
          setPhase("responding");
          setVisibleLines(0);
        }, 400);
      }
    } else if (phase === "responding") {
      if (visibleLines < demo.response.length) {
        timerRef.current = setTimeout(() => setVisibleLines((l) => l + 1), 120);
      } else {
        timerRef.current = setTimeout(() => setPhase("pausing"), 0);
        timerRef.current = setTimeout(() => {
          setDemoIdx((i) => (i + 1) % DEMOS.length);
        }, 3000);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [phase, typedChars, visibleLines, prompt.length, demo.response.length]);

  // Reset on demo change
  useEffect(() => {
    const t = setTimeout(() => {
      setTypedChars(0);
      setShowResponse(false);
      setVisibleLines(0);
      setPhase("typing");
    }, 0);
    return () => clearTimeout(t);
  }, [demoIdx]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] shadow-2xl shadow-black/50">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#08090f] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[12px] text-white/25">franklin --trust</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-[11px] leading-relaxed sm:p-5 sm:text-[13px]" style={{ minHeight: 220 }}>
        {/* Prompt line */}
        <div className="flex items-center gap-0">
          <span className="text-[#10b981]">❯ </span>
          <span className="text-white/90">{prompt.slice(0, typedChars)}</span>
          <span className="ml-[1px] inline-block h-[16px] w-[8px] animate-pulse bg-white/60" />
        </div>

        {/* Response */}
        {showResponse && (
          <div className="mt-3 space-y-[2px]">
            {demo.response.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={line.color || "text-white/60"}>
                {line.text || "\u00A0"}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t border-white/6 px-4 py-2 font-mono text-[10px] text-white/25 sm:gap-4 sm:px-5 sm:text-[11px]">
        <span className="text-white/50">zai/glm-5.1</span>
        <span>·</span>
        <span className="text-[#10b981]/70">$4.80 USDC</span>
        <span>·</span>
        <span>esc to abort</span>
      </div>
    </div>
  );
}

// ─── Main Hero ──────────────────────────────────────────────────────────

const INSTALL_COMMAND = "npm install -g @blockrun/franklin";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative">
      <div className="relative min-h-screen overflow-hidden bg-[#05070b] text-white">
        {/* Franklin portrait — right side */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50%] overflow-hidden lg:block">
          <Image
            src="/images/franklin-bill.jpg"
            alt=""
            fill
            className="object-cover object-top opacity-50"
            sizes="50vw"
            style={{ filter: "brightness(1.4)" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070b] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05070b] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-[1320px] px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <div className="mx-auto max-w-[1120px]">
            {/* Text — left-aligned on desktop to give room for portrait */}
            <div className="text-center lg:text-left">
              <h1 className="font-[family-name:var(--font-serif)] text-[3.5rem] leading-[0.95] tracking-[-0.04em] text-white sm:text-[4rem] md:text-[5rem] lg:text-[6rem]">
                The AI agent with a{" "}
                <span className="text-[#FFD700]">wallet</span>.
              </h1>

              <p className="mx-auto mt-7 max-w-[720px] text-[16px] leading-7 text-white/60 sm:text-[17px] lg:mx-0 lg:max-w-[560px]">
                While others generate text, Franklin deploys capital. One wallet, every model,
                every paid API. Budgeted execution in USDC. No subscriptions. No API keys. No account.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex items-center justify-center gap-4 lg:justify-start">
                <a
                  href="#get-started"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-6 py-3 text-[14px] font-semibold text-[#0a0d12] transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
                >
                  Get Started Free
                </a>
                <a
                  href="https://github.com/BlockRunAI/franklin"
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/15 bg-white/5 px-6 py-3 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                  Star on GitHub
                </a>
              </div>

              {/* Install command */}
              <div className="mx-auto mt-8 max-w-[520px] lg:mx-0">
                <div className="flex items-center gap-3 rounded-[11px] border border-white/12 bg-white/5 px-4 py-2.5 text-[13px] backdrop-blur-sm">
                  <span className="select-none text-white/30">$</span>
                  <code className="flex-1 font-mono text-white/70">{INSTALL_COMMAND}</code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-white/30 transition-colors hover:text-white/70"
                    aria-label="Copy install command"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-5 text-[12px] text-white/30 lg:justify-start">
                <span>Payments on <span className="text-white/50">Base</span> &amp; <span className="text-white/50">Solana</span></span>
                <span>·</span>
                <span>Powered by <span className="text-white/50">x402</span></span>
                <span>·</span>
                <span><span className="text-white/50">Apache 2.0</span></span>
              </div>
            </div>

            {/* CLI Demo — the star of the show */}
            <div className="mx-auto mt-14 max-w-[780px]">
              <TerminalDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
