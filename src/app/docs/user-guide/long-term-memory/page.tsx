import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/user-guide/long-term-memory" },
  title: "Long Term Memory",
  description: "Entity-based knowledge graph that remembers your world.",
};

const PAGE_PATH = "/docs/user-guide/long-term-memory";

export default function LongTermMemoryPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Long Term Memory"
        description="Entity-based knowledge graph that remembers your world."
      >
        <h2>Franklin Brain</h2>
        <p>
          Franklin Brain is an entity-based knowledge graph that stores
          information about the people, projects, and concepts you work with.
          Unlike session history (which is a flat log), the Brain organizes
          knowledge into structured entities and relationships.
        </p>

        <h2>Entity Types</h2>
        <p>The Brain tracks five types of entities:</p>
        <ul>
          <li>
            <strong>Person</strong> &mdash; people you mention or work with
          </li>
          <li>
            <strong>Project</strong> &mdash; codebases, repos, and initiatives
          </li>
          <li>
            <strong>Company</strong> &mdash; organizations and teams
          </li>
          <li>
            <strong>Product</strong> &mdash; tools, services, and software
          </li>
          <li>
            <strong>Concept</strong> &mdash; technologies, patterns, and ideas
          </li>
        </ul>

        <h2>Observations &amp; Relations</h2>
        <p>
          Each entity has <strong>observations</strong> &mdash; facts with
          confidence scores. For example, an entity for &quot;Alice&quot; might
          have observations like &quot;works at Acme Corp&quot; (confidence:
          0.95) and &quot;prefers Python&quot; (confidence: 0.7).
        </p>
        <p>
          Entities are connected by typed <strong>relations</strong>:
        </p>
        <ul>
          <li>
            <code>founded</code> &mdash; person founded company
          </li>
          <li>
            <code>works_on</code> &mdash; person works on project
          </li>
          <li>
            <code>uses</code> &mdash; project uses concept/product
          </li>
          <li>
            <code>part_of</code> &mdash; project is part of company
          </li>
        </ul>

        <Callout type="info" title="Automatic extraction">
          You don&apos;t need to manually add entities. Franklin extracts them
          automatically after each session by analyzing your conversation for
          named entities, facts, and relationships.
        </Callout>

        <h2>Exploring the Brain</h2>
        <p>
          Use the <code>/brain</code> command to explore what Franklin
          remembers:
        </p>
        <CodeBlock language="bash">
          {`# Open the brain explorer
/brain

# Search for a specific entity
/brain Alice

# Search by project name
/brain franklin`}
        </CodeBlock>

        <h2>Storage</h2>
        <p>
          The Brain is stored as JSONL files in{" "}
          <code>~/.blockrun/brain/</code>. No external database is required.
          Files are human-readable and easy to back up or migrate between
          machines.
        </p>

        <h2>Brain vs. Learnings</h2>
        <p>
          Franklin has two memory systems that serve different purposes:
        </p>
        <ul>
          <li>
            <strong>Brain</strong> &mdash; remembers <em>who and what</em> you
            work with. Entities, facts, relationships. &quot;Alice uses
            Next.js for the dashboard project.&quot;
          </li>
          <li>
            <strong>Learnings</strong> &mdash; remembers <em>how</em> you work.
            Preferences, patterns, style. &quot;User prefers TypeScript strict
            mode and 2-space indentation.&quot;
          </li>
        </ul>

        <Callout type="tip" title="They work together">
          Brain and Learnings combine to give Franklin deep context. The Brain
          provides factual knowledge about your world, while Learnings shape
          how Franklin responds to you.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
