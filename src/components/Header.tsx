"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GitHubIcon } from "./icons";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="hdr-inner">
        <Link href="/" className="logo">
          <div className="logo-ring">
            <Image
              src="/images/franklin-portrait.jpg"
              alt="Franklin"
              width={36}
              height={36}
              priority
            />
          </div>
          <div>
            <div className="logo-name">Franklin</div>
            <div className="logo-sub">by BlockRun.ai</div>
          </div>
        </Link>

        <nav className="nav-btns" aria-label="Primary">
          <a className="nav-link" href="#features">
            Features
          </a>
          <a className="nav-link" href="#compare">
            Compare
          </a>
          <a className="nav-link" href="#blog">
            Blog
          </a>
          <a
            className="nav-link"
            href="https://github.com/RunFranklin/Franklin/blob/main/docs/ARCHITECTURE.md"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>
          <a
            className="btn-outline"
            href="https://github.com/RunFranklin/Franklin"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a className="btn-primary" href="#get-started">
            Get Started
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#compare" onClick={() => setMenuOpen(false)}>Compare</a>
          <a href="#blog" onClick={() => setMenuOpen(false)}>Blog</a>
          <a
            href="https://github.com/RunFranklin/Franklin/blob/main/docs/ARCHITECTURE.md"
            onClick={() => setMenuOpen(false)}
          >
            Docs
          </a>
          <a
            href="https://github.com/RunFranklin/Franklin"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </a>
          <a href="#get-started" onClick={() => setMenuOpen(false)} className="mobile-menu-cta">
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
