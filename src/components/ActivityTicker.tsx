"use client";

/**
 * Live "agent activity" ticker — a thin full-width monospace tape that scrolls
 * agent actions with real per-call USDC costs, like a market ribbon. Pure CSS
 * marquee (transform-based, GPU-friendly), pauses on hover, and falls back to a
 * static row under `prefers-reduced-motion`.
 *
 * These are decorative technical tokens (model names, costs, settlement events),
 * NOT translated marketing copy — so hardcoding them here is intentional.
 */

type TickerItem = { kind: "ok" | "settle" | "route"; text: string; cost?: string };

const ITEMS: TickerItem[] = [
  { kind: "ok", text: "classify TRADING → grok-4.5", cost: "$0.0004" },
  { kind: "settle", text: "x402 settle · Base mainnet" },
  { kind: "ok", text: "search X · 12 results", cost: "$0.0003" },
  { kind: "ok", text: "image · gpt-image-2 · 1024²", cost: "$0.040" },
  { kind: "route", text: "route CODING → kimi-k3" },
  { kind: "ok", text: "refactor auth.ts · −24 +31", cost: "$0.008" },
  { kind: "ok", text: "reason · sonnet-5 · O(n log n) proof", cost: "$0.031" },
  { kind: "settle", text: "x402 settle · Solana" },
  { kind: "ok", text: "exa · neural web search (4)", cost: "$0.012" },
  { kind: "ok", text: "compact context · kimi-k3", cost: "$0.004" },
  { kind: "route", text: "route RESEARCH → gemini-2.5-flash" },
  { kind: "ok", text: "BTC/USD signal · coingecko", cost: "$0.002" },
];

function TickerGroup({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="ticker-group" aria-hidden={ariaHidden || undefined}>
      {ITEMS.map((item, i) => (
        <span className="ticker-item" key={`${item.text}-${i}`}>
          <span className={`ticker-glyph ticker-glyph--${item.kind}`}>
            {item.kind === "settle" ? "◆" : item.kind === "route" ? "›" : "✓"}
          </span>
          <span className="ticker-text">{item.text}</span>
          {item.cost ? <span className="ticker-cost">{item.cost}</span> : null}
          <span className="ticker-sep" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </div>
  );
}

export function ActivityTicker() {
  return (
    <div className="activity-ticker" role="marquee" aria-label="Live agent activity">
      <span className="ticker-tag" aria-hidden="true">
        <span className="ticker-tag-dot" />
        LIVE
      </span>
      <div className="ticker-track">
        {/* Two identical groups create a seamless infinite scroll. */}
        <TickerGroup />
        <TickerGroup ariaHidden />
      </div>
    </div>
  );
}
