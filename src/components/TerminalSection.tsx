"use client";

import { useTerminalDemo } from "./HeroSection";
import { Guilloche } from "./Guilloche";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

interface TerminalSectionProps {
  dict?: HomeDict;
}

export function TerminalSection({ dict = defaultDict }: TerminalSectionProps) {
  const { prompt, responseLines } = useTerminalDemo();
  const h = dict.hero;
  const t = dict.terminalDemo;

  return (
    <section className="term-section term-section--dark surface-dark">
      <div className="surface-grid" aria-hidden="true" />
      <div className="surface-status" aria-hidden="true">
        <span className="surface-status-l">
          <span className="surface-status-dot" /> live
        </span>
        <span className="surface-status-c">Base mainnet · block #24,901,338</span>
        <span className="surface-status-r">x402 · EIP-712 · gas $0.00</span>
      </div>
      <div className="guilloche-bg" aria-hidden="true">
        <Guilloche variant="wave" opacity={0.12} className="guilloche-wave-fill" />
      </div>
      <div className="inner">
        <div className="eyebrow">
          <span className="engraved label">{t.eyebrow}</span>
        </div>
        <h2>
          {t.titlePre} <em>{t.titleEm}</em>
        </h2>
        <p className="sub">{t.sub}</p>

        <div className="terminal">
          <div className="term-titlebar">
            <span className="dot r" />
            <span className="dot y" />
            <span className="dot g" />
            <span className="term-path">~ franklin --trust</span>
            <span className="term-live">LIVE</span>
          </div>
          <div className="term-body">
            <div className="prompt-line">
              <span className="prompt-caret">❯ </span>
              <span className="prompt-text">{prompt}</span>
              <span className="caret" />
            </div>
            <div className="term-resp">
              {responseLines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    color: line.color || "rgba(255,255,255,.6)",
                  }}
                >
                  {line.text || " "}
                </div>
              ))}
            </div>
          </div>
          <div className="term-statusbar">
            <span className="model">claude-opus-4.6</span>
            <span>·</span>
            <span className="cost">$4.80 USDC</span>
            <span>·</span>
            <span>{h.termAbort}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
