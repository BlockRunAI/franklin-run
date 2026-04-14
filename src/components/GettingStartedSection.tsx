"use client";

import { useRevealGroup } from "@/hooks/useReveal";

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
  const containerRef = useRevealGroup<HTMLElement>();

  return (
    <section
      id="get-started"
      ref={containerRef}
      className="fr-grain-dark relative overflow-hidden bg-[#05070b] text-white"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 30%, rgba(255, 215, 0, 0.06), transparent 60%)",
        }}
      />
      {/* Top gold rule */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1320px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="fr-reveal flex items-center gap-3">
          <span className="h-px w-10 bg-[#FFD700]/50" />
          <span className="fr-engraved text-[#FFD700]/80">Get Started</span>
        </div>

        <h2 className="fr-reveal fr-reveal-delay-1 mt-6 max-w-[900px] font-[family-name:var(--font-serif)] text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-[3.5rem] lg:text-[5rem]">
          Up and running<br className="hidden sm:block" />{" "}
          in <span className="fr-gold-shimmer italic">60 seconds</span>.
        </h2>

        <div className="fr-reveal fr-reveal-delay-2 mt-16 grid grid-cols-1 overflow-hidden rounded-[3px] border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`group relative p-8 transition-colors hover:bg-white/[0.03] ${stepBorderClasses[index]}`}
            >
              <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-[#FFD700]/60 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="fr-numeral text-[56px] text-[#FFD700]/70">
                {step.number}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-serif)] text-[22px] leading-[1.2] text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-white/55">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="fr-reveal fr-reveal-delay-3 mt-12 flex items-center gap-4">
          <a
            href="https://www.npmjs.com/package/@blockrun/franklin"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[2px] bg-[#FFD700] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#0a0d12] shadow-[0_8px_24px_-8px_rgba(255,215,0,0.5)] transition-all hover:shadow-[0_12px_32px_-6px_rgba(255,215,0,0.65)]"
          >
            <span className="relative z-10">Install from npm</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="https://github.com/BlockRunAI/franklin"
            className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-white/18 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#FFD700]/40 hover:bg-white/[0.04]"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/20 to-transparent" />
    </section>
  );
}
