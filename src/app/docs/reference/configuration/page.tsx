import type { Metadata } from "next";
import Link from "next/link";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Configuration",
  description: "The ~/.blockrun/ directory structure and key configuration files.",
};

const PAGE_PATH = "/docs/reference/configuration";

export default function ConfigurationPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Configuration"
        description="The ~/.blockrun/ directory structure and key configuration files."
      >
        <h2>Directory Structure</h2>
        <p>
          All of Franklin&apos;s persistent state lives in{" "}
          <code>~/.blockrun/</code>:
        </p>
        <CodeBlock language="text">
          {`~/.blockrun/
├── payment-chain        # Active payment chain ("base" or "solana")
├── wallets/             # Encrypted wallet keystores
│   ├── base.json
│   └── solana.json
├── sessions/            # Persisted conversation sessions
│   ├── <session-id>.json
│   └── ...
├── brain/               # Long-term memory store
│   ├── index.json
│   └── embeddings/
├── learnings.jsonl      # Self-evolution rules (one JSON object per line)
├── runcode-stats.json   # Aggregated usage and cost statistics
├── mcp.json             # Global MCP server configuration
└── config.json          # User preferences`}
        </CodeBlock>

        <h2>Key Files</h2>

        <h3>payment-chain</h3>
        <p>
          A plain text file containing the active payment chain. Set
          automatically by <code>franklin setup</code>:
        </p>
        <CodeBlock language="bash">
          {`cat ~/.blockrun/payment-chain
# Output: base`}
        </CodeBlock>

        <h3>sessions/</h3>
        <p>
          Each session is a JSON file containing the full conversation
          history, tool call results, and metadata. Sessions are
          crash-safe &mdash; they are written after every completed turn.
        </p>

        <Callout type="info" title="Session recovery">
          If Franklin crashes mid-session, restart it in the same directory.
          It automatically detects and resumes the last active session.
        </Callout>

        <h3>runcode-stats.json</h3>
        <p>
          Aggregated statistics including total tokens used, cost per model,
          and session counts. Used by <code>franklin insights</code> and
          the web panel.
        </p>
        <CodeBlock language="json">
          {`{
  "totalTokens": 1284503,
  "totalCostUsd": 0.42,
  "modelBreakdown": {
    "claude-sonnet-4-20250514": { "calls": 89, "tokens": 502300, "costUsd": 0.31 },
    "llama-3.1-8b": { "calls": 214, "tokens": 782203, "costUsd": 0.00 }
  },
  "sessionCount": 23
}`}
        </CodeBlock>

        <h3>learnings.jsonl</h3>
        <p>
          The self-evolution memory. Each line is a JSON object recording a
          lesson Franklin has learned from your feedback and corrections:
        </p>
        <CodeBlock language="json">
          {`{"rule": "Always use pnpm in this project, not npm", "context": "package-manager", "created": "2025-01-15T10:30:00Z"}
{"rule": "Run tests before committing", "context": "workflow", "created": "2025-01-16T14:22:00Z"}`}
        </CodeBlock>

        <h3>brain/</h3>
        <p>
          Long-term memory storage. Franklin stores project-specific knowledge
          here &mdash; architecture decisions, API patterns, debugging history
          &mdash; and retrieves relevant context automatically at the start of
          each session.
        </p>

        <h3>mcp.json</h3>
        <p>
          Global MCP server configuration. Servers defined here are available
          in every project. See the{" "}
          <Link href="/docs/developer-guide/mcp">MCP Integration</Link> guide for
          the full format.
        </p>

        <h3>config.json</h3>
        <p>
          User preferences. Can also be set via{" "}
          <code>franklin config</code>:
        </p>
        <CodeBlock language="json">
          {`{
  "defaultModel": "auto",
  "trustMode": false,
  "theme": "auto",
  "compactThreshold": 0.8
}`}
        </CodeBlock>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
