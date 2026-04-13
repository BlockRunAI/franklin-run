const steps = [
  {
    number: "01",
    title: "Install",
    description:
      "One npm command. Node 20+. Works on macOS, Linux, and WSL. No Docker, no server, no config files.",
  },
  {
    number: "02",
    title: "Create Wallet",
    description:
      "Run franklin setup base (or solana). A USDC wallet is auto-generated. Send USDC to fund it — or skip and use free models.",
  },
  {
    number: "03",
    title: "State an Outcome",
    description:
      "Run franklin --trust. Write code, research markets, draft social posts, generate images — Franklin picks the best model and pays per action from your wallet.",
  },
  {
    number: "04",
    title: "Watch It Learn",
    description:
      "Franklin learns your preferences across sessions. Run /learnings to see what it knows. Coming from Claude Code? Run franklin migrate to import everything.",
  },
] as const;

const stepBorderClasses = [
  "border-b border-white/10 sm:border-r lg:border-b-0",
  "border-b border-white/10 sm:border-r-0 lg:border-r lg:border-b-0",
  "border-b border-white/10 sm:border-r sm:border-b-0 lg:border-r",
  "",
] as const;

export function GettingStartedSection() {
  return (
    <section id="get-started" className="bg-[#05070b] text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-white/50">
          Get Started
        </p>

        <h2 className="mt-4 font-[family-name:var(--font-serif)] text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-[3.5rem] lg:text-[4.2rem]">
          Up and running in 60 seconds.
        </h2>

        <div className="mt-16 grid grid-cols-1 rounded-lg border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`p-8 ${stepBorderClasses[index]}`}
            >
              <span className="font-mono text-[13px] text-white/30">
                {step.number}
              </span>
              <h3 className="mt-4 text-[18px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-white/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4">
          <a
            href="https://www.npmjs.com/package/@blockrun/franklin"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-5 py-3 text-[14px] font-semibold text-[#0a0d12] transition-colors hover:bg-white/90"
          >
            Install from npm
          </a>
          <a
            href="https://github.com/BlockRunAI/franklin"
            className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-white/18 bg-black/16 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
