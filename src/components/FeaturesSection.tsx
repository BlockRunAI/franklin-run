import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

type Feature = {
  num: string;
  label: string;
  title: string;
  desc: React.ReactNode;
  visual: React.ReactNode;
};

function WalletBill() {
  return (
    <div className="bill">
      <div className="bill-head">
        <span>USDC · Base</span>
        <span>Non-Custodial</span>
      </div>
      <div className="bill-bal">
        <span className="n">24.37</span>
        <span className="c">USDC</span>
      </div>
      <div className="bill-addr">
        0x8F3a · c92D · 1E4b · f70A · · · autonomy = $0.50 / session cap
      </div>
      <div className="bill-txs">
        <div className="bill-tx">
          <span className="lbl">▸ claude-sonnet-4.6 · refactor auth.ts</span>
          <span className="cost">−$0.041</span>
        </div>
        <div className="bill-tx">
          <span className="lbl">▸ coingecko · BTC/USD signal</span>
          <span className="cost">−$0.002</span>
        </div>
        <div className="bill-tx">
          <span className="lbl">▸ dall·e 3 · hero logo, 1024²</span>
          <span className="cost">−$0.040</span>
        </div>
        <div className="bill-tx">
          <span className="lbl">▸ exa · neural web search (4)</span>
          <span className="cost">−$0.012</span>
        </div>
        <div className="bill-tx">
          <span className="lbl">▸ kimi-k2.6 · context compaction</span>
          <span className="cost">−$0.004</span>
        </div>
      </div>
      <div className="bill-foot">
        <span>◆ x402 · EIP-712</span>
        <span>Session: f3a · 18s</span>
      </div>
    </div>
  );
}

function SignalCard() {
  return (
    <div className="signal-card">
      <span className="signal-corner" style={{ top: 12, left: 12 }}>
        ◆ BTC
      </span>
      <span className="signal-corner" style={{ top: 12, right: 12 }}>
        № 04.20.26
      </span>
      <div className="signal-head">
        <div className="signal-title">
          Signal Report ·{" "}
          <em>Bitcoin</em>
        </div>
        <div className="signal-tag">
          30-day window · <em>bullish</em>
        </div>
      </div>
      <div className="signal-price-row">
        <span className="signal-price">$71,056</span>
        <span className="signal-delta">▲ 2.3% · 24h</span>
        <span
          style={{
            flex: 1,
            textAlign: "right",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "rgba(10,13,18,.5)",
            letterSpacing: ".15em",
          }}
        >
          MCAP $1.42T · VOL $29.6B
        </span>
      </div>
      <div className="signal-metrics">
        <div className="metric">
          <div className="metric-k">RSI (14)</div>
          <div className="metric-v">53.2</div>
          <div className="metric-n">neutral</div>
        </div>
        <div className="metric">
          <div className="metric-k">MACD</div>
          <div className="metric-v">339.21</div>
          <div className="metric-n bull">bullish cross</div>
        </div>
        <div className="metric">
          <div className="metric-k">Bollinger</div>
          <div className="metric-v">mid-band</div>
          <div className="metric-n">$64.5k — $73.8k</div>
        </div>
        <div className="metric">
          <div className="metric-k">Volatility</div>
          <div className="metric-v">35.3%</div>
          <div className="metric-n">annualized</div>
        </div>
      </div>
      <div className="signal-verdict">
        <span className="verdict-badge">Bullish Momentum</span>
        <p className="signal-verdict-p">
          Entry $65,000 · stop $63,200 (−2.8%) · risk $27.69 · target $70k · R/R 1:2.8 ✓
        </p>
      </div>
      <div className="signal-foot">
        <span>Authored · Franklin / Opus 4.8</span>
        <span>Cost · $0.031 USDC</span>
      </div>
    </div>
  );
}

