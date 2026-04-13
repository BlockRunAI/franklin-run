import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "User Guide",
  description: "Learn how to use Franklin day-to-day.",
};

const PAGE_PATH = "/docs/user-guide";

export default function UserGuidePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="User Guide"
        description="Learn how to use Franklin day-to-day."
      >
        <h2>Overview</h2>
        <p>
          Franklin is designed to be intuitive out of the box but powerful once
          you dig in. This guide covers every major feature &mdash; from the
          smart router that picks the right model for each request, to the
          long-term memory system that remembers your projects across sessions.
        </p>

        <h2>Core Features</h2>
        <ul>
          <li>
            <a href="/docs/user-guide/smart-router">Smart Router</a>
            &nbsp;&mdash; automatic model selection based on task complexity
          </li>
          <li>
            <a href="/docs/user-guide/models">Models</a>
            &nbsp;&mdash; 55+ models from 9 providers, including a free tier
          </li>
          <li>
            <a href="/docs/user-guide/tools">Tools</a>
            &nbsp;&mdash; 16 built-in tools for files, web, agents, and more
          </li>
          <li>
            <a href="/docs/user-guide/sessions">Sessions</a>
            &nbsp;&mdash; persistent history with full-text search
          </li>
        </ul>

        <h2>Intelligence</h2>
        <ul>
          <li>
            <a href="/docs/user-guide/self-evolution">Self-Evolution</a>
            &nbsp;&mdash; learns your preferences automatically over time
          </li>
          <li>
            <a href="/docs/user-guide/long-term-memory">Long Term Memory</a>
            &nbsp;&mdash; entity-based knowledge graph that remembers your world
          </li>
        </ul>

        <h2>Integrations</h2>
        <ul>
          <li>
            <a href="/docs/user-guide/trading">Trading</a>
            &nbsp;&mdash; live crypto signals, market data, and technical analysis
          </li>
          <li>
            <a href="/docs/user-guide/social">Social</a>
            &nbsp;&mdash; search and post to X/Twitter with browser automation
          </li>
        </ul>

        <h2>Power User</h2>
        <ul>
          <li>
            <a href="/docs/user-guide/slash-commands">Slash Commands</a>
            &nbsp;&mdash; quick shortcuts for every common action
          </li>
          <li>
            <a href="/docs/user-guide/proxy-mode">Proxy Mode</a>
            &nbsp;&mdash; use Franklin as a local API server for other tools
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
