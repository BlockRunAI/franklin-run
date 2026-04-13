import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Wallet Setup",
  description: "Fund your wallet with USDC on Base or Solana.",
};

const PAGE_PATH = "/docs/getting-started/wallet-setup";

export default function WalletSetupPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Wallet Setup"
        description="Fund your wallet with USDC on Base or Solana."
      >
        <h2>Choose Your Chain</h2>
        <p>
          Franklin supports two chains for payments: <strong>Base</strong> and{" "}
          <strong>Solana</strong>. Pick one and run the setup command:
        </p>
        <CodeBlock language="bash">
          {`# Base (recommended — lower fees)
franklin setup base

# Solana
franklin setup solana`}
        </CodeBlock>

        <Callout type="tip" title="Base is recommended">
          Base has significantly lower transaction fees than Solana for
          micropayments. Unless you already hold USDC on Solana, start with
          Base.
        </Callout>

        <h2>Check Your Balance</h2>
        <p>
          After setup, verify your wallet address and current USDC balance:
        </p>
        <CodeBlock language="bash">
          {`franklin balance`}
        </CodeBlock>
        <p>
          This displays your wallet address and USDC balance. Share the address
          to receive funds.
        </p>

        <h2>Fund Your Wallet</h2>
        <p>
          Send USDC to the wallet address shown by <code>franklin balance</code>.
          You can transfer from any exchange (Coinbase, Binance, etc.) or
          another wallet.
        </p>

        <Callout type="info" title="How much do I need?">
          Even <strong>$1 of USDC</strong> is enough for hundreds of API calls.
          Franklin uses micropayments &mdash; each model call costs fractions of
          a cent.
        </Callout>

        <h2>Free Tier</h2>
        <p>
          No funding needed to get started. Franklin includes free access to
          NVIDIA models out of the box. Just run:
        </p>
        <CodeBlock language="bash">
          {`franklin`}
        </CodeBlock>
        <p>
          You can use free NVIDIA models immediately &mdash; no wallet setup,
          no USDC, no sign-up required. Fund your wallet later when you want
          access to premium models like Claude, GPT, and Grok.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
