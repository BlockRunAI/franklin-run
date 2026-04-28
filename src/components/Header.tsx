"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GitHubIcon } from "./icons";
import { cdnUrl } from "@/lib/cdn";

interface HeaderProps {
  variant?: "ink" | "paper";
}

export function Header({ variant = "ink" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  // On blog/docs pages, anchor links must resolve against the homepage,
  // not against the current URL.
  const offHome = variant === "paper";
  const featuresHref = offHome ? "/#features" : "#features";
  const compareHref = offHome ? "/#compare" : "#compare";
  const blogHref = offHome ? "/blog" : "#blog";
  const getStartedHref = offHome ? "/#get-started" : "#get-started";

  return (
    <header className={`site-header${variant === "paper" ? " site-header-paper" : ""}`}>
      <div className="hdr-inner">
        <Link href="/" className="logo">
          <div className="logo-ring">
            <Image
              src={cdnUrl("/images/franklin-portrait.jpg")}
              alt="Franklin"
              width={36}
              height={36}
              priority
              unoptimized
            />
          </div>
          <div>
            <div className="logo-name">Franklin</div>
            <div className="logo-sub">by BlockRun.ai</div>
          </div>
        </Link>

        <nav className="nav-btns" aria-label="Primary">
          <a className="nav-link" href={featuresHref}>
            Features
          </a>
          <a className="nav-link" href={compareHref}>
            Compare
          </a>
          <a className="nav-link" href={blogHref}>
            Blog
          </a>
          <a className="nav-link" href="/docs">
            Docs
          </a>
          <a
            className="btn-outline"
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a className="btn-primary" href={getStartedHref}>
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
          <a href={featuresHref} onClick={() => setMenuOpen(false)}>Features</a>
          <a href={compareHref} onClick={() => setMenuOpen(false)}>Compare</a>
          <a href={blogHref} onClick={() => setMenuOpen(false)}>Blog</a>
          <a href="/docs" onClick={() => setMenuOpen(false)}>
            Docs
          </a>
          <a
            href="https://github.com/blockrunai/franklin"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </a>
          <a href={getStartedHref} onClick={() => setMenuOpen(false)} className="mobile-menu-cta">
            Get Started
          </a>
        </div>
      )}
    </header>
  );
}
