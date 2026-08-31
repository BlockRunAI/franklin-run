import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/user-guide/proxy-mode" },
  title: "Proxy Mode",
  description: "Use Franklin as a local API server for other tools.",
};

const PAGE_PATH = "/docs/user-guide/proxy-mode";

export default function ProxyModePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Proxy Mode"
        description="Use Franklin as a local API server for other tools."
      >
        <h2>What Is Proxy Mode?</h2>
        <p>
          Proxy mode starts a local API server that is compatible with the
          Anthropic API format. Any tool that can talk to Claude&apos;s API can
          be pointed at Franklin instead, giving it access to all 70+ models
          through a single endpoint.
        </p>

        <h2>Starting the Proxy</h2>
        <p>
          Launch the proxy server on port 8402:
        </p>
        <CodeBlock language="bash">
          {`franklin proxy`}
        </CodeBlock>
        <p>
          The server starts and listens on{" "}
          <code>http://localhost:8402</code>. It accepts standard Anthropic API
          requests and routes them through Franklin&apos;s model router.
        </p>

        <h2>Using with Claude Code</h2>
        <p>
          Point Claude Code at Franklin&apos;s proxy to route all requests
          through your Franklin wallet:
        </p>
        <CodeBlock language="bash">
          {`# Set the base URL to Franklin's proxy
export ANTHROPIC_BASE_URL=http://localhost:8402

# Now start Claude Code as usual
claude`}
        </CodeBlock>

        <Callout type="tip" title="All models, one endpoint">
          With proxy mode, Claude Code can access not just Anthropic models but
          any of Franklin&apos;s 70+ models. Use model aliases in your requests
          and Franklin resolves them automatically.
        </Callout>

        <h2>Model Alias Resolution</h2>
        <p>
          The proxy resolves model aliases to their full identifiers. You can
          use short names in API requests:
        </p>
        <CodeBlock language="bash">
          {`# These all work as model names in API requests:
claude-sonnet   → anthropic/claude-sonnet-5
gpt             → openai/gpt-5.6-sol
gemini-pro      → google/gemini-3.1-pro`}
        </CodeBlock>
        <p>
          If a model is unavailable, the proxy automatically falls back to the
          next best option in the same tier &mdash; no errors, no manual
          switching.
        </p>

        <h2>Background Daemon</h2>
        <p>
          Run the proxy as a background daemon so it persists across terminal
          sessions:
        </p>
        <CodeBlock language="bash">
          {`# Start the daemon
franklin daemon start

# Check if it's running
franklin daemon status

# Stop the daemon
franklin daemon stop`}
        </CodeBlock>

        <Callout type="info" title="Daemon auto-restarts">
          The daemon automatically restarts if it crashes. It writes logs to{" "}
          <code>~/.blockrun/daemon.log</code> for debugging.
        </Callout>

        <h2>Fallback Chain</h2>
        <p>
          When a model request fails (rate limit, outage, or timeout), the
          proxy tries the next model in the fallback chain for that tier. This
          happens transparently &mdash; the calling tool receives a successful
          response from the fallback model without needing to retry.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