function RoutingLedger() {
  const rows: Array<{
    req: string;
    cat: string;
    model: string;
    cost: string;
    save: string;
    saveClass?: string;
  }> = [
    {
      req: "refactor src/auth.ts to use the new jwt helper",
      cat: "CODING",
      model: "kimi-k2.6",
      cost: "$0.0023",
      save: "↓ 84%",
    },
    {
      req: "what's the BTC outlook for the week?",
      cat: "TRADING",
      model: "grok-4-1-fast",
      cost: "$0.0008",
      save: "↓ 95%",
    },
    {
      req: "prove this algorithm is O(n log n)",
      cat: "REASONING",
      model: "claude-sonnet-4.6",
      cost: "$0.0312",
      save: "priced",
      saveClass: "none",
    },
    {
      req: "compare the top 5 AI agent pricing models",
      cat: "RESEARCH",
      model: "gemini-2.5-flash",
      cost: "$0.0012",
      save: "↓ 91%",
    },
  ];

  return (
    <div className="ledger">
      <div className="ledger-head">
        <span className="l">
          <span className="dot" />
          Session Ledger · /cost
        </span>
        <span>23 reqs · 4 categories · saved 67%</span>
      </div>
      {rows.map((row) => (
        <div key={row.req} className="ledger-row">
          <div>
            <div className="ledger-req">{row.req}</div>
            <span className="ledger-cat">▸ {row.cat}</span>
          </div>
          <div className="ledger-model">{row.model}</div>
          <div className="ledger-cost">{row.cost}</div>
          <div className={`ledger-save${row.saveClass ? ` ${row.saveClass}` : ""}`}>
            {row.save}
          </div>
        </div>
      ))}
      <div className="ledger-foot">
        <span>
          Session total · <span className="total">$0.0847</span>
        </span>
        <span className="saved">Saved vs. Opus-only · $0.174</span>
      </div>
    </div>
  );
}

function PreferenceStack() {
  type ConfDots = [boolean, boolean, boolean, boolean, boolean];
  const rows: Array<{
    k: string;
    v: string;
    meta: string;
    conf: ConfDots;
    decaying?: boolean;
  }> = [
    {
      k: "Primary Language",
      v: "TypeScript · strict mode",
      meta: "confirmed · 42 sess",
      conf: [true, true, true, true, true],
    },
    {
      k: "Commit Style",
      v: "Conventional · no scope",
      meta: "confirmed · 38 sess",
      conf: [true, true, true, true, false],
    },
    {
      k: "Preferred Coder",
      v: "kimi-k2.6 over sonnet for refactors",
      meta: "confirmed · 19 sess",
      conf: [true, true, true, true, false],
    },
    {
      k: "Test Runner",
      v: "vitest · watch mode",
      meta: "confirmed · 24 sess",
      conf: [true, true, true, false, false],
    },
    {
      k: "Reply Tone",
      v: "terse · no apologies",
      meta: "confirmed · 51 sess",
      conf: [true, true, true, true, true],
    },
    {
      k: "Trading Pair Focus",
      v: "BTC, ETH, SOL",
      meta: "decaying · 6d silent",
      conf: [true, true, false, false, false],
      decaying: true,
    },
  ];

  return (
    <div className="prefs">
      <div className="prefs-head">
        <span className="t">
          Learnings{" "}
          <em>/learnings</em>
        </span>
        <span className="c">7 confirmed · 2 decaying</span>
      </div>
      {rows.map((row) => (
        <div key={row.k} className="pref-row">
          <div>
            <div className="pref-k">{row.k}</div>
            <div className="pref-v">{row.v}</div>
          </div>
          <div
            className="pref-meta"
            style={row.decaying ? { color: "rgba(10,13,18,.3)" } : undefined}
          >
            {row.meta}
            <div className="pref-conf">
              {row.conf.map((on, i) => (
                <span key={i} className={on ? "on" : ""} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const VISUALS = [
  <WalletBill key="wallet" />,
  <SignalCard key="signal" />,
  <RoutingLedger key="ledger" />,
  <PreferenceStack key="prefs" />,
];

interface FeaturesSectionProps {
  dict?: HomeDict;
}

export function FeaturesSection({ dict = defaultDict }: FeaturesSectionProps) {
  const f = dict.features;
  const features: Feature[] = f.cards.map((card, i) => ({
    num: String(i + 1).padStart(2, "0"),
    label: card.label,
    title: card.title,
    desc: card.desc,
    visual: VISUALS[i] ?? null,
  }));

  return (
    <section id="features" className="light">
      <div className="inner">
        <div className="features-head">
          <div>
            <div className="eyebrow">
              <span className="engraved">{f.eyebrow}</span>
            </div>
            <h2 className="section-h">
              {f.titleTop}
              <br />
              <em>{f.titleEm}.</em>
            </h2>
          </div>
          <p className="features-intro">
            {f.introPre} <em>{f.introEm}</em> {f.introPost}
          </p>
        </div>

        {features.map((feat) => (
          <div key={feat.num} className="feat-block">
            <div className="feat-left">
              <div className="feat-left-sticky">
                <div className="feat-numeral" data-num={feat.num}>
                  <span>{feat.num}</span>
                </div>
                <div className="engraved feat-label">{feat.label}</div>
                <h3 className="feat-h">{feat.title}</h3>
                <p className="feat-desc">{feat.desc}</p>
              </div>
            </div>
            <div>
              <div className="feat-visual">{feat.visual}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
