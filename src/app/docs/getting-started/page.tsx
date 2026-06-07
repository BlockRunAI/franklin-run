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
          Franklin works without any funding. Free NVIDIA models (Llama, Mistral,
          Qwen, DeepSeek) are always available. Fund your wallet only when you
          want to unlock premium models like Claude, GPT-5, and Gemini.
        </Callout>

        <h2>Fund (optional)</h2>
        <p>
          To unlock 60+ premium models (Claude, GPT-5, Gemini, and more), set up
          a wallet and send USDC. Franklin uses micropayments &mdash; you pay
          fractions of a cent per action, with no subscriptions or rate limits.
        </p>
        <CodeBlock language="bash">
          {`franklin setup base`}
        </CodeBlock>
        <p>
          This creates (or imports) a Base wallet and displays your deposit
          address. Send any amount of USDC on Base to get started &mdash; even $1
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
            &nbsp;&mdash; funding your wallet with USDC on Base or Solana
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
