import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/user-guide/slash-commands" },
  title: "Slash Commands",
  description: "Quick shortcuts for every common action.",
};

const PAGE_PATH = "/docs/user-guide/slash-commands";

export default function SlashCommandsPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Slash Commands"
        description="Quick shortcuts for every common action."
      >
        <h2>Overview</h2>
        <p>
          Slash commands are shortcuts you type directly into the Franklin
          prompt. They start with <code>/</code> and trigger built-in actions
          instantly. Type <code>/help</code> to see the full list at any time.
        </p>

        <h2>Session Commands</h2>
        <p>Manage your current conversation and workflow:</p>
        <CodeBlock language="bash">
          {`/plan          # Create a structured plan before executing
/execute       # Execute the current plan step-by-step
/compact       # Compress conversation to save context window
/retry         # Retry the last failed action
/history       # List past sessions
/resume [id]   # Resume a previous session`}
        </CodeBlock>

        <h2>Code Commands</h2>
        <p>Git, testing, and code management shortcuts:</p>
        <CodeBlock language="bash">
          {`/commit        # Stage and commit changes with a generated message
/push          # Push current branch to remote
/pr            # Create a pull request
/review        # Review the current diff
/test          # Run the project's test suite
/fix           # Auto-fix linting and type errors
/search "q"    # Search across the codebase`}
        </CodeBlock>

        <Callout type="tip" title="/commit is smart">
          The <code>/commit</code> command analyzes your staged changes,
          generates a descriptive commit message, and asks for confirmation
          before committing. It follows your project&apos;s commit
          conventions automatically.
        </Callout>

        <h2>Info Commands</h2>
        <p>Check status, costs, and memory:</p>
        <CodeBlock language="bash">
          {`/model [name]  # Show or switch the current model/profile
/wallet        # Show wallet address and balance
/cost          # Per-model spend breakdown for this session
/tokens        # Show token usage for the current conversation
/learnings     # View learned preferences
/brain         # Explore the knowledge graph
/help          # Show all available commands`}
        </CodeBlock>

        <h2>Power Commands</h2>
        <p>Advanced commands for complex reasoning:</p>
        <CodeBlock language="bash">
          {`/ultrathink    # Extended thinking mode — deeper reasoning
/ultraplan     # Comprehensive planning with multi-step breakdown`}
        </CodeBlock>

        <Callout type="info" title="Extended thinking">
          <code>/ultrathink</code> enables extended thinking mode where
          Franklin spends more time reasoning before responding. Useful for
          complex debugging, architecture decisions, and math problems. It
          automatically selects a reasoning-optimized model.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
