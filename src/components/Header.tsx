export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-transparent">
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-[20px] text-[#FFD700]">&#9670;</span>
          <span className="font-sans text-[16px] font-semibold tracking-[-0.01em] text-white">
            Franklin
          </span>
          <span className="ml-1 text-[11px] text-white/30">by BlockRun.ai</span>
        </a>

        {/* Right buttons */}
        <div className="flex gap-3">
          <a
            href="https://github.com/BlockRunAI/franklin"
            className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-white/18 bg-black/16 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>

          <a
            href="https://docs.blockrun.ai"
            className="inline-flex items-center justify-center gap-2 rounded-[11px] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0a0d12] transition-colors hover:bg-white/90"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
