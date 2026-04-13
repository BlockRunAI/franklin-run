import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Self-Evolution",
  description: "How Franklin learns your preferences over time.",
};

const PAGE_PATH = "/docs/user-guide/self-evolution";

export default function SelfEvolutionPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Self-Evolution"
        description="How Franklin learns your preferences over time."
      >
        <h2>How It Works</h2>
        <p>
          Inspired by{" "}
          <a
            href="https://nousresearch.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            NousResearch
          </a>
          , Franklin&apos;s self-evolution system extracts your preferences
          after each session. Instead of starting fresh every time, Franklin
          builds a profile of how you like to work and applies those learnings
          to future conversations.
        </p>

        <h2>What Franklin Learns</h2>
        <p>
          Learnings are organized into categories:
        </p>
        <ul>
          <li>
            <strong>Language</strong> &mdash; preferred language, tone, and
            communication style
          </li>
          <li>
            <strong>Coding style</strong> &mdash; formatting preferences, naming
            conventions, framework choices
          </li>
          <li>
            <strong>Model preferences</strong> &mdash; which models you prefer
            for which tasks
          </li>
          <li>
            <strong>Workflow patterns</strong> &mdash; how you like to break
            down work, review code, and handle errors
          </li>
        </ul>

        <Callout type="info" title="Fully automatic">
          You don&apos;t need to tell Franklin your preferences explicitly.
          It observes your behavior &mdash; corrections you make, models you
          switch to, patterns in your requests &mdash; and extracts learnings
          automatically.
        </Callout>

        <h2>Confidence Scoring</h2>
        <p>
          Each learning has a confidence score. High-confidence learnings
          (observed repeatedly across multiple sessions) are weighted more
          heavily. Low-confidence learnings are treated as tentative and may be
          overridden by newer observations.
        </p>

        <h2>Decay &amp; Freshness</h2>
        <p>
          Learnings that haven&apos;t been reinforced within 30 days
          gradually decay. This prevents stale preferences from persisting
          indefinitely &mdash; if you change your coding style or switch
          frameworks, Franklin adapts.
        </p>

        <h2>Managing Learnings</h2>
        <p>
          View and manage your learned preferences:
        </p>
        <CodeBlock language="bash">
          {`# View all current learnings
/learnings

# Clear all learnings and start fresh
/learnings clear`}
        </CodeBlock>

        <Callout type="tip" title="Start fresh anytime">
          If Franklin&apos;s learned preferences feel wrong, use{" "}
          <code>/learnings clear</code> to reset. It will rebuild from scratch
          in a few sessions.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
