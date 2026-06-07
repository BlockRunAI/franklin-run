import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/developer-guide/contributing" },
  title: "Contributing",
  description: "Clone, build, test, and submit pull requests.",
};

const PAGE_PATH = "/docs/developer-guide/contributing";

export default function ContributingPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Contributing"
        description="Clone, build, test, and submit pull requests."
      >
        <h2>Development Setup</h2>
        <p>
          Clone the repository and install dependencies:
        </p>
        <CodeBlock language="bash">
          {`git clone https://github.com/blockrunai/franklin.git
cd franklin
npm install`}
        </CodeBlock>

        <h2>Build</h2>
        <p>
          Compile TypeScript and bundle the CLI:
        </p>
        <CodeBlock language="bash">
          {`npm run build`}
        </CodeBlock>
        <p>
          The compiled output goes to <code>dist/</code>. To test your local
          build globally:
        </p>
        <CodeBlock language="bash">
          {`npm link`}
        </CodeBlock>

        <h2>Test</h2>
        <p>
          Run the full test suite:
        </p>
        <CodeBlock language="bash">
          {`npm test`}
        </CodeBlock>
        <p>
          To run a specific test file:
        </p>
        <CodeBlock language="bash">
          {`npm test -- --grep "Smart Router"`}
        </CodeBlock>

        <h2>Lint and Type Check</h2>
        <CodeBlock language="bash">
          {`# Lint
npm run lint

# Type check
npm run typecheck

# Run all checks (lint + typecheck + build)
npm run check`}
        </CodeBlock>

        <h2>PR Guidelines</h2>
        <ul>
          <li>
            <strong>Open an issue first</strong> for significant changes. This
            lets us discuss the approach before you invest time writing code.
          </li>
          <li>
            <strong>One PR per feature or fix.</strong> Keep changes focused and
            reviewable.
          </li>
          <li>
            <strong>Add tests</strong> for new capabilities and bug fixes.
          </li>
          <li>
            <strong>Follow existing patterns.</strong> Match the code style,
            naming conventions, and file structure of the surrounding code.
          </li>
          <li>
            <strong>Write clear commit messages.</strong> Use conventional
            commits (e.g., <code>feat:</code>, <code>fix:</code>,{" "}
            <code>docs:</code>).
          </li>
        </ul>

        <Callout type="info" title="Before you start">
          For small fixes (typos, doc improvements), go ahead and open a PR
          directly. For anything that changes behavior &mdash; new tools, new
          flags, architecture changes &mdash; open an issue first so we can
          align on the approach.
        </Callout>

        <h2>Project Structure</h2>
        <CodeBlock language="text">
          {`src/
  agent/       Agent loop and orchestration
  tools/       Tool implementations
  router/      Smart Router and model selection
  wallet/      Payment and wallet management
  session/     Session persistence
  brain/       Long-term memory
  learnings/   Self-evolution rules
  cli/         CLI entry point and flag parsing
  plugins/     Plugin loader and SDK
  mcp/         MCP server integration
test/
  unit/        Unit tests
  integration/ Integration tests
  fixtures/    Test data and mocks`}
        </CodeBlock>

        <h2>License</h2>
        <p>
          Franklin is licensed under{" "}
          <strong>Apache-2.0</strong>. By contributing, you agree that your
          contributions will be licensed under the same terms.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
