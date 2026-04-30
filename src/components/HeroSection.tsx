"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon, GitHubIcon } from "./icons";
import { cdnUrl } from "@/lib/cdn";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

type DemoLine = { text: string; color: string };
type Demo = { prompt: string; response: DemoLine[] };

const INSTALL_CMD = "npm install -g @blockrun/franklin";

const DEMOS: Demo[] = [
  {
    prompt: "what's BTC looking like today?",
    response: [
      { text: "✓ TradingSignal  BTC", color: "#10b981" },
      {
        text: "  Price $71,056 (+2.3% 24h)  ·  RSI 53.2  ·  MACD bullish cross",
        color: "rgba(255,255,255,.75)",
      },
      {
        text: "  Bollinger mid-band  ·  Volatility 35.3% annualized",
        color: "rgba(255,255,255,.6)",
      },
      { text: "", color: "" },
      {
        text: "Signal: bullish momentum, breakout above $72K viable",
        color: "#c9a227",
      },
      { text: "2 calls · $0.0031 USDC", color: "rgba(255,255,255,.3)" },
    ],
  },
  {
    prompt: "generate a logo for my AI startup",
    response: [
      { text: "Using DALL·E via x402 micropayment…", color: "rgba(255,255,255,.55)" },
      {
        text: '✓ ImageGen  "minimalist AI logo, dark background"',
        color: "#10b981",
      },
      {
        text: "  Saved: generated-logo-1713052800.png (1024×1024)",
        color: "rgba(255,255,255,.55)",
      },
      { text: "", color: "" },
      { text: "1 call · $0.040 USDC", color: "rgba(255,255,255,.3)" },
    ],
  },
  {
    prompt: "refactor src/auth.ts to use the new jwt helper",
    response: [
      { text: "Router: CODING → kimi-k2.6", color: "rgba(255,255,255,.5)" },
      { text: "✓ Read   src/auth.ts                    $0.002", color: "#10b981" },
      { text: "✓ Read   src/lib/jwt.ts                 $0.001", color: "#10b981" },
      { text: "✓ Edit   src/auth.ts (-24 +31 lines)    $0.008", color: "#10b981" },
      { text: "✓ Bash   npm test                       $0.000", color: "#10b981" },
      { text: "  › 142 passing · 0 failing · 2.4s", color: "rgba(255,255,255,.6)" },
      { text: "", color: "" },
      { text: "Done in 18s · $0.011 USDC", color: "rgba(255,255,255,.3)" },
    ],
  },
  {
    prompt: "compare top 5 agent pricing models and save a note",
    response: [
      { text: "✓ WebSearch  ai agent pricing models", color: "#10b981" },
      { text: "✓ WebFetch   5 articles", color: "#10b981" },
      { text: "✓ Write      notes/agent-pricing.md", color: "#10b981" },
      { text: "", color: "" },
      {
        text: "Pattern: usage-based wins with power users.",
        color: "rgba(255,255,255,.75)",
      },
      {
        text: "Wallet-based billing is still whitespace.",
        color: "#c9a227",
      },
      { text: "", color: "" },
      { text: "4 calls · $0.012 USDC", color: "rgba(255,255,255,.3)" },
    ],
  },
  {
    prompt: "research Nvidia earnings and draft a 300-word brief",
    response: [
      { text: "Router: RESEARCH → gemini-2.5-pro", color: "rgba(255,255,255,.5)" },
      { text: "✓ WebSearch  nvidia q4 2025 earnings", color: "#10b981" },
      { text: "✓ WebFetch   4 sources + 1 filing", color: "#10b981" },
      { text: "✓ Write      notes/nvda-brief.md (312w)", color: "#10b981" },
      { text: "", color: "" },
      {
        text: "DC revenue ↑ 42% QoQ · guide beats · margin compression flagged",
        color: "rgba(255,255,255,.75)",
      },
      { text: "6 calls · $0.0094 USDC", color: "rgba(255,255,255,.3)" },
    ],
  },
];

