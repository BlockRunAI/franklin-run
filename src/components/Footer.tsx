const NAV_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Get Started", href: "#get-started" },
      { label: "npm", href: "https://www.npmjs.com/package/@blockrun/franklin" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "https://docs.blockrun.ai" },
      { label: "BlockRun Gateway", href: "https://blockrun.ai" },
      { label: "x402 Protocol", href: "https://x402.org" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/BlockRunAI/franklin" },
      { label: "X / Twitter", href: "https://x.com/BlockRunAI" },
      { label: "Telegram", href: "https://t.me/blockrunAI" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#0a0d12] text-white">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-16">
          {/* Left column */}
          <div>
            <a href="/" className="flex items-center gap-3">
              <span className="text-[20px] text-[#FFD700]">&#9670;</span>
              <span className="text-[16px] font-semibold text-white">
                Franklin
              </span>
            </a>

            <p className="mt-4 max-w-[320px] text-[14px] leading-6 text-white/50">
              The AI agent with a wallet. Open source, runs locally, pays per action in USDC.
            </p>
            <p className="mt-3 text-[13px] text-white/30">
              A <a href="https://blockrun.ai" className="text-[#10b981] hover:underline">BlockRun.ai</a> product. Powered by the x402 micropayment protocol.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://x.com/BlockRunAI"
                className="text-white/40 transition-colors hover:text-white"
                aria-label="X (Twitter)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://github.com/BlockRunAI/franklin"
                className="text-white/40 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>

              <a
                href="https://t.me/blockrunAI"
                className="text-white/40 transition-colors hover:text-white"
                aria-label="Telegram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center rounded-[10px] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0a0d12] transition-colors hover:bg-white/90"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          {NAV_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-[13px] font-semibold text-white/50">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8 text-[13px] text-white/30">
          <span>&copy; {new Date().getFullYear()} <a href="https://blockrun.ai" className="hover:text-white/50">BlockRun.ai</a>. All rights reserved.</span>
          <span>Franklin is an open-source product by <a href="https://blockrun.ai" className="text-[#10b981] hover:underline">BlockRun.ai</a></span>
        </div>
      </div>
    </footer>
  );
}
