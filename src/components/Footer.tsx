import Link from "next/link";
import { GitHubIcon, TelegramIcon, XIcon } from "./icons";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";
import { homeUrl, LOCALES, type Locale } from "@/lib/locales";
import { LocaleSwitcher } from "@/components/blog/LocaleSwitcher";

interface FooterProps {
  dict?: HomeDict;
  locale?: Locale;
}

export function Footer({ dict = defaultDict, locale = "en" }: FooterProps) {
  const home = homeUrl(locale);
  const featuresHref = `${home}#features`;
  const compareHref = `${home}#compare`;
  const getStartedHref = `${home}#get-started`;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={home} className="logo">
              <span className="footer-name">Franklin Agent</span>
            </Link>
            <p className="footer-tagline">{dict.footer.tagline}</p>
            <p>
              {dict.footer.aboutPre}{" "}
              <a
                href="https://blockrun.ai"
                style={{ color: "var(--accent)" }}
                target="_blank"
                rel="noreferrer"
              >
                {dict.footer.aboutLink}
              </a>{" "}
              {dict.footer.aboutPost}
            </p>
            <div className="footer-socials">
              <a
                href="https://x.com/BlockRunAI"
                aria-label="X"
                target="_blank"
                rel="noreferrer"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/blockrunai/franklin"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/blockrunAI"
                aria-label="Telegram"
                target="_blank"
                rel="noreferrer"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
            </div>
            <div className="footer-cta">
              <a className="btn-primary" href={getStartedHref}>
                {dict.footer.ctaGetStarted}
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="engraved">{dict.footer.colProduct}</h4>
            <ul>
              <li>
                <a href={featuresHref}>{dict.footer.linkFeatures}</a>
              </li>
              <li>
                <a href={compareHref}>{dict.footer.linkCompare}</a>
              </li>
              <li>
                <a href={getStartedHref}>{dict.footer.linkGetStarted}</a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@blockrun/franklin"
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.footer.linkNpm}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="engraved">{dict.footer.colResources}</h4>
            <ul>
              <li>
                <a href="/docs">{dict.footer.linkDocs}</a>
              </li>
              <li>
                <a href={`/blog/${locale}`}>{dict.footer.linkBlog}</a>
              </li>
              <li>
                <a href="https://blockrun.ai" target="_blank" rel="noreferrer">
                  {dict.footer.linkGateway}
                </a>
              </li>
              <li>
                <a href="https://x402.org" target="_blank" rel="noreferrer">
                  {dict.footer.linkX402}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="engraved">{dict.footer.colCommunity}</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/blockrunai/franklin"
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.footer.linkGitHub}
                </a>
              </li>
              <li>
                <a href="https://x.com/BlockRunAI" target="_blank" rel="noreferrer">
                  {dict.footer.linkX}
                </a>
              </li>
              <li>
                <a href="https://t.me/blockrunAI" target="_blank" rel="noreferrer">
                  {dict.footer.linkTelegram}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-locale" style={{ marginTop: 56, marginBottom: 24 }}>
          <LocaleSwitcher
            current={locale}
            available={[...LOCALES]}
            hrefForLocale={(l) => homeUrl(l)}
          />
        </div>

        <div className="footer-bot">
          <span>{dict.footer.copyright}</span>
          <span className="footer-bot-r">{dict.footer.bottomRight}</span>
        </div>
      </div>
    </footer>
  );
}