function useTerminalDemo() {
  const [prompt, setPrompt] = useState("");
  const [responseLines, setResponseLines] = useState<DemoLine[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    let demoIdx = 0;
    let charIdx = 0;
    let lineIdx = 0;
    let phase: "typing" | "response" | "hold" = "typing";

    const schedule = (ms: number) => {
      if (cancelled) return;
      timer.current = setTimeout(run, ms);
    };

    const run = () => {
      if (cancelled) return;
      const demo = DEMOS[demoIdx];
      if (phase === "typing") {
        if (charIdx < demo.prompt.length) {
          charIdx += 1;
          setPrompt(demo.prompt.slice(0, charIdx));
          schedule(45 + Math.random() * 35);
        } else {
          phase = "response";
          lineIdx = 0;
          setResponseLines([]);
          schedule(400);
        }
      } else if (phase === "response") {
        if (lineIdx < demo.response.length) {
          const line = demo.response[lineIdx];
          setResponseLines((prev) => [...prev, line]);
          lineIdx += 1;
          schedule(90);
        } else {
          phase = "hold";
          schedule(3200);
        }
      } else {
        demoIdx = (demoIdx + 1) % DEMOS.length;
        charIdx = 0;
        lineIdx = 0;
        phase = "typing";
        setPrompt("");
        setResponseLines([]);
        schedule(120);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { prompt, responseLines };
}

function InstallBox({ ariaLabel }: { ariaLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(INSTALL_CMD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="install-box">
      <span className="sigil">$</span>
      <code>{INSTALL_CMD}</code>
      <button type="button" aria-label={ariaLabel} onClick={copy}>
        {copied ? (
          <CheckIcon className="h-[18px] w-[18px]" />
        ) : (
          <CopyIcon className="h-[18px] w-[18px]" />
        )}
      </button>
    </div>
  );
}

interface HeroSectionProps {
  dict?: HomeDict;
}

export function HeroSection({ dict = defaultDict }: HeroSectionProps) {
  const { prompt, responseLines } = useTerminalDemo();
  const h = dict.hero;

  return (
    <section className="hero grain-dark guilloche">
      <div className="hero-glow" />
      <div className="hero-portrait">
        <Image
          src={cdnUrl("/images/franklin-bill.jpg")}
          alt=""
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 55vw, 100vw"
          aria-hidden="true"
        />
      </div>

      <div className="corner corner-l">
        <div className="engraved">№ 1776 · Series 2026</div>
        <div className="rule" />
      </div>
      <div className="corner corner-r">
        <div className="engraved">One Hundred · USDC</div>
        <div className="rule" />
      </div>

      <div className="hero-wrap">
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="line" />
            <span className="engraved label">{h.eyebrow}</span>
          </div>

          <h1 className="hero-title">
            {h.titleLine1}
            <br />
            {h.titleLine2Pre}{" "}
            <em className="shimmer" style={{ fontStyle: "italic" }}>
              {h.titleLine2Em}
            </em>
            {h.titleLine2Post}
          </h1>

          <p className="hero-sub">
            {h.subPre}{" "}
            <em style={{ fontStyle: "italic" }}>{h.subEm}</em> {h.subPost}
          </p>

          <div className="hero-ctas">
            <a className="btn-primary lg" href="#get-started">
              {h.ctaPrimary}
            </a>
            <a
              className="btn-outline lg"
              href="https://github.com/blockrunai/franklin"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon className="h-4 w-4" />
              {h.ctaSecondary}
            </a>
          </div>

          <div className="install">
            <InstallBox ariaLabel={h.copyInstallAriaLabel} />
          </div>

          <div className="pill-row">
            <span>
              <span className="gold">YOPO</span> — {h.pillYopoSuffix}
            </span>
            <span className="sep">◆</span>
            <span>
              {h.pillUsdcBefore} <span className="white">Base</span> &amp;{" "}
              <span className="white">Solana</span>
            </span>
            <span className="sep">◆</span>
            <span>
              {h.pillX402Before} <span className="white">x402</span>
            </span>
          </div>

          <div className="terminal">
            <div className="term-titlebar">
              <span className="dot r" />
              <span className="dot y" />
              <span className="dot g" />
              <span className="term-path">~ franklin --trust</span>
              <span className="term-live">LIVE</span>
            </div>
            <div className="term-body">
              <div className="prompt-line">
                <span className="prompt-caret">❯ </span>
                <span className="prompt-text">{prompt}</span>
                <span className="caret" />
              </div>
              <div className="term-resp">
                {responseLines.map((line, idx) => (
                  <div
                    key={idx}
                    style={{
                      color: line.color || "rgba(255,255,255,.6)",
                    }}
                  >
                    {line.text || "\u00A0"}
                  </div>
                ))}
              </div>
            </div>
            <div className="term-statusbar">
              <span className="model">claude-opus-4.6</span>
              <span>·</span>
              <span className="cost">$4.80 USDC</span>
              <span>·</span>
              <span>{h.termAbort}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
