import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Social",
  description: "Search and post to X/Twitter with browser automation.",
};

const PAGE_PATH = "/docs/user-guide/social";

export default function SocialPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Social"
        description="Search and post to X/Twitter with browser automation."
      >
        <h2>Overview</h2>
        <p>
          Franklin integrates with X/Twitter through browser automation
          (Playwright) &mdash; no X API key required. You can search for posts,
          draft replies, and post directly from the terminal.
        </p>

        <h2>SearchX</h2>
        <p>
          Find relevant X/Twitter posts by keyword, topic, or user:
        </p>
        <CodeBlock language="plaintext">
          {`You: "Find recent tweets about Base L2"

Franklin: [uses SearchX tool]

Found 12 relevant posts:
1. @jessepollak: "Base just hit 10M transactions..."
2. @0xDesigner: "The Base ecosystem is growing fast..."
...`}
        </CodeBlock>

        <h2>PostToX</h2>
        <p>
          Draft and post replies. Franklin always shows you the draft and
          requires confirmation before posting:
        </p>
        <CodeBlock language="plaintext">
          {`You: "Reply to that first tweet about Base"

Franklin: Here's my draft reply:

  "Incredible milestone! The growth in daily
   active addresses is even more impressive."

Post this reply? [y/n]`}
        </CodeBlock>

        <Callout type="warning" title="Confirmation required">
          Franklin will never post to social media without your explicit
          confirmation. Every post shows a preview and waits for approval.
        </Callout>

        <h2>Batch CLI</h2>
        <p>
          For automated social workflows, use the batch CLI commands:
        </p>
        <CodeBlock language="bash">
          {`# Initial setup — configure browser profile
franklin social setup

# Log in to X (opens browser for auth)
franklin social login

# Configure topics and behavior
franklin social config

# Run a batch engagement cycle
franklin social run

# View engagement statistics
franklin social stats`}
        </CodeBlock>

        <h2>Deduplication</h2>
        <p>
          Franklin tracks which posts it has already engaged with and
          automatically deduplicates. Running <code>franklin social run</code>{" "}
          multiple times will not reply to the same posts twice.
        </p>

        <Callout type="info" title="No X API key">
          Social tools use Playwright browser automation instead of the X API.
          This means no API key application, no rate limit tiers, and no
          developer account required. Just log in with your regular X account.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
