import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/getting-started/migration" },
  title: "Migration",
  description: "Coming from Claude Code? Migrate your setup in seconds.",
};

const PAGE_PATH = "/docs/getting-started/migration";

export default function MigrationPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Migration"
        description="Coming from Claude Code? Migrate your setup in seconds."
      >
        <h2>One Command</h2>
        <p>
          If you&apos;re coming from Claude Code, a single command imports your
          entire setup:
        </p>
        <CodeBlock language="bash">
          {`franklin migrate`}
        </CodeBlock>
        <p>
          Franklin scans your Claude Code configuration directory and imports
          everything it finds. The process takes a few seconds.
        </p>

        <h2>What Gets Imported</h2>
        <p>
          The migration command brings over all of your existing Claude Code
          configuration:
        </p>
        <ul>
          <li>
            <strong>MCP server configs</strong> &mdash; all your connected MCP
            servers and their settings
          </li>
          <li>
            <strong>Session history</strong> &mdash; past conversations and
            context
          </li>
          <li>
            <strong>Project memories</strong> &mdash; learned preferences and
            project-specific knowledge
          </li>
          <li>
            <strong>CLAUDE.md preferences</strong> &mdash; your custom
            instructions and rules
          </li>
        </ul>

        <Callout type="info" title="Non-destructive">
          Migration copies your configs &mdash; it never modifies or deletes
          your original Claude Code setup. You can continue using both tools
          side by side.
        </Callout>

        <h2>Auto-Detection</h2>
        <p>
          On first run, Franklin automatically detects if you have Claude Code
          installed. If it finds an existing setup, it offers to migrate:
        </p>
        <CodeBlock language="text">
          {`$ franklin
Detected Claude Code installation at ~/.claude/
Import your existing config? [Y/n]`}
        </CodeBlock>
        <p>
          Press <strong>Y</strong> (or just Enter) to migrate immediately, or{" "}
          <strong>n</strong> to skip and start fresh.
        </p>

        <h2>Manual Import</h2>
        <p>
          If you prefer to import specific configs manually, you can copy files
          directly from the Claude Code config directory:
        </p>
        <CodeBlock language="bash">
          {`# Copy MCP server configs
cp ~/.claude/mcp-servers.json ~/.franklin/mcp-servers.json

# Copy project memories
cp ~/.claude/memories.json ~/.franklin/memories.json

# Copy custom instructions
cp ~/.claude/CLAUDE.md ~/.franklin/FRANKLIN.md`}
        </CodeBlock>

        <Callout type="tip" title="Selective migration">
          Manual import is useful when you only want to bring over specific
          parts of your setup, or when you want to review and edit configs
          before Franklin uses them.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
