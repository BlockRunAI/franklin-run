import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/user-guide/sessions" },
  title: "Sessions",
  description: "Persistent session history with full-text search.",
};

const PAGE_PATH = "/docs/user-guide/sessions";

export default function SessionsPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Sessions"
        description="Persistent session history with full-text search."
      >
        <h2>How Sessions Work</h2>
        <p>
          Every conversation with Franklin is automatically saved as a session.
          Sessions are stored as JSONL files in{" "}
          <code>~/.blockrun/sessions/</code>, making them easy to back up,
          inspect, or migrate. Each session captures the full message history
          including tool calls and their results.
        </p>

        <h2>Browsing History</h2>
        <p>
          List your recent sessions with the <code>/history</code> command:
        </p>
        <CodeBlock language="bash">
          {`/history`}
        </CodeBlock>
        <p>
          This shows your last 20 sessions with timestamps, a preview of the
          first message, and the session ID.
        </p>

        <h2>Resuming a Session</h2>
        <p>
          Pick up where you left off by resuming a previous session:
        </p>
        <CodeBlock language="bash">
          {`# Resume the most recent session
/resume

# Resume a specific session by ID
/resume abc123`}
        </CodeBlock>
        <p>
          The full conversation context is restored, so Franklin remembers
          everything from the previous session.
        </p>

        <h2>Full-Text Search</h2>
        <p>
          Search across all sessions from the CLI:
        </p>
        <CodeBlock language="bash">
          {`franklin search "database migration"`}
        </CodeBlock>
        <p>
          This searches message content across all saved sessions and returns
          matching results with session IDs you can resume.
        </p>

        <Callout type="tip" title="Search is fast">
          Search works directly on the JSONL files with no external database.
          Even with hundreds of sessions, results return in milliseconds.
        </Callout>

        <h2>Retention &amp; Crash Safety</h2>
        <p>
          Franklin retains the last 20 sessions automatically. Older sessions
          are pruned on startup. Sessions are written incrementally &mdash;
          every message is flushed to disk immediately, so even if Franklin
          crashes mid-conversation, your history up to that point is preserved.
        </p>

        <Callout type="info" title="Storage location">
          All sessions live in <code>~/.blockrun/sessions/</code>. Each file
          is a standalone JSONL document. You can copy them between machines
          or back them up like any other file.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
