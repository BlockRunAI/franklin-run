import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Developer Guide",
  description: "Build on Franklin — understand the architecture, extend with plugins, contribute.",
};

const PAGE_PATH = "/docs/developer-guide";

export default function DeveloperGuidePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Developer Guide"
        description="Build on Franklin — understand the architecture, extend with plugins, contribute."
      >
        <p>
          This section covers Franklin&apos;s internals: how the agent loop
          works, how to extend it with plugins and MCP servers, and how to
          contribute to the project.
        </p>

        <h2>What&apos;s Inside</h2>
        <ul>
          <li>
            <a href="/docs/developer-guide/architecture">Architecture</a>
            &nbsp;&mdash; system overview, key modules, token pipeline, and
            error recovery
          </li>
          <li>
            <a href="/docs/developer-guide/plugin-sdk">Plugin SDK</a>
            &nbsp;&mdash; build custom plugins with workflows, channels, and
            capability handlers
          </li>
          <li>
            <a href="/docs/developer-guide/mcp">MCP Integration</a>
            &nbsp;&mdash; connect external tools via Model Context Protocol
            servers
          </li>
          <li>
            <a href="/docs/developer-guide/contributing">Contributing</a>
            &nbsp;&mdash; clone, build, test, and submit pull requests
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
