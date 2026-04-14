"use client";

import { useRevealGroup } from "@/hooks/useReveal";

const cards = [
  {
    label: "I",
    title: "Your Data",
    description:
      "Wallet keys, session history, learnings — everything stays in ~/.blockrun/ on your machine. Zero telemetry, zero crash reporting. Nothing phones home.",
  },
  {
    label: "II",
    title: "Your Models",
    description:
      "55+ models from 12+ providers. No single vendor can raise prices, change terms, or cut you off. Switch providers with one command. Your wallet works with all of them.",
  },
  {
    label: "III",
    title: "Your Money",
    description:
      "Every cent tracked in real-time. Provider cost + 5% — no hidden margins, no bundled fees. You know exactly where your money goes. Always.",
  },
  {
    label: "IV",
    title: "Your Code",
    description:
      "Apache 2.0 licensed. BlockRun disappears tomorrow? Your wallet still has USDC and your code still runs. Fork it, self-host it, extend it.",
  },
];

export function OpenSourceSection() {
  const containerRef = useRevealGroup<HTMLElement>();

  return (
    <section
      id="open-source"
      ref={containerRef}
      className="fr-grain relative overflow-hidden bg-[#f4ebd9] text-[#0a0d12]"
    >
      {/* Engraved corner ornaments */}
      <div className="absolute left-8 top-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a0d12]/30 lg:block">
        The Commons
      </div>
      <div className="absolute right-8 top-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-[#0a0d12]/30 lg:block">
        Apache 2.0
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="fr-reveal flex items-center gap-3">
          <span className="h-px w-10 bg-[#c9a300]/70" />
          <span className="fr-engraved text-[#0a0d12]/55">Open Source</span>
        </div>

        <h2 className="fr-reveal fr-reveal-delay-1 mt-6 max-w-[900px] font-[family-name:var(--font-serif)] text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-[#0a0d12] sm:text-[3.5rem] lg:text-[5rem]">
          You own <em className="font-[family-name:var(--font-serif)] italic text-[#c9a300]">everything</em>.
        </h2>

        <p className="fr-reveal fr-reveal-delay-2 mt-7 max-w-[680px] text-[17px] leading-[1.7] text-[#0a0d12]/65">
          With closed-source AI tools, the vendor owns your usage data, your preferences,
          your history. They change terms, you accept. They raise prices, you pay. They
          go down, you stop. Franklin is Apache 2.0 and runs on your machine. Your agent,
          your wallet, your rules.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-px bg-[#0a0d12]/15 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className={`fr-reveal fr-reveal-delay-${i + 2} group relative bg-[#f4ebd9] p-8 transition-colors hover:bg-[#faf5e8]`}
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[#c9a300] transition-transform duration-500 group-hover:scale-x-100" />
              <div className="mb-5 flex items-baseline gap-3">
                <span className="fr-numeral text-[40px] text-[#c9a300]/80">
                  {card.label}
                </span>
                <div className="h-px flex-1 bg-[#0a0d12]/15" />
              </div>
              <h3 className="font-[family-name:var(--font-serif)] text-[24px] leading-[1.15] text-[#0a0d12]">
                {card.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#0a0d12]/65">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
