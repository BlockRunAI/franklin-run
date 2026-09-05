import type { Metadata } from "next";
import Link from "next/link";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/getting-started" },
  title: "Getting Started",
  description: "Up and running with Franklin in 60 seconds.",
};

const PAGE_PATH = "/docs/getting-started";

export default function GettingStartedPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Getting Started"
        description="Up and running with Franklin in 60 seconds."
      >
        <p>
          Use a BlockRun API key for account billing: <Link href="/docs/getting-started/account-api">account setup guide</Link>.
          Register at <a href="https://user.blockrun.ai">user.blockrun.ai</a>, create a key and add credits.
          Account mode needs no payment wallet; wallet billing supports Solana first, then Base.
        </p>

        <h2>Install</h2>
        <p>
          Franklin is distributed as a single npm package. Install it globally:
        </p>
        <CodeBlock language="bash">
          {`npm install -g @blockrun/franklin`}
        </CodeBlock>

        <h2>Run</h2>
        <p>
          That&apos;s it. Just type <code>franklin</code> and start chatting.
          Free NVIDIA models are available immediately with zero setup &mdash; no
          API keys, no accounts, no config files.
        </p>
        <CodeBlock language="bash">
          {`franklin`}
        </CodeBlock>

        <Callout type="tip" title="No funding required">
          Franklin works without any funding. The free tier (NVIDIA Nemotron 3,
          Llama 3.2 Vision, Cohere North Mini Code, Poolside Laguna XS) is
          always available. Add account credits or fund a wallet when you want to unlock
          premium models like Claude, GPT, Gemini, and Grok.
        </Callout>

        <h2>Fund (optional)</h2>
        <p>
          To unlock 70+ premium models (Claude, GPT, Gemini, Grok, and more), set up
          an account API key or a wallet with USDC. Franklin uses micropayments &mdash; you pay
          fractions of a cent per action, with usage-based billing.
        </p>
        <CodeBlock language="bash">
          {`franklin setup solana`}
        </CodeBlock>
        <p>
          This creates (or imports) a Solana wallet and displays your deposit
          address. Send USDC on Solana to get started &mdash; even $1
          is enough for hundreds of actions.
        </p>

        <h2>What&apos;s Next</h2>
        <ul>
          <li>
            <Link href="/docs/getting-started/installation">Installation details</Link>
            &nbsp;&mdash; prerequisites, platforms, and troubleshooting
          </li>
          <li>
            <Link href="/docs/getting-started/wallet-setup">Wallet setup</Link>
            &nbsp;&mdash; funding your wallet with USDC on Solana or Base
          </li>
          <li>
            <Link href="/docs/getting-started/first-session">First session</Link>
            &nbsp;&mdash; a guided walkthrough of your first conversation with Franklin
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
