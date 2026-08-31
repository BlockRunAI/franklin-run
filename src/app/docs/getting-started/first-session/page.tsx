import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/getting-started/first-session" },
  title: "First Session",
  description:
    "A guided walkthrough of your first conversation with Franklin.",
};

const PAGE_PATH = "/docs/getting-started/first-session";

export default function FirstSessionPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="First Session"
        description="A guided walkthrough of your first conversation with Franklin."
      >
        <h2>Start Franklin</h2>
        <p>
          Launch Franklin in trust mode to skip tool confirmation prompts:
        </p>
        <CodeBlock language="bash">
          {`franklin --trust`}
        </CodeBlock>

        <Callout type="info" title="What is trust mode?">
          By default, Franklin asks for confirmation before running tools (shell
          commands, file edits, etc.). The <code>--trust</code> flag skips these
          prompts so you can move faster. You can always revoke trust mid-session
          with <code>/untrust</code>.
        </Callout>

        <h2>Understanding the UI</h2>
        <p>
          Once Franklin starts, the status bar at the bottom of your terminal
          shows three key pieces of information:
        </p>
        <ul>
          <li>
            <strong>Current model</strong> &mdash; the model handling your
            current prompt (e.g., <code>kimi-k3</code>, <code>grok</code>,{" "}
            <code>claude-sonnet</code>)
          </li>
          <li>
            <strong>USDC balance</strong> &mdash; your remaining wallet balance
          </li>
          <li>
            <strong>Session cost</strong> &mdash; how much you&apos;ve spent in
            this session so far
          </li>
        </ul>

        <h2>Try Some Prompts</h2>
        <p>
          Franklin is a general-purpose AI agent. Try a few prompts to see it in
          action:
        </p>
        <CodeBlock language="text">
          {`> what's BTC looking like?

> refactor this file to use async/await

> find X posts about AI agents

> summarize this PDF`}
        </CodeBlock>
        <p>
          Each prompt is automatically routed to the best model for the task
          &mdash; you don&apos;t need to pick one.
        </p>

        <h2>Smart Router in Action</h2>
        <p>
          Franklin&apos;s Smart Router analyzes every prompt and selects the
          optimal model. Here are some examples of how routing works:
        </p>
        <ul>
          <li>
            <strong>CODING</strong> tasks &rarr; <code>kimi-k3</code>{" "}
            &mdash; fast, accurate code generation
          </li>
          <li>
            <strong>TRADING</strong> tasks &rarr; <code>grok</code> &mdash;
            real-time market data and analysis
          </li>
          <li>
            <strong>REASONING</strong> tasks &rarr;{" "}
            <code>claude-sonnet</code> &mdash; deep analysis and nuanced
            responses
          </li>
        </ul>

        <Callout type="tip" title="Override the router">
          You can force a specific model with the <code>--model</code> flag:{" "}
          <code>franklin --model grok</code>. Or switch mid-session with{" "}
          <code>/model grok</code>.
        </Callout>

        <h2>Check Your Spend</h2>
        <p>
          At any point during a session, run the <code>/cost</code> slash
          command to see a per-model breakdown of your spending:
        </p>
        <CodeBlock language="text">
          {`> /cost

Session cost breakdown:
  kimi-k3        $0.0012  (3 calls)
  grok           $0.0008  (1 call)
  claude-sonnet  $0.0045  (2 calls)
  ─────────────────────────
  Total          $0.0065`}
        </CodeBlock>
        <p>
          Every API call is a micropayment &mdash; you only pay for exactly what
          you use.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
