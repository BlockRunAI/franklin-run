import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/developer-guide/architecture" },
  title: "Architecture",
  description: "System overview, key modules, token pipeline, and error recovery.",
};

const PAGE_PATH = "/docs/developer-guide/architecture";

export default function ArchitecturePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Architecture"
        description="System overview, key modules, token pipeline, and error recovery."
      >
        <h2>System Overview</h2>
        <p>
          Franklin is structured as a pipeline. Every user message flows through
          these stages:
        </p>
        <CodeBlock language="text">
          {`CLI Entry → Agent Loop → LLM Client → Tool Dispatch → x402 Payment`}
        </CodeBlock>
        <ol>
          <li>
            <strong>CLI Entry</strong> &mdash; parses flags, loads config,
            initializes the session
          </li>
          <li>
            <strong>Agent Loop</strong> &mdash; orchestrates the
            think-act-observe cycle until the task is complete
          </li>
          <li>
            <strong>LLM Client</strong> &mdash; routes requests to the optimal
            model via the Smart Router
          </li>
          <li>
            <strong>Tool Dispatch</strong> &mdash; executes tool calls (file
            ops, shell, search, MCP) and returns results
          </li>
          <li>
            <strong>x402 Payment</strong> &mdash; settles micropayments per API
            call using USDC on Base or Solana
          </li>
        </ol>

        <h2>Key Modules</h2>
        <CodeBlock language="text">
          {`agent/       Agent loop, planning, and orchestration
tools/       Built-in tool implementations (file, shell, search, browser)
router/      Smart Router — model selection, cost optimization, fallback chains
wallet/      Wallet management, x402 payment signing
session/     Session persistence, crash recovery, replay
brain/        Long-term memory storage and retrieval
learnings/   Self-evolution rules (learnings.jsonl)`}
        </CodeBlock>

        <h2>Token Pipeline</h2>
        <p>
          Franklin aggressively compacts context to stay within model limits and
          minimize cost. The pipeline runs in order:
        </p>
        <ol>
          <li>
            <strong>optimize</strong> &mdash; strips redundant whitespace,
            collapses repeated tool outputs
          </li>
          <li>
            <strong>reduce</strong> &mdash; summarizes older conversation turns
            into compact representations
          </li>
          <li>
            <strong>microCompact</strong> &mdash; applies token-level
            compression (abbreviations, deduplication)
          </li>
          <li>
            <strong>autoCompact</strong> &mdash; triggered automatically when
            context approaches the model&apos;s limit
          </li>
        </ol>

        <Callout type="info" title="Automatic compaction">
          You never need to manually compact. When the context window fills,
          Franklin summarizes the conversation and continues seamlessly. The{" "}
          <code>/compact</code> slash command forces immediate compaction if
          needed.
        </Callout>

        <h2>Error Recovery</h2>
        <p>
          Franklin handles failures at every layer with specific strategies:
        </p>
        <ul>
          <li>
            <strong>Context overflow</strong> &mdash; triggers autoCompact to
            summarize and free tokens
          </li>
          <li>
            <strong>Transient errors</strong> &mdash; exponential backoff with
            jitter, up to 3 retries
          </li>
          <li>
            <strong>Rate limits</strong> &mdash; falls back to the next model in
            the Smart Router&apos;s ranked list
          </li>
          <li>
            <strong>Payment failure</strong> &mdash; tries alternate payment
            chain, then falls back to free NVIDIA models
          </li>
        </ul>

        <h2>Design Principles</h2>
        <ul>
          <li>
            <strong>Tool-agnostic core</strong> &mdash; the agent loop is
            decoupled from tool implementations. Any tool that satisfies the{" "}
            <code>CapabilityHandler</code> interface can be plugged in.
          </li>
          <li>
            <strong>Plugin-first extensibility</strong> &mdash; new capabilities
            are added as plugins, not core changes. The plugin discovery system
            loads dev, user, and bundled plugins automatically.
          </li>
          <li>
            <strong>Crash-safe sessions</strong> &mdash; sessions are persisted
            to disk after every turn. If Franklin crashes, restart and your
            conversation resumes from the last completed turn.
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
