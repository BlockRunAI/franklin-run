"use client";

import { useState } from "react";
import { PlusIcon } from "./icons";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How is this different from Claude Code or Cursor?",
    a: "They write great code. They can't spend money. They can't buy trading data, purchase API calls, pay for image generation, or settle a web-search bill. Franklin can — because it holds a USDC wallet and pays per action via x402. Coding intelligence is table stakes; economic autonomy is the category.",
  },
  {
    q: 'What does "an agent with a wallet" actually mean?',
    a: "Franklin holds USDC on Base or Solana. When it needs a model, a data feed, or a service, it signs an EIP-712 micropayment and pays. You set a budget; Franklin enforces it. Every cent is tracked in real-time. No subscriptions, no API keys, no billing portals.",
  },
  {
    q: "What can Franklin spend on?",
    a: "55+ AI models (Claude, GPT, Gemini, Grok, DeepSeek, Kimi, etc.), image gen (DALL·E, Nano Banana, Grok Imagine), video gen, Exa neural web search, prediction-market data (Polymarket, Kalshi), X/Twitter intelligence, music gen. The Smart Router picks the best model per task — up to 89% savings vs always-Opus.",
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
    a: "Yes. Free NVIDIA models (Nemotron, Qwen3 Coder) work with no wallet, no USDC, no signup. Fund the wallet only when you want Sonnet, Opus, GPT, Gemini, Grok, or paid tools.",
  },
  {
    q: "Why Base and Solana?",
    a: "Fast finality, negligible fees, mature USDC support, and a real x402 ecosystem on both. You pick at setup and can switch anytime. Same wallet UX, same models, different rails.",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section className="light darker grain">
      <div className="top-rule" />
      <div className="inner">
        <div className="faq-grid">
          <div className="faq-left">
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">Inquiries</span>
            </div>
            <h2 className="faq-h">
              Questions,
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>answered</em>.
            </h2>
            <p className="faq-p">
              The autonomous economic agent model in plain English. No hedging.
            </p>
          </div>
          <div>
            {FAQS.map(({ q, a }, i) => {
              const open = openIdx === i;
              return (
                <div key={q} className={`faq-item${open ? " open" : ""}`}>
                  <button
                    type="button"
                    className="faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? -1 : i)}
                  >
                    <span className="faq-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-q">{q}</span>
                    <span className="faq-plus">
                      <PlusIcon className="h-3 w-3" />
                    </span>
                  </button>
                  <div className="faq-body">
                    <div>
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
