"use client";

import { useState } from "react";

const faqData = [
  {
    question: "What models does Franklin support?",
    answer:
      "55+ models from every major provider: Claude (Anthropic), GPT-5 (OpenAI), Gemini (Google), DeepSeek, Grok (xAI), Llama, Mistral, and more. Free models from NVIDIA are always available. Smart routing automatically picks the cheapest model that can handle your task.",
  },
  {
    question: "How does payment work?",
    answer:
      "Franklin uses the x402 micropayment protocol. You fund a USDC wallet on Base or Solana, and Franklin signs a payment for each API call. No subscriptions, no credit cards, no accounts. You only pay for what you use, and every cent is tracked in real-time.",
  },
  {
    question: "How is this different from Claude Code or Cursor?",
    answer:
      "Those are coding agents — they write code. Franklin is an economic agent — software with purchasing power. It holds a wallet, picks the best model per task, pays per action in USDC, and works across verticals: code, trading, research, social, ops. Smart routing saves ~89% vs Claude Opus. No API keys, no subscriptions, no vendor lock-in.",
  },
  {
    question: "Can I use it for free?",
    answer:
      "Yes. NVIDIA Nemotron and other community models are free forever. Run `franklin -m free` to use only free models. No wallet funding needed. Upgrade to premium models when you're ready.",
  },
  {
    question: "Is my data private?",
    answer:
      "Everything stays local in ~/.blockrun/ on your machine. Session history, learnings, wallet keys, MCP configs — nothing leaves your machine except the actual LLM API calls (which go to the model provider via BlockRun's gateway).",
  },
  {
    question: "Can I migrate from Claude Code?",
    answer:
      "Yes. Run `franklin migrate` to import your MCP server configs, session history, project memories, and CLAUDE.md preferences. One command, takes seconds. On first run, Franklin also auto-detects Claude Code and offers to migrate.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className="bg-[#f8f8f8] text-[#0a0d12]">
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[#0a0d12]/50">
          FAQ
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-[#0a0d12] sm:text-[3.5rem] lg:text-[4.2rem]">
          Questions & answers.
        </h2>

        <div className="mx-auto mt-16 max-w-[860px]">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`border-t border-[#0a0d12]/10${index === faqData.length - 1 ? " border-b" : ""}`}
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between py-6 text-left text-[17px] font-semibold text-[#0a0d12] transition-colors hover:text-[#0a0d12]/70"
              >
                {item.question}
                <span
                  className="ml-4 size-5 shrink-0 text-[#0a0d12]/30 transition-transform duration-300"
                  style={{
                    transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="10" y1="4" x2="10" y2="16" />
                    <line x1="4" y1="10" x2="16" y2="10" />
                  </svg>
                </span>
              </button>
              <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: openIndex === index ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 text-[15px] leading-7 text-[#0a0d12]/60">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
