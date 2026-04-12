"use client";

import Image from "next/image";
import { useState } from "react";

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const SUPPORTED_CHAINS = [
  { name: "Base", icon: "&#9678;" },
  { name: "Solana", icon: "&#9672;" },
  { name: "x402", icon: "&#9733;" },
] as const;

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
      <div className="relative min-h-full overflow-hidden bg-[#05070b] text-white">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070b] via-[#0a1628] to-[#05070b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" />

        {/* Content container */}
        <div className="relative mx-auto max-w-[1320px] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
          {/* Text section */}
          <div className="mx-auto max-w-[1120px] text-center">
            {/* Heading */}
            <h1 className="font-[family-name:var(--font-serif)] text-[3.65rem] leading-[0.93] tracking-[-0.038em] text-white sm:text-[4rem] md:text-[5rem] lg:text-[6.4rem]">
              The AI agent with a{" "}
              <span className="text-[#FFD700]">wallet</span>.
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-7 max-w-[820px] text-[15px] leading-7 text-white/84 sm:text-[17px]">
              While others chat, Franklin spends. One wallet, 55+ models, every paid API.
              Pay per action in USDC on Base or Solana. No subscriptions.
              No API keys. No limits.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-5 py-3 text-[14px] font-semibold text-[#0a0d12] transition-colors hover:bg-white/90"
              >
                Get Started Free
              </a>
              <a
                href="https://github.com/BlockRunAI/franklin"
                className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/18 bg-black/16 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>

            {/* Install code block */}
            <div className="mx-auto mt-8 max-w-[720px]">
              <div className="flex items-center gap-3 rounded-[11px] border border-white/18 bg-black/16 px-4 py-2.5 text-[13px]">
                <span className="select-none text-white/50">$</span>
                <code className="flex-1 font-mono text-white/80">
                  {INSTALL_COMMAND}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-white/50 transition-colors hover:text-white"
                  aria-label="Copy install command"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            {/* Supported chains */}
            <div className="mt-8 flex items-center justify-center gap-6 text-[13px] text-white/50">
              <span>Payments on</span>
              {SUPPORTED_CHAINS.map((chain) => (
                <span
                  key={chain.name}
                  className="flex items-center gap-2 text-white/70"
                >
                  <span dangerouslySetInnerHTML={{ __html: chain.icon }} />
                  {chain.name}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image section */}
          <div className="mx-auto mt-12 max-w-[1320px]">
            <div className="relative overflow-hidden rounded-lg border border-white/14">
              <Image
                src="/images/landing-hero.png"
                alt="Franklin terminal — Ben Franklin portrait with FRANKLIN ASCII art banner"
                width={1214}
                height={818}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
