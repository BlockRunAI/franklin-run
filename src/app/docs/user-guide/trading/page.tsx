import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Trading",
  description: "Live crypto signals, market data, and technical analysis.",
};

const PAGE_PATH = "/docs/user-guide/trading";

export default function TradingPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Trading"
        description="Live crypto signals, market data, and technical analysis."
      >
        <h2>Overview</h2>
        <p>
          Franklin includes two built-in trading tools that provide real-time
          cryptocurrency data and technical analysis. No API key is required
          &mdash; data is sourced from CoinGecko&apos;s free tier.
        </p>

        <h2>TradingSignal</h2>
        <p>
          Get a full technical analysis report for any cryptocurrency. Includes
          live price, RSI, MACD, Bollinger Bands, and volatility metrics.
        </p>
        <CodeBlock language="plaintext">
          {`You: "What's BTC looking like?"

Franklin: [uses TradingSignal tool]

BTC/USD Signal Report
━━━━━━━━━━━━━━━━━━━━
Price:     $67,432.18
24h:       +2.3%
RSI (14):  58.2 (neutral)
MACD:      bullish crossover
Bollinger: price near middle band
Volatility: moderate (32-day: 4.1%)`}
        </CodeBlock>

        <h2>TradingMarket</h2>
        <p>
          Look up prices, discover trending coins, or get a market overview:
        </p>
        <CodeBlock language="plaintext">
          {`You: "What are the top trending coins?"

Franklin: [uses TradingMarket tool]

Trending on CoinGecko
1. PEPE    +18.4%
2. WIF     +12.1%
3. BONK    +9.7%
...`}
        </CodeBlock>

        <h2>Example Queries</h2>
        <p>
          Just ask naturally &mdash; Franklin picks the right tool:
        </p>
        <ul>
          <li>&quot;What&apos;s the price of ETH?&quot;</li>
          <li>&quot;Give me a signal report for SOL&quot;</li>
          <li>&quot;Show me the top gainers today&quot;</li>
          <li>&quot;Is BTC overbought right now?&quot;</li>
          <li>&quot;Compare ETH and SOL technicals&quot;</li>
        </ul>

        <Callout type="info" title="No API key needed">
          Trading tools use CoinGecko&apos;s free tier. No setup or
          configuration required. Data refreshes with every request.
        </Callout>

        <Callout type="warning" title="Not financial advice">
          Trading signals are informational only. Franklin does not execute
          trades or provide financial advice. Always do your own research
          before making trading decisions.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
