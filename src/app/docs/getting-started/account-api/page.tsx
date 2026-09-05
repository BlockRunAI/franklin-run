import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/getting-started/account-api" },
  title: "Account API",
  description: "Register, create an API key and use Franklin with account credits.",
};
const PAGE_PATH = "/docs/getting-started/account-api";

export default function AccountApiPage() {
  const { prev, next } = getPageNavigation(PAGE_PATH);
  return (
    <>
      <DocsBreadcrumb items={getBreadcrumbs(PAGE_PATH)} />
      <DocsContent title="Account API" description="One BlockRun API key for models, media and data tools.">
        <h2>Register and add credits</h2>
        <ol>
          <li><a href="https://user.blockrun.ai">Register or sign in</a>.</li>
          <li>Create a key in <a href="https://user.blockrun.ai/dashboard/keys">API Keys</a>.</li>
          <li>Add funds in <a href="https://user.blockrun.ai/dashboard/credits">Credits</a>.</li>
        </ol>
        <Callout type="info" title="Release availability">
          The account API is live. Franklin requires a release containing the
          <a href="https://github.com/BlockRunAI/Franklin/pull/156"> account API update</a>,
          or a local build of that branch. Check your installed release before following this guide.
        </Callout>
        <h2>Configure Franklin</h2>
        <p>Set the key in your local environment or secret manager. Keep it out of source control, chat and browser bundles.</p>
        <CodeBlock language="bash">{`export BLOCKRUN_API_KEY="<your-account-api-key>"
franklin start
# Also supported:
franklin proxy
franklin serve`}</CodeBlock>
        <p>
          Account requests default to <code>https://api.blockrun.ai/v1</code>.
          <code> BLOCKRUN_API_BASE_URL</code> is an optional endpoint override.
          No payment wallet, USDC deposit or chain selection is needed.
        </p>
        <h2>Supported product flows</h2>
        <p>
          Account mode covers the agent and subagents, proxy requests, LLM streaming,
          images, video and music generation/polling, speech, search, Signal/Surf and
          gateway data tools. Endpoint availability depends on the gateway and upstream provider.
          Wallet-signed cloud sync, wallet-owned assets, trades and marketplace signatures
          still require a separate wallet. Local sessions remain available.
        </p>
        <h2>Usage and errors</h2>
        <p>
          The account dashboard is authoritative for usage and remaining credits.
          Local cost totals and max-spend limits are estimates. Account status and
          <code> franklin balance</code> link to the account portal.
        </p>
        <ul>
          <li>401: check that the API key is valid and active.</li>
          <li>402: add account credits; Franklin does not switch to wallet payment.</li>
          <li>429: respect the rate limit and retry guidance.</li>
        </ul>
        <h2>Return to wallet billing</h2>
        <CodeBlock language="bash">{`unset BLOCKRUN_API_KEY
franklin setup solana`}</CodeBlock>
        <p>
          Solana is recommended for new wallets; Base and existing chain selections
          remain supported. Account credits and wallet USDC are separate balances.
        </p>
      </DocsContent>
      <DocsPagination prev={prev} next={next} />
    </>
  );
}
