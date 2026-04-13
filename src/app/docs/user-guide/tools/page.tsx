import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Tools",
  description: "16 built-in tools for files, web, agents, and more.",
};

const PAGE_PATH = "/docs/user-guide/tools";

export default function ToolsPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Tools"
        description="16 built-in tools for files, web, agents, and more."
      >
        <h2>Overview</h2>
        <p>
          Franklin comes with 16 built-in tools organized by category.
          Tools are invoked automatically based on your request &mdash; just
          describe what you want and Franklin picks the right tool.
        </p>

        <h2>File &amp; Shell</h2>
        <p>
          Core tools for reading, writing, and navigating your filesystem:
        </p>
        <ul>
          <li>
            <strong>Read</strong> &mdash; read file contents, supports line
            ranges for large files
          </li>
          <li>
            <strong>Write</strong> &mdash; create or overwrite files
          </li>
          <li>
            <strong>Edit</strong> &mdash; surgical string replacements in
            existing files (sends only the diff)
          </li>
          <li>
            <strong>Bash</strong> &mdash; execute shell commands with timeout
            and background support
          </li>
          <li>
            <strong>Glob</strong> &mdash; fast file pattern matching (e.g.,{" "}
            <code>**/*.ts</code>)
          </li>
          <li>
            <strong>Grep</strong> &mdash; regex search across files with
            context lines
          </li>
        </ul>
        <CodeBlock language="plaintext">
          {`You: "Find all TypeScript files that import React"
Franklin: [uses Grep with pattern "import.*React" and glob "*.ts"]`}
        </CodeBlock>

        <h2>Web</h2>
        <p>Tools for fetching and searching the internet:</p>
        <ul>
          <li>
            <strong>WebFetch</strong> &mdash; fetch a URL and return its
            content (HTML, JSON, plain text)
          </li>
          <li>
            <strong>WebSearch</strong> &mdash; search the web and return
            structured results
          </li>
        </ul>

        <h2>Agent</h2>
        <p>Tools for orchestrating complex, multi-step work:</p>
        <ul>
          <li>
            <strong>Task</strong> &mdash; spawn a background task that runs
            independently
          </li>
          <li>
            <strong>SubAgent</strong> &mdash; delegate work to a child agent
            with its own context
          </li>
          <li>
            <strong>AskUser</strong> &mdash; pause and ask you a clarifying
            question before proceeding
          </li>
        </ul>

        <Callout type="info" title="SubAgent for complex tasks">
          SubAgent is powerful for multi-step work. Franklin can spawn child
          agents that each handle one part of a larger task, then combine
          results.
        </Callout>

        <h2>Creative</h2>
        <ul>
          <li>
            <strong>ImageGen</strong> &mdash; generate images from text
            descriptions using DALL-E or other providers
          </li>
        </ul>

        <h2>Trading</h2>
        <p>
          Real-time crypto market data and technical analysis (see{" "}
          <a href="/docs/user-guide/trading">Trading</a> for details):
        </p>
        <ul>
          <li>
            <strong>TradingSignal</strong> &mdash; live price, RSI, MACD,
            Bollinger Bands, and volatility analysis
          </li>
          <li>
            <strong>TradingMarket</strong> &mdash; price lookup, trending coins,
            and market overview
          </li>
        </ul>

        <h2>Social</h2>
        <p>
          X/Twitter integration (see{" "}
          <a href="/docs/user-guide/social">Social</a> for details):
        </p>
        <ul>
          <li>
            <strong>SearchX</strong> &mdash; find relevant X/Twitter posts by
            keyword or topic
          </li>
          <li>
            <strong>PostToX</strong> &mdash; draft and post replies to X
            (requires your confirmation)
          </li>
        </ul>

        <Callout type="warning" title="Tool permissions">
          Dangerous operations (Bash commands, file writes, posting to social
          media) always require your confirmation before executing. Franklin
          will never run destructive actions without asking first.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
