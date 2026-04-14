"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-transparent">
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="size-9 overflow-hidden rounded-full border border-[#FFD700]/40 transition-all duration-500 group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_-4px_rgba(255,215,0,0.5)]">
            <Image
              src="/images/franklin-portrait.jpg"
              alt="Franklin"
              width={36}
              height={36}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-[family-name:var(--font-serif)] text-[22px] tracking-[-0.01em] text-white">
              Franklin
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-[#FFD700]/60 sm:block">
              by BlockRun.ai
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-white"
          >
            Docs
          </Link>
          <a
            href="https://github.com/BlockRunAI/franklin"
            className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-white/15 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:border-[#FFD700]/40 hover:bg-white/[0.04]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
          <a
            href="#get-started"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-[2px] bg-[#FFD700] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0a0d12] transition-all hover:shadow-[0_8px_20px_-6px_rgba(255,215,0,0.5)]"
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex size-10 items-center justify-center rounded-lg text-white/60 hover:text-white sm:hidden"
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#05070b]/95 px-6 py-4 backdrop-blur-lg sm:hidden">
          <div className="flex flex-col gap-3">
            <a href="#features" onClick={() => setMenuOpen(false)} className="py-2 text-[15px] text-white/70 hover:text-white">Features</a>
            <a href="#get-started" onClick={() => setMenuOpen(false)} className="py-2 text-[15px] text-white/70 hover:text-white">Get Started</a>
            <a href="https://github.com/BlockRunAI/franklin" className="py-2 text-[15px] text-white/70 hover:text-white">GitHub</a>
            <Link href="/docs" onClick={() => setMenuOpen(false)} className="py-2 text-[15px] text-white/70 hover:text-white">Docs</Link>
          </div>
        </div>
      )}
    </header>
  );
}
