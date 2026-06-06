"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GitHubIcon } from "./icons";
import { cdnUrl } from "@/lib/cdn";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";
import { homeUrl, type Locale } from "@/lib/locales";

interface HeaderProps {
  variant?: "ink" | "paper";
  dict?: HomeDict;
  locale?: Locale;
}

export function Header({
  variant = "ink",
  dict = defaultDict,
  locale = "en",
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const offHome = variant === "paper";
  const home = homeUrl(locale);
  const featuresHref = offHome ? `${home}#features` : "#features";
  const compareHref = offHome ? `${home}#compare` : "#compare";
  const blogHref = `/blog/${locale}`;
  // "Get Started" is the primary CTA — it opens the chat app.
  const getStartedHref = "/chat";

  return (
    <header className={`site-header${variant === "paper" ? " site-header-paper" : ""}`}>
      <div className="hdr-inner">
        <Link href={home} className="logo">
          <div className="logo-ring">
            <Image
              src={cdnUrl("/images/franklin-portrait.jpg")}
              alt="Franklin"
              width={32}
              height={32}
              priority
              unoptimized
            />
          </div>
          <div className="logo-name">Franklin Agent</div>
        </Link>

        <nav className="nav-btns" aria-label="Primary">
          <a className="nav-link" href={featuresHref}>
            {dict.nav.features}
          </a>
          <a className="nav-link" href={compareHref}>
            {dict.nav.compare}
          </a>
          <a className="nav-link" href={blogHref}>
            {dict.nav.blog}
          </a>
          <Link className="nav-link" href="/docs">
            {dict.nav.docs}
          </Link>
          <Link className="nav-link nav-link-try" href="/chat">
            {dict.nav.tryFranklin}
          </Link>
          <a
            className="btn-outline"
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon className="h-3.5 w-3.5" />
            {dict.nav.github}
          </a>
          <Link className="btn-primary" href={getStartedHref}>
            {dict.nav.getStarted}
          </Link>
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
          <a href={featuresHref} onClick={() => setMenuOpen(false)}>
            {dict.nav.features}
          </a>
          <a href={compareHref} onClick={() => setMenuOpen(false)}>
            {dict.nav.compare}
          </a>
          <a href={blogHref} onClick={() => setMenuOpen(false)}>
            {dict.nav.blog}
          </a>
          <Link href="/docs" onClick={() => setMenuOpen(false)}>
            {dict.nav.docs}
          </Link>
          <Link href="/chat" onClick={() => setMenuOpen(false)}>
            {dict.nav.tryFranklin}
          </Link>
          <a
            href="https://github.com/blockrunai/franklin"
            onClick={() => setMenuOpen(false)}
          >
            {dict.nav.github}
          </a>
          <Link
            href={getStartedHref}
            onClick={() => setMenuOpen(false)}
            className="mobile-menu-cta"
          >
            {dict.nav.getStarted}
          </Link>
        </div>
      )}
    </header>
  );
}
