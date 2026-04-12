const cards = [
  {
    title: "Runs Locally",
    description:
      "Your machine, your data. Wallet keys, session history, learnings — everything stays in ~/.blockrun/. Nothing phones home.",
  },
  {
    title: "No Vendor Lock-in",
    description:
      "55+ models from every provider. Switch between Claude, GPT, Gemini, DeepSeek, or free models with one command. Your wallet works with all of them.",
  },
  {
    title: "Every Cent Tracked",
    description:
      "Real-time cost per call in the terminal. Daily trends, model breakdowns, savings vs Opus. Run `franklin panel` for a full localhost dashboard.",
  },
  {
    title: "Community Built",
    description:
      "Apache 2.0 licensed. Plugin SDK for custom workflows. MCP-native for extensibility. Contribute tools, models, or integrations.",
  },
];

export function OpenSourceSection() {
  return (
    <section id="open-source" className="bg-white text-[#0a0d12]">
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[#0a0d12]/50">
          Open Source
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-[#0a0d12] sm:text-[3.5rem] lg:text-[4.2rem]">
          Open source, always.
        </h2>

        <p className="mt-5 max-w-[640px] text-[16px] leading-7 text-[#0a0d12]/60">
          Franklin is fully open source under Apache 2.0. Audit every line, self-host,
          fork, extend. Your agent, your wallet, your rules.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title}>
              <h3 className="text-[18px] font-semibold text-[#0a0d12]">
                {card.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-[#0a0d12]/60">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
