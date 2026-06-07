import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/reference/cli" },
  title: "CLI",
  description: "Every command and flag in the Franklin CLI.",
};

const PAGE_PATH = "/docs/reference/cli";

export default function CliReferencePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="CLI"
        description="Every command and flag in the Franklin CLI."
      >
        <h2>Main Command</h2>
        <CodeBlock language="bash">
          {`franklin [flags]`}
        </CodeBlock>
        <p>
          Launches an interactive agent session. Without any flags, Franklin
          uses the Smart Router to pick the best available model.
        </p>

        <h3>Global Flags</h3>
        <ul>
          <li>
            <code>--trust</code> &mdash; skip tool-call confirmations (trust
            mode)
          </li>
          <li>
            <code>--debug</code> &mdash; enable verbose debug logging
          </li>
          <li>
            <code>-m &lt;model&gt;</code> &mdash; pin a specific model (e.g.,{" "}
            <code>-m claude-sonnet-4-20250514</code>)
          </li>
          <li>
            <code>--version</code> &mdash; print the installed version
          </li>
          <li>
            <code>--help</code> &mdash; show help text
          </li>
        </ul>

        <h2>Subcommands</h2>

        <h3>setup</h3>
        <CodeBlock language="bash">
          {`franklin setup <chain>   # chain: base | solana`}
        </CodeBlock>
        <p>
          Create or import a wallet on the specified chain. Prompts for a
          private key import or generates a new wallet.
        </p>

        <h3>balance</h3>
        <CodeBlock language="bash">
          {`franklin balance`}
        </CodeBlock>
        <p>
          Display your wallet address and current USDC balance across all
          configured chains.
        </p>

        <h3>models</h3>
        <CodeBlock language="bash">
          {`franklin models`}
        </CodeBlock>
        <p>
          List all available models with their provider, cost tier, and
          current availability status.
        </p>

        <h3>config</h3>
        <CodeBlock language="bash">
          {`franklin config [key] [value]`}
        </CodeBlock>
        <p>
          View or set configuration values. Without arguments, prints the
          full config. With a key, prints that value. With both, sets the
          value.
        </p>

        <h3>search</h3>
        <CodeBlock language="bash">
          {`franklin search <query>`}
        </CodeBlock>
        <p>
          Run a web search from the command line using BlockRun&apos;s search
          API. Returns structured results.
        </p>

        <h3>social</h3>
        <CodeBlock language="bash">
          {`franklin social <platform> <action>`}
        </CodeBlock>
        <p>
          Interact with social platforms (X/Twitter). Actions include{" "}
          <code>post</code>, <code>search</code>, and <code>timeline</code>.
        </p>

        <h3>proxy</h3>
        <CodeBlock language="bash">
          {`franklin proxy [--port <port>]`}
        </CodeBlock>
        <p>
          Start an OpenAI-compatible API proxy server. Allows any tool that
          supports the OpenAI API format to route through Franklin&apos;s
          Smart Router.
        </p>

        <h3>daemon</h3>
        <CodeBlock language="bash">
          {`franklin daemon start|stop|status`}
        </CodeBlock>
        <p>
          Manage the Franklin background daemon for scheduled tasks and
          persistent sessions.
        </p>

        <h3>migrate</h3>
        <CodeBlock language="bash">
          {`franklin migrate`}
        </CodeBlock>
        <p>
          Import settings, history, and learnings from Claude Code or Cursor.
          Detects your existing configuration automatically.
        </p>

        <h3>init</h3>
        <CodeBlock language="bash">
          {`franklin init`}
        </CodeBlock>
        <p>
          Initialize Franklin in the current project directory. Creates a{" "}
          <code>.franklin/</code> directory with default settings.
        </p>

        <h3>uninit</h3>
        <CodeBlock language="bash">
          {`franklin uninit`}
        </CodeBlock>
        <p>
          Remove Franklin configuration from the current project. Deletes
          the <code>.franklin/</code> directory.
        </p>

        <h3>panel</h3>
        <CodeBlock language="bash">
          {`franklin panel`}
        </CodeBlock>
        <p>
          Open the Franklin web dashboard in your browser. Shows session
          history, spending analytics, and model usage.
        </p>

        <h3>insights</h3>
        <CodeBlock language="bash">
          {`franklin insights`}
        </CodeBlock>
        <p>
          Display spending analytics, model usage breakdown, and cost
          trends from the command line.
        </p>

        <Callout type="tip" title="Quick help">
          Run <code>franklin --help</code> or <code>franklin &lt;command&gt; --help</code>{" "}
          for usage details on any command.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
