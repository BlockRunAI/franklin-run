import Link from "next/link";
import { GitHubIcon, TelegramIcon, XIcon } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer grain-dark">
      <div className="footer-top">
        <div className="footer-top-inner">
          <span>◆ Franklin · Series 2026 ◆</span>
          <span>USDC · Base · Solana · x402</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="footer-brand-diamond">◆</span>
              <span className="footer-name">Franklin</span>
            </Link>
            <p className="footer-tagline">
              The AI agent with a wallet. It holds your USDC and spends it toward
              outcomes. Apache 2.0.
            </p>
            <p>
              A{" "}
              <a
                href="https://blockrun.ai"
                style={{ color: "#10b981" }}
                target="_blank"
                rel="noreferrer"
              >
                BlockRun.ai
              </a>{" "}
              product. Powered by the x402 micropayment protocol.
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
                href="https://github.com/RunFranklin/Franklin"
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
              <a className="btn-primary" href="#get-started">
                Get Started
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="engraved">Product</h4>
            <ul>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#compare">Compare</a>
              </li>
              <li>
                <a href="#get-started">Get Started</a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@blockrun/franklin"
                  target="_blank"
                  rel="noreferrer"
                >
                  npm
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="engraved">Resources</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/RunFranklin/Franklin/blob/main/docs/ARCHITECTURE.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="https://blockrun.ai" target="_blank" rel="noreferrer">
                  BlockRun Gateway
                </a>
              </li>
              <li>
                <a href="https://x402.org" target="_blank" rel="noreferrer">
                  x402 Protocol
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="engraved">Community</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/RunFranklin/Franklin"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://x.com/BlockRunAI" target="_blank" rel="noreferrer">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="https://t.me/blockrunAI" target="_blank" rel="noreferrer">
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <span>
            © 2026{" "}
            <a href="https://blockrun.ai" target="_blank" rel="noreferrer">
              BlockRun.ai
            </a>
            . All rights reserved.
          </span>
          <span className="footer-bot-r">
            The autonomous economic agent by{" "}
            <a href="https://blockrun.ai" target="_blank" rel="noreferrer">
              BlockRun.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
