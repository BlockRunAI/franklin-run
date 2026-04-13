"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DocsSidebarMobile } from "./DocsSidebarMobile";

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function DocsHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-[56px] items-center border-b border-white/10 bg-[#0a0d12]">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Docs label */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white transition-colors hover:text-white/80">
            <span className="text-[16px] text-[#FFD700]">&#9670;</span>
            <span className="text-[15px] font-semibold">Franklin</span>
          </Link>
          <span className="text-white/20">/</span>
          <Link href="/docs" className="text-[14px] text-white/60 transition-colors hover:text-white">
            Docs
          </Link>
        </div>

        {/* Right: GitHub + Mobile menu */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/BlockRunAI/franklin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-white/40 transition-colors hover:text-white"
            aria-label="GitHub repository"
          >
            <GitHubIcon />
          </a>
          <DocsSidebarMobile currentPath={pathname} />
        </div>
      </div>
    </header>
  );
}
